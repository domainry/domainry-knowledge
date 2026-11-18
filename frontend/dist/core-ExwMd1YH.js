const g = (e) => Number.isFinite(e) ? String(Math.round(e * 1e3) / 1e3) : "0", gn = (e) => e * Math.PI / 180, ke = (e) => ({ d: e, open: !0 }), D = (e, t, r) => (e[t] ?? r) / 1e5, Ct = (e, t, r) => (e[t] ?? r) / 6e4;
function V(e, t = !0) {
  return e.length ? "M " + e.map(([r, n]) => `${g(r)} ${g(n)}`).join(" L ") + (t ? " Z" : "") : "";
}
function we(e, t, r, n, o) {
  return [e + r * Math.cos(gn(o)), t + n * Math.sin(gn(o))];
}
function Re(e, t, r, n, o, s) {
  const l = Math.max(-359.99, Math.min(359.99, s)), [i, a] = we(e, t, r, n, o + l);
  return `A ${g(r)} ${g(n)} 0 ${Math.abs(l) > 180 ? 1 : 0} ${l >= 0 ? 1 : 0} ${g(i)} ${g(a)}`;
}
function lo(e, t, r, n, o, s) {
  const [l, i] = we(e, t, r, n, o);
  return `M ${g(l)} ${g(i)} ${Re(e, t, r, n, o, s)}`;
}
function Ee(e) {
  if (e.length < 2) return "";
  const t = e.slice(0, -1).reverse();
  return "M " + [...e, ...t].map(([r, n]) => `${g(r)} ${g(n)}`).join(" L ");
}
function fl(e, t, r, n) {
  return xe(e, t, r, n) + " " + xe(e, t, r, n, !0);
}
function xe(e, t, r, n, o = !1) {
  const s = o ? -180 : 180;
  return `M ${g(e - r)} ${g(t)} ${Re(e, t, r, n, 180, s)} ${Re(e, t, r, n, 180 + s, s)} Z`;
}
function Kn(e, t) {
  return (r, n) => {
    const o = [];
    for (let s = 0; s < e; s++) o.push(we(r / 2, n / 2, r / 2, n / 2, t + 360 * s / e));
    return V(o);
  };
}
function ct(e, t) {
  return (r, n, o) => {
    const s = o.adj !== void 0 ? o.adj / 1e5 : t, l = Math.min(0.95, Math.max(0.05, s)), i = [];
    for (let a = 0; a < e * 2; a++) {
      const c = a % 2 === 0 ? 1 : l;
      i.push(we(r / 2, n / 2, r / 2 * c, n / 2 * c, -90 + a * 180 / e));
    }
    return V(i);
  };
}
function Hi(e, t, r, n) {
  const o = [[0, 0], [e, 0], [e, t], [0, t]], s = [[1, 0], [0, 1], [-1, 0], [0, -1]], l = [];
  for (let i = 0; i < 4; i++) {
    const [a, c] = o[i], u = Math.max(0, r[i]), f = s[(i + 3) % 4], h = s[i], p = [a - f[0] * u, c - f[1] * u], d = [a + h[0] * u, c + h[1] * u];
    l.push(`${i === 0 ? "M" : "L"} ${g(p[0])} ${g(p[1])}`), u > 0 && l.push(n[i] === "r" ? `A ${g(u)} ${g(u)} 0 0 1 ${g(d[0])} ${g(d[1])}` : `L ${g(d[0])} ${g(d[1])}`);
  }
  return l.join(" ") + " Z";
}
const Et = (e, t, r) => (n, o, s) => {
  const l = t.map((i, a) => i ? Math.min(n, o) * Math.min(D(s, i, r[a]), 0.5) : 0);
  return Hi(n, o, l, e);
}, Wi = { r: ([e, t]) => [e, t], l: ([e, t], r) => [r - e, t], d: ([e, t]) => [t, e], u: ([e, t], r, n) => [t, n - e] };
function Qn(e) {
  return (t, r, n) => {
    const o = e === "r" || e === "l", s = o ? t : r, l = o ? r : t, i = l * Math.min(D(n, "adj1", 5e4), 1) / 2, a = Math.min(s, l * D(n, "adj2", 5e4)), c = l / 2, u = [[0, c - i], [s - a, c - i], [s - a, 0], [s, c], [s - a, l], [s - a, c + i], [0, c + i]];
    return V(u.map((f) => Wi[e](f, t, r)));
  };
}
function er(e) {
  return (t, r, n) => {
    const o = e === "r" || e === "l", s = o ? t : r, l = o ? r : t, i = l * D(n, "adj1", 18515) / 2, a = Math.min(s / 2, l * D(n, "adj2", 18515)), c = Math.max(0, s - Math.max(a, s * (1 - D(n, "adj4", 66667)))), u = l / 2, f = [[0, 0], [c, 0], [c, u - i], [s - a, u - i], [s - a, 0], [s, u], [s - a, l], [s - a, u + i], [c, u + i], [c, l], [0, l]];
    return V(f.map((h) => Wi[e](h, t, r)));
  };
}
function Wo(e, t, r) {
  return [e / 2 + e * D(r, "adj1", -20833), t / 2 + t * D(r, "adj2", 62500)];
}
function hl(e, t, r) {
  const n = Wo(e, t, r), o = n[0] - e / 2, s = n[1] - t / 2, l = e === 0 ? 0 : o * t / e, i = Math.abs(s) - Math.abs(l) > 0, a = e * (o > 0 ? 7 : 2) / 12, c = t * (s > 0 ? 7 : 2) / 12;
  return { x1: a, x2: e * (o > 0 ? 10 : 5) / 12, y1: c, y2: t * (s > 0 ? 10 : 5) / 12, top: i && s <= 0 ? n : [a, 0], right: !i && o > 0 ? n : [e, c], bottom: i && s > 0 ? n : [a, t], left: !i && o <= 0 ? n : [0, c] };
}
function yu(e, t, r, n) {
  const o = [[e * 0.15, t]];
  return n === 1 ? o.push([e * D(r, "adj2", -8333), t + t * D(r, "adj1", 18750)]) : (o.push([e * 0.05, t * 1.2]), o.push([e * D(r, "adj4", -16667), t + t * D(r, "adj3", 44444)]), n >= 3 && o.push([e * D(r, "adj6", -16667) - e * 0.12, t + t * D(r, "adj5", 44444)])), " " + Ee(o);
}
function _e(e, t) {
  return (r, n, o) => V([[0, 0], [r, 0], [r, n], [0, n]]) + (t ? " " + Ee([[0, 0], [0, n]]) : "") + yu(r, n, o, e);
}
function io(e) {
  return (t, r) => {
    const n = Math.min(Math.hypot(t, r) / 20, Math.min(t, r) / 2), o = (s, l, i, a) => {
      const [c, u] = [s + i * n, l], [f, h] = [s, l + a * n];
      if (e === "s") return V([[s, l], [c, u], [c, h], [f, h]]);
      const p = e === "q" ? i * a > 0 ? 1 : 0 : i * a > 0 ? 0 : 1;
      return `M ${g(s)} ${g(l)} L ${g(c)} ${g(u)} A ${g(n)} ${g(n)} 0 0 ${p} ${g(f)} ${g(h)} Z`;
    };
    return [o(0, 0, 1, 1), o(t, 0, -1, 1), o(t, r, -1, -1), o(0, r, 1, -1)].join(" ");
  };
}
function tr(e, t, r, n) {
  const o = t / 4;
  return n ? `C ${g(t - o)} ${g(e + r)} ${g(o)} ${g(e - r)} 0 ${g(e)}` : `C ${g(o)} ${g(e - r)} ${g(o * 3)} ${g(e + r)} ${g(t)} ${g(e)}`;
}
function Vt(e, t, r, n, o, s, l, i, a = !1) {
  const c = i >= l ? 1 : -1, u = Math.max(1, Math.min(s, Math.min(r, n) - o - 1)), f = (r + n) / 2 - o / 2, h = Math.min(Math.abs(i - l) * (a ? 0.35 : 0.6), u / Math.max(f, 1) * (180 / Math.PI)), p = i - c * h, d = a ? l + c * h : l, m = p - d, [$, x] = we(e, t, r, n, d), [b, M] = we(e, t, r + u, n + u, p), [E, y] = we(e, t, r - o / 2, n - o / 2, i), [v, k] = we(e, t, r - o - u, n - o - u, p), [T, S] = we(e, t, r - o, n - o, p);
  let N = "";
  if (a) {
    const [P, L] = we(e, t, r - o - u, n - o - u, d), [A, z] = we(e, t, r - o / 2, n - o / 2, l), [R, O] = we(e, t, r + u, n + u, d);
    N = `L ${g(P)} ${g(L)} L ${g(A)} ${g(z)} L ${g(R)} ${g(O)} `;
  }
  return `M ${g($)} ${g(x)} ${Re(e, t, r, n, d, m)} L ${g(b)} ${g(M)} L ${g(E)} ${g(y)} L ${g(v)} ${g(k)} L ${g(T)} ${g(S)} ${Re(e, t, r - o, n - o, p, -m)} ${N}Z`;
}
function dl(e, t, r) {
  const n = e / 2, o = t / 2, s = Math.min(e, t) / 2, l = s * 0.78, i = 360 / r, a = [];
  for (let c = 0; c < r; c++) {
    const u = c * i;
    a.push(we(n, o, l, l, u - i * 0.28)), a.push(we(n, o, s, s, u - i * 0.16)), a.push(we(n, o, s, s, u + i * 0.16)), a.push(we(n, o, l, l, u + i * 0.28));
  }
  return V(a) + " " + xe(n, o, s * 0.36, s * 0.36, !0);
}
function Vo(e, t, r) {
  return V([[0, 0], [e, 0], [e, t], [0, t]]) + " " + Ee([[r, r], [e - r, r], [e - r, t - r], [r, t - r], [r, r]]);
}
function et(e, t, r) {
  const n = Math.min(e, t) * 0.125;
  return Vo(e, t, n) + " " + r(Math.min(e, t) * 0.24, e / 2, t / 2);
}
const Zt = { rect: (e, t) => V([[0, 0], [e, 0], [e, t], [0, t]]), roundRect: Et(["r", "r", "r", "r"], ["adj", "adj", "adj", "adj"], [16667, 16667, 16667, 16667]), round1Rect: Et(["n", "r", "n", "n"], [null, "adj", null, null], [0, 16667, 0, 0]), round2SameRect: Et(["r", "r", "r", "r"], ["adj1", "adj1", "adj2", "adj2"], [16667, 16667, 0, 0]), round2DiagRect: Et(["r", "r", "r", "r"], ["adj1", "adj2", "adj1", "adj2"], [16667, 0, 16667, 0]), snip1Rect: Et(["n", "s", "n", "n"], [null, "adj", null, null], [0, 16667, 0, 0]), snip2SameRect: Et(["s", "s", "s", "s"], ["adj1", "adj1", "adj2", "adj2"], [16667, 16667, 0, 0]), snip2DiagRect: Et(["s", "s", "s", "s"], ["adj1", "adj2", "adj1", "adj2"], [0, 16667, 0, 16667]), snipRoundRect: Et(["r", "s", "n", "n"], ["adj1", "adj2", null, null], [16667, 16667, 0, 0]), plaque: (e, t, r) => {
  const n = Math.min(e, t) * Math.min(D(r, "adj", 16667), 0.5);
  return `M ${g(n)} 0 L ${g(e - n)} 0 A ${g(n)} ${g(n)} 0 0 0 ${g(e)} ${g(n)} L ${g(e)} ${g(t - n)} A ${g(n)} ${g(n)} 0 0 0 ${g(e - n)} ${g(t)} L ${g(n)} ${g(t)} A ${g(n)} ${g(n)} 0 0 0 0 ${g(t - n)} L 0 ${g(n)} A ${g(n)} ${g(n)} 0 0 0 ${g(n)} 0 Z`;
}, bevel: (e, t, r) => Vo(e, t, Math.min(e, t) * Math.min(D(r, "adj", 12500), 0.5)), cornerTabs: io("q"), squareTabs: io("s"), plaqueTabs: io("c"), frame: (e, t, r) => {
  const n = Math.min(e, t) * Math.min(D(r, "adj1", 12500), 0.5);
  return V([[0, 0], [e, 0], [e, t], [0, t]]) + " " + V([[n, n], [n, t - n], [e - n, t - n], [e - n, n]]);
}, halfFrame: (e, t, r) => {
  const n = Math.min(e, t) * D(r, "adj1", 33333), o = Math.min(e, t) * D(r, "adj2", 33333);
  return V([[0, 0], [e, 0], [e - o, n], [o, n], [o, t - n], [0, t]]);
}, corner: (e, t, r) => {
  const n = Math.min(e, t) * D(r, "adj1", 5e4), o = Math.min(e, t) * D(r, "adj2", 5e4);
  return V([[0, 0], [o, 0], [o, t - n], [e, t - n], [e, t], [0, t]]);
}, diagStripe: (e, t, r) => {
  const n = Math.min(D(r, "adj", 5e4), 1);
  return V([[0, t * (1 - n)], [e * (1 - n), 0], [e, 0], [0, t]]);
}, foldedCorner: (e, t, r) => {
  const n = Math.min(e, t) * D(r, "adj", 16667);
  return V([[0, 0], [e, 0], [e, t - n], [e - n, t], [0, t]]) + ` M ${g(e - n)} ${g(t)} L ${g(e - n * 0.72)} ${g(t - n * 0.72)} L ${g(e)} ${g(t - n)} Z`;
}, ellipse: (e, t) => xe(e / 2, t / 2, e / 2, t / 2), triangle: (e, t, r) => V([[e * D(r, "adj", 5e4), 0], [e, t], [0, t]]), rtTriangle: (e, t) => V([[0, 0], [e, t], [0, t]]), diamond: (e, t) => V([[e / 2, 0], [e, t / 2], [e / 2, t], [0, t / 2]]), parallelogram: (e, t, r) => {
  const n = Math.min(e, Math.min(e, t) * D(r, "adj", 25e3));
  return V([[n, 0], [e, 0], [e - n, t], [0, t]]);
}, trapezoid: (e, t, r) => {
  const n = Math.min(e / 2, Math.min(e, t) * D(r, "adj", 25e3));
  return V([[n, 0], [e - n, 0], [e, t], [0, t]]);
}, nonIsoscelesTrapezoid: (e, t, r) => V([[e * D(r, "adj1", 25e3), 0], [e - e * D(r, "adj2", 25e3), 0], [e, t], [0, t]]), pentagon: Kn(5, -90), heptagon: Kn(7, -90), decagon: Kn(10, -90), dodecagon: Kn(12, -90), hexagon: (e, t, r) => {
  const n = Math.min(e / 2, Math.min(e, t) * D(r, "adj", 25e3));
  return V([[n, 0], [e - n, 0], [e, t / 2], [e - n, t], [n, t], [0, t / 2]]);
}, octagon: (e, t, r) => {
  const n = Math.min(Math.min(e, t) / 2, Math.min(e, t) * D(r, "adj", 29289));
  return V([[n, 0], [e - n, 0], [e, n], [e, t - n], [e - n, t], [n, t], [0, t - n], [0, n]]);
}, homePlate: (e, t, r) => {
  const n = Math.min(e, Math.min(e, t) * D(r, "adj", 5e4));
  return V([[0, 0], [e - n, 0], [e, t / 2], [e - n, t], [0, t]]);
}, chevron: (e, t, r) => {
  const n = Math.min(e, Math.min(e, t) * D(r, "adj", 5e4));
  return V([[0, 0], [e - n, 0], [e, t / 2], [e - n, t], [0, t], [n, t / 2]]);
}, plus: (e, t, r) => {
  const n = Math.min(e, t) * Math.min(D(r, "adj", 25e3), 0.5);
  return V([[n, 0], [e - n, 0], [e - n, n], [e, n], [e, t - n], [e - n, t - n], [e - n, t], [n, t], [n, t - n], [0, t - n], [0, n], [n, n]]);
}, teardrop: (e, t, r) => {
  const n = Math.max(0, D(r, "adj", 1e5)), o = Math.SQRT1_2 + n * (1 - Math.SQRT1_2), s = e / 2, l = t / 2;
  return `M 0 ${g(l)} ${Re(s, l, e / 2, t / 2, 180, 90)} L ${g(s + e / 2 * o)} ${g(l - t / 2 * o)} L ${g(e)} ${g(l)} ${Re(s, l, e / 2, t / 2, 0, 180)} Z`;
}, can: (e, t, r) => {
  const n = Math.min(t / 2, t * D(r, "adj", 25e3) / 2);
  return `M 0 ${g(n)} ${Re(e / 2, n, e / 2, n, 180, 180)} L ${g(e)} ${g(t - n)} ${Re(e / 2, t - n, e / 2, n, 0, 180)} Z ` + fl(e / 2, n, e / 2, n);
}, cube: (e, t, r) => {
  const n = Math.min(e, t) * Math.min(D(r, "adj", 25e3), 0.5);
  return V([[0, n], [n, 0], [e, 0], [e, t - n], [e - n, t], [0, t]]) + " " + Ee([[0, n], [e - n, n], [e, 0]]) + " " + Ee([[e - n, n], [e - n, t]]);
}, donut: (e, t, r) => {
  const n = Math.min(e, t) * Math.min(D(r, "adj", 25e3), 0.5);
  return xe(e / 2, t / 2, e / 2, t / 2) + " " + xe(e / 2, t / 2, e / 2 - n, t / 2 - n, !0);
}, noSmoking: (e, t, r) => {
  const n = Math.min(e, t) * Math.min(D(r, "adj", 18750), 0.5), o = e / 2 - n, s = t / 2 - n, l = e / 2, i = t / 2, a = n / 2, c = Math.cos(gn(-45)), u = Math.sin(gn(-45)), f = -u, h = c, [p, d] = [l - c * o, i - u * s], [m, $] = [l + c * o, i + u * s], x = V([[p + f * a, d + h * a], [m + f * a, $ + h * a], [m - f * a, $ - h * a], [p - f * a, d - h * a]]);
  return xe(l, i, e / 2, t / 2) + " " + xe(l, i, o, s, !0) + " " + x;
}, pie: (e, t, r) => {
  const n = Ct(r, "adj1", 0), o = ((Ct(r, "adj2", 270 * 6e4) - n) % 360 + 360) % 360, [s, l] = we(e / 2, t / 2, e / 2, t / 2, n);
  return `M ${g(e / 2)} ${g(t / 2)} L ${g(s)} ${g(l)} ${Re(e / 2, t / 2, e / 2, t / 2, n, o)} Z`;
}, pieWedge: (e, t) => `M 0 ${g(t)} ${Re(e, t, e, t, 180, 90)} L ${g(e)} ${g(t)} Z`, chord: (e, t, r) => {
  const n = Ct(r, "adj1", 27e5), o = ((Ct(r, "adj2", 270 * 6e4) - n) % 360 + 360) % 360;
  return lo(e / 2, t / 2, e / 2, t / 2, n, o) + " Z";
}, arc: (e, t, r) => {
  const n = Ct(r, "adj1", 162e5), o = ((Ct(r, "adj2", 0) - n) % 360 + 360) % 360;
  return ke(lo(e / 2, t / 2, e / 2, t / 2, n, o));
}, blockArc: (e, t, r) => {
  const n = Ct(r, "adj1", 108e5), o = ((Ct(r, "adj2", 0) - n) % 360 + 360) % 360, s = Math.min(e, t) * Math.min(D(r, "adj3", 25e3), 0.5), [l, i] = we(e / 2, t / 2, e / 2 - s, t / 2 - s, n + o);
  return lo(e / 2, t / 2, e / 2, t / 2, n, o) + ` L ${g(l)} ${g(i)} ${Re(e / 2, t / 2, e / 2 - s, t / 2 - s, n + o, -o)} Z`;
}, cloud: (e, t) => {
  const r = (s) => s * e, n = (s) => s * t, o = (s, l, i, a, c, u) => `C ${g(r(s))} ${g(n(l))} ${g(r(i))} ${g(n(a))} ${g(r(c))} ${g(n(u))} `;
  return `M ${g(r(0.2))} ${g(n(0.79))} ` + o(0.06, 0.79, 0, 0.66, 0.07, 0.55) + o(0, 0.43, 0.1, 0.31, 0.22, 0.34) + o(0.25, 0.16, 0.44, 0.09, 0.56, 0.19) + o(0.65, 0.05, 0.86, 0.09, 0.88, 0.26) + o(1, 0.3, 1.01, 0.48, 0.92, 0.56) + o(1, 0.69, 0.9, 0.83, 0.76, 0.79) + o(0.68, 0.91, 0.5, 0.93, 0.42, 0.84) + o(0.36, 0.91, 0.25, 0.89, 0.2, 0.79) + "Z";
}, heart: (e, t) => {
  const r = (o) => o * e, n = (o) => o * t;
  return `M ${g(r(0.5))} ${g(n(1))} C ${g(r(-0.06))} ${g(n(0.53))} ${g(r(0.08))} ${g(n(-0.11))} ${g(r(0.5))} ${g(n(0.25))} C ${g(r(0.92))} ${g(n(-0.11))} ${g(r(1.06))} ${g(n(0.53))} ${g(r(0.5))} ${g(n(1))} Z`;
}, lightningBolt: (e, t) => V([[0.55, 0], [1, 0.55], [0.68, 0.55], [0.8, 1], [0, 0.42], [0.42, 0.42]].map(([r, n]) => [r * e, n * t])), sun: (e, t, r) => {
  const n = Math.min(D(r, "adj", 25e3), 0.45), o = e / 2, s = t / 2, l = o * (1 - n * 1.4), i = s * (1 - n * 1.4), a = [];
  for (let c = 0; c < 8; c++) {
    const u = c * 45, [f, h] = we(o, s, l, i, u - 9), [p, d] = we(o, s, o, s, u), [m, $] = we(o, s, l, i, u + 9);
    a.push(`M ${g(f)} ${g(h)} L ${g(p)} ${g(d)} L ${g(m)} ${g($)} Z`);
  }
  return xe(o, s, l, i) + " " + a.join(" ");
}, moon: (e, t, r) => {
  const n = D(r, "adj", 5e4);
  return `M ${g(e)} 0 C ${g(e * (1 - n * 1.6))} ${g(t * 0.15)} ${g(e * (1 - n * 1.6))} ${g(t * 0.85)} ${g(e)} ${g(t)} C ${g(e * 0.1)} ${g(t * 0.92)} ${g(e * 0.1)} ${g(t * 0.08)} ${g(e)} 0 Z`;
}, smileyFace: (e, t, r) => {
  const n = t * D(r, "adj", 4653) * 2;
  return xe(e / 2, t / 2, e / 2, t / 2) + " " + xe(e * 0.32, t * 0.35, e * 0.055, t * 0.08, !0) + " " + xe(e * 0.68, t * 0.35, e * 0.055, t * 0.08, !0) + ` M ${g(e * 0.26)} ${g(t * 0.63)} Q ${g(e * 0.5)} ${g(t * 0.85 + n)} ${g(e * 0.74)} ${g(t * 0.63)} Q ${g(e * 0.5)} ${g(t * 0.85 + n)} ${g(e * 0.26)} ${g(t * 0.63)}`;
}, irregularSeal1: (e, t) => V([[0.09, 0.28], [0.24, 0.35], [0.13, 0.09], [0.35, 0.26], [0.42, 0], [0.53, 0.24], [0.72, 0.06], [0.7, 0.31], [0.93, 0.24], [0.81, 0.45], [1, 0.53], [0.83, 0.64], [0.96, 0.83], [0.73, 0.79], [0.75, 1], [0.56, 0.86], [0.45, 1], [0.38, 0.83], [0.19, 0.94], [0.23, 0.72], [0, 0.75], [0.16, 0.58], [0, 0.45]].map(([r, n]) => [r * e, n * t])), irregularSeal2: (e, t) => V([[0.11, 0.32], [0.25, 0.28], [0.15, 0.11], [0.36, 0.2], [0.4, 0.02], [0.55, 0.17], [0.68, 0], [0.71, 0.2], [0.9, 0.14], [0.85, 0.36], [1, 0.42], [0.86, 0.55], [0.98, 0.72], [0.79, 0.72], [0.82, 0.93], [0.63, 0.82], [0.55, 1], [0.44, 0.85], [0.28, 0.96], [0.28, 0.76], [0.06, 0.8], [0.17, 0.62], [0, 0.5]].map(([r, n]) => [r * e, n * t])), gear6: (e, t) => dl(e, t, 6), gear9: (e, t) => dl(e, t, 9), funnel: (e, t) => {
  const r = t * 0.1;
  return `M 0 ${g(r)} ${Re(e / 2, r, e / 2, r, 180, 180)} L ${g(e * 0.56)} ${g(t * 0.72)} L ${g(e * 0.56)} ${g(t)} L ${g(e * 0.44)} ${g(t)} L ${g(e * 0.44)} ${g(t * 0.72)} Z`;
}, star4: ct(4, 0.3), star5: ct(5, 0.382), star6: ct(6, 0.577), star7: ct(7, 0.605), star8: ct(8, 0.375), star10: ct(10, 0.618), star12: ct(12, 0.5), star16: ct(16, 0.375), star24: ct(24, 0.375), star32: ct(32, 0.375), rightArrow: Qn("r"), leftArrow: Qn("l"), upArrow: Qn("u"), downArrow: Qn("d"), leftRightArrow: (e, t, r) => {
  const n = t * Math.min(D(r, "adj1", 5e4), 1) / 2, o = Math.min(e / 2, t * D(r, "adj2", 5e4)), s = t / 2;
  return V([[0, s], [o, 0], [o, s - n], [e - o, s - n], [e - o, 0], [e, s], [e - o, t], [e - o, s + n], [o, s + n], [o, t]]);
}, upDownArrow: (e, t, r) => {
  const n = e * Math.min(D(r, "adj1", 5e4), 1) / 2, o = Math.min(t / 2, e * D(r, "adj2", 5e4)), s = e / 2;
  return V([[s, 0], [e, o], [s + n, o], [s + n, t - o], [e, t - o], [s, t], [0, t - o], [s - n, t - o], [s - n, o], [0, o]]);
}, quadArrow: (e, t, r) => {
  const n = Math.min(e, t) * D(r, "adj2", 22500) / 2, o = Math.min(e, t) * D(r, "adj3", 25e3), s = e / 2, l = t / 2;
  return V([[s, 0], [s + o, o], [s + n, o], [s + n, l - n], [e - o, l - n], [e - o, l - o], [e, l], [e - o, l + o], [e - o, l + n], [s + n, l + n], [s + n, t - o], [s + o, t - o], [s, t], [s - o, t - o], [s - n, t - o], [s - n, l + n], [o, l + n], [o, l + o], [0, l], [o, l - o], [o, l - n], [s - n, l - n], [s - n, o], [s - o, o]]);
}, leftRightUpArrow: (e, t, r) => {
  const n = Math.min(e, t) * D(r, "adj2", 22500) / 2, o = Math.min(e, t) * D(r, "adj3", 25e3), s = e / 2, l = t - n;
  return V([[s, 0], [s + o, o], [s + n, o], [s + n, l - n], [e - o, l - n], [e - o, l - o], [e, l], [e - o, l + o], [e - o, t], [o, t], [o, l + o], [0, l], [o, l - o], [o, l - n], [s - n, l - n], [s - n, o], [s - o, o]]);
}, bentUpArrow: (e, t, r) => {
  const n = Math.min(e, t) * Math.min(D(r, "adj3", 25e3), 0.6), o = Math.min(e / 2, Math.max(Math.min(e, t) * D(r, "adj1", 25e3), n * 0.6)), s = Math.min(t, Math.min(e, t) * D(r, "adj2", 25e3)), l = e - o;
  return V([[0, t], [l + n / 2, t], [l + n / 2, s], [e, s], [l, 0], [l - o, s], [l - n / 2, s], [l - n / 2, t - n], [0, t - n]]);
}, leftUpArrow: (e, t, r) => {
  const n = Math.min(e, t), o = n * Math.min(D(r, "adj1", 25e3), 0.6), s = Math.min(n / 2, Math.max(n * D(r, "adj2", 25e3), o * 0.6)), l = Math.min(n, n * D(r, "adj3", 25e3));
  return V([[e - s, 0], [e, l], [e - s + o / 2, l], [e - s + o / 2, t], [l, t], [0, t - s], [l, t - 2 * s], [l, t - s - o / 2], [e - s - o / 2, t - s - o / 2], [e - s - o / 2, l], [e - 2 * s, l]]);
}, bentArrow: (e, t, r) => {
  const n = Math.min(e, t) * D(r, "adj1", 25e3), o = Math.min(Math.min(e, t) * D(r, "adj2", 25e3), t / 2), s = o;
  return V([[0, t], [0, s - n / 2], [e - o, s - n / 2], [e - o, s - o], [e, s], [e - o, s + o], [e - o, s + n / 2], [n, s + n / 2], [n, t]]);
}, uturnArrow: (e, t, r) => {
  const n = Math.min(e / 3, e * Math.max(D(r, "adj1", 25e3), 0.08)), o = n / 2, s = Math.min(n * 1.1, e / 4), l = Math.min(t / 3, s * 1.6), i = e - s, a = (i + o) / 2, c = Math.min(a, t - l - 4);
  return `M 0 ${g(t)} L 0 ${g(c)} A ${g(a)} ${g(c)} 0 0 1 ${g(a * 2)} ${g(c)} L ${g(i + o)} ${g(t - l)} L ${g(i + s)} ${g(t - l)} L ${g(i)} ${g(t)} L ${g(i - s)} ${g(t - l)} L ${g(i - o)} ${g(t - l)} L ${g(i - o)} ${g(c)} A ${g(a - n)} ${g(c - n)} 0 0 0 ${g(n)} ${g(c)} L ${g(n)} ${g(t)} Z`;
}, curvedRightArrow: (e, t, r) => {
  const n = t * Math.min(D(r, "adj1", 25e3), 0.5), o = Math.min(e, t) * Math.min(D(r, "adj3", 25e3), 0.4);
  return Vt(0, t, e - o, t - o, n, o, 270, 360);
}, curvedLeftArrow: (e, t, r) => {
  const n = t * Math.min(D(r, "adj1", 25e3), 0.5), o = Math.min(e, t) * Math.min(D(r, "adj3", 25e3), 0.4);
  return Vt(e, t, e - o, t - o, n, o, 270, 180);
}, curvedUpArrow: (e, t, r) => {
  const n = e * Math.min(D(r, "adj1", 25e3), 0.5), o = Math.min(e, t) * Math.min(D(r, "adj3", 25e3), 0.4);
  return Vt(e, t, e - o, t - o, n, o, 180, 270);
}, curvedDownArrow: (e, t, r) => {
  const n = e * Math.min(D(r, "adj1", 25e3), 0.5), o = Math.min(e, t) * Math.min(D(r, "adj3", 25e3), 0.4);
  return Vt(e, 0, e - o, t - o, n, o, 180, 90);
}, stripedRightArrow: (e, t, r) => {
  const n = t * Math.min(D(r, "adj1", 5e4), 1) / 2, o = Math.min(e, t * D(r, "adj2", 5e4)), s = t / 2, l = e * 0.05;
  return V([[l * 2.4, s - n], [e - o, s - n], [e - o, 0], [e, s], [e - o, t], [e - o, s + n], [l * 2.4, s + n]]) + " " + V([[0, s - n], [l, s - n], [l, s + n], [0, s + n]]) + " " + V([[l * 1.4, s - n], [l * 2, s - n], [l * 2, s + n], [l * 1.4, s + n]]);
}, notchedRightArrow: (e, t, r) => {
  const n = t * Math.min(D(r, "adj1", 5e4), 1) / 2, o = Math.min(e, t * D(r, "adj2", 5e4)), s = t / 2;
  return V([[0, s - n], [e - o, s - n], [e - o, 0], [e, s], [e - o, t], [e - o, s + n], [0, s + n], [o * 0.5, s]]);
}, circularArrow: (e, t, r) => {
  const n = Math.min(e, t) / 2, o = n * Math.min(Math.max(D(r, "adj1", 12500), 0.06), 0.35), s = o * 1.6, l = n - s;
  return Vt(e / 2, t / 2, l, l, o, s, 200, 450);
}, leftCircularArrow: (e, t, r) => {
  const n = Math.min(e, t) / 2, o = n * Math.min(Math.max(D(r, "adj1", 12500), 0.06), 0.35), s = o * 1.6;
  return Vt(e / 2, t / 2, n - s, n - s, o, s, -20, -270);
}, leftRightCircularArrow: (e, t, r) => {
  const n = Math.min(e, t) / 2, o = n * Math.min(Math.max(D(r, "adj1", 12500), 0.06), 0.35), s = o * 1.6;
  return Vt(e / 2, t / 2, n - s, n - s, o, s, 200, 430, !0);
}, swooshArrow: (e, t, r) => {
  const n = Math.min(e, t), o = n * Math.min(Math.max(D(r, "adj2", 16667), 0.04), 0.4), s = n * Math.min(Math.max(D(r, "adj1", 25e3), 0.08), 0.6), l = o * 1.6;
  return `M 0 ${g(t)} Q ${g(e * 0.65)} ${g(t * 0.95)} ${g(e - s * 1.2)} ${g(s * 0.1)} L ${g(e)} 0 L ${g(e - s * 0.1)} ${g(s * 1.2)} Q ${g(e * 0.65 - l)} ${g(t * 0.95 - l)} 0 ${g(t)} Z`;
}, rightArrowCallout: er("r"), leftArrowCallout: er("l"), upArrowCallout: er("u"), downArrowCallout: er("d"), leftRightArrowCallout: (e, t, r) => {
  const n = t * D(r, "adj1", 18515) / 2, o = Math.min(e / 3, t * D(r, "adj2", 18515)), s = e * D(r, "adj4", 48123), l = t / 2, i = (e - s) / 2, a = (e + s) / 2;
  return V([[0, l], [o, 0], [o, l - n], [i, l - n], [i, 0], [a, 0], [a, l - n], [e - o, l - n], [e - o, 0], [e, l], [e - o, t], [e - o, l + n], [a, l + n], [a, t], [i, t], [i, l + n], [o, l + n], [o, t]]);
}, upDownArrowCallout: (e, t, r) => {
  const n = e * D(r, "adj1", 18515) / 2, o = Math.min(e / 2, n + e * D(r, "adj2", 18515)), s = Math.min(t * 0.3, e * D(r, "adj3", 18515)), l = Math.max(0, Math.min(t * D(r, "adj4", 48123), t - 2.4 * s)), i = e / 2, a = (t - l) / 2, c = (t + l) / 2;
  return V([[i, 0], [i + o, s], [i + n, s], [i + n, a], [e, a], [e, c], [i + n, c], [i + n, t - s], [i + o, t - s], [i, t], [i - o, t - s], [i - n, t - s], [i - n, c], [0, c], [0, a], [i - n, a], [i - n, s], [i - o, s]]);
}, quadArrowCallout: (e, t, r) => {
  const n = Math.min(e, t), o = n * D(r, "adj3", 18515), s = n * D(r, "adj2", 18515) / 2, l = Math.min(Math.max(n * D(r, "adj4", 48123) / 2, s * 1.2), n / 2 - o), i = e / 2, a = t / 2;
  return V([[i, 0], [i + o, o], [i + s, o], [i + s, a - l], [i + l, a - l], [i + l, a - s], [e - o, a - s], [e - o, a - o], [e, a], [e - o, a + o], [e - o, a + s], [i + l, a + s], [i + l, a + l], [i + s, a + l], [i + s, t - o], [i + o, t - o], [i, t], [i - o, t - o], [i - s, t - o], [i - s, a + l], [i - l, a + l], [i - l, a + s], [o, a + s], [o, a + o], [0, a], [o, a - o], [o, a - s], [i - l, a - s], [i - l, a - l], [i - s, a - l], [i - s, o], [i - o, o]]);
}, mathPlus: (e, t, r) => {
  const n = Math.min(e, t) * D(r, "adj1", 23520) / 2, o = e / 2, s = t / 2, l = e * 0.45, i = t * 0.45;
  return V([[o - n, s - i], [o + n, s - i], [o + n, s - n], [o + l, s - n], [o + l, s + n], [o + n, s + n], [o + n, s + i], [o - n, s + i], [o - n, s + n], [o - l, s + n], [o - l, s - n], [o - n, s - n]]);
}, mathMinus: (e, t, r) => {
  const n = Math.min(e, t) * D(r, "adj1", 23520) / 2;
  return V([[e * 0.05, t / 2 - n], [e * 0.95, t / 2 - n], [e * 0.95, t / 2 + n], [e * 0.05, t / 2 + n]]);
}, mathMultiply: (e, t, r) => {
  const n = Math.min(e, t) * D(r, "adj1", 23520) / 2, o = e / 2, s = t / 2, l = Math.min(e, t) * 0.42, i = n * Math.SQRT2;
  return V([[o - l, s - l + i], [o - l + i, s - l], [o, s - i], [o + l - i, s - l], [o + l, s - l + i], [o + i, s], [o + l, s + l - i], [o + l - i, s + l], [o, s + i], [o - l + i, s + l], [o - l, s + l - i], [o - i, s]]);
}, mathDivide: (e, t, r) => {
  const n = Math.min(e, t) * D(r, "adj1", 23520) / 2, o = Math.min(e, t) * 0.09;
  return V([[e * 0.08, t / 2 - n], [e * 0.92, t / 2 - n], [e * 0.92, t / 2 + n], [e * 0.08, t / 2 + n]]) + " " + xe(e / 2, t * 0.22, o, o) + " " + xe(e / 2, t * 0.78, o, o);
}, mathEqual: (e, t, r) => {
  const n = Math.min(e, t) * D(r, "adj1", 23520) / 2, o = t * D(r, "adj2", 11760);
  return V([[e * 0.05, t / 2 - o - n], [e * 0.95, t / 2 - o - n], [e * 0.95, t / 2 - o + n], [e * 0.05, t / 2 - o + n]]) + " " + V([[e * 0.05, t / 2 + o - n], [e * 0.95, t / 2 + o - n], [e * 0.95, t / 2 + o + n], [e * 0.05, t / 2 + o + n]]);
}, mathNotEqual: (e, t, r) => {
  const n = Math.min(e, t) * D(r, "adj1", 23520) / 2, o = t * 0.16;
  return V([[e * 0.05, t / 2 - o - n], [e * 0.95, t / 2 - o - n], [e * 0.95, t / 2 - o + n], [e * 0.05, t / 2 - o + n]]) + " " + V([[e * 0.05, t / 2 + o - n], [e * 0.95, t / 2 + o - n], [e * 0.95, t / 2 + o + n], [e * 0.05, t / 2 + o + n]]) + " " + V([[e * 0.42, 0], [e * 0.56, 0], [e * 0.62, t], [e * 0.48, t]]);
}, leftBracket: (e, t, r) => {
  const n = Math.min(t / 2, t * D(r, "adj", 8333));
  return ke(`M ${g(e)} 0 L ${g(n)} 0 A ${g(n)} ${g(n)} 0 0 0 0 ${g(n)} L 0 ${g(t - n)} A ${g(n)} ${g(n)} 0 0 0 ${g(n)} ${g(t)} L ${g(e)} ${g(t)}`);
}, rightBracket: (e, t, r) => {
  const n = Math.min(t / 2, t * D(r, "adj", 8333));
  return ke(`M 0 0 L ${g(e - n)} 0 A ${g(n)} ${g(n)} 0 0 1 ${g(e)} ${g(n)} L ${g(e)} ${g(t - n)} A ${g(n)} ${g(n)} 0 0 1 ${g(e - n)} ${g(t)} L 0 ${g(t)}`);
}, bracketPair: (e, t, r) => {
  const n = Math.min(Math.min(e, t) / 2, Math.min(e, t) * D(r, "adj", 16667));
  return ke(`M ${g(n)} 0 A ${g(n)} ${g(n)} 0 0 0 0 ${g(n)} L 0 ${g(t - n)} A ${g(n)} ${g(n)} 0 0 0 ${g(n)} ${g(t)} M ${g(e - n)} 0 A ${g(n)} ${g(n)} 0 0 1 ${g(e)} ${g(n)} L ${g(e)} ${g(t - n)} A ${g(n)} ${g(n)} 0 0 1 ${g(e - n)} ${g(t)}`);
}, leftBrace: (e, t, r) => {
  const n = Math.min(t / 4, t * D(r, "adj1", 8333)), o = t * D(r, "adj2", 5e4);
  return ke(`M ${g(e)} 0 A ${g(e)} ${g(n)} 0 0 0 ${g(e / 2)} ${g(n)} L ${g(e / 2)} ${g(o - n)} A ${g(e / 2)} ${g(n)} 0 0 1 0 ${g(o)} A ${g(e / 2)} ${g(n)} 0 0 1 ${g(e / 2)} ${g(o + n)} L ${g(e / 2)} ${g(t - n)} A ${g(e)} ${g(n)} 0 0 0 ${g(e)} ${g(t)}`);
}, rightBrace: (e, t, r) => {
  const n = Math.min(t / 4, t * D(r, "adj1", 8333)), o = t * D(r, "adj2", 5e4);
  return ke(`M 0 0 A ${g(e)} ${g(n)} 0 0 1 ${g(e / 2)} ${g(n)} L ${g(e / 2)} ${g(o - n)} A ${g(e / 2)} ${g(n)} 0 0 0 ${g(e)} ${g(o)} A ${g(e / 2)} ${g(n)} 0 0 0 ${g(e / 2)} ${g(o + n)} L ${g(e / 2)} ${g(t - n)} A ${g(e)} ${g(n)} 0 0 1 0 ${g(t)}`);
}, bracePair: (e, t, r) => {
  const n = Math.min(t / 4, t * D(r, "adj", 8333)), o = e / 4;
  return ke(`M ${g(o)} 0 A ${g(o)} ${g(n)} 0 0 0 ${g(o)} ${g(n)} L ${g(o)} ${g(t / 2 - n)} A ${g(o)} ${g(n)} 0 0 1 0 ${g(t / 2)} A ${g(o)} ${g(n)} 0 0 1 ${g(o)} ${g(t / 2 + n)} L ${g(o)} ${g(t - n)} A ${g(o)} ${g(n)} 0 0 0 ${g(o)} ${g(t)} M ${g(e - o)} 0 A ${g(o)} ${g(n)} 0 0 1 ${g(e - o)} ${g(n)} L ${g(e - o)} ${g(t / 2 - n)} A ${g(o)} ${g(n)} 0 0 0 ${g(e)} ${g(t / 2)} A ${g(o)} ${g(n)} 0 0 0 ${g(e - o)} ${g(t / 2 + n)} L ${g(e - o)} ${g(t - n)} A ${g(o)} ${g(n)} 0 0 1 ${g(e - o)} ${g(t)}`);
}, ribbon: (e, t, r) => {
  const n = t * D(r, "adj1", 16667), o = e * D(r, "adj2", 5e4) / 2, s = e / 2, l = [[0, 0], [s - o, 0], [s - o + n, t * 0.5], [s - o, t], [0, t], [n, t * 0.5]], i = [[e, 0], [s + o, 0], [s + o - n, t * 0.5], [s + o, t], [e, t], [e - n, t * 0.5]], a = [[s - o, 0], [s + o, 0], [s + o, t], [s - o, t]];
  return V(l) + " " + V(i) + " " + V(a);
}, ribbon2: (e, t, r) => {
  const n = t * D(r, "adj1", 16667), o = e * D(r, "adj2", 5e4) / 2, s = e / 2, l = [[s - o, t], [s + o, t], [s + o, 0], [s - o, 0]], i = [[0, t], [s - o, t], [s - o + n, t * 0.5], [s - o, 0], [0, 0], [n, t * 0.5]], a = [[e, t], [s + o, t], [s + o - n, t * 0.5], [s + o, 0], [e, 0], [e - n, t * 0.5]];
  return V(l) + " " + V(i) + " " + V(a);
}, ellipseRibbon: (e, t, r) => {
  const n = t * Math.min(D(r, "adj3", 12500) * 2, 0.5), o = t * Math.min(D(r, "adj1", 25e3), 0.35), s = e * Math.min(D(r, "adj2", 5e4) / 2, 0.3), l = t * 0.12, i = `M 0 ${g(o)} Q ${g(e / 2)} ${g(-o)} ${g(e)} ${g(o)} L ${g(e)} ${g(o + n)} Q ${g(e / 2)} ${g(n - o)} 0 ${g(o + n)} Z`, a = (c) => V([[c, o + n * 0.2], [c + s, o + n * 0.2], [c + s, t], [c + s / 2, t - l], [c, t]]);
  return `${i} ${a(0)} ${a(e - s)}`;
}, ellipseRibbon2: (e, t, r) => {
  const n = t * Math.min(D(r, "adj3", 12500) * 2, 0.5), o = t * Math.min(D(r, "adj1", 25e3), 0.35), s = e * Math.min(D(r, "adj2", 5e4) / 2, 0.3), l = t * 0.12, i = `M 0 ${g(t - o)} Q ${g(e / 2)} ${g(t + o)} ${g(e)} ${g(t - o)} L ${g(e)} ${g(t - o - n)} Q ${g(e / 2)} ${g(t + o - n)} 0 ${g(t - o - n)} Z`, a = (c) => V([[c, t - o - n * 0.2], [c + s, t - o - n * 0.2], [c + s, 0], [c + s / 2, l], [c, 0]]);
  return `${i} ${a(0)} ${a(e - s)}`;
}, leftRightRibbon: (e, t, r) => {
  const n = Math.min(t * Math.min(D(r, "adj1", 5e4), 1) / 2, t / 4), o = e * Math.min(D(r, "adj2", 5e4), 0.9) / 2, s = Math.min((e / 2 - o) * 0.6, Math.max(t * D(r, "adj3", 16667) * 2, 1)), l = n * 1.8, i = e / 2, a = t / 2;
  return V([[0, a], [s, a - l], [s, a - n], [i - o, a - n], [i - o, 0], [i + o, 0], [i + o, a - n], [e - s, a - n], [e - s, a - l], [e, a], [e - s, a + l], [e - s, a + n], [i + o, a + n], [i + o, t], [i - o, t], [i - o, a + n], [s, a + n], [s, a + l]]);
}, verticalScroll: (e, t, r) => {
  const n = Math.min(e, t) * Math.min(D(r, "adj", 12500), 0.25);
  return `M ${g(n)} ${g(n)} L ${g(n)} ${g(t - n)} A ${g(n)} ${g(n)} 0 0 0 ${g(n * 2)} ${g(t)} L ${g(e)} ${g(t)} L ${g(e)} ${g(n)} A ${g(n)} ${g(n)} 0 0 0 ${g(e - n * 2)} ${g(n)} Z M ${g(n)} ${g(n)} A ${g(n)} ${g(n)} 0 0 1 ${g(n * 2)} 0 L ${g(e - n)} 0 A ${g(n)} ${g(n)} 0 0 1 ${g(e - n * 2)} ${g(n)} Z`;
}, horizontalScroll: (e, t, r) => {
  const n = Math.min(e, t) * Math.min(D(r, "adj", 12500), 0.25);
  return `M ${g(n)} ${g(n)} L ${g(e - n)} ${g(n)} A ${g(n)} ${g(n)} 0 0 1 ${g(e)} ${g(n * 2)} L ${g(e)} ${g(t)} L ${g(n * 2)} ${g(t)} A ${g(n)} ${g(n)} 0 0 1 ${g(n)} ${g(t - n * 2)} Z M ${g(n)} ${g(n)} A ${g(n)} ${g(n)} 0 0 0 0 ${g(n * 2)} L 0 ${g(t - n)} A ${g(n)} ${g(n)} 0 0 0 ${g(n)} ${g(t - n * 2)} Z`;
}, wave: (e, t, r) => {
  const n = t * Math.min(D(r, "adj1", 12500), 0.4);
  return `M 0 ${g(n)} ${tr(n, e, n, !1)} L ${g(e)} ${g(t - n)} ${tr(t - n, e, n, !0)} Z`;
}, doubleWave: (e, t, r) => {
  const n = t * Math.min(D(r, "adj1", 6250), 0.25), o = e / 8, s = `C ${g(o)} ${g(n - n * 2)} ${g(o * 3)} ${g(n + n * 2)} ${g(e / 2)} ${g(n)} C ${g(e / 2 + o)} ${g(n - n * 2)} ${g(e / 2 + o * 3)} ${g(n + n * 2)} ${g(e)} ${g(n)}`, l = `C ${g(e - o)} ${g(t - n + n * 2)} ${g(e - o * 3)} ${g(t - n - n * 2)} ${g(e / 2)} ${g(t - n)} C ${g(e / 2 - o)} ${g(t - n + n * 2)} ${g(e / 2 - o * 3)} ${g(t - n - n * 2)} 0 ${g(t - n)}`;
  return `M 0 ${g(n)} ${s} L ${g(e)} ${g(t - n)} ${l} Z`;
}, wedgeRectCallout: (e, t, r) => {
  const { x1: n, x2: o, y1: s, y2: l, top: i, right: a, bottom: c, left: u } = hl(e, t, r);
  return V([[0, 0], [n, 0], i, [o, 0], [e, 0], [e, s], a, [e, l], [e, t], [o, t], c, [n, t], [0, t], [0, l], u, [0, s]]);
}, wedgeRoundRectCallout: (e, t, r) => {
  const { x1: n, x2: o, y1: s, y2: l, top: i, right: a, bottom: c, left: u } = hl(e, t, r), f = Math.min(e, t) * D(r, "adj3", 16667), h = (d, m) => `A ${g(f)} ${g(f)} 0 0 1 ${g(d)} ${g(m)}`, p = (...d) => d.map(([m, $]) => `L ${g(m)} ${g($)}`).join(" ");
  return [`M 0 ${g(f)}`, h(f, 0), p([n, 0], i, [o, 0], [e - f, 0]), h(e, f), p([e, s], a, [e, l], [e, t - f]), h(e - f, t), p([o, t], c, [n, t], [f, t]), h(0, t - f), p([0, l], u, [0, s]), "Z"].join(" ");
}, wedgeEllipseCallout: (e, t, r) => {
  const [n, o] = Wo(e, t, r), s = e / 2, l = t / 2, i = Math.atan2(o - l, n - s) * 180 / Math.PI, [a, c] = we(s, l, e / 2, t / 2, i + 8);
  return `M ${g(a)} ${g(c)} ${Re(s, l, e / 2, t / 2, i + 8, 344)} L ${g(n)} ${g(o)} Z`;
}, cloudCallout: (e, t, r) => {
  const [n, o] = Wo(e, t, r);
  return Zt.cloud(e, t * 0.8, {}) + " " + xe(e * 0.36, t * 0.88, e * 0.045, t * 0.045) + " " + xe(n, o, e * 0.025, t * 0.025);
}, borderCallout1: _e(1, !1), borderCallout2: _e(2, !1), borderCallout3: _e(3, !1), callout1: _e(1, !1), callout2: _e(2, !1), callout3: _e(3, !1), accentCallout1: _e(1, !0), accentCallout2: _e(2, !0), accentCallout3: _e(3, !0), accentBorderCallout1: _e(1, !0), accentBorderCallout2: _e(2, !0), accentBorderCallout3: _e(3, !0), flowChartProcess: (e, t) => V([[0, 0], [e, 0], [e, t], [0, t]]), flowChartAlternateProcess: (e, t) => {
  const r = Math.min(e, t) * 0.1667;
  return Hi(e, t, [r, r, r, r], ["r", "r", "r", "r"]);
}, flowChartDecision: (e, t) => V([[e / 2, 0], [e, t / 2], [e / 2, t], [0, t / 2]]), flowChartInputOutput: (e, t) => V([[e * 0.2, 0], [e, 0], [e * 0.8, t], [0, t]]), flowChartPredefinedProcess: (e, t) => V([[0, 0], [e, 0], [e, t], [0, t]]) + " " + Ee([[e / 8, 0], [e / 8, t]]) + " " + Ee([[e * 7 / 8, 0], [e * 7 / 8, t]]), flowChartInternalStorage: (e, t) => V([[0, 0], [e, 0], [e, t], [0, t]]) + " " + Ee([[e / 8, 0], [e / 8, t]]) + " " + Ee([[0, t / 8], [e, t / 8]]), flowChartDocument: (e, t) => `M 0 0 L ${g(e)} 0 L ${g(e)} ${g(t * 0.84)} C ${g(e * 0.75)} ${g(t * 1.06)} ${g(e * 0.25)} ${g(t * 0.62)} 0 ${g(t * 0.84)} Z`, flowChartMultidocument: (e, t) => `M 0 ${g(t * 0.2)} L ${g(e * 0.9)} ${g(t * 0.2)} L ${g(e * 0.9)} ${g(t * 0.86)} C ${g(e * 0.68)} ${g(t * 1.04)} ${g(e * 0.22)} ${g(t * 0.66)} 0 ${g(t * 0.86)} Z ` + Ee([[e * 0.05, t * 0.1], [e * 0.95, t * 0.1], [e * 0.95, t * 0.76]]) + " " + Ee([[e * 0.1, 0], [e, 0], [e, t * 0.66]]), flowChartTerminator: (e, t) => {
  const r = Math.min(t / 2, e / 2);
  return `M ${g(r)} 0 L ${g(e - r)} 0 A ${g(r)} ${g(t / 2)} 0 0 1 ${g(e - r)} ${g(t)} L ${g(r)} ${g(t)} A ${g(r)} ${g(t / 2)} 0 0 1 ${g(r)} 0 Z`;
}, flowChartPreparation: (e, t) => V([[e * 0.2, 0], [e * 0.8, 0], [e, t / 2], [e * 0.8, t], [e * 0.2, t], [0, t / 2]]), flowChartManualInput: (e, t) => V([[0, t * 0.2], [e, 0], [e, t], [0, t]]), flowChartManualOperation: (e, t) => V([[0, 0], [e, 0], [e * 0.8, t], [e * 0.2, t]]), flowChartConnector: (e, t) => xe(e / 2, t / 2, e / 2, t / 2), flowChartOffpageConnector: (e, t) => V([[0, 0], [e, 0], [e, t * 0.8], [e / 2, t], [0, t * 0.8]]), flowChartPunchedCard: (e, t) => V([[e * 0.2, 0], [e, 0], [e, t], [0, t], [0, t * 0.2]]), flowChartPunchedTape: (e, t) => `M 0 ${g(t * 0.11)} ${tr(t * 0.11, e, t * 0.11, !1)} L ${g(e)} ${g(t * 0.89)} ${tr(t * 0.89, e, t * 0.11, !0)} Z`, flowChartSummingJunction: (e, t) => xe(e / 2, t / 2, e / 2, t / 2) + " " + Ee([[e * 0.1464, t * 0.1464], [e * (1 - 0.1464), t * (1 - 0.1464)]]) + " " + Ee([[e * (1 - 0.1464), t * 0.1464], [e * 0.1464, t * (1 - 0.1464)]]), flowChartOr: (e, t) => xe(e / 2, t / 2, e / 2, t / 2) + " " + Ee([[e / 2, 0], [e / 2, t]]) + " " + Ee([[0, t / 2], [e, t / 2]]), flowChartCollate: (e, t) => V([[0, 0], [e, 0], [e / 2, t / 2], [e, t], [0, t], [e / 2, t / 2]]), flowChartSort: (e, t) => V([[e / 2, 0], [e, t / 2], [e / 2, t], [0, t / 2]]) + " " + Ee([[0, t / 2], [e, t / 2]]), flowChartExtract: (e, t) => V([[e / 2, 0], [e, t], [0, t]]), flowChartMerge: (e, t) => V([[0, 0], [e, 0], [e / 2, t]]), flowChartOnlineStorage: (e, t) => `M ${g(e * 0.16)} 0 L ${g(e)} 0 A ${g(e * 0.16)} ${g(t / 2)} 0 0 0 ${g(e)} ${g(t)} L ${g(e * 0.16)} ${g(t)} A ${g(e * 0.16)} ${g(t / 2)} 0 0 1 ${g(e * 0.16)} 0 Z`, flowChartOfflineStorage: (e, t) => V([[0, 0], [e, 0], [e / 2, t]]) + " " + Ee([[e * 0.1, t * 0.2], [e * 0.9, t * 0.2]]), flowChartMagneticTape: (e, t) => xe(e / 2, t * 0.46, e / 2, t * 0.46) + ` M ${g(e * 0.5)} ${g(t * 0.92)} L ${g(e)} ${g(t * 0.92)} L ${g(e)} ${g(t)} L ${g(e * 0.5)} ${g(t)} Z`, flowChartMagneticDisk: (e, t) => Zt.can(e, t, { adj: 25e3 }), flowChartMagneticDrum: (e, t) => {
  const r = Math.min(e / 2, e * 0.125);
  return `M ${g(r)} 0 L ${g(e - r)} 0 ${Re(e - r, t / 2, r, t / 2, -90, 180)} L ${g(r)} ${g(t)} ${Re(r, t / 2, r, t / 2, 90, 180)} Z ` + fl(e - r, t / 2, r, t / 2);
}, flowChartDisplay: (e, t) => `M ${g(e * 0.16)} 0 L ${g(e * 0.84)} 0 A ${g(e * 0.16)} ${g(t / 2)} 0 0 1 ${g(e * 0.84)} ${g(t)} L ${g(e * 0.16)} ${g(t)} L 0 ${g(t / 2)} Z`, flowChartDelay: (e, t) => `M 0 0 L ${g(e / 2)} 0 A ${g(e / 2)} ${g(t / 2)} 0 0 1 ${g(e / 2)} ${g(t)} L 0 ${g(t)} Z`, actionButtonBlank: (e, t) => Vo(e, t, Math.min(e, t) * 0.125), actionButtonHome: (e, t) => et(e, t, (r, n, o) => V([[n, o - r], [n + r, o], [n + r * 0.6, o], [n + r * 0.6, o + r], [n - r * 0.6, o + r], [n - r * 0.6, o], [n - r, o]])), actionButtonForwardNext: (e, t) => et(e, t, (r, n, o) => V([[n - r * 0.6, o - r], [n + r * 0.7, o], [n - r * 0.6, o + r]])), actionButtonBackPrevious: (e, t) => et(e, t, (r, n, o) => V([[n + r * 0.6, o - r], [n - r * 0.7, o], [n + r * 0.6, o + r]])), actionButtonBeginning: (e, t) => et(e, t, (r, n, o) => V([[n + r * 0.7, o - r], [n - r * 0.3, o], [n + r * 0.7, o + r]]) + " " + V([[n - r * 0.7, o - r], [n - r * 0.45, o - r], [n - r * 0.45, o + r], [n - r * 0.7, o + r]])), actionButtonEnd: (e, t) => et(e, t, (r, n, o) => V([[n - r * 0.7, o - r], [n + r * 0.3, o], [n - r * 0.7, o + r]]) + " " + V([[n + r * 0.45, o - r], [n + r * 0.7, o - r], [n + r * 0.7, o + r], [n + r * 0.45, o + r]])), actionButtonInformation: (e, t) => et(e, t, (r, n, o) => xe(n, o, r, r) + " " + xe(n, o - r * 0.45, r * 0.16, r * 0.16) + " " + V([[n - r * 0.16, o - r * 0.15], [n + r * 0.16, o - r * 0.15], [n + r * 0.16, o + r * 0.6], [n - r * 0.16, o + r * 0.6]])), actionButtonReturn: (e, t) => et(e, t, (r, n, o) => `M ${g(n - r * 0.6)} ${g(o + r * 0.7)} L ${g(n + r * 0.2)} ${g(o + r * 0.7)} A ${g(r * 0.5)} ${g(r * 0.5)} 0 0 0 ${g(n + r * 0.2)} ${g(o - r * 0.3)} L ${g(n - r * 0.2)} ${g(o - r * 0.3)} M ${g(n - r * 0.2)} ${g(o - r * 0.6)} L ${g(n - r * 0.6)} ${g(o - r * 0.3)} L ${g(n - r * 0.2)} ${g(o)} Z`), actionButtonDocument: (e, t) => et(e, t, (r, n, o) => V([[n - r * 0.55, o - r * 0.8], [n + r * 0.2, o - r * 0.8], [n + r * 0.55, o - r * 0.45], [n + r * 0.55, o + r * 0.8], [n - r * 0.55, o + r * 0.8]])), actionButtonSound: (e, t) => et(e, t, (r, n, o) => V([[n - r * 0.7, o - r * 0.3], [n - r * 0.3, o - r * 0.3], [n + r * 0.1, o - r * 0.8], [n + r * 0.1, o + r * 0.8], [n - r * 0.3, o + r * 0.3], [n - r * 0.7, o + r * 0.3]]) + " " + Ee([[n + r * 0.35, o - r * 0.4], [n + r * 0.75, o - r * 0.6]]) + " " + Ee([[n + r * 0.35, o], [n + r * 0.8, o]]) + " " + Ee([[n + r * 0.35, o + r * 0.4], [n + r * 0.75, o + r * 0.6]])), actionButtonMovie: (e, t) => et(e, t, (r, n, o) => V([[n - r * 0.8, o - r * 0.5], [n + r * 0.35, o - r * 0.5], [n + r * 0.35, o - r * 0.15], [n + r * 0.8, o - r * 0.45], [n + r * 0.8, o + r * 0.45], [n + r * 0.35, o + r * 0.15], [n + r * 0.35, o + r * 0.5], [n - r * 0.8, o + r * 0.5]])), actionButtonHelp: (e, t) => et(e, t, (r, n, o) => `M ${g(n - r * 0.35)} ${g(o - r * 0.3)} A ${g(r * 0.35)} ${g(r * 0.35)} 0 1 1 ${g(n)} ${g(o + r * 0.1)} L ${g(n)} ${g(o + r * 0.35)} ` + xe(n, o + r * 0.68, r * 0.13, r * 0.13)), chartX: (e, t) => ke(`M 0 0 L ${g(e)} ${g(t)} M ${g(e)} 0 L 0 ${g(t)}`), chartPlus: (e, t) => ke(`M ${g(e / 2)} 0 L ${g(e / 2)} ${g(t)} M 0 ${g(t / 2)} L ${g(e)} ${g(t / 2)}`), chartStar: (e, t) => ke(`M 0 0 L ${g(e)} ${g(t)} M ${g(e)} 0 L 0 ${g(t)} M ${g(e / 2)} 0 L ${g(e / 2)} ${g(t)}`), line: (e, t) => ke(`M 0 0 L ${g(e)} ${g(t)}`), lineInv: (e, t) => ke(`M 0 ${g(t)} L ${g(e)} 0`), straightConnector1: (e, t) => ke(`M 0 0 L ${g(e)} ${g(t)}`), bentConnector2: (e, t) => ke(`M 0 0 L ${g(e)} 0 L ${g(e)} ${g(t)}`), bentConnector3: (e, t, r) => {
  const n = e * D(r, "adj1", 5e4);
  return ke(`M 0 0 L ${g(n)} 0 L ${g(n)} ${g(t)} L ${g(e)} ${g(t)}`);
}, bentConnector4: (e, t, r) => {
  const n = e * D(r, "adj1", 5e4), o = t * D(r, "adj2", 5e4);
  return ke(`M 0 0 L ${g(n)} 0 L ${g(n)} ${g(o)} L ${g(e)} ${g(o)} L ${g(e)} ${g(t)}`);
}, bentConnector5: (e, t, r) => {
  const n = e * D(r, "adj1", 5e4), o = t * D(r, "adj2", 5e4), s = e * D(r, "adj3", 5e4);
  return ke(`M 0 0 L ${g(n)} 0 L ${g(n)} ${g(o)} L ${g(s)} ${g(o)} L ${g(s)} ${g(t)} L ${g(e)} ${g(t)}`);
}, curvedConnector2: (e, t) => ke(`M 0 0 Q ${g(e)} 0 ${g(e)} ${g(t)}`), curvedConnector3: (e, t, r) => {
  const n = e * D(r, "adj1", 5e4);
  return ke(`M 0 0 C ${g(n)} 0 ${g(n)} ${g(t)} ${g(e)} ${g(t)}`);
}, curvedConnector4: (e, t) => ke(`M 0 0 C ${g(e * 0.5)} 0 ${g(e * 0.5)} ${g(t * 0.5)} ${g(e * 0.75)} ${g(t * 0.5)} S ${g(e)} ${g(t * 0.75)} ${g(e)} ${g(t)}`), curvedConnector5: (e, t) => ke(`M 0 0 C ${g(e * 0.4)} 0 ${g(e * 0.4)} ${g(t * 0.5)} ${g(e * 0.5)} ${g(t * 0.5)} S ${g(e * 0.6)} ${g(t)} ${g(e)} ${g(t)}`) };
function $n(e, t, r, n) {
  const o = Zt[e] ?? Zt.rect, s = Math.max(t, 0), l = Math.max(r, 0);
  let i;
  try {
    const c = o(s, l, n);
    i = typeof c == "string" ? { d: c, open: !1 } : c;
  } catch {
    return { d: Zt.rect(s, l, {}), open: !1 };
  }
  const a = Math.max(s, l) * 20 + 1e3;
  for (const c of i.d.match(/-?\d+(?:\.\d+)?/g) ?? []) if (Math.abs(Number(c)) > a) return { d: Zt.rect(s, l, {}), open: !1 };
  return i;
}
function g$(e, t, r) {
  return $n(e.preset, t, r, e.adj);
}
function $$(e) {
  return Object.prototype.hasOwnProperty.call(Zt, e);
}
var je = Uint8Array, Ge = Uint16Array, xs = Int32Array, Vr = new je([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]), Xr = new je([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]), Xo = new je([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), Vi = function(e, t) {
  for (var r = new Ge(31), n = 0; n < 31; ++n) r[n] = t += 1 << e[n - 1];
  for (var o = new xs(r[30]), n = 1; n < 30; ++n) for (var s = r[n]; s < r[n + 1]; ++s) o[s] = s - r[n] << 5 | n;
  return { b: r, r: o };
}, Xi = Vi(Vr, 2), Yi = Xi.b, Yo = Xi.r;
Yi[28] = 258, Yo[258] = 28;
var Gi = Vi(Xr, 0), vu = Gi.b, pl = Gi.r, Go = new Ge(32768);
for (var de = 0; de < 32768; ++de) {
  var St = (de & 43690) >> 1 | (de & 21845) << 1;
  St = (St & 52428) >> 2 | (St & 13107) << 2, St = (St & 61680) >> 4 | (St & 3855) << 4, Go[de] = ((St & 65280) >> 8 | (St & 255) << 8) >> 1;
}
var ht = function(e, t, r) {
  for (var n = e.length, o = 0, s = new Ge(t); o < n; ++o) e[o] && ++s[e[o] - 1];
  var l = new Ge(t);
  for (o = 1; o < t; ++o) l[o] = l[o - 1] + s[o - 1] << 1;
  var i;
  if (r) {
    i = new Ge(1 << t);
    var a = 15 - t;
    for (o = 0; o < n; ++o) if (e[o]) for (var c = o << 4 | e[o], u = t - e[o], f = l[e[o] - 1]++ << u, h = f | (1 << u) - 1; f <= h; ++f) i[Go[f] >> a] = c;
  } else for (i = new Ge(n), o = 0; o < n; ++o) e[o] && (i[o] = Go[l[e[o] - 1]++] >> 15 - e[o]);
  return i;
}, Ft = new je(288);
for (var de = 0; de < 144; ++de) Ft[de] = 8;
for (var de = 144; de < 256; ++de) Ft[de] = 9;
for (var de = 256; de < 280; ++de) Ft[de] = 7;
for (var de = 280; de < 288; ++de) Ft[de] = 8;
var Dn = new je(32);
for (var de = 0; de < 32; ++de) Dn[de] = 5;
var Mu = /* @__PURE__ */ ht(Ft, 9, 0), ku = /* @__PURE__ */ ht(Ft, 9, 1), Cu = /* @__PURE__ */ ht(Dn, 5, 0), Eu = /* @__PURE__ */ ht(Dn, 5, 1), ao = function(e) {
  for (var t = e[0], r = 1; r < e.length; ++r) e[r] > t && (t = e[r]);
  return t;
}, tt = function(e, t, r) {
  var n = t / 8 | 0;
  return (e[n] | e[n + 1] << 8) >> (t & 7) & r;
}, co = function(e, t) {
  var r = t / 8 | 0;
  return (e[r] | e[r + 1] << 8 | e[r + 2] << 16) >> (t & 7);
}, ws = function(e) {
  return (e + 7) / 8 | 0;
}, Zi = function(e, t, r) {
  return (r == null || r > e.length) && (r = e.length), new je(e.subarray(t, r));
}, Su = ["unexpected EOF", "invalid block type", "invalid length/literal", "invalid distance", "stream finished", "no stream handler", , "no callback", "invalid UTF-8 data", "extra field too long", "date not in range 1980-2099", "filename too long", "stream finishing", "invalid zip data"], nt = function(e, t, r) {
  var n = new Error(t || Su[e]);
  if (n.code = e, Error.captureStackTrace && Error.captureStackTrace(n, nt), !r) throw n;
  return n;
}, _i = function(e, t, r, n) {
  var o = e.length, s = n ? n.length : 0;
  if (!o || t.f && !t.l) return r || new je(0);
  var l = !r, i = l || t.i != 2, a = t.i;
  l && (r = new je(o * 3));
  var c = function(Wt) {
    var vn = r.length;
    if (Wt > vn) {
      var tn = new je(Math.max(vn * 2, Wt));
      tn.set(r), r = tn;
    }
  }, u = t.f || 0, f = t.p || 0, h = t.b || 0, p = t.l, d = t.d, m = t.m, $ = t.n, x = o * 8;
  do {
    if (!p) {
      u = tt(e, f, 1);
      var b = tt(e, f + 1, 3);
      if (f += 3, b) if (b == 1) p = ku, d = Eu, m = 9, $ = 5;
      else if (b == 2) {
        var M = tt(e, f, 31) + 257, E = tt(e, f + 10, 15) + 4, y = M + tt(e, f + 5, 31) + 1;
        f += 14;
        for (var v = new je(y), k = new je(19), T = 0; T < E; ++T) k[Xo[T]] = tt(e, f + T * 3, 7);
        f += E * 3;
        for (var S = ao(k), N = (1 << S) - 1, P = ht(k, S, 1), T = 0; T < y; ) {
          var L = P[tt(e, f, N)];
          f += L & 15;
          var A = L >> 4;
          if (A < 16) v[T++] = A;
          else {
            var z = 0, R = 0;
            for (A == 16 ? (R = 3 + tt(e, f, 3), f += 2, z = v[T - 1]) : A == 17 ? (R = 3 + tt(e, f, 7), f += 3) : A == 18 && (R = 11 + tt(e, f, 127), f += 7); R--; ) v[T++] = z;
          }
        }
        var O = v.subarray(0, M), U = v.subarray(M);
        m = ao(O), $ = ao(U), p = ht(O, m, 1), d = ht(U, $, 1);
      } else nt(1);
      else {
        var A = ws(f) + 4, j = e[A - 4] | e[A - 3] << 8, W = A + j;
        if (W > o) {
          a && nt(0);
          break;
        }
        i && c(h + j), r.set(e.subarray(A, W), h), t.b = h += j, t.p = f = W * 8, t.f = u;
        continue;
      }
      if (f > x) {
        a && nt(0);
        break;
      }
    }
    i && c(h + 131072);
    for (var X = (1 << m) - 1, B = (1 << $) - 1, Z = f; ; Z = f) {
      var z = p[co(e, f) & X], Y = z >> 4;
      if (f += z & 15, f > x) {
        a && nt(0);
        break;
      }
      if (z || nt(2), Y < 256) r[h++] = Y;
      else if (Y == 256) {
        Z = f, p = null;
        break;
      } else {
        var J = Y - 254;
        if (Y > 264) {
          var T = Y - 257, G = Vr[T];
          J = tt(e, f, (1 << G) - 1) + Yi[T], f += G;
        }
        var le = d[co(e, f) & B], he = le >> 4;
        le || nt(3), f += le & 15;
        var U = vu[he];
        if (he > 3) {
          var G = Xr[he];
          U += co(e, f) & (1 << G) - 1, f += G;
        }
        if (f > x) {
          a && nt(0);
          break;
        }
        i && c(h + 131072);
        var me = h + J;
        if (h < U) {
          var ge = s - U, $t = Math.min(U, me);
          for (ge + h < 0 && nt(3); h < $t; ++h) r[h] = n[ge + h];
        }
        for (; h < me; ++h) r[h] = r[h - U];
      }
    }
    t.l = p, t.p = Z, t.b = h, t.f = u, p && (u = 1, t.m = m, t.d = d, t.n = $);
  } while (!u);
  return h != r.length && l ? Zi(r, 0, h) : r.subarray(0, h);
}, bt = function(e, t, r) {
  r <<= t & 7;
  var n = t / 8 | 0;
  e[n] |= r, e[n + 1] |= r >> 8;
}, Mn = function(e, t, r) {
  r <<= t & 7;
  var n = t / 8 | 0;
  e[n] |= r, e[n + 1] |= r >> 8, e[n + 2] |= r >> 16;
}, uo = function(e, t) {
  for (var r = [], n = 0; n < e.length; ++n) e[n] && r.push({ s: n, f: e[n] });
  var o = r.length, s = r.slice();
  if (!o) return { t: Ji, l: 0 };
  if (o == 1) {
    var l = new je(r[0].s + 1);
    return l[r[0].s] = 1, { t: l, l: 1 };
  }
  r.sort(function(y, v) {
    return y.f - v.f;
  }), r.push({ s: -1, f: 25001 });
  var i = r[0], a = r[1], c = 0, u = 1, f = 2;
  for (r[0] = { s: -1, f: i.f + a.f, l: i, r: a }; u != o - 1; ) i = r[r[c].f < r[f].f ? c++ : f++], a = r[c != u && r[c].f < r[f].f ? c++ : f++], r[u++] = { s: -1, f: i.f + a.f, l: i, r: a };
  for (var h = s[0].s, n = 1; n < o; ++n) s[n].s > h && (h = s[n].s);
  var p = new Ge(h + 1), d = Zo(r[u - 1], p, 0);
  if (d > t) {
    var n = 0, m = 0, $ = d - t, x = 1 << $;
    for (s.sort(function(v, k) {
      return p[k.s] - p[v.s] || v.f - k.f;
    }); n < o; ++n) {
      var b = s[n].s;
      if (p[b] > t) m += x - (1 << d - p[b]), p[b] = t;
      else break;
    }
    for (m >>= $; m > 0; ) {
      var M = s[n].s;
      p[M] < t ? m -= 1 << t - p[M]++ - 1 : ++n;
    }
    for (; n >= 0 && m; --n) {
      var E = s[n].s;
      p[E] == t && (--p[E], ++m);
    }
    d = t;
  }
  return { t: new je(p), l: d };
}, Zo = function(e, t, r) {
  return e.s == -1 ? Math.max(Zo(e.l, t, r + 1), Zo(e.r, t, r + 1)) : t[e.s] = r;
}, ml = function(e) {
  for (var t = e.length; t && !e[--t]; ) ;
  for (var r = new Ge(++t), n = 0, o = e[0], s = 1, l = function(a) {
    r[n++] = a;
  }, i = 1; i <= t; ++i) if (e[i] == o && i != t) ++s;
  else {
    if (!o && s > 2) {
      for (; s > 138; s -= 138) l(32754);
      s > 2 && (l(s > 10 ? s - 11 << 5 | 28690 : s - 3 << 5 | 12305), s = 0);
    } else if (s > 3) {
      for (l(o), --s; s > 6; s -= 6) l(8304);
      s > 2 && (l(s - 3 << 5 | 8208), s = 0);
    }
    for (; s--; ) l(o);
    s = 1, o = e[i];
  }
  return { c: r.subarray(0, n), n: t };
}, kn = function(e, t) {
  for (var r = 0, n = 0; n < t.length; ++n) r += e[n] * t[n];
  return r;
}, qi = function(e, t, r) {
  var n = r.length, o = ws(t + 2);
  e[o] = n & 255, e[o + 1] = n >> 8, e[o + 2] = e[o] ^ 255, e[o + 3] = e[o + 1] ^ 255;
  for (var s = 0; s < n; ++s) e[o + s + 4] = r[s];
  return (o + 4 + n) * 8;
}, gl = function(e, t, r, n, o, s, l, i, a, c, u) {
  bt(t, u++, r), ++o[256];
  for (var f = uo(o, 15), h = f.t, p = f.l, d = uo(s, 15), m = d.t, $ = d.l, x = ml(h), b = x.c, M = x.n, E = ml(m), y = E.c, v = E.n, k = new Ge(19), T = 0; T < b.length; ++T) ++k[b[T] & 31];
  for (var T = 0; T < y.length; ++T) ++k[y[T] & 31];
  for (var S = uo(k, 7), N = S.t, P = S.l, L = 19; L > 4 && !N[Xo[L - 1]]; --L) ;
  var A = c + 5 << 3, z = kn(o, Ft) + kn(s, Dn) + l, R = kn(o, h) + kn(s, m) + l + 14 + 3 * L + kn(k, N) + 2 * k[16] + 3 * k[17] + 7 * k[18];
  if (a >= 0 && A <= z && A <= R) return qi(t, u, e.subarray(a, a + c));
  var O, U, j, W;
  if (bt(t, u, 1 + (R < z)), u += 2, R < z) {
    O = ht(h, p, 0), U = h, j = ht(m, $, 0), W = m;
    var X = ht(N, P, 0);
    bt(t, u, M - 257), bt(t, u + 5, v - 1), bt(t, u + 10, L - 4), u += 14;
    for (var T = 0; T < L; ++T) bt(t, u + 3 * T, N[Xo[T]]);
    u += 3 * L;
    for (var B = [b, y], Z = 0; Z < 2; ++Z) for (var Y = B[Z], T = 0; T < Y.length; ++T) {
      var J = Y[T] & 31;
      bt(t, u, X[J]), u += N[J], J > 15 && (bt(t, u, Y[T] >> 5 & 127), u += Y[T] >> 12);
    }
  } else O = Mu, U = Ft, j = Cu, W = Dn;
  for (var T = 0; T < i; ++T) {
    var G = n[T];
    if (G > 255) {
      var J = G >> 18 & 31;
      Mn(t, u, O[J + 257]), u += U[J + 257], J > 7 && (bt(t, u, G >> 23 & 31), u += Vr[J]);
      var le = G & 31;
      Mn(t, u, j[le]), u += W[le], le > 3 && (Mn(t, u, G >> 5 & 8191), u += Xr[le]);
    } else Mn(t, u, O[G]), u += U[G];
  }
  return Mn(t, u, O[256]), u + U[256];
}, Lu = /* @__PURE__ */ new xs([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), Ji = /* @__PURE__ */ new je(0), Tu = function(e, t, r, n, o, s) {
  var l = s.z || e.length, i = new je(n + l + 5 * (1 + Math.ceil(l / 7e3)) + o), a = i.subarray(n, i.length - o), c = s.l, u = (s.r || 0) & 7;
  if (t) {
    u && (a[0] = s.r >> 3);
    for (var f = Lu[t - 1], h = f >> 13, p = f & 8191, d = (1 << r) - 1, m = s.p || new Ge(32768), $ = s.h || new Ge(d + 1), x = Math.ceil(r / 3), b = 2 * x, M = function(so) {
      return (e[so] ^ e[so + 1] << x ^ e[so + 2] << b) & d;
    }, E = new xs(25e3), y = new Ge(288), v = new Ge(32), k = 0, T = 0, S = s.i || 0, N = 0, P = s.w || 0, L = 0; S + 2 < l; ++S) {
      var A = M(S), z = S & 32767, R = $[A];
      if (m[z] = R, $[A] = z, P <= S) {
        var O = l - S;
        if ((k > 7e3 || N > 24576) && (O > 423 || !c)) {
          u = gl(e, a, 0, E, y, v, T, N, L, S - L, u), N = k = T = 0, L = S;
          for (var U = 0; U < 286; ++U) y[U] = 0;
          for (var U = 0; U < 30; ++U) v[U] = 0;
        }
        var j = 2, W = 0, X = p, B = z - R & 32767;
        if (O > 2 && A == M(S - B)) for (var Z = Math.min(h, O) - 1, Y = Math.min(32767, S), J = Math.min(258, O); B <= Y && --X && z != R; ) {
          if (e[S + j] == e[S + j - B]) {
            for (var G = 0; G < J && e[S + G] == e[S + G - B]; ++G) ;
            if (G > j) {
              if (j = G, W = B, G > Z) break;
              for (var le = Math.min(B, G - 2), he = 0, U = 0; U < le; ++U) {
                var me = S - B + U & 32767, ge = m[me], $t = me - ge & 32767;
                $t > he && (he = $t, R = me);
              }
            }
          }
          z = R, R = m[z], B += z - R & 32767;
        }
        if (W) {
          E[N++] = 268435456 | Yo[j] << 18 | pl[W];
          var Wt = Yo[j] & 31, vn = pl[W] & 31;
          T += Vr[Wt] + Xr[vn], ++y[257 + Wt], ++v[vn], P = S + j, ++k;
        } else E[N++] = e[S], ++y[e[S]];
      }
    }
    for (S = Math.max(S, P); S < l; ++S) E[N++] = e[S], ++y[e[S]];
    u = gl(e, a, c, E, y, v, T, N, L, S - L, u), c || (s.r = u & 7 | a[u / 8 | 0] << 3, u -= 7, s.h = $, s.p = m, s.i = S, s.w = P);
  } else {
    for (var S = s.w || 0; S < l + c; S += 65535) {
      var tn = S + 65535;
      tn >= l && (a[u / 8 | 0] = c, tn = l), u = qi(a, u + 1, e.subarray(S, tn));
    }
    s.i = l;
  }
  return Zi(i, 0, n + ws(u) + o);
}, Ki = function() {
  var e = 1, t = 0;
  return { p: function(r) {
    for (var n = e, o = t, s = r.length | 0, l = 0; l != s; ) {
      for (var i = Math.min(l + 2655, s); l < i; ++l) o += n += r[l];
      n = (n & 65535) + 15 * (n >> 16), o = (o & 65535) + 15 * (o >> 16);
    }
    e = n, t = o;
  }, d: function() {
    return e %= 65521, t %= 65521, (e & 255) << 24 | (e & 65280) << 8 | (t & 255) << 8 | t >> 8;
  } };
}, Pu = function(e, t, r, n, o) {
  if (!o && (o = { l: 1 }, t.dictionary)) {
    var s = t.dictionary.subarray(-32768), l = new je(s.length + e.length);
    l.set(s), l.set(e, s.length), e = l, o.w = s.length;
  }
  return Tu(e, t.level == null ? 6 : t.level, t.mem == null ? o.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(e.length))) * 1.5) : 20 : 12 + t.mem, r, n, o);
}, Qi = function(e, t, r) {
  for (; r; ++t) e[t] = r, r >>>= 8;
}, Au = function(e, t) {
  var r = t.level, n = r == 0 ? 0 : r < 6 ? 1 : r == 9 ? 3 : 2;
  if (e[0] = 120, e[1] = n << 6 | (t.dictionary && 32), e[1] |= 31 - (e[0] << 8 | e[1]) % 31, t.dictionary) {
    var o = Ki();
    o.p(t.dictionary), Qi(e, 2, o.d());
  }
}, Iu = function(e, t) {
  return ((e[0] & 15) != 8 || e[0] >> 4 > 7 || (e[0] << 8 | e[1]) % 31) && nt(6, "invalid zlib data"), (e[1] >> 5 & 1) == +!t && nt(6, "invalid zlib data: " + (e[1] & 32 ? "need" : "unexpected") + " dictionary"), (e[1] >> 3 & 4) + 2;
};
function ea(e, t) {
  return _i(e, { i: 2 }, t && t.out, t && t.dictionary);
}
function Nu(e, t) {
  t || (t = {});
  var r = Ki();
  r.p(e);
  var n = Pu(e, t, t.dictionary ? 6 : 2, 4);
  return Au(n, t), Qi(n, n.length - 4, r.d()), n;
}
function Ru(e, t) {
  return _i(e.subarray(Iu(e, t && t.dictionary), -4), { i: 2 }, t && t.out, t && t.dictionary);
}
var zu = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), Ou = 0;
try {
  zu.decode(Ji, { stream: !0 }), Ou = 1;
} catch {
}
const ju = 101010256, Fu = 33639248, Uu = 67324752, Du = 117853008, Bu = 65557, Hu = new TextDecoder("utf-8", { fatal: !0 });
let Yr = class extends Error {
  constructor(t, r) {
    super(r), this.reason = t, this.name = "ZipSafetyError";
  }
};
const Wu = Object.freeze({ maxEntries: 4096, maxEntryBytes: 128 * 1024 * 1024, maxTotalBytes: 512 * 1024 * 1024, maxCompressionRatio: 1e3 });
function fe(e, t) {
  throw new Yr(e, t);
}
function Vu(e) {
  const t = { ...Wu, ...e };
  for (const r of ["maxEntries", "maxEntryBytes", "maxTotalBytes"]) (!Number.isSafeInteger(t[r]) || t[r] <= 0) && fe("zip-invalid-limit", `ZIP ${r} 必须是正安全整数，收到 ${t[r]}`);
  return (!Number.isFinite(t.maxCompressionRatio) || t.maxCompressionRatio <= 0) && fe("zip-invalid-limit", `ZIP maxCompressionRatio 必须是正有限数，收到 ${t.maxCompressionRatio}`), t;
}
function Xu(e) {
  const t = e.replace(/\\/g, "/");
  (!t || t.includes("\0") || t.startsWith("/") || /^[a-z]:/i.test(t)) && fe("zip-invalid-name", `ZIP 条目名称不是安全的包内相对路径：${e}`);
  const r = t.split("/"), n = t.endsWith("/");
  return r.some((o, s) => o === "." || o === ".." || !o && !(n && s === r.length - 1)) && fe("zip-invalid-name", `ZIP 条目包含路径穿越、当前目录或空路径段：${e}`), t;
}
function Yu(e) {
  e.length < 22 && fe("zip-invalid-structure", "ZIP 长度不足，缺少 EOCD");
  const t = new DataView(e.buffer, e.byteOffset, e.byteLength), r = Math.max(0, e.length - Bu);
  for (let n = e.length - 22; n >= r; n--) {
    if (t.getUint32(n, !0) !== ju) continue;
    const o = t.getUint16(n + 20, !0);
    if (n + 22 + o === e.length) return n;
    const s = e.length - n - 22;
    if (o === 0 && (s === 1 && e[n + 22] === 10 || s === 2 && e[n + 22] === 13 && e[n + 23] === 10)) return n;
  }
  return fe("zip-invalid-structure", "ZIP EOCD 或注释长度无效");
}
function Cn(e, t, r, n, o) {
  (!Number.isSafeInteger(t) || !Number.isSafeInteger(r) || t < 0 || r < 0 || t + r > n || t + r > e.length) && fe("zip-invalid-structure", `ZIP ${o} 超出允许边界`);
}
function $l(e, t, r) {
  try {
    return Xu(Hu.decode(e.subarray(t, t + r)));
  } catch (n) {
    if (n instanceof Yr) throw n;
    return fe("zip-invalid-name", "ZIP 条目名称不是有效 UTF-8");
  }
}
let ys = class {
  constructor(t, r) {
    this.source = t, this.entries = /* @__PURE__ */ new Map(), this.limits = Vu(r), this.inspectCentral();
  }
  inspectCentral() {
    const t = Yu(this.source), r = new DataView(this.source.buffer, this.source.byteOffset, this.source.byteLength);
    (t >= 20 && r.getUint32(t - 20, !0) === Du || r.getUint16(t + 8, !0) === 65535 || r.getUint16(t + 10, !0) === 65535 || r.getUint32(t + 12, !0) === 4294967295 || r.getUint32(t + 16, !0) === 4294967295) && fe("zip64-unsupported", "ZIP64 当前不支持安全大小与边界校验");
    const n = r.getUint16(t + 4, !0), o = r.getUint16(t + 6, !0), s = r.getUint16(t + 8, !0), l = r.getUint16(t + 10, !0), i = r.getUint32(t + 12, !0), a = r.getUint32(t + 16, !0);
    (n !== 0 || o !== 0 || s !== l) && fe("zip-invalid-structure", "ZIP 多磁盘或 EOCD 条目计数不一致"), (a > t || i !== t - a) && fe("zip-invalid-structure", "ZIP 中央目录边界与 EOCD 不一致"), l > this.limits.maxEntries && fe("zip-too-many-entries", `ZIP 条目数 ${l} 超过上限 ${this.limits.maxEntries}`);
    const c = /* @__PURE__ */ new Set();
    let u = 0, f = a;
    for (let h = 0; h < l; h++) {
      Cn(this.source, f, 46, t, `中央目录条目 ${h + 1}`), r.getUint32(f, !0) !== Fu && fe("zip-invalid-structure", `ZIP 中央目录条目 ${h + 1} 签名错误`);
      const p = r.getUint16(f + 8, !0), d = r.getUint16(f + 10, !0), m = r.getUint32(f + 20, !0), $ = r.getUint32(f + 24, !0), x = r.getUint16(f + 28, !0), b = r.getUint16(f + 30, !0), M = r.getUint16(f + 32, !0), E = r.getUint16(f + 34, !0), y = r.getUint32(f + 42, !0), v = 46 + x + b + M;
      Cn(this.source, f, v, t, `中央目录条目 ${h + 1}`), (E !== 0 || p & 1) && fe("zip-invalid-structure", `ZIP 条目 ${h + 1} 跨磁盘或已加密`), d !== 0 && d !== 8 && fe("zip-invalid-structure", `ZIP 条目 ${h + 1} 使用不支持的压缩方法 ${d}`);
      const k = $l(this.source, f + 46, x), T = k.toLowerCase();
      c.has(T) && fe("zip-duplicate-name", `ZIP 存在重复或等价条目名称：${k}`), c.add(T), $ > this.limits.maxEntryBytes && fe("zip-entry-too-large", `ZIP 条目 ${k} 声明 ${$} 字节，超过上限 ${this.limits.maxEntryBytes}`), u += $, u > this.limits.maxTotalBytes && fe("zip-total-too-large", `ZIP 声明解压总量 ${u} 字节，超过上限 ${this.limits.maxTotalBytes}`), $ > 0 && $ / Math.max(1, m) > this.limits.maxCompressionRatio && fe("zip-compression-ratio", `ZIP 条目 ${k} 压缩比超过上限 ${this.limits.maxCompressionRatio}`), Cn(this.source, y, 30, a, `本地头 ${k}`), r.getUint32(y, !0) !== Uu && fe("zip-invalid-structure", `ZIP 本地头签名错误：${k}`);
      const S = r.getUint16(y + 6, !0), N = r.getUint16(y + 8, !0), P = r.getUint16(y + 26, !0), L = r.getUint16(y + 28, !0), A = y + 30 + P + L;
      Cn(this.source, y, 30 + P + L, a, `本地头 ${k}`), ($l(this.source, y + 30, P) !== k || N !== d || S !== p) && fe("zip-invalid-structure", `ZIP 本地头与中央目录元数据不一致：${k}`), !(p & 8) && (r.getUint32(y + 18, !0) !== m || r.getUint32(y + 22, !0) !== $) && fe("zip-invalid-structure", `ZIP 本地头与中央目录大小不一致：${k}`), Cn(this.source, A, m, a, `压缩数据 ${k}`), this.entries.set(k, { name: k, size: m, originalSize: $, compression: d, flags: p, payload: this.source.subarray(A, A + m) }), f += v;
    }
    f !== t && fe("zip-invalid-structure", "ZIP 中央目录包含未识别记录");
  }
  unzip(t) {
    const r = {};
    let n = 0;
    for (const o of this.entries.values()) {
      const s = { name: o.name, size: o.size, originalSize: o.originalSize, compression: o.compression };
      if (t && !t(s)) continue;
      let l;
      try {
        o.compression === 0 ? l = o.payload : l = ea(o.payload, { out: new Uint8Array(o.originalSize + 1) });
      } catch (i) {
        if (i instanceof Yr) throw i;
        fe("zip-invalid-structure", `ZIP 条目 ${o.name} 解压失败：${i instanceof Error ? i.message : String(i)}`);
      }
      l.length !== o.originalSize && fe("zip-size-mismatch", `ZIP 条目 ${o.name} 实际输出 ${l.length} 字节，声明 ${o.originalSize} 字节`), n += l.length, (l.length > this.limits.maxEntryBytes || n > this.limits.maxTotalBytes) && fe("zip-output-too-large", `ZIP 条目 ${o.name} 实际输出超过配置上限`), Object.defineProperty(r, o.name, { value: l, enumerable: !0, configurable: !0, writable: !0 });
    }
    return r;
  }
};
function w$(e, t) {
  new ys(e, t);
}
function y$(e, t = {}) {
  return new ys(e, t.limits).unzip(t.filter);
}
const nr = /* @__PURE__ */ new Map([["xml", "http://www.w3.org/XML/1998/namespace"]]);
class Gu {
  constructor(t) {
    this.namespaceURI = null, this.attributes = [], this.childNodes = [], this.nextElementSibling = null, this.namespaceBindings = nr, this.tagName = t;
    const r = t.indexOf(":");
    this.prefix = r < 0 ? null : t.slice(0, r), this.localName = r < 0 ? t : t.slice(r + 1);
  }
  resolveNamespaces(t) {
    let r;
    for (const n of this.attributes) n.name === "xmlns" ? (r ?? (r = new Map(t?.namespaceBindings ?? nr))).set("", n.value) : n.prefix === "xmlns" && (r ?? (r = new Map(t?.namespaceBindings ?? nr))).set(n.localName, n.value);
    this.namespaceBindings = r ?? t?.namespaceBindings ?? nr, this.namespaceURI = this.lookupNamespaceURI(this.prefix);
    for (const n of this.attributes) n.name === "xmlns" || n.prefix === "xmlns" ? n.namespaceURI = "http://www.w3.org/2000/xmlns/" : n.prefix && (n.namespaceURI = this.lookupNamespaceURI(n.prefix));
  }
  get firstElementChild() {
    for (const t of this.childNodes) if (typeof t != "string") return t;
    return null;
  }
  get children() {
    return this.childNodes.filter((t) => typeof t != "string");
  }
  getAttribute(t) {
    for (const r of this.attributes) if (r.name === t) return r.value;
    return null;
  }
  lookupNamespaceURI(t) {
    const r = t ?? "";
    return this.namespaceBindings.get(r) || null;
  }
  get textContent() {
    let t = "";
    for (const r of this.childNodes) t += typeof r == "string" ? r : r.textContent;
    return t;
  }
  getElementsByTagName(t) {
    const r = [], n = (o) => {
      for (const s of o.children) (t === "*" || s.localName === t || s.tagName === t) && r.push(s), n(s);
    };
    return n(this), r;
  }
}
const Zu = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
function bl(e) {
  return e.indexOf("&") < 0 ? e : e.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (t, r) => {
    if (r[0] === "#") {
      const n = r[1] === "x" || r[1] === "X" ? parseInt(r.slice(2), 16) : parseInt(r.slice(1), 10);
      return Number.isFinite(n) && n >= 0 ? String.fromCodePoint(n) : t;
    }
    return Zu[r] ?? t;
  });
}
function _u(e) {
  let t = 0;
  const r = e.length, n = [];
  let o = null;
  const s = (l, i) => {
    const a = l.children;
    a.length && (a[a.length - 1].nextElementSibling = i), l.childNodes.push(i);
  };
  for (; t < r; ) {
    const l = e.indexOf("<", t);
    if (l < 0) break;
    if (l > t) {
      const m = e.slice(t, l);
      n.length && m.trim() ? n[n.length - 1].childNodes.push(bl(m)) : n.length && m.includes(" ") && n[n.length - 1].childNodes.push(m);
    }
    if (e.startsWith("<!--", l)) {
      const m = e.indexOf("-->", l + 4);
      t = m < 0 ? r : m + 3;
      continue;
    }
    if (e.startsWith("<![CDATA[", l)) {
      const m = e.indexOf("]]>", l + 9), $ = e.slice(l + 9, m < 0 ? r : m);
      n.length && n[n.length - 1].childNodes.push($), t = m < 0 ? r : m + 3;
      continue;
    }
    if (e.startsWith("<?", l) || e.startsWith("<!", l)) {
      const m = e.indexOf(">", l);
      t = m < 0 ? r : m + 1;
      continue;
    }
    if (e[l + 1] === "/") {
      const m = e.indexOf(">", l);
      if (m < 0) break;
      n.pop(), t = m + 1;
      continue;
    }
    let i = l + 1, a = "";
    for (; i < r; ) {
      const m = e[i];
      if (a) m === a && (a = "");
      else if (m === '"' || m === "'") a = m;
      else if (m === ">") break;
      i++;
    }
    if (i >= r) break;
    const c = e[i - 1] === "/", u = e.slice(l + 1, c ? i - 1 : i);
    let f = 0;
    for (; f < u.length && !/[\s/]/.test(u[f]); ) f++;
    const h = new Gu(u.slice(0, f)), p = /([^\s=/]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
    p.lastIndex = f;
    let d;
    for (; (d = p.exec(u)) !== null; ) {
      const m = d[1], $ = m.indexOf(":");
      h.attributes.push({ name: m, localName: $ < 0 ? m : m.slice($ + 1), prefix: $ < 0 ? null : m.slice(0, $), namespaceURI: null, value: bl(d[3] ?? d[4] ?? "") });
    }
    h.resolveNamespaces(n[n.length - 1]), n.length ? s(n[n.length - 1], h) : o || (o = h), c || n.push(h), t = i + 1;
  }
  if (!o) throw new Error("XML 解析失败：未找到根元素");
  return o;
}
const xl = typeof DOMParser < "u" ? new DOMParser() : null;
function Gr(e) {
  if (!xl) return _u(e);
  const t = xl.parseFromString(e, "application/xml"), r = t.getElementsByTagName("parsererror")[0];
  if (r) throw new Error("XML 解析失败: " + (r.textContent ?? "").slice(0, 200));
  return t.documentElement;
}
function K(e, t) {
  const r = [];
  if (!e) return r;
  for (let n = e.firstElementChild; n; n = n.nextElementSibling) n.localName === t && r.push(n);
  return r;
}
function w(e, t) {
  if (!e) return null;
  for (let r = e.firstElementChild; r; r = r.nextElementSibling) if (r.localName === t) return r;
  return null;
}
function ee(e, ...t) {
  let r = e;
  for (const n of t) if (r = w(r, n), !r) return null;
  return r;
}
function I(e, t) {
  if (!e) return null;
  if (t.includes(":")) {
    for (const o of Array.from(e.attributes)) if (o.name === t) return o.value;
    const n = t.split(":")[1];
    for (const o of Array.from(e.attributes)) if (o.localName === n) return o.value;
    return null;
  }
  const r = e.getAttribute(t);
  if (r !== null) return r;
  for (const n of Array.from(e.attributes)) if (n.localName === t) return n.value;
  return null;
}
function F(e, t) {
  const r = I(e, t);
  if (r === null || r === "") return null;
  const n = Number(r);
  return Number.isFinite(n) ? n : null;
}
function ye(e, t, r = !1) {
  const n = I(e, t);
  return n === null ? r : n === "1" || n === "true";
}
const se = (e) => (e ?? 0) / 9525, un = (e) => e / 100 * (96 / 72), qu = { window: "FFFFFF", windowText: "000000" }, Ju = { black: "000000", white: "FFFFFF", red: "FF0000", green: "008000", lime: "00FF00", blue: "0000FF", yellow: "FFFF00", cyan: "00FFFF", magenta: "FF00FF", gray: "808080", ltGray: "C0C0C0", dkGray: "404040", orange: "FFA500", purple: "800080", brown: "A52A2A" }, Ku = ["srgbClr", "schemeClr", "sysClr", "prstClr", "scrgbClr", "hslClr"];
function $e(e, t) {
  if (!e) return null;
  for (const r of Ku) {
    const n = w(e, r);
    if (n) return vs(n, t);
  }
  return null;
}
function vs(e, t) {
  let r = Qu(e, t), n = 1;
  for (let i = e.firstElementChild; i; i = i.nextElementSibling) {
    const a = (F(i, "val") ?? 0) / 1e5;
    switch (i.localName) {
      case "alpha":
        n = a;
        break;
      case "shade":
        r = wl(r, (c) => c * a);
        break;
      case "tint":
        r = wl(r, (c) => c * a + (1 - a));
        break;
      case "lumMod":
        r = fo(r, (c, u, f) => [c, u, f * a]);
        break;
      case "lumOff":
        r = fo(r, (c, u, f) => [c, u, f + a]);
        break;
      case "satMod":
        r = fo(r, (c, u, f) => [c, u * a, f]);
        break;
    }
  }
  const [o, s, l] = r.map((i) => Math.round(Mr(i, 0, 255)));
  return n >= 1 ? `rgb(${o},${s},${l})` : `rgba(${o},${s},${l},${Math.round(n * 1e3) / 1e3})`;
}
function Qu(e, t) {
  switch (e.localName) {
    case "srgbClr":
      return An(I(e, "val") ?? "000000");
    case "sysClr":
      return An(I(e, "lastClr") ?? qu[I(e, "val") ?? ""] ?? "000000");
    case "prstClr":
      return An(Ju[I(e, "val") ?? ""] ?? "808080");
    case "scrgbClr":
      return [(F(e, "r") ?? 0) / 1e5 * 255, (F(e, "g") ?? 0) / 1e5 * 255, (F(e, "b") ?? 0) / 1e5 * 255];
    case "hslClr":
      return na((F(e, "hue") ?? 0) / 6e4 / 360, (F(e, "sat") ?? 0) / 1e5, (F(e, "lum") ?? 0) / 1e5);
    case "schemeClr": {
      const r = I(e, "val") ?? "tx1";
      if (r === "phClr") return t.phClr ? ta(t.phClr) : [128, 128, 128];
      const n = t.clrMap[r] ?? r;
      return An(t.theme[n] ?? t.theme[r] ?? "000000");
    }
  }
  return [0, 0, 0];
}
function ta(e) {
  const t = e.match(/rgba?\(([^)]+)\)/);
  if (t) {
    const r = t[1].split(",").map((n) => Number(n.trim()));
    return [r[0] || 0, r[1] || 0, r[2] || 0];
  }
  return An(e);
}
function An(e) {
  const t = e.replace("#", "").padStart(6, "0");
  return [parseInt(t.slice(0, 2), 16) || 0, parseInt(t.slice(2, 4), 16) || 0, parseInt(t.slice(4, 6), 16) || 0];
}
function Mr(e, t, r) {
  return Math.min(r, Math.max(t, e));
}
const ef = (e) => {
  const t = e / 255;
  return t <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4;
}, tf = (e) => {
  const t = Mr(e, 0, 1);
  return (t <= 31308e-7 ? t * 12.92 : 1.055 * t ** (1 / 2.4) - 0.055) * 255;
};
function wl(e, t) {
  return e.map((r) => tf(t(ef(r))));
}
function fo(e, t) {
  const [r, n, o] = nf(e), [s, l, i] = t(r, n, o);
  return na(s, Mr(l, 0, 1), Mr(i, 0, 1));
}
function nf([e, t, r]) {
  e /= 255, t /= 255, r /= 255;
  const n = Math.max(e, t, r), o = Math.min(e, t, r), s = (n + o) / 2;
  if (n === o) return [0, 0, s];
  const l = n - o, i = s > 0.5 ? l / (2 - n - o) : l / (n + o);
  let a;
  return n === e ? a = (t - r) / l + (t < r ? 6 : 0) : n === t ? a = (r - e) / l + 2 : a = (e - t) / l + 4, [a / 6, i, s];
}
function na(e, t, r) {
  if (t === 0) return [r * 255, r * 255, r * 255];
  const n = r < 0.5 ? r * (1 + t) : r + t - r * t, o = 2 * r - n, s = (l) => (l < 0 && (l += 1), l > 1 && (l -= 1), l < 1 / 6 ? o + (n - o) * 6 * l : l < 1 / 2 ? n : l < 2 / 3 ? o + (n - o) * (2 / 3 - l) * 6 : o);
  return [s(e + 1 / 3) * 255, s(e) * 255, s(e - 1 / 3) * 255];
}
const Pe = (e, t, r) => [...r].every((n, o) => e[t + o] === n.charCodeAt(0)), Pt = (e, t) => e[t] * 256 + e[t + 1], st = (e, t) => e[t] + e[t + 1] * 256, yl = (e, t) => e[t] + e[t + 1] * 256 + e[t + 2] * 65536, Yt = (e, t) => e[t] * 16777216 + e[t + 1] * 65536 + e[t + 2] * 256 + e[t + 3], yt = (e, t) => e[t] + e[t + 1] * 256 + e[t + 2] * 65536 + e[t + 3] * 16777216 >>> 0, rr = (e, t) => {
  const r = Pt(e, t);
  return r > 32767 ? r - 65536 : r;
}, or = (e, t) => {
  const r = st(e, t);
  return r > 32767 ? r - 65536 : r;
}, Je = (e, t) => yt(e, t) | 0, Ze = (e, t, r = 96, n = 96) => Number.isFinite(e) && Number.isFinite(t) && e > 0 && t > 0 ? { width: e, height: t, dpiX: r > 0 ? r : 96, dpiY: n > 0 ? n : 96 } : null;
function rf(e) {
  if (e.length < 24 || !Pe(e, 1, "PNG")) return null;
  const t = Yt(e, 16), r = Yt(e, 20);
  let n = 96, o = 96;
  for (let s = 8; s + 12 <= e.length; ) {
    const l = Yt(e, s);
    if (l > e.length - s - 12) break;
    Pe(e, s + 4, "pHYs") && l === 9 && e[s + 16] === 1 && (n = Yt(e, s + 8) * 0.0254, o = Yt(e, s + 12) * 0.0254), s += l + 12;
  }
  return Ze(t, r, n, o);
}
const of = /* @__PURE__ */ new Set([192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207]);
function sf(e, t, r) {
  if (t + 14 > r || !Pe(e, t, "Exif\0\0")) return null;
  const n = t + 6, o = Pe(e, n, "II");
  if (!o && !Pe(e, n, "MM")) return null;
  const s = (d, m) => d >= n && d + m <= r, l = (d) => o ? st(e, d) : Pt(e, d), i = (d) => o ? yt(e, d) : Yt(e, d);
  if (!s(n, 8) || l(n + 2) !== 42) return null;
  const a = n + i(n + 4);
  if (!s(a, 2)) return null;
  let c = 0, u = 0, f = 2;
  const h = l(a);
  for (let d = 0; d < h; d++) {
    const m = a + 2 + d * 12;
    if (!s(m, 12)) break;
    const $ = l(m), x = l(m + 2), b = i(m + 4);
    let M = 0;
    if (b === 1 && x === 3) M = l(m + 8);
    else if (b === 1 && x === 5) {
      const E = n + i(m + 8);
      s(E, 8) && (M = i(E) / Math.max(i(E + 4), 1));
    }
    $ === 282 ? c = M : $ === 283 ? u = M : $ === 296 && M && (f = M);
  }
  const p = f === 3 ? 2.54 : f === 2 ? 1 : 0;
  return c > 0 && p ? [c * p, (u || c) * p] : null;
}
function lf(e) {
  if (e.length < 12 || e[0] !== 255 || e[1] !== 216) return null;
  let t = 0, r = 0, n = null, o = null;
  for (let l = 2; l + 4 <= e.length; ) {
    if (e[l++] !== 255) continue;
    for (; e[l] === 255; ) l++;
    const i = e[l++];
    if (i === 218 || i === 217) break;
    if (i === 1 || i >= 208 && i <= 215) continue;
    if (l + 2 > e.length) break;
    const a = Pt(e, l);
    if (a < 2 || l + a > e.length) break;
    const c = l + 2;
    if (i === 224 && a >= 14 && Pe(e, c, "JFIF\0")) {
      const u = e[c + 7], f = u === 1 ? 1 : u === 2 ? 2.54 : 0;
      f && (n = [Pt(e, c + 8) * f, Pt(e, c + 10) * f]);
    } else i === 225 && a >= 16 ? o ?? (o = sf(e, c, l + a)) : of.has(i) && a >= 7 && (r = Pt(e, c + 1), t = Pt(e, c + 3));
    l += a;
  }
  const s = n ?? o ?? [96, 96];
  return Ze(t, r, s[0], s[1]);
}
function af(e) {
  return e.length < 10 || !Pe(e, 0, "GIF87a") && !Pe(e, 0, "GIF89a") ? null : Ze(st(e, 6), st(e, 8));
}
function cf(e) {
  if (e.length < 26 || !Pe(e, 0, "BM")) return null;
  const t = yt(e, 14);
  if (t === 12) return Ze(st(e, 18), st(e, 20));
  if (t < 40 || e.length < 46) return null;
  const r = Math.abs(Je(e, 18)), n = Math.abs(Je(e, 22)), o = Je(e, 38) * 0.0254, s = Je(e, 42) * 0.0254;
  return Ze(r, n, o, s);
}
function uf(e) {
  if (e.length < 30 || !Pe(e, 0, "RIFF") || !Pe(e, 8, "WEBP")) return null;
  for (let t = 12; t + 8 <= e.length; ) {
    const r = yt(e, t + 4), n = t + 8;
    if (r > e.length - n) break;
    if (Pe(e, t, "VP8X") && r >= 10) return Ze(yl(e, n + 4) + 1, yl(e, n + 7) + 1);
    if (Pe(e, t, "VP8L") && r >= 5 && e[n] === 47) {
      const o = yt(e, n + 1);
      return Ze((o & 16383) + 1, (o >>> 14 & 16383) + 1);
    }
    if (Pe(e, t, "VP8 ") && r >= 10 && Pe(e, n + 3, "*")) return Ze(st(e, n + 6) & 16383, st(e, n + 8) & 16383);
    t = n + r + (r & 1);
  }
  return null;
}
function ff(e) {
  if (e.length < 16) return null;
  const t = Pe(e, 0, "II");
  if (!t && !Pe(e, 0, "MM")) return null;
  const r = (c) => t ? st(e, c) : Pt(e, c), n = (c) => t ? yt(e, c) : Yt(e, c);
  if (r(2) !== 42) return null;
  const o = n(4);
  if (o + 2 > e.length) return null;
  const s = r(o), l = /* @__PURE__ */ new Map();
  for (let c = 0; c < s; c++) {
    const u = o + 2 + c * 12;
    if (u + 12 > e.length) break;
    const f = r(u), h = r(u + 2), p = n(u + 4);
    let d = 0;
    if (p === 1 && h === 3) d = r(u + 8);
    else if (p === 1 && h === 4) d = n(u + 8);
    else if (p === 1 && h === 5) {
      const m = n(u + 8);
      m + 8 <= e.length && (d = n(m) / Math.max(n(m + 4), 1));
    }
    d && l.set(f, d);
  }
  const i = l.get(296) ?? 2, a = i === 3 ? 2.54 : i === 2 ? 1 : 0;
  return Ze(l.get(256) ?? 0, l.get(257) ?? 0, a ? (l.get(282) ?? 96) * a : 96, a ? (l.get(283) ?? l.get(282) ?? 96) * a : 96);
}
function hf(e) {
  var t, r;
  const n = (t = new TextDecoder().decode(e.subarray(0, Math.min(e.length, 65536))).match(/<svg\b[^>]*>/i)) == null ? void 0 : t[0];
  if (!n) return null;
  const o = (a) => {
    var c;
    const u = (c = n.match(new RegExp(`\\b${a}\\s*=\\s*["']([^"']+)["']`, "i"))) == null ? void 0 : c[1], f = u?.trim().match(/^([0-9]+(?:\.[0-9]+)?)(px|in|cm|mm|pt|pc)?$/i);
    if (!f) return null;
    const h = { px: 1, in: 96, cm: 96 / 2.54, mm: 96 / 25.4, pt: 96 / 72, pc: 16 };
    return Number(f[1]) * h[(f[2] ?? "px").toLowerCase()];
  };
  let s = o("width"), l = o("height");
  const i = (r = n.match(/\bviewBox\s*=\s*["']([^"']+)["']/i)) == null ? void 0 : r[1].trim().split(/[ ,]+/).map(Number);
  return (!s || !l) && i?.length === 4 && i.every(Number.isFinite) && (s || (s = Math.abs(i[2])), l || (l = Math.abs(i[3]))), Ze(s ?? 0, l ?? 0);
}
function df(e) {
  if (e.length >= 44 && yt(e, 0) === 1 && yt(e, 40) === 1179469088) {
    const t = Math.abs(Je(e, 16) - Je(e, 8)), r = Math.abs(Je(e, 20) - Je(e, 12)), n = Math.abs(Je(e, 32) - Je(e, 24)), o = Math.abs(Je(e, 36) - Je(e, 28));
    return Ze(t || n * 96 / 2540, r || o * 96 / 2540, n ? t * 2540 / n : 96, o ? r * 2540 / o : 96);
  }
  if (e.length >= 22 && yt(e, 0) === 2596720087) return Ze(Math.abs(or(e, 10) - or(e, 6)), Math.abs(or(e, 12) - or(e, 8)), st(e, 14), st(e, 14));
  for (const t of [512, 0]) {
    if (t + 14 > e.length) continue;
    const r = rr(e, t + 2), n = rr(e, t + 4), o = rr(e, t + 6), s = rr(e, t + 8);
    if (s > n && o > r) return Ze(s - n, o - r, 72, 72);
  }
  return null;
}
function pf(e) {
  return rf(e) ?? lf(e) ?? af(e) ?? cf(e) ?? uf(e) ?? ff(e) ?? hf(e) ?? df(e);
}
let ra = null, Ms = null;
const Rn = /* @__PURE__ */ new WeakMap();
function _o(e, t) {
  const r = t ? Rn.get(t) : Ms;
  r ? Rn.set(e, r) : Rn.delete(e);
}
function v$(e, t) {
  return _o(t, e), t;
}
function M$(e) {
  Ms = e;
}
function mf(e, t) {
  return Rn.has(t) && /^http:\/\/schemas.microsoft.com\/office\/drawing\/(2014|2015\/9\/8|2015\/10\/21|2016\/5\/(9|10|11|12|13|14|15))\/chartex$/.test(e);
}
function oa(e) {
  ra = e;
}
const k$ = oa;
function gf(e = !1, t) {
  return e ? t ? Rn.get(t) ?? null : Ms : ra;
}
let kr = null;
function $f(e) {
  kr = e;
}
function C$() {
  return kr !== null;
}
function sa(e, t) {
  if (!kr) return null;
  let r = null;
  try {
    r = kr(e, t);
  } catch {
    return null;
  }
  if (!r) return null;
  try {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(r)}`;
  } catch {
    return null;
  }
}
const bf = /* @__PURE__ */ new Set(["emf", "wmf", "pict", "pct", "pic"]), xf = { 1: "appear", 2: "fly", 3: "blinds", 4: "zoom", 5: "checkerboard", 6: "circle", 7: "fly", 8: "diamond", 9: "dissolve", 10: "fade", 11: "appear", 12: "fly", 13: "plus", 14: "randomBar", 15: "spin", 16: "split", 17: "stretch", 18: "strips", 19: "swivel", 20: "wheel", 21: "wheel", 22: "wipe", 23: "zoom", 24: "random", 25: "bounce", 26: "bounce", 28: "fade", 29: "float", 30: "float", 31: "grow", 32: "spin", 33: "float", 34: "swivel", 35: "fly", 36: "stretch", 37: "stretch", 38: "fly", 39: "float", 40: "spin", 41: "swivel", 42: "float", 43: "fly", 44: "spin", 45: "stretch", 46: "stretch", 47: "float", 48: "zoom", 49: "fly", 50: "stretch", 51: "swivel", 52: "stretch", 53: "grow", 59: "grow", 61: "spin", 62: "fade" }, vl = { 1: "u", 2: "r", 4: "d", 8: "l", 3: "rd", 6: "ru", 9: "lu", 12: "ld", 5: "horz", 10: "vert", 16: "in", 32: "out", 26: "in-vert", 42: "out-vert", 21: "in-horz", 37: "out-horz" }, wf = { fade: "fade", wipe: "wipe", barn: "split", blinds: "blinds", box: "zoom", checkerboard: "checkerboard", circle: "circle", diamond: "diamond", dissolve: "dissolve", plus: "plus", randombar: "randomBar", slide: "fly", strips: "strips", wedge: "wheel", wheel: "wheel", image: "fade" }, yf = /* @__PURE__ */ new Set([19, 26, 30, 31, 62]);
function la(e, t, r) {
  const n = xf[e], o = r?.match(/^([a-zA-Z]+)(?:\(([^)]*)\))?/), s = o?.[1].toLowerCase(), l = (o?.[2] ?? "").toLowerCase(), i = s ? wf[s] : void 0, a = (yf.has(e) ? n : i ?? n) ?? "fade";
  if (s === "box") return { effect: "zoom", dir: l === "out" ? "out" : "in" };
  if (s === "circle" || s === "diamond" || s === "plus") return { effect: a, dir: l === "in" ? "in" : "out" };
  if (s === "barn") return { effect: a, dir: `${l.startsWith("in") ? "in" : "out"}-${l.includes("vertical") ? "vert" : "horz"}` };
  if (s === "wheel") return { effect: a, dir: l || String(t || 1) };
  if (s === "checkerboard") return { effect: a, dir: l === "down" ? "down" : "across" };
  if (s === "randombar" || s === "blinds") return { effect: a, dir: l.startsWith("vert") ? "vert" : "horz" };
  if (s === "strips") return { effect: a, dir: { downleft: "ld", upleft: "lu", downright: "rd", upright: "ru" }[l] ?? vl[t] };
  if (s === "wipe" || s === "slide") {
    const c = l.includes("left") ? "l" : l.includes("right") ? "r" : l.includes("top") || l.includes("up") ? "u" : l.includes("bottom") || l.includes("down") ? "d" : void 0, u = { l: "r", r: "l", u: "d", d: "u" };
    return { effect: a, dir: c && (l.startsWith("from") ? c : u[c]) };
  }
  return e === 23 && !r ? { effect: a, dir: void 0 } : { effect: a, dir: vl[t] };
}
const ia = "http://www.w3.org/2003/InkML", ho = (e, t) => [...e.getElementsByTagName("*")].filter((r) => r.namespaceURI === ia && r.localName === t);
function vf(e, t) {
  if (e.length > 4e6) throw new Error("InkML 采样数据超限");
  const r = [], n = [], o = [], s = [], l = t.indexOf("X"), i = t.indexOf("Y");
  if (l < 0 || i < 0 || t.length > 32) throw new Error("InkML 通道不支持编辑");
  for (const a of e.split(",")) {
    if (!a.trim()) continue;
    const c = /\s*([!'\"]?)\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|\*)/gy;
    let u = 0, f = 0;
    for (; u < a.length && a.slice(u).trim(); ) {
      c.lastIndex = u;
      const h = c.exec(a);
      if (!h || f >= t.length) throw new Error("InkML 含无法编辑的采样编码");
      u = c.lastIndex;
      const [, p, d] = h;
      if (d !== "*") {
        const m = Number(d);
        if (!Number.isFinite(m)) throw new Error("InkML 非有限采样值");
        const $ = r.length && (p || s[f]) || "!";
        s[f] = $, $ === "'" ? (o[f] = m, n[f] = (n[f] ?? 0) + m) : $ === '"' ? (o[f] = (o[f] ?? 0) + m, n[f] = (n[f] ?? 0) + o[f]) : (n[f] = m, o[f] = 0);
      }
      if (!Number.isFinite(n[f])) throw new Error("InkML 缺少首点通道值");
      f++;
    }
    if (!Number.isFinite(n[l]) || !Number.isFinite(n[i])) throw new Error("InkML 缺少坐标");
    if (r.push({ x: n[l], y: n[i], values: n.slice(0, f) }), r.length > 1e5) throw new Error("InkML 笔画采样超限");
  }
  return r;
}
function Mf(e) {
  if (e.namespaceURI !== ia || e.localName !== "ink") throw new Error("不是 InkML 文档");
  const t = [e, ...e.getElementsByTagName("*")], r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  for (const h of t) for (const p of Array.from(h.children)) n.set(p, h);
  const o = (h, p) => {
    let d = h;
    for (; d; ) {
      const m = I(d, p);
      if (m !== null) return m;
      d = n.get(d);
    }
    return null;
  };
  for (const h of t) {
    const p = I(h, "xml:id");
    if (p) {
      if (r.has(p)) throw new Error("InkML 身份重复");
      r.set(p, h);
    }
  }
  const s = (h) => h != null && h.startsWith("#") ? r.get(h.slice(1)) : void 0, l = ho(e, "trace"), i = [];
  if (l.length > 1e3) throw new Error("InkML 笔画数量超限");
  const a = w(e, "traceFormat") ?? ho(e, "traceFormat")[0], c = ho(e, "brush");
  let u, f = 0;
  if (l.forEach((h, p) => {
    var d;
    const m = [], $ = /* @__PURE__ */ new Set();
    let x = s(o(h, "contextRef"));
    for (; x; ) {
      if ($.has(x) || m.length > 32) throw new Error("InkML 上下文引用循环");
      $.add(x), m.push(x), x = s(I(x, "contextRef"));
    }
    const b = (R) => m.map((O) => I(O, R)).find((O) => O !== null) ?? null, M = (R) => m.map((O) => w(O, R)).find((O) => O !== null) ?? null, E = M("inkSource") ?? s(b("inkSourceRef")), y = M("traceFormat") ?? s(b("traceFormatRef")) ?? w(E ?? null, "traceFormat") ?? a, v = y ? K(y, "channel").map((R) => (I(R, "name") ?? "").toUpperCase()) : ["X", "Y"], k = vf(h.textContent ?? "", v);
    if ((f += k.length) > 1e5) throw new Error("InkML 采样总量超限");
    const T = s(o(h, "brushRef")) ?? s(b("brushRef")) ?? c[0];
    let S = "#000000", N = 0;
    for (const R of K(T ?? null, "brushProperty")) {
      const O = (d = I(R, "name")) == null ? void 0 : d.toLowerCase(), U = I(R, "value") ?? "";
      O === "color" ? S = /^[\da-f]{6}$/i.test(U) ? "#" + U : U : (O === "width" || O === "height") && (N = Math.max(N, Number(U) || 0));
    }
    const P = s(b("canvasRef")), L = w(P ?? null, "traceFormat"), A = K(L, "channel").find((R) => I(R, "name") === "X"), z = K(L, "channel").find((R) => I(R, "name") === "Y");
    if (A && z && ["min", "max"].every((R) => I(A, R) !== null && I(z, R) !== null)) {
      const R = { x: Number(I(A, "min")), y: Number(I(z, "min")), width: Number(I(A, "max")) - Number(I(A, "min")), height: Number(I(z, "max")) - Number(I(z, "min")) };
      if (Object.values(R).every(Number.isFinite) && R.width >= 0 && R.height >= 0) {
        if (u && JSON.stringify(u) !== JSON.stringify(R)) throw new Error("InkML 多画布不支持共同编辑");
        u = R;
      }
    }
    i.push({ id: I(h, "xml:id") ?? `trace-${p + 1}`, points: k, channels: v, color: S, width: N });
  }), !u) {
    let h = 1 / 0, p = 1 / 0, d = -1 / 0, m = -1 / 0;
    for (const $ of i) for (const x of $.points) h = Math.min(h, x.x), p = Math.min(p, x.y), d = Math.max(d, x.x), m = Math.max(m, x.y);
    u = Number.isFinite(h) ? { x: h, y: p, width: d - h, height: m - p } : { x: 0, y: 0, width: 1, height: 1 };
  }
  return { strokes: i, bounds: u };
}
function kf(e, t, r) {
  var n, o;
  const s = Mf(e), l = s.strokes.filter((E) => E.points.length >= 2).map((E) => ({ pts: E.points.map((y) => [y.x, y.y]), brush: E }));
  if (!l.length) return [];
  const { x: i, y: a, width: c, height: u } = s.bounds, f = i + c, h = a + u, p = f - i, d = h - a, m = Math.min(p > 0 ? t / p : 1 / 0, d > 0 ? r / d : 1 / 0), $ = Number.isFinite(m) && m > 0 ? m : 1, x = (t - p * $) / 2, b = (r - d * $) / 2, M = [];
  for (const E of l) {
    const y = E.pts.map(([A, z]) => [x + (A - i) * $, b + (z - a) * $]);
    let v = 1 / 0, k = 1 / 0, T = -1 / 0, S = -1 / 0;
    for (const [A, z] of y) A < v && (v = A), z < k && (k = z), A > T && (T = A), z > S && (S = z);
    const N = (A) => String(Math.round(A * 100) / 100), P = "M " + y.map(([A, z]) => `${N(A - v)} ${N(z - k)}`).join(" L "), L = Math.max(0.75, Math.min((((n = E.brush) == null ? void 0 : n.width) ?? 0) * $ || 2, 24));
    M.push({ kind: "shape", x: v, y: k, w: Math.max(T - v, 0), h: Math.max(S - k, 0), rot: 0, flipH: !1, flipV: !1, path: P, fill: { type: "none" }, stroke: { color: ((o = E.brush) == null ? void 0 : o.color) ?? "rgb(0,0,0)", width: L, dash: null, cap: "round", join: "round" }, text: null, openGeom: !0 });
  }
  return M;
}
const Cf = new RegExp("[" + ["Arabic", "Hebrew", "Syriac", "Thaana", "Nko", "Thai", "Lao", "Khmer", "Myanmar", "Tibetan", "Devanagari", "Bengali", "Gurmukhi", "Gujarati", "Oriya", "Tamil", "Telugu", "Kannada", "Malayalam", "Sinhala"].map((e) => `\\p{Script=${e}}`).join("") + "]", "u");
function Ef(e, t) {
  const { latin: r, eastAsian: n, complexScript: o } = e, s = [];
  return r && s.push(r), n && n !== r && s.push(n), o && o !== r && o !== n && Cf.test(t) && s.push(o), s;
}
const nn = { transform: 1, geometry: 2, fill: 4, stroke: 8, effects: 16, style: 32 }, Te = { b: 1, i: 2, u: 4, strike: 8, size: 16, fonts: 32, color: 64, baseline: 128, spacing: 256, caps: 512, outline: 1024, gradient: 2048, highlight: 4096, underlineColor: 8192, fontLatin: 16384, fontEastAsian: 32768, fontComplexScript: 65536 }, En = { bullet: 1, bulletColor: 2, bulletFont: 4, bulletSize: 8, rtl: 16 };
function E$(e) {
  return e;
}
function S$(e) {
  return e;
}
function L$(e) {
  return e;
}
const aa = { title: ["title", "ctrTitle"], ctrTitle: ["ctrTitle", "title"], body: ["body", "subTitle", "obj"], subTitle: ["subTitle", "body"], obj: ["obj", "body"] };
function Sf(e, t, r) {
  const n = r.idx ?? null;
  if (n !== null) {
    const s = e.find((l) => {
      var i;
      return ((i = t(l)) == null ? void 0 : i.idx) === n;
    });
    if (s) return s;
  }
  const o = r.type ?? null;
  if (o) for (const s of aa[o] ?? [o]) {
    const l = e.find((i) => {
      var a;
      return ((a = t(i)) == null ? void 0 : a.type) === s;
    });
    if (l) return l;
  }
  if (!o && n === null) return e.find((s) => {
    var l;
    return ((l = t(s)) == null ? void 0 : l.type) === "body";
  });
}
function bn(e, t) {
  if (!e) return;
  const r = {}, n = w(e, "outerShdw"), o = w(e, "innerShdw"), s = n ?? o;
  if (s) {
    const c = se(F(s, "dist") ?? 0), u = (F(s, "dir") ?? 0) / 6e4 * (Math.PI / 180);
    r.shadow = { dx: c * Math.cos(u), dy: c * Math.sin(u), blur: se(F(s, "blurRad") ?? 0), color: $e(s, t) ?? "rgba(0,0,0,0.4)", inner: s === o };
  }
  const l = w(e, "glow");
  l && (r.glow = { radius: se(F(l, "rad") ?? 0), color: $e(l, t) ?? "rgba(0,0,0,0.4)" });
  const i = w(e, "softEdge");
  i && (r.softEdge = se(F(i, "rad") ?? 0));
  const a = w(e, "reflection");
  return a && (r.reflection = { alpha: (F(a, "stA") ?? 5e4) / 1e5, size: (F(a, "endPos") ?? 35e3) / 1e5, distance: se(F(a, "dist") ?? 0) }), Object.keys(r).length || e.localName === "effectLst" ? r : void 0;
}
const Lf = { none: "none", triangle: "triangle", stealth: "stealth", diamond: "diamond", oval: "oval", arrow: "arrow" }, Ml = { sm: 2, med: 3, lg: 5 };
function kl(e) {
  if (!e) return;
  const t = Lf[I(e, "type") ?? "none"];
  if (t) return { type: t, w: Ml[I(e, "w") ?? "med"] ?? 3, h: Ml[I(e, "len") ?? "med"] ?? 3 };
}
function Tf(e, t) {
  if (!e) return;
  const r = w(e, "sp3d"), n = w(e, "scene3d");
  if (!r && !n) return;
  const o = {}, s = F(r, "extrusionH");
  s !== null && (o.extrusion = se(s));
  const l = w(r, "bevelT");
  l && (o.bevelTop = se(F(l, "h") ?? 38100));
  const i = w(r, "bevelB");
  i && (o.bevelBottom = se(F(i, "h") ?? 38100));
  const a = F(r, "contourW");
  a !== null && (o.contourWidth = se(a));
  for (const [M, E] of [["extrusionClr", "extrusionColor"], ["contourClr", "contourColor"]]) {
    const y = $e(w(r, M), t);
    y && (o[E] = y);
  }
  const c = I(r, "prstMaterial");
  c && (o.material = c);
  const u = w(n, "camera"), f = I(u, "prst");
  f && (o.camera = f);
  const h = F(u, "fov"), p = F(u, "zoom");
  h !== null && (o.fieldOfView = h / 6e4), p !== null && (o.zoom = p / 1e5);
  const d = F(r, "z");
  d !== null && (o.z = se(d));
  const m = w(n, "lightRig"), $ = I(m, "rig"), x = I(m, "dir");
  $ && (o.lightRig = $), x && (o.lightDirection = x), l && (o.bevelTopWidth = se(F(l, "w") ?? 76200)), i && (o.bevelBottomWidth = se(F(i, "w") ?? 76200));
  const b = w(u, "rot");
  return b && (o.rotX = (F(b, "lat") ?? 0) / 6e4, o.rotY = (F(b, "lon") ?? 0) / 6e4, o.rotZ = (F(b, "rev") ?? 0) / 6e4), Object.keys(o).length ? o : void 0;
}
const ca = Object.freeze({ push: "l", pull: "l", cover: "l", wipe: "l", split: "horz-out", zoom: "out", checker: "horz", blinds: "horz", comb: "horz", randomBar: "horz", strips: "lu", vortex: "l", ripple: "center", glitter: "l", warp: "out", flythrough: "in", shred: "in", reveal: "l", pan: "l", doors: "horz", window: "horz", prism: "l" }), Pf = Object.freeze({ ...ca, switch: "l", flip: "l", ferris: "l", gallery: "l", conveyor: "l" });
function Af(e) {
  return ca[e];
}
function T$(e) {
  return Pf[e];
}
const Ot = "http://schemas.openxmlformats.org/markup-compatibility/2006";
function ua(e, t) {
  var r;
  if (e.namespaceURI !== Ot) return null;
  let n = null;
  for (let o = e.firstElementChild; o; o = o.nextElementSibling) {
    if (o.namespaceURI !== Ot || (o.localName === "Fallback" && (n ?? (n = o)), o.localName !== "Choice")) continue;
    const s = ((r = o.getAttribute("Requires")) == null ? void 0 : r.trim().split(/\s+/).filter(Boolean)) ?? [];
    if (s.length && s.every((l) => {
      const i = o.lookupNamespaceURI(l);
      return i !== null && t.has(i);
    })) return o;
  }
  return n;
}
const zn = "http://schemas.openxmlformats.org/presentationml/2006/main", po = "http://schemas.openxmlformats.org/markup-compatibility/2006", If = "http://www.w3.org/2000/xmlns/", Nf = "http://www.w3.org/XML/1998/namespace", fa = 4096;
function rn(e, t, r) {
  const n = [];
  for (let o = e?.firstElementChild ?? null; o; o = o.nextElementSibling) o.namespaceURI === t && (!r || o.localName === r) && n.push(o);
  return n;
}
function Rf(e) {
  if (!e) return { timing: null, readonly: !1 };
  const t = rn(e, zn, "timing"), r = rn(e, po, "AlternateContent").filter((o) => rn(o, po).some((s) => rn(s, zn, "timing").length > 0));
  if (t.length) return { timing: t[0], readonly: t.length > 1 || r.length > 0 };
  if (!r.length) return { timing: null, readonly: !1 };
  const n = rn(r[0], po, "Fallback")[0] ?? null;
  return { timing: rn(n, zn, "timing")[0] ?? null, readonly: !0 };
}
function Cl(e, t) {
  return e.seen.has(t) ? !0 : (e.seen.add(t), e.nodes++, e.nodes <= fa);
}
function lt(e, t) {
  if (!Cl(t, e)) return null;
  const r = [];
  for (let n = e.firstElementChild; n; n = n.nextElementSibling) {
    if (!Cl(t, n) || n.namespaceURI !== zn) return null;
    r.push(n);
  }
  return r;
}
function Se(e, t, r) {
  const n = lt(e, r);
  return n && n.length === t.length && n.every((o, s) => o.localName === t[s]) ? n : null;
}
function ie(e, t) {
  const r = new Set(t);
  return Array.from(e.attributes).every((n) => n.namespaceURI === If || n.namespaceURI === Nf ? !0 : n.namespaceURI === null && r.has(n.localName));
}
function Cr(e, t, r) {
  if (!e || !/^\d+$/.test(e)) return null;
  const n = Number(e);
  return Number.isSafeInteger(n) && n >= t && n <= r ? n : null;
}
function Bn(e, t) {
  const r = Cr(e.getAttribute("id"), 1, 2147483647);
  return r === null || t.ids.has(r) ? !1 : (t.ids.add(r), !0);
}
function ks(e, t, r) {
  var n;
  if (e.localName !== "stCondLst" || !ie(e, [])) return !1;
  const o = Se(e, ["cond"], r);
  return !!o && ie(o[0], ["delay"]) && o[0].getAttribute("delay") === String(t) && (((n = lt(o[0], r)) == null ? void 0 : n.length) ?? -1) === 0;
}
function zf(e, t) {
  var r;
  if (e.localName !== "tgtEl" || !ie(e, [])) return null;
  const n = Se(e, ["spTgt"], t);
  return !n || !ie(n[0], ["spid"]) || (((r = lt(n[0], t)) == null ? void 0 : r.length) ?? -1) !== 0 ? null : Cr(n[0].getAttribute("spid"), 1, 2147483647);
}
function Of(e, t, r) {
  if (e.localName !== "attrNameLst" || !ie(e, [])) return !1;
  const n = lt(e, r);
  return !!n && n.length === t.length && n.every((o, s) => {
    var l;
    return o.localName === "attrName" && ie(o, []) && (((l = lt(o, r)) == null ? void 0 : l.length) ?? -1) === 0 && o.textContent === t[s];
  });
}
function Hn(e, t, r, n, o) {
  if (e.localName !== "cBhvr" || !ie(e, [])) return null;
  const s = r.length ? ["cTn", "tgtEl", "attrNameLst"] : ["cTn", "tgtEl"], l = Se(e, s, n);
  if (!l) return null;
  const i = l[0];
  if (!ie(i, ["id", "dur", "fill"]) || !Bn(i, n) || i.getAttribute("dur") !== String(t) || i.getAttribute("fill") !== "hold") return null;
  const a = lt(i, n);
  if (!a || (o === void 0 ? a.length !== 0 : a.length !== 1 || !ks(a[0], o, n))) return null;
  const c = zf(l[1], n);
  return c === null || r.length && !Of(l[2], r, n) ? null : c;
}
function El(e, t, r, n) {
  var o;
  if (e.localName !== "set" || !ie(e, [])) return null;
  const s = Se(e, ["cBhvr", "to"], n), l = s ? Hn(s[0], 1, ["style.visibility"], n, r) : null, i = s && ie(s[1], []) ? Se(s[1], ["strVal"], n) : null;
  return l === null || !i || !ie(i[0], ["val"]) || i[0].getAttribute("val") !== t || (((o = lt(i[0], n)) == null ? void 0 : o.length) ?? -1) !== 0 ? null : l;
}
const jf = Object.freeze({ 2: Object.freeze({ 8: "slide(fromLeft)", 2: "slide(fromRight)", 1: "slide(fromTop)", 4: "slide(fromBottom)" }), 22: Object.freeze({ 8: "wipe(right)", 2: "wipe(left)", 1: "wipe(down)", 4: "wipe(up)" }), 23: Object.freeze({ 16: "box(in)", 32: "box(out)" }) });
function Ff(e, t, r, n, o, s) {
  var l;
  if (e.localName !== "animEffect" || !ie(e, ["transition", "filter"])) return null;
  const i = t === "10" ? "fade" : t === "9" ? "dissolve" : r ? (l = jf[t]) == null ? void 0 : l[r] : void 0;
  if (!i || e.getAttribute("filter") !== i || e.getAttribute("transition") !== (n === "exit" ? "out" : "in")) return null;
  const a = Se(e, ["cBhvr"], s);
  return a ? Hn(a[0], o, [], s) : null;
}
function Uf(e, t, r, n) {
  var o;
  if (t === "61") {
    if (e.localName !== "animRot" || !ie(e, ["by"]) || e.getAttribute("by") !== "21600000") return null;
    const l = Se(e, ["cBhvr"], n);
    return l ? Hn(l[0], r, ["r"], n) : null;
  }
  if (e.localName !== "animScale" || !ie(e, [])) return null;
  const s = Se(e, ["cBhvr", "by"], n);
  return !s || !ie(s[1], ["x", "y"]) || s[1].getAttribute("x") !== "125000" || s[1].getAttribute("y") !== "125000" || (((o = lt(s[1], n)) == null ? void 0 : o.length) ?? -1) !== 0 ? null : Hn(s[0], r, ["ppt_w", "ppt_h"], n);
}
function Df(e) {
  if (!e) return !1;
  const t = e.trim().split(/\s+/);
  if (t.length < 7 || t[0] !== "M" || t[t.length - 1] !== "E") return !1;
  let r = 0;
  for (let n = 0; n < t.length - 1; ) {
    const o = t[n++];
    if ((r === 0 ? o !== "M" : o !== "L") || n + 1 >= t.length) return !1;
    const s = Number(t[n++]), l = Number(t[n++]);
    if (!Number.isFinite(s) || !Number.isFinite(l) || r === 0 && (s !== 0 || l !== 0)) return !1;
    r++;
  }
  return r >= 2 && r <= 256;
}
function Bf(e, t, r) {
  if (e.localName !== "animMotion" || !ie(e, ["origin", "path", "pathEditMode"]) || e.getAttribute("origin") !== "layout" || e.getAttribute("pathEditMode") !== "relative" || !Df(e.getAttribute("path"))) return null;
  const n = Se(e, ["cBhvr"], r);
  return n ? Hn(n[0], t, ["ppt_x", "ppt_y"], r) : null;
}
function Hf(e, t) {
  var r, n;
  if (e.localName !== "par" || !ie(e, [])) return null;
  const o = (r = Se(e, ["cTn"], t)) == null ? void 0 : r[0];
  if (!o || !ie(o, ["id", "presetID", "presetClass", "presetSubtype", "dur", "fill", "nodeType"]) || !Bn(o, t)) return null;
  const s = o.getAttribute("presetID"), l = o.getAttribute("presetClass"), i = o.getAttribute("presetSubtype"), a = Cr(o.getAttribute("dur"), 60, 1e4), c = o.getAttribute("nodeType");
  if (!s || !l || a === null || o.getAttribute("fill") !== "hold" || !["clickEffect", "withEffect", "afterEffect"].includes(c ?? "")) return null;
  const u = Se(o, ["stCondLst", "childTnLst"], t), f = u ? Cr(((n = u[0].firstElementChild) == null ? void 0 : n.getAttribute("delay")) ?? null, 0, 3e5) : null;
  if (!u || f === null || !ks(u[0], f, t) || !ie(u[1], [])) return null;
  const h = lt(u[1], t);
  if (!h) return null;
  let p = [];
  if (l === "path" && s === "0" && i === null && h.length === 1) p = [Bf(h[0], a, t)];
  else if (l === "emph" && ["59", "61"].includes(s) && i === null && h.length === 1) p = [Uf(h[0], s, a, t)];
  else if (["entr", "exit"].includes(l) && ["1", "2", "9", "10", "22", "23"].includes(s)) {
    if (["2", "22", "23"].includes(s) !== (i !== null)) return null;
    const d = l === "entr" ? "visible" : "hidden", m = l === "entr" ? 0 : a;
    if (s === "1" && h.length === 1) p = [El(h[0], d, m, t)];
    else if (h.length === 2) {
      const $ = l === "entr" ? 1 : 0, x = 1 - $;
      p = [Ff(h[$], s, i, l, a, t), El(h[x], d, m, t)];
    }
  }
  return !p.length || p.some((d) => d === null) || p.some((d) => d !== p[0]) ? null : c;
}
function Wf(e, t) {
  var r;
  if (e.localName !== "par" || !ie(e, [])) return !1;
  const n = (r = Se(e, ["cTn"], t)) == null ? void 0 : r[0];
  if (!n || !ie(n, ["id", "fill", "nodeType"]) || !Bn(n, t) || n.getAttribute("fill") !== "hold" || n.getAttribute("nodeType") !== "clickEffect") return !1;
  const o = Se(n, ["stCondLst", "childTnLst"], t);
  if (!o || !ks(o[0], "indefinite", t) || !ie(o[1], [])) return !1;
  const s = lt(o[1], t);
  if (!(s != null && s.length)) return !1;
  const l = s.map((i) => Hf(i, t));
  return l[0] === "clickEffect" && l.slice(1).every((i) => i === "withEffect" || i === "afterEffect");
}
function Vf(e) {
  var t, r, n, o, s, l, i;
  const a = { nodes: 0, ids: /* @__PURE__ */ new Set(), seen: /* @__PURE__ */ new Set() };
  if (e.namespaceURI !== zn || e.localName !== "timing" || !ie(e, [])) return !1;
  const c = (t = Se(e, ["tnLst"], a)) == null ? void 0 : t[0];
  if (!c || !ie(c, [])) return !1;
  const u = (r = Se(c, ["par"], a)) == null ? void 0 : r[0];
  if (!u || !ie(u, [])) return !1;
  const f = (n = Se(u, ["cTn"], a)) == null ? void 0 : n[0];
  if (!f || !ie(f, ["id", "dur", "restart", "nodeType"]) || !Bn(f, a) || f.getAttribute("dur") !== "indefinite" || f.getAttribute("restart") !== "never" || f.getAttribute("nodeType") !== "tmRoot") return !1;
  const h = (o = Se(f, ["childTnLst"], a)) == null ? void 0 : o[0];
  if (!h || !ie(h, [])) return !1;
  const p = (s = Se(h, ["seq"], a)) == null ? void 0 : s[0];
  if (!p || !ie(p, ["concurrent", "nextAc"]) || p.getAttribute("concurrent") !== "1" || p.getAttribute("nextAc") !== "seek") return !1;
  const d = (l = Se(p, ["cTn"], a)) == null ? void 0 : l[0];
  if (!d || !ie(d, ["id", "dur", "nodeType"]) || !Bn(d, a) || d.getAttribute("dur") !== "indefinite" || d.getAttribute("nodeType") !== "mainSeq") return !1;
  const m = (i = Se(d, ["childTnLst"], a)) == null ? void 0 : i[0];
  if (!m || !ie(m, [])) return !1;
  const $ = lt(m, a);
  return !!($ != null && $.length) && $.every((x) => Wf(x, a));
}
function Xf(e) {
  return !Vf(e);
}
const Yf = { slow: 1e3, med: 750, fast: 500 }, qo = "http://schemas.openxmlformats.org/presentationml/2006/main", Cs = "http://schemas.microsoft.com/office/powerpoint/2010/main", ha = "http://schemas.microsoft.com/office/powerpoint/2015/09/main", Gf = /* @__PURE__ */ new Set([Cs, ha]), Zf = { fade: "fade", cut: "cut", push: "push", pull: "pull", cover: "cover", wipe: "wipe", split: "split", zoom: "zoom", dissolve: "dissolve", checker: "checker", blinds: "blinds", comb: "comb", wheel: "wheel", circle: "circle", diamond: "diamond", plus: "plus", wedge: "wedge", newsflash: "newsflash", randomBar: "randomBar", strips: "strips", random: "dissolve", fadeThroughBlack: "fade", vortex: "vortex", switch: "switch", flip: "flip", ripple: "ripple", honeycomb: "honeycomb", glitter: "glitter", warp: "warp", flythrough: "flythrough", flash: "flash", shred: "shred", reveal: "reveal", wheelReverse: "wheelReverse", ferris: "ferris", gallery: "gallery", conveyor: "conveyor", pan: "pan", doors: "doors", window: "window", prism: "prism", morph: "morph" }, _f = /* @__PURE__ */ new Set(["vortex", "switch", "flip", "ripple", "honeycomb", "glitter", "warp", "flythrough", "flash", "shred", "reveal", "wheelReverse", "ferris", "gallery", "conveyor", "pan", "doors", "window", "prism"]);
function qf(e) {
  const t = Zf[e.localName];
  if (!t) return;
  const r = e.namespaceURI;
  return e.localName === "morph" ? r === ha ? t : void 0 : _f.has(e.localName) ? r === Cs ? t : void 0 : r === qo ? t : void 0;
}
function mo(e, t, r) {
  const n = Array.from(e.attributes).find((s) => s.localName === t && s.namespaceURI === r);
  if (!n || n.value === "") return null;
  const o = Number(n.value);
  return Number.isFinite(o) ? o : null;
}
function Sl(e, t, r) {
  if (!e) return null;
  for (let n = e.firstElementChild; n; n = n.nextElementSibling) if (n.namespaceURI === t && n.localName === r) return n;
  return null;
}
function Jf(e, t, r) {
  const n = [];
  if (!e) return n;
  for (let o = e.firstElementChild; o; o = o.nextElementSibling) o.namespaceURI === t && o.localName === r && n.push(o);
  return n;
}
function Jo(e) {
  const t = Kf(e);
  if (!t) return;
  let r = "none", n, o;
  for (let a = t.firstElementChild; a; a = a.nextElementSibling) {
    const c = qf(a);
    if (c) {
      if (r = c, n = a.getAttribute("dir") ?? a.getAttribute("orient") ?? void 0, a.localName === "morph") {
        const u = a.getAttribute("option");
        o = u === "byWord" || u === "byChar" ? u : "byObject";
      }
      if (a.localName === "split") {
        const u = a.getAttribute("orient") ?? "horz", f = a.getAttribute("dir") ?? "out";
        n = `${u}-${f}`;
      }
      break;
    }
  }
  const s = mo(t, "dur", Cs) ?? mo(t, "dur", null), l = r === "none" ? 0 : s ?? Yf[t.getAttribute("spd") ?? "fast"] ?? 500, i = mo(t, "advTm", null);
  return n ?? (n = Af(r)), { type: r, dir: n, durationMs: r === "none" ? 0 : Math.max(80, Math.min(5e3, l)), advanceAfterMs: i ?? void 0, morphBy: o };
}
function Kf(e) {
  if (!e) return null;
  const t = Sl(e, qo, "transition");
  if (t) return t;
  for (const r of Jf(e, Ot, "AlternateContent")) {
    const n = ua(r, Gf), o = Sl(n, qo, "transition");
    if (o) return o;
  }
  return null;
}
const Qf = { entr: "entrance", exit: "exit", emph: "emphasis", path: "motion", mediacall: "emphasis", verb: "emphasis" };
function eh(e, t, r, n = 256) {
  const o = e.match(/[MLCZEmlcze]|-?\d*\.?\d+(?:[eE][-+]?\d+)?/g);
  if (!o) return;
  const s = [];
  let l = [0, 0], i = [0, 0], a = 0;
  const c = () => {
    const b = Number(o[a++]);
    return Number.isFinite(b) ? b : 0;
  }, u = (b) => {
    s.push(b), l = b;
  };
  for (; a < o.length; ) switch (o[a++]) {
    case "M":
    case "m": {
      const b = [c(), c()];
      i = b, s.length = 0, u(b);
      break;
    }
    case "L":
    case "l":
      u([c(), c()]);
      break;
    case "C":
    case "c": {
      const [b, M, E, y, v, k] = [c(), c(), c(), c(), c(), c()], [T, S] = l;
      for (let N = 1; N <= 16; N++) {
        const P = N / 16, L = 1 - P;
        s.push([L * L * L * T + 3 * L * L * P * b + 3 * L * P * P * E + P * P * P * v, L * L * L * S + 3 * L * L * P * M + 3 * L * P * P * y + P * P * P * k]);
      }
      l = [v, k];
      break;
    }
    case "Z":
    case "z":
      u([i[0], i[1]]);
      break;
    default:
      a = o.length;
  }
  if (s.length < 2) return;
  const [f, h] = s[0], p = s.map(([b, M]) => [(b - f) * t, (M - h) * r]);
  if (p.length <= n) return p;
  const d = [0];
  for (let b = 1; b < p.length; b++) d.push(d[b - 1] + Math.hypot(p[b][0] - p[b - 1][0], p[b][1] - p[b - 1][1]));
  const m = d[d.length - 1];
  if (!(m > 0)) return;
  const $ = [];
  let x = 1;
  for (let b = 0; b < n; b++) {
    const M = m * b / (n - 1);
    for (; x < d.length - 1 && d[x] < M; ) x++;
    const E = d[x] - d[x - 1], y = E > 0 ? (M - d[x - 1]) / E : 0;
    $.push([p[x - 1][0] + (p[x][0] - p[x - 1][0]) * y, p[x - 1][1] + (p[x][1] - p[x - 1][1]) * y]);
  }
  return $;
}
function da(e, t = 8) {
  for (let r = e.firstElementChild; r; r = r.nextElementSibling) {
    if (r.localName === "animMotion") {
      const n = I(r, "path");
      if (n) return n;
    }
    if (t > 0) {
      const n = da(r, t - 1);
      if (n) return n;
    }
  }
  return null;
}
function pa(e, t = 8) {
  for (let r = e.firstElementChild; r; r = r.nextElementSibling) {
    if (r.localName === "spTgt") {
      const n = F(r, "spid");
      if (n !== null) return n;
    }
    if (t > 0) {
      const n = pa(r, t - 1);
      if (n !== null) return n;
    }
  }
  return null;
}
function ma(e, t = 8) {
  for (let r = e.firstElementChild; r; r = r.nextElementSibling) {
    if (r.localName === "pRg") {
      const n = F(r, "st"), o = F(r, "end");
      if (n !== null && o !== null && o >= n) return { start: n, end: o };
    }
    if (t > 0) {
      const n = ma(r, t - 1);
      if (n) return n;
    }
  }
}
const th = /* @__PURE__ */ new Set(["animEffect", "anim", "animRot", "animScale", "animClr", "animMotion"]);
function ga(e, t = 8, r = !1) {
  let n = null;
  for (let o = e.firstElementChild; o; o = o.nextElementSibling) {
    const s = r || th.has(o.localName);
    if (o.localName === "cTn") {
      const l = I(o, "dur");
      if (l && l !== "indefinite") {
        const i = Number(l);
        if (Number.isFinite(i) && i > 1 && r) return i;
        Number.isFinite(i) && i > 1 && (n === null || i > n) && (n = i);
      }
    }
    if (t > 0) {
      const l = ga(o, t - 1, s);
      if (l !== null && s) return l;
      l !== null && (n === null || l > n) && (n = l);
    }
  }
  return n;
}
function $a(e, t = 8) {
  for (let r = e.firstElementChild; r; r = r.nextElementSibling) {
    if (r.localName === "animEffect") {
      const n = I(r, "filter");
      if (n) return n;
    }
    if (t > 0) {
      const n = $a(r, t - 1);
      if (n) return n;
    }
  }
  return null;
}
function ba(e, t = 8) {
  for (let r = e.firstElementChild; r; r = r.nextElementSibling) {
    if (r.localName === "animScale") {
      const n = w(r, "from"), o = w(r, "to"), s = [F(n, "x"), F(n, "y"), F(o, "x"), F(o, "y")];
      if (s.every((l) => l !== null && Number.isFinite(l))) return { fromX: s[0] / 1e5, fromY: s[1] / 1e5, toX: s[2] / 1e5, toY: s[3] / 1e5 };
    }
    if (t > 0) {
      const n = ba(r, t - 1);
      if (n) return n;
    }
  }
}
function xa(e, t = 8) {
  for (let r = e.firstElementChild; r; r = r.nextElementSibling) {
    if (r.localName === "animRot") {
      const n = F(r, "from"), o = F(r, "to"), s = F(r, "by");
      if (n !== null || o !== null || s !== null) {
        const l = n ?? 0;
        return { from: l / 6e4, to: (o ?? l + (s ?? 0)) / 6e4 };
      }
    }
    if (t > 0) {
      const n = xa(r, t - 1);
      if (n) return n;
    }
  }
}
function wa(e, t = 8) {
  for (let r = e.firstElementChild; r; r = r.nextElementSibling) {
    if (r.localName === "cmd") {
      if ((I(r, "type") ?? "call") !== "call") return null;
      const n = I(r, "cmd");
      if (n === "play" || n === "pause" || n === "resume" || n === "stop" || n === "togglePause") return { action: n };
      const o = /^playFrom\((\d+(?:\.\d+)?)\)$/.exec(n ?? "");
      if (!o) return null;
      const s = Number(o[1]);
      return Number.isFinite(s) ? { action: "play", fromSeconds: s } : null;
    }
    if (t > 0) {
      const n = wa(r, t - 1);
      if (n) return n;
    }
  }
  return null;
}
function nh(e) {
  const t = w(w(e, "stCondLst"), "cond"), r = I(t, "delay");
  if (!r || r === "indefinite") return 0;
  const n = Number(r);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}
function rh(e) {
  const t = [], r = [], n = [];
  let o = { element: e, depth: 0, insidePreset: !1 }, s = 0;
  for (; o; ) {
    if (++s > fa) return null;
    const l = !o.insidePreset && o.depth <= 25 && o.element.localName === "cTn" && !!I(o.element, "presetClass");
    l && t.push({ element: o.element, order: s }), !o.insidePreset && (o.element.localName === "audio" || o.element.localName === "video") && r.push({ element: o.element, order: s, kind: o.element.localName });
    const i = o.insidePreset || l, a = o.element.firstElementChild;
    if (a) {
      n.push({ next: a.nextElementSibling, depth: o.depth + 1, insidePreset: i }), o = { element: a, depth: o.depth + 1, insidePreset: i };
      continue;
    }
    for (o = null; n.length && !o; ) {
      const c = n[n.length - 1], u = c.next;
      if (!u) {
        n.pop();
        continue;
      }
      c.next = u.nextElementSibling, o = { element: u, depth: c.depth, insidePreset: c.insidePreset };
    }
  }
  return { presets: t, medias: r };
}
function oh(e) {
  const t = w(e.element, "cMediaNode") ?? null;
  if (!t) return null;
  const r = F(w(w(t, "tgtEl"), "spTgt"), "spid");
  if (r === null) return null;
  const n = F(t, "vol") ?? 8e4, o = F(t, "mute") === 1, s = w(t, "cTn");
  return { spid: r, kind: e.kind, volume: o ? 0 : Math.max(0, Math.min(1, n / 1e5)), loop: I(s, "repeatCount") === "indefinite", clickGroup: 0 };
}
function sh(e, t = 0, r = 0) {
  if (!e) return { readonly: !1 };
  const n = [];
  let o = Xf(e);
  const s = rh(e);
  if (!s) return { readonly: !0 };
  const l = [];
  for (const { element: f, order: h } of s.presets) {
    const p = ih(f, t, r);
    p ? l.push({ order: h, step: p }) : o = !0;
  }
  if (!l.length && !s.medias.length) return { readonly: o };
  const i = s.medias.map((f) => ({ raw: f, timing: oh(f) })).filter((f) => f.timing !== null), a = [...l.map((f) => ({ order: f.order, step: f.step })), ...i.filter((f) => f.timing).map((f) => ({ order: f.raw.order, media: f }))].sort((f, h) => f.order - h.order);
  let c = -1;
  const u = [];
  for (const f of a) (f.step ? f.step.trigger === "click" || c < 0 : c < 0 || I(w(w(f.media.raw.element, "cMediaNode"), "cTn"), "nodeType") === "clickEffect") && c++, f.step ? f.step.clickGroup = c : (f.media.timing.clickGroup = c, u.push(f.media.timing));
  return n.push(...a.filter((f) => f.step).map((f) => f.step)), { animations: n, media: u, readonly: o };
}
function lh(e, t = 0, r = 0) {
  const n = Rf(e), o = sh(n.timing, t, r);
  return { ...o, readonly: n.readonly || o.readonly };
}
function ih(e, t, r) {
  const n = pa(e);
  if (n === null) return null;
  const o = I(e, "presetClass") ?? "entr", s = o === "mediacall" ? wa(e) : null;
  if (o === "mediacall" && !s) return null;
  const l = Qf[o] ?? "entrance", i = F(e, "presetID") ?? 10, a = F(e, "presetSubtype") ?? 0, c = I(e, "nodeType") ?? "clickEffect", u = $a(e), { effect: f, dir: h } = la(i, a, u ?? void 0), p = c === "withEffect" ? "withPrev" : c === "afterEffect" ? "afterPrev" : "click", d = F(e, "dur") ?? ga(e) ?? 500, m = l === "motion" ? da(e) : null, $ = m && t > 0 && r > 0 ? eh(m, t, r) : void 0, x = ma(e), b = ba(e), M = xa(e);
  return { target: n, effect: f, dir: h, delayMs: nh(e), durationMs: s ? Math.max(0, d) : Math.max(60, Math.min(1e4, d)), trigger: p, kind: l, motionPath: $, ...b ? { scale: b } : {}, ...M ? { rotation: M } : {}, ...s ? { mediaCommand: s } : {}, ...x ? { paragraphRange: x } : {} };
}
const go = (e) => e * Math.PI / 180, Ye = 6e4;
function ya(e, t) {
  const r = Math.min(e, t), n = { l: 0, t: 0, r: e, b: t, w: e, h: t, hc: e / 2, vc: t / 2, ls: Math.max(e, t), ss: r, cd2: 180 * Ye, cd4: 90 * Ye, cd8: 45 * Ye, "3cd4": 270 * Ye, "3cd8": 135 * Ye, "5cd8": 225 * Ye, "7cd8": 315 * Ye };
  for (const o of [2, 3, 4, 5, 6, 8, 10, 32]) n[`hd${o}`] = t / o, n[`wd${o}`] = e / o;
  for (const o of [2, 4, 6, 8, 16, 32]) n[`ssd${o}`] = r / o;
  return n;
}
function br(e, t) {
  if (e === null) return 0;
  if (Object.prototype.hasOwnProperty.call(t, e)) return t[e];
  const r = Number(e);
  return Number.isFinite(r) ? r : 0;
}
function ah(e, t) {
  const [r, ...n] = e.trim().split(/\s+/), o = br(n[0] ?? "0", t), s = br(n[1] ?? "0", t), l = br(n[2] ?? "0", t);
  let i;
  switch (r) {
    case "*/":
      i = l === 0 ? 0 : o * s / l;
      break;
    case "+-":
      i = o + s - l;
      break;
    case "+/":
      i = l === 0 ? 0 : (o + s) / l;
      break;
    case "?:":
      i = o > 0 ? s : l;
      break;
    case "abs":
      i = Math.abs(o);
      break;
    case "at2":
      i = Math.atan2(s, o) * 180 * Ye / Math.PI;
      break;
    case "cat2":
      i = o * Math.cos(Math.atan2(l, s));
      break;
    case "cos":
      i = o * Math.cos(go(s / Ye));
      break;
    case "max":
      i = Math.max(o, s);
      break;
    case "min":
      i = Math.min(o, s);
      break;
    case "mod":
      i = Math.sqrt(o * o + s * s + l * l);
      break;
    case "pin":
      i = s < o ? o : s > l ? l : s;
      break;
    case "sat2":
      i = o * Math.sin(Math.atan2(l, s));
      break;
    case "sin":
      i = o * Math.sin(go(s / Ye));
      break;
    case "sqrt":
      i = Math.sqrt(Math.max(o, 0));
      break;
    case "tan":
      i = o * Math.tan(go(s / Ye));
      break;
    case "val":
      i = o;
      break;
    default:
      i = 0;
  }
  return Number.isFinite(i) ? i : 0;
}
function Er(e, t, r = /* @__PURE__ */ new Set()) {
  for (const [n, o] of e) r.has(n) || (t[n] = ah(o, t));
  return t;
}
function Ko(e) {
  const t = {};
  for (const r of K(e, "gd")) {
    const n = I(r, "name"), o = I(r, "fmla");
    if (n && o != null && o.startsWith("val ")) {
      const s = Number(o.slice(4));
      Number.isFinite(s) && (t[n] = s);
    }
  }
  return t;
}
function Sr(e) {
  return K(e, "gd").flatMap((t) => {
    const r = I(t, "name"), n = I(t, "fmla");
    return r && n ? [[r, n]] : [];
  });
}
const Ll = (e) => e.map(([t, r]) => ({ name: t, formula: r }));
function ch(e, t, r) {
  const n = Sr(w(e, "avLst")), o = Sr(w(e, "gdLst")), s = Ll(n), l = Ll(o), i = K(w(e, "pathLst"), "path").map((a, c) => {
    const u = F(a, "w") || t * 9525, f = F(a, "h") || r * 9525, h = ya(u, f);
    Er(n, h), Er(o, h);
    const p = (b) => {
      const M = b ?? "0", E = M in h ? h[M] : Number(M);
      return { expression: M, value: Number.isFinite(E) ? E : 0 };
    }, d = (b, M, E) => ({ id: M, role: E, x: p(I(b ?? null, "x")), y: p(I(b ?? null, "y")) }), m = [];
    let $ = !1;
    const x = [];
    for (let b = a.firstElementChild; b; b = b.nextElementSibling) ["moveTo", "lnTo", "cubicBezTo", "quadBezTo", "arcTo", "close"].includes(b.localName) && x.push(b);
    return x.forEach((b, M) => {
      const E = m.length, y = `p${c}-c${E}`, v = K(b, "pt");
      if (b.localName === "moveTo" || b.localName === "lnTo") {
        const k = d(v[0], `${y}-a`, "anchor");
        m.push({ id: y, type: b.localName === "moveTo" ? "move" : "line", points: [k] });
      } else if (b.localName === "cubicBezTo") {
        const k = [d(v[0], `${y}-c0`, "control"), d(v[1], `${y}-c1`, "control"), d(v[2], `${y}-a`, "anchor")];
        m.push({ id: y, type: "cubic", points: k });
      } else if (b.localName === "quadBezTo") {
        const k = [d(v[0], `${y}-c0`, "control"), d(v[1], `${y}-a`, "anchor")];
        m.push({ id: y, type: "quadratic", points: k });
      } else b.localName === "arcTo" ? m.push({ id: y, type: "arc", points: [], widthRadius: p(I(b, "wR")), heightRadius: p(I(b, "hR")), startAngle: p(I(b, "stAng")), sweepAngle: p(I(b, "swAng")) }) : b.localName === "close" && (M === x.length - 1 ? $ = !0 : m.push({ id: y, type: "close", points: [] }));
    }), { id: `p${c}`, width: u, height: f, fill: I(a, "fill") ?? "norm", stroke: !["0", "false"].includes(I(a, "stroke") ?? "1"), extrusionOk: !["0", "false"].includes(I(a, "extrusionOk") ?? "1"), closed: $, commands: m };
  });
  return { adjustments: s, guides: l, paths: i };
}
function va(e, t, r) {
  const n = K(w(e, "pathLst"), "path");
  if (!n.length) return null;
  const o = Sr(w(e, "avLst")), s = Sr(w(e, "gdLst")), l = [];
  let i = !1, a = !1;
  for (const u of n) {
    const f = F(u, "w") || 0, h = F(u, "h") || 0, p = f || t * 9525, d = h || r * 9525, m = ya(p, d);
    Er(o, m), Er(s, m);
    const $ = p ? t / p : 1, x = d ? r / d : 1, b = (S) => br(S, m), M = (S) => [b(I(S, "x")) * $, b(I(S, "y")) * x];
    (I(u, "fill") ?? "norm") !== "none" && (i = !0);
    const E = I(u, "stroke");
    E !== "0" && E !== "false" && (a = !0);
    let y = 0, v = 0, k = 0, T = 0;
    for (let S = u.firstElementChild; S; S = S.nextElementSibling) {
      const N = K(S, "pt");
      switch (S.localName) {
        case "moveTo":
          [y, v] = M(N[0]), [k, T] = [y, v], l.push(`M ${g(y)} ${g(v)}`);
          break;
        case "lnTo":
          [y, v] = M(N[0]), l.push(`L ${g(y)} ${g(v)}`);
          break;
        case "cubicBezTo": {
          const [P, L] = M(N[0]), [A, z] = M(N[1]);
          [y, v] = M(N[2]), l.push(`C ${g(P)} ${g(L)} ${g(A)} ${g(z)} ${g(y)} ${g(v)}`);
          break;
        }
        case "quadBezTo": {
          const [P, L] = M(N[0]);
          [y, v] = M(N[1]), l.push(`Q ${g(P)} ${g(L)} ${g(y)} ${g(v)}`);
          break;
        }
        case "arcTo": {
          const P = b(I(S, "wR")) * $, L = b(I(S, "hR")) * x, A = b(I(S, "stAng")) / Ye, z = b(I(S, "swAng")) / Ye, R = y - P * Math.cos(gn(A)), O = v - L * Math.sin(gn(A)), U = Math.max(1, Math.ceil(Math.abs(z) / 180));
          for (let j = 0; j < U; j++) {
            const W = z / U, [X, B] = we(R, O, P, L, A + W * (j + 1));
            l.push(`A ${g(P)} ${g(L)} 0 ${Math.abs(W) > 180 ? 1 : 0} ${W >= 0 ? 1 : 0} ${g(X)} ${g(B)}`), y = X, v = B;
          }
          break;
        }
        case "close":
          l.push("Z"), [y, v] = [k, T];
          break;
      }
    }
  }
  const c = l.join(" ");
  return c.trim() ? { d: c, open: !i && a } : null;
}
const Tl = 2048;
function Ma(e) {
  if (e.length > Tl || /[\u0000-\u001f\u007f]/.test(e)) return null;
  let t;
  try {
    t = new URL(e);
  } catch {
    return null;
  }
  return t.protocol !== "http:" && t.protocol !== "https:" && t.protocol !== "mailto:" || t.username || t.password || (t.protocol === "http:" || t.protocol === "https:") && !t.hostname ? null : t.href.length <= Tl ? t : null;
}
const uh = ["dk1", "lt1", "dk2", "lt2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "hlink", "folHlink"], Pl = 1.2, fh = Object.freeze(["none", "words", "sng", "dbl", "heavy", "dotted", "dottedHeavy", "dash", "dashHeavy", "dashLong", "dashLongHeavy", "dotDash", "dotDashHeavy", "dotDotDash", "dotDotDashHeavy", "wavy", "wavyHeavy", "wavyDbl"]), hh = Object.freeze(["noStrike", "sngStrike", "dblStrike"]), P$ = Object.freeze(["none", "all", "small"]);
function Xe(e, t) {
  const r = w(e, t);
  return r ? I(r, "val") : null;
}
function dh(e) {
  if (!e) return "";
  let t = "";
  for (const r of K(e, "t")) t += r.textContent ?? "";
  return t;
}
function xr(e, t = 12) {
  let r = "";
  for (let n = e.firstElementChild; n; n = n.nextElementSibling) n.localName === "t" ? r += n.textContent ?? "" : t > 0 && (r += xr(n, t - 1));
  return r;
}
function ue(e, t, r) {
  const n = w(e, t);
  return n ? At(n, r) : [];
}
function At(e, t) {
  const r = [];
  for (let n = e.firstElementChild; n; n = n.nextElementSibling) {
    const o = ph(n, t);
    o && r.push(...o);
  }
  return r;
}
function ph(e, t) {
  if (t <= 0) {
    const n = xr(e);
    return n ? [{ kind: "run", text: n }] : null;
  }
  const r = t - 1;
  switch (e.localName) {
    case "r": {
      const n = dh(e);
      if (!n) return null;
      const o = Xe(w(e, "rPr"), "sty");
      return [{ kind: "run", text: n, sty: o === "p" || o === "b" || o === "bi" ? o : "i" }];
    }
    case "f": {
      const n = Xe(w(e, "fPr"), "type");
      return [{ kind: "frac", num: ue(e, "num", r), den: ue(e, "den", r), type: n === "noBar" || n === "skw" || n === "lin" ? n : "bar" }];
    }
    case "rad": {
      const n = Xe(w(e, "radPr"), "degHide");
      return [{ kind: "rad", deg: n === "1" || n === "on" || n === "true" ? [] : ue(e, "deg", r), base: ue(e, "e", r) }];
    }
    case "sSup":
      return [{ kind: "script", base: ue(e, "e", r), sup: ue(e, "sup", r) }];
    case "sSub":
      return [{ kind: "script", base: ue(e, "e", r), sub: ue(e, "sub", r) }];
    case "sSubSup":
      return [{ kind: "script", base: ue(e, "e", r), sub: ue(e, "sub", r), sup: ue(e, "sup", r) }];
    case "sPre":
      return [{ kind: "script", base: [], sub: ue(e, "sub", r), sup: ue(e, "sup", r) }, ...ue(e, "e", r)];
    case "nary": {
      const n = w(e, "naryPr"), o = Xe(n, "limLoc"), s = Xe(n, "chr") ?? "∫", l = Xe(n, "subHide") === "1", i = Xe(n, "supHide") === "1";
      return [{ kind: "nary", chr: s, sub: l ? [] : ue(e, "sub", r), sup: i ? [] : ue(e, "sup", r), base: ue(e, "e", r), underOver: o ? o === "undOvr" : s !== "∫" && s !== "∮" && s !== "∬" && s !== "∭" }];
    }
    case "d": {
      const n = w(e, "dPr"), o = K(e, "e").map((s) => At(s, r));
      return [{ kind: "delim", beg: Xe(n, "begChr") ?? "(", end: Xe(n, "endChr") ?? ")", sep: Xe(n, "sepChr") ?? ",", items: o.length ? o : [[]] }];
    }
    case "m":
      return [{ kind: "matrix", rows: K(e, "mr").map((n) => K(n, "e").map((o) => At(o, r))) }];
    case "acc":
      return [{ kind: "acc", chr: Xe(w(e, "accPr"), "chr") ?? "̂", base: ue(e, "e", r) }];
    case "bar": {
      const n = Xe(w(e, "barPr"), "pos");
      return [{ kind: "acc", chr: "̅", base: ue(e, "e", r), below: n === "bot" }];
    }
    case "groupChr": {
      const n = w(e, "groupChrPr"), o = Xe(n, "pos");
      return [{ kind: "acc", chr: Xe(n, "chr") ?? "⏟", base: ue(e, "e", r), below: o !== "top" }];
    }
    case "limLow":
      return [{ kind: "lim", base: ue(e, "e", r), limit: ue(e, "lim", r), below: !0 }];
    case "limUpp":
      return [{ kind: "lim", base: ue(e, "e", r), limit: ue(e, "lim", r), below: !1 }];
    case "func":
      return [...ue(e, "fName", r), { kind: "run", text: " " }, ...ue(e, "e", r)];
    case "eqArr":
      return [{ kind: "stack", rows: K(e, "e").map((n) => At(n, r)) }];
    case "box":
    case "borderBox":
    case "e":
    case "oMath":
      return At(e, r);
    case "phant":
      return [{ kind: "run", text: " ".repeat(Math.max(1, xr(e).length)), sty: "p" }];
    case "rPr":
    case "ctrlPr":
    case "argPr":
    case "fPr":
    case "radPr":
    case "naryPr":
    case "dPr":
    case "mPr":
    case "accPr":
    case "barPr":
    case "groupChrPr":
    case "limLowPr":
    case "limUppPr":
    case "funcPr":
    case "eqArrPr":
    case "boxPr":
    case "phantPr":
    case "sSupPr":
    case "sSubPr":
    case "sSubSupPr":
    case "sPrePr":
      return null;
    default: {
      const n = At(e, r);
      if (n.length) return n;
      const o = xr(e);
      return o ? [{ kind: "run", text: o }] : null;
    }
  }
}
function mh(e) {
  if (e.localName === "oMathPara") {
    const t = K(e, "oMath").map((r) => At(r, 16));
    return t.length > 1 ? [{ kind: "stack", rows: t }] : t[0] ?? [];
  }
  return At(e, 16);
}
function Ne(e) {
  var t, r;
  let n = "";
  for (const o of e) switch (o.kind) {
    case "run":
      n += o.text;
      break;
    case "frac":
      n += `${Ne(o.num)}/${Ne(o.den)}`;
      break;
    case "rad":
      n += `√(${Ne(o.base)})`;
      break;
    case "script":
      n += Ne(o.base), (t = o.sub) != null && t.length && (n += `_${Ne(o.sub)}`), (r = o.sup) != null && r.length && (n += `^${Ne(o.sup)}`);
      break;
    case "nary":
      n += o.chr, o.sub.length && (n += `_${Ne(o.sub)}`), o.sup.length && (n += `^${Ne(o.sup)}`), n += Ne(o.base);
      break;
    case "delim":
      n += o.beg + o.items.map((s) => Ne(s)).join(o.sep) + o.end;
      break;
    case "matrix":
      n += o.rows.map((s) => s.map((l) => Ne(l)).join(" ")).join("; ");
      break;
    case "acc":
      n += Ne(o.base) + o.chr;
      break;
    case "lim":
      n += `${Ne(o.base)}(${Ne(o.limit)})`;
      break;
    case "stack":
      n += o.rows.map((s) => Ne(s)).join(" ");
      break;
  }
  return n;
}
const gh = { l: "left", ctr: "center", r: "right", just: "justify", dist: "justify" };
function Qo(e, t) {
  const r = { ...e, ...t, rp: { ...e.rp, ...t.rp } };
  return t.lnPct !== void 0 && delete r.lnPx, t.lnPx !== void 0 && delete r.lnPct, t.buSizePct !== void 0 && delete r.buSizePts, t.buSizePts !== void 0 && delete r.buSizePct, r;
}
function ka(e, t) {
  let r = { rp: {} };
  for (const n of e) {
    n.def && (r = Qo(r, n.def));
    const o = n.lvls[t];
    o && (r = Qo(r, o));
  }
  return r;
}
function Al(e, t, r) {
  let n = e.lnPct !== void 0 ? e.lnPct * Pl : null;
  return n === null && e.lnPx && (n = e.lnPx / t), r && (n = Math.max(0.5, (n ?? Pl) - r)), { align: gh[e.algn ?? "l"] ?? "left", lineHeight: n, spaceBefore: e.spcBef ?? 0, spaceAfter: e.spcAft ?? 0, marginLeft: e.marL ?? 0, indent: e.indent ?? 0 };
}
function $h(e) {
  return { ...e.lvl !== void 0 ? { level: !0 } : {}, ...e.algn !== void 0 ? { align: !0 } : {}, ...e.lnPct !== void 0 || e.lnPx !== void 0 ? { lineHeight: !0 } : {}, ...e.spcBef !== void 0 ? { spaceBefore: !0 } : {}, ...e.spcAft !== void 0 ? { spaceAfter: !0 } : {}, ...e.marL !== void 0 ? { marginLeft: !0 } : {}, ...e.indent !== void 0 ? { indent: !0 } : {} };
}
function Il(e) {
  let t = "", r = e;
  for (; r > 0; ) t = String.fromCharCode(65 + (r - 1) % 26) + t, r = Math.floor((r - 1) / 26);
  return t;
}
function Nl(e) {
  const t = [[1e3, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let r = "", n = e;
  for (const [o, s] of t) for (; n >= o; ) r += s, n -= o;
  return r;
}
function bh(e, t) {
  let r;
  return e.startsWith("alphaLc") ? r = Il(t).toLowerCase() : e.startsWith("alphaUc") ? r = Il(t) : e.startsWith("romanLc") ? r = Nl(t).toLowerCase() : e.startsWith("romanUc") ? r = Nl(t) : e.startsWith("circleNum") ? r = t >= 1 && t <= 20 ? String.fromCharCode(9312 + t - 1) : String(t) : r = String(t), e.endsWith("ParenBoth") ? `(${r})` : e.endsWith("ParenR") ? `${r})` : e.endsWith("Period") ? `${r}.` : r;
}
const xh = { "": "▪", "": "•", "": "➢", "": "✓", "": "●", "": "◆", "": "□", "": "❖", "§": "▪", n: "▪", l: "●", u: "◆", p: "❑", v: "❖", w: "♦", Ø: "➢", ü: "✓", F: "☞", q: "❑" };
function wh(e, t, r) {
  return (!e || e.kind !== "auto") && (t.length = r + 1, delete t[r]), !e || e.kind === "none" || e.kind === "image" ? null : e.kind === "char" ? xh[e.char] || (e.font && /wingdings|webdings|symbol/i.test(e.font) ? "•" : e.char) : (t.length = r + 1, t[r] = (t[r] ?? e.startAt - 1) + 1, bh(e.scheme, t[r]));
}
function Rl(e, t) {
  const r = e.bullet;
  if (!r || r.kind === "none") return { kind: "none" };
  const n = { ...e.buColor !== void 0 ? { color: e.buColor } : {}, ...e.buFont !== void 0 ? { font: e.buFont } : {}, ...e.buSizePts !== void 0 ? { size: { kind: "points", value: e.buSizePts * 0.75 } } : e.buSizePct !== void 0 ? { size: e.buSizePct === null ? null : { kind: "percent", value: e.buSizePct } } : {} };
  return r.kind === "char" ? { kind: "char", char: r.char, ...r.font && n.font === void 0 ? { font: r.font } : {}, ...n } : r.kind === "auto" ? { kind: "autoNum", type: r.scheme, startAt: r.startAt, ...n } : { kind: "image", rid: r.rid, src: t?.(r.rid) ?? null, ...n };
}
function yh(e) {
  let t = 0;
  return e.bullet !== void 0 && (t |= En.bullet), e.buColor !== void 0 && (t |= En.bulletColor), e.buFont !== void 0 && (t |= En.bulletFont), (e.buSizePct !== void 0 || e.buSizePts !== void 0) && (t |= En.bulletSize), e.rtl !== void 0 && (t |= En.rtl), t;
}
function Ca(e) {
  var t, r;
  const { lvl: n, resolved: o, inherited: s, direct: l, directRun: i, runs: a, counters: c, lnSpcReduction: u, env: f } = e, h = Math.max(...a.map((m) => m.size), 1), p = Al(o, h, u), d = ((t = o.bullet) == null ? void 0 : t.kind) === "image" && f.resolveImage ? f.resolveImage(o.bullet.rid) : null;
  return { align: p.align, lvl: n, marL: p.marginLeft, indent: p.indent, bullet: wh(o.bullet, c, n), lineHeight: p.lineHeight, spaceBefore: p.spaceBefore, spaceAfter: p.spaceAfter, runs: a, bulletColor: o.buColor ?? null, bulletFont: o.buFont ?? null, bulletSize: o.buSizePts !== void 0 ? o.buSizePts / h : o.buSizePct ?? null, bulletImage: d, rtl: o.rtl, ...f.edit ? { editInfo: { inheritedParagraphProps: { level: 0, ...Al(s, h, u) }, directParagraphProps: $h(l), directRun: i, directLayout: yh(l), ...((r = o.bullet) == null ? void 0 : r.kind) === "auto" ? { autoNumbering: { scheme: o.bullet.scheme, startAt: o.bullet.startAt } } : {}, bullet: Rl(o, f.resolveImage), inheritedBullet: Rl(s, f.resolveImage) } } : {} };
}
const Lt = { anchor: 1, insets: 2, wrap: 4, vert: 8, anchorCtr: 16, columns: 32, columnGap: 64, autoFit: 128 }, vh = { horz: "horz", vert: "vert", vert270: "vert270", wordArtVert: "wordArtVert", eaVert: "vert", mongolianVert: "vert" };
function Xt(e, t) {
  for (const r of e) {
    const n = I(r, t);
    if (n !== null) return n;
  }
  return null;
}
function Mh(e) {
  for (const t of e) {
    if (!t) continue;
    const r = w(t, "noAutofit") ?? w(t, "normAutofit") ?? w(t, "spAutoFit");
    if (r) return r;
  }
  return null;
}
function zl(e) {
  const t = Xt(e, "anchor") ?? "t", r = (u, f) => {
    const h = Xt(e, u);
    return se(h === null ? f : Number(h));
  }, n = Mh(e), o = n?.localName === "normAutofit", s = n?.localName === "spAutoFit", l = o ? F(n, "fontScale") : null, i = Number(Xt(e, "numCol") ?? "1"), a = Number(Xt(e, "spcCol") ?? "0"), c = vh[Xt(e, "vert") ?? "horz"];
  return { anchor: t === "ctr" ? "middle" : t === "b" ? "bottom" : "top", insets: [r("tIns", 45720), r("rIns", 91440), r("bIns", 45720), r("lIns", 91440)], wrap: Xt(e, "wrap") !== "none", fontScale: l != null ? l / 1e5 : 1, ...o ? { autoFitNormal: !0 } : {}, ...o && l == null ? { autoFitCompute: !0 } : {}, ...o && (F(n, "lnSpcReduction") ?? 0) ? { lnSpcReduction: (F(n, "lnSpcReduction") ?? 0) / 1e5 } : {}, ...s ? { autoFitShape: !0 } : {}, ...c !== "horz" ? { vert: c } : {}, ...Xt(e, "anchorCtr") === "1" ? { anchorCtr: !0 } : {}, ...i > 1 ? { columns: i } : {}, ...Number.isFinite(a) && a !== 0 ? { columnGap: se(a) } : {} };
}
function kh(e) {
  if (!e) return 0;
  let t = 0;
  return I(e, "anchor") !== null && (t |= Lt.anchor), ["tIns", "rIns", "bIns", "lIns"].some((r) => I(e, r) !== null) && (t |= Lt.insets), I(e, "wrap") !== null && (t |= Lt.wrap), I(e, "vert") !== null && (t |= Lt.vert), I(e, "anchorCtr") !== null && (t |= Lt.anchorCtr), I(e, "numCol") !== null && (t |= Lt.columns), I(e, "spcCol") !== null && (t |= Lt.columnGap), (w(e, "noAutofit") || w(e, "normAutofit") || w(e, "spAutoFit")) && (t |= Lt.autoFit), t;
}
function Ch(e, t) {
  return { latin: e.latin ?? t.fonts.minor.latin, eastAsian: e.ea ?? t.fonts.minor.ea, complexScript: e.cs ?? t.fonts.minor.cs ?? null };
}
function Eh(e) {
  const t = e.u ?? "none", r = e.strike ?? "noStrike";
  return { u: t !== "none", strike: r !== "noStrike", ...t !== "none" ? { underline: t } : {}, ...r !== "noStrike" ? { strikeType: r } : {} };
}
function Ol(e, t, r) {
  var n;
  const o = Ch(e, t);
  return { fontSlots: o, props: { b: e.b ?? !1, i: e.i ?? !1, ...Eh(e), size: un(e.sz ?? 1800), color: e.color ?? t.defaultColor ?? "rgb(0,0,0)", fonts: Ef(o, r), baseline: e.baseline || void 0, spacing: e.spc || void 0, caps: e.caps && e.caps !== "none" ? e.caps : void 0, outline: e.outline ?? null, gradient: e.gradient ?? null, highlight: e.highlight ?? null, underlineColor: e.uColor ?? null, ...e.gradientFill !== void 0 ? { gradientFill: e.gradientFill } : {}, ...e.shadowEffect !== void 0 ? { shadow: e.shadow, shadowEffect: e.shadowEffect } : {}, ...(n = e.generationIssues) != null && n.length ? { generationIssues: e.generationIssues } : {} } };
}
function In(e, t, r, n, o = 0) {
  const s = Ol(t, r, e), l = r.edit && n ? Ol(n, r, e) : null;
  return { text: e, ...s.props, link: t.link, ...l ? { editInfo: { inheritedRunProps: l.props, inheritedFontSlots: l.fontSlots, direct: o, fontSlots: s.fontSlots } } : {} };
}
function Sh(e, t) {
  var r;
  if (!e) return {};
  const n = {}, o = [], s = w(e, "gradFill");
  if (s) {
    (I(s, "rotWithShape") === "0" || I(s, "rotWithShape") === "false" || I(s, "flip") !== null) && o.push("文字渐变旋转/翻转");
    const c = w(s, "lin");
    !c || w(s, "path") || w(s, "tileRect") ? o.push("文字渐变路径/平铺范围") : n.gradientFill = { angle: (F(c, "ang") ?? 0) / 6e4, scaled: ye(c, "scaled") ?? !1, stops: K(w(s, "gsLst"), "gs").map((u) => ({ pos: (F(u, "pos") ?? 0) / 1e5, color: $e(u, t) ?? "#000000" })).sort((u, f) => u.pos - f.pos) };
  } else ["solidFill", "noFill", "blipFill", "pattFill", "grpFill"].some((c) => w(e, c)) && (n.gradientFill = null);
  for (const c of ["blipFill", "pattFill", "grpFill", "effectDag", "uLn", "uLnTx"]) w(e, c) && o.push(`文字 ${c}`);
  const l = w(e, "ln");
  if (l) {
    for (const c of Array.from(l.children)) ["solidFill", "noFill"].includes(c.localName) || o.push(`文字描边 ${c.localName}`);
    for (const c of ["cap", "cmpd", "algn"]) I(l, c) !== null && o.push(`文字描边 ${c}`);
  }
  const i = w(e, "uFill");
  i && !w(i, "solidFill") && o.push("下划线非纯色填充");
  const a = w(e, "effectLst");
  if (a) {
    const c = (r = bn(a, t)) == null ? void 0 : r.shadow;
    n.shadowEffect = c ?? null, n.shadow = c ? `${c.dx}px ${c.dy}px ${c.blur}px ${c.color}` : null, a.children.length > 1 && o.push("多重文字效果");
    for (const u of Array.from(a.children)) {
      u.localName !== "outerShdw" && o.push(`文字效果 ${u.localName}`);
      for (const [f, h] of [["sx", "100000"], ["sy", "100000"], ["kx", "0"], ["ky", "0"], ["algn", "b"], ["rotWithShape", "1"]]) {
        const p = I(u, f);
        p !== null && p !== h && o.push(`文字阴影 ${f}`);
      }
    }
  }
  return o.length && (n.generationIssues = o), n;
}
const Lh = /* @__PURE__ */ new Set(["oMathPara", "oMath", "r", "t", "f", "num", "den", "rad", "deg", "e", "sSup", "sSub", "sSubSup", "sup", "sub", "nary", "d", "m", "mr", "acc", "bar", "groupChr", "limLow", "limUpp", "lim", "eqArr", "rPr", "fPr", "radPr", "naryPr", "dPr", "mPr", "accPr", "barPr", "groupChrPr", "limLowPr", "limUppPr", "eqArrPr", "sSupPr", "sSubPr", "sSubSupPr", "sty", "type", "degHide", "chr", "limLoc", "subHide", "supHide", "begChr", "endChr", "sepChr", "pos"]), jl = "http://schemas.openxmlformats.org/officeDocument/2006/math", Th = /* @__PURE__ */ new Set(["sty", "type", "degHide", "chr", "limLoc", "subHide", "supHide", "begChr", "endChr", "sepChr", "pos"]);
function Ph(e) {
  const t = /* @__PURE__ */ new Set(), r = (n, o) => {
    var s;
    if (o > 16) {
      t.add("公式超出解析深度");
      return;
    }
    (n.namespaceURI !== jl || !Lh.has(n.localName)) && t.add(`公式 ${n.tagName}`);
    for (const i of Array.from(n.attributes)) {
      const a = i.namespaceURI;
      a !== "http://www.w3.org/2000/xmlns/" && (n.localName === "t" && i.name === "xml:space" || Th.has(n.localName) && i.localName === "val" && (!a || a === jl) || t.add(`公式属性 ${n.tagName}@${i.name}`));
    }
    const l = n.localName === "rad" ? [["radPr", "degHide", "deg"]] : n.localName === "nary" ? [["naryPr", "subHide", "sub"], ["naryPr", "supHide", "sup"]] : [];
    for (const [i, a, c] of l) {
      const u = w(w(n, i), a);
      u && !["0", "false", "off"].includes(I(u, "val") ?? "") && (s = w(n, c)) != null && s.children.length && t.add(`公式隐藏参数 ${c}`);
    }
    for (const i of Array.from(n.children)) r(i, o + 1);
  };
  return r(e, 0), [...t];
}
function It(e, t, r) {
  const n = { lvls: [] };
  if (!e) return n;
  const o = w(e, "defPPr");
  o && (n.def = Fl(o, t, r));
  for (let s = 1; s <= 9; s++) {
    const l = w(e, `lvl${s}pPr`);
    l && (n.lvls[s - 1] = Fl(l, t, r));
  }
  return n;
}
function Fl(e, t, r) {
  return Ea(e, t, r).props;
}
function Ea(e, t, r) {
  const n = { rp: {} };
  if (!e) return { props: n, directRun: 0 };
  const o = F(e, "lvl");
  o !== null && (n.lvl = o);
  const s = I(e, "algn");
  s && (n.algn = s);
  const l = F(e, "marL");
  l !== null && (n.marL = se(l));
  const i = F(e, "indent");
  i !== null && (n.indent = se(i)), I(e, "rtl") !== null && (n.rtl = ye(e, "rtl"));
  const a = w(e, "lnSpc"), c = F(w(a, "spcPct"), "val");
  c !== null && (n.lnPct = c / 1e5);
  const u = F(w(a, "spcPts"), "val");
  u !== null && (n.lnPx = un(u));
  const f = F(w(w(e, "spcBef"), "spcPts"), "val");
  f !== null && (n.spcBef = un(f));
  const h = F(w(w(e, "spcAft"), "spcPts"), "val");
  h !== null && (n.spcAft = un(h)), w(e, "buNone") && (n.bullet = { kind: "none" });
  const p = w(e, "buChar");
  p && (n.bullet = { kind: "char", char: I(p, "char") ?? "•", font: I(w(e, "buFont"), "typeface") });
  const d = w(e, "buAutoNum");
  d && (n.bullet = { kind: "auto", scheme: I(d, "type") ?? "arabicPeriod", startAt: F(d, "startAt") ?? 1 });
  const m = w(w(e, "buBlip"), "blip");
  if (m) {
    const y = I(m, "r:embed");
    y && (n.bullet = { kind: "image", rid: y });
  }
  const $ = w(e, "buClr");
  $ ? n.buColor = $e($, t) ?? null : w(e, "buClrTx") && (n.buColor = null);
  const x = w(e, "buFont");
  x ? n.buFont = I(x, "typeface") : w(e, "buFontTx") && (n.buFont = null);
  const b = F(w(e, "buSzPct"), "val");
  if (b !== null) n.buSizePct = b / 1e5;
  else {
    const y = F(w(e, "buSzPts"), "val");
    y !== null ? n.buSizePts = un(y) : w(e, "buSzTx") && (n.buSizePct = null);
  }
  const M = w(e, "defRPr"), E = wr(M, t, r);
  return n.rp = E.props, { props: n, directRun: E.direct };
}
function wr(e, t, r) {
  const n = {};
  let o = 0;
  if (!e) return { props: n, direct: o };
  const s = F(e, "sz");
  s !== null && (n.sz = s, o |= Te.size), I(e, "b") !== null && (n.b = ye(e, "b"), o |= Te.b), I(e, "i") !== null && (n.i = ye(e, "i"), o |= Te.i);
  const l = I(e, "u");
  l !== null && (n.u = fh.includes(l) ? l : "sng", o |= Te.u);
  const i = I(e, "strike");
  i !== null && (n.strike = hh.includes(i) ? i : "sngStrike", o |= Te.strike);
  const a = F(e, "baseline");
  a !== null && (n.baseline = a / 1e3, o |= Te.baseline);
  const c = F(e, "spc");
  c !== null && (n.spc = un(c), o |= Te.spacing);
  const u = I(e, "cap");
  u && (n.caps = u === "all" ? "all" : u === "small" ? "small" : "none", o |= Te.caps);
  const f = w(e, "solidFill"), h = $e(f, t);
  h && (n.color = h), f && (n.gradient = null);
  const p = w(e, "gradFill");
  if (p) {
    const k = K(w(p, "gsLst"), "gs").map((T) => ({ pos: (F(T, "pos") ?? 0) / 1e5, color: $e(T, t) ?? "#000" })).sort((T, S) => T.pos - S.pos);
    if (k.length) {
      const T = w(p, "lin"), S = T ? (F(T, "ang") ?? 0) / 6e4 + 90 : 180;
      n.gradient = `linear-gradient(${Math.round(S)}deg,${k.map((N) => `${N.color} ${Math.round(N.pos * 100)}%`).join(",")})`, n.color || (n.color = k[0].color);
    }
  }
  w(e, "noFill") && (n.color = "transparent", n.gradient = null), (f || p || ["noFill", "blipFill", "pattFill", "grpFill"].some((k) => !!w(e, k))) && (o |= Te.color | Te.gradient), !f && !p && ["blipFill", "pattFill", "grpFill"].some((k) => !!w(e, k)) && (n.color = "transparent", n.gradient = null);
  const d = $e(w(e, "uFill"), t) ?? $e(w(w(e, "uFill"), "solidFill"), t);
  d && (n.uColor = d), (w(e, "uFillTx") || w(e, "uFill") && !d) && (n.uColor = null), (w(e, "uFillTx") || w(e, "uFill")) && (o |= Te.underlineColor);
  const m = w(e, "highlight");
  m && (n.highlight = $e(m, t) ?? null), m && (o |= Te.highlight);
  const $ = w(e, "ln");
  if (w($, "noFill")) n.outline = null;
  else if ($) {
    const k = $e(w($, "solidFill"), t);
    k ? n.outline = { color: k, width: se(F($, "w") ?? 9525) } : n.outline = null;
  }
  $ && (o |= Te.outline);
  const x = w(e, "latin"), b = $o(I(x, "typeface"), r);
  b && (n.latin = b), I(x, "typeface") !== null && (o |= Te.fontLatin);
  const M = w(e, "ea"), E = $o(I(M, "typeface"), r);
  E && (n.ea = E), I(M, "typeface") !== null && (o |= Te.fontEastAsian);
  const y = w(e, "cs"), v = $o(I(y, "typeface"), r);
  return v && (n.cs = v), I(y, "typeface") !== null && (o |= Te.fontComplexScript), Object.assign(n, Sh(e, t)), { props: n, direct: o };
}
function $o(e, t) {
  return e ? e === "+mj-lt" ? t.major.latin : e === "+mj-ea" ? t.major.ea : e === "+mj-cs" ? t.major.cs ?? t.major.latin : e === "+mn-lt" ? t.minor.latin : e === "+mn-ea" ? t.minor.ea : e === "+mn-cs" ? t.minor.cs ?? t.minor.latin : e : null;
}
const bo = (e, t) => ({ ...e, ...t });
function Ah(e) {
  for (const t of e) {
    const r = w(t, "prstTxWarp");
    if (!r) continue;
    const n = I(r, "prst");
    if (!n || n === "textNoShape") return;
    const o = {}, s = [];
    for (const l of K(w(r, "avLst"), "gd")) {
      const i = I(l, "name"), a = I(l, "fmla") ?? "", c = Number(a.replace(/^val\s+/, ""));
      i && Number.isFinite(c) && (o[i] = c), (!i || !/^val\s+-?\d+$/.test(a) || !Number.isSafeInteger(c)) && s.push(`艺术字调整值 ${i ?? "(无名)"}：${a}`);
    }
    return { preset: n, adj: o, ...s.length ? { generationIssues: s } : {} };
  }
}
function Nt(e, t, r = !1) {
  if (!e) return null;
  const n = w(e, "bodyPr"), o = [n, ...t.bodyPrFallbacks ?? []], s = zl(o), l = (t.bodyPrFallbacks ?? []).some(Boolean), i = t.edit && l ? zl(o.slice(1)) : void 0, a = [], c = [];
  let u = !1;
  for (const f of K(e, "p")) {
    const h = w(f, "pPr"), p = F(h, "lvl") ?? 0, d = ka(t.chain, p), m = Ea(h, t.ctx, t.fonts), $ = m.props, x = Qo(d, $), b = [], M = (E, y) => {
      var v;
      for (let k = E.firstElementChild; k; k = k.nextElementSibling) if (k.localName === "r" || k.localName === "fld") {
        const T = w(k, "rPr"), S = wr(T, t.ctx, t.fonts), N = bo(x.rp, S.props), P = w(T, "hlinkClick");
        let L = !1;
        if (P && t.resolveLink) {
          const R = t.resolveLink(I(P, "r:id") ?? "", I(P, "action"));
          R ? N.link = R : L = !0;
        }
        let A = ((v = w(k, "t")) == null ? void 0 : v.textContent) ?? "";
        k.localName === "fld" && !A && (A = Nh(I(k, "type"), t));
        const z = In(A, N, t, x.rp, S.direct);
        t.edit && L && z.editInfo && (z.editInfo = { ...z.editInfo, readonlyLink: !0 }), b.push(k.localName === "fld" ? { ...z, field: I(k, "type") ?? "unknown" } : z), A.trim() && (u = !0);
      } else if (k.localName === "br") {
        const T = w(k, "rPr"), S = wr(T, t.ctx, t.fonts), N = bo(x.rp, S.props);
        b.push(In(`
`, N, t, x.rp, S.direct));
      } else if (k.localName === "m" && k.namespaceURI === "http://schemas.microsoft.com/office/drawing/2010/main") y > 0 && M(k, y - 1);
      else if (k.localName === "AlternateContent") {
        const T = w(k, "Choice") ?? w(k, "Fallback");
        T && y > 0 && M(T, y - 1);
      } else if (k.localName === "oMathPara" || k.localName === "oMath") {
        const T = mh(k), S = T.length ? Ne(T) : Ih(k), N = Ph(k);
        if (T.length || S || N.length) {
          const P = In(S, { ...x.rp, i: !0 }, t, x.rp);
          T.length && (P.math = T), N.length && (P.generationIssues = [...P.generationIssues ?? [], ...N]), b.push(P), u = !0;
        }
      } else y > 0 && (k.localName === "Choice" || k.localName === "Fallback") && M(k, y - 1);
    };
    if (M(f, 4), b.length === 0) {
      const E = w(f, "endParaRPr"), y = wr(E, t.ctx, t.fonts);
      b.push(In("", bo(x.rp, y.props), t, x.rp, y.direct));
    }
    c.push(Ca({ lvl: p, resolved: x, inherited: d, direct: $, directRun: m.directRun, runs: b, counters: a, lnSpcReduction: s.lnSpcReduction ?? 0, env: t }));
  }
  return !u && !r ? null : { ...s, paragraphs: c, warp: Ah(o), ...t.edit ? { editInfo: { direct: kh(n), ...i ? { inherited: i } : {} } } : {} };
}
function Ih(e) {
  const t = [], r = (n, o) => {
    for (let s = n.firstElementChild; s; s = s.nextElementSibling) s.localName === "t" ? t.push(s.textContent ?? "") : o > 0 && r(s, o - 1);
  };
  return r(e, 12), t.join("").trim();
}
function Nh(e, t) {
  return e ? e === "slidenum" ? String(t.slideNum) : e.startsWith("datetime") ? t.dateText ?? /* @__PURE__ */ (/* @__PURE__ */ new Date()).toLocaleDateString() : e === "footer" ? t.footerText ?? "" : "" : "";
}
function Rh(e) {
  return { ...e, runs: e.runs.length ? [{ ...e.runs[e.runs.length - 1], text: "" }] : [] };
}
function Sa(e, t, r = !1) {
  const n = /* @__PURE__ */ new Map();
  if (r) for (const l of e.paragraphs) n.has(l.lvl) || n.set(l.lvl, Rh(l));
  const o = [], s = Array.from({ length: 9 }, (l, i) => {
    const a = n.get(i);
    if (a) return a;
    const c = ka(t.chain, i), u = In("", c.rp, t, c.rp);
    return Ca({ lvl: i, resolved: c, inherited: c, direct: { rp: {} }, directRun: 0, runs: [u], counters: o, lnSpcReduction: e.lnSpcReduction ?? 0, env: t });
  });
  return { ...e, paragraphs: s };
}
function zh(e) {
  const t = (I(e, "uniqueId") ?? "").toLowerCase();
  if (/orgchart|hierarchy/.test(t)) return "hierarchy";
  if (/pyramid/.test(t)) return "pyramid";
  if (/radial|cycle.*matrix/.test(t)) return "radial";
  if (/cycle|gear/.test(t)) return "cycle";
  if (/matrix|grid/.test(t)) return "snake";
  const r = /* @__PURE__ */ new Set(), n = (o, s) => {
    if (!(!o || s < 0)) for (let l = o.firstElementChild; l; l = l.nextElementSibling) {
      if (l.localName === "alg") {
        const i = I(l, "type");
        i && r.add(i);
      }
      n(l, s - 1);
    }
  };
  return n(e, 12), r.has("hierRoot") || r.has("hierChild") ? "hierarchy" : r.has("pyra") ? "pyramid" : r.has("cycle") ? "cycle" : r.has("snake") ? "snake" : r.has("sp") && !r.has("lin") ? "radial" : "linear";
}
function Oh(e) {
  const t = (I(e, "uniqueId") ?? "").toLowerCase();
  if (/vlist|vertical|^.*\/list1$/.test(t)) return !0;
  const r = e?.getElementsByTagName("*");
  for (let n = 0; r && n < r.length; n++) if (r[n].localName === "param" && I(r[n], "type") === "linDir") return I(r[n], "val") === "fromT" || I(r[n], "val") === "fromB";
  return !1;
}
function jh(e) {
  if (!e) return [];
  const t = e.localName === "dataModel" ? e : w(e, "dataModel"), r = w(t, "ptLst"), n = w(t, "cxnLst");
  if (!r) return [];
  const o = /* @__PURE__ */ new Map();
  let s = null;
  for (const c of K(r, "pt")) {
    const u = I(c, "modelId");
    if (!u) continue;
    const f = I(c, "type") ?? "node";
    f === "parTrans" || f === "sibTrans" || f === "pres" || (f === "doc" && (s = u), o.set(u, { id: u, txBody: w(c, "t"), kids: [] }));
  }
  for (const c of K(n, "cxn")) {
    if ((I(c, "type") ?? "parOf") !== "parOf") continue;
    const u = I(c, "srcId"), f = I(c, "destId");
    if (!u || !f) continue;
    const h = o.get(u);
    !h || !o.has(f) || h.kids.push({ id: f, ord: F(c, "srcOrd") ?? 0 });
  }
  const l = /* @__PURE__ */ new Set(), i = (c, u) => {
    if (l.has(c) || u > 12) return null;
    l.add(c);
    const f = o.get(c);
    return f ? (f.kids.sort((h, p) => h.ord - p.ord), { id: c, text: null, children: f.kids.map((h) => i(h.id, u + 1)).filter((h) => h !== null), depth: u }) : null;
  };
  if (s) {
    const c = i(s, -1);
    return c ? c.children : [];
  }
  const a = /* @__PURE__ */ new Set();
  for (const c of o.values()) for (const u of c.kids) a.add(u.id);
  return [...o.keys()].filter((c) => !a.has(c)).map((c) => i(c, 0)).filter((c) => c !== null);
}
function Fh(e, t) {
  const r = e?.localName === "dataModel" ? e : w(e, "dataModel");
  for (const n of K(w(r, "ptLst"), "pt")) if (I(n, "modelId") === t) return w(n, "t");
  return null;
}
function Uh(e) {
  if (!e) return [];
  const t = [], r = K(e, "styleLbl"), n = r.find((s) => (I(s, "name") ?? "").startsWith("node")) ?? r[0], o = w(n ?? null, "fillClrLst");
  for (let s = o?.firstElementChild ?? null; s; s = s.nextElementSibling) {
    const l = I(s, "val");
    l && t.push(l);
  }
  return t;
}
function Dh(e) {
  const t = [], r = (n) => {
    for (const o of n) t.push(o), r(o.children);
  };
  return r(e), t;
}
function Bh(e, t, r, n) {
  const o = e.length ? e : [];
  if (!o.length) return [];
  const s = (n ? r : t) * 0.04, l = o.length;
  if (n) {
    const c = (r - s * (l - 1)) / l, u = Math.min(t, c * 5);
    return o.map((f, h) => ({ x: (t - u) / 2, y: h * (c + s), w: u, h: c, pt: f, prst: "roundRect", colorIdx: h }));
  }
  const i = (t - s * (l - 1)) / l, a = Math.min(r, i * 0.8);
  return o.map((c, u) => ({ x: u * (i + s), y: (r - a) / 2, w: i, h: a, pt: c, prst: "roundRect", colorIdx: u }));
}
function Hh(e, t, r) {
  const n = e.length;
  if (!n) return [];
  const o = Math.min(t, r) * (n <= 4 ? 0.34 : 0.28), s = o * 0.62, l = (t - o) / 2, i = (r - s) / 2;
  return e.map((a, c) => {
    const u = -Math.PI / 2 + c * 2 * Math.PI / n;
    return { x: t / 2 + l * Math.cos(u) - o / 2, y: r / 2 + i * Math.sin(u) - s / 2, w: o, h: s, pt: a, prst: "ellipse", colorIdx: c };
  });
}
function Wh(e, t, r) {
  const n = e.length;
  if (!n) return [];
  const o = r / n;
  return e.map((s, l) => {
    const i = (l + 1) / n * t;
    return { x: (t - i) / 2, y: l * o, w: i, h: o * 0.94, pt: s, prst: "trapezoid", colorIdx: l };
  });
}
function Vh(e, t, r) {
  const n = e.length;
  if (!n) return [];
  const o = Math.ceil(Math.sqrt(n)), s = Math.ceil(n / o), l = t * 0.03, i = r * 0.05, a = (t - l * (o - 1)) / o, c = (r - i * (s - 1)) / s;
  return e.map((u, f) => ({ x: f % o * (a + l), y: Math.floor(f / o) * (c + i), w: a, h: c, pt: u, prst: "roundRect", colorIdx: f }));
}
function Xh(e, t, r) {
  if (!e.length) return [];
  const [n, ...o] = e, s = Math.min(t, r) * 0.3, l = [{ x: (t - s) / 2, y: (r - s) / 2, w: s, h: s, pt: n, prst: "ellipse", colorIdx: 0 }], i = o.length, a = Math.min(t, r) * 0.26, c = a * 0.62;
  return o.forEach((u, f) => {
    const h = -Math.PI / 2 + f * 2 * Math.PI / Math.max(i, 1);
    l.push({ x: t / 2 + (t - a) / 2 * Math.cos(h) - a / 2, y: r / 2 + (r - c) / 2 * Math.sin(h) - c / 2, w: a, h: c, pt: u, prst: "ellipse", colorIdx: f + 1 });
  }), l;
}
function Yh(e, t, r) {
  const n = [], o = (a, c) => {
    if (a.length) {
      (n[c] ?? (n[c] = [])).push(...a);
      for (const u of a) o(u.children, c + 1);
    }
  };
  if (o(e, 0), !n.length) return [];
  const s = r / n.length, l = s * 0.62, i = [];
  return n.forEach((a, c) => {
    const u = t * 0.03, f = (t - u * (a.length - 1)) / a.length;
    a.forEach((h, p) => {
      i.push({ x: p * (f + u), y: c * s + (s - l) / 2, w: f, h: l, pt: h, prst: "roundRect", colorIdx: c });
    });
  }), i;
}
const Gh = { linear: Bh, cycle: (e, t, r) => Hh(e, t, r), pyramid: (e, t, r) => Wh(e, t, r), hierarchy: (e, t, r) => Yh(e, t, r), snake: (e, t, r) => Vh(e, t, r), radial: (e, t, r) => Xh(e, t, r) };
function Zh(e, t, r, n) {
  const o = n.family === "hierarchy" ? e : Dh(e), s = Gh[n.family](o, t, r, n.vertical);
  if (!s.length) return [];
  const l = [];
  if (n.family === "hierarchy") {
    const i = new Map(s.map((u) => [u.pt.id, u])), a = (u, f) => {
      const h = u.x + u.w / 2, p = u.y + u.h, d = f.x + f.w / 2, m = f.y, $ = (p + m) / 2, x = Math.min(h, d), b = Math.min(p, m), M = Math.max(Math.abs(d - h), 1), E = Math.max(m - p, 1), y = `M ${h - x} 0 L ${h - x} ${$ - b} L ${d - x} ${$ - b} L ${d - x} ${E}`;
      l.push({ kind: "shape", x, y: b, w: M, h: E, rot: 0, flipH: !1, flipV: !1, path: y, fill: null, stroke: { color: n.colors[0] ?? "rgb(68,114,196)", width: 1.5, dash: null }, text: null, openGeom: !0, name: "SmartArt 连线" });
    }, c = (u) => {
      for (const f of u) {
        const h = i.get(f.id);
        for (const p of f.children) {
          const d = i.get(p.id);
          h && d && a(h, d);
        }
        c(f.children);
      }
    };
    c(e);
  }
  for (const i of s) {
    const a = { type: "solid", color: n.colors[i.colorIdx % Math.max(n.colors.length, 1)] ?? "rgb(68,114,196)" }, c = $n(i.prst, i.w, i.h, {}), u = { kind: "shape", x: i.x, y: i.y, w: i.w, h: i.h, rot: 0, flipH: !1, flipV: !1, path: c.d, fill: a, stroke: null, text: n.textOf(i.pt.id), name: "SmartArt 节点" };
    l.push(u);
  }
  return l;
}
function _h(e, t) {
  return { kind: "group", ...t, childX: 0, childY: 0, scaleX: 1, scaleY: 1, children: e, name: "SmartArt" };
}
const qh = /* @__PURE__ */ new Set(["dt", "ftr", "sldNum", "hdr"]);
function Jh(e, t, r, n) {
  return La(e, t, r, n).flatMap((o) => o.layoutIds);
}
function La(e, t, r, n) {
  var o, s;
  const l = [], i = /* @__PURE__ */ new Set();
  for (const a of K(w(e, "sldMasterIdLst"), "sldMasterId")) {
    const c = I(a, "r:id"), u = c ? (o = t[c]) == null ? void 0 : o.target : null;
    if (!u || i.has(u)) continue;
    i.add(u);
    const f = u ? r(u) : null, h = u ? n(u) : {}, p = [];
    for (const d of K(w(f, "sldLayoutIdLst"), "sldLayoutId")) {
      const m = I(d, "r:id"), $ = m ? (s = h[m]) == null ? void 0 : s.target : null;
      $ && !p.includes($) && p.push($);
    }
    l.push({ part: u, layoutIds: p });
  }
  return l;
}
function Kh(e) {
  var t, r;
  const n = (t = e.editInfo) == null ? void 0 : t.placeholder;
  if (!n) return null;
  if (e.kind !== "shape") return e;
  const o = ((r = e.editInfo) == null ? void 0 : r.textTemplate) ?? e.text ?? void 0, s = o?.paragraphs[0], l = o && s ? { ...o, paragraphs: [{ ...s, runs: s.runs.length ? [{ ...s.runs[s.runs.length - 1], text: "" }] : [] }] } : o;
  return { ...e, text: qh.has(n.type) ? e.text : null, editInfo: { ...e.editInfo, ...l ? { textTemplate: l } : {} } };
}
function Es(e, t, r) {
  if (r != null && r.includes("nextslide")) return e.edit ? "slide:next" : `slide:${e.slideNum + 1}`;
  if (r != null && r.includes("previousslide")) return e.edit ? "slide:previous" : `slide:${e.slideNum - 1}`;
  if (r != null && r.includes("firstslide")) return e.edit ? "slide:first" : "slide:1";
  if (r != null && r.includes("lastslide")) return "slide:last";
  const n = e.rels[t];
  if (!n) return null;
  if (Ma(n.target)) return n.target;
  const o = e.slideIdMap[n.target];
  return o === void 0 ? null : e.edit ? `slide-part:${encodeURIComponent(n.target)}` : `slide:${o}`;
}
function Ss(e, t) {
  const r = w(e, "hlinkClick");
  if (!r) return { unsupported: !1 };
  const n = Es(t, I(r, "r:id") ?? "", I(r, "action")) ?? void 0;
  return { ...n ? { link: n } : {}, unsupported: !n };
}
const Qh = "rgb(0,0,0)";
function Ul(e) {
  const t = {};
  for (const r of K(e, "font")) {
    const n = I(r, "script"), o = I(r, "typeface");
    n && o && (t[n] = o);
  }
  return { latin: I(w(e, "latin"), "typeface") ?? "", ea: I(w(e, "ea"), "typeface") ?? "", cs: I(w(e, "cs"), "typeface") ?? "", scripts: t };
}
function Ta(e, t = "") {
  const r = ee(e, "themeElements", "clrScheme"), n = Object.fromEntries(uh.map((l) => {
    const i = w(w(r, l), "srgbClr") ?? w(w(r, l), "sysClr") ?? w(w(r, l), "prstClr") ?? w(w(r, l), "scrgbClr") ?? w(w(r, l), "hslClr");
    return [l, i ? vs(i, { theme: {}, clrMap: {} }) : Qh];
  })), o = ee(e, "themeElements", "fontScheme"), s = { major: Ul(w(o, "majorFont")), minor: Ul(w(o, "minorFont")) };
  return { id: t, name: I(e, "name") ?? t, colors: n, fonts: s };
}
function ed(e) {
  return Object.fromEntries(Object.entries(e.colors).map(([t, r]) => {
    const [n, o, s] = ta(r);
    return [t, [n, o, s].map((l) => Math.round(l).toString(16).padStart(2, "0")).join("").toUpperCase()];
  }));
}
function Ls(e, t, r, n) {
  var o, s;
  const l = [], i = {}, a = /* @__PURE__ */ new Set();
  for (const c of K(w(e, "sldMasterIdLst"), "sldMasterId")) {
    const u = I(c, "r:id"), f = u ? (o = t[u]) == null ? void 0 : o.target : null;
    if (!f) continue;
    const h = (s = Object.values(n(f)).find((p) => p.type.endsWith("/theme"))) == null ? void 0 : s.target;
    h && (i[f] = h, !a.has(h) && (a.add(h), l.push(Ta(r(h), h))));
  }
  return { themes: l, themeByMaster: i };
}
function Kt(e, t) {
  for (const r of Object.values(e)) if (r.type.endsWith(t)) return r.target;
  return null;
}
function td(e) {
  const t = Ta(e), r = ee(e, "themeElements", "fmtScheme"), n = (o) => {
    var s;
    const l = [];
    for (let i = ((s = w(r, o)) == null ? void 0 : s.firstElementChild) ?? null; i; i = i.nextElementSibling) l.push(i);
    return l;
  };
  return { colors: ed(t), fonts: t.fonts, fillStyles: n("fillStyleLst"), lnStyles: n("lnStyleLst"), effectStyles: n("effectStyleLst"), bgFillStyles: n("bgFillStyleLst") };
}
function Dl(e) {
  const t = [];
  for (const r of Array.from(e?.children ?? []).filter((n) => n.localName === "sp")) {
    const n = ee(r, "nvSpPr", "nvPr", "ph");
    n && t.push({ type: I(n, "type"), idx: I(n, "idx"), sp: r });
  }
  return t;
}
function fn(e, t, r) {
  var n;
  return ((n = Sf(e, (o) => o, { type: t, idx: r })) == null ? void 0 : n.sp) ?? null;
}
function Pa(e, t, r, n, o, s, l, i, a) {
  const c = r ? e.xml(r) : null, u = r ? e.rels(r) : {}, f = r ? Kt(u, "/slideMaster") : null, h = f ? e.xml(f) : null;
  return Aa(e, t, r, c, f, h, n, o, s, l, i, a);
}
function nd(e, t, r, n, o, s, l, i) {
  return Aa(e, null, null, null, t, e.xml(t), r, n, o, s, l, i);
}
function Aa(e, t, r, n, o, s, l, i, a, c, u, f) {
  const h = o ? e.rels(o) : {}, p = o ? Kt(h, "/theme") : null, d = td(p ? e.xml(p) : null), m = {}, $ = w(s, "clrMap");
  if ($) for (const z of Array.from($.attributes)) m[z.localName] = z.value;
  const x = ee(t, "clrMapOvr", "overrideClrMapping") ?? ee(n, "clrMapOvr", "overrideClrMapping");
  if (x) for (const z of Array.from(x.attributes)) m[z.localName] = z.value;
  const b = { theme: d.colors, clrMap: m }, M = `${p ?? ""}\0${Object.entries(m).sort(([z], [R]) => z.localeCompare(R)).map(([z, R]) => `${z}=${R}`).join(";")}`;
  let E = f?.get(M);
  if (!E) {
    E = { lvls: [] };
    const z = It(w(l, "defaultTextStyle"), b, d.fonts);
    E.def = z.def, E.lvls = z.lvls, f?.set(M, E);
  }
  const y = w(s, "txStyles"), v = { title: It(w(y, "titleStyle"), b, d.fonts), body: It(w(y, "bodyStyle"), b, d.fonts), other: It(w(y, "otherStyle"), b, d.fonts) }, k = ee(s, "cSld", "spTree"), T = ee(n, "cSld", "spTree"), S = Dl(T), N = Dl(k), P = /* @__PURE__ */ new Set(), L = u ? /* @__PURE__ */ new Map() : void 0, A = w(n, "hf") ?? w(s, "hf");
  if (A) for (const z of ["sldNum", "ftr", "dt", "hdr"]) I(A, z) === "0" && P.add(z);
  return { layoutPath: r, layoutRoot: n, masterPath: o, masterRoot: s, masterTree: k, layoutTree: T, envFor: (z, R) => ({ pkg: e, ctx: b, theme: d, rels: z ? e.rels(z) : {}, partPath: z ?? "", docDefaults: E, masterStyles: v, layoutPh: R ? S : [], masterPh: R ? N : [], slideNum: c, tableStyles: i, hiddenPh: P, slideIdMap: a, edit: u, textLevelTemplateCache: L }) };
}
const rd = 20556, od = 4, sd = 268435456;
let Lr = null;
function A$(e) {
  Lr = e;
}
function I$() {
  return Lr !== null;
}
const ld = (e, t) => (e[t] << 24 | e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3]) >>> 0, Bl = (e, t) => (e[t + 3] << 24 | e[t + 2] << 16 | e[t + 1] << 8 | e[t]) >>> 0, id = (e, t) => e[t + 1] << 8 | e[t];
function xo(e) {
  if (e.length < 4) return null;
  switch (ld(e, 0)) {
    case 65536:
    case 1953658213:
    case 1953784678:
      return "font/ttf";
    case 1330926671:
      return "font/otf";
    case 2001684038:
      return "font/woff";
    case 2001684018:
      return "font/woff2";
    default:
      return null;
  }
}
function ad(e) {
  const t = xo(e);
  if (t) return { data: e, mime: t };
  if (e.length < 82 || id(e, 34) !== rd) return null;
  const r = Bl(e, 12);
  if (r & od) {
    if (!Lr) return null;
    let l = null;
    try {
      l = Lr(e);
    } catch {
      return null;
    }
    return l != null && l.length ? { data: l, mime: xo(l) ?? "font/ttf" } : null;
  }
  const n = Bl(e, 4);
  if (!n || n > e.length - 82) return null;
  let o = e.subarray(e.length - n);
  if (r & sd) {
    o = o.slice();
    for (let l = 0; l < o.length; l++) o[l] ^= 80;
  }
  const s = xo(o);
  return s ? { data: o, mime: s } : null;
}
let cd = class {
  constructor(t, r = "asset:") {
    this.publishAssets = t, this.tokenPrefix = r, this.mode = "blob", this.deferred = [], this.deferredIndex = /* @__PURE__ */ new Map(), this.urlCache = /* @__PURE__ */ new Map(), this.objectUrls = [], this.packageAssets = /* @__PURE__ */ Object.create(null);
  }
  get published() {
    return this.packageAssets;
  }
  store(t, r, n, o) {
    let s;
    if (this.mode === "defer") {
      let l = this.deferredIndex.get(t);
      l === void 0 && (l = `${this.tokenPrefix}${this.deferred.length}`, this.deferred.push({ mime: n, data: r }), this.deferredIndex.set(t, l)), s = l;
    } else {
      let l = this.urlCache.get(t);
      l === void 0 && (l = URL.createObjectURL(new Blob([r.slice().buffer], { type: n })), this.objectUrls.push(l), this.urlCache.set(t, l)), s = l;
    }
    return this.publishAssets && (this.packageAssets[s] = { mime: n, bytes: r, sourcePart: o }), s;
  }
  cached(t, r) {
    return this.urlCache.has(t) || this.urlCache.set(t, r()), this.urlCache.get(t) ?? null;
  }
  publish(t, r, n, o) {
    this.publishAssets && (this.packageAssets[t] = { mime: n, bytes: r, sourcePart: o });
  }
  dispose() {
    for (const t of this.objectUrls) try {
      URL.revokeObjectURL(t);
    } catch {
    }
    this.objectUrls = [], this.deferred.length = 0, this.deferredIndex.clear(), this.urlCache.clear(), this.packageAssets = /* @__PURE__ */ Object.create(null);
  }
};
function ud(e) {
  return e.endsWith("/") ? !1 : /\/(?:media|embeddings)\//i.test(e) || /^ppt\/slides\/(?:_rels\/)?slide[^/]+$/i.test(e) || /^ppt\/(?:notesSlides|comments|charts|diagrams)\//i.test(e) || /^ppt\/vbaProject/i.test(e);
}
function fd(e) {
  const t = /* @__PURE__ */ new Set(), r = e.unzip((o) => ud(o.name) ? (t.add(o.name), !1) : !0);
  if (t.size === 0) return r;
  const n = (o) => {
    if (Object.prototype.hasOwnProperty.call(r, o)) return r[o];
    if (!t.has(o)) return;
    const s = e.unzip((i) => i.name === o);
    t.delete(o);
    const l = s[o];
    if (l) return r[o] = l, l;
  };
  return new Proxy(r, { get(o, s, l) {
    return typeof s == "string" && t.has(s) ? n(s) : Reflect.get(o, s, l);
  }, has(o, s) {
    return Reflect.has(o, s) || typeof s == "string" && t.has(s);
  } });
}
const hd = new TextDecoder(), dd = new Uint8Array(0), pd = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", bmp: "image/bmp", webp: "image/webp", svg: "image/svg+xml", tif: "image/tiff", tiff: "image/tiff" }, md = { emf: "image/x-emf", wmf: "image/x-wmf", pict: "image/x-pict", pct: "image/x-pict", pic: "image/x-pict" };
function gd(e, t) {
  if (t.startsWith("/")) return t.slice(1);
  const r = [];
  for (const n of (e + t).split("/")) n === ".." ? r.pop() : n !== "." && n !== "" && r.push(n);
  return r.join("/");
}
let Ia = class {
  constructor(t, r = !1, n) {
    this.existingAssetUrls = /* @__PURE__ */ new Map(), this.xmlCache = /* @__PURE__ */ new Map(), this.relsCache = /* @__PURE__ */ new Map(), this.imageMetadataCache = /* @__PURE__ */ new Map(), this.cacheTrace = null, this.sourceBytes = null, this.isDisposed = !1;
    const o = !(t instanceof Uint8Array);
    if (_o(this, o ? t : void 0), o) this.files = t.parts;
    else {
      const s = new Uint8Array(t.buffer, t.byteOffset, t.byteLength), l = new ys(s, n);
      this.files = r ? l.unzip() : fd(l);
    }
    if (this.assetStore = new cd(r, o ? "layout-asset:" : "asset:"), o) for (const [s, l] of Object.entries(t.assets ?? {})) l.sourcePart && this.existingAssetUrls.set(l.sourcePart, s);
    else if (r) {
      this.sourceBytes = t;
      const s = this;
      this.opcHandle = Object.freeze({ format: "pptx", get bytes() {
        return s.sourceBytes ?? dd;
      }, get parts() {
        return s.files;
      }, get assets() {
        return s.assetStore.published;
      }, get disposed() {
        return s.isDisposed;
      } }), _o(this.opcHandle, this);
    }
  }
  set assetMode(t) {
    this.assetStore.mode = t;
  }
  get deferred() {
    return this.assetStore.deferred;
  }
  get opcPackage() {
    return this.opcHandle;
  }
  xml(t) {
    var r;
    if ((r = this.cacheTrace) == null || r.add(t), !this.xmlCache.has(t)) {
      const n = this.files[t];
      let o = null;
      if (n) try {
        o = Gr(hd.decode(n));
      } catch {
        o = null;
      }
      this.xmlCache.set(t, o);
    }
    return this.xmlCache.get(t) ?? null;
  }
  forgetXml(t) {
    this.xmlCache.delete(t);
  }
  forgetPart(t) {
    const r = t.slice(0, t.lastIndexOf("/") + 1);
    this.xmlCache.delete(t), this.relsCache.delete(t), this.xmlCache.delete(`${r}_rels/${t.slice(r.length)}.rels`), this.imageMetadataCache.delete(t);
  }
  beginCacheTrace() {
    if (this.cacheTrace) throw new Error("OPC 缓存访问作用域不能嵌套");
    return this.cacheTrace = /* @__PURE__ */ new Set(), this.cacheTrace;
  }
  endCacheTrace(t) {
    if (this.cacheTrace !== t) throw new Error("OPC 缓存访问作用域不匹配");
    return this.cacheTrace = null, [...t];
  }
  rels(t) {
    var r;
    if ((r = this.cacheTrace) == null || r.add(t), !this.relsCache.has(t)) {
      const n = t.slice(0, t.lastIndexOf("/") + 1), o = {}, s = this.xml(`${n}_rels/${t.slice(n.length)}.rels`);
      for (const l of K(s, "Relationship")) {
        const i = I(l, "Id"), a = I(l, "Target");
        if (!i || !a) continue;
        const c = I(l, "TargetMode") === "External";
        o[i] = c ? { type: I(l, "Type") ?? "", target: a, external: !0 } : { type: I(l, "Type") ?? "", target: gd(n, a) };
      }
      this.relsCache.set(t, o);
    }
    return this.relsCache.get(t);
  }
  blobUrl(t, r) {
    const n = this.existingAssetUrls.get(t);
    if (n) return n;
    const o = this.files[t];
    return o ? this.assetStore.store(`${r}|${t}`, o, r, t) : null;
  }
  fontUrl(t) {
    const r = this.existingAssetUrls.get(t);
    if (r) return r;
    const n = this.files[t];
    if (!n) return null;
    const o = ad(n);
    return o ? this.assetStore.store(`font|${t}`, o.data, o.mime, t) : null;
  }
  fontSourceUrl(t) {
    const r = this.files[t];
    return r ? this.assetStore.store(`font-source|${t}`, r, "application/octet-stream") : null;
  }
  dispose() {
    this.assetStore.dispose(), this.xmlCache.clear(), this.relsCache.clear(), this.imageMetadataCache.clear(), this.files = {}, this.sourceBytes = null, this.isDisposed = !0;
  }
  mediaUrl(t) {
    const r = this.existingAssetUrls.get(t);
    if (r) return r;
    const n = t.slice(t.lastIndexOf(".") + 1).toLowerCase();
    if (bf.has(n)) {
      const s = `mf|${t}`, l = this.assetStore.cached(s, () => {
        const a = this.files[t];
        return a ? sa(a) : null;
      }), i = this.files[t];
      return l && i && this.assetStore.publish(l, i, md[n] ?? "application/octet-stream", t), l;
    }
    const o = pd[n];
    return o ? this.blobUrl(t, o) : null;
  }
  imageMetadata(t) {
    var r;
    if ((r = this.cacheTrace) == null || r.add(t), !this.imageMetadataCache.has(t)) {
      const n = this.files[t];
      this.imageMetadataCache.set(t, n ? pf(n) : null);
    }
    return this.imageMetadataCache.get(t) ?? null;
  }
};
const $d = { styleId: "", firstRow: !0, lastRow: !1, bandRow: !0, firstCol: !1, lastCol: !1, bandCol: !1 };
function bd(e, t) {
  if (t) {
    t.fill !== void 0 && (e.fill = structuredClone(t.fill));
    for (const [r, n] of Object.entries(t.borders ?? {})) e.borders[r] = structuredClone(n);
  }
}
function Na(e, t, r, n, o, s) {
  const l = { fill: null, borders: {} }, { parts: i } = e, a = t.firstRow && r === 0, c = t.lastRow && r === o - 1, u = t.firstCol && n === 0, f = t.lastCol && n === s - 1, h = t.bandRow ? t.firstRow ? r - 1 : r : -1, p = t.bandCol ? t.firstCol ? n - 1 : n : -1, d = [i.wholeTbl];
  h >= 0 && !a && !c && d.push(h % 2 === 0 ? i.band1H : i.band2H), p >= 0 && !u && !f && d.push(p % 2 === 0 ? i.band1V : i.band2V), u && d.push(i.firstCol), f && d.push(i.lastCol), a && d.push(i.firstRow), c && d.push(i.lastRow), a && u && d.push(i.nwCell), a && f && d.push(i.neCell), c && u && d.push(i.swCell), c && f && d.push(i.seCell);
  let m;
  for (const $ of d) bd(l, $), $ != null && $.text && (m = { ...m, ...$.text });
  return { ...l, text: m };
}
function z$(e) {
  const t = { ...$d, styleId: e.styleId }, r = Array.from({ length: 3 }, (n, o) => ({ height: 32, cells: Array.from({ length: 3 }, (s, l) => {
    const i = Na(e, t, o, l, 3, 3);
    return { colSpan: 1, rowSpan: 1, merged: !1, fill: i.fill, borders: i.borders, text: null };
  }) }));
  return { kind: "table", x: 0, y: 0, w: 288, h: 96, rot: 0, flipH: !1, flipV: !1, colWidths: [96, 96, 96], rows: r };
}
const Tr = "{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}", Ra = Object.freeze({ [Tr]: `<a:tblStyle styleId="${Tr}" styleName="Medium Style 2 - Accent 1">
<a:wholeTbl><a:tcTxStyle><a:fontRef idx="minor"><a:scrgbClr r="0" g="0" b="0"/></a:fontRef><a:schemeClr val="dk1"/></a:tcTxStyle>
<a:tcStyle><a:tcBdr>
<a:left><a:ln w="12700" cmpd="sng"><a:solidFill><a:schemeClr val="lt1"/></a:solidFill></a:ln></a:left>
<a:right><a:ln w="12700" cmpd="sng"><a:solidFill><a:schemeClr val="lt1"/></a:solidFill></a:ln></a:right>
<a:top><a:ln w="12700" cmpd="sng"><a:solidFill><a:schemeClr val="lt1"/></a:solidFill></a:ln></a:top>
<a:bottom><a:ln w="12700" cmpd="sng"><a:solidFill><a:schemeClr val="lt1"/></a:solidFill></a:ln></a:bottom>
</a:tcBdr><a:fill><a:solidFill><a:schemeClr val="accent1"><a:tint val="20000"/></a:schemeClr></a:solidFill></a:fill></a:tcStyle></a:wholeTbl>
<a:band1H><a:tcStyle><a:tcBdr/><a:fill><a:solidFill><a:schemeClr val="accent1"><a:tint val="40000"/></a:schemeClr></a:solidFill></a:fill></a:tcStyle></a:band1H>
<a:band2H><a:tcStyle><a:tcBdr/><a:fill><a:solidFill><a:schemeClr val="lt1"/></a:solidFill></a:fill></a:tcStyle></a:band2H>
<a:firstRow><a:tcTxStyle b="on"><a:fontRef idx="minor"><a:scrgbClr r="0" g="0" b="0"/></a:fontRef><a:schemeClr val="lt1"/></a:tcTxStyle>
<a:tcStyle><a:tcBdr><a:bottom><a:ln w="38100" cmpd="sng"><a:solidFill><a:schemeClr val="lt1"/></a:solidFill></a:ln></a:bottom></a:tcBdr>
<a:fill><a:solidFill><a:schemeClr val="accent1"/></a:solidFill></a:fill></a:tcStyle></a:firstRow>
</a:tblStyle>` }), xd = Object.freeze([Object.freeze({ styleId: Tr, name: "Medium Style 2 - Accent 1", markup: Ra[Tr] })]);
function wd() {
  return xd;
}
function yd(e) {
  return e ? Ra[e.toUpperCase()] ?? null : null;
}
const Hl = /* @__PURE__ */ new Map();
function es(e) {
  if (!e) return null;
  const t = e.toUpperCase(), r = Hl.get(t);
  if (r) return r;
  const n = yd(t);
  if (!n) return null;
  const o = Gr(`<root xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">${n}</root>`), s = w(o, "tblStyle"), l = { root: o, style: s };
  return Hl.set(t, l), l;
}
function za(e, t) {
  const r = K(e, "tblStyle"), n = I(e, "def"), o = r.find((a) => {
    var c;
    return ((c = I(a, "styleId")) == null ? void 0 : c.toUpperCase()) === t?.toUpperCase();
  });
  if (o && e) return { style: o, namespaceRoot: e, source: "document" };
  const s = es(t);
  if (s) return { ...s, namespaceRoot: s.root, source: "builtin" };
  const l = r.find((a) => {
    var c;
    return ((c = I(a, "styleId")) == null ? void 0 : c.toUpperCase()) === n?.toUpperCase();
  });
  if (l && e) return { style: l, namespaceRoot: e, source: "document" };
  const i = es(n);
  return i ? { ...i, namespaceRoot: i.root, source: "builtin" } : null;
}
function vd(e) {
  return e ? { wholeTbl: w(e, "wholeTbl"), band1H: w(e, "band1H"), band2H: w(e, "band2H"), band1V: w(e, "band1V"), band2V: w(e, "band2V"), firstRow: w(e, "firstRow"), lastRow: w(e, "lastRow"), firstCol: w(e, "firstCol"), lastCol: w(e, "lastCol"), nwCell: w(e, "nwCell"), neCell: w(e, "neCell"), swCell: w(e, "swCell"), seCell: w(e, "seCell") } : null;
}
const Ts = [["l", "left", "lnL"], ["r", "right", "lnR"], ["t", "top", "lnT"], ["b", "bottom", "lnB"]];
function Md(e, t, r) {
  if (!e) return;
  const n = w(e, "tcStyle"), o = r.fill(w(n, "fill") ?? n, t), s = {}, l = w(n, "tcBdr");
  for (const [f, h] of Ts) {
    const p = w(l, h);
    p && (s[f] = r.line(w(p, "ln"), t, null));
  }
  const i = w(e, "tcTxStyle"), a = I(i, "b"), c = i ? $e(i, t.ctx) : null, u = { ...a !== null ? { b: a === "on" || a === "1" || a === "true" } : {}, ...c ? { color: c } : {} };
  return { ...o ? { fill: o } : {}, ...Object.keys(s).length ? { borders: s } : {}, ...Object.keys(u).length ? { text: u } : {} };
}
function wo(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function kd(e) {
  return Array.from(e.attributes).filter((t) => t.name === "xmlns" || t.name.startsWith("xmlns:")).map((t) => ({ name: t.name, value: t.value }));
}
function Ps(e, t = e.tagName, r = []) {
  const n = new Set(Array.from(e.attributes).map((i) => i.name)), o = [...r.filter((i) => !n.has(i.name)), ...Array.from(e.attributes).map((i) => ({ name: i.name, value: i.value }))].map((i) => ` ${i.name}="${wo(i.value)}"`).join(""), s = Array.from(e.childNodes);
  if (!s.length) return `<${t}${o}/>`;
  const l = s.map((i) => {
    if (typeof i == "string") return wo(i);
    const a = i;
    return a.nodeType === 1 || a.tagName ? Ps(i) : wo(a.nodeValue ?? "");
  }).join("");
  return `<${t}${o}>${l}</${t}>`;
}
const Cd = ["wholeTbl", "band1H", "band2H", "band1V", "band2V", "firstRow", "lastRow", "firstCol", "lastCol", "nwCell", "neCell", "swCell", "seCell"];
function ts(e, t, r) {
  var n, o;
  const s = (n = I(e.style, "styleId")) == null ? void 0 : n.trim();
  if (!s) return null;
  const l = {};
  for (const i of Cd) {
    const a = Md(w(e.style, i), t, r);
    a && (l[i] = a);
  }
  return { styleId: s, name: ((o = I(e.style, "styleName")) == null ? void 0 : o.trim()) || e.fallbackName || s, source: e.source, markup: Ps(e.style, e.style.tagName, kd(e.namespaceRoot)), parts: l };
}
function As(e, t, r) {
  const n = [], o = /* @__PURE__ */ new Set(), s = (l) => {
    const i = l?.styleId.toUpperCase();
    !l || o.has(i) || (o.add(i), n.push(l));
  };
  for (const l of K(e, "tblStyle")) s(ts({ style: l, namespaceRoot: e, source: "document" }, t, r));
  for (const l of wd()) {
    const i = es(l.styleId);
    s(ts({ style: i.style, namespaceRoot: i.root, source: "builtin", fallbackName: l.name }, t, r));
  }
  return n;
}
function Ed(e, t, r) {
  const n = w(e, "tcPr"), o = r.fill(n, t), s = {};
  for (const [l, , i] of Ts) {
    const a = w(n, i);
    a && (s[l] = r.line(a, t, null));
  }
  return { fill: o, borders: s };
}
function Oa(e, t, r, n, o) {
  var s, l;
  const i = w(e, "tblPr"), a = ((l = (s = w(i, "tableStyleId")) == null ? void 0 : s.textContent) == null ? void 0 : l.trim()) ?? null, c = za(r.tableStyles, a), u = c ? ts(c, r, n) : null, f = { styleId: a ?? u?.styleId ?? "", firstRow: ye(i, "firstRow"), lastRow: ye(i, "lastRow"), bandRow: ye(i, "bandRow"), firstCol: ye(i, "firstCol"), lastCol: ye(i, "lastCol"), bandCol: ye(i, "bandCol") }, h = K(w(e, "tblGrid"), "gridCol").map((b) => se(F(b, "w"))), p = K(e, "tr"), d = (b, M, E) => {
    const y = K(b, "tc");
    return { height: se(F(b, "h")), cells: y.map((v, k) => {
      var T, S, N, P;
      const L = u ? Na(u, f, M, k, E, y.length) : { fill: null, borders: {}, text: void 0 }, A = Ed(v, r, n), z = structuredClone(L.borders);
      for (const [Z, Y] of Object.entries(A.borders)) z[Z] = Y;
      const R = w(v, "txBody"), O = { ctx: r.ctx, fonts: r.theme.fonts, chain: [r.docDefaults], slideNum: r.slideNum, defaultColor: ((T = L.text) == null ? void 0 : T.color) ?? null, resolveLink: (Z, Y) => Es(r, Z, Y), edit: r.edit }, U = Nt(R, O), j = !U && r.edit ? Nt(R, O, !0) ?? void 0 : void 0;
      if (((S = L.text) == null ? void 0 : S.b) !== void 0) {
        for (const Z of [U, j]) if (Z) for (const Y of Z.paragraphs) for (const J of Y.runs) ((((N = Y.editInfo) == null ? void 0 : N.directRun) ?? 0) | (((P = J.editInfo) == null ? void 0 : P.direct) ?? 0)) & Te.b || (J.b = L.text.b);
      }
      let W;
      if (r.edit) {
        const Z = { ...O, defaultColor: null }, Y = Nt(R, Z), J = Y ? void 0 : Nt(R, Z, !0) ?? void 0;
        W = { fill: A.fill, borders: A.borders, text: Y, ...J ? { textTemplate: J } : {} };
      }
      const X = w(v, "tcPr"), B = (Z, Y) => {
        const J = F(X, Z);
        return se(J === null ? Y : J);
      };
      return { colSpan: F(v, "gridSpan") ?? 1, rowSpan: F(v, "rowSpan") ?? 1, merged: ye(v, "hMerge") || ye(v, "vMerge"), fill: A.fill ?? L.fill, text: U, borders: z, margins: [B("marT", 45720), B("marR", 91440), B("marB", 45720), B("marL", 91440)], vAlign: I(X, "anchor") === "ctr" ? "middle" : I(X, "anchor") === "b" ? "bottom" : "top", vert: I(X, "vert") === "vert" ? "vert" : I(X, "vert") === "vert270" ? "vert270" : void 0, ...j || W ? { editInfo: { ...j ? { textTemplate: j } : {}, ...W ? { styleBase: W } : {} } } : {} };
    }) };
  }, m = p.map((b, M) => d(b, M, p.length));
  let $ = r.edit && a ? { tableStyle: f } : void 0;
  const x = p[p.length - 1];
  if (r.edit && x) {
    const b = p.length;
    $ = { ...$, tableRowAppend: { ...b === 1 ? { previousLast: d(x, 0, 2) } : {}, regular: [d(x, b, b + 2), d(x, b + 1, b + 3)], last: [d(x, b, b + 1), d(x, b + 1, b + 2)] } };
  }
  return { kind: "table", ...t, colWidths: h, rows: m, name: o, ...$ ? { editInfo: $ } : {} };
}
const Wl = /* @__PURE__ */ new WeakMap();
let Vl = null;
const Sd = '<a:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="zh-CN"/></a:p></a:txBody>', Ld = '<a:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="zh-CN" b="0"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill></a:endParaRPr></a:p></a:txBody>', Td = '<a:solidFill><a:schemeClr val="tx1"><a:alpha val="25000"/></a:schemeClr></a:solidFill>';
function yo(e, t) {
  const r = [e?.wholeTbl ?? null, t];
  return `<a:tcPr>${Ts.map(([, n, o]) => {
    let s = null;
    for (const l of r) {
      const i = w(w(w(l, "tcStyle"), "tcBdr"), n);
      i && (s = w(i, "ln"));
    }
    return s ? Ps(s, `a:${o}`) : `<a:${o} w="9525">${Td}</a:${o}>`;
  }).join("")}${e ? "" : '<a:solidFill><a:schemeClr val="lt1"/></a:solidFill>'}</a:tcPr>`;
}
function Pd(e, t, r) {
  const n = `${t}\0${e.join("\0")}`, o = r ? Wl.get(r) : null, s = r ? o?.get(n) : Vl;
  if (s) return s;
  const l = (c) => `<a:tc>${t}${c}</a:tc>`, i = Gr(`<root xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
<a:tbl><a:tblPr firstRow="1" bandRow="1"/><a:tblGrid><a:gridCol w="9525"/></a:tblGrid>
<a:tr h="9525">${l(e[0])}</a:tr>
<a:tr h="9525">${l(e[1])}</a:tr>
<a:tr h="9525">${l(e[2])}</a:tr>
</a:tbl></root>`), a = w(i, "tbl");
  if (r) {
    const c = o ?? /* @__PURE__ */ new Map();
    c.set(n, a), o || Wl.set(r, c);
  } else Vl = a;
  return a;
}
function Is(e, t) {
  var r, n, o, s;
  const l = (r = I(e.tableStyles, "def")) == null ? void 0 : r.trim(), i = l ? za(e.tableStyles, l) : null, a = vd(i?.style ?? null), c = [yo(a, a?.firstRow ?? null), yo(a, a?.band1H ?? null), yo(a, a?.band2H ?? null)], u = a ? Sd : Ld, f = Oa(Pd(c, u, a ? e.tableStyles : null), { x: 0, y: 0, w: 1, h: 3, rot: 0, flipH: !1, flipV: !1 }, e, t), [h, p, d] = f.rows.map((m) => m.cells[0]);
  if (!((n = h?.editInfo) != null && n.textTemplate) || !((o = p?.editInfo) != null && o.textTemplate) || !((s = d?.editInfo) != null && s.textTemplate)) throw new Error("无法构造新增表格单元格模板");
  return { ...l ? { styleId: l } : {}, textBodyMarkup: u, cellPropertiesMarkup: c, firstRow: h, bandRows: [p, d] };
}
function Ad(e) {
  const t = I(e, "title"), r = I(e, "descr");
  if (!(t === null && r === null)) return { ...t === null ? {} : { title: t }, ...r === null ? {} : { descr: r } };
}
function Id(e, t) {
  const r = [], n = e.getElementsByTagName("*");
  for (let o = 0; o < n.length; o++) if (n[o].localName === "sectionLst") {
    for (const s of K(n[o], "section")) {
      const l = [], i = [];
      for (const c of K(w(s, "sldIdLst"), "sldId")) {
        const u = F(c, "id");
        if (u === null) continue;
        l.push(u);
        const f = t.get(u);
        f !== void 0 && i.push(f);
      }
      const a = I(s, "id");
      r.push({ name: I(s, "name") ?? `节 ${r.length + 1}`, slideIds: l, slideIndexes: i, ...a === null ? {} : { id: a } });
    }
    break;
  }
  return r;
}
const Nd = /* @__PURE__ */ new Set(["http://schemas.openxmlformats.org/presentationml/2006/main", "http://schemas.openxmlformats.org/drawingml/2006/main", "http://schemas.openxmlformats.org/officeDocument/2006/math", "http://schemas.microsoft.com/office/powerpoint/2010/main", "http://schemas.microsoft.com/office/drawing/2010/main"]);
function ns(e) {
  return e.some((t) => t.kind === "unsupported" || t.kind === "group" && ns(t.children));
}
function ja(e) {
  return Array.from(e.children).filter((t) => t.namespaceURI === Ot).flatMap((t) => Array.from(t.children).flatMap((r) => r.namespaceURI === Ot && r.localName === "AlternateContent" ? ja(r) : [r]));
}
function Rd(e, t, r, n, o) {
  var s;
  if (e.namespaceURI !== Ot) return [];
  const l = ua(e, { has: (c) => Nd.has(c) || mf(c, o) }), i = K(e, "Choice").find((c) => c.namespaceURI === Ot);
  let a = l ? t(l) : Array.from(i?.children ?? []).flatMap((c) => {
    const u = r(c);
    return u ? [u] : [];
  });
  if (l?.localName === "Choice" && ns(a)) {
    const c = K(e, "Fallback").find((f) => f.namespaceURI === Ot), u = c ? t(c) : [];
    u.length && !ns(u) && (a = u);
  }
  if (n) {
    const c = ja(e).some((u) => {
      var f, h;
      return (h = (f = r(u)) == null ? void 0 : f.editInfo) == null ? void 0 : h.moveLocked;
    });
    for (const u of a) u.editInfo = { ...u.editInfo, editable: ((s = u.editInfo) == null ? void 0 : s.editable) === "none" ? "none" : "frame", requiresOriginal: !0, ...c ? { moveLocked: !0 } : {} };
  }
  return a;
}
const zd = "http://schemas.openxmlformats.org/officeDocument/2006/relationships", Pr = /* @__PURE__ */ new WeakMap();
function Ns(e, t, r) {
  const n = e.files;
  if (!n) return;
  let o = Pr.get(e);
  o || Pr.set(e, o = /* @__PURE__ */ new Map());
  const s = (f) => {
    const h = n[f];
    h && o.set(f, { url: `web-ppt-source:${f}`, mime: "application/octet-stream", bytes: h });
  }, l = (f) => {
    const h = f.lastIndexOf("/") + 1;
    return `${f.slice(0, h)}_rels/${f.slice(h)}.rels`;
  }, i = /* @__PURE__ */ new Set(), a = (f) => {
    if (!(i.has(f) || !n[f])) {
      i.add(f), s(f), s(l(f));
      for (const h of Object.values(e.rels(f))) a(h.target);
    }
  };
  s(r), s(l(r)), s("[Content_Types].xml");
  const c = e.rels(r), u = (f) => {
    var h;
    if (f.localName === "relIds" && (h = f.namespaceURI) != null && h.endsWith("/diagram")) for (const p of Object.values(c)) p.type.endsWith("/diagramDrawing") && a(p.target);
    for (const p of Array.from(f.attributes)) if (p.namespaceURI === zd) {
      const d = c[p.value];
      d && a(d.target);
    }
    for (const p of Array.from(f.children)) u(p);
  };
  u(t);
}
function Od(e) {
  var t;
  return [...((t = Pr.get(e)) == null ? void 0 : t.values()) ?? []];
}
function jd(e) {
  Pr.delete(e);
}
const Fd = { mp4: "video/mp4", m4v: "video/mp4", mov: "video/quicktime", webm: "video/webm", ogv: "video/ogg", avi: "video/x-msvideo", wmv: "video/x-ms-wmv", mpg: "video/mpeg", mpeg: "video/mpeg", mp3: "audio/mpeg", m4a: "audio/mp4", wav: "audio/wav", wma: "audio/x-ms-wma", ogg: "audio/ogg", oga: "audio/ogg", aac: "audio/aac", mid: "audio/midi", midi: "audio/midi" };
function dt(e) {
  if (!e) return null;
  const t = w(e, "off"), r = w(e, "ext"), n = w(e, "chOff"), o = w(e, "chExt");
  return { x: se(F(t, "x")), y: se(F(t, "y")), w: se(F(r, "cx")), h: se(F(r, "cy")), rot: (F(e, "rot") ?? 0) / 6e4, flipH: ye(e, "flipH"), flipV: ye(e, "flipV"), chX: se(F(n, "x")), chY: se(F(n, "y")), chW: se(F(o, "cx")), chH: se(F(o, "cy")) };
}
const ze = (e) => ({ x: e.x, y: e.y, w: e.w, h: e.h, rot: e.rot, flipH: e.flipH, flipV: e.flipV });
function qt(e) {
  const t = w(e, "cNvSpPr") ?? w(e, "cNvCxnSpPr") ?? w(e, "cNvPicPr") ?? w(e, "cNvGrpSpPr") ?? w(e, "cNvGraphicFramePr"), r = w(t, "spLocks") ?? w(t, "cxnSpLocks") ?? w(t, "picLocks") ?? w(t, "grpSpLocks") ?? w(t, "graphicFrameLocks");
  return ye(r, "noMove");
}
function Ut(e, t, r = null, n, o, s = !1, l = !1, i = 0, a) {
  if (!e.edit) return {};
  const c = F(t, "id"), u = {};
  if (c !== null && (u.origin = { part: e.partPath, spid: c }), r) {
    const h = I(r, "idx");
    u.placeholder = { type: I(r, "type") ?? "obj", ...h === null ? {} : { idx: h } };
  }
  n && (u.geom = n), a && (u.customGeometry = a), r && i && (u.placeholderDirect = i), o && (u.editable = o), s && (u.moveLocked = !0), l && (u.readonlyLink = !0);
  const f = Ad(t);
  return f && (u.altText = f), u.origin || u.placeholder || u.placeholderDirect || u.geom || u.customGeometry || u.editable || u.moveLocked || u.readonlyLink || u.altText ? { editInfo: u } : {};
}
function Fa(e, t) {
  return t ? { ...e, ctx: { ...e.ctx, phClr: t } } : e;
}
const Ua = ["noFill", "solidFill", "gradFill", "blipFill", "pattFill", "grpFill"];
function Da(e, t) {
  let r = 0;
  return w(e, "xfrm") && (r |= nn.transform), (w(e, "prstGeom") || w(e, "custGeom")) && (r |= nn.geometry), Ua.some((n) => !!w(e, n)) && (r |= nn.fill), w(e, "ln") && (r |= nn.stroke), (w(e, "effectLst") || w(e, "effectDag")) && (r |= nn.effects), t && (r |= nn.style), r;
}
const Ud = /* @__PURE__ */ new Set(["tl", "t", "tr", "l", "ctr", "r", "bl", "b", "br"]);
function dn(e, t) {
  if (!e) return null;
  for (const r of Ua) {
    const n = w(e, r);
    if (n) return Rs(n, t);
  }
  return null;
}
function Rs(e, t) {
  if (!e) return null;
  switch (e.localName) {
    case "noFill":
      return { type: "none" };
    case "solidFill":
      return { type: "solid", color: $e(e, t.ctx) ?? "rgb(0,0,0)" };
    case "gradFill": {
      const r = K(w(e, "gsLst"), "gs").map((o) => ({ pos: (F(o, "pos") ?? 0) / 1e5, color: $e(o, t.ctx) ?? "rgb(0,0,0)" })).sort((o, s) => o.pos - s.pos);
      if (!r.length) return null;
      if (w(e, "path")) return { type: "gradient", angle: 0, stops: r, radial: !0 };
      const n = w(e, "lin");
      return { type: "gradient", angle: n ? (F(n, "ang") ?? 0) / 6e4 : 90, stops: r };
    }
    case "blipFill": {
      const r = Ha(e, t);
      if (!r) return { type: "none" };
      const n = w(e, "tile"), o = F(w(w(e, "blip"), "alphaModFix"), "amt"), s = w(e, "srcRect"), l = (d) => (F(s, d) ?? 0) / 1e5, i = !!s && ["l", "t", "r", "b"].some((d) => I(s, d) !== null), a = Ba(e, t), c = a && !/^https?:/i.test(a) ? t.pkg.imageMetadata(a) : null, u = F(e, "dpi") ?? 0, f = c ? { sourceWidth: c.width * 96 / (u > 0 ? u : c.dpiX), sourceHeight: c.height * 96 / (u > 0 ? u : c.dpiY) } : {}, h = I(n, "algn"), p = Ud.has(h) ? h : "tl";
      return { type: "image", src: r, alpha: o !== null ? o / 1e5 : void 0, crop: i ? { l: l("l"), t: l("t"), r: l("r"), b: l("b") } : void 0, tile: n ? { sx: (F(n, "sx") ?? 1e5) / 1e5, sy: (F(n, "sy") ?? 1e5) / 1e5, flip: I(n, "flip") ?? "none", tx: se(F(n, "tx") ?? 0), ty: se(F(n, "ty") ?? 0), algn: p, ...f } : void 0 };
    }
    case "pattFill":
      return { type: "pattern", fg: $e(w(e, "fgClr"), t.ctx) ?? "rgb(0,0,0)", bg: $e(w(e, "bgClr"), t.ctx) ?? "rgba(0,0,0,0)", preset: I(e, "prst") ?? "pct50" };
    case "grpFill":
      return null;
  }
  return null;
}
function Ba(e, t) {
  var r;
  const n = w(e, "blip"), o = K(w(n, "extLst"), "ext").map((l) => w(l, "svgBlip")).find((l) => l !== null) ?? null, s = I(n, "r:embed") ?? I(n, "r:link") ?? I(o, "r:embed") ?? I(o, "r:link");
  return s ? ((r = t.rels[s]) == null ? void 0 : r.target) ?? null : null;
}
function Ha(e, t) {
  const r = Ba(e, t);
  return r ? /^https?:/i.test(r) ? r : t.pkg.mediaUrl(r) : null;
}
function Dd(e) {
  const t = w(e, "blip");
  if (!t) return;
  const r = [];
  w(t, "grayscl") && r.push("grayscale(1)");
  const n = w(t, "lum");
  if (n) {
    const o = (F(n, "bright") ?? 0) / 1e5, s = (F(n, "contrast") ?? 0) / 1e5;
    o && r.push(`brightness(${(1 + o).toFixed(2)})`), s && r.push(`contrast(${(1 + s).toFixed(2)})`);
  }
  return r.length ? r.join(" ") : void 0;
}
const Bd = { dash: [4, 3], dashDot: [4, 3, 1, 3], dot: [1, 3], lgDash: [8, 3], lgDashDot: [8, 3, 1, 3], lgDashDotDot: [8, 3, 1, 3, 1, 3], sysDash: [3, 3], sysDashDot: [3, 3, 1, 3], sysDashDotDot: [3, 3, 1, 3, 1, 3], sysDot: [1, 1] }, Hd = { flat: "butt", rnd: "round", sq: "square" };
function Wn(e, t, r) {
  if (!e) return r;
  if (w(e, "noFill")) return null;
  const n = F(e, "w") !== null ? se(F(e, "w")) : r?.width ?? 1, o = dn(e, t);
  let s = r?.color ?? null;
  if (o?.type === "solid" ? s = o.color : o?.type === "gradient" && o.stops.length && (s = o.stops[0].color), !s) return r ? { ...r, width: n } : null;
  const l = I(w(e, "prstDash"), "val"), i = Math.max(n, 1), a = l ? l === "solid" ? null : (Bd[l] ?? [4, 3]).map((p) => p * i) : r?.dash ?? null, c = kl(w(e, "headEnd")) ?? r?.head, u = kl(w(e, "tailEnd")) ?? r?.tail, f = Hd[I(e, "cap") ?? ""] ?? r?.cap, h = w(e, "round") ? "round" : w(e, "bevel") ? "bevel" : w(e, "miter") ? "miter" : r?.join;
  return { color: s, width: n, dash: a, cap: f, join: h, head: c, tail: u, compound: I(e, "cmpd") ?? r?.compound };
}
function Wa(e) {
  return e ? [{ def: { rp: { color: e } }, lvls: [] }] : [];
}
function Va(e, t) {
  if (!e) return { fill: null, stroke: null, fontColor: null, effects: void 0 };
  const r = (l, i) => {
    const a = w(e, l), c = Number(I(a, "idx") ?? "0");
    if (!a || !c) return { el: null, env: t };
    const u = $e(a, t.ctx);
    return { el: i[Math.min(c, i.length) - 1] ?? null, env: Fa(t, u) };
  }, n = r("fillRef", t.theme.fillStyles), o = r("lnRef", t.theme.lnStyles), s = r("effectRef", t.theme.effectStyles);
  return { fill: n.el ? Rs(n.el, n.env) : null, stroke: o.el ? Wn(o.el, o.env, null) : null, fontColor: $e(w(e, "fontRef"), t.ctx), effects: s.el ? bn(w(s.el, "effectLst") ?? s.el, s.env.ctx) : void 0 };
}
let sr = null;
const Xa = `<p:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef>
<a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef>
<a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></p:style>`, Ya = '<p:txBody><a:bodyPr anchor="ctr"/><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:endParaRPr lang="zh-CN"/></a:p></p:txBody>';
function Wd() {
  if (sr) return sr;
  const e = Gr(`<root xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
${Xa}
${Ya}
</root>`);
  return sr = { style: w(e, "style"), text: w(e, "txBody") }, sr;
}
function zs(e) {
  const t = Wd(), r = Va(t.style, e), n = Nt(t.text, { ctx: e.ctx, fonts: e.theme.fonts, chain: [e.docDefaults, ...Wa(r.fontColor), It(w(t.text, "lstStyle"), e.ctx, e.theme.fonts)], defaultColor: r.fontColor, slideNum: e.slideNum, edit: !0 }, !0);
  if (!n) throw new Error("无法构造新增形状文字模板");
  return { fill: r.fill, stroke: r.stroke, effects: r.effects, textTemplate: n, styleMarkup: Xa, textBodyMarkup: Ya };
}
function pt(e, t, r) {
  const n = [];
  if (!e) return n;
  for (let o = e.firstElementChild; o; o = o.nextElementSibling) {
    let s = null;
    try {
      s = Vd(o, t, r);
    } catch (l) {
      s = Ga(o, l, t);
    }
    Array.isArray(s) ? n.push(...s) : s && n.push(s);
  }
  return n;
}
function Vd(e, t, r) {
  {
    let n = null;
    switch (e.localName) {
      case "sp":
      case "cxnSp": {
        const o = e.localName === "sp" ? "nvSpPr" : "nvCxnSpPr", s = ee(e, o, "nvPr", "ph");
        if (r && s || s && t.hiddenPh.has(I(s, "type") ?? "")) break;
        n = Xd(e, t);
        break;
      }
      case "pic":
        n = Za(e, t);
        break;
      case "grpSp":
        n = Jd(e, t, r);
        break;
      case "graphicFrame":
        n = Kd(e, t);
        break;
      case "contentPart":
        n = qd(e, t);
        break;
      case "AlternateContent":
        return t.edit && Ns(t.pkg, e, t.partPath), Rd(e, (o) => pt(o, t, r), (o) => Ga(o, "不支持的兼容内容", t), t.edit, t.pkg);
    }
    return n;
  }
}
function Ga(e, t, r) {
  const n = w(e, "nvSpPr") ?? w(e, "nvPicPr") ?? w(e, "nvGrpSpPr") ?? w(e, "nvCxnSpPr") ?? w(e, "nvGraphicFramePr") ?? w(e, "nvContentPartPr"), o = dt(ee(e, "spPr", "xfrm") ?? ee(e, "grpSpPr", "xfrm") ?? w(e, "xfrm"));
  if (!o || o.w <= 0 || o.h <= 0) return null;
  const s = w(n, "cNvPr"), l = I(s, "name") ?? e.localName, i = t instanceof Error ? t.message : String(t);
  return { kind: "unsupported", ...ze(o), id: F(s, "id") ?? void 0, label: `${l}（解析失败：${i.slice(0, 40)}）`, ...Ut(r, s, ee(n, "nvPr", "ph"), void 0, "frame", qt(n)) };
}
function Xd(e, t) {
  var r, n;
  const o = e.localName === "cxnSp" ? "nvCxnSpPr" : "nvSpPr", s = w(e, o), l = w(s, "cNvPr"), i = ee(s, "nvPr", "ph"), a = I(i, "type"), c = I(i, "idx"), u = w(e, "spPr"), f = i ? fn(t.layoutPh, a, c) : null, h = i ? fn(t.masterPh, a, c) : null;
  let p = dt(w(u, "xfrm"));
  if (!p && i && (p = dt(ee(f, "spPr", "xfrm")) ?? dt(ee(h, "spPr", "xfrm"))), !p) return null;
  const d = Va(w(e, "style"), t);
  let m = u;
  !w(u, "prstGeom") && !w(u, "custGeom") && i && (m = ee(f, "spPr") ?? ee(h, "spPr") ?? u);
  const $ = w(m, "prstGeom"), x = w(m, "custGeom");
  let b = null, M = !1, E, y;
  if ($) {
    const O = I($, "prst") ?? "rect", U = Ko(w($, "avLst")), j = $n(O, p.w, p.h, U);
    b = j.d, M = j.open, t.edit && (E = { preset: O, adj: U });
  } else if (x) {
    const O = va(x, p.w, p.h);
    O && (b = O.d, M = O.open), t.edit && (y = ch(x, p.w, p.h));
  }
  let v = dn(u, t);
  !v && i && (v = dn(ee(f, "spPr"), t) ?? dn(ee(h, "spPr"), t)), v || (v = d.fill), M && (v = { type: "none" });
  let k = Wn(w(u, "ln"), t, d.stroke);
  !w(u, "ln") && i && (k = Wn(ee(f, "spPr", "ln") ?? ee(h, "spPr", "ln"), t, k));
  const T = bn(w(u, "effectLst"), t.ctx) ?? d.effects, S = t.edit && !T && i && !w(e, "style") ? bn(ee(f, "spPr", "effectLst") ?? ee(h, "spPr", "effectLst"), t.ctx) ?? void 0 : void 0;
  !b && (v || k) && (b = $n("rect", p.w, p.h, {}).d);
  const N = w(e, "txBody");
  let P = null, L, A;
  if (N) {
    const O = [t.docDefaults];
    if (i) {
      const W = a === "title" || a === "ctrTitle" ? "title" : !a || aa.body.includes(a) ? "body" : "other";
      O.push(t.masterStyles[W]), O.push(It(ee(h, "txBody", "lstStyle"), t.ctx, t.theme.fonts)), O.push(It(ee(f, "txBody", "lstStyle"), t.ctx, t.theme.fonts));
    } else O.push(...Wa(d.fontColor));
    O.push(It(w(N, "lstStyle"), t.ctx, t.theme.fonts));
    const U = { ctx: t.ctx, fonts: t.theme.fonts, chain: O, defaultColor: d.fontColor, slideNum: t.slideNum, bodyPrFallbacks: [ee(f, "txBody", "bodyPr"), ee(h, "txBody", "bodyPr")], resolveLink: (W, X) => Es(t, W, X), resolveImage: (W) => {
      var X;
      const B = (X = t.rels[W]) == null ? void 0 : X.target;
      return B ? t.pkg.mediaUrl(B) : null;
    }, edit: t.edit };
    P = Nt(N, U), !P && t.edit && (L = Nt(N, U, !0) ?? void 0);
    const j = P ?? L;
    if (t.edit && j) {
      const W = Sa(j, U, t.layoutCatalog === !0), X = JSON.stringify(W);
      A = ((r = t.textLevelTemplateCache) == null ? void 0 : r.get(X)) ?? W, (n = t.textLevelTemplateCache) == null || n.set(X, A);
    }
  }
  if (!b && !P && !L) return null;
  const z = Ss(l, t), R = Ut(t, l, i, E, void 0, qt(s), z.unsupported, Da(u, w(e, "style")), y);
  return R.editInfo && L && (R.editInfo.textTemplate = L), R.editInfo && A && (R.editInfo.textLevelTemplate = A), R.editInfo && S && (R.editInfo.placeholderInheritedEffects = S), { kind: "shape", ...ze(p), path: b, fill: v, stroke: k, text: P, openGeom: M || void 0, effects: T, scene3d: Tf(u, t.ctx), link: z.link, name: I(l, "name") ?? void 0, id: F(l, "id") ?? void 0, ...R };
}
const Yd = /* @__PURE__ */ new Set(["videoFile", "quickTimeFile"]), Gd = /* @__PURE__ */ new Set(["audioFile", "wavAudioFile", "audioCd"]), Zd = (e) => /^[a-z][a-z0-9+.-]*:/i.test(e);
function _d(e, t) {
  if (!e) return;
  let r = null, n = null, o = null;
  const s = e.getElementsByTagName("*");
  for (let a = 0; a < s.length; a++) {
    const c = s[a].localName;
    !r && Gd.has(c) ? r = s[a] : !n && Yd.has(c) ? n = s[a] : !o && c === "media" && (o = s[a]);
  }
  const l = r ? "audio" : n || o ? "video" : null;
  if (!l) return;
  const i = [r ?? n, o].flatMap((a) => a ? [I(a, "r:link"), I(a, "r:embed")] : []);
  for (const a of i) {
    const c = a ? t.rels[a] : void 0;
    if (!c) continue;
    if (c.external) {
      if (Zd(c.target)) return { kind: l, src: c.target, external: !0 };
      continue;
    }
    const u = c.target.slice(c.target.lastIndexOf(".") + 1).toLowerCase(), f = Fd[u] ?? (l === "audio" ? "audio/mpeg" : "video/mp4"), h = t.pkg.blobUrl(c.target, f);
    if (h) return { kind: l, src: h, mime: f };
  }
  return { kind: l, src: null };
}
function Za(e, t) {
  var r, n;
  const o = w(e, "nvPicPr"), s = w(e, "spPr"), l = ee(o, "nvPr", "ph");
  let i = dt(w(s, "xfrm"));
  if (!i && l) {
    const k = I(l, "type"), T = I(l, "idx");
    i = dt(ee(fn(t.layoutPh, k, T), "spPr", "xfrm")) ?? dt(ee(fn(t.masterPh, k, T), "spPr", "xfrm"));
  }
  if (!i) return null;
  const a = w(o, "cNvPr"), c = w(e, "blipFill"), u = Ha(c, t), f = I(a, "name") ?? "图片", h = _d(w(o, "nvPr"), t);
  h && (h.spid = F(a, "id") ?? void 0);
  const p = Ss(a, t);
  if (!u && !h) return { kind: "unsupported", ...ze(i), label: `${f}（格式不支持）`, link: p.link, name: I(a, "name") ?? void 0, id: F(a, "id") ?? void 0, ...Ut(t, a, l, void 0, "frame", qt(o), p.unsupported) };
  const d = w(c, "srcRect"), m = (k) => (F(d, k) ?? 0) / 1e5, $ = d ? { l: m("l"), t: m("t"), r: m("r"), b: m("b") } : null;
  let x = null;
  const b = w(s, "prstGeom"), M = w(s, "custGeom");
  let E;
  if (b) {
    const k = I(b, "prst") ?? "rect", T = Ko(w(b, "avLst"));
    k !== "rect" && (x = $n(k, i.w, i.h, T).d), t.edit && (E = { preset: k, adj: T });
  } else if (M) x = ((r = va(M, i.w, i.h)) == null ? void 0 : r.d) ?? null;
  else if (t.edit && l) {
    const k = I(l, "type"), T = I(l, "idx"), S = ee(fn(t.layoutPh, k, T), "spPr", "prstGeom") ?? ee(fn(t.masterPh, k, T), "spPr", "prstGeom");
    S && (E = { preset: I(S, "prst") ?? "rect", adj: Ko(w(S, "avLst")) });
  }
  const y = F(w(w(c, "blip"), "alphaModFix"), "amt"), v = Array.from(((n = w(w(c, "blip"), "duotone")) == null ? void 0 : n.children) ?? []).map((k) => vs(k, t.ctx));
  return { kind: "image", ...ze(i), src: u ?? "", crop: $, clipPath: x, alpha: y !== null ? y / 1e5 : void 0, filter: Dd(c), ...v.length === 2 ? { duotone: v } : {}, stroke: Wn(w(s, "ln"), t, null), effects: bn(w(s, "effectLst"), t.ctx), link: p.link, name: I(a, "name") ?? void 0, id: F(a, "id") ?? void 0, media: h, ...Ut(t, a, l, E, h ? "frame" : void 0, qt(o), p.unsupported, Da(s, null)) };
}
function qd(e, t) {
  var r;
  const n = dt(w(e, "xfrm"));
  if (!n || n.w <= 0 || n.h <= 0) return null;
  const o = I(e, "r:id"), s = o ? (r = t.rels[o]) == null ? void 0 : r.target : null, l = s ? t.pkg.xml(s) : null;
  if (!l) throw new Error("缺少 InkML 内容");
  const i = kf(l, n.w, n.h);
  if (!i.length) throw new Error("InkML 没有可用笔迹");
  const a = ee(e, "nvContentPartPr", "cNvPr"), c = Ut(t, a, null, void 0, "frame");
  return t.edit && (Ns(t.pkg, e, t.partPath), c.editInfo = { ...c.editInfo, requiresOriginal: !0 }), { kind: "group", ...ze(n), childX: 0, childY: 0, scaleX: 1, scaleY: 1, children: i, name: I(a, "name") ?? "墨迹", id: F(a, "id") ?? void 0, ...c };
}
function Jd(e, t, r) {
  const n = w(e, "nvGrpSpPr"), o = w(e, "grpSpPr"), s = dt(w(o, "xfrm"));
  if (!s) return null;
  const l = pt(e, t, r);
  if (!l.length) return null;
  const i = w(n, "cNvPr"), a = Ss(i, t);
  return { kind: "group", ...ze(s), childX: s.chX, childY: s.chY, scaleX: s.chW ? s.w / s.chW : 1, scaleY: s.chH ? s.h / s.chH : 1, children: l, effects: bn(w(o, "effectLst"), t.ctx), link: a.link, name: I(i, "name") ?? void 0, id: F(i, "id") ?? void 0, ...Ut(t, i, null, void 0, void 0, qt(n), a.unsupported) };
}
function Kd(e, t) {
  const r = w(e, "nvGraphicFramePr"), n = dt(w(e, "xfrm"));
  if (!n) return null;
  const o = ee(e, "graphic", "graphicData"), s = I(o, "uri") ?? "", l = w(r, "cNvPr"), i = ee(r, "nvPr", "ph"), a = I(l, "name") ?? void 0, c = F(l, "id") ?? void 0, u = Ut(t, l, i, void 0, void 0, qt(r)), f = Ut(t, l, i, void 0, "frame", qt(r)), h = w(o, "tbl");
  if (h) {
    const d = Oa(h, ze(n), t, Jt, a), m = t.edit ? { ...d.editInfo, ...u.editInfo } : void 0;
    return { ...d, id: c, ...u, ...m ? { editInfo: m } : {} };
  }
  if (t.edit && (Ns(t.pkg, e, t.partPath), f.editInfo = { ...f.editInfo, requiresOriginal: !0 }), s.endsWith("/chart") || s === "http://schemas.microsoft.com/office/drawing/2014/chartex") {
    const d = e0(o, n, t, s.endsWith("/chartex"));
    return d ? { ...d, id: c, ...f } : { kind: "unsupported", ...ze(n), label: "图表", name: a, id: c, ...f };
  }
  if (s.endsWith("/diagram")) {
    const d = t0(o, n, t);
    return d ? { ...d, id: c, ...f } : { kind: "unsupported", ...ze(n), label: "SmartArt", name: a, id: c, ...f };
  }
  if (s.endsWith("/ole") || s.includes("oleObject")) {
    const d = w(o, "oleObj");
    if (d) {
      const m = w(d, "pic");
      if (m) {
        const x = Za(m, t);
        if (x && x.kind === "image" && x.src) return { ...x, ...ze(n), name: a ?? x.name, id: c, ...f };
      }
      const $ = Qd(d, t);
      if ($) return { kind: "image", ...ze(n), src: $, crop: null, name: a, id: c, ...f };
    }
    return { kind: "unsupported", ...ze(n), label: "OLE 对象", name: a, id: c, ...f };
  }
  const p = s.includes("/media") || s.includes("video") ? "媒体对象" : "不支持的对象";
  return { kind: "unsupported", ...ze(n), label: p, name: a, id: c, ...f };
}
function Qd(e, t) {
  var r;
  const n = I(e, "spid");
  if (!n) return null;
  const o = Kt(t.rels, "/vmlDrawing");
  if (!o) return null;
  const s = t.pkg.xml(o);
  if (!s) return null;
  for (const l of s.getElementsByTagName("*")) if (!(l.localName !== "shape" || I(l, "id") !== n)) for (const i of l.getElementsByTagName("*")) {
    if (i.localName !== "imagedata") continue;
    const a = I(i, "o:relid") ?? I(i, "r:id"), c = a ? (r = t.pkg.rels(o)[a]) == null ? void 0 : r.target : null;
    return c ? t.pkg.mediaUrl(c) : null;
  }
  return null;
}
function e0(e, t, r, n = !1) {
  var o;
  if (!e) return null;
  const s = gf(n, r.pkg), l = I(w(e, "chart"), "r:id"), i = l ? (o = r.rels[l]) == null ? void 0 : o.target : null;
  if (!s || !i) return null;
  const a = r.pkg.xml(i);
  if (!a) return null;
  let c;
  try {
    c = s(a, t.w, t.h, { ctx: r.ctx, fonts: r.theme.fonts, rels: r.pkg.rels(i), ...n ? { readPart: (u) => {
      var f;
      return (f = r.pkg.files) == null ? void 0 : f[u];
    } } : {} });
  } catch {
    return null;
  }
  return c.length ? { kind: "group", ...ze(t), childX: 0, childY: 0, scaleX: 1, scaleY: 1, children: c, name: "图表" } : null;
}
function t0(e, t, r) {
  var n;
  if (!e) return null;
  const o = w(e, "relIds");
  let s = null;
  const l = I(o, "r:dm"), i = l ? (n = r.rels[l]) == null ? void 0 : n.target : null;
  if (i) {
    const h = r.pkg.xml(i), p = h?.getElementsByTagName("*");
    for (let d = 0; p && d < p.length; d++) if (p[d].localName === "dataModelExt") {
      const m = I(p[d], "relId");
      m && r.rels[m] && (s = r.rels[m].target);
      break;
    }
  }
  if (s || (s = Kt(r.rels, "/diagramDrawing")), !s) return vo(o, t, r);
  const a = r.pkg.xml(s), c = w(a, "spTree");
  if (!c) return vo(o, t, r);
  const u = { ...r, rels: r.pkg.rels(s), partPath: s, layoutPh: [], masterPh: [] }, f = pt(c, u, !1);
  return f.length ? { kind: "group", ...ze(t), childX: 0, childY: 0, scaleX: 1, scaleY: 1, children: f, name: "SmartArt" } : vo(o, t, r);
}
function vo(e, t, r) {
  const n = (h) => {
    var p;
    const d = I(e, h), m = d ? (p = r.rels[d]) == null ? void 0 : p.target : null;
    return m ? r.pkg.xml(m) : null;
  }, o = n("r:dm"), s = jh(o);
  if (!s.length) return null;
  const l = n("r:lo"), i = n("r:cs"), a = Uh(i), c = (a.length ? a : ["accent1", "accent2", "accent3", "accent4", "accent5", "accent6"]).map((h) => /^[0-9a-fA-F]{6}$/.test(h) ? `#${h}` : `#${r.ctx.theme[r.ctx.clrMap[h] ?? h] ?? "4472C4"}`), u = { ctx: r.ctx, fonts: r.theme.fonts, chain: [r.docDefaults, r.masterStyles.other], defaultColor: "rgb(255,255,255)", slideNum: r.slideNum }, f = Zh(s, t.w, t.h, { family: zh(l), vertical: Oh(l), colors: c, textOf: (h) => {
    const p = Nt(Fh(o, h), u);
    return p ? { ...p, anchor: "middle", paragraphs: p.paragraphs.map((d) => ({ ...d, align: "center" })) } : null;
  } });
  return f.length ? _h(f, { ...ze(t), name: "SmartArt" }) : null;
}
const Jt = { fill: dn, line: Wn };
function n0(e) {
  if (!e) return "";
  const t = [], r = e.getElementsByTagName("*");
  for (let n = 0; n < r.length; n++) r[n].localName === "t" ? t.push(r[n].textContent ?? "") : r[n].localName === "p" && t.length && t.push(`
`);
  return t.join("").replace(/\n+/g, `
`).trim();
}
function r0(e) {
  const t = ee(e, "cSld", "spTree");
  for (const r of K(t, "sp")) {
    const n = ee(w(r, "nvSpPr"), "nvPr", "ph");
    if (I(n, "type") !== "body") continue;
    const o = w(r, "txBody");
    return K(o, "p").map((s) => {
      const l = [], i = s.getElementsByTagName("*");
      for (let a = 0; a < i.length; a++) {
        const c = i[a];
        c.localName === "t" ? l.push(c.textContent ?? "") : c.localName === "br" ? l.push(`
`) : c.localName === "tab" && I(c, "pos") === null && l.push("	");
      }
      return l.join("");
    }).join(`
`);
  }
  return "";
}
function _a(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of Object.values(t)) {
    if (!/\/(commentAuthors|authors)$/.test(n.type)) continue;
    const o = e.xml(n.target);
    if (!o) continue;
    const s = o.getElementsByTagName("*");
    for (let l = 0; l < s.length; l++) {
      const i = s[l];
      if (i.localName !== "cmAuthor" && i.localName !== "author") continue;
      const a = I(i, "id"), c = I(i, "name");
      a === null || !c || r.set(a, { name: c, initials: I(i, "initials") || void 0 });
    }
  }
  return r;
}
function o0(e, t, r) {
  const n = [];
  for (const o of Object.values(t)) {
    if (!o.type.endsWith("/comments")) continue;
    const s = e.xml(o.target);
    if (s) for (const l of K(s, "cm")) {
      const i = I(l, "authorId") ?? "", a = r.get(i), c = w(l, "pos"), u = w(l, "text"), f = u?.textContent ?? n0(w(l, "txBody")).trim(), h = F(l, "idx"), p = Array.from(l.getElementsByTagName("*")).find((d) => d.localName === "parentCm" && d.namespaceURI === "http://schemas.microsoft.com/office/powerpoint/2012/main");
      n.push({ id: I(l, "id") ?? `${i}:${h ?? n.length}`, ...p ? { parentId: `${I(p, "authorId") ?? ""}:${F(p, "idx")}` } : {}, author: a?.name ?? (i ? `作者 ${i}` : "未知作者"), initials: a?.initials, date: I(l, "dt") ?? I(l, "created") ?? void 0, text: f, x: se(F(c, "x")), y: se(F(c, "y")), idx: h !== null ? h : void 0 });
    }
  }
  return n.sort((o, s) => (o.idx ?? 0) - (s.idx ?? 0)), n;
}
function s0(e, t, r, n, o = !0) {
  var s;
  const l = [];
  for (const i of K(w(t, "embeddedFontLst"), "embeddedFont")) {
    const a = I(w(i, "font"), "typeface");
    if (a) for (const [c, u, f] of [["regular", !1, !1], ["bold", !0, !1], ["italic", !1, !0], ["boldItalic", !0, !0]]) {
      const h = I(w(i, c), "r:id"), p = h ? (s = r[h]) == null ? void 0 : s.target : null, d = o && p ? e.fontUrl(p) : null;
      d && l.push({ family: a, src: d, bold: u, italic: f });
      const m = n && p ? e.fontSourceUrl(p) : null;
      m && n.push({ family: a, src: m, bold: u, italic: f });
    }
  }
  return l;
}
function Xl(e, t = {}) {
  const r = new Ia(e, t.keepPackage === !0, t.zip);
  return t.assets === "defer" && (r.assetMode = "defer"), l0(r, t);
}
function l0(e, t) {
  var r;
  const n = "ppt/presentation.xml", o = e.xml(n);
  if (!o) throw new Error("无效的 .pptx：找不到 ppt/presentation.xml");
  const s = e.rels(n), l = w(o, "sldSz"), i = se(F(l, "cx") ?? 12192e3), a = se(F(l, "cy") ?? 6858e3), c = Kt(s, "/tableStyles"), u = c ? e.xml(c) : null, f = /* @__PURE__ */ new Map(), h = K(w(o, "sldIdLst"), "sldId"), p = {}, d = /* @__PURE__ */ new Map();
  h.forEach((P, L) => {
    var A;
    const z = I(P, "r:id"), R = z ? (A = s[z]) == null ? void 0 : A.target : null;
    R && (p[R] = L + 1);
    const O = F(P, "id");
    O !== null && d.set(O, L);
  });
  const m = _a(e, s), $ = [];
  for (const P of h) {
    const L = I(P, "r:id"), A = L ? (r = s[L]) == null ? void 0 : r.target : null;
    A && $.push(A);
  }
  const x = (P, L) => ({ background: { type: "solid", color: "rgb(255,255,255)" }, elements: [{ kind: "unsupported", x: i * 0.1, y: a * 0.4, w: i * 0.8, h: a * 0.2, rot: 0, flipH: !1, flipV: !1, label: `第 ${P + 1} 页解析失败：${L instanceof Error ? L.message : String(L)}` }], ...t.edit ? { editInfo: { origin: { part: $[P] } } } : {} }), b = (P) => {
    try {
      return Ka(e, $[P], P + 1, o, u, p, m, t.edit === !0, void 0, f);
    } catch (L) {
      return x(P, L);
    }
  };
  let M;
  t.lazy === !1 ? M = $.map((P, L) => b(L)) : (M = new Array($.length), $.forEach((P, L) => {
    let A;
    Object.defineProperty(M, L, { enumerable: !0, configurable: !0, get() {
      return A === void 0 && (A = b(L)), A;
    }, set(z) {
      A = z;
    } });
  }));
  const E = Id(o, d), y = t.edit ? Ls(o, s, (P) => e.xml(P), (P) => e.rels(P)) : void 0, v = y ? Ja(e, o, s, u, p, y.themeByMaster) : void 0, k = y ? qa(e, o, s, u, p, y.themeByMaster) : void 0, T = e.opcPackage, S = t.edit || t.embeddedFonts === "source" ? [] : void 0, N = s0(e, o, s, S, t.embeddedFonts !== "source");
  return { width: i, height: a, slides: M, source: "pptx", dispose: () => {
    jd(e), e.dispose();
  }, ...T ? { package: T } : {}, embeddedFonts: N, ...S != null && S.length ? { embeddedFontSources: S } : {}, sections: E.length ? E : void 0, ...v && k ? { editInfo: { layouts: v, masters: k, themes: y.themes, get assets() {
    return Od(e);
  }, ...c ? { tableStylesPart: c } : {} } } : {} };
}
function Mo(e, t) {
  return Sa({ anchor: "top", insets: [0, 0, 0, 0], wrap: !0, fontScale: 1, paragraphs: [] }, { ctx: e.ctx, fonts: e.theme.fonts, chain: [e.docDefaults, e.masterStyles[t]], slideNum: 1, edit: !0 });
}
function qa(e, t, r, n, o, s) {
  return La(t, r, (l) => e.xml(l), (l) => e.rels(l)).flatMap(({ part: l, layoutIds: i }) => {
    const a = nd(e, l, t, n, o, 1, !0);
    if (!a.masterRoot || a.masterPath !== l) return [];
    const c = a.envFor(l, !1);
    return [{ id: l, name: I(ee(a.masterRoot, "cSld"), "name") ?? l, ...s[l] ? { themeId: s[l] } : {}, layoutIds: [...i], background: Os(a.masterRoot, l, a), elements: pt(a.masterTree, c, !1), textStyles: { title: Mo(c, "title"), body: Mo(c, "body"), other: Mo(c, "other") }, defaultShape: zs(c), defaultTable: Is(c, Jt), tableStyles: As(n, c, Jt) }];
  });
}
function Os(e, t, r) {
  const { layoutRoot: n, layoutPath: o, masterRoot: s, masterPath: l, envFor: i } = r;
  for (const [a, c] of [[e, t], [n, o], [s, l]]) {
    const u = ee(a, "cSld", "bg");
    if (!u || !c) continue;
    const f = i(c, !1), h = w(u, "bgPr");
    if (h) {
      const E = dn(h, f);
      if (E) return E;
      continue;
    }
    const p = w(u, "bgRef");
    if (!p) continue;
    const d = Number(I(p, "idx") ?? "0"), m = $e(p, f.ctx), $ = d > 1e3 ? f.theme.bgFillStyles : f.theme.fillStyles, x = d > 1e3 ? d - 1e3 : d, b = x > 0 ? $[Math.min(x, $.length) - 1] ?? null : null, M = b ? Rs(b, Fa(f, m)) : m ? { type: "solid", color: m } : null;
    if (M) return M;
  }
  return null;
}
function Ja(e, t, r, n, o, s) {
  return Jh(t, r, (l) => e.xml(l), (l) => e.rels(l)).flatMap((l) => {
    const i = Pa(e, null, l, t, n, o, 1, !0);
    if (!i.layoutRoot || !i.masterPath) return [];
    const a = [];
    ye(i.layoutRoot, "showMasterSp", !0) && a.push(...pt(i.masterTree, i.envFor(i.masterPath, !1), !0)), a.push(...pt(i.layoutTree, i.envFor(l, !1), !0));
    const c = pt(i.layoutTree, { ...i.envFor(l, !0), layoutCatalog: !0 }, !1).flatMap((f) => {
      const h = Kh(f);
      return h ? [h] : [];
    }), u = i.envFor(l, !0);
    return [{ id: l, name: I(ee(i.layoutRoot, "cSld"), "name") ?? l, origin: { part: l, masterPart: i.masterPath }, themeId: s[i.masterPath], background: Os(null, null, i), ...ee(i.layoutRoot, "cSld", "bg") ? { directBackground: !0 } : {}, showMasterShapes: ye(i.layoutRoot, "showMasterSp", !0), elements: [...a, ...c], transition: Jo(i.layoutRoot) ?? void 0, defaultShape: zs(u), defaultTable: Is(u, Jt), tableStyles: As(n, u, Jt) }];
  });
}
function Ka(e, t, r, n, o, s, l, i, a, c) {
  const u = e.xml(t), f = e.rels(t), h = a ?? Kt(f, "/slideLayout"), p = Pa(e, u, h, n, o, s, r, i, c), { layoutRoot: d, masterPath: m, masterTree: $, layoutTree: x, envFor: b } = p, M = ee(u, "cSld", "spTree"), E = [];
  ye(u, "showMasterSp", !0) && ye(d, "showMasterSp", !0) && m && E.push(...pt($, b(m, !1), !0)), E.push(...pt(x, b(h, !1), !0)), E.push(...pt(M, b(t, !0), !1));
  const y = Os(u, t, p), v = w(n, "sldSz"), k = se(F(v, "cx") ?? 12192e3), T = se(F(v, "cy") ?? 6858e3), S = Object.entries(f).find(([, O]) => O.type.endsWith("/notesSlide")), N = S?.[1].target ?? null, P = N ? r0(e.xml(N)) : "", L = o0(e, f, l), A = Jo(u), z = lh(u, k, T);
  for (const O of z.media ?? []) {
    const U = E.find((j) => {
      var W;
      return j.kind === "image" && ((W = j.media) == null ? void 0 : W.spid) === O.spid;
    });
    U && U.kind === "image" && U.media && (U.media.playback = { volume: O.volume, loop: O.loop, clickGroup: O.clickGroup });
  }
  const R = i ? b(t, !0) : null;
  return { background: y, elements: E, notes: P || void 0, comments: L.length ? L : void 0, hidden: I(u, "show") === "0" || void 0, layoutName: I(ee(d, "cSld"), "name") ?? void 0, transition: A ?? Jo(d), animations: z.animations, ...i ? { editInfo: { origin: { part: t }, ...h ? { layoutId: h } : {}, ...N && S ? { notes: { part: N, relationshipId: S[0] } } : {}, ...ee(u, "cSld", "bg") ? { directBackground: !0 } : {}, ...A ? { directTransition: !0 } : {}, ...z.readonly ? { animationSourceReadonly: !0 } : {}, ...ye(u, "showMasterSp", !0) ? {} : { hideMasterShapes: !0 }, defaultShape: zs(R), defaultTable: Is(R, Jt), tableStyles: As(o, R, Jt) } } : {} };
}
const mt = (e) => e * 96 / 72, H = (e) => {
  if (!Number.isFinite(e)) return "0";
  const t = Math.round(e * 100) / 100;
  return Object.is(t, -0) ? "0" : String(t);
}, pe = (e, t, r) => e < t ? t : e > r ? r : e, Rt = (e, t = 0) => Number.isFinite(e) ? e : t;
function Fe(e, t, r, n, o, s, l) {
  return { kind: "shape", x: Rt(e), y: Rt(t), w: Math.max(Rt(r), 0), h: Math.max(Rt(n), 0), rot: 0, flipH: !1, flipV: !1, path: o, fill: s, stroke: l, text: null };
}
const i0 = (e, t) => `M 0 0 L ${H(e)} 0 L ${H(e)} ${H(t)} L 0 ${H(t)} Z`;
function Vn(e, t, r) {
  return Fe(e.x, e.y, e.w, e.h, i0(e.w, e.h), t, r);
}
function ot(e, t, r, n, o) {
  if (!o || ![e, t, r, n].every(Number.isFinite)) return null;
  const s = Math.min(e, r), l = Math.min(t, n);
  return Fe(s, l, Math.abs(r - e), Math.abs(n - t), `M ${H(e - s)} ${H(t - l)} L ${H(r - s)} ${H(n - l)}`, null, o);
}
function js(e, t, r, n) {
  const o = e.map((u) => u.filter(([f, h]) => Number.isFinite(f) && Number.isFinite(h))).filter((u) => u.length >= 3);
  if (!o.length) return null;
  let s = 1 / 0, l = 1 / 0, i = -1 / 0, a = -1 / 0;
  for (const u of o) for (const [f, h] of u) s = Math.min(s, f), l = Math.min(l, h), i = Math.max(i, f), a = Math.max(a, h);
  const c = o.map((u) => "M " + u.map(([f, h]) => `${H(f - s)} ${H(h - l)}`).join(" L ") + " Z").join(" ");
  return Fe(s, l, i - s, a - l, c, t, r);
}
const a0 = (e, t = 0.25) => We(e, "#ffffff", t), Fs = (e, t = 0.2) => We(e, "#000000", t);
function Qa(e, t, r) {
  return js([e], t, r);
}
function Ke(e, t, r, n, o, s = {}) {
  const l = { text: o, b: s.bold ?? !1, i: !1, u: !1, strike: !1, size: s.size ?? mt(10), color: s.color ?? "rgb(0,0,0)", fonts: s.fonts ?? [] }, i = { align: s.align ?? "center", lvl: 0, marL: 0, indent: 0, bullet: null, lineHeight: 1.15, spaceBefore: 0, spaceAfter: 0, runs: [l] }, a = { anchor: s.anchor ?? "middle", insets: [0, 0, 0, 0], wrap: !1, fontScale: 1, paragraphs: [i] };
  return { kind: "shape", x: Rt(e), y: Rt(t), w: Math.max(Rt(r), 0), h: Math.max(Rt(n), 0), rot: s.rot ?? 0, flipH: !1, flipV: !1, path: null, fill: null, stroke: null, text: a };
}
function Us(e, t) {
  let r = 0;
  for (const n of e) {
    const o = n.codePointAt(0) ?? 32;
    o >= 4352 && o <= 8191 || o >= 11904 && o <= 42191 || o >= 44032 && o <= 55203 || o >= 63744 && o <= 64255 || o >= 65072 && o <= 65376 ? r += 1 : `iljtf.,:;'"|!I[]()`.includes(n) ? r += 0.3 : "mwMW@%".includes(n) ? r += 0.85 : n >= "A" && n <= "Z" ? r += 0.66 : r += 0.53;
  }
  return r * t;
}
const Ae = (e) => ({ type: "solid", color: e });
function ec(e, t) {
  const r = e.clrMap[t] ?? t, n = (e.theme[r] ?? e.theme[t] ?? "000000").replace(/^#/, "");
  return "#" + (n.length >= 6 ? n.slice(0, 6) : n.padStart(6, "0"));
}
function Yl(e) {
  const t = e.trim();
  if (t.startsWith("#")) {
    const n = t.slice(1), o = n.length === 3 ? n.split("").map((s) => s + s).join("") : n.padStart(6, "0");
    return [parseInt(o.slice(0, 2), 16) || 0, parseInt(o.slice(2, 4), 16) || 0, parseInt(o.slice(4, 6), 16) || 0];
  }
  const r = t.match(/-?[\d.]+/g);
  return r && r.length >= 3 ? [Number(r[0]) || 0, Number(r[1]) || 0, Number(r[2]) || 0] : [0, 0, 0];
}
function We(e, t, r) {
  const n = Yl(e), o = Yl(t), s = pe(r, 0, 1), l = n.map((i, a) => Math.round(i + (o[a] - i) * s));
  return `rgb(${l[0]},${l[1]},${l[2]})`;
}
function tc(e, t) {
  const r = (t % 6 + 6) % 6, n = ec(e, `accent${r + 1}`), o = Math.floor(t / 6);
  return o <= 0 ? n : o % 2 === 1 ? We(n, "#ffffff", pe(0.3 * Math.ceil(o / 2), 0, 0.72)) : We(n, "#000000", pe(0.22 * (o / 2), 0, 0.6));
}
function Dt(e, t) {
  if (!e) return null;
  if (w(e, "noFill")) return { type: "none" };
  const r = w(e, "solidFill");
  if (r) return Ae($e(r, t) ?? "rgb(0,0,0)");
  const n = w(e, "gradFill");
  if (n) {
    const s = K(w(n, "gsLst"), "gs").map((i) => ({ pos: (F(i, "pos") ?? 0) / 1e5, color: $e(i, t) ?? "rgb(0,0,0)" })).sort((i, a) => i.pos - a.pos);
    if (!s.length) return null;
    const l = w(n, "lin");
    return { type: "gradient", angle: l ? (F(l, "ang") ?? 0) / 6e4 : 90, stops: s };
  }
  const o = w(e, "pattFill");
  if (o) {
    const s = $e(w(o, "fgClr"), t);
    if (s) return Ae(s);
  }
  return null;
}
const c0 = { dash: [4, 3], dashDot: [4, 3, 1, 3], dot: [1, 3], lgDash: [8, 3], lgDashDot: [8, 3, 1, 3], lgDashDotDot: [8, 3, 1, 3, 1, 3], sysDash: [3, 3], sysDashDot: [3, 3, 1, 3], sysDashDotDot: [3, 3, 1, 3, 1, 3], sysDot: [1, 1] }, Ds = { color: null, width: null, dash: null, none: !1, present: !1 };
function gt(e, t) {
  if (!e) return { ...Ds };
  const r = { color: null, width: null, dash: null, none: !1, present: !0 };
  if (w(e, "noFill")) return r.none = !0, r;
  r.color = $e(w(e, "solidFill"), t);
  const n = F(e, "w");
  n !== null && (r.width = se(n));
  const o = I(w(e, "prstDash"), "val");
  return o && o !== "solid" && (r.dash = (c0[o] ?? [4, 3]).map((s) => s * Math.max(r.width ?? 1, 1))), r;
}
function Ve(e, t, r) {
  const n = e ?? Ds;
  if (n.none) return null;
  const o = n.color ?? t;
  if (!o) return null;
  const s = n.width ?? r;
  return s > 0 ? { color: o, width: s, dash: n.dash } : null;
}
function u0(e) {
  const t = [];
  let r = "", n = !1;
  for (let o = 0; o < e.length; o++) {
    const s = e[o];
    if (s === '"') {
      n = !n, r += s;
      continue;
    }
    if (s === "\\") {
      r += s + (e[o + 1] ?? ""), o++;
      continue;
    }
    if (s === ";" && !n) {
      t.push(r), r = "";
      continue;
    }
    r += s;
  }
  return t.push(r), t;
}
const ko = (e) => e.replace(/\\(.)/g, "$1").replace(/"/g, "").replace(/[*_](.)/g, "").replace(/@/g, "");
function f0(e) {
  if (Number.isInteger(e)) return String(e);
  const t = Math.abs(e);
  return t !== 0 && (t >= 1e11 || t < 1e-4) ? e.toExponential(2) : String(Math.round(e * 1e6) / 1e6);
}
function h0(e) {
  return e.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function Co(e, t) {
  const r = t.replace(/\[[^\]]*\]/g, "");
  let n = e;
  const o = n < 0;
  n = Math.abs(n);
  const s = (r.match(/%/g) ?? []).length;
  s && (n *= Math.pow(100, s));
  const l = r.match(/[#0?][#0?,]*(\.[#0?]+)?/);
  if (!l) return (o ? "-" : "") + ko(r);
  const i = l[0], a = l.index ?? 0, c = ko(r.slice(0, a)), u = ko(r.slice(a + i.length)), f = i.indexOf(".");
  let h = f < 0 ? i : i.slice(0, f);
  const p = f < 0 ? "" : i.slice(f + 1), d = h.match(/,+$/);
  d && (n /= Math.pow(1e3, d[0].length), h = h.slice(0, -d[0].length));
  const m = h.includes(","), $ = p.length, x = (p.match(/0/g) ?? []).length;
  let b = n.toFixed(Math.min($, 20));
  $ > x && (b = b.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, ""), (b.split(".")[1] ?? "").length < x && (b = n.toFixed(x)));
  let [M, E] = b.split(".");
  const y = (h.match(/0/g) ?? []).length;
  return M.length < y && (M = M.padStart(y, "0")), y === 0 && M === "0" && E && (M = ""), m && (M = h0(M)), (o ? "-" : "") + c + M + (E ? "." + E : "") + u;
}
function jt(e, t) {
  if (!Number.isFinite(e)) return "";
  const r = (t ?? "").trim();
  if (!r || /^general$/i.test(r)) return f0(e);
  if (/e[+-]/i.test(r)) return e.toExponential(2);
  const n = u0(r);
  return e < 0 && n.length > 1 && n[1].trim() ? Co(-e, n[1]) : e === 0 && n.length > 2 && n[2].trim() ? Co(0, n[2]) : Co(e, n[0] ?? "");
}
const On = (e) => Number(e.toPrecision(12));
function Bs(e, t, r = 5) {
  let n = Number.isFinite(e) ? e : 0, o = Number.isFinite(t) ? t : 1;
  if (o < n && ([n, o] = [o, n]), n === o) if (n === 0) n = 0, o = 1;
  else {
    const f = Math.abs(n) * 0.5;
    n -= f, o += f;
  }
  const s = (o - n) / Math.max(1, r), l = Math.pow(10, Math.floor(Math.log10(s))), i = s / l, a = (i <= 1 ? 1 : i <= 2 ? 2 : i <= 5 ? 5 : 10) * l, c = On(Math.floor(n / a + 1e-9) * a);
  let u = On(Math.ceil(o / a - 1e-9) * a);
  return u > c || (u = On(c + a)), { min: c, max: u, step: a };
}
function d0(e) {
  const t = [];
  if (!(e.step > 0) || !Number.isFinite(e.min) || !Number.isFinite(e.max)) return [e.min];
  const r = Math.floor((e.max - e.min) / e.step + 1e-6), n = Math.min(r, 60);
  for (let s = 0; s <= n; s++) t.push(On(e.min + s * e.step));
  const o = t[t.length - 1];
  return o !== void 0 && e.max - o > e.step * 1e-6 && t.push(On(e.max)), t;
}
const p0 = { barChart: "bar", bar3DChart: "bar", lineChart: "line", line3DChart: "line", stockChart: "stock", pieChart: "pie", pie3DChart: "pie", ofPieChart: "ofPie", doughnutChart: "doughnut", areaChart: "area", area3DChart: "area", scatterChart: "scatter", bubbleChart: "bubble", radarChart: "radar", surfaceChart: "surface", surface3DChart: "surface" }, nc = (e) => e === "scatter" || e === "bubble", Oe = (e, t, r) => {
  const n = w(e, t);
  return n ? ye(n, "val", !0) : r;
}, ve = (e, t) => F(w(e, t), "val"), Le = (e, t) => I(w(e, t), "val");
function rc(e) {
  if (!e) return null;
  for (const t of ["numRef", "strRef", "multiLvlStrRef"]) {
    const r = w(e, t);
    if (r) return w(r, "numCache") ?? w(r, "strCache") ?? w(r, "multiLvlStrCache");
  }
  return w(e, "numLit") ?? w(e, "strLit") ?? null;
}
function oc(e, t) {
  var r;
  const n = new Array(Math.max(0, Math.min(t, 2e4))).fill("");
  for (const o of K(e, "pt")) {
    const s = F(o, "idx") ?? -1;
    if (!(s < 0 || s > 2e4)) {
      for (; n.length <= s; ) n.push("");
      n[s] = ((r = w(o, "v")) == null ? void 0 : r.textContent) ?? "";
    }
  }
  return n;
}
function yr(e) {
  var t;
  const r = rc(e);
  if (!r) return { vals: [], fmt: null };
  const n = ((t = w(r, "formatCode")) == null ? void 0 : t.textContent) ?? null;
  return { vals: oc(r, F(w(r, "ptCount"), "val") ?? 0).map((o) => {
    if (o === "") return null;
    const s = Number(o);
    return Number.isFinite(s) ? s : null;
  }), fmt: n };
}
function m0(e) {
  const t = rc(e);
  if (!t) return [];
  if (t.localName === "numCache" || t.localName === "numLit") {
    const { vals: o, fmt: s } = yr(e);
    return o.map((l) => l === null ? "" : jt(l, s));
  }
  const r = K(t, "lvl"), n = r.length ? r[0] : t;
  return oc(n, F(w(t, "ptCount"), "val") ?? 0);
}
function Hs(e) {
  var t;
  const r = w(e, "rich");
  if (r) return K(r, "p").map((s) => {
    var l;
    let i = "";
    for (let a = s.firstElementChild; a; a = a.nextElementSibling) a.localName === "r" || a.localName === "fld" ? i += ((l = w(a, "t")) == null ? void 0 : l.textContent) ?? "" : a.localName === "br" && (i += " ");
    return i;
  }).join(" ").trim();
  const n = w(e, "strRef");
  if (n) {
    const s = w(n, "strCache"), l = K(s, "pt")[0];
    return (((t = w(l, "v")) == null ? void 0 : t.textContent) ?? "").trim();
  }
  const o = w(e, "v");
  return (o?.textContent ?? "").trim();
}
function jn(e, t) {
  const r = ee(e, "p", "pPr", "defRPr") ?? ee(e, "rich", "p", "pPr", "defRPr"), n = ee(e, "rich", "p", "r", "rPr"), o = r ?? n;
  if (!o) return { size: null, color: null, bold: !1 };
  const s = F(o, "sz");
  return { size: s !== null ? mt(s / 100) : null, color: $e(w(o, "solidFill"), t), bold: ye(o, "b", !1) };
}
const sc = { del: !0, showVal: !1, showCat: !1, showSer: !1, showPercent: !1, showSize: !1, fmt: null, pos: null, size: null, color: null };
function lc(e, t, r) {
  if (!e) return r;
  const n = Oe(e, "delete", !1), o = jn(w(e, "txPr"), t), s = { del: n, showVal: Oe(e, "showVal", r.showVal), showCat: Oe(e, "showCatName", r.showCat), showSer: Oe(e, "showSerName", r.showSer), showPercent: Oe(e, "showPercent", r.showPercent), showSize: Oe(e, "showBubbleSize", r.showSize), fmt: I(w(e, "numFmt"), "formatCode") ?? r.fmt, pos: Le(e, "dLblPos") ?? r.pos, size: o.size ?? r.size, color: o.color ?? r.color };
  return n ? { ...sc, fmt: s.fmt } : s;
}
const it = (e) => !e.del && (e.showVal || e.showCat || e.showSer || e.showPercent || e.showSize);
function g0(e, t) {
  if (!e) return null;
  const r = w(e, "spPr");
  return { symbol: Le(e, "symbol") ?? "auto", size: ve(e, "size") ?? 5, fill: Dt(r, t), ln: gt(w(r, "ln"), t) };
}
function $0(e, t, r, n, o) {
  const s = w(e, "spPr"), l = Dt(s, r), i = gt(w(s, "ln"), r), a = nc(t), c = w(e, "val") ?? w(e, "yVal") ?? w(e, "bubbleSize"), { vals: u, fmt: f } = yr(c), h = w(e, "xVal"), p = a && h ? yr(h).vals : null, d = t === "bubble" ? w(e, "bubbleSize") : null, m = d ? yr(d) : null, $ = m0(w(e, "cat") ?? (a ? h : null)), x = /* @__PURE__ */ new Map();
  for (const E of K(e, "dPt")) {
    const y = ve(E, "idx");
    if (y === null || y < 0) continue;
    const v = w(E, "spPr");
    x.set(y, { fill: Dt(v, r), ln: gt(w(v, "ln"), r), explosion: ve(E, "explosion") ?? 0 });
  }
  const b = t === "line" || t === "scatter" || t === "radar" || t === "stock";
  let M;
  return l && l.type === "solid" ? M = l.color : b && i.color ? M = i.color : M = tc(r, n), { idx: ve(e, "idx") ?? n, order: ve(e, "order") ?? n, name: Hs(w(e, "tx")) || `系列 ${n + 1}`, cats: $, vals: u, xs: p, sizes: m ? m.vals : null, sizeFmt: m ? m.fmt : null, fill: l, ln: i, marker: g0(w(e, "marker"), r), smooth: Oe(e, "smooth", !1), fmt: f, dLbls: lc(w(e, "dLbls"), r, o), dPts: x, color: M };
}
const Zr = (e) => e.grouping === "stacked" || e.grouping === "percentStacked";
function b0(e, t) {
  if (!e) return null;
  const r = w(e, "upBars"), n = w(e, "downBars");
  return { gapWidth: ve(e, "gapWidth") ?? 150, upFill: Dt(w(r, "spPr"), t), downFill: Dt(w(n, "spPr"), t), upLn: gt(ee(r, "spPr", "ln"), t), downLn: gt(ee(n, "spPr", "ln"), t) };
}
function x0(e) {
  return { type: (Le(e, "ofPieType") ?? "pie") === "bar" ? "bar" : "pie", splitType: Le(e, "splitType") ?? "auto", splitPos: ve(e, "splitPos"), custSplit: K(w(e, "custSplit"), "secondPiePt").map((t) => F(t, "val") ?? -1).filter((t) => t >= 0), secondSize: ve(e, "secondPieSize") ?? 75, serLines: w(e, "serLines") !== null };
}
function w0(e, t, r, n) {
  const o = Le(e, "grouping") ?? (t === "bar" ? "clustered" : "standard"), s = lc(w(e, "dLbls"), r, sc), l = K(e, "ser").map((a, c) => $0(a, t, r, n + c, s));
  l.sort((a, c) => a.order - c.order);
  const i = /* @__PURE__ */ new Map();
  for (const a of K(w(e, "bandFmts"), "bandFmt")) {
    const c = ve(a, "idx"), u = Dt(w(a, "spPr"), r);
    c !== null && c >= 0 && u && i.set(c, u);
  }
  return { kind: t, tag: e.localName, is3D: e.localName.endsWith("3DChart"), grouping: o, barDir: (Le(e, "barDir") ?? "col") === "bar" ? "bar" : "col", gapWidth: ve(e, "gapWidth") ?? 150, overlap: ve(e, "overlap") ?? (o === "stacked" || o === "percentStacked" ? 100 : 0), holeSize: ve(e, "holeSize") ?? 50, firstSliceAng: ve(e, "firstSliceAng") ?? 0, varyColors: Oe(e, "varyColors", t === "pie" || t === "doughnut" || t === "ofPie"), showMarker: Oe(e, "marker", !1), radarStyle: Le(e, "radarStyle") ?? "marker", scatterStyle: Le(e, "scatterStyle") ?? "lineMarker", axIds: K(e, "axId").map((a) => I(a, "val") ?? ""), series: l, dLbls: s, bubbleScale: ve(e, "bubbleScale") ?? 100, bubbleSizeBy: Le(e, "sizeRepresents") ?? "area", upDown: b0(w(e, "upDownBars"), r), hiLowLines: w(e, "hiLowLines") ? gt(ee(w(e, "hiLowLines"), "spPr", "ln"), r) : null, ofPie: t === "ofPie" ? x0(e) : null, wireframe: Oe(e, "wireframe", !1), bandFills: i };
}
const y0 = { catAx: "cat", valAx: "val", dateAx: "date", serAx: "ser" };
function Ar(e) {
  return { id: "", kind: e, del: !1, pos: null, crosses: null, crossAx: "", crossBetween: "between", min: null, max: null, majorUnit: null, reversed: !1, fmt: null, majorGrid: null, line: { ...Ds }, tickLblPos: "nextTo", majorTick: "out", lblSize: null, lblColor: null, title: null };
}
function v0(e, t, r) {
  const n = w(e, "scaling"), o = w(e, "majorGridlines"), s = jn(w(e, "txPr"), r);
  return { id: Le(e, "axId") ?? "", kind: t, del: Oe(e, "delete", !1), pos: Le(e, "axPos"), crosses: Le(e, "crosses"), crossAx: Le(e, "crossAx") ?? "", crossBetween: Le(e, "crossBetween") ?? "between", min: ve(n, "min"), max: ve(n, "max"), majorUnit: ve(e, "majorUnit"), reversed: Le(n, "orientation") === "maxMin", fmt: I(w(e, "numFmt"), "formatCode"), majorGrid: o ? gt(ee(o, "spPr", "ln"), r) : null, line: gt(ee(e, "spPr", "ln"), r), tickLblPos: Le(e, "tickLblPos") ?? "nextTo", majorTick: Le(e, "majorTickMark") ?? "out", lblSize: s.size, lblColor: s.color, title: (() => {
    const l = w(e, "title");
    return !l || Oe(e, "delete", !1) ? null : Hs(w(l, "tx")) || null;
  })() };
}
function M0(e) {
  const t = w(e, "manualLayout");
  if (!t) return null;
  const r = (o) => ve(t, o), n = { target: Le(t, "layoutTarget") ?? "outer", x: r("x"), y: r("y"), w: r("w"), h: r("h") };
  return n.x === null && n.y === null && n.w === null && n.h === null ? null : n;
}
function k0(e) {
  return e ? { rotX: ve(e, "rotX") ?? 15, rotY: ve(e, "rotY") ?? 20, depthPercent: ve(e, "depthPercent") ?? 100 } : null;
}
function C0(e, t) {
  const r = w(e, "chart"), n = w(r, "plotArea"), o = jn(w(e, "txPr"), t), s = [], l = [];
  let i = 0;
  if (n) for (let M = n.firstElementChild; M; M = M.nextElementSibling) {
    const E = p0[M.localName];
    if (!E) continue;
    if (E === "other") {
      l.push(M.localName);
      continue;
    }
    const y = w0(M, E, t, i);
    i += y.series.length, s.push(y);
  }
  const a = [];
  if (n) for (let M = n.firstElementChild; M; M = M.nextElementSibling) {
    const E = y0[M.localName];
    E && a.push(v0(M, E, t));
  }
  const c = w(r, "title"), u = Oe(r, "autoTitleDeleted", !1), f = w(c, "tx"), h = c && !Oe(c, "delete", !1) ? Hs(f) : "", p = jn(f ?? w(c, "txPr"), t), d = jn(w(c, "txPr"), t), m = w(r, "legend"), $ = /* @__PURE__ */ new Set();
  for (const M of K(m, "legendEntry")) {
    const E = ve(M, "idx");
    E !== null && Oe(M, "delete", !1) && $.add(E);
  }
  const x = w(e, "spPr"), b = w(n, "spPr");
  return { title: h && !u ? h : null, titleSize: p.size ?? d.size ?? mt(14), titleColor: p.color ?? d.color, titleBold: p.bold || d.bold, legendPos: m ? Le(m, "legendPos") ?? "r" : null, legendOverlay: Oe(m, "overlay", !1), legendDeleted: $, groups: s, axes: a, view3D: k0(w(r, "view3D")), fill: Dt(x, t), ln: gt(w(x, "ln"), t), plotFill: Dt(b, t), plotLn: gt(w(b, "ln"), t), plotLayout: M0(w(n, "layout")), textSize: o.size ?? mt(10), textColor: o.color ?? ec(t, "tx1"), unsupported: l };
}
const Ue = (e) => e * 1.4, ic = (e) => e * 2.9, ac = (e, t) => Us(e, t) + t * 0.5;
function Ir(e) {
  let t = 0;
  for (const r of e.labels) {
    const n = ac(r, e.size);
    n > t && (t = n);
  }
  return t;
}
const Nr = (e) => !e.axis.del && e.axis.tickLblPos !== "none", E0 = 0.08;
function S0(e, t) {
  const r = Math.max(Math.min(t.h, t.w * 1.2) * E0, 6), n = pe(e ? e.rotX : 15, -60, 60), o = pe(e ? e.rotY : 20, -90, 90), s = pe((e ? e.depthPercent : 100) / 100, 0.2, 3), l = r * pe(o / 20, -2, 2) * s, i = -r * pe(n / 20, -2, 2) * s;
  return Math.abs(l) < 1 && Math.abs(i) < 1 ? { dx: r * 0.5, dy: -r * 0.4 } : { dx: l, dy: i };
}
function L0(e, t) {
  const r = Math.abs(t.dx), n = Math.abs(t.dy);
  return { x: e.x + (t.dx < 0 ? r : 0), y: e.y + (t.dy < 0 ? n : 0), w: Math.max(e.w - r, 8), h: Math.max(e.h - n, 8) };
}
function T0(e, t, r) {
  const n = [], o = e.x, s = e.x + e.w, l = e.y, i = e.y + e.h, a = Ae(We(r, "#ffffff", 0.93)), c = Ae(We(r, "#ffffff", 0.86)), u = Ae(We(r, "#ffffff", 0.89)), f = (d, m) => {
    const $ = Qa(d, m, null);
    $ && n.push($);
  };
  f([[o + t.dx, l + t.dy], [s + t.dx, l + t.dy], [s + t.dx, i + t.dy], [o + t.dx, i + t.dy]], a);
  const h = t.dx >= 0 ? o : s;
  f([[h, l], [h + t.dx, l + t.dy], [h + t.dx, i + t.dy], [h, i]], u);
  const p = t.dy <= 0 ? i : l;
  return f([[o, p], [s, p], [s + t.dx, p + t.dy], [o + t.dx, p + t.dy]], c), n;
}
function cc(e, t) {
  return e > 0 && t > 0 && e <= t * (5 / 6) ? 0 : e;
}
function uc(e) {
  if (e.lo !== e.hi) return e;
  if (e.lo === 0) return { lo: 0, hi: 1 };
  const t = Math.abs(e.lo) * 0.2;
  return { lo: e.lo - t, hi: e.hi + t };
}
function _r(e) {
  let t = 1 / 0, r = -1 / 0, n = !1;
  const o = (s) => {
    Number.isFinite(s) && (s < t && (t = s), s > r && (r = s));
  };
  for (const s of e) if ((s.kind === "bar" || s.kind === "area") && (n = !0), s.grouping === "percentStacked") {
    let l = !1, i = !1;
    for (const a of s.series) for (const c of a.vals) c !== null && (c < 0 ? l = !0 : c > 0 && (i = !0));
    o(0), (i || !l) && o(1), l && o(-1);
  } else if (Zr(s)) {
    let l = 0;
    for (const i of s.series) l = Math.max(l, i.vals.length);
    for (let i = 0; i < l; i++) {
      let a = 0, c = 0;
      for (const u of s.series) {
        const f = u.vals[i];
        f == null || !Number.isFinite(f) || (f >= 0 ? a += f : c += f);
      }
      o(a), o(c);
    }
  } else for (const l of s.series) for (const i of l.vals) i !== null && o(i);
  return t === 1 / 0 ? { lo: 0, hi: 1 } : (n ? (t = Math.min(t, 0), r = Math.max(r, 0)) : t = cc(t, r), uc({ lo: t, hi: r }));
}
function P0(e) {
  let t = 1 / 0, r = -1 / 0;
  for (const n of e) for (const o of n.series) if (o.xs) for (const s of o.xs) s === null || !Number.isFinite(s) || (s < t && (t = s), s > r && (r = s));
  else o.vals.length && (t = Math.min(t, 1), r = Math.max(r, o.vals.length));
  return t === 1 / 0 ? { lo: 0, hi: 1 } : uc({ lo: cc(t, r), hi: r });
}
function A0(e, t, r) {
  const n = Bs(e.lo, e.hi, r);
  let o = t.min !== null && Number.isFinite(t.min) ? t.min : n.min, s = t.max !== null && Number.isFinite(t.max) ? t.max : n.max;
  s < o && ([o, s] = [s, o]);
  let l = t.majorUnit !== null && Number.isFinite(t.majorUnit) ? t.majorUnit : n.step;
  for (s === o && (s = o + Math.abs(l) || o + 1), l > 0 || (l = (s - o) / Math.max(1, r)), l > 0 || (l = 1); (s - o) / l > 100; ) l *= 2;
  return { min: o, max: s, step: l };
}
const qr = (e, t) => Math.round(pe(e / Math.max(t * 3.2, 1), 2, 12));
function fc(e, t, r, n, o, s) {
  const l = A0(r, e, n), i = d0(l), a = e.fmt ?? o;
  return { axis: e, side: t, scale: l, ticks: i, labels: i.map((c) => jt(c, a)), between: !1, catCount: i.length, size: e.lblSize ?? s.textSize, color: e.lblColor ?? s.textColor };
}
function I0(e, t, r, n, o) {
  return { axis: e, side: t, scale: null, ticks: r.map((s, l) => l), labels: r.slice(), between: n, catCount: r.length, size: e.lblSize ?? o.textSize, color: e.lblColor ?? o.textColor };
}
function Gl(e, t, r, n) {
  const o = t ? e.h : e.w, s = Math.max(r.catCount, 1), l = r.between ? o / s : s > 1 ? o / (s - 1) : o, i = r.axis.reversed, a = (d) => {
    const m = i ? o - d : d;
    return t ? e.y + e.h - m : e.x + m;
  }, c = (d) => a(r.between ? (d + 0.5) * l : d * l), u = (d) => a(d * l), { at: f, clampValue: h } = rs(e, t, n), p = (d, m) => t ? [m, d] : [d, m];
  return { rect: e, horizontal: t, catView: r, valView: n, band: l, cat: c, edge: u, val: f, clampVal: h, zero: f(h(0)), pt: p };
}
function rs(e, t, r) {
  const n = r.scale ?? { min: 0, max: 1 }, o = n.max - n.min || 1;
  return { at: (s) => {
    let l = (s - n.min) / o;
    return Number.isFinite(l) || (l = 0), r.axis.reversed && (l = 1 - l), t ? e.x + l * e.w : e.y + e.h - l * e.h;
  }, clampValue: (s) => Number.isFinite(s) ? pe(s, n.min, n.max) : n.min };
}
function N0(e, t, r) {
  const n = rs(e, !0, t), o = rs(e, !1, r);
  return { rect: e, x: n.at, y: o.at, clampX: n.clampValue, clampY: o.clampValue };
}
function os(e, t, r, n, o = null) {
  const s = e.textSize * 0.45, l = Ue(e.textSize * 1.05) + s * 0.6, i = { l: e.textSize * 0.4, r: e.textSize * 0.8, t: e.textSize * 0.8, b: e.textSize * 0.3 }, a = (c, u, f, h = !1) => {
    Nr(c) && (i[u] += (f ? h ? ic(c.size) : Ue(c.size) : Ir(c)) + s), c.axis.title && (i[u] += l);
  };
  if (a(r, r.side === "r" ? "r" : "l", !1), o && a(o, o.side, o.side === "t" || o.side === "b"), a(t, t.side === "t" ? "t" : "b", !0, n), Nr(t) && t.scale) {
    const c = Ir(t) / 2;
    i.l += c, i.r += c;
  }
  return i;
}
function ss(e, t) {
  const r = e.w * 0.72, n = e.h * 0.72;
  let { l: o, r: s, t: l, b: i } = t;
  if (o + s > r) {
    const a = r / (o + s);
    o *= a, s *= a;
  }
  if (l + i > n) {
    const a = n / (l + i);
    l *= a, i *= a;
  }
  return { x: e.x + o, y: e.y + l, w: Math.max(e.w - o - s, 8), h: Math.max(e.h - l - i, 8) };
}
function R0(e, t, r, n, o, s) {
  const l = o ? o.dx : 0, i = o ? o.dy : 0, a = ot(e + l, t + i, r + l, n + i, s);
  return a ? [a] : [];
}
function Ws(e, t, r) {
  const n = [], { rect: o, hAxis: s, vAxis: l } = t, i = We(e.textColor, "#ffffff", 0.78), a = We(e.textColor, "#ffffff", 0.45), c = e.textSize * 0.45, u = t.depth;
  for (const d of [!1, !0]) {
    const m = d ? s : l, $ = m.axis.majorGrid ? Ve(m.axis.majorGrid, i, 1) : null;
    if (!$) continue;
    const x = d ? t.hEdge : t.vEdge, b = x ?? (d ? t.hPos : t.vPos), M = x ? d ? t.hEdgeCount : t.vEdgeCount : m.ticks.length;
    for (let E = 0; E < M; E++) {
      const y = b(E), v = d ? y : o.x, k = d ? o.y : y;
      if (n.push(...R0(v, k, d ? y : o.x + o.w, d ? o.y + o.h : y, u, $)), u && t.gridWalls !== !1) {
        const T = d ? y : u.dx < 0 ? o.x + o.w : o.x, S = d ? u.dy > 0 ? o.y : o.y + o.h : y, N = ot(T, S, T + u.dx, S + u.dy, $);
        N && n.push(N);
      }
    }
  }
  const f = [], h = [], p = [];
  for (const d of [!0, !1]) {
    const m = d ? s : l, $ = d ? t.hPos : t.vPos, x = d ? t.hLineAt : t.vLineAt;
    if (!m.axis.del) {
      const v = Ve(m.axis.line, a, 1), k = d ? ot(o.x, x, o.x + o.w, x, v) : ot(x, o.y, x, o.y + o.h, v);
      k && f.push(k);
    }
    const b = m.size, M = d && t.hWrap, E = M ? ic(b) : Ue(b);
    let y = 0;
    if (Nr(m)) {
      y = (d ? E : Ir(m)) + c;
      for (let v = 0; v < m.labels.length; v++) {
        const k = m.labels[v];
        if (!k) continue;
        const T = M ? Math.max(t.hBand * 0.98, b * 2) : ac(k, b), S = d ? $(v) - T / 2 : m.side === "r" ? o.x + o.w + c : o.x - c - T, N = d ? m.side === "t" ? o.y - c - E : o.y + o.h + c : $(v) - E / 2, P = Ke(S, N, T, E, k, { size: b, color: m.color, align: d ? "center" : m.side === "r" ? "left" : "right", anchor: d ? m.side === "t" ? "bottom" : "top" : "middle", fonts: r });
        M && P.text && (P.text.wrap = !0), h.push(P);
      }
    }
    if (m.axis.title) {
      const v = e.textSize * 1.05, k = Ue(v);
      if (d) {
        const T = m.side === "t" ? o.y - y - c - k : o.y + o.h + y + c * 0.4;
        p.push(Ke(o.x, T, o.w, k, m.axis.title, { size: v, color: e.textColor, align: "center", anchor: "middle", fonts: r }));
      } else {
        const T = m.side === "r" ? o.x + o.w + y + c * 0.4 + k / 2 : o.x - y - c * 0.4 - k / 2;
        p.push(Ke(T - o.h / 2, o.y + o.h / 2 - k / 2, o.h, k, m.axis.title, { size: v, color: e.textColor, align: "center", anchor: "middle", fonts: r, rot: m.side === "r" ? 90 : -90 }));
      }
    }
  }
  return n.push(...f, ...h, ...p), n;
}
function z0(e, t, r) {
  const n = t.view.side === "l" || t.view.side === "r", o = t.grid ? t.view : { ...t.view, axis: { ...t.view.axis, majorGrid: null } }, s = { ...o, axis: { ...o.axis, del: !0, majorGrid: null, title: null } };
  return Ws(e, { rect: t.rect, hAxis: n ? s : o, vAxis: n ? o : s, hPos: t.pos, vPos: t.pos, hEdge: null, hEdgeCount: 0, vEdge: null, vEdgeCount: 0, hLineAt: t.at, vLineAt: t.at, hWrap: !1, hBand: 0, depth: t.depth, gridWalls: !1 }, r);
}
function O0(e, t) {
  return !Nr(e) || e.scale ? !1 : Ir(e) > t * 1.02;
}
const Bt = Math.PI * 2, Zl = ["circle", "square", "diamond", "triangle", "x", "plus", "star", "dot"];
function Qe(e, t, r, n) {
  const o = t.dPts.get(r), s = e.varyColors ? tc(n, r) : t.color, l = o?.fill ?? t.fill ?? Ae(s);
  return { fill: l, color: l.type === "solid" ? l.color : s };
}
function _t(e, t, r, n) {
  const o = e.dPts.get(t);
  return Ve(o != null && o.ln.present ? o.ln : e.ln, r, n);
}
const be = (e) => e == null || !Number.isFinite(e) ? null : e;
function j0(e) {
  let t = 1 / 0, r = 1 / 0, n = -1 / 0, o = -1 / 0;
  for (const [s, l] of e) s < t && (t = s), l < r && (r = l), s > n && (n = s), l > o && (o = l);
  return { x: t, y: r, w: n - t, h: o - r };
}
function F0(e, t, r) {
  const n = e.map(([s, l]) => [s - t, l - r]);
  let o = `M ${H(n[0][0])} ${H(n[0][1])}`;
  for (let s = 0; s < n.length - 1; s++) {
    const l = n[s === 0 ? 0 : s - 1], i = n[s], a = n[s + 1], c = n[s + 2 < n.length ? s + 2 : n.length - 1], u = [i[0] + (a[0] - l[0]) / 6, i[1] + (a[1] - l[1]) / 6], f = [a[0] - (c[0] - i[0]) / 6, a[1] - (c[1] - i[1]) / 6];
    o += ` C ${H(u[0])} ${H(u[1])} ${H(f[0])} ${H(f[1])} ${H(a[0])} ${H(a[1])}`;
  }
  return o;
}
function Vs(e, t, r, n, o) {
  const s = e.map((a) => a.filter(([c, u]) => Number.isFinite(c) && Number.isFinite(u))).filter((a) => a.length >= (n ? 3 : 2));
  if (!s.length) return null;
  const l = j0(s.flat()), i = s.map((a) => (o && a.length > 2 ? F0(a, l.x, l.y) : "M " + a.map(([c, u]) => `${H(c - l.x)} ${H(u - l.y)}`).join(" L ")) + (n ? " Z" : "")).join(" ");
  return Fe(l.x, l.y, l.w, l.h, i, t, r);
}
function Xn(e, t, r) {
  return `M ${H(e - r)} ${H(t)} A ${H(r)} ${H(r)} 0 1 1 ${H(e + r)} ${H(t)} A ${H(r)} ${H(r)} 0 1 1 ${H(e - r)} ${H(t)} Z`;
}
function U0(e, t) {
  const r = t, n = t * 2;
  switch (e) {
    case "square":
      return { d: `M 0 0 L ${H(n)} 0 L ${H(n)} ${H(n)} L 0 ${H(n)} Z`, open: !1 };
    case "diamond":
      return { d: `M ${H(r)} 0 L ${H(n)} ${H(r)} L ${H(r)} ${H(n)} L 0 ${H(r)} Z`, open: !1 };
    case "triangle":
      return { d: `M ${H(r)} 0 L ${H(n)} ${H(n)} L 0 ${H(n)} Z`, open: !1 };
    case "x":
      return { d: `M 0 0 L ${H(n)} ${H(n)} M ${H(n)} 0 L 0 ${H(n)}`, open: !0 };
    case "plus":
      return { d: `M ${H(r)} 0 L ${H(r)} ${H(n)} M 0 ${H(r)} L ${H(n)} ${H(r)}`, open: !0 };
    case "star":
      return { d: `M ${H(r)} 0 L ${H(r)} ${H(n)} M 0 ${H(r)} L ${H(n)} ${H(r)} M 0 0 L ${H(n)} ${H(n)} M ${H(n)} 0 L 0 ${H(n)}`, open: !0 };
    case "dash":
      return { d: `M 0 ${H(r)} L ${H(n)} ${H(r)}`, open: !0 };
    case "dot":
      return { d: Xn(r, r, t * 0.55), open: !1 };
    default:
      return { d: Xn(r, r, t), open: !1 };
  }
}
function Jr(e, t, r) {
  const n = e.kind === "scatter" ? e.scatterStyle !== "line" && e.scatterStyle !== "smooth" : e.showMarker;
  let o = t.marker ? t.marker.symbol : n ? "auto" : "none";
  return o === "auto" && (o = n ? Zl[r % Zl.length] : "none"), o;
}
function Kr(e, t, r, n, o) {
  var s, l;
  if (r === "none" || !Number.isFinite(e) || !Number.isFinite(t)) return null;
  const i = Math.max(mt(pe(((s = n.marker) == null ? void 0 : s.size) ?? 5, 2, 72)) / 2, 1), { d: a, open: c } = U0(r, i), u = (l = n.marker) == null ? void 0 : l.fill, f = n.marker ? Ve(n.marker.ln, null, 0) : null;
  return c ? Fe(e - i, t - i, i * 2, i * 2, a, null, f ?? { color: o, width: 1.25, dash: null }) : Fe(e - i, t - i, i * 2, i * 2, a, u ?? Ae(o), f);
}
function vt(e, t, r, n, o, s = null, l = o.cats[t] ?? "") {
  const i = e.dLbls, a = [];
  return i.showSer && a.push(e.name), i.showCat && a.push(l), i.showVal && a.push(jt(r, i.fmt ?? e.fmt)), i.showSize && s !== null && a.push(jt(s, e.sizeFmt ?? i.fmt ?? e.fmt)), i.showPercent && n !== null && a.push(jt(n, i.fmt && i.fmt.includes("%") ? i.fmt : "0%")), a.filter((c) => c !== "").join(" ");
}
function Mt(e, t, r, n, o) {
  if (!r || !Number.isFinite(e) || !Number.isFinite(t)) return null;
  const s = n.size ?? o.size * 0.92, l = Math.max(r.length * s * 0.75, s * 2), i = Ue(s);
  return Ke(e - l / 2, t - i / 2, l, i, r, { size: s, color: n.color ?? o.color, align: "center", anchor: "middle", fonts: o.fonts });
}
function D0(e, t, r, n, o) {
  const s = [], l = e.x, i = e.x + e.w, a = e.y, c = e.y + e.h, u = (p, d) => {
    const m = Qa(p, Ae(d), o);
    m && s.push(m);
  }, f = t.dx >= 0 ? i : l;
  u([[f, a], [f + t.dx, a + t.dy], [f + t.dx, c + t.dy], [f, c]], Fs(n));
  const h = t.dy <= 0 ? a : c;
  return u([[l, h], [i, h], [i + t.dx, h + t.dy], [l + t.dx, h + t.dy]], a0(n)), s.push(Fe(e.x, e.y, e.w, e.h, `M 0 0 L ${H(e.w)} 0 L ${H(e.w)} ${H(e.h)} L 0 ${H(e.h)} Z`, r, o)), s;
}
function B0(e, t, r, n, o = null) {
  const s = [], l = pe(e.gapWidth, 0, 800) / 100, i = pe(e.overlap, -100, 100) / 100, a = Math.max(r.total, 1), c = 1 + (a - 1) * (1 - i) + l;
  let u = t.band / (c > 0 ? c : 1);
  u > 0 || (u = t.band * 0.6), u = Math.min(u, t.band);
  const f = u * (1 + (a - 1) * (1 - i)), h = u * (1 - i), p = Zr(e), d = e.grouping === "percentStacked", m = e.series.reduce((y, v) => Math.max(y, v.vals.length), 0), $ = new Array(m).fill(0), x = new Array(m).fill(0), b = new Array(m).fill(0);
  if (d) for (let y = 0; y < m; y++) {
    let v = 0;
    for (const k of e.series) v += Math.abs(be(k.vals[y]) ?? 0);
    b[y] = v;
  }
  const M = [], E = [];
  if (e.series.forEach((y, v) => {
    const k = r.base + (p ? 0 : v), T = t.horizontal ? -1 : 1;
    for (let S = 0; S < m; S++) {
      const N = be(y.vals[S]);
      if (N === null) continue;
      const P = d ? b[S] > 0 ? N / b[S] : 0 : N;
      let L = 0;
      p && (L = P >= 0 ? $[S] : x[S], P >= 0 ? $[S] += P : x[S] += P);
      const A = t.cat(S) + T * (-f / 2 + k * h + u / 2), z = t.val(t.clampVal(L)), R = t.val(t.clampVal(L + P)), [O, U] = t.pt(A - u / 2, z), [j, W] = t.pt(A + u / 2, R), X = { x: Math.min(O, j), y: Math.min(U, W), w: Math.abs(j - O), h: Math.abs(W - U) }, { fill: B, color: Z } = Qe(e, y, S, n.ctx);
      if (X.w > 0.05 && X.h > 0.05 && E.push({ r: X, fill: B, color: Z, stroke: _t(y, S, null, 0), anchor: t.pt(A, z) }), it(y.dLbls)) {
        const Y = vt(y, S, N, d && b[S] > 0 ? Math.abs(N) / b[S] : null, n), J = y.dLbls.size ?? n.size * 0.92, G = Ue(J) * 0.6, le = y.dLbls.pos ?? (p ? "ctr" : "outEnd");
        let he = (X.x + X.x + X.w) / 2, me = (X.y + X.y + X.h) / 2;
        if (le !== "ctr") {
          const $t = le === "inEnd" || le === "inBase" ? -1 : 1;
          t.horizontal ? he = (P >= 0 ? X.x + X.w : X.x) + $t * (P >= 0 ? G : -G) : me = (P >= 0 ? X.y : X.y + X.h) - $t * (P >= 0 ? G : -G);
        }
        const ge = Mt(he, me, Y, y.dLbls, n);
        ge && M.push(ge);
      }
    }
  }), o) {
    const y = (v) => v.anchor[0] * o.dx + v.anchor[1] * o.dy;
    E.sort((v, k) => y(v) - y(k));
    for (const v of E) s.push(...D0(v.r, o, v.fill, v.color, v.stroke));
  } else for (const y of E) s.push(Fe(y.r.x, y.r.y, y.r.w, y.r.h, `M 0 0 L ${H(y.r.w)} 0 L ${H(y.r.w)} ${H(y.r.h)} L 0 ${H(y.r.h)} Z`, y.fill, y.stroke));
  return s.concat(M);
}
function hc(e) {
  const t = e.series.reduce((a, c) => Math.max(a, c.vals.length), 0), r = Zr(e), n = e.grouping === "percentStacked", o = new Array(t).fill(0);
  if (n) for (let a = 0; a < t; a++) {
    let c = 0;
    for (const u of e.series) c += Math.abs(be(u.vals[a]) ?? 0);
    o[a] = c;
  }
  const s = new Array(t).fill(0), l = [], i = [];
  for (const a of e.series) {
    const c = [], u = [];
    for (let f = 0; f < t; f++) {
      const h = be(a.vals[f]);
      if (h === null) {
        c.push(null), u.push(null);
        continue;
      }
      const p = n ? o[f] > 0 ? h / o[f] : 0 : h;
      r ? (u.push(s[f]), s[f] += p, c.push(s[f])) : (u.push(0), c.push(p));
    }
    l.push(c), i.push(u);
  }
  return { top: l, bottom: i };
}
function H0(e, t, r) {
  const n = [], o = [], { top: s } = hc(e), l = e.grouping === "percentStacked";
  return e.series.forEach((i, a) => {
    const c = s[a] ?? [], u = [];
    let f = [];
    const h = [];
    for (let $ = 0; $ < c.length; $++) {
      const x = c[$];
      if (x === null) {
        f.length && u.push(f), f = [], h.push(null);
        continue;
      }
      const b = t.pt(t.cat($), t.val(t.clampVal(x)));
      f.push(b), h.push(b);
    }
    f.length && u.push(f);
    const p = Ve(i.ln, i.color, mt(2.25)), d = Vs(u, null, p, !1, i.smooth);
    d && n.push(d);
    const m = Jr(e, i, a);
    for (let $ = 0; $ < h.length; $++) {
      const x = h[$];
      if (!x) continue;
      const { color: b } = Qe(e, i, $, r.ctx), M = Kr(x[0], x[1], m, i, e.varyColors ? b : i.color);
      if (M && o.push(M), it(i.dLbls)) {
        const E = be(i.vals[$]) ?? 0, y = vt(i, $, E, l ? c[$] ?? 0 : null, r), v = i.dLbls.size ?? r.size * 0.92, k = Mt(x[0], x[1] - Ue(v) * 0.85, y, i.dLbls, r);
        k && o.push(k);
      }
    }
  }), n.concat(o);
}
function W0(e, t, r) {
  const n = [], o = [], { top: s, bottom: l } = hc(e), i = e.grouping === "percentStacked";
  return e.series.forEach((a, c) => {
    const u = s[c] ?? [], f = l[c] ?? [], h = [];
    let p = [], d = [];
    const m = () => {
      p.length >= 2 && h.push(p.concat(d.slice().reverse())), p = [], d = [];
    };
    for (let b = 0; b < u.length; b++) {
      const M = u[b];
      if (M === null) {
        m();
        continue;
      }
      p.push(t.pt(t.cat(b), t.val(t.clampVal(M)))), d.push(t.pt(t.cat(b), t.val(t.clampVal(f[b] ?? 0))));
    }
    m();
    const { fill: $ } = Qe(e, a, 0, r.ctx), x = Vs(h, $, Ve(a.ln, null, 0), !0, a.smooth);
    if (x && n.push(x), it(a.dLbls)) for (let b = 0; b < u.length; b++) {
      const M = u[b];
      if (M === null) continue;
      const [E, y] = t.pt(t.cat(b), t.val(t.clampVal(M))), v = be(a.vals[b]) ?? 0, k = a.dLbls.size ?? r.size * 0.92, T = Mt(E, y - Ue(k) * 0.8, vt(a, b, v, i ? M : null, r), a.dLbls, r);
      T && o.push(T);
    }
  }), n.concat(o);
}
function V0(e, t, r) {
  const n = [], o = [], s = e.scatterStyle !== "marker" && e.scatterStyle !== "none";
  return e.series.forEach((l, i) => {
    const a = [];
    let c = [];
    const u = [];
    for (let h = 0; h < l.vals.length; h++) {
      const p = be(l.vals[h]), d = l.xs ? be(l.xs[h]) : h + 1;
      if (p === null || d === null) {
        c.length && a.push(c), c = [], u.push(null);
        continue;
      }
      const m = [t.x(t.clampX(d)), t.y(t.clampY(p))];
      c.push(m), u.push(m);
    }
    if (c.length && a.push(c), s) {
      const h = Ve(l.ln, l.color, mt(2.25)), p = Vs(a, null, h, !1, l.smooth || e.scatterStyle === "smoothMarker");
      p && n.push(p);
    }
    const f = Jr(e, l, i);
    for (let h = 0; h < u.length; h++) {
      const p = u[h];
      if (!p) continue;
      const { color: d } = Qe(e, l, h, r.ctx), m = Kr(p[0], p[1], f === "none" && !s ? "circle" : f, l, e.varyColors ? d : l.color);
      if (m && o.push(m), it(l.dLbls)) {
        const $ = l.dLbls.size ?? r.size * 0.92, x = Mt(p[0], p[1] - Ue($) * 0.85, vt(l, h, be(l.vals[h]) ?? 0, null, r, null, l.cats[h] ?? String(h + 1)), l.dLbls, r);
        x && o.push(x);
      }
    }
  }), n.concat(o);
}
function X0(e, t, r) {
  const n = pe(e.bubbleScale, 0, 300) / 100, o = Math.max(2, Math.min(t.rect.w, t.rect.h) * 0.13 * n);
  let s = 0;
  for (const u of e.series) for (const f of u.sizes ?? []) {
    const h = be(f);
    h !== null && (s = Math.max(s, Math.abs(h)));
  }
  const l = e.bubbleSizeBy !== "w", i = [];
  for (const u of e.series) for (let f = 0; f < u.vals.length; f++) {
    const h = be(u.vals[f]), p = u.xs ? be(u.xs[f]) : f + 1;
    if (h === null || p === null) continue;
    const d = u.sizes ? Math.abs(be(u.sizes[f]) ?? 0) : 0, m = s > 0 ? d / s : 1, $ = Math.max(1.5, o * (l ? Math.sqrt(m) : m)), { fill: x, color: b } = Qe(e, u, f, r.ctx), M = e.varyColors ? b : u.color;
    i.push({ x: t.x(t.clampX(p)), y: t.y(t.clampY(h)), r: $, fill: e.varyColors ? Ae(M) : x, color: M, stroke: _t(u, f, Fs(M, 0.35), Math.max(1, mt(0.75))), label: it(u.dLbls) ? vt(u, f, h, null, r, u.sizes ? be(u.sizes[f]) : null, u.cats[f] ?? String(f + 1)) : "", lblSpec: u });
  }
  i.sort((u, f) => f.r - u.r);
  const a = [], c = [];
  for (const u of i) if (a.push(Fe(u.x - u.r, u.y - u.r, u.r * 2, u.r * 2, Xn(u.r, u.r, u.r), u.fill, u.stroke)), u.label) {
    const f = Mt(u.x, u.y, u.label, u.lblSpec.dLbls, r);
    f && c.push(f);
  }
  return a.concat(c);
}
function Y0(e, t, r) {
  var n;
  const o = e.series.length;
  if (o < 3) return [];
  const s = o >= 4 ? e.series.slice(o - 4) : e.series, l = o >= 4 ? s[0] : null, i = s[o >= 4 ? 1 : 0], a = s[o >= 4 ? 2 : 1], c = s[o >= 4 ? 3 : 2], u = We(r.color, "rgb(255,255,255)", 0.15), f = Ve(e.hiLowLines, u, 1) ?? { color: u, width: 1, dash: null }, h = Math.max(i.vals.length, a.vals.length, c.vals.length), p = pe(((n = e.upDown) == null ? void 0 : n.gapWidth) ?? 150, 0, 500) / 100, d = Math.max(1.5, Math.min(t.band / (1 + p), t.band * 0.9)), m = Math.max(1.5, d / 2), $ = [];
  for (let x = 0; x < h; x++) {
    const b = be(i.vals[x]), M = be(a.vals[x]), E = be(c.vals[x]), y = l ? be(l.vals[x]) : null;
    if (b === null || M === null) continue;
    const v = t.cat(x), k = t.val(t.clampVal(Math.max(b, M))), T = t.val(t.clampVal(Math.min(b, M))), [S, N] = t.pt(v, k), [P, L] = t.pt(v, T), A = ot(S, N, P, L, f);
    if (A && $.push(A), e.upDown && y !== null && E !== null) {
      const z = E >= y, R = t.val(t.clampVal(y)), O = t.val(t.clampVal(E)), [U, j] = t.pt(v - d / 2, Math.min(R, O)), [W, X] = t.pt(v + d / 2, Math.max(R, O)), B = { x: Math.min(U, W), y: Math.min(j, X), w: Math.max(Math.abs(W - U), 1), h: Math.max(Math.abs(X - j), 1) }, Z = (z ? e.upDown.upFill : e.upDown.downFill) ?? Ae(z ? "rgb(255,255,255)" : u), Y = Ve(z ? e.upDown.upLn : e.upDown.downLn, u, 1) ?? { color: u, width: 1, dash: null };
      $.push(Fe(B.x, B.y, B.w, B.h, `M 0 0 L ${H(B.w)} 0 L ${H(B.w)} ${H(B.h)} L 0 ${H(B.h)} Z`, Z, Y));
    } else {
      if (y !== null) {
        const [z, R] = t.pt(v, t.val(t.clampVal(y))), O = ot(z - (t.horizontal ? 0 : m), R - (t.horizontal ? m : 0), z, R, f);
        O && $.push(O);
      }
      if (E !== null) {
        const [z, R] = t.pt(v, t.val(t.clampVal(E))), O = ot(z, R, z + (t.horizontal ? 0 : m), R + (t.horizontal ? m : 0), f);
        O && $.push(O);
      }
    }
    if (it(c.dLbls) && E !== null) {
      const [z, R] = t.pt(v, t.val(t.clampVal(E))), O = c.dLbls.size ?? r.size * 0.92, U = Mt(z + d, R - Ue(O) * 0.2, vt(c, x, E, null, r), c.dLbls, r);
      U && $.push(U);
    }
  }
  return $;
}
function ls(e, t, r, n, o, s) {
  const l = (c, u) => `${H(e + c * Math.cos(u))} ${H(t + c * Math.sin(u))}`, i = s - o;
  if (i >= Bt - 1e-6) {
    const c = Xn(e, t, n);
    return r > 0.01 ? `${c} ${Xn(e, t, r)}` : c;
  }
  const a = i > Math.PI ? 1 : 0;
  return r <= 0.01 ? `M ${H(e)} ${H(t)} L ${l(n, o)} A ${H(n)} ${H(n)} 0 ${a} 1 ${l(n, s)} Z` : `M ${l(n, o)} A ${H(n)} ${H(n)} 0 ${a} 1 ${l(n, s)} L ${l(r, s)} A ${H(r)} ${H(r)} 0 ${a} 0 ${l(r, o)} Z`;
}
const Eo = 0.55, _l = 0.17, dc = (e, t, r, n, o) => `${H(e + r * Math.cos(o))} ${H(t + n * Math.sin(o))}`;
function G0(e, t, r, n, o, s) {
  const l = (c) => dc(e, t, r, n, c), i = s - o;
  if (i >= Bt - 1e-6) return `M ${H(e - r)} ${H(t)} A ${H(r)} ${H(n)} 0 1 1 ${H(e + r)} ${H(t)} A ${H(r)} ${H(n)} 0 1 1 ${H(e - r)} ${H(t)} Z`;
  const a = i > Math.PI ? 1 : 0;
  return `M ${H(e)} ${H(t)} L ${l(o)} A ${H(r)} ${H(n)} 0 ${a} 1 ${l(s)} Z`;
}
function Z0(e, t) {
  const r = [];
  for (let n = -1; n <= 2; n++) {
    const o = Math.max(e, n * Bt), s = Math.min(t, n * Bt + Math.PI);
    s - o > 1e-4 && r.push([o, s]);
  }
  return r;
}
function _0(e, t, r, n, o, s, l) {
  const i = (c, u) => dc(e, t + u, r, n, c), a = s - o > Math.PI ? 1 : 0;
  return `M ${i(o, 0)} A ${H(r)} ${H(n)} 0 ${a} 1 ${i(s, 0)} L ${i(s, l)} A ${H(r)} ${H(n)} 0 ${a} 0 ${i(o, l)} Z`;
}
function q0(e, t, r) {
  var n;
  const o = e.series[0];
  if (!o) return [];
  const s = it(o.dLbls) ? 0.8 : 0.94, l = Math.min(t.w / 2, t.h / (2 * Eo + _l)) * s;
  if (!(l > 0)) return [];
  const i = l * Eo, a = l * _l, c = t.x + t.w / 2, u = t.y + (t.h - (2 * i + a)) / 2 + i, f = o.vals.map((x) => Math.abs(be(x) ?? 0)), h = f.reduce((x, b) => x + b, 0);
  if (!(h > 0)) return [];
  const p = [], d = [], m = [];
  let $ = (pe(e.firstSliceAng, 0, 360) - 90) * (Math.PI / 180);
  for (let x = 0; x < f.length; x++) {
    const b = f[x] / h, M = b * Bt;
    if (!(M > 0)) continue;
    const E = $ + M, y = $ + M / 2, v = pe(((n = o.dPts.get(x)) == null ? void 0 : n.explosion) ?? 0, 0, 400) / 100 * l * 0.5, k = c + Math.cos(y) * v, T = u + Math.sin(y) * v * Eo, { fill: S, color: N } = Qe(e, o, x, r.ctx), P = _t(o, x, null, 0);
    for (const [L, A] of Z0($, E)) {
      const z = Fe(k - l, T - i, l * 2, i * 2 + a, _0(l, i, l, i, L, A, a), Ae(Fs(N)), P);
      p.push({ el: z, depth: Math.sin((L + A) / 2) });
    }
    if (d.push(Fe(k - l, T - i, l * 2, i * 2, G0(l, i, l, i, $, E), S, P)), it(o.dLbls)) {
      const L = o.dLbls.pos === "outEnd" || o.dLbls.pos === "bestFit", A = L ? 1.2 : 0.62, z = Math.sin(y), R = z > 0 ? a * (L ? 1 : 0.5) : 0, O = vt(o, x, be(o.vals[x]) ?? 0, b, r), U = Mt(k + Math.cos(y) * l * A, T + z * i * A + R, O, o.dLbls, r);
      U && m.push(U);
    }
    $ = E;
  }
  return p.sort((x, b) => x.depth - b.depth), p.map((x) => x.el).concat(d, m);
}
function J0(e, t, r) {
  const n = [], o = [], s = e.kind === "doughnut" ? e.series : e.series.slice(0, 1);
  if (!s.length) return n;
  const l = s.some((h) => it(h.dLbls)), i = Math.min(t.w, t.h) / 2 * (l ? 0.78 : 0.92);
  if (!(i > 0)) return n;
  const a = t.x + t.w / 2, c = t.y + t.h / 2, u = e.kind === "doughnut" ? pe(e.holeSize, 0, 90) / 100 : 0, f = i * (1 - u) / s.length;
  return s.forEach((h, p) => {
    var d;
    const m = i * u + p * f, $ = m + f, x = h.vals.map((E) => Math.abs(be(E) ?? 0)), b = x.reduce((E, y) => E + y, 0);
    if (!(b > 0)) return;
    let M = (pe(e.firstSliceAng, 0, 360) - 90) * (Math.PI / 180);
    for (let E = 0; E < x.length; E++) {
      const y = x[E] / b, v = y * Bt;
      if (!(v > 0)) continue;
      const k = M + v / 2, T = pe(((d = h.dPts.get(E)) == null ? void 0 : d.explosion) ?? 0, 0, 400) / 100 * $ * 0.5, S = a + Math.cos(k) * T, N = c + Math.sin(k) * T, { fill: P } = Qe(e, h, E, r.ctx);
      if (n.push(Fe(S - $, N - $, $ * 2, $ * 2, ls($, $, m, $, M, M + v), P, _t(h, E, null, 0))), it(h.dLbls)) {
        const L = h.dLbls.pos === "outEnd" || h.dLbls.pos === "bestFit" ? $ * 1.16 : (m + $) / 2 + (m > 0 ? 0 : $ * 0.12), A = vt(h, E, be(h.vals[E]) ?? 0, y, r), z = Mt(S + Math.cos(k) * L, N + Math.sin(k) * L, A, h.dLbls, r);
        z && o.push(z);
      }
      M += v;
    }
  }), n.concat(o);
}
function K0(e, t) {
  const r = e.ofPie, n = /* @__PURE__ */ new Set();
  if (!r || !t.length) return n;
  const o = t.reduce((s, l) => s + l, 0);
  switch (r.splitType) {
    case "val": {
      const s = r.splitPos ?? 0;
      t.forEach((l, i) => {
        l < s && n.add(i);
      });
      break;
    }
    case "percent": {
      const s = (r.splitPos ?? 0) / 100;
      t.forEach((l, i) => {
        o > 0 && l / o < s && n.add(i);
      });
      break;
    }
    case "custom":
      for (const s of r.custSplit) s >= 0 && s < t.length && n.add(s);
      break;
    default: {
      const s = pe(Math.round(r.splitPos ?? 2), 1, Math.max(t.length - 1, 1));
      for (let l = Math.max(t.length - s, 1); l < t.length; l++) n.add(l);
    }
  }
  return n.size >= t.length && n.delete(0), n;
}
function Q0(e, t, r) {
  const n = e.series[0], o = e.ofPie;
  if (!n || !o) return [];
  const s = n.vals.map((R) => Math.abs(be(R) ?? 0)), l = s.reduce((R, O) => R + O, 0);
  if (!(l > 0)) return [];
  const i = K0(e, s), a = s.map((R, O) => O).filter((R) => !i.has(R)), c = s.map((R, O) => O).filter((R) => i.has(R)), u = c.reduce((R, O) => R + s[O], 0), f = it(n.dLbls), h = t.w * 0.08, p = (t.w - h) / 2, d = Math.max(6, Math.min(p * (f ? 0.72 : 0.86), t.h * (f ? 0.38 : 0.46))), m = Math.max(4, Math.min(d * pe(o.secondSize, 5, 200) / 100, p * 0.86, t.h * 0.46)), $ = t.y + t.h / 2, x = t.x + p / 2, b = t.x + p + h + p / 2, M = [], E = [], y = We(r.color, "rgb(255,255,255)", 0.55), v = (R, O, U, j) => {
    if (!f) return;
    const W = U === null ? `其他 ${jt(u / l, "0%")}` : vt(n, U, j, l > 0 ? j / l : null, r), X = Mt(R, O, W, n.dLbls, r);
    X && E.push(X);
  }, k = a.map((R) => ({ idx: R, v: s[R] }));
  u > 0 && k.push({ idx: null, v: u });
  let T = (pe(e.firstSliceAng, 0, 360) - 90) * (Math.PI / 180), S = 0, N = 0;
  for (const R of k) {
    const O = R.v / l * Bt;
    if (!(O > 0)) continue;
    const U = T + O / 2, j = R.idx === null ? Ae(y) : Qe(e, n, R.idx, r.ctx).fill, W = R.idx === null ? null : _t(n, R.idx, null, 0);
    M.push(Fe(x - d, $ - d, d * 2, d * 2, ls(d, d, 0, d, T, T + O), j, W));
    const X = n.dLbls.pos === "outEnd" || n.dLbls.pos === "bestFit" ? d * 1.15 : d * 0.62;
    v(x + Math.cos(U) * X, $ + Math.sin(U) * X, R.idx, R.v), R.idx === null && (S = T, N = T + O), T += O;
  }
  const P = u > 0 ? u : 1;
  let L = $ - m, A = $ + m, z = b - m;
  if (o.type === "bar") {
    const R = Math.max(8, m * 0.9), O = Math.max(12, m * 2);
    L = $ - O / 2, A = $ + O / 2, z = b - R / 2;
    let U = L;
    for (const j of c) {
      const W = s[j] / P * O;
      if (!(W > 0)) continue;
      const { fill: X } = Qe(e, n, j, r.ctx);
      M.push(Fe(z, U, R, W, `M 0 0 L ${H(R)} 0 L ${H(R)} ${H(W)} L 0 ${H(W)} Z`, X, _t(n, j, null, 0))), v(z + R / 2, U + W / 2, j, s[j]), U += W;
    }
  } else {
    let R = -Math.PI / 2;
    for (const O of c) {
      const U = s[O] / P * Bt;
      if (!(U > 0)) continue;
      const j = R + U / 2, { fill: W } = Qe(e, n, O, r.ctx);
      M.push(Fe(b - m, $ - m, m * 2, m * 2, ls(m, m, 0, m, R, R + U), W, _t(n, O, null, 0)));
      const X = n.dLbls.pos === "outEnd" || n.dLbls.pos === "bestFit" ? m * 1.18 : m * 0.62;
      v(b + Math.cos(j) * X, $ + Math.sin(j) * X, O, s[O]), R += U;
    }
  }
  if (o.serLines !== !1 && u > 0) {
    const R = { color: We(r.color, "rgb(255,255,255)", 0.45), width: 1, dash: null }, O = [x + Math.cos(S) * d, $ + Math.sin(S) * d], U = [x + Math.cos(N) * d, $ + Math.sin(N) * d], j = O[1] <= U[1] ? O : U, W = O[1] <= U[1] ? U : O, X = ot(j[0], j[1], z, L, R), B = ot(W[0], W[1], z, A, R);
    X && M.push(X), B && M.push(B);
  }
  return M.concat(E);
}
const lr = ["rgb(49,84,163)", "rgb(84,148,200)", "rgb(160,208,224)", "rgb(224,238,196)", "rgb(253,224,144)", "rgb(244,146,74)", "rgb(200,60,44)"];
function ql(e) {
  const t = pe(e, 0, 1) * (lr.length - 1), r = Math.min(Math.floor(t), lr.length - 2);
  return We(lr[r], lr[r + 1], t - r);
}
function ep(e, t, r) {
  const n = e.series.length, o = e.series.reduce((v, k) => Math.max(v, k.vals.length), 0);
  if (!n || !o) return [];
  const s = Math.min(t.rect.w * 0.16, r.size * 7), l = Math.min(t.rect.w * 0.2, Math.max(r.size * 4, Us(tp(e.series.map((v) => v.name)), r.size) + r.size)), i = Ue(r.size) * 1.2, a = t.rect.x + l, c = t.rect.y, u = Math.max(t.rect.w - l - s - r.size, 12), f = Math.max(t.rect.h - i, 12), h = u / o, p = f / n, d = t.max - t.min || 1, m = [], $ = { color: "rgba(255,255,255,0.75)", width: 0.75, dash: null };
  e.series.forEach((v, k) => {
    const T = c + f - (k + 1) * p;
    for (let S = 0; S < o; S++) {
      const N = be(v.vals[S]);
      if (N === null) continue;
      const P = (N - t.min) / d, L = pe(Math.floor(P * t.bands), 0, t.bands - 1), A = e.bandFills.get(L) ?? Ae(ql(t.bands > 1 ? L / (t.bands - 1) : P));
      m.push(Vn({ x: a + S * h, y: T, w: h, h: p }, A, $));
    }
    m.push(Ke(t.rect.x, T + p / 2 - i / 2, Math.max(l - r.size * 0.4, 8), i, v.name, { size: r.size, color: r.color, align: "right", anchor: "middle", fonts: r.fonts }));
  });
  for (let v = 0; v < o && v < r.cats.length; v++) m.push(Ke(a + v * h, c + f, h, i, r.cats[v], { size: r.size, color: r.color, align: "center", anchor: "middle", fonts: r.fonts }));
  const x = Math.min(r.size * 1.1, s * 0.35), b = a + u + r.size * 0.6, M = f * 0.9, E = c + (f - M) / 2, y = M / t.bands;
  for (let v = 0; v < t.bands; v++) {
    const k = e.bandFills.get(v) ?? Ae(ql(t.bands > 1 ? v / (t.bands - 1) : 0.5));
    m.push(Vn({ x: b, y: E + M - (v + 1) * y, w: x, h: y }, k, null)), m.push(Ke(b + x + r.size * 0.3, E + M - (v + 1) * y - Ue(r.size * 0.85) / 2, s, Ue(r.size * 0.85), jt(t.min + (v + 1) * d / t.bands, t.fmt), { size: r.size * 0.85, color: r.color, align: "left", anchor: "middle", fonts: r.fonts }));
  }
  return m;
}
const tp = (e) => e.reduce((t, r) => r.length > t.length ? r : t, "");
function is(e, t, r) {
  const n = e.angle(t), o = e.radius * e.norm(r);
  return [e.cx + o * Math.sin(n), e.cy - o * Math.cos(n)];
}
function np(e, t, r, n, o, s) {
  const l = [];
  if (e.count < 3) return l;
  for (const a of t) {
    const c = [];
    for (let f = 0; f < e.count; f++) c.push(is(e, f, a));
    const u = js([c], null, n);
    u && l.push(u);
  }
  for (let a = 0; a < e.count; a++) {
    const c = e.angle(a), u = ot(e.cx, e.cy, e.cx + e.radius * Math.sin(c), e.cy - e.radius * Math.cos(c), o);
    u && l.push(u);
  }
  const i = r.size * 1.4;
  for (let a = 0; a < e.count && a < r.cats.length; a++) {
    const c = e.angle(a), u = r.size * 0.9, f = e.cx + (e.radius + u) * Math.sin(c), h = e.cy - (e.radius + u) * Math.cos(c), p = Math.sin(c), d = p > 0.2 ? "left" : p < -0.2 ? "right" : "center", m = Math.max(r.size * 6, 30), $ = d === "left" ? f : d === "right" ? f - m : f - m / 2;
    l.push(Ke($, h - i / 2, m, i, r.cats[a], { size: r.size, color: r.color, align: d, fonts: r.fonts }));
  }
  for (const a of t) {
    if (a === 0) continue;
    const [c, u] = is(e, 0, a);
    l.push(Ke(c + 2, u - i / 2, r.size * 5, i, s(a), { size: r.size * 0.9, color: r.color, align: "left", fonts: r.fonts }));
  }
  return l;
}
function rp(e, t, r) {
  const n = [], o = [], s = e.radarStyle === "filled", l = e.radarStyle === "marker";
  return e.series.forEach((i, a) => {
    const { fill: c, color: u } = Qe(e, i, 0, r.ctx), f = [];
    for (let m = 0; m < t.count; m++) {
      const $ = i.vals[m];
      $ == null || !Number.isFinite($) || f.push(is(t, m, $));
    }
    if (f.length < 2) return;
    const h = Ve(i.ln, u, 2) ?? { color: u, width: 2, dash: null }, p = s ? c.type === "solid" ? { type: "solid", color: op(c.color, 0.45) } : c : null, d = js([f], p, h);
    if (d && n.push(d), l) {
      const m = Jr(e, i, a);
      for (const [$, x] of f) {
        const b = Kr($, x, m, i, u);
        b && o.push(b);
      }
    }
  }), n.concat(o);
}
function op(e, t) {
  const r = e.match(/rgba?\(([^)]+)\)/);
  if (!r) return e;
  const n = r[1].split(",").map((o) => Number(o.trim()));
  return `rgba(${n[0] || 0},${n[1] || 0},${n[2] || 0},${t})`;
}
function sp(e, t) {
  const r = e.axes.filter((n) => n.kind === "val");
  return t.map((n) => {
    const o = r.filter((a) => n.axIds.includes(a.id)), s = o.length ? o : r, l = s.find((a) => a.pos === "b" || a.pos === "t") ?? s[0] ?? Ar("val"), i = s.find((a) => a !== l) ?? Ar("val");
    return { group: n, x: l, y: i };
  });
}
function pc(e, t, r, n = []) {
  const o = sp(e, t), s = (l, i = { lo: 0, hi: 1 }) => {
    const a = o.filter((h) => h.x === l).map((h) => h.group), c = [...n.filter((h) => l.id && h.axIds.includes(l.id)), ...o.filter((h) => h.y === l).map((h) => h.group)], u = a.length ? P0(a) : null, f = c.length ? _r(c) : null;
    return u && f ? { lo: Math.min(u.lo, f.lo), hi: Math.max(u.hi, f.hi) } : u ?? f ?? i;
  };
  return { axes: (l = []) => {
    const i = new Map(l.map((c) => [c.axis, c])), a = (c, u, f) => {
      let h = i.get(c);
      return h || (h = fc(c, u ? c.pos === "t" ? "t" : "b" : c.pos === "r" ? "r" : "l", s(c), qr(u ? r.w : r.h, e.textSize), u ? null : f, e), i.set(c, h)), h;
    };
    return o.map(({ group: c, x: u, y: f }) => {
      var h;
      return { group: c, x: a(u, !0, null), y: a(f, !1, ((h = c.series.find((p) => p.fmt)) == null ? void 0 : h.fmt) ?? null) };
    });
  }, extent: s };
}
function as(e, t, r) {
  const n = { ...r };
  for (const o of t) {
    const s = os(e, o.x, o.y, !1);
    for (const l of ["l", "r", "t", "b"]) n[l] = Math.max(n[l], s[l]);
  }
  return n;
}
function mc(e, t, r, n, o, s = /* @__PURE__ */ new Set()) {
  const l = [], i = [], a = (c) => s.has(c.axis) ? { ...c, axis: { ...c.axis, del: !0, title: null, majorGrid: null } } : (s.add(c.axis), c);
  for (const { group: c, x: u, y: f } of t) {
    const h = N0(r, u, f);
    l.push(...Ws(e, { rect: r, hAxis: a(u), vAxis: a(f), hPos: (p) => h.x(u.ticks[p] ?? 0), vPos: (p) => h.y(f.ticks[p] ?? 0), hEdge: null, hEdgeCount: 0, vEdge: null, vEdgeCount: 0, hLineAt: h.y(h.clampY(0)), vLineAt: h.x(h.clampX(0)), hWrap: !1, hBand: 0, depth: null }, n)), i.push(...c.kind === "bubble" ? X0(c, h, o) : V0(c, h, o));
  }
  return { axes: l, plots: i };
}
function lp(e, t, r, n) {
  const o = Math.max(Number.isFinite(t) ? t : 0, 1), s = Math.max(Number.isFinite(r) ? r : 0, 1);
  try {
    return cp(e, o, s, n);
  } catch {
    return [Xs(o, s, "图表渲染失败")];
  }
}
function Xs(e, t, r) {
  return { kind: "unsupported", x: 0, y: 0, w: e, h: t, rot: 0, flipH: !1, flipV: !1, label: r };
}
function ip(e, t, r, n) {
  const o = [];
  if (t.length > 0 && t.every((l) => l.kind === "pie" || l.kind === "doughnut" || l.kind === "ofPie")) {
    const l = t[0], i = l.series[0];
    if (!i) return o;
    const a = Math.max(i.vals.length, r.length);
    for (let c = 0; c < a; c++) {
      if (e.legendDeleted.has(c)) continue;
      const { fill: u, color: f } = Qe(l, i, c, n);
      o.push({ label: r[c] ?? String(c + 1), fill: u, color: f, stroke: null, marker: null, line: !1 });
    }
    return o;
  }
  let s = 0;
  for (const l of t) l.series.forEach((i, a) => {
    const c = s++;
    if (e.legendDeleted.has(c)) return;
    const u = l.kind === "line" || l.kind === "scatter";
    o.push({ label: i.name, fill: u ? Ae(i.color) : i.fill ?? Ae(i.color), color: i.color, stroke: u ? Ve(i.ln, i.color, mt(2)) : null, marker: u ? { sym: Jr(l, i, a), s: i } : null, line: u });
  });
  return o;
}
function ap(e, t, r, n) {
  const o = [];
  if (!e.legendPos || !t.length) return { els: o, region: r };
  const s = e.textSize, l = s * 1.2, i = s * 0.72, a = s * 1.75, c = s * 0.35, u = s * 0.9, f = t.map((x) => l + c + Us(x.label, s) + u), h = e.legendPos, p = h === "t" || h === "b";
  let d, m = r;
  const $ = (x, b, M, E) => {
    const y = M + a / 2;
    if (x.line) {
      const v = ot(b, y, b + l, y, x.stroke ?? { color: x.color, width: mt(2), dash: null });
      if (v && o.push(v), x.marker && x.marker.sym !== "none") {
        const k = Kr(b + l / 2, y, x.marker.sym, x.marker.s, x.color);
        k && o.push(k);
      }
    } else o.push(Vn({ x: b, y: y - i / 2, w: l, h: i }, x.fill, null));
    o.push(Ke(b + l + c, M, E, a, x.label, { size: s, color: e.textColor, align: "left", anchor: "middle", fonts: n }));
  };
  if (p) {
    const x = r.w, b = [];
    let M = [], E = 0;
    for (let T = 0; T < t.length; T++) {
      const S = Math.min(f[T], x);
      M.length && E + S > x && (b.push(M), M = [], E = 0), M.push(T), E += S;
    }
    M.length && b.push(M);
    const y = Math.max(1, Math.floor(r.h * 0.4 / a)), v = b.slice(0, y), k = v.length * a;
    d = h === "t" ? { x: r.x, y: r.y, w: r.w, h: k } : { x: r.x, y: r.y + r.h - k, w: r.w, h: k }, e.legendOverlay || (m = h === "t" ? { x: r.x, y: r.y + k, w: r.w, h: r.h - k } : { x: r.x, y: r.y, w: r.w, h: r.h - k }), v.forEach((T, S) => {
      const N = T.reduce((A, z) => A + Math.min(f[z], x), 0);
      let P = d.x + Math.max((d.w - N) / 2, 0);
      const L = d.y + S * a;
      for (const A of T) {
        const z = Math.min(f[A], x);
        $(t[A], P, L, Math.max(z - l - c - u * 0.5, s)), P += z;
      }
    });
  } else {
    const x = Math.max(1, Math.floor(r.h / a)), b = Math.max(1, Math.ceil(t.length / x)), M = f.reduce((N, P) => P > N ? P : N, 0), E = Math.min(M * b, r.w * 0.45), y = E / b, v = Math.min(x, Math.ceil(t.length / b)), k = h !== "l";
    d = { x: k ? r.x + r.w - E : r.x, y: r.y, w: E, h: r.h }, e.legendOverlay || (m = k ? { x: r.x, y: r.y, w: r.w - E, h: r.h } : { x: r.x + E, y: r.y, w: r.w - E, h: r.h });
    const T = v * a, S = h === "tr" ? d.y : d.y + Math.max((d.h - T) / 2, 0);
    for (let N = 0; N < t.length && N < v * b; N++) {
      const P = Math.floor(N / v), L = N % v;
      $(t[N], d.x + P * y, S + L * a, Math.max(y - l - c - s * 0.2, s));
    }
  }
  return { els: o, region: m };
}
function gc(e) {
  let t = [], r = 0;
  for (const s of e) for (const l of s.series) l.vals.length > r && (r = l.vals.length), l.cats.length > t.length && (t = l.cats);
  const n = Math.max(r, t.length), o = [];
  for (let s = 0; s < n; s++) o.push(t[s] ?? String(s + 1));
  return o;
}
function Qt(e, t, r, n) {
  if (!t) return e;
  const o = t.x !== null ? t.x * r : e.x, s = t.y !== null ? t.y * n : e.y, l = t.w !== null ? t.w * r : e.w, i = t.h !== null ? t.h * n : e.h;
  return !(l > 4) || !(i > 4) || !Number.isFinite(o) || !Number.isFinite(s) ? e : { x: o, y: s, w: l, h: i };
}
const $c = (e) => {
  for (const t of e) for (const r of t.series) if (r.fmt) return r.fmt;
  return null;
};
function cp(e, t, r, n) {
  const o = C0(e, n.ctx), s = [n.fonts.minor.latin, n.fonts.minor.ea].filter((S) => !!S), l = [], i = o.fill ?? Ae("rgb(255,255,255)"), a = Ve(o.ln, null, 0);
  (i.type !== "none" || a) && l.push(Vn({ x: 0, y: 0, w: t, h: r }, i.type === "none" ? null : i, a));
  const c = o.groups.filter((S) => S.series.length > 0), u = c.filter((S) => S.kind === "bar" || S.kind === "line" || S.kind === "area" || S.kind === "stock"), f = c.filter((S) => nc(S.kind)), h = c.filter((S) => S.kind === "pie" || S.kind === "doughnut"), p = c.filter((S) => S.kind === "ofPie"), d = c.filter((S) => S.kind === "radar"), m = c.filter((S) => S.kind === "surface"), $ = o.unsupported.slice();
  if (!u.length && !f.length && !h.length && !d.length && !p.length && !m.length) {
    const S = $.length ? Array.from(new Set($)).join("/") : "未知类型";
    return l.concat([Xs(t, r, `不支持的图表类型: ${S}`)]);
  }
  const x = Math.min(o.textSize * 0.55, Math.min(t, r) * 0.06);
  let b = { x, y: x, w: Math.max(t - x * 2, 8), h: Math.max(r - x * 2, 8) };
  if (o.title) {
    const S = o.titleSize, N = Math.min(Ue(S) + o.textSize * 0.5, b.h * 0.3);
    l.push(Ke(b.x, b.y, b.w, N, o.title, { size: S, bold: o.titleBold, color: o.titleColor ?? o.textColor, align: "center", anchor: "middle", fonts: s })), b = { x: b.x, y: b.y + N, w: b.w, h: Math.max(b.h - N, 8) };
  }
  const M = u.length ? c.filter((S) => u.includes(S) || f.includes(S)) : f.length ? f : d.length ? d : m.length ? m : p.length ? p : h, E = gc(u.length ? u : M), y = m.length && m.length === c.length ? [] : ip(o, M, E, n.ctx), v = ap(o, y, b, s);
  b = v.region, o.plotLayout && o.plotLayout.target !== "inner" && (b = Qt(b, o.plotLayout, t, r));
  const k = { ctx: n.ctx, fonts: s, size: o.textSize, color: o.textColor, cats: E }, T = [];
  if (u.length ? T.push(...hp(o, u, E, b, t, r, s, k, f)) : f.length ? T.push(...dp(o, f, b, t, r, s, k)) : d.length ? T.push(...gp(o, d, b, t, r, k)) : m.length ? T.push(...pp(o, m, b, t, r, k)) : p.length ? T.push(...mp(o, p, b, t, r, k)) : T.push(...xp(o, h, b, t, r, k)), l.push(...T, ...v.els), $.length) {
    const S = Array.from(new Set($)).join("/"), N = o.textSize * 0.9;
    l.push(Ke(b.x, b.y + b.h - Ue(N), b.w, Ue(N), `未渲染: ${S}`, { size: N, color: o.textColor, align: "right", anchor: "middle", fonts: s }));
  }
  return l;
}
function up(e, t) {
  return e.crosses === "max" ? !0 : t ? e.pos === "t" : e.pos === "r";
}
function fp(e, t, r) {
  const n = /* @__PURE__ */ new Map();
  for (const h of e.axes) h.id && n.set(h.id, h);
  const o = e.axes.find((h) => h.kind === "cat" || h.kind === "date") ?? Ar("cat"), s = e.axes.find((h) => h.kind === "val") ?? Ar("val"), l = [], i = /* @__PURE__ */ new Map();
  for (const h of t) {
    let p = null, d = null;
    for (const x of h.axIds) {
      const b = n.get(x);
      b && (b.kind === "val" ? d || (d = b) : (b.kind === "cat" || b.kind === "date") && (p || (p = b)));
    }
    const m = d && d.id || "v#";
    let $ = i.get(m);
    $ || ($ = { cat: p ?? o, val: d ?? s, groups: [] }, i.set(m, $), l.push(m)), $.groups.push(h);
  }
  if (!l.length) return { primary: { cat: o, val: s, groups: t }, secondary: null };
  if (l.length === 1) return { primary: i.get(l[0]), secondary: null };
  let a = l.findIndex((h) => !up(i.get(h).val, r));
  a < 0 && (a = 0);
  const c = i.get(l[a]), u = l.filter((h, p) => p !== a).map((h) => i.get(h)), f = { cat: u[0].cat, val: u[0].val, groups: u.flatMap((h) => h.groups) };
  return { primary: c, secondary: f };
}
function hp(e, t, r, n, o, s, l, i, a) {
  const c = t.some((G) => G.kind === "bar" && G.barDir === "bar"), { primary: u, secondary: f } = fp(e, t, c), h = u.cat, p = c ? h.pos === "r" ? "r" : "l" : h.pos === "t" ? "t" : "b", d = c ? u.val.pos === "t" ? "t" : "b" : u.val.pos === "r" ? "r" : "l", m = c ? d === "b" ? "t" : "b" : d === "l" ? "r" : "l", $ = c ? n.w : n.h, x = qr($, e.textSize), b = pc(e, a, n, t), M = (G, le) => {
    const he = G.groups.some((me) => me.grouping === "percentStacked") ? "0%" : $c(G.groups);
    return fc(G.val, le, b.extent(G.val, _r(G.groups)), x, he, e);
  }, E = M(u, d), y = f ? M(f, m) : null, v = t.some((G) => G.kind === "bar"), k = t.every((G) => G.kind === "area"), T = v ? !0 : k ? !1 : h.crossBetween !== "midCat", S = I0(h, p, r, T, e), N = c ? E : S, P = c ? S : E, L = b.axes(y ? [E, y] : [E]);
  let A = ss(n, as(e, L, os(e, N, P, !1, y))), z = !1;
  if (!c && r.length) {
    const G = T ? A.w / Math.max(r.length, 1) : A.w / Math.max(r.length - 1, 1);
    z = O0(S, G), z && (A = ss(n, as(e, L, os(e, N, P, !0, y))));
  }
  e.plotLayout && e.plotLayout.target === "inner" && (A = Qt(A, e.plotLayout, o, s));
  const R = t.some((G) => G.is3D);
  let O = null;
  R && (O = S0(e.view3D, A), A = L0(A, O));
  const U = Gl(A, c, S, E), j = y ? Gl(A, c, S, y) : null, W = T ? r.length + 1 : r.length, X = c ? { rect: A, hAxis: E, vAxis: S, hPos: (G) => U.val(E.ticks[G] ?? 0), vPos: (G) => U.cat(G), hEdge: null, hEdgeCount: 0, vEdge: (G) => U.edge(G), vEdgeCount: W, hLineAt: d === "t" ? A.y : A.y + A.h, vLineAt: U.zero, hWrap: !1, hBand: 0, depth: O } : { rect: A, hAxis: S, vAxis: E, hPos: (G) => U.cat(G), vPos: (G) => U.val(E.ticks[G] ?? 0), hEdge: (G) => U.edge(G), hEdgeCount: W, vEdge: null, vEdgeCount: 0, hLineAt: U.zero, vLineAt: d === "r" ? A.x + A.w : A.x, hWrap: z, hBand: U.band, depth: O }, B = [];
  if (B.push(...Zn(e, A)), O && B.push(...T0(A, O, e.textColor)), B.push(...Ws(e, X, l)), y && j) {
    const G = m === "l" || m === "r";
    B.push(...z0(e, { rect: A, view: y, pos: (le) => j.val(y.ticks[le] ?? 0), at: G ? m === "r" ? A.x + A.w : A.x : m === "t" ? A.y : A.y + A.h, grid: !E.axis.majorGrid && !!y.axis.majorGrid, depth: O }, l));
  }
  const Z = (G) => {
    const le = /* @__PURE__ */ new Map();
    let he = 0;
    for (const me of G) le.set(me, he), he += Zr(me) ? 1 : me.series.length;
    return (me) => ({ base: le.get(me) ?? 0, total: Math.max(he, 1) });
  }, Y = (G, le) => {
    const he = G.groups.filter((ge) => ge.kind === "bar"), me = Z(he);
    for (const ge of G.groups) ge.kind === "area" && B.push(...W0(ge, le, i));
    for (const ge of he) B.push(...B0(ge, le, me(ge), i, ge.is3D ? O : null));
    for (const ge of G.groups) ge.kind === "line" && B.push(...H0(ge, le, i));
    for (const ge of G.groups) ge.kind === "stock" && B.push(...Y0(ge, le, i));
  }, J = mc(e, L, A, l, i, /* @__PURE__ */ new Set([u.cat, u.val, ...f ? [f.val] : []]));
  return B.push(...J.axes), Y(u, U), f && j && Y(f, j), B.push(...J.plots), B;
}
function dp(e, t, r, n, o, s, l) {
  const i = pc(e, t, r).axes();
  let a = ss(r, as(e, i, { l: 0, r: 0, t: 0, b: 0 }));
  e.plotLayout && e.plotLayout.target === "inner" && (a = Qt(a, e.plotLayout, n, o));
  const c = mc(e, i, a, s, l);
  return [...Zn(e, a), ...c.axes, ...c.plots];
}
function pp(e, t, r, n, o, s) {
  let l = r;
  e.plotLayout && (l = Qt(l, e.plotLayout, n, o));
  const i = _r(t), a = Bs(i.lo, i.hi, qr(l.h, e.textSize)), c = Math.max(2, Math.min(Math.round((a.max - a.min) / a.step), 12)), u = e.axes.find((p) => p.kind === "val"), f = { rect: l, min: a.min, max: a.max, bands: c, fmt: u?.fmt ?? $c(t) }, h = Zn(e, l);
  for (const p of t) h.push(...ep(p, f, s));
  return h;
}
function mp(e, t, r, n, o, s) {
  let l = r;
  e.plotLayout && (l = Qt(l, e.plotLayout, n, o));
  const i = Zn(e, l);
  for (const a of t) i.push(...Q0(a, l, s));
  return i;
}
function gp(e, t, r, n, o, s) {
  var l, i;
  let a = r;
  e.plotLayout && (a = Qt(a, e.plotLayout, n, o));
  const c = gc(t), u = Math.max(c.length, ((i = (l = t[0]) == null ? void 0 : l.series[0]) == null ? void 0 : i.vals.length) ?? 0);
  if (u < 3) return [Xs(n, o, "雷达图至少需要 3 个类目")];
  const f = _r(t), h = Bs(Math.min(f.lo, 0), f.hi, qr(Math.min(a.w, a.h), e.textSize)), p = h.max - h.min || 1, d = e.textSize * 4, m = Math.max(Math.min(a.w, a.h) - d, 24), $ = a.x + a.w / 2, x = a.y + a.h / 2, b = { cx: $, cy: x, radius: m / 2, norm: (L) => $p((L - h.min) / p), angle: (L) => L * Math.PI * 2 / u, count: u }, M = [];
  for (let L = h.min; L <= h.max + h.step * 0.5; L += h.step) M.push(bp(L));
  const E = e.axes.find((L) => L.kind === "val"), y = e.axes.find((L) => L.kind === "cat"), v = We(e.textColor, "rgb(255,255,255)", 0.72), k = We(e.textColor, "rgb(255,255,255)", 0.55), T = Ve(E?.majorGrid ?? null, v, 1) ?? { color: v, width: 1, dash: null }, S = Ve(y?.line ?? null, k, 1) ?? { color: k, width: 1, dash: null }, N = E?.fmt ?? null, P = np(b, M, s, T, S, (L) => jt(L, N));
  for (const L of t) P.push(...rp(L, b, s));
  return P;
}
const $p = (e) => Number.isFinite(e) ? Math.max(0, Math.min(1, e)) : 0, bp = (e) => Number(e.toPrecision(12));
function xp(e, t, r, n, o, s) {
  let l = r;
  e.plotLayout && (l = Qt(l, e.plotLayout, n, o));
  const i = Math.max(Math.min(l.w, l.h), 8), a = { x: l.x + (l.w - i) / 2, y: l.y + (l.h - i) / 2, w: i, h: i }, c = [];
  c.push(...Zn(e, l));
  for (const u of t) c.push(...u.is3D ? q0(u, l, s) : J0(u, a, s));
  return c;
}
function Zn(e, t) {
  const r = Ve(e.plotLn, null, 0), n = e.plotFill && e.plotFill.type !== "none" ? e.plotFill : null;
  return !n && !r ? [] : [Vn(t, n, r)];
}
let wp = 0;
const yp = (e) => `${e}${(++wp).toString(36)}`, q = (e) => Number.isFinite(e) ? String(Math.round(e * 100) / 100) : "0", Jl = (e) => e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"), bc = [1, 0, 0, 1, 0, 0];
function cs(e, t) {
  const [r, n, o, s, l, i] = e, [a, c, u, f, h, p] = t;
  return [a * r + u * n, c * r + f * n, a * o + u * s, c * o + f * s, a * l + u * i + h, c * l + f * i + p];
}
function re(e, t, r) {
  return { x: e[0] * t + e[2] * r + e[4], y: e[1] * t + e[3] * r + e[5] };
}
function Kl(e) {
  const t = Math.abs(e[0] * e[3] - e[1] * e[2]), r = Math.sqrt(t);
  return Number.isFinite(r) && r > 1e-9 ? r : 1;
}
function vp(e) {
  const t = Math.hypot(e[2], e[3]);
  return Number.isFinite(t) && t > 1e-9 ? t : 1;
}
class He {
  constructor(t, r = 0, n) {
    this.p = 0, this.dv = new DataView(t.buffer, t.byteOffset, t.byteLength), this.end = Math.min(n ?? t.length, t.length), this.p = r;
  }
  has(t) {
    return this.p + t <= this.end;
  }
  get left() {
    return Math.max(0, this.end - this.p);
  }
  skip(t) {
    this.p += t;
  }
  seek(t) {
    this.p = t;
  }
  u8() {
    return this.has(1) ? this.dv.getUint8(this.p++) : (this.p += 1, 0);
  }
  i16() {
    if (!this.has(2)) return this.p += 2, 0;
    const t = this.dv.getInt16(this.p, !0);
    return this.p += 2, t;
  }
  u16() {
    if (!this.has(2)) return this.p += 2, 0;
    const t = this.dv.getUint16(this.p, !0);
    return this.p += 2, t;
  }
  i32() {
    if (!this.has(4)) return this.p += 4, 0;
    const t = this.dv.getInt32(this.p, !0);
    return this.p += 4, t;
  }
  u32() {
    if (!this.has(4)) return this.p += 4, 0;
    const t = this.dv.getUint32(this.p, !0);
    return this.p += 4, t;
  }
  f32() {
    if (!this.has(4)) return this.p += 4, 0;
    const t = this.dv.getFloat32(this.p, !0);
    return this.p += 4, Number.isFinite(t) ? t : 0;
  }
  color() {
    const t = this.u32();
    return us(t & 255, t >> 8 & 255, t >> 16 & 255);
  }
  ptL() {
    return { x: this.i32(), y: this.i32() };
  }
  pt16() {
    return { x: this.i16(), y: this.i16() };
  }
  rectL() {
    return { l: this.i32(), t: this.i32(), r: this.i32(), b: this.i32() };
  }
  utf16(t) {
    let r = "";
    const n = t >> 1;
    for (let o = 0; o < n; o++) {
      const s = this.u16();
      if (s === 0) {
        this.skip((n - o - 1) * 2);
        break;
      }
      r += String.fromCharCode(s);
    }
    return r;
  }
  ansi(t) {
    let r = "";
    for (let n = 0; n < t; n++) {
      const o = this.u8();
      if (o === 0) {
        this.skip(t - n - 1);
        break;
      }
      r += String.fromCharCode(o);
    }
    return r;
  }
  get pos() {
    return this.p;
  }
  get limit() {
    return this.end;
  }
  i8() {
    return this.u8() << 24 >> 24;
  }
  i16be() {
    if (!this.has(2)) return this.p += 2, 0;
    const t = this.dv.getInt16(this.p, !1);
    return this.p += 2, t;
  }
  u16be() {
    if (!this.has(2)) return this.p += 2, 0;
    const t = this.dv.getUint16(this.p, !1);
    return this.p += 2, t;
  }
  u32be() {
    if (!this.has(4)) return this.p += 4, 0;
    const t = this.dv.getUint32(this.p, !1);
    return this.p += 4, t;
  }
  take(t) {
    const r = Math.max(0, Math.min(t, this.end - this.p)), n = new Uint8Array(this.dv.buffer, this.dv.byteOffset + this.p, r);
    return this.p += t, n;
  }
}
const So = (e) => (e & 255).toString(16).padStart(2, "0"), us = (e, t, r) => `#${So(e)}${So(t)}${So(r)}`, Mp = 1, Ql = 5, kp = 1, xc = 0, Cp = 1, Ep = 2, Sp = 3, Lp = 4, ft = 5, en = 0, _n = 1, Tp = 2, ei = 3, ti = 5, Fn = () => ({ kind: "pen", style: xc, width: 1, color: "#000000", cap: 0, join: 0 }), wc = () => ({ kind: "brush", style: en, color: "#ffffff", hatch: 0, href: null }), qn = () => ({ kind: "font", height: -12, escapement: 0, weight: 400, italic: !1, underline: !1, strike: !1, face: "Arial", charset: 0 }), Pp = () => ({ ...Fn(), style: ft }), on = (e) => ({ kind: "brush", style: en, color: e, hatch: 0, href: null });
function Ap(e) {
  switch (e & 255) {
    case 0:
      return on("#ffffff");
    case 1:
      return on("#c0c0c0");
    case 2:
      return on("#808080");
    case 3:
      return on("#404040");
    case 4:
      return on("#000000");
    case 5:
      return { ...wc(), style: _n };
    case 6:
      return { ...Fn(), color: "#ffffff" };
    case 7:
      return Fn();
    case 8:
      return Pp();
    case 10:
    case 11:
    case 12:
    case 13:
    case 14:
    case 16:
    case 17:
      return qn();
    case 18:
      return on("#ffffff");
    case 19:
      return Fn();
    default:
      return null;
  }
}
const fs = 1, Ip = 7, Np = 8;
function Rp(e) {
  return { ...e, pen: { ...e.pen }, brush: { ...e.brush }, font: { ...e.font }, world: [...e.world], winOrg: { ...e.winOrg }, winExt: { ...e.winExt }, vpOrg: { ...e.vpOrg }, vpExt: { ...e.vpExt }, pos: { ...e.pos } };
}
const zp = { 2: 0.1, 3: 0.01, 4: 25.4 / 100, 5: 25.4 / 1e3, 6: 25.4 / 1440 };
class Op {
  constructor() {
    this.els = [], this.defs = [], this.cache = /* @__PURE__ */ new Map(), this.count = 0;
  }
  add(t) {
    this.els.push(t), this.count++;
  }
  def(t, r, n) {
    const o = this.cache.get(t);
    if (o !== void 0) return o;
    const s = yp(r);
    return this.defs.push(n(s)), this.cache.set(t, s), s;
  }
  render(t, r, n) {
    const o = Math.max(1, t.r - t.l), s = Math.max(1, t.b - t.t), l = this.defs.length ? `<defs>${this.defs.join("")}</defs>` : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${q(r)}" height="${q(n)}" viewBox="${q(t.l)} ${q(t.t)} ${q(o)} ${q(s)}" preserveAspectRatio="xMidYMid meet">` + l + this.els.join("") + "</svg>";
  }
}
class Lo {
  constructor() {
    this.d = [], this.started = !1;
  }
  get empty() {
    return this.d.length === 0;
  }
  get data() {
    return this.d.join("");
  }
  clear() {
    this.d = [], this.started = !1;
  }
  move(t) {
    Be(t) && (this.d.push(`M${q(t.x)} ${q(t.y)}`), this.started = !0);
  }
  line(t) {
    Be(t) && (this.started ? this.d.push(`L${q(t.x)} ${q(t.y)}`) : this.move(t));
  }
  cubic(t, r, n) {
    !Be(t) || !Be(r) || !Be(n) || (this.started || this.move(t), this.d.push(`C${q(t.x)} ${q(t.y)} ${q(r.x)} ${q(r.y)} ${q(n.x)} ${q(n.y)}`));
  }
  close() {
    this.started && this.d.push("Z");
  }
}
const Be = (e) => Number.isFinite(e.x) && Number.isFinite(e.y), jp = 0.5522847498307936;
function sn(e, t, r, n, o, s, l) {
  const i = [], a = s - o, c = Math.max(1, Math.ceil(Math.abs(a) / (Math.PI / 2))), u = a / c, f = jp * Math.abs(u) / (Math.PI / 2) * Math.sign(u);
  let h = o;
  for (let p = 0; p < c; p++) {
    const d = h + u, m = Math.cos(h), $ = Math.sin(h), x = Math.cos(d), b = Math.sin(d), M = { x: e + r * (m - f * $), y: t + n * ($ + f * m) }, E = { x: e + r * (x + f * b), y: t + n * (b - f * x) }, y = { x: e + r * x, y: t + n * b };
    i.push([re(l, M.x, M.y), re(l, E.x, E.y), re(l, y.x, y.y)]), h = d;
  }
  return i;
}
const ni = (e, t, r, n, o, s) => re(s, e + r * Math.cos(o), t + n * Math.sin(o));
function ri(e, t, r, n, o, s) {
  const l = r !== 0 ? (o - e) / r : 0, i = n !== 0 ? (s - t) / n : 0;
  return l === 0 && i === 0 ? 0 : Math.atan2(i, l);
}
class Ys {
  constructor(t) {
    this.stack = [], this.objs = [], this.svg = new Op(), this.path = new Lo(), this.inPath = !1, this.dev = t, this.dc = { pen: Fn(), brush: wc(), font: qn(), textColor: "#000000", bkColor: "#ffffff", bkMode: 2, polyFill: 1, textAlign: 0, world: [...bc], mapMode: fs, winOrg: { x: 0, y: 0 }, winExt: { x: 1, y: 1 }, vpOrg: { x: 0, y: 0 }, vpExt: { x: 1, y: 1 }, clip: null, pos: { x: 0, y: 0 } };
  }
  get drawn() {
    return this.svg.count;
  }
  xf() {
    const t = this.dc;
    let r, n;
    const o = zp[t.mapMode];
    if (t.mapMode === fs) r = 1, n = 1;
    else if (o !== void 0) r = o * this.dev.pxPerMmX, n = -o * this.dev.pxPerMmY;
    else if (r = t.winExt.x !== 0 ? t.vpExt.x / t.winExt.x : 1, n = t.winExt.y !== 0 ? t.vpExt.y / t.winExt.y : 1, t.mapMode === Ip) {
      const l = Math.min(Math.abs(r), Math.abs(n));
      r = l * Math.sign(r || 1), n = l * Math.sign(n || 1);
    }
    (!Number.isFinite(r) || r === 0) && (r = 1), (!Number.isFinite(n) || n === 0) && (n = 1);
    const s = [r, 0, 0, n, t.vpOrg.x - t.winOrg.x * r, t.vpOrg.y - t.winOrg.y * n];
    return cs(t.world, s);
  }
  tp(t, r) {
    return re(this.xf(), t, r);
  }
  save() {
    this.stack.push(Rp(this.dc));
  }
  restore(t = -1) {
    if (!this.stack.length) return;
    let r = t < 0 ? -t : Math.max(1, this.stack.length - t);
    r = Math.min(r, this.stack.length);
    let n;
    for (let o = 0; o < r; o++) n = this.stack.pop();
    n && (this.dc = n);
  }
  putObj(t, r) {
    t < 0 || t > 65535 || (this.objs[t] = r);
  }
  addObj(t) {
    for (let r = 0; r < this.objs.length; r++) if (!this.objs[r]) {
      this.objs[r] = t;
      return;
    }
    this.objs.length < 65536 && this.objs.push(t);
  }
  delObj(t) {
    t >= 0 && t < this.objs.length && (this.objs[t] = null);
  }
  selectIdx(t) {
    const r = t & 2147483648 || (t & 4294934528) === 32768 ? Ap(t) : this.objs[t] ?? null;
    r && this.select(r);
  }
  select(t) {
    t.kind === "pen" ? this.dc.pen = t : t.kind === "brush" ? this.dc.brush = t : this.dc.font = t;
  }
  intersectClip(t) {
    const r = this.xf(), n = [re(r, t.l, t.t), re(r, t.r, t.t), re(r, t.r, t.b), re(r, t.l, t.b)];
    if (n.some((i) => !Be(i))) return;
    const o = `M${q(n[0].x)} ${q(n[0].y)}L${q(n[1].x)} ${q(n[1].y)}L${q(n[2].x)} ${q(n[2].y)}L${q(n[3].x)} ${q(n[3].y)}Z`, s = this.dc.clip, l = `clip:${o}|${s ?? ""}`;
    this.dc.clip = this.svg.def(l, "c", (i) => `<clipPath id="${i}"${s ? ` clip-path="url(#${s})"` : ""}><path d="${o}"/></clipPath>`);
  }
  clearClip() {
    this.dc.clip = null;
  }
  setClipRects(t, r) {
    const n = this.xf(), o = [];
    for (const a of t) {
      const c = re(n, a.l, a.t), u = re(n, a.r, a.b);
      if (!Be(c) || !Be(u)) continue;
      const f = Math.min(c.x, u.x), h = Math.min(c.y, u.y), p = Math.abs(u.x - c.x), d = Math.abs(u.y - c.y);
      !(p > 0) || !(d > 0) || o.push(`<rect x="${q(f)}" y="${q(h)}" width="${q(p)}" height="${q(d)}"/>`);
    }
    if (!o.length) return;
    const s = r ? this.dc.clip : null, l = o.join(""), i = `rgn:${l}|${s ?? ""}`;
    this.dc.clip = this.svg.def(i, "c", (a) => `<clipPath id="${a}"${s ? ` clip-path="url(#${s})"` : ""}>${l}</clipPath>`);
  }
  clipAttr() {
    return this.dc.clip ? ` clip-path="url(#${this.dc.clip})"` : "";
  }
  strokeAttrs() {
    const t = this.dc.pen;
    if (t.style === ft) return ' stroke="none"';
    const r = Math.max(t.width, 0) * Kl(this.xf()), n = r < 0.75 ? 0.75 : r;
    let o = ` stroke="${t.color}" stroke-width="${q(n)}"`;
    const s = Fp(t.style, n);
    return s && (o += ` stroke-dasharray="${s}"`), s ? o += ' stroke-linecap="butt"' : t.cap === 256 ? o += ' stroke-linecap="square"' : t.cap === 512 ? o += ' stroke-linecap="butt"' : t.cap === 0 && (o += ' stroke-linecap="round"'), t.join === 4096 ? o += ' stroke-linejoin="bevel"' : t.join === 8192 ? o += ' stroke-linejoin="miter"' : t.join === 0 && (o += ' stroke-linejoin="round"'), o;
  }
  fillAttrs() {
    const t = this.dc.brush;
    if (t.style === _n) return ' fill="none"';
    if (t.style === Tp) {
      const r = this.dc.bkMode === 2 ? this.dc.bkColor : "none", n = `h:${t.hatch}:${t.color}:${r}`;
      return ` fill="url(#${this.svg.def(n, "h", (o) => Up(o, t.hatch, t.color, r))})"`;
    }
    if ((t.style === ei || t.style === ti) && t.href) {
      const r = `p:${t.href.length}:${t.href.slice(-32)}`;
      return ` fill="url(#${this.svg.def(r, "q", (n) => `<pattern id="${n}" width="16" height="16" patternUnits="userSpaceOnUse"><image xlink:href="${t.href}" width="16" height="16" preserveAspectRatio="none"/></pattern>`)})"`;
    }
    return t.style === ei || t.style === ti ? ` fill="${t.color}"` : ` fill="${t.color}"`;
  }
  ruleAttr() {
    return this.dc.polyFill === 1 ? ' fill-rule="evenodd"' : "";
  }
  emit(t, r) {
    if (!t) return;
    const n = r === "stroke" ? ' fill="none"' : this.fillAttrs() + this.ruleAttr(), o = r === "fill" ? ' stroke="none"' : this.strokeAttrs();
    this.svg.add(`<path d="${t}"${n}${o}${this.clipAttr()}/>`);
  }
  draw(t, r) {
    if (this.inPath) {
      t(this.path);
      return;
    }
    const n = new Lo();
    t(n), this.emit(n.data, r);
  }
  beginPath() {
    this.path.clear(), this.inPath = !0;
  }
  endPath() {
    this.inPath = !1;
  }
  abortPath() {
    this.path.clear(), this.inPath = !1;
  }
  closeFigure() {
    this.path.close();
  }
  finishPath(t) {
    this.inPath = !1, this.emit(this.path.data, t), this.path.clear();
  }
  clipToPath() {
    const t = this.path.data;
    if (this.inPath = !1, !t) return;
    const r = this.dc.clip;
    this.dc.clip = this.svg.def(`clipP:${t}|${r ?? ""}`, "c", (n) => `<clipPath id="${n}"${r ? ` clip-path="url(#${r})"` : ""}><path d="${t}"/></clipPath>`), this.path.clear();
  }
  moveTo(t, r) {
    this.dc.pos = { x: t, y: r }, this.inPath && this.path.move(this.tp(t, r));
  }
  lineTo(t, r) {
    const n = this.xf(), o = re(n, this.dc.pos.x, this.dc.pos.y), s = re(n, t, r);
    this.inPath ? this.path.line(s) : this.emit(`M${q(o.x)} ${q(o.y)}L${q(s.x)} ${q(s.y)}`, "stroke"), this.dc.pos = { x: t, y: r };
  }
  polyline(t, r) {
    if (t.length < 2) return;
    const n = this.xf(), o = t.map((l) => re(n, l.x, l.y));
    this.draw((l) => {
      l.move(o[0]);
      for (let i = 1; i < o.length; i++) l.line(o[i]);
      r && l.close();
    }, r ? "both" : "stroke");
    const s = t[t.length - 1];
    this.dc.pos = { x: s.x, y: s.y };
  }
  polylineTo(t) {
    if (!t.length) return;
    const r = this.xf();
    if (this.inPath) for (const o of t) this.path.line(re(r, o.x, o.y));
    else {
      const o = re(r, this.dc.pos.x, this.dc.pos.y);
      let s = `M${q(o.x)} ${q(o.y)}`;
      for (const l of t) {
        const i = re(r, l.x, l.y);
        s += `L${q(i.x)} ${q(i.y)}`;
      }
      this.emit(s, "stroke");
    }
    const n = t[t.length - 1];
    this.dc.pos = { x: n.x, y: n.y };
  }
  polyBezier(t, r) {
    const n = this.xf(), o = t.map((l) => re(n, l.x, l.y)), s = (l) => {
      let i = 0;
      if (r) this.inPath || l.move(re(n, this.dc.pos.x, this.dc.pos.y));
      else {
        if (!o.length) return;
        l.move(o[0]), i = 1;
      }
      for (; i + 2 < o.length; i += 3) l.cubic(o[i], o[i + 1], o[i + 2]);
    };
    if (this.inPath) s(this.path);
    else {
      const l = new Lo();
      s(l), this.emit(l.data, "stroke");
    }
    if (t.length) {
      const l = t[t.length - 1];
      this.dc.pos = { x: l.x, y: l.y };
    }
  }
  polyPoly(t, r) {
    const n = this.xf();
    this.draw((o) => {
      for (const s of t) if (!(s.length < 2)) {
        o.move(re(n, s[0].x, s[0].y));
        for (let l = 1; l < s.length; l++) o.line(re(n, s[l].x, s[l].y));
        r && o.close();
      }
    }, r ? "both" : "stroke");
  }
  rect(t) {
    const r = this.xf();
    if (!this.inPath && r[1] === 0 && r[2] === 0) {
      const o = re(r, t.l, t.t), s = re(r, t.r, t.b);
      if (Be(o) && Be(s)) {
        const l = Math.abs(s.x - o.x), i = Math.abs(s.y - o.y);
        this.svg.add(`<rect x="${q(Math.min(o.x, s.x))}" y="${q(Math.min(o.y, s.y))}" width="${q(l)}" height="${q(i)}"${this.fillAttrs()}${this.strokeAttrs()}${this.clipAttr()}/>`);
        return;
      }
    }
    const n = [re(r, t.l, t.t), re(r, t.r, t.t), re(r, t.r, t.b), re(r, t.l, t.b)];
    this.draw((o) => {
      o.move(n[0]), o.line(n[1]), o.line(n[2]), o.line(n[3]), o.close();
    }, "both");
  }
  ellipse(t) {
    const r = this.xf(), n = (t.l + t.r) / 2, o = (t.t + t.b) / 2, s = Math.abs(t.r - t.l) / 2, l = Math.abs(t.b - t.t) / 2;
    this.draw((i) => {
      i.move(ni(n, o, s, l, 0, r));
      for (const a of sn(n, o, s, l, 0, Math.PI * 2, r)) i.cubic(a[0], a[1], a[2]);
      i.close();
    }, "both");
  }
  roundRect(t, r, n) {
    const o = this.xf(), s = Math.min(t.l, t.r), l = Math.min(t.t, t.b), i = Math.max(t.l, t.r), a = Math.max(t.t, t.b), c = Math.min(Math.abs(r) / 2, (i - s) / 2), u = Math.min(Math.abs(n) / 2, (a - l) / 2);
    if (c <= 0 || u <= 0) {
      this.rect(t);
      return;
    }
    this.draw((f) => {
      f.move(re(o, s + c, l)), f.line(re(o, i - c, l));
      for (const h of sn(i - c, l + u, c, u, -Math.PI / 2, 0, o)) f.cubic(h[0], h[1], h[2]);
      f.line(re(o, i, a - u));
      for (const h of sn(i - c, a - u, c, u, 0, Math.PI / 2, o)) f.cubic(h[0], h[1], h[2]);
      f.line(re(o, s + c, a));
      for (const h of sn(s + c, a - u, c, u, Math.PI / 2, Math.PI, o)) f.cubic(h[0], h[1], h[2]);
      f.line(re(o, s, l + u));
      for (const h of sn(s + c, l + u, c, u, Math.PI, Math.PI * 1.5, o)) f.cubic(h[0], h[1], h[2]);
      f.close();
    }, "both");
  }
  arc(t, r, n, o, s, l, i = !1) {
    const a = this.xf(), c = (t.l + t.r) / 2, u = (t.t + t.b) / 2, f = Math.abs(t.r - t.l) / 2, h = Math.abs(t.b - t.t) / 2;
    if (f <= 0 || h <= 0) return;
    const p = ri(c, u, f, h, r, n);
    let d = ri(c, u, f, h, o, s), m = p - d;
    for (; m <= 0; ) m += Math.PI * 2;
    d = p - m;
    const $ = l === "arc" ? "stroke" : "both";
    this.draw((b) => {
      const M = ni(c, u, f, h, p, a);
      l === "pie" ? (b.move(re(a, c, u)), b.line(M)) : i && this.inPath ? b.line(M) : b.move(M);
      for (const E of sn(c, u, f, h, p, d, a)) b.cubic(E[0], E[1], E[2]);
      l !== "arc" && b.close();
    }, $);
    const x = { x: c + f * Math.cos(d), y: u + h * Math.sin(d) };
    this.dc.pos = x;
  }
  polyDraw(t, r) {
    const n = this.xf(), o = Math.min(t.length, r.length);
    this.draw((s) => {
      for (let l = 0; l < o; l++) {
        const i = r[l] & 6;
        i === 4 && l + 2 < o ? (s.cubic(re(n, t[l].x, t[l].y), re(n, t[l + 1].x, t[l + 1].y), re(n, t[l + 2].x, t[l + 2].y)), l += 2) : i === 6 ? s.move(re(n, t[l].x, t[l].y)) : s.line(re(n, t[l].x, t[l].y)), r[l] & 1 && s.close();
      }
    }, "stroke"), o && (this.dc.pos = { x: t[o - 1].x, y: t[o - 1].y });
  }
  text(t, r, n, o, s) {
    if (!n) return;
    const l = this.xf(), i = re(l, t, r);
    if (!Be(i)) return;
    const a = this.dc.font, c = (a.height < 0 ? -a.height : a.height * 0.87) * vp(l);
    if (!(c > 0) || !Number.isFinite(c)) return;
    if (s && this.dc.bkMode === 2) {
      const d = re(l, s.l, s.t), m = re(l, s.r, s.b);
      Be(d) && Be(m) && this.svg.add(`<rect x="${q(Math.min(d.x, m.x))}" y="${q(Math.min(d.y, m.y))}" width="${q(Math.abs(m.x - d.x))}" height="${q(Math.abs(m.y - d.y))}" fill="${this.dc.bkColor}"${this.clipAttr()}/>`);
    }
    const u = this.dc.textAlign, f = (u & 6) === 2 ? "end" : (u & 6) === 6 ? "middle" : "start", h = (u & 24) === 24 ? "" : (u & 24) === 8 ? "text-after-edge" : "text-before-edge";
    let p = ` x="${q(i.x)}" y="${q(i.y)}"`;
    if (a.escapement && (p += ` transform="rotate(${q(-a.escapement / 10)} ${q(i.x)} ${q(i.y)})"`), p += ` font-family="${Jl(Dp(a.face))}" font-size="${q(c)}" fill="${this.dc.textColor}"`, a.weight >= 600 && (p += ` font-weight="${a.weight}"`), a.italic && (p += ' font-style="italic"'), a.underline && a.strike ? p += ' text-decoration="underline line-through"' : a.underline ? p += ' text-decoration="underline"' : a.strike && (p += ' text-decoration="line-through"'), f !== "start" && (p += ` text-anchor="${f}"`), h && (p += ` dominant-baseline="${h}"`), o && o.length) {
      let d = 0;
      for (const $ of o) d += $;
      const m = d * Kl(l);
      m > 0 && Number.isFinite(m) && (p += ` textLength="${q(m)}" lengthAdjust="spacingAndGlyphs"`);
    }
    this.svg.add(`<text${p} xml:space="preserve"${this.clipAttr()}>${Jl(n)}</text>`);
  }
  image(t, r) {
    const n = this.xf(), o = t.r - t.l, s = t.b - t.t, l = re(n, t.l, t.t), i = re(n, t.l + o, t.t + s);
    if (!Be(l) || !Be(i)) return;
    const a = Math.min(l.x, i.x), c = Math.min(l.y, i.y), u = Math.abs(i.x - l.x), f = Math.abs(i.y - l.y);
    !(u > 0) || !(f > 0) || this.svg.add(`<image x="${q(a)}" y="${q(c)}" width="${q(u)}" height="${q(f)}" preserveAspectRatio="none" xlink:href="${r}"${this.clipAttr()}/>`);
  }
  render(t, r, n) {
    return this.svg.render(t, r, n);
  }
}
function Fp(e, t) {
  const r = Math.max(t, 1);
  switch (e) {
    case Cp:
      return `${q(r * 6)} ${q(r * 3)}`;
    case Ep:
      return `${q(r)} ${q(r * 3)}`;
    case Sp:
      return `${q(r * 6)} ${q(r * 3)} ${q(r)} ${q(r * 3)}`;
    case Lp:
      return `${q(r * 6)} ${q(r * 3)} ${q(r)} ${q(r * 3)} ${q(r)} ${q(r * 3)}`;
    default:
      return "";
  }
}
const oi = { 0: "M0 4H8", 1: "M4 0V8", 2: "M0 0L8 8", 3: "M0 8L8 0", 4: "M0 4H8M4 0V8", 5: "M0 0L8 8M0 8L8 0" };
function Up(e, t, r, n) {
  const o = oi[t] ?? oi[0], s = n === "none" ? "" : `<rect width="8" height="8" fill="${n}"/>`;
  return `<pattern id="${e}" width="8" height="8" patternUnits="userSpaceOnUse">${s}<path d="${o}" stroke="${r}" stroke-width="1" fill="none"/></pattern>`;
}
const si = ", 'Helvetica Neue', Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif";
function Dp(e) {
  const t = e.trim();
  return t ? /^(symbol|wingdings|webdings)/i.test(t) ? `'${t}'` : `'${t}'${si}` : `Arial${si}`;
}
const Bp = { 0: "windows-1252", 1: "windows-1252", 2: "windows-1252", 77: "macintosh", 128: "shift_jis", 129: "euc-kr", 130: "euc-kr", 134: "gbk", 136: "big5", 161: "windows-1253", 162: "windows-1254", 163: "windows-1258", 177: "windows-1255", 178: "windows-1256", 186: "windows-1257", 204: "windows-1251", 222: "windows-874", 238: "windows-1250" };
function hs(e, t) {
  const r = Bp[t];
  if (r && typeof TextDecoder < "u") try {
    return new TextDecoder(r, { fatal: !1 }).decode(e).replace(/\0+$/, "");
  } catch {
  }
  let n = "";
  for (let o = 0; o < e.length && e[o] !== 0; o++) n += String.fromCharCode(e[o]);
  return n;
}
const xt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function Yn(e) {
  let t = "", r = 0;
  for (; r + 2 < e.length; r += 3) {
    const o = e[r] << 16 | e[r + 1] << 8 | e[r + 2];
    t += xt[o >> 18 & 63] + xt[o >> 12 & 63] + xt[o >> 6 & 63] + xt[o & 63];
  }
  const n = e.length - r;
  if (n === 1) {
    const o = e[r] << 16;
    t += xt[o >> 18 & 63] + xt[o >> 12 & 63] + "==";
  } else if (n === 2) {
    const o = e[r] << 16 | e[r + 1] << 8;
    t += xt[o >> 18 & 63] + xt[o >> 12 & 63] + xt[o >> 6 & 63] + "=";
  }
  return t;
}
let To = null;
function Hp(e) {
  if (!To) {
    const r = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let o = n;
      for (let s = 0; s < 8; s++) o = o & 1 ? 3988292384 ^ o >>> 1 : o >>> 1;
      r[n] = o;
    }
    To = r;
  }
  let t = -1;
  for (let r = 0; r < e.length; r++) t = To[(t ^ e[r]) & 255] ^ t >>> 8;
  return (t ^ -1) >>> 0;
}
function Po(e, t) {
  const r = new Uint8Array(t.length + 12), n = new DataView(r.buffer);
  n.setUint32(0, t.length);
  for (let o = 0; o < 4; o++) r[4 + o] = e.charCodeAt(o);
  return r.set(t, 8), n.setUint32(t.length + 8, Hp(r.subarray(4, t.length + 8))), r;
}
function yc(e, t, r) {
  const n = new Uint8Array(r * (t * 4 + 1));
  for (let u = 0; u < r; u++) n[u * (t * 4 + 1)] = 0, n.set(e.subarray(u * t * 4, (u + 1) * t * 4), u * (t * 4 + 1) + 1);
  const o = new Uint8Array(13), s = new DataView(o.buffer);
  s.setUint32(0, t), s.setUint32(4, r), o[8] = 8, o[9] = 6;
  const l = [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), Po("IHDR", o), Po("IDAT", Nu(n, { level: 6 })), Po("IEND", new Uint8Array(0))];
  let i = 0;
  for (const u of l) i += u.length;
  const a = new Uint8Array(i);
  let c = 0;
  for (const u of l) a.set(u, c), c += u.length;
  return a;
}
const Wp = 8192 * 8192;
function Ao(e) {
  if (!e) return { shift: 0, scale: 0 };
  let t = 0, r = e;
  for (; !(r & 1); ) r >>>= 1, t++;
  let n = 0;
  for (; r & 1; ) r >>>= 1, n++;
  return { shift: t, scale: n > 0 ? 255 / ((1 << n) - 1) : 0 };
}
function Vp(e, t, r, n, o, s) {
  if (!(n > 0) || !(o > 0)) return null;
  const l = new Uint8Array(n * o);
  let i = t;
  const a = Math.min(e.length, t + r);
  let c = 0, u = o - 1;
  const f = (h) => {
    c >= 0 && c < n && u >= 0 && u < o && (l[u * n + c] = h), c++;
  };
  for (; i + 1 < a && u >= 0; ) {
    const h = e[i++], p = e[i++];
    if (h > 0) {
      if (s) {
        const d = p >> 4 & 15, m = p & 15;
        for (let $ = 0; $ < h; $++) f($ % 2 === 0 ? d : m);
      } else for (let d = 0; d < h; d++) f(p);
      continue;
    }
    if (p === 0) {
      c = 0, u--;
      continue;
    }
    if (p === 1) break;
    if (p === 2) {
      if (i + 1 >= a) break;
      c += e[i++], u -= e[i++];
      continue;
    }
    if (s) {
      const d = p + 1 >> 1;
      if (i + d > a) break;
      for (let m = 0; m < p; m++) {
        const $ = e[i + (m >> 1)];
        f(m % 2 === 0 ? $ >> 4 & 15 : $ & 15);
      }
      i += d + (d & 1);
    } else {
      if (i + p > a) break;
      for (let d = 0; d < p; d++) f(e[i + d]);
      i += p + (p & 1);
    }
  }
  return l;
}
function Xp(e, t, r, n, o) {
  if (t < 0 || r < 12 || t + 12 > e.length) return null;
  const s = new He(e, t, Math.min(e.length, t + Math.max(r, 12))), l = s.u32();
  let i, a, c, u = 0, f = 0, h = !1;
  if (l === 12) h = !0, i = s.i16(), a = s.i16(), s.u16(), c = s.u16();
  else if (l >= 16) i = s.i32(), a = s.i32(), s.u16(), c = s.u16(), l >= 24 && (u = s.u32(), s.u32()), l >= 36 && (s.u32(), s.u32(), f = s.u32());
  else return null;
  const p = a < 0;
  if (a = Math.abs(a), !(i > 0) || !(a > 0) || i * a > Wp || u === 4 || u === 5) return null;
  const d = u === 1, m = u === 2;
  if (u !== 0 && u !== 3 && !d && !m || d && c !== 8 || m && c !== 4 || ![1, 4, 8, 16, 24, 32].includes(c)) return null;
  let $ = 0, x = 0, b = 0;
  if (u === 3) {
    const A = new He(e, t + l, e.length);
    $ = A.u32(), x = A.u32(), b = A.u32();
  } else c === 16 ? ($ = 31744, x = 992, b = 31) : c === 32 && ($ = 16711680, x = 65280, b = 255);
  let M = null;
  if (c <= 8) {
    const A = f > 0 ? Math.min(f, 1 << c) : 1 << c, z = h ? 3 : 4, R = t + l + (u === 3 ? 12 : 0);
    M = new Uint8Array(A * 3);
    const O = new He(e, R, e.length);
    for (let U = 0; U < A; U++) {
      const j = O.u8(), W = O.u8(), X = O.u8();
      z === 4 && O.u8(), M[U * 3] = X, M[U * 3 + 1] = W, M[U * 3 + 2] = j;
    }
  }
  const E = i * c + 31 >> 5 << 2, y = n, v = Math.min(o > 0 ? o : e.length - y, e.length - y);
  if (y < 0 || y >= e.length) return null;
  if (d || m) {
    const A = Vp(e, y, v, i, a, m);
    if (!A) return null;
    const z = new Uint8Array(i * a * 4);
    for (let R = 0; R < A.length; R++) {
      const O = A[R] * 3, U = R * 4;
      M && O + 2 < M.length && (z[U] = M[O], z[U + 1] = M[O + 1], z[U + 2] = M[O + 2]), z[U + 3] = 255;
    }
    return { w: i, h: a, rgba: z };
  }
  if (v < E) return null;
  const k = Math.min(a, Math.floor(v / E));
  if (k <= 0) return null;
  const T = new Uint8Array(i * a * 4), S = Ao($), N = Ao(x), P = Ao(b);
  let L = !1;
  for (let A = 0; A < k; A++) {
    const z = p ? A : a - 1 - A;
    let R = y + A * E, O = z * i * 4;
    for (let U = 0; U < i; U++) {
      let j = 0, W = 0, X = 0, B = 255;
      if (c === 24) X = e[R], W = e[R + 1], j = e[R + 2], R += 3;
      else if (c === 32) {
        const Z = e[R] | e[R + 1] << 8 | e[R + 2] << 16 | e[R + 3] << 24;
        j = S.scale ? ((Z & $) >>> S.shift) * S.scale : 0, W = N.scale ? ((Z & x) >>> N.shift) * N.scale : 0, X = P.scale ? ((Z & b) >>> P.shift) * P.scale : 0, B = e[R + 3], B !== 0 && (L = !0), R += 4;
      } else if (c === 16) {
        const Z = e[R] | e[R + 1] << 8;
        j = ((Z & $) >>> S.shift) * S.scale, W = ((Z & x) >>> N.shift) * N.scale, X = ((Z & b) >>> P.shift) * P.scale, R += 2;
      } else {
        const Z = U * c, Y = e[y + A * E + (Z >> 3)] ?? 0, J = c === 8 ? Y : c === 4 ? Z % 8 === 0 ? Y >> 4 : Y & 15 : Y >> 7 - (Z & 7) & 1, G = J * 3;
        M && G + 2 < M.length ? (j = M[G], W = M[G + 1], X = M[G + 2]) : j = W = X = J ? 255 : 0;
      }
      T[O] = j | 0, T[O + 1] = W | 0, T[O + 2] = X | 0, T[O + 3] = B, O += 4;
    }
  }
  if (c === 32 && !L) for (let A = 3; A < T.length; A += 4) T[A] = 255;
  return { w: i, h: a, rgba: T };
}
function Jn(e, t, r, n, o) {
  try {
    if (t >= 0 && t + 20 <= e.length) {
      const l = new He(e, t, e.length);
      if (l.u32() >= 24) {
        l.skip(12);
        const i = l.u32();
        if ((i === 4 || i === 5) && o > 0 && n + o <= e.length) return `data:${i === 4 ? "image/jpeg" : "image/png"};base64,${Yn(e.subarray(n, n + o))}`;
      }
    }
    const s = Xp(e, t, r, n, o);
    return s ? `data:image/png;base64,${Yn(yc(s.rgba, s.w, s.h))}` : null;
  } catch {
    return null;
  }
}
function vc(e, t) {
  if (t + 4 > e.length) return 0;
  const r = new He(e, t, e.length), n = r.u32();
  if (n === 12) {
    r.skip(4);
    const i = new He(e, t + 10, e.length).u16();
    return 12 + (i <= 8 ? (1 << i) * 3 : 0);
  }
  if (n < 16 || n > 200) return 0;
  const o = new He(e, t + 14, e.length).u16(), s = n >= 20 ? new He(e, t + 16, e.length).u32() : 0;
  let l = n >= 36 ? new He(e, t + 32, e.length).u32() : 0;
  return o <= 8 ? l = l > 0 ? Math.min(l, 1 << o) : 1 << o : l = 0, n + (s === 3 ? 12 : 0) + l * 4;
}
const Yp = 1179469088, Gp = 1e5, _ = { HEADER: 1, POLYBEZIER: 2, POLYGON: 3, POLYLINE: 4, POLYBEZIERTO: 5, POLYLINETO: 6, POLYPOLYLINE: 7, POLYPOLYGON: 8, SETWINDOWEXTEX: 9, SETWINDOWORGEX: 10, SETVIEWPORTEXTEX: 11, SETVIEWPORTORGEX: 12, EOF: 14, SETPIXELV: 15, SETMAPMODE: 17, SETBKMODE: 18, SETPOLYFILLMODE: 19, SETTEXTALIGN: 22, SETTEXTCOLOR: 24, SETBKCOLOR: 25, MOVETOEX: 27, INTERSECTCLIPRECT: 30, SCALEVIEWPORTEXTEX: 31, SCALEWINDOWEXTEX: 32, SAVEDC: 33, RESTOREDC: 34, SETWORLDTRANSFORM: 35, MODIFYWORLDTRANSFORM: 36, SELECTOBJECT: 37, CREATEPEN: 38, CREATEBRUSHINDIRECT: 39, DELETEOBJECT: 40, ELLIPSE: 42, RECTANGLE: 43, ROUNDRECT: 44, ARC: 45, CHORD: 46, PIE: 47, LINETO: 54, ARCTO: 55, POLYDRAW: 56, BEGINPATH: 59, ENDPATH: 60, CLOSEFIGURE: 61, FILLPATH: 62, STROKEANDFILLPATH: 63, STROKEPATH: 64, SELECTCLIPPATH: 67, ABORTPATH: 68, EXTSELECTCLIPRGN: 75, BITBLT: 76, STRETCHBLT: 77, STRETCHDIBITS: 81, EXTCREATEFONTINDIRECTW: 82, EXTTEXTOUTA: 83, EXTTEXTOUTW: 84, POLYBEZIER16: 85, POLYGON16: 86, POLYLINE16: 87, POLYBEZIERTO16: 88, POLYLINETO16: 89, POLYPOLYLINE16: 90, POLYPOLYGON16: 91, POLYDRAW16: 92, CREATEMONOBRUSH: 93, CREATEDIBPATTERNBRUSHPT: 94, EXTCREATEPEN: 95 };
function Mc(e) {
  if (e.length < 88) return !1;
  const t = new DataView(e.buffer, e.byteOffset, e.byteLength);
  return t.getUint32(0, !0) === 1 && t.getUint32(40, !0) === Yp;
}
function Zp(e, t = {}) {
  try {
    return _p(e, t);
  } catch {
    return null;
  }
}
function _p(e, t) {
  if (!Mc(e)) return null;
  const r = new He(e, 0, e.length);
  r.skip(8);
  const n = r.rectL(), o = r.rectL();
  r.skip(16), r.skip(16);
  const s = r.i32(), l = r.i32(), i = r.i32(), a = r.i32(), c = i > 0 && s > 0 ? s / i : 96 / 25.4, u = a > 0 && l > 0 ? l / a : 96 / 25.4, f = new Ys({ pxPerMmX: c, pxPerMmY: u });
  let h = n;
  if (!(h.r > h.l) || !(h.b > h.t)) {
    const M = Math.round((o.r - o.l) * c / 100), E = Math.round((o.b - o.t) * u / 100);
    h = { l: 0, t: 0, r: M > 0 ? M : 1024, b: E > 0 ? E : 768 };
  }
  h = { l: h.l, t: h.t, r: h.r + 1, b: h.b + 1 };
  const p = (o.r - o.l) * 96 / 2540, d = (o.b - o.t) * 96 / 2540, m = t.width ?? (p > 0 ? p : h.r - h.l), $ = t.height ?? (d > 0 ? d : h.b - h.t);
  f.dc.mapMode = fs;
  let x = 0, b = 0;
  for (; x + 8 <= e.length && b < Gp; ) {
    const M = new DataView(e.buffer, e.byteOffset, e.byteLength), E = M.getUint32(x, !0), y = M.getUint32(x + 4, !0);
    if (y < 8 || y % 4 !== 0 || x + y > e.length || E === _.EOF) break;
    E !== _.HEADER && qp(f, e, E, x, y), x += y, b++;
  }
  return f.render(h, m, $);
}
function qp(e, t, r, n, o) {
  const s = new He(t, n + 8, n + o);
  switch (r) {
    case _.POLYGON:
      e.polyline(Sn(s), !0);
      break;
    case _.POLYLINE:
      e.polyline(Sn(s), !1);
      break;
    case _.POLYBEZIER:
      e.polyBezier(Sn(s), !1);
      break;
    case _.POLYLINETO:
      e.polylineTo(Sn(s));
      break;
    case _.POLYBEZIERTO:
      e.polyBezier(Sn(s), !0);
      break;
    case _.POLYGON16:
      e.polyline(Ln(s), !0);
      break;
    case _.POLYLINE16:
      e.polyline(Ln(s), !1);
      break;
    case _.POLYBEZIER16:
      e.polyBezier(Ln(s), !1);
      break;
    case _.POLYLINETO16:
      e.polylineTo(Ln(s));
      break;
    case _.POLYBEZIERTO16:
      e.polyBezier(Ln(s), !0);
      break;
    case _.POLYPOLYGON:
      e.polyPoly(ir(s, !1), !0);
      break;
    case _.POLYPOLYLINE:
      e.polyPoly(ir(s, !1), !1);
      break;
    case _.POLYPOLYGON16:
      e.polyPoly(ir(s, !0), !0);
      break;
    case _.POLYPOLYLINE16:
      e.polyPoly(ir(s, !0), !1);
      break;
    case _.POLYDRAW:
    case _.POLYDRAW16: {
      s.skip(16);
      const l = pn(s.i32()), i = [];
      for (let c = 0; c < l; c++) i.push(r === _.POLYDRAW ? s.ptL() : s.pt16());
      const a = [];
      for (let c = 0; c < l; c++) a.push(s.u8());
      e.polyDraw(i, a);
      break;
    }
    case _.RECTANGLE:
      e.rect(s.rectL());
      break;
    case _.ELLIPSE:
      e.ellipse(s.rectL());
      break;
    case _.ROUNDRECT: {
      const l = s.rectL();
      e.roundRect(l, s.i32(), s.i32());
      break;
    }
    case _.ARC:
    case _.CHORD:
    case _.PIE:
    case _.ARCTO: {
      const l = s.rectL(), i = s.ptL(), a = s.ptL(), c = r === _.CHORD ? "chord" : r === _.PIE ? "pie" : "arc";
      e.arc(l, i.x, i.y, a.x, a.y, c, r === _.ARCTO);
      break;
    }
    case _.MOVETOEX: {
      const l = s.ptL();
      e.moveTo(l.x, l.y);
      break;
    }
    case _.LINETO: {
      const l = s.ptL();
      e.lineTo(l.x, l.y);
      break;
    }
    case _.SETPIXELV: {
      const l = s.ptL(), i = s.color();
      e.dc.brush = { kind: "brush", style: en, color: i, hatch: 0, href: null }, e.dc.pen = { ...e.dc.pen, style: ft }, e.rect({ l: l.x, t: l.y, r: l.x + 1, b: l.y + 1 });
      break;
    }
    case _.BEGINPATH:
      e.beginPath();
      break;
    case _.ENDPATH:
      e.endPath();
      break;
    case _.CLOSEFIGURE:
      e.closeFigure();
      break;
    case _.FILLPATH:
      e.finishPath("fill");
      break;
    case _.STROKEPATH:
      e.finishPath("stroke");
      break;
    case _.STROKEANDFILLPATH:
      e.finishPath("both");
      break;
    case _.ABORTPATH:
      e.abortPath();
      break;
    case _.SELECTCLIPPATH:
      e.clipToPath();
      break;
    case _.CREATEPEN: {
      const l = s.i32();
      e.putObj(l, Kp(s));
      break;
    }
    case _.EXTCREATEPEN: {
      const l = s.i32();
      e.putObj(l, Qp(s));
      break;
    }
    case _.CREATEBRUSHINDIRECT: {
      const l = s.i32();
      e.putObj(l, e1(s));
      break;
    }
    case _.CREATEMONOBRUSH:
    case _.CREATEDIBPATTERNBRUSHPT: {
      const l = s.i32();
      e.putObj(l, t1(s, t, n));
      break;
    }
    case _.EXTCREATEFONTINDIRECTW: {
      const l = s.i32();
      e.putObj(l, n1(s));
      break;
    }
    case _.SELECTOBJECT:
      e.selectIdx(s.u32());
      break;
    case _.DELETEOBJECT:
      e.delObj(s.u32());
      break;
    case _.SETWORLDTRANSFORM:
      e.dc.world = li(s);
      break;
    case _.MODIFYWORLDTRANSFORM: {
      const l = li(s), i = s.u32();
      i === 1 ? e.dc.world = [...bc] : i === 2 ? e.dc.world = cs(l, e.dc.world) : i === 3 && (e.dc.world = cs(e.dc.world, l));
      break;
    }
    case _.SETWINDOWEXTEX:
      e.dc.winExt = { x: s.i32(), y: s.i32() };
      break;
    case _.SETWINDOWORGEX:
      e.dc.winOrg = s.ptL();
      break;
    case _.SETVIEWPORTEXTEX:
      e.dc.vpExt = { x: s.i32(), y: s.i32() };
      break;
    case _.SETVIEWPORTORGEX:
      e.dc.vpOrg = s.ptL();
      break;
    case _.SETMAPMODE:
      e.dc.mapMode = s.u32();
      break;
    case _.SCALEVIEWPORTEXTEX: {
      const l = s.i32(), i = s.i32(), a = s.i32(), c = s.i32();
      i && (e.dc.vpExt.x = e.dc.vpExt.x * l / i), c && (e.dc.vpExt.y = e.dc.vpExt.y * a / c);
      break;
    }
    case _.SCALEWINDOWEXTEX: {
      const l = s.i32(), i = s.i32(), a = s.i32(), c = s.i32();
      i && (e.dc.winExt.x = e.dc.winExt.x * l / i), c && (e.dc.winExt.y = e.dc.winExt.y * a / c);
      break;
    }
    case _.SAVEDC:
      e.save();
      break;
    case _.RESTOREDC:
      e.restore(s.i32());
      break;
    case _.SETBKMODE:
      e.dc.bkMode = s.u32();
      break;
    case _.SETPOLYFILLMODE:
      e.dc.polyFill = s.u32();
      break;
    case _.SETTEXTALIGN:
      e.dc.textAlign = s.u32();
      break;
    case _.SETTEXTCOLOR:
      e.dc.textColor = s.color();
      break;
    case _.SETBKCOLOR:
      e.dc.bkColor = s.color();
      break;
    case _.INTERSECTCLIPRECT:
      e.intersectClip(s.rectL());
      break;
    case _.EXTSELECTCLIPRGN:
      r1(e, s);
      break;
    case _.EXTTEXTOUTW:
    case _.EXTTEXTOUTA:
      o1(e, s, t, n, o, r === _.EXTTEXTOUTW);
      break;
    case _.STRETCHDIBITS:
      s1(e, s, t, n);
      break;
    case _.BITBLT:
    case _.STRETCHBLT:
      l1(e, s, t, n, r === _.STRETCHBLT);
      break;
  }
}
const Jp = 1 << 20, pn = (e) => e > 0 && e < Jp ? e | 0 : 0;
function Sn(e) {
  e.skip(16);
  const t = Math.min(pn(e.i32()), e.left >> 3), r = [];
  for (let n = 0; n < t; n++) r.push(e.ptL());
  return r;
}
function Ln(e) {
  e.skip(16);
  const t = Math.min(pn(e.i32()), e.left >> 2), r = [];
  for (let n = 0; n < t; n++) r.push(e.pt16());
  return r;
}
function ir(e, t) {
  e.skip(16);
  const r = pn(e.i32()), n = pn(e.i32());
  if (!r || !n || r > n) return [];
  const o = [];
  let s = 0;
  for (let c = 0; c < r; c++) {
    const u = pn(e.i32());
    o.push(u), s += u;
  }
  if (s > n) return [];
  const l = t ? e.left >> 2 : e.left >> 3, i = [];
  let a = 0;
  for (const c of o) {
    const u = [];
    for (let f = 0; f < c && a < l; f++, a++) u.push(t ? e.pt16() : e.ptL());
    i.push(u);
  }
  return i;
}
function Kp(e) {
  const t = e.u32(), r = e.i32();
  return e.i32(), { kind: "pen", style: t & 15, width: Math.abs(r) || 1, color: e.color(), cap: 0, join: 0 };
}
function Qp(e) {
  e.skip(16);
  const t = e.u32(), r = e.u32(), n = e.u32(), o = e.color();
  return { kind: "pen", style: n === _n ? ft : t & 15, width: Math.max(r || 1, 1), color: o, cap: t & 3840, join: t & 61440 };
}
function e1(e) {
  const t = e.u32(), r = e.color(), n = e.u32();
  return { kind: "brush", style: t, color: r, hatch: n, href: null };
}
function t1(e, t, r) {
  e.u32();
  const n = e.u32(), o = e.u32(), s = e.u32(), l = e.u32(), i = o > 0 ? Jn(t, r + n, o, r + s, l) : null;
  return { kind: "brush", style: i ? 5 : en, color: "#808080", hatch: 0, href: i };
}
function n1(e) {
  const t = e.i32();
  e.i32();
  const r = e.i32();
  e.i32();
  const n = e.i32(), o = e.u8() !== 0, s = e.u8() !== 0, l = e.u8() !== 0, i = e.u8();
  e.skip(4);
  const a = e.utf16(64), c = qn();
  return { kind: "font", height: t || c.height, escapement: r, weight: n > 0 ? n : 400, italic: o, underline: s, strike: l, charset: i, face: a || c.face };
}
function li(e) {
  return [e.f32(), e.f32(), e.f32(), e.f32(), e.f32(), e.f32()];
}
function r1(e, t) {
  const r = t.u32(), n = t.u32();
  if (r === 0) {
    n === Ql && e.clearClip();
    return;
  }
  t.u32();
  const o = t.u32(), s = t.u32();
  if (t.u32(), t.rectL(), o !== kp || s <= 0 || s > 65536) return;
  const l = [];
  for (let i = 0; i < s; i++) l.push(t.rectL());
  n === Ql ? e.setClipRects(l, !1) : n === Mp && e.setClipRects(l, !0);
}
function o1(e, t, r, n, o, s) {
  t.skip(16), t.u32();
  const l = t.f32();
  t.f32();
  const i = t.ptL(), a = t.u32(), c = t.u32(), u = t.u32(), f = t.rectL(), h = t.u32();
  if (!a || a > 65536) return;
  const p = n + c, d = s ? a * 2 : a;
  if (c < 8 || p + d > n + o) return;
  const m = s ? new He(r, p, p + d).utf16(d) : hs(r.subarray(p, p + d), e.dc.font.charset);
  if (!m) return;
  let $ = null;
  const x = n + h;
  if (h >= 8 && x + a * 4 <= n + o) {
    const M = new He(r, x, x + a * 4);
    $ = [];
    for (let E = 0; E < a; E++) $.push(M.i32());
    l > 0 && l !== 1 && Number.isFinite(l) && ($ = $.map((E) => E * l));
  }
  const b = u & 2 ? f : null;
  e.text(i.x, i.y, m, $, b);
}
function s1(e, t, r, n) {
  t.skip(16);
  const o = t.i32(), s = t.i32();
  t.i32(), t.i32(), t.i32(), t.i32();
  const l = t.u32(), i = t.u32(), a = t.u32(), c = t.u32();
  t.u32(), t.u32();
  const u = t.i32(), f = t.i32();
  if (!i || !c) return;
  const h = Jn(r, n + l, i, n + a, c);
  h && e.image({ l: o, t: s, r: o + u, b: s + f }, h);
}
function l1(e, t, r, n, o) {
  t.skip(16);
  const s = t.i32(), l = t.i32(), i = t.i32(), a = t.i32();
  t.u32(), t.i32(), t.i32(), t.skip(24), t.u32(), t.u32();
  const c = t.u32(), u = t.u32(), f = t.u32(), h = t.u32();
  if (o && (t.i32(), t.i32()), !u || !h) return;
  const p = Jn(r, n + c, u, n + f, h);
  p && e.image({ l: s, t: l, r: s + i, b: l + a }, p);
}
const kc = 2596720087, i1 = 1e5, Q = { EOF: 0, SAVEDC: 30, SETBKMODE: 258, SETMAPMODE: 259, SETPOLYFILLMODE: 262, RESTOREDC: 295, SELECTOBJECT: 301, SETTEXTALIGN: 302, DELETEOBJECT: 496, SETBKCOLOR: 513, SETTEXTCOLOR: 521, SETWINDOWORG: 523, SETWINDOWEXT: 524, SETVIEWPORTORG: 525, SETVIEWPORTEXT: 526, OFFSETWINDOWORG: 527, OFFSETVIEWPORTORG: 529, LINETO: 531, MOVETO: 532, CREATEPENINDIRECT: 762, CREATEFONTINDIRECT: 763, CREATEBRUSHINDIRECT: 764, POLYGON: 804, POLYLINE: 805, SCALEWINDOWEXT: 1040, SCALEVIEWPORTEXT: 1042, INTERSECTCLIPRECT: 1046, ELLIPSE: 1048, ARC: 2071, RECTANGLE: 1051, SETPIXEL: 1055, TEXTOUT: 1313, POLYPOLYGON: 1336, ROUNDRECT: 1564, PATBLT: 1565, PIE: 2074, CHORD: 2096, EXTTEXTOUT: 2610, DIBBITBLT: 2368, DIBSTRETCHBLT: 2881, STRETCHDIB: 3907, CREATEPALETTE: 247, CREATEBRUSH: 248, CREATEPATTERNBRUSH: 505, DIBCREATEPATTERNBRUSH: 322, CREATEREGION: 1791, CREATEBITMAP: 1790, CREATEBITMAPINDIRECT: 765 };
function Cc(e) {
  if (e.length < 20) return !1;
  const t = new DataView(e.buffer, e.byteOffset, e.byteLength);
  if (t.getUint32(0, !0) === kc) return !0;
  const r = t.getUint16(0, !0), n = t.getUint16(2, !0), o = t.getUint16(4, !0);
  return (r === 1 || r === 2) && n === 9 && (o === 256 || o === 768);
}
function a1(e, t = {}) {
  try {
    return c1(e, t);
  } catch {
    return null;
  }
}
function c1(e, t) {
  if (!Cc(e)) return null;
  const r = new DataView(e.buffer, e.byteOffset, e.byteLength);
  let n = 0, o = null, s = 1440;
  if (r.getUint32(0, !0) === kc && (o = { l: r.getInt16(6, !0), t: r.getInt16(8, !0), r: r.getInt16(10, !0), b: r.getInt16(12, !0) }, s = r.getUint16(14, !0) || 1440, n = 22), n + 18 > e.length) return null;
  n += 18, (!o || !(o.r > o.l) || !(o.b > o.t)) && (o = u1(e, r, n), s = 96);
  const l = o.r - o.l, i = o.b - o.t, a = s / 25.4, c = new Ys({ pxPerMmX: a, pxPerMmY: a });
  c.dc.mapMode = Np, c.dc.winOrg = { x: o.l, y: o.t }, c.dc.winExt = { x: l, y: i }, c.dc.vpOrg = { x: o.l, y: o.t }, c.dc.vpExt = { x: l, y: i };
  const u = t.width ?? l / s * 96, f = t.height ?? i / s * 96;
  let h = 0;
  for (; n + 6 <= e.length && h < i1; ) {
    const p = r.getUint32(n, !0), d = r.getUint16(n + 4, !0);
    if (p < 3) break;
    const m = p * 2;
    if (n + m > e.length || d === Q.EOF) break;
    f1(c, e, d, n, m), n += m, h++;
  }
  return c.render({ l: o.l, t: o.t, r: o.r, b: o.b }, u, f);
}
function u1(e, t, r) {
  let n = { x: 0, y: 0 }, o = null, s = r, l = 0;
  for (; s + 6 <= e.length && l < 2e3; ) {
    const c = t.getUint32(s, !0), u = t.getUint16(s + 4, !0);
    if (c < 3 || s + c * 2 > e.length || u === Q.EOF) break;
    u === Q.SETWINDOWORG && c >= 5 && (n = { x: t.getInt16(s + 8, !0), y: t.getInt16(s + 6, !0) }), u === Q.SETWINDOWEXT && c >= 5 && !o && (o = { x: t.getInt16(s + 8, !0), y: t.getInt16(s + 6, !0) }), s += c * 2, l++;
  }
  const i = o ? Math.abs(o.x) : 0, a = o ? Math.abs(o.y) : 0;
  return { l: n.x, t: n.y, r: n.x + (i || 1024), b: n.y + (a || 768) };
}
function f1(e, t, r, n, o) {
  const s = n + o, l = new He(t, n + 6, s);
  switch (r) {
    case Q.POLYGON:
      e.polyline(ii(l), !0);
      break;
    case Q.POLYLINE:
      e.polyline(ii(l), !1);
      break;
    case Q.POLYPOLYGON: {
      const i = l.u16();
      if (!i || i > 16384) break;
      const a = [];
      for (let u = 0; u < i; u++) a.push(l.u16());
      const c = [];
      for (const u of a) {
        const f = [];
        for (let h = 0; h < u && l.has(4); h++) f.push(l.pt16());
        c.push(f);
      }
      e.polyPoly(c, !0);
      break;
    }
    case Q.RECTANGLE:
      e.rect(Tn(l));
      break;
    case Q.ELLIPSE:
      e.ellipse(Tn(l));
      break;
    case Q.ROUNDRECT: {
      const i = l.i16(), a = l.i16();
      e.roundRect(Tn(l), a, i);
      break;
    }
    case Q.ARC:
    case Q.CHORD:
    case Q.PIE: {
      const i = l.i16(), a = l.i16(), c = l.i16(), u = l.i16(), f = Tn(l);
      e.arc(f, u, c, a, i, r === Q.CHORD ? "chord" : r === Q.PIE ? "pie" : "arc");
      break;
    }
    case Q.MOVETO: {
      const i = l.i16(), a = l.i16();
      e.moveTo(a, i);
      break;
    }
    case Q.LINETO: {
      const i = l.i16(), a = l.i16();
      e.lineTo(a, i);
      break;
    }
    case Q.SETPIXEL: {
      const i = l.color(), a = l.i16(), c = l.i16();
      e.dc.brush = { kind: "brush", style: en, color: i, hatch: 0, href: null }, e.dc.pen = { ...e.dc.pen, style: ft }, e.rect({ l: c, t: a, r: c + 1, b: a + 1 });
      break;
    }
    case Q.PATBLT: {
      l.u32();
      const i = l.i16(), a = l.i16(), c = l.i16(), u = l.i16();
      e.dc.pen = { ...e.dc.pen, style: ft }, e.rect({ l: u, t: c, r: u + a, b: c + i });
      break;
    }
    case Q.CREATEPENINDIRECT:
      e.addObj(d1(l));
      break;
    case Q.CREATEBRUSHINDIRECT:
      e.addObj(p1(l));
      break;
    case Q.CREATEFONTINDIRECT:
      e.addObj(m1(l));
      break;
    case Q.SELECTOBJECT:
      e.selectIdx(l.u16());
      break;
    case Q.DELETEOBJECT:
      e.delObj(l.u16());
      break;
    case Q.CREATEPALETTE:
    case Q.CREATEBRUSH:
    case Q.CREATEREGION:
    case Q.CREATEBITMAP:
    case Q.CREATEBITMAPINDIRECT:
      e.addObj({ kind: "brush", style: _n, color: "#000000", hatch: 0, href: null });
      break;
    case Q.CREATEPATTERNBRUSH:
    case Q.DIBCREATEPATTERNBRUSH:
      e.addObj(g1(t, n, o, r));
      break;
    case Q.SETWINDOWORG: {
      const i = l.i16(), a = l.i16();
      e.dc.winOrg = { x: a, y: i };
      break;
    }
    case Q.SETWINDOWEXT: {
      const i = l.i16(), a = l.i16();
      e.dc.winExt = { x: a, y: i };
      break;
    }
    case Q.SETVIEWPORTORG: {
      const i = l.i16(), a = l.i16();
      e.dc.vpOrg = { x: a, y: i };
      break;
    }
    case Q.SETVIEWPORTEXT: {
      const i = l.i16(), a = l.i16();
      e.dc.vpExt = { x: a, y: i };
      break;
    }
    case Q.OFFSETWINDOWORG: {
      const i = l.i16(), a = l.i16();
      e.dc.winOrg = { x: e.dc.winOrg.x + a, y: e.dc.winOrg.y + i };
      break;
    }
    case Q.OFFSETVIEWPORTORG: {
      const i = l.i16(), a = l.i16();
      e.dc.vpOrg = { x: e.dc.vpOrg.x + a, y: e.dc.vpOrg.y + i };
      break;
    }
    case Q.SCALEWINDOWEXT: {
      const i = l.i16(), a = l.i16(), c = l.i16(), u = l.i16();
      c && (e.dc.winExt.x = e.dc.winExt.x * u / c), i && (e.dc.winExt.y = e.dc.winExt.y * a / i);
      break;
    }
    case Q.SCALEVIEWPORTEXT: {
      const i = l.i16(), a = l.i16(), c = l.i16(), u = l.i16();
      c && (e.dc.vpExt.x = e.dc.vpExt.x * u / c), i && (e.dc.vpExt.y = e.dc.vpExt.y * a / i);
      break;
    }
    case Q.SETMAPMODE:
      e.dc.mapMode = l.u16();
      break;
    case Q.SAVEDC:
      e.save();
      break;
    case Q.RESTOREDC:
      e.restore(l.i16());
      break;
    case Q.SETBKMODE:
      e.dc.bkMode = l.u16();
      break;
    case Q.SETBKCOLOR:
      e.dc.bkColor = l.color();
      break;
    case Q.SETTEXTCOLOR:
      e.dc.textColor = l.color();
      break;
    case Q.SETTEXTALIGN:
      e.dc.textAlign = l.u16();
      break;
    case Q.SETPOLYFILLMODE:
      e.dc.polyFill = l.u16();
      break;
    case Q.INTERSECTCLIPRECT:
      e.intersectClip(Tn(l));
      break;
    case Q.TEXTOUT: {
      const i = l.u16();
      if (i > 32768) break;
      const a = l.p, c = i + (i & 1);
      l.skip(c);
      const u = l.i16(), f = l.i16(), h = hs(t.subarray(a, Math.min(a + i, s)), e.dc.font.charset);
      e.text(f, u, h, null, null);
      break;
    }
    case Q.EXTTEXTOUT: {
      const i = l.i16(), a = l.i16(), c = l.u16(), u = l.u16();
      if (c > 32768) break;
      let f = null;
      if (u & 6) {
        const $ = l.i16(), x = l.i16(), b = l.i16(), M = l.i16();
        f = { l: $, t: x, r: b, b: M };
      }
      const h = l.p, p = c + (c & 1);
      l.skip(p);
      let d = null;
      if (l.left >= c * 2 && c > 0) {
        d = [];
        for (let $ = 0; $ < c; $++) d.push(l.i16());
      }
      const m = hs(t.subarray(h, Math.min(h + c, s)), e.dc.font.charset);
      e.text(a, i, m, d, u & 2 ? f : null);
      break;
    }
    case Q.STRETCHDIB: {
      l.u32(), l.u16(), l.i16(), l.i16(), l.i16(), l.i16();
      const i = l.i16(), a = l.i16(), c = l.i16(), u = l.i16();
      Io(e, t, l.p, s, u, c, a, i);
      break;
    }
    case Q.DIBSTRETCHBLT: {
      const i = o === 28;
      if (l.u32(), l.i16(), l.i16(), l.i16(), l.i16(), i) break;
      const a = l.i16(), c = l.i16(), u = l.i16(), f = l.i16();
      Io(e, t, l.p, s, f, u, c, a);
      break;
    }
    case Q.DIBBITBLT: {
      const i = o === 24;
      if (l.u32(), l.i16(), l.i16(), i) break;
      const a = l.i16(), c = l.i16(), u = l.i16(), f = l.i16();
      Io(e, t, l.p, s, f, u, c, a);
      break;
    }
  }
}
function Io(e, t, r, n, o, s, l, i) {
  if (r >= n || l === 0 || i === 0) return;
  const a = vc(t, r);
  if (!a) return;
  const c = Jn(t, r, a, r + a, n - r - a);
  c && e.image({ l: o, t: s, r: o + l, b: s + i }, c);
}
const h1 = 1 << 18;
function ii(e) {
  const t = e.u16();
  if (!t || t > h1) return [];
  const r = Math.min(t, e.left >> 2), n = [];
  for (let o = 0; o < r; o++) n.push(e.pt16());
  return n;
}
function Tn(e) {
  const t = e.i16(), r = e.i16(), n = e.i16();
  return { l: e.i16(), t: n, r, b: t };
}
function d1(e) {
  const t = e.u16(), r = e.i16();
  return e.i16(), { kind: "pen", style: t & 15, width: Math.abs(r) || 1, color: e.color(), cap: t & 3840, join: t & 61440 };
}
function p1(e) {
  const t = e.u16(), r = e.color(), n = e.u16();
  return { kind: "brush", style: t, color: r, hatch: n, href: null };
}
function m1(e) {
  const t = e.i16();
  e.i16();
  const r = e.i16();
  e.i16();
  const n = e.i16(), o = e.u8() !== 0, s = e.u8() !== 0, l = e.u8() !== 0, i = e.u8();
  e.skip(4);
  const a = e.ansi(Math.min(32, e.left)), c = qn();
  return { kind: "font", height: t || c.height, escapement: r, weight: n > 0 ? n : 400, italic: o, underline: s, strike: l, charset: i, face: a || c.face };
}
function g1(e, t, r, n) {
  const o = { kind: "brush", style: en, color: "#808080", hatch: 0, href: null };
  if (n !== Q.DIBCREATEPATTERNBRUSH) return o;
  const s = t + 6 + 4, l = t + r, i = vc(e, s);
  if (!i || s + i >= l) return o;
  const a = Jn(e, s, i, s + i, l - s - i);
  return a ? { kind: "brush", style: 5, color: "#808080", hatch: 0, href: a } : o;
}
const ai = 2e5, ci = 0, $1 = 1, b1 = 2, x1 = 3, No = 4, w1 = { 0: 0, 2: 8, 3: 2, 4: 2, 5: 2, 6: 4, 7: 4, 8: 2, 9: 8, 10: 8, 11: 4, 12: 4, 13: 2, 14: 4, 15: 4, 16: 8, 21: 2, 22: 2, 23: 0, 24: 0, 25: 0, 26: 6, 27: 6, 28: 0, 29: 6, 30: 0, 31: 6, 35: 2, 45: 6, 46: 0, 47: 0, 61: 0, 62: 0, 63: 0, 77: 0, 78: 0, 79: 0, 93: 0, 94: 0, 95: 0, 109: 12, 110: 12, 111: 12, 125: 0, 126: 0, 127: 0, 141: 0, 142: 0, 143: 0 };
function y1(e) {
  return Ec(e) !== null;
}
function Ec(e) {
  if (!e || e.length < 16) return null;
  for (const t of [512, 0]) {
    if (t + 12 > e.length) continue;
    const r = new DataView(e.buffer, e.byteOffset + t, e.length - t), n = r.getInt16(2, !1), o = r.getInt16(4, !1), s = r.getInt16(6, !1), l = r.getInt16(8, !1);
    if (!(l > o) || !(s > n)) continue;
    const i = r.getUint16(10, !1);
    if (i === 17 && r.getUint16(12, !1) === 767) return { off: t + 14, v2: !0, bounds: { l: o, t: n, r: l, b: s } };
    if (i >> 8 === 17 && (i & 255) === 1) return { off: t + 12, v2: !1, bounds: { l: o, t: n, r: l, b: s } };
  }
  return null;
}
function v1(e, t = {}) {
  try {
    return k1(e, t);
  } catch {
    return null;
  }
}
function M1() {
  return { fg: "#000000", bg: "#ffffff", penW: 1, penH: 1, penSolid: !0, fillSolid: !0, fillColor: "#000000", txFont: 0, txSize: 12, txFace: 0, ovalW: 0, ovalH: 0, origin: { x: 0, y: 0 } };
}
function k1(e, t) {
  const r = Ec(e);
  if (!r) return null;
  const { bounds: n, v2: o } = r, s = n.r - n.l, l = n.b - n.t, i = new Ys({ pxPerMmX: 72 / 25.4, pxPerMmY: 72 / 25.4 }), a = new He(e, r.off, e.length), c = M1(), u = () => ({ kind: "pen", style: c.penSolid && c.penW > 0 ? xc : ft, width: Math.max(c.penW, c.penH), color: c.fg, cap: 0, join: 0 }), f = (P, L) => ({ kind: "brush", style: L ? en : _n, color: P, hatch: 0, href: null }), h = (P) => {
    switch (P) {
      case ci:
        return i.select(u()), i.select(f("#000000", !1)), !0;
      case $1:
      case No:
        return i.select({ ...u(), style: ft }), i.select(f(P === No ? c.fillColor : c.fg, P === No ? c.fillSolid : c.penSolid)), !0;
      case b1:
        return i.select({ ...u(), style: ft }), i.select(f(c.bg, !0)), !0;
      case x1:
        return i.select({ ...u(), style: ft }), i.select(f(c.fg, !0)), !0;
      default:
        return !1;
    }
  }, p = () => {
    const P = a.i16be(), L = a.i16be(), A = a.i16be(), z = a.i16be();
    return { l: L, t: P, r: z, b: A };
  }, d = () => {
    const P = a.i16be();
    return { x: a.i16be(), y: P };
  }, m = () => {
    const P = a.u16be(), L = a.u16be(), A = a.u16be();
    return us(P >> 8, L >> 8, A >> 8);
  }, $ = () => {
    const P = a.u16be();
    if (P < 10) return a.skip(Math.max(0, P - 2)), null;
    const L = p();
    return a.skip(P - 10), L;
  };
  let x = { l: 0, t: 0, r: 0, b: 0 }, b = { l: 0, t: 0, r: 0, b: 0 }, M = { l: 0, t: 0, r: 0, b: 0 }, E = [], y = null, v = { x: 0, y: 0 }, k = !1;
  const T = (P, L) => {
    if (h(L)) {
      switch (P) {
        case "rect":
          i.rect(x);
          break;
        case "rrect":
          i.roundRect(M, c.ovalW, c.ovalH);
          break;
        case "oval":
          i.ellipse(b);
          break;
        case "poly":
          E.length > 1 && i.polyline(E, !0);
          break;
        case "arc": {
          if (!y) return;
          const { rect: A, start: z, ext: R } = y, O = (A.l + A.r) / 2, U = (A.t + A.b) / 2, j = (A.r - A.l) / 2, W = (A.b - A.t) / 2, X = (Y) => {
            const J = (90 - Y) * Math.PI / 180;
            return { x: O + j * Math.cos(J), y: U - W * Math.sin(J) };
          }, B = X(z), Z = X(z + R);
          i.arc(A, B.x, B.y, Z.x, Z.y, L === ci ? "arc" : "pie");
          break;
        }
      }
      k = !0;
    }
  }, S = (P, L, A) => {
    if (!A) return;
    const z = { ...qn(), height: -Math.max(c.txSize, 1), weight: c.txFace & 1 ? 700 : 400, italic: !!(c.txFace & 2) };
    i.select(z), i.dc.textAlign = 24, i.dc.textColor = c.fg, i.text(P, L, A, null, null), k = !0;
  };
  let N = 0;
  for (; a.has(o ? 2 : 1) && N++ < ai && (o && (a.pos - r.off) % 2 === 1 && a.skip(1), !!a.has(o ? 2 : 1)); ) {
    const P = o ? a.u16be() : a.u8();
    if (P === 255) break;
    switch (P) {
      case 1: {
        const L = $();
        L && i.intersectClip(L);
        break;
      }
      case 7: {
        const L = d();
        c.penW = Math.abs(L.x), c.penH = Math.abs(L.y);
        break;
      }
      case 9:
      case 10: {
        const L = [a.u8(), a.u8(), a.u8(), a.u8(), a.u8(), a.u8(), a.u8(), a.u8()].some((A) => A !== 0);
        P === 9 ? c.penSolid = L : (c.fillSolid = L, c.fillColor = c.fg);
        break;
      }
      case 11: {
        const L = d();
        c.ovalW = Math.abs(L.x), c.ovalH = Math.abs(L.y);
        break;
      }
      case 12: {
        const L = d();
        c.origin = L;
        break;
      }
      case 13:
        c.txSize = a.u16be();
        break;
      case 3:
        c.txFont = a.u16be();
        break;
      case 4:
        c.txFace = a.u8(), a.skip(1);
        break;
      case 14:
      case 15: {
        const L = a.u32be(), A = L === 0 ? "#000000" : L === 30 ? "#ffffff" : us(L >> 16 & 255, L >> 8 & 255, L & 255);
        P === 14 ? c.fg = A : c.bg = A;
        break;
      }
      case 26:
        c.fg = m();
        break;
      case 27:
        c.bg = m();
        break;
      case 32: {
        const L = d(), A = d();
        i.select(u()), i.moveTo(L.x, L.y), i.lineTo(A.x, A.y), v = A, k = !0;
        break;
      }
      case 33: {
        const L = d();
        i.select(u()), i.moveTo(v.x, v.y), i.lineTo(L.x, L.y), v = L, k = !0;
        break;
      }
      case 34: {
        const L = d(), A = a.i8(), z = a.i8();
        i.select(u()), i.moveTo(L.x, L.y), i.lineTo(L.x + A, L.y + z), v = { x: L.x + A, y: L.y + z }, k = !0;
        break;
      }
      case 35: {
        const L = a.i8(), A = a.i8();
        i.select(u()), i.moveTo(v.x, v.y), i.lineTo(v.x + L, v.y + A), v = { x: v.x + L, y: v.y + A }, k = !0;
        break;
      }
      case 40: {
        const L = d();
        S(L.x, L.y, a.ansi(a.u8())), v = L;
        break;
      }
      case 41: {
        const L = a.u8(), A = a.ansi(a.u8());
        v = { x: v.x + L, y: v.y }, S(v.x, v.y, A);
        break;
      }
      case 42: {
        const L = a.u8(), A = a.ansi(a.u8());
        v = { x: v.x, y: v.y + L }, S(v.x, v.y, A);
        break;
      }
      case 43: {
        const L = a.u8(), A = a.u8(), z = a.ansi(a.u8());
        v = { x: v.x + L, y: v.y + A }, S(v.x, v.y, z);
        break;
      }
      case 44: {
        const L = a.u16be();
        a.skip(Math.max(0, L));
        break;
      }
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
        x = p(), T("rect", P & 7);
        break;
      case 56:
      case 57:
      case 58:
      case 59:
      case 60:
        T("rect", P & 7);
        break;
      case 64:
      case 65:
      case 66:
      case 67:
      case 68:
        M = p(), T("rrect", P & 7);
        break;
      case 72:
      case 73:
      case 74:
      case 75:
      case 76:
        T("rrect", P & 7);
        break;
      case 80:
      case 81:
      case 82:
      case 83:
      case 84:
        b = p(), T("oval", P & 7);
        break;
      case 88:
      case 89:
      case 90:
      case 91:
      case 92:
        T("oval", P & 7);
        break;
      case 96:
      case 97:
      case 98:
      case 99:
      case 100: {
        const L = p(), A = a.i16be(), z = a.i16be();
        y = { rect: L, start: A, ext: z }, T("arc", P & 7);
        break;
      }
      case 104:
      case 105:
      case 106:
      case 107:
      case 108: {
        const L = a.i16be(), A = a.i16be();
        y && (y = { rect: y.rect, start: L, ext: A }), T("arc", P & 7);
        break;
      }
      case 112:
      case 113:
      case 114:
      case 115:
      case 116: {
        const L = a.u16be(), A = a.pos + L - 2;
        p();
        const z = [];
        for (; a.pos + 4 <= A; ) z.push(d());
        a.seek(A), E = z, T("poly", P & 7);
        break;
      }
      case 120:
      case 121:
      case 122:
      case 123:
      case 124:
        T("poly", P & 7);
        break;
      case 128:
      case 129:
      case 130:
      case 131:
      case 132: {
        const L = $();
        L && (x = L, T("rect", P & 7));
        break;
      }
      case 136:
      case 137:
      case 138:
      case 139:
      case 140:
        T("rect", P & 7);
        break;
      case 144:
      case 145:
      case 152:
      case 153:
      case 154:
      case 155: {
        if (!S1(a, P, i)) return null;
        k = !0;
        break;
      }
      case 160:
        a.skip(2);
        break;
      case 161: {
        a.skip(2);
        const L = a.u16be();
        a.skip(L);
        break;
      }
      case 3072:
        a.skip(24);
        break;
      case 33280:
      case 33281: {
        const L = a.u32be(), A = a.pos + L, z = E1(a, A);
        z && (i.image(n, z), k = !0), a.seek(Math.min(A, e.length));
        break;
      }
      default: {
        const L = w1[P];
        if (L !== void 0) {
          a.skip(L);
          break;
        }
        const A = C1(P, a);
        if (A < 0) {
          N = ai;
          break;
        }
        a.skip(A);
      }
    }
  }
  return k ? i.render(n, t.width ?? s, t.height ?? l) : null;
}
function C1(e, t) {
  return e >= 256 && e <= 32767 ? (e >> 8 & 255) * 2 : e >= 32768 && e <= 33023 ? 0 : e >= 33024 && t.has(4) ? t.u32be() : -1;
}
function E1(e, t) {
  const r = e.pos, n = e.take(Math.max(0, Math.min(t, e.limit) - r));
  e.seek(r);
  for (let o = 0; o + 3 < n.length; o++) {
    if (n[o] === 255 && n[o + 1] === 216 && n[o + 2] === 255) return `data:image/jpeg;base64,${Yn(n.subarray(o))}`;
    if (n[o] === 137 && n[o + 1] === 80 && n[o + 2] === 78 && n[o + 3] === 71) return `data:image/png;base64,${Yn(n.subarray(o))}`;
  }
  return null;
}
function S1(e, t, r) {
  const n = t === 154 || t === 155, o = t === 145 || t === 153 || t === 155;
  n && e.skip(4);
  const s = e.u16be() & 32767, l = e.i16be(), i = e.i16be(), a = e.i16be(), c = e.i16be() - i, u = a - l;
  if (c <= 0 || u <= 0 || c > 2e4 || u > 2e4) return !1;
  const f = s >= 8;
  let h = 1, p = 1, d = [];
  if (n || (s & 32768) !== 0 || t === 152 || t === 153) {
    if (e.skip(2), e.u16be(), e.skip(4), e.skip(8), e.skip(2), h = e.u16be(), p = e.u16be(), e.u16be(), e.skip(4), e.skip(8), !n) {
      e.skip(4), e.skip(2);
      const y = e.u16be() + 1;
      if (y > 0 && y <= 256) {
        d = new Array(y);
        for (let v = 0; v < y; v++) e.skip(2), d[v] = [e.u16be() >> 8, e.u16be() >> 8, e.u16be() >> 8];
      }
    }
  } else h = 1;
  e.i16be(), e.i16be(), e.i16be(), e.i16be();
  const m = { t: e.i16be(), l: e.i16be(), b: e.i16be(), r: e.i16be() };
  if (e.skip(2), o) {
    const y = e.u16be();
    e.skip(Math.max(0, y - 2));
  }
  const $ = s;
  if ($ * u > 64 * 1024 * 1024) return !1;
  const x = new Uint8Array($ * u).fill(255);
  let b = 0;
  for (let y = 0; y < u; y++) {
    if (!f) {
      if (!e.has($)) break;
      x.set(e.take($), y * $), b++;
      continue;
    }
    const v = s > 250 ? e.u16be() : e.u8();
    if (v <= 0 || !e.has(v)) break;
    L1(e.take(v), x, y * $, $), b++;
  }
  if (!b) return !1;
  const M = new Uint8Array(c * u * 4);
  for (let y = 0; y < u; y++) for (let v = 0; v < c; v++) {
    let k = 0, T = 0, S = 0;
    if (n && h === 32) {
      const P = y * $, L = p === 3 ? 0 : c;
      k = x[P + L + v], T = x[P + L + c + v], S = x[P + L + c * 2 + v];
    } else if (n && h === 16) {
      const P = x[y * $ + v * 2] << 8 | x[y * $ + v * 2 + 1];
      k = (P >> 10 & 31) * 8, T = (P >> 5 & 31) * 8, S = (P & 31) * 8;
    } else if (h === 8) {
      const P = x[y * $ + v];
      [k, T, S] = d[P] ?? [P, P, P];
    } else if (h === 4) {
      const P = x[y * $ + (v >> 1)], L = v & 1 ? P & 15 : P >> 4;
      [k, T, S] = d[L] ?? [0, 0, 0];
    } else {
      const P = x[y * $ + (v >> 3)] >> 7 - (v & 7) & 1;
      [k, T, S] = d[P] ?? (P ? [0, 0, 0] : [255, 255, 255]);
    }
    const N = (y * c + v) * 4;
    M[N] = k, M[N + 1] = T, M[N + 2] = S, M[N + 3] = 255;
  }
  const E = `data:image/png;base64,${Yn(yc(M, c, u))}`;
  return r.image({ l: m.l, t: m.t, r: m.r, b: m.b }, E), !0;
}
function L1(e, t, r, n) {
  let o = 0, s = r;
  const l = r + n;
  for (; o < e.length && s < l; ) {
    const i = e[o++] << 24 >> 24;
    if (i >= 0) {
      const a = Math.min(i + 1, l - s, e.length - o);
      t.set(e.subarray(o, o + a), s), o += a, s += a;
    } else {
      if (o >= e.length) break;
      const a = Math.min(1 - i, l - s);
      t.fill(e[o++], s, s + a), s += a;
    }
  }
}
function T1(e) {
  return !e || e.length < 20 ? null : Mc(e) ? "emf" : Cc(e) ? "wmf" : y1(e) ? "pict" : null;
}
function P1(e, t) {
  try {
    const r = T1(e);
    return r === "emf" ? Zp(e, t) : r === "wmf" ? a1(e, t) : r === "pict" ? v1(e, t) : null;
  } catch {
    return null;
  }
}
const ar = 4294967294, cr = 4294967295;
class Sc {
  constructor(t) {
    if (this.fat = [], this.miniFat = [], this.dir = [], this.miniStream = new Uint8Array(0), t.length < 512 || t[0] !== 208 || t[1] !== 207) throw new Error("不是有效的 CFB 复合文档");
    this.bytes = t, this.view = new DataView(t.buffer, t.byteOffset, t.byteLength), this.sectorSize = 1 << this.view.getUint16(30, !0), this.miniSectorSize = 1 << this.view.getUint16(32, !0), this.miniCutoff = this.view.getUint32(56, !0), this.readFat(), this.readDirectory(), this.readMiniFat();
  }
  offsetOf(t) {
    return (t + 1) * this.sectorSize;
  }
  readFat() {
    const t = [];
    for (let s = 0; s < 109; s++) t.push(this.view.getUint32(76 + s * 4, !0));
    let r = this.view.getUint32(68, !0);
    const n = this.sectorSize / 4;
    let o = 0;
    for (; r !== ar && r !== cr && o++ < 1e5; ) {
      const s = this.offsetOf(r);
      if (s + this.sectorSize > this.bytes.length) break;
      for (let l = 0; l < n - 1; l++) t.push(this.view.getUint32(s + l * 4, !0));
      r = this.view.getUint32(s + (n - 1) * 4, !0);
    }
    for (const s of t) {
      if (s === cr || s === ar) continue;
      const l = this.offsetOf(s);
      if (!(l + this.sectorSize > this.bytes.length)) for (let i = 0; i < n; i++) this.fat.push(this.view.getUint32(l + i * 4, !0));
    }
  }
  chain(t, r) {
    const n = [];
    let o = t, s = 0;
    for (; o !== ar && o !== cr && o >= 0 && o < r.length && s++ < 1e6; ) n.push(o), o = r[o];
    return n;
  }
  readChain(t, r) {
    const n = this.chain(t, this.fat), o = new Uint8Array(n.length * this.sectorSize);
    return n.forEach((s, l) => {
      const i = this.offsetOf(s);
      o.set(this.bytes.subarray(i, Math.min(i + this.sectorSize, this.bytes.length)), l * this.sectorSize);
    }), o.subarray(0, r);
  }
  readDirectory() {
    const t = this.view.getUint32(48, !0), r = this.chain(t, this.fat), n = this.readChain(t, r.length * this.sectorSize), o = new DataView(n.buffer, n.byteOffset, n.byteLength);
    for (let s = 0; s + 128 <= n.length; s += 128) {
      const l = o.getUint16(s + 64, !0);
      if (l === 0 || l > 64) continue;
      let i = "";
      for (let a = 0; a < l - 2; a += 2) i += String.fromCharCode(o.getUint16(s + a, !0));
      this.dir.push({ name: i, type: o.getUint8(s + 66), start: o.getUint32(s + 116, !0), size: o.getUint32(s + 120, !0) });
    }
  }
  readMiniFat() {
    const t = this.view.getUint32(60, !0);
    if (t !== ar && t !== cr) {
      const n = this.chain(t, this.fat), o = this.readChain(t, n.length * this.sectorSize), s = new DataView(o.buffer, o.byteOffset, o.byteLength);
      for (let l = 0; l + 4 <= o.length; l += 4) this.miniFat.push(s.getUint32(l, !0));
    }
    const r = this.dir.find((n) => n.type === 5);
    r && (this.miniStream = this.readChain(r.start, r.size));
  }
  streamNames() {
    return this.dir.filter((t) => t.type === 2).map((t) => t.name);
  }
  stream(t) {
    const r = this.dir.find((s) => s.type === 2 && s.name.toLowerCase() === t.toLowerCase());
    if (!r) return null;
    if (r.size >= this.miniCutoff) return this.readChain(r.start, r.size);
    const n = this.chain(r.start, this.miniFat), o = new Uint8Array(n.length * this.miniSectorSize);
    return n.forEach((s, l) => {
      o.set(this.miniStream.subarray(s * this.miniSectorSize, (s + 1) * this.miniSectorSize), l * this.miniSectorSize);
    }), o.subarray(0, r.size);
  }
}
let Gs = null, Lc = null;
function A1(e) {
  Lc = e;
}
function I1() {
  return Lc;
}
function N1(e) {
  Gs = e;
}
function O$() {
  return Gs !== null;
}
function R1() {
  return Gs;
}
function Ro(e, t) {
  return (e << t | e >>> 32 - t) >>> 0;
}
function Zs(e, t, r) {
  const n = e.length * 8, o = Math.ceil((e.length + 1 + r) / t) * t, s = new Uint8Array(o);
  s.set(e), s[e.length] = 128;
  const l = new DataView(s.buffer);
  return l.setUint32(o - 4, n >>> 0, !1), l.setUint32(o - 8, Math.floor(n / 4294967296), !1), s;
}
function wt(e) {
  const t = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], r = Zs(e, 64, 8), n = new Uint32Array(80), o = new DataView(r.buffer);
  for (let i = 0; i < r.length; i += 64) {
    for (let p = 0; p < 16; p++) n[p] = o.getUint32(i + p * 4, !1);
    for (let p = 16; p < 80; p++) n[p] = Ro(n[p - 3] ^ n[p - 8] ^ n[p - 14] ^ n[p - 16], 1);
    let [a, c, u, f, h] = t;
    for (let p = 0; p < 80; p++) {
      let d, m;
      p < 20 ? (d = c & u | ~c & f, m = 1518500249) : p < 40 ? (d = c ^ u ^ f, m = 1859775393) : p < 60 ? (d = c & u | c & f | u & f, m = 2400959708) : (d = c ^ u ^ f, m = 3395469782);
      const $ = Ro(a, 5) + d + h + m + n[p] >>> 0;
      h = f, f = u, u = Ro(c, 30), c = a, a = $;
    }
    t[0] = t[0] + a >>> 0, t[1] = t[1] + c >>> 0, t[2] = t[2] + u >>> 0, t[3] = t[3] + f >>> 0, t[4] = t[4] + h >>> 0;
  }
  const s = new Uint8Array(20), l = new DataView(s.buffer);
  for (let i = 0; i < 5; i++) l.setUint32(i * 4, t[i], !1);
  return s;
}
const z1 = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]);
function O1(e) {
  const t = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]), r = Zs(e, 64, 8), n = new DataView(r.buffer), o = new Uint32Array(64), s = (a, c) => a >>> c | a << 32 - c;
  for (let a = 0; a < r.length; a += 64) {
    for (let b = 0; b < 16; b++) o[b] = n.getUint32(a + b * 4, !1);
    for (let b = 16; b < 64; b++) {
      const M = s(o[b - 15], 7) ^ s(o[b - 15], 18) ^ o[b - 15] >>> 3, E = s(o[b - 2], 17) ^ s(o[b - 2], 19) ^ o[b - 2] >>> 10;
      o[b] = o[b - 16] + M + o[b - 7] + E >>> 0;
    }
    let [c, u, f, h, p, d, m, $] = t;
    for (let b = 0; b < 64; b++) {
      const M = s(p, 6) ^ s(p, 11) ^ s(p, 25), E = p & d ^ ~p & m, y = $ + M + E + z1[b] + o[b] >>> 0, v = s(c, 2) ^ s(c, 13) ^ s(c, 22), k = c & u ^ c & f ^ u & f, T = v + k >>> 0;
      $ = m, m = d, d = p, p = h + y >>> 0, h = f, f = u, u = c, c = y + T >>> 0;
    }
    const x = [c, u, f, h, p, d, m, $];
    for (let b = 0; b < 8; b++) t[b] = t[b] + x[b] >>> 0;
  }
  const l = new Uint8Array(32), i = new DataView(l.buffer);
  for (let a = 0; a < 8; a++) i.setUint32(a * 4, t[a], !1);
  return l;
}
const j1 = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298, 3391569614, 3515267271, 3940187606, 4118630271, 116418474, 174292421, 289380356, 460393269, 685471733, 852142971, 1017036298, 1126000580, 1288033470, 1501505948, 1607167915, 1816402316]), F1 = new Uint32Array([3609767458, 602891725, 3964484399, 2173295548, 4081628472, 3053834265, 2937671579, 3664609560, 2734883394, 1164996542, 1323610764, 3590304994, 4068182383, 991336113, 633803317, 3479774868, 2666613458, 944711139, 2341262773, 2007800933, 1495990901, 1856431235, 3175218132, 2198950837, 3999719339, 766784016, 2566594879, 3203337956, 1034457026, 2466948901, 3758326383, 168717936, 1188179964, 1546045734, 1522805485, 2643833823, 2343527390, 1014477480, 1206759142, 344077627, 1290863460, 3158454273, 3505952657, 106217008, 3606008344, 1432725776, 1467031594, 851169720, 3100823752, 1363258195, 3750685593, 3785050280, 3318307427, 3812723403, 2003034995, 3602036899, 1575990012, 1125592928, 2716904306, 442776044, 593698344, 3733110249, 2999351573, 3815920427, 3928383900, 566280711, 3454069534, 4000239992, 1914138554, 2731055270, 3203993006, 320620315, 587496836, 1086792851, 365543100, 2618297676, 3409855158, 4234509866, 987167468, 1246189591]), U1 = [1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209], D1 = [3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428];
function Tc(e, t, r) {
  const n = new Uint32Array(8), o = new Uint32Array(8);
  for (let m = 0; m < 8; m++) n[m] = t[m * 2], o[m] = t[m * 2 + 1];
  const s = Zs(e, 128, 16), l = new DataView(s.buffer), i = new Uint32Array(80), a = new Uint32Array(80);
  let c = 0, u = 0;
  const f = (m, $, x) => {
    if (x < 32) c = m >>> x | $ << 32 - x, u = $ >>> x | m << 32 - x;
    else if (x === 32) c = $, u = m;
    else {
      const b = x - 32;
      c = $ >>> b | m << 32 - b, u = m >>> b | $ << 32 - b;
    }
  }, h = (m, $, x) => {
    x < 32 ? (c = m >>> x, u = $ >>> x | m << 32 - x) : (c = 0, u = m >>> x - 32);
  };
  for (let m = 0; m < s.length; m += 128) {
    for (let j = 0; j < 16; j++) i[j] = l.getUint32(m + j * 8, !1), a[j] = l.getUint32(m + j * 8 + 4, !1);
    for (let j = 16; j < 80; j++) {
      f(i[j - 15], a[j - 15], 1);
      let W = c, X = u;
      f(i[j - 15], a[j - 15], 8), W ^= c, X ^= u, h(i[j - 15], a[j - 15], 7), W ^= c, X ^= u, f(i[j - 2], a[j - 2], 19);
      let B = c, Z = u;
      f(i[j - 2], a[j - 2], 61), B ^= c, Z ^= u, h(i[j - 2], a[j - 2], 6), B ^= c, Z ^= u;
      const Y = (a[j - 16] >>> 0) + (X >>> 0) + (a[j - 7] >>> 0) + (Z >>> 0);
      a[j] = Y >>> 0, i[j] = i[j - 16] + W + i[j - 7] + B + Math.floor(Y / 4294967296) >>> 0;
    }
    let $ = n[0], x = o[0], b = n[1], M = o[1], E = n[2], y = o[2], v = n[3], k = o[3], T = n[4], S = o[4], N = n[5], P = o[5], L = n[6], A = o[6], z = n[7], R = o[7];
    for (let j = 0; j < 80; j++) {
      f(T, S, 14);
      let W = c, X = u;
      f(T, S, 18), W ^= c, X ^= u, f(T, S, 41), W ^= c, X ^= u;
      const B = T & N ^ ~T & L, Z = S & P ^ ~S & A;
      let Y = (R >>> 0) + (X >>> 0) + (Z >>> 0) + F1[j] + (a[j] >>> 0);
      const J = Y >>> 0, G = z + W + B + j1[j] + i[j] + Math.floor(Y / 4294967296) >>> 0;
      f($, x, 28);
      let le = c, he = u;
      f($, x, 34), le ^= c, he ^= u, f($, x, 39), le ^= c, he ^= u;
      const me = $ & b ^ $ & E ^ b & E, ge = x & M ^ x & y ^ M & y;
      Y = (he >>> 0) + (ge >>> 0);
      const $t = Y >>> 0, Wt = le + me + Math.floor(Y / 4294967296) >>> 0;
      z = L, R = A, L = N, A = P, N = T, P = S, Y = (k >>> 0) + (J >>> 0), S = Y >>> 0, T = v + G + Math.floor(Y / 4294967296) >>> 0, v = E, k = y, E = b, y = M, b = $, M = x, Y = (J >>> 0) + ($t >>> 0), x = Y >>> 0, $ = G + Wt + Math.floor(Y / 4294967296) >>> 0;
    }
    const O = [$, b, E, v, T, N, L, z], U = [x, M, y, k, S, P, A, R];
    for (let j = 0; j < 8; j++) {
      const W = (o[j] >>> 0) + (U[j] >>> 0);
      o[j] = W >>> 0, n[j] = n[j] + O[j] + Math.floor(W / 4294967296) >>> 0;
    }
  }
  const p = new Uint8Array(64), d = new DataView(p.buffer);
  for (let m = 0; m < 8; m++) d.setUint32(m * 8, n[m], !1), d.setUint32(m * 8 + 4, o[m], !1);
  return p.subarray(0, r);
}
const B1 = (e) => Tc(e, U1, 64), H1 = (e) => Tc(e, D1, 48);
function ui(e) {
  switch (e.toUpperCase().replace(/[-_]/g, "")) {
    case "SHA1":
      return wt;
    case "SHA256":
      return O1;
    case "SHA384":
      return H1;
    case "SHA512":
      return B1;
    default:
      return null;
  }
}
const Gt = new Uint8Array(256), Pc = new Uint8Array(256), W1 = new Uint8Array([1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77]);
(function() {
  const e = new Uint8Array(256), t = new Uint8Array(256);
  let r = 1;
  for (let n = 0; n < 256; n++) e[n] = r, t[r] = n, r ^= r << 1 ^ (r & 128 ? 283 : 0), r &= 255;
  for (let n = 0; n < 256; n++) {
    let o = n ? e[255 - t[n]] : 0, s = o;
    for (let l = 0; l < 4; l++) o = (o << 1 | o >>> 7) & 255, s ^= o;
    Gt[n] = s ^ 99;
  }
  for (let n = 0; n < 256; n++) Pc[Gt[n]] = n;
})();
function V1(e) {
  return (e << 1 ^ (e & 128 ? 27 : 0)) & 255;
}
function Ie(e, t) {
  let r = 0;
  for (; t; ) t & 1 && (r ^= e), e = V1(e), t >>= 1;
  return r & 255;
}
function Ac(e) {
  const t = e.length / 4, r = t + 6, n = [];
  for (let s = 0; s < t; s++) n.push([e[s * 4], e[s * 4 + 1], e[s * 4 + 2], e[s * 4 + 3]]);
  for (let s = t; s < 4 * (r + 1); s++) {
    let l = n[s - 1].slice();
    s % t === 0 ? l = [Gt[l[1]] ^ W1[s / t - 1], Gt[l[2]], Gt[l[3]], Gt[l[0]]] : t > 6 && s % t === 4 && (l = l.map((i) => Gt[i])), n.push(l.map((i, a) => i ^ n[s - t][a]));
  }
  const o = [];
  for (let s = 0; s <= r; s++) {
    const l = new Uint8Array(16);
    for (let i = 0; i < 4; i++) for (let a = 0; a < 4; a++) l[i * 4 + a] = n[s * 4 + i][a];
    o.push(l);
  }
  return o;
}
function Ic(e, t, r, n, o) {
  const s = new Uint8Array(16);
  for (let l = 0; l < 16; l++) s[l] = t[r + l] ^ e[e.length - 1][l];
  for (let l = e.length - 2; l >= 0; l--) {
    const i = s.slice();
    for (let a = 0; a < 4; a++) for (let c = 0; c < 4; c++) s[(a + c) % 4 * 4 + c] = i[a * 4 + c];
    for (let a = 0; a < 16; a++) s[a] = Pc[s[a]];
    for (let a = 0; a < 16; a++) s[a] ^= e[l][a];
    if (l > 0) for (let a = 0; a < 4; a++) {
      const c = s[a * 4], u = s[a * 4 + 1], f = s[a * 4 + 2], h = s[a * 4 + 3];
      s[a * 4] = Ie(c, 14) ^ Ie(u, 11) ^ Ie(f, 13) ^ Ie(h, 9), s[a * 4 + 1] = Ie(c, 9) ^ Ie(u, 14) ^ Ie(f, 11) ^ Ie(h, 13), s[a * 4 + 2] = Ie(c, 13) ^ Ie(u, 9) ^ Ie(f, 14) ^ Ie(h, 11), s[a * 4 + 3] = Ie(c, 11) ^ Ie(u, 13) ^ Ie(f, 9) ^ Ie(h, 14);
    }
  }
  n.set(s, o);
}
function zo(e, t) {
  const r = Ac(e), n = new Uint8Array(t.length - t.length % 16);
  for (let o = 0; o + 16 <= t.length; o += 16) Ic(r, t, o, n, o);
  return n;
}
function ur(e, t, r) {
  const n = Ac(e), o = r.length - r.length % 16, s = new Uint8Array(o);
  let l = t.subarray(0, 16);
  for (let i = 0; i + 16 <= o; i += 16) {
    Ic(n, r, i, s, i);
    for (let a = 0; a < 16; a++) s[i + a] ^= l[a];
    l = r.subarray(i, i + 16);
  }
  return s;
}
const X1 = 5e4, Y1 = new Uint8Array([254, 167, 210, 118, 59, 75, 158, 121]), G1 = new Uint8Array([215, 170, 15, 109, 48, 97, 52, 78]), Z1 = new Uint8Array([20, 110, 11, 231, 171, 172, 208, 214]);
class _s extends Error {
  constructor() {
    super("密码错误"), this.name = "WrongPasswordError";
  }
}
class Nc extends Error {
  constructor() {
    super("该文件已加密，需要提供打开密码"), this.name = "PasswordRequiredError";
  }
}
function xn(...e) {
  const t = e.reduce((o, s) => o + s.length, 0), r = new Uint8Array(t);
  let n = 0;
  for (const o of e) r.set(o, n), n += o.length;
  return r;
}
function _1(e) {
  const t = new Uint8Array(e.length * 2), r = new DataView(t.buffer);
  for (let n = 0; n < e.length; n++) r.setUint16(n * 2, e.charCodeAt(n), !0);
  return t;
}
function qs(e) {
  const t = new Uint8Array(4);
  return new DataView(t.buffer).setUint32(0, e >>> 0, !0), t;
}
function Rc(e, t, r) {
  if (e.length < r || t.length < r) return !1;
  let n = 0;
  for (let o = 0; o < r; o++) n |= e[o] ^ t[o];
  return n === 0;
}
function zc(e, t, r, n) {
  let o = e(xn(t, _1(r)));
  for (let s = 0; s < n; s++) o = e(xn(qs(s), o));
  return o;
}
function Js(e, t) {
  if (e.length >= t) return e.subarray(0, t);
  const r = new Uint8Array(t).fill(54);
  return r.set(e), r;
}
function q1(e) {
  const t = new DataView(e.buffer, e.byteOffset, e.byteLength), r = t.getUint32(8, !0);
  if (r < 32 || 12 + r + 8 > e.length) return null;
  const n = t.getUint32(28, !0), o = n >= 8 ? n / 8 : 16;
  let s = 12 + r;
  const l = t.getUint32(s, !0);
  if (s += 4, l !== 16) return null;
  const i = e.subarray(s, s + 16);
  s += 16;
  const a = e.subarray(s, s + 16);
  s += 16;
  const c = t.getUint32(s, !0);
  if (s += 4, c < 20) return null;
  const u = e.subarray(s, s + 32);
  return { keyBytes: o, salt: i, encryptedVerifier: a, encryptedVerifierHash: u };
}
function J1(e, t) {
  const r = zc(wt, e.salt, t, X1), n = wt(xn(r, qs(0))), o = wt(new Uint8Array(64).map((l, i) => (i < n.length ? n[i] : 0) ^ 54)), s = wt(new Uint8Array(64).map((l, i) => (i < n.length ? n[i] : 0) ^ 92));
  return Js(xn(o, s), e.keyBytes);
}
function K1(e, t, r) {
  const n = q1(e);
  if (!n) throw new Error("无法解析标准加密的 EncryptionInfo");
  const o = J1(n, r), s = zo(o, n.encryptedVerifier), l = zo(o, n.encryptedVerifierHash);
  if (!Rc(wt(s), l, 20)) throw new _s();
  const i = Number(new DataView(t.buffer, t.byteOffset, t.byteLength).getBigUint64(0, !0)), a = zo(o, t.subarray(8));
  return a.subarray(0, Math.min(i, a.length));
}
function Pn(e) {
  const t = typeof atob == "function" ? atob(e) : globalThis.Buffer.from(e, "base64").toString("binary"), r = new Uint8Array(t.length);
  for (let n = 0; n < t.length; n++) r[n] = t.charCodeAt(n);
  return r;
}
function Q1(e) {
  var t, r;
  const n = new TextDecoder().decode(e.subarray(8)), o = ((t = /<[^>]*keyData\b[^>]*>/.exec(n)) == null ? void 0 : t[0]) ?? "", s = ((r = /<[^>]*encryptedKey\b[^>]*>/.exec(n)) == null ? void 0 : r[0]) ?? "";
  if (!o || !s) return null;
  const l = (u, f) => {
    const h = new RegExp(`\\b${f}="([^"]*)"`).exec(u);
    return h ? h[1] : null;
  }, i = ui(l(o, "hashAlgorithm") ?? ""), a = ui(l(s, "hashAlgorithm") ?? "");
  if (!i || !a || (l(o, "cipherAlgorithm") ?? "AES") !== "AES") return null;
  const c = (u, f, h) => {
    const p = Number(l(u, f));
    return Number.isFinite(p) && p > 0 ? p : h;
  };
  return { hash: i, hashSize: c(o, "hashSize", 64), blockSize: c(o, "blockSize", 16), keyBytes: c(o, "keyBits", 256) / 8, keySalt: Pn(l(o, "saltValue") ?? ""), spinCount: c(s, "spinCount", 1e5), pwSalt: Pn(l(s, "saltValue") ?? ""), pwKeyBytes: c(s, "keyBits", 256) / 8, pwHash: a, encryptedKeyValue: Pn(l(s, "encryptedKeyValue") ?? ""), encryptedVerifierHashInput: Pn(l(s, "encryptedVerifierHashInput") ?? ""), encryptedVerifierHashValue: Pn(l(s, "encryptedVerifierHashValue") ?? "") };
}
function Oo(e, t, r) {
  return Js(e.pwHash(xn(t, r)), e.pwKeyBytes);
}
function em(e, t, r) {
  const n = Q1(e);
  if (!n) throw new Error("无法解析敏捷加密的 EncryptionInfo");
  const o = zc(n.pwHash, n.pwSalt, r, n.spinCount), s = ur(Oo(n, o, Y1), n.pwSalt, n.encryptedVerifierHashInput), l = ur(Oo(n, o, G1), n.pwSalt, n.encryptedVerifierHashValue);
  if (!Rc(n.pwHash(s.subarray(0, 16)), l, Math.min(n.hashSize, l.length))) throw new _s();
  const i = ur(Oo(n, o, Z1), n.pwSalt, n.encryptedKeyValue).subarray(0, n.keyBytes), a = Number(new DataView(t.buffer, t.byteOffset, t.byteLength).getBigUint64(0, !0)), c = t.subarray(8), u = 4096, f = new Uint8Array(c.length);
  for (let h = 0, p = 0; p < c.length; h++, p += u) {
    const d = Js(n.hash(xn(n.keySalt, qs(h))), n.blockSize), m = c.subarray(p, Math.min(p + u, c.length));
    f.set(ur(i, d, m), p);
  }
  return f.subarray(0, Math.min(a, f.length));
}
function tm(e, t, r) {
  if (e.length < 16 || t.length < 16) throw new Error("加密流不完整");
  const n = new DataView(e.buffer, e.byteOffset, e.byteLength), o = n.getUint16(0, !0), s = n.getUint16(2, !0);
  if (o === 4 && s === 4) return em(e, t, r);
  if (o === 4 && s === 3) throw new Error("不支持扩展加密（自定义加密提供程序）");
  return K1(e, t, r);
}
function j$(e) {
  const t = new DataView(e.buffer, e.byteOffset, e.byteLength), r = t.getUint16(0, !0), n = t.getUint16(2, !0);
  return r === 4 && n === 4 ? "agile" : r === 4 && n === 3 ? "extensible" : "standard";
}
const nm = 4090610911, rm = 4085, om = 6002, sm = 12052;
function jo(e, t) {
  const r = new Uint8Array(256);
  for (let l = 0; l < 256; l++) r[l] = l;
  let n = 0;
  for (let l = 0; l < 256; l++) {
    n = n + r[l] + e[l % e.length] & 255;
    const i = r[l];
    r[l] = r[n], r[n] = i;
  }
  const o = new Uint8Array(t.length);
  let s = 0;
  n = 0;
  for (let l = 0; l < t.length; l++) {
    s = s + 1 & 255, n = n + r[s] & 255;
    const i = r[s];
    r[s] = r[n], r[n] = i, o[l] = t[l] ^ r[r[s] + r[n] & 255];
  }
  return o;
}
function lm(e) {
  const t = new Uint8Array(e.length * 2), r = new DataView(t.buffer);
  for (let n = 0; n < e.length; n++) r.setUint16(n * 2, e.charCodeAt(n), !0);
  return t;
}
function im(e) {
  const t = new Uint8Array(4);
  return new DataView(t.buffer).setUint32(0, e >>> 0, !0), t;
}
function ds(e, t) {
  const r = new Uint8Array(e.length + t.length);
  return r.set(e), r.set(t, e.length), r;
}
function am(e) {
  return !e || e.length < 16 ? !1 : new DataView(e.buffer, e.byteOffset, e.byteLength).getUint32(12, !0) === nm;
}
function cm(e) {
  if (e.length < 40) return null;
  const t = new DataView(e.buffer, e.byteOffset, e.byteLength), r = t.getUint32(8, !0);
  if (r < 20 || 12 + r + 40 > e.length) return null;
  const n = t.getUint32(28, !0) || 40;
  let o = 12 + r;
  const s = t.getUint32(o, !0);
  if (o += 4, s !== 16) return null;
  const l = e.subarray(o, o + 16);
  o += 16;
  const i = e.subarray(o, o + 16);
  o += 16;
  const a = t.getUint32(o, !0);
  return o += 4, a < 20 ? null : { keyBytes: Math.max(1, Math.floor(n / 8)), salt: l, encVerifier: i, encVerifierHash: e.subarray(o, o + 20) };
}
function Fo(e, t, r) {
  const n = wt(ds(t, im(r))).subarray(0, e.keyBytes);
  if (e.keyBytes !== 5) return n;
  const o = new Uint8Array(16);
  return o.set(n), o;
}
function um(e, t) {
  const r = new DataView(t.buffer, t.byteOffset, t.byteLength), n = new DataView(e.buffer, e.byteOffset, e.byteLength), o = (d) => n.getUint32(d + 4, !0), s = (d) => n.getUint16(d + 2, !0), l = [], i = /* @__PURE__ */ new Map();
  let a = -1, c = r.getUint32(16, !0), u = 0;
  for (; c > 0 && c + 8 <= e.length && u++ < 64; ) {
    if (s(c) !== rm) return null;
    const d = o(c);
    l.push([c, 8 + d]);
    const m = c + 8, $ = n.getUint32(m + 8, !0), x = n.getUint32(m + 12, !0);
    if (d >= 32 && a < 0 && (a = n.getUint32(m + 28, !0)), x > 0 && x + 8 <= e.length && s(x) === om) {
      const b = o(x);
      l.push([x, 8 + b]);
      let M = x + 8;
      const E = Math.min(M + b, e.length);
      for (; M + 4 <= E; ) {
        const y = n.getUint32(M, !0);
        M += 4;
        const v = y & 1048575, k = y >>> 20;
        for (let T = 0; T < k && M + 4 <= E; T++) i.has(v + T) || i.set(v + T, n.getUint32(M, !0)), M += 4;
      }
    }
    c = $;
  }
  const f = a >= 0 ? i.get(a) : void 0;
  if (f === void 0 || f + 8 > e.length || s(f) !== sm) return null;
  const h = o(f);
  l.push([f, 8 + h]);
  const p = cm(e.subarray(f + 8, f + 8 + h));
  return p ? { info: p, persists: [...i.entries()].filter(([d]) => d !== a).map(([d, m]) => ({ id: d, offset: m })), plain: l } : null;
}
function fm(e, t, r) {
  const n = um(e, t);
  if (!n) return null;
  const { info: o, persists: s, plain: l } = n, i = wt(ds(o.salt, lm(r))), a = Fo(o, i, 0), c = jo(a, ds(o.encVerifier, o.encVerifierHash)), u = wt(c.subarray(0, 16));
  let f = 0;
  for (let d = 0; d < 20; d++) f |= u[d] ^ c[16 + d];
  if (f !== 0) throw new _s();
  const h = new Uint8Array(e);
  new DataView(e.buffer, e.byteOffset, e.byteLength);
  const p = [];
  for (const { id: d, offset: m } of s) {
    if (m + 8 > e.length) continue;
    const $ = jo(Fo(o, i, d), e.subarray(m, m + 8)), x = new DataView($.buffer).getUint32(4, !0), b = Math.min(8 + x, e.length - m);
    !(b > 8) || b > e.length || (h.set(jo(Fo(o, i, d), e.subarray(m, m + b)), m), p.push([m, b]));
  }
  if (!p.length) return null;
  for (const [d, m] of l) d >= 0 && d + m <= e.length && h.set(e.subarray(d, d + m), d);
  return h;
}
function* De(e, t, r) {
  let n = t;
  for (; n + 8 <= r; ) {
    const o = e.getUint16(n, !0), s = e.getUint16(n + 2, !0), l = e.getUint32(n + 4, !0), i = n + 8;
    if (l < 0 || i + l > r) return;
    const a = o & 15;
    yield { type: s, instance: o >> 4, version: a, isContainer: a === 15, start: i, len: l }, n = i + l;
  }
}
function ae(e, t, r, n) {
  for (const o of De(e, t, r)) if (o.type === n) return o;
  return null;
}
function at(e, t, r, n) {
  const o = [];
  for (const s of De(e, t, r)) s.type === n && o.push(s);
  return o;
}
function kt(e, t, r) {
  let n = "";
  for (let o = 0; o + 2 <= r; o += 2) n += String.fromCharCode(e.getUint16(t + o, !0));
  return n;
}
function Qr(e, t, r) {
  let n = "";
  for (let o = 0; o < r; o++) n += String.fromCharCode(e.getUint8(t + o));
  return n;
}
function Oc(e, t, r) {
  const n = [], o = (s, l, i) => {
    for (const a of De(e, s, l)) {
      if (a.type === te.ProgBinaryTag) {
        let c = "";
        for (const u of De(e, a.start, a.start + a.len)) u.type === te.CString ? c = kt(e, u.start, u.len).replace(/\0+$/, "") : u.type === te.BinaryTagDataBlob && c === r && n.push(u);
        continue;
      }
      a.isContainer && i > 0 && o(a.start, a.start + a.len, i - 1);
    }
  };
  return o(t.start, t.start + t.len, 6), n;
}
const te = { Document: 1e3, DocumentAtom: 1001, Slide: 1006, SlideAtom: 1007, Notes: 1008, NotesAtom: 1009, MainMaster: 1016, SSSlideInfoAtom: 1017, SlidePersistAtom: 1011, ExObjList: 1033, PPDrawing: 1036, ColorSchemeAtom: 2032, SlideListWithText: 4080, TextHeaderAtom: 3999, TextCharsAtom: 4e3, TextBytesAtom: 4008, StyleTextPropAtom: 4001, TxMasterStyleAtom: 4003, FontEntityAtom: 4023, OEPlaceholderAtom: 3011, ExHyperlinkAtom: 4051, ExHyperlink: 4055, CString: 4026, TextInteractiveInfoAtom: 4063, InteractiveInfo: 4082, InteractiveInfoAtom: 4083, PersistDirectoryAtom: 6002, ProgBinaryTag: 5002, BinaryTagDataBlob: 5003, StyleTextProp9Atom: 4012 }, rt = { ExtTimeNodeContainer: 61764, TimeNodeAtom: 61735, TimeConditionContainer: 61733, TimeConditionAtom: 61736, ClientVisualElement: 61756, TimePropertyList: 61757, TimeVariant: 61762, VisualShapeAtom: 11003 }, Me = { DgContainer: 61442, SpgrContainer: 61443, SpContainer: 61444, Spgr: 61449, Sp: 61450, Opt: 61451, ClientTextbox: 61453, ChildAnchor: 61455, ClientAnchor: 61456, ClientData: 61457 }, hm = 8388608, dm = 16777216, pm = 33554432, mm = 1048576, gm = [[1, 2], [2, 2], [4, 2], [32, 2], [64, 4], [128, 4]], $m = 256;
function bm(e, t) {
  const r = [], n = t.start + t.len;
  let o = t.start;
  for (; o + 4 <= n; ) {
    const s = e.getUint32(o, !0);
    o += 4, s & hm && (o += 2);
    let l = null;
    if (s & pm) {
      if (o + 2 > n) return [];
      l = e.getUint16(o, !0) !== 0, o += 2;
    }
    let i = null;
    if (s & dm) {
      if (o + 4 > n) return [];
      i = { scheme: e.getUint16(o, !0), startNum: e.getUint16(o + 2, !0) || 1 }, o += 4;
    }
    if (o + 4 > n) return [];
    const a = e.getUint32(o, !0);
    if (o += 4, a & mm && (o += 4), o + 4 > n) return [];
    const c = e.getUint32(o, !0);
    o += 4;
    for (const [u, f] of gm) c & u && (o += f);
    if (c & $m) {
      if (o + 4 > n) return [];
      o += 4 + e.getUint32(o, !0) * 4;
    }
    if (o > n) return [];
    r.push(l === !1 ? null : i);
  }
  return o === n ? r : [];
}
function jc(e, t) {
  const r = [];
  for (const n of Oc(e, t, "___PPT9")) for (const o of at(e, n.start, n.start + n.len, te.StyleTextProp9Atom)) r.push(...bm(e, o));
  return r;
}
function xm(e, t) {
  const r = wm[e] ?? "arabic", n = r === "alphaLc" ? fi(t).toLowerCase() : r === "alphaUc" ? fi(t) : r === "romanLc" ? hi(t).toLowerCase() : r === "romanUc" ? hi(t) : r === "circle" ? vm(t) : String(t), o = ym[e] ?? "";
  return o === "both" ? `(${n})` : o === "right" ? `${n})` : o === "period" ? `${n}.` : o === "minus" ? `-${n}-` : n;
}
const wm = { 0: "alphaLc", 1: "alphaUc", 2: "arabic", 3: "arabic", 4: "romanLc", 5: "romanLc", 6: "romanLc", 7: "romanUc", 8: "alphaLc", 9: "alphaLc", 10: "alphaUc", 11: "alphaUc", 12: "arabic", 13: "arabic", 14: "romanUc", 15: "romanUc", 16: "arabic", 17: "arabic", 18: "circle", 19: "circle", 20: "circle", 21: "arabic", 22: "arabic", 23: "arabic", 24: "arabic", 25: "arabic", 26: "arabic", 27: "arabic", 28: "arabic", 29: "arabic", 30: "arabic", 31: "arabic", 32: "arabic" }, ym = { 0: "period", 1: "period", 2: "right", 3: "period", 4: "both", 5: "right", 6: "period", 7: "period", 8: "both", 9: "right", 10: "both", 11: "right", 12: "both", 14: "both", 15: "right", 17: "period", 21: "period", 23: "period", 25: "period", 27: "period", 29: "period", 30: "minus", 31: "minus", 32: "minus" };
function fi(e) {
  let t = "", r = e;
  for (; r > 0; ) t = String.fromCharCode(65 + (r - 1) % 26) + t, r = Math.floor((r - 1) / 26);
  return t || "A";
}
function hi(e) {
  const t = [[1e3, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let r = "", n = e;
  for (const [o, s] of t) for (; n >= o; ) r += s, n -= o;
  return r || "I";
}
const vm = (e) => e >= 1 && e <= 20 ? String.fromCharCode(9312 + e - 1) : String(e);
function Ks(e, t) {
  const r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), o = t.instance;
  let s = t.start;
  const l = t.start + Math.min(o * 6, t.len), i = [];
  for (let c = 0; c < o && s + 6 <= t.start + t.len; c++, s += 6) {
    const u = e.getUint16(s, !0), f = u & 16383, h = (u & 32768) !== 0, p = e.getUint32(s + 2, !0);
    h ? i.push({ id: f, len: p }) : r.set(f, p);
  }
  let a = l;
  for (const c of i) {
    if (a + c.len > t.start + t.len) break;
    n.set(c.id, { start: a, len: c.len }), a += c.len;
  }
  return { simple: r, complex: n };
}
const ne = { rotation: 4, tableProperties: 927, tableRowProperties: 928, lTxid: 128, anchorText: 135, pib: 260, cropFromTop: 256, cropFromBottom: 257, cropFromLeft: 258, cropFromRight: 259, wzName: 896, geoLeft: 320, geoTop: 321, geoRight: 322, geoBottom: 323, pVertices: 325, pSegmentInfo: 326, adjustValue: 327, adjust2Value: 328, adjust3Value: 329, adjust4Value: 330, fillType: 384, fillColor: 385, fillOpacity: 386, fillBackColor: 387, fillBackOpacity: 388, fillFocus: 396, fillBlip: 390, fillAngle: 395, fillStyleBooleans: 447, lineColor: 448, lineOpacity: 449, lineWidth: 459, lineDashing: 462, lineStartArrow: 464, lineEndArrow: 465, lineStyleBooleans: 511, shadowColor: 513, shadowOpacity: 516, shadowOffsetX: 517, shadowOffsetY: 518, shadowStyleBooleans: 575 }, Gn = (e) => e > 2147483647 ? e - 4294967296 : e;
function zt(e, t, r = 1) {
  const n = e >> 24 & 255;
  let o, s, l;
  if (n === 8 || n === 1) {
    const i = e & 255, a = t[i] ?? "000000";
    o = parseInt(a.slice(0, 2), 16), s = parseInt(a.slice(2, 4), 16), l = parseInt(a.slice(4, 6), 16);
  } else o = e & 255, s = e >> 8 & 255, l = e >> 16 & 255;
  return r >= 1 ? `rgb(${o},${s},${l})` : `rgba(${o},${s},${l},${Math.round(r * 1e3) / 1e3})`;
}
const Qs = (e, t) => e === void 0 || !(e & t << 16) ? null : (e & t) !== 0;
function Mm(e) {
  const t = e.simple.get(ne.fillAngle), r = t === void 0 ? 0 : Gn(t) / 65536;
  let n = r >= 0, o = Gn(e.simple.get(ne.fillFocus) ?? 0);
  o === 0 ? n = !n : o < 0 && (o = -o, n = !n);
  const s = o > 40 && o < 60;
  s && (n = !n);
  let l = 90 - r;
  for (; l < 0; ) l += 360;
  for (; l >= 360; ) l -= 360;
  return { angle: Math.round(l * 1e3) / 1e3, backFirst: !n, axial: s };
}
function Fc(e, t, r) {
  const n = Qs(e.simple.get(ne.fillStyleBooleans), 16);
  if (n === !1) return { type: "none" };
  const o = e.simple.get(ne.fillType) ?? 0, s = (e.simple.get(ne.fillOpacity) ?? 65536) / 65536;
  if (o === 3 || o === 2) {
    const i = e.simple.get(ne.fillBlip) ?? e.simple.get(ne.pib), a = i !== void 0 ? r(i) : null;
    if (a) return { type: "image", src: a, alpha: s < 1 ? s : void 0 };
  }
  if (o === 4 || o === 5 || o === 6 || o === 7) {
    const i = e.simple.get(ne.fillColor), a = e.simple.get(ne.fillBackColor), c = (e.simple.get(ne.fillBackOpacity) ?? 65536) / 65536;
    if (i !== void 0 || a !== void 0) {
      const u = zt(i ?? 16777215, t, s), f = zt(a ?? 16777215, t, c);
      if (o === 5 || o === 6) return { type: "gradient", angle: 90, stops: [{ pos: 0, color: u }, { pos: 1, color: f }] };
      const h = Mm(e), [p, d] = h.backFirst ? [f, u] : [u, f];
      return { type: "gradient", angle: h.angle, stops: h.axial ? [{ pos: 0, color: p }, { pos: 0.5, color: d }, { pos: 1, color: p }] : [{ pos: 0, color: p }, { pos: 1, color: d }] };
    }
  }
  const l = e.simple.get(ne.fillColor);
  return l === void 0 ? n === !0 ? { type: "solid", color: zt(16777215, t) } : null : { type: "solid", color: zt(l, t, s) };
}
const km = { 1: [4, 3], 2: [1, 3], 3: [4, 3, 1, 3], 4: [4, 3, 1, 3, 1, 3], 5: [8, 3], 6: [8, 3, 1, 3], 7: [8, 3, 1, 3, 1, 3], 8: [1, 1], 9: [3, 3], 10: [3, 3, 1, 3] };
function Cm(e) {
  const t = (n) => Gn(e.simple.get(n) ?? 0) / 65536, r = { t: t(ne.cropFromTop), b: t(ne.cropFromBottom), l: t(ne.cropFromLeft), r: t(ne.cropFromRight) };
  return Object.values(r).some((n) => Math.abs(n) > 1e-9) ? r : null;
}
const fr = { 1: "triangle", 2: "stealth", 3: "diamond", 4: "oval", 5: "arrow" };
function di(e, t) {
  const r = Qs(e.simple.get(ne.lineStyleBooleans), 8);
  if (r === !1) return null;
  const n = e.simple.get(ne.lineColor);
  if (n === void 0 && r !== !0) return null;
  const o = (e.simple.get(ne.lineWidth) ?? 9525) / 9525, s = e.simple.get(ne.lineDashing), l = (e.simple.get(ne.lineOpacity) ?? 65536) / 65536, i = e.simple.get(ne.lineStartArrow), a = e.simple.get(ne.lineEndArrow);
  return { color: zt(n ?? 0, t, l), width: o, dash: s ? (km[s] ?? [4, 3]).map((c) => c * Math.max(o, 1)) : null, head: i && fr[i] ? { type: fr[i], w: 3, h: 3 } : void 0, tail: a && fr[a] ? { type: fr[a], w: 3, h: 3 } : void 0 };
}
function Em(e, t) {
  if (Qs(e.simple.get(ne.shadowStyleBooleans), 2) !== !0) return;
  const r = Gn(e.simple.get(ne.shadowOffsetX) ?? 25400) / 9525, n = Gn(e.simple.get(ne.shadowOffsetY) ?? 25400) / 9525, o = Math.max(0, Math.min(1, (e.simple.get(ne.shadowOpacity) ?? 65536) / 65536)), s = e.simple.get(ne.shadowColor) ?? 8421504;
  if (!(o <= 0 || r === 0 && n === 0)) return { dx: r, dy: n, blur: 4, color: zt(s, t, o) };
}
const Sm = { 1: "rect", 2: "roundRect", 3: "ellipse", 4: "diamond", 5: "triangle", 6: "rtTriangle", 7: "parallelogram", 8: "trapezoid", 9: "hexagon", 10: "octagon", 11: "plus", 12: "star5", 13: "rightArrow", 14: "rightArrow", 15: "homePlate", 16: "cube", 17: "wedgeRoundRectCallout", 18: "star8", 19: "arc", 20: "line", 21: "plaque", 22: "can", 23: "donut", 24: "rect", 25: "octagon", 26: "hexagon", 27: "rect", 28: "wave", 29: "donut", 30: "rect", 31: "donut", 32: "straightConnector1", 33: "bentConnector2", 34: "bentConnector3", 35: "bentConnector4", 36: "bentConnector5", 37: "curvedConnector2", 38: "curvedConnector3", 39: "curvedConnector4", 40: "curvedConnector5", 41: "callout1", 42: "callout2", 43: "callout2", 44: "callout1", 45: "callout2", 46: "callout2", 47: "borderCallout1", 48: "borderCallout2", 49: "borderCallout2", 50: "borderCallout1", 51: "borderCallout2", 52: "borderCallout2", 53: "ribbon", 54: "ribbon2", 55: "chevron", 56: "pentagon", 57: "noSmoking", 58: "star8", 59: "star16", 60: "star32", 61: "wedgeRectCallout", 62: "wedgeRoundRectCallout", 63: "wedgeEllipseCallout", 64: "wave", 65: "foldedCorner", 66: "leftArrow", 67: "downArrow", 68: "upArrow", 69: "leftRightArrow", 70: "upDownArrow", 71: "irregularSeal1", 72: "irregularSeal2", 73: "lightningBolt", 74: "heart", 75: "rect", 76: "quadArrow", 77: "leftArrowCallout", 78: "rightArrowCallout", 79: "upArrowCallout", 80: "downArrowCallout", 81: "leftRightArrowCallout", 82: "upArrowCallout", 83: "quadArrow", 84: "bevel", 85: "leftBracket", 86: "rightBracket", 87: "leftBrace", 88: "rightBrace", 89: "leftRightUpArrow", 90: "bentArrow", 91: "bentArrow", 92: "star24", 93: "stripedRightArrow", 94: "notchedRightArrow", 95: "blockArc", 96: "smileyFace", 97: "verticalScroll", 98: "horizontalScroll", 99: "circularArrow", 100: "circularArrow", 101: "uturnArrow", 102: "curvedRightArrow", 103: "curvedLeftArrow", 104: "curvedUpArrow", 105: "curvedDownArrow", 106: "cloudCallout", 107: "ribbon", 108: "ribbon2", 109: "flowChartProcess", 110: "flowChartDecision", 111: "flowChartInputOutput", 112: "flowChartPredefinedProcess", 113: "flowChartInternalStorage", 114: "flowChartDocument", 115: "flowChartMultidocument", 116: "flowChartTerminator", 117: "flowChartPreparation", 118: "flowChartManualInput", 119: "flowChartManualOperation", 120: "flowChartConnector", 121: "flowChartPunchedCard", 122: "flowChartPunchedTape", 123: "flowChartSummingJunction", 124: "flowChartOr", 125: "flowChartCollate", 126: "flowChartSort", 127: "flowChartExtract", 128: "flowChartMerge", 129: "flowChartOnlineStorage", 130: "flowChartOnlineStorage", 131: "flowChartMagneticTape", 132: "flowChartMagneticDisk", 133: "flowChartMagneticDrum", 134: "flowChartDisplay", 135: "flowChartDelay", 176: "flowChartAlternateProcess", 177: "flowChartOffpageConnector", 178: "callout1", 179: "callout1", 180: "borderCallout1", 181: "borderCallout1", 182: "leftRightUpArrow", 183: "sun", 184: "moon", 185: "bracketPair", 186: "bracePair", 187: "star4", 188: "doubleWave", 189: "actionButtonBlank", 190: "actionButtonHome", 191: "actionButtonHelp", 192: "actionButtonInformation", 193: "actionButtonForwardNext", 194: "actionButtonBackPrevious", 195: "actionButtonEnd", 196: "actionButtonBeginning", 197: "actionButtonReturn", 198: "actionButtonDocument", 199: "actionButtonSound", 200: "actionButtonMovie", 202: "rect" }, Lm = 75;
function Tm(e) {
  const t = [];
  if (!e.length) return t;
  const r = new DataView(e.buffer, e.byteOffset, e.byteLength), n = { 61469: "image/jpeg", 61470: "image/png", 61471: "image/bmp", 61481: "image/tiff", 61482: "image/jpeg" }, o = { 61466: "image/emf", 61467: "image/wmf", 61468: "image/pict" };
  for (const s of De(r, 0, e.length)) {
    const l = s.type in o, i = l ? o[s.type] : n[s.type];
    if (!i) continue;
    let a = s.start + ((s.instance & 1) === 1 ? 32 : 16);
    const c = s.start + s.len;
    if (a >= c) continue;
    if (!l) {
      t.push({ mime: i, data: e.subarray(a + 1, c) });
      continue;
    }
    if (a + 34 > c) continue;
    const u = r.getUint32(a, !0), f = r.getUint8(a + 32), h = e.subarray(a + 34, c);
    if (f === 0) try {
      const p = Ru(h, u ? { out: new Uint8Array(u) } : void 0);
      t.push({ mime: i, data: p });
    } catch {
      try {
        t.push({ mime: i, data: ea(h) });
      } catch {
      }
    }
    else t.push({ mime: i, data: h });
  }
  return t;
}
function Pm(e, t) {
  if (t.len < 8) return null;
  const r = e.getInt16(t.start, !0), n = e.getInt16(t.start + 2, !0), o = e.getInt16(t.start + 4, !0), s = e.getInt16(t.start + 6, !0);
  return { x: n, y: r, w: o - n, h: s - r };
}
function Am(e, t) {
  if (t.len < 16) return null;
  const r = e.getInt32(t.start, !0), n = e.getInt32(t.start + 4, !0), o = e.getInt32(t.start + 8, !0), s = e.getInt32(t.start + 12, !0);
  return { x: r, y: n, w: o - r, h: s - n };
}
function Im(e, t) {
  if (t.len < 16) return null;
  const r = e.getInt32(t.start, !0), n = e.getInt32(t.start + 4, !0), o = e.getInt32(t.start + 8, !0), s = e.getInt32(t.start + 12, !0);
  return { x: r, y: n, w: o - r, h: s - n };
}
function el(e, t) {
  return { id: e.getUint32(t.start, !0), flags: e.getUint32(t.start + 4, !0) };
}
const ut = { GROUP: 1, PATRIARCH: 4, DELETED: 8, OLE: 16, FLIPH: 64, FLIPV: 128, BACKGROUND: 1024 };
function Nm(e, t, r) {
  const n = t.complex.get(r);
  return n ? kt(e, n.start, n.len).replace(/\0+$/, "") : null;
}
function Rm(e, t) {
  const r = t.complex.get(ne.tableRowProperties);
  if (!r || r.len < 6) return [];
  const n = e.getUint16(r.start, !0), o = e.getInt16(r.start + 4, !0), s = o > 0 ? o : 4, l = [];
  for (let i = 0; i < n; i++) {
    const a = r.start + 6 + i * s;
    if (a + 4 > r.start + r.len) break;
    l.push(e.getInt32(a, !0));
  }
  return l;
}
function zm(e) {
  return e.simple.has(ne.tableProperties) || e.complex.has(ne.tableRowProperties);
}
const Om = { 1: "dissolve", 2: "blinds", 3: "checker", 4: "cover", 5: "dissolve", 6: "fade", 7: "pull", 8: "randomBar", 9: "strips", 10: "wipe", 11: "zoom", 12: "zoom", 13: "split", 17: "zoom", 18: "blinds", 19: "blinds", 20: "push", 21: "comb", 22: "newsflash", 23: "fade", 26: "wedge", 27: "wheel", 28: "circle", 29: "diamond", 30: "plus" }, jm = { 0: "l", 1: "u", 2: "r", 3: "d" }, Fm = { 0: "horz-out", 1: "horz-in", 2: "vert-out", 3: "vert-in" }, Um = { 0: "out", 1: "in" };
function Dm(e, t) {
  if (e === "split") return Fm[t];
  if (e === "zoom" || e === "circle" || e === "diamond" || e === "plus" || e === "wedge") return Um[t];
  if (e === "push" || e === "pull" || e === "cover" || e === "wipe" || e === "strips" || e === "blinds" || e === "comb" || e === "wheel" || e === "randomBar") return jm[t];
}
const Bm = { 0: 1e3, 1: 750, 2: 500 }, Hm = 4, Wm = 1024;
function Vm(e, t) {
  const r = ae(e, t.start, t.start + t.len, te.SSSlideInfoAtom);
  if (!r || r.len < 13) return null;
  const n = e.getInt32(r.start, !0), o = e.getUint8(r.start + 8), s = e.getUint8(r.start + 9), l = e.getUint16(r.start + 10, !0), i = e.getUint8(r.start + 12), a = Om[s], c = a === void 0 ? void 0 : { type: a, dir: Dm(a, o), durationMs: Bm[i] ?? 750, advanceAfterMs: l & Wm && n > 0 ? n : void 0 };
  return { hidden: (l & Hm) !== 0, transition: c };
}
const hn = { effectId: 9, effectDir: 10, effectClass: 11, nodeType: 20 }, Xm = 1, Ym = 2, Gm = 3, Zm = { 1: "entrance", 2: "exit", 3: "emphasis", 4: "motion", 5: "emphasis", 6: "emphasis" };
function _m(e, t) {
  if (t.len < 5) return null;
  const r = e.getUint8(t.start);
  return r !== 1 && r !== 0 ? null : r === 1 ? e.getInt32(t.start + 1, !0) : e.getUint8(t.start + 1);
}
function qm(e, t) {
  return t.len < 3 || e.getUint8(t.start) !== 3 ? null : kt(e, t.start + 1, t.len - 1).replace(/\0+$/, "");
}
function Uc(e, t) {
  const r = /* @__PURE__ */ new Map(), n = ae(e, t.start, t.start + t.len, rt.TimePropertyList);
  if (!n) return r;
  for (const o of at(e, n.start, n.start + n.len, rt.TimeVariant)) {
    const s = _m(e, o);
    s !== null && r.set(o.instance, s);
  }
  return r;
}
function Jm(e, t) {
  for (const r of at(e, t.start, t.start + t.len, rt.TimeConditionContainer)) {
    if (r.instance !== 1) continue;
    const n = ae(e, r.start, r.start + r.len, rt.TimeConditionAtom);
    if (!n || n.len < 16) continue;
    const o = e.getInt32(n.start + 12, !0);
    return o > 0 ? o : 0;
  }
  return 0;
}
function Km(e, t) {
  const r = ae(e, t.start, t.start + t.len, rt.TimeNodeAtom);
  if (!r || r.len < 32) return null;
  const n = e.getInt32(r.start + 24, !0);
  return n > 1 ? n : null;
}
function Dc(e, t, r, n, o = 12) {
  for (const s of De(e, t, r)) {
    if (s.type === rt.ClientVisualElement) {
      const l = ae(e, s.start, s.start + s.len, rt.VisualShapeAtom);
      l && l.len >= 12 && n.target === void 0 && (n.target = e.getUint32(l.start + 8, !0));
      continue;
    }
    if (s.type === rt.TimeVariant && n.filter === void 0) {
      const l = qm(e, s);
      l && (n.filter = l);
      continue;
    }
    if (s.type === rt.TimeNodeAtom && s.len >= 32 && n.duration === void 0) {
      const l = e.getInt32(s.start + 24, !0);
      l > 1 && (n.duration = l);
      continue;
    }
    s.type === rt.ExtTimeNodeContainer && Uc(e, s).has(hn.effectId) || s.isContainer && o > 0 && Dc(e, s.start, s.start + s.len, n, o - 1);
  }
}
function Qm(e, t) {
  const r = [], n = (s, l, i) => {
    for (const a of at(e, s, l, rt.ExtTimeNodeContainer)) {
      const c = Uc(e, a);
      if (c.has(hn.effectId)) {
        const u = e2(e, a, c);
        u && r.push(u);
        continue;
      }
      i > 0 && n(a.start, a.start + a.len, i - 1);
    }
  };
  for (const s of Oc(e, t, "___PPT10")) n(s.start, s.start + s.len, 16);
  if (!r.length) return;
  let o = -1;
  for (const s of r) (s.trigger === "click" || o < 0) && o++, s.clickGroup = o;
  return r;
}
function e2(e, t, r) {
  const n = {};
  if (Dc(e, t.start, t.start + t.len, n), n.target === void 0) return null;
  const { effect: o, dir: s } = la(r.get(hn.effectId) ?? 10, r.get(hn.effectDir) ?? 0, n.filter), l = r.get(hn.nodeType) ?? Xm, i = n.duration ?? Km(e, t) ?? 500;
  return { target: n.target, effect: o, dir: s, delayMs: Jm(e, t), durationMs: Math.max(60, Math.min(1e4, i)), trigger: l === Ym ? "withPrev" : l === Gm ? "afterPrev" : "click", kind: Zm[r.get(hn.effectClass) ?? 1] ?? "entrance" };
}
function t2(e, t, r, n) {
  const o = t.complex.get(ne.pVertices), s = t.complex.get(ne.pSegmentInfo);
  if (!o) return null;
  const l = (M, E) => {
    if (M.len < 6 || M.start < 0 || M.start + 6 > e.byteLength) return [];
    const y = e.getUint16(M.start, !0), v = e.getInt16(M.start + 4, !0), k = v === -4 ? 8 : v;
    if (k <= 0) return [];
    const T = Math.min(M.start + M.len, e.byteLength), S = [];
    for (let N = 0; N < y; N++) {
      const P = M.start + 6 + N * k;
      if (P + k > T) break;
      S.push(E(P));
    }
    return S;
  };
  if (o.len < 6 || o.start < 0 || o.start + 6 > e.byteLength) return null;
  const i = e.getInt16(o.start + 4, !0), a = l(o, (M) => i === 4 ? [e.getInt16(M, !0), e.getInt16(M + 2, !0)] : [e.getInt32(M, !0), e.getInt32(M + 4, !0)]);
  if (!a.length) return null;
  const c = t.simple.get(ne.geoLeft) ?? 0, u = t.simple.get(ne.geoTop) ?? 0, f = t.simple.get(ne.geoRight) ?? 21600, h = t.simple.get(ne.geoBottom) ?? 21600, p = r / Math.max(1, f - c), d = n / Math.max(1, h - u), m = (M) => `${((M[0] - c) * p).toFixed(2)} ${((M[1] - u) * d).toFixed(2)}`;
  if (!s) return `M ${a.map(m).join(" L ")} Z`;
  const $ = l(s, (M) => [e.getUint16(M, !0)]), x = [];
  let b = 0;
  for (const [M] of $) {
    const E = M >> 13;
    if (M === 16384) x.push(`M ${m(a[b++] ?? [0, 0])}`);
    else if (M === 24577) x.push("Z");
    else {
      if (M === 32768) break;
      if (E === 1 || M === 45824) {
        const y = M === 45824 ? 1 : M & 8191;
        for (let v = 0; v < y; v++) {
          const k = a[b++], T = a[b++], S = a[b++];
          k && T && S && x.push(`C ${m(k)} ${m(T)} ${m(S)}`);
        }
      } else if (E === 0) {
        const y = M & 8191;
        for (let v = 0; v < Math.max(1, y) && a[b]; v++) x.push(`L ${m(a[b++])}`);
      }
    }
  }
  return x.length ? x.join(" ") : `M ${a.map(m).join(" L ")} Z`;
}
const qe = (e) => {
  const t = (e ?? "000000").padStart(6, "0");
  return `rgb(${parseInt(t.slice(0, 2), 16) || 0},${parseInt(t.slice(2, 4), 16) || 0},${parseInt(t.slice(4, 6), 16) || 0})`;
}, pi = (e, t) => ({ latin: e, ea: t, cs: "", scripts: {} });
function n2(e, t) {
  return { id: "ppt:theme:1", name: "PowerPoint 97-2003", colors: { lt1: qe(e[0]), dk1: qe(e[1]), lt2: qe(e[2]), dk2: qe(e[3]), accent1: qe(e[4]), accent2: qe(e[5]), accent3: qe(e[2]), accent4: qe(e[3]), accent5: qe(e[6]), accent6: qe(e[7]), hlink: qe(e[6]), folHlink: qe(e[7]) }, fonts: { major: pi(t.majorLatin, t.majorEa), minor: pi(t.minorLatin, t.minorEa) } };
}
const vr = 96 / 576, tl = ["FFFFFF", "000000", "808080", "000000", "CCFFFF", "B2B2B2", "3333CC", "009999"], Bc = 15, Hc = 1048576, r2 = [[Bc, 2], [128, 2], [16, 2], [64, 2], [32, 4], [2048, 2], [4096, 2], [8192, 2], [16384, 2], [256, 2], [1024, 2], [32768, 2], [Hc, -1], [65536, 2], [917504, 2], [2097152, 2]], o2 = [[65535, 2], [65536, 2], [2097152, 2], [4194304, 2], [8388608, 2], [131072, 2], [262144, 4], [524288, 2]];
function Wc(e, t, r, n, o) {
  let s = t;
  for (const [l, i] of r2) {
    if (!(n & l)) continue;
    if (l === Hc) {
      if (s + 2 > r || (s += 2 + e.getUint16(s, !0) * 4, s > r)) return -1;
      continue;
    }
    if (s + i > r) return -1;
    const a = i === 2 ? e.getUint16(s, !0) : e.getUint32(s, !0);
    l === Bc ? o.hasBullet = (a & 1) !== 0 : l === 128 ? o.bulletChar = String.fromCharCode(a) : l === 256 ? o.leftMargin = a : l === 1024 ? o.indent = a : l === 2048 && (o.align = a), s += i;
  }
  return o.hasBullet === void 0 && n & 128 && (o.hasBullet = !0), s;
}
function Vc(e, t, r, n, o) {
  let s = t;
  for (const [l, i] of o2) {
    if (!(n & l)) continue;
    if (s + i > r) return -1;
    const a = i === 2 ? e.getUint16(s, !0) : e.getUint32(s, !0);
    l === 65535 ? (n & 1 && (o.bold = (a & 1) !== 0), n & 2 && (o.italic = (a & 2) !== 0), n & 4 && (o.underline = (a & 4) !== 0)) : l === 65536 ? o.fontIdx = a : l === 2097152 ? o.asianFontIdx = a : l === 131072 ? o.size = a : l === 262144 && (o.color = a), s += i;
  }
  return s;
}
function Xc(e, t, r) {
  const n = [], o = [];
  let s = t.start;
  const l = t.start + t.len, i = r + 1;
  let a = 0;
  for (; s + 10 <= l && a < i; ) {
    const c = e.getUint32(s, !0), u = e.getUint16(s + 4, !0), f = e.getUint32(s + 6, !0), h = { indentLevel: u }, p = Wc(e, s + 10, l, f, h);
    if (p < 0 || (s = p, n.push({ chars: c, props: h }), a += c, c === 0)) break;
  }
  for (a = 0; s + 8 <= l && a < i; ) {
    const c = e.getUint32(s, !0);
    if (c > i) break;
    const u = e.getUint32(s + 4, !0), f = {}, h = Vc(e, s + 8, l, u, f);
    if (h < 0 || (s = h, o.push({ chars: c, props: f }), a += c, c === 0)) break;
  }
  return { para: n, char: o };
}
const ce = { TITLE: 0, BODY: 1, NOTES: 2, OTHER: 4, CENTER_BODY: 5, CENTER_TITLE: 6 }, s2 = { 1: ce.TITLE, 2: ce.BODY, 3: ce.CENTER_TITLE, 4: ce.CENTER_BODY, 6: ce.NOTES, 12: ce.NOTES, 13: ce.TITLE, 14: ce.BODY, 15: ce.CENTER_TITLE, 16: ce.CENTER_BODY, 17: ce.TITLE, 18: ce.BODY, 19: ce.BODY };
function Yc(e, t, r) {
  const n = t.start + t.len;
  let o = t.start;
  if (o + 2 > n) return;
  const s = e.getUint16(o, !0);
  o += 2;
  const l = [];
  for (let i = 0; i < s && (t.instance >= 5 && (o += 2), !(o + 4 > n)); i++) {
    const a = e.getUint32(o, !0), c = {};
    let u = Wc(e, o + 4, n, a, c);
    if (u < 0 || u + 4 > n) break;
    const f = e.getUint32(u, !0), h = {};
    if (u = Vc(e, u + 4, n, f, h), u < 0) break;
    o = u, l.push({ para: c, char: h });
  }
  l.length && r.set(t.instance, l);
}
const l2 = { 0: "left", 1: "center", 2: "right", 3: "justify", 4: "justify" };
function i2(e, t, r) {
  const n = e.text.replace(/\r\n?/g, `
`).replace(/\v/g, `
`);
  if (!n.trim()) return null;
  const o = [];
  let s = 0, l = 0, i = 0;
  const a = (m) => {
    for (; l < e.charProps.length && i >= e.charProps[l].chars; ) i = 0, l++;
    const $ = e.charProps[l];
    if (!$) return { props: {}, take: m };
    const x = Math.max(1, $.chars - i);
    return { props: $.props, take: Math.min(m, x) };
  }, c = e.links ?? [], u = (m) => {
    var $;
    return ($ = c.find((x) => m >= x.begin && m < x.end)) == null ? void 0 : $.link;
  }, f = (m, $) => {
    let x = $;
    for (const b of c) b.begin > m && b.begin - m < x && (x = b.begin - m), b.end > m && b.end - m < x && (x = b.end - m);
    return Math.max(1, x);
  }, h = e.paraProps.length ? e.paraProps : [{ chars: n.length + 1, props: {} }], p = t.claimAutoNums(h.length), d = [];
  return h.forEach((m, $) => {
    const x = n.slice(s, s + m.chars), b = s;
    s += m.chars;
    const M = x.split(`
`), E = M.length > 1 && M[M.length - 1] === "", y = E ? M.slice(0, -1) : M, v = m.props, k = t.levelStyle(v.indentLevel ?? 0), T = v.indentLevel ?? 0, S = p?.[$] ?? null;
    let N = null;
    S && (d.length = T + 1, d[T] = (d[T] ?? S.startNum - 1) + 1, N = xm(S.scheme, d[T]));
    let P = b;
    y.forEach((L, A) => {
      const z = [];
      let R = 0;
      for (; R < L.length; ) {
        const { props: X, take: B } = a(L.length - R), Z = P + R, Y = f(Z, B), J = L.slice(R, R + Y);
        i += Y, R += Y, z.push(mi(J, X, k.char, t, u(Z)));
      }
      if ((A < y.length - 1 || E) && (i += 1), !z.length) {
        const { props: X } = a(1);
        z.push(mi("", X, k.char, t, void 0));
      }
      P += L.length + 1;
      const O = A === 0 ? N : null, U = O !== null || (v.hasBullet ?? k.para.hasBullet ?? !1), j = v.leftMargin ?? k.para.leftMargin, W = j !== void 0 ? j * vr : U ? 24 : 0;
      o.push({ align: l2[v.align ?? k.para.align ?? 0] ?? "left", lvl: T, marL: W, indent: U ? -Math.min(W, 24) : 0, bullet: O ?? (U ? c2(v.bulletChar ?? k.para.bulletChar) : null), lineHeight: null, spaceBefore: 0, spaceAfter: 2, runs: z });
    });
  }), o.length ? { anchor: r === 1 || r === 5 ? "middle" : r === 2 || r === 6 ? "bottom" : "top", insets: [3.6, 7.2, 3.6, 7.2], wrap: !0, fontScale: 1, paragraphs: o } : null;
}
function mi(e, t, r, n, o) {
  const s = t.color ?? r.color, l = [];
  for (const i of [t.fontIdx ?? r.fontIdx, t.asianFontIdx ?? r.asianFontIdx]) {
    const a = i !== void 0 ? n.fonts[i] : void 0;
    a && !l.includes(a) && l.push(a);
  }
  return { text: e, b: t.bold ?? r.bold ?? !1, i: t.italic ?? r.italic ?? !1, u: t.underline ?? r.underline ?? !1, strike: !1, size: (t.size ?? r.size ?? 18) * (96 / 72), color: s !== void 0 ? zt(s, n.scheme) : "rgb(0,0,0)", fonts: l, link: o };
}
const a2 = { 108: "●", 110: "■", 109: "❑", 113: "❑", 117: "◆", 118: "❖", 167: "▪", 168: "◻", 183: "•", 216: "➢", 252: "✓", 254: "☑" };
function c2(e) {
  if (!e) return "•";
  const t = e.charCodeAt(0), r = t >= 61440 && t <= 61695 ? t - 61440 : t, n = a2[r];
  return n && (t >= 61440 || t > 127) ? n : t >= 61440 || t < 32 || t === 65533 ? "•" : e;
}
function u2(e, t) {
  const r = e.autoNumCursor;
  if (t <= 0 || r + t > e.autoNums.length) return;
  const n = e.autoNums.slice(r, r + t);
  if (n.some((o) => o !== null)) return e.autoNumCursor = r + t, n;
}
function f2(e, t, r) {
  const n = `${t}:${r}`, o = e.levelCache.get(n);
  if (o) return o;
  const s = (a, c) => {
    const u = a.get(c);
    if (!(!u || !u.length)) return u[Math.min(r, u.length - 1)];
  }, l = [s(e.envStyles, ce.OTHER), s(e.styles, ce.OTHER), s(e.styles, t)], i = { para: Object.assign({}, ...l.map((a) => a?.para ?? {})), char: Object.assign({}, ...l.map((a) => a?.char ?? {})) };
  return e.levelCache.set(n, i), i;
}
function h2(e, t) {
  return { fonts: e.fonts, scheme: e.scheme, levelStyle: (r) => f2(e, t, r), claimAutoNums: (r) => u2(e, r) };
}
function d2(e, t) {
  const { dv: r } = e;
  let n = null, o = null, s;
  const l = [];
  let i;
  for (const c of De(r, t.start, t.start + t.len)) if (c.type === te.TextCharsAtom) n = kt(r, c.start, c.len);
  else if (c.type === te.TextBytesAtom) n = Qr(r, c.start, c.len);
  else if (c.type === te.StyleTextPropAtom) o = c;
  else if (c.type === te.TextHeaderAtom && c.len >= 4) s = r.getUint32(c.start, !0);
  else if (c.type === te.InteractiveInfo) i = Gc(e, c);
  else if (c.type === te.TextInteractiveInfoAtom && c.len >= 8) {
    const u = r.getUint32(c.start, !0), f = r.getUint32(c.start + 4, !0);
    i && f > u && l.push({ begin: u, end: f, link: i }), i = void 0;
  }
  if (n === null) return null;
  const a = o ? Xc(r, o, n.length) : { para: [], char: [] };
  return { text: n, paraProps: a.para, charProps: a.char, textType: s, links: l.length ? l : void 0 };
}
function p2(e, t) {
  const { dv: r } = e, n = ae(r, t.start, t.start + t.len, Me.ClientData);
  if (!n) return null;
  const o = ae(r, n.start, n.start + n.len, te.OEPlaceholderAtom);
  return o && o.len >= 6 ? r.getUint8(o.start + 4) : null;
}
const m2 = { 1: (e, t) => Math.min(e + 1, t), 2: (e) => Math.max(e - 1, 1), 3: () => 1, 4: (e, t) => t };
function Gc(e, t) {
  const { dv: r } = e, n = ae(r, t.start, t.start + t.len, te.InteractiveInfoAtom);
  if (!n || n.len < 16) return;
  const o = r.getUint32(n.start + 4, !0), s = e.links.get(o);
  if (s) return s;
  const l = m2[r.getUint8(n.start + 10)];
  return l ? `slide:${l(e.slideIndex, e.slideCount)}` : void 0;
}
function g2(e, t) {
  const { dv: r } = e, n = ae(r, t.start, t.start + t.len, Me.ClientData);
  if (!n) return;
  const o = ae(r, n.start, n.start + n.len, te.InteractiveInfo);
  return o ? Gc(e, o) : void 0;
}
function $2(e, t) {
  const r = /* @__PURE__ */ new Map(), n = ae(e, t.start, t.start + t.len, te.ExObjList);
  if (!n) return r;
  for (const o of at(e, n.start, n.start + n.len, te.ExHyperlink)) {
    let s = null, l = null, i = null;
    for (const c of De(e, o.start, o.start + o.len)) if (c.type === te.ExHyperlinkAtom && c.len >= 4) s = e.getUint32(c.start, !0);
    else if (c.type === te.CString) {
      const u = kt(e, c.start, c.len).replace(/\0+$/, "");
      c.instance === 1 ? l = u : c.instance === 0 && (i = u);
    }
    const a = l ?? i;
    s !== null && a && r.set(s, a);
  }
  return r;
}
function b2(e, t, r) {
  const n = e.trim();
  if (!n) return null;
  const o = n.toLowerCase(), s = /^#?action\?jump=(.+)$/.exec(o) ?? /^#action\?jump=(.+)$/.exec(o);
  if (s) {
    const i = s[1];
    if (i === "firstslide") return "slide:1";
    if (i === "lastslide") return `slide:${r}`;
    if (i === "nextslide") return `slide:${Math.min(t + 1, r)}`;
    if (i === "previousslide") return `slide:${Math.max(t - 1, 1)}`;
    const a = /(\d+)/.exec(i);
    return a ? `slide:${a[1]}` : null;
  }
  const l = /^\s*\d+\s*,\s*(\d+)\s*,/.exec(n);
  if (l) return `slide:${l[1]}`;
  if (n.startsWith("#")) {
    const i = /(\d+)\s*$/.exec(n);
    return i ? `slide:${i[1]}` : null;
  }
  return /^[a-z][a-z0-9+.-]*:/.test(o) ? n : /^www\./.test(o) ? `https://${n}` : n;
}
function Zc(e, t, r) {
  const { dv: n } = e, o = ae(n, t.start, t.start + t.len, Me.ClientAnchor);
  if (o) {
    const l = Pm(n, o);
    if (l) return { x: l.x * e.scale, y: l.y * e.scale, w: l.w * e.scale, h: l.h * e.scale };
  }
  const s = ae(n, t.start, t.start + t.len, Me.ChildAnchor);
  if (s) {
    const l = Am(n, s);
    if (l) return { x: r.x + l.x * r.sx, y: r.y + l.y * r.sy, w: l.w * r.sx, h: l.h * r.sy };
  }
  return null;
}
function _c(e, t, r, n, o) {
  const s = r.simple.get(ne.rotation), l = { x: e.x, y: e.y, w: e.w, h: e.h, rot: s !== void 0 ? s / 65536 % 360 : 0, flipH: (t.flags & ut.FLIPH) !== 0, flipV: (t.flags & ut.FLIPV) !== 0, id: t.id };
  if (o) {
    const a = Nm(o, r, ne.wzName);
    a && (l.name = a);
  }
  const i = Em(r, n);
  return i && (l.effects = { shadow: i }), l;
}
function gi(e, t, r) {
  const { dv: n } = e, o = ae(n, t.start, t.start + t.len, Me.Sp);
  if (!o) return null;
  const s = el(n, o);
  if (s.flags & ut.DELETED || s.flags & (ut.PATRIARCH | ut.GROUP) || s.flags & ut.BACKGROUND) return null;
  const l = p2(e, t);
  if (e.masterPass && l !== null && l !== 0) return null;
  const i = o.instance, a = ae(n, t.start, t.start + t.len, Me.Opt), c = a ? Ks(n, a) : { simple: /* @__PURE__ */ new Map(), complex: /* @__PURE__ */ new Map() }, u = Zc(e, t, r);
  if (!u || u.w <= 0 || u.h <= 0) return null;
  const f = _c(u, s, c, e.scheme, n), h = g2(e, t);
  h && (f.link = h);
  const p = (S) => e.blobs[S - 1] ?? null, d = c.simple.get(ne.pib), m = d === void 0 ? null : p(d);
  if (s.flags & ut.OLE) return { kind: "unsupported", ...f, label: "不支持编辑的旧版 OLE 对象", ...m ? { preview: m } : {} };
  if (d !== void 0 && (i === Lm || d > 0) && m) return { kind: "image", ...f, src: m, crop: Cm(c), stroke: di(c, e.scheme) };
  const $ = Fc(c, e.scheme, p), x = di(c, e.scheme);
  let b = null, M = !1;
  i === 0 && c.complex.has(ne.pVertices) && (b = t2(n, c, u.w, u.h));
  const E = Sm[i] ?? (i === 4095 ? "rect" : null);
  if (!b && !E) return { kind: "unsupported", ...f, label: `不支持的旧版形状（MSOSPT ${i}）` };
  if (!b) {
    const S = w2(c, i), N = $n(E, u.w, u.h, S);
    b = N.d, M = N.open, e.edit && (f.editInfo = { geom: { preset: E, adj: S } });
  }
  const y = ae(n, t.start, t.start + t.len, Me.ClientTextbox);
  let v = y ? d2(e, y) : null;
  if (!v) {
    const S = c.simple.get(ne.lTxid);
    S !== void 0 && e.listText[S] && (v = e.listText[S]);
  }
  const k = v?.textType ?? (l !== null ? s2[l] : void 0) ?? ce.OTHER, T = v ? i2(v, h2(e, k), c.simple.get(ne.anchorText)) : null;
  return !T && (!$ || $.type === "none") && !x ? null : { kind: "shape", ...f, path: b, fill: M ? { type: "none" } : $, stroke: x, text: T, openGeom: M || void 0 };
}
const x2 = /* @__PURE__ */ new Set([19, 98, 102, 103]);
function w2(e, t) {
  const r = x2.has(t), n = {}, o = [[ne.adjustValue, "adj1"], [ne.adjust2Value, "adj2"], [ne.adjust3Value, "adj3"], [ne.adjust4Value, "adj4"]];
  for (const [s, l] of o) {
    const i = e.simple.get(s);
    if (i === void 0) continue;
    const a = i > 2147483647 ? i - 4294967296 : i;
    if (r) {
      n[l] = a / 65536 * 6e4;
      continue;
    }
    Math.abs(a) > 21600 * 4 || (n[l] = a / 21600 * 1e5);
  }
  return n.adj1 !== void 0 && (n.adj = n.adj1), n;
}
const y2 = (e) => ({ x: 0, y: 0, sx: e.scale, sy: e.scale });
function qc(e, t, r, n = 0) {
  const { dv: o } = e, s = [], l = [...De(o, t.start, t.start + t.len)], i = l.find((p) => p.type === Me.SpContainer), a = i ? v2(e, i, r) : null, c = a?.rec ?? null;
  let u = r;
  if (a) {
    const p = a.box.w / a.space.w, d = a.box.h / a.space.h;
    u = { x: a.box.x - a.space.x * p, y: a.box.y - a.space.y * d, sx: p, sy: d };
  }
  const f = (p) => {
    const d = [];
    for (const m of l) {
      if (m === c || m.type !== Me.SpContainer) continue;
      const $ = gi(e, m, p);
      $ && d.push($);
    }
    return d;
  };
  if (a && zm(a.props)) {
    const p = f(u), d = $i(p, Rm(o, a.props).map((m) => m * e.scale));
    return d ? [d] : p;
  }
  if (a && l.filter((p) => p.type === Me.SpContainer).length >= 4) {
    const p = M2(f(u));
    if (k2(p)) {
      const d = $i(p, []);
      if (d) return [d];
    }
  }
  const h = (p, d) => {
    for (const m of l) if (m !== c) if (m.type === Me.SpContainer) {
      const $ = gi(e, m, p);
      $ && d.push($);
    } else m.type === Me.SpgrContainer && n < 8 && d.push(...qc(e, m, p, n + 1));
  };
  if (a) {
    const p = [];
    if (h(y2(e), p), !p.length) return [];
    const d = a.space.w * e.scale, m = a.space.h * e.scale;
    return [{ kind: "group", ..._c(a.box, a.sp, a.props, e.scheme, e.dv), childX: a.space.x * e.scale, childY: a.space.y * e.scale, scaleX: a.box.w / d, scaleY: a.box.h / m, children: p }];
  }
  return h(u, s), s;
}
function v2(e, t, r) {
  const { dv: n } = e, o = ae(n, t.start, t.start + t.len, Me.Spgr), s = ae(n, t.start, t.start + t.len, Me.Sp);
  if (!o || !s) return null;
  const l = el(n, s);
  if (!(l.flags & ut.GROUP) || l.flags & ut.PATRIARCH) return null;
  const i = Im(n, o), a = Zc(e, t, r);
  if (!i || !a || i.w <= 0 || i.h <= 0 || a.w <= 0 || a.h <= 0) return null;
  const c = ae(n, t.start, t.start + t.len, Me.Opt), u = c ? Ks(n, c) : { simple: /* @__PURE__ */ new Map(), complex: /* @__PURE__ */ new Map() };
  return { rec: t, sp: l, props: u, box: a, space: i };
}
function M2(e) {
  const t = e.filter((o) => o.kind === "shape");
  if (t.length !== e.length) return e;
  const r = 3, n = [];
  for (const o of t) {
    const s = n.find((l) => Math.abs(l.x - o.x) <= r && Math.abs(l.y - o.y) <= r && Math.abs(l.w - o.w) <= r * 2 && Math.abs(l.h - o.h) <= r * 2);
    if (!s) {
      n.push({ ...o });
      continue;
    }
    !s.text && o.text && (s.text = o.text), (!s.fill || s.fill.type === "none") && o.fill && o.fill.type !== "none" && (s.fill = o.fill), !s.stroke && o.stroke && (s.stroke = o.stroke);
  }
  return n;
}
function k2(e) {
  const t = e.filter((c) => c.kind === "shape" && c.path !== null);
  if (t.length < 4 || t.length !== e.length) return !1;
  const r = 2.5, n = (c) => {
    const u = [...c].sort((h, p) => h - p), f = [];
    for (const h of u) (!f.length || h - f[f.length - 1] > r) && f.push(h);
    return f;
  }, o = n(t.map((c) => c.x)), s = n(t.map((c) => c.y));
  if (o.length < 2 || s.length < 2 || t.length > o.length * s.length || t.length < o.length * s.length * 0.5) return !1;
  const l = (c, u, f) => {
    for (let h = 0; h + 1 < c.length; h++) if (!u.some((p, d) => Math.abs(p - c[h]) <= r && Math.abs(f[d] - c[h + 1]) <= r * 2)) return !1;
    return !0;
  }, i = l(o, t.map((c) => c.x), t.map((c) => c.x + c.w)), a = l(s, t.map((c) => c.y), t.map((c) => c.y + c.h));
  return i && a;
}
function $i(e, t) {
  var r, n, o;
  const s = e.filter((y) => y.kind === "shape");
  if (s.length < 2) return null;
  const l = 2, i = (y) => {
    const v = [...y].sort((T, S) => T - S), k = [];
    for (const T of v) (!k.length || T - k[k.length - 1] > l) && k.push(T);
    return k;
  }, a = i(s.map((y) => y.x)), c = i(s.map((y) => y.y));
  if (a.length < 1 || c.length < 1) return null;
  const u = a[0], f = c[0], h = Math.max(...s.map((y) => y.x + y.w)), p = Math.max(...s.map((y) => y.y + y.h)), d = a.map((y, v) => (v + 1 < a.length ? a[v + 1] : h) - y), m = c.map((y, v) => (v + 1 < c.length ? c[v + 1] : p) - y), $ = t.length === c.length ? t : m, x = (y) => {
    let v = 0;
    for (let k = 0; k < a.length; k++) y >= a[k] - l && (v = k);
    return v;
  }, b = (y) => {
    let v = 0;
    for (let k = 0; k < c.length; k++) y >= c[k] - l && (v = k);
    return v;
  }, M = c.map(() => a.map(() => null));
  for (const y of s) {
    const v = b(y.y), k = x(y.x);
    if (M[v][k]) continue;
    let T = 0;
    for (let N = k; N < a.length && a[N] < y.x + y.w - l; N++) T++;
    let S = 0;
    for (let N = v; N < c.length && c[N] < y.y + y.h - l; N++) S++;
    M[v][k] = { colSpan: Math.max(1, T), rowSpan: Math.max(1, S), merged: !1, fill: y.fill, text: y.text, borders: { l: y.stroke, r: y.stroke, t: y.stroke, b: y.stroke }, vAlign: ((r = y.text) == null ? void 0 : r.anchor) === "middle" ? "middle" : ((n = y.text) == null ? void 0 : n.anchor) === "bottom" ? "bottom" : "top" };
    for (let N = v; N < v + Math.max(1, S); N++) for (let P = k; P < k + Math.max(1, T); P++) N === v && P === k || ((o = M[N]) == null ? void 0 : o[P]) === null && (M[N][P] = { colSpan: 1, rowSpan: 1, merged: !0, fill: null, text: null });
  }
  const E = M.map((y, v) => ({ height: $[v] ?? 0, cells: y.map((k) => k ?? { colSpan: 1, rowSpan: 1, merged: !1, fill: null, text: null }) }));
  return { kind: "table", x: u, y: f, w: h - u, h: p - f, rot: 0, flipH: !1, flipV: !1, colWidths: d, rows: E, name: "表格" };
}
function C2(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of De(e, 0, t)) {
    if (n.type !== te.PersistDirectoryAtom) continue;
    const o = n.start + n.len;
    let s = n.start;
    for (; s + 4 <= o; ) {
      const l = e.getUint32(s, !0);
      s += 4;
      const i = l & 1048575, a = l >>> 20;
      for (let c = 0; c < a && s + 4 <= o; c++, s += 4) r.set(i + c, e.getUint32(s, !0));
    }
  }
  return r;
}
function Uo(e, t, r, n, o, s) {
  const l = [];
  for (const i of at(e, t.start, t.start + t.len, te.SlideListWithText)) if (i.instance === r) for (const a of at(e, i.start, i.start + i.len, te.SlidePersistAtom)) {
    if (a.len < 16) continue;
    const c = n.get(e.getUint32(a.start, !0)), u = c !== void 0 ? o.get(c) : void 0;
    u && s.includes(u.type) && l.push({ rec: u, slideId: e.getUint32(a.start + 12, !0) });
  }
  return l;
}
function hr(e, t, r, n) {
  var o, s, l;
  const i = [(o = t.get(ce.OTHER)) == null ? void 0 : o[0], (s = e?.get(ce.OTHER)) == null ? void 0 : s[0]];
  for (const c of r) i.push((l = e?.get(c)) == null ? void 0 : l[0]);
  let a;
  for (const c of i) c?.char[n] !== void 0 && (a = c.char[n]);
  return a;
}
function E2(e, t) {
  const r = (n) => n === void 0 ? "" : t.fonts[n] ?? "";
  return { majorLatin: r(hr(e?.styles, t.envStyles, [ce.TITLE, ce.CENTER_TITLE], "fontIdx")), majorEa: r(hr(e?.styles, t.envStyles, [ce.TITLE, ce.CENTER_TITLE], "asianFontIdx")), minorLatin: r(hr(e?.styles, t.envStyles, [ce.BODY, ce.CENTER_BODY], "fontIdx")), minorEa: r(hr(e?.styles, t.envStyles, [ce.BODY, ce.CENTER_BODY], "asianFontIdx")) };
}
function ps(e, t, r) {
  for (const n of at(e, t.start, t.start + t.len, te.ColorSchemeAtom)) {
    if (n.instance !== r || n.len < 32) continue;
    const o = [];
    for (let s = 0; s < 8; s++) {
      const l = e.getUint32(n.start + s * 4, !0), i = [l & 255, l >> 8 & 255, l >> 16 & 255];
      o.push(i.map((a) => a.toString(16).padStart(2, "0")).join(""));
    }
    return o;
  }
  return null;
}
function Jc(e, t, r, n) {
  const o = ae(e, t.start, t.start + t.len, Me.DgContainer);
  if (!o) return null;
  for (const s of at(e, o.start, o.start + o.len, Me.SpContainer)) {
    const l = ae(e, s.start, s.start + s.len, Me.Sp);
    if (!l || !(el(e, l).flags & ut.BACKGROUND)) continue;
    const i = ae(e, s.start, s.start + s.len, Me.Opt);
    if (!i) continue;
    const a = Ks(e, i);
    if (!a.simple.has(ne.fillColor) && !a.simple.has(ne.fillType) && !a.simple.has(ne.fillBlip)) continue;
    const c = Fc(a, r, n);
    if (c && c.type !== "none") return c;
  }
  return null;
}
function Kc(e, t) {
  const r = [], n = ae(e.dv, t.start, t.start + t.len, Me.DgContainer);
  if (!n) return r;
  for (const o of at(e.dv, n.start, n.start + n.len, Me.SpgrContainer)) r.push(...qc(e, o, { x: 0, y: 0, sx: e.scale, sy: e.scale }));
  return r;
}
function S2(e, t, r) {
  const n = ps(e, t, 1) ?? ps(e, t, 6) ?? tl, o = /* @__PURE__ */ new Map();
  for (const c of at(e, t.start, t.start + t.len, te.TxMasterStyleAtom)) Yc(e, c, o);
  const s = ae(e, t.start, t.start + t.len, te.PPDrawing), l = s ? Jc(e, s, n, (c) => r.blobs[c - 1] ?? null) : null, i = { dv: e, scheme: n, fonts: r.fonts, blobs: r.blobs, listText: [], scale: r.scale, styles: o, envStyles: r.envStyles, links: /* @__PURE__ */ new Map(), masterPass: !0, levelCache: /* @__PURE__ */ new Map(), slideIndex: 1, slideCount: 1, autoNums: jc(e, t), autoNumCursor: 0, edit: r.edit }, a = s ? Kc(i, s) : [];
  return { scheme: n, styles: o, background: l, elements: a };
}
function L2(e, t) {
  const r = [];
  let n = -1;
  const o = (s, l, i) => {
    for (const a of De(e, s, l)) if (a.type === te.TextHeaderAtom && a.len >= 4) n = e.getUint32(a.start, !0);
    else if (a.type === te.TextCharsAtom || a.type === te.TextBytesAtom) {
      if (n === ce.NOTES) {
        const c = (a.type === te.TextCharsAtom ? kt(e, a.start, a.len) : Qr(e, a.start, a.len)).replace(/\r\n?/g, `
`).replace(/\v/g, `
`).replace(/\0/g, "").trim();
        c && r.push(c);
      }
      n = -1;
    } else (a.isContainer || a.type === Me.ClientTextbox) && i < 8 && o(a.start, a.start + a.len, i + 1);
  };
  return o(t.start, t.start + t.len, 0), r.join(`
`);
}
function T2(e, t, r = !1) {
  var n;
  const o = new Sc(e);
  if (o.stream("EncryptedPackage") || o.stream("EncryptionInfo")) throw new Error("该文件是加密的 OOXML 容器，请用 parse(input, { password })");
  let s = o.stream("PowerPoint Document");
  if (!s) throw new Error("无效的 .ppt：找不到 PowerPoint Document 流");
  const l = o.stream("Current User");
  if (am(l) && l) {
    const B = I1();
    if (!B) throw new Error("该 .ppt 已加密，但未注入解密器（setPptDecryptor）");
    if (t === void 0) throw new Nc();
    const Z = B(s, l, t);
    if (!Z) throw new Error("该 .ppt 已加密，但加密结构无法识别");
    s = Z;
  }
  const i = new DataView(s.buffer, s.byteOffset, s.byteLength);
  let a = 720 * (96 / 72), c = 540 * (96 / 72);
  const u = o.stream("Pictures"), f = u ? Tm(u) : [], h = f.map((B) => {
    try {
      return B.mime === "image/emf" || B.mime === "image/wmf" || B.mime === "image/pict" ? sa(B.data) : URL.createObjectURL(new Blob([B.data.slice().buffer], { type: B.mime }));
    } catch {
      return null;
    }
  }), p = /* @__PURE__ */ new Map(), d = [];
  for (const B of De(i, 0, s.length)) p.set(B.start - 8, B), d.push(B);
  const m = [], $ = /* @__PURE__ */ new Map(), x = ae(i, 0, s.length, te.Document), b = (B, Z, Y) => {
    for (const J of De(i, B, Z)) {
      if (J.type === te.DocumentAtom && J.len >= 8) a = i.getInt32(J.start, !0) * vr, c = i.getInt32(J.start + 4, !0) * vr;
      else if (J.type === te.FontEntityAtom) {
        const G = kt(i, J.start, Math.min(J.len, 64)).replace(/\0.*$/, "");
        G && (m[J.instance < 512 ? J.instance : m.length] = G);
      } else J.type === te.TxMasterStyleAtom && Yc(i, J, $);
      J.isContainer && Y < 4 && b(J.start, J.start + J.len, Y + 1);
    }
  };
  x && b(x.start, x.start + x.len, 0);
  const M = { fonts: m, blobs: h, scale: vr, envStyles: $, edit: r }, E = C2(i, s.length), y = (B) => d.filter((Z) => Z.type === B);
  let v = x ? Uo(i, x, 0, E, p, [te.Slide]) : [];
  v.length || (v = y(te.Slide).map((B) => ({ rec: B, slideId: 0 })));
  const k = x ? Uo(i, x, 1, E, p, [te.MainMaster, te.Slide]) : [], T = x ? Uo(i, x, 2, E, p, [te.Notes]) : [], S = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map();
  for (const B of k) N.set(B.slideId, B.rec);
  const P = ((n = k[0]) == null ? void 0 : n.rec) ?? y(te.MainMaster)[0] ?? null, L = (B) => {
    const Z = N.get(B) ?? P;
    if (!Z) return null;
    const Y = Z.start;
    let J = S.get(Y);
    return J || (J = S2(i, Z, M), S.set(Y, J)), J;
  }, A = /* @__PURE__ */ new Map();
  for (const B of T) A.set(B.slideId, B.rec);
  const z = /* @__PURE__ */ new Map();
  for (const B of y(te.Notes)) {
    const Z = ae(i, B.start, B.start + B.len, te.NotesAtom);
    Z && Z.len >= 4 && z.set(i.getUint32(Z.start, !0), B);
  }
  const R = x ? $2(i, x) : /* @__PURE__ */ new Map(), O = v.length;
  let U = null, j = v.map((B, Z) => {
    const Y = ae(i, B.rec.start, B.rec.start + B.rec.len, te.SlideAtom), J = Y && Y.len >= 24 ? i.getUint32(Y.start + 12, !0) : 0, G = Y && Y.len >= 24 ? i.getUint32(Y.start + 16, !0) : 0, le = Y && Y.len >= 24 ? i.getUint16(Y.start + 20, !0) : 7, he = A.get(G) ?? z.get(B.slideId) ?? null, me = L(J);
    return U ?? (U = me), A2(i, B.rec, M, { master: me, followMasterObjects: (le & 1) !== 0, followMasterBackground: (le & 4) !== 0, notes: he ? L2(i, he) : "", hyperlinks: R, index: Z + 1, count: O });
  });
  if (!j.length || j.every((B) => !B.elements.length)) {
    const B = P2(i, s.length, a, c);
    B.length && (j = B);
  }
  if (!j.length) throw new Error(".ppt 中未找到幻灯片");
  const W = r ? h.flatMap((B, Z) => {
    const Y = B != null && B.startsWith("blob:") ? f[Z] : void 0;
    return B && Y ? [{ url: B, mime: Y.mime, bytes: Y.data.slice() }] : [];
  }) : [];
  let X = !1;
  return { width: a, height: c, slides: j, source: "ppt", ...r ? { editInfo: { layouts: [], masters: [], themes: [n2(U?.scheme ?? tl, E2(U, M))], assets: W } } : {}, dispose: () => {
    if (!X) {
      X = !0;
      for (const B of h) if (B != null && B.startsWith("blob:")) try {
        URL.revokeObjectURL(B);
      } catch {
      }
    }
  } };
}
function P2(e, t, r, n) {
  const o = (function f(h, p, d) {
    for (const m of De(e, h, p)) {
      if (m.type === te.SlideListWithText && m.instance === 0) return m;
      if (m.isContainer && d < 4) {
        const $ = f(m.start, m.start + m.len, d + 1);
        if ($) return $;
      }
    }
    return null;
  })(0, t, 0);
  if (!o) return [];
  const s = [];
  let l = null, i = 4;
  for (const f of De(e, o.start, o.start + o.len)) if (f.type === te.SlidePersistAtom) l = { titles: [], bodies: [] }, s.push(l);
  else if (f.type === te.TextHeaderAtom && f.len >= 4) i = e.getUint32(f.start, !0);
  else if (l && (f.type === te.TextCharsAtom || f.type === te.TextBytesAtom)) {
    const h = f.type === te.TextCharsAtom ? kt(e, f.start, f.len) : Qr(e, f.start, f.len);
    (i === 0 || i === 6 ? l.titles : l.bodies).push(h);
  }
  const a = (f, h, p, d) => ({ text: f, b: p, i: !1, u: !1, strike: !1, size: h, color: d, fonts: [] }), c = (f, h) => ({ align: "left", lvl: 0, marL: h ? 24 : 0, indent: h ? -24 : 0, bullet: h, lineHeight: null, spaceBefore: 0, spaceAfter: 6, runs: f }), u = (f) => f.split(/[\r\n\v]/).map((h) => h.trim()).filter(Boolean);
  return s.filter((f) => f.titles.length || f.bodies.length).map((f) => {
    const h = [];
    return f.titles.length && h.push({ kind: "shape", x: r * 0.06, y: n * 0.05, w: r * 0.88, h: n * 0.16, rot: 0, flipH: !1, flipV: !1, path: null, fill: null, stroke: null, text: { anchor: "middle", insets: [4, 8, 4, 8], wrap: !0, fontScale: 1, paragraphs: f.titles.flatMap((p) => u(p).map((d) => c([a(d, 34, !0, "rgb(30,30,30)")], null))) } }), f.bodies.length && h.push({ kind: "shape", x: r * 0.06, y: n * 0.24, w: r * 0.88, h: n * 0.68, rot: 0, flipH: !1, flipV: !1, path: null, fill: null, stroke: null, text: { anchor: "top", insets: [4, 8, 4, 8], wrap: !0, fontScale: 1, paragraphs: f.bodies.flatMap((p) => u(p).map((d) => c([a(d, 20, !1, "rgb(50,50,50)")], "•"))) } }), { background: { type: "solid", color: "rgb(255,255,255)" }, elements: h };
  });
}
function A2(e, t, r, n) {
  var o, s, l;
  const i = t.start + t.len, a = ps(e, t, 1) ?? ((o = n.master) == null ? void 0 : o.scheme) ?? tl, c = [];
  let u = null, f = null, h;
  const p = () => {
    if (f === null) return;
    const k = u ? Xc(e, u, f.length) : { para: [], char: [] };
    c.push({ text: f, paraProps: k.para, charProps: k.char, textType: h }), f = null, u = null, h = void 0;
  };
  for (const k of De(e, t.start, i)) k.type === te.TextHeaderAtom ? (p(), k.len >= 4 && (h = e.getUint32(k.start, !0))) : k.type === te.TextCharsAtom ? f = kt(e, k.start, k.len) : k.type === te.TextBytesAtom ? f = Qr(e, k.start, k.len) : k.type === te.StyleTextPropAtom && (u = k);
  p();
  const d = /* @__PURE__ */ new Map();
  for (const [k, T] of n.hyperlinks) {
    const S = b2(T, n.index, n.count);
    S && d.set(k, S);
  }
  const m = { dv: e, scheme: a, fonts: r.fonts, blobs: r.blobs, listText: c, scale: r.scale, styles: ((s = n.master) == null ? void 0 : s.styles) ?? /* @__PURE__ */ new Map(), envStyles: r.envStyles, links: d, masterPass: !1, levelCache: /* @__PURE__ */ new Map(), slideIndex: n.index, slideCount: n.count, autoNums: jc(e, t), autoNumCursor: 0, edit: r.edit }, $ = [];
  n.master && n.followMasterObjects && $.push(...n.master.elements);
  const x = ae(e, t.start, i, te.PPDrawing);
  x && $.push(...Kc(m, x));
  const b = x ? Jc(e, x, a, (k) => r.blobs[k - 1] ?? null) : null, M = (n.followMasterBackground ? ((l = n.master) == null ? void 0 : l.background) ?? null : null) ?? b ?? { type: "solid", color: zt(134217728, a) }, E = Vm(e, t), y = E?.transition, v = Qm(e, t);
  return { background: M, elements: $, notes: n.notes || void 0, hidden: E != null && E.hidden ? !0 : void 0, transition: y, animations: v };
}
const Rr = /* @__PURE__ */ new WeakMap();
function nl(e) {
  const t = Rr.get(e);
  if (t) return t;
  if (e.disposed) throw new Error("OPC 包已释放，不能重新求值版式");
  const r = new Ia(e);
  r.assetMode = "defer";
  const n = "ppt/presentation.xml", o = r.xml(n);
  if (!o) throw new Error("无效的 .pptx：找不到 ppt/presentation.xml");
  const s = r.rels(n), l = Kt(s, "/tableStyles"), i = {};
  K(w(o, "sldIdLst"), "sldId").forEach((c, u) => {
    var f;
    const h = I(c, "r:id"), p = h ? (f = s[h]) == null ? void 0 : f.target : null;
    p && (i[p] = u + 1);
  });
  const a = { pkg: r, presRoot: o, tableStyles: l ? r.xml(l) : null, slideIdMap: i, authors: _a(r, s) };
  return Rr.set(e, a), a;
}
function F$(e, t, r, n) {
  if (!e.parts[t]) throw new Error(`找不到页面 part：${t}`);
  if (!e.parts[r]) throw new Error(`找不到版式 part：${r}`);
  const o = nl(e), s = o.pkg.beginCacheTrace();
  try {
    return { slide: Ka(o.pkg, t, n, o.presRoot, o.tableStyles, o.slideIdMap, o.authors, !0, r), assets: o.pkg.deferred };
  } finally {
    for (const l of o.pkg.endCacheTrace(s)) l === "ppt/presentation.xml" || l.startsWith("ppt/slideLayouts/") || l.startsWith("ppt/slideMasters/") || l.startsWith("ppt/theme/") || l.startsWith("ppt/tableStyles") || (l.endsWith(".rels") ? o.pkg.forgetXml(l) : o.pkg.forgetPart(l));
  }
}
function U$(e, t) {
  if (!e.parts[t]) throw new Error(`找不到版式 part：${t}`);
  const r = nl(e), n = r.pkg.beginCacheTrace();
  try {
    const o = r.pkg.rels("ppt/presentation.xml"), s = Ls(r.presRoot, o, (i) => r.pkg.xml(i), (i) => r.pkg.rels(i)), l = Ja(r.pkg, r.presRoot, o, r.tableStyles, r.slideIdMap, s.themeByMaster).find((i) => i.id === t);
    if (!l) throw new Error(`版式目录不存在：${t}`);
    return { layout: l, assets: r.pkg.deferred };
  } finally {
    for (const o of r.pkg.endCacheTrace(n)) o === "ppt/presentation.xml" || o.startsWith("ppt/slideLayouts/") || o.startsWith("ppt/slideMasters/") || o.startsWith("ppt/theme/") || o.startsWith("ppt/tableStyles") || (o.endsWith(".rels") ? r.pkg.forgetXml(o) : r.pkg.forgetPart(o));
  }
}
function D$(e, t) {
  if (!e.parts[t]) throw new Error(`找不到母版 part：${t}`);
  const r = nl(e), n = r.pkg.beginCacheTrace();
  try {
    const o = r.pkg.rels("ppt/presentation.xml"), s = Ls(r.presRoot, o, (i) => r.pkg.xml(i), (i) => r.pkg.rels(i)), l = qa(r.pkg, r.presRoot, o, r.tableStyles, r.slideIdMap, s.themeByMaster).find((i) => i.id === t);
    if (!l) throw new Error(`母版目录不存在：${t}`);
    return { master: l, assets: r.pkg.deferred };
  } finally {
    for (const o of r.pkg.endCacheTrace(n)) o === "ppt/presentation.xml" || o.startsWith("ppt/slideLayouts/") || o.startsWith("ppt/slideMasters/") || o.startsWith("ppt/theme/") || o.startsWith("ppt/tableStyles") || (o.endsWith(".rels") ? r.pkg.forgetXml(o) : r.pkg.forgetPart(o));
  }
}
function B$(e) {
  const t = Rr.get(e);
  t && (t.pkg.dispose(), Rr.delete(e));
}
const I2 = /[、。，．：；！？」』】〕）》〉｝］”]/, Qc = /[「『【〔（《〈｛［“]/, mn = (e) => Qc.test(e);
function wn(e) {
  return I2.test(e) || Qc.test(e) ? 0.5 : 0;
}
function rl(e) {
  let t = 0;
  for (const r of e) t += wn(r);
  return t;
}
function eu(e, t) {
  const r = e.length, n = new Array(r).fill(0), o = new Array(r).fill(0);
  let s = 0;
  for (let l = 0; l < r; l++) {
    const i = wn(e[l]);
    !i || !(t || l === 0 && mn(e[l]) || l === r - 1 && !mn(e[l]) || l > 0 && wn(e[l - 1]) > 0) || (o[l] = i, s += i, mn(e[l]) ? n[l] -= i : l + 1 < r && (n[l + 1] -= i));
  }
  return { dx: n, amount: o, total: s };
}
function N2(e) {
  const t = e.codePointAt(0) ?? 0;
  return t >= 4352 && t <= 4447 || t >= 11904 && t <= 12350 || t >= 12353 && t <= 13311 || t >= 13312 && t <= 19903 || t >= 19968 && t <= 40959 || t >= 40960 && t <= 42191 || t >= 44032 && t <= 55203 || t >= 63744 && t <= 64255 || t >= 65072 && t <= 65135 || t >= 65280 && t <= 65376 || t >= 65504 && t <= 65510 || t >= 131072 && t <= 262141;
}
const oe = (e) => e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"), C = (e) => Number.isFinite(e) ? String(Math.round(e * 100) / 100) : "0";
function zr(e) {
  return e.replace(/['"\\<>&\u0000-\u001f\u007f]/gu, (t) => `\\${t.codePointAt(0).toString(16)} `);
}
const R2 = "'Cambria Math','Latin Modern Math','STIX Two Math','Times New Roman',serif", bi = { "̀": "ˋ", "́": "ˊ", "̂": "ˆ", "̃": "˜", "̆": "˘", "̇": "˙", "̈": "¨", "̊": "˚", "̌": "ˇ", "⃖": "←", "⃗": "→", "⃡": "↔", "⃛": "⋯", "⃜": "⋯" }, dr = /* @__PURE__ */ new Set(["̅", "̄", "‾", "¯", "̲", "̳", "_"]), z2 = /* @__PURE__ */ new Set(["⏞", "⏟", "⎴", "⎵", "⏜", "⏝"]), Do = 0.72, O2 = 0.5, ln = (e, t) => ({ ...e, size: Math.max(e.size * t, e.size * O2) });
function Un() {
  return { w: 0, h: 0, d: 0, draw: () => "" };
}
const Or = 0.72, jr = 0.22;
function tu(e, t, r, n, o, s, l = "") {
  const i = `font-family:${R2};font-size:${C(t.size)}px;` + (r ? "font-style:italic;" : "") + (n ? "font-weight:700;" : "");
  return l ? `<text x="0" y="0" style="${i}" fill="${t.color}" xml:space="preserve" transform="${l}">${oe(e)}</text>` : `<text x="${C(o)}" y="${C(s)}" style="${i}" fill="${t.color}" xml:space="preserve">${oe(e)}</text>`;
}
function Tt(e, t, r, n) {
  return { w: t.measure(e, t.size, r, n), h: t.size * Or, d: t.size * jr, draw: (o, s) => tu(e, t, r, n, o, s) };
}
function xi(e, t, r, n) {
  const o = Tt(e, t, !1, !1), s = t.size * (Or + jr), l = r + n;
  if (l <= s * 1.02) return o;
  const i = l / s, a = (n - r) / 2 + (Or - jr) / 2 * t.size * i;
  return { w: o.w, h: r, d: n, draw: (c, u) => tu(e, t, !1, !1, 0, 0, `translate(${C(c)} ${C(u + a)}) scale(1 ${C(i)})`) };
}
function j2(e, t, r) {
  return { w: e, h: t, d: 0, draw: (n, o) => `<rect x="${C(n)}" y="${C(o - t)}" width="${C(e)}" height="${C(t)}" fill="${r}"/>` };
}
function an(e) {
  if (!e.length) return Un();
  const t = e.reduce((o, s) => o + s.w, 0), r = Math.max(...e.map((o) => o.h)), n = Math.max(...e.map((o) => o.d));
  return { w: t, h: r, d: n, draw: (o, s) => {
    let l = o;
    const i = [];
    for (const a of e) i.push(a.draw(l, s)), l += a.w;
    return i.join("");
  } };
}
function pr(e, t, r) {
  if (!e.length) return Un();
  const n = Math.max(...e.map((l) => l.w));
  let o = 0, s = 0;
  return e.forEach((l, i) => {
    i < r ? o += l.h + l.d + t : i === r ? (o += l.h, s += l.d) : s += l.h + l.d + t;
  }), { w: n, h: o, d: s, draw: (l, i) => {
    let a = i - o;
    const c = [];
    for (const u of e) a += u.h, c.push(u.draw(l + (n - u.w) / 2, a)), a += u.d + t;
    return c.join("");
  } };
}
function Ce(e, t) {
  return an(e.map((r) => F2(r, t)));
}
function F2(e, t) {
  var r, n;
  switch (e.kind) {
    case "run": {
      const o = e.sty ?? "i", s = /^[\d\s.,+\-=<>()[\]{}|/*]+$/.test(e.text);
      return Tt(e.text, t, (o === "i" || o === "bi") && !s, o === "b" || o === "bi");
    }
    case "frac": {
      if (e.type === "lin") return an([Ce(e.num, t), Tt("/", t, !1, !1), Ce(e.den, t)]);
      if (e.type === "skw") {
        const d = ln(t, 0.85);
        return an([Ce(e.num, d), Tt("⁄", t, !1, !1), Ce(e.den, d)]);
      }
      const o = ln(t, 0.9), s = Ce(e.num, o), l = Ce(e.den, o), i = t.size * 0.22, a = Math.max(s.w, l.w) + i * 2, c = Math.max(0.6, t.size * 0.055), u = t.size * 0.28, f = t.size * 0.18, h = u + c + f + s.h + s.d, p = -u + c + f + l.h + l.d;
      return { w: a, h, d: p, draw: (d, m) => {
        const $ = m - u, x = [s.draw(d + (a - s.w) / 2, $ - f - s.d), l.draw(d + (a - l.w) / 2, $ + c + f + l.h)];
        return e.type !== "noBar" && x.push(`<rect x="${C(d + i * 0.4)}" y="${C($)}" width="${C(a - i * 0.8)}" height="${C(c)}" fill="${t.color}"/>`), x.join("");
      } };
    }
    case "rad": {
      const o = Ce(e.base, t), s = Math.max(0.6, t.size * 0.05), l = t.size * 0.12, i = t.size * 0.55, a = e.deg.length ? Ce(e.deg, ln(t, 0.55)) : null, c = a ? Math.max(0, a.w - i * 0.35) : 0, u = o.h + l + s, f = o.d, h = c + i + o.w + t.size * 0.12;
      return { w: h, h: Math.max(u, a ? u + a.h * 0.3 : u), d: f, draw: (p, d) => {
        const m = p + c, $ = d - u, x = d + f, b = [`<path d="${`M ${C(m)} ${C(x - (x - $) * 0.45)} L ${C(m + i * 0.3)} ${C(x - (x - $) * 0.3)} L ${C(m + i * 0.62)} ${C(x)} L ${C(m + i)} ${C($)} L ${C(p + h)} ${C($)}`}" fill="none" stroke="${t.color}" stroke-width="${C(s)}" stroke-linejoin="miter"/>`, o.draw(m + i + t.size * 0.06, d)];
        return a && b.push(a.draw(p, d - (x - $) * 0.42)), b.join("");
      } };
    }
    case "script": {
      const o = e.base.length ? Ce(e.base, t) : Un(), s = ln(t, Do), l = (r = e.sup) != null && r.length ? Ce(e.sup, s) : null, i = (n = e.sub) != null && n.length ? Ce(e.sub, s) : null, a = t.size * 0.42, c = t.size * 0.22;
      return { w: o.w + Math.max(l?.w ?? 0, i?.w ?? 0) + t.size * 0.04, h: Math.max(o.h, l ? a + l.h : 0), d: Math.max(o.d, i ? c + i.d : 0), draw: (u, f) => {
        const h = [o.draw(u, f)], p = u + o.w + t.size * 0.02;
        return l && h.push(l.draw(p, f - a)), i && h.push(i.draw(p, f + c)), h.join("");
      } };
    }
    case "nary": {
      const o = { ...t, size: t.size * 1.45 }, s = Tt(e.chr, o, !1, !1), l = ln(t, Do), i = e.sup.length ? Ce(e.sup, l) : null, a = e.sub.length ? Ce(e.sub, l) : null, c = Ce(e.base, t);
      if (e.underOver) {
        const d = [];
        i && d.push(i), d.push(s), a && d.push(a);
        const m = pr(d, t.size * 0.08, i ? 1 : 0);
        return an([m, { ...Un(), w: t.size * 0.12 }, c]);
      }
      const u = t.size * 0.55, f = t.size * 0.45, h = Math.max(i?.w ?? 0, a?.w ?? 0), p = { w: s.w + h + t.size * 0.06, h: Math.max(s.h, i ? u + i.h : 0), d: Math.max(s.d, a ? f + a.d : 0), draw: (d, m) => {
        const $ = [s.draw(d, m)];
        return i && $.push(i.draw(d + s.w + t.size * 0.04, m - u)), a && $.push(a.draw(d + s.w + t.size * 0.04, m + f)), $.join("");
      } };
      return an([p, { ...Un(), w: t.size * 0.1 }, c]);
    }
    case "delim": {
      const o = [];
      e.items.forEach((h, p) => {
        p > 0 && e.sep && o.push(Tt(e.sep, t, !1, !1)), o.push(Ce(h, t));
      });
      const s = an(o), l = t.size * 0.06, i = Math.max(s.h + l, t.size * Or), a = Math.max(s.d + l, t.size * jr), c = e.beg && e.beg !== " " ? xi(e.beg, t, i, a) : null, u = e.end && e.end !== " " ? xi(e.end, t, i, a) : null, f = [c, s, u].filter((h) => h !== null);
      return { w: f.reduce((h, p) => h + p.w, 0), h: Math.max(s.h, c ? c.h : 0), d: Math.max(s.d, c ? c.d : 0), draw: (h, p) => {
        let d = h;
        const m = [];
        for (const $ of f) m.push($.draw(d, p)), d += $.w;
        return m.join("");
      } };
    }
    case "matrix": {
      const o = e.rows.map((d) => d.map((m) => Ce(m, t))), s = Math.max(0, ...o.map((d) => d.length)), l = [];
      for (let d = 0; d < s; d++) l.push(Math.max(0, ...o.map((m) => {
        var $;
        return (($ = m[d]) == null ? void 0 : $.w) ?? 0;
      })));
      const i = t.size * 0.5, a = t.size * 0.35, c = o.map((d) => Math.max(t.size * 0.72, ...d.map((m) => m.h))), u = o.map((d) => Math.max(t.size * 0.22, ...d.map((m) => m.d))), f = l.reduce((d, m) => d + m, 0) + i * Math.max(0, s - 1), h = c.reduce((d, m, $) => d + m + u[$], 0) + a * Math.max(0, o.length - 1), p = t.size * 0.28;
      return { w: f, h: h / 2 + p, d: h / 2 - p, draw: (d, m) => {
        const $ = [];
        let x = m - (h / 2 + p);
        return o.forEach((b, M) => {
          x += c[M];
          let E = d;
          b.forEach((y, v) => {
            $.push(y.draw(E + (l[v] - y.w) / 2, x)), E += l[v] + i;
          }), x += u[M] + a;
        }), $.join("");
      } };
    }
    case "acc": {
      const o = Ce(e.base, t), s = t.size * 0.9, l = e.chr.trim(), i = Math.max(0.6, t.size * 0.05), a = t.size * (dr.has(e.chr) || dr.has(e.chr.trim()) ? 0.06 : 0.02);
      let c;
      if (dr.has(e.chr) || dr.has(l)) c = j2(o.w, i, t.color);
      else if (z2.has(l)) {
        const u = Tt(l, { ...t, size: s }, !1, !1), f = u.w > 0 ? o.w / u.w : 1;
        c = { w: o.w, h: u.h, d: u.d, draw: (h, p) => `<g transform="translate(${C(h)} ${C(p)}) scale(${C(f)} 1)">${u.draw(0, 0)}</g>` };
      } else {
        const u = bi[l] ?? bi[e.chr] ?? (l || "^"), f = Tt(u, { ...t, size: s }, !1, !1), h = f.w > o.w * 1.1 && o.w > 0 ? o.w * 1.1 / f.w : 1;
        c = h === 1 ? f : { w: f.w * h, h: f.h, d: f.d, draw: (p, d) => `<g transform="translate(${C(p)} ${C(d)}) scale(${C(h)} 1)">${f.draw(0, 0)}</g>` };
      }
      return e.below ? { w: Math.max(o.w, c.w), h: o.h, d: o.d + a + c.h + c.d, draw: (u, f) => o.draw(u + (Math.max(o.w, c.w) - o.w) / 2, f) + c.draw(u + (Math.max(o.w, c.w) - c.w) / 2, f + o.d + a + c.h) } : { w: Math.max(o.w, c.w), h: o.h + a + c.h, d: o.d, draw: (u, f) => o.draw(u + (Math.max(o.w, c.w) - o.w) / 2, f) + c.draw(u + (Math.max(o.w, c.w) - c.w) / 2, f - o.h - a) };
    }
    case "lim": {
      const o = Ce(e.base, t), s = Ce(e.limit, ln(t, Do));
      return e.below ? pr([o, s], t.size * 0.08, 0) : pr([s, o], t.size * 0.08, 1);
    }
    case "stack": {
      const o = e.rows.map((s) => Ce(s, t));
      return pr(o, t.size * 0.3, Math.floor((o.length - 1) / 2));
    }
  }
}
function U2(e, t, r, n) {
  const o = Ce(e, { size: t, measure: n, color: r });
  return { w: o.w, h: o.h, d: o.d, svg: o.draw(0, 0) };
}
const D2 = "'Cambria Math','Latin Modern Math','STIX Two Math','Times New Roman',serif", wi = ["'PingFang SC'", "'Hiragino Sans GB'", "'Microsoft YaHei'", "sans-serif"], B2 = { boldSizeAdjust: 95.4, underscoreSizeAdjust: 74.6 }, ol = "WebPPT DengXian Latin", H2 = [`'${ol}'`, "'Arial'", "'Helvetica'", "'Arimo'", "'Liberation Sans'"], yi = ["Arial", "ArialMT", "Helvetica", "Arimo", "Arimo-Regular", "Liberation Sans", "LiberationSans"], vi = ["Arial Bold", "Arial-BoldMT", "Helvetica Bold", "Helvetica-Bold", "Arimo Bold", "Arimo-Bold", "Liberation Sans Bold", "LiberationSans-Bold"];
function W2(e) {
  return /^(等线|dengxian)$/i.test(e.fonts[0] ?? "");
}
function V2() {
  const { boldSizeAdjust: e, underscoreSizeAdjust: t } = B2, r = (n, o, s) => `@font-face{font-family:'${ol}';src:${n.map((l) => `local('${l}')`).join(",")};font-weight:${o};${s}}`;
  return r(yi, "1 599", "") + r(vi, "600 1000", `size-adjust:${e}%;`) + r(yi, "1 599", `unicode-range:U+5F;size-adjust:${t}%;`) + r(vi, "600 1000", `unicode-range:U+5F;size-adjust:${t}%;`);
}
let mr = null, Mi = !1;
function nu() {
  if (Mi) return mr;
  Mi = !0;
  try {
    const e = document.createElement("canvas").getContext("2d");
    mr = e && typeof e.measureText == "function" ? e : null;
  } catch {
    mr = null;
  }
  return mr;
}
function ki(e, t) {
  const r = [], n = /* @__PURE__ */ new Set();
  for (const o of e) {
    const s = o.toLowerCase();
    o && !n.has(s) && (n.add(s), r.push(`'${zr(o)}'`));
  }
  for (const o of t) {
    const s = o.replace(/'/g, "").toLowerCase();
    n.has(s) || (n.add(s), r.push(o));
  }
  return r.join(",");
}
function sl(e) {
  const t = W2(e) ? [...H2, ...wi] : wi;
  return e.fonts.length ? ki(e.fonts, t) : ki(["Helvetica", "Arial"], t);
}
function Ht(e, t) {
  const r = e.size * t;
  return e.baseline ? r * 0.65 : r;
}
function X2(e, t, r, n) {
  const o = nu();
  return o ? (o.font = `${r ? "italic " : ""}${n ? "700 " : "400 "}${t}px ${D2}`, o.measureText(e).width) : e.length * t * 0.55;
}
const Nn = /* @__PURE__ */ new Map();
function eo(e, t) {
  var r;
  if (!((r = e.math) != null && r.length)) return null;
  const n = e.size * t, o = `${n}|${e.color}|${JSON.stringify(e.math)}`;
  let s = Nn.get(o);
  return s || (s = U2(e.math, n, e.color, X2), Nn.size > 512 && Nn.clear(), Nn.set(o, s)), s;
}
function H$() {
  Nn.clear();
}
function Fr(e, t, r, n) {
  var o, s;
  if ((o = t.math) != null && o.length) return ((s = eo(t, r)) == null ? void 0 : s.w) ?? 0;
  if (n) {
    const a = n(e, t, r);
    return Number.isFinite(a) && a > 0 ? a : 0;
  }
  if (!e) return 0;
  const l = nu(), i = Ht(t, r);
  if (!l) {
    let a = 0;
    for (const c of e) a += N2(c) ? i : i * 0.55;
    return a;
  }
  return l.font = `${t.i ? "italic " : ""}${t.b ? "700 " : "400 "}${i}px ${sl(t)}`, l.measureText(e).width + (t.spacing ?? 0) * e.length;
}
const Y2 = (e) => e.squeezed ? e.width - e.squeeze : e.width;
function G2(e) {
  const t = [], r = e.run.text;
  for (let n = e.from; n < e.to; ) {
    const o = r.codePointAt(n), s = String.fromCodePoint(o), l = Math.min(e.to, n + s.length);
    t.push({ from: n, to: l, display: e.run.caps === "all" ? s.toUpperCase() : s }), n = l;
  }
  return t;
}
function Z2(e, t, r, n, o) {
  const s = e.width - (r ? e.squeeze : 0);
  if (e.atomic) return [{ offset: e.from, x: t }, { offset: e.to, x: t + s }];
  const l = G2(e);
  if (!l.length) return [{ offset: e.from, x: t }];
  const i = l.map((p) => Fr(p.display, e.run, n, o)), a = i.reduce((p, d) => p + d, 0), c = a > 0 ? e.width / a : 0, u = a > 0 ? 0 : e.width / l.length;
  let f = t;
  const h = [{ offset: l[0].from, x: f }];
  return l.forEach((p, d) => {
    const m = r ? wn(p.display) * Ht(e.run, n) : 0;
    m && mn(p.display) && (f -= m, h[h.length - 1].x = f), f += a > 0 ? i[d] * c : u, m && !mn(p.display) && (f -= m), h.push({ offset: p.to, x: f });
  }), h[h.length - 1].x = t + s, h;
}
function _2(e, t, r, n, o, s) {
  let l = t;
  const i = e.segs.map((c) => {
    const u = c.width - (e.squeezed ? rl(c.text) * Ht(c.run, r) : 0), f = [];
    let h = l;
    if (o && !c.bullet) for (const d of c.tokens ?? []) {
      const m = Z2(d, h, e.squeezed, r, s);
      f.length && m.length && f[f.length - 1].offset === m[0].offset && m.shift(), f.push(...m), h += d.width - (e.squeezed ? d.squeeze : 0);
    }
    const p = { runIndex: c.runIndex ?? -1, from: c.from ?? 0, to: c.to ?? 0, text: c.text, x: l, width: u, naturalWidth: c.width, bullet: c.bullet === !0, atomic: c.atomic === !0, carets: c.bullet ? [] : f };
    return l += u, p;
  });
  if (!n) return i;
  const a = t * 2 + Y2(e);
  for (const c of i) c.carets.length ? (c.carets = c.carets.map((u) => ({ ...u, x: a - u.x })), c.x = Math.min(...c.carets.map((u) => u.x))) : c.x = a - c.x - c.width;
  return i;
}
const q2 = /* @__PURE__ */ new Set(["textArchUp", "textArchDown", "textArchUpPour", "textArchDownPour", "textCircle", "textWave1", "textWave2", "textCurveUp", "textCurveDown", "textCanUp", "textCanDown", "textTriangle", "textChevron", "textInflate", "textDeflate"]), Ur = (e) => !!e && q2.has(e);
function J2(e) {
  return e === "dbl" ? "double" : e === "dotted" || e === "dottedHeavy" ? "dotted" : e.startsWith("wavy") ? "wavy" : e === "dash" || e === "dashHeavy" || e === "dashLong" || e === "dashLongHeavy" || e.startsWith("dotDash") || e.startsWith("dotDotDash") ? "dashed" : "solid";
}
const K2 = (e) => e === "heavy" || e.endsWith("Heavy");
function Q2(e) {
  const t = e.underline ?? (e.u ? "sng" : "none"), r = e.strikeType ?? (e.strike ? "sngStrike" : "noStrike"), n = e.underlineColor ? `;text-decoration-color:${e.underlineColor}` : "", o = K2(t) ? ";text-decoration-thickness:0.12em" : "", s = t === "words" ? ";text-decoration-skip-spaces:all" : "";
  return { ...t !== "none" ? { underline: `text-decoration-line:underline;text-decoration-style:${J2(t)}${n}${o}${s}` } : {}, ...r !== "noStrike" ? { strike: `text-decoration-line:line-through;text-decoration-style:${r === "dblStrike" ? "double" : "solid"}` } : {} };
}
function ru(e, t, r, n = t.color) {
  const o = Q2(t);
  let s = e;
  return o.strike && (s = `<${r} style="${o.strike}">${s}</${r}>`), o.underline && (s = r === "tspan" && t.underlineColor ? `<tspan style="${o.underline}" fill="${oe(t.underlineColor)}"><tspan fill="${oe(n)}">${s}</tspan></tspan>` : `<${r} style="${o.underline}">${s}</${r}>`), s;
}
function ll(e) {
  return { text: e.text, b: !1, i: !1, u: !1, strike: !1, size: e.size, color: e.color, fonts: [...e.fonts] };
}
function eg(e) {
  if (e.caps !== "all") {
    const o = Array.from({ length: e.text.length + 1 }, (s, l) => l);
    return { text: e.text, starts: o, ends: o };
  }
  let t = "";
  const r = [0], n = [0];
  for (let o = 0; o < e.text.length; ) {
    const s = e.text.codePointAt(o), l = String.fromCodePoint(s), i = o + l.length, a = l.toUpperCase(), c = t.length;
    t += a;
    for (let u = 0; u <= a.length; u++) r[c + u] = u === a.length ? i : o, n[c + u] = u === 0 ? o : i;
    o = i;
  }
  return { text: t, starts: r, ends: n };
}
function ou(e, t, r) {
  var n;
  const o = [];
  for (const s of e) {
    const { run: l, runIndex: i, bullet: a } = s;
    if ((n = l.math) != null && n.length) {
      o.push({ text: l.text, run: l, runIndex: i, from: 0, to: l.text.length, bullet: a, atomic: !0, width: Fr(l.text, l, t, r), br: !1, space: !1, squeeze: 0 });
      continue;
    }
    const c = eg(l), u = c.text;
    if (!u) continue;
    const f = u.matchAll(/\n|[^\S\n]+|[⺀-鿿가-퟿＀-｠　-〿]|[^\s⺀-鿿가-퟿＀-｠　-〿]+/g);
    for (const h of f) {
      const p = h[0], d = h.index, m = d + p.length;
      o.push({ text: p, run: l, runIndex: i, from: c.starts[d] ?? 0, to: c.ends[m] ?? l.text.length, bullet: a, atomic: !1, width: p === `
` ? 0 : Fr(p, l, t, r), br: p === `
`, space: /^[^\S\n]+$/.test(p), squeeze: rl(p) * Ht(l, t) });
    }
  }
  return o;
}
const tg = (e) => e.squeezed ? e.width - e.squeeze : e.width - e.baseSqueeze;
function ng(e) {
  const t = [], r = [];
  for (const s of e.segs) for (const l of s.text) t.push(l), r.push(s.run.size);
  const n = eu(t, !1);
  let o = 0;
  for (let s = 0; s < t.length; s++) o += n.amount[s] * r[s];
  return o;
}
function rg(e, t) {
  var r;
  const n = e.segs[e.segs.length - 1];
  n && n.run === t.run && n.to === t.from && n.bullet === t.bullet ? (n.text += t.text, n.width += t.width, n.to = t.to, n.atomic || (n.atomic = t.atomic), n.tokens.push(t)) : e.segs.push({ text: t.text, run: t.run, runIndex: t.runIndex, from: t.from, to: t.to, bullet: t.bullet, atomic: t.atomic, tokens: [t], width: t.width }), e.width += t.width, e.squeeze += t.squeeze;
  const o = (r = t.run.math) != null && r.length ? eo(t.run, 1) : null;
  e.size = Math.max(e.size, o ? (o.h + o.d) / 1.2 : t.run.size);
}
function su(e, t, r, n) {
  const o = [], s = () => ({ segs: [], width: 0, size: 0, squeeze: 0, squeezed: !1, baseSqueeze: 0 });
  let l = s(), i = Math.max(1, t - Math.max(0, n));
  const a = () => {
    l.squeezed = l.width > i && l.width - l.squeeze <= i, l.baseSqueeze = l.squeezed ? 0 : ng(l), o.push(l), l = s(), i = Math.max(1, t);
  };
  for (const c of e) {
    if (c.br) {
      a();
      continue;
    }
    const u = l.width + c.width - (l.squeeze + c.squeeze) <= i;
    if (r && l.width > 0 && !u) {
      if (c.space) continue;
      a();
    }
    rg(l, c);
  }
  return a(), o;
}
function og(e, t, r, n, o) {
  if (t <= 0 || !e.runs.some((l) => rl(l.text) > 0)) return !1;
  const s = e.runs.map((l, i) => ({ run: l, runIndex: i, bullet: !1 }));
  return su(ou(s, r, o), t, n, e.indent).some((l) => l.squeezed);
}
const sg = { left: "start", center: "middle", right: "end", justify: "start" };
function lu(e, t, r, n) {
  return e.paragraphs.map((o) => {
    const s = o.runs[0], l = o.bullet && s ? ll({ ...s, text: `${o.bullet} `, size: s.size * (o.bulletSize ?? 1), color: o.bulletColor ?? s.color }) : null, i = [...l ? [{ run: l, runIndex: -1, bullet: !0 }] : [], ...o.runs.map((f, h) => ({ run: f, runIndex: h, bullet: !1 }))], a = Math.max(1, t - Math.max(0, o.marL)), c = su(ou(i, r, n), a, e.wrap, o.indent), u = c.map((f) => (f.size || s?.size || 18) * r * (o.lineHeight ?? 1.2));
    return { lines: c, para: o, before: o.spaceBefore, after: o.spaceAfter, lineHeights: u };
  });
}
function Ci(e, t, r, n) {
  return lu(e, t, r, n).reduce((o, s) => o + s.before + s.after + s.lineHeights.reduce((l, i) => l + i, 0), 0);
}
function lg(e, t, r, n, o = {}) {
  const [s, l, i, a] = o.insets ?? e.insets, c = o.vert ?? e.vert ?? "horz", u = c === "vert" || c === "wordArtVert" || c === "vert270" ? r : t, f = c === "vert" || c === "wordArtVert" || c === "vert270" ? t : r, h = Math.max(1, u - a - l), p = Math.max(1, f - s - i);
  if (Ci(e, h, 1, n) <= p) return 1;
  let d = ig, m = 1;
  for (let $ = 0; $ < 12; $++) {
    const x = (d + m) / 2;
    Ci(e, h, x, n) <= p ? d = x : m = x;
  }
  return d;
}
const ig = 0.25;
function il(e, t, r, n, o = {}) {
  const s = Number.isFinite(e.fontScale) && e.fontScale > 0 ? e.fontScale : 1;
  return !e.autoFitCompute || e.autoFitShape ? s : s * lg(e, t, r, n, o);
}
function ag(e) {
  const t = [];
  return e.forEach((r, n) => {
    r.lines.forEach((o, s) => {
      t.push({ lp: r, line: o, paragraphIndex: n, li: s, h: r.lineHeights[s] + (s === 0 ? r.before : 0) + (s === r.lines.length - 1 ? r.after : 0), padTop: s === 0 ? r.before : 0 });
    });
  }), t;
}
const Ei = (e) => e.reduce((t, r) => t + r.h, 0);
function to(e, t, r, n = {}) {
  var o, s;
  const l = n.vert ?? e.vert ?? "horz", i = Number.isFinite(n.scale) && n.scale > 0 ? n.scale : il(e, t, r, n.measureText, { insets: n.insets, vert: n.vert }), a = e.autoFitShape ? "shape" : e.autoFitNormal || e.autoFitCompute ? "normal" : "none";
  if (l === "vert" || l === "wordArtVert" || l === "vert270") {
    const y = to({ ...e, vert: void 0 }, r, t, { ...n, vert: "horz", scale: i }), [, v, , k] = n.insets ?? e.insets, T = y.lines.some((S) => S.x < k - 1e-9 || S.x + S.width > r - v + 1e-9);
    return { ...y, width: t, height: r, layoutWidth: r, layoutHeight: t, scale: i, autoFit: a, vert: l, transform: l === "vert270" ? [0, -1, 1, 0, 0, r] : [0, 1, -1, 0, t, 0], unwarped: Ur((o = e.warp) == null ? void 0 : o.preset), overflow: y.overflow || T };
  }
  const [c, u, f, h] = n.insets ?? e.insets, p = Math.max(1, t - h - u), d = Math.max(1, Math.min(Math.floor(e.columns ?? 1), 16)), m = e.columnGap ?? 0, $ = d === 1 ? p : Math.max(1, (p - m * (d - 1)) / d), x = ag(lu(e, $, i, n.measureText)), b = [[]];
  if (d === 1) b[0].push(...x);
  else {
    const y = Math.max(1, r - c - f);
    let v = 0;
    for (const k of x) v > 0 && v + k.h > y && b.length < d && (b.push([]), v = 0), b[b.length - 1].push(k), v += k.h;
  }
  const M = n.anchor ?? e.anchor, E = [];
  return b.forEach((y, v) => {
    let k = c;
    const T = Ei(y);
    M === "middle" ? k = c + Math.max(0, (r - c - f - T) / 2) : M === "bottom" && (k = Math.max(c, r - f - T));
    const S = h + v * ($ + m);
    for (const { lp: N, line: P, paragraphIndex: L, li: A, padTop: z } of y) {
      k += z;
      const R = N.lineHeights[A], O = k + R * 0.78, U = A === 0 ? N.para.indent : 0, j = S + Math.max(0, N.para.marL) + U, W = sg[N.para.align], X = W === "middle" ? S + $ / 2 : W === "end" ? S + $ : j, B = tg(P), Z = W === "middle" ? X - B / 2 : W === "end" ? X - B : X, Y = N.para.rtl === !0;
      E.push({ paragraphIndex: L, lineIndex: A, columnIndex: v, x: Z, y: k, width: B, naturalWidth: P.width, height: R, baseline: O, anchorX: X, align: N.para.align, rtl: Y, squeezed: P.squeezed, segments: _2(P, Z, i, Y, n.includeCarets !== !1, n.measureText) }), k += R + (A === N.lines.length - 1 ? N.after : 0);
    }
  }), { width: t, height: r, layoutWidth: t, layoutHeight: r, scale: i, autoFit: a, columns: d, vert: l, transform: [1, 0, 0, 1, 0, 0], unwarped: Ur((s = e.warp) == null ? void 0 : s.preset), overflow: b.some((y) => Ei(y) > r - c - f + 1e-9), lines: E };
}
function cg(e) {
  return e.startsWith("slide:") ? `data-slide="${oe(e.slice(6))}" tabindex="0" role="link" style="cursor:pointer;text-decoration:underline"` : Ma(e) ? `href="${oe(e)}" target="_blank" rel="noopener noreferrer"` : `data-unsafe-href="${oe(e)}" aria-disabled="true"`;
}
function no(e, t) {
  return t ? `<a ${cg(t)}>${e}</a>` : e;
}
const ug = { top: "flex-start", middle: "center", bottom: "flex-end" }, fg = { vert: "writing-mode:vertical-rl;", vert270: "writing-mode:vertical-rl;transform:rotate(180deg);", wordArtVert: "writing-mode:vertical-rl;text-orientation:upright;" }, hg = ["'PingFang SC'", "'Hiragino Sans GB'", "'Microsoft YaHei'", "sans-serif"];
function dg(e, t) {
  const r = [], n = /* @__PURE__ */ new Set();
  for (const o of e) {
    const s = o.toLowerCase();
    o && !n.has(s) && (n.add(s), r.push(`'${zr(o)}'`));
  }
  for (const o of t) {
    const s = o.replace(/'/g, "").toLowerCase();
    n.has(s) || (n.add(s), r.push(o));
  }
  return r.join(",");
}
function pg(e, t) {
  const r = e.size * t;
  let n = `font-size:${C(r)}px;`;
  return n += e.gradient ? `background-image:${e.gradient};-webkit-background-clip:text;background-clip:text;color:transparent;` : `color:${e.color};`, e.b && (n += "font-weight:700;"), e.i && (n += "font-style:italic;"), e.fonts.length && (n += `font-family:${sl(e)};`), e.spacing && (n += `letter-spacing:${C(e.spacing)}px;`), e.caps === "all" ? n += "text-transform:uppercase;" : e.caps === "small" && (n += "font-variant:small-caps;"), e.highlight && (n += `background-color:${e.highlight};`), e.outline && (n += `-webkit-text-stroke:${C(e.outline.width)}px ${e.outline.color};`), e.shadow && (n += `text-shadow:${e.shadow};`), e.baseline && (n += `vertical-align:${e.baseline > 0 ? "super" : "sub"};font-size:${C(r * 0.65)}px;`), n;
}
function mg(e, t) {
  const r = [...e];
  let n = "";
  for (let o = 0; o < r.length; o++) {
    const s = r[o];
    if (s === `
`) {
      n += "<br/>";
      continue;
    }
    const l = wn(s);
    if (!l || !(t || o > 0 && wn(r[o - 1]) > 0)) {
      n += oe(s);
      continue;
    }
    n += `<span style="margin-${mn(s) ? "left" : "right"}:-${l}em">${oe(s)}</span>`;
  }
  return n;
}
function iu(e, t, r, n) {
  var o;
  if ((o = e.math) != null && o.length) {
    const a = eo(e, t);
    if (a && a.w > 0) return `<svg${n} xmlns="http://www.w3.org/2000/svg" width="${C(a.w)}" height="${C(a.h + a.d)}" viewBox="0 ${C(-a.h)} ${C(a.w)} ${C(a.h + a.d)}" style="display:inline-block;vertical-align:${C(-a.d)}px;overflow:visible">${a.svg}</svg>`;
  }
  const s = !e.text, l = e.text ? mg(e.text, r) : "&#160;", i = `<span${n}${n && s ? ' data-empty="true"' : ""} style="${oe(pg(e, t))}">${ru(l, e, "span")}</span>`;
  return no(i, e.link);
}
function gg(e, t, r, n) {
  const o = n.scale, s = Number.isFinite(o) && o > 0 ? o : il(e, t, r, n.measureText, { insets: n.insets, vert: n.vert });
  return s === e.fontScale ? e : { ...e, fontScale: s };
}
function Si(e, t, r, n) {
  return ` data-r="${e}.${t}" data-from="${r}" data-to="${n}"`;
}
function Bo(e, t, r, n, o, s, l, i = !1) {
  const a = iu({ ...e, text: t }, r, n, o), c = `position:absolute;left:${C(s)}px;top:0;height:${C(l)}px;line-height:${C(l)}px;white-space:pre;` + (i ? "width:0;overflow:hidden;opacity:0;" : "overflow:visible;");
  return `<span data-engine-${i ? "semantic" : "segment"}="true" style="${oe(c)}">${a}</span>`;
}
function $g(e, t, r, n) {
  var o;
  const s = e.paragraphs[t], l = r.map((m) => ({ line: m, pieces: [] }));
  if (!l.length) return `<div data-p="${t}"></div>`;
  const i = s.runs.map(() => 0), a = s.runs.map(() => !1);
  let c = 0, u = l[0];
  const f = (m, $, x, b, M) => {
    const E = s.runs[m], y = !E.text.length;
    x <= $ && (!y || a[m]) || (a[m] || (a[m] = y), b.pieces.push(Bo(E, E.text.slice($, x), n, b.line.squeezed, Si(t, m, $, x), M - b.line.x, b.line.height, !0)));
  }, h = (m, $, x) => {
    const b = s.runs[m];
    f(m, i[m], b.text.length, $, x), i[m] = b.text.length;
  };
  for (const m of l) {
    u = m;
    for (const $ of m.line.segments) {
      if ($.bullet) {
        const y = s.runs[0];
        if (y) {
          const v = ll({ ...y, text: $.text, size: y.size * (s.bulletSize ?? 1), color: s.bulletColor ?? y.color });
          m.pieces.push(Bo(v, $.text, n, m.line.squeezed, ' data-bullet="true" contenteditable="false"', $.x - m.line.x, m.line.height));
        }
        continue;
      }
      for (; c < $.runIndex; ) h(c, m, $.x), c++;
      const x = s.runs[$.runIndex];
      if (!x) continue;
      f($.runIndex, i[$.runIndex], $.from, m, $.x);
      const b = !!((o = x.math) != null && o.length), M = b ? 0 : $.from, E = b ? 1 : $.to;
      m.pieces.push(Bo(x, b ? x.text : x.text.slice($.from, $.to), n, m.line.squeezed, Si(t, $.runIndex, M, E), $.x - m.line.x, m.line.height)), i[$.runIndex] = $.to, c = $.runIndex;
    }
  }
  const p = u.line.x + u.line.width;
  for (; c < s.runs.length; ) h(c, u, p), c++;
  const d = l.map(({ line: m, pieces: $ }) => {
    const x = `position:absolute;left:${C(m.x)}px;top:${C(m.y)}px;width:${C(Math.max(1, m.width))}px;height:${C(m.height)}px;line-height:${C(m.height)}px;white-space:pre;overflow:visible;` + (m.rtl ? "direction:rtl;unicode-bidi:plaintext;" : "");
    return `<span data-engine-line="${t}.${m.lineIndex}" data-x="${C(m.x)}" data-y="${C(m.y)}" style="${oe(x)}">${$.join("")}</span>`;
  }).join("");
  return `<div data-p="${t}" style="position:absolute;inset:0">${d}</div>`;
}
function bg(e, t, r, n) {
  const o = to(e, t, r, { insets: n.insets, anchor: n.anchor, vert: n.vert, scale: n.scale, measureText: n.measureText }), s = e.paragraphs.map((d, m) => o.lines.filter(($) => $.paragraphIndex === m)), l = e.paragraphs.map((d, m) => $g(e, m, s[m], o.scale)).join(""), [i, a, c, u, f, h] = o.transform, p = `position:relative;width:${C(o.layoutWidth)}px;height:${C(o.layoutHeight)}px;box-sizing:border-box;white-space:pre;overflow:visible;transform-origin:0 0;transform:matrix(${C(i)},${C(a)},${C(c)},${C(u)},${C(f)},${C(h)});`;
  return `<div data-layout="engine" data-font-scale="${C(o.scale)}" data-autofit="${o.autoFit}" xmlns="http://www.w3.org/1999/xhtml" style="${oe(p)}">${l}</div>`;
}
function xg(e, t, r, n = {}) {
  if (n.layout === "engine") return bg(e, t, r, n);
  const o = gg(e, t, r, n), [s, l, i, a] = n.insets ?? o.insets, c = o.fontScale, u = n.includeEditMarkers !== !1, f = o.paragraphs.map(($, x) => {
    const b = $.runs[0], M = (b?.size ?? 18) * c, E = o.wrap && og($, t - a - l - Math.max(0, $.marL), c, !0, n.measureText), y = $.runs.map((S, N) => iu(S, c, E, u ? ` data-r="${x}.${N}"` : "")).join("");
    let v = "";
    const k = u ? ' data-bullet="true" contenteditable="false"' : "";
    if ($.bulletImage) v = `<img${k} src="${oe($.bulletImage)}" style="height:${C(M * 0.8)}px;vertical-align:middle;margin-right:4px"/>`;
    else if ($.bullet) {
      const S = M * ($.bulletSize ?? 1), N = $.bulletColor ?? b?.color ?? "#000", P = $.bulletFont && !/wingdings|webdings|symbol/i.test($.bulletFont) ? `font-family:${dg([$.bulletFont], hg)};` : "";
      v = `<span${k} style="${oe(`font-size:${C(S)}px;color:${N};${P}`)}">${oe($.bullet)}&#160;</span>`;
    }
    const T = `margin:${C($.spaceBefore)}px 0 ${C($.spaceAfter)}px 0;text-align:${$.align};padding-left:${C(Math.max(0, $.marL))}px;text-indent:${C($.indent)}px;line-height:${$.lineHeight !== null ? C($.lineHeight) : "1.2"};` + ($.rtl ? "direction:rtl;" : "") + `white-space:${o.wrap ? "pre-wrap" : "pre"};word-break:break-word;`;
    return `<div${u ? ` data-p="${x}"` : ""} style="${oe(T)}">${v}${y}</div>`;
  }).join(""), h = n.anchor ?? o.anchor, p = n.vert ?? o.vert, d = `width:${C(t)}px;height:${C(r)}px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:${ug[h]};` + (o.anchorCtr ? "align-items:center;" : "") + `padding:${C(s)}px ${C(l)}px ${C(i)}px ${C(a)}px;` + (o.columns ? `column-count:${o.columns};column-gap:${C(o.columnGap ?? 0)}px;display:block;` : "") + (p ? fg[p] ?? "" : "") + "overflow:visible;", m = o.autoFitShape ? "shape" : e.autoFitNormal || e.autoFitCompute ? "normal" : "none";
  return `<div${u ? ` data-font-scale="${C(c)}" data-autofit="${m}"` : ""} xmlns="http://www.w3.org/1999/xhtml" style="${oe(d)}">${f}</div>`;
}
const au = { left: "start", center: "middle", right: "end", justify: "start" }, cu = (e) => e === "start" ? "end" : e === "end" ? "start" : e, wg = (e, t) => t.caps === "all" ? e.toUpperCase() : e;
function ms(e, t, r, n, o, s, l = !1, i) {
  var a;
  if (e.vert === "vert" || e.vert === "wordArtVert") {
    const x = ms({ ...e, vert: void 0 }, r, t, n, o, s, l, i);
    return `<g transform="translate(${C(t)} 0) rotate(90)">${x}</g>`;
  }
  if (e.vert === "vert270") {
    const x = ms({ ...e, vert: void 0 }, r, t, n, o, s, l, i);
    return `<g transform="translate(0 ${C(r)}) rotate(-90)">${x}</g>`;
  }
  const [c, u, f, h] = o ?? e.insets, p = e.fontScale, d = Eg(e, t, r, n, [c, u, f, h], s ?? e.anchor, i);
  if (d) return d;
  const m = to(e, t, r, { insets: o, anchor: s, vert: "horz", scale: p, includeCarets: !1, measureText: i }), $ = [];
  for (const x of m.lines) {
    const b = e.paragraphs[x.paragraphIndex], M = b.runs[0], E = x.segments.map((P) => {
      const L = P.runIndex >= 0 ? b.runs[P.runIndex] : ll({ ...M, text: `${b.bullet} `, size: M.size * (b.bulletSize ?? 1), color: b.bulletColor ?? M.color });
      return { text: P.text, run: L, width: P.naturalWidth, paragraphIndex: x.paragraphIndex, runIndex: P.runIndex, from: P.from, to: P.to };
    });
    if (!E.length) continue;
    const y = [], v = [];
    for (const P of E) {
      const L = [...P.text];
      v.push([y.length, y.length + L.length]), y.push(...L);
    }
    const k = eu(y, x.squeezed), T = E.map((P, L) => {
      const [A, z] = v[L];
      let R = 0;
      for (let O = A; O < z; O++) R += k.amount[O];
      return R * Ht(P.run, p);
    });
    let S = x.x;
    for (const [P, L] of E.entries()) {
      if (L.run.highlight) {
        const A = Ht(L.run, p);
        $.push(`<rect x="${C(S)}" y="${C(x.baseline - A * 0.82)}" width="${C(L.width)}" height="${C(A * 1.12)}" fill="${oe(L.run.highlight)}"/>`);
      }
      S += L.width - T[P];
    }
    const N = au[x.align];
    if (E.some((P) => {
      var L;
      return (L = P.run.math) == null ? void 0 : L.length;
    })) {
      let P = x.x;
      for (const [L, A] of E.entries()) {
        const z = (a = A.run.math) != null && a.length ? eo(A.run, p) : null;
        z ? $.push(no(`<g transform="translate(${C(P)} ${C(x.baseline)})">${z.svg}</g>`, A.run.link)) : $.push(`<text x="${C(P)}" y="${C(x.baseline)}" text-anchor="start"` + (x.rtl ? ' direction="rtl" unicode-bidi="embed"' : "") + ` xml:space="preserve">${Dr(A, p, n, void 0, l)}</text>`), P += A.width - T[L];
      }
    } else {
      const P = k.total > 0 ? vg(E, v, k, p, n, l) : E.map((L) => Dr(L, p, n, void 0, l)).join("");
      $.push(`<text x="${C(x.anchorX)}" y="${C(x.baseline)}" text-anchor="${x.rtl ? cu(N) : N}"` + (x.rtl ? ' direction="rtl" unicode-bidi="embed"' : "") + ` xml:space="preserve">${P}</text>`);
    }
  }
  return $.join("");
}
function yg(e, t) {
  var r;
  const n = (r = e.match(/linear-gradient\(([^]*)\)$/)) == null ? void 0 : r[1];
  if (!n) return null;
  const o = n.split(/,(?![^(]*\))/).map((f) => f.trim()), s = o[0].match(/^(-?[\d.]+)deg$/), l = s ? Number(s[1]) : 180, i = (s ? o.slice(1) : o).map((f) => {
    const h = f.match(/^(.*?)\s+([\d.]+)%$/);
    return h ? { color: h[1].trim(), pos: Number(h[2]) } : { color: f, pos: null };
  }).map((f, h, p) => ({ color: f.color, pos: f.pos ?? (p.length > 1 ? h / (p.length - 1) * 100 : 0) }));
  if (!i.length) return null;
  const a = (l - 90) * Math.PI / 180, c = Math.cos(a) / 2, u = Math.sin(a) / 2;
  return `url(#${t(`<linearGradient id="__ID__" x1="${C(0.5 - c)}" y1="${C(0.5 - u)}" x2="${C(0.5 + c)}" y2="${C(0.5 + u)}">` + i.map((f) => `<stop offset="${C(f.pos)}%" stop-color="${oe(f.color)}"/>`).join("") + "</linearGradient>")})`;
}
function vg(e, t, r, n, o, s = !1) {
  return e.map((l, i) => {
    const [a, c] = t[i], u = Ht(l.run, n), f = r.dx.slice(a, c).map((p) => p * u), h = f.some((p) => p !== 0);
    return Dr(l, n, o, h ? f : void 0, s);
  }).join("");
}
function Dr(e, t, r, n, o = !1) {
  const s = e.run, l = Ht(s, t), i = s.gradient ? yg(s.gradient, r) : null, a = [`font-size="${C(l)}"`, `font-family="${oe(sl(s))}"`, `fill="${oe(i ?? s.color)}"`];
  s.b && a.push('font-weight="700"'), s.i && a.push('font-style="italic"'), s.spacing && a.push(`letter-spacing="${C(s.spacing)}"`), s.caps === "small" && a.push('font-variant="small-caps"'), s.baseline && a.push(`dy="${C(s.baseline > 0 ? -l * 0.45 : l * 0.25)}"`), s.outline && a.push(`stroke="${oe(s.outline.color)}" stroke-width="${C(s.outline.width)}" paint-order="stroke"`), n != null && n.some((f) => f !== 0) && a.push(`dx="${n.map((f) => C(f)).join(" ")}"`);
  const c = `<tspan${o && e.runIndex !== void 0 && e.runIndex >= 0 ? ` data-r="${e.paragraphIndex}.${e.runIndex}" data-from="${e.from}" data-to="${e.to}"` : ""} ${a.join(" ")}>${ru(oe(e.text), s, "tspan", i ?? s.color)}</tspan>`, u = s.baseline ? `${c}<tspan dy="${C(s.baseline > 0 ? l * 0.45 : -l * 0.25)}"></tspan>` : c;
  return no(u, s.link);
}
const gs = (e, t, r) => Math.min(r, Math.max(t, e));
function Li(e, t, r, n, o, s) {
  const l = (h) => {
    const p = h * Math.PI / 180;
    return [e + r * Math.cos(p), t + n * Math.sin(p)];
  }, [i, a] = l(o), [c, u] = l(s), f = Math.abs(s - o);
  return { d: `M${C(i)} ${C(a)}A${C(r)} ${C(n)} 0 ${f > 180 ? 1 : 0} ${s > o ? 1 : 0} ${C(c)} ${C(u)}`, len: f * Math.PI / 180 * ((r + n) / 2), fill: !0 };
}
function Ti(e, t, r = 28) {
  const n = [];
  for (let l = 0; l <= r; l++) n.push([t * l / r, e(l / r)]);
  let o = `M${C(n[0][0])} ${C(n[0][1])}`, s = 0;
  for (let l = 0; l < r; l++) {
    const i = n[Math.max(0, l - 1)], a = n[l], c = n[l + 1], u = n[Math.min(r, l + 2)];
    o += `C${C(a[0] + (c[0] - i[0]) / 6)} ${C(a[1] + (c[1] - i[1]) / 6)} ${C(c[0] - (u[0] - a[0]) / 6)} ${C(c[1] - (u[1] - a[1]) / 6)} ${C(c[0])} ${C(c[1])}`, s += Math.hypot(c[0] - a[0], c[1] - a[1]);
  }
  return { d: o, len: s };
}
const Mg = { textCurveUp: 0.3, textCurveDown: -0.3, textCanUp: 0.16, textCanDown: -0.16, textDeflate: 0.22, textInflate: -0.22, textTriangle: 0.2, textChevron: 0.34 }, kg = /* @__PURE__ */ new Set(["textTriangle", "textChevron"]);
function Cg(e, t, r, n, o, s) {
  const l = r / 2, i = n / 2, a = gs((t.adj ?? t.adj1 ?? 108e5) / 6e4, 20, 350);
  if (e === "textCircle") {
    const d = Math.max(1, l - o * 0.3), m = Math.max(1, i - o * 0.3);
    return { d: `M${C(l)} ${C(i + m)}A${C(d)} ${C(m)} 0 1 1 ${C(l)} ${C(i - m)}A${C(d)} ${C(m)} 0 1 1 ${C(l)} ${C(i + m)}`, len: Math.PI * (d + m), fill: !0 };
  }
  if (e.startsWith("textArch")) {
    const d = e.startsWith("textArchDown"), m = e.endsWith("Pour"), $ = o * 0.4, x = Math.max(1, (l - o * 0.1) * (m ? 0.72 : 1)), b = Math.max(1, (i - $) * (m ? 0.72 : 1));
    return d ? Li(l, i - $, x, b, 90 + a / 2, 90 - a / 2) : Li(l, i + $, x, b, -90 - a / 2, -90 + a / 2);
  }
  const c = e === "textWave1" ? 1 : e === "textWave2" ? -1 : 0, u = s === "top" ? o * 0.85 : s === "bottom" ? n - o * 0.2 : i + o * 0.32;
  if (c) {
    const d = n * 0.16 * gs((t.adj1 ?? 6250) / 6250, 0.25, 3);
    return Ti((m) => u - c * d * Math.sin(2 * Math.PI * m), r);
  }
  const f = Mg[e];
  if (f === void 0) return null;
  const h = f * n, p = kg.has(e) ? (d) => 1 - Math.abs(2 * d - 1) : (d) => Math.sin(Math.PI * d);
  return Ti((d) => u + h / 2 - h * p(d), r);
}
function Eg(e, t, r, n, o, s, l) {
  const i = e.warp;
  if (!i || !Ur(i.preset)) return null;
  const [a, c, u, f] = o, h = Math.max(1, t - f - c), p = Math.max(1, r - a - u), d = e.fontScale, m = e.paragraphs.filter((b) => b.runs.some((M) => M.text.trim()));
  if (!m.length) return null;
  const $ = p / m.length, x = [];
  return m.forEach((b, M) => {
    const E = b.runs.filter((j) => j.text);
    if (!E.length) return;
    const y = Math.max(...E.map((j) => j.size), 1) * d, v = Cg(i.preset, i.adj, h, $, y, m.length > 1 ? "middle" : s);
    if (!v) return;
    const k = E.map((j) => ({ text: wg(j.text, j).replace(/\n/g, " "), run: j, width: Fr(j.text, j, d, l) })), T = k.reduce((j, W) => j + W.width, 0), S = T > v.len ? Math.max(0.25, v.len / T) : 1, N = T * S, P = k.reduce((j, W) => j + W.text.length, 0), L = v.fill && P > 1 && N > 0 ? (N * gs(v.len / N, 1, 2.2) - N) / P : 0, A = n(`<path id="__ID__" fill="none" d="${v.d}"/>`), z = au[b.align], R = b.rtl === !0, O = z === "end" ? "100%" : z === "middle" ? "50%" : "0%", U = k.map((j) => Dr(j, d * S, n)).join("");
    x.push(`<g transform="translate(${C(f)} ${C(a + $ * M)})"><text text-anchor="${R ? cu(z) : z}"` + (L > 0.05 ? ` letter-spacing="${C(L)}"` : "") + (R ? ' direction="rtl" unicode-bidi="embed"' : "") + ` xml:space="preserve"><textPath href="#${A}" xlink:href="#${A}" startOffset="${O}">${U}</textPath></text></g>`);
  }), x.length ? x.join("") : null;
}
const yn = 1 / 1e5, Pi = 0.01;
function Sg(e, t, r, n, o, s, l) {
  const i = e.crop ?? { l: 0, t: 0, r: 0, b: 0 }, a = n / Math.max(1 - i.l - i.r, yn), c = o / Math.max(1 - i.t - i.b, yn), u = `<image href="${oe(e.src)}" x="${C(-i.l * a)}" y="${C(-i.t * c)}" width="${C(a)}" height="${C(c)}" preserveAspectRatio="none"` + (e.alpha !== void 0 ? ` opacity="${C(e.alpha)}"` : "") + "/>", f = s || l ? `<g transform="translate(${C(s ? n : 0)} ${C(l ? o : 0)}) scale(${s ? -1 : 1} ${l ? -1 : 1})">${u}</g>` : u;
  return `<svg x="${C(t)}" y="${C(r)}" width="${C(n)}" height="${C(o)}" overflow="hidden">${f}</svg>`;
}
function Lg(e) {
  switch (e ?? "tl") {
    case "t":
      return [0.5, 0];
    case "tr":
      return [1, 0];
    case "l":
      return [0, 0.5];
    case "ctr":
      return [0.5, 0.5];
    case "r":
      return [1, 0.5];
    case "bl":
      return [0, 1];
    case "b":
      return [0.5, 1];
    case "br":
      return [1, 1];
    default:
      return [0, 0];
  }
}
function Tg(e, t, r, n, o) {
  const s = e.tile, l = e.crop ?? { l: 0, t: 0, r: 0, b: 0 }, i = Math.max(1 - l.l - l.r, yn), a = Math.max(1 - l.t - l.b, yn), c = s.sourceWidth ?? n * 0.25, u = s.sourceHeight ?? o * 0.25, f = Math.max(Pi, c * i * s.sx), h = Math.max(Pi, u * a * s.sy), [p, d] = Lg(s.algn), m = (n - f) * p + (s.tx ?? 0), $ = (o - h) * d + (s.ty ?? 0), x = s.flip === "x" || s.flip === "xy", b = s.flip === "y" || s.flip === "xy", M = x ? 2 : 1, E = b ? 2 : 1;
  let y = "";
  for (let v = 0; v < E; v++) for (let k = 0; k < M; k++) y += Sg(e, k * f, v * h, f, h, k === 1, v === 1);
  t.defs.push(`<pattern id="${r}" patternUnits="userSpaceOnUse" x="${C(m)}" y="${C($)}" width="${C(f * M)}" height="${C(h * E)}">${y}</pattern>`);
}
function Pg(e, t, r, n) {
  const o = t.nextId("p");
  if (e.tile) Tg(e, t, o, r, n);
  else if (e.crop && (e.crop.l || e.crop.t || e.crop.r || e.crop.b)) {
    const s = e.crop, l = r / Math.max(1 - s.l - s.r, yn), i = n / Math.max(1 - s.t - s.b, yn);
    t.defs.push(`<pattern id="${o}" patternUnits="userSpaceOnUse" width="${C(r)}" height="${C(n)}"><image href="${oe(e.src)}" x="${C(-s.l * l)}" y="${C(-s.t * i)}" width="${C(l)}" height="${C(i)}" preserveAspectRatio="none"` + (e.alpha !== void 0 ? ` opacity="${C(e.alpha)}"` : "") + "/></pattern>");
  } else t.defs.push(`<pattern id="${o}" patternUnits="userSpaceOnUse" width="${C(r)}" height="${C(n)}"><image href="${oe(e.src)}" width="${C(r)}" height="${C(n)}" preserveAspectRatio="none"` + (e.alpha !== void 0 ? ` opacity="${C(e.alpha)}"` : "") + "/></pattern>");
  return `url(#${o})`;
}
const Ai = { pct5: "M0 0h1v1H0z", pct10: "M0 0h1v1H0z", pct20: "M0 0h2v2H0z", pct25: "M0 0h2v2H0z", pct30: "M0 0h2v2H0zM2 2h2v2H2z", pct40: "M0 0h2v2H0zM2 2h2v2H2z", pct50: "M0 0h2v2H0zM2 2h2v2H2z", pct60: "M0 0h3v3H0z", pct70: "M0 0h3v3H0z", pct75: "M0 0h3v3H0z", pct80: "M0 0h4v4H0z", pct90: "M0 0h4v4H0z", ltHorz: "M0 2h8v1H0z", horz: "M0 2h8v2H0z", dkHorz: "M0 1h8v3H0z", ltVert: "M2 0h1v8H0z", vert: "M2 0h2v8H2z", dkVert: "M1 0h3v8H1z", ltUpDiag: "M0 8L8 0M-2 2L2 -2M6 10L10 6", upDiag: "M0 8L8 0M-2 2L2 -2M6 10L10 6", ltDnDiag: "M0 0L8 8M-2 6L2 10M6 -2L10 2", dnDiag: "M0 0L8 8M-2 6L2 10M6 -2L10 2", smGrid: "M0 0h8v1H0zM0 0h1v8H0z", lgGrid: "M0 0h8v1H0zM0 0h1v8H0z", cross: "M0 3h8v2H0zM3 0h2v8H3z", diagCross: "M0 0L8 8M8 0L0 8", trellis: "M0 0L8 8M8 0L0 8", wave: "M0 4Q2 2 4 4T8 4" }, Ag = { pct5: 8, pct10: 6, pct20: 5, pct25: 4, pct30: 4, pct40: 4, pct50: 4, pct60: 4, pct70: 4, pct75: 4, pct80: 5, pct90: 5 };
function al(e, t, r, n) {
  switch (e.type) {
    case "none":
      return "none";
    case "solid":
      return e.color;
    case "gradient": {
      const o = t.nextId("g"), s = e.stops.map((l) => `<stop offset="${C(Math.max(0, Math.min(1, l.pos)) * 100)}%" stop-color="${l.color}"/>`).join("");
      if (e.radial) t.defs.push(`<radialGradient id="${o}" cx="50%" cy="50%" r="70%">${s}</radialGradient>`);
      else {
        const l = e.angle * Math.PI / 180, i = Math.cos(l) / 2, a = Math.sin(l) / 2;
        t.defs.push(`<linearGradient id="${o}" x1="${C(0.5 - i)}" y1="${C(0.5 - a)}" x2="${C(0.5 + i)}" y2="${C(0.5 + a)}">${s}</linearGradient>`);
      }
      return `url(#${o})`;
    }
    case "image":
      return Pg(e, t, r, n);
    case "pattern": {
      const o = t.nextId("pt"), s = Ag[e.preset] ?? 8, l = Ai[e.preset] ?? Ai.pct50, i = /^[MLQT].*[ML]/.test(l) && !l.includes("h") && !l.includes("v");
      return t.defs.push(`<pattern id="${o}" patternUnits="userSpaceOnUse" width="${s}" height="${s}"><rect width="${s}" height="${s}" fill="${e.bg}"/><path d="${l}" ${i ? `stroke="${e.fg}" stroke-width="1" fill="none"` : `fill="${e.fg}"`}/></pattern>`), `url(#${o})`;
    }
  }
}
function Ig(e, t) {
  if (!e) return "";
  const r = [];
  let n = "SourceGraphic", o = 0;
  const s = (a) => {
    const c = `e${++o}`;
    r.push(a.replace(/__IN__/g, n).replace(/__OUT__/g, c)), n = c;
  };
  e.glow && s(`<feDropShadow in="__IN__" dx="0" dy="0" stdDeviation="${C(e.glow.radius / 2)}" flood-color="${e.glow.color}" flood-opacity="1" result="__OUT__"/>`);
  const l = e.shadow;
  if (l && !l.inner && s(`<feDropShadow in="__IN__" dx="${C(l.dx)}" dy="${C(l.dy)}" stdDeviation="${C(l.blur / 2)}" flood-color="${l.color}" result="__OUT__"/>`), l != null && l.inner) {
    const a = `is${o}`;
    r.push(`<feComponentTransfer in="SourceAlpha" result="${a}a"><feFuncA type="table" tableValues="1 0"/></feComponentTransfer><feGaussianBlur in="${a}a" stdDeviation="${C(l.blur / 2)}" result="${a}b"/><feOffset in="${a}b" dx="${C(l.dx)}" dy="${C(l.dy)}" result="${a}c"/><feComposite in="${a}c" in2="SourceAlpha" operator="in" result="${a}d"/><feFlood flood-color="${l.color}" result="${a}e"/><feComposite in="${a}e" in2="${a}d" operator="in" result="${a}f"/>`), s(`<feComposite in="${a}f" in2="__IN__" operator="over" result="__OUT__"/>`);
  }
  if (e.softEdge && (r.push(`<feGaussianBlur in="SourceAlpha" stdDeviation="${C(e.softEdge / 2)}" result="se"/><feComponentTransfer in="se" result="seMask"><feFuncA type="linear" slope="2.2" intercept="-0.6"/></feComponentTransfer>`), s('<feComposite in="__IN__" in2="seMask" operator="in" result="__OUT__"/>')), !r.length) return "";
  const i = t.nextId("f");
  return t.defs.push(`<filter id="${i}" x="-30%" y="-30%" width="160%" height="160%">${r.join("")}</filter>`), ` filter="url(#${i})"`;
}
function Ng(e, t, r) {
  var n;
  const o = (n = e.effects) == null ? void 0 : n.reflection;
  if (!o) return "";
  const s = Math.max(0, Math.min(1, o.alpha));
  if (s <= 0 || e.h <= 0) return "";
  const l = Math.max(0, o.distance), i = e.h + l, a = Math.max(1, e.h * Math.max(0.02, Math.min(1, o.size))), c = -e.w * 0.25, u = e.w * 1.5, f = r.nextId("rg"), h = r.nextId("rm");
  return r.defs.push(`<linearGradient id="${f}" gradientUnits="userSpaceOnUse" x1="0" y1="${C(i)}" x2="0" y2="${C(i + a)}"><stop offset="0" stop-color="#fff" stop-opacity="${C(s)}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`), r.defs.push(`<mask id="${h}" maskUnits="userSpaceOnUse" x="${C(c)}" y="${C(i)}" width="${C(u)}" height="${C(a)}"><rect x="${C(c)}" y="${C(i)}" width="${C(u)}" height="${C(a)}" fill="url(#${f})"/></mask>`), `<g mask="url(#${h})" aria-hidden="true"><use href="#${t}" xlink:href="#${t}" transform="translate(0 ${C(2 * e.h + l)}) scale(1 -1)"/></g>`;
}
let cn;
function W$(e) {
  cn = e;
}
function $s(e) {
  const t = e.match(/rgba?\(([^)]+)\)/);
  if (t) {
    const n = t[1].split(",").map(Number);
    return [n[0] || 0, n[1] || 0, n[2] || 0];
  }
  const r = e.replace("#", "");
  return r.length >= 6 ? [parseInt(r.slice(0, 2), 16), parseInt(r.slice(2, 4), 16), parseInt(r.slice(4, 6), 16)] : [128, 128, 128];
}
function Br(e, t, r) {
  const n = $s(e), o = $s(t);
  return `rgb(${n.map((s, l) => Math.round(s * (1 - r) + o[l] * r)).join(",")})`;
}
function Rg(e, t, r) {
  const n = Math.min(t.extrusion ?? 0, Math.max(e.w, e.h));
  if (n <= 0.5) return "";
  const o = ((t.rotY ?? 0) || 35) * Math.PI / 180, s = Math.cos(o) * n, l = Math.sin(((t.rotX ?? 0) || 20) * Math.PI / 180) * n, i = t.extrusionColor ?? Br(r, "#000", 0.32), a = Math.max(2, Math.min(14, Math.round(n))), c = [];
  for (let u = a; u >= 1; u--) {
    const f = u / a;
    c.push(`<g transform="translate(${C(s * f)} ${C(l * f)})"><path d="${e.path}" fill="${i}" fill-rule="nonzero"/></g>`);
  }
  return c.join("");
}
function zg(e, t, r, n) {
  const o = t.bevelTop ?? 0;
  if (o <= 0.3 || !e.path) return "";
  const s = Br(r, "#fff", 0.5), l = Br(r, "#000", 0.25), i = Math.min(o * 2, Math.min(e.w, e.h) / 3), a = n.nextId("bv");
  return n.defs.push(`<clipPath id="${a}"><path d="${e.path}"/></clipPath>`), `<g clip-path="url(#${a})"><path d="${e.path}" fill="none" stroke="${s}" stroke-width="${C(i)}" stroke-linejoin="round" opacity="0.55"/><path d="${e.path}" fill="none" stroke="${l}" stroke-width="${C(i / 3)}" stroke-linejoin="round" opacity="0.35" transform="translate(0 ${C(i / 3)})"/></g>`;
}
function Og(e, t) {
  const [r, n] = e.map($s), o = r.flatMap((s, l) => [...[0.213, 0.715, 0.072].map((i) => i * (n[l] - s) / 255), 0, s / 255]);
  return `<filter id="${t}" color-interpolation-filters="sRGB"><feColorMatrix values="${o.join(" ")} 0 0 0 1 0"/></filter>`;
}
const bs = { m: ["x", "y"], l: ["x", "y"], t: ["x", "y"], h: ["x"], v: ["y"], c: ["x", "y", "x", "y", "x", "y"], s: ["x", "y", "x", "y"], q: ["x", "y", "x", "y"], a: ["rx", "ry", "angle", "flag", "flag", "x", "y"], z: [] }, Ho = (e) => e === " " || e === "	" || e === `
` || e === "\r" || e === "\f", gr = (e) => e >= "0" && e <= "9";
function jg(e) {
  const t = [];
  let r = 0;
  const n = (i) => new Error(`路径数据无效：位置 ${r} 期望${i}，实际为「${e.slice(r, r + 12)}」（${e.slice(0, 60)}）`), o = () => {
    for (; r < e.length && Ho(e[r]); ) r++;
    if (e[r] === ",") for (r++; r < e.length && Ho(e[r]); ) r++;
  }, s = () => {
    const i = r;
    (e[r] === "+" || e[r] === "-") && r++;
    let a = 0;
    for (; gr(e[r]); ) r++, a++;
    if (e[r] === ".") for (r++; gr(e[r]); ) r++, a++;
    if (!a) throw r = i, n("数值");
    if (e[r] === "e" || e[r] === "E") {
      const c = r;
      if (r++, (e[r] === "+" || e[r] === "-") && r++, !gr(e[r])) throw r = c, n("指数");
      for (; gr(e[r]); ) r++;
    }
    return Number(e.slice(i, r));
  }, l = () => {
    if (e[r] !== "0" && e[r] !== "1") throw n("弧线标志 0 或 1");
    return Number(e[r++]);
  };
  for (; r < e.length && Ho(e[r]); ) r++;
  for (; r < e.length; ) {
    const i = e[r], a = bs[i.toLowerCase()];
    if (!a) throw n("路径命令");
    if (!t.length && i.toLowerCase() !== "m") throw n("以 M/m 开头");
    if (r++, o(), !a.length) {
      t.push({ command: i, values: [] });
      continue;
    }
    let c = i;
    do {
      const u = a.map((f, h) => (h && o(), f === "flag" ? l() : s()));
      t.push({ command: c, values: u }), c === "M" ? c = "L" : c === "m" && (c = "l"), o();
    } while (r < e.length && !bs[e[r].toLowerCase()]);
  }
  return t;
}
function Fg(e, t, r, n, o) {
  e = Math.abs(e), t = Math.abs(t);
  const s = r * Math.PI / 180, l = Math.cos(s), i = Math.sin(s);
  if (n === o || i === 0 || l === 0) {
    const p = l === 0 && i !== 0;
    return [e * (p ? o : n), t * (p ? n : o), r];
  }
  const a = (e * e * l * l + t * t * i * i) * n * n, c = (e * e - t * t) * l * i * n * o, u = (e * e * i * i + t * t * l * l) * o * o, f = (a + u) / 2, h = Math.hypot((a - u) / 2, c);
  return [Math.sqrt(f + h), Math.sqrt(Math.max(0, f - h)), Math.atan2(2 * c, a - u) / 2 * 180 / Math.PI];
}
function Ii(e, t, r) {
  if (!(Number.isFinite(t) && t > 0 && Number.isFinite(r) && r > 0)) throw new Error(`路径缩放比例必须是正有限数：kx=${t}，ky=${r}`);
  return jg(e).map(({ command: n, values: o }) => {
    const s = bs[n.toLowerCase()];
    if (s.includes("rx")) {
      const [l, i, a] = Fg(o[0], o[1], o[2], t, r);
      o = [l, i, a, o[3], o[4], o[5] * t, o[6] * r];
    } else o = o.map((l, i) => l * (s[i] === "y" ? r : t));
    return o.length ? `${n} ${o.map(C).join(" ")}` : n;
  }).join(" ");
}
function uu(e) {
  const t = (e % 360 + 360) % 360;
  return t >= 45 && t < 135 || t >= 225 && t < 315;
}
function Hr(e, t, r) {
  const n = e || 1;
  if (!Number.isFinite(n) || n <= 0) throw new Error(`组合 ${r.name ?? r.id ?? ""} 的 ${t} 缩放无效：${e}`);
  return n;
}
function fu(e, t) {
  const r = Hr(e.scaleX, "scaleX", e), n = Hr(e.scaleY, "scaleY", e), o = uu(t.rot), s = o ? n : r, l = o ? r : n, i = t.w * s, a = t.h * l;
  return { x: (t.x + t.w / 2 - e.childX) * r - i / 2, y: (t.y + t.h / 2 - e.childY) * n - a / 2, w: i, h: a, kx: s, ky: l };
}
function V$(e, t) {
  const r = Hr(e.scaleX, "scaleX", e), n = Hr(e.scaleY, "scaleY", e), o = uu(t.rot), s = t.w / (o ? n : r), l = t.h / (o ? r : n);
  return { x: (t.x + t.w / 2) / r + e.childX - s / 2, y: (t.y + t.h / 2) / n + e.childY - l / 2, w: s, h: l };
}
function Ug(e, t) {
  const { kx: r, ky: n, ...o } = fu(e, t);
  if (r === 1 && n === 1) return { ...t, ...o };
  switch (t.kind) {
    case "shape":
      return { ...t, ...o, path: t.path && Ii(t.path, r, n) };
    case "image":
      return { ...t, ...o, ...t.clipPath ? { clipPath: Ii(t.clipPath, r, n) } : {} };
    case "group":
      return { ...t, ...o, scaleX: (t.scaleX || 1) * r, scaleY: (t.scaleY || 1) * n };
    case "table":
      return { ...t, ...o, colWidths: t.colWidths.map((s) => s * r), rows: t.rows.map((s) => ({ ...s, height: s.height * n })) };
    case "unsupported":
      return { ...t, ...o };
  }
}
let Dg = 0;
const Bg = (e) => `${e}${++Dg}`;
function Hg(e) {
  return e.replace(/^[0-9-]|[^A-Za-z0-9-]/gu, (t) => `_u${t.codePointAt(0).toString(16)}_`);
}
const Ni = 1 / 1e5;
function hu(e) {
  const t = e.textMode ?? "html";
  let r = 0;
  const n = e.idPrefix === void 0 ? null : Hg(e.idPrefix);
  return { defs: [], nextId: n === null ? Bg : (o) => `${n}${o}${++r}`, textMode: t, measureText: e.measureText, media: e.media === "player" && t === "html" ? "player" : "badge", hidden: e.hiddenElements && e.hiddenElements.length ? new Set(e.hiddenElements) : null, includeEditMarkers: e.includeEditMarkers === !0, resolveLink: (o) => o };
}
function Wg(e, t) {
  const r = e.slides.indexOf(t) + 1;
  return (n) => {
    if (!n) return n;
    if (n.startsWith("slide-part:")) try {
      const o = decodeURIComponent(n.slice(11)), s = e.slides.findIndex((l) => l.editInfo && l.editInfo.origin.part === o);
      return s < 0 ? n : `slide:${s + 1}`;
    } catch {
      return n;
    }
    return n.startsWith("slide:") ? n === "slide:next" ? `slide:${r + 1}` : n === "slide:previous" ? `slide:${r - 1}` : n === "slide:first" ? "slide:1" : n === "slide:last" ? `slide:${e.slides.length}` : n : n;
  };
}
function X$(e, t = {}) {
  const r = hu(t);
  return { markup: ul(e, r), defs: r.defs.join("") };
}
function du(e, t, r = {}) {
  const n = hu(r);
  n.resolveLink = Wg(e, t);
  let o = "#fff";
  try {
    t.background && (o = al(t.background, n, e.width, e.height));
  } catch {
  }
  const s = `<rect width="${C(e.width)}" height="${C(e.height)}" fill="${o}"/>`, l = t.elements.map((u) => ul(u, n)).join("") + (r.showComments ? e$(t.comments, e.width, e.height) : ""), i = (e.embeddedFonts ?? []).map((u) => `@font-face{font-family:'${zr(u.family)}';src:url('${zr(u.src)}');font-weight:${u.bold ? 700 : 400};font-style:${u.italic ? "italic" : "normal"};}`).join("") + (l.includes(ol) ? V2() : ""), a = i ? `<style>${i}</style>` : "", c = r.includeNotes && t.notes ? `<desc>${oe(t.notes)}</desc>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${C(e.width)} ${C(e.height)}" font-family="Helvetica, Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif">` + c + `<defs>${a}${n.defs.join("")}</defs>` + s + l + "</svg>";
}
function ro(e, t, r) {
  const n = Ig(e.effects, r);
  if (!e.effects || !e.effects.reflection) return `<g transform="${Wr(e)}"${n}>${t}</g>`;
  const o = r.nextId("rc"), s = `<g id="${o}">${t}</g>`;
  return `<g transform="${Wr(e)}">` + Ng(e, o, r) + (n ? `<g${n}>${s}</g>` : s) + "</g>";
}
const Vg = { none: { d: "", fill: !1 }, triangle: { d: "M0 0 L10 5 L0 10 z", fill: !0 }, stealth: { d: "M0 0 L10 5 L0 10 L3 5 z", fill: !0 }, diamond: { d: "M0 5 L5 0 L10 5 L5 10 z", fill: !0 }, oval: { d: "M0 5 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0", fill: !0 }, arrow: { d: "M0 0 L10 5 L0 10", fill: !1 } };
function Ri(e, t, r, n) {
  const o = Vg[e.type];
  if (!o.d) return "";
  const s = r.nextId("m"), l = Math.max(1, e.h), i = Math.max(1, e.w);
  return r.defs.push(`<marker id="${s}" viewBox="0 0 10 10" refX="${n ? 0 : 10}" refY="5" markerWidth="${C(l)}" markerHeight="${C(i)}" markerUnits="strokeWidth" orient="${n ? "auto-start-reverse" : "auto"}"><path d="${o.d}" ${o.fill ? `fill="${t}"` : `fill="none" stroke="${t}" stroke-width="1.6"`}/></marker>`), `url(#${s})`;
}
function cl(e, t) {
  if (!e) return "";
  let r = ` stroke="${e.color}" stroke-width="${C(e.width)}"`;
  if (e.dash && (r += ` stroke-dasharray="${e.dash.map(C).join(" ")}"`), e.cap && (r += ` stroke-linecap="${e.cap}"`), e.join && (r += ` stroke-linejoin="${e.join}"`), e.head) {
    const n = Ri(e.head, e.color, t, !0);
    n && (r += ` marker-start="${n}"`);
  }
  if (e.tail) {
    const n = Ri(e.tail, e.color, t, !1);
    n && (r += ` marker-end="${n}"`);
  }
  return r;
}
function Wr(e) {
  return `${e.rot ? `rotate(${C(e.rot)} ${C(e.x + e.w / 2)} ${C(e.y + e.h / 2)}) ` : ""}translate(${C(e.x)} ${C(e.y)})`;
}
function oo(e) {
  return !e.flipH && !e.flipV ? "" : `translate(${C(e.w / 2)} ${C(e.h / 2)}) scale(${e.flipH ? -1 : 1} ${e.flipV ? -1 : 1}) translate(${C(-e.w / 2)} ${C(-e.h / 2)})`;
}
function Xg(e, t) {
  try {
    const r = t instanceof Error ? t.message : String(t), n = e.name ? `${e.kind} · ${e.name}` : e.kind;
    return `<g transform="${Wr(e)}" data-render-error="1"><title>${oe(n)} 渲染失败：${oe(r.slice(0, 200))}</title><rect width="${C(e.w)}" height="${C(e.h)}" fill="rgba(220,38,38,0.06)" stroke="#dc2626" stroke-width="1" stroke-dasharray="5 4"/></g>`;
  } catch {
    return "";
  }
}
function ul(e, t, r) {
  var n;
  let o;
  try {
    const s = r ? Ug(r, e) : e;
    switch (s.kind) {
      case "shape":
        o = Yg(s, t);
        break;
      case "image":
        o = qg(s, t);
        break;
      case "group":
        o = Jg(s, t);
        break;
      case "table":
        o = Qg(s, t);
        break;
      case "unsupported":
        o = t$(s);
        break;
    }
  } catch (s) {
    o = Xg(r ? { ...e, ...fu(r, e) } : e, s);
  }
  if (t.includeEditMarkers !== null && (e.id !== void 0 || t.includeEditMarkers)) {
    const s = e.id !== void 0 && (n = t.hidden) != null && n.has(e.id) ? "visibility:hidden;" : "";
    o = `<g data-el="${e.id ?? ""}" style="${s}transform-box:fill-box;transform-origin:center">${o}</g>`;
  }
  return no(o, t.resolveLink(e.link));
}
function Yg(e, t) {
  var r, n;
  let o = "", s;
  const l = e.scene3d;
  if (e.path) {
    const i = e.openGeom ? "none" : e.fill ? al(e.fill, t, e.w, e.h) : "none", a = ((r = e.fill) == null ? void 0 : r.type) === "solid" ? e.fill.color : ((n = e.fill) == null ? void 0 : n.type) === "gradient" && e.fill.stops.length ? e.fill.stops[0].color : "rgb(128,128,128)";
    l && !cn && (o += Rg(e, l, a));
    const c = l != null && l.contourWidth ? ` stroke="${l.contourColor ?? Br(a, "#000", 0.45)}" stroke-width="${C(l.contourWidth)}"` : cl(e.stroke, t);
    s = `<path d="${e.path}" fill="${i}" fill-rule="nonzero"${c}/>`;
    const u = oo(e);
    o += u ? `<g transform="${u}">${s}</g>` : s, l && !cn && (o += zg(e, l, a, t));
  }
  return e.text && (o += mu(e.text, e.w, e.h, l && cn ? { ...t, textMode: "svg" } : t)), l && cn && (o = cn(e, o, t, s)), ro(e, o, t);
}
function Gg(e, t) {
  const r = Math.max(6, Math.min(Math.min(e.w, e.h) * 0.22, 34)), n = e.w / 2, o = e.h / 2, s = `<circle cx="${C(n)}" cy="${C(o)}" r="${C(r)}" fill="rgba(17,17,17,0.55)" stroke="rgba(255,255,255,0.92)" stroke-width="${C(Math.max(1, r * 0.09))}"/>`;
  let l;
  if (t.kind === "audio") {
    const i = r * 0.42, a = n - i * 1.15;
    l = `<path d="M${C(a)} ${C(o - i * 0.42)} H${C(a + i * 0.62)} L${C(a + i * 1.5)} ${C(o - i)} V${C(o + i)} L${C(a + i * 0.62)} ${C(o + i * 0.42)} H${C(a)} Z" fill="#fff"/><path d="M${C(n + i * 0.65)} ${C(o - i * 0.6)} A ${C(i * 0.75)} ${C(i * 0.75)} 0 0 1 ${C(n + i * 0.65)} ${C(o + i * 0.6)}" fill="none" stroke="#fff" stroke-width="${C(Math.max(1, i * 0.26))}" stroke-linecap="round"/><path d="M${C(n + i * 1.15)} ${C(o - i * 1.05)} A ${C(i * 1.35)} ${C(i * 1.35)} 0 0 1 ${C(n + i * 1.15)} ${C(o + i * 1.05)}" fill="none" stroke="#fff" stroke-width="${C(Math.max(1, i * 0.26))}" stroke-linecap="round" opacity="0.85"/>`;
  } else {
    const i = r * 0.46;
    l = `<path d="M${C(n - i * 0.62)} ${C(o - i)} L${C(n + i)} ${C(o)} L${C(n - i * 0.62)} ${C(o + i)} Z" fill="#fff"/>`;
  }
  return `<g aria-hidden="true" pointer-events="none">${pu(t)}${s}${l}</g>`;
}
function pu(e) {
  const t = e.kind === "audio" ? "音频" : "视频", r = e.src ? e.external ? `${t}（外链）` : t : `${t}（源不可用）`;
  return `<title>${oe(r)}</title>`;
}
function Zg(e, t) {
  return `<foreignObject x="0" y="0" width="${C(e.w)}" height="${C(e.h)}"><div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%"><video controls preload="metadata" src="${oe(t.src ?? "")}"` + (e.src ? ` poster="${oe(e.src)}"` : "") + ' style="width:100%;height:100%;display:block;object-fit:contain;background:#000"></video></div></foreignObject>';
}
function _g(e, t) {
  return `<g data-media-toggle="" style="cursor:pointer">${e}<foreignObject width="0" height="0"><div xmlns="http://www.w3.org/1999/xhtml"><audio preload="none" src="${oe(t.src ?? "")}"></audio></div></foreignObject></g>`;
}
function qg(e, t) {
  let r = e.filter ?? "";
  if (e.duotone) {
    const l = t.nextId("dt");
    t.defs.push(Og(e.duotone, l)), r = `${r} url(#${l})`.trim();
  }
  const n = (e.alpha !== void 0 && e.alpha < 1 ? ` opacity="${C(e.alpha)}"` : "") + (r ? ` style="filter:${oe(r)}"` : "");
  let o;
  if (!e.src) o = `<rect width="${C(e.w)}" height="${C(e.h)}" fill="rgb(38,42,48)"/>`;
  else if (e.crop && (e.crop.l || e.crop.t || e.crop.r || e.crop.b)) {
    const l = e.w / Math.max(1 - e.crop.l - e.crop.r, Ni), i = e.h / Math.max(1 - e.crop.t - e.crop.b, Ni), a = t.nextId("c");
    t.defs.push(`<clipPath id="${a}"><rect width="${C(e.w)}" height="${C(e.h)}"/></clipPath>`), o = `<g clip-path="url(#${a})"><image href="${oe(e.src)}" x="${C(-e.crop.l * l)}" y="${C(-e.crop.t * i)}" width="${C(l)}" height="${C(i)}" preserveAspectRatio="none"${n}/></g>`;
  } else o = `<image href="${oe(e.src)}" width="${C(e.w)}" height="${C(e.h)}" preserveAspectRatio="none"${n}/>`;
  if (e.clipPath) {
    const l = t.nextId("cs");
    t.defs.push(`<clipPath id="${l}"><path d="${e.clipPath}"/></clipPath>`), o = `<g clip-path="url(#${l})">${o}</g>`;
  }
  e.stroke && (o += `<path d="${e.clipPath ?? `M0 0 H${C(e.w)} V${C(e.h)} H0 Z`}" fill="none"${cl(e.stroke, t)}/>`);
  const s = oo(e);
  if (s && (o = `<g transform="${s}">${o}</g>`), e.media) {
    const l = t.media === "player" && !!e.media.src;
    l && e.media.kind === "video" ? o += Zg(e, e.media) : (o = e.media.kind === "video" || !e.src || !e.media.src ? o + Gg(e, e.media) : pu(e.media) + o, l && (o = _g(o, e.media)));
  }
  return ro(e, o, t);
}
function Jg(e, t) {
  const r = t.includeEditMarkers && e.editInfo && e.editInfo.editable === "frame" ? { ...t, includeEditMarkers: null } : t, n = e.children.map((l) => ul(l, r, e)).join(""), o = t.includeEditMarkers ? ' data-edit-group-children="1"' : "", s = oo(e);
  return ro(e, `<g${o}${s ? ` transform="${s}"` : ""}>${n}</g>`, t);
}
const Kg = { color: "rgba(0,0,0,0.25)", width: 1, dash: null };
function $r(e, t, r, n, o, s) {
  if (e === null) return "";
  const l = e ?? Kg;
  return `<line x1="${C(t)}" y1="${C(r)}" x2="${C(n)}" y2="${C(o)}"${cl(l, s)}/>`;
}
function Qg(e, t) {
  const r = [], n = [];
  let o = 0;
  e.rows.forEach((l, i) => {
    let a = 0;
    l.cells.forEach((c, u) => {
      const f = e.colWidths.slice(u, u + c.colSpan).reduce((m, $) => m + $, 0) || e.colWidths[u] || 0;
      if (c.merged) {
        a += e.colWidths[u] ?? 0;
        return;
      }
      const h = e.rows.slice(i, i + c.rowSpan).reduce((m, $) => m + $.height, 0) || l.height, p = c.fill ? al(c.fill, t, f, h) : "none", d = c.borders ?? {};
      r.push(`<g${t.includeEditMarkers ? ` data-table-cell="${i}:${u}"` : ""} transform="translate(${C(a)} ${C(o)})"><rect width="${C(f)}" height="${C(h)}" fill="${p}"${t.includeEditMarkers ? ' pointer-events="visibleFill"' : ""}/>` + (c.text ? mu(c.text, f, h, t, c.margins, c.vAlign, c.vert) : "") + "</g>"), n.push(`<g transform="translate(${C(a)} ${C(o)})">` + $r(d.t, 0, 0, f, 0, t) + $r(d.b, 0, h, f, h, t) + $r(d.l, 0, 0, 0, h, t) + $r(d.r, f, 0, f, h, t) + "</g>"), a += e.colWidths[u] ?? 0;
    }), o += l.height;
  });
  const s = r.join("") + n.join("");
  return ro(e, e.flipH || e.flipV ? `<g transform="${oo(e)}">${s}</g>` : s, t);
}
function e$(e, t, r) {
  if (!(e != null && e.length)) return "";
  const n = Math.max(14, Math.min(t, r) * 0.036), o = [];
  return e.forEach((s, l) => {
    const i = Math.max(0, Math.min(Number.isFinite(s.x) ? s.x : 0, t - n)), a = Math.max(0, Math.min(Number.isFinite(s.y) ? s.y : 0, r - n)), c = String(s.idx ?? l + 1), u = [s.author, s.date, s.text].filter(Boolean).join(" · ");
    o.push(`<g class="ppt-comment" data-comment="${oe(c)}" transform="translate(${C(i)} ${C(a)})"><title>${oe(u)}</title><path d="M${C(n * 0.16)} 0 H${C(n * 0.84)} A ${C(n * 0.16)} ${C(n * 0.16)} 0 0 1 ${C(n)} ${C(n * 0.16)} V${C(n * 0.62)} A ${C(n * 0.16)} ${C(n * 0.16)} 0 0 1 ${C(n * 0.84)} ${C(n * 0.78)} H${C(n * 0.42)} L${C(n * 0.16)} ${C(n)} V${C(n * 0.78)} A ${C(n * 0.16)} ${C(n * 0.16)} 0 0 1 0 ${C(n * 0.62)} V${C(n * 0.16)} A ${C(n * 0.16)} ${C(n * 0.16)} 0 0 1 ${C(n * 0.16)} 0 Z" fill="rgb(255,196,60)" stroke="rgba(120,80,0,0.55)" stroke-width="${C(Math.max(0.6, n * 0.045))}"/><text x="${C(n * 0.5)}" y="${C(n * 0.42)}" text-anchor="middle" dominant-baseline="central" fill="rgb(60,40,0)" font-size="${C(n * 0.52)}" font-weight="700">${oe(c)}</text></g>`);
  }), o.join("");
}
function t$(e) {
  const t = Math.max(10, Math.min(16, e.h / 6)), r = e.preview ? `<image href="${oe(e.preview)}" width="${C(e.w)}" height="${C(e.h)}" preserveAspectRatio="none"/>` : "";
  return `<g transform="${Wr(e)}">` + r + `<rect width="${C(e.w)}" height="${C(e.h)}" fill="rgba(127,127,127,0.07)" stroke="#aaa" stroke-dasharray="6 4"/><text x="${C(e.w / 2)}" y="${C(e.h / 2)}" text-anchor="middle" dominant-baseline="middle" fill="#888" font-size="${C(t)}">${oe(e.label)}</text></g>`;
}
function mu(e, t, r, n, o, s, l) {
  var i;
  if (e.paragraphs.some((c) => c.runs.some((u) => {
    var f;
    return ((f = u.link) == null ? void 0 : f.startsWith("slide-part:")) || /^slide:(next|previous|first|last)$/.test(u.link ?? "");
  })) && (e = { ...e, paragraphs: e.paragraphs.map((c) => ({ ...c, runs: c.runs.map((u) => {
    const f = n.resolveLink(u.link);
    return f === u.link ? u : { ...u, link: f };
  }) })) }), n.textMode === "svg" || Ur((i = e.warp) == null ? void 0 : i.preset)) {
    if (e.autoFitCompute && !e.autoFitShape) {
      const u = il(e, t, r, n.measureText, { insets: o, vert: l });
      u !== e.fontScale && (e = { ...e, fontScale: u });
    }
    const c = (u) => {
      const f = n.nextId("tg");
      return n.defs.push(u.replace("__ID__", f)), f;
    };
    return ms(l && l !== e.vert ? { ...e, vert: l } : e, t, r, c, o, s, !!n.includeEditMarkers, n.measureText);
  }
  const a = xg(e, t, r, { insets: o, anchor: s, vert: l, includeEditMarkers: !!n.includeEditMarkers, measureText: n.measureText });
  return `<foreignObject width="${C(t)}" height="${C(r)}" style="overflow:visible">${a}</foreignObject>`;
}
function Y$(e, t, r = {}) {
  if (!Number.isFinite(t) || t <= 0) throw new Error("文字形状宽度必须是有限正数");
  const n = (l) => !to(e, t, l, { ...r, includeCarets: !1 }).overflow;
  let o = 1;
  for (let l = 0; l < 32 && !n(o); l++) o *= 2;
  if (!n(o)) throw new Error("spAutoFit 无法在有限高度内容纳文字");
  let s = 0;
  for (let l = 0; l < 24; l++) {
    const i = (s + o) / 2;
    n(i) ? o = i : s = i;
  }
  return o;
}
function gu(e) {
  if (!(e != null && e.length)) return [];
  const t = [];
  for (const r of e) {
    const n = r.clickGroup ?? 0;
    (t[n] ?? (t[n] = [])).push(r);
  }
  return t.filter(Boolean);
}
function $u(e, t) {
  const r = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
  for (const o of e) for (const s of o) s.kind !== "entrance" && s.kind !== "exit" || n.has(s.target) || (n.add(s.target), s.kind === "entrance" && r.add(s.target));
  for (let o = 0; o < t && o < e.length; o++) for (const s of e[o]) s.kind === "entrance" ? r.delete(s.target) : s.kind === "exit" && r.add(s.target);
  return r;
}
function n$(e) {
  const t = gu(e.animations);
  if (!t.length) return /* @__PURE__ */ new Set();
  const r = $u(t, t.length);
  if (!r.size) return r;
  const n = [], o = (s) => {
    for (const l of s) l.id !== void 0 && n.push(l.id), l.kind === "group" && o(l.children);
  };
  return o(e.elements), n.length && n.every((s) => r.has(s)) ? /* @__PURE__ */ new Set() : r;
}
const zi = "data:image/png;base64,";
function r$(e, t) {
  const r = e.toDataURL("image/png");
  if (!r.startsWith(zi)) throw new Error(`${t}：画布 ${e.width}×${e.height} 无法编码为 PNG`);
  return Uint8Array.from(atob(r.slice(zi.length)), (n) => n.charCodeAt(0));
}
const Oi = 32767;
function o$(e, t) {
  if (!Number.isFinite(t) || t <= 0) throw new RangeError("scale 必须是大于 0 的有限数");
  const r = Math.round(e.width * t), n = Math.round(e.height * t);
  if (r < 1 || n < 1 || r > Oi || n > Oi) throw new RangeError(`scale 产生了浏览器 canvas 不支持的尺寸：${r}×${n}`);
  return { width: r, height: n };
}
function s$() {
  if (typeof document > "u" || typeof Image > "u" || typeof Blob > "u") throw new Error("图片导出只能在提供 DOM、Image 与 canvas 的浏览器环境中调用");
}
function l$(e) {
  return e.split("&amp;").join("&").split("&quot;").join('"').split("&apos;").join("'");
}
function i$(e) {
  return e.replace(/\\([0-9a-f]{1,6})(?:\r\n|[ \t\r\n\f])?|\\([^\r\n])/gi, (t, r, n) => {
    const o = r === void 0 ? 0 : Number.parseInt(r, 16);
    return r === void 0 ? n : String.fromCodePoint(o > 0 && o <= 1114111 ? o : 65533);
  });
}
async function a$(e) {
  if (typeof FileReader > "u") throw new Error("当前浏览器缺少 FileReader，无法内联导出资源");
  return new Promise((t, r) => {
    const n = new FileReader();
    n.onload = () => t(String(n.result)), n.onerror = () => r(n.error ?? new Error("读取导出资源失败")), n.readAsDataURL(e);
  });
}
async function bu(e, t = !1) {
  const r = /* @__PURE__ */ new Map();
  for (const l of e.matchAll(/<image\b[^>]*\bhref="((?:blob:|https?:\/\/)[^"]+)"/g)) r.set(l[1], l$(l[1]));
  for (const l of e.matchAll(/@font-face\{[^}]*\bsrc:url\((?:'((?:blob:|https?:\/\/)[^']+)'|"((?:blob:|https?:\/\/)[^"]+)"|((?:blob:|https?:\/\/)[^)\s]+))\)/g)) {
    const i = l[1] ?? l[2] ?? l[3];
    r.set(i, i$(i));
  }
  if (!r.size) return e;
  const n = [...r].map(async ([l, i]) => {
    try {
      const a = await fetch(i);
      if (!a.ok) throw new Error(`HTTP ${a.status}`);
      return [l, await a$(await a.blob())];
    } catch (a) {
      if (t) {
        const c = a instanceof Error ? a.message : String(a);
        throw new Error(`无法内联导出资源 ${i}：${c}`);
      }
      return [l, l];
    }
  });
  let o;
  if (t) {
    const l = await Promise.allSettled(n), i = l.find((a) => a.status === "rejected");
    if (i?.status === "rejected") throw i.reason;
    o = l.map((a) => a.value);
  } else o = await Promise.all(n);
  let s = e;
  for (const [l, i] of o) s = s.split(l).join(i);
  return s;
}
function c$(e) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(e)}`;
}
async function u$(e) {
  const t = new Image();
  return t.decoding = "sync", await new Promise((r, n) => {
    t.onload = () => r(), t.onerror = () => n(new Error("SVG 渲染失败")), t.src = c$(e);
  }), t;
}
async function ji(e, t, r, n) {
  s$();
  const o = o$(e, r.scale), s = await bu(du(e, t, { textMode: n, hiddenElements: r.hiddenElements, showComments: r.showComments }), r.strictResources), l = await u$(s), i = document.createElement("canvas");
  i.width = o.width, i.height = o.height;
  try {
    const a = i.getContext("2d");
    if (!a) throw new Error("无法获取 canvas 上下文");
    return a.fillStyle = "#fff", a.fillRect(0, 0, i.width, i.height), a.drawImage(l, 0, 0, i.width, i.height), new Blob([r$(i, "导出 PNG 失败")], { type: "image/png" });
  } finally {
    i.width = 0, i.height = 0;
  }
}
async function f$(e, t, r) {
  try {
    return await ji(e, t, r, "html");
  } catch (n) {
    if (n?.name !== "SecurityError") throw n;
    return ji(e, t, r, "svg");
  }
}
function G$(e, t, r = 2, n = {}) {
  return f$(e, t, { ...n, scale: r });
}
async function Fi(e, t, r, n = {}) {
  return bu(du(e, t, { textMode: "svg", hiddenElements: r, showComments: n.showComments }));
}
async function Z$(e, t = {}) {
  const r = [];
  for (const s of e.slides) {
    const l = t.animationSteps ? gu(s.animations) : [];
    if (!l.length) {
      r.push(Fi(e, s, [...n$(s)], t));
      continue;
    }
    for (let i = 0; i <= l.length; i++) r.push(Fi(e, s, [...$u(l, i)], t));
  }
  const n = await Promise.all(r), { printDocument: o } = await import("./comment-export-CpTHwH59-DSc0AMnl.js");
  return o(e, n, t.showComments, oe);
}
function Ui(e, t) {
  let r = e.get(t);
  return r || (r = { family: t, styles: /* @__PURE__ */ new Set(), chars: /* @__PURE__ */ new Set(), count: 0 }, e.set(t, r)), r;
}
function h$(e, t) {
  for (const r of t.runs) if (!(!r.text || !r.fonts.length)) for (const n of r.fonts) {
    const o = Ui(e, n);
    o.styles.add(`${r.b ? 1 : 0}${r.i ? 1 : 0}`);
    for (const s of r.text) o.chars.add(s);
    o.count += r.text.length;
  }
  if (t.bullet && t.bulletFont && !/wingdings|webdings|symbol/i.test(t.bulletFont)) {
    const r = Ui(e, t.bulletFont);
    r.styles.add("00");
    for (const n of t.bullet) r.chars.add(n);
    r.count += t.bullet.length;
  }
}
function Di(e, t) {
  for (const r of t?.paragraphs ?? []) h$(e, r);
}
function xu(e, t) {
  for (const r of t) switch (r.kind) {
    case "shape":
      Di(e, r.text);
      break;
    case "group":
      xu(e, r.children);
      break;
    case "table":
      for (const n of r.rows) for (const o of n.cells) Di(e, o.text);
      break;
  }
}
function _$(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) xu(t, n.elements);
  const r = [];
  for (const n of t.values()) n.chars.size && r.push({ family: n.family, styles: [...n.styles].sort().map((o) => ({ bold: o[0] === "1", italic: o[1] === "1" })), chars: [...n.chars].sort((o, s) => o.codePointAt(0) - s.codePointAt(0)).join(""), count: n.count });
  return r.sort((n, o) => o.count - n.count || n.family.localeCompare(o.family));
}
oa(lp);
$f(P1);
N1(tm);
A1(fm);
function d$(e) {
  let t;
  try {
    t = new Sc(e);
  } catch {
    return null;
  }
  const r = t.stream("EncryptedPackage");
  return r ? { info: t.stream("EncryptionInfo"), pkg: r } : null;
}
async function q$(e, t = {}) {
  let r;
  if (e instanceof Uint8Array ? r = e : e instanceof ArrayBuffer ? r = new Uint8Array(e) : r = new Uint8Array(await e.arrayBuffer()), r[0] === 80 && r[1] === 75) return Xl(r, t);
  if (r[0] === 208 && r[1] === 207) {
    const n = d$(r);
    if (n) {
      if (!n.info) throw new Error("该文件已加密，但 EncryptionInfo 流缺失，文件可能已损坏");
      const o = R1();
      if (!o) throw new Error("该文件已加密，但未注入解密器（setDecryptor）");
      if (t.password === void 0) throw new Nc();
      return Xl(o(n.info, n.pkg, t.password), t);
    }
    return T2(r, t.password, t.edit === !0);
  }
  throw new Error("无法识别的文件格式：既不是 .pptx（Zip）也不是 .ppt（CFB）");
}
function p$(e, t) {
  const r = (s) => {
    if (typeof s != "string" || !s.startsWith("asset:")) return s;
    const l = Number(s.slice(6));
    return Number.isInteger(l) ? t[l] ?? null : null;
  }, n = (s) => {
    const l = s;
    l && l.type === "image" && typeof l.src == "string" && (l.src = r(l.src) ?? "");
  }, o = (s) => {
    var l, i;
    for (const a of s) if (a.kind === "image") a.src = r(a.src) ?? "", (l = a.media) != null && l.src && (a.media.src = r(a.media.src) ?? null);
    else if (a.kind === "shape") {
      n(a.fill);
      for (const c of ((i = a.text) == null ? void 0 : i.paragraphs) ?? []) c.bulletImage && (c.bulletImage = r(c.bulletImage) ?? null);
    } else if (a.kind === "group") o(a.children);
    else if (a.kind === "table") for (const c of a.rows) for (const u of c.cells) n(u.fill);
  };
  for (const s of e.slides) n(s.background), o(s.elements);
  for (const s of e.embeddedFonts ?? []) s.src = r(s.src) ?? "";
  for (const s of e.embeddedFontSources ?? []) s.src = r(s.src) ?? "";
}
let m$ = 0;
function J$(e, t, r = {}) {
  const n = t instanceof Uint8Array ? t.slice().buffer : t, o = ++m$;
  return new Promise((s, l) => {
    const i = (a) => {
      if (a.data.id !== o) return;
      if (e.removeEventListener("message", i), !a.data.ok || !a.data.presentation) {
        const f = a.data.error ?? "Worker 解析失败";
        l(a.data.reason ? new Yr(a.data.reason, f) : new Error(f));
        return;
      }
      const c = [];
      for (const f of a.data.assets ?? []) try {
        c.push(URL.createObjectURL(new Blob([f.data], { type: f.mime })));
      } catch {
        c.push(null);
      }
      const u = a.data.presentation;
      p$(u, c), u.dispose = () => {
        for (const f of c) f && URL.revokeObjectURL(f);
        c.length = 0;
      }, s(u);
    };
    e.addEventListener("message", i), e.postMessage({ id: o, bytes: n, zip: r.zip }, [n]);
  });
}
function Bi(e) {
  return e ? e.paragraphs.map((t) => t.runs.map((r) => r.text).join("")).join(`
`) : "";
}
function wu(e, t) {
  for (const r of e) switch (r.kind) {
    case "shape":
      t.push(Bi(r.text));
      break;
    case "group":
      wu(r.children, t);
      break;
    case "table":
      for (const n of r.rows) for (const o of n.cells) t.push(Bi(o.text));
      break;
  }
}
function K$(e) {
  const t = [];
  return wu(e.elements, t), e.notes && t.push(e.notes), t.filter(Boolean).join(`
`);
}
export {
  Pl as DEFAULT_TEXT_LINE_HEIGHT,
  Wu as DEFAULT_ZIP_LIMITS,
  Tl as MAX_SAFE_EXTERNAL_HREF_LENGTH,
  En as PARAGRAPH_LAYOUT_DIRECT_BITS,
  nn as PLACEHOLDER_DIRECT_BITS,
  aa as PLACEHOLDER_TYPE_EQUIVALENTS,
  Nc as PasswordRequiredError,
  Lt as TEXT_BODY_PROPERTY_BITS,
  P$ as TEXT_CAPS_STYLES,
  Te as TEXT_RUN_DIRECT_BITS,
  hh as TEXT_STRIKE_STYLES,
  fh as TEXT_UNDERLINE_STYLES,
  uh as THEME_COLOR_SLOTS,
  _s as WrongPasswordError,
  ys as ZipReader,
  Yr as ZipSafetyError,
  _$ as collectFonts,
  T1 as detectMetafile,
  j$ as encryptionScheme,
  Sf as findPlaceholderByIdentity,
  Y$ as fitTextShapeHeight,
  bh as formatDrawingAutoNumber,
  gu as groupSteps,
  O$ as hasDecryptor,
  I$ as hasFontDecoder,
  C$ as hasMetafileDecoder,
  $u as hiddenBefore,
  v$ as inheritPptxParsingContext,
  H$ as invalidateTextMeasureCaches,
  $$ as isKnownPreset,
  to as layoutText,
  P1 as metafileToSvg,
  L$ as paragraphLayoutDirectFlags,
  q$ as parse,
  J$ as parseInWorker,
  Ma as parseSafeExternalUrl,
  Ug as placeGroupChild,
  fu as placeGroupFrame,
  E$ as placeholderDirectFlags,
  Z$ as presentationToPrintableHtml,
  pf as readImageMetadata,
  B$ as releasePptxLayoutReparseSession,
  X$ as renderElementToSvg,
  du as renderSlideToSvg,
  xg as renderTextBodyToHtml,
  U$ as reparsePptxLayoutTemplate,
  D$ as reparsePptxMasterTemplate,
  F$ as reparsePptxSlideWithLayout,
  g$ as resolveGeomPath,
  y$ as safeUnzipSync,
  Ii as scalePathData,
  M$ as setChartExParser,
  oa as setChartParser,
  k$ as setChartRenderer,
  N1 as setDecryptor,
  A$ as setFontDecoder,
  $f as setMetafileDecoder,
  A1 as setPptDecryptor,
  W$ as setShape3DRenderer,
  O1 as sha256,
  K$ as slideText,
  G$ as slideToPng,
  Fi as slideToSvgFile,
  n$ as staticHidden,
  Na as tableStyleCellAppearance,
  z$ as tableStylePreview,
  S$ as textRunDirectFlags,
  Ef as textRunFontStack,
  Af as transitionDefaultDirection,
  T$ as transitionPreferredDirection,
  V$ as unplaceGroupFrame,
  w$ as validateZipArchive
};
