import { jsx as c, jsxs as u, Fragment as xt } from "react/jsx-runtime";
import { useState as P, useRef as De, useEffect as Ae, useMemo as Xe, useCallback as ui, lazy as Hn, createElement as Oa, Suspense as pb } from "react";
import { createPortal as wi } from "react-dom";
import { RefreshCw as lt, Check as Nr, Link2 as _i, FileText as Uu, LayoutGrid as gb, FileSpreadsheet as mb, Presentation as bb, ListChecks as yb, ListTree as Tf, Paintbrush as wb, Network as _b, GitBranch as kb, X as Fn, Download as no, FileWarning as vb, Eye as Ab, Plus as ro, Copy as Wc, ShieldCheck as jn, Stamp as Cb, ShieldAlert as $u, Printer as Ib, Files as Sb, Save as cr, BookOpen as Ln, Search as mn, LayoutTemplate as Qu, Upload as ju, Settings as Eb, Pin as qu, Star as Hu, MoreHorizontal as Gu, ChevronDown as es, Clock3 as Ua, Pencil as Vl, Bell as Ju, Trash2 as Sa, ChevronRight as ii, LoaderCircle as si, FilePlus2 as xb, Users as ds, CalendarClock as Vu, Share2 as Ku, Tags as Wu, GitMerge as Xu, Wifi as Zu, GitPullRequest as Kl, MessageSquare as Yu, Activity as eh, Sparkles as Wl, LockKeyhole as Nb, Send as th, Cloud as Db, Paperclip as Bb, FolderOpen as Pb, FileSearch as Xl, Filter as Mb, KeyRound as zb } from "lucide-react";
function te({ className: t = "", ...e }) {
  return /* @__PURE__ */ c("button", { className: `knowledge-button ${t}`.trim(), ...e });
}
function hi({ children: t }) {
  return /* @__PURE__ */ c("div", { className: "knowledge-page-empty", children: t });
}
function Es(t) {
  return t instanceof DOMException && t.name === "AbortError" ? "操作已取消。" : t instanceof Error && t.message ? t.message : "知识库暂时不可用，请稍后重试。";
}
const Rb = /^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,95}$/;
function nh(t) {
  if (!t || t.length > 1024) return null;
  try {
    const e = JSON.parse(t);
    return Rb.test(e?.datasourceKey || "") && Number.isSafeInteger(e?.expectedRevision) && e.expectedRevision > 0 ? e : null;
  } catch {
    return null;
  }
}
function Tb({ client: t, library: e, disabled: n, formatError: r = Es, onBusyChange: i, onBound: s }) {
  const a = `domainry-knowledge-source:${t.scope?.() || "default"}:${e.id}`, [l, d] = P(() => nh(localStorage.getItem(a))), [h, b] = P(null), [m, p] = P([""]), [g, _] = P(0), [k, y] = P(""), [C, S] = P(!1), [x, z] = P(!0), [N, R] = P(""), B = De(!1), U = De(null), Q = m.at(-1) || "";
  Ae(() => {
    const F = new AbortController();
    return z(!0), b(null), t.listSources(e.id, Q, 10, F.signal).then((v) => {
      F.signal.aborted || (b(v), R(""), v.current_key && nh(localStorage.getItem(a))?.datasourceKey === v.current_key && v.status === "connected" && (localStorage.removeItem(a), d(null)));
    }).catch((v) => {
      F.signal.aborted || (b(null), R(r(v)));
    }).finally(() => {
      F.signal.aborted || z(!1);
    }), () => F.abort();
  }, [t, Q, r, e.id, g, a]), Ae(() => () => {
    U.current?.abort(), i?.(!1);
  }, [i]);
  const K = n || C, pe = h?.items.find((F) => F.key === k && F.available);
  async function E() {
    if (B.current || n || !h?.can_bind || !l && !pe) return;
    B.current = !0, S(!0), i?.(!0), R("");
    const F = new AbortController();
    U.current = F;
    try {
      const v = l || { datasourceKey: k, expectedRevision: h.revision };
      localStorage.setItem(a, JSON.stringify(v)), d(v);
      const T = await t.bindSource(e.id, v.datasourceKey, v.expectedRevision, AbortSignal.any([F.signal, AbortSignal.timeout(3e4)]));
      if (F.signal.aborted) return;
      localStorage.removeItem(a), d(null), y(""), s(T), _((fe) => fe + 1);
    } catch (v) {
      F.signal.aborted || R(r(v));
    } finally {
      B.current = !1, F.signal.aborted || (S(!1), i?.(!1));
    }
  }
  return /* @__PURE__ */ u("section", { className: "knowledge-sources", "aria-label": "外部内容连接", "data-static-ui-list": !0, children: [
    /* @__PURE__ */ u("div", { className: "knowledge-section-heading", children: [
      /* @__PURE__ */ c("h3", { children: "外部内容连接" }),
      /* @__PURE__ */ u(te, { disabled: K || x, onClick: () => _((F) => F + 1), children: [
        /* @__PURE__ */ c(lt, { size: 14 }),
        "刷新"
      ] })
    ] }),
    N && /* @__PURE__ */ c("p", { role: "alert", className: "knowledge-error", children: N }),
    x ? /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "正在读取可用知识源…" }) : h && /* @__PURE__ */ u(xt, { children: [
      h.status === "connected" ? /* @__PURE__ */ u("p", { className: "knowledge-subtle", children: [
        /* @__PURE__ */ c(Nr, { size: 15, className: "knowledge-inline" }),
        " 已连接外部内容，可上传资料并建立索引。"
      ] }) : h.status === "unavailable" ? /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "当前连接暂不可用；已保存原文件仍按知识库权限保留。" }) : h.status === "host_managed" ? /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "此知识库的外部内容连接由宿主管理。" }) : /* @__PURE__ */ u("p", { className: "knowledge-subtle", children: [
        "选择一个外部内容连接到“",
        e.name,
        "”。"
      ] }),
      h.status === "unbound" && /* @__PURE__ */ u(xt, { children: [
        !h.can_bind && /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "当前没有连接权限，或资料库已归档。" }),
        h.items.length === 0 ? /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "暂无可选择的知识源。" }) : /* @__PURE__ */ c("div", { className: "knowledge-source-list", children: h.items.map((F) => /* @__PURE__ */ u("button", { "aria-current": k === F.key ? "true" : void 0, disabled: K || !!l || !F.available, onClick: () => y(F.key), children: [
          /* @__PURE__ */ c(_i, { size: 16 }),
          /* @__PURE__ */ u("span", { children: [
            /* @__PURE__ */ c("strong", { children: F.name }),
            /* @__PURE__ */ c("small", { children: F.available ? F.description || "可连接" : "暂不可连接" })
          ] })
        ] }, F.key)) })
      ] }),
      (m.length > 1 || !h.complete) && /* @__PURE__ */ u("nav", { className: "knowledge-pagination", children: [
        /* @__PURE__ */ c(te, { disabled: K || x || m.length === 1, onClick: () => {
          y(""), p((F) => F.slice(0, -1));
        }, children: "上一页" }),
        /* @__PURE__ */ c(te, { disabled: K || x || !h.next_after, onClick: () => {
          y(""), p((F) => [...F, h.next_after]);
        }, children: "下一页" })
      ] }),
      l && /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "上次连接结果待确认；继续时使用同一个知识源，不会重复创建绑定。" }),
      (h.status === "unbound" || l) && /* @__PURE__ */ u("div", { className: "knowledge-actions", children: [
        /* @__PURE__ */ u(te, { disabled: K || !h.can_bind || !l && !pe, onClick: () => {
          E();
        }, children: [
          /* @__PURE__ */ c(_i, { size: 15 }),
          C ? "正在连接…" : l ? "继续确认连接" : "连接知识源"
        ] }),
        l && /* @__PURE__ */ c(te, { disabled: K, onClick: () => {
          localStorage.removeItem(a), d(null);
        }, children: "结束重试" })
      ] })
    ] })
  ] });
}
function $a(t, e, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(a) {
      a(s);
    });
  }
  return new (n || (n = Promise))(function(s, a) {
    function l(b) {
      try {
        h(r.next(b));
      } catch (m) {
        a(m);
      }
    }
    function d(b) {
      try {
        h(r.throw(b));
      } catch (m) {
        a(m);
      }
    }
    function h(b) {
      b.done ? s(b.value) : i(b.value).then(l, d);
    }
    h((r = r.apply(t, [])).next());
  });
}
class nt {
  constructor() {
    this.mutex = Promise.resolve();
  }
  lock() {
    let e = () => {
    };
    return this.mutex = this.mutex.then(() => new Promise(e)), new Promise((n) => {
      e = n;
    });
  }
  dispatch(e) {
    return $a(this, void 0, void 0, function* () {
      const n = yield this.lock();
      try {
        return yield Promise.resolve(e());
      } finally {
        n();
      }
    });
  }
}
var Zl;
function Fb() {
  return typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global;
}
const Ac = Fb(), Yl = (Zl = Ac.Buffer) !== null && Zl !== void 0 ? Zl : null, Lb = Ac.TextEncoder ? new Ac.TextEncoder() : null;
function Ff(t, e) {
  return (t & 15) + (t >> 6 | t >> 3 & 8) << 4 | (e & 15) + (e >> 6 | e >> 3 & 8);
}
function Ob(t, e) {
  const n = e.length >> 1;
  for (let r = 0; r < n; r++) {
    const i = r << 1;
    t[r] = Ff(e.charCodeAt(i), e.charCodeAt(i + 1));
  }
}
function Ub(t, e) {
  if (t.length !== e.length * 2)
    return !1;
  for (let n = 0; n < e.length; n++) {
    const r = n << 1;
    if (e[n] !== Ff(t.charCodeAt(r), t.charCodeAt(r + 1)))
      return !1;
  }
  return !0;
}
const rh = 87, ih = 48;
function sh(t, e, n) {
  let r = 0;
  for (let i = 0; i < n; i++) {
    let s = e[i] >>> 4;
    t[r++] = s > 9 ? s + rh : s + ih, s = e[i] & 15, t[r++] = s > 9 ? s + rh : s + ih;
  }
  return String.fromCharCode.apply(null, t);
}
const ah = Yl !== null ? (t) => {
  if (typeof t == "string") {
    const e = Yl.from(t, "utf8");
    return new Uint8Array(e.buffer, e.byteOffset, e.length);
  }
  if (Yl.isBuffer(t))
    return new Uint8Array(t.buffer, t.byteOffset, t.length);
  if (ArrayBuffer.isView(t))
    return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
  throw new Error("Invalid data type!");
} : (t) => {
  if (typeof t == "string")
    return Lb.encode(t);
  if (ArrayBuffer.isView(t))
    return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
  throw new Error("Invalid data type!");
}, oh = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", os = new Uint8Array(256);
for (let t = 0; t < oh.length; t++)
  os[oh.charCodeAt(t)] = t;
function $b(t) {
  let e = Math.floor(t.length * 0.75);
  const n = t.length;
  return t[n - 1] === "=" && (e -= 1, t[n - 2] === "=" && (e -= 1)), e;
}
function Qb(t) {
  const e = $b(t), n = t.length, r = new Uint8Array(e);
  let i = 0;
  for (let s = 0; s < n; s += 4) {
    const a = os[t.charCodeAt(s)], l = os[t.charCodeAt(s + 1)], d = os[t.charCodeAt(s + 2)], h = os[t.charCodeAt(s + 3)];
    r[i] = a << 2 | l >> 4, i += 1, r[i] = (l & 15) << 4 | d >> 2, i += 1, r[i] = (d & 3) << 6 | h & 63, i += 1;
  }
  return r;
}
const Ea = 16 * 1024, ts = 4, jb = new nt(), ec = /* @__PURE__ */ new Map();
function qb(t, e) {
  return $a(this, void 0, void 0, function* () {
    let n = null, r = null, i = !1;
    if (typeof WebAssembly > "u")
      throw new Error("WebAssembly is not supported in this environment!");
    const s = (R, B = 0) => {
      r.set(R, B);
    }, a = () => r, l = () => n.exports, d = (R) => {
      n.exports.Hash_SetMemorySize(R);
      const B = n.exports.Hash_GetBuffer(), U = n.exports.memory.buffer;
      r = new Uint8Array(U, B, R);
    }, h = () => new DataView(n.exports.memory.buffer).getUint32(n.exports.STATE_SIZE, !0), b = jb.dispatch(() => $a(this, void 0, void 0, function* () {
      if (!ec.has(t.name)) {
        const B = Qb(t.data), U = WebAssembly.compile(B);
        ec.set(t.name, U);
      }
      const R = yield ec.get(t.name);
      n = yield WebAssembly.instantiate(R, {
        // env: {
        //   emscripten_memcpy_big: (dest, src, num) => {
        //     const memoryBuffer = wasmInstance.exports.memory.buffer;
        //     const memView = new Uint8Array(memoryBuffer, 0);
        //     memView.set(memView.subarray(src, src + num), dest);
        //   },
        //   print_memory: (offset, len) => {
        //     const memoryBuffer = wasmInstance.exports.memory.buffer;
        //     const memView = new Uint8Array(memoryBuffer, 0);
        //     console.log('print_int32', memView.subarray(offset, offset + len));
        //   },
        // },
      });
    })), m = () => $a(this, void 0, void 0, function* () {
      n || (yield b);
      const R = n.exports.Hash_GetBuffer(), B = n.exports.memory.buffer;
      r = new Uint8Array(B, R, Ea);
    }), p = (R = null) => {
      i = !0, n.exports.Hash_Init(R);
    }, g = (R) => {
      let B = 0;
      for (; B < R.length; ) {
        const U = R.subarray(B, B + Ea);
        B += U.length, r.set(U), n.exports.Hash_Update(U.length);
      }
    }, _ = (R) => {
      if (!i)
        throw new Error("update() called before init()");
      const B = ah(R);
      g(B);
    }, k = new Uint8Array(e * 2), y = (R, B = null) => {
      if (!i)
        throw new Error("digest() called before init()");
      return i = !1, n.exports.Hash_Final(B), R === "binary" ? r.slice(0, e) : sh(k, r, e);
    }, C = () => {
      if (!i)
        throw new Error("save() can only be called after init() and before digest()");
      const R = n.exports.Hash_GetState(), B = h(), U = n.exports.memory.buffer, Q = new Uint8Array(U, R, B), K = new Uint8Array(ts + B);
      return Ob(K, t.hash), K.set(Q, ts), K;
    }, S = (R) => {
      if (!(R instanceof Uint8Array))
        throw new Error("load() expects an Uint8Array generated by save()");
      const B = n.exports.Hash_GetState(), U = h(), Q = ts + U, K = n.exports.memory.buffer;
      if (R.length !== Q)
        throw new Error(`Bad state length (expected ${Q} bytes, got ${R.length})`);
      if (!Ub(t.hash, R.subarray(0, ts)))
        throw new Error("This state was written by an incompatible hash implementation");
      const pe = R.subarray(ts);
      new Uint8Array(K, B, U).set(pe), i = !0;
    }, x = (R) => typeof R == "string" ? R.length < Ea / 4 : R.byteLength < Ea;
    let z = x;
    switch (t.name) {
      case "argon2":
      case "scrypt":
        z = () => !0;
        break;
      case "blake2b":
      case "blake2s":
        z = (R, B) => B <= 512 && x(R);
        break;
      case "blake3":
        z = (R, B) => B === 0 && x(R);
        break;
      case "xxhash64":
      // cannot simplify
      case "xxhash3":
      case "xxhash128":
      case "crc64":
        z = () => !1;
        break;
    }
    const N = (R, B = null, U = null) => {
      if (!z(R, B))
        return p(B), _(R), y("hex", U);
      const Q = ah(R);
      return r.set(Q), n.exports.Hash_Calculate(Q.length, B, U), sh(k, r, e);
    };
    return yield m(), {
      getMemory: a,
      writeMemory: s,
      getExports: l,
      setMemorySize: d,
      init: p,
      update: _,
      digest: y,
      save: C,
      load: S,
      calculate: N,
      hashLength: e
    };
  });
}
new nt();
new nt();
new nt();
new nt();
new nt();
new nt();
new nt();
new nt();
new nt();
new nt();
new nt();
var Hb = "sha256", Gb = "AGFzbQEAAAABEQRgAAF/YAF/AGAAAGACf38AAwgHAAEBAQIAAwUEAQECAgYOAn8BQfCJBQt/AEGACAsHcAgGbWVtb3J5AgAOSGFzaF9HZXRCdWZmZXIAAAlIYXNoX0luaXQAAQtIYXNoX1VwZGF0ZQACCkhhc2hfRmluYWwABA1IYXNoX0dldFN0YXRlAAUOSGFzaF9DYWxjdWxhdGUABgpTVEFURV9TSVpFAwEKnEoHBQBBgAkLnQEAQQBCADcDwIkBQQBBHEEgIABB4AFGIgAbNgLoiQFBAEKnn+anxvST/b5/Qquzj/yRo7Pw2wAgABs3A+CJAUEAQrGWgP6fooWs6ABC/6S5iMWR2oKbfyAAGzcD2IkBQQBCl7rDg5Onlod3QvLmu+Ojp/2npX8gABs3A9CJAUEAQti9loj8oLW+NkLnzKfQ1tDrs7t/IAAbNwPIiQEL7wICAX4Gf0EAQQApA8CJASIBIACtfDcDwIkBAkACQAJAIAGnQT9xIgINAEGACSEDDAELAkBBwAAgAmsiBCAAIAQgAEkbIgNFDQAgA0EDcSEFIAJBgIkBaiEGQQAhAgJAIANBBEkNACADQfwAcSEHQQAhAgNAIAYgAmoiAyACQYAJai0AADoAACADQQFqIAJBgQlqLQAAOgAAIANBAmogAkGCCWotAAA6AAAgA0EDaiACQYMJai0AADoAACAHIAJBBGoiAkcNAAsLIAVFDQADQCAGIAJqIAJBgAlqLQAAOgAAIAJBAWohAiAFQX9qIgUNAAsLIAAgBEkNAUGAiQEQAyAAIARrIQAgBEGACWohAwsCQCAAQcAASQ0AA0AgAxADIANBwABqIQMgAEFAaiIAQT9LDQALCyAARQ0AQQAhAkEAIQUDQCACQYCJAWogAyACai0AADoAACACQQFqIQIgACAFQQFqIgVB/wFxSw0ACwsLoz4BRX9BACAAKAI8IgFBGHQgAUGA/gNxQQh0ciABQQh2QYD+A3EgAUEYdnJyIgFBGXcgAUEOd3MgAUEDdnMgACgCOCICQRh0IAJBgP4DcUEIdHIgAkEIdkGA/gNxIAJBGHZyciICaiAAKAIgIgNBGHQgA0GA/gNxQQh0ciADQQh2QYD+A3EgA0EYdnJyIgRBGXcgBEEOd3MgBEEDdnMgACgCHCIDQRh0IANBgP4DcUEIdHIgA0EIdkGA/gNxIANBGHZyciIFaiAAKAIEIgNBGHQgA0GA/gNxQQh0ciADQQh2QYD+A3EgA0EYdnJyIgZBGXcgBkEOd3MgBkEDdnMgACgCACIDQRh0IANBgP4DcUEIdHIgA0EIdkGA/gNxIANBGHZyciIHaiAAKAIkIgNBGHQgA0GA/gNxQQh0ciADQQh2QYD+A3EgA0EYdnJyIghqIAJBD3cgAkENd3MgAkEKdnNqIgNqIAAoAhgiCUEYdCAJQYD+A3FBCHRyIAlBCHZBgP4DcSAJQRh2cnIiCkEZdyAKQQ53cyAKQQN2cyAAKAIUIglBGHQgCUGA/gNxQQh0ciAJQQh2QYD+A3EgCUEYdnJyIgtqIAJqIAAoAhAiCUEYdCAJQYD+A3FBCHRyIAlBCHZBgP4DcSAJQRh2cnIiDEEZdyAMQQ53cyAMQQN2cyAAKAIMIglBGHQgCUGA/gNxQQh0ciAJQQh2QYD+A3EgCUEYdnJyIg1qIAAoAjAiCUEYdCAJQYD+A3FBCHRyIAlBCHZBgP4DcSAJQRh2cnIiDmogACgCCCIJQRh0IAlBgP4DcUEIdHIgCUEIdkGA/gNxIAlBGHZyciIPQRl3IA9BDndzIA9BA3ZzIAZqIAAoAigiCUEYdCAJQYD+A3FBCHRyIAlBCHZBgP4DcSAJQRh2cnIiEGogAUEPdyABQQ13cyABQQp2c2oiCUEPdyAJQQ13cyAJQQp2c2oiEUEPdyARQQ13cyARQQp2c2oiEkEPdyASQQ13cyASQQp2c2oiE2ogACgCNCIUQRh0IBRBgP4DcUEIdHIgFEEIdkGA/gNxIBRBGHZyciIVQRl3IBVBDndzIBVBA3ZzIA5qIBJqIAAoAiwiAEEYdCAAQYD+A3FBCHRyIABBCHZBgP4DcSAAQRh2cnIiFkEZdyAWQQ53cyAWQQN2cyAQaiARaiAIQRl3IAhBDndzIAhBA3ZzIARqIAlqIAVBGXcgBUEOd3MgBUEDdnMgCmogAWogC0EZdyALQQ53cyALQQN2cyAMaiAVaiANQRl3IA1BDndzIA1BA3ZzIA9qIBZqIANBD3cgA0ENd3MgA0EKdnNqIhRBD3cgFEENd3MgFEEKdnNqIhdBD3cgF0ENd3MgF0EKdnNqIhhBD3cgGEENd3MgGEEKdnNqIhlBD3cgGUENd3MgGUEKdnNqIhpBD3cgGkENd3MgGkEKdnNqIhtBD3cgG0ENd3MgG0EKdnNqIhxBGXcgHEEOd3MgHEEDdnMgAkEZdyACQQ53cyACQQN2cyAVaiAYaiAOQRl3IA5BDndzIA5BA3ZzIBZqIBdqIBBBGXcgEEEOd3MgEEEDdnMgCGogFGogE0EPdyATQQ13cyATQQp2c2oiHUEPdyAdQQ13cyAdQQp2c2oiHkEPdyAeQQ13cyAeQQp2c2oiH2ogE0EZdyATQQ53cyATQQN2cyAYaiADQRl3IANBDndzIANBA3ZzIAFqIBlqIB9BD3cgH0ENd3MgH0EKdnNqIiBqIBJBGXcgEkEOd3MgEkEDdnMgF2ogH2ogEUEZdyARQQ53cyARQQN2cyAUaiAeaiAJQRl3IAlBDndzIAlBA3ZzIANqIB1qIBxBD3cgHEENd3MgHEEKdnNqIiFBD3cgIUENd3MgIUEKdnNqIiJBD3cgIkENd3MgIkEKdnNqIiNBD3cgI0ENd3MgI0EKdnNqIiRqIBtBGXcgG0EOd3MgG0EDdnMgHmogI2ogGkEZdyAaQQ53cyAaQQN2cyAdaiAiaiAZQRl3IBlBDndzIBlBA3ZzIBNqICFqIBhBGXcgGEEOd3MgGEEDdnMgEmogHGogF0EZdyAXQQ53cyAXQQN2cyARaiAbaiAUQRl3IBRBDndzIBRBA3ZzIAlqIBpqICBBD3cgIEENd3MgIEEKdnNqIiVBD3cgJUENd3MgJUEKdnNqIiZBD3cgJkENd3MgJkEKdnNqIidBD3cgJ0ENd3MgJ0EKdnNqIihBD3cgKEENd3MgKEEKdnNqIilBD3cgKUENd3MgKUEKdnNqIipBD3cgKkENd3MgKkEKdnNqIitBGXcgK0EOd3MgK0EDdnMgH0EZdyAfQQ53cyAfQQN2cyAbaiAnaiAeQRl3IB5BDndzIB5BA3ZzIBpqICZqIB1BGXcgHUEOd3MgHUEDdnMgGWogJWogJEEPdyAkQQ13cyAkQQp2c2oiLEEPdyAsQQ13cyAsQQp2c2oiLUEPdyAtQQ13cyAtQQp2c2oiLmogJEEZdyAkQQ53cyAkQQN2cyAnaiAgQRl3ICBBDndzICBBA3ZzIBxqIChqIC5BD3cgLkENd3MgLkEKdnNqIi9qICNBGXcgI0EOd3MgI0EDdnMgJmogLmogIkEZdyAiQQ53cyAiQQN2cyAlaiAtaiAhQRl3ICFBDndzICFBA3ZzICBqICxqICtBD3cgK0ENd3MgK0EKdnNqIjBBD3cgMEENd3MgMEEKdnNqIjFBD3cgMUENd3MgMUEKdnNqIjJBD3cgMkENd3MgMkEKdnNqIjNqICpBGXcgKkEOd3MgKkEDdnMgLWogMmogKUEZdyApQQ53cyApQQN2cyAsaiAxaiAoQRl3IChBDndzIChBA3ZzICRqIDBqICdBGXcgJ0EOd3MgJ0EDdnMgI2ogK2ogJkEZdyAmQQ53cyAmQQN2cyAiaiAqaiAlQRl3ICVBDndzICVBA3ZzICFqIClqIC9BD3cgL0ENd3MgL0EKdnNqIjRBD3cgNEENd3MgNEEKdnNqIjVBD3cgNUENd3MgNUEKdnNqIjZBD3cgNkENd3MgNkEKdnNqIjdBD3cgN0ENd3MgN0EKdnNqIjhBD3cgOEENd3MgOEEKdnNqIjlBD3cgOUENd3MgOUEKdnNqIjogOCA0IC4gLCAhIBsgGSADIA4gBEEAKALYiQEiO0EadyA7QRV3cyA7QQd3c0EAKALkiQEiPGpBACgC4IkBIj1BACgC3IkBIj5zIDtxID1zaiAHakGY36iUBGoiB0EAKALUiQEiP2oiACAMaiA7IA1qID4gD2ogPSAGaiAAID4gO3NxID5zaiAAQRp3IABBFXdzIABBB3dzakGRid2JB2oiQEEAKALQiQEiQWoiDCAAIDtzcSA7c2ogDEEadyAMQRV3cyAMQQd3c2pBz/eDrntqIkJBACgCzIkBIkNqIg0gDCAAc3EgAHNqIA1BGncgDUEVd3MgDUEHd3NqQaW3181+aiJEQQAoAsiJASIAaiIPIA0gDHNxIAxzaiAPQRp3IA9BFXdzIA9BB3dzakHbhNvKA2oiRSBBIEMgAHNxIEMgAHFzIABBHncgAEETd3MgAEEKd3NqIAdqIgZqIgdqIAUgD2ogCiANaiALIAxqIAcgDyANc3EgDXNqIAdBGncgB0EVd3MgB0EHd3NqQfGjxM8FaiIKIAYgAHMgQ3EgBiAAcXMgBkEedyAGQRN3cyAGQQp3c2ogQGoiDGoiBCAHIA9zcSAPc2ogBEEadyAEQRV3cyAEQQd3c2pBpIX+kXlqIgsgDCAGcyAAcSAMIAZxcyAMQR53IAxBE3dzIAxBCndzaiBCaiINaiIPIAQgB3NxIAdzaiAPQRp3IA9BFXdzIA9BB3dzakHVvfHYemoiQCANIAxzIAZxIA0gDHFzIA1BHncgDUETd3MgDUEKd3NqIERqIgZqIgcgDyAEc3EgBHNqIAdBGncgB0EVd3MgB0EHd3NqQZjVnsB9aiJCIAYgDXMgDHEgBiANcXMgBkEedyAGQRN3cyAGQQp3c2ogRWoiDGoiBWogFiAHaiAQIA9qIAggBGogBSAHIA9zcSAPc2ogBUEadyAFQRV3cyAFQQd3c2pBgbaNlAFqIgggDCAGcyANcSAMIAZxcyAMQR53IAxBE3dzIAxBCndzaiAKaiINaiIPIAUgB3NxIAdzaiAPQRp3IA9BFXdzIA9BB3dzakG+i8ahAmoiDiANIAxzIAZxIA0gDHFzIA1BHncgDUETd3MgDUEKd3NqIAtqIgZqIgcgDyAFc3EgBXNqIAdBGncgB0EVd3MgB0EHd3NqQcP7sagFaiIQIAYgDXMgDHEgBiANcXMgBkEedyAGQRN3cyAGQQp3c2ogQGoiDGoiBCAHIA9zcSAPc2ogBEEadyAEQRV3cyAEQQd3c2pB9Lr5lQdqIhYgDCAGcyANcSAMIAZxcyAMQR53IAxBE3dzIAxBCndzaiBCaiINaiIFaiABIARqIAIgB2ogFSAPaiAFIAQgB3NxIAdzaiAFQRp3IAVBFXdzIAVBB3dzakH+4/qGeGoiByANIAxzIAZxIA0gDHFzIA1BHncgDUETd3MgDUEKd3NqIAhqIgFqIgYgBSAEc3EgBHNqIAZBGncgBkEVd3MgBkEHd3NqQaeN8N55aiIEIAEgDXMgDHEgASANcXMgAUEedyABQRN3cyABQQp3c2ogDmoiAmoiDCAGIAVzcSAFc2ogDEEadyAMQRV3cyAMQQd3c2pB9OLvjHxqIgUgAiABcyANcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAQaiIDaiINIAwgBnNxIAZzaiANQRp3IA1BFXdzIA1BB3dzakHB0+2kfmoiCCADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBZqIgFqIg8gF2ogESANaiAUIAxqIAkgBmogDyANIAxzcSAMc2ogD0EadyAPQRV3cyAPQQd3c2pBho/5/X5qIgYgASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAHaiICaiIJIA8gDXNxIA1zaiAJQRp3IAlBFXdzIAlBB3dzakHGu4b+AGoiDCACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIARqIgNqIhEgCSAPc3EgD3NqIBFBGncgEUEVd3MgEUEHd3NqQczDsqACaiINIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogBWoiAWoiFCARIAlzcSAJc2ogFEEadyAUQRV3cyAUQQd3c2pB79ik7wJqIg8gASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAIaiICaiIXaiATIBRqIBggEWogEiAJaiAXIBQgEXNxIBFzaiAXQRp3IBdBFXdzIBdBB3dzakGqidLTBGoiGCACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIAZqIgNqIgkgFyAUc3EgFHNqIAlBGncgCUEVd3MgCUEHd3NqQdzTwuUFaiIUIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogDGoiAWoiESAJIBdzcSAXc2ogEUEadyARQRV3cyARQQd3c2pB2pHmtwdqIhcgASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiANaiICaiISIBEgCXNxIAlzaiASQRp3IBJBFXdzIBJBB3dzakHSovnBeWoiGSACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIA9qIgNqIhNqIB4gEmogGiARaiAdIAlqIBMgEiARc3EgEXNqIBNBGncgE0EVd3MgE0EHd3NqQe2Mx8F6aiIaIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogGGoiAWoiCSATIBJzcSASc2ogCUEadyAJQRV3cyAJQQd3c2pByM+MgHtqIhggASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAUaiICaiIRIAkgE3NxIBNzaiARQRp3IBFBFXdzIBFBB3dzakHH/+X6e2oiFCACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIBdqIgNqIhIgESAJc3EgCXNqIBJBGncgEkEVd3MgEkEHd3NqQfOXgLd8aiIXIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogGWoiAWoiE2ogICASaiAcIBFqIB8gCWogEyASIBFzcSARc2ogE0EadyATQRV3cyATQQd3c2pBx6KerX1qIhkgASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAaaiICaiIJIBMgEnNxIBJzaiAJQRp3IAlBFXdzIAlBB3dzakHRxqk2aiIaIAIgAXMgA3EgAiABcXMgAkEedyACQRN3cyACQQp3c2ogGGoiA2oiESAJIBNzcSATc2ogEUEadyARQRV3cyARQQd3c2pB59KkoQFqIhggAyACcyABcSADIAJxcyADQR53IANBE3dzIANBCndzaiAUaiIBaiISIBEgCXNxIAlzaiASQRp3IBJBFXdzIBJBB3dzakGFldy9AmoiFCABIANzIAJxIAEgA3FzIAFBHncgAUETd3MgAUEKd3NqIBdqIgJqIhMgI2ogJiASaiAiIBFqICUgCWogEyASIBFzcSARc2ogE0EadyATQRV3cyATQQd3c2pBuMLs8AJqIhcgAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAZaiIDaiIJIBMgEnNxIBJzaiAJQRp3IAlBFXdzIAlBB3dzakH827HpBGoiGSADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBpqIgFqIhEgCSATc3EgE3NqIBFBGncgEUEVd3MgEUEHd3NqQZOa4JkFaiIaIAEgA3MgAnEgASADcXMgAUEedyABQRN3cyABQQp3c2ogGGoiAmoiEiARIAlzcSAJc2ogEkEadyASQRV3cyASQQd3c2pB1OapqAZqIhggAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAUaiIDaiITaiAoIBJqICQgEWogJyAJaiATIBIgEXNxIBFzaiATQRp3IBNBFXdzIBNBB3dzakG7laizB2oiFCADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBdqIgFqIgkgEyASc3EgEnNqIAlBGncgCUEVd3MgCUEHd3NqQa6Si454aiIXIAEgA3MgAnEgASADcXMgAUEedyABQRN3cyABQQp3c2ogGWoiAmoiESAJIBNzcSATc2ogEUEadyARQRV3cyARQQd3c2pBhdnIk3lqIhkgAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAaaiIDaiISIBEgCXNxIAlzaiASQRp3IBJBFXdzIBJBB3dzakGh0f+VemoiGiADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBhqIgFqIhNqICogEmogLSARaiApIAlqIBMgEiARc3EgEXNqIBNBGncgE0EVd3MgE0EHd3NqQcvM6cB6aiIYIAEgA3MgAnEgASADcXMgAUEedyABQRN3cyABQQp3c2ogFGoiAmoiCSATIBJzcSASc2ogCUEadyAJQRV3cyAJQQd3c2pB8JauknxqIhQgAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAXaiIDaiIRIAkgE3NxIBNzaiARQRp3IBFBFXdzIBFBB3dzakGjo7G7fGoiFyADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBlqIgFqIhIgESAJc3EgCXNqIBJBGncgEkEVd3MgEkEHd3NqQZnQy4x9aiIZIAEgA3MgAnEgASADcXMgAUEedyABQRN3cyABQQp3c2ogGmoiAmoiE2ogMCASaiAvIBFqICsgCWogEyASIBFzcSARc2ogE0EadyATQRV3cyATQQd3c2pBpIzktH1qIhogAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAYaiIDaiIJIBMgEnNxIBJzaiAJQRp3IAlBFXdzIAlBB3dzakGF67igf2oiGCADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBRqIgFqIhEgCSATc3EgE3NqIBFBGncgEUEVd3MgEUEHd3NqQfDAqoMBaiIUIAEgA3MgAnEgASADcXMgAUEedyABQRN3cyABQQp3c2ogF2oiAmoiEiARIAlzcSAJc2ogEkEadyASQRV3cyASQQd3c2pBloKTzQFqIhcgAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAZaiIDaiITIDZqIDIgEmogNSARaiAxIAlqIBMgEiARc3EgEXNqIBNBGncgE0EVd3MgE0EHd3NqQYjY3fEBaiIZIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogGmoiAWoiCSATIBJzcSASc2ogCUEadyAJQRV3cyAJQQd3c2pBzO6hugJqIhogASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAYaiICaiIRIAkgE3NxIBNzaiARQRp3IBFBFXdzIBFBB3dzakG1+cKlA2oiGCACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIBRqIgNqIhIgESAJc3EgCXNqIBJBGncgEkEVd3MgEkEHd3NqQbOZ8MgDaiIUIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogF2oiAWoiE2ogLEEZdyAsQQ53cyAsQQN2cyAoaiA0aiAzQQ93IDNBDXdzIDNBCnZzaiIXIBJqIDcgEWogMyAJaiATIBIgEXNxIBFzaiATQRp3IBNBFXdzIBNBB3dzakHK1OL2BGoiGyABIANzIAJxIAEgA3FzIAFBHncgAUETd3MgAUEKd3NqIBlqIgJqIgkgEyASc3EgEnNqIAlBGncgCUEVd3MgCUEHd3NqQc+U89wFaiIZIAIgAXMgA3EgAiABcXMgAkEedyACQRN3cyACQQp3c2ogGmoiA2oiESAJIBNzcSATc2ogEUEadyARQRV3cyARQQd3c2pB89+5wQZqIhogAyACcyABcSADIAJxcyADQR53IANBE3dzIANBCndzaiAYaiIBaiISIBEgCXNxIAlzaiASQRp3IBJBFXdzIBJBB3dzakHuhb6kB2oiHCABIANzIAJxIAEgA3FzIAFBHncgAUETd3MgAUEKd3NqIBRqIgJqIhNqIC5BGXcgLkEOd3MgLkEDdnMgKmogNmogLUEZdyAtQQ53cyAtQQN2cyApaiA1aiAXQQ93IBdBDXdzIBdBCnZzaiIUQQ93IBRBDXdzIBRBCnZzaiIYIBJqIDkgEWogFCAJaiATIBIgEXNxIBFzaiATQRp3IBNBFXdzIBNBB3dzakHvxpXFB2oiCSACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIBtqIgNqIhEgEyASc3EgEnNqIBFBGncgEUEVd3MgEUEHd3NqQZTwoaZ4aiIbIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogGWoiAWoiEiARIBNzcSATc2ogEkEadyASQRV3cyASQQd3c2pBiISc5nhqIhkgASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAaaiICaiITIBIgEXNxIBFzaiATQRp3IBNBFXdzIBNBB3dzakH6//uFeWoiGiACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIBxqIgNqIhQgPGo2AuSJAUEAID8gAyACcyABcSADIAJxcyADQR53IANBE3dzIANBCndzaiAJaiIBIANzIAJxIAEgA3FzIAFBHncgAUETd3MgAUEKd3NqIBtqIgIgAXMgA3EgAiABcXMgAkEedyACQRN3cyACQQp3c2ogGWoiAyACcyABcSADIAJxcyADQR53IANBE3dzIANBCndzaiAaaiIJajYC1IkBQQAgPSAvQRl3IC9BDndzIC9BA3ZzICtqIDdqIBhBD3cgGEENd3MgGEEKdnNqIhggEWogFCATIBJzcSASc2ogFEEadyAUQRV3cyAUQQd3c2pB69nBonpqIhkgAWoiEWo2AuCJAUEAIEEgCSADcyACcSAJIANxcyAJQR53IAlBE3dzIAlBCndzaiAZaiIBajYC0IkBQQAgPiAwQRl3IDBBDndzIDBBA3ZzIC9qIBdqIDpBD3cgOkENd3MgOkEKdnNqIBJqIBEgFCATc3EgE3NqIBFBGncgEUEVd3MgEUEHd3NqQffH5vd7aiIXIAJqIhJqNgLciQFBACBDIAEgCXMgA3EgASAJcXMgAUEedyABQRN3cyABQQp3c2ogF2oiAmo2AsyJAUEAIDsgNEEZdyA0QQ53cyA0QQN2cyAwaiA4aiAYQQ93IBhBDXdzIBhBCnZzaiATaiASIBEgFHNxIBRzaiASQRp3IBJBFXdzIBJBB3dzakHy8cWzfGoiESADamo2AtiJAUEAIAAgAiABcyAJcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiARamo2AsiJAQuyBgIEfwF+QQAoAsCJASIAQQJ2QQ9xIgFBAnRBgIkBaiICIAIoAgBBfyAAQQN0IgB0QX9zcUGAASAAdHM2AgACQAJAAkAgAUEOSQ0AAkAgAUEORw0AQQBBADYCvIkBC0GAiQEQA0EAIQIMAQsgAUENRg0BIAFBAWohAgsgAiEDAkBBBiACa0EHcSIARQ0AIAIgAGohAyACQQJ0QYCJAWohAQNAIAFBADYCACABQQRqIQEgAEF/aiIADQALCyACQXlqQQdJDQAgA0ECdCEBA0AgAUGYiQFqQgA3AgAgAUGQiQFqQgA3AgAgAUGIiQFqQgA3AgAgAUGAiQFqQgA3AgAgAUEgaiIBQThHDQALC0EAIQFBAEEAKQPAiQEiBKciAEEbdCAAQQt0QYCA/AdxciAAQQV2QYD+A3EgAEEDdEEYdnJyNgK8iQFBACAEQh2IpyIAQRh0IABBgP4DcUEIdHIgAEEIdkGA/gNxIABBGHZycjYCuIkBQYCJARADQQBBACgC5IkBIgBBGHQgAEGA/gNxQQh0ciAAQQh2QYD+A3EgAEEYdnJyNgLkiQFBAEEAKALgiQEiAEEYdCAAQYD+A3FBCHRyIABBCHZBgP4DcSAAQRh2cnI2AuCJAUEAQQAoAtyJASIAQRh0IABBgP4DcUEIdHIgAEEIdkGA/gNxIABBGHZycjYC3IkBQQBBACgC2IkBIgBBGHQgAEGA/gNxQQh0ciAAQQh2QYD+A3EgAEEYdnJyNgLYiQFBAEEAKALUiQEiAEEYdCAAQYD+A3FBCHRyIABBCHZBgP4DcSAAQRh2cnI2AtSJAUEAQQAoAtCJASIAQRh0IABBgP4DcUEIdHIgAEEIdkGA/gNxIABBGHZycjYC0IkBQQBBACgCzIkBIgBBGHQgAEGA/gNxQQh0ciAAQQh2QYD+A3EgAEEYdnJyNgLMiQFBAEEAKALIiQEiAEEYdCAAQYD+A3FBCHRyIABBCHZBgP4DcSAAQRh2cnI2AsiJAQJAQQAoAuiJASICRQ0AQQAhAANAIAFBgAlqIAFByIkBai0AADoAACABQQFqIQEgAiAAQQFqIgBB/wFxSw0ACwsLBgBBgIkBC6MBAEEAQgA3A8CJAUEAQRxBICABQeABRiIBGzYC6IkBQQBCp5/mp8b0k/2+f0Krs4/8kaOz8NsAIAEbNwPgiQFBAEKxloD+n6KFrOgAQv+kuYjFkdqCm38gARs3A9iJAUEAQpe6w4OTp5aHd0Ly5rvjo6f9p6V/IAEbNwPQiQFBAELYvZaI/KC1vjZC58yn0NbQ67O7fyABGzcDyIkBIAAQAhAECwsLAQBBgAgLBHAAAAA=", Jb = "8c18dd94", Vb = {
  name: Hb,
  data: Gb,
  hash: Jb
};
new nt();
new nt();
function Kb() {
  return qb(Vb, 32).then((t) => {
    t.init(256);
    const e = {
      init: () => (t.init(256), e),
      update: (n) => (t.update(n), e),
      // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
      digest: (n) => t.digest(n),
      save: () => t.save(),
      load: (n) => (t.load(n), e),
      blockSize: 64,
      digestSize: 32
    };
    return e;
  });
}
new nt();
new nt();
new nt();
new nt();
new nt();
new nt();
new nt();
new nt();
new nt();
const lh = 1024 * 1024 * 1024;
function Lf(t) {
  return t.document_formats?.map((n) => n.extension).filter((n) => /^\.[a-z0-9]{1,8}$/.test(n)) || [];
}
function ch(t) {
  return Lf(t).join(",");
}
function dh(t, e) {
  const n = e.toLowerCase();
  return Lf(t).some((r) => n.endsWith(r));
}
function uh(t) {
  const e = t.document_max_bytes;
  return Number.isSafeInteger(e) && e > 0 ? Math.min(e, lh) : lh;
}
function Wb(t) {
  return t.security_status === "clean" && ["queued", "indexing", "ready", "failed", "needs_reconcile"].includes(t.state);
}
function Xb(t) {
  return t.reindexing ? "可检索 · 正在重新索引" : t.state === "indexing" && t.error_code === "document_index_failed" ? "索引失败" : {
    uploading: "上传未完成",
    quarantined: "已隔离 · 等待安全扫描",
    scanning: "正在安全扫描",
    queued: "等待入库",
    indexing: "正在建立索引",
    ready: "可检索",
    failed: "处理未完成",
    needs_reconcile: "上传结果待核查",
    deleting: "已停止访问 · 正在清理",
    deleted: "已删除"
  }[t.state] || "状态未知";
}
function Zb(t) {
  if (t.reindexing) return "当前索引保持可用；新一代索引在后台建立，确认完成后才会原子切换。";
  const e = Yb(t.error_code);
  return e || (t.state === "deleting" ? "已停止检索和下载；原文件与远端索引清理完成前，此记录会继续保留。" : t.state === "needs_reconcile" ? "远端可能已收到文件，系统正在核对结果，不会盲目重复推送。" : t.security_status === "rejected" ? "安全检查未通过。原文件保持隔离，不会进入解析、索引或下载链路。" : t.state === "quarantined" ? "原文件已进入隔离区，安全检查通过前不会开放下载，也不会交给解析器。" : t.state === "scanning" ? "正在检查文件类型、恶意特征、活动内容和压缩包膨胀风险。" : t.error_code === "document_index_failed" ? "知识服务未能完成索引，原文件仍可查看和下载。" : t.state === "indexing" ? t.index_status === "CHUNKED" ? "资料已完成分段，正在等待索引完成。" : "原文件已保存，正在建立索引。" : t.state === "queued" ? "原文件已保存，后台将继续处理。" : t.state === "uploading" ? "上传尚未完成，可重新选择同一文件继续。" : t.state === "ready" ? "知识索引已经完成，可以检索。" : "处理尚未完成，请稍后刷新状态。");
}
function Yb(t) {
  return t ? {
    document_malware_detected: "病毒扫描发现恶意内容。原件保持隔离；不要重试同一文件，请先在可信环境中清理。",
    document_active_content_rejected: "文件含宏、脚本、外部对象或其他活动内容，已被隔离。请导出为不含活动内容的普通文档后重新上传。",
    document_executable_content_rejected: "文件实际内容是可执行程序，与知识文档用途不符，已被隔离。",
    document_archive_expansion_limit: "Office 文件解压后的体积或压缩比异常，可能是 ZIP 炸弹，已被隔离。",
    document_archive_unsafe: "Office 容器包含加密项、越界路径或不安全结构，已被隔离。",
    document_archive_invalid: "Office 文件容器损坏或条目数量异常，无法安全解析。",
    document_office_structure_invalid: "文件扩展名与 Office 内部结构不一致，无法安全解析。",
    document_type_mismatch: "文件扩展名与实际文件签名不一致。请确认格式或重新导出后上传。",
    document_text_binary_content: "文本文件中包含二进制内容，无法按声明格式安全处理。",
    document_text_encoding_invalid: "文本不是有效的 UTF-8 编码。请转换编码后重新上传。",
    document_security_scan_failed: "安全扫描服务执行失败，原件仍在隔离区；服务恢复后可以重试。",
    document_security_unavailable: "安全扫描器当前不可用，原件不会绕过检查进入索引；配置恢复后可以重试。",
    document_security_size_unsupported: "ClamAV 的 INSTREAM 上限小于该原件。原件保持隔离；请将服务端 StreamMaxLength、MaxFileSize 和 MaxScanSize 调整到业务上限后再重试。",
    document_index_size_unsupported: "原文件已安全保存，可预览和下载；当前 Connector 直传入口或 Builder 整文件处理上限无法接收它。",
    document_index_failed: "远端知识服务未能完成索引。原件仍可查看和下载，可以在服务恢复后重试。",
    document_inspect_failed: "暂时无法核对远端索引状态。系统不会把未知状态当作成功，可以稍后重试核查。",
    document_put_uncertain: "上传请求的结果不确定。系统将先核对原操作，不会盲目重复上传。",
    document_put_unconfirmed: "远端尚未确认接收这次上传。系统会继续核对原请求。",
    document_remote_conflict: "远端已有冲突的文档状态，当前原件不会覆盖未知内容。请核对知识源后再处理。",
    document_access_policy_changed: "知识源访问策略在处理期间发生变化。请按当前权限重新发起处理。",
    document_source_changed: "资料库绑定的知识源已经变化，旧任务不会把文件写入新来源。请重新索引。",
    document_source_access_denied: "当前账号已失去原业务资料的读取权限，文档不会继续进入索引。",
    document_upload_access_denied: "上传者已失去该资料库的写入权限，排队任务已停止。",
    document_content_mismatch: "保存的原件长度或摘要与文档记录不一致，系统已停止处理以避免索引错误版本。",
    document_management_unavailable: "当前知识源未开放文档管理能力。原件仍保留在资料库中。",
    document_work_unavailable: "文档后台任务暂时不可用，原件仍保留；服务恢复后可以重试。",
    document_cleanup_failed: "删除后的远端索引或原件清理尚未完成，访问仍保持关闭。",
    document_cleanup_unconfirmed: "清理结果尚未得到确认，系统会继续核对，不会恢复文档访问。",
    document_delete_uncertain: "远端删除结果不确定，文档继续保持不可访问并等待核对。",
    document_reindex_failed: "新一代索引建立失败，已有可用索引不会被覆盖。可以稍后重新索引。",
    document_reindex_put_uncertain: "重新索引的上传结果不确定；旧索引保持可用，系统会先核对原请求。",
    document_reindex_put_unconfirmed: "重新索引尚未被远端确认；旧索引保持可用。",
    document_reindex_cleanup_uncertain: "新索引切换后的旧代清理结果不确定，不影响当前检索，但需要继续核对。"
  }[t] || `文档处理未完成（${t}）。原件和现有索引会按当前状态保持隔离或可用，不会把未知结果当作成功。` : "";
}
async function hh(t, e, n) {
  e?.throwIfAborted();
  const r = await Kb(), i = t.stream().getReader();
  let s = 0;
  r.init();
  try {
    for (; ; ) {
      e?.throwIfAborted();
      const a = await i.read();
      if (a.done) break;
      r.update(a.value), s += a.value.byteLength, n?.(Math.min(1, s / t.size));
    }
  } catch (a) {
    throw await i.cancel().catch(() => {
    }), a;
  } finally {
    i.releaseLock();
  }
  return e?.throwIfAborted(), r.digest("hex");
}
const sn = () => /* @__PURE__ */ new Map(), Cc = (t) => {
  const e = sn();
  return t.forEach((n, r) => {
    e.set(r, n);
  }), e;
}, yr = (t, e, n) => {
  let r = t.get(e);
  return r === void 0 && t.set(e, r = n()), r;
}, ey = (t, e) => {
  const n = [];
  for (const [r, i] of t)
    n.push(e(i, r));
  return n;
}, ty = (t, e) => {
  for (const [n, r] of t)
    if (e(r, n))
      return !0;
  return !1;
}, ki = () => /* @__PURE__ */ new Set(), tc = (t) => t[t.length - 1], ny = (t, e) => {
  for (let n = 0; n < e.length; n++)
    t.push(e[n]);
}, br = Array.from, Xc = (t, e) => {
  for (let n = 0; n < t.length; n++)
    if (!e(t[n], n, t))
      return !1;
  return !0;
}, Zc = (t, e) => {
  for (let n = 0; n < t.length; n++)
    if (e(t[n], n, t))
      return !0;
  return !1;
}, ry = (t, e) => {
  const n = new Array(t);
  for (let r = 0; r < t; r++)
    n[r] = e(r, n);
  return n;
}, vi = Array.isArray;
class Of {
  constructor() {
    this._observers = sn();
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  on(e, n) {
    return yr(
      this._observers,
      /** @type {string} */
      e,
      ki
    ).add(n), n;
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  once(e, n) {
    const r = (...i) => {
      this.off(
        e,
        /** @type {any} */
        r
      ), n(...i);
    };
    this.on(
      e,
      /** @type {any} */
      r
    );
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  off(e, n) {
    const r = this._observers.get(e);
    r !== void 0 && (r.delete(n), r.size === 0 && this._observers.delete(e));
  }
  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name The event name.
   * @param {Parameters<EVENTS[NAME]>} args The arguments that are applied to the event listener.
   */
  emit(e, n) {
    return br((this._observers.get(e) || sn()).values()).forEach((r) => r(...n));
  }
  destroy() {
    this._observers = sn();
  }
}
const yn = Math.floor, Qa = Math.abs, Uf = (t, e) => t < e ? t : e, Tr = (t, e) => t > e ? t : e, $f = (t) => t !== 0 ? t < 0 : 1 / t < 0, fh = 1, ph = 2, nc = 4, rc = 8, ps = 32, $n = 64, Lt = 128, So = 31, Ic = 63, Pr = 127, iy = 2147483647, io = Number.MAX_SAFE_INTEGER, gh = Number.MIN_SAFE_INTEGER, sy = Number.isInteger || ((t) => typeof t == "number" && isFinite(t) && yn(t) === t), ay = String.fromCharCode, oy = (t) => t.toLowerCase(), ly = /^\s*/g, cy = (t) => t.replace(ly, ""), dy = /([A-Z])/g, mh = (t, e) => cy(t.replace(dy, (n) => `${e}${oy(n)}`)), uy = (t) => {
  const e = unescape(encodeURIComponent(t)), n = e.length, r = new Uint8Array(n);
  for (let i = 0; i < n; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, gs = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), hy = (t) => gs.encode(t), fy = gs ? hy : uy;
let us = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
us && us.decode(new Uint8Array()).length === 1 && (us = null);
const py = (t, e) => ry(e, () => t).join("");
let xs = class {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
};
const Eo = () => new xs(), gy = (t) => {
  let e = t.cpos;
  for (let n = 0; n < t.bufs.length; n++)
    e += t.bufs[n].length;
  return e;
}, bn = (t) => {
  const e = new Uint8Array(gy(t));
  let n = 0;
  for (let r = 0; r < t.bufs.length; r++) {
    const i = t.bufs[r];
    e.set(i, n), n += i.length;
  }
  return e.set(new Uint8Array(t.cbuf.buffer, 0, t.cpos), n), e;
}, my = (t, e) => {
  const n = t.cbuf.length;
  n - t.cpos < e && (t.bufs.push(new Uint8Array(t.cbuf.buffer, 0, t.cpos)), t.cbuf = new Uint8Array(Tr(n, e) * 2), t.cpos = 0);
}, gt = (t, e) => {
  const n = t.cbuf.length;
  t.cpos === n && (t.bufs.push(t.cbuf), t.cbuf = new Uint8Array(n * 2), t.cpos = 0), t.cbuf[t.cpos++] = e;
}, Sc = gt, Oe = (t, e) => {
  for (; e > Pr; )
    gt(t, Lt | Pr & e), e = yn(e / 128);
  gt(t, Pr & e);
}, Yc = (t, e) => {
  const n = $f(e);
  for (n && (e = -e), gt(t, (e > Ic ? Lt : 0) | (n ? $n : 0) | Ic & e), e = yn(e / 64); e > 0; )
    gt(t, (e > Pr ? Lt : 0) | Pr & e), e = yn(e / 128);
}, Ec = new Uint8Array(3e4), by = Ec.length / 3, yy = (t, e) => {
  if (e.length < by) {
    const n = gs.encodeInto(e, Ec).written || 0;
    Oe(t, n);
    for (let r = 0; r < n; r++)
      gt(t, Ec[r]);
  } else
    Mt(t, fy(e));
}, wy = (t, e) => {
  const n = unescape(encodeURIComponent(e)), r = n.length;
  Oe(t, r);
  for (let i = 0; i < r; i++)
    gt(
      t,
      /** @type {number} */
      n.codePointAt(i)
    );
}, fi = gs && /** @type {any} */
gs.encodeInto ? yy : wy, xo = (t, e) => {
  const n = t.cbuf.length, r = t.cpos, i = Uf(n - r, e.length), s = e.length - i;
  t.cbuf.set(e.subarray(0, i), r), t.cpos += i, s > 0 && (t.bufs.push(t.cbuf), t.cbuf = new Uint8Array(Tr(n * 2, s)), t.cbuf.set(e.subarray(i)), t.cpos = s);
}, Mt = (t, e) => {
  Oe(t, e.byteLength), xo(t, e);
}, ed = (t, e) => {
  my(t, e);
  const n = new DataView(t.cbuf.buffer, t.cpos, e);
  return t.cpos += e, n;
}, _y = (t, e) => ed(t, 4).setFloat32(0, e, !1), ky = (t, e) => ed(t, 8).setFloat64(0, e, !1), vy = (t, e) => (
  /** @type {any} */
  ed(t, 8).setBigInt64(0, e, !1)
), bh = new DataView(new ArrayBuffer(4)), Ay = (t) => (bh.setFloat32(0, t), bh.getFloat32(0) === t), ms = (t, e) => {
  switch (typeof e) {
    case "string":
      gt(t, 119), fi(t, e);
      break;
    case "number":
      sy(e) && Qa(e) <= iy ? (gt(t, 125), Yc(t, e)) : Ay(e) ? (gt(t, 124), _y(t, e)) : (gt(t, 123), ky(t, e));
      break;
    case "bigint":
      gt(t, 122), vy(t, e);
      break;
    case "object":
      if (e === null)
        gt(t, 126);
      else if (vi(e)) {
        gt(t, 117), Oe(t, e.length);
        for (let n = 0; n < e.length; n++)
          ms(t, e[n]);
      } else if (e instanceof Uint8Array)
        gt(t, 116), Mt(t, e);
      else {
        gt(t, 118);
        const n = Object.keys(e);
        Oe(t, n.length);
        for (let r = 0; r < n.length; r++) {
          const i = n[r];
          fi(t, i), ms(t, e[i]);
        }
      }
      break;
    case "boolean":
      gt(t, e ? 120 : 121);
      break;
    default:
      gt(t, 127);
  }
};
class yh extends xs {
  /**
   * @param {function(Encoder, T):void} writer
   */
  constructor(e) {
    super(), this.w = e, this.s = null, this.count = 0;
  }
  /**
   * @param {T} v
   */
  write(e) {
    this.s === e ? this.count++ : (this.count > 0 && Oe(this, this.count - 1), this.count = 1, this.w(this, e), this.s = e);
  }
}
const wh = (t) => {
  t.count > 0 && (Yc(t.encoder, t.count === 1 ? t.s : -t.s), t.count > 1 && Oe(t.encoder, t.count - 2));
};
class ja {
  constructor() {
    this.encoder = new xs(), this.s = 0, this.count = 0;
  }
  /**
   * @param {number} v
   */
  write(e) {
    this.s === e ? this.count++ : (wh(this), this.count = 1, this.s = e);
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    return wh(this), bn(this.encoder);
  }
}
const _h = (t) => {
  if (t.count > 0) {
    const e = t.diff * 2 + (t.count === 1 ? 0 : 1);
    Yc(t.encoder, e), t.count > 1 && Oe(t.encoder, t.count - 2);
  }
};
class ic {
  constructor() {
    this.encoder = new xs(), this.s = 0, this.count = 0, this.diff = 0;
  }
  /**
   * @param {number} v
   */
  write(e) {
    this.diff === e - this.s ? (this.s = e, this.count++) : (_h(this), this.count = 1, this.diff = e - this.s, this.s = e);
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    return _h(this), bn(this.encoder);
  }
}
class Cy {
  constructor() {
    this.sarr = [], this.s = "", this.lensE = new ja();
  }
  /**
   * @param {string} string
   */
  write(e) {
    this.s += e, this.s.length > 19 && (this.sarr.push(this.s), this.s = ""), this.lensE.write(e.length);
  }
  toUint8Array() {
    const e = new xs();
    return this.sarr.push(this.s), this.s = "", fi(e, this.sarr.join("")), xo(e, this.lensE.toUint8Array()), bn(e);
  }
}
const wn = (t) => new Error(t), an = () => {
  throw wn("Method unimplemented");
}, Ot = () => {
  throw wn("Unexpected case");
}, No = wn("Unexpected end of array"), Qf = wn("Integer out of Range"), Iy = (t, e, n) => {
  if (e < 0 || n < 0 || e + n > t.length)
    throw No;
  return new Uint8Array(t.buffer, t.byteOffset + e, n);
}, Sy = (t, e, n) => {
  if (e < 0 || n < 0 || e + n > t.length)
    throw No;
  return new DataView(t.buffer, t.byteOffset + e, n);
};
let Do = class {
  /**
   * @param {Uint8Array<Buf>} uint8Array Binary data to decode
   */
  constructor(e) {
    this.arr = e, this.pos = 0;
  }
};
const Bi = (t) => new Do(t), Ey = (t) => t.pos !== t.arr.length, xy = (t, e) => {
  const n = Iy(t.arr, t.pos, e);
  return t.pos += e, n;
}, zt = (t) => xy(t, Te(t)), Ai = (t) => t.arr[t.pos++], Te = (t) => {
  let e = 0, n = 1;
  const r = t.arr.length;
  for (; t.pos < r; ) {
    const i = t.arr[t.pos++];
    if (e = e + (i & Pr) * n, n *= 128, i < Lt)
      return e;
    if (e > io)
      throw Qf;
  }
  throw No;
}, td = (t) => {
  let e = t.arr[t.pos++], n = e & Ic, r = 64;
  const i = (e & $n) > 0 ? -1 : 1;
  if ((e & Lt) === 0)
    return i * n;
  const s = t.arr.length;
  for (; t.pos < s; ) {
    if (e = t.arr[t.pos++], n = n + (e & Pr) * r, r *= 128, e < Lt)
      return i * n;
    if (n > io)
      throw Qf;
  }
  throw No;
}, Ny = (t) => {
  let e = Te(t);
  if (e === 0)
    return "";
  {
    let n = String.fromCodePoint(Ai(t));
    if (--e < 100)
      for (; e--; )
        n += String.fromCodePoint(Ai(t));
    else
      for (; e > 0; ) {
        const r = e < 1e4 ? e : 1e4, i = t.arr.subarray(t.pos, t.pos + r);
        t.pos += r, n += String.fromCodePoint.apply(
          null,
          /** @type {any} */
          i
        ), e -= r;
      }
    return decodeURIComponent(escape(n));
  }
}, Dy = (t) => (
  /** @type any */
  us.decode(zt(t))
), pi = us ? Dy : Ny, nd = (t, e) => {
  const n = Sy(t.arr, t.pos, e);
  return t.pos += e, n;
}, By = (t) => nd(t, 4).getFloat32(0, !1), Py = (t) => nd(t, 8).getFloat64(0, !1), My = (t) => (
  /** @type {any} */
  nd(t, 8).getBigInt64(0, !1)
), zy = [
  (t) => {
  },
  // CASE 127: undefined
  (t) => null,
  // CASE 126: null
  td,
  // CASE 125: integer
  By,
  // CASE 124: float32
  Py,
  // CASE 123: float64
  My,
  // CASE 122: bigint
  (t) => !1,
  // CASE 121: boolean (false)
  (t) => !0,
  // CASE 120: boolean (true)
  pi,
  // CASE 119: string
  (t) => {
    const e = Te(t), n = {};
    for (let r = 0; r < e; r++) {
      const i = pi(t);
      n[i] = bs(t);
    }
    return n;
  },
  (t) => {
    const e = Te(t), n = [];
    for (let r = 0; r < e; r++)
      n.push(bs(t));
    return n;
  },
  zt
  // CASE 116: Uint8Array
], bs = (t) => zy[127 - Ai(t)](t);
class kh extends Do {
  /**
   * @param {Uint8Array} uint8Array
   * @param {function(Decoder):T} reader
   */
  constructor(e, n) {
    super(e), this.reader = n, this.s = null, this.count = 0;
  }
  read() {
    return this.count === 0 && (this.s = this.reader(this), Ey(this) ? this.count = Te(this) + 1 : this.count = -1), this.count--, /** @type {T} */
    this.s;
  }
}
class qa extends Do {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(e) {
    super(e), this.s = 0, this.count = 0;
  }
  read() {
    if (this.count === 0) {
      this.s = td(this);
      const e = $f(this.s);
      this.count = 1, e && (this.s = -this.s, this.count = Te(this) + 2);
    }
    return this.count--, /** @type {number} */
    this.s;
  }
}
class sc extends Do {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(e) {
    super(e), this.s = 0, this.count = 0, this.diff = 0;
  }
  /**
   * @return {number}
   */
  read() {
    if (this.count === 0) {
      const e = td(this), n = e & 1;
      this.diff = yn(e / 2), this.count = 1, n && (this.count = Te(this) + 2);
    }
    return this.s += this.diff, this.count--, this.s;
  }
}
class Ry {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(e) {
    this.decoder = new qa(e), this.str = pi(this.decoder), this.spos = 0;
  }
  /**
   * @return {string}
   */
  read() {
    const e = this.spos + this.decoder.read(), n = this.str.slice(this.spos, e);
    return this.spos = e, n;
  }
}
const Ty = crypto.getRandomValues.bind(crypto), jf = () => Ty(new Uint32Array(1))[0], Fy = "10000000-1000-4000-8000" + -1e11, Ly = () => Fy.replace(
  /[018]/g,
  /** @param {number} c */
  (t) => (t ^ jf() & 15 >> t / 4).toString(16)
), Oy = Date.now, vh = (t) => (
  /** @type {Promise<T>} */
  new Promise(t)
);
Promise.all.bind(Promise);
const Ah = (t) => t === void 0 ? null : t;
class Uy {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  /**
   * @param {string} key
   * @param {any} newValue
   */
  setItem(e, n) {
    this.map.set(e, n);
  }
  /**
   * @param {string} key
   */
  getItem(e) {
    return this.map.get(e);
  }
}
let qf = new Uy(), $y = !0;
try {
  typeof localStorage < "u" && localStorage && (qf = localStorage, $y = !1);
} catch {
}
const Qy = qf, ys = /* @__PURE__ */ Symbol("Equality"), Hf = (t, e) => t === e || !!t?.[ys]?.(e) || !1, jy = (t) => typeof t == "object", qy = Object.assign, Hy = Object.keys, Gy = (t, e) => {
  for (const n in t)
    e(t[n], n);
}, so = (t) => Hy(t).length, Jy = (t) => {
  for (const e in t)
    return !1;
  return !0;
}, Ns = (t, e) => {
  for (const n in t)
    if (!e(t[n], n))
      return !1;
  return !0;
}, rd = (t, e) => Object.prototype.hasOwnProperty.call(t, e), Vy = (t, e) => t === e || so(t) === so(e) && Ns(t, (n, r) => (n !== void 0 || rd(e, r)) && Hf(e[r], n)), Ky = Object.freeze, Gf = (t) => {
  for (const e in t) {
    const n = t[e];
    (typeof n == "object" || typeof n == "function") && Gf(t[e]);
  }
  return Ky(t);
}, id = (t, e, n = 0) => {
  try {
    for (; n < t.length; n++)
      t[n](...e);
  } finally {
    n < t.length && id(t, e, n + 1);
  }
}, Wy = (t) => t, Ha = (t, e) => {
  if (t === e)
    return !0;
  if (t == null || e == null || t.constructor !== e.constructor && (t.constructor || Object) !== (e.constructor || Object))
    return !1;
  if (t[ys] != null)
    return t[ys](e);
  switch (t.constructor) {
    case ArrayBuffer:
      t = new Uint8Array(t), e = new Uint8Array(e);
    // eslint-disable-next-line no-fallthrough
    case Uint8Array: {
      if (t.byteLength !== e.byteLength)
        return !1;
      for (let n = 0; n < t.length; n++)
        if (t[n] !== e[n])
          return !1;
      break;
    }
    case Set: {
      if (t.size !== e.size)
        return !1;
      for (const n of t)
        if (!e.has(n))
          return !1;
      break;
    }
    case Map: {
      if (t.size !== e.size)
        return !1;
      for (const n of t.keys())
        if (!e.has(n) || !Ha(t.get(n), e.get(n)))
          return !1;
      break;
    }
    case void 0:
    case Object:
      if (so(t) !== so(e))
        return !1;
      for (const n in t)
        if (!rd(t, n) || !Ha(t[n], e[n]))
          return !1;
      break;
    case Array:
      if (t.length !== e.length)
        return !1;
      for (let n = 0; n < t.length; n++)
        if (!Ha(t[n], e[n]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, Xy = (t, e) => e.includes(t), ws = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]";
let gn;
const Zy = () => {
  if (gn === void 0)
    if (ws) {
      gn = sn();
      const t = process.argv;
      let e = null;
      for (let n = 0; n < t.length; n++) {
        const r = t[n];
        r[0] === "-" ? (e !== null && gn.set(e, ""), e = r) : e !== null && (gn.set(e, r), e = null);
      }
      e !== null && gn.set(e, "");
    } else typeof location == "object" ? (gn = sn(), (location.search || "?").slice(1).split("&").forEach((t) => {
      if (t.length !== 0) {
        const [e, n] = t.split("=");
        gn.set(`--${mh(e, "-")}`, n), gn.set(`-${mh(e, "-")}`, n);
      }
    })) : gn = sn();
  return gn;
}, xc = (t) => Zy().has(t), ao = (t) => Ah(ws ? process.env[t.toUpperCase().replaceAll("-", "_")] : Qy.getItem(t)), Jf = (t) => xc("--" + t) || ao(t) !== null, Yy = Jf("production"), ew = ws && Xy(process.env.FORCE_COLOR, ["true", "1", "2"]), tw = ew || !xc("--no-colors") && // @todo deprecate --no-colors
!Jf("no-color") && (!ws || process.stdout.isTTY) && (!ws || xc("--color") || ao("COLORTERM") !== null || (ao("TERM") || "").includes("color")), nw = (t) => new Uint8Array(t), rw = (t) => {
  const e = nw(t.byteLength);
  return e.set(t), e;
};
class iw {
  /**
   * @param {L} left
   * @param {R} right
   */
  constructor(e, n) {
    this.left = e, this.right = n;
  }
}
const zn = (t, e) => new iw(t, e), Ch = (t) => t.next() >= 0.5, ac = (t, e, n) => yn(t.next() * (n + 1 - e) + e), Vf = (t, e, n) => yn(t.next() * (n + 1 - e) + e), sd = (t, e, n) => Vf(t, e, n), sw = (t) => ay(sd(t, 97, 122)), aw = (t, e = 0, n = 20) => {
  const r = sd(t, e, n);
  let i = "";
  for (let s = 0; s < r; s++)
    i += sw(t);
  return i;
}, oc = (t, e) => e[sd(t, 0, e.length - 1)], ow = /* @__PURE__ */ Symbol("0schema");
class lw {
  constructor() {
    this._rerrs = [];
  }
  /**
   * @param {string?} path
   * @param {string} expected
   * @param {string} has
   * @param {string?} message
   */
  extend(e, n, r, i = null) {
    this._rerrs.push({ path: e, expected: n, has: r, message: i });
  }
  toString() {
    const e = [];
    for (let n = this._rerrs.length - 1; n > 0; n--) {
      const r = this._rerrs[n];
      e.push(py(" ", (this._rerrs.length - n) * 2) + `${r.path != null ? `[${r.path}] ` : ""}${r.has} doesn't match ${r.expected}. ${r.message}`);
    }
    return e.join(`
`);
  }
}
const Nc = (t, e) => t === e ? !0 : t == null || e == null || t.constructor !== e.constructor ? !1 : t[ys] ? Hf(t, e) : vi(t) ? Xc(
  t,
  (n) => Zc(e, (r) => Nc(n, r))
) : jy(t) ? Ns(
  t,
  (n, r) => Nc(n, e[r])
) : !1;
class Ct {
  // this.shape must not be defined on Schema. Otherwise typecheck on metatypes (e.g. $$object) won't work as expected anymore
  /**
   * If true, the more things are added to the shape the more objects this schema will accept (e.g.
   * union). By default, the more objects are added, the the fewer objects this schema will accept.
   * @protected
   */
  static _dilutes = !1;
  /**
   * @param {Schema<any>} other
   */
  extends(e) {
    let [n, r] = [
      /** @type {any} */
      this.shape,
      /** @type {any} */
      e.shape
    ];
    return (
      /** @type {typeof Schema<any>} */
      this.constructor._dilutes && ([r, n] = [n, r]), Nc(n, r)
    );
  }
  /**
   * Overwrite this when necessary. By default, we only check the `shape` property which every shape
   * should have.
   * @param {Schema<any>} other
   */
  equals(e) {
    return this.constructor === e.constructor && Ha(this.shape, e.shape);
  }
  [ow]() {
    return !0;
  }
  /**
   * @param {object} other
   */
  [ys](e) {
    return this.equals(
      /** @type {any} */
      e
    );
  }
  /**
   * Use `schema.validate(obj)` with a typed parameter that is already of typed to be an instance of
   * Schema. Validate will check the structure of the parameter and return true iff the instance
   * really is an instance of Schema.
   *
   * @param {T} o
   * @return {boolean}
   */
  validate(e) {
    return this.check(e);
  }
  /* c8 ignore start */
  /**
   * Similar to validate, but this method accepts untyped parameters.
   *
   * @param {any} _o
   * @param {ValidationError} [_err]
   * @return {_o is T}
   */
  check(e, n) {
    an();
  }
  /* c8 ignore stop */
  /**
   * @type {Schema<T?>}
   */
  get nullable() {
    return Pi(this, Ro);
  }
  /**
   * @type {$Optional<Schema<T>>}
   */
  get optional() {
    return new Xf(
      /** @type {Schema<T>} */
      this
    );
  }
  /**
   * Cast a variable to a specific type. Returns the casted value, or throws an exception otherwise.
   * Use this if you know that the type is of a specific type and you just want to convince the type
   * system.
   *
   * **Do not rely on these error messages!**
   * Performs an assertion check only if not in a production environment.
   *
   * @template OO
   * @param {OO} o
   * @return {Extract<OO, T> extends never ? T : (OO extends Array<never> ? T : Extract<OO,T>)}
   */
  cast(e) {
    return Ih(e, this), /** @type {any} */
    e;
  }
  /**
   * EXPECTO PATRONUM!! 🪄
   * This function protects against type errors. Though it may not work in the real world.
   *
   * "After all this time?"
   * "Always." - Snape, talking about type safety
   *
   * Ensures that a variable is a a specific type. Returns the value, or throws an exception if the assertion check failed.
   * Use this if you know that the type is of a specific type and you just want to convince the type
   * system.
   *
   * Can be useful when defining lambdas: `s.lambda(s.$number, s.$void).expect((n) => n + 1)`
   *
   * **Do not rely on these error messages!**
   * Performs an assertion check if not in a production environment.
   *
   * @param {T} o
   * @return {o extends T ? T : never}
   */
  expect(e) {
    return Ih(e, this), e;
  }
}
class ad extends Ct {
  /**
   * @param {C} c
   * @param {((o:Instance<C>)=>boolean)|null} check
   */
  constructor(e, n) {
    super(), this.shape = e, this._c = n;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is C extends ((...args:any[]) => infer T) ? T : (C extends (new (...args:any[]) => any) ? InstanceType<C> : never)} o
   */
  check(e, n = void 0) {
    const r = e?.constructor === this.shape && (this._c == null || this._c(e));
    return !r && n?.extend(null, this.shape.name, e?.constructor.name, e?.constructor !== this.shape ? "Constructor match failed" : "Check failed"), r;
  }
}
const ct = (t, e = null) => new ad(t, e);
ct(ad);
class od extends Ct {
  /**
   * @param {(o:any) => boolean} check
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is any}
   */
  check(e, n) {
    const r = this.shape(e);
    return !r && n?.extend(null, "custom prop", e?.constructor.name, "failed to check custom prop"), r;
  }
}
const yt = (t) => new od(t);
ct(od);
class Bo extends Ct {
  /**
   * @param {Array<T>} literals
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   *
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is T}
   */
  check(e, n) {
    const r = this.shape.some((i) => i === e);
    return !r && n?.extend(null, this.shape.join(" | "), e.toString()), r;
  }
}
const Po = (...t) => new Bo(t), Kf = ct(Bo), cw = (
  /** @type {any} */
  RegExp.escape || /** @type {(str:string) => string} */
  ((t) => t.replace(/[().|&,$^[\]]/g, (e) => "\\" + e))
), Wf = (t) => {
  if (Ci.check(t))
    return [cw(t)];
  if (Kf.check(t))
    return (
      /** @type {Array<string|number>} */
      t.shape.map((e) => e + "")
    );
  if (ap.check(t))
    return ["[+-]?\\d+.?\\d*"];
  if (op.check(t))
    return [".*"];
  if (oo.check(t))
    return t.shape.map(Wf).flat(1);
  Ot();
};
class dw extends Ct {
  /**
   * @param {T} shape
   */
  constructor(e) {
    super(), this.shape = e, this._r = new RegExp("^" + e.map(Wf).map((n) => `(${n.join("|")})`).join("") + "$");
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is CastStringTemplateArgsToTemplate<T>}
   */
  check(e, n) {
    const r = this._r.exec(e) != null;
    return !r && n?.extend(null, this._r.toString(), e.toString(), "String doesn't match string template."), r;
  }
}
ct(dw);
const uw = /* @__PURE__ */ Symbol("optional");
class Xf extends Ct {
  /**
   * @param {S} shape
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is (Unwrap<S>|undefined)}
   */
  check(e, n) {
    const r = e === void 0 || this.shape.check(e);
    return !r && n?.extend(null, "undefined (optional)", "()"), r;
  }
  get [uw]() {
    return !0;
  }
}
const hw = ct(Xf);
class fw extends Ct {
  /**
   * @param {any} _o
   * @param {ValidationError} [err]
   * @return {_o is never}
   */
  check(e, n) {
    return n?.extend(null, "never", typeof e), !1;
  }
}
ct(fw);
class Mo extends Ct {
  /**
   * @param {S} shape
   * @param {boolean} partial
   */
  constructor(e, n = !1) {
    super(), this.shape = e, this._isPartial = n;
  }
  static _dilutes = !0;
  /**
   * @type {Schema<Partial<$ObjectToType<S>>>}
   */
  get partial() {
    return new Mo(this.shape, !0);
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is $ObjectToType<S>}
   */
  check(e, n) {
    return e == null ? (n?.extend(null, "object", "null"), !1) : Ns(this.shape, (r, i) => {
      const s = this._isPartial && !rd(e, i) || r.check(e[i], n);
      return !s && n?.extend(i.toString(), r.toString(), typeof e[i], "Object property does not match"), s;
    });
  }
}
const pw = (t) => (
  /** @type {any} */
  new Mo(t)
), gw = ct(Mo), mw = yt((t) => t != null && (t.constructor === Object || t.constructor == null));
class Zf extends Ct {
  /**
   * @param {Keys} keys
   * @param {Values} values
   */
  constructor(e, n) {
    super(), this.shape = {
      keys: e,
      values: n
    };
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is { [key in Unwrap<Keys>]: Unwrap<Values> }}
   */
  check(e, n) {
    return e != null && Ns(e, (r, i) => {
      const s = this.shape.keys.check(i, n);
      return !s && n?.extend(i + "", "Record", typeof e, s ? "Key doesn't match schema" : "Value doesn't match value"), s && this.shape.values.check(r, n);
    });
  }
}
const Yf = (t, e) => new Zf(t, e), bw = ct(Zf);
class ep extends Ct {
  /**
   * @param {S} shape
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is { [K in keyof S]: S[K] extends Schema<infer Type> ? Type : never }}
   */
  check(e, n) {
    return e != null && Ns(this.shape, (r, i) => {
      const s = (
        /** @type {Schema<any>} */
        r.check(e[i], n)
      );
      return !s && n?.extend(i.toString(), "Tuple", typeof r), s;
    });
  }
}
const yw = (...t) => new ep(t);
ct(ep);
class tp extends Ct {
  /**
   * @param {Array<S>} v
   */
  constructor(e) {
    super(), this.shape = e.length === 1 ? e[0] : new ld(e);
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Array<S extends Schema<infer T> ? T : never>} o
   */
  check(e, n) {
    const r = vi(e) && Xc(e, (i) => this.shape.check(i));
    return !r && n?.extend(null, "Array", ""), r;
  }
}
const np = (...t) => new tp(t), ww = ct(tp), _w = yt((t) => vi(t));
class rp extends Ct {
  /**
   * @param {new (...args:any) => T} constructor
   * @param {((o:T) => boolean)|null} check
   */
  constructor(e, n) {
    super(), this.shape = e, this._c = n;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is T}
   */
  check(e, n) {
    const r = e instanceof this.shape && (this._c == null || this._c(e));
    return !r && n?.extend(null, this.shape.name, e?.constructor.name), r;
  }
}
const kw = (t, e = null) => new rp(t, e);
ct(rp);
const vw = kw(Ct);
class Aw extends Ct {
  /**
   * @param {Args} args
   */
  constructor(e) {
    super(), this.len = e.length - 1, this.args = yw(...e.slice(-1)), this.res = e[this.len];
  }
  /**
   * @param {any} f
   * @param {ValidationError} err
   * @return {f is _LArgsToLambdaDef<Args>}
   */
  check(e, n) {
    const r = e.constructor === Function && e.length <= this.len;
    return !r && n?.extend(null, "function", typeof e), r;
  }
}
const Cw = ct(Aw), Iw = yt((t) => typeof t == "function");
class Sw extends Ct {
  /**
   * @param {T} v
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Intersect<UnwrapArray<T>>}
   */
  check(e, n) {
    const r = Xc(this.shape, (i) => i.check(e, n));
    return !r && n?.extend(null, "Intersectinon", typeof e), r;
  }
}
ct(Sw, (t) => t.shape.length > 0);
class ld extends Ct {
  static _dilutes = !0;
  /**
   * @param {Array<Schema<S>>} v
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is S}
   */
  check(e, n) {
    const r = Zc(this.shape, (i) => i.check(e, n));
    return n?.extend(null, "Union", typeof e), r;
  }
}
const Pi = (...t) => t.findIndex((e) => oo.check(e)) >= 0 ? Pi(...t.map((e) => _s(e)).map((e) => oo.check(e) ? e.shape : [e]).flat(1)) : t.length === 1 ? t[0] : new ld(t), oo = (
  /** @type {Schema<$Union<any>>} */
  ct(ld)
), ip = () => !0, lo = yt(ip), Ew = (
  /** @type {Schema<Schema<any>>} */
  ct(od, (t) => t.shape === ip)
), cd = yt((t) => typeof t == "bigint"), xw = (
  /** @type {Schema<Schema<BigInt>>} */
  yt((t) => t === cd)
), sp = yt((t) => typeof t == "symbol");
yt((t) => t === sp);
const gi = yt((t) => typeof t == "number"), ap = (
  /** @type {Schema<Schema<number>>} */
  yt((t) => t === gi)
), Ci = yt((t) => typeof t == "string"), op = (
  /** @type {Schema<Schema<string>>} */
  yt((t) => t === Ci)
), zo = yt((t) => typeof t == "boolean"), Nw = (
  /** @type {Schema<Schema<Boolean>>} */
  yt((t) => t === zo)
), lp = Po(void 0);
ct(Bo, (t) => t.shape.length === 1 && t.shape[0] === void 0);
Po(void 0);
const Ro = Po(null), Dw = (
  /** @type {Schema<Schema<null>>} */
  ct(Bo, (t) => t.shape.length === 1 && t.shape[0] === null)
);
ct(Uint8Array);
ct(ad, (t) => t.shape === Uint8Array);
const Bw = Pi(gi, Ci, Ro, lp, cd, zo, sp);
(() => {
  const t = (
    /** @type {$Array<$any>} */
    np(lo)
  ), e = (
    /** @type {$Record<$string,$any>} */
    Yf(Ci, lo)
  ), n = Pi(gi, Ci, Ro, zo, t, e);
  return t.shape = n, e.shape.values = n, n;
})();
const _s = (t) => {
  if (vw.check(t))
    return (
      /** @type {any} */
      t
    );
  if (mw.check(t)) {
    const e = {};
    for (const n in t)
      e[n] = _s(t[n]);
    return (
      /** @type {any} */
      pw(e)
    );
  } else {
    if (_w.check(t))
      return (
        /** @type {any} */
        Pi(...t.map(_s))
      );
    if (Bw.check(t))
      return (
        /** @type {any} */
        Po(t)
      );
    if (Iw.check(t))
      return (
        /** @type {any} */
        ct(
          /** @type {any} */
          t
        )
      );
  }
  Ot();
}, Ih = Yy ? () => {
} : (t, e) => {
  const n = new lw();
  if (!e.check(t, n))
    throw wn(`Expected value to be of type ${e.constructor.name}.
${n.toString()}`);
};
class Pw {
  /**
   * @param {Schema<State>} [$state]
   */
  constructor(e) {
    this.patterns = [], this.$state = e;
  }
  /**
   * @template P
   * @template R
   * @param {P} pattern
   * @param {(o:NoInfer<Unwrap<ReadSchema<P>>>,s:State)=>R} handler
   * @return {PatternMatcher<State,Patterns|Pattern<Unwrap<ReadSchema<P>>,R>>}
   */
  if(e, n) {
    return this.patterns.push({ if: _s(e), h: n }), this;
  }
  /**
   * @template R
   * @param {(o:any,s:State)=>R} h
   */
  else(e) {
    return this.if(lo, e);
  }
  /**
   * @return {State extends undefined
   *   ? <In extends Unwrap<Patterns['if']>>(o:In,state?:undefined)=>PatternMatchResult<Patterns,In>
   *   : <In extends Unwrap<Patterns['if']>>(o:In,state:State)=>PatternMatchResult<Patterns,In>}
   */
  done() {
    return (
      /** @type {any} */
      (e, n) => {
        for (let r = 0; r < this.patterns.length; r++) {
          const i = this.patterns[r];
          if (i.if.check(e))
            return i.h(e, n);
        }
        throw wn("Unhandled pattern");
      }
    );
  }
}
const Mw = (t) => new Pw(
  /** @type {any} */
  t
), cp = (
  /** @type {any} */
  Mw(
    /** @type {Schema<prng.PRNG>} */
    lo
  ).if(ap, (t, e) => ac(e, gh, io)).if(op, (t, e) => aw(e)).if(Nw, (t, e) => Ch(e)).if(xw, (t, e) => BigInt(ac(e, gh, io))).if(oo, (t, e) => ti(e, oc(e, t.shape))).if(gw, (t, e) => {
    const n = {};
    for (const r in t.shape) {
      let i = t.shape[r];
      if (hw.check(i)) {
        if (Ch(e))
          continue;
        i = i.shape;
      }
      n[r] = cp(i, e);
    }
    return n;
  }).if(ww, (t, e) => {
    const n = [], r = Vf(e, 0, 42);
    for (let i = 0; i < r; i++)
      n.push(ti(e, t.shape));
    return n;
  }).if(Kf, (t, e) => oc(e, t.shape)).if(Dw, (t, e) => null).if(Cw, (t, e) => {
    const n = ti(e, t.res);
    return () => n;
  }).if(Ew, (t, e) => ti(e, oc(e, [
    gi,
    Ci,
    Ro,
    lp,
    cd,
    zo,
    np(gi),
    Yf(Pi("a", "b", "c"), gi)
  ]))).if(bw, (t, e) => {
    const n = {}, r = ac(e, 0, 3);
    for (let i = 0; i < r; i++) {
      const s = ti(e, t.shape.keys), a = ti(e, t.shape.values);
      n[s] = a;
    }
    return n;
  }).done()
), ti = (t, e) => (
  /** @type {any} */
  cp(_s(e), t)
), To = (
  /** @type {Document} */
  typeof document < "u" ? document : {}
);
yt((t) => t.nodeType === Lw);
typeof DOMParser < "u" && new DOMParser();
yt((t) => t.nodeType === Rw);
yt((t) => t.nodeType === Tw);
const zw = (t) => ey(t, (e, n) => `${n}:${e};`).join(""), Rw = To.ELEMENT_NODE, Tw = To.TEXT_NODE, Fw = To.DOCUMENT_NODE, Lw = To.DOCUMENT_FRAGMENT_NODE;
yt((t) => t.nodeType === Fw);
const Gn = Symbol, dp = Gn(), up = Gn(), Ow = Gn(), Uw = Gn(), $w = Gn(), hp = Gn(), Qw = Gn(), dd = Gn(), jw = Gn(), qw = (t) => {
  t.length === 1 && t[0]?.constructor === Function && (t = /** @type {Array<string|Symbol|Object|number>} */
  /** @type {[function]} */
  t[0]());
  const e = [], n = [];
  let r = 0;
  for (; r < t.length; r++) {
    const i = t[r];
    if (i === void 0)
      break;
    if (i.constructor === String || i.constructor === Number)
      e.push(i);
    else if (i.constructor === Object)
      break;
  }
  for (r > 0 && n.push(e.join("")); r < t.length; r++) {
    const i = t[r];
    i instanceof Symbol || n.push(i);
  }
  return n;
}, Hw = {
  [dp]: zn("font-weight", "bold"),
  [up]: zn("font-weight", "normal"),
  [Ow]: zn("color", "blue"),
  [$w]: zn("color", "green"),
  [Uw]: zn("color", "grey"),
  [hp]: zn("color", "red"),
  [Qw]: zn("color", "purple"),
  [dd]: zn("color", "orange"),
  // not well supported in chrome when debugging node with inspector - TODO: deprecate
  [jw]: zn("color", "black")
}, Gw = (t) => {
  t.length === 1 && t[0]?.constructor === Function && (t = /** @type {Array<string|Symbol|Object|number>} */
  /** @type {[function]} */
  t[0]());
  const e = [], n = [], r = sn();
  let i = [], s = 0;
  for (; s < t.length; s++) {
    const a = t[s], l = Hw[a];
    if (l !== void 0)
      r.set(l.left, l.right);
    else {
      if (a === void 0)
        break;
      if (a.constructor === String || a.constructor === Number) {
        const d = zw(r);
        s > 0 || d.length > 0 ? (e.push("%c" + a), n.push(d)) : e.push(a);
      } else
        break;
    }
  }
  for (s > 0 && (i = n, i.unshift(e.join(""))); s < t.length; s++) {
    const a = t[s];
    a instanceof Symbol || i.push(a);
  }
  return i;
}, fp = tw ? Gw : qw, Jw = (...t) => {
  console.log(...fp(t)), gp.forEach((e) => e.print(t));
}, pp = (...t) => {
  console.warn(...fp(t)), t.unshift(dd), gp.forEach((e) => e.print(t));
}, gp = ki(), mp = (t) => ({
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return this;
  },
  // @ts-ignore
  next: t
}), Vw = (t, e) => mp(() => {
  let n;
  do
    n = t.next();
  while (!n.done && !e(n.value));
  return n;
}), lc = (t, e) => mp(() => {
  const { done: n, value: r } = t.next();
  return { done: n, value: n ? void 0 : e(r) };
});
class Fo {
  /**
   * @param {number} clock
   * @param {number} len
   */
  constructor(e, n) {
    this.clock = e, this.len = n;
  }
}
class Mi {
  constructor() {
    this.clients = /* @__PURE__ */ new Map();
  }
}
const Ii = (t, e, n) => e.clients.forEach((r, i) => {
  const s = (
    /** @type {Array<GC|Item>} */
    t.doc.store.clients.get(i)
  );
  if (s != null) {
    const a = s[s.length - 1], l = a.id.clock + a.length;
    for (let d = 0, h = r[d]; d < r.length && h.clock < l; h = r[++d])
      Pp(t, s, h.clock, h.len, n);
  }
}), Kw = (t, e) => {
  let n = 0, r = t.length - 1;
  for (; n <= r; ) {
    const i = yn((n + r) / 2), s = t[i], a = s.clock;
    if (a <= e) {
      if (e < a + s.len)
        return i;
      n = i + 1;
    } else
      r = i - 1;
  }
  return null;
}, Ds = (t, e) => {
  const n = t.clients.get(e.client);
  return n !== void 0 && Kw(n, e.clock) !== null;
}, ud = (t) => {
  t.clients.forEach((e) => {
    e.sort((i, s) => i.clock - s.clock);
    let n, r;
    for (n = 1, r = 1; n < e.length; n++) {
      const i = e[r - 1], s = e[n];
      i.clock + i.len >= s.clock ? e[r - 1] = new Fo(i.clock, Tr(i.len, s.clock + s.len - i.clock)) : (r < n && (e[r] = s), r++);
    }
    e.length = r;
  });
}, Dc = (t) => {
  const e = new Mi();
  for (let n = 0; n < t.length; n++)
    t[n].clients.forEach((r, i) => {
      if (!e.clients.has(i)) {
        const s = r.slice();
        for (let a = n + 1; a < t.length; a++)
          ny(s, t[a].clients.get(i) || []);
        e.clients.set(i, s);
      }
    });
  return ud(e), e;
}, ks = (t, e, n, r) => {
  yr(t.clients, e, () => (
    /** @type {Array<DeleteItem>} */
    []
  )).push(new Fo(n, r));
}, Ww = () => new Mi(), bp = (t) => {
  const e = Ww();
  return t.clients.forEach((n, r) => {
    const i = [];
    for (let s = 0; s < n.length; s++) {
      const a = n[s];
      if (a.deleted) {
        const l = a.id.clock;
        let d = a.length;
        if (s + 1 < n.length)
          for (let h = n[s + 1]; s + 1 < n.length && h.deleted; h = n[++s + 1])
            d += h.length;
        i.push(new Fo(l, d));
      }
    }
    i.length > 0 && e.clients.set(r, i);
  }), e;
}, zi = (t, e) => {
  Oe(t.restEncoder, e.clients.size), br(e.clients.entries()).sort((n, r) => r[0] - n[0]).forEach(([n, r]) => {
    t.resetDsCurVal(), Oe(t.restEncoder, n);
    const i = r.length;
    Oe(t.restEncoder, i);
    for (let s = 0; s < i; s++) {
      const a = r[s];
      t.writeDsClock(a.clock), t.writeDsLen(a.len);
    }
  });
}, hd = (t) => {
  const e = new Mi(), n = Te(t.restDecoder);
  for (let r = 0; r < n; r++) {
    t.resetDsCurVal();
    const i = Te(t.restDecoder), s = Te(t.restDecoder);
    if (s > 0) {
      const a = yr(e.clients, i, () => (
        /** @type {Array<DeleteItem>} */
        []
      ));
      for (let l = 0; l < s; l++)
        a.push(new Fo(t.readDsClock(), t.readDsLen()));
    }
  }
  return e;
}, Sh = (t, e, n) => {
  const r = new Mi(), i = Te(t.restDecoder);
  for (let s = 0; s < i; s++) {
    t.resetDsCurVal();
    const a = Te(t.restDecoder), l = Te(t.restDecoder), d = n.clients.get(a) || [], h = at(n, a);
    for (let b = 0; b < l; b++) {
      const m = t.readDsClock(), p = m + t.readDsLen();
      if (m < h) {
        h < p && ks(r, a, h, p - h);
        let g = _n(d, m), _ = d[g];
        for (!_.deleted && _.id.clock < m && (d.splice(g + 1, 0, bo(e, _, m - _.id.clock)), g++); g < d.length && (_ = d[g++], _.id.clock < p); )
          _.deleted || (p < _.id.clock + _.length && d.splice(g, 0, bo(e, _, p - _.id.clock)), _.delete(e));
      } else
        ks(r, a, m, p - m);
    }
  }
  if (r.clients.size > 0) {
    const s = new Mr();
    return Oe(s.restEncoder, 0), zi(s, r), s.toUint8Array();
  }
  return null;
}, yp = jf;
class Fr extends Of {
  /**
   * @param {DocOpts} opts configuration
   */
  constructor({ guid: e = Ly(), collectionid: n = null, gc: r = !0, gcFilter: i = () => !0, meta: s = null, autoLoad: a = !1, shouldLoad: l = !0 } = {}) {
    super(), this.gc = r, this.gcFilter = i, this.clientID = yp(), this.guid = e, this.collectionid = n, this.share = /* @__PURE__ */ new Map(), this.store = new Dp(), this._transaction = null, this._transactionCleanups = [], this.subdocs = /* @__PURE__ */ new Set(), this._item = null, this.shouldLoad = l, this.autoLoad = a, this.meta = s, this.isLoaded = !1, this.isSynced = !1, this.isDestroyed = !1, this.whenLoaded = vh((h) => {
      this.on("load", () => {
        this.isLoaded = !0, h(this);
      });
    });
    const d = () => vh((h) => {
      const b = (m) => {
        (m === void 0 || m === !0) && (this.off("sync", b), h());
      };
      this.on("sync", b);
    });
    this.on("sync", (h) => {
      h === !1 && this.isSynced && (this.whenSynced = d()), this.isSynced = h === void 0 || h === !0, this.isSynced && !this.isLoaded && this.emit("load", [this]);
    }), this.whenSynced = d();
  }
  /**
   * Notify the parent document that you request to load data into this subdocument (if it is a subdocument).
   *
   * `load()` might be used in the future to request any provider to load the most current data.
   *
   * It is safe to call `load()` multiple times.
   */
  load() {
    const e = this._item;
    e !== null && !this.shouldLoad && Ke(
      /** @type {any} */
      e.parent.doc,
      (n) => {
        n.subdocsLoaded.add(this);
      },
      null,
      !0
    ), this.shouldLoad = !0;
  }
  getSubdocs() {
    return this.subdocs;
  }
  getSubdocGuids() {
    return new Set(br(this.subdocs).map((e) => e.guid));
  }
  /**
   * Changes that happen inside of a transaction are bundled. This means that
   * the observer fires _after_ the transaction is finished and that all changes
   * that happened inside of the transaction are sent as one message to the
   * other peers.
   *
   * @template T
   * @param {function(Transaction):T} f The function that should be executed as a transaction
   * @param {any} [origin] Origin of who started the transaction. Will be stored on transaction.origin
   * @return T
   *
   * @public
   */
  transact(e, n = null) {
    return Ke(this, e, n);
  }
  /**
   * Define a shared data type.
   *
   * Multiple calls of `ydoc.get(name, TypeConstructor)` yield the same result
   * and do not overwrite each other. I.e.
   * `ydoc.get(name, Y.Array) === ydoc.get(name, Y.Array)`
   *
   * After this method is called, the type is also available on `ydoc.share.get(name)`.
   *
   * *Best Practices:*
   * Define all types right after the Y.Doc instance is created and store them in a separate object.
   * Also use the typed methods `getText(name)`, `getArray(name)`, ..
   *
   * @template {typeof AbstractType<any>} Type
   * @example
   *   const ydoc = new Y.Doc(..)
   *   const appState = {
   *     document: ydoc.getText('document')
   *     comments: ydoc.getArray('comments')
   *   }
   *
   * @param {string} name
   * @param {Type} TypeConstructor The constructor of the type definition. E.g. Y.Text, Y.Array, Y.Map, ...
   * @return {InstanceType<Type>} The created type. Constructed with TypeConstructor
   *
   * @public
   */
  get(e, n = (
    /** @type {any} */
    bt
  )) {
    const r = yr(this.share, e, () => {
      const s = new n();
      return s._integrate(this, null), s;
    }), i = r.constructor;
    if (n !== bt && i !== n)
      if (i === bt) {
        const s = new n();
        s._map = r._map, r._map.forEach(
          /** @param {Item?} n */
          (a) => {
            for (; a !== null; a = a.left)
              a.parent = s;
          }
        ), s._start = r._start;
        for (let a = s._start; a !== null; a = a.right)
          a.parent = s;
        return s._length = r._length, this.share.set(e, s), s._integrate(this, null), /** @type {InstanceType<Type>} */
        s;
      } else
        throw new Error(`Type with the name ${e} has already been defined with a different constructor`);
    return (
      /** @type {InstanceType<Type>} */
      r
    );
  }
  /**
   * @template T
   * @param {string} [name]
   * @return {YArray<T>}
   *
   * @public
   */
  getArray(e = "") {
    return (
      /** @type {YArray<T>} */
      this.get(e, yi)
    );
  }
  /**
   * @param {string} [name]
   * @return {YText}
   *
   * @public
   */
  getText(e = "") {
    return this.get(e, xi);
  }
  /**
   * @template T
   * @param {string} [name]
   * @return {YMap<T>}
   *
   * @public
   */
  getMap(e = "") {
    return (
      /** @type {YMap<T>} */
      this.get(e, Ei)
    );
  }
  /**
   * @param {string} [name]
   * @return {YXmlElement}
   *
   * @public
   */
  getXmlElement(e = "") {
    return (
      /** @type {YXmlElement<{[key:string]:string}>} */
      this.get(e, Ni)
    );
  }
  /**
   * @param {string} [name]
   * @return {YXmlFragment}
   *
   * @public
   */
  getXmlFragment(e = "") {
    return this.get(e, zr);
  }
  /**
   * Converts the entire document into a js object, recursively traversing each yjs type
   * Doesn't log types that have not been defined (using ydoc.getType(..)).
   *
   * @deprecated Do not use this method and rather call toJSON directly on the shared types.
   *
   * @return {Object<string, any>}
   */
  toJSON() {
    const e = {};
    return this.share.forEach((n, r) => {
      e[r] = n.toJSON();
    }), e;
  }
  /**
   * Emit `destroy` event and unregister all event handlers.
   */
  destroy() {
    this.isDestroyed = !0, br(this.subdocs).forEach((n) => n.destroy());
    const e = this._item;
    if (e !== null) {
      this._item = null;
      const n = (
        /** @type {ContentDoc} */
        e.content
      );
      n.doc = new Fr({ guid: this.guid, ...n.opts, shouldLoad: !1 }), n.doc._item = e, Ke(
        /** @type {any} */
        e.parent.doc,
        (r) => {
          const i = n.doc;
          e.deleted || r.subdocsAdded.add(i), r.subdocsRemoved.add(this);
        },
        null,
        !0
      );
    }
    this.emit("destroyed", [!0]), this.emit("destroy", [this]), super.destroy();
  }
}
class wp {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(e) {
    this.restDecoder = e;
  }
  resetDsCurVal() {
  }
  /**
   * @return {number}
   */
  readDsClock() {
    return Te(this.restDecoder);
  }
  /**
   * @return {number}
   */
  readDsLen() {
    return Te(this.restDecoder);
  }
}
class _p extends wp {
  /**
   * @return {ID}
   */
  readLeftID() {
    return Me(Te(this.restDecoder), Te(this.restDecoder));
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return Me(Te(this.restDecoder), Te(this.restDecoder));
  }
  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient() {
    return Te(this.restDecoder);
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo() {
    return Ai(this.restDecoder);
  }
  /**
   * @return {string}
   */
  readString() {
    return pi(this.restDecoder);
  }
  /**
   * @return {boolean} isKey
   */
  readParentInfo() {
    return Te(this.restDecoder) === 1;
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readTypeRef() {
    return Te(this.restDecoder);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number} len
   */
  readLen() {
    return Te(this.restDecoder);
  }
  /**
   * @return {any}
   */
  readAny() {
    return bs(this.restDecoder);
  }
  /**
   * @return {Uint8Array}
   */
  readBuf() {
    return rw(zt(this.restDecoder));
  }
  /**
   * Legacy implementation uses JSON parse. We use any-decoding in v2.
   *
   * @return {any}
   */
  readJSON() {
    return JSON.parse(pi(this.restDecoder));
  }
  /**
   * @return {string}
   */
  readKey() {
    return pi(this.restDecoder);
  }
}
class Xw {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(e) {
    this.dsCurrVal = 0, this.restDecoder = e;
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  /**
   * @return {number}
   */
  readDsClock() {
    return this.dsCurrVal += Te(this.restDecoder), this.dsCurrVal;
  }
  /**
   * @return {number}
   */
  readDsLen() {
    const e = Te(this.restDecoder) + 1;
    return this.dsCurrVal += e, e;
  }
}
class Si extends Xw {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(e) {
    super(e), this.keys = [], Te(e), this.keyClockDecoder = new sc(zt(e)), this.clientDecoder = new qa(zt(e)), this.leftClockDecoder = new sc(zt(e)), this.rightClockDecoder = new sc(zt(e)), this.infoDecoder = new kh(zt(e), Ai), this.stringDecoder = new Ry(zt(e)), this.parentInfoDecoder = new kh(zt(e), Ai), this.typeRefDecoder = new qa(zt(e)), this.lenDecoder = new qa(zt(e));
  }
  /**
   * @return {ID}
   */
  readLeftID() {
    return new mi(this.clientDecoder.read(), this.leftClockDecoder.read());
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return new mi(this.clientDecoder.read(), this.rightClockDecoder.read());
  }
  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient() {
    return this.clientDecoder.read();
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo() {
    return (
      /** @type {number} */
      this.infoDecoder.read()
    );
  }
  /**
   * @return {string}
   */
  readString() {
    return this.stringDecoder.read();
  }
  /**
   * @return {boolean}
   */
  readParentInfo() {
    return this.parentInfoDecoder.read() === 1;
  }
  /**
   * @return {number} An unsigned 8-bit integer
   */
  readTypeRef() {
    return this.typeRefDecoder.read();
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number}
   */
  readLen() {
    return this.lenDecoder.read();
  }
  /**
   * @return {any}
   */
  readAny() {
    return bs(this.restDecoder);
  }
  /**
   * @return {Uint8Array}
   */
  readBuf() {
    return zt(this.restDecoder);
  }
  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @return {any}
   */
  readJSON() {
    return bs(this.restDecoder);
  }
  /**
   * @return {string}
   */
  readKey() {
    const e = this.keyClockDecoder.read();
    if (e < this.keys.length)
      return this.keys[e];
    {
      const n = this.stringDecoder.read();
      return this.keys.push(n), n;
    }
  }
}
class kp {
  constructor() {
    this.restEncoder = Eo();
  }
  toUint8Array() {
    return bn(this.restEncoder);
  }
  resetDsCurVal() {
  }
  /**
   * @param {number} clock
   */
  writeDsClock(e) {
    Oe(this.restEncoder, e);
  }
  /**
   * @param {number} len
   */
  writeDsLen(e) {
    Oe(this.restEncoder, e);
  }
}
class Bs extends kp {
  /**
   * @param {ID} id
   */
  writeLeftID(e) {
    Oe(this.restEncoder, e.client), Oe(this.restEncoder, e.clock);
  }
  /**
   * @param {ID} id
   */
  writeRightID(e) {
    Oe(this.restEncoder, e.client), Oe(this.restEncoder, e.clock);
  }
  /**
   * Use writeClient and writeClock instead of writeID if possible.
   * @param {number} client
   */
  writeClient(e) {
    Oe(this.restEncoder, e);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo(e) {
    Sc(this.restEncoder, e);
  }
  /**
   * @param {string} s
   */
  writeString(e) {
    fi(this.restEncoder, e);
  }
  /**
   * @param {boolean} isYKey
   */
  writeParentInfo(e) {
    Oe(this.restEncoder, e ? 1 : 0);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef(e) {
    Oe(this.restEncoder, e);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen(e) {
    Oe(this.restEncoder, e);
  }
  /**
   * @param {any} any
   */
  writeAny(e) {
    ms(this.restEncoder, e);
  }
  /**
   * @param {Uint8Array} buf
   */
  writeBuf(e) {
    Mt(this.restEncoder, e);
  }
  /**
   * @param {any} embed
   */
  writeJSON(e) {
    fi(this.restEncoder, JSON.stringify(e));
  }
  /**
   * @param {string} key
   */
  writeKey(e) {
    fi(this.restEncoder, e);
  }
}
class vp {
  constructor() {
    this.restEncoder = Eo(), this.dsCurrVal = 0;
  }
  toUint8Array() {
    return bn(this.restEncoder);
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  /**
   * @param {number} clock
   */
  writeDsClock(e) {
    const n = e - this.dsCurrVal;
    this.dsCurrVal = e, Oe(this.restEncoder, n);
  }
  /**
   * @param {number} len
   */
  writeDsLen(e) {
    e === 0 && Ot(), Oe(this.restEncoder, e - 1), this.dsCurrVal += e;
  }
}
class Mr extends vp {
  constructor() {
    super(), this.keyMap = /* @__PURE__ */ new Map(), this.keyClock = 0, this.keyClockEncoder = new ic(), this.clientEncoder = new ja(), this.leftClockEncoder = new ic(), this.rightClockEncoder = new ic(), this.infoEncoder = new yh(Sc), this.stringEncoder = new Cy(), this.parentInfoEncoder = new yh(Sc), this.typeRefEncoder = new ja(), this.lenEncoder = new ja();
  }
  toUint8Array() {
    const e = Eo();
    return Oe(e, 0), Mt(e, this.keyClockEncoder.toUint8Array()), Mt(e, this.clientEncoder.toUint8Array()), Mt(e, this.leftClockEncoder.toUint8Array()), Mt(e, this.rightClockEncoder.toUint8Array()), Mt(e, bn(this.infoEncoder)), Mt(e, this.stringEncoder.toUint8Array()), Mt(e, bn(this.parentInfoEncoder)), Mt(e, this.typeRefEncoder.toUint8Array()), Mt(e, this.lenEncoder.toUint8Array()), xo(e, bn(this.restEncoder)), bn(e);
  }
  /**
   * @param {ID} id
   */
  writeLeftID(e) {
    this.clientEncoder.write(e.client), this.leftClockEncoder.write(e.clock);
  }
  /**
   * @param {ID} id
   */
  writeRightID(e) {
    this.clientEncoder.write(e.client), this.rightClockEncoder.write(e.clock);
  }
  /**
   * @param {number} client
   */
  writeClient(e) {
    this.clientEncoder.write(e);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo(e) {
    this.infoEncoder.write(e);
  }
  /**
   * @param {string} s
   */
  writeString(e) {
    this.stringEncoder.write(e);
  }
  /**
   * @param {boolean} isYKey
   */
  writeParentInfo(e) {
    this.parentInfoEncoder.write(e ? 1 : 0);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef(e) {
    this.typeRefEncoder.write(e);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen(e) {
    this.lenEncoder.write(e);
  }
  /**
   * @param {any} any
   */
  writeAny(e) {
    ms(this.restEncoder, e);
  }
  /**
   * @param {Uint8Array} buf
   */
  writeBuf(e) {
    Mt(this.restEncoder, e);
  }
  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @param {any} embed
   */
  writeJSON(e) {
    ms(this.restEncoder, e);
  }
  /**
   * Property keys are often reused. For example, in y-prosemirror the key `bold` might
   * occur very often. For a 3d application, the key `position` might occur very often.
   *
   * We cache these keys in a Map and refer to them via a unique number.
   *
   * @param {string} key
   */
  writeKey(e) {
    const n = this.keyMap.get(e);
    n === void 0 ? (this.keyClockEncoder.write(this.keyClock++), this.stringEncoder.write(e)) : this.keyClockEncoder.write(n);
  }
}
const Zw = (t, e, n, r) => {
  r = Tr(r, e[0].id.clock);
  const i = _n(e, r);
  Oe(t.restEncoder, e.length - i), t.writeClient(n), Oe(t.restEncoder, r);
  const s = e[i];
  s.write(t, r - s.id.clock);
  for (let a = i + 1; a < e.length; a++)
    e[a].write(t, 0);
}, fd = (t, e, n) => {
  const r = /* @__PURE__ */ new Map();
  n.forEach((i, s) => {
    at(e, s) > i && r.set(s, i);
  }), Ps(e).forEach((i, s) => {
    n.has(s) || r.set(s, 0);
  }), Oe(t.restEncoder, r.size), br(r.entries()).sort((i, s) => s[0] - i[0]).forEach(([i, s]) => {
    Zw(
      t,
      /** @type {Array<GC|Item>} */
      e.clients.get(i),
      i,
      s
    );
  });
}, Yw = (t, e) => {
  const n = sn(), r = Te(t.restDecoder);
  for (let i = 0; i < r; i++) {
    const s = Te(t.restDecoder), a = new Array(s), l = t.readClient();
    let d = Te(t.restDecoder);
    n.set(l, { i: 0, refs: a });
    for (let h = 0; h < s; h++) {
      const b = t.readInfo();
      switch (So & b) {
        case 0: {
          const m = t.readLen();
          a[h] = new Wt(Me(l, d), m), d += m;
          break;
        }
        case 10: {
          const m = Te(t.restDecoder);
          a[h] = new Xt(Me(l, d), m), d += m;
          break;
        }
        default: {
          const m = (b & ($n | Lt)) === 0, p = new We(
            Me(l, d),
            null,
            // left
            (b & Lt) === Lt ? t.readLeftID() : null,
            // origin
            null,
            // right
            (b & $n) === $n ? t.readRightID() : null,
            // right origin
            m ? t.readParentInfo() ? e.get(t.readString()) : t.readLeftID() : null,
            // parent
            m && (b & ps) === ps ? t.readString() : null,
            // parentSub
            Yp(t, b)
            // item content
          );
          a[h] = p, d += p.length;
        }
      }
    }
  }
  return n;
}, e_ = (t, e, n) => {
  const r = [];
  let i = br(n.keys()).sort((g, _) => g - _);
  if (i.length === 0)
    return null;
  const s = () => {
    if (i.length === 0)
      return null;
    let g = (
      /** @type {{i:number,refs:Array<GC|Item>}} */
      n.get(i[i.length - 1])
    );
    for (; g.refs.length === g.i; )
      if (i.pop(), i.length > 0)
        g = /** @type {{i:number,refs:Array<GC|Item>}} */
        n.get(i[i.length - 1]);
      else
        return null;
    return g;
  };
  let a = s();
  if (a === null)
    return null;
  const l = new Dp(), d = /* @__PURE__ */ new Map(), h = (g, _) => {
    const k = d.get(g);
    (k == null || k > _) && d.set(g, _);
  };
  let b = (
    /** @type {any} */
    a.refs[
      /** @type {any} */
      a.i++
    ]
  );
  const m = /* @__PURE__ */ new Map(), p = () => {
    for (const g of r) {
      const _ = g.id.client, k = n.get(_);
      k ? (k.i--, l.clients.set(_, k.refs.slice(k.i)), n.delete(_), k.i = 0, k.refs = []) : l.clients.set(_, [g]), i = i.filter((y) => y !== _);
    }
    r.length = 0;
  };
  for (; ; ) {
    if (b.constructor !== Xt) {
      const _ = yr(m, b.id.client, () => at(e, b.id.client)) - b.id.clock;
      if (_ < 0)
        r.push(b), h(b.id.client, b.id.clock - 1), p();
      else {
        const k = b.getMissing(t, e);
        if (k !== null) {
          r.push(b);
          const y = n.get(
            /** @type {number} */
            k
          ) || { refs: [], i: 0 };
          if (y.refs.length === y.i)
            h(
              /** @type {number} */
              k,
              at(e, k)
            ), p();
          else {
            b = y.refs[y.i++];
            continue;
          }
        } else (_ === 0 || _ < b.length) && (b.integrate(t, _), m.set(b.id.client, b.id.clock + b.length));
      }
    }
    if (r.length > 0)
      b = /** @type {GC|Item} */
      r.pop();
    else if (a !== null && a.i < a.refs.length)
      b = /** @type {GC|Item} */
      a.refs[a.i++];
    else {
      if (a = s(), a === null)
        break;
      b = /** @type {GC|Item} */
      a.refs[a.i++];
    }
  }
  if (l.clients.size > 0) {
    const g = new Mr();
    return fd(g, l, /* @__PURE__ */ new Map()), Oe(g.restEncoder, 0), { missing: d, update: g.toUint8Array() };
  }
  return null;
}, t_ = (t, e) => fd(t, e.doc.store, e.beforeState), n_ = (t, e, n, r = new Si(t)) => Ke(e, (i) => {
  i.local = !1;
  let s = !1;
  const a = i.doc, l = a.store, d = Yw(r, a), h = e_(i, l, d), b = l.pendingStructs;
  if (b) {
    for (const [p, g] of b.missing)
      if (g < at(l, p)) {
        s = !0;
        break;
      }
    if (h) {
      for (const [p, g] of h.missing) {
        const _ = b.missing.get(p);
        (_ == null || _ > g) && b.missing.set(p, g);
      }
      b.update = uo([b.update, h.update]);
    }
  } else
    l.pendingStructs = h;
  const m = Sh(r, i, l);
  if (l.pendingDs) {
    const p = new Si(Bi(l.pendingDs));
    Te(p.restDecoder);
    const g = Sh(p, i, l);
    m && g ? l.pendingDs = uo([m, g]) : l.pendingDs = m || g;
  } else
    l.pendingDs = m;
  if (s) {
    const p = (
      /** @type {{update: Uint8Array}} */
      l.pendingStructs.update
    );
    l.pendingStructs = null, Ap(i.doc, p);
  }
}, n, !1), Ap = (t, e, n, r = Si) => {
  const i = Bi(e);
  n_(i, t, n, new r(i));
}, Cp = (t, e, n) => Ap(t, e, n, _p), r_ = (t, e, n = /* @__PURE__ */ new Map()) => {
  fd(t, e.store, n), zi(t, bp(e.store));
}, i_ = (t, e = new Uint8Array([0]), n = new Mr()) => {
  const r = Ip(e);
  r_(n, t, r);
  const i = [n.toUint8Array()];
  if (t.store.pendingDs && i.push(t.store.pendingDs), t.store.pendingStructs && i.push(A_(t.store.pendingStructs.update, e)), i.length > 1) {
    if (n.constructor === Bs)
      return zp(i.map((s, a) => a === 0 ? s : I_(s)));
    if (n.constructor === Mr)
      return uo(i);
  }
  return i[0];
}, s_ = (t, e) => i_(t, e, new Bs()), a_ = (t) => {
  const e = /* @__PURE__ */ new Map(), n = Te(t.restDecoder);
  for (let r = 0; r < n; r++) {
    const i = Te(t.restDecoder), s = Te(t.restDecoder);
    e.set(i, s);
  }
  return e;
}, Ip = (t) => a_(new wp(Bi(t))), Sp = (t, e) => (Oe(t.restEncoder, e.size), br(e.entries()).sort((n, r) => r[0] - n[0]).forEach(([n, r]) => {
  Oe(t.restEncoder, n), Oe(t.restEncoder, r);
}), t), o_ = (t, e) => Sp(t, Ps(e.store)), l_ = (t, e = new vp()) => (t instanceof Map ? Sp(e, t) : o_(e, t), e.toUint8Array()), rC = (t) => l_(t, new kp());
class c_ {
  constructor() {
    this.l = [];
  }
}
const Eh = () => new c_(), xh = (t, e) => t.l.push(e), Nh = (t, e) => {
  const n = t.l, r = n.length;
  t.l = n.filter((i) => e !== i), r === t.l.length && console.error("[yjs] Tried to remove event handler that doesn't exist.");
}, Ep = (t, e, n) => id(t.l, [e, n]);
class mi {
  /**
   * @param {number} client client id
   * @param {number} clock unique per client id, continuous number
   */
  constructor(e, n) {
    this.client = e, this.clock = n;
  }
}
const li = (t, e) => t === e || t !== null && e !== null && t.client === e.client && t.clock === e.clock, Me = (t, e) => new mi(t, e), xp = (t) => {
  for (const [e, n] of t.doc.share.entries())
    if (n === t)
      return e;
  throw Ot();
}, co = (t, e) => {
  for (; e !== null; ) {
    if (e.parent === t)
      return !0;
    e = /** @type {AbstractType<any>} */
    e.parent._item;
  }
  return !1;
};
class Np {
  /**
   * @param {ID|null} type
   * @param {string|null} tname
   * @param {ID|null} item
   * @param {number} assoc
   */
  constructor(e, n, r, i = 0) {
    this.type = e, this.tname = n, this.item = r, this.assoc = i;
  }
}
const iC = (t) => new Np(t.type == null ? null : Me(t.type.client, t.type.clock), t.tname ?? null, t.item == null ? null : Me(t.item.client, t.item.clock), t.assoc == null ? 0 : t.assoc);
class d_ {
  /**
   * @param {AbstractType<any>} type
   * @param {number} index
   * @param {number} [assoc]
   */
  constructor(e, n, r = 0) {
    this.type = e, this.index = n, this.assoc = r;
  }
}
const u_ = (t, e, n = 0) => new d_(t, e, n), xa = (t, e, n) => {
  let r = null, i = null;
  return t._item === null ? i = xp(t) : r = Me(t._item.id.client, t._item.id.clock), new Np(r, i, e, n);
}, sC = (t, e, n = 0) => {
  let r = t._start;
  if (n < 0) {
    if (e === 0)
      return xa(t, null, n);
    e--;
  }
  for (; r !== null; ) {
    if (!r.deleted && r.countable) {
      if (r.length > e)
        return xa(t, Me(r.id.client, r.id.clock + e), n);
      e -= r.length;
    }
    if (r.right === null && n < 0)
      return xa(t, r.lastId, n);
    r = r.right;
  }
  return xa(t, null, n);
}, h_ = (t, e) => {
  const n = bi(t, e), r = e.clock - n.id.clock;
  return {
    item: n,
    diff: r
  };
}, aC = (t, e, n = !0) => {
  const r = e.store, i = t.item, s = t.type, a = t.tname, l = t.assoc;
  let d = null, h = 0;
  if (i !== null) {
    if (at(r, i.client) <= i.clock)
      return null;
    const b = n ? zc(r, i) : h_(r, i), m = b.item;
    if (!(m instanceof We))
      return null;
    if (d = /** @type {AbstractType<any>} */
    m.parent, d._item === null || !d._item.deleted) {
      h = m.deleted || !m.countable ? 0 : b.diff + (l >= 0 ? 0 : 1);
      let p = m.left;
      for (; p !== null; )
        !p.deleted && p.countable && (h += p.length), p = p.left;
    }
  } else {
    if (a !== null)
      d = e.get(a);
    else if (s !== null) {
      if (at(r, s.client) <= s.clock)
        return null;
      const { item: b } = n ? zc(r, s) : { item: bi(r, s) };
      if (b instanceof We && b.content instanceof An)
        d = b.content.type;
      else
        return null;
    } else
      throw Ot();
    l >= 0 ? h = d._length : h = 0;
  }
  return u_(d, h, t.assoc);
}, oC = (t, e) => t === e || t !== null && e !== null && t.tname === e.tname && li(t.item, e.item) && li(t.type, e.type) && t.assoc === e.assoc;
class f_ {
  /**
   * @param {DeleteSet} ds
   * @param {Map<number,number>} sv state map
   */
  constructor(e, n) {
    this.ds = e, this.sv = n;
  }
}
const p_ = (t, e) => new f_(t, e), lC = (t) => p_(bp(t.store), Ps(t.store)), Dr = (t, e) => e === void 0 ? !t.deleted : e.sv.has(t.id.client) && (e.sv.get(t.id.client) || 0) > t.id.clock && !Ds(e.ds, t.id), Bc = (t, e) => {
  const n = yr(t.meta, Bc, ki), r = t.doc.store;
  n.has(e) || (e.sv.forEach((i, s) => {
    i < at(r, s) && Nt(t, Me(s, i));
  }), Ii(t, e.ds, (i) => {
  }), n.add(e));
};
class Dp {
  constructor() {
    this.clients = /* @__PURE__ */ new Map(), this.pendingStructs = null, this.pendingDs = null;
  }
}
const Ps = (t) => {
  const e = /* @__PURE__ */ new Map();
  return t.clients.forEach((n, r) => {
    const i = n[n.length - 1];
    e.set(r, i.id.clock + i.length);
  }), e;
}, at = (t, e) => {
  const n = t.clients.get(e);
  if (n === void 0)
    return 0;
  const r = n[n.length - 1];
  return r.id.clock + r.length;
}, Bp = (t, e) => {
  let n = t.clients.get(e.id.client);
  if (n === void 0)
    n = [], t.clients.set(e.id.client, n);
  else {
    const r = n[n.length - 1];
    if (r.id.clock + r.length !== e.id.clock)
      throw Ot();
  }
  n.push(e);
}, _n = (t, e) => {
  let n = 0, r = t.length - 1, i = t[r], s = i.id.clock;
  if (s === e)
    return r;
  let a = yn(e / (s + i.length - 1) * r);
  for (; n <= r; ) {
    if (i = t[a], s = i.id.clock, s <= e) {
      if (e < s + i.length)
        return a;
      n = a + 1;
    } else
      r = a - 1;
    a = yn((n + r) / 2);
  }
  throw Ot();
}, g_ = (t, e) => {
  const n = t.clients.get(e.client);
  return n[_n(n, e.clock)];
}, bi = (
  /** @type {function(StructStore,ID):Item} */
  g_
), Pc = (t, e, n) => {
  const r = _n(e, n), i = e[r];
  return i.id.clock < n && i instanceof We ? (e.splice(r + 1, 0, bo(t, i, n - i.id.clock)), r + 1) : r;
}, Nt = (t, e) => {
  const n = (
    /** @type {Array<Item>} */
    t.doc.store.clients.get(e.client)
  );
  return n[Pc(t, n, e.clock)];
}, Dh = (t, e, n) => {
  const r = e.clients.get(n.client), i = _n(r, n.clock), s = r[i];
  return n.clock !== s.id.clock + s.length - 1 && s.constructor !== Wt && r.splice(i + 1, 0, bo(t, s, n.clock - s.id.clock + 1)), s;
}, m_ = (t, e, n) => {
  const r = (
    /** @type {Array<GC|Item>} */
    t.clients.get(e.id.client)
  );
  r[_n(r, e.id.clock)] = n;
}, Pp = (t, e, n, r, i) => {
  if (r === 0)
    return;
  const s = n + r;
  let a = Pc(t, e, n), l;
  do
    l = e[a++], s < l.id.clock + l.length && Pc(t, e, s), i(l);
  while (a < e.length && e[a].id.clock < s);
};
class b_ {
  /**
   * @param {Doc} doc
   * @param {any} origin
   * @param {boolean} local
   */
  constructor(e, n, r) {
    this.doc = e, this.deleteSet = new Mi(), this.beforeState = Ps(e.store), this.afterState = /* @__PURE__ */ new Map(), this.changed = /* @__PURE__ */ new Map(), this.changedParentTypes = /* @__PURE__ */ new Map(), this._mergeStructs = [], this.origin = n, this.meta = /* @__PURE__ */ new Map(), this.local = r, this.subdocsAdded = /* @__PURE__ */ new Set(), this.subdocsRemoved = /* @__PURE__ */ new Set(), this.subdocsLoaded = /* @__PURE__ */ new Set(), this._needFormattingCleanup = !1;
  }
}
const Bh = (t, e) => e.deleteSet.clients.size === 0 && !ty(e.afterState, (n, r) => e.beforeState.get(r) !== n) ? !1 : (ud(e.deleteSet), t_(t, e), zi(t, e.deleteSet), !0), Ph = (t, e, n) => {
  const r = e._item;
  (r === null || r.id.clock < (t.beforeState.get(r.id.client) || 0) && !r.deleted) && yr(t.changed, e, ki).add(n);
}, Ga = (t, e) => {
  let n = t[e], r = t[e - 1], i = e;
  for (; i > 0; n = r, r = t[--i - 1]) {
    if (r.deleted === n.deleted && r.constructor === n.constructor && r.mergeWith(n)) {
      n instanceof We && n.parentSub !== null && /** @type {AbstractType<any>} */
      n.parent._map.get(n.parentSub) === n && n.parent._map.set(
        n.parentSub,
        /** @type {Item} */
        r
      );
      continue;
    }
    break;
  }
  const s = e - i;
  return s && t.splice(e + 1 - s, s), s;
}, y_ = (t, e, n) => {
  for (const [r, i] of t.clients.entries()) {
    const s = (
      /** @type {Array<GC|Item>} */
      e.clients.get(r)
    );
    for (let a = i.length - 1; a >= 0; a--) {
      const l = i[a], d = l.clock + l.len;
      for (let h = _n(s, l.clock), b = s[h]; h < s.length && b.id.clock < d; b = s[++h]) {
        const m = s[h];
        if (l.clock + l.len <= m.id.clock)
          break;
        m instanceof We && m.deleted && !m.keep && n(m) && m.gc(e, !1);
      }
    }
  }
}, w_ = (t, e) => {
  t.clients.forEach((n, r) => {
    const i = (
      /** @type {Array<GC|Item>} */
      e.clients.get(r)
    );
    for (let s = n.length - 1; s >= 0; s--) {
      const a = n[s], l = Uf(i.length - 1, 1 + _n(i, a.clock + a.len - 1));
      for (let d = l, h = i[d]; d > 0 && h.id.clock >= a.clock; h = i[d])
        d -= 1 + Ga(i, d);
    }
  });
}, Mp = (t, e) => {
  if (e < t.length) {
    const n = t[e], r = n.doc, i = r.store, s = n.deleteSet, a = n._mergeStructs;
    try {
      ud(s), n.afterState = Ps(n.doc.store), r.emit("beforeObserverCalls", [n, r]);
      const l = [];
      n.changed.forEach(
        (d, h) => l.push(() => {
          (h._item === null || !h._item.deleted) && h._callObserver(n, d);
        })
      ), l.push(() => {
        n.changedParentTypes.forEach((d, h) => {
          h._dEH.l.length > 0 && (h._item === null || !h._item.deleted) && l.push(() => {
            d = d.filter(
              (b) => b.target._item === null || !b.target._item.deleted
            ), d.forEach((b) => {
              b.currentTarget = h, b._path = null;
            }), d.sort((b, m) => b.path.length - m.path.length), Ep(h._dEH, d, n);
          });
        }), l.push(() => r.emit("afterTransaction", [n, r])), l.push(() => {
          n._needFormattingCleanup && O_(n);
        });
      }), id(l, []);
    } finally {
      r.gc && y_(s, i, r.gcFilter), w_(s, i), n.afterState.forEach((b, m) => {
        const p = n.beforeState.get(m) || 0;
        if (p !== b) {
          const g = (
            /** @type {Array<GC|Item>} */
            i.clients.get(m)
          ), _ = Tr(_n(g, p), 1);
          for (let k = g.length - 1; k >= _; )
            k -= 1 + Ga(g, k);
        }
      });
      for (let b = a.length - 1; b >= 0; b--) {
        const { client: m, clock: p } = a[b].id, g = (
          /** @type {Array<GC|Item>} */
          i.clients.get(m)
        ), _ = _n(g, p);
        _ + 1 < g.length && Ga(g, _ + 1) > 1 || _ > 0 && Ga(g, _);
      }
      if (!n.local && n.afterState.get(r.clientID) !== n.beforeState.get(r.clientID) && (Jw(dd, dp, "[yjs] ", up, hp, "Changed the client-id because another client seems to be using it."), r.clientID = yp()), r.emit("afterTransactionCleanup", [n, r]), r._observers.has("update")) {
        const b = new Bs();
        Bh(b, n) && r.emit("update", [b.toUint8Array(), n.origin, r, n]);
      }
      if (r._observers.has("updateV2")) {
        const b = new Mr();
        Bh(b, n) && r.emit("updateV2", [b.toUint8Array(), n.origin, r, n]);
      }
      const { subdocsAdded: l, subdocsLoaded: d, subdocsRemoved: h } = n;
      (l.size > 0 || h.size > 0 || d.size > 0) && (l.forEach((b) => {
        b.clientID = r.clientID, b.collectionid == null && (b.collectionid = r.collectionid), r.subdocs.add(b);
      }), h.forEach((b) => r.subdocs.delete(b)), r.emit("subdocs", [{ loaded: d, added: l, removed: h }, r, n]), h.forEach((b) => b.destroy())), t.length <= e + 1 ? (r._transactionCleanups = [], r.emit("afterAllTransactions", [r, t])) : Mp(t, e + 1);
    }
  }
}, Ke = (t, e, n = null, r = !0) => {
  const i = t._transactionCleanups;
  let s = !1, a = null;
  t._transaction === null && (s = !0, t._transaction = new b_(t, n, r), i.push(t._transaction), i.length === 1 && t.emit("beforeAllTransactions", [t]), t.emit("beforeTransaction", [t._transaction, t]));
  try {
    a = e(t._transaction);
  } finally {
    if (s) {
      const l = t._transaction === i[0];
      t._transaction = null, l && Mp(i, 0);
    }
  }
  return a;
};
class __ {
  /**
   * @param {DeleteSet} deletions
   * @param {DeleteSet} insertions
   */
  constructor(e, n) {
    this.insertions = n, this.deletions = e, this.meta = /* @__PURE__ */ new Map();
  }
}
const Mh = (t, e, n) => {
  Ii(t, n.deletions, (r) => {
    r instanceof We && e.scope.some((i) => i === t.doc || co(
      /** @type {AbstractType<any>} */
      i,
      r
    )) && kd(r, !1);
  });
}, zh = (t, e, n) => {
  let r = null;
  const i = t.doc, s = t.scope;
  Ke(i, (l) => {
    for (; e.length > 0 && t.currStackItem === null; ) {
      const d = i.store, h = (
        /** @type {StackItem} */
        e.pop()
      ), b = /* @__PURE__ */ new Set(), m = [];
      let p = !1;
      Ii(l, h.insertions, (g) => {
        if (g instanceof We) {
          if (g.redone !== null) {
            let { item: _, diff: k } = zc(d, g.id);
            k > 0 && (_ = Nt(l, Me(_.id.client, _.id.clock + k))), g = _;
          }
          !g.deleted && s.some((_) => _ === l.doc || co(
            /** @type {AbstractType<any>} */
            _,
            /** @type {Item} */
            g
          )) && m.push(g);
        }
      }), Ii(l, h.deletions, (g) => {
        g instanceof We && s.some((_) => _ === l.doc || co(
          /** @type {AbstractType<any>} */
          _,
          g
        )) && // Never redo structs in stackItem.insertions because they were created and deleted in the same capture interval.
        !Ds(h.insertions, g.id) && b.add(g);
      }), b.forEach((g) => {
        p = Zp(l, g, b, h.insertions, t.ignoreRemoteMapChanges, t) !== null || p;
      });
      for (let g = m.length - 1; g >= 0; g--) {
        const _ = m[g];
        t.deleteFilter(_) && (_.delete(l), p = !0);
      }
      t.currStackItem = p ? h : null;
    }
    l.changed.forEach((d, h) => {
      d.has(null) && h._searchMarker && (h._searchMarker.length = 0);
    }), r = l;
  }, t);
  const a = t.currStackItem;
  if (a != null) {
    const l = r.changedParentTypes;
    t.emit("stack-item-popped", [{ stackItem: a, type: n, changedParentTypes: l, origin: t }, t]), t.currStackItem = null;
  }
  return a;
};
class cC extends Of {
  /**
   * @param {Doc|AbstractType<any>|Array<AbstractType<any>>} typeScope Limits the scope of the UndoManager. If this is set to a ydoc instance, all changes on that ydoc will be undone. If set to a specific type, only changes on that type or its children will be undone. Also accepts an array of types.
   * @param {UndoManagerOptions} options
   */
  constructor(e, {
    captureTimeout: n = 500,
    captureTransaction: r = (d) => !0,
    deleteFilter: i = () => !0,
    trackedOrigins: s = /* @__PURE__ */ new Set([null]),
    ignoreRemoteMapChanges: a = !1,
    doc: l = (
      /** @type {Doc} */
      vi(e) ? e[0].doc : e instanceof Fr ? e : e.doc
    )
  } = {}) {
    super(), this.scope = [], this.doc = l, this.addToScope(e), this.deleteFilter = i, s.add(this), this.trackedOrigins = s, this.captureTransaction = r, this.undoStack = [], this.redoStack = [], this.undoing = !1, this.redoing = !1, this.currStackItem = null, this.lastChange = 0, this.ignoreRemoteMapChanges = a, this.captureTimeout = n, this.afterTransactionHandler = (d) => {
      if (!this.captureTransaction(d) || !this.scope.some((y) => d.changedParentTypes.has(
        /** @type {AbstractType<any>} */
        y
      ) || y === this.doc) || !this.trackedOrigins.has(d.origin) && (!d.origin || !this.trackedOrigins.has(d.origin.constructor)))
        return;
      const h = this.undoing, b = this.redoing, m = h ? this.redoStack : this.undoStack;
      h ? this.stopCapturing() : b || this.clear(!1, !0);
      const p = new Mi();
      d.afterState.forEach((y, C) => {
        const S = d.beforeState.get(C) || 0, x = y - S;
        x > 0 && ks(p, C, S, x);
      });
      const g = Oy();
      let _ = !1;
      if (this.lastChange > 0 && g - this.lastChange < this.captureTimeout && m.length > 0 && !h && !b) {
        const y = m[m.length - 1];
        y.deletions = Dc([y.deletions, d.deleteSet]), y.insertions = Dc([y.insertions, p]);
      } else
        m.push(new __(d.deleteSet, p)), _ = !0;
      !h && !b && (this.lastChange = g), Ii(
        d,
        d.deleteSet,
        /** @param {Item|GC} item */
        (y) => {
          y instanceof We && this.scope.some((C) => C === d.doc || co(
            /** @type {AbstractType<any>} */
            C,
            y
          )) && kd(y, !0);
        }
      );
      const k = [{ stackItem: m[m.length - 1], origin: d.origin, type: h ? "redo" : "undo", changedParentTypes: d.changedParentTypes }, this];
      _ ? this.emit("stack-item-added", k) : this.emit("stack-item-updated", k);
    }, this.destroy = this.destroy.bind(this), this.doc.on("afterTransaction", this.afterTransactionHandler), this.doc.on("destroy", this.destroy);
  }
  /**
   * Extend the scope.
   *
   * @param {Array<AbstractType<any> | Doc> | AbstractType<any> | Doc} ytypes
   */
  addToScope(e) {
    const n = new Set(this.scope);
    e = vi(e) ? e : [e], e.forEach((r) => {
      n.has(r) || (n.add(r), (r instanceof bt ? r.doc !== this.doc : r !== this.doc) && pp("[yjs#509] Not same Y.Doc"), this.scope.push(r));
    });
  }
  /**
   * @param {any} origin
   */
  addTrackedOrigin(e) {
    this.trackedOrigins.add(e);
  }
  /**
   * @param {any} origin
   */
  removeTrackedOrigin(e) {
    this.trackedOrigins.delete(e);
  }
  clear(e = !0, n = !0) {
    (e && this.canUndo() || n && this.canRedo()) && this.doc.transact((r) => {
      e && (this.undoStack.forEach((i) => Mh(r, this, i)), this.undoStack = []), n && (this.redoStack.forEach((i) => Mh(r, this, i)), this.redoStack = []), this.emit("stack-cleared", [{ undoStackCleared: e, redoStackCleared: n }]);
    });
  }
  /**
   * UndoManager merges Undo-StackItem if they are created within time-gap
   * smaller than `options.captureTimeout`. Call `um.stopCapturing()` so that the next
   * StackItem won't be merged.
   *
   *
   * @example
   *     // without stopCapturing
   *     ytext.insert(0, 'a')
   *     ytext.insert(1, 'b')
   *     um.undo()
   *     ytext.toString() // => '' (note that 'ab' was removed)
   *     // with stopCapturing
   *     ytext.insert(0, 'a')
   *     um.stopCapturing()
   *     ytext.insert(0, 'b')
   *     um.undo()
   *     ytext.toString() // => 'a' (note that only 'b' was removed)
   *
   */
  stopCapturing() {
    this.lastChange = 0;
  }
  /**
   * Undo last changes on type.
   *
   * @return {StackItem?} Returns StackItem if a change was applied
   */
  undo() {
    this.undoing = !0;
    let e;
    try {
      e = zh(this, this.undoStack, "undo");
    } finally {
      this.undoing = !1;
    }
    return e;
  }
  /**
   * Redo last undo operation.
   *
   * @return {StackItem?} Returns StackItem if a change was applied
   */
  redo() {
    this.redoing = !0;
    let e;
    try {
      e = zh(this, this.redoStack, "redo");
    } finally {
      this.redoing = !1;
    }
    return e;
  }
  /**
   * Are undo steps available?
   *
   * @return {boolean} `true` if undo is possible
   */
  canUndo() {
    return this.undoStack.length > 0;
  }
  /**
   * Are redo steps available?
   *
   * @return {boolean} `true` if redo is possible
   */
  canRedo() {
    return this.redoStack.length > 0;
  }
  destroy() {
    this.trackedOrigins.delete(this), this.doc.off("afterTransaction", this.afterTransactionHandler), this.doc.off("destroy", this.destroy), super.destroy();
  }
}
function* k_(t) {
  const e = Te(t.restDecoder);
  for (let n = 0; n < e; n++) {
    const r = Te(t.restDecoder), i = t.readClient();
    let s = Te(t.restDecoder);
    for (let a = 0; a < r; a++) {
      const l = t.readInfo();
      if (l === 10) {
        const d = Te(t.restDecoder);
        yield new Xt(Me(i, s), d), s += d;
      } else if ((So & l) !== 0) {
        const d = (l & ($n | Lt)) === 0, h = new We(
          Me(i, s),
          null,
          // left
          (l & Lt) === Lt ? t.readLeftID() : null,
          // origin
          null,
          // right
          (l & $n) === $n ? t.readRightID() : null,
          // right origin
          // @ts-ignore Force writing a string here.
          d ? t.readParentInfo() ? t.readString() : t.readLeftID() : null,
          // parent
          d && (l & ps) === ps ? t.readString() : null,
          // parentSub
          Yp(t, l)
          // item content
        );
        yield h, s += h.length;
      } else {
        const d = t.readLen();
        yield new Wt(Me(i, s), d), s += d;
      }
    }
  }
}
class pd {
  /**
   * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
   * @param {boolean} filterSkips
   */
  constructor(e, n) {
    this.gen = k_(e), this.curr = null, this.done = !1, this.filterSkips = n, this.next();
  }
  /**
   * @return {Item | GC | Skip |null}
   */
  next() {
    do
      this.curr = this.gen.next().value || null;
    while (this.filterSkips && this.curr !== null && this.curr.constructor === Xt);
    return this.curr;
  }
}
class gd {
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  constructor(e) {
    this.currClient = 0, this.startClock = 0, this.written = 0, this.encoder = e, this.clientStructs = [];
  }
}
const zp = (t) => uo(t, _p, Bs), v_ = (t, e) => {
  if (t.constructor === Wt) {
    const { client: n, clock: r } = t.id;
    return new Wt(Me(n, r + e), t.length - e);
  } else if (t.constructor === Xt) {
    const { client: n, clock: r } = t.id;
    return new Xt(Me(n, r + e), t.length - e);
  } else {
    const n = (
      /** @type {Item} */
      t
    ), { client: r, clock: i } = n.id;
    return new We(
      Me(r, i + e),
      null,
      Me(r, i + e - 1),
      null,
      n.rightOrigin,
      n.parent,
      n.parentSub,
      n.content.splice(e)
    );
  }
}, uo = (t, e = Si, n = Mr) => {
  if (t.length === 1)
    return t[0];
  const r = t.map((b) => new e(Bi(b)));
  let i = r.map((b) => new pd(b, !0)), s = null;
  const a = new n(), l = new gd(a);
  for (; i = i.filter((p) => p.curr !== null), i.sort(
    /** @type {function(any,any):number} */
    (p, g) => {
      if (p.curr.id.client === g.curr.id.client) {
        const _ = p.curr.id.clock - g.curr.id.clock;
        return _ === 0 ? p.curr.constructor === g.curr.constructor ? 0 : p.curr.constructor === Xt ? 1 : -1 : _;
      } else
        return g.curr.id.client - p.curr.id.client;
    }
  ), i.length !== 0; ) {
    const b = i[0], m = (
      /** @type {Item | GC} */
      b.curr.id.client
    );
    if (s !== null) {
      let p = (
        /** @type {Item | GC | null} */
        b.curr
      ), g = !1;
      for (; p !== null && p.id.clock + p.length <= s.struct.id.clock + s.struct.length && p.id.client >= s.struct.id.client; )
        p = b.next(), g = !0;
      if (p === null || // current decoder is empty
      p.id.client !== m || // check whether there is another decoder that has has updates from `firstClient`
      g && p.id.clock > s.struct.id.clock + s.struct.length)
        continue;
      if (m !== s.struct.id.client)
        ur(l, s.struct, s.offset), s = { struct: p, offset: 0 }, b.next();
      else if (s.struct.id.clock + s.struct.length < p.id.clock)
        if (s.struct.constructor === Xt)
          s.struct.length = p.id.clock + p.length - s.struct.id.clock;
        else {
          ur(l, s.struct, s.offset);
          const _ = p.id.clock - s.struct.id.clock - s.struct.length;
          s = { struct: new Xt(Me(m, s.struct.id.clock + s.struct.length), _), offset: 0 };
        }
      else {
        const _ = s.struct.id.clock + s.struct.length - p.id.clock;
        _ > 0 && (s.struct.constructor === Xt ? s.struct.length -= _ : p = v_(p, _)), s.struct.mergeWith(
          /** @type {any} */
          p
        ) || (ur(l, s.struct, s.offset), s = { struct: p, offset: 0 }, b.next());
      }
    } else
      s = { struct: (
        /** @type {Item | GC} */
        b.curr
      ), offset: 0 }, b.next();
    for (let p = b.curr; p !== null && p.id.client === m && p.id.clock === s.struct.id.clock + s.struct.length && p.constructor !== Xt; p = b.next())
      ur(l, s.struct, s.offset), s = { struct: p, offset: 0 };
  }
  s !== null && (ur(l, s.struct, s.offset), s = null), md(l);
  const d = r.map((b) => hd(b)), h = Dc(d);
  return zi(a, h), a.toUint8Array();
}, A_ = (t, e, n = Si, r = Mr) => {
  const i = Ip(e), s = new r(), a = new gd(s), l = new n(Bi(t)), d = new pd(l, !1);
  for (; d.curr; ) {
    const b = d.curr, m = b.id.client, p = i.get(m) || 0;
    if (d.curr.constructor === Xt) {
      d.next();
      continue;
    }
    if (b.id.clock + b.length > p)
      for (ur(a, b, Tr(p - b.id.clock, 0)), d.next(); d.curr && d.curr.id.client === m; )
        ur(a, d.curr, 0), d.next();
    else
      for (; d.curr && d.curr.id.client === m && d.curr.id.clock + d.curr.length <= p; )
        d.next();
  }
  md(a);
  const h = hd(l);
  return zi(s, h), s.toUint8Array();
}, Rp = (t) => {
  t.written > 0 && (t.clientStructs.push({ written: t.written, restEncoder: bn(t.encoder.restEncoder) }), t.encoder.restEncoder = Eo(), t.written = 0);
}, ur = (t, e, n) => {
  t.written > 0 && t.currClient !== e.id.client && Rp(t), t.written === 0 && (t.currClient = e.id.client, t.encoder.writeClient(e.id.client), Oe(t.encoder.restEncoder, e.id.clock + n)), e.write(t.encoder, n), t.written++;
}, md = (t) => {
  Rp(t);
  const e = t.encoder.restEncoder;
  Oe(e, t.clientStructs.length);
  for (let n = 0; n < t.clientStructs.length; n++) {
    const r = t.clientStructs[n];
    Oe(e, r.written), xo(e, r.restEncoder);
  }
}, C_ = (t, e, n, r) => {
  const i = new n(Bi(t)), s = new pd(i, !1), a = new r(), l = new gd(a);
  for (let h = s.curr; h !== null; h = s.next())
    ur(l, e(h), 0);
  md(l);
  const d = hd(i);
  return zi(a, d), a.toUint8Array();
}, I_ = (t) => C_(t, Wy, Si, Bs), Rh = "You must not compute changes after the event-handler fired.";
class Lo {
  /**
   * @param {T} target The changed type.
   * @param {Transaction} transaction
   */
  constructor(e, n) {
    this.target = e, this.currentTarget = e, this.transaction = n, this._changes = null, this._keys = null, this._delta = null, this._path = null;
  }
  /**
   * Computes the path from `y` to the changed type.
   *
   * @todo v14 should standardize on path: Array<{parent, index}> because that is easier to work with.
   *
   * The following property holds:
   * @example
   *   let type = y
   *   event.path.forEach(dir => {
   *     type = type.get(dir)
   *   })
   *   type === event.target // => true
   */
  get path() {
    return this._path || (this._path = S_(this.currentTarget, this.target));
  }
  /**
   * Check if a struct is deleted by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  deletes(e) {
    return Ds(this.transaction.deleteSet, e.id);
  }
  /**
   * @type {Map<string, { action: 'add' | 'update' | 'delete', oldValue: any }>}
   */
  get keys() {
    if (this._keys === null) {
      if (this.transaction.doc._transactionCleanups.length === 0)
        throw wn(Rh);
      const e = /* @__PURE__ */ new Map(), n = this.target;
      /** @type Set<string|null> */
      this.transaction.changed.get(n).forEach((i) => {
        if (i !== null) {
          const s = (
            /** @type {Item} */
            n._map.get(i)
          );
          let a, l;
          if (this.adds(s)) {
            let d = s.left;
            for (; d !== null && this.adds(d); )
              d = d.left;
            if (this.deletes(s))
              if (d !== null && this.deletes(d))
                a = "delete", l = tc(d.content.getContent());
              else
                return;
            else
              d !== null && this.deletes(d) ? (a = "update", l = tc(d.content.getContent())) : (a = "add", l = void 0);
          } else if (this.deletes(s))
            a = "delete", l = tc(
              /** @type {Item} */
              s.content.getContent()
            );
          else
            return;
          e.set(i, { action: a, oldValue: l });
        }
      }), this._keys = e;
    }
    return this._keys;
  }
  /**
   * This is a computed property. Note that this can only be safely computed during the
   * event call. Computing this property after other changes happened might result in
   * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
   * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
   *
   * @type {Array<{insert?: string | Array<any> | object | AbstractType<any>, retain?: number, delete?: number, attributes?: Object<string, any>}>}
   */
  get delta() {
    return this.changes.delta;
  }
  /**
   * Check if a struct is added by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  adds(e) {
    return e.id.clock >= (this.transaction.beforeState.get(e.id.client) || 0);
  }
  /**
   * This is a computed property. Note that this can only be safely computed during the
   * event call. Computing this property after other changes happened might result in
   * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
   * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
   *
   * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
   */
  get changes() {
    let e = this._changes;
    if (e === null) {
      if (this.transaction.doc._transactionCleanups.length === 0)
        throw wn(Rh);
      const n = this.target, r = ki(), i = ki(), s = [];
      if (e = {
        added: r,
        deleted: i,
        delta: s,
        keys: this.keys
      }, /** @type Set<string|null> */
      this.transaction.changed.get(n).has(null)) {
        let l = null;
        const d = () => {
          l && s.push(l);
        };
        for (let h = n._start; h !== null; h = h.right)
          h.deleted ? this.deletes(h) && !this.adds(h) && ((l === null || l.delete === void 0) && (d(), l = { delete: 0 }), l.delete += h.length, i.add(h)) : this.adds(h) ? ((l === null || l.insert === void 0) && (d(), l = { insert: [] }), l.insert = l.insert.concat(h.content.getContent()), r.add(h)) : ((l === null || l.retain === void 0) && (d(), l = { retain: 0 }), l.retain += h.length);
        l !== null && l.retain === void 0 && d();
      }
      this._changes = e;
    }
    return (
      /** @type {any} */
      e
    );
  }
}
const S_ = (t, e) => {
  const n = [];
  for (; e._item !== null && e !== t; ) {
    if (e._item.parentSub !== null)
      n.unshift(e._item.parentSub);
    else {
      let r = 0, i = (
        /** @type {AbstractType<any>} */
        e._item.parent._start
      );
      for (; i !== e._item && i !== null; )
        !i.deleted && i.countable && (r += i.length), i = i.right;
      n.unshift(r);
    }
    e = /** @type {AbstractType<any>} */
    e._item.parent;
  }
  return n;
}, vt = () => {
  pp("Invalid access: Add Yjs type to a document before reading data.");
}, Tp = 80;
let bd = 0;
class E_ {
  /**
   * @param {Item} p
   * @param {number} index
   */
  constructor(e, n) {
    e.marker = !0, this.p = e, this.index = n, this.timestamp = bd++;
  }
}
const x_ = (t) => {
  t.timestamp = bd++;
}, Fp = (t, e, n) => {
  t.p.marker = !1, t.p = e, e.marker = !0, t.index = n, t.timestamp = bd++;
}, N_ = (t, e, n) => {
  if (t.length >= Tp) {
    const r = t.reduce((i, s) => i.timestamp < s.timestamp ? i : s);
    return Fp(r, e, n), r;
  } else {
    const r = new E_(e, n);
    return t.push(r), r;
  }
}, Oo = (t, e) => {
  if (t._start === null || e === 0 || t._searchMarker === null)
    return null;
  const n = t._searchMarker.length === 0 ? null : t._searchMarker.reduce((s, a) => Qa(e - s.index) < Qa(e - a.index) ? s : a);
  let r = t._start, i = 0;
  for (n !== null && (r = n.p, i = n.index, x_(n)); r.right !== null && i < e; ) {
    if (!r.deleted && r.countable) {
      if (e < i + r.length)
        break;
      i += r.length;
    }
    r = r.right;
  }
  for (; r.left !== null && i > e; )
    r = r.left, !r.deleted && r.countable && (i -= r.length);
  for (; r.left !== null && r.left.id.client === r.id.client && r.left.id.clock + r.left.length === r.id.clock; )
    r = r.left, !r.deleted && r.countable && (i -= r.length);
  return n !== null && Qa(n.index - i) < /** @type {YText|YArray<any>} */
  r.parent.length / Tp ? (Fp(n, r, i), n) : N_(t._searchMarker, r, i);
}, vs = (t, e, n) => {
  for (let r = t.length - 1; r >= 0; r--) {
    const i = t[r];
    if (n > 0) {
      let s = i.p;
      for (s.marker = !1; s && (s.deleted || !s.countable); )
        s = s.left, s && !s.deleted && s.countable && (i.index -= s.length);
      if (s === null || s.marker === !0) {
        t.splice(r, 1);
        continue;
      }
      i.p = s, s.marker = !0;
    }
    (e < i.index || n > 0 && e === i.index) && (i.index = Tr(e, i.index + n));
  }
}, Uo = (t, e, n) => {
  const r = t, i = e.changedParentTypes;
  for (; yr(i, t, () => []).push(n), t._item !== null; )
    t = /** @type {AbstractType<any>} */
    t._item.parent;
  Ep(r._eH, n, e);
};
class bt {
  constructor() {
    this._item = null, this._map = /* @__PURE__ */ new Map(), this._start = null, this.doc = null, this._length = 0, this._eH = Eh(), this._dEH = Eh(), this._searchMarker = null;
  }
  /**
   * @return {AbstractType<any>|null}
   */
  get parent() {
    return this._item ? (
      /** @type {AbstractType<any>} */
      this._item.parent
    ) : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item|null} item
   */
  _integrate(e, n) {
    this.doc = e, this._item = n;
  }
  /**
   * @return {AbstractType<EventType>}
   */
  _copy() {
    throw an();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {AbstractType<EventType>}
   */
  clone() {
    throw an();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} _encoder
   */
  _write(e) {
  }
  /**
   * The first non-deleted item
   */
  get _first() {
    let e = this._start;
    for (; e !== null && e.deleted; )
      e = e.right;
    return e;
  }
  /**
   * Creates YEvent and calls all type observers.
   * Must be implemented by each type.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} _parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, n) {
    !e.local && this._searchMarker && (this._searchMarker.length = 0);
  }
  /**
   * Observe all events that are created on this type.
   *
   * @param {function(EventType, Transaction):void} f Observer function
   */
  observe(e) {
    xh(this._eH, e);
  }
  /**
   * Observe all events that are created by this type and its children.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  observeDeep(e) {
    xh(this._dEH, e);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(EventType,Transaction):void} f Observer function
   */
  unobserve(e) {
    Nh(this._eH, e);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  unobserveDeep(e) {
    Nh(this._dEH, e);
  }
  /**
   * @abstract
   * @return {any}
   */
  toJSON() {
  }
}
const Lp = (t, e, n) => {
  t.doc ?? vt(), e < 0 && (e = t._length + e), n < 0 && (n = t._length + n);
  let r = n - e;
  const i = [];
  let s = t._start;
  for (; s !== null && r > 0; ) {
    if (s.countable && !s.deleted) {
      const a = s.content.getContent();
      if (a.length <= e)
        e -= a.length;
      else {
        for (let l = e; l < a.length && r > 0; l++)
          i.push(a[l]), r--;
        e = 0;
      }
    }
    s = s.right;
  }
  return i;
}, Op = (t) => {
  t.doc ?? vt();
  const e = [];
  let n = t._start;
  for (; n !== null; ) {
    if (n.countable && !n.deleted) {
      const r = n.content.getContent();
      for (let i = 0; i < r.length; i++)
        e.push(r[i]);
    }
    n = n.right;
  }
  return e;
}, dC = (t, e) => {
  const n = [];
  let r = t._start;
  for (; r !== null; ) {
    if (r.countable && Dr(r, e)) {
      const i = r.content.getContent();
      for (let s = 0; s < i.length; s++)
        n.push(i[s]);
    }
    r = r.right;
  }
  return n;
}, As = (t, e) => {
  let n = 0, r = t._start;
  for (t.doc ?? vt(); r !== null; ) {
    if (r.countable && !r.deleted) {
      const i = r.content.getContent();
      for (let s = 0; s < i.length; s++)
        e(i[s], n++, t);
    }
    r = r.right;
  }
}, Up = (t, e) => {
  const n = [];
  return As(t, (r, i) => {
    n.push(e(r, i, t));
  }), n;
}, D_ = (t) => {
  let e = t._start, n = null, r = 0;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next: () => {
      if (n === null) {
        for (; e !== null && e.deleted; )
          e = e.right;
        if (e === null)
          return {
            done: !0,
            value: void 0
          };
        n = e.content.getContent(), r = 0, e = e.right;
      }
      const i = n[r++];
      return n.length <= r && (n = null), {
        done: !1,
        value: i
      };
    }
  };
}, $p = (t, e) => {
  t.doc ?? vt();
  const n = Oo(t, e);
  let r = t._start;
  for (n !== null && (r = n.p, e -= n.index); r !== null; r = r.right)
    if (!r.deleted && r.countable) {
      if (e < r.length)
        return r.content.getContent()[e];
      e -= r.length;
    }
}, ho = (t, e, n, r) => {
  let i = n;
  const s = t.doc, a = s.clientID, l = s.store, d = n === null ? e._start : n.right;
  let h = [];
  const b = () => {
    h.length > 0 && (i = new We(Me(a, at(l, a)), i, i && i.lastId, d, d && d.id, e, null, new Rr(h)), i.integrate(t, 0), h = []);
  };
  r.forEach((m) => {
    if (m === null)
      h.push(m);
    else
      switch (m.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
          h.push(m);
          break;
        default:
          switch (b(), m.constructor) {
            case Uint8Array:
            case ArrayBuffer:
              i = new We(Me(a, at(l, a)), i, i && i.lastId, d, d && d.id, e, null, new Ms(new Uint8Array(
                /** @type {Uint8Array} */
                m
              ))), i.integrate(t, 0);
              break;
            case Fr:
              i = new We(Me(a, at(l, a)), i, i && i.lastId, d, d && d.id, e, null, new zs(
                /** @type {Doc} */
                m
              )), i.integrate(t, 0);
              break;
            default:
              if (m instanceof bt)
                i = new We(Me(a, at(l, a)), i, i && i.lastId, d, d && d.id, e, null, new An(m)), i.integrate(t, 0);
              else
                throw new Error("Unexpected content type in insert operation");
          }
      }
  }), b();
}, Qp = () => wn("Length exceeded!"), jp = (t, e, n, r) => {
  if (n > e._length)
    throw Qp();
  if (n === 0)
    return e._searchMarker && vs(e._searchMarker, n, r.length), ho(t, e, null, r);
  const i = n, s = Oo(e, n);
  let a = e._start;
  for (s !== null && (a = s.p, n -= s.index, n === 0 && (a = a.prev, n += a && a.countable && !a.deleted ? a.length : 0)); a !== null; a = a.right)
    if (!a.deleted && a.countable) {
      if (n <= a.length) {
        n < a.length && Nt(t, Me(a.id.client, a.id.clock + n));
        break;
      }
      n -= a.length;
    }
  return e._searchMarker && vs(e._searchMarker, i, r.length), ho(t, e, a, r);
}, B_ = (t, e, n) => {
  let i = (e._searchMarker || []).reduce((s, a) => a.index > s.index ? a : s, { index: 0, p: e._start }).p;
  if (i)
    for (; i.right; )
      i = i.right;
  return ho(t, e, i, n);
}, qp = (t, e, n, r) => {
  if (r === 0)
    return;
  const i = n, s = r, a = Oo(e, n);
  let l = e._start;
  for (a !== null && (l = a.p, n -= a.index); l !== null && n > 0; l = l.right)
    !l.deleted && l.countable && (n < l.length && Nt(t, Me(l.id.client, l.id.clock + n)), n -= l.length);
  for (; r > 0 && l !== null; )
    l.deleted || (r < l.length && Nt(t, Me(l.id.client, l.id.clock + r)), l.delete(t), r -= l.length), l = l.right;
  if (r > 0)
    throw Qp();
  e._searchMarker && vs(
    e._searchMarker,
    i,
    -s + r
    /* in case we remove the above exception */
  );
}, fo = (t, e, n) => {
  const r = e._map.get(n);
  r !== void 0 && r.delete(t);
}, yd = (t, e, n, r) => {
  const i = e._map.get(n) || null, s = t.doc, a = s.clientID;
  let l;
  if (r == null)
    l = new Rr([r]);
  else
    switch (r.constructor) {
      case Number:
      case Object:
      case Boolean:
      case Array:
      case String:
      case Date:
      case BigInt:
        l = new Rr([r]);
        break;
      case Uint8Array:
        l = new Ms(
          /** @type {Uint8Array} */
          r
        );
        break;
      case Fr:
        l = new zs(
          /** @type {Doc} */
          r
        );
        break;
      default:
        if (r instanceof bt)
          l = new An(r);
        else
          throw new Error("Unexpected content type");
    }
  new We(Me(a, at(s.store, a)), i, i && i.lastId, null, null, e, n, l).integrate(t, 0);
}, wd = (t, e) => {
  t.doc ?? vt();
  const n = t._map.get(e);
  return n !== void 0 && !n.deleted ? n.content.getContent()[n.length - 1] : void 0;
}, Hp = (t) => {
  const e = {};
  return t.doc ?? vt(), t._map.forEach((n, r) => {
    n.deleted || (e[r] = n.content.getContent()[n.length - 1]);
  }), e;
}, Gp = (t, e) => {
  t.doc ?? vt();
  const n = t._map.get(e);
  return n !== void 0 && !n.deleted;
}, P_ = (t, e) => {
  const n = {};
  return t._map.forEach((r, i) => {
    let s = r;
    for (; s !== null && (!e.sv.has(s.id.client) || s.id.clock >= (e.sv.get(s.id.client) || 0)); )
      s = s.left;
    s !== null && Dr(s, e) && (n[i] = s.content.getContent()[s.length - 1]);
  }), n;
}, Na = (t) => (t.doc ?? vt(), Vw(
  t._map.entries(),
  /** @param {any} entry */
  (e) => !e[1].deleted
));
class M_ extends Lo {
}
class yi extends bt {
  constructor() {
    super(), this._prelimContent = [], this._searchMarker = [];
  }
  /**
   * Construct a new YArray containing the specified items.
   * @template {Object<string,any>|Array<any>|number|null|string|Uint8Array} T
   * @param {Array<T>} items
   * @return {YArray<T>}
   */
  static from(e) {
    const n = new yi();
    return n.push(e), n;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(e, n) {
    super._integrate(e, n), this.insert(
      0,
      /** @type {Array<any>} */
      this._prelimContent
    ), this._prelimContent = null;
  }
  /**
   * @return {YArray<T>}
   */
  _copy() {
    return new yi();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YArray<T>}
   */
  clone() {
    const e = new yi();
    return e.insert(0, this.toArray().map(
      (n) => n instanceof bt ? (
        /** @type {typeof el} */
        n.clone()
      ) : n
    )), e;
  }
  get length() {
    return this.doc ?? vt(), this._length;
  }
  /**
   * Creates YArrayEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, n) {
    super._callObserver(e, n), Uo(this, e, new M_(this, e));
  }
  /**
   * Inserts new content at an index.
   *
   * Important: This function expects an array of content. Not just a content
   * object. The reason for this "weirdness" is that inserting several elements
   * is very efficient when it is done as a single operation.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  yarray.insert(0, ['a'])
   *  // Insert numbers 1, 2 at position 1
   *  yarray.insert(1, [1, 2])
   *
   * @param {number} index The index to insert content at.
   * @param {Array<T>} content The array of content
   */
  insert(e, n) {
    this.doc !== null ? Ke(this.doc, (r) => {
      jp(
        r,
        this,
        e,
        /** @type {any} */
        n
      );
    }) : this._prelimContent.splice(e, 0, ...n);
  }
  /**
   * Appends content to this YArray.
   *
   * @param {Array<T>} content Array of content to append.
   *
   * @todo Use the following implementation in all types.
   */
  push(e) {
    this.doc !== null ? Ke(this.doc, (n) => {
      B_(
        n,
        this,
        /** @type {any} */
        e
      );
    }) : this._prelimContent.push(...e);
  }
  /**
   * Prepends content to this YArray.
   *
   * @param {Array<T>} content Array of content to prepend.
   */
  unshift(e) {
    this.insert(0, e);
  }
  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} length The number of elements to remove. Defaults to 1.
   */
  delete(e, n = 1) {
    this.doc !== null ? Ke(this.doc, (r) => {
      qp(r, this, e, n);
    }) : this._prelimContent.splice(e, n);
  }
  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {T}
   */
  get(e) {
    return $p(this, e);
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<T>}
   */
  toArray() {
    return Op(this);
  }
  /**
   * Returns a portion of this YArray into a JavaScript Array selected
   * from start to end (end not included).
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<T>}
   */
  slice(e = 0, n = this.length) {
    return Lp(this, e, n);
  }
  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Array<any>}
   */
  toJSON() {
    return this.map((e) => e instanceof bt ? e.toJSON() : e);
  }
  /**
   * Returns an Array with the result of calling a provided function on every
   * element of this YArray.
   *
   * @template M
   * @param {function(T,number,YArray<T>):M} f Function that produces an element of the new Array
   * @return {Array<M>} A new array with each element being the result of the
   *                 callback function
   */
  map(e) {
    return Up(
      this,
      /** @type {any} */
      e
    );
  }
  /**
   * Executes a provided function once on every element of this YArray.
   *
   * @param {function(T,number,YArray<T>):void} f A function to execute on every element of this YArray.
   */
  forEach(e) {
    As(this, e);
  }
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return D_(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef(ik);
  }
}
const z_ = (t) => new yi();
class R_ extends Lo {
  /**
   * @param {YMap<T>} ymap The YArray that changed.
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed.
   */
  constructor(e, n, r) {
    super(e, n), this.keysChanged = r;
  }
}
class Ei extends bt {
  /**
   *
   * @param {Iterable<readonly [string, any]>=} entries - an optional iterable to initialize the YMap
   */
  constructor(e) {
    super(), this._prelimContent = null, e === void 0 ? this._prelimContent = /* @__PURE__ */ new Map() : this._prelimContent = new Map(e);
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(e, n) {
    super._integrate(e, n), this._prelimContent.forEach((r, i) => {
      this.set(i, r);
    }), this._prelimContent = null;
  }
  /**
   * @return {YMap<MapType>}
   */
  _copy() {
    return new Ei();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YMap<MapType>}
   */
  clone() {
    const e = new Ei();
    return this.forEach((n, r) => {
      e.set(r, n instanceof bt ? (
        /** @type {typeof value} */
        n.clone()
      ) : n);
    }), e;
  }
  /**
   * Creates YMapEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, n) {
    Uo(this, e, new R_(this, e, n));
  }
  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Object<string,any>}
   */
  toJSON() {
    this.doc ?? vt();
    const e = {};
    return this._map.forEach((n, r) => {
      if (!n.deleted) {
        const i = n.content.getContent()[n.length - 1];
        e[r] = i instanceof bt ? i.toJSON() : i;
      }
    }), e;
  }
  /**
   * Returns the size of the YMap (count of key/value pairs)
   *
   * @return {number}
   */
  get size() {
    return [...Na(this)].length;
  }
  /**
   * Returns the keys for each element in the YMap Type.
   *
   * @return {IterableIterator<string>}
   */
  keys() {
    return lc(
      Na(this),
      /** @param {any} v */
      (e) => e[0]
    );
  }
  /**
   * Returns the values for each element in the YMap Type.
   *
   * @return {IterableIterator<MapType>}
   */
  values() {
    return lc(
      Na(this),
      /** @param {any} v */
      (e) => e[1].content.getContent()[e[1].length - 1]
    );
  }
  /**
   * Returns an Iterator of [key, value] pairs
   *
   * @return {IterableIterator<[string, MapType]>}
   */
  entries() {
    return lc(
      Na(this),
      /** @param {any} v */
      (e) => (
        /** @type {any} */
        [e[0], e[1].content.getContent()[e[1].length - 1]]
      )
    );
  }
  /**
   * Executes a provided function on once on every key-value pair.
   *
   * @param {function(MapType,string,YMap<MapType>):void} f A function to execute on every element of this YArray.
   */
  forEach(e) {
    this.doc ?? vt(), this._map.forEach((n, r) => {
      n.deleted || e(n.content.getContent()[n.length - 1], r, this);
    });
  }
  /**
   * Returns an Iterator of [key, value] pairs
   *
   * @return {IterableIterator<[string, MapType]>}
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * Remove a specified element from this YMap.
   *
   * @param {string} key The key of the element to remove.
   */
  delete(e) {
    this.doc !== null ? Ke(this.doc, (n) => {
      fo(n, this, e);
    }) : this._prelimContent.delete(e);
  }
  /**
   * Adds or updates an element with a specified key and value.
   * @template {MapType} VAL
   *
   * @param {string} key The key of the element to add to this YMap
   * @param {VAL} value The value of the element to add
   * @return {VAL}
   */
  set(e, n) {
    return this.doc !== null ? Ke(this.doc, (r) => {
      yd(
        r,
        this,
        e,
        /** @type {any} */
        n
      );
    }) : this._prelimContent.set(e, n), n;
  }
  /**
   * Returns a specified element from this YMap.
   *
   * @param {string} key
   * @return {MapType|undefined}
   */
  get(e) {
    return (
      /** @type {any} */
      wd(this, e)
    );
  }
  /**
   * Returns a boolean indicating whether the specified key exists or not.
   *
   * @param {string} key The key to test.
   * @return {boolean}
   */
  has(e) {
    return Gp(this, e);
  }
  /**
   * Removes all elements from this YMap.
   */
  clear() {
    this.doc !== null ? Ke(this.doc, (e) => {
      this.forEach(function(n, r, i) {
        fo(e, i, r);
      });
    }) : this._prelimContent.clear();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef(sk);
  }
}
const T_ = (t) => new Ei(), hr = (t, e) => t === e || typeof t == "object" && typeof e == "object" && t && e && Vy(t, e);
class Mc {
  /**
   * @param {Item|null} left
   * @param {Item|null} right
   * @param {number} index
   * @param {Map<string,any>} currentAttributes
   */
  constructor(e, n, r, i) {
    this.left = e, this.right = n, this.index = r, this.currentAttributes = i;
  }
  /**
   * Only call this if you know that this.right is defined
   */
  forward() {
    this.right === null && Ot(), this.right.content.constructor === ht ? this.right.deleted || Ri(
      this.currentAttributes,
      /** @type {ContentFormat} */
      this.right.content
    ) : this.right.deleted || (this.index += this.right.length), this.left = this.right, this.right = this.right.right;
  }
}
const Th = (t, e, n) => {
  for (; e.right !== null && n > 0; )
    e.right.content.constructor === ht ? e.right.deleted || Ri(
      e.currentAttributes,
      /** @type {ContentFormat} */
      e.right.content
    ) : e.right.deleted || (n < e.right.length && Nt(t, Me(e.right.id.client, e.right.id.clock + n)), e.index += e.right.length, n -= e.right.length), e.left = e.right, e.right = e.right.right;
  return e;
}, Da = (t, e, n, r) => {
  const i = /* @__PURE__ */ new Map(), s = r ? Oo(e, n) : null;
  if (s) {
    const a = new Mc(s.p.left, s.p, s.index, i);
    return Th(t, a, n - s.index);
  } else {
    const a = new Mc(null, e._start, 0, i);
    return Th(t, a, n);
  }
}, Jp = (t, e, n, r) => {
  for (; n.right !== null && (n.right.deleted === !0 || n.right.content.constructor === ht && hr(
    r.get(
      /** @type {ContentFormat} */
      n.right.content.key
    ),
    /** @type {ContentFormat} */
    n.right.content.value
  )); )
    n.right.deleted || r.delete(
      /** @type {ContentFormat} */
      n.right.content.key
    ), n.forward();
  const i = t.doc, s = i.clientID;
  r.forEach((a, l) => {
    const d = n.left, h = n.right, b = new We(Me(s, at(i.store, s)), d, d && d.lastId, h, h && h.id, e, null, new ht(l, a));
    b.integrate(t, 0), n.right = b, n.forward();
  });
}, Ri = (t, e) => {
  const { key: n, value: r } = e;
  r === null ? t.delete(n) : t.set(n, r);
}, Vp = (t, e) => {
  for (; t.right !== null; ) {
    if (!(t.right.deleted || t.right.content.constructor === ht && hr(
      e[
        /** @type {ContentFormat} */
        t.right.content.key
      ] ?? null,
      /** @type {ContentFormat} */
      t.right.content.value
    ))) break;
    t.forward();
  }
}, Kp = (t, e, n, r) => {
  const i = t.doc, s = i.clientID, a = /* @__PURE__ */ new Map();
  for (const l in r) {
    const d = r[l], h = n.currentAttributes.get(l) ?? null;
    if (!hr(h, d)) {
      a.set(l, h);
      const { left: b, right: m } = n;
      n.right = new We(Me(s, at(i.store, s)), b, b && b.lastId, m, m && m.id, e, null, new ht(l, d)), n.right.integrate(t, 0), n.forward();
    }
  }
  return a;
}, cc = (t, e, n, r, i) => {
  n.currentAttributes.forEach((p, g) => {
    i[g] === void 0 && (i[g] = null);
  });
  const s = t.doc, a = s.clientID;
  Vp(n, i);
  const l = Kp(t, e, n, i), d = r.constructor === String ? new kn(
    /** @type {string} */
    r
  ) : r instanceof bt ? new An(r) : new Lr(r);
  let { left: h, right: b, index: m } = n;
  e._searchMarker && vs(e._searchMarker, n.index, d.getLength()), b = new We(Me(a, at(s.store, a)), h, h && h.lastId, b, b && b.id, e, null, d), b.integrate(t, 0), n.right = b, n.index = m, n.forward(), Jp(t, e, n, l);
}, Fh = (t, e, n, r, i) => {
  const s = t.doc, a = s.clientID;
  Vp(n, i);
  const l = Kp(t, e, n, i);
  e: for (; n.right !== null && (r > 0 || l.size > 0 && (n.right.deleted || n.right.content.constructor === ht)); ) {
    if (!n.right.deleted)
      switch (n.right.content.constructor) {
        case ht: {
          const { key: d, value: h } = (
            /** @type {ContentFormat} */
            n.right.content
          ), b = i[d];
          if (b !== void 0) {
            if (hr(b, h))
              l.delete(d);
            else {
              if (r === 0)
                break e;
              l.set(d, h);
            }
            n.right.delete(t);
          } else
            n.currentAttributes.set(d, h);
          break;
        }
        default:
          r < n.right.length && Nt(t, Me(n.right.id.client, n.right.id.clock + r)), r -= n.right.length;
          break;
      }
    n.forward();
  }
  if (r > 0) {
    let d = "";
    for (; r > 0; r--)
      d += `
`;
    n.right = new We(Me(a, at(s.store, a)), n.left, n.left && n.left.lastId, n.right, n.right && n.right.id, e, null, new kn(d)), n.right.integrate(t, 0), n.forward();
  }
  Jp(t, e, n, l);
}, Wp = (t, e, n, r, i) => {
  let s = e;
  const a = sn();
  for (; s && (!s.countable || s.deleted); ) {
    if (!s.deleted && s.content.constructor === ht) {
      const h = (
        /** @type {ContentFormat} */
        s.content
      );
      a.set(h.key, h);
    }
    s = s.right;
  }
  let l = 0, d = !1;
  for (; e !== s; ) {
    if (n === e && (d = !0), !e.deleted) {
      const h = e.content;
      if (h.constructor === ht) {
        const { key: b, value: m } = (
          /** @type {ContentFormat} */
          h
        ), p = r.get(b) ?? null;
        (a.get(b) !== h || p === m) && (e.delete(t), l++, !d && (i.get(b) ?? null) === m && p !== m && (p === null ? i.delete(b) : i.set(b, p))), !d && !e.deleted && Ri(
          i,
          /** @type {ContentFormat} */
          h
        );
      }
    }
    e = /** @type {Item} */
    e.right;
  }
  return l;
}, F_ = (t, e) => {
  for (; e && e.right && (e.right.deleted || !e.right.countable); )
    e = e.right;
  const n = /* @__PURE__ */ new Set();
  for (; e && (e.deleted || !e.countable); ) {
    if (!e.deleted && e.content.constructor === ht) {
      const r = (
        /** @type {ContentFormat} */
        e.content.key
      );
      n.has(r) ? e.delete(t) : n.add(r);
    }
    e = e.left;
  }
}, L_ = (t) => {
  let e = 0;
  return Ke(
    /** @type {Doc} */
    t.doc,
    (n) => {
      let r = (
        /** @type {Item} */
        t._start
      ), i = t._start, s = sn();
      const a = Cc(s);
      for (; i; )
        i.deleted === !1 && (i.content.constructor === ht ? Ri(
          a,
          /** @type {ContentFormat} */
          i.content
        ) : (e += Wp(n, r, i, s, a), s = Cc(a), r = i)), i = i.right;
    }
  ), e;
}, O_ = (t) => {
  const e = /* @__PURE__ */ new Set(), n = t.doc;
  for (const [r, i] of t.afterState.entries()) {
    const s = t.beforeState.get(r) || 0;
    i !== s && Pp(
      t,
      /** @type {Array<Item|GC>} */
      n.store.clients.get(r),
      s,
      i,
      (a) => {
        !a.deleted && /** @type {Item} */
        a.content.constructor === ht && a.constructor !== Wt && e.add(
          /** @type {any} */
          a.parent
        );
      }
    );
  }
  Ke(n, (r) => {
    Ii(t, t.deleteSet, (i) => {
      if (i instanceof Wt || !/** @type {YText} */
      i.parent._hasFormatting || e.has(
        /** @type {YText} */
        i.parent
      ))
        return;
      const s = (
        /** @type {YText} */
        i.parent
      );
      i.content.constructor === ht ? e.add(s) : F_(r, i);
    });
    for (const i of e)
      L_(i);
  });
}, Lh = (t, e, n) => {
  const r = n, i = Cc(e.currentAttributes), s = e.right;
  for (; n > 0 && e.right !== null; ) {
    if (e.right.deleted === !1)
      switch (e.right.content.constructor) {
        case An:
        case Lr:
        case kn:
          n < e.right.length && Nt(t, Me(e.right.id.client, e.right.id.clock + n)), n -= e.right.length, e.right.delete(t);
          break;
      }
    e.forward();
  }
  s && Wp(t, s, e.right, i, e.currentAttributes);
  const a = (
    /** @type {AbstractType<any>} */
    /** @type {Item} */
    (e.left || e.right).parent
  );
  return a._searchMarker && vs(a._searchMarker, e.index, -r + n), e;
};
class U_ extends Lo {
  /**
   * @param {YText} ytext
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed
   */
  constructor(e, n, r) {
    super(e, n), this.childListChanged = !1, this.keysChanged = /* @__PURE__ */ new Set(), r.forEach((i) => {
      i === null ? this.childListChanged = !0 : this.keysChanged.add(i);
    });
  }
  /**
   * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
   */
  get changes() {
    if (this._changes === null) {
      const e = {
        keys: this.keys,
        delta: this.delta,
        added: /* @__PURE__ */ new Set(),
        deleted: /* @__PURE__ */ new Set()
      };
      this._changes = e;
    }
    return (
      /** @type {any} */
      this._changes
    );
  }
  /**
   * Compute the changes in the delta format.
   * A {@link https://quilljs.com/docs/delta/|Quill Delta}) that represents the changes on the document.
   *
   * @type {Array<{insert?:string|object|AbstractType<any>, delete?:number, retain?:number, attributes?: Object<string,any>}>}
   *
   * @public
   */
  get delta() {
    if (this._delta === null) {
      const e = (
        /** @type {Doc} */
        this.target.doc
      ), n = [];
      Ke(e, (r) => {
        const i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
        let a = this.target._start, l = null;
        const d = {};
        let h = "", b = 0, m = 0;
        const p = () => {
          if (l !== null) {
            let g = null;
            switch (l) {
              case "delete":
                m > 0 && (g = { delete: m }), m = 0;
                break;
              case "insert":
                (typeof h == "object" || h.length > 0) && (g = { insert: h }, i.size > 0 && (g.attributes = {}, i.forEach((_, k) => {
                  _ !== null && (g.attributes[k] = _);
                }))), h = "";
                break;
              case "retain":
                b > 0 && (g = { retain: b }, Jy(d) || (g.attributes = qy({}, d))), b = 0;
                break;
            }
            g && n.push(g), l = null;
          }
        };
        for (; a !== null; ) {
          switch (a.content.constructor) {
            case An:
            case Lr:
              this.adds(a) ? this.deletes(a) || (p(), l = "insert", h = a.content.getContent()[0], p()) : this.deletes(a) ? (l !== "delete" && (p(), l = "delete"), m += 1) : a.deleted || (l !== "retain" && (p(), l = "retain"), b += 1);
              break;
            case kn:
              this.adds(a) ? this.deletes(a) || (l !== "insert" && (p(), l = "insert"), h += /** @type {ContentString} */
              a.content.str) : this.deletes(a) ? (l !== "delete" && (p(), l = "delete"), m += a.length) : a.deleted || (l !== "retain" && (p(), l = "retain"), b += a.length);
              break;
            case ht: {
              const { key: g, value: _ } = (
                /** @type {ContentFormat} */
                a.content
              );
              if (this.adds(a)) {
                if (!this.deletes(a)) {
                  const k = i.get(g) ?? null;
                  hr(k, _) ? _ !== null && a.delete(r) : (l === "retain" && p(), hr(_, s.get(g) ?? null) ? delete d[g] : d[g] = _);
                }
              } else if (this.deletes(a)) {
                s.set(g, _);
                const k = i.get(g) ?? null;
                hr(k, _) || (l === "retain" && p(), d[g] = k);
              } else if (!a.deleted) {
                s.set(g, _);
                const k = d[g];
                k !== void 0 && (hr(k, _) ? k !== null && a.delete(r) : (l === "retain" && p(), _ === null ? delete d[g] : d[g] = _));
              }
              a.deleted || (l === "insert" && p(), Ri(
                i,
                /** @type {ContentFormat} */
                a.content
              ));
              break;
            }
          }
          a = a.right;
        }
        for (p(); n.length > 0; ) {
          const g = n[n.length - 1];
          if (g.retain !== void 0 && g.attributes === void 0)
            n.pop();
          else
            break;
        }
      }), this._delta = n;
    }
    return (
      /** @type {any} */
      this._delta
    );
  }
}
class xi extends bt {
  /**
   * @param {String} [string] The initial value of the YText.
   */
  constructor(e) {
    super(), this._pending = e !== void 0 ? [() => this.insert(0, e)] : [], this._searchMarker = [], this._hasFormatting = !1;
  }
  /**
   * Number of characters of this text type.
   *
   * @type {number}
   */
  get length() {
    return this.doc ?? vt(), this._length;
  }
  /**
   * @param {Doc} y
   * @param {Item} item
   */
  _integrate(e, n) {
    super._integrate(e, n);
    try {
      this._pending.forEach((r) => r());
    } catch (r) {
      console.error(r);
    }
    this._pending = null;
  }
  _copy() {
    return new xi();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YText}
   */
  clone() {
    const e = new xi();
    return e.applyDelta(this.toDelta()), e;
  }
  /**
   * Creates YTextEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, n) {
    super._callObserver(e, n);
    const r = new U_(this, e, n);
    Uo(this, e, r), !e.local && this._hasFormatting && (e._needFormattingCleanup = !0);
  }
  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @public
   */
  toString() {
    this.doc ?? vt();
    let e = "", n = this._start;
    for (; n !== null; )
      !n.deleted && n.countable && n.content.constructor === kn && (e += /** @type {ContentString} */
      n.content.str), n = n.right;
    return e;
  }
  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @return {string}
   * @public
   */
  toJSON() {
    return this.toString();
  }
  /**
   * Apply a {@link Delta} on this shared YText type.
   *
   * @param {Array<any>} delta The changes to apply on this element.
   * @param {object}  opts
   * @param {boolean} [opts.sanitize] Sanitize input delta. Removes ending newlines if set to true.
   *
   *
   * @public
   */
  applyDelta(e, { sanitize: n = !0 } = {}) {
    this.doc !== null ? Ke(this.doc, (r) => {
      const i = new Mc(null, this._start, 0, /* @__PURE__ */ new Map());
      for (let s = 0; s < e.length; s++) {
        const a = e[s];
        if (a.insert !== void 0) {
          const l = !n && typeof a.insert == "string" && s === e.length - 1 && i.right === null && a.insert.slice(-1) === `
` ? a.insert.slice(0, -1) : a.insert;
          (typeof l != "string" || l.length > 0) && cc(r, this, i, l, a.attributes || {});
        } else a.retain !== void 0 ? Fh(r, this, i, a.retain, a.attributes || {}) : a.delete !== void 0 && Lh(r, i, a.delete);
      }
    }) : this._pending.push(() => this.applyDelta(e));
  }
  /**
   * Returns the Delta representation of this YText type.
   *
   * @param {Snapshot} [snapshot]
   * @param {Snapshot} [prevSnapshot]
   * @param {function('removed' | 'added', ID):any} [computeYChange]
   * @return {any} The Delta representation of this type.
   *
   * @public
   */
  toDelta(e, n, r) {
    this.doc ?? vt();
    const i = [], s = /* @__PURE__ */ new Map(), a = (
      /** @type {Doc} */
      this.doc
    );
    let l = "", d = this._start;
    function h() {
      if (l.length > 0) {
        const m = {};
        let p = !1;
        s.forEach((_, k) => {
          p = !0, m[k] = _;
        });
        const g = { insert: l };
        p && (g.attributes = m), i.push(g), l = "";
      }
    }
    const b = () => {
      for (; d !== null; ) {
        if (Dr(d, e) || n !== void 0 && Dr(d, n))
          switch (d.content.constructor) {
            case kn: {
              const m = s.get("ychange");
              e !== void 0 && !Dr(d, e) ? (m === void 0 || m.user !== d.id.client || m.type !== "removed") && (h(), s.set("ychange", r ? r("removed", d.id) : { type: "removed" })) : n !== void 0 && !Dr(d, n) ? (m === void 0 || m.user !== d.id.client || m.type !== "added") && (h(), s.set("ychange", r ? r("added", d.id) : { type: "added" })) : m !== void 0 && (h(), s.delete("ychange")), l += /** @type {ContentString} */
              d.content.str;
              break;
            }
            case An:
            case Lr: {
              h();
              const m = {
                insert: d.content.getContent()[0]
              };
              if (s.size > 0) {
                const p = (
                  /** @type {Object<string,any>} */
                  {}
                );
                m.attributes = p, s.forEach((g, _) => {
                  p[_] = g;
                });
              }
              i.push(m);
              break;
            }
            case ht:
              Dr(d, e) && (h(), Ri(
                s,
                /** @type {ContentFormat} */
                d.content
              ));
              break;
          }
        d = d.right;
      }
      h();
    };
    return e || n ? Ke(a, (m) => {
      e && Bc(m, e), n && Bc(m, n), b();
    }, "cleanup") : b(), i;
  }
  /**
   * Insert text at a given index.
   *
   * @param {number} index The index at which to start inserting.
   * @param {String} text The text to insert at the specified position.
   * @param {TextAttributes} [attributes] Optionally define some formatting
   *                                    information to apply on the inserted
   *                                    Text.
   * @public
   */
  insert(e, n, r) {
    if (n.length <= 0)
      return;
    const i = this.doc;
    i !== null ? Ke(i, (s) => {
      const a = Da(s, this, e, !r);
      r || (r = {}, a.currentAttributes.forEach((l, d) => {
        r[d] = l;
      })), cc(s, this, a, n, r);
    }) : this._pending.push(() => this.insert(e, n, r));
  }
  /**
   * Inserts an embed at a index.
   *
   * @param {number} index The index to insert the embed at.
   * @param {Object | AbstractType<any>} embed The Object that represents the embed.
   * @param {TextAttributes} [attributes] Attribute information to apply on the
   *                                    embed
   *
   * @public
   */
  insertEmbed(e, n, r) {
    const i = this.doc;
    i !== null ? Ke(i, (s) => {
      const a = Da(s, this, e, !r);
      cc(s, this, a, n, r || {});
    }) : this._pending.push(() => this.insertEmbed(e, n, r || {}));
  }
  /**
   * Deletes text starting from an index.
   *
   * @param {number} index Index at which to start deleting.
   * @param {number} length The number of characters to remove. Defaults to 1.
   *
   * @public
   */
  delete(e, n) {
    if (n === 0)
      return;
    const r = this.doc;
    r !== null ? Ke(r, (i) => {
      Lh(i, Da(i, this, e, !0), n);
    }) : this._pending.push(() => this.delete(e, n));
  }
  /**
   * Assigns properties to a range of text.
   *
   * @param {number} index The position where to start formatting.
   * @param {number} length The amount of characters to assign properties to.
   * @param {TextAttributes} attributes Attribute information to apply on the
   *                                    text.
   *
   * @public
   */
  format(e, n, r) {
    if (n === 0)
      return;
    const i = this.doc;
    i !== null ? Ke(i, (s) => {
      const a = Da(s, this, e, !1);
      a.right !== null && Fh(s, this, a, n, r);
    }) : this._pending.push(() => this.format(e, n, r));
  }
  /**
   * Removes an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute(e) {
    this.doc !== null ? Ke(this.doc, (n) => {
      fo(n, this, e);
    }) : this._pending.push(() => this.removeAttribute(e));
  }
  /**
   * Sets or updates an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be set.
   * @param {any} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute(e, n) {
    this.doc !== null ? Ke(this.doc, (r) => {
      yd(r, this, e, n);
    }) : this._pending.push(() => this.setAttribute(e, n));
  }
  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {any} The queried attribute value.
   *
   * @public
   */
  getAttribute(e) {
    return (
      /** @type {any} */
      wd(this, e)
    );
  }
  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @return {Object<string, any>} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes() {
    return Hp(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef(ak);
  }
}
const $_ = (t) => new xi();
class dc {
  /**
   * @param {YXmlFragment | YXmlElement} root
   * @param {function(AbstractType<any>):boolean} [f]
   */
  constructor(e, n = () => !0) {
    this._filter = n, this._root = e, this._currentNode = /** @type {Item} */
    e._start, this._firstCall = !0, e.doc ?? vt();
  }
  [Symbol.iterator]() {
    return this;
  }
  /**
   * Get the next node.
   *
   * @return {IteratorResult<YXmlElement|YXmlText|YXmlHook>} The next node.
   *
   * @public
   */
  next() {
    let e = this._currentNode, n = e && e.content && /** @type {any} */
    e.content.type;
    if (e !== null && (!this._firstCall || e.deleted || !this._filter(n)))
      do
        if (n = /** @type {any} */
        e.content.type, !e.deleted && (n.constructor === Ni || n.constructor === zr) && n._start !== null)
          e = n._start;
        else
          for (; e !== null; ) {
            const r = e.next;
            if (r !== null) {
              e = r;
              break;
            } else e.parent === this._root ? e = null : e = /** @type {AbstractType<any>} */
            e.parent._item;
          }
      while (e !== null && (e.deleted || !this._filter(
        /** @type {ContentType} */
        e.content.type
      )));
    return this._firstCall = !1, e === null ? { value: void 0, done: !0 } : (this._currentNode = e, { value: (
      /** @type {any} */
      e.content.type
    ), done: !1 });
  }
}
class zr extends bt {
  constructor() {
    super(), this._prelimContent = [];
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get firstChild() {
    const e = this._first;
    return e ? e.content.getContent()[0] : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(e, n) {
    super._integrate(e, n), this.insert(
      0,
      /** @type {Array<any>} */
      this._prelimContent
    ), this._prelimContent = null;
  }
  _copy() {
    return new zr();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlFragment}
   */
  clone() {
    const e = new zr();
    return e.insert(0, this.toArray().map((n) => n instanceof bt ? n.clone() : n)), e;
  }
  get length() {
    return this.doc ?? vt(), this._prelimContent === null ? this._length : this._prelimContent.length;
  }
  /**
   * Create a subtree of childNodes.
   *
   * @example
   * const walker = elem.createTreeWalker(dom => dom.nodeName === 'div')
   * for (let node in walker) {
   *   // `node` is a div node
   *   nop(node)
   * }
   *
   * @param {function(AbstractType<any>):boolean} filter Function that is called on each child element and
   *                          returns a Boolean indicating whether the child
   *                          is to be included in the subtree.
   * @return {YXmlTreeWalker} A subtree and a position within it.
   *
   * @public
   */
  createTreeWalker(e) {
    return new dc(this, e);
  }
  /**
   * Returns the first YXmlElement that matches the query.
   * Similar to DOM's {@link querySelector}.
   *
   * Query support:
   *   - tagname
   * TODO:
   *   - id
   *   - attribute
   *
   * @param {CSS_Selector} query The query on the children.
   * @return {YXmlElement|YXmlText|YXmlHook|null} The first element that matches the query or null.
   *
   * @public
   */
  querySelector(e) {
    e = e.toUpperCase();
    const r = new dc(this, (i) => i.nodeName && i.nodeName.toUpperCase() === e).next();
    return r.done ? null : r.value;
  }
  /**
   * Returns all YXmlElements that match the query.
   * Similar to Dom's {@link querySelectorAll}.
   *
   * @todo Does not yet support all queries. Currently only query by tagName.
   *
   * @param {CSS_Selector} query The query on the children
   * @return {Array<YXmlElement|YXmlText|YXmlHook|null>} The elements that match this query.
   *
   * @public
   */
  querySelectorAll(e) {
    return e = e.toUpperCase(), br(new dc(this, (n) => n.nodeName && n.nodeName.toUpperCase() === e));
  }
  /**
   * Creates YXmlEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, n) {
    Uo(this, e, new q_(this, n, e));
  }
  /**
   * Get the string representation of all the children of this YXmlFragment.
   *
   * @return {string} The string representation of all children.
   */
  toString() {
    return Up(this, (e) => e.toString()).join("");
  }
  /**
   * @return {string}
   */
  toJSON() {
    return this.toString();
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(e = document, n = {}, r) {
    const i = e.createDocumentFragment();
    return r !== void 0 && r._createAssociation(i, this), As(this, (s) => {
      i.insertBefore(s.toDOM(e, n, r), null);
    }), i;
  }
  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {number} index The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insert(e, n) {
    this.doc !== null ? Ke(this.doc, (r) => {
      jp(r, this, e, n);
    }) : this._prelimContent.splice(e, 0, ...n);
  }
  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {null|Item|YXmlElement|YXmlText} ref The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insertAfter(e, n) {
    if (this.doc !== null)
      Ke(this.doc, (r) => {
        const i = e && e instanceof bt ? e._item : e;
        ho(r, this, i, n);
      });
    else {
      const r = (
        /** @type {Array<any>} */
        this._prelimContent
      ), i = e === null ? 0 : r.findIndex((s) => s === e) + 1;
      if (i === 0 && e !== null)
        throw wn("Reference item not found");
      r.splice(i, 0, ...n);
    }
  }
  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} [length=1] The number of elements to remove. Defaults to 1.
   */
  delete(e, n = 1) {
    this.doc !== null ? Ke(this.doc, (r) => {
      qp(r, this, e, n);
    }) : this._prelimContent.splice(e, n);
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<YXmlElement|YXmlText|YXmlHook>}
   */
  toArray() {
    return Op(this);
  }
  /**
   * Appends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to append.
   */
  push(e) {
    this.insert(this.length, e);
  }
  /**
   * Prepends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to prepend.
   */
  unshift(e) {
    this.insert(0, e);
  }
  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {YXmlElement|YXmlText}
   */
  get(e) {
    return $p(this, e);
  }
  /**
   * Returns a portion of this YXmlFragment into a JavaScript Array selected
   * from start to end (end not included).
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<YXmlElement|YXmlText>}
   */
  slice(e = 0, n = this.length) {
    return Lp(this, e, n);
  }
  /**
   * Executes a provided function on once on every child element.
   *
   * @param {function(YXmlElement|YXmlText,number, typeof self):void} f A function to execute on every element of this YArray.
   */
  forEach(e) {
    As(this, e);
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(e) {
    e.writeTypeRef(lk);
  }
}
const Q_ = (t) => new zr();
class Ni extends zr {
  constructor(e = "UNDEFINED") {
    super(), this.nodeName = e, this._prelimAttrs = /* @__PURE__ */ new Map();
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling() {
    const e = this._item ? this._item.next : null;
    return e ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      e.content.type
    ) : null;
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling() {
    const e = this._item ? this._item.prev : null;
    return e ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      e.content.type
    ) : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(e, n) {
    super._integrate(e, n), /** @type {Map<string, any>} */
    this._prelimAttrs.forEach((r, i) => {
      this.setAttribute(i, r);
    }), this._prelimAttrs = null;
  }
  /**
   * Creates an Item with the same effect as this Item (without position effect)
   *
   * @return {YXmlElement}
   */
  _copy() {
    return new Ni(this.nodeName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlElement<KV>}
   */
  clone() {
    const e = new Ni(this.nodeName), n = this.getAttributes();
    return Gy(n, (r, i) => {
      e.setAttribute(
        i,
        /** @type {any} */
        r
      );
    }), e.insert(0, this.toArray().map((r) => r instanceof bt ? r.clone() : r)), e;
  }
  /**
   * Returns the XML serialization of this YXmlElement.
   * The attributes are ordered by attribute-name, so you can easily use this
   * method to compare YXmlElements
   *
   * @return {string} The string representation of this type.
   *
   * @public
   */
  toString() {
    const e = this.getAttributes(), n = [], r = [];
    for (const l in e)
      r.push(l);
    r.sort();
    const i = r.length;
    for (let l = 0; l < i; l++) {
      const d = r[l];
      n.push(d + '="' + e[d] + '"');
    }
    const s = this.nodeName.toLocaleLowerCase(), a = n.length > 0 ? " " + n.join(" ") : "";
    return `<${s}${a}>${super.toString()}</${s}>`;
  }
  /**
   * Removes an attribute from this YXmlElement.
   *
   * @param {string} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute(e) {
    this.doc !== null ? Ke(this.doc, (n) => {
      fo(n, this, e);
    }) : this._prelimAttrs.delete(e);
  }
  /**
   * Sets or updates an attribute.
   *
   * @template {keyof KV & string} KEY
   *
   * @param {KEY} attributeName The attribute name that is to be set.
   * @param {KV[KEY]} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute(e, n) {
    this.doc !== null ? Ke(this.doc, (r) => {
      yd(r, this, e, n);
    }) : this._prelimAttrs.set(e, n);
  }
  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @template {keyof KV & string} KEY
   *
   * @param {KEY} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {KV[KEY]|undefined} The queried attribute value.
   *
   * @public
   */
  getAttribute(e) {
    return (
      /** @type {any} */
      wd(this, e)
    );
  }
  /**
   * Returns whether an attribute exists
   *
   * @param {string} attributeName The attribute name to check for existence.
   * @return {boolean} whether the attribute exists.
   *
   * @public
   */
  hasAttribute(e) {
    return (
      /** @type {any} */
      Gp(this, e)
    );
  }
  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @param {Snapshot} [snapshot]
   * @return {{ [Key in Extract<keyof KV,string>]?: KV[Key]}} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes(e) {
    return (
      /** @type {any} */
      e ? P_(this, e) : Hp(this)
    );
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(e = document, n = {}, r) {
    const i = e.createElement(this.nodeName), s = this.getAttributes();
    for (const a in s) {
      const l = s[a];
      typeof l == "string" && i.setAttribute(a, l);
    }
    return As(this, (a) => {
      i.appendChild(a.toDOM(e, n, r));
    }), r !== void 0 && r._createAssociation(i, this), i;
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(e) {
    e.writeTypeRef(ok), e.writeKey(this.nodeName);
  }
}
const j_ = (t) => new Ni(t.readKey());
class q_ extends Lo {
  /**
   * @param {YXmlElement|YXmlText|YXmlFragment} target The target on which the event is created.
   * @param {Set<string|null>} subs The set of changed attributes. `null` is included if the
   *                   child list changed.
   * @param {Transaction} transaction The transaction instance with which the
   *                                  change was created.
   */
  constructor(e, n, r) {
    super(e, r), this.childListChanged = !1, this.attributesChanged = /* @__PURE__ */ new Set(), n.forEach((i) => {
      i === null ? this.childListChanged = !0 : this.attributesChanged.add(i);
    });
  }
}
class po extends Ei {
  /**
   * @param {string} hookName nodeName of the Dom Node.
   */
  constructor(e) {
    super(), this.hookName = e;
  }
  /**
   * Creates an Item with the same effect as this Item (without position effect)
   */
  _copy() {
    return new po(this.hookName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlHook}
   */
  clone() {
    const e = new po(this.hookName);
    return this.forEach((n, r) => {
      e.set(r, n);
    }), e;
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object.<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type
   * @return {Element} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(e = document, n = {}, r) {
    const i = n[this.hookName];
    let s;
    return i !== void 0 ? s = i.createDom(this) : s = document.createElement(this.hookName), s.setAttribute("data-yjs-hook", this.hookName), r !== void 0 && r._createAssociation(s, this), s;
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(e) {
    e.writeTypeRef(ck), e.writeKey(this.hookName);
  }
}
const H_ = (t) => new po(t.readKey());
class go extends xi {
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling() {
    const e = this._item ? this._item.next : null;
    return e ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      e.content.type
    ) : null;
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling() {
    const e = this._item ? this._item.prev : null;
    return e ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      e.content.type
    ) : null;
  }
  _copy() {
    return new go();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlText}
   */
  clone() {
    const e = new go();
    return e.applyDelta(this.toDelta()), e;
  }
  /**
   * Creates a Dom Element that mirrors this YXmlText.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Text} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(e = document, n, r) {
    const i = e.createTextNode(this.toString());
    return r !== void 0 && r._createAssociation(i, this), i;
  }
  toString() {
    return this.toDelta().map((e) => {
      const n = [];
      for (const i in e.attributes) {
        const s = [];
        for (const a in e.attributes[i])
          s.push({ key: a, value: e.attributes[i][a] });
        s.sort((a, l) => a.key < l.key ? -1 : 1), n.push({ nodeName: i, attrs: s });
      }
      n.sort((i, s) => i.nodeName < s.nodeName ? -1 : 1);
      let r = "";
      for (let i = 0; i < n.length; i++) {
        const s = n[i];
        r += `<${s.nodeName}`;
        for (let a = 0; a < s.attrs.length; a++) {
          const l = s.attrs[a];
          r += ` ${l.key}="${l.value}"`;
        }
        r += ">";
      }
      r += e.insert;
      for (let i = n.length - 1; i >= 0; i--)
        r += `</${n[i].nodeName}>`;
      return r;
    }).join("");
  }
  /**
   * @return {string}
   */
  toJSON() {
    return this.toString();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef(dk);
  }
}
const G_ = (t) => new go();
class _d {
  /**
   * @param {ID} id
   * @param {number} length
   */
  constructor(e, n) {
    this.id = e, this.length = n;
  }
  /**
   * @type {boolean}
   */
  get deleted() {
    throw an();
  }
  /**
   * Merge this struct with the item to the right.
   * This method is already assuming that `this.id.clock + this.length === this.id.clock`.
   * Also this method does *not* remove right from StructStore!
   * @param {AbstractStruct} right
   * @return {boolean} whether this merged with right
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   * @param {number} offset
   * @param {number} encodingRef
   */
  write(e, n, r) {
    throw an();
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(e, n) {
    throw an();
  }
}
const J_ = 0;
class Wt extends _d {
  get deleted() {
    return !0;
  }
  delete() {
  }
  /**
   * @param {GC} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.constructor !== e.constructor ? !1 : (this.length += e.length, !0);
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(e, n) {
    n > 0 && (this.id.clock += n, this.length -= n), Bp(e.doc.store, this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeInfo(J_), e.writeLen(this.length - n);
  }
  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(e, n) {
    return null;
  }
}
class Ms {
  /**
   * @param {Uint8Array} content
   */
  constructor(e) {
    this.content = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.content];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentBinary}
   */
  copy() {
    return new Ms(this.content);
  }
  /**
   * @param {number} offset
   * @return {ContentBinary}
   */
  splice(e) {
    throw an();
  }
  /**
   * @param {ContentBinary} right
   * @return {boolean}
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeBuf(this.content);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 3;
  }
}
const V_ = (t) => new Ms(t.readBuf());
class Cs {
  /**
   * @param {number} len
   */
  constructor(e) {
    this.len = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.len;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !1;
  }
  /**
   * @return {ContentDeleted}
   */
  copy() {
    return new Cs(this.len);
  }
  /**
   * @param {number} offset
   * @return {ContentDeleted}
   */
  splice(e) {
    const n = new Cs(this.len - e);
    return this.len = e, n;
  }
  /**
   * @param {ContentDeleted} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.len += e.len, !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
    ks(e.deleteSet, n.id.client, n.id.clock, this.len), n.markDeleted();
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeLen(this.len - n);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 1;
  }
}
const K_ = (t) => new Cs(t.readLen()), Xp = (t, e) => new Fr({ guid: t, ...e, shouldLoad: e.shouldLoad || e.autoLoad || !1 });
class zs {
  /**
   * @param {Doc} doc
   */
  constructor(e) {
    e._item && console.error("This document was already integrated as a sub-document. You should create a second instance instead with the same guid."), this.doc = e;
    const n = {};
    this.opts = n, e.gc || (n.gc = !1), e.autoLoad && (n.autoLoad = !0), e.meta !== null && (n.meta = e.meta);
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.doc];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentDoc}
   */
  copy() {
    return new zs(Xp(this.doc.guid, this.opts));
  }
  /**
   * @param {number} offset
   * @return {ContentDoc}
   */
  splice(e) {
    throw an();
  }
  /**
   * @param {ContentDoc} right
   * @return {boolean}
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
    this.doc._item = n, e.subdocsAdded.add(this.doc), this.doc.shouldLoad && e.subdocsLoaded.add(this.doc);
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
    e.subdocsAdded.has(this.doc) ? e.subdocsAdded.delete(this.doc) : e.subdocsRemoved.add(this.doc);
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeString(this.doc.guid), e.writeAny(this.opts);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 9;
  }
}
const W_ = (t) => new zs(Xp(t.readString(), t.readAny()));
class Lr {
  /**
   * @param {Object} embed
   */
  constructor(e) {
    this.embed = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.embed];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentEmbed}
   */
  copy() {
    return new Lr(this.embed);
  }
  /**
   * @param {number} offset
   * @return {ContentEmbed}
   */
  splice(e) {
    throw an();
  }
  /**
   * @param {ContentEmbed} right
   * @return {boolean}
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeJSON(this.embed);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 5;
  }
}
const X_ = (t) => new Lr(t.readJSON());
class ht {
  /**
   * @param {string} key
   * @param {Object} value
   */
  constructor(e, n) {
    this.key = e, this.value = n;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !1;
  }
  /**
   * @return {ContentFormat}
   */
  copy() {
    return new ht(this.key, this.value);
  }
  /**
   * @param {number} _offset
   * @return {ContentFormat}
   */
  splice(e) {
    throw an();
  }
  /**
   * @param {ContentFormat} _right
   * @return {boolean}
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {Transaction} _transaction
   * @param {Item} item
   */
  integrate(e, n) {
    const r = (
      /** @type {YText} */
      n.parent
    );
    r._searchMarker = null, r._hasFormatting = !0;
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeKey(this.key), e.writeJSON(this.value);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 6;
  }
}
const Z_ = (t) => new ht(t.readKey(), t.readJSON());
class mo {
  /**
   * @param {Array<any>} arr
   */
  constructor(e) {
    this.arr = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.arr.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.arr;
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentJSON}
   */
  copy() {
    return new mo(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentJSON}
   */
  splice(e) {
    const n = new mo(this.arr.slice(e));
    return this.arr = this.arr.slice(0, e), n;
  }
  /**
   * @param {ContentJSON} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.arr = this.arr.concat(e.arr), !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    const r = this.arr.length;
    e.writeLen(r - n);
    for (let i = n; i < r; i++) {
      const s = this.arr[i];
      e.writeString(s === void 0 ? "undefined" : JSON.stringify(s));
    }
  }
  /**
   * @return {number}
   */
  getRef() {
    return 2;
  }
}
const Y_ = (t) => {
  const e = t.readLen(), n = [];
  for (let r = 0; r < e; r++) {
    const i = t.readString();
    i === "undefined" ? n.push(void 0) : n.push(JSON.parse(i));
  }
  return new mo(n);
}, ek = ao("node_env") === "development";
class Rr {
  /**
   * @param {Array<any>} arr
   */
  constructor(e) {
    this.arr = e, ek && Gf(e);
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.arr.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.arr;
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentAny}
   */
  copy() {
    return new Rr(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentAny}
   */
  splice(e) {
    const n = new Rr(this.arr.slice(e));
    return this.arr = this.arr.slice(0, e), n;
  }
  /**
   * @param {ContentAny} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.arr = this.arr.concat(e.arr), !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    const r = this.arr.length;
    e.writeLen(r - n);
    for (let i = n; i < r; i++) {
      const s = this.arr[i];
      e.writeAny(s);
    }
  }
  /**
   * @return {number}
   */
  getRef() {
    return 8;
  }
}
const tk = (t) => {
  const e = t.readLen(), n = [];
  for (let r = 0; r < e; r++)
    n.push(t.readAny());
  return new Rr(n);
};
class kn {
  /**
   * @param {string} str
   */
  constructor(e) {
    this.str = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.str.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.str.split("");
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentString}
   */
  copy() {
    return new kn(this.str);
  }
  /**
   * @param {number} offset
   * @return {ContentString}
   */
  splice(e) {
    const n = new kn(this.str.slice(e));
    this.str = this.str.slice(0, e);
    const r = this.str.charCodeAt(e - 1);
    return r >= 55296 && r <= 56319 && (this.str = this.str.slice(0, e - 1) + "�", n.str = "�" + n.str.slice(1)), n;
  }
  /**
   * @param {ContentString} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.str += e.str, !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeString(n === 0 ? this.str : this.str.slice(n));
  }
  /**
   * @return {number}
   */
  getRef() {
    return 4;
  }
}
const nk = (t) => new kn(t.readString()), rk = [
  z_,
  T_,
  $_,
  j_,
  Q_,
  H_,
  G_
], ik = 0, sk = 1, ak = 2, ok = 3, lk = 4, ck = 5, dk = 6;
class An {
  /**
   * @param {AbstractType<any>} type
   */
  constructor(e) {
    this.type = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.type];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentType}
   */
  copy() {
    return new An(this.type._copy());
  }
  /**
   * @param {number} offset
   * @return {ContentType}
   */
  splice(e) {
    throw an();
  }
  /**
   * @param {ContentType} right
   * @return {boolean}
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
    this.type._integrate(e.doc, n);
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
    let n = this.type._start;
    for (; n !== null; )
      n.deleted ? n.id.clock < (e.beforeState.get(n.id.client) || 0) && e._mergeStructs.push(n) : n.delete(e), n = n.right;
    this.type._map.forEach((r) => {
      r.deleted ? r.id.clock < (e.beforeState.get(r.id.client) || 0) && e._mergeStructs.push(r) : r.delete(e);
    }), e.changed.delete(this.type);
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
    let n = this.type._start;
    for (; n !== null; )
      n.gc(e, !0), n = n.right;
    this.type._start = null, this.type._map.forEach(
      /** @param {Item | null} item */
      (r) => {
        for (; r !== null; )
          r.gc(e, !0), r = r.left;
      }
    ), this.type._map = /* @__PURE__ */ new Map();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    this.type._write(e);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 7;
  }
}
const uk = (t) => new An(rk[t.readTypeRef()](t)), zc = (t, e) => {
  let n = e, r = 0, i;
  do
    r > 0 && (n = Me(n.client, n.clock + r)), i = bi(t, n), r = n.clock - i.id.clock, n = i.redone;
  while (n !== null && i instanceof We);
  return {
    item: i,
    diff: r
  };
}, kd = (t, e) => {
  for (; t !== null && t.keep !== e; )
    t.keep = e, t = /** @type {AbstractType<any>} */
    t.parent._item;
}, bo = (t, e, n) => {
  const { client: r, clock: i } = e.id, s = new We(
    Me(r, i + n),
    e,
    Me(r, i + n - 1),
    e.right,
    e.rightOrigin,
    e.parent,
    e.parentSub,
    e.content.splice(n)
  );
  return e.deleted && s.markDeleted(), e.keep && (s.keep = !0), e.redone !== null && (s.redone = Me(e.redone.client, e.redone.clock + n)), e.right = s, s.right !== null && (s.right.left = s), t._mergeStructs.push(s), s.parentSub !== null && s.right === null && s.parent._map.set(s.parentSub, s), e.length = n, s;
}, Oh = (t, e) => Zc(
  t,
  /** @param {StackItem} s */
  (n) => Ds(n.deletions, e)
), Zp = (t, e, n, r, i, s) => {
  const a = t.doc, l = a.store, d = a.clientID, h = e.redone;
  if (h !== null)
    return Nt(t, h);
  let b = (
    /** @type {AbstractType<any>} */
    e.parent._item
  ), m = null, p;
  if (b !== null && b.deleted === !0) {
    if (b.redone === null && (!n.has(b) || Zp(t, b, n, r, i, s) === null))
      return null;
    for (; b.redone !== null; )
      b = Nt(t, b.redone);
  }
  const g = b === null ? (
    /** @type {AbstractType<any>} */
    e.parent
  ) : (
    /** @type {ContentType} */
    b.content.type
  );
  if (e.parentSub === null) {
    for (m = e.left, p = e; m !== null; ) {
      let C = m;
      for (; C !== null && /** @type {AbstractType<any>} */
      C.parent._item !== b; )
        C = C.redone === null ? null : Nt(t, C.redone);
      if (C !== null && /** @type {AbstractType<any>} */
      C.parent._item === b) {
        m = C;
        break;
      }
      m = m.left;
    }
    for (; p !== null; ) {
      let C = p;
      for (; C !== null && /** @type {AbstractType<any>} */
      C.parent._item !== b; )
        C = C.redone === null ? null : Nt(t, C.redone);
      if (C !== null && /** @type {AbstractType<any>} */
      C.parent._item === b) {
        p = C;
        break;
      }
      p = p.right;
    }
  } else {
    if (p = null, e.right && !i) {
      for (m = e; m !== null && m.right !== null && (m.right.redone || Ds(r, m.right.id) || Oh(s.undoStack, m.right.id) || Oh(s.redoStack, m.right.id)); )
        for (m = m.right; m.redone; ) m = Nt(t, m.redone);
      if (m && m.right !== null)
        return null;
    } else
      m = g._map.get(e.parentSub) || null;
    m !== null && /** @type {AbstractType<any>} */
    m.parent._item !== b && (m = g._map.get(e.parentSub) || null);
  }
  const _ = at(l, d), k = Me(d, _), y = new We(
    k,
    m,
    m && m.lastId,
    p,
    p && p.id,
    g,
    e.parentSub,
    e.content.copy()
  );
  return e.redone = k, kd(y, !0), y.integrate(t, 0), y;
};
class We extends _d {
  /**
   * @param {ID} id
   * @param {Item | null} left
   * @param {ID | null} origin
   * @param {Item | null} right
   * @param {ID | null} rightOrigin
   * @param {AbstractType<any>|ID|null} parent Is a type if integrated, is null if it is possible to copy parent from left or right, is ID before integration to search for it.
   * @param {string | null} parentSub
   * @param {AbstractContent} content
   */
  constructor(e, n, r, i, s, a, l, d) {
    super(e, d.getLength()), this.origin = r, this.left = n, this.right = i, this.rightOrigin = s, this.parent = a, this.parentSub = l, this.redone = null, this.content = d, this.info = this.content.isCountable() ? ph : 0;
  }
  /**
   * This is used to mark the item as an indexed fast-search marker
   *
   * @type {boolean}
   */
  set marker(e) {
    (this.info & rc) > 0 !== e && (this.info ^= rc);
  }
  get marker() {
    return (this.info & rc) > 0;
  }
  /**
   * If true, do not garbage collect this Item.
   */
  get keep() {
    return (this.info & fh) > 0;
  }
  set keep(e) {
    this.keep !== e && (this.info ^= fh);
  }
  get countable() {
    return (this.info & ph) > 0;
  }
  /**
   * Whether this item was deleted or not.
   * @type {Boolean}
   */
  get deleted() {
    return (this.info & nc) > 0;
  }
  set deleted(e) {
    this.deleted !== e && (this.info ^= nc);
  }
  markDeleted() {
    this.info |= nc;
  }
  /**
   * Return the creator clientID of the missing op or define missing items and return null.
   *
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(e, n) {
    if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= at(n, this.origin.client))
      return this.origin.client;
    if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= at(n, this.rightOrigin.client))
      return this.rightOrigin.client;
    if (this.parent && this.parent.constructor === mi && this.id.client !== this.parent.client && this.parent.clock >= at(n, this.parent.client))
      return this.parent.client;
    if (this.origin && (this.left = Dh(e, n, this.origin), this.origin = this.left.lastId), this.rightOrigin && (this.right = Nt(e, this.rightOrigin), this.rightOrigin = this.right.id), this.left && this.left.constructor === Wt || this.right && this.right.constructor === Wt)
      this.parent = null;
    else if (!this.parent)
      this.left && this.left.constructor === We ? (this.parent = this.left.parent, this.parentSub = this.left.parentSub) : this.right && this.right.constructor === We && (this.parent = this.right.parent, this.parentSub = this.right.parentSub);
    else if (this.parent.constructor === mi) {
      const r = bi(n, this.parent);
      r.constructor === Wt ? this.parent = null : this.parent = /** @type {ContentType} */
      r.content.type;
    }
    return null;
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(e, n) {
    if (n > 0 && (this.id.clock += n, this.left = Dh(e, e.doc.store, Me(this.id.client, this.id.clock - 1)), this.origin = this.left.lastId, this.content = this.content.splice(n), this.length -= n), this.parent) {
      if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
        let r = this.left, i;
        if (r !== null)
          i = r.right;
        else if (this.parentSub !== null)
          for (i = /** @type {AbstractType<any>} */
          this.parent._map.get(this.parentSub) || null; i !== null && i.left !== null; )
            i = i.left;
        else
          i = /** @type {AbstractType<any>} */
          this.parent._start;
        const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
        for (; i !== null && i !== this.right; ) {
          if (a.add(i), s.add(i), li(this.origin, i.origin)) {
            if (i.id.client < this.id.client)
              r = i, s.clear();
            else if (li(this.rightOrigin, i.rightOrigin))
              break;
          } else if (i.origin !== null && a.has(bi(e.doc.store, i.origin)))
            s.has(bi(e.doc.store, i.origin)) || (r = i, s.clear());
          else
            break;
          i = i.right;
        }
        this.left = r;
      }
      if (this.left !== null) {
        const r = this.left.right;
        this.right = r, this.left.right = this;
      } else {
        let r;
        if (this.parentSub !== null)
          for (r = /** @type {AbstractType<any>} */
          this.parent._map.get(this.parentSub) || null; r !== null && r.left !== null; )
            r = r.left;
        else
          r = /** @type {AbstractType<any>} */
          this.parent._start, this.parent._start = this;
        this.right = r;
      }
      this.right !== null ? this.right.left = this : this.parentSub !== null && (this.parent._map.set(this.parentSub, this), this.left !== null && this.left.delete(e)), this.parentSub === null && this.countable && !this.deleted && (this.parent._length += this.length), Bp(e.doc.store, this), this.content.integrate(e, this), Ph(
        e,
        /** @type {AbstractType<any>} */
        this.parent,
        this.parentSub
      ), /** @type {AbstractType<any>} */
      (this.parent._item !== null && /** @type {AbstractType<any>} */
      this.parent._item.deleted || this.parentSub !== null && this.right !== null) && this.delete(e);
    } else
      new Wt(this.id, this.length).integrate(e, 0);
  }
  /**
   * Returns the next non-deleted item
   */
  get next() {
    let e = this.right;
    for (; e !== null && e.deleted; )
      e = e.right;
    return e;
  }
  /**
   * Returns the previous non-deleted item
   */
  get prev() {
    let e = this.left;
    for (; e !== null && e.deleted; )
      e = e.left;
    return e;
  }
  /**
   * Computes the last content address of this Item.
   */
  get lastId() {
    return this.length === 1 ? this.id : Me(this.id.client, this.id.clock + this.length - 1);
  }
  /**
   * Try to merge two items
   *
   * @param {Item} right
   * @return {boolean}
   */
  mergeWith(e) {
    if (this.constructor === e.constructor && li(e.origin, this.lastId) && this.right === e && li(this.rightOrigin, e.rightOrigin) && this.id.client === e.id.client && this.id.clock + this.length === e.id.clock && this.deleted === e.deleted && this.redone === null && e.redone === null && this.content.constructor === e.content.constructor && this.content.mergeWith(e.content)) {
      const n = (
        /** @type {AbstractType<any>} */
        this.parent._searchMarker
      );
      return n && n.forEach((r) => {
        r.p === e && (r.p = this, !this.deleted && this.countable && (r.index -= this.length));
      }), e.keep && (this.keep = !0), this.right = e.right, this.right !== null && (this.right.left = this), this.length += e.length, !0;
    }
    return !1;
  }
  /**
   * Mark this Item as deleted.
   *
   * @param {Transaction} transaction
   */
  delete(e) {
    if (!this.deleted) {
      const n = (
        /** @type {AbstractType<any>} */
        this.parent
      );
      this.countable && this.parentSub === null && (n._length -= this.length), this.markDeleted(), ks(e.deleteSet, this.id.client, this.id.clock, this.length), Ph(e, n, this.parentSub), this.content.delete(e);
    }
  }
  /**
   * @param {StructStore} store
   * @param {boolean} parentGCd
   */
  gc(e, n) {
    if (!this.deleted)
      throw Ot();
    this.content.gc(e), n ? m_(e, this, new Wt(this.id, this.length)) : this.content = new Cs(this.length);
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   * @param {number} offset
   */
  write(e, n) {
    const r = n > 0 ? Me(this.id.client, this.id.clock + n - 1) : this.origin, i = this.rightOrigin, s = this.parentSub, a = this.content.getRef() & So | (r === null ? 0 : Lt) | // origin is defined
    (i === null ? 0 : $n) | // right origin is defined
    (s === null ? 0 : ps);
    if (e.writeInfo(a), r !== null && e.writeLeftID(r), i !== null && e.writeRightID(i), r === null && i === null) {
      const l = (
        /** @type {AbstractType<any>} */
        this.parent
      );
      if (l._item !== void 0) {
        const d = l._item;
        if (d === null) {
          const h = xp(l);
          e.writeParentInfo(!0), e.writeString(h);
        } else
          e.writeParentInfo(!1), e.writeLeftID(d.id);
      } else l.constructor === String ? (e.writeParentInfo(!0), e.writeString(l)) : l.constructor === mi ? (e.writeParentInfo(!1), e.writeLeftID(l)) : Ot();
      s !== null && e.writeString(s);
    }
    this.content.write(e, n);
  }
}
const Yp = (t, e) => hk[e & So](t), hk = [
  () => {
    Ot();
  },
  // GC is not ItemContent
  K_,
  // 1
  Y_,
  // 2
  V_,
  // 3
  nk,
  // 4
  X_,
  // 5
  Z_,
  // 6
  uk,
  // 7
  tk,
  // 8
  W_,
  // 9
  () => {
    Ot();
  }
  // 10 - Skip is not ItemContent
], fk = 10;
class Xt extends _d {
  get deleted() {
    return !0;
  }
  delete() {
  }
  /**
   * @param {Skip} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.constructor !== e.constructor ? !1 : (this.length += e.length, !0);
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(e, n) {
    Ot();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeInfo(fk), Oe(e.restEncoder, this.length - n);
  }
  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(e, n) {
    return null;
  }
}
const eg = (
  /** @type {any} */
  typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : {}
), tg = "__ $YJS$ __";
eg[tg] === !0 && console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438");
eg[tg] = !0;
const ng = Math.floor, pk = (t, e) => t < e ? t : e, gk = (t, e) => t > e ? t : e, rg = 128, Ja = 127, mk = Number.MAX_SAFE_INTEGER, bk = () => /* @__PURE__ */ new Set(), yk = Array.from, wk = (t) => {
  const e = unescape(encodeURIComponent(t)), n = e.length, r = new Uint8Array(n);
  for (let i = 0; i < n; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, Is = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), _k = (t) => Is.encode(t), kk = Is ? _k : wk;
let hs = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
hs && hs.decode(new Uint8Array()).length === 1 && (hs = null);
class vk {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
}
const ig = () => new vk(), Ak = (t) => {
  let e = t.cpos;
  for (let n = 0; n < t.bufs.length; n++)
    e += t.bufs[n].length;
  return e;
}, sg = (t) => {
  const e = new Uint8Array(Ak(t));
  let n = 0;
  for (let r = 0; r < t.bufs.length; r++) {
    const i = t.bufs[r];
    e.set(i, n), n += i.length;
  }
  return e.set(new Uint8Array(t.cbuf.buffer, 0, t.cpos), n), e;
}, yo = (t, e) => {
  const n = t.cbuf.length;
  t.cpos === n && (t.bufs.push(t.cbuf), t.cbuf = new Uint8Array(n * 2), t.cpos = 0), t.cbuf[t.cpos++] = e;
}, Qn = (t, e) => {
  for (; e > Ja; )
    yo(t, rg | Ja & e), e = ng(e / 128);
  yo(t, Ja & e);
}, Rc = new Uint8Array(3e4), Ck = Rc.length / 3, Ik = (t, e) => {
  if (e.length < Ck) {
    const n = Is.encodeInto(e, Rc).written || 0;
    Qn(t, n);
    for (let r = 0; r < n; r++)
      yo(t, Rc[r]);
  } else
    xk(t, kk(e));
}, Sk = (t, e) => {
  const n = unescape(encodeURIComponent(e)), r = n.length;
  Qn(t, r);
  for (let i = 0; i < r; i++)
    yo(
      t,
      /** @type {number} */
      n.codePointAt(i)
    );
}, ag = Is && /** @type {any} */
Is.encodeInto ? Ik : Sk, Ek = (t, e) => {
  const n = t.cbuf.length, r = t.cpos, i = pk(n - r, e.length), s = e.length - i;
  t.cbuf.set(e.subarray(0, i), r), t.cpos += i, s > 0 && (t.bufs.push(t.cbuf), t.cbuf = new Uint8Array(gk(n * 2, s)), t.cbuf.set(e.subarray(i)), t.cpos = s);
}, xk = (t, e) => {
  Qn(t, e.byteLength), Ek(t, e);
}, og = (t) => new Error(t), lg = og("Unexpected end of array"), Nk = og("Integer out of Range"), Dk = (t, e, n) => {
  if (e < 0 || n < 0 || e + n > t.length)
    throw lg;
  return new Uint8Array(t.buffer, t.byteOffset + e, n);
};
class Bk {
  /**
   * @param {Uint8Array<Buf>} uint8Array Binary data to decode
   */
  constructor(e) {
    this.arr = e, this.pos = 0;
  }
}
const cg = (t) => new Bk(t), Pk = (t, e) => {
  const n = Dk(t.arr, t.pos, e);
  return t.pos += e, n;
}, Mk = (t) => Pk(t, mr(t)), Uh = (t) => t.arr[t.pos++], mr = (t) => {
  let e = 0, n = 1;
  const r = t.arr.length;
  for (; t.pos < r; ) {
    const i = t.arr[t.pos++];
    if (e = e + (i & Ja) * n, n *= 128, i < rg)
      return e;
    if (e > mk)
      throw Nk;
  }
  throw lg;
}, zk = (t) => {
  let e = mr(t);
  if (e === 0)
    return "";
  {
    let n = String.fromCodePoint(Uh(t));
    if (--e < 100)
      for (; e--; )
        n += String.fromCodePoint(Uh(t));
    else
      for (; e > 0; ) {
        const r = e < 1e4 ? e : 1e4, i = t.arr.subarray(t.pos, t.pos + r);
        t.pos += r, n += String.fromCodePoint.apply(
          null,
          /** @type {any} */
          i
        ), e -= r;
      }
    return decodeURIComponent(escape(n));
  }
}, Rk = (t) => (
  /** @type any */
  hs.decode(Mk(t))
), dg = hs ? Rk : zk, wo = Date.now, uc = () => /* @__PURE__ */ new Map(), Tk = (t, e, n) => {
  let r = t.get(e);
  return r === void 0 && t.set(e, r = n()), r;
};
class Fk {
  constructor() {
    this._observers = uc();
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  on(e, n) {
    Tk(this._observers, e, bk).add(n);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  once(e, n) {
    const r = (...i) => {
      this.off(e, r), n(...i);
    };
    this.on(e, r);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  off(e, n) {
    const r = this._observers.get(e);
    r !== void 0 && (r.delete(n), r.size === 0 && this._observers.delete(e));
  }
  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @param {N} name The event name.
   * @param {Array<any>} args The arguments that are applied to the event listener.
   */
  emit(e, n) {
    return yk((this._observers.get(e) || uc()).values()).forEach((r) => r(...n));
  }
  destroy() {
    this._observers = uc();
  }
}
const $h = /* @__PURE__ */ Symbol("Equality"), Lk = Object.keys, Qh = (t) => Lk(t).length, Ok = (t, e) => Object.prototype.hasOwnProperty.call(t, e), fs = (t, e) => {
  if (t === e)
    return !0;
  if (t == null || e == null || t.constructor !== e.constructor && (t.constructor || Object) !== (e.constructor || Object))
    return !1;
  if (t[$h] != null)
    return t[$h](e);
  switch (t.constructor) {
    case ArrayBuffer:
      t = new Uint8Array(t), e = new Uint8Array(e);
    // eslint-disable-next-line no-fallthrough
    case Uint8Array: {
      if (t.byteLength !== e.byteLength)
        return !1;
      for (let n = 0; n < t.length; n++)
        if (t[n] !== e[n])
          return !1;
      break;
    }
    case Set: {
      if (t.size !== e.size)
        return !1;
      for (const n of t)
        if (!e.has(n))
          return !1;
      break;
    }
    case Map: {
      if (t.size !== e.size)
        return !1;
      for (const n of t.keys())
        if (!e.has(n) || !fs(t.get(n), e.get(n)))
          return !1;
      break;
    }
    case void 0:
    case Object:
      if (Qh(t) !== Qh(e))
        return !1;
      for (const n in t)
        if (!Ok(t, n) || !fs(t[n], e[n]))
          return !1;
      break;
    case Array:
      if (t.length !== e.length)
        return !1;
      for (let n = 0; n < t.length; n++)
        if (!fs(t[n], e[n]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, hc = 3e4;
class Uk extends Fk {
  /**
   * @param {Y.Doc} doc
   */
  constructor(e) {
    super(), this.doc = e, this.clientID = e.clientID, this.states = /* @__PURE__ */ new Map(), this.meta = /* @__PURE__ */ new Map(), this._checkInterval = /** @type {any} */
    setInterval(() => {
      const n = wo();
      this.getLocalState() !== null && hc / 2 <= n - /** @type {{lastUpdated:number}} */
      this.meta.get(this.clientID).lastUpdated && this.setLocalState(this.getLocalState());
      const r = [];
      this.meta.forEach((i, s) => {
        s !== this.clientID && hc <= n - i.lastUpdated && this.states.has(s) && r.push(s);
      }), r.length > 0 && Va(this, r, "timeout");
    }, ng(hc / 10)), e.on("destroy", () => {
      this.destroy();
    }), this.setLocalState({});
  }
  destroy() {
    this.emit("destroy", [this]), this.setLocalState(null), super.destroy(), clearInterval(this._checkInterval);
  }
  /**
   * @return {Object<string,any>|null}
   */
  getLocalState() {
    return this.states.get(this.clientID) || null;
  }
  /**
   * @param {Object<string,any>|null} state
   */
  setLocalState(e) {
    const n = this.clientID, r = this.meta.get(n), i = r === void 0 ? 0 : r.clock + 1, s = this.states.get(n);
    e === null ? this.states.delete(n) : this.states.set(n, e), this.meta.set(n, {
      clock: i,
      lastUpdated: wo()
    });
    const a = [], l = [], d = [], h = [];
    e === null ? h.push(n) : s == null ? e != null && a.push(n) : (l.push(n), fs(s, e) || d.push(n)), (a.length > 0 || d.length > 0 || h.length > 0) && this.emit("change", [{ added: a, updated: d, removed: h }, "local"]), this.emit("update", [{ added: a, updated: l, removed: h }, "local"]);
  }
  /**
   * @param {string} field
   * @param {any} value
   */
  setLocalStateField(e, n) {
    const r = this.getLocalState();
    r !== null && this.setLocalState({
      ...r,
      [e]: n
    });
  }
  /**
   * @return {Map<number,Object<string,any>>}
   */
  getStates() {
    return this.states;
  }
}
const Va = (t, e, n) => {
  const r = [];
  for (let i = 0; i < e.length; i++) {
    const s = e[i];
    if (t.states.has(s)) {
      if (t.states.delete(s), s === t.clientID) {
        const a = (
          /** @type {MetaClientState} */
          t.meta.get(s)
        );
        t.meta.set(s, {
          clock: a.clock + 1,
          lastUpdated: wo()
        });
      }
      r.push(s);
    }
  }
  r.length > 0 && (t.emit("change", [{ added: [], updated: [], removed: r }, n]), t.emit("update", [{ added: [], updated: [], removed: r }, n]));
}, $k = (t, e, n = t.states) => {
  const r = e.length, i = ig();
  Qn(i, r);
  for (let s = 0; s < r; s++) {
    const a = e[s], l = n.get(a) || null, d = (
      /** @type {MetaClientState} */
      t.meta.get(a).clock
    );
    Qn(i, a), Qn(i, d), ag(i, JSON.stringify(l));
  }
  return sg(i);
}, Qk = (t, e) => {
  const n = cg(t), r = ig(), i = mr(n);
  Qn(r, i);
  for (let s = 0; s < i; s++) {
    const a = mr(n), l = mr(n), d = JSON.parse(dg(n)), h = e(d);
    Qn(r, a), Qn(r, l), ag(r, JSON.stringify(h));
  }
  return sg(r);
}, jk = (t, e, n) => {
  const r = cg(e), i = wo(), s = [], a = [], l = [], d = [], h = mr(r);
  for (let b = 0; b < h; b++) {
    const m = mr(r);
    let p = mr(r);
    const g = JSON.parse(dg(r)), _ = t.meta.get(m), k = t.states.get(m), y = _ === void 0 ? 0 : _.clock;
    (y < p || y === p && g === null && t.states.has(m)) && (g === null ? m === t.clientID && t.getLocalState() != null ? p++ : t.states.delete(m) : t.states.set(m, g), t.meta.set(m, {
      clock: p,
      lastUpdated: i
    }), _ === void 0 && g !== null ? s.push(m) : _ !== void 0 && g === null ? d.push(m) : g !== null && (fs(g, k) || l.push(m), a.push(m)));
  }
  (s.length > 0 || l.length > 0 || d.length > 0) && t.emit("change", [{
    added: s,
    updated: l,
    removed: d
  }, n]), (s.length > 0 || a.length > 0 || d.length > 0) && t.emit("update", [{
    added: s,
    updated: a,
    removed: d
  }, n]);
};
function vd(t) {
  let e = "";
  for (let r = 0; r < t.length; r += 32768)
    e += String.fromCharCode(...t.subarray(r, r + 32768));
  return btoa(e);
}
function ci(t) {
  const e = atob(t), n = new Uint8Array(e.length);
  for (let r = 0; r < e.length; r++) n[r] = e.charCodeAt(r);
  return n;
}
function jh(t, e) {
  return e ? (Cp(t, ci(e), "knowledge-remote"), !0) : !1;
}
function qh(t, e) {
  return e ? (Cp(t, ci(e), "knowledge-remote"), !0) : !1;
}
function Hh(t) {
  return t.length === 0 ? "" : vd(t.length === 1 ? t[0] : zp(t));
}
function Gh(t) {
  return vd(s_(t));
}
async function qk(t) {
  const e = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return [...new Uint8Array(e)].map((n) => n.toString(16).padStart(2, "0")).join("");
}
const Hk = "domainry-knowledge-collaboration", _o = "pending-page-updates";
function Ad(t, e, n) {
  return `${encodeURIComponent(t)}:${encodeURIComponent(e)}:${encodeURIComponent(n)}`;
}
function Gk() {
  return typeof indexedDB > "u" ? Promise.resolve(null) : new Promise((t, e) => {
    const n = indexedDB.open(Hk, 1);
    n.onupgradeneeded = () => {
      n.result.objectStoreNames.contains(_o) || n.result.createObjectStore(_o);
    }, n.onsuccess = () => t(n.result), n.onerror = () => e(n.error || new Error("knowledge.offline_database_unavailable")), n.onblocked = () => e(new Error("knowledge.offline_database_blocked"));
  });
}
async function Cd(t, e) {
  const n = await Gk();
  if (n)
    try {
      return await new Promise((r, i) => {
        const s = n.transaction(_o, t), a = e(s.objectStore(_o));
        let l;
        a.onsuccess = () => {
          l = a.result;
        }, a.onerror = () => i(a.error || new Error("knowledge.offline_request_failed")), s.oncomplete = () => r(l), s.onabort = () => i(s.error || new Error("knowledge.offline_transaction_aborted")), s.onerror = () => i(s.error || new Error("knowledge.offline_transaction_failed"));
      });
    } finally {
      n.close();
    }
}
async function Jk(t, e, n) {
  const r = await Cd("readonly", (i) => i.get(Ad(t, e, n)));
  return !r || r.userID !== t || r.libraryID !== e || r.pageID !== n || !r.clientID || !r.updateID || !r.yjsUpdate || !r.yjsState || !Number.isFinite(r.createdAt) || !Number.isFinite(r.updatedAt) ? null : r;
}
async function Vk(t) {
  await Cd("readwrite", (e) => e.put(t, Ad(t.userID, t.libraryID, t.pageID)));
}
async function Jh(t, e, n) {
  await Cd("readwrite", (r) => r.delete(Ad(t, e, n)));
}
function ug(t, e, n) {
  return !t.connectKnowledgeCollaboration || !t.syncKnowledgeCollaboration || !t.streamKnowledgeCollaborationEvents || !t.closeKnowledgeCollaboration || !t.publishKnowledgeCollaboration ? null : {
    kind: "post-sse",
    connect: (r, i) => t.connectKnowledgeCollaboration(e, n, { client_id: r }, i),
    sync: (r, i) => t.syncKnowledgeCollaboration(e, n, r, i),
    stream: (r, i, s, a, l) => t.streamKnowledgeCollaborationEvents(e, n, r, i, s, a, l),
    close: (r, i) => t.closeKnowledgeCollaboration(e, n, r, i),
    publish: (r, i) => t.publishKnowledgeCollaboration(e, n, r, i)
  };
}
const Kk = 32, Wk = /* @__PURE__ */ new Set([
  "knowledge.collaboration_session_revoked",
  "knowledge.collaboration_session_not_found",
  "knowledge.library_not_found",
  "knowledge.page_not_found",
  "knowledge.page_archived"
]);
function Vh(t) {
  const e = typeof t == "object" && t !== null && "code" in t && typeof t.code == "string" ? t.code : t instanceof Error ? t.message : "";
  return Wk.has(e) ? e : "";
}
function hg(t) {
  const e = Xe(() => ug(t.client, t.libraryID, t.pageID), [t.client, t.libraryID, t.pageID]), n = e !== null, r = Xe(() => new Fr(), [t.pageID]), i = Xe(() => r.getXmlFragment("knowledge-document"), [r]), s = Xe(() => r.getText("knowledge-title"), [r]), a = Xe(() => new Uk(r), [r]), [l, d] = P(n ? "connecting" : "unavailable"), [h, b] = P(!1), [m, p] = P(!1), [g, _] = P([]), [k, y] = P([]), [C, S] = P(0), [x, z] = P(0), [N, R] = P(0), [B, U] = P(""), [Q, K] = P(""), [pe, E] = P(0), F = De(null), v = De(null), T = De(null), fe = De({ cursor: "", selection: "" }), Z = De(null), ke = De(async () => {
  }), q = De(async () => {
  }), ge = De(null), W = De(null), H = De(0), ye = De(0), me = De(crypto.randomUUID()), de = De([]), re = De(-1), we = De({ onDocument: t.onDocument, onError: t.onError }), _e = De({ resolveUserName: t.resolveUserName, resolveUserColor: t.resolveUserColor });
  we.current = { onDocument: t.onDocument, onError: t.onError }, _e.current = { resolveUserName: t.resolveUserName, resolveUserColor: t.resolveUserColor }, Ae(() => {
    const O = ($, se) => {
      se !== "knowledge-remote" && de.current.push($);
    };
    return r.on("update", O), () => r.off("update", O);
  }, [r]), Ae(() => () => a.destroy(), [a]);
  function Ce() {
    return vd($k(a, [a.clientID]));
  }
  function xe(O) {
    t.currentUserID && Vk({
      userID: t.currentUserID,
      libraryID: t.libraryID,
      pageID: t.pageID,
      clientID: me.current,
      updateID: O.updateID,
      createdAt: O.createdAt,
      title: O.title,
      content: O.content,
      yjsUpdate: O.yjsUpdate,
      yjsState: O.yjsState,
      editedBlockIDs: O.editedBlockIDs,
      cursorBlockID: fe.current.cursor || void 0,
      selectionBlockID: fe.current.selection || void 0,
      updatedAt: Date.now()
    }).catch(() => {
    });
  }
  function ze(O) {
    const $ = new Set(O.map((ue) => ue.user_id));
    for (const ue of O)
      if (!(!ue.awareness_update || ue.user_id === F.current?.user_id))
        try {
          const oe = Qk(ci(ue.awareness_update), (ce) => ({
            ...ce,
            user: {
              id: ue.user_id,
              name: _e.current.resolveUserName?.(ue.user_id) || ue.display_name || ue.user_id,
              color: _e.current.resolveUserColor?.(ue.user_id) || "#315f9d"
            }
          }));
          jk(a, oe, "knowledge-remote");
        } catch {
        }
    const se = [];
    a.getStates().forEach((ue, oe) => {
      if (oe === a.clientID) return;
      const ce = typeof ue.user?.id == "string" ? ue.user.id : "";
      (!ce || !$.has(ce)) && se.push(oe);
    }), se.length > 0 && Va(a, se, "knowledge-remote"), _(O);
  }
  function Ge(O) {
    O.yjs_state && O.yjs_state_clock !== re.current && (jh(r, O.yjs_state), re.current = O.yjs_state_clock);
    for (const $ of O.yjs_updates || []) qh(r, $.yjs_update);
    (O.yjs_state || O.yjs_updates?.length) && p(!1);
  }
  function Re(O, $, se) {
    F.current = O, K(O.id), v.current = O.snapshot, Ge(O.snapshot), ze(O.presence), z(O.snapshot.server_clock), R(O.snapshot.draft_revision), U(O.user_id);
    const ue = [...new Set($.map((ce) => ce.user_id || "").filter((ce) => ce && ce !== O.user_id))];
    ue.length > 0 && (y(ue), S((ce) => ce + $.filter((Se) => Se.user_id && Se.user_id !== O.user_id).length));
    const oe = s.toString() || O.snapshot.title;
    T.current && (T.current.title = oe, xe(T.current)), we.current.onDocument(T.current?.title || oe, O.snapshot.content, se);
  }
  function w(O) {
    const $ = F.current;
    if (!$) return;
    if (O.type === "presence") {
      const ce = O.presence || [];
      F.current = { ...$, presence: ce }, ze(ce);
      return;
    }
    if (O.type === "heartbeat") {
      !T.current && !Z.current && d("connected");
      return;
    }
    if (O.type !== "update" && O.type !== "snapshot") return;
    const se = v.current;
    O.snapshot ? Ge(O.snapshot) : O.update?.yjs_update && qh(r, O.update.yjs_update);
    const ue = O.snapshot || (O.update && se ? {
      ...se,
      draft_revision: se.draft_revision + 1,
      server_clock: O.clock,
      title: O.update.title?.trim() || se.title,
      content: O.update.content,
      content_sha256: O.update.content_sha256,
      yjs_state: O.update.yjs_state || se.yjs_state,
      yjs_state_clock: O.update.yjs_state ? O.clock : se.yjs_state_clock,
      yjs_update_bytes_since_checkpoint: O.update.yjs_state ? 0 : se.yjs_update_bytes_since_checkpoint + ci(O.update.yjs_update).byteLength,
      yjs_updates: []
    } : void 0);
    if (!ue) return;
    v.current = ue, F.current = { ...$, server_clock: ue.server_clock, snapshot: ue }, z(ue.server_clock), R(ue.draft_revision), O.user_id && O.user_id !== $.user_id && (y([O.user_id]), S((ce) => ce + 1));
    const oe = s.toString() || ue.title;
    T.current && (T.current.title = oe, xe(T.current)), we.current.onDocument(T.current?.title || oe, ue.content, !T.current), !T.current && !Z.current && d("connected");
  }
  Ae(() => {
    if (!t.active || !n) {
      d(n ? "connecting" : "unavailable"), b(!1), _([]);
      return;
    }
    const O = ++ye.current, $ = new AbortController();
    let se = null;
    me.current = crypto.randomUUID(), F.current = null, v.current = null, T.current = null, de.current = [], re.current = -1, Z.current = null, ge.current !== null && window.clearTimeout(ge.current), W.current !== null && window.clearTimeout(W.current), ge.current = null, W.current = null, b(!1), d(pe > 0 ? "reconnecting" : "connecting"), _([]);
    const ue = (ce) => {
      T.current = null, de.current = [], F.current = null, K(""), a.setLocalState(null), Va(a, [...a.getStates().keys()], "knowledge-remote"), t.currentUserID && Jh(t.currentUserID, t.libraryID, t.pageID).catch(() => {
      }), b(!1), _([]), d("error"), we.current.onError(ce);
    }, oe = async () => {
      if (Z.current) return Z.current;
      const ce = (async () => {
        try {
          for (; ye.current === O && F.current && T.current; ) {
            d("syncing");
            const Se = T.current, Ne = v.current;
            if (!Ne) return;
            const je = Se.title.trim(), ft = ci(Se.yjsUpdate).byteLength, it = !Ne.yjs_state || Ne.server_clock - Ne.yjs_state_clock >= Kk - 1 || Ne.yjs_update_bytes_since_checkpoint + ft >= 2 * 1024 * 1024, wt = {
              client_id: me.current,
              update_id: Se.updateID,
              client_created_at: new Date(Se.createdAt).toISOString(),
              title: je !== Ne.title ? je : void 0,
              yjs_update: Se.yjsUpdate,
              yjs_state: it ? Se.yjsState : void 0,
              content: Se.content,
              content_sha256: await qk(Se.content),
              edited_block_ids: Se.editedBlockIDs
            }, Ue = await e.sync({
              session_id: F.current.id,
              after_clock: Ne.server_clock,
              update: wt,
              awareness_update: Ce(),
              cursor_block_id: fe.current.cursor || void 0,
              selection_block_id: fe.current.selection || void 0
            }, AbortSignal.timeout(3e4));
            if (ye.current !== O) return;
            if (H.current = 0, Ue.applied && T.current?.updateID === Se.updateID && (T.current = null, t.currentUserID && Jh(t.currentUserID, t.libraryID, t.pageID).catch(() => {
            })), Re(Ue.session, Ue.events, Ue.applied && T.current === null), !Ue.applied) {
              window.setTimeout(() => {
                ye.current === O && T.current?.updateID !== Se.updateID && ke.current();
              }, 0);
              break;
            }
          }
          ye.current === O && !T.current && d("connected");
        } catch (Se) {
          if (ye.current === O) {
            if (Vh(Se)) {
              ue(Se);
              return;
            }
            H.current++, d("reconnecting"), H.current >= 5 && we.current.onError(Se);
            const Ne = Math.min(8e3, 500 * 2 ** Math.min(H.current - 1, 4));
            window.setTimeout(() => {
              ye.current === O && T.current && E((je) => je + 1);
            }, Ne);
          }
        }
      })();
      Z.current = ce;
      try {
        await ce;
      } finally {
        Z.current === ce && (Z.current = null);
      }
    };
    return ke.current = oe, q.current = async () => {
      const ce = F.current;
      if (!(!ce || T.current || Z.current || ye.current !== O))
        try {
          await e.sync({
            session_id: ce.id,
            after_clock: v.current?.server_clock || 0,
            awareness_update: Ce(),
            cursor_block_id: fe.current.cursor || void 0,
            selection_block_id: fe.current.selection || void 0
          }, AbortSignal.timeout(1e4));
        } catch {
        }
    }, Jk(t.currentUserID, t.libraryID, t.pageID).catch(() => null).then((ce) => (se = ce, ce && (me.current = ce.clientID), e.connect(me.current, $.signal))).then((ce) => {
      $.signal.aborted || ye.current !== O || (H.current = 0, F.current = ce, v.current = ce.snapshot, !ce.snapshot.yjs_state && !ce.snapshot.yjs_updates?.length && (p(!0), s.length === 0 && ce.snapshot.title && s.insert(0, ce.snapshot.title)), Re(ce, [], !0), se && (jh(r, se.yjsState), T.current = {
        updateID: se.updateID,
        createdAt: se.createdAt,
        title: s.toString() || se.title,
        content: se.content,
        yjsUpdate: se.yjsUpdate,
        yjsState: se.yjsState,
        editedBlockIDs: se.editedBlockIDs
      }, fe.current = { cursor: se.cursorBlockID || "", selection: se.selectionBlockID || "" }, we.current.onDocument(T.current.title, T.current.content, !1)), b(!0), d(se ? "syncing" : "connected"), window.setTimeout(() => {
        ye.current === O && (T.current ? ke.current() : q.current());
      }, 0), (async () => {
        let Se = 0;
        for (; !$.signal.aborted && ye.current === O && F.current; ) {
          let Ne = "";
          try {
            if (await e.stream(ce.id, v.current?.server_clock || 0, Se, (je) => {
              if (je.type === "revoked")
                throw Ne = je.code || "knowledge.collaboration_revoked", new Error(Ne);
              w(je);
            }, $.signal), $.signal.aborted || ye.current !== O) return;
            throw new Error("knowledge.collaboration_stream_closed");
          } catch (je) {
            if ($.signal.aborted || ye.current !== O) return;
            if (Ne) {
              ue(je);
              return;
            }
            if (Se++, d("reconnecting"), Se >= 5) {
              we.current.onError(je), E((ft) => ft + 1);
              return;
            }
            await new Promise((ft) => window.setTimeout(ft, Math.min(4e3, 500 * 2 ** (Se - 1))));
          }
        }
      })());
    }).catch((ce) => {
      if (!$.signal.aborted && ye.current === O) {
        if (Vh(ce)) {
          ue(ce);
          return;
        }
        if (H.current++, H.current >= 5) {
          d("error"), we.current.onError(ce);
          return;
        }
        d("reconnecting");
        const Se = Math.min(8e3, 500 * 2 ** Math.min(H.current - 1, 4));
        window.setTimeout(() => {
          ye.current === O && E((Ne) => Ne + 1);
        }, Se);
      }
    }), () => {
      $.abort(), ye.current++, ge.current !== null && window.clearTimeout(ge.current), W.current !== null && window.clearTimeout(W.current), ge.current = null, W.current = null, Z.current = null, T.current = null, de.current = [], Va(a, [...a.getStates().keys()].filter((Se) => Se !== a.clientID), "knowledge-remote");
      const ce = F.current;
      F.current = null, K(""), ce && e.close(ce.id, AbortSignal.timeout(1e4)).catch(() => {
      });
    };
  }, [n, a, r, t.active, t.currentUserID, t.libraryID, t.pageID, pe, s, e]);
  function ie(O, $, se) {
    const ue = v.current;
    if (!ue || !h) return;
    const oe = O.trim();
    s.toString() !== oe && r.transact(() => {
      s.length > 0 && s.delete(0, s.length), oe && s.insert(0, oe);
    }, "knowledge-title");
    const ce = de.current.splice(0), Se = Hh(ce);
    if (!T.current && O.trim() === ue.title && $ === ue.content || !Se && !T.current) return;
    const Ne = T.current?.yjsUpdate, je = Hh([Ne, Se].filter((ft) => !!ft).map(ci));
    T.current = {
      updateID: crypto.randomUUID(),
      createdAt: T.current?.createdAt || Date.now(),
      title: s.toString() || oe,
      content: $,
      yjsUpdate: je,
      yjsState: Gh(r),
      editedBlockIDs: [.../* @__PURE__ */ new Set([...T.current?.editedBlockIDs || [], ...se?.editedBlockIDs || []])].slice(0, 2048)
    }, fe.current = { cursor: se?.cursorBlockID || "", selection: se?.selectionBlockID || "" }, xe(T.current), d("syncing"), ge.current !== null && window.clearTimeout(ge.current), ge.current = window.setTimeout(() => {
      ge.current = null, ke.current();
    }, 120);
  }
  function X(O, $) {
    fe.current = { cursor: O || "", selection: $ || "" }, !(!h || l === "connecting" || l === "reconnecting" || l === "error") && (W.current !== null && window.clearTimeout(W.current), W.current = window.setTimeout(() => {
      W.current = null, q.current();
    }, 250));
  }
  async function M(O) {
    ge.current !== null && (window.clearTimeout(ge.current), ge.current = null), await ke.current();
    const $ = F.current;
    if (!$ || T.current) throw new Error("协作更改尚未完成合并");
    return e.publish({
      session_id: $.id,
      client_id: $.client_id,
      publish_note: O
    }, AbortSignal.timeout(6e4));
  }
  async function D() {
    ge.current !== null && (window.clearTimeout(ge.current), ge.current = null), await ke.current();
    const O = v.current;
    if (!O || T.current) throw new Error("协作更改尚未完成合并");
    return { draftRevision: O.draft_revision, title: O.title, content: O.content };
  }
  const j = Xe(() => ({
    document: r,
    fragment: i,
    initializeFromBody: m,
    user: { name: t.resolveUserName?.(B) || B || "当前用户", color: t.resolveUserColor?.(B) || "#0b8f72" },
    provider: { awareness: a }
  }), [a, r, i, m, t.resolveUserColor, t.resolveUserName, B]), le = Xe(() => new Set(g.map((O) => O.user_id)).size, [g]);
  return {
    available: n && t.active,
    ready: h,
    editorCollaboration: j,
    state: l,
    presence: g,
    onlineUsers: le,
    mergedUserIDs: k,
    mergeCount: C,
    serverClock: x,
    draftRevision: N,
    sessionID: Q,
    userID: B,
    edit: ie,
    updatePresence: X,
    publish: M,
    flush: D,
    reconnect: () => E((O) => O + 1),
    encodeState: () => Gh(r)
  };
}
function Xk(t) {
  const e = Xe(() => ug(t.client, t.libraryID, t.pageID), [t.client, t.libraryID, t.pageID]), n = De({ onSnapshot: t.onSnapshot, onError: t.onError });
  n.current = { onSnapshot: t.onSnapshot, onError: t.onError };
  const r = De(null), i = De(0), s = De({ cursor: "", selection: "" }), a = De(null), l = De(0), [d, h] = P([]), [b, m] = P("unavailable"), [p, g] = P(!1), _ = ui((C) => {
    i.current = Math.max(i.current, C.clock), C.type === "presence" && h(C.presence || []), C.snapshot && n.current.onSnapshot?.(C.snapshot);
  }, []), k = ui(async () => {
    const C = r.current;
    if (!(!C || !e))
      try {
        const S = await e.sync({
          session_id: C.id,
          after_clock: i.current,
          cursor_block_id: s.current.cursor || void 0,
          selection_block_id: s.current.selection || void 0
        }, AbortSignal.timeout(1e4));
        r.current = S.session, i.current = Math.max(i.current, S.session.server_clock), h(S.session.presence), S.events.forEach((x) => {
          i.current = Math.max(i.current, x.clock), x.snapshot && n.current.onSnapshot?.(x.snapshot);
        });
      } catch {
      }
  }, [e]);
  Ae(() => {
    if (!t.active || !e) {
      g(!1), h([]), m(e ? "connecting" : "unavailable");
      return;
    }
    const C = ++l.current, S = new AbortController();
    let x = 0;
    return g(!1), h([]), m("connecting"), e.connect(crypto.randomUUID(), S.signal).then((z) => {
      S.signal.aborted || l.current !== C || (r.current = z, i.current = z.server_clock, h(z.presence), g(!0), m("connected"), x = window.setInterval(() => {
        k();
      }, 1e4), k(), (async () => {
        let N = 0;
        for (; !S.signal.aborted && l.current === C && r.current; )
          try {
            if (await e.stream(z.id, i.current, N, (R) => {
              if (R.type === "revoked") throw new Error(R.code || "knowledge.collaboration_revoked");
              N = 0, m("connected"), _(R);
            }, S.signal), S.signal.aborted) return;
            throw new Error("knowledge.collaboration_stream_closed");
          } catch (R) {
            if (S.signal.aborted || l.current !== C) return;
            if (N++, m("reconnecting"), N >= 5) {
              g(!1), m("error"), n.current.onError?.(R);
              return;
            }
            await new Promise((B) => window.setTimeout(B, Math.min(4e3, 500 * 2 ** (N - 1))));
          }
      })());
    }).catch((z) => {
      !S.signal.aborted && l.current === C && (g(!1), m("error"), n.current.onError?.(z));
    }), () => {
      S.abort(), l.current++, x && window.clearInterval(x), a.current !== null && window.clearTimeout(a.current), a.current = null;
      const z = r.current;
      r.current = null, z && e.close(z.id, AbortSignal.timeout(1e4)).catch(() => {
      });
    };
  }, [_, t.active, t.libraryID, t.pageID, k, e]);
  const y = ui((C, S) => {
    s.current = { cursor: C || "", selection: S || "" }, p && (a.current !== null && window.clearTimeout(a.current), a.current = window.setTimeout(() => {
      a.current = null, k();
    }, 150));
  }, [p, k]);
  return {
    available: !!e && t.active,
    ready: p,
    state: b,
    presence: d,
    onlineUsers: new Set(d.map((C) => C.user_id)).size,
    updatePresence: y
  };
}
const Tc = {
  submission_role: "reader",
  allow_multiple_submissions: !1,
  opens_at: "",
  closes_at: "",
  confirmation_message: "提交成功，感谢你的参与。"
};
function fg() {
  return {
    schema_version: 1,
    display: "form",
    components: [{ type: "textfield", key: "question1", label: "未命名问题", input: !0, validate: { required: !1 } }],
    settings: { ...Tc }
  };
}
const Zk = ["textfield", "textarea", "number", "currency", "email", "url", "phoneNumber", "radio", "select", "selectboxes", "checkbox", "datetime", "rating", "scale", "file"], Yk = new Set(Zk), ev = /* @__PURE__ */ new Set(["CNY", "USD", "EUR", "JPY"]), Fc = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
function ns(t) {
  return typeof t == "number" && Number.isFinite(t) ? t : void 0;
}
function Kh(t) {
  if (!Array.isArray(t) || t.length < 1 || t.length > 100) throw new Error("选项题至少需要一个有效选项。");
  const e = /* @__PURE__ */ new Set();
  return t.map((n) => {
    const r = n, i = typeof r.label == "string" ? r.label.trim() : "", s = typeof r.value == "string" ? r.value.trim() : "";
    if (!i || !Fc.test(s) || e.has(s)) throw new Error("选项名称或选项值无效、重复。");
    return e.add(s), { label: i, value: s };
  });
}
function tv(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) throw new Error("问卷问题结构无效。");
  const e = t, n = e.type, r = typeof e.key == "string" ? e.key.trim() : "", i = typeof e.label == "string" ? e.label.trim() : "";
  if (!Yk.has(n) || !Fc.test(r) || !i) throw new Error("问题类型不受支持，或问题名称、标识无效。");
  const s = e.validate && typeof e.validate == "object" && !Array.isArray(e.validate) ? e.validate : {}, a = { required: s.required === !0 };
  if (["textfield", "textarea", "email", "url", "phoneNumber"].includes(n)) {
    const d = ns(s.minLength), h = ns(s.maxLength);
    d !== void 0 && Number.isInteger(d) && d >= 0 && (a.minLength = d), h !== void 0 && Number.isInteger(h) && h > 0 && (a.maxLength = h);
  }
  if (n === "number" || n === "currency" || n === "rating" || n === "scale") {
    const d = ns(s.min), h = ns(s.max);
    if (d !== void 0 && (a.min = d), h !== void 0 && (a.max = h), n === "rating" || n === "scale") {
      const b = a.min ?? (n === "rating" ? 1 : 0), m = a.max ?? (n === "rating" ? 5 : 10);
      if (!Number.isInteger(b) || !Number.isInteger(m) || b < 0 || m > 20 || m <= b || m - b > 20) throw new Error("评分和量表必须使用 0 至 20 之间、跨度不超过 20 的整数范围。");
      a.min = b, a.max = m;
    }
  }
  const l = { type: n, key: r, label: i, input: !0, validate: a };
  if (n === "currency" && (l.currency = typeof e.currency == "string" && ev.has(e.currency) ? e.currency : "CNY"), n === "phoneNumber" && (l.inputMask = ""), n === "file") {
    const d = ns(e.maxFiles);
    l.maxFiles = d !== void 0 && Number.isInteger(d) && d >= 1 && d <= 20 ? d : 5;
  }
  if (typeof e.description == "string" && e.description.trim() && (l.description = e.description.trim()), typeof e.placeholder == "string" && e.placeholder.trim() && (l.placeholder = e.placeholder.trim()), (n === "radio" || n === "selectboxes") && (l.values = Kh(e.values)), n === "select") {
    const d = e.data;
    l.data = { values: Kh(d?.values) }, e.multiple === !0 && (l.multiple = !0);
  }
  if (e.conditional && typeof e.conditional == "object" && !Array.isArray(e.conditional)) {
    const d = e.conditional, h = typeof d.when == "string" ? d.when.trim() : "";
    if (h) {
      if (!Fc.test(h) || !["string", "number", "boolean"].includes(typeof d.eq)) throw new Error(`问题“${i}”的显示条件无效。`);
      l.conditional = { show: d.show !== !1, when: h, eq: d.eq };
    }
  }
  return l;
}
function pg(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) throw new Error("问卷内容不是有效对象。");
  const e = t;
  if (!Array.isArray(e.components) || e.components.length < 1 || e.components.length > 200) throw new Error("问卷必须包含 1 至 200 个问题。");
  const n = e.components.map(tv), r = /* @__PURE__ */ new Set();
  for (const l of n) {
    if (r.has(l.key)) throw new Error(`问题标识“${l.key}”重复。`);
    r.add(l.key);
  }
  for (const l of n) if (l.conditional && (!r.has(l.conditional.when) || l.conditional.when === l.key)) throw new Error(`问题“${l.label}”引用了无效的条件题。`);
  const i = e.settings && typeof e.settings == "object" && !Array.isArray(e.settings) ? e.settings : Tc, s = i.submission_role, a = {
    submission_role: s === "editor" || s === "manager" ? s : "reader",
    allow_multiple_submissions: i.allow_multiple_submissions === !0,
    opens_at: typeof i.opens_at == "string" ? i.opens_at : "",
    closes_at: typeof i.closes_at == "string" ? i.closes_at : "",
    confirmation_message: typeof i.confirmation_message == "string" && i.confirmation_message.trim() ? i.confirmation_message.trim() : Tc.confirmation_message
  };
  return { schema_version: 1, display: "form", components: n, settings: a };
}
function nv(t) {
  try {
    return pg(JSON.parse(t));
  } catch {
    return fg();
  }
}
function uC(t) {
  return {
    display: "form",
    components: t.components.map((e) => {
      if (e.type === "file") return { type: "textfield", key: e.key, label: e.label, input: !0, hidden: !0, validate: { required: !1 } };
      if (e.type === "rating" || e.type === "scale") {
        const n = Math.trunc(e.validate.min ?? (e.type === "rating" ? 1 : 0)), r = Math.trunc(e.validate.max ?? (e.type === "rating" ? 5 : 10));
        return { ...structuredClone(e), type: "radio", inline: !0, values: Array.from({ length: r - n + 1 }, (i, s) => ({ label: String(n + s), value: String(n + s) })) };
      }
      return structuredClone(e);
    })
  };
}
function hC(t, e) {
  const n = t && typeof t == "object" && !Array.isArray(t) ? t : {};
  return pg({ schema_version: 1, display: "form", components: n.components, settings: e });
}
function fC(t, e = []) {
  if (!t || typeof t != "object" || Array.isArray(t)) return {};
  const n = new Map(e.map((r) => [r.key, r.type]));
  return Object.fromEntries(Object.entries(t).filter(([, r]) => r !== void 0).map(([r, i]) => (n.get(r) === "rating" || n.get(r) === "scale") && typeof i == "string" && i.trim() !== "" ? [r, Number(i)] : [r, i]));
}
const Lc = {
  schema_version: 1,
  elements: [],
  assets: {},
  settings: { background_color: "#ffffff", grid_size: 20, grid_enabled: !1 }
}, rv = /* @__PURE__ */ new Set(["rectangle", "diamond", "ellipse", "line", "arrow", "freedraw", "text", "image", "frame"]), iv = /* @__PURE__ */ new Set(["hachure", "cross-hatch", "solid", "zigzag"]), sv = /* @__PURE__ */ new Set(["solid", "dashed", "dotted"]), av = /* @__PURE__ */ new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);
function Ye(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t) ? t : null;
}
function ls(t, e = "") {
  return typeof t == "string" ? t : e;
}
function rt(t, e = 0) {
  return typeof t == "number" && Number.isFinite(t) ? t : e;
}
function Oc(t, e = !1) {
  return typeof t == "boolean" ? t : e;
}
function ov(t) {
  return Array.isArray(t) ? t.filter((e) => typeof e == "string") : [];
}
function Uc(t) {
  return Array.isArray(t) && t.length === 2 && t.every((e) => typeof e == "number" && Number.isFinite(e)) ? [t[0], t[1]] : null;
}
function Wh(t) {
  const e = Ye(t);
  if (!e || typeof e.elementId != "string") return;
  const n = { element_id: e.elementId, focus: rt(e.focus), gap: rt(e.gap) }, r = Uc(e.fixedPoint);
  return r && (n.fixed_point = r), n;
}
function lv(t) {
  const e = Ye(t), n = e?.type;
  if (!e || typeof e.id != "string" || !rv.has(n) || e.isDeleted === !0) return null;
  const r = {
    id: e.id,
    type: n,
    x: rt(e.x),
    y: rt(e.y),
    width: Math.max(0, rt(e.width)),
    height: Math.max(0, rt(e.height)),
    angle: rt(e.angle),
    stroke_color: ls(e.strokeColor, "#1b1b1f"),
    background_color: ls(e.backgroundColor, "transparent"),
    fill_style: iv.has(e.fillStyle) ? e.fillStyle : "hachure",
    stroke_width: Math.max(0.5, rt(e.strokeWidth, 1)),
    stroke_style: sv.has(e.strokeStyle) ? e.strokeStyle : "solid",
    roughness: Math.max(0, rt(e.roughness, 1)),
    opacity: Math.max(0, Math.min(100, rt(e.opacity, 100)))
  }, i = ov(e.groupIds);
  i.length && (r.group_ids = i), typeof e.frameId == "string" && e.frameId && (r.frame_id = e.frameId);
  const s = Ye(e.roundness);
  if (s && Number.isInteger(s.type) && (r.roundness = rt(s.type)), Array.isArray(e.boundElements)) {
    const l = e.boundElements.flatMap((d) => {
      const h = Ye(d);
      return h && typeof h.id == "string" && (h.type === "text" || h.type === "arrow") ? [{ id: h.id, type: h.type }] : [];
    });
    l.length && (r.bound_elements = l);
  }
  typeof e.link == "string" && e.link && (r.link = e.link), e.locked === !0 && (r.locked = !0);
  const a = Ye(e.customData);
  if ((a?.knowledgeKind === "sticky_note" || a?.knowledgeKind === "template_heading") && (r.custom_kind = a.knowledgeKind), r.type === "text" && (r.text = ls(e.text), r.original_text = ls(e.originalText, r.text), r.font_size = Math.max(1, rt(e.fontSize, 20)), r.font_family = Math.max(1, rt(e.fontFamily, 5)), r.text_align = e.textAlign === "center" || e.textAlign === "right" ? e.textAlign : "left", r.vertical_align = e.verticalAlign === "middle" || e.verticalAlign === "bottom" ? e.verticalAlign : "top", typeof e.containerId == "string" && e.containerId && (r.container_id = e.containerId), r.line_height = Math.max(0.5, rt(e.lineHeight, 1.25)), r.auto_resize = Oc(e.autoResize, !0)), r.type === "line" || r.type === "arrow" || r.type === "freedraw") {
    const l = Array.isArray(e.points) ? e.points.map(Uc).filter((d) => d !== null) : [];
    r.points = l.length >= 2 ? l : [[0, 0], [Math.max(1, r.width), Math.max(1, r.height)]];
  }
  if (r.type === "line" || r.type === "arrow") {
    const l = Wh(e.startBinding), d = Wh(e.endBinding);
    l && (r.start_binding = l), d && (r.end_binding = d), typeof e.startArrowhead == "string" && (r.start_arrowhead = e.startArrowhead), typeof e.endArrowhead == "string" && (r.end_arrowhead = e.endArrowhead), e.elbowed === !0 && (r.elbowed = !0);
  }
  if (r.type === "freedraw" && (Array.isArray(e.pressures) && (r.pressures = e.pressures.filter((l) => typeof l == "number" && Number.isFinite(l))), r.simulate_pressure = Oc(e.simulatePressure, !0)), r.type === "image") {
    typeof e.fileId == "string" && (r.file_id = e.fileId);
    const l = Uc(e.scale);
    r.scale = l || [1, 1];
    const d = Ye(e.crop);
    d && (r.crop = { x: rt(d.x), y: rt(d.y), width: rt(d.width), height: rt(d.height), natural_width: rt(d.naturalWidth), natural_height: rt(d.naturalHeight) });
  }
  return r.type === "frame" && typeof e.name == "string" && e.name && (r.name = e.name), r;
}
function cv(t, e) {
  const n = Ye(t) || {}, r = {};
  for (const [i, s] of Object.entries(n)) {
    const a = Ye(s), l = a?.mimeType;
    !a || !e.has(i) || a.id !== i || typeof a.dataURL != "string" || !av.has(l) || (r[i] = { id: i, mime_type: l, data_url: a.dataURL, created_at: Math.max(0, rt(a.created)) });
  }
  return r;
}
function dv(t, e, n) {
  const r = t.map(lv).filter((a) => a !== null), i = new Set(r.flatMap((a) => a.type === "image" && a.file_id ? [a.file_id] : [])), s = Ye(n) || {};
  return {
    schema_version: 1,
    elements: r,
    assets: cv(e, i),
    settings: {
      background_color: ls(s.viewBackgroundColor, "#ffffff"),
      grid_size: Math.max(1, Math.min(100, rt(s.gridSize, 20))),
      grid_enabled: Oc(s.gridModeEnabled)
    }
  };
}
function Xh(t) {
  return t ? { elementId: t.element_id, focus: t.focus, gap: t.gap, ...t.fixed_point ? { fixedPoint: t.fixed_point } : {} } : null;
}
function Zh(t) {
  let e = 2166136261;
  for (const n of t) e = Math.imul(e ^ n.charCodeAt(0), 16777619);
  return e >>> 0 || 1;
}
function pC(t) {
  const e = t.elements.map((r, i) => ({
    id: r.id,
    type: r.type,
    x: r.x,
    y: r.y,
    width: r.width,
    height: r.height,
    angle: r.angle,
    strokeColor: r.stroke_color,
    backgroundColor: r.background_color,
    fillStyle: r.fill_style,
    strokeWidth: r.stroke_width,
    strokeStyle: r.stroke_style,
    roughness: r.roughness,
    opacity: r.opacity,
    groupIds: r.group_ids || [],
    frameId: r.frame_id || null,
    roundness: r.roundness ? { type: r.roundness } : null,
    boundElements: r.bound_elements || null,
    link: r.link || null,
    locked: r.locked || !1,
    customData: r.custom_kind ? { knowledgeKind: r.custom_kind } : void 0,
    text: r.text,
    originalText: r.original_text,
    fontSize: r.font_size,
    fontFamily: r.font_family,
    textAlign: r.text_align,
    verticalAlign: r.vertical_align,
    containerId: r.container_id || null,
    lineHeight: r.line_height,
    autoResize: r.auto_resize,
    points: r.points,
    pressures: r.pressures,
    simulatePressure: r.simulate_pressure,
    startBinding: Xh(r.start_binding),
    endBinding: Xh(r.end_binding),
    startArrowhead: r.start_arrowhead || null,
    endArrowhead: r.end_arrowhead || null,
    elbowed: r.elbowed || !1,
    fileId: r.file_id || null,
    scale: r.scale || [1, 1],
    crop: r.crop ? { x: r.crop.x, y: r.crop.y, width: r.crop.width, height: r.crop.height, naturalWidth: r.crop.natural_width, naturalHeight: r.crop.natural_height } : null,
    name: r.name || null,
    seed: Zh(r.id),
    version: 1,
    versionNonce: Zh(`${r.id}:version`),
    isDeleted: !1,
    updated: 1,
    index: `a${i.toString(36).padStart(7, "0")}`
  })), n = Object.fromEntries(Object.entries(t.assets).map(([r, i]) => [r, { id: r, mimeType: i.mime_type, dataURL: i.data_url, created: i.created_at }]));
  return {
    elements: e,
    files: n,
    appState: { viewBackgroundColor: t.settings.background_color, gridSize: t.settings.grid_size, gridStep: 5, gridModeEnabled: t.settings.grid_enabled }
  };
}
function gC(t) {
  try {
    const e = Ye(JSON.parse(t));
    if (!e || e.schema_version !== 1 || !Array.isArray(e.elements) || !Ye(e.assets) || !Ye(e.settings)) return Lc;
    const n = e.elements.map((s) => {
      const a = Ye(s);
      return a ? {
        ...a,
        strokeColor: a.stroke_color,
        backgroundColor: a.background_color,
        fillStyle: a.fill_style,
        strokeWidth: a.stroke_width,
        strokeStyle: a.stroke_style,
        groupIds: a.group_ids,
        frameId: a.frame_id,
        roundness: a.roundness ? { type: a.roundness } : null,
        boundElements: a.bound_elements,
        customData: a.custom_kind ? { knowledgeKind: a.custom_kind } : void 0,
        originalText: a.original_text,
        fontSize: a.font_size,
        fontFamily: a.font_family,
        textAlign: a.text_align,
        verticalAlign: a.vertical_align,
        containerId: a.container_id,
        lineHeight: a.line_height,
        autoResize: a.auto_resize,
        simulatePressure: a.simulate_pressure,
        startBinding: a.start_binding ? { elementId: Ye(a.start_binding)?.element_id, focus: Ye(a.start_binding)?.focus, gap: Ye(a.start_binding)?.gap, fixedPoint: Ye(a.start_binding)?.fixed_point } : null,
        endBinding: a.end_binding ? { elementId: Ye(a.end_binding)?.element_id, focus: Ye(a.end_binding)?.focus, gap: Ye(a.end_binding)?.gap, fixedPoint: Ye(a.end_binding)?.fixed_point } : null,
        startArrowhead: a.start_arrowhead,
        endArrowhead: a.end_arrowhead,
        fileId: a.file_id,
        crop: a.crop ? { ...Ye(a.crop), naturalWidth: Ye(a.crop)?.natural_width, naturalHeight: Ye(a.crop)?.natural_height } : null
      } : null;
    }).filter(Boolean), r = Object.fromEntries(Object.entries(e.assets).map(([s, a]) => {
      const l = Ye(a);
      return [s, { id: s, mimeType: l?.mime_type, dataURL: l?.data_url, created: l?.created_at }];
    })), i = e.settings;
    return dv(n, r, { viewBackgroundColor: i.background_color, gridSize: i.grid_size, gridModeEnabled: i.grid_enabled });
  } catch {
    return Lc;
  }
}
function mC(t) {
  const e = t.text?.trim() || t.name?.trim();
  return e ? e.slice(0, 1024) : t.custom_kind === "sticky_note" ? "便签" : { rectangle: "矩形", diamond: "菱形", ellipse: "椭圆", line: "线条", arrow: "连接线", freedraw: "自由绘制", image: "图片", frame: "画板区域", text: "文本" }[t.type];
}
function $o(t) {
  try {
    const e = JSON.parse(t);
    return Array.isArray(e.blocks) ? e.blocks : [];
  } catch {
    return [];
  }
}
function uv(t) {
  return JSON.stringify({ blocks: t });
}
function Ss(t) {
  if (typeof t == "string") return t;
  if (Array.isArray(t)) return t.map(Ss).join("");
  if (!t || typeof t != "object") return "";
  const e = t;
  return typeof e.text == "string" ? e.text : Ss(e.content);
}
const hv = /* @__PURE__ */ new Set(["caption", "description", "displayName", "email", "icon", "label", "name", "question", "siteName", "title"]);
function fv(t) {
  const e = [], n = t.props || {};
  for (const s of [...hv].sort()) {
    const a = n?.[s];
    typeof a == "string" && a.trim() && e.push(a);
  }
  const r = Ss(t.content).trim();
  r && e.push(r);
  const i = e.join(" ").replace(/\s+/g, " ").trim() || t.type;
  return Array.from(i).slice(0, 1024).join("");
}
function pv(t) {
  const e = [], n = (r) => {
    for (const i of r) {
      const s = Ss(i.content).trim();
      s && e.push(s), i.children?.length && n(i.children);
    }
  };
  return n($o(t)), e.join(`
`);
}
function gv(t) {
  const e = $o(t);
  let n = 0;
  const r = (i) => {
    for (const s of i)
      n++, s.children?.length && r(s.children);
  };
  return r(e), { blocks: n, characters: Array.from(pv(t)).length };
}
function mv(t) {
  const e = [], n = (r) => {
    for (const i of r) {
      if (i.type === "heading") {
        const s = Ss(i.content).trim();
        s && e.push({ key: i.id, level: Number(i.props.level) || 1, title: s });
      }
      i.children?.length && n(i.children);
    }
  };
  return n($o(t)), e;
}
function bv(t, e, n) {
  const r = $o(t);
  return r.push({
    id: crypto.randomUUID(),
    type: "image",
    props: { name: n, caption: n, url: `knowledge-document:${e}`, showPreview: !0 },
    children: []
  }), uv(r);
}
const yv = 2e4, wv = 64, Yh = ["children", "collapsed", "completed", "id", "text"], _v = ["priority", "due_date", "tags", "note"], gg = /^[A-Za-z0-9][A-Za-z0-9:_-]{0,127}$/, mg = new TextEncoder();
function Id(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t) ? t : null;
}
function kv(t, e) {
  const n = Object.keys(t).sort();
  return n.length === e.length && n.every((r, i) => r === e[i]);
}
function vv(t) {
  const e = Object.keys(t);
  return Yh.every((n) => e.includes(n)) && e.every((n) => Yh.includes(n) || _v.includes(n));
}
function ef(t) {
  return typeof t == "string" && mg.encode(t).byteLength <= 4096 && !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(t);
}
function Av(t) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return !1;
  const e = /* @__PURE__ */ new Date(`${t}T00:00:00Z`);
  return !Number.isNaN(e.valueOf()) && e.toISOString().slice(0, 10) === t;
}
function bg(t, e, n, r) {
  const i = Id(t);
  return !i || e > wv || !vv(i) || typeof i.id != "string" || !gg.test(i.id) || n.has(i.id) || !ef(i.text) || typeof i.completed != "boolean" || typeof i.collapsed != "boolean" || !Array.isArray(i.children) || i.priority !== void 0 && !["none", "low", "medium", "high", "urgent"].includes(String(i.priority)) || i.due_date !== void 0 && (typeof i.due_date != "string" || i.due_date !== "" && !Av(i.due_date)) || i.note !== void 0 && !ef(i.note) || i.tags !== void 0 && (!Array.isArray(i.tags) || i.tags.length > 12 || new Set(i.tags).size !== i.tags.length || !i.tags.every((s) => typeof s == "string" && s.trim() && mg.encode(s).byteLength <= 64 && !/[\u0000-\u001f\u007f]/.test(s))) || (n.add(i.id), r.value += 1, r.value > yv) ? !1 : i.children.every((s) => bg(s, e + 1, n, r));
}
const $c = {
  schema_version: 1,
  nodes: [{ id: "note-1", text: "未命名主题", completed: !1, collapsed: !1, children: [] }]
};
function Cv(t) {
  const e = Id(t);
  if (!e || !kv(e, ["nodes", "schema_version"]) || e.schema_version !== 1 || !Array.isArray(e.nodes) || e.nodes.length === 0) return !1;
  const n = /* @__PURE__ */ new Set(), r = { value: 0 };
  return e.nodes.every((i) => bg(i, 1, n, r));
}
function bC(t) {
  try {
    const e = JSON.parse(t);
    return Cv(e) ? e : $c;
  } catch {
    return $c;
  }
}
function yC(t) {
  return JSON.stringify(t);
}
function Qc() {
  return `note-${crypto.randomUUID()}`;
}
function Iv(t = "新条目") {
  return { id: Qc(), text: t, completed: !1, collapsed: !1, children: [] };
}
function wC(t) {
  const e = (n) => ({
    id: n.id,
    type: n.completed ? "checkListItem" : n.collapsed && n.children.length ? "toggleListItem" : "bulletListItem",
    props: n.completed ? { checked: !0 } : {},
    content: n.text ? [{ type: "text", text: n.text, styles: {} }] : [],
    children: n.children.map(e)
  });
  return JSON.stringify({ blocks: t.nodes.map(e) });
}
function _C(t) {
  const e = /* @__PURE__ */ new Set(), n = (i) => {
    let s = typeof i.id == "string" && gg.test(i.id) && !e.has(i.id) ? i.id : Qc();
    for (; e.has(s); ) s = Qc();
    e.add(s);
    const a = Id(i.props) || {};
    return {
      id: s,
      text: fv({ type: i.type, props: a, content: i.content }),
      completed: i.type === "checkListItem" && a.checked === !0,
      collapsed: i.type === "toggleListItem" && !!i.children?.length,
      children: (i.children || []).map(n)
    };
  }, r = t.map(n);
  return { schema_version: 1, nodes: r.length ? r : [Iv("未命名主题")] };
}
const fc = 1600, pc = 900, Sv = ["rectangle", "rounded_rectangle", "ellipse", "triangle", "diamond", "hexagon", "star", "arrow_right", "callout", "line"], Ev = ["column", "bar", "line", "area", "pie", "donut"], ko = {
  forest: {
    label: "知绿",
    master: { background_color: "#FFFFFF", text_color: "#17221C", accent_color: "#176B52", muted_color: "#66746C", font_family: "Arial", footer: "", show_slide_number: !0 }
  },
  midnight: {
    label: "深夜",
    master: { background_color: "#101D19", text_color: "#F5F8F6", accent_color: "#59C89B", muted_color: "#A8B7AF", font_family: "Arial", footer: "", show_slide_number: !0 }
  },
  sunrise: {
    label: "晨光",
    master: { background_color: "#FFF9F1", text_color: "#31271E", accent_color: "#C85D35", muted_color: "#806F61", font_family: "Arial", footer: "", show_slide_number: !0 }
  }
}, xv = [
  { id: "title", label: "标题页" },
  { id: "section", label: "章节页" },
  { id: "agenda", label: "目录页" },
  { id: "title_content", label: "标题与正文" },
  { id: "two_column", label: "双栏" },
  { id: "quote", label: "引言页" },
  { id: "image_focus", label: "大图" },
  { id: "blank", label: "空白" }
];
function gc(t, e, n) {
  return { id: t, type: e, ...n };
}
function Nv(t, e, n) {
  const r = (s, a) => gc(`${t}-${s}`, "text", a), i = { x: 112, y: 88, width: 1376, height: 118, rotation: 0, text: "演示标题", font_size: 56, font_weight: "bold", color: n.text_color, align: "left" };
  switch (e) {
    case "title":
      return [
        r("title", { ...i, x: 168, y: 260, width: 1264, height: 150, font_size: 72, align: "center" }),
        r("subtitle", { x: 260, y: 438, width: 1080, height: 78, rotation: 0, text: "补充一句清晰的说明", font_size: 28, font_weight: "normal", color: n.muted_color, align: "center" })
      ];
    case "section":
      return [
        gc(`${t}-accent`, "shape", { x: 170, y: 242, width: 18, height: 248, rotation: 0, shape: "rounded_rectangle", fill_color: n.accent_color, stroke_color: n.accent_color, stroke_width: 0, text: "", font_size: 18, font_weight: "normal", color: n.background_color, align: "center" }),
        r("eyebrow", { x: 234, y: 245, width: 1120, height: 46, rotation: 0, text: "01 章节", font_size: 24, font_weight: "bold", color: n.accent_color, align: "left" }),
        r("title", { x: 228, y: 310, width: 1180, height: 160, rotation: 0, text: "章节标题", font_size: 72, font_weight: "bold", color: n.text_color, align: "left" }),
        r("subtitle", { x: 234, y: 492, width: 980, height: 64, rotation: 0, text: "用一句话说明这一章节的核心主题", font_size: 26, font_weight: "normal", color: n.muted_color, align: "left" })
      ];
    case "agenda":
      return [
        r("title", i),
        r("agenda", { x: 168, y: 260, width: 1264, height: 420, rotation: 0, text: `01  背景与目标

02  方案与执行

03  数据与结论`, font_size: 38, font_weight: "normal", color: n.text_color, align: "left" })
      ];
    case "two_column":
      return [
        r("title", i),
        r("left", { x: 112, y: 260, width: 632, height: 450, rotation: 0, text: `左侧要点

• 观点一
• 观点二`, font_size: 30, font_weight: "normal", color: n.text_color, align: "left" }),
        r("right", { x: 856, y: 260, width: 632, height: 450, rotation: 0, text: `右侧要点

• 观点一
• 观点二`, font_size: 30, font_weight: "normal", color: n.text_color, align: "left" })
      ];
    case "image_focus":
      return [
        r("title", i),
        gc(`${t}-media-placeholder`, "shape", { x: 112, y: 246, width: 1376, height: 510, rotation: 0, shape: "rectangle", fill_color: n.muted_color, stroke_color: n.accent_color, stroke_width: 2, text: "从工具栏插入图片或视频", font_size: 28, font_weight: "normal", color: n.background_color, align: "center" })
      ];
    case "quote":
      return [
        r("mark", { x: 170, y: 165, width: 180, height: 150, rotation: 0, text: "“", font_size: 160, font_weight: "bold", color: n.accent_color, align: "left" }),
        r("quote", { x: 260, y: 250, width: 1080, height: 270, rotation: 0, text: "把最有力量的一句话放在这里，让观点成为这一页的视觉中心。", font_size: 52, font_weight: "bold", color: n.text_color, align: "left" }),
        r("source", { x: 270, y: 590, width: 980, height: 52, rotation: 0, text: "— 引用来源", font_size: 24, font_weight: "normal", color: n.muted_color, align: "left" })
      ];
    case "blank":
      return [];
    default:
      return [
        r("title", i),
        r("content", { x: 112, y: 252, width: 1376, height: 480, rotation: 0, text: `• 输入第一个要点
• 输入第二个要点`, font_size: 32, font_weight: "normal", color: n.text_color, align: "left" })
      ];
  }
}
function Dv(t, e, n, r) {
  return {
    id: t,
    title: e === 0 ? "演示标题" : `幻灯片 ${e + 1}`,
    layout: n,
    background_color: "",
    notes: "",
    elements: Nv(t, n, r),
    files: {}
  };
}
const yg = {
  schema_version: 1,
  theme: "forest",
  master: { ...ko.forest.master },
  slides: [Dv("slide-1", 0, "title", ko.forest.master)]
}, Kt = /^#[0-9a-fA-F]{6}$/, Bv = /^knowledge-document:kdoc_[a-f0-9]{32}$/, Sd = /^[^\u0000-\u001f\u007f]{1,128}$/, Pv = new Set(xv.map((t) => t.id)), Mv = new Set(Object.keys(ko)), zv = /* @__PURE__ */ new Set(["Arial", "Aptos", "Helvetica", "Georgia", "Times New Roman"]), Rv = /* @__PURE__ */ new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "video/mp4", "video/webm"]), Tv = new Set(Sv), Fv = new Set(Ev);
function On(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function fr(t, e) {
  const n = new Set(e);
  return Object.keys(t).every((r) => n.has(r));
}
function nn(t, e, n) {
  return typeof t == "number" && Number.isFinite(t) && t >= e && t <= n;
}
function Jt(t, e, n = !0) {
  return typeof t == "string" && t.length <= e && (!n || t.trim().length > 0) && !t.includes("\0");
}
function Lv(t) {
  return !On(t) || !fr(t, ["background_color", "text_color", "accent_color", "muted_color", "font_family", "footer", "show_slide_number"]) ? !1 : Kt.test(String(t.background_color)) && Kt.test(String(t.text_color)) && Kt.test(String(t.accent_color)) && Kt.test(String(t.muted_color)) && typeof t.font_family == "string" && zv.has(t.font_family) && Jt(t.footer, 512, !1) && typeof t.show_slide_number == "boolean";
}
function Ov(t, e) {
  return !On(t) || !fr(t, ["id", "mime_type", "document_ref", "filename"]) ? !1 : t.id === e && typeof t.id == "string" && Sd.test(t.id) && typeof t.mime_type == "string" && Rv.has(t.mime_type) && typeof t.document_ref == "string" && Bv.test(t.document_ref) && Jt(t.filename, 512);
}
function Uv(t, e) {
  if (!On(t) || !fr(t, ["id", "type", "x", "y", "width", "height", "rotation", "text", "font_size", "font_weight", "color", "align", "shape", "fill_color", "stroke_color", "stroke_width", "asset_id", "fit", "table", "chart", "formula", "language", "source"]) || typeof t.id != "string" || !Sd.test(t.id) || !["text", "shape", "image", "video", "table", "chart", "formula", "code"].includes(String(t.type)) || !nn(t.x, 0, fc) || !nn(t.y, 0, pc) || !nn(t.width, 1, fc) || !nn(t.height, 1, pc) || !nn(t.rotation, -360, 360) || Number(t.x) + Number(t.width) > fc || Number(t.y) + Number(t.height) > pc) return !1;
  if (t.type === "text")
    return Jt(t.text, 32768, !1) && nn(t.font_size, 8, 240) && (t.font_weight === "normal" || t.font_weight === "bold") && Kt.test(String(t.color)) && ["left", "center", "right"].includes(String(t.align));
  if (t.type === "shape")
    return typeof t.shape == "string" && Tv.has(t.shape) && Kt.test(String(t.fill_color)) && Kt.test(String(t.stroke_color)) && nn(t.stroke_width, 0, 24) && Jt(t.text, 32768, !1) && nn(t.font_size, 8, 240) && (t.font_weight === "normal" || t.font_weight === "bold") && Kt.test(String(t.color)) && ["left", "center", "right"].includes(String(t.align));
  if (t.type === "table") {
    if (!On(t.table) || !fr(t.table, ["rows", "header"]) || typeof t.table.header != "boolean" || !Array.isArray(t.table.rows) || t.table.rows.length < 1 || t.table.rows.length > 50) return !1;
    const r = Array.isArray(t.table.rows[0]) ? t.table.rows[0].length : 0;
    return r > 0 && r <= 20 && t.table.rows.every((i) => Array.isArray(i) && i.length === r && i.every((s) => Jt(s, 2048, !1)));
  }
  if (t.type === "chart") {
    if (!On(t.chart) || !fr(t.chart, ["type", "categories", "series"])) return !1;
    const r = t.chart, i = r.categories, s = r.series;
    return typeof r.type != "string" || !Fv.has(r.type) || !Array.isArray(i) || i.length < 1 || i.length > 50 || !i.every((a) => Jt(a, 256)) ? !1 : Array.isArray(s) && s.length > 0 && s.length <= 12 && s.every((a) => On(a) && fr(a, ["name", "values"]) && Jt(a.name, 256) && Array.isArray(a.values) && a.values.length === i.length && a.values.every((l) => nn(l, -1e12, 1e12)));
  }
  if (t.type === "formula") return Jt(t.formula, 8192) && nn(t.font_size, 8, 240) && Kt.test(String(t.color));
  if (t.type === "code") return Jt(t.language, 64) && /^[A-Za-z0-9_+#.-]{1,64}$/.test(t.language) && Jt(t.source, 32768, !1) && nn(t.font_size, 8, 120) && Kt.test(String(t.color)) && Kt.test(String(t.fill_color));
  const n = typeof t.asset_id == "string" ? e[t.asset_id] : void 0;
  return !!n && (t.fit === "contain" || t.fit === "cover") && (t.type === "image" ? n.mime_type.startsWith("image/") : n.mime_type.startsWith("video/"));
}
function wg(t) {
  if (!On(t) || !fr(t, ["schema_version", "theme", "master", "slides"]) || t.schema_version !== 1 || typeof t.theme != "string" || !Mv.has(t.theme) || !Lv(t.master) || !Array.isArray(t.slides) || t.slides.length < 1 || t.slides.length > 200) return !1;
  const e = /* @__PURE__ */ new Set();
  for (const n of t.slides) {
    if (!On(n) || !fr(n, ["id", "title", "layout", "background_color", "notes", "elements", "files"]) || typeof n.id != "string" || !Sd.test(n.id) || e.has(n.id) || !Jt(n.title, 512) || typeof n.layout != "string" || !Pv.has(n.layout) || typeof n.background_color != "string" || n.background_color !== "" && !Kt.test(n.background_color) || !Jt(n.notes, 32768, !1) || !On(n.files) || Object.keys(n.files).length > 64 || !Array.isArray(n.elements) || n.elements.length > 256) return !1;
    const r = {};
    for (const [s, a] of Object.entries(n.files)) {
      if (!Ov(a, s)) return !1;
      r[s] = a;
    }
    const i = /* @__PURE__ */ new Set();
    for (const s of n.elements) {
      if (!Uv(s, r) || i.has(s.id)) return !1;
      i.add(s.id);
    }
    e.add(n.id);
  }
  return !0;
}
function tf() {
  return JSON.parse(JSON.stringify(yg));
}
function kC(t) {
  try {
    const e = JSON.parse(t);
    return wg(e) ? e : tf();
  } catch {
    return tf();
  }
}
function vC(t) {
  if (!wg(t)) throw Error("幻灯片内容不符合 canonical schema。");
  return JSON.stringify(t);
}
function AC(t, e) {
  const n = { ...ko[e].master, footer: t.master.footer, show_slide_number: t.master.show_slide_number };
  return {
    ...t,
    theme: e,
    master: n,
    slides: t.slides.map((r) => ({
      ...r,
      elements: r.elements.map((i) => i.type === "text" ? { ...i, color: i.color === t.master.muted_color ? n.muted_color : n.text_color } : i.type === "shape" ? { ...i, fill_color: i.fill_color === t.master.muted_color ? n.muted_color : i.fill_color, stroke_color: i.stroke_color === t.master.accent_color ? n.accent_color : i.stroke_color, color: i.color === t.master.background_color ? n.background_color : n.text_color } : i.type === "formula" || i.type === "code" ? { ...i, color: i.color === t.master.muted_color ? n.muted_color : n.text_color, fill_color: i.type === "code" && i.fill_color === t.master.background_color ? n.background_color : i.fill_color } : i)
    }))
  };
}
const _g = ["emerald", "ocean", "sunset", "mono"], $v = ["side", "left", "right", "down"], Qv = ["free", "horizontal", "vertical"], jv = [
  "start",
  "end",
  "process",
  "decision",
  "subprocess",
  "user_task",
  "service_task",
  "data",
  "database",
  "document",
  "manual_input",
  "preparation",
  "delay",
  "connector",
  "annotation"
], qv = ["polyline", "line", "bezier"], Hv = new TextEncoder(), Gv = /^[A-Za-z0-9][A-Za-z0-9:_-]{0,127}$/, Jv = /^#[0-9a-fA-F]{6}$/, Vv = new Set(jv), Kv = new Set(qv), Wv = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
function Br(t, e) {
  if (!t || typeof t != "object" || Array.isArray(t)) return !1;
  const n = Object.keys(t);
  return n.length === e.length && n.every((r) => e.includes(r));
}
function Xv(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return !1;
  const e = ["id", "text", "expanded", "direction", "style", "children"], n = [...e, "tags", "note", "link"], r = Object.keys(t);
  return e.every((i) => r.includes(i)) && r.every((i) => n.includes(i));
}
function pr(t, e = 4096) {
  return typeof t == "string" && Hv.encode(t).byteLength <= e && !Wv.test(t);
}
function gr(t) {
  return typeof t == "string" && Gv.test(t);
}
function vo(t) {
  return typeof t == "string" && Jv.test(t);
}
function Ka(t, e, n) {
  return typeof t == "number" && Number.isFinite(t) && t >= e && t <= n;
}
function kg(t) {
  return Br(t, ["color", "background_color", "font_weight"]) && vo(t.color) && vo(t.background_color) && (t.font_weight === "normal" || t.font_weight === "bold");
}
const Tn = Object.freeze({ color: "#17332b", background_color: "#e8f5f0", font_weight: "normal" }), vg = {
  schema_version: 1,
  theme: "emerald",
  layout: "side",
  compact: !0,
  root: { id: "root", text: "中心主题", expanded: !0, direction: "auto", style: { color: "#ffffff", background_color: "#00856a", font_weight: "bold" }, children: [] },
  relations: []
}, Ag = {
  schema_version: 1,
  theme: "emerald",
  layout: "free",
  grid: !0,
  nodes: [{ id: "start", type: "start", x: 240, y: 160, text: "开始", style: { ...Tn } }],
  edges: []
};
function Cg(t) {
  if (!pr(t, 8 * 1024 * 1024)) throw new Error("图表内容超出允许范围。");
  const e = JSON.parse(t);
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("图表内容结构无效。");
  return e;
}
function Ig(t, e, n, r) {
  if (n > 64 || !Xv(t)) throw new Error("思维导图节点结构无效。");
  if (!gr(t.id) || e.has(t.id) || !pr(t.text) || typeof t.expanded != "boolean" || !["auto", "left", "right"].includes(String(t.direction)) || !kg(t.style) || !Array.isArray(t.children)) throw new Error("思维导图节点内容无效。");
  if (t.tags !== void 0 && (!Array.isArray(t.tags) || t.tags.length > 12 || new Set(t.tags).size !== t.tags.length || !t.tags.every((i) => pr(i, 64) && i.trim()))) throw new Error("思维导图节点标签无效。");
  if (t.note !== void 0 && !pr(t.note, 4096)) throw new Error("思维导图节点备注无效。");
  if (t.link !== void 0) {
    if (!pr(t.link, 2048)) throw new Error("思维导图节点链接无效。");
    if (t.link)
      try {
        const i = new URL(t.link);
        if (i.protocol !== "http:" && i.protocol !== "https:" || i.username || i.password) throw new Error();
      } catch {
        throw new Error("思维导图节点链接无效。");
      }
  }
  if (e.add(t.id), r.value += 1, r.value > 2e4) throw new Error("思维导图节点过多。");
  return {
    id: t.id,
    text: t.text,
    expanded: t.expanded,
    direction: t.direction,
    style: { ...t.style },
    ...t.tags !== void 0 ? { tags: [...t.tags] } : {},
    ...t.note !== void 0 ? { note: t.note } : {},
    ...t.link !== void 0 ? { link: t.link } : {},
    children: t.children.map((i) => Ig(i, e, n + 1, r))
  };
}
function Sg(t) {
  const e = Cg(t);
  if (!Br(e, ["schema_version", "theme", "layout", "compact", "root", "relations"]) || e.schema_version !== 1 || !_g.includes(e.theme) || !$v.includes(e.layout) || typeof e.compact != "boolean" || !Array.isArray(e.relations)) throw new Error("思维导图 canonical schema 无效。");
  const n = /* @__PURE__ */ new Set(), r = Ig(e.root, n, 1, { value: 0 });
  if (e.relations.length > 2e4) throw new Error("思维导图关系过多。");
  const i = /* @__PURE__ */ new Set(), s = e.relations.map((a) => {
    if (!Br(a, ["id", "from", "to", "label", "bidirectional", "color", "width", "dashed"]) || !gr(a.id) || n.has(a.id) || i.has(a.id) || !gr(a.from) || !gr(a.to) || a.from === a.to || !n.has(a.from) || !n.has(a.to) || !pr(a.label, 1024) || typeof a.bidirectional != "boolean" || !vo(a.color) || !Ka(a.width, 1, 12) || typeof a.dashed != "boolean") throw new Error("思维导图关系无效。");
    return i.add(a.id), { id: a.id, from: a.from, to: a.to, label: a.label, bidirectional: a.bidirectional, color: a.color, width: a.width, dashed: a.dashed };
  });
  return { schema_version: 1, theme: e.theme, layout: e.layout, compact: e.compact, root: r, relations: s };
}
function CC(t) {
  try {
    return Sg(t);
  } catch {
    return structuredClone(vg);
  }
}
function IC(t) {
  return JSON.stringify(Sg(JSON.stringify(t)));
}
function Eg(t) {
  const e = Cg(t);
  if (!Br(e, ["schema_version", "theme", "layout", "grid", "nodes", "edges"]) || e.schema_version !== 1 || !_g.includes(e.theme) || !Qv.includes(e.layout) || typeof e.grid != "boolean" || !Array.isArray(e.nodes) || !Array.isArray(e.edges) || e.nodes.length > 2e4 || e.edges.length > 4e4) throw new Error("流程图 canonical schema 无效。");
  const n = /* @__PURE__ */ new Set(), r = e.nodes.map((a) => {
    if (!Br(a, ["id", "type", "x", "y", "text", "style"]) || !gr(a.id) || n.has(a.id) || !Vv.has(String(a.type)) || !Ka(a.x, -1e7, 1e7) || !Ka(a.y, -1e7, 1e7) || !pr(a.text) || !kg(a.style)) throw new Error("流程图节点无效。");
    return n.add(a.id), { id: a.id, type: a.type, x: a.x, y: a.y, text: a.text, style: { ...a.style } };
  }), i = /* @__PURE__ */ new Set(), s = e.edges.map((a) => {
    if (!Br(a, ["id", "source", "target", "label", "type", "style"]) || !gr(a.id) || n.has(a.id) || i.has(a.id) || !gr(a.source) || !gr(a.target) || a.source === a.target || !n.has(a.source) || !n.has(a.target) || !pr(a.label, 1024) || !Kv.has(String(a.type)) || !Br(a.style, ["color", "width", "dashed"]) || !vo(a.style.color) || !Ka(a.style.width, 1, 12) || typeof a.style.dashed != "boolean") throw new Error("流程图连线无效。");
    return i.add(a.id), { id: a.id, source: a.source, target: a.target, label: a.label, type: a.type, style: { color: a.style.color, width: a.style.width, dashed: a.style.dashed } };
  });
  return { schema_version: 1, theme: e.theme, layout: e.layout, grid: e.grid, nodes: r, edges: s };
}
function SC(t) {
  try {
    return Eg(t);
  } catch {
    return structuredClone(Ag);
  }
}
function EC(t) {
  return JSON.stringify(Eg(JSON.stringify(t)));
}
const xC = {
  brainstorming: {
    schema_version: 1,
    theme: "emerald",
    layout: "side",
    compact: !0,
    relations: [],
    root: { id: "root", text: "头脑风暴", expanded: !0, direction: "auto", style: { color: "#ffffff", background_color: "#00856a", font_weight: "bold" }, children: ["目标", "想法", "行动"].map((t, e) => ({ id: `idea-${e + 1}`, text: t, expanded: !0, direction: "auto", style: { ...Tn }, children: [] })) }
  },
  swot: {
    schema_version: 1,
    theme: "ocean",
    layout: "side",
    compact: !0,
    relations: [],
    root: { id: "root", text: "SWOT 分析", expanded: !0, direction: "auto", style: { color: "#ffffff", background_color: "#2563eb", font_weight: "bold" }, children: ["优势", "劣势", "机会", "威胁"].map((t, e) => ({ id: `swot-${e + 1}`, text: t, expanded: !0, direction: "auto", style: { color: "#17324d", background_color: "#eaf2ff", font_weight: "normal" }, children: [] })) }
  }
}, NC = {
  approval: {
    schema_version: 1,
    theme: "emerald",
    layout: "horizontal",
    grid: !0,
    nodes: [
      { id: "start", type: "start", x: 160, y: 220, text: "提交", style: { ...Tn } },
      { id: "review", type: "user_task", x: 440, y: 220, text: "审批", style: { ...Tn } },
      { id: "decision", type: "decision", x: 720, y: 220, text: "通过？", style: { color: "#6b3f00", background_color: "#fff3cd", font_weight: "bold" } },
      { id: "done", type: "end", x: 1e3, y: 220, text: "完成", style: { ...Tn } }
    ],
    edges: [
      { id: "edge-1", source: "start", target: "review", label: "", type: "polyline", style: { color: "#789087", width: 2, dashed: !1 } },
      { id: "edge-2", source: "review", target: "decision", label: "", type: "polyline", style: { color: "#789087", width: 2, dashed: !1 } },
      { id: "edge-3", source: "decision", target: "done", label: "是", type: "polyline", style: { color: "#789087", width: 2, dashed: !1 } }
    ]
  },
  incident: {
    schema_version: 1,
    theme: "sunset",
    layout: "vertical",
    grid: !0,
    nodes: [
      { id: "alert", type: "start", x: 420, y: 100, text: "告警", style: { color: "#7c2d12", background_color: "#ffedd5", font_weight: "bold" } },
      { id: "triage", type: "user_task", x: 420, y: 300, text: "分级与定位", style: { color: "#7c2d12", background_color: "#fff7ed", font_weight: "normal" } },
      { id: "recover", type: "service_task", x: 420, y: 500, text: "恢复服务", style: { color: "#7c2d12", background_color: "#fff7ed", font_weight: "normal" } }
    ],
    edges: [
      { id: "edge-1", source: "alert", target: "triage", label: "", type: "polyline", style: { color: "#c2410c", width: 2, dashed: !1 } },
      { id: "edge-2", source: "triage", target: "recover", label: "", type: "polyline", style: { color: "#c2410c", width: 2, dashed: !1 } }
    ]
  },
  data_pipeline: {
    schema_version: 1,
    theme: "ocean",
    layout: "horizontal",
    grid: !0,
    nodes: [
      { id: "source", type: "database", x: 140, y: 220, text: "业务数据库", style: { color: "#17324d", background_color: "#eaf2ff", font_weight: "bold" } },
      { id: "extract", type: "data", x: 420, y: 220, text: "抽取数据", style: { color: "#17324d", background_color: "#eaf2ff", font_weight: "normal" } },
      { id: "transform", type: "subprocess", x: 700, y: 220, text: "清洗与转换", style: { color: "#17324d", background_color: "#eaf2ff", font_weight: "normal" } },
      { id: "warehouse", type: "database", x: 980, y: 220, text: "数据仓库", style: { color: "#17324d", background_color: "#eaf2ff", font_weight: "bold" } }
    ],
    edges: [
      { id: "edge-1", source: "source", target: "extract", label: "读取", type: "polyline", style: { color: "#3b82f6", width: 2, dashed: !1 } },
      { id: "edge-2", source: "extract", target: "transform", label: "原始数据", type: "polyline", style: { color: "#3b82f6", width: 2, dashed: !1 } },
      { id: "edge-3", source: "transform", target: "warehouse", label: "入仓", type: "polyline", style: { color: "#3b82f6", width: 2, dashed: !1 } }
    ]
  },
  customer_service: {
    schema_version: 1,
    theme: "emerald",
    layout: "vertical",
    grid: !0,
    nodes: [
      { id: "request", type: "manual_input", x: 420, y: 100, text: "客户提交问题", style: { ...Tn } },
      { id: "agent", type: "user_task", x: 420, y: 280, text: "客服受理", style: { ...Tn } },
      { id: "known", type: "decision", x: 420, y: 470, text: "已有方案？", style: { color: "#6b3f00", background_color: "#fff3cd", font_weight: "bold" } },
      { id: "auto", type: "service_task", x: 700, y: 470, text: "自动回复", style: { ...Tn } },
      { id: "finish", type: "end", x: 420, y: 660, text: "关闭工单", style: { ...Tn } }
    ],
    edges: [
      { id: "edge-1", source: "request", target: "agent", label: "", type: "polyline", style: { color: "#789087", width: 2, dashed: !1 } },
      { id: "edge-2", source: "agent", target: "known", label: "", type: "polyline", style: { color: "#789087", width: 2, dashed: !1 } },
      { id: "edge-3", source: "known", target: "auto", label: "是", type: "bezier", style: { color: "#789087", width: 2, dashed: !1 } },
      { id: "edge-4", source: "known", target: "finish", label: "否，人工处理", type: "polyline", style: { color: "#789087", width: 2, dashed: !0 } },
      { id: "edge-5", source: "auto", target: "finish", label: "", type: "bezier", style: { color: "#789087", width: 2, dashed: !1 } }
    ]
  }
};
function DC(t, e) {
  if (e === "free" || t.nodes.length < 2) return { ...t, layout: e };
  const n = new Map(t.nodes.map((h) => [h.id, 0])), r = new Map(t.nodes.map((h) => [h.id, []]));
  for (const h of t.edges)
    n.set(h.target, (n.get(h.target) || 0) + 1), r.get(h.source)?.push(h.target);
  const i = t.nodes.filter((h) => n.get(h.id) === 0).map((h) => h.id), s = (i.length ? i : [t.nodes[0].id]).map((h) => ({ id: h, level: 0 })), a = /* @__PURE__ */ new Map();
  for (; s.length; ) {
    const h = s.shift();
    if (!((a.get(h.id) ?? -1) >= h.level)) {
      a.set(h.id, h.level);
      for (const b of r.get(h.id) || []) s.push({ id: b, level: h.level + 1 });
    }
  }
  t.nodes.forEach((h) => {
    a.has(h.id) || a.set(h.id, 0);
  });
  const l = /* @__PURE__ */ new Map(), d = t.nodes.map((h) => {
    const b = a.get(h.id) || 0, m = l.get(b) || 0;
    return l.set(b, m + 1), { ...h, x: e === "horizontal" ? 180 + b * 280 : 180 + m * 260, y: e === "horizontal" ? 140 + m * 150 : 120 + b * 190 };
  });
  return { ...t, layout: e, nodes: d };
}
function BC(t) {
  if ("root" in t) {
    const e = [], n = (r, i) => {
      e.push(`${"  ".repeat(i)}${r.text}`), r.note && e.push(`${"  ".repeat(i + 1)}${r.note}`), r.tags?.length && e.push(`${"  ".repeat(i + 1)}${r.tags.map((s) => `#${s}`).join(" ")}`), r.children.forEach((s) => n(s, i + 1));
    };
    return n(t.root, 0), t.relations.forEach((r) => {
      r.label.trim() && e.push(r.label);
    }), e.join(`
`);
  }
  return [...t.nodes.map((e) => e.text), ...t.edges.map((e) => e.label)].filter((e) => e.trim()).join(`
`);
}
function PC(t, e) {
  const n = URL.createObjectURL(t), r = document.createElement("a");
  r.href = n, r.download = e, r.style.display = "none", document.body.append(r), r.click(), window.setTimeout(() => {
    r.remove(), URL.revokeObjectURL(n);
  }, 1e3);
}
const mt = {
  create: 1,
  edit: 2,
  read: 4,
  preview: 8,
  import: 16,
  realtime: 32,
  search: 64,
  comment: 128,
  version: 256
}, Zv = Hn(() => import("./BlockNoteEditor-BO8p41Ok.js").then((t) => ({ default: t.DocumentEditor }))), Yv = Hn(() => import("./MindNoteEditor-obqsKA7p.js")), eA = Hn(() => import("./GridEditor-B7CjBPYn.js").then((t) => ({ default: t.GridEditor }))), tA = Hn(() => import("./SpreadsheetEditor-BOJTa3Y2.js").then((t) => ({ default: t.SpreadsheetEditor }))), nA = Hn(() => import("./PresentationEditor-9r1qe_km.js")), rA = Hn(() => import("./CanvasEditor-PesCxJaZ.js").then((t) => t.J).then((t) => ({ default: t.WhiteboardEditor }))), iA = Hn(() => import("./FormEditor-DobF5HSK.js").then((t) => ({ default: t.FormEditor }))), sA = Hn(() => import("./MindMapEditor-CJdnHggZ.js").then((t) => ({ default: t.MindMapEditor }))), aA = Hn(() => import("./FlowchartEditor-D_AaqlLg.js").then((t) => ({ default: t.FlowchartEditor })));
function mc({ body: t }) {
  let e = "文件引用";
  try {
    e = JSON.parse(t).title || e;
  } catch {
  }
  return Oa(
    "div",
    { className: "knowledge-file-reference-editor" },
    Oa("strong", null, e),
    Oa("p", null, "文件内容由受权原件提供，不在页面正文中复制。")
  );
}
function oA() {
  return {
    schema_version: 1,
    workbook: {
      id: "workbook-1",
      name: "工作表",
      appVersion: "1.1.0",
      locale: "zhCN",
      dateSystem: "date1900",
      styles: {},
      sheetOrder: ["sheet-1"],
      sheets: {
        "sheet-1": {
          id: "sheet-1",
          name: "工作表 1",
          tabColor: "",
          hidden: 0,
          rowCount: 1e3,
          columnCount: 20,
          zoomRatio: 1,
          freeze: { xSplit: 0, ySplit: 0, startRow: -1, startColumn: -1 },
          scrollTop: 0,
          scrollLeft: 0,
          defaultColumnWidth: 88,
          defaultRowHeight: 24,
          mergeData: [],
          cellData: {},
          rowData: {},
          columnData: {},
          showGridlines: 1,
          rowHeader: { width: 46, hidden: 0 },
          columnHeader: { height: 20, hidden: 0 },
          rightToLeft: 0
        }
      },
      resources: []
    },
    charts: [],
    pivots: [],
    protected_ranges: []
  };
}
const xg = mt.create | mt.edit | mt.read | mt.preview | mt.search | mt.comment | mt.version;
function Rn(t) {
  return Object.freeze({ ...t, capabilities: t.capabilities ?? xg, createAction: { kind: "native" }, readonlyRenderer: t.editor, previewRenderer: t.editor, importer: null, trusted: !0 });
}
const Ng = [
  Rn({ id: "document", label: "文档", description: "富文本、内容块与内嵌应用", defaultTitle: "未命名文档", icon: Uu, capabilities: xg | mt.realtime, createContent: () => JSON.stringify({ blocks: [] }), editor: Zv }),
  Rn({ id: "multidimensional_table", label: "多维表格", description: "22 类字段与六种业务视图", defaultTitle: "未命名多维表格", icon: gb, createContent: () => JSON.stringify({ schema_version: 1, fields: [{ id: "title", name: "标题", type: "text", required: !0 }], records: [], views: [{ id: "view-grid", name: "表格", type: "grid", row_height: "normal" }] }), editor: eA }),
  Rn({ id: "spreadsheet", label: "表格", description: "公式、透视与十类数据图表", defaultTitle: "未命名表格", icon: mb, createContent: () => JSON.stringify(oA()), editor: tA }),
  Rn({ id: "presentation", label: "幻灯片", description: "版式、图表、表格、公式与媒体", defaultTitle: "未命名幻灯片", icon: bb, createContent: () => JSON.stringify(yg), editor: nA }),
  Rn({ id: "form", label: "问卷", description: "15 类题型、条件逻辑与答卷统计", defaultTitle: "未命名问卷", icon: yb, createContent: () => JSON.stringify(fg()), editor: iA }),
  Rn({ id: "mind_note", label: "思维笔记", description: "大纲、优先级、标签与截止日期", defaultTitle: "未命名思维笔记", icon: Tf, createContent: () => JSON.stringify($c), editor: Yv }),
  Rn({ id: "whiteboard", label: "画板", description: "自由卡片与连接关系", defaultTitle: "未命名画板", icon: wb, createContent: () => JSON.stringify(Lc), editor: rA }),
  Rn({ id: "mind_map", label: "思维导图", description: "主题、布局、标签、备注与链接", defaultTitle: "未命名思维导图", icon: _b, createContent: () => JSON.stringify(vg), editor: sA }),
  Rn({ id: "flowchart", label: "流程图", description: "15 类语义节点与三类连接", defaultTitle: "未命名流程图", icon: kb, createContent: () => JSON.stringify(Ag), editor: aA }),
  Object.freeze({ id: "file", label: "文件", description: "受权原文件与安全预览", defaultTitle: "未命名文件", icon: Uu, capabilities: mt.edit | mt.read | mt.preview | mt.import | mt.search | mt.comment | mt.version, createAction: null, createContent: null, editor: mc, readonlyRenderer: mc, previewRenderer: mc, importer: { kind: "document-upload", accept: "library-policy" }, trusted: !0 })
];
function lA(t = Ng) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (!n.id || e.has(n.id) || !n.label || !n.defaultTitle || !n.icon || !n.editor || !n.readonlyRenderer || !n.previewRenderer || !n.capabilities || n.trusted !== !0)
      throw new Error(`Invalid page type definition: ${n.id || "<empty>"}`);
    if (!!(n.capabilities & mt.create) != (n.createAction?.kind === "native" && !!n.createContent) || !!(n.capabilities & mt.import) != !!n.importer)
      throw new Error(`Inconsistent page type capabilities: ${n.id}`);
    e.add(n.id);
  }
  return !0;
}
lA();
const Rs = Object.freeze([...Ng]), cA = Object.freeze(Object.fromEntries(Rs.map((t) => [t.id, t]))), dA = Object.freeze(Rs.filter((t) => t.createAction?.kind === "native").map((t) => t.id)), uA = Object.freeze(Rs.filter((t) => t.capabilities & mt.import)), Vt = Object.freeze(Object.fromEntries(Rs.map((t) => [t.id, { label: t.label, description: t.description, title: t.defaultTitle }])));
function Dg(t) {
  const e = cA[t];
  if (!e) throw new Error(`Unregistered page type: ${t}`);
  return e;
}
function Rt({ type: t, size: e = 16 }) {
  return Oa(Dg(t).icon, { size: e, "aria-hidden": !0 });
}
function di({ type: t, ...e }) {
  const n = Dg(t), r = e.readOnly ? n.readonlyRenderer : n.editor;
  return /* @__PURE__ */ c(pb, { fallback: /* @__PURE__ */ c("div", { className: "knowledge-editor-loading", role: "status", children: "正在载入编辑器…" }), children: /* @__PURE__ */ c(r, { ...e }) });
}
function hA(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return null;
  const e = t;
  return typeof e.code != "string" || !e.code.trim() || typeof e.message != "string" || !e.message.trim() || typeof e.request_id != "string" || e.params !== void 0 && (!e.params || typeof e.params != "object" || Array.isArray(e.params) || Object.values(e.params).some((n) => typeof n != "string")) ? null : {
    code: e.code,
    message: e.message,
    ...e.params === void 0 ? {} : { params: e.params },
    request_id: e.request_id
  };
}
async function fA(t) {
  return hA(await t.json().catch(() => {
  }));
}
const pA = 512 * 1024, gA = 8 * 1024 * 1024, mA = 64 * 1024 * 1024, bA = 128 * 1024 * 1024, yA = "X-Domainry-File-SHA256", Bg = /* @__PURE__ */ new Set(["txt", "md", "rst", "html", "htm", "csv", "json", "jsonl", "py", "js", "ts", "tsx", "jsx", "java", "go", "rs", "c", "h", "cpp", "hpp", "cs", "rb", "php", "kt", "swift", "scala", "sh"]), wA = /* @__PURE__ */ new Set(["pdf", "docx", "pptx", "xlsx", "xlsm", "png", "jpg", "jpeg", "gif", "bmp", "webp", "mp3", "wav", "ogg", "flac", "m4a", "aac", "mp4", "mov", "webm", "avi"]), _A = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xlsm: "application/vnd.ms-excel.sheet.macroEnabled.12",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  bmp: "image/bmp",
  webp: "image/webp",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  flac: "audio/flac",
  m4a: "audio/mp4",
  aac: "audio/aac",
  mp4: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
  avi: "video/x-msvideo"
};
function Qo(t) {
  return t.split(".").at(-1)?.toLowerCase() || "";
}
function kA(t) {
  return Bg.has(t);
}
function Pg(t) {
  const e = Qo(t);
  return Bg.has(e) || wA.has(e);
}
function vA(t) {
  const e = t?.match(/filename\*=UTF-8''([^;]+)/i)?.[1], n = t?.match(/filename="((?:[^"\\]|\\.)*)"/i)?.[1]?.replace(/\\(.)/g, "$1") || t?.match(/filename=([^;\s]+)/i)?.[1];
  let r;
  try {
    r = e ? decodeURIComponent(e) : n;
  } catch {
    throw Error("文档文件名无效。");
  }
  if (!r || r.length > 512 || /[\x00-\x1f/\\]/.test(r)) throw Error("文档文件名无效。");
  return r;
}
function AA(t) {
  const e = Number(t.headers.get("Content-Length")), n = t.headers.get("Content-Range")?.match(/^bytes (\d+)-(\d+)\/(\d+)$/), r = n ? Number(n[3]) : e, i = n ? Number(n[2]) - Number(n[1]) + 1 : e, s = n ? Number(n[1]) : 0, a = n ? Number(n[2]) + 1 : e;
  if (!Number.isSafeInteger(e) || e < 1 || !Number.isSafeInteger(r) || r < 1 || !Number.isSafeInteger(i) || i !== e || !Number.isSafeInteger(s) || !Number.isSafeInteger(a) || s < 0 || a > r) throw Error("文件内容长度无法核对。");
  return { total: r, loaded: i, start: s, end: a };
}
async function jo(t, e, n) {
  const r = await t.read({ signal: e, range: n });
  if (!r.ok && r.status !== 206) {
    const b = await fA(r);
    throw Error(b ? `${b.message}（${b.code}）` : `读取文件失败（${r.status}）`);
  }
  const i = vA(r.headers.get("Content-Disposition")), s = r.headers.get(yA) || "", { total: a, loaded: l, start: d, end: h } = AA(r);
  if (!/^[a-f0-9]{64}$/.test(s) || t.file.sha256 && s !== t.file.sha256 || t.file.bytes !== void 0 && a !== t.file.bytes)
    throw await r.body?.cancel(), Error("文件内容与所选版本不一致，请刷新后重试。");
  return { response: r, filename: i, sha256: s, total: a, loaded: l, start: d, end: h };
}
async function Mg(t, e, n = mA) {
  const r = await jo(t, e);
  if (r.total > n)
    throw await r.response.body?.cancel(), Error(`此文件有 ${(r.total / 1024 / 1024).toFixed(1)} MiB，超过当前查看器 ${(n / 1024 / 1024).toFixed(0)} MiB 的安全预览上限，请下载原文件查看。`);
  let i = await r.response.blob();
  if (i.size !== r.total) throw Error("文件内容没有完整读取。");
  e.throwIfAborted();
  const s = Qo(r.filename);
  return i = i.slice(0, i.size, _A[s] || "application/octet-stream"), { filename: r.filename, blob: i, format: s, bytes: r.total, sha256: r.sha256 };
}
async function CA(t, e) {
  const n = await jo(t, e, `bytes=0-${pA - 1}`), r = await n.response.arrayBuffer();
  if (r.byteLength !== n.loaded) throw Error("文件内容没有完整读取。");
  let i;
  try {
    i = new TextDecoder("utf-8", { fatal: !0 }).decode(r);
  } catch {
    throw Error("此文件不是有效的 UTF-8 文本，请下载原文件查看。");
  }
  if (/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(i)) throw Error("此文件包含二进制控制字符，不能作为文本安全预览。");
  return { filename: n.filename, format: Qo(n.filename), text: i, bytes: n.total, loadedBytes: n.loaded, truncated: n.loaded < n.total };
}
async function nf(t, e, n, r) {
  if (!Number.isSafeInteger(e) || !Number.isSafeInteger(n) || e < 0 || n <= e) throw Error("文件分段范围无效。");
  const i = await jo(t, r, `bytes=${e}-${n - 1}`);
  if (i.start !== e || i.end !== Math.min(n, i.total))
    throw await i.response.body?.cancel(), Error("服务端返回了错误的文件分段。");
  const s = new Uint8Array(await i.response.arrayBuffer());
  if (s.byteLength !== i.loaded) throw Error("文件分段没有完整读取。");
  return { data: s, total: i.total, filename: i.filename, sha256: i.sha256 };
}
async function zg(t, e) {
  const n = window.showSaveFilePicker;
  if (n) {
    const a = await n({ suggestedName: t.file.filename }), l = await jo(t, e);
    if (!l.response.body) throw Error("浏览器无法读取下载内容。");
    await l.response.body.pipeTo(await a.createWritable(), { signal: e });
    return;
  }
  const r = await Mg(t, e, bA), i = URL.createObjectURL(r.blob), s = window.document.createElement("a");
  s.href = i, s.download = r.filename, s.click(), setTimeout(() => URL.revokeObjectURL(i), 1e3);
}
function IA(t, e) {
  return {
    identity: `knowledge:${e.library_id}:${e.id}:${e.revision}:${e.bytes}:${e.sha256}`,
    file: { filename: e.filename, bytes: e.bytes, sha256: e.sha256 },
    streamURL: t.documentContentURL?.(e.library_id, e.id),
    async read(n) {
      const r = await t.readDocumentContent(e.library_id, e.id, n), i = new Headers(r.headers);
      return new Response(r.body, { status: r.status, statusText: r.statusText, headers: i });
    }
  };
}
function rf(t, e, n) {
  return {
    identity: `knowledge-page-download:${n.library_id}:${e}:${n.id}:${n.revision}:${n.bytes}:${n.sha256}`,
    file: { filename: n.filename, bytes: n.bytes, sha256: n.sha256 },
    async read(r) {
      if (!t.readPageDocumentContent) throw Error("当前宿主未启用页面受控下载。");
      const i = await t.readPageDocumentContent(n.library_id, e, n.id, r), s = new Headers(i.headers);
      return new Response(i.body, { status: i.status, statusText: i.statusText, headers: s });
    }
  };
}
function SA({ blob: t, filename: e }) {
  const [n, r] = P("");
  return Ae(() => {
    const i = URL.createObjectURL(t);
    return r(i), () => URL.revokeObjectURL(i);
  }, [t]), /* @__PURE__ */ u("div", { className: "knowledge-file-viewer", children: [
    /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "图片原始比例预览" }),
    n && /* @__PURE__ */ c("div", { className: "knowledge-image-scroll", children: /* @__PURE__ */ c("img", { src: n, alt: e }) })
  ] });
}
function sf({ source: t, kind: e }) {
  const n = De(null), r = Math.max(0, t.file.location?.start_ms || 0) / 1e3;
  if (Ae(() => {
    const s = n.current;
    if (!s || !Number.isFinite(r)) return;
    const a = () => {
      Math.abs(s.currentTime - r) > 0.05 && (s.currentTime = r);
    };
    return s.readyState >= 1 ? a() : s.addEventListener("loadedmetadata", a, { once: !0 }), () => s.removeEventListener("loadedmetadata", a);
  }, [t.identity, r]), !t.streamURL) return /* @__PURE__ */ c("div", { className: "knowledge-preview-unsupported", children: /* @__PURE__ */ c("p", { children: "当前宿主没有提供授权后的媒体流地址，请下载原文件查看。" }) });
  const i = (s) => {
    n.current = s;
  };
  return /* @__PURE__ */ u("div", { className: "knowledge-file-viewer knowledge-media-viewer", children: [
    e === "video" ? /* @__PURE__ */ c("video", { ref: i, src: t.streamURL, controls: !0, preload: "metadata", playsInline: !0 }) : /* @__PURE__ */ c("audio", { ref: i, src: t.streamURL, controls: !0, preload: "metadata" }),
    t.file.location?.end_ms ? /* @__PURE__ */ u("p", { className: "knowledge-subtle", children: [
      "引用时间：",
      af(t.file.location.start_ms || 0),
      " – ",
      af(t.file.location.end_ms)
    ] }) : null
  ] });
}
function af(t) {
  const e = Math.max(0, Math.floor(t / 1e3)), n = Math.floor(e / 3600), r = Math.floor(e % 3600 / 60), i = e % 60;
  return n ? `${n}:${String(r).padStart(2, "0")}:${String(i).padStart(2, "0")}` : `${r}:${String(i).padStart(2, "0")}`;
}
const of = 256 * 1024;
function EA({ source: t, location: e }) {
  const n = De(null), r = De(null), [i, s] = P(null), [a, l] = P(Math.max(1, e?.page || 1)), [d, h] = P(1), [b, m] = P(800), [p, g] = P(""), [_, k] = P(!1);
  return Ae(() => {
    const y = r.current;
    if (!y) return;
    const C = new ResizeObserver((S) => m(Math.max(200, S[0].contentRect.width - 32)));
    return C.observe(y), () => C.disconnect();
  }, []), Ae(() => {
    let y = !0, C;
    const S = new AbortController(), x = /* @__PURE__ */ new Set();
    return s(null), g(""), Promise.all([nf(t, 0, of, S.signal), import("pdfjs-dist"), import("pdfjs-dist/build/pdf.worker.min.mjs?url")]).then(([z, N, R]) => {
      if (y) {
        if (N.GlobalWorkerOptions.workerSrc = R.default, z.data.byteLength === z.total)
          C = N.getDocument({ data: z.data, stopAtErrors: !0 });
        else {
          class B extends N.PDFDataRangeTransport {
            requestDataRange(K, pe) {
              const E = new AbortController();
              x.add(E), nf(t, K, pe, E.signal).then((F) => {
                x.delete(E), y && this.onDataRange(K, F.data);
              }).catch((F) => {
                x.delete(E), !(!y || E.signal.aborted) && (g(F instanceof Error ? F.message : "PDF 分段读取失败，请下载原文件查看。"), C?.destroy());
              });
            }
            abort() {
              x.forEach((K) => K.abort()), x.clear();
            }
          }
          const U = new B(z.total, z.data, !1, z.filename);
          C = N.getDocument({ range: U, rangeChunkSize: of, disableAutoFetch: !0, disableStream: !0, stopAtErrors: !0 });
        }
        return C.promise.then((B) => {
          y && (s(B), l(Math.min(B.numPages, Math.max(1, e?.page || 1))));
        });
      }
    }).catch((z) => {
      y && !S.signal.aborted && g(z instanceof Error ? z.message : "PDF 无法打开，文件可能已损坏或需要密码。可下载原文件查看。");
    }), () => {
      y = !1, S.abort(), x.forEach((z) => z.abort()), x.clear(), C?.destroy();
    };
  }, [e?.page, t.identity]), Ae(() => {
    if (!i) return;
    let y = !0, C;
    return k(!1), i.getPage(a).then((S) => {
      if (!y || !n.current) return;
      const x = S.getViewport({ scale: 1 }), z = Math.min(b / x.width, 2) * d, N = S.getViewport({ scale: z }), R = Math.min(window.devicePixelRatio || 1, 2), B = n.current;
      return B.width = Math.ceil(N.width * R), B.height = Math.ceil(N.height * R), B.style.width = `${N.width}px`, B.style.height = `${N.height}px`, C = S.render({ canvas: B, canvasContext: B.getContext("2d"), viewport: N, transform: [R, 0, 0, R, 0, 0] }), C.promise.then(() => {
        y && k(!0);
      });
    }).catch((S) => {
      y && S?.name !== "RenderingCancelledException" && g("此页无法显示，请下载原文件查看。");
    }), () => {
      y = !1, C?.cancel();
    };
  }, [i, a, b, d]), /* @__PURE__ */ u("div", { className: "knowledge-file-viewer", children: [
    /* @__PURE__ */ u("nav", { className: "knowledge-file-toolbar", "aria-label": "PDF 翻页", children: [
      /* @__PURE__ */ c(te, { disabled: !i || a <= 1, onClick: () => l((y) => y - 1), children: "上一页" }),
      /* @__PURE__ */ u("span", { children: [
        "第 ",
        a,
        " / ",
        i?.numPages || "—",
        " 页"
      ] }),
      /* @__PURE__ */ c(te, { disabled: !i || a >= i.numPages, onClick: () => l((y) => y + 1), children: "下一页" }),
      /* @__PURE__ */ u("label", { children: [
        "缩放 ",
        /* @__PURE__ */ u("select", { "aria-label": "PDF 缩放", value: d, onChange: (y) => h(Number(y.target.value)), children: [
          /* @__PURE__ */ c("option", { value: 0.75, children: "75%" }),
          /* @__PURE__ */ c("option", { value: 1, children: "适合宽度" }),
          /* @__PURE__ */ c("option", { value: 1.5, children: "150%" }),
          /* @__PURE__ */ c("option", { value: 2, children: "200%" })
        ] })
      ] })
    ] }),
    p && /* @__PURE__ */ c("p", { role: "alert", className: "knowledge-error", children: p }),
    /* @__PURE__ */ c("div", { className: "knowledge-pdf-canvas", ref: r, "aria-busy": !_ && !p, children: /* @__PURE__ */ c("canvas", { ref: n, "aria-label": `PDF 第 ${a} 页`, "data-rendered": _ }) })
  ] });
}
async function Ed(t, e, n) {
  const r = await t.arrayBuffer();
  return n.throwIfAborted(), new Promise((i, s) => {
    const a = new Worker(new URL(
      /* @vite-ignore */
      "" + new URL("assets/office-worker-CYysu3ts.js", import.meta.url).href,
      import.meta.url
    ), { type: "module" }), l = (b, m) => {
      clearTimeout(h), a.terminate(), n.removeEventListener("abort", d), b ? s(b) : i(m);
    }, d = () => l(new DOMException("Aborted", "AbortError")), h = setTimeout(() => l(Error("文件预览处理超时，请下载原文件查看。")), 2e4);
    n.addEventListener("abort", d, { once: !0 }), a.onerror = () => l(Error("文件预览失败，请下载原文件查看。")), a.onmessage = (b) => b.data.error ? l(Error(b.data.error)) : l(void 0, b.data), a.postMessage({ data: r, kind: e }, [r]);
  });
}
const Er = 50, xr = 16;
function rs(t) {
  let e = "";
  for (; t > 0; t = Math.floor((t - 1) / 26)) e = String.fromCharCode(65 + (t - 1) % 26) + e;
  return e;
}
function xA({ blob: t, location: e }) {
  const [n, r] = P([]), [i, s] = P(0), [a, l] = P(0), [d, h] = P(0), [b, m] = P(e?.cell || ""), [p, g] = P(""), [_, k] = P(""), y = n[i], C = Xe(() => new Map(y?.cells.map((B) => [`${B.row}:${B.col}`, B])), [y]);
  function S(B) {
    const U = /^([A-Z]{1,3})([1-9][0-9]{0,5})$/.exec(B.toUpperCase());
    if (!U || !y) {
      k("请输入有效单元格，例如 B12。");
      return;
    }
    const Q = [...U[1]].reduce((pe, E) => pe * 26 + E.charCodeAt(0) - 64, 0), K = Number(U[2]);
    if (K > y.rows || Q > y.cols) {
      k("该位置超出当前工作表范围。");
      return;
    }
    k(""), l(Math.floor((K - 1) / Er)), h(Math.floor((Q - 1) / xr)), g(`${K}:${Q}`);
  }
  Ae(() => {
    const B = new AbortController();
    return Ed(t, "xlsx", B.signal).then((U) => {
      if (B.signal.aborted) return;
      const Q = U.sheets || [];
      r(Q);
      const K = Q.findIndex((pe) => pe.name === e?.sheet);
      K >= 0 && s(K);
    }).catch((U) => {
      B.signal.aborted || k(U instanceof Error ? U.message : "Excel 文件无法预览。");
    }), () => B.abort();
  }, [t, e?.sheet]), Ae(() => {
    !y || y.name !== e?.sheet || (e.cell ? S(e.cell) : e.row && e.row <= y.rows && l(Math.floor((e.row - 1) / Er)));
  }, [y, e?.cell, e?.row, e?.sheet]);
  const x = y ? Array.from({ length: Math.min(Er, Math.max(0, y.rows - a * Er)) }, (B, U) => a * Er + U + 1).filter((B) => !y.hiddenRows.includes(B)) : [], z = y ? Array.from({ length: Math.min(xr, Math.max(0, y.cols - d * xr)) }, (B, U) => d * xr + U + 1).filter((B) => !y.hiddenCols.includes(B)) : [], N = /* @__PURE__ */ new Map();
  for (const B of y?.merges || []) {
    const U = x.filter((K) => K >= B.top && K <= B.bottom), Q = z.filter((K) => K >= B.left && K <= B.right);
    for (const K of U) for (const pe of Q) N.set(`${K}:${pe}`, K === U[0] && pe === Q[0] ? { master: `${B.top}:${B.left}`, rowSpan: U.length, colSpan: Q.length } : null);
  }
  const R = C.get(p);
  return /* @__PURE__ */ u("div", { className: "knowledge-file-viewer", "data-static-ui-list": !0, children: [
    _ && /* @__PURE__ */ c("p", { role: "alert", className: "knowledge-error", children: _ }),
    !y && !_ && /* @__PURE__ */ c("p", { role: "status", children: "正在打开工作簿…" }),
    y && /* @__PURE__ */ u(xt, { children: [
      /* @__PURE__ */ u("div", { className: "knowledge-file-toolbar", children: [
        /* @__PURE__ */ u("label", { children: [
          "工作表 ",
          /* @__PURE__ */ c("select", { "aria-label": "工作表", value: i, onChange: (B) => {
            s(Number(B.target.value)), l(0), h(0), g(""), k("");
          }, children: n.map((B, U) => /* @__PURE__ */ c("option", { value: U, children: B.name }, U)) })
        ] }),
        /* @__PURE__ */ u("form", { onSubmit: (B) => {
          B.preventDefault(), S(b);
        }, children: [
          /* @__PURE__ */ u("label", { children: [
            "定位单元格 ",
            /* @__PURE__ */ c("input", { value: b, onChange: (B) => m(B.target.value), placeholder: "B12", maxLength: 10 })
          ] }),
          /* @__PURE__ */ c(te, { type: "submit", children: "定位" })
        ] })
      ] }),
      /* @__PURE__ */ u("p", { className: "knowledge-subtle", children: [
        y.rows,
        " 行 × ",
        y.cols,
        " 列 · 只读预览，公式显示文件保存的结果；图表与嵌入对象请下载查看。"
      ] }),
      R && /* @__PURE__ */ u("p", { className: "knowledge-spreadsheet-value", children: [
        /* @__PURE__ */ u("strong", { children: [
          rs(R.col),
          R.row
        ] }),
        " ",
        R.formula ? `=${R.formula} → ` : "",
        R.text
      ] }),
      /* @__PURE__ */ c("div", { className: "knowledge-sheet-scroll", children: /* @__PURE__ */ u("table", { "aria-label": `${y.name} 工作表`, children: [
        /* @__PURE__ */ u("colgroup", { children: [
          /* @__PURE__ */ c("col", { style: { width: 50 } }),
          z.map((B) => /* @__PURE__ */ c("col", { style: { width: y.widths[B] || 110 } }, B))
        ] }),
        /* @__PURE__ */ c("thead", { children: /* @__PURE__ */ u("tr", { children: [
          /* @__PURE__ */ c("th", { scope: "col", children: "行" }),
          z.map((B) => /* @__PURE__ */ c("th", { scope: "col", children: rs(B) }, B))
        ] }) }),
        /* @__PURE__ */ c("tbody", { children: x.map((B) => /* @__PURE__ */ u("tr", { style: { height: y.heights[B] }, children: [
          /* @__PURE__ */ c("th", { scope: "row", children: B }),
          z.map((U) => {
            const Q = `${B}:${U}`, K = N.get(Q);
            if (K === null) return null;
            const pe = C.get(K?.master || Q);
            return /* @__PURE__ */ c("td", { rowSpan: K?.rowSpan, colSpan: K?.colSpan, style: pe?.style, "data-selected": p === (K?.master || Q), onClick: () => {
              g(K?.master || Q), m(`${rs(pe?.col || U)}${pe?.row || B}`);
            }, children: pe?.text || "" }, U);
          })
        ] }, B)) })
      ] }) }),
      /* @__PURE__ */ u("nav", { className: "knowledge-file-toolbar", "aria-label": "工作表行分页", "data-static-ui-pagination": !0, children: [
        /* @__PURE__ */ c(te, { disabled: a === 0, onClick: () => l((B) => B - 1), children: "上一页行" }),
        /* @__PURE__ */ u("span", { children: [
          "第 ",
          a + 1,
          " / ",
          Math.max(1, Math.ceil(y.rows / Er)),
          " 页"
        ] }),
        /* @__PURE__ */ c(te, { disabled: (a + 1) * Er >= y.rows, onClick: () => l((B) => B + 1), children: "下一页行" }),
        /* @__PURE__ */ c(te, { disabled: d === 0, onClick: () => h((B) => B - 1), children: "前一组列" }),
        /* @__PURE__ */ u("span", { children: [
          rs(d * xr + 1),
          "–",
          rs(Math.max(1, Math.min(y.cols, (d + 1) * xr)))
        ] }),
        /* @__PURE__ */ c(te, { disabled: (d + 1) * xr >= y.cols, onClick: () => h((B) => B + 1), children: "后一组列" })
      ] })
    ] })
  ] });
}
function NA({ blob: t, location: e }) {
  const [n, r] = P([]), [i, s] = P(0), [a, l] = P("");
  Ae(() => {
    const h = new AbortController();
    return Ed(t, "pptx", h.signal).then((b) => {
      if (h.signal.aborted) return;
      const m = b.slides || [];
      r(m);
      const p = m.findIndex((g) => g.number === e?.slide);
      s(p >= 0 ? p : 0);
    }).catch((b) => {
      h.signal.aborted || l(b instanceof Error ? b.message : "PowerPoint 文件无法预览。");
    }), () => h.abort();
  }, [t, e?.slide]);
  const d = n[i];
  return /* @__PURE__ */ u("div", { className: "knowledge-file-viewer", children: [
    /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "PowerPoint 只读文本预览 · 保留幻灯片顺序和文字；版式、图片、图表、动画与备注请下载原文件查看。" }),
    a && /* @__PURE__ */ c("p", { role: "alert", className: "knowledge-error", children: a }),
    !d && !a && /* @__PURE__ */ c("p", { role: "status", children: "正在读取幻灯片…" }),
    d && /* @__PURE__ */ u("div", { className: "knowledge-presentation", children: [
      /* @__PURE__ */ c("nav", { "aria-label": "幻灯片列表", children: n.map((h, b) => /* @__PURE__ */ u("button", { "aria-current": b === i ? "true" : void 0, onClick: () => s(b), children: [
        /* @__PURE__ */ c("span", { children: h.number }),
        /* @__PURE__ */ c("strong", { children: h.title })
      ] }, h.number)) }),
      /* @__PURE__ */ u("article", { "aria-label": `第 ${d.number} 张幻灯片`, children: [
        /* @__PURE__ */ u("small", { children: [
          "第 ",
          d.number,
          " / ",
          n.length,
          " 张"
        ] }),
        /* @__PURE__ */ c("h2", { children: d.title }),
        d.lines.length ? d.lines.map((h, b) => /* @__PURE__ */ c("p", { children: h }, b)) : /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "这张幻灯片没有可提取的正文文字。" })
      ] })
    ] })
  ] });
}
const Ba = 50, Pa = 2e5, lf = 2e3, bc = 100;
function DA(t, e) {
  const n = [];
  let r = [], i = "", s = !1, a = !1;
  for (let l = 0; l < t.length; l++) {
    const d = t[l];
    if (s) {
      d === '"' && t[l + 1] === '"' ? (i += '"', l++) : d === '"' ? s = !1 : i += d;
      continue;
    }
    if (d === '"' && i === "") {
      s = !0;
      continue;
    }
    if (d === e) {
      r.length < bc ? r.push(i) : a = !0, i = "";
      continue;
    }
    if (d === `
`) {
      if (r.length < bc ? r.push(i.replace(/\r$/, "")) : a = !0, n.push(r), r = [], i = "", n.length >= lf) {
        a = !0;
        break;
      }
      continue;
    }
    i += d;
  }
  return (i || r.length) && n.length < lf && (r.length < bc && r.push(i.replace(/\r$/, "")), n.push(r)), { rows: n, limited: a };
}
function BA({ file: t }) {
  const [e, n] = P(0), r = Xe(() => t.format === "csv" || t.format === "tsv" ? DA(t.text, t.format === "tsv" ? "	" : ",") : null, [t]), i = Xe(() => {
    if (t.format !== "json" || t.truncated) return t.text.slice(0, Pa);
    try {
      return JSON.stringify(JSON.parse(t.text), null, 2).slice(0, Pa);
    } catch {
      return t.text.slice(0, Pa);
    }
  }, [t]), s = t.truncated || t.text.length > Pa || !!r?.limited;
  if (r) {
    const a = e * Ba, l = r.rows.slice(a, a + Ba), d = Math.max(0, ...l.map((h) => h.length));
    return /* @__PURE__ */ u("div", { className: "knowledge-file-viewer", children: [
      /* @__PURE__ */ u("p", { className: "knowledge-subtle", children: [
        "表格文本只读预览",
        s ? " · 已限制展示量" : ""
      ] }),
      /* @__PURE__ */ c("div", { className: "knowledge-sheet-scroll", children: /* @__PURE__ */ u("table", { children: [
        /* @__PURE__ */ c("thead", { children: /* @__PURE__ */ u("tr", { children: [
          /* @__PURE__ */ c("th", { children: "行" }),
          Array.from({ length: d }, (h, b) => /* @__PURE__ */ c("th", { children: b + 1 }, b))
        ] }) }),
        /* @__PURE__ */ c("tbody", { children: l.map((h, b) => /* @__PURE__ */ u("tr", { children: [
          /* @__PURE__ */ c("th", { children: a + b + 1 }),
          Array.from({ length: d }, (m, p) => /* @__PURE__ */ c("td", { children: h[p] || "" }, p))
        ] }, a + b)) })
      ] }) }),
      /* @__PURE__ */ u("nav", { className: "knowledge-file-toolbar", children: [
        /* @__PURE__ */ c(te, { disabled: e === 0, onClick: () => n((h) => h - 1), children: "上一页" }),
        /* @__PURE__ */ c("span", { children: r.rows.length ? `${a + 1}–${Math.min(a + Ba, r.rows.length)} / ${r.rows.length}` : "无数据" }),
        /* @__PURE__ */ c(te, { disabled: a + Ba >= r.rows.length, onClick: () => n((h) => h + 1), children: "下一页" })
      ] })
    ] });
  }
  return /* @__PURE__ */ u("div", { className: "knowledge-file-viewer", children: [
    /* @__PURE__ */ u("p", { className: "knowledge-subtle", children: [
      t.format === "md" ? "Markdown 源文" : t.format === "json" ? "JSON" : "文本",
      "只读预览",
      s ? " · 仅展示开头" : ""
    ] }),
    /* @__PURE__ */ c("pre", { className: "knowledge-text-preview", children: i })
  ] });
}
var Ma = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function PA(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function MC(t) {
  if (Object.prototype.hasOwnProperty.call(t, "__esModule")) return t;
  var e = t.default;
  if (typeof e == "function") {
    var n = function r() {
      var i = !1;
      try {
        i = this instanceof r;
      } catch {
      }
      return i ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    n.prototype = e.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(t).forEach(function(r) {
    var i = Object.getOwnPropertyDescriptor(t, r);
    Object.defineProperty(n, r, i.get ? i : {
      enumerable: !0,
      get: function() {
        return t[r];
      }
    });
  }), n;
}
function za(t) {
  throw new Error('Could not dynamically require "' + t + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var yc = { exports: {} };
var cf;
function MA() {
  return cf || (cf = 1, (function(t, e) {
    (function(n) {
      t.exports = n();
    })(function() {
      return (function n(r, i, s) {
        function a(h, b) {
          if (!i[h]) {
            if (!r[h]) {
              var m = typeof za == "function" && za;
              if (!b && m) return m(h, !0);
              if (l) return l(h, !0);
              var p = new Error("Cannot find module '" + h + "'");
              throw p.code = "MODULE_NOT_FOUND", p;
            }
            var g = i[h] = { exports: {} };
            r[h][0].call(g.exports, function(_) {
              var k = r[h][1][_];
              return a(k || _);
            }, g, g.exports, n, r, i, s);
          }
          return i[h].exports;
        }
        for (var l = typeof za == "function" && za, d = 0; d < s.length; d++) a(s[d]);
        return a;
      })({ 1: [function(n, r, i) {
        var s = n("./utils"), a = n("./support"), l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        i.encode = function(d) {
          for (var h, b, m, p, g, _, k, y = [], C = 0, S = d.length, x = S, z = s.getTypeOf(d) !== "string"; C < d.length; ) x = S - C, m = z ? (h = d[C++], b = C < S ? d[C++] : 0, C < S ? d[C++] : 0) : (h = d.charCodeAt(C++), b = C < S ? d.charCodeAt(C++) : 0, C < S ? d.charCodeAt(C++) : 0), p = h >> 2, g = (3 & h) << 4 | b >> 4, _ = 1 < x ? (15 & b) << 2 | m >> 6 : 64, k = 2 < x ? 63 & m : 64, y.push(l.charAt(p) + l.charAt(g) + l.charAt(_) + l.charAt(k));
          return y.join("");
        }, i.decode = function(d) {
          var h, b, m, p, g, _, k = 0, y = 0, C = "data:";
          if (d.substr(0, C.length) === C) throw new Error("Invalid base64 input, it looks like a data url.");
          var S, x = 3 * (d = d.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (d.charAt(d.length - 1) === l.charAt(64) && x--, d.charAt(d.length - 2) === l.charAt(64) && x--, x % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (S = a.uint8array ? new Uint8Array(0 | x) : new Array(0 | x); k < d.length; ) h = l.indexOf(d.charAt(k++)) << 2 | (p = l.indexOf(d.charAt(k++))) >> 4, b = (15 & p) << 4 | (g = l.indexOf(d.charAt(k++))) >> 2, m = (3 & g) << 6 | (_ = l.indexOf(d.charAt(k++))), S[y++] = h, g !== 64 && (S[y++] = b), _ !== 64 && (S[y++] = m);
          return S;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(n, r, i) {
        var s = n("./external"), a = n("./stream/DataWorker"), l = n("./stream/Crc32Probe"), d = n("./stream/DataLengthProbe");
        function h(b, m, p, g, _) {
          this.compressedSize = b, this.uncompressedSize = m, this.crc32 = p, this.compression = g, this.compressedContent = _;
        }
        h.prototype = { getContentWorker: function() {
          var b = new a(s.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new d("data_length")), m = this;
          return b.on("end", function() {
            if (this.streamInfo.data_length !== m.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), b;
        }, getCompressedWorker: function() {
          return new a(s.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, h.createWorkerFrom = function(b, m, p) {
          return b.pipe(new l()).pipe(new d("uncompressedSize")).pipe(m.compressWorker(p)).pipe(new d("compressedSize")).withStreamInfo("compression", m);
        }, r.exports = h;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(n, r, i) {
        var s = n("./stream/GenericWorker");
        i.STORE = { magic: "\0\0", compressWorker: function() {
          return new s("STORE compression");
        }, uncompressWorker: function() {
          return new s("STORE decompression");
        } }, i.DEFLATE = n("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(n, r, i) {
        var s = n("./utils"), a = (function() {
          for (var l, d = [], h = 0; h < 256; h++) {
            l = h;
            for (var b = 0; b < 8; b++) l = 1 & l ? 3988292384 ^ l >>> 1 : l >>> 1;
            d[h] = l;
          }
          return d;
        })();
        r.exports = function(l, d) {
          return l !== void 0 && l.length ? s.getTypeOf(l) !== "string" ? (function(h, b, m, p) {
            var g = a, _ = p + m;
            h ^= -1;
            for (var k = p; k < _; k++) h = h >>> 8 ^ g[255 & (h ^ b[k])];
            return -1 ^ h;
          })(0 | d, l, l.length, 0) : (function(h, b, m, p) {
            var g = a, _ = p + m;
            h ^= -1;
            for (var k = p; k < _; k++) h = h >>> 8 ^ g[255 & (h ^ b.charCodeAt(k))];
            return -1 ^ h;
          })(0 | d, l, l.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(n, r, i) {
        i.base64 = !1, i.binary = !1, i.dir = !1, i.createFolders = !0, i.date = null, i.compression = null, i.compressionOptions = null, i.comment = null, i.unixPermissions = null, i.dosPermissions = null;
      }, {}], 6: [function(n, r, i) {
        var s = null;
        s = typeof Promise < "u" ? Promise : n("lie"), r.exports = { Promise: s };
      }, { lie: 37 }], 7: [function(n, r, i) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", a = n("pako"), l = n("./utils"), d = n("./stream/GenericWorker"), h = s ? "uint8array" : "array";
        function b(m, p) {
          d.call(this, "FlateWorker/" + m), this._pako = null, this._pakoAction = m, this._pakoOptions = p, this.meta = {};
        }
        i.magic = "\b\0", l.inherits(b, d), b.prototype.processChunk = function(m) {
          this.meta = m.meta, this._pako === null && this._createPako(), this._pako.push(l.transformTo(h, m.data), !1);
        }, b.prototype.flush = function() {
          d.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, b.prototype.cleanUp = function() {
          d.prototype.cleanUp.call(this), this._pako = null;
        }, b.prototype._createPako = function() {
          this._pako = new a[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var m = this;
          this._pako.onData = function(p) {
            m.push({ data: p, meta: m.meta });
          };
        }, i.compressWorker = function(m) {
          return new b("Deflate", m);
        }, i.uncompressWorker = function() {
          return new b("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(n, r, i) {
        function s(g, _) {
          var k, y = "";
          for (k = 0; k < _; k++) y += String.fromCharCode(255 & g), g >>>= 8;
          return y;
        }
        function a(g, _, k, y, C, S) {
          var x, z, N = g.file, R = g.compression, B = S !== h.utf8encode, U = l.transformTo("string", S(N.name)), Q = l.transformTo("string", h.utf8encode(N.name)), K = N.comment, pe = l.transformTo("string", S(K)), E = l.transformTo("string", h.utf8encode(K)), F = Q.length !== N.name.length, v = E.length !== K.length, T = "", fe = "", Z = "", ke = N.dir, q = N.date, ge = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          _ && !k || (ge.crc32 = g.crc32, ge.compressedSize = g.compressedSize, ge.uncompressedSize = g.uncompressedSize);
          var W = 0;
          _ && (W |= 8), B || !F && !v || (W |= 2048);
          var H = 0, ye = 0;
          ke && (H |= 16), C === "UNIX" ? (ye = 798, H |= (function(de, re) {
            var we = de;
            return de || (we = re ? 16893 : 33204), (65535 & we) << 16;
          })(N.unixPermissions, ke)) : (ye = 20, H |= (function(de) {
            return 63 & (de || 0);
          })(N.dosPermissions)), x = q.getUTCHours(), x <<= 6, x |= q.getUTCMinutes(), x <<= 5, x |= q.getUTCSeconds() / 2, z = q.getUTCFullYear() - 1980, z <<= 4, z |= q.getUTCMonth() + 1, z <<= 5, z |= q.getUTCDate(), F && (fe = s(1, 1) + s(b(U), 4) + Q, T += "up" + s(fe.length, 2) + fe), v && (Z = s(1, 1) + s(b(pe), 4) + E, T += "uc" + s(Z.length, 2) + Z);
          var me = "";
          return me += `
\0`, me += s(W, 2), me += R.magic, me += s(x, 2), me += s(z, 2), me += s(ge.crc32, 4), me += s(ge.compressedSize, 4), me += s(ge.uncompressedSize, 4), me += s(U.length, 2), me += s(T.length, 2), { fileRecord: m.LOCAL_FILE_HEADER + me + U + T, dirRecord: m.CENTRAL_FILE_HEADER + s(ye, 2) + me + s(pe.length, 2) + "\0\0\0\0" + s(H, 4) + s(y, 4) + U + T + pe };
        }
        var l = n("../utils"), d = n("../stream/GenericWorker"), h = n("../utf8"), b = n("../crc32"), m = n("../signature");
        function p(g, _, k, y) {
          d.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = _, this.zipPlatform = k, this.encodeFileName = y, this.streamFiles = g, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        l.inherits(p, d), p.prototype.push = function(g) {
          var _ = g.meta.percent || 0, k = this.entriesCount, y = this._sources.length;
          this.accumulate ? this.contentBuffer.push(g) : (this.bytesWritten += g.data.length, d.prototype.push.call(this, { data: g.data, meta: { currentFile: this.currentFile, percent: k ? (_ + 100 * (k - y - 1)) / k : 100 } }));
        }, p.prototype.openedSource = function(g) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = g.file.name;
          var _ = this.streamFiles && !g.file.dir;
          if (_) {
            var k = a(g, _, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: k.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, p.prototype.closedSource = function(g) {
          this.accumulate = !1;
          var _ = this.streamFiles && !g.file.dir, k = a(g, _, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(k.dirRecord), _) this.push({ data: (function(y) {
            return m.DATA_DESCRIPTOR + s(y.crc32, 4) + s(y.compressedSize, 4) + s(y.uncompressedSize, 4);
          })(g), meta: { percent: 100 } });
          else for (this.push({ data: k.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, p.prototype.flush = function() {
          for (var g = this.bytesWritten, _ = 0; _ < this.dirRecords.length; _++) this.push({ data: this.dirRecords[_], meta: { percent: 100 } });
          var k = this.bytesWritten - g, y = (function(C, S, x, z, N) {
            var R = l.transformTo("string", N(z));
            return m.CENTRAL_DIRECTORY_END + "\0\0\0\0" + s(C, 2) + s(C, 2) + s(S, 4) + s(x, 4) + s(R.length, 2) + R;
          })(this.dirRecords.length, k, g, this.zipComment, this.encodeFileName);
          this.push({ data: y, meta: { percent: 100 } });
        }, p.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, p.prototype.registerPrevious = function(g) {
          this._sources.push(g);
          var _ = this;
          return g.on("data", function(k) {
            _.processChunk(k);
          }), g.on("end", function() {
            _.closedSource(_.previous.streamInfo), _._sources.length ? _.prepareNextSource() : _.end();
          }), g.on("error", function(k) {
            _.error(k);
          }), this;
        }, p.prototype.resume = function() {
          return !!d.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, p.prototype.error = function(g) {
          var _ = this._sources;
          if (!d.prototype.error.call(this, g)) return !1;
          for (var k = 0; k < _.length; k++) try {
            _[k].error(g);
          } catch {
          }
          return !0;
        }, p.prototype.lock = function() {
          d.prototype.lock.call(this);
          for (var g = this._sources, _ = 0; _ < g.length; _++) g[_].lock();
        }, r.exports = p;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(n, r, i) {
        var s = n("../compressions"), a = n("./ZipFileWorker");
        i.generateWorker = function(l, d, h) {
          var b = new a(d.streamFiles, h, d.platform, d.encodeFileName), m = 0;
          try {
            l.forEach(function(p, g) {
              m++;
              var _ = (function(S, x) {
                var z = S || x, N = s[z];
                if (!N) throw new Error(z + " is not a valid compression method !");
                return N;
              })(g.options.compression, d.compression), k = g.options.compressionOptions || d.compressionOptions || {}, y = g.dir, C = g.date;
              g._compressWorker(_, k).withStreamInfo("file", { name: p, dir: y, date: C, comment: g.comment || "", unixPermissions: g.unixPermissions, dosPermissions: g.dosPermissions }).pipe(b);
            }), b.entriesCount = m;
          } catch (p) {
            b.error(p);
          }
          return b;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(n, r, i) {
        function s() {
          if (!(this instanceof s)) return new s();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var a = new s();
            for (var l in this) typeof this[l] != "function" && (a[l] = this[l]);
            return a;
          };
        }
        (s.prototype = n("./object")).loadAsync = n("./load"), s.support = n("./support"), s.defaults = n("./defaults"), s.version = "3.10.2", s.loadAsync = function(a, l) {
          return new s().loadAsync(a, l);
        }, s.external = n("./external"), r.exports = s;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(n, r, i) {
        var s = n("./utils"), a = n("./external"), l = n("./utf8"), d = n("./zipEntries"), h = n("./stream/Crc32Probe"), b = n("./nodejsUtils");
        function m(p) {
          return new a.Promise(function(g, _) {
            var k = p.decompressed.getContentWorker().pipe(new h());
            k.on("error", function(y) {
              _(y);
            }).on("end", function() {
              k.streamInfo.crc32 !== p.decompressed.crc32 ? _(new Error("Corrupted zip : CRC32 mismatch")) : g();
            }).resume();
          });
        }
        r.exports = function(p, g) {
          var _ = this;
          return g = s.extend(g || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: l.utf8decode }), b.isNode && b.isStream(p) ? a.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : s.prepareContent("the loaded zip file", p, !0, g.optimizedBinaryString, g.base64).then(function(k) {
            var y = new d(g);
            return y.load(k), y;
          }).then(function(k) {
            var y = [a.Promise.resolve(k)], C = k.files;
            if (g.checkCRC32) for (var S = 0; S < C.length; S++) y.push(m(C[S]));
            return a.Promise.all(y);
          }).then(function(k) {
            for (var y = k.shift(), C = y.files, S = 0; S < C.length; S++) {
              var x = C[S], z = x.fileNameStr, N = s.resolve(x.fileNameStr);
              _.file(N, x.decompressed, { binary: !0, optimizedBinaryString: !0, date: x.date, dir: x.dir, comment: x.fileCommentStr.length ? x.fileCommentStr : null, unixPermissions: x.unixPermissions, dosPermissions: x.dosPermissions, createFolders: g.createFolders }), x.dir || (_.file(N).unsafeOriginalName = z);
            }
            return y.zipComment.length && (_.comment = y.zipComment), _;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(n, r, i) {
        var s = n("../utils"), a = n("../stream/GenericWorker");
        function l(d, h) {
          a.call(this, "Nodejs stream input adapter for " + d), this._upstreamEnded = !1, this._bindStream(h);
        }
        s.inherits(l, a), l.prototype._bindStream = function(d) {
          var h = this;
          (this._stream = d).pause(), d.on("data", function(b) {
            h.push({ data: b, meta: { percent: 0 } });
          }).on("error", function(b) {
            h.isPaused ? this.generatedError = b : h.error(b);
          }).on("end", function() {
            h.isPaused ? h._upstreamEnded = !0 : h.end();
          });
        }, l.prototype.pause = function() {
          return !!a.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, l.prototype.resume = function() {
          return !!a.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, r.exports = l;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(n, r, i) {
        var s = n("readable-stream").Readable;
        function a(l, d, h) {
          s.call(this, d), this._helper = l;
          var b = this;
          l.on("data", function(m, p) {
            b.push(m) || b._helper.pause(), h && h(p);
          }).on("error", function(m) {
            b.emit("error", m);
          }).on("end", function() {
            b.push(null);
          });
        }
        n("../utils").inherits(a, s), a.prototype._read = function() {
          this._helper.resume();
        }, r.exports = a;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(n, r, i) {
        r.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(s, a) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(s, a);
          if (typeof s == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(s, a);
        }, allocBuffer: function(s) {
          if (Buffer.alloc) return Buffer.alloc(s);
          var a = new Buffer(s);
          return a.fill(0), a;
        }, isBuffer: function(s) {
          return Buffer.isBuffer(s);
        }, isStream: function(s) {
          return s && typeof s.on == "function" && typeof s.pause == "function" && typeof s.resume == "function";
        } };
      }, {}], 15: [function(n, r, i) {
        function s(N, R, B) {
          var U, Q = l.getTypeOf(R), K = l.extend(B || {}, b);
          K.date = K.date || /* @__PURE__ */ new Date(), K.compression !== null && (K.compression = K.compression.toUpperCase()), typeof K.unixPermissions == "string" && (K.unixPermissions = parseInt(K.unixPermissions, 8)), K.unixPermissions && 16384 & K.unixPermissions && (K.dir = !0), K.dosPermissions && 16 & K.dosPermissions && (K.dir = !0), K.dir && (N = C(N)), K.createFolders && (U = y(N)) && S.call(this, U, !0);
          var pe = Q === "string" && K.binary === !1 && K.base64 === !1;
          B && B.binary !== void 0 || (K.binary = !pe), (R instanceof m && R.uncompressedSize === 0 || K.dir || !R || R.length === 0) && (K.base64 = !1, K.binary = !0, R = "", K.compression = "STORE", Q = "string");
          var E = null;
          E = R instanceof m || R instanceof d ? R : _.isNode && _.isStream(R) ? new k(N, R) : l.prepareContent(N, R, K.binary, K.optimizedBinaryString, K.base64);
          var F = new p(N, E, K);
          this.files[N] = F;
        }
        var a = n("./utf8"), l = n("./utils"), d = n("./stream/GenericWorker"), h = n("./stream/StreamHelper"), b = n("./defaults"), m = n("./compressedObject"), p = n("./zipObject"), g = n("./generate"), _ = n("./nodejsUtils"), k = n("./nodejs/NodejsStreamInputAdapter"), y = function(N) {
          N.slice(-1) === "/" && (N = N.substring(0, N.length - 1));
          var R = N.lastIndexOf("/");
          return 0 < R ? N.substring(0, R) : "";
        }, C = function(N) {
          return N.slice(-1) !== "/" && (N += "/"), N;
        }, S = function(N, R) {
          return R = R !== void 0 ? R : b.createFolders, N = C(N), this.files[N] || s.call(this, N, null, { dir: !0, createFolders: R }), this.files[N];
        };
        function x(N) {
          return Object.prototype.toString.call(N) === "[object RegExp]";
        }
        var z = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(N) {
          var R, B, U;
          for (R in this.files) U = this.files[R], (B = R.slice(this.root.length, R.length)) && R.slice(0, this.root.length) === this.root && N(B, U);
        }, filter: function(N) {
          var R = [];
          return this.forEach(function(B, U) {
            N(B, U) && R.push(U);
          }), R;
        }, file: function(N, R, B) {
          if (arguments.length !== 1) return N = this.root + N, s.call(this, N, R, B), this;
          if (x(N)) {
            var U = N;
            return this.filter(function(K, pe) {
              return !pe.dir && U.test(K);
            });
          }
          var Q = this.files[this.root + N];
          return Q && !Q.dir ? Q : null;
        }, folder: function(N) {
          if (!N) return this;
          if (x(N)) return this.filter(function(Q, K) {
            return K.dir && N.test(Q);
          });
          var R = this.root + N, B = S.call(this, R), U = this.clone();
          return U.root = B.name, U;
        }, remove: function(N) {
          N = this.root + N;
          var R = this.files[N];
          if (R || (N.slice(-1) !== "/" && (N += "/"), R = this.files[N]), R && !R.dir) delete this.files[N];
          else for (var B = this.filter(function(Q, K) {
            return K.name.slice(0, N.length) === N;
          }), U = 0; U < B.length; U++) delete this.files[B[U].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(N) {
          var R, B = {};
          try {
            if ((B = l.extend(N || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: a.utf8encode })).type = B.type.toLowerCase(), B.compression = B.compression.toUpperCase(), B.type === "binarystring" && (B.type = "string"), !B.type) throw new Error("No output type specified.");
            l.checkSupport(B.type), B.platform !== "darwin" && B.platform !== "freebsd" && B.platform !== "linux" && B.platform !== "sunos" || (B.platform = "UNIX"), B.platform === "win32" && (B.platform = "DOS");
            var U = B.comment || this.comment || "";
            R = g.generateWorker(this, B, U);
          } catch (Q) {
            (R = new d("error")).error(Q);
          }
          return new h(R, B.type || "string", B.mimeType);
        }, generateAsync: function(N, R) {
          return this.generateInternalStream(N).accumulate(R);
        }, generateNodeStream: function(N, R) {
          return (N = N || {}).type || (N.type = "nodebuffer"), this.generateInternalStream(N).toNodejsStream(R);
        } };
        r.exports = z;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(n, r, i) {
        r.exports = n("stream");
      }, { stream: void 0 }], 17: [function(n, r, i) {
        var s = n("./DataReader");
        function a(l) {
          s.call(this, l);
          for (var d = 0; d < this.data.length; d++) l[d] = 255 & l[d];
        }
        n("../utils").inherits(a, s), a.prototype.byteAt = function(l) {
          return this.data[this.zero + l];
        }, a.prototype.lastIndexOfSignature = function(l) {
          for (var d = l.charCodeAt(0), h = l.charCodeAt(1), b = l.charCodeAt(2), m = l.charCodeAt(3), p = this.length - 4; 0 <= p; --p) if (this.data[p] === d && this.data[p + 1] === h && this.data[p + 2] === b && this.data[p + 3] === m) return p - this.zero;
          return -1;
        }, a.prototype.readAndCheckSignature = function(l) {
          var d = l.charCodeAt(0), h = l.charCodeAt(1), b = l.charCodeAt(2), m = l.charCodeAt(3), p = this.readData(4);
          return d === p[0] && h === p[1] && b === p[2] && m === p[3];
        }, a.prototype.readData = function(l) {
          if (this.checkOffset(l), l === 0) return [];
          var d = this.data.slice(this.zero + this.index, this.zero + this.index + l);
          return this.index += l, d;
        }, r.exports = a;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(n, r, i) {
        var s = n("../utils");
        function a(l) {
          this.data = l, this.length = l.length, this.index = 0, this.zero = 0;
        }
        a.prototype = { checkOffset: function(l) {
          this.checkIndex(this.index + l);
        }, checkIndex: function(l) {
          if (this.length < this.zero + l || l < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + l + "). Corrupted zip ?");
        }, setIndex: function(l) {
          this.checkIndex(l), this.index = l;
        }, skip: function(l) {
          this.setIndex(this.index + l);
        }, byteAt: function() {
        }, readInt: function(l) {
          var d, h = 0;
          for (this.checkOffset(l), d = this.index + l - 1; d >= this.index; d--) h = (h << 8) + this.byteAt(d);
          return this.index += l, h;
        }, readString: function(l) {
          return s.transformTo("string", this.readData(l));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var l = this.readInt(4);
          return new Date(Date.UTC(1980 + (l >> 25 & 127), (l >> 21 & 15) - 1, l >> 16 & 31, l >> 11 & 31, l >> 5 & 63, (31 & l) << 1));
        } }, r.exports = a;
      }, { "../utils": 32 }], 19: [function(n, r, i) {
        var s = n("./Uint8ArrayReader");
        function a(l) {
          s.call(this, l);
        }
        n("../utils").inherits(a, s), a.prototype.readData = function(l) {
          this.checkOffset(l);
          var d = this.data.slice(this.zero + this.index, this.zero + this.index + l);
          return this.index += l, d;
        }, r.exports = a;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(n, r, i) {
        var s = n("./DataReader");
        function a(l) {
          s.call(this, l);
        }
        n("../utils").inherits(a, s), a.prototype.byteAt = function(l) {
          return this.data.charCodeAt(this.zero + l);
        }, a.prototype.lastIndexOfSignature = function(l) {
          return this.data.lastIndexOf(l) - this.zero;
        }, a.prototype.readAndCheckSignature = function(l) {
          return l === this.readData(4);
        }, a.prototype.readData = function(l) {
          this.checkOffset(l);
          var d = this.data.slice(this.zero + this.index, this.zero + this.index + l);
          return this.index += l, d;
        }, r.exports = a;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(n, r, i) {
        var s = n("./ArrayReader");
        function a(l) {
          s.call(this, l);
        }
        n("../utils").inherits(a, s), a.prototype.readData = function(l) {
          if (this.checkOffset(l), l === 0) return new Uint8Array(0);
          var d = this.data.subarray(this.zero + this.index, this.zero + this.index + l);
          return this.index += l, d;
        }, r.exports = a;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(n, r, i) {
        var s = n("../utils"), a = n("../support"), l = n("./ArrayReader"), d = n("./StringReader"), h = n("./NodeBufferReader"), b = n("./Uint8ArrayReader");
        r.exports = function(m) {
          var p = s.getTypeOf(m);
          return s.checkSupport(p), p !== "string" || a.uint8array ? p === "nodebuffer" ? new h(m) : a.uint8array ? new b(s.transformTo("uint8array", m)) : new l(s.transformTo("array", m)) : new d(m);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(n, r, i) {
        i.LOCAL_FILE_HEADER = "PK", i.CENTRAL_FILE_HEADER = "PK", i.CENTRAL_DIRECTORY_END = "PK", i.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", i.ZIP64_CENTRAL_DIRECTORY_END = "PK", i.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(n, r, i) {
        var s = n("./GenericWorker"), a = n("../utils");
        function l(d) {
          s.call(this, "ConvertWorker to " + d), this.destType = d;
        }
        a.inherits(l, s), l.prototype.processChunk = function(d) {
          this.push({ data: a.transformTo(this.destType, d.data), meta: d.meta });
        }, r.exports = l;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(n, r, i) {
        var s = n("./GenericWorker"), a = n("../crc32");
        function l() {
          s.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        n("../utils").inherits(l, s), l.prototype.processChunk = function(d) {
          this.streamInfo.crc32 = a(d.data, this.streamInfo.crc32 || 0), this.push(d);
        }, r.exports = l;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(n, r, i) {
        var s = n("../utils"), a = n("./GenericWorker");
        function l(d) {
          a.call(this, "DataLengthProbe for " + d), this.propName = d, this.withStreamInfo(d, 0);
        }
        s.inherits(l, a), l.prototype.processChunk = function(d) {
          if (d) {
            var h = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = h + d.data.length;
          }
          a.prototype.processChunk.call(this, d);
        }, r.exports = l;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(n, r, i) {
        var s = n("../utils"), a = n("./GenericWorker");
        function l(d) {
          a.call(this, "DataWorker");
          var h = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, d.then(function(b) {
            h.dataIsReady = !0, h.data = b, h.max = b && b.length || 0, h.type = s.getTypeOf(b), h.isPaused || h._tickAndRepeat();
          }, function(b) {
            h.error(b);
          });
        }
        s.inherits(l, a), l.prototype.cleanUp = function() {
          a.prototype.cleanUp.call(this), this.data = null;
        }, l.prototype.resume = function() {
          return !!a.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, s.delay(this._tickAndRepeat, [], this)), !0);
        }, l.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (s.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, l.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var d = null, h = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              d = this.data.substring(this.index, h);
              break;
            case "uint8array":
              d = this.data.subarray(this.index, h);
              break;
            case "array":
            case "nodebuffer":
              d = this.data.slice(this.index, h);
          }
          return this.index = h, this.push({ data: d, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, r.exports = l;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(n, r, i) {
        function s(a) {
          this.name = a || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        s.prototype = { push: function(a) {
          this.emit("data", a);
        }, end: function() {
          if (this.isFinished) return !1;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = !0;
          } catch (a) {
            this.emit("error", a);
          }
          return !0;
        }, error: function(a) {
          return !this.isFinished && (this.isPaused ? this.generatedError = a : (this.isFinished = !0, this.emit("error", a), this.previous && this.previous.error(a), this.cleanUp()), !0);
        }, on: function(a, l) {
          return this._listeners[a].push(l), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(a, l) {
          if (this._listeners[a]) for (var d = 0; d < this._listeners[a].length; d++) this._listeners[a][d].call(this, l);
        }, pipe: function(a) {
          return a.registerPrevious(this);
        }, registerPrevious: function(a) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = a.streamInfo, this.mergeStreamInfo(), this.previous = a;
          var l = this;
          return a.on("data", function(d) {
            l.processChunk(d);
          }), a.on("end", function() {
            l.end();
          }), a.on("error", function(d) {
            l.error(d);
          }), this;
        }, pause: function() {
          return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
        }, resume: function() {
          if (!this.isPaused || this.isFinished) return !1;
          var a = this.isPaused = !1;
          return this.generatedError && (this.error(this.generatedError), a = !0), this.previous && this.previous.resume(), !a;
        }, flush: function() {
        }, processChunk: function(a) {
          this.push(a);
        }, withStreamInfo: function(a, l) {
          return this.extraStreamInfo[a] = l, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var a in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, a) && (this.streamInfo[a] = this.extraStreamInfo[a]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var a = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + a : a;
        } }, r.exports = s;
      }, {}], 29: [function(n, r, i) {
        var s = n("../utils"), a = n("./ConvertWorker"), l = n("./GenericWorker"), d = n("../base64"), h = n("../support"), b = n("../external"), m = null;
        if (h.nodestream) try {
          m = n("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function p(_, k) {
          return new b.Promise(function(y, C) {
            var S = [], x = _._internalType, z = _._outputType, N = _._mimeType;
            _.on("data", function(R, B) {
              S.push(R), k && k(B);
            }).on("error", function(R) {
              S = [], C(R);
            }).on("end", function() {
              try {
                var R = (function(B, U, Q) {
                  switch (B) {
                    case "blob":
                      return s.newBlob(s.transformTo("arraybuffer", U), Q);
                    case "base64":
                      return d.encode(U);
                    default:
                      return s.transformTo(B, U);
                  }
                })(z, (function(B, U) {
                  var Q, K = 0, pe = null, E = 0;
                  for (Q = 0; Q < U.length; Q++) E += U[Q].length;
                  switch (B) {
                    case "string":
                      return U.join("");
                    case "array":
                      return Array.prototype.concat.apply([], U);
                    case "uint8array":
                      for (pe = new Uint8Array(E), Q = 0; Q < U.length; Q++) pe.set(U[Q], K), K += U[Q].length;
                      return pe;
                    case "nodebuffer":
                      return Buffer.concat(U);
                    default:
                      throw new Error("concat : unsupported type '" + B + "'");
                  }
                })(x, S), N);
                y(R);
              } catch (B) {
                C(B);
              }
              S = [];
            }).resume();
          });
        }
        function g(_, k, y) {
          var C = k;
          switch (k) {
            case "blob":
            case "arraybuffer":
              C = "uint8array";
              break;
            case "base64":
              C = "string";
          }
          try {
            this._internalType = C, this._outputType = k, this._mimeType = y, s.checkSupport(C), this._worker = _.pipe(new a(C)), _.lock();
          } catch (S) {
            this._worker = new l("error"), this._worker.error(S);
          }
        }
        g.prototype = { accumulate: function(_) {
          return p(this, _);
        }, on: function(_, k) {
          var y = this;
          return _ === "data" ? this._worker.on(_, function(C) {
            k.call(y, C.data, C.meta);
          }) : this._worker.on(_, function() {
            s.delay(k, arguments, y);
          }), this;
        }, resume: function() {
          return s.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(_) {
          if (s.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new m(this, { objectMode: this._outputType !== "nodebuffer" }, _);
        } }, r.exports = g;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(n, r, i) {
        if (i.base64 = !0, i.array = !0, i.string = !0, i.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", i.nodebuffer = typeof Buffer < "u", i.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") i.blob = !1;
        else {
          var s = new ArrayBuffer(0);
          try {
            i.blob = new Blob([s], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var a = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              a.append(s), i.blob = a.getBlob("application/zip").size === 0;
            } catch {
              i.blob = !1;
            }
          }
        }
        try {
          i.nodestream = !!n("readable-stream").Readable;
        } catch {
          i.nodestream = !1;
        }
      }, { "readable-stream": 16 }], 31: [function(n, r, i) {
        for (var s = n("./utils"), a = n("./support"), l = n("./nodejsUtils"), d = n("./stream/GenericWorker"), h = new Array(256), b = 0; b < 256; b++) h[b] = 252 <= b ? 6 : 248 <= b ? 5 : 240 <= b ? 4 : 224 <= b ? 3 : 192 <= b ? 2 : 1;
        h[254] = h[254] = 1;
        function m() {
          d.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function p() {
          d.call(this, "utf-8 encode");
        }
        i.utf8encode = function(g) {
          return a.nodebuffer ? l.newBufferFrom(g, "utf-8") : (function(_) {
            var k, y, C, S, x, z = _.length, N = 0;
            for (S = 0; S < z; S++) (64512 & (y = _.charCodeAt(S))) == 55296 && S + 1 < z && (64512 & (C = _.charCodeAt(S + 1))) == 56320 && (y = 65536 + (y - 55296 << 10) + (C - 56320), S++), N += y < 128 ? 1 : y < 2048 ? 2 : y < 65536 ? 3 : 4;
            for (k = a.uint8array ? new Uint8Array(N) : new Array(N), S = x = 0; x < N; S++) (64512 & (y = _.charCodeAt(S))) == 55296 && S + 1 < z && (64512 & (C = _.charCodeAt(S + 1))) == 56320 && (y = 65536 + (y - 55296 << 10) + (C - 56320), S++), y < 128 ? k[x++] = y : (y < 2048 ? k[x++] = 192 | y >>> 6 : (y < 65536 ? k[x++] = 224 | y >>> 12 : (k[x++] = 240 | y >>> 18, k[x++] = 128 | y >>> 12 & 63), k[x++] = 128 | y >>> 6 & 63), k[x++] = 128 | 63 & y);
            return k;
          })(g);
        }, i.utf8decode = function(g) {
          return a.nodebuffer ? s.transformTo("nodebuffer", g).toString("utf-8") : (function(_) {
            var k, y, C, S, x = _.length, z = new Array(2 * x);
            for (k = y = 0; k < x; ) if ((C = _[k++]) < 128) z[y++] = C;
            else if (4 < (S = h[C])) z[y++] = 65533, k += S - 1;
            else {
              for (C &= S === 2 ? 31 : S === 3 ? 15 : 7; 1 < S && k < x; ) C = C << 6 | 63 & _[k++], S--;
              1 < S ? z[y++] = 65533 : C < 65536 ? z[y++] = C : (C -= 65536, z[y++] = 55296 | C >> 10 & 1023, z[y++] = 56320 | 1023 & C);
            }
            return z.length !== y && (z.subarray ? z = z.subarray(0, y) : z.length = y), s.applyFromCharCode(z);
          })(g = s.transformTo(a.uint8array ? "uint8array" : "array", g));
        }, s.inherits(m, d), m.prototype.processChunk = function(g) {
          var _ = s.transformTo(a.uint8array ? "uint8array" : "array", g.data);
          if (this.leftOver && this.leftOver.length) {
            if (a.uint8array) {
              var k = _;
              (_ = new Uint8Array(k.length + this.leftOver.length)).set(this.leftOver, 0), _.set(k, this.leftOver.length);
            } else _ = this.leftOver.concat(_);
            this.leftOver = null;
          }
          var y = (function(S, x) {
            var z;
            for ((x = x || S.length) > S.length && (x = S.length), z = x - 1; 0 <= z && (192 & S[z]) == 128; ) z--;
            return z < 0 || z === 0 ? x : z + h[S[z]] > x ? z : x;
          })(_), C = _;
          y !== _.length && (a.uint8array ? (C = _.subarray(0, y), this.leftOver = _.subarray(y, _.length)) : (C = _.slice(0, y), this.leftOver = _.slice(y, _.length))), this.push({ data: i.utf8decode(C), meta: g.meta });
        }, m.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: i.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, i.Utf8DecodeWorker = m, s.inherits(p, d), p.prototype.processChunk = function(g) {
          this.push({ data: i.utf8encode(g.data), meta: g.meta });
        }, i.Utf8EncodeWorker = p;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(n, r, i) {
        var s = n("./support"), a = n("./base64"), l = n("./nodejsUtils"), d = n("./external");
        function h(k) {
          return k;
        }
        function b(k, y) {
          for (var C = 0; C < k.length; ++C) y[C] = 255 & k.charCodeAt(C);
          return y;
        }
        n("setimmediate"), i.newBlob = function(k, y) {
          i.checkSupport("blob");
          try {
            return new Blob([k], { type: y });
          } catch {
            try {
              var C = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return C.append(k), C.getBlob(y);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var m = { stringifyByChunk: function(k, y, C) {
          var S = [], x = 0, z = k.length;
          if (z <= C) return String.fromCharCode.apply(null, k);
          for (; x < z; ) y === "array" || y === "nodebuffer" ? S.push(String.fromCharCode.apply(null, k.slice(x, Math.min(x + C, z)))) : S.push(String.fromCharCode.apply(null, k.subarray(x, Math.min(x + C, z)))), x += C;
          return S.join("");
        }, stringifyByChar: function(k) {
          for (var y = "", C = 0; C < k.length; C++) y += String.fromCharCode(k[C]);
          return y;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return s.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        })(), nodebuffer: (function() {
          try {
            return s.nodebuffer && String.fromCharCode.apply(null, l.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        })() } };
        function p(k) {
          var y = 65536, C = i.getTypeOf(k), S = !0;
          if (C === "uint8array" ? S = m.applyCanBeUsed.uint8array : C === "nodebuffer" && (S = m.applyCanBeUsed.nodebuffer), S) for (; 1 < y; ) try {
            return m.stringifyByChunk(k, C, y);
          } catch {
            y = Math.floor(y / 2);
          }
          return m.stringifyByChar(k);
        }
        function g(k, y) {
          for (var C = 0; C < k.length; C++) y[C] = k[C];
          return y;
        }
        i.applyFromCharCode = p;
        var _ = {};
        _.string = { string: h, array: function(k) {
          return b(k, new Array(k.length));
        }, arraybuffer: function(k) {
          return _.string.uint8array(k).buffer;
        }, uint8array: function(k) {
          return b(k, new Uint8Array(k.length));
        }, nodebuffer: function(k) {
          return b(k, l.allocBuffer(k.length));
        } }, _.array = { string: p, array: h, arraybuffer: function(k) {
          return new Uint8Array(k).buffer;
        }, uint8array: function(k) {
          return new Uint8Array(k);
        }, nodebuffer: function(k) {
          return l.newBufferFrom(k);
        } }, _.arraybuffer = { string: function(k) {
          return p(new Uint8Array(k));
        }, array: function(k) {
          return g(new Uint8Array(k), new Array(k.byteLength));
        }, arraybuffer: h, uint8array: function(k) {
          return new Uint8Array(k);
        }, nodebuffer: function(k) {
          return l.newBufferFrom(new Uint8Array(k));
        } }, _.uint8array = { string: p, array: function(k) {
          return g(k, new Array(k.length));
        }, arraybuffer: function(k) {
          return k.buffer;
        }, uint8array: h, nodebuffer: function(k) {
          return l.newBufferFrom(k);
        } }, _.nodebuffer = { string: p, array: function(k) {
          return g(k, new Array(k.length));
        }, arraybuffer: function(k) {
          return _.nodebuffer.uint8array(k).buffer;
        }, uint8array: function(k) {
          return g(k, new Uint8Array(k.length));
        }, nodebuffer: h }, i.transformTo = function(k, y) {
          if (y = y || "", !k) return y;
          i.checkSupport(k);
          var C = i.getTypeOf(y);
          return _[C][k](y);
        }, i.resolve = function(k) {
          for (var y = k.split("/"), C = [], S = 0; S < y.length; S++) {
            var x = y[S];
            x === "." || x === "" && S !== 0 && S !== y.length - 1 || (x === ".." ? C.pop() : C.push(x));
          }
          return C.join("/");
        }, i.getTypeOf = function(k) {
          if (typeof k == "string") return "string";
          var y = Object.prototype.toString.call(k);
          return y === "[object Array]" ? "array" : s.nodebuffer && l.isBuffer(k) ? "nodebuffer" : s.uint8array && y === "[object Uint8Array]" ? "uint8array" : s.arraybuffer && y === "[object ArrayBuffer]" ? "arraybuffer" : void 0;
        }, i.checkSupport = function(k) {
          if (!s[k.toLowerCase()]) throw new Error(k + " is not supported by this platform");
        }, i.MAX_VALUE_16BITS = 65535, i.MAX_VALUE_32BITS = -1, i.pretty = function(k) {
          var y, C, S = "";
          for (C = 0; C < (k || "").length; C++) S += "\\x" + ((y = k.charCodeAt(C)) < 16 ? "0" : "") + y.toString(16).toUpperCase();
          return S;
        }, i.delay = function(k, y, C) {
          setImmediate(function() {
            k.apply(C || null, y || []);
          });
        }, i.inherits = function(k, y) {
          function C() {
          }
          C.prototype = y.prototype, k.prototype = new C();
        }, i.extend = function() {
          var k, y, C = {};
          for (k = 0; k < arguments.length; k++) for (y in arguments[k]) Object.prototype.hasOwnProperty.call(arguments[k], y) && C[y] === void 0 && (C[y] = arguments[k][y]);
          return C;
        }, i.prepareContent = function(k, y, C, S, x) {
          return d.Promise.resolve(y).then(function(z) {
            return s.blob && (z instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(z)) !== -1) ? Blob.prototype.arrayBuffer !== void 0 ? z.arrayBuffer() : typeof FileReader < "u" ? new d.Promise(function(N, R) {
              var B = new FileReader();
              B.onload = function(U) {
                N(U.target.result);
              }, B.onerror = function(U) {
                R(U.target.error);
              }, B.readAsArrayBuffer(z);
            }) : d.Promise.reject(new Error(k + " is a Blob, but we have no way of reading it.")) : z;
          }).then(function(z) {
            var N = i.getTypeOf(z);
            return N ? (N === "arraybuffer" ? z = i.transformTo("uint8array", z) : N === "string" && (x ? z = a.decode(z) : C && S !== !0 && (z = (function(R) {
              return b(R, s.uint8array ? new Uint8Array(R.length) : new Array(R.length));
            })(z))), z) : d.Promise.reject(new Error("Can't read the data of '" + k + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(n, r, i) {
        var s = n("./reader/readerFor"), a = n("./utils"), l = n("./signature"), d = n("./zipEntry"), h = n("./support");
        function b(m) {
          this.files = [], this.loadOptions = m;
        }
        b.prototype = { checkSignature: function(m) {
          if (!this.reader.readAndCheckSignature(m)) {
            this.reader.index -= 4;
            var p = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + a.pretty(p) + ", expected " + a.pretty(m) + ")");
          }
        }, isSignature: function(m, p) {
          var g = this.reader.index;
          this.reader.setIndex(m);
          var _ = this.reader.readString(4) === p;
          return this.reader.setIndex(g), _;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var m = this.reader.readData(this.zipCommentLength), p = h.uint8array ? "uint8array" : "array", g = a.transformTo(p, m);
          this.zipComment = this.loadOptions.decodeFileName(g);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var m, p, g, _ = this.zip64EndOfCentralSize - 44; 0 < _; ) m = this.reader.readInt(2), p = this.reader.readInt(4), g = this.reader.readData(p), this.zip64ExtensibleData[m] = { id: m, length: p, value: g };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var m, p;
          for (m = 0; m < this.files.length; m++) p = this.files[m], this.reader.setIndex(p.localHeaderOffset), this.checkSignature(l.LOCAL_FILE_HEADER), p.readLocalPart(this.reader), p.handleUTF8(), p.processAttributes();
        }, readCentralDir: function() {
          var m;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(l.CENTRAL_FILE_HEADER); ) (m = new d({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(m);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var m = this.reader.lastIndexOfSignature(l.CENTRAL_DIRECTORY_END);
          if (m < 0) throw this.isSignature(0, l.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(m);
          var p = m;
          if (this.checkSignature(l.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === a.MAX_VALUE_16BITS || this.diskWithCentralDirStart === a.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === a.MAX_VALUE_16BITS || this.centralDirRecords === a.MAX_VALUE_16BITS || this.centralDirSize === a.MAX_VALUE_32BITS || this.centralDirOffset === a.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (m = this.reader.lastIndexOfSignature(l.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(m), this.checkSignature(l.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, l.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(l.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(l.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var g = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (g += 20, g += 12 + this.zip64EndOfCentralSize);
          var _ = p - g;
          if (0 < _) this.isSignature(p, l.CENTRAL_FILE_HEADER) || (this.reader.zero = _);
          else if (_ < 0) throw new Error("Corrupted zip: missing " + Math.abs(_) + " bytes.");
        }, prepareReader: function(m) {
          this.reader = s(m);
        }, load: function(m) {
          this.prepareReader(m), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, r.exports = b;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(n, r, i) {
        var s = n("./reader/readerFor"), a = n("./utils"), l = n("./compressedObject"), d = n("./crc32"), h = n("./utf8"), b = n("./compressions"), m = n("./support");
        function p(g, _) {
          this.options = g, this.loadOptions = _;
        }
        p.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(g) {
          var _, k;
          if (g.skip(22), this.fileNameLength = g.readInt(2), k = g.readInt(2), this.fileName = g.readData(this.fileNameLength), g.skip(k), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((_ = (function(y) {
            for (var C in b) if (Object.prototype.hasOwnProperty.call(b, C) && b[C].magic === y) return b[C];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + a.pretty(this.compressionMethod) + " unknown (inner file : " + a.transformTo("string", this.fileName) + ")");
          this.decompressed = new l(this.compressedSize, this.uncompressedSize, this.crc32, _, g.readData(this.compressedSize));
        }, readCentralPart: function(g) {
          this.versionMadeBy = g.readInt(2), g.skip(2), this.bitFlag = g.readInt(2), this.compressionMethod = g.readString(2), this.date = g.readDate(), this.crc32 = g.readInt(4), this.compressedSize = g.readInt(4), this.uncompressedSize = g.readInt(4);
          var _ = g.readInt(2);
          if (this.extraFieldsLength = g.readInt(2), this.fileCommentLength = g.readInt(2), this.diskNumberStart = g.readInt(2), this.internalFileAttributes = g.readInt(2), this.externalFileAttributes = g.readInt(4), this.localHeaderOffset = g.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          g.skip(_), this.readExtraFields(g), this.parseZIP64ExtraField(g), this.fileComment = g.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var g = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), g == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), g == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var g = s(this.extraFields[1].value);
            this.uncompressedSize === a.MAX_VALUE_32BITS && (this.uncompressedSize = g.readInt(8)), this.compressedSize === a.MAX_VALUE_32BITS && (this.compressedSize = g.readInt(8)), this.localHeaderOffset === a.MAX_VALUE_32BITS && (this.localHeaderOffset = g.readInt(8)), this.diskNumberStart === a.MAX_VALUE_32BITS && (this.diskNumberStart = g.readInt(4));
          }
        }, readExtraFields: function(g) {
          var _, k, y, C = g.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); g.index + 4 < C; ) _ = g.readInt(2), k = g.readInt(2), y = g.readData(k), this.extraFields[_] = { id: _, length: k, value: y };
          g.setIndex(C);
        }, handleUTF8: function() {
          var g = m.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = h.utf8decode(this.fileName), this.fileCommentStr = h.utf8decode(this.fileComment);
          else {
            var _ = this.findExtraFieldUnicodePath();
            if (_ !== null) this.fileNameStr = _;
            else {
              var k = a.transformTo(g, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(k);
            }
            var y = this.findExtraFieldUnicodeComment();
            if (y !== null) this.fileCommentStr = y;
            else {
              var C = a.transformTo(g, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(C);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var g = this.extraFields[28789];
          if (g) {
            var _ = s(g.value);
            return _.readInt(1) !== 1 || d(this.fileName) !== _.readInt(4) ? null : h.utf8decode(_.readData(g.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var g = this.extraFields[25461];
          if (g) {
            var _ = s(g.value);
            return _.readInt(1) !== 1 || d(this.fileComment) !== _.readInt(4) ? null : h.utf8decode(_.readData(g.length - 5));
          }
          return null;
        } }, r.exports = p;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(n, r, i) {
        function s(_, k, y) {
          this.name = _, this.dir = y.dir, this.date = y.date, this.comment = y.comment, this.unixPermissions = y.unixPermissions, this.dosPermissions = y.dosPermissions, this._data = k, this._dataBinary = y.binary, this.options = { compression: y.compression, compressionOptions: y.compressionOptions };
        }
        var a = n("./stream/StreamHelper"), l = n("./stream/DataWorker"), d = n("./utf8"), h = n("./compressedObject"), b = n("./stream/GenericWorker");
        s.prototype = { internalStream: function(_) {
          var k = null, y = "string";
          try {
            if (!_) throw new Error("No output type specified.");
            var C = (y = _.toLowerCase()) === "string" || y === "text";
            y !== "binarystring" && y !== "text" || (y = "string"), k = this._decompressWorker();
            var S = !this._dataBinary;
            S && !C && (k = k.pipe(new d.Utf8EncodeWorker())), !S && C && (k = k.pipe(new d.Utf8DecodeWorker()));
          } catch (x) {
            (k = new b("error")).error(x);
          }
          return new a(k, y, "");
        }, async: function(_, k) {
          return this.internalStream(_).accumulate(k);
        }, nodeStream: function(_, k) {
          return this.internalStream(_ || "nodebuffer").toNodejsStream(k);
        }, _compressWorker: function(_, k) {
          if (this._data instanceof h && this._data.compression.magic === _.magic) return this._data.getCompressedWorker();
          var y = this._decompressWorker();
          return this._dataBinary || (y = y.pipe(new d.Utf8EncodeWorker())), h.createWorkerFrom(y, _, k);
        }, _decompressWorker: function() {
          return this._data instanceof h ? this._data.getContentWorker() : this._data instanceof b ? this._data : new l(this._data);
        } };
        for (var m = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], p = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, g = 0; g < m.length; g++) s.prototype[m[g]] = p;
        r.exports = s;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(n, r, i) {
        (function(s) {
          var a, l, d = s.MutationObserver || s.WebKitMutationObserver;
          if (d) {
            var h = 0, b = new d(_), m = s.document.createTextNode("");
            b.observe(m, { characterData: !0 }), a = function() {
              m.data = h = ++h % 2;
            };
          } else if (s.setImmediate || s.MessageChannel === void 0) a = "document" in s && "onreadystatechange" in s.document.createElement("script") ? function() {
            var k = s.document.createElement("script");
            k.onreadystatechange = function() {
              _(), k.onreadystatechange = null, k.parentNode.removeChild(k), k = null;
            }, s.document.documentElement.appendChild(k);
          } : function() {
            setTimeout(_, 0);
          };
          else {
            var p = new s.MessageChannel();
            p.port1.onmessage = _, a = function() {
              p.port2.postMessage(0);
            };
          }
          var g = [];
          function _() {
            var k, y;
            l = !0;
            for (var C = g.length; C; ) {
              for (y = g, g = [], k = -1; ++k < C; ) y[k]();
              C = g.length;
            }
            l = !1;
          }
          r.exports = function(k) {
            g.push(k) !== 1 || l || a();
          };
        }).call(this, typeof Ma < "u" ? Ma : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(n, r, i) {
        var s = n("immediate");
        function a() {
        }
        var l = {}, d = ["REJECTED"], h = ["FULFILLED"], b = ["PENDING"];
        function m(C) {
          if (typeof C != "function") throw new TypeError("resolver must be a function");
          this.state = b, this.queue = [], this.outcome = void 0, C !== a && k(this, C);
        }
        function p(C, S, x) {
          this.promise = C, typeof S == "function" && (this.onFulfilled = S, this.callFulfilled = this.otherCallFulfilled), typeof x == "function" && (this.onRejected = x, this.callRejected = this.otherCallRejected);
        }
        function g(C, S, x) {
          s(function() {
            var z;
            try {
              z = S(x);
            } catch (N) {
              return l.reject(C, N);
            }
            z === C ? l.reject(C, new TypeError("Cannot resolve promise with itself")) : l.resolve(C, z);
          });
        }
        function _(C) {
          var S = C && C.then;
          if (C && (typeof C == "object" || typeof C == "function") && typeof S == "function") return function() {
            S.apply(C, arguments);
          };
        }
        function k(C, S) {
          var x = !1;
          function z(B) {
            x || (x = !0, l.reject(C, B));
          }
          function N(B) {
            x || (x = !0, l.resolve(C, B));
          }
          var R = y(function() {
            S(N, z);
          });
          R.status === "error" && z(R.value);
        }
        function y(C, S) {
          var x = {};
          try {
            x.value = C(S), x.status = "success";
          } catch (z) {
            x.status = "error", x.value = z;
          }
          return x;
        }
        (r.exports = m).prototype.finally = function(C) {
          if (typeof C != "function") return this;
          var S = this.constructor;
          return this.then(function(x) {
            return S.resolve(C()).then(function() {
              return x;
            });
          }, function(x) {
            return S.resolve(C()).then(function() {
              throw x;
            });
          });
        }, m.prototype.catch = function(C) {
          return this.then(null, C);
        }, m.prototype.then = function(C, S) {
          if (typeof C != "function" && this.state === h || typeof S != "function" && this.state === d) return this;
          var x = new this.constructor(a);
          return this.state !== b ? g(x, this.state === h ? C : S, this.outcome) : this.queue.push(new p(x, C, S)), x;
        }, p.prototype.callFulfilled = function(C) {
          l.resolve(this.promise, C);
        }, p.prototype.otherCallFulfilled = function(C) {
          g(this.promise, this.onFulfilled, C);
        }, p.prototype.callRejected = function(C) {
          l.reject(this.promise, C);
        }, p.prototype.otherCallRejected = function(C) {
          g(this.promise, this.onRejected, C);
        }, l.resolve = function(C, S) {
          var x = y(_, S);
          if (x.status === "error") return l.reject(C, x.value);
          var z = x.value;
          if (z) k(C, z);
          else {
            C.state = h, C.outcome = S;
            for (var N = -1, R = C.queue.length; ++N < R; ) C.queue[N].callFulfilled(S);
          }
          return C;
        }, l.reject = function(C, S) {
          C.state = d, C.outcome = S;
          for (var x = -1, z = C.queue.length; ++x < z; ) C.queue[x].callRejected(S);
          return C;
        }, m.resolve = function(C) {
          return C instanceof this ? C : l.resolve(new this(a), C);
        }, m.reject = function(C) {
          var S = new this(a);
          return l.reject(S, C);
        }, m.all = function(C) {
          var S = this;
          if (Object.prototype.toString.call(C) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var x = C.length, z = !1;
          if (!x) return this.resolve([]);
          for (var N = new Array(x), R = 0, B = -1, U = new this(a); ++B < x; ) Q(C[B], B);
          return U;
          function Q(K, pe) {
            S.resolve(K).then(function(E) {
              N[pe] = E, ++R !== x || z || (z = !0, l.resolve(U, N));
            }, function(E) {
              z || (z = !0, l.reject(U, E));
            });
          }
        }, m.race = function(C) {
          var S = this;
          if (Object.prototype.toString.call(C) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var x = C.length, z = !1;
          if (!x) return this.resolve([]);
          for (var N = -1, R = new this(a); ++N < x; ) B = C[N], S.resolve(B).then(function(U) {
            z || (z = !0, l.resolve(R, U));
          }, function(U) {
            z || (z = !0, l.reject(R, U));
          });
          var B;
          return R;
        };
      }, { immediate: 36 }], 38: [function(n, r, i) {
        var s = {};
        (0, n("./lib/utils/common").assign)(s, n("./lib/deflate"), n("./lib/inflate"), n("./lib/zlib/constants")), r.exports = s;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(n, r, i) {
        var s = n("./zlib/deflate"), a = n("./utils/common"), l = n("./utils/strings"), d = n("./zlib/messages"), h = n("./zlib/zstream"), b = Object.prototype.toString, m = 0, p = -1, g = 0, _ = 8;
        function k(C) {
          if (!(this instanceof k)) return new k(C);
          this.options = a.assign({ level: p, method: _, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: g, to: "" }, C || {});
          var S = this.options;
          S.raw && 0 < S.windowBits ? S.windowBits = -S.windowBits : S.gzip && 0 < S.windowBits && S.windowBits < 16 && (S.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new h(), this.strm.avail_out = 0;
          var x = s.deflateInit2(this.strm, S.level, S.method, S.windowBits, S.memLevel, S.strategy);
          if (x !== m) throw new Error(d[x]);
          if (S.header && s.deflateSetHeader(this.strm, S.header), S.dictionary) {
            var z;
            if (z = typeof S.dictionary == "string" ? l.string2buf(S.dictionary) : b.call(S.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(S.dictionary) : S.dictionary, (x = s.deflateSetDictionary(this.strm, z)) !== m) throw new Error(d[x]);
            this._dict_set = !0;
          }
        }
        function y(C, S) {
          var x = new k(S);
          if (x.push(C, !0), x.err) throw x.msg || d[x.err];
          return x.result;
        }
        k.prototype.push = function(C, S) {
          var x, z, N = this.strm, R = this.options.chunkSize;
          if (this.ended) return !1;
          z = S === ~~S ? S : S === !0 ? 4 : 0, typeof C == "string" ? N.input = l.string2buf(C) : b.call(C) === "[object ArrayBuffer]" ? N.input = new Uint8Array(C) : N.input = C, N.next_in = 0, N.avail_in = N.input.length;
          do {
            if (N.avail_out === 0 && (N.output = new a.Buf8(R), N.next_out = 0, N.avail_out = R), (x = s.deflate(N, z)) !== 1 && x !== m) return this.onEnd(x), !(this.ended = !0);
            N.avail_out !== 0 && (N.avail_in !== 0 || z !== 4 && z !== 2) || (this.options.to === "string" ? this.onData(l.buf2binstring(a.shrinkBuf(N.output, N.next_out))) : this.onData(a.shrinkBuf(N.output, N.next_out)));
          } while ((0 < N.avail_in || N.avail_out === 0) && x !== 1);
          return z === 4 ? (x = s.deflateEnd(this.strm), this.onEnd(x), this.ended = !0, x === m) : z !== 2 || (this.onEnd(m), !(N.avail_out = 0));
        }, k.prototype.onData = function(C) {
          this.chunks.push(C);
        }, k.prototype.onEnd = function(C) {
          C === m && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = a.flattenChunks(this.chunks)), this.chunks = [], this.err = C, this.msg = this.strm.msg;
        }, i.Deflate = k, i.deflate = y, i.deflateRaw = function(C, S) {
          return (S = S || {}).raw = !0, y(C, S);
        }, i.gzip = function(C, S) {
          return (S = S || {}).gzip = !0, y(C, S);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(n, r, i) {
        var s = n("./zlib/inflate"), a = n("./utils/common"), l = n("./utils/strings"), d = n("./zlib/constants"), h = n("./zlib/messages"), b = n("./zlib/zstream"), m = n("./zlib/gzheader"), p = Object.prototype.toString;
        function g(k) {
          if (!(this instanceof g)) return new g(k);
          this.options = a.assign({ chunkSize: 16384, windowBits: 0, to: "" }, k || {});
          var y = this.options;
          y.raw && 0 <= y.windowBits && y.windowBits < 16 && (y.windowBits = -y.windowBits, y.windowBits === 0 && (y.windowBits = -15)), !(0 <= y.windowBits && y.windowBits < 16) || k && k.windowBits || (y.windowBits += 32), 15 < y.windowBits && y.windowBits < 48 && (15 & y.windowBits) == 0 && (y.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new b(), this.strm.avail_out = 0;
          var C = s.inflateInit2(this.strm, y.windowBits);
          if (C !== d.Z_OK) throw new Error(h[C]);
          this.header = new m(), s.inflateGetHeader(this.strm, this.header);
        }
        function _(k, y) {
          var C = new g(y);
          if (C.push(k, !0), C.err) throw C.msg || h[C.err];
          return C.result;
        }
        g.prototype.push = function(k, y) {
          var C, S, x, z, N, R, B = this.strm, U = this.options.chunkSize, Q = this.options.dictionary, K = !1;
          if (this.ended) return !1;
          S = y === ~~y ? y : y === !0 ? d.Z_FINISH : d.Z_NO_FLUSH, typeof k == "string" ? B.input = l.binstring2buf(k) : p.call(k) === "[object ArrayBuffer]" ? B.input = new Uint8Array(k) : B.input = k, B.next_in = 0, B.avail_in = B.input.length;
          do {
            if (B.avail_out === 0 && (B.output = new a.Buf8(U), B.next_out = 0, B.avail_out = U), (C = s.inflate(B, d.Z_NO_FLUSH)) === d.Z_NEED_DICT && Q && (R = typeof Q == "string" ? l.string2buf(Q) : p.call(Q) === "[object ArrayBuffer]" ? new Uint8Array(Q) : Q, C = s.inflateSetDictionary(this.strm, R)), C === d.Z_BUF_ERROR && K === !0 && (C = d.Z_OK, K = !1), C !== d.Z_STREAM_END && C !== d.Z_OK) return this.onEnd(C), !(this.ended = !0);
            B.next_out && (B.avail_out !== 0 && C !== d.Z_STREAM_END && (B.avail_in !== 0 || S !== d.Z_FINISH && S !== d.Z_SYNC_FLUSH) || (this.options.to === "string" ? (x = l.utf8border(B.output, B.next_out), z = B.next_out - x, N = l.buf2string(B.output, x), B.next_out = z, B.avail_out = U - z, z && a.arraySet(B.output, B.output, x, z, 0), this.onData(N)) : this.onData(a.shrinkBuf(B.output, B.next_out)))), B.avail_in === 0 && B.avail_out === 0 && (K = !0);
          } while ((0 < B.avail_in || B.avail_out === 0) && C !== d.Z_STREAM_END);
          return C === d.Z_STREAM_END && (S = d.Z_FINISH), S === d.Z_FINISH ? (C = s.inflateEnd(this.strm), this.onEnd(C), this.ended = !0, C === d.Z_OK) : S !== d.Z_SYNC_FLUSH || (this.onEnd(d.Z_OK), !(B.avail_out = 0));
        }, g.prototype.onData = function(k) {
          this.chunks.push(k);
        }, g.prototype.onEnd = function(k) {
          k === d.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = a.flattenChunks(this.chunks)), this.chunks = [], this.err = k, this.msg = this.strm.msg;
        }, i.Inflate = g, i.inflate = _, i.inflateRaw = function(k, y) {
          return (y = y || {}).raw = !0, _(k, y);
        }, i.ungzip = _;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(n, r, i) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        i.assign = function(d) {
          for (var h = Array.prototype.slice.call(arguments, 1); h.length; ) {
            var b = h.shift();
            if (b) {
              if (typeof b != "object") throw new TypeError(b + "must be non-object");
              for (var m in b) b.hasOwnProperty(m) && (d[m] = b[m]);
            }
          }
          return d;
        }, i.shrinkBuf = function(d, h) {
          return d.length === h ? d : d.subarray ? d.subarray(0, h) : (d.length = h, d);
        };
        var a = { arraySet: function(d, h, b, m, p) {
          if (h.subarray && d.subarray) d.set(h.subarray(b, b + m), p);
          else for (var g = 0; g < m; g++) d[p + g] = h[b + g];
        }, flattenChunks: function(d) {
          var h, b, m, p, g, _;
          for (h = m = 0, b = d.length; h < b; h++) m += d[h].length;
          for (_ = new Uint8Array(m), h = p = 0, b = d.length; h < b; h++) g = d[h], _.set(g, p), p += g.length;
          return _;
        } }, l = { arraySet: function(d, h, b, m, p) {
          for (var g = 0; g < m; g++) d[p + g] = h[b + g];
        }, flattenChunks: function(d) {
          return [].concat.apply([], d);
        } };
        i.setTyped = function(d) {
          d ? (i.Buf8 = Uint8Array, i.Buf16 = Uint16Array, i.Buf32 = Int32Array, i.assign(i, a)) : (i.Buf8 = Array, i.Buf16 = Array, i.Buf32 = Array, i.assign(i, l));
        }, i.setTyped(s);
      }, {}], 42: [function(n, r, i) {
        var s = n("./common"), a = !0, l = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          a = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          l = !1;
        }
        for (var d = new s.Buf8(256), h = 0; h < 256; h++) d[h] = 252 <= h ? 6 : 248 <= h ? 5 : 240 <= h ? 4 : 224 <= h ? 3 : 192 <= h ? 2 : 1;
        function b(m, p) {
          if (p < 65537 && (m.subarray && l || !m.subarray && a)) return String.fromCharCode.apply(null, s.shrinkBuf(m, p));
          for (var g = "", _ = 0; _ < p; _++) g += String.fromCharCode(m[_]);
          return g;
        }
        d[254] = d[254] = 1, i.string2buf = function(m) {
          var p, g, _, k, y, C = m.length, S = 0;
          for (k = 0; k < C; k++) (64512 & (g = m.charCodeAt(k))) == 55296 && k + 1 < C && (64512 & (_ = m.charCodeAt(k + 1))) == 56320 && (g = 65536 + (g - 55296 << 10) + (_ - 56320), k++), S += g < 128 ? 1 : g < 2048 ? 2 : g < 65536 ? 3 : 4;
          for (p = new s.Buf8(S), k = y = 0; y < S; k++) (64512 & (g = m.charCodeAt(k))) == 55296 && k + 1 < C && (64512 & (_ = m.charCodeAt(k + 1))) == 56320 && (g = 65536 + (g - 55296 << 10) + (_ - 56320), k++), g < 128 ? p[y++] = g : (g < 2048 ? p[y++] = 192 | g >>> 6 : (g < 65536 ? p[y++] = 224 | g >>> 12 : (p[y++] = 240 | g >>> 18, p[y++] = 128 | g >>> 12 & 63), p[y++] = 128 | g >>> 6 & 63), p[y++] = 128 | 63 & g);
          return p;
        }, i.buf2binstring = function(m) {
          return b(m, m.length);
        }, i.binstring2buf = function(m) {
          for (var p = new s.Buf8(m.length), g = 0, _ = p.length; g < _; g++) p[g] = m.charCodeAt(g);
          return p;
        }, i.buf2string = function(m, p) {
          var g, _, k, y, C = p || m.length, S = new Array(2 * C);
          for (g = _ = 0; g < C; ) if ((k = m[g++]) < 128) S[_++] = k;
          else if (4 < (y = d[k])) S[_++] = 65533, g += y - 1;
          else {
            for (k &= y === 2 ? 31 : y === 3 ? 15 : 7; 1 < y && g < C; ) k = k << 6 | 63 & m[g++], y--;
            1 < y ? S[_++] = 65533 : k < 65536 ? S[_++] = k : (k -= 65536, S[_++] = 55296 | k >> 10 & 1023, S[_++] = 56320 | 1023 & k);
          }
          return b(S, _);
        }, i.utf8border = function(m, p) {
          var g;
          for ((p = p || m.length) > m.length && (p = m.length), g = p - 1; 0 <= g && (192 & m[g]) == 128; ) g--;
          return g < 0 || g === 0 ? p : g + d[m[g]] > p ? g : p;
        };
      }, { "./common": 41 }], 43: [function(n, r, i) {
        r.exports = function(s, a, l, d) {
          for (var h = 65535 & s | 0, b = s >>> 16 & 65535 | 0, m = 0; l !== 0; ) {
            for (l -= m = 2e3 < l ? 2e3 : l; b = b + (h = h + a[d++] | 0) | 0, --m; ) ;
            h %= 65521, b %= 65521;
          }
          return h | b << 16 | 0;
        };
      }, {}], 44: [function(n, r, i) {
        r.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(n, r, i) {
        var s = (function() {
          for (var a, l = [], d = 0; d < 256; d++) {
            a = d;
            for (var h = 0; h < 8; h++) a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
            l[d] = a;
          }
          return l;
        })();
        r.exports = function(a, l, d, h) {
          var b = s, m = h + d;
          a ^= -1;
          for (var p = h; p < m; p++) a = a >>> 8 ^ b[255 & (a ^ l[p])];
          return -1 ^ a;
        };
      }, {}], 46: [function(n, r, i) {
        var s, a = n("../utils/common"), l = n("./trees"), d = n("./adler32"), h = n("./crc32"), b = n("./messages"), m = 0, p = 4, g = 0, _ = -2, k = -1, y = 4, C = 2, S = 8, x = 9, z = 286, N = 30, R = 19, B = 2 * z + 1, U = 15, Q = 3, K = 258, pe = K + Q + 1, E = 42, F = 113, v = 1, T = 2, fe = 3, Z = 4;
        function ke(w, ie) {
          return w.msg = b[ie], ie;
        }
        function q(w) {
          return (w << 1) - (4 < w ? 9 : 0);
        }
        function ge(w) {
          for (var ie = w.length; 0 <= --ie; ) w[ie] = 0;
        }
        function W(w) {
          var ie = w.state, X = ie.pending;
          X > w.avail_out && (X = w.avail_out), X !== 0 && (a.arraySet(w.output, ie.pending_buf, ie.pending_out, X, w.next_out), w.next_out += X, ie.pending_out += X, w.total_out += X, w.avail_out -= X, ie.pending -= X, ie.pending === 0 && (ie.pending_out = 0));
        }
        function H(w, ie) {
          l._tr_flush_block(w, 0 <= w.block_start ? w.block_start : -1, w.strstart - w.block_start, ie), w.block_start = w.strstart, W(w.strm);
        }
        function ye(w, ie) {
          w.pending_buf[w.pending++] = ie;
        }
        function me(w, ie) {
          w.pending_buf[w.pending++] = ie >>> 8 & 255, w.pending_buf[w.pending++] = 255 & ie;
        }
        function de(w, ie) {
          var X, M, D = w.max_chain_length, j = w.strstart, le = w.prev_length, O = w.nice_match, $ = w.strstart > w.w_size - pe ? w.strstart - (w.w_size - pe) : 0, se = w.window, ue = w.w_mask, oe = w.prev, ce = w.strstart + K, Se = se[j + le - 1], Ne = se[j + le];
          w.prev_length >= w.good_match && (D >>= 2), O > w.lookahead && (O = w.lookahead);
          do
            if (se[(X = ie) + le] === Ne && se[X + le - 1] === Se && se[X] === se[j] && se[++X] === se[j + 1]) {
              j += 2, X++;
              do
                ;
              while (se[++j] === se[++X] && se[++j] === se[++X] && se[++j] === se[++X] && se[++j] === se[++X] && se[++j] === se[++X] && se[++j] === se[++X] && se[++j] === se[++X] && se[++j] === se[++X] && j < ce);
              if (M = K - (ce - j), j = ce - K, le < M) {
                if (w.match_start = ie, O <= (le = M)) break;
                Se = se[j + le - 1], Ne = se[j + le];
              }
            }
          while ((ie = oe[ie & ue]) > $ && --D != 0);
          return le <= w.lookahead ? le : w.lookahead;
        }
        function re(w) {
          var ie, X, M, D, j, le, O, $, se, ue, oe = w.w_size;
          do {
            if (D = w.window_size - w.lookahead - w.strstart, w.strstart >= oe + (oe - pe)) {
              for (a.arraySet(w.window, w.window, oe, oe, 0), w.match_start -= oe, w.strstart -= oe, w.block_start -= oe, ie = X = w.hash_size; M = w.head[--ie], w.head[ie] = oe <= M ? M - oe : 0, --X; ) ;
              for (ie = X = oe; M = w.prev[--ie], w.prev[ie] = oe <= M ? M - oe : 0, --X; ) ;
              D += oe;
            }
            if (w.strm.avail_in === 0) break;
            if (le = w.strm, O = w.window, $ = w.strstart + w.lookahead, se = D, ue = void 0, ue = le.avail_in, se < ue && (ue = se), X = ue === 0 ? 0 : (le.avail_in -= ue, a.arraySet(O, le.input, le.next_in, ue, $), le.state.wrap === 1 ? le.adler = d(le.adler, O, ue, $) : le.state.wrap === 2 && (le.adler = h(le.adler, O, ue, $)), le.next_in += ue, le.total_in += ue, ue), w.lookahead += X, w.lookahead + w.insert >= Q) for (j = w.strstart - w.insert, w.ins_h = w.window[j], w.ins_h = (w.ins_h << w.hash_shift ^ w.window[j + 1]) & w.hash_mask; w.insert && (w.ins_h = (w.ins_h << w.hash_shift ^ w.window[j + Q - 1]) & w.hash_mask, w.prev[j & w.w_mask] = w.head[w.ins_h], w.head[w.ins_h] = j, j++, w.insert--, !(w.lookahead + w.insert < Q)); ) ;
          } while (w.lookahead < pe && w.strm.avail_in !== 0);
        }
        function we(w, ie) {
          for (var X, M; ; ) {
            if (w.lookahead < pe) {
              if (re(w), w.lookahead < pe && ie === m) return v;
              if (w.lookahead === 0) break;
            }
            if (X = 0, w.lookahead >= Q && (w.ins_h = (w.ins_h << w.hash_shift ^ w.window[w.strstart + Q - 1]) & w.hash_mask, X = w.prev[w.strstart & w.w_mask] = w.head[w.ins_h], w.head[w.ins_h] = w.strstart), X !== 0 && w.strstart - X <= w.w_size - pe && (w.match_length = de(w, X)), w.match_length >= Q) if (M = l._tr_tally(w, w.strstart - w.match_start, w.match_length - Q), w.lookahead -= w.match_length, w.match_length <= w.max_lazy_match && w.lookahead >= Q) {
              for (w.match_length--; w.strstart++, w.ins_h = (w.ins_h << w.hash_shift ^ w.window[w.strstart + Q - 1]) & w.hash_mask, X = w.prev[w.strstart & w.w_mask] = w.head[w.ins_h], w.head[w.ins_h] = w.strstart, --w.match_length != 0; ) ;
              w.strstart++;
            } else w.strstart += w.match_length, w.match_length = 0, w.ins_h = w.window[w.strstart], w.ins_h = (w.ins_h << w.hash_shift ^ w.window[w.strstart + 1]) & w.hash_mask;
            else M = l._tr_tally(w, 0, w.window[w.strstart]), w.lookahead--, w.strstart++;
            if (M && (H(w, !1), w.strm.avail_out === 0)) return v;
          }
          return w.insert = w.strstart < Q - 1 ? w.strstart : Q - 1, ie === p ? (H(w, !0), w.strm.avail_out === 0 ? fe : Z) : w.last_lit && (H(w, !1), w.strm.avail_out === 0) ? v : T;
        }
        function _e(w, ie) {
          for (var X, M, D; ; ) {
            if (w.lookahead < pe) {
              if (re(w), w.lookahead < pe && ie === m) return v;
              if (w.lookahead === 0) break;
            }
            if (X = 0, w.lookahead >= Q && (w.ins_h = (w.ins_h << w.hash_shift ^ w.window[w.strstart + Q - 1]) & w.hash_mask, X = w.prev[w.strstart & w.w_mask] = w.head[w.ins_h], w.head[w.ins_h] = w.strstart), w.prev_length = w.match_length, w.prev_match = w.match_start, w.match_length = Q - 1, X !== 0 && w.prev_length < w.max_lazy_match && w.strstart - X <= w.w_size - pe && (w.match_length = de(w, X), w.match_length <= 5 && (w.strategy === 1 || w.match_length === Q && 4096 < w.strstart - w.match_start) && (w.match_length = Q - 1)), w.prev_length >= Q && w.match_length <= w.prev_length) {
              for (D = w.strstart + w.lookahead - Q, M = l._tr_tally(w, w.strstart - 1 - w.prev_match, w.prev_length - Q), w.lookahead -= w.prev_length - 1, w.prev_length -= 2; ++w.strstart <= D && (w.ins_h = (w.ins_h << w.hash_shift ^ w.window[w.strstart + Q - 1]) & w.hash_mask, X = w.prev[w.strstart & w.w_mask] = w.head[w.ins_h], w.head[w.ins_h] = w.strstart), --w.prev_length != 0; ) ;
              if (w.match_available = 0, w.match_length = Q - 1, w.strstart++, M && (H(w, !1), w.strm.avail_out === 0)) return v;
            } else if (w.match_available) {
              if ((M = l._tr_tally(w, 0, w.window[w.strstart - 1])) && H(w, !1), w.strstart++, w.lookahead--, w.strm.avail_out === 0) return v;
            } else w.match_available = 1, w.strstart++, w.lookahead--;
          }
          return w.match_available && (M = l._tr_tally(w, 0, w.window[w.strstart - 1]), w.match_available = 0), w.insert = w.strstart < Q - 1 ? w.strstart : Q - 1, ie === p ? (H(w, !0), w.strm.avail_out === 0 ? fe : Z) : w.last_lit && (H(w, !1), w.strm.avail_out === 0) ? v : T;
        }
        function Ce(w, ie, X, M, D) {
          this.good_length = w, this.max_lazy = ie, this.nice_length = X, this.max_chain = M, this.func = D;
        }
        function xe() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = S, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new a.Buf16(2 * B), this.dyn_dtree = new a.Buf16(2 * (2 * N + 1)), this.bl_tree = new a.Buf16(2 * (2 * R + 1)), ge(this.dyn_ltree), ge(this.dyn_dtree), ge(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new a.Buf16(U + 1), this.heap = new a.Buf16(2 * z + 1), ge(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new a.Buf16(2 * z + 1), ge(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function ze(w) {
          var ie;
          return w && w.state ? (w.total_in = w.total_out = 0, w.data_type = C, (ie = w.state).pending = 0, ie.pending_out = 0, ie.wrap < 0 && (ie.wrap = -ie.wrap), ie.status = ie.wrap ? E : F, w.adler = ie.wrap === 2 ? 0 : 1, ie.last_flush = m, l._tr_init(ie), g) : ke(w, _);
        }
        function Ge(w) {
          var ie = ze(w);
          return ie === g && (function(X) {
            X.window_size = 2 * X.w_size, ge(X.head), X.max_lazy_match = s[X.level].max_lazy, X.good_match = s[X.level].good_length, X.nice_match = s[X.level].nice_length, X.max_chain_length = s[X.level].max_chain, X.strstart = 0, X.block_start = 0, X.lookahead = 0, X.insert = 0, X.match_length = X.prev_length = Q - 1, X.match_available = 0, X.ins_h = 0;
          })(w.state), ie;
        }
        function Re(w, ie, X, M, D, j) {
          if (!w) return _;
          var le = 1;
          if (ie === k && (ie = 6), M < 0 ? (le = 0, M = -M) : 15 < M && (le = 2, M -= 16), D < 1 || x < D || X !== S || M < 8 || 15 < M || ie < 0 || 9 < ie || j < 0 || y < j) return ke(w, _);
          M === 8 && (M = 9);
          var O = new xe();
          return (w.state = O).strm = w, O.wrap = le, O.gzhead = null, O.w_bits = M, O.w_size = 1 << O.w_bits, O.w_mask = O.w_size - 1, O.hash_bits = D + 7, O.hash_size = 1 << O.hash_bits, O.hash_mask = O.hash_size - 1, O.hash_shift = ~~((O.hash_bits + Q - 1) / Q), O.window = new a.Buf8(2 * O.w_size), O.head = new a.Buf16(O.hash_size), O.prev = new a.Buf16(O.w_size), O.lit_bufsize = 1 << D + 6, O.pending_buf_size = 4 * O.lit_bufsize, O.pending_buf = new a.Buf8(O.pending_buf_size), O.d_buf = 1 * O.lit_bufsize, O.l_buf = 3 * O.lit_bufsize, O.level = ie, O.strategy = j, O.method = X, Ge(w);
        }
        s = [new Ce(0, 0, 0, 0, function(w, ie) {
          var X = 65535;
          for (X > w.pending_buf_size - 5 && (X = w.pending_buf_size - 5); ; ) {
            if (w.lookahead <= 1) {
              if (re(w), w.lookahead === 0 && ie === m) return v;
              if (w.lookahead === 0) break;
            }
            w.strstart += w.lookahead, w.lookahead = 0;
            var M = w.block_start + X;
            if ((w.strstart === 0 || w.strstart >= M) && (w.lookahead = w.strstart - M, w.strstart = M, H(w, !1), w.strm.avail_out === 0) || w.strstart - w.block_start >= w.w_size - pe && (H(w, !1), w.strm.avail_out === 0)) return v;
          }
          return w.insert = 0, ie === p ? (H(w, !0), w.strm.avail_out === 0 ? fe : Z) : (w.strstart > w.block_start && (H(w, !1), w.strm.avail_out), v);
        }), new Ce(4, 4, 8, 4, we), new Ce(4, 5, 16, 8, we), new Ce(4, 6, 32, 32, we), new Ce(4, 4, 16, 16, _e), new Ce(8, 16, 32, 32, _e), new Ce(8, 16, 128, 128, _e), new Ce(8, 32, 128, 256, _e), new Ce(32, 128, 258, 1024, _e), new Ce(32, 258, 258, 4096, _e)], i.deflateInit = function(w, ie) {
          return Re(w, ie, S, 15, 8, 0);
        }, i.deflateInit2 = Re, i.deflateReset = Ge, i.deflateResetKeep = ze, i.deflateSetHeader = function(w, ie) {
          return w && w.state ? w.state.wrap !== 2 ? _ : (w.state.gzhead = ie, g) : _;
        }, i.deflate = function(w, ie) {
          var X, M, D, j;
          if (!w || !w.state || 5 < ie || ie < 0) return w ? ke(w, _) : _;
          if (M = w.state, !w.output || !w.input && w.avail_in !== 0 || M.status === 666 && ie !== p) return ke(w, w.avail_out === 0 ? -5 : _);
          if (M.strm = w, X = M.last_flush, M.last_flush = ie, M.status === E) if (M.wrap === 2) w.adler = 0, ye(M, 31), ye(M, 139), ye(M, 8), M.gzhead ? (ye(M, (M.gzhead.text ? 1 : 0) + (M.gzhead.hcrc ? 2 : 0) + (M.gzhead.extra ? 4 : 0) + (M.gzhead.name ? 8 : 0) + (M.gzhead.comment ? 16 : 0)), ye(M, 255 & M.gzhead.time), ye(M, M.gzhead.time >> 8 & 255), ye(M, M.gzhead.time >> 16 & 255), ye(M, M.gzhead.time >> 24 & 255), ye(M, M.level === 9 ? 2 : 2 <= M.strategy || M.level < 2 ? 4 : 0), ye(M, 255 & M.gzhead.os), M.gzhead.extra && M.gzhead.extra.length && (ye(M, 255 & M.gzhead.extra.length), ye(M, M.gzhead.extra.length >> 8 & 255)), M.gzhead.hcrc && (w.adler = h(w.adler, M.pending_buf, M.pending, 0)), M.gzindex = 0, M.status = 69) : (ye(M, 0), ye(M, 0), ye(M, 0), ye(M, 0), ye(M, 0), ye(M, M.level === 9 ? 2 : 2 <= M.strategy || M.level < 2 ? 4 : 0), ye(M, 3), M.status = F);
          else {
            var le = S + (M.w_bits - 8 << 4) << 8;
            le |= (2 <= M.strategy || M.level < 2 ? 0 : M.level < 6 ? 1 : M.level === 6 ? 2 : 3) << 6, M.strstart !== 0 && (le |= 32), le += 31 - le % 31, M.status = F, me(M, le), M.strstart !== 0 && (me(M, w.adler >>> 16), me(M, 65535 & w.adler)), w.adler = 1;
          }
          if (M.status === 69) if (M.gzhead.extra) {
            for (D = M.pending; M.gzindex < (65535 & M.gzhead.extra.length) && (M.pending !== M.pending_buf_size || (M.gzhead.hcrc && M.pending > D && (w.adler = h(w.adler, M.pending_buf, M.pending - D, D)), W(w), D = M.pending, M.pending !== M.pending_buf_size)); ) ye(M, 255 & M.gzhead.extra[M.gzindex]), M.gzindex++;
            M.gzhead.hcrc && M.pending > D && (w.adler = h(w.adler, M.pending_buf, M.pending - D, D)), M.gzindex === M.gzhead.extra.length && (M.gzindex = 0, M.status = 73);
          } else M.status = 73;
          if (M.status === 73) if (M.gzhead.name) {
            D = M.pending;
            do {
              if (M.pending === M.pending_buf_size && (M.gzhead.hcrc && M.pending > D && (w.adler = h(w.adler, M.pending_buf, M.pending - D, D)), W(w), D = M.pending, M.pending === M.pending_buf_size)) {
                j = 1;
                break;
              }
              j = M.gzindex < M.gzhead.name.length ? 255 & M.gzhead.name.charCodeAt(M.gzindex++) : 0, ye(M, j);
            } while (j !== 0);
            M.gzhead.hcrc && M.pending > D && (w.adler = h(w.adler, M.pending_buf, M.pending - D, D)), j === 0 && (M.gzindex = 0, M.status = 91);
          } else M.status = 91;
          if (M.status === 91) if (M.gzhead.comment) {
            D = M.pending;
            do {
              if (M.pending === M.pending_buf_size && (M.gzhead.hcrc && M.pending > D && (w.adler = h(w.adler, M.pending_buf, M.pending - D, D)), W(w), D = M.pending, M.pending === M.pending_buf_size)) {
                j = 1;
                break;
              }
              j = M.gzindex < M.gzhead.comment.length ? 255 & M.gzhead.comment.charCodeAt(M.gzindex++) : 0, ye(M, j);
            } while (j !== 0);
            M.gzhead.hcrc && M.pending > D && (w.adler = h(w.adler, M.pending_buf, M.pending - D, D)), j === 0 && (M.status = 103);
          } else M.status = 103;
          if (M.status === 103 && (M.gzhead.hcrc ? (M.pending + 2 > M.pending_buf_size && W(w), M.pending + 2 <= M.pending_buf_size && (ye(M, 255 & w.adler), ye(M, w.adler >> 8 & 255), w.adler = 0, M.status = F)) : M.status = F), M.pending !== 0) {
            if (W(w), w.avail_out === 0) return M.last_flush = -1, g;
          } else if (w.avail_in === 0 && q(ie) <= q(X) && ie !== p) return ke(w, -5);
          if (M.status === 666 && w.avail_in !== 0) return ke(w, -5);
          if (w.avail_in !== 0 || M.lookahead !== 0 || ie !== m && M.status !== 666) {
            var O = M.strategy === 2 ? (function($, se) {
              for (var ue; ; ) {
                if ($.lookahead === 0 && (re($), $.lookahead === 0)) {
                  if (se === m) return v;
                  break;
                }
                if ($.match_length = 0, ue = l._tr_tally($, 0, $.window[$.strstart]), $.lookahead--, $.strstart++, ue && (H($, !1), $.strm.avail_out === 0)) return v;
              }
              return $.insert = 0, se === p ? (H($, !0), $.strm.avail_out === 0 ? fe : Z) : $.last_lit && (H($, !1), $.strm.avail_out === 0) ? v : T;
            })(M, ie) : M.strategy === 3 ? (function($, se) {
              for (var ue, oe, ce, Se, Ne = $.window; ; ) {
                if ($.lookahead <= K) {
                  if (re($), $.lookahead <= K && se === m) return v;
                  if ($.lookahead === 0) break;
                }
                if ($.match_length = 0, $.lookahead >= Q && 0 < $.strstart && (oe = Ne[ce = $.strstart - 1]) === Ne[++ce] && oe === Ne[++ce] && oe === Ne[++ce]) {
                  Se = $.strstart + K;
                  do
                    ;
                  while (oe === Ne[++ce] && oe === Ne[++ce] && oe === Ne[++ce] && oe === Ne[++ce] && oe === Ne[++ce] && oe === Ne[++ce] && oe === Ne[++ce] && oe === Ne[++ce] && ce < Se);
                  $.match_length = K - (Se - ce), $.match_length > $.lookahead && ($.match_length = $.lookahead);
                }
                if ($.match_length >= Q ? (ue = l._tr_tally($, 1, $.match_length - Q), $.lookahead -= $.match_length, $.strstart += $.match_length, $.match_length = 0) : (ue = l._tr_tally($, 0, $.window[$.strstart]), $.lookahead--, $.strstart++), ue && (H($, !1), $.strm.avail_out === 0)) return v;
              }
              return $.insert = 0, se === p ? (H($, !0), $.strm.avail_out === 0 ? fe : Z) : $.last_lit && (H($, !1), $.strm.avail_out === 0) ? v : T;
            })(M, ie) : s[M.level].func(M, ie);
            if (O !== fe && O !== Z || (M.status = 666), O === v || O === fe) return w.avail_out === 0 && (M.last_flush = -1), g;
            if (O === T && (ie === 1 ? l._tr_align(M) : ie !== 5 && (l._tr_stored_block(M, 0, 0, !1), ie === 3 && (ge(M.head), M.lookahead === 0 && (M.strstart = 0, M.block_start = 0, M.insert = 0))), W(w), w.avail_out === 0)) return M.last_flush = -1, g;
          }
          return ie !== p ? g : M.wrap <= 0 ? 1 : (M.wrap === 2 ? (ye(M, 255 & w.adler), ye(M, w.adler >> 8 & 255), ye(M, w.adler >> 16 & 255), ye(M, w.adler >> 24 & 255), ye(M, 255 & w.total_in), ye(M, w.total_in >> 8 & 255), ye(M, w.total_in >> 16 & 255), ye(M, w.total_in >> 24 & 255)) : (me(M, w.adler >>> 16), me(M, 65535 & w.adler)), W(w), 0 < M.wrap && (M.wrap = -M.wrap), M.pending !== 0 ? g : 1);
        }, i.deflateEnd = function(w) {
          var ie;
          return w && w.state ? (ie = w.state.status) !== E && ie !== 69 && ie !== 73 && ie !== 91 && ie !== 103 && ie !== F && ie !== 666 ? ke(w, _) : (w.state = null, ie === F ? ke(w, -3) : g) : _;
        }, i.deflateSetDictionary = function(w, ie) {
          var X, M, D, j, le, O, $, se, ue = ie.length;
          if (!w || !w.state || (j = (X = w.state).wrap) === 2 || j === 1 && X.status !== E || X.lookahead) return _;
          for (j === 1 && (w.adler = d(w.adler, ie, ue, 0)), X.wrap = 0, ue >= X.w_size && (j === 0 && (ge(X.head), X.strstart = 0, X.block_start = 0, X.insert = 0), se = new a.Buf8(X.w_size), a.arraySet(se, ie, ue - X.w_size, X.w_size, 0), ie = se, ue = X.w_size), le = w.avail_in, O = w.next_in, $ = w.input, w.avail_in = ue, w.next_in = 0, w.input = ie, re(X); X.lookahead >= Q; ) {
            for (M = X.strstart, D = X.lookahead - (Q - 1); X.ins_h = (X.ins_h << X.hash_shift ^ X.window[M + Q - 1]) & X.hash_mask, X.prev[M & X.w_mask] = X.head[X.ins_h], X.head[X.ins_h] = M, M++, --D; ) ;
            X.strstart = M, X.lookahead = Q - 1, re(X);
          }
          return X.strstart += X.lookahead, X.block_start = X.strstart, X.insert = X.lookahead, X.lookahead = 0, X.match_length = X.prev_length = Q - 1, X.match_available = 0, w.next_in = O, w.input = $, w.avail_in = le, X.wrap = j, g;
        }, i.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(n, r, i) {
        r.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(n, r, i) {
        r.exports = function(s, a) {
          var l, d, h, b, m, p, g, _, k, y, C, S, x, z, N, R, B, U, Q, K, pe, E, F, v, T;
          l = s.state, d = s.next_in, v = s.input, h = d + (s.avail_in - 5), b = s.next_out, T = s.output, m = b - (a - s.avail_out), p = b + (s.avail_out - 257), g = l.dmax, _ = l.wsize, k = l.whave, y = l.wnext, C = l.window, S = l.hold, x = l.bits, z = l.lencode, N = l.distcode, R = (1 << l.lenbits) - 1, B = (1 << l.distbits) - 1;
          e: do {
            x < 15 && (S += v[d++] << x, x += 8, S += v[d++] << x, x += 8), U = z[S & R];
            t: for (; ; ) {
              if (S >>>= Q = U >>> 24, x -= Q, (Q = U >>> 16 & 255) === 0) T[b++] = 65535 & U;
              else {
                if (!(16 & Q)) {
                  if ((64 & Q) == 0) {
                    U = z[(65535 & U) + (S & (1 << Q) - 1)];
                    continue t;
                  }
                  if (32 & Q) {
                    l.mode = 12;
                    break e;
                  }
                  s.msg = "invalid literal/length code", l.mode = 30;
                  break e;
                }
                K = 65535 & U, (Q &= 15) && (x < Q && (S += v[d++] << x, x += 8), K += S & (1 << Q) - 1, S >>>= Q, x -= Q), x < 15 && (S += v[d++] << x, x += 8, S += v[d++] << x, x += 8), U = N[S & B];
                n: for (; ; ) {
                  if (S >>>= Q = U >>> 24, x -= Q, !(16 & (Q = U >>> 16 & 255))) {
                    if ((64 & Q) == 0) {
                      U = N[(65535 & U) + (S & (1 << Q) - 1)];
                      continue n;
                    }
                    s.msg = "invalid distance code", l.mode = 30;
                    break e;
                  }
                  if (pe = 65535 & U, x < (Q &= 15) && (S += v[d++] << x, (x += 8) < Q && (S += v[d++] << x, x += 8)), g < (pe += S & (1 << Q) - 1)) {
                    s.msg = "invalid distance too far back", l.mode = 30;
                    break e;
                  }
                  if (S >>>= Q, x -= Q, (Q = b - m) < pe) {
                    if (k < (Q = pe - Q) && l.sane) {
                      s.msg = "invalid distance too far back", l.mode = 30;
                      break e;
                    }
                    if (F = C, (E = 0) === y) {
                      if (E += _ - Q, Q < K) {
                        for (K -= Q; T[b++] = C[E++], --Q; ) ;
                        E = b - pe, F = T;
                      }
                    } else if (y < Q) {
                      if (E += _ + y - Q, (Q -= y) < K) {
                        for (K -= Q; T[b++] = C[E++], --Q; ) ;
                        if (E = 0, y < K) {
                          for (K -= Q = y; T[b++] = C[E++], --Q; ) ;
                          E = b - pe, F = T;
                        }
                      }
                    } else if (E += y - Q, Q < K) {
                      for (K -= Q; T[b++] = C[E++], --Q; ) ;
                      E = b - pe, F = T;
                    }
                    for (; 2 < K; ) T[b++] = F[E++], T[b++] = F[E++], T[b++] = F[E++], K -= 3;
                    K && (T[b++] = F[E++], 1 < K && (T[b++] = F[E++]));
                  } else {
                    for (E = b - pe; T[b++] = T[E++], T[b++] = T[E++], T[b++] = T[E++], 2 < (K -= 3); ) ;
                    K && (T[b++] = T[E++], 1 < K && (T[b++] = T[E++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (d < h && b < p);
          d -= K = x >> 3, S &= (1 << (x -= K << 3)) - 1, s.next_in = d, s.next_out = b, s.avail_in = d < h ? h - d + 5 : 5 - (d - h), s.avail_out = b < p ? p - b + 257 : 257 - (b - p), l.hold = S, l.bits = x;
        };
      }, {}], 49: [function(n, r, i) {
        var s = n("../utils/common"), a = n("./adler32"), l = n("./crc32"), d = n("./inffast"), h = n("./inftrees"), b = 1, m = 2, p = 0, g = -2, _ = 1, k = 852, y = 592;
        function C(E) {
          return (E >>> 24 & 255) + (E >>> 8 & 65280) + ((65280 & E) << 8) + ((255 & E) << 24);
        }
        function S() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new s.Buf16(320), this.work = new s.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function x(E) {
          var F;
          return E && E.state ? (F = E.state, E.total_in = E.total_out = F.total = 0, E.msg = "", F.wrap && (E.adler = 1 & F.wrap), F.mode = _, F.last = 0, F.havedict = 0, F.dmax = 32768, F.head = null, F.hold = 0, F.bits = 0, F.lencode = F.lendyn = new s.Buf32(k), F.distcode = F.distdyn = new s.Buf32(y), F.sane = 1, F.back = -1, p) : g;
        }
        function z(E) {
          var F;
          return E && E.state ? ((F = E.state).wsize = 0, F.whave = 0, F.wnext = 0, x(E)) : g;
        }
        function N(E, F) {
          var v, T;
          return E && E.state ? (T = E.state, F < 0 ? (v = 0, F = -F) : (v = 1 + (F >> 4), F < 48 && (F &= 15)), F && (F < 8 || 15 < F) ? g : (T.window !== null && T.wbits !== F && (T.window = null), T.wrap = v, T.wbits = F, z(E))) : g;
        }
        function R(E, F) {
          var v, T;
          return E ? (T = new S(), (E.state = T).window = null, (v = N(E, F)) !== p && (E.state = null), v) : g;
        }
        var B, U, Q = !0;
        function K(E) {
          if (Q) {
            var F;
            for (B = new s.Buf32(512), U = new s.Buf32(32), F = 0; F < 144; ) E.lens[F++] = 8;
            for (; F < 256; ) E.lens[F++] = 9;
            for (; F < 280; ) E.lens[F++] = 7;
            for (; F < 288; ) E.lens[F++] = 8;
            for (h(b, E.lens, 0, 288, B, 0, E.work, { bits: 9 }), F = 0; F < 32; ) E.lens[F++] = 5;
            h(m, E.lens, 0, 32, U, 0, E.work, { bits: 5 }), Q = !1;
          }
          E.lencode = B, E.lenbits = 9, E.distcode = U, E.distbits = 5;
        }
        function pe(E, F, v, T) {
          var fe, Z = E.state;
          return Z.window === null && (Z.wsize = 1 << Z.wbits, Z.wnext = 0, Z.whave = 0, Z.window = new s.Buf8(Z.wsize)), T >= Z.wsize ? (s.arraySet(Z.window, F, v - Z.wsize, Z.wsize, 0), Z.wnext = 0, Z.whave = Z.wsize) : (T < (fe = Z.wsize - Z.wnext) && (fe = T), s.arraySet(Z.window, F, v - T, fe, Z.wnext), (T -= fe) ? (s.arraySet(Z.window, F, v - T, T, 0), Z.wnext = T, Z.whave = Z.wsize) : (Z.wnext += fe, Z.wnext === Z.wsize && (Z.wnext = 0), Z.whave < Z.wsize && (Z.whave += fe))), 0;
        }
        i.inflateReset = z, i.inflateReset2 = N, i.inflateResetKeep = x, i.inflateInit = function(E) {
          return R(E, 15);
        }, i.inflateInit2 = R, i.inflate = function(E, F) {
          var v, T, fe, Z, ke, q, ge, W, H, ye, me, de, re, we, _e, Ce, xe, ze, Ge, Re, w, ie, X, M, D = 0, j = new s.Buf8(4), le = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!E || !E.state || !E.output || !E.input && E.avail_in !== 0) return g;
          (v = E.state).mode === 12 && (v.mode = 13), ke = E.next_out, fe = E.output, ge = E.avail_out, Z = E.next_in, T = E.input, q = E.avail_in, W = v.hold, H = v.bits, ye = q, me = ge, ie = p;
          e: for (; ; ) switch (v.mode) {
            case _:
              if (v.wrap === 0) {
                v.mode = 13;
                break;
              }
              for (; H < 16; ) {
                if (q === 0) break e;
                q--, W += T[Z++] << H, H += 8;
              }
              if (2 & v.wrap && W === 35615) {
                j[v.check = 0] = 255 & W, j[1] = W >>> 8 & 255, v.check = l(v.check, j, 2, 0), H = W = 0, v.mode = 2;
                break;
              }
              if (v.flags = 0, v.head && (v.head.done = !1), !(1 & v.wrap) || (((255 & W) << 8) + (W >> 8)) % 31) {
                E.msg = "incorrect header check", v.mode = 30;
                break;
              }
              if ((15 & W) != 8) {
                E.msg = "unknown compression method", v.mode = 30;
                break;
              }
              if (H -= 4, w = 8 + (15 & (W >>>= 4)), v.wbits === 0) v.wbits = w;
              else if (w > v.wbits) {
                E.msg = "invalid window size", v.mode = 30;
                break;
              }
              v.dmax = 1 << w, E.adler = v.check = 1, v.mode = 512 & W ? 10 : 12, H = W = 0;
              break;
            case 2:
              for (; H < 16; ) {
                if (q === 0) break e;
                q--, W += T[Z++] << H, H += 8;
              }
              if (v.flags = W, (255 & v.flags) != 8) {
                E.msg = "unknown compression method", v.mode = 30;
                break;
              }
              if (57344 & v.flags) {
                E.msg = "unknown header flags set", v.mode = 30;
                break;
              }
              v.head && (v.head.text = W >> 8 & 1), 512 & v.flags && (j[0] = 255 & W, j[1] = W >>> 8 & 255, v.check = l(v.check, j, 2, 0)), H = W = 0, v.mode = 3;
            case 3:
              for (; H < 32; ) {
                if (q === 0) break e;
                q--, W += T[Z++] << H, H += 8;
              }
              v.head && (v.head.time = W), 512 & v.flags && (j[0] = 255 & W, j[1] = W >>> 8 & 255, j[2] = W >>> 16 & 255, j[3] = W >>> 24 & 255, v.check = l(v.check, j, 4, 0)), H = W = 0, v.mode = 4;
            case 4:
              for (; H < 16; ) {
                if (q === 0) break e;
                q--, W += T[Z++] << H, H += 8;
              }
              v.head && (v.head.xflags = 255 & W, v.head.os = W >> 8), 512 & v.flags && (j[0] = 255 & W, j[1] = W >>> 8 & 255, v.check = l(v.check, j, 2, 0)), H = W = 0, v.mode = 5;
            case 5:
              if (1024 & v.flags) {
                for (; H < 16; ) {
                  if (q === 0) break e;
                  q--, W += T[Z++] << H, H += 8;
                }
                v.length = W, v.head && (v.head.extra_len = W), 512 & v.flags && (j[0] = 255 & W, j[1] = W >>> 8 & 255, v.check = l(v.check, j, 2, 0)), H = W = 0;
              } else v.head && (v.head.extra = null);
              v.mode = 6;
            case 6:
              if (1024 & v.flags && (q < (de = v.length) && (de = q), de && (v.head && (w = v.head.extra_len - v.length, v.head.extra || (v.head.extra = new Array(v.head.extra_len)), s.arraySet(v.head.extra, T, Z, de, w)), 512 & v.flags && (v.check = l(v.check, T, de, Z)), q -= de, Z += de, v.length -= de), v.length)) break e;
              v.length = 0, v.mode = 7;
            case 7:
              if (2048 & v.flags) {
                if (q === 0) break e;
                for (de = 0; w = T[Z + de++], v.head && w && v.length < 65536 && (v.head.name += String.fromCharCode(w)), w && de < q; ) ;
                if (512 & v.flags && (v.check = l(v.check, T, de, Z)), q -= de, Z += de, w) break e;
              } else v.head && (v.head.name = null);
              v.length = 0, v.mode = 8;
            case 8:
              if (4096 & v.flags) {
                if (q === 0) break e;
                for (de = 0; w = T[Z + de++], v.head && w && v.length < 65536 && (v.head.comment += String.fromCharCode(w)), w && de < q; ) ;
                if (512 & v.flags && (v.check = l(v.check, T, de, Z)), q -= de, Z += de, w) break e;
              } else v.head && (v.head.comment = null);
              v.mode = 9;
            case 9:
              if (512 & v.flags) {
                for (; H < 16; ) {
                  if (q === 0) break e;
                  q--, W += T[Z++] << H, H += 8;
                }
                if (W !== (65535 & v.check)) {
                  E.msg = "header crc mismatch", v.mode = 30;
                  break;
                }
                H = W = 0;
              }
              v.head && (v.head.hcrc = v.flags >> 9 & 1, v.head.done = !0), E.adler = v.check = 0, v.mode = 12;
              break;
            case 10:
              for (; H < 32; ) {
                if (q === 0) break e;
                q--, W += T[Z++] << H, H += 8;
              }
              E.adler = v.check = C(W), H = W = 0, v.mode = 11;
            case 11:
              if (v.havedict === 0) return E.next_out = ke, E.avail_out = ge, E.next_in = Z, E.avail_in = q, v.hold = W, v.bits = H, 2;
              E.adler = v.check = 1, v.mode = 12;
            case 12:
              if (F === 5 || F === 6) break e;
            case 13:
              if (v.last) {
                W >>>= 7 & H, H -= 7 & H, v.mode = 27;
                break;
              }
              for (; H < 3; ) {
                if (q === 0) break e;
                q--, W += T[Z++] << H, H += 8;
              }
              switch (v.last = 1 & W, H -= 1, 3 & (W >>>= 1)) {
                case 0:
                  v.mode = 14;
                  break;
                case 1:
                  if (K(v), v.mode = 20, F !== 6) break;
                  W >>>= 2, H -= 2;
                  break e;
                case 2:
                  v.mode = 17;
                  break;
                case 3:
                  E.msg = "invalid block type", v.mode = 30;
              }
              W >>>= 2, H -= 2;
              break;
            case 14:
              for (W >>>= 7 & H, H -= 7 & H; H < 32; ) {
                if (q === 0) break e;
                q--, W += T[Z++] << H, H += 8;
              }
              if ((65535 & W) != (W >>> 16 ^ 65535)) {
                E.msg = "invalid stored block lengths", v.mode = 30;
                break;
              }
              if (v.length = 65535 & W, H = W = 0, v.mode = 15, F === 6) break e;
            case 15:
              v.mode = 16;
            case 16:
              if (de = v.length) {
                if (q < de && (de = q), ge < de && (de = ge), de === 0) break e;
                s.arraySet(fe, T, Z, de, ke), q -= de, Z += de, ge -= de, ke += de, v.length -= de;
                break;
              }
              v.mode = 12;
              break;
            case 17:
              for (; H < 14; ) {
                if (q === 0) break e;
                q--, W += T[Z++] << H, H += 8;
              }
              if (v.nlen = 257 + (31 & W), W >>>= 5, H -= 5, v.ndist = 1 + (31 & W), W >>>= 5, H -= 5, v.ncode = 4 + (15 & W), W >>>= 4, H -= 4, 286 < v.nlen || 30 < v.ndist) {
                E.msg = "too many length or distance symbols", v.mode = 30;
                break;
              }
              v.have = 0, v.mode = 18;
            case 18:
              for (; v.have < v.ncode; ) {
                for (; H < 3; ) {
                  if (q === 0) break e;
                  q--, W += T[Z++] << H, H += 8;
                }
                v.lens[le[v.have++]] = 7 & W, W >>>= 3, H -= 3;
              }
              for (; v.have < 19; ) v.lens[le[v.have++]] = 0;
              if (v.lencode = v.lendyn, v.lenbits = 7, X = { bits: v.lenbits }, ie = h(0, v.lens, 0, 19, v.lencode, 0, v.work, X), v.lenbits = X.bits, ie) {
                E.msg = "invalid code lengths set", v.mode = 30;
                break;
              }
              v.have = 0, v.mode = 19;
            case 19:
              for (; v.have < v.nlen + v.ndist; ) {
                for (; Ce = (D = v.lencode[W & (1 << v.lenbits) - 1]) >>> 16 & 255, xe = 65535 & D, !((_e = D >>> 24) <= H); ) {
                  if (q === 0) break e;
                  q--, W += T[Z++] << H, H += 8;
                }
                if (xe < 16) W >>>= _e, H -= _e, v.lens[v.have++] = xe;
                else {
                  if (xe === 16) {
                    for (M = _e + 2; H < M; ) {
                      if (q === 0) break e;
                      q--, W += T[Z++] << H, H += 8;
                    }
                    if (W >>>= _e, H -= _e, v.have === 0) {
                      E.msg = "invalid bit length repeat", v.mode = 30;
                      break;
                    }
                    w = v.lens[v.have - 1], de = 3 + (3 & W), W >>>= 2, H -= 2;
                  } else if (xe === 17) {
                    for (M = _e + 3; H < M; ) {
                      if (q === 0) break e;
                      q--, W += T[Z++] << H, H += 8;
                    }
                    H -= _e, w = 0, de = 3 + (7 & (W >>>= _e)), W >>>= 3, H -= 3;
                  } else {
                    for (M = _e + 7; H < M; ) {
                      if (q === 0) break e;
                      q--, W += T[Z++] << H, H += 8;
                    }
                    H -= _e, w = 0, de = 11 + (127 & (W >>>= _e)), W >>>= 7, H -= 7;
                  }
                  if (v.have + de > v.nlen + v.ndist) {
                    E.msg = "invalid bit length repeat", v.mode = 30;
                    break;
                  }
                  for (; de--; ) v.lens[v.have++] = w;
                }
              }
              if (v.mode === 30) break;
              if (v.lens[256] === 0) {
                E.msg = "invalid code -- missing end-of-block", v.mode = 30;
                break;
              }
              if (v.lenbits = 9, X = { bits: v.lenbits }, ie = h(b, v.lens, 0, v.nlen, v.lencode, 0, v.work, X), v.lenbits = X.bits, ie) {
                E.msg = "invalid literal/lengths set", v.mode = 30;
                break;
              }
              if (v.distbits = 6, v.distcode = v.distdyn, X = { bits: v.distbits }, ie = h(m, v.lens, v.nlen, v.ndist, v.distcode, 0, v.work, X), v.distbits = X.bits, ie) {
                E.msg = "invalid distances set", v.mode = 30;
                break;
              }
              if (v.mode = 20, F === 6) break e;
            case 20:
              v.mode = 21;
            case 21:
              if (6 <= q && 258 <= ge) {
                E.next_out = ke, E.avail_out = ge, E.next_in = Z, E.avail_in = q, v.hold = W, v.bits = H, d(E, me), ke = E.next_out, fe = E.output, ge = E.avail_out, Z = E.next_in, T = E.input, q = E.avail_in, W = v.hold, H = v.bits, v.mode === 12 && (v.back = -1);
                break;
              }
              for (v.back = 0; Ce = (D = v.lencode[W & (1 << v.lenbits) - 1]) >>> 16 & 255, xe = 65535 & D, !((_e = D >>> 24) <= H); ) {
                if (q === 0) break e;
                q--, W += T[Z++] << H, H += 8;
              }
              if (Ce && (240 & Ce) == 0) {
                for (ze = _e, Ge = Ce, Re = xe; Ce = (D = v.lencode[Re + ((W & (1 << ze + Ge) - 1) >> ze)]) >>> 16 & 255, xe = 65535 & D, !(ze + (_e = D >>> 24) <= H); ) {
                  if (q === 0) break e;
                  q--, W += T[Z++] << H, H += 8;
                }
                W >>>= ze, H -= ze, v.back += ze;
              }
              if (W >>>= _e, H -= _e, v.back += _e, v.length = xe, Ce === 0) {
                v.mode = 26;
                break;
              }
              if (32 & Ce) {
                v.back = -1, v.mode = 12;
                break;
              }
              if (64 & Ce) {
                E.msg = "invalid literal/length code", v.mode = 30;
                break;
              }
              v.extra = 15 & Ce, v.mode = 22;
            case 22:
              if (v.extra) {
                for (M = v.extra; H < M; ) {
                  if (q === 0) break e;
                  q--, W += T[Z++] << H, H += 8;
                }
                v.length += W & (1 << v.extra) - 1, W >>>= v.extra, H -= v.extra, v.back += v.extra;
              }
              v.was = v.length, v.mode = 23;
            case 23:
              for (; Ce = (D = v.distcode[W & (1 << v.distbits) - 1]) >>> 16 & 255, xe = 65535 & D, !((_e = D >>> 24) <= H); ) {
                if (q === 0) break e;
                q--, W += T[Z++] << H, H += 8;
              }
              if ((240 & Ce) == 0) {
                for (ze = _e, Ge = Ce, Re = xe; Ce = (D = v.distcode[Re + ((W & (1 << ze + Ge) - 1) >> ze)]) >>> 16 & 255, xe = 65535 & D, !(ze + (_e = D >>> 24) <= H); ) {
                  if (q === 0) break e;
                  q--, W += T[Z++] << H, H += 8;
                }
                W >>>= ze, H -= ze, v.back += ze;
              }
              if (W >>>= _e, H -= _e, v.back += _e, 64 & Ce) {
                E.msg = "invalid distance code", v.mode = 30;
                break;
              }
              v.offset = xe, v.extra = 15 & Ce, v.mode = 24;
            case 24:
              if (v.extra) {
                for (M = v.extra; H < M; ) {
                  if (q === 0) break e;
                  q--, W += T[Z++] << H, H += 8;
                }
                v.offset += W & (1 << v.extra) - 1, W >>>= v.extra, H -= v.extra, v.back += v.extra;
              }
              if (v.offset > v.dmax) {
                E.msg = "invalid distance too far back", v.mode = 30;
                break;
              }
              v.mode = 25;
            case 25:
              if (ge === 0) break e;
              if (de = me - ge, v.offset > de) {
                if ((de = v.offset - de) > v.whave && v.sane) {
                  E.msg = "invalid distance too far back", v.mode = 30;
                  break;
                }
                re = de > v.wnext ? (de -= v.wnext, v.wsize - de) : v.wnext - de, de > v.length && (de = v.length), we = v.window;
              } else we = fe, re = ke - v.offset, de = v.length;
              for (ge < de && (de = ge), ge -= de, v.length -= de; fe[ke++] = we[re++], --de; ) ;
              v.length === 0 && (v.mode = 21);
              break;
            case 26:
              if (ge === 0) break e;
              fe[ke++] = v.length, ge--, v.mode = 21;
              break;
            case 27:
              if (v.wrap) {
                for (; H < 32; ) {
                  if (q === 0) break e;
                  q--, W |= T[Z++] << H, H += 8;
                }
                if (me -= ge, E.total_out += me, v.total += me, me && (E.adler = v.check = v.flags ? l(v.check, fe, me, ke - me) : a(v.check, fe, me, ke - me)), me = ge, (v.flags ? W : C(W)) !== v.check) {
                  E.msg = "incorrect data check", v.mode = 30;
                  break;
                }
                H = W = 0;
              }
              v.mode = 28;
            case 28:
              if (v.wrap && v.flags) {
                for (; H < 32; ) {
                  if (q === 0) break e;
                  q--, W += T[Z++] << H, H += 8;
                }
                if (W !== (4294967295 & v.total)) {
                  E.msg = "incorrect length check", v.mode = 30;
                  break;
                }
                H = W = 0;
              }
              v.mode = 29;
            case 29:
              ie = 1;
              break e;
            case 30:
              ie = -3;
              break e;
            case 31:
              return -4;
            default:
              return g;
          }
          return E.next_out = ke, E.avail_out = ge, E.next_in = Z, E.avail_in = q, v.hold = W, v.bits = H, (v.wsize || me !== E.avail_out && v.mode < 30 && (v.mode < 27 || F !== 4)) && pe(E, E.output, E.next_out, me - E.avail_out) ? (v.mode = 31, -4) : (ye -= E.avail_in, me -= E.avail_out, E.total_in += ye, E.total_out += me, v.total += me, v.wrap && me && (E.adler = v.check = v.flags ? l(v.check, fe, me, E.next_out - me) : a(v.check, fe, me, E.next_out - me)), E.data_type = v.bits + (v.last ? 64 : 0) + (v.mode === 12 ? 128 : 0) + (v.mode === 20 || v.mode === 15 ? 256 : 0), (ye == 0 && me === 0 || F === 4) && ie === p && (ie = -5), ie);
        }, i.inflateEnd = function(E) {
          if (!E || !E.state) return g;
          var F = E.state;
          return F.window && (F.window = null), E.state = null, p;
        }, i.inflateGetHeader = function(E, F) {
          var v;
          return E && E.state ? (2 & (v = E.state).wrap) == 0 ? g : ((v.head = F).done = !1, p) : g;
        }, i.inflateSetDictionary = function(E, F) {
          var v, T = F.length;
          return E && E.state ? (v = E.state).wrap !== 0 && v.mode !== 11 ? g : v.mode === 11 && a(1, F, T, 0) !== v.check ? -3 : pe(E, F, T, T) ? (v.mode = 31, -4) : (v.havedict = 1, p) : g;
        }, i.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(n, r, i) {
        var s = n("../utils/common"), a = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], l = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], d = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], h = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        r.exports = function(b, m, p, g, _, k, y, C) {
          var S, x, z, N, R, B, U, Q, K, pe = C.bits, E = 0, F = 0, v = 0, T = 0, fe = 0, Z = 0, ke = 0, q = 0, ge = 0, W = 0, H = null, ye = 0, me = new s.Buf16(16), de = new s.Buf16(16), re = null, we = 0;
          for (E = 0; E <= 15; E++) me[E] = 0;
          for (F = 0; F < g; F++) me[m[p + F]]++;
          for (fe = pe, T = 15; 1 <= T && me[T] === 0; T--) ;
          if (T < fe && (fe = T), T === 0) return _[k++] = 20971520, _[k++] = 20971520, C.bits = 1, 0;
          for (v = 1; v < T && me[v] === 0; v++) ;
          for (fe < v && (fe = v), E = q = 1; E <= 15; E++) if (q <<= 1, (q -= me[E]) < 0) return -1;
          if (0 < q && (b === 0 || T !== 1)) return -1;
          for (de[1] = 0, E = 1; E < 15; E++) de[E + 1] = de[E] + me[E];
          for (F = 0; F < g; F++) m[p + F] !== 0 && (y[de[m[p + F]]++] = F);
          if (B = b === 0 ? (H = re = y, 19) : b === 1 ? (H = a, ye -= 257, re = l, we -= 257, 256) : (H = d, re = h, -1), E = v, R = k, ke = F = W = 0, z = -1, N = (ge = 1 << (Z = fe)) - 1, b === 1 && 852 < ge || b === 2 && 592 < ge) return 1;
          for (; ; ) {
            for (U = E - ke, K = y[F] < B ? (Q = 0, y[F]) : y[F] > B ? (Q = re[we + y[F]], H[ye + y[F]]) : (Q = 96, 0), S = 1 << E - ke, v = x = 1 << Z; _[R + (W >> ke) + (x -= S)] = U << 24 | Q << 16 | K | 0, x !== 0; ) ;
            for (S = 1 << E - 1; W & S; ) S >>= 1;
            if (S !== 0 ? (W &= S - 1, W += S) : W = 0, F++, --me[E] == 0) {
              if (E === T) break;
              E = m[p + y[F]];
            }
            if (fe < E && (W & N) !== z) {
              for (ke === 0 && (ke = fe), R += v, q = 1 << (Z = E - ke); Z + ke < T && !((q -= me[Z + ke]) <= 0); ) Z++, q <<= 1;
              if (ge += 1 << Z, b === 1 && 852 < ge || b === 2 && 592 < ge) return 1;
              _[z = W & N] = fe << 24 | Z << 16 | R - k | 0;
            }
          }
          return W !== 0 && (_[R + W] = E - ke << 24 | 64 << 16 | 0), C.bits = fe, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(n, r, i) {
        r.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(n, r, i) {
        var s = n("../utils/common"), a = 0, l = 1;
        function d(D) {
          for (var j = D.length; 0 <= --j; ) D[j] = 0;
        }
        var h = 0, b = 29, m = 256, p = m + 1 + b, g = 30, _ = 19, k = 2 * p + 1, y = 15, C = 16, S = 7, x = 256, z = 16, N = 17, R = 18, B = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], U = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], Q = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], K = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], pe = new Array(2 * (p + 2));
        d(pe);
        var E = new Array(2 * g);
        d(E);
        var F = new Array(512);
        d(F);
        var v = new Array(256);
        d(v);
        var T = new Array(b);
        d(T);
        var fe, Z, ke, q = new Array(g);
        function ge(D, j, le, O, $) {
          this.static_tree = D, this.extra_bits = j, this.extra_base = le, this.elems = O, this.max_length = $, this.has_stree = D && D.length;
        }
        function W(D, j) {
          this.dyn_tree = D, this.max_code = 0, this.stat_desc = j;
        }
        function H(D) {
          return D < 256 ? F[D] : F[256 + (D >>> 7)];
        }
        function ye(D, j) {
          D.pending_buf[D.pending++] = 255 & j, D.pending_buf[D.pending++] = j >>> 8 & 255;
        }
        function me(D, j, le) {
          D.bi_valid > C - le ? (D.bi_buf |= j << D.bi_valid & 65535, ye(D, D.bi_buf), D.bi_buf = j >> C - D.bi_valid, D.bi_valid += le - C) : (D.bi_buf |= j << D.bi_valid & 65535, D.bi_valid += le);
        }
        function de(D, j, le) {
          me(D, le[2 * j], le[2 * j + 1]);
        }
        function re(D, j) {
          for (var le = 0; le |= 1 & D, D >>>= 1, le <<= 1, 0 < --j; ) ;
          return le >>> 1;
        }
        function we(D, j, le) {
          var O, $, se = new Array(y + 1), ue = 0;
          for (O = 1; O <= y; O++) se[O] = ue = ue + le[O - 1] << 1;
          for ($ = 0; $ <= j; $++) {
            var oe = D[2 * $ + 1];
            oe !== 0 && (D[2 * $] = re(se[oe]++, oe));
          }
        }
        function _e(D) {
          var j;
          for (j = 0; j < p; j++) D.dyn_ltree[2 * j] = 0;
          for (j = 0; j < g; j++) D.dyn_dtree[2 * j] = 0;
          for (j = 0; j < _; j++) D.bl_tree[2 * j] = 0;
          D.dyn_ltree[2 * x] = 1, D.opt_len = D.static_len = 0, D.last_lit = D.matches = 0;
        }
        function Ce(D) {
          8 < D.bi_valid ? ye(D, D.bi_buf) : 0 < D.bi_valid && (D.pending_buf[D.pending++] = D.bi_buf), D.bi_buf = 0, D.bi_valid = 0;
        }
        function xe(D, j, le, O) {
          var $ = 2 * j, se = 2 * le;
          return D[$] < D[se] || D[$] === D[se] && O[j] <= O[le];
        }
        function ze(D, j, le) {
          for (var O = D.heap[le], $ = le << 1; $ <= D.heap_len && ($ < D.heap_len && xe(j, D.heap[$ + 1], D.heap[$], D.depth) && $++, !xe(j, O, D.heap[$], D.depth)); ) D.heap[le] = D.heap[$], le = $, $ <<= 1;
          D.heap[le] = O;
        }
        function Ge(D, j, le) {
          var O, $, se, ue, oe = 0;
          if (D.last_lit !== 0) for (; O = D.pending_buf[D.d_buf + 2 * oe] << 8 | D.pending_buf[D.d_buf + 2 * oe + 1], $ = D.pending_buf[D.l_buf + oe], oe++, O === 0 ? de(D, $, j) : (de(D, (se = v[$]) + m + 1, j), (ue = B[se]) !== 0 && me(D, $ -= T[se], ue), de(D, se = H(--O), le), (ue = U[se]) !== 0 && me(D, O -= q[se], ue)), oe < D.last_lit; ) ;
          de(D, x, j);
        }
        function Re(D, j) {
          var le, O, $, se = j.dyn_tree, ue = j.stat_desc.static_tree, oe = j.stat_desc.has_stree, ce = j.stat_desc.elems, Se = -1;
          for (D.heap_len = 0, D.heap_max = k, le = 0; le < ce; le++) se[2 * le] !== 0 ? (D.heap[++D.heap_len] = Se = le, D.depth[le] = 0) : se[2 * le + 1] = 0;
          for (; D.heap_len < 2; ) se[2 * ($ = D.heap[++D.heap_len] = Se < 2 ? ++Se : 0)] = 1, D.depth[$] = 0, D.opt_len--, oe && (D.static_len -= ue[2 * $ + 1]);
          for (j.max_code = Se, le = D.heap_len >> 1; 1 <= le; le--) ze(D, se, le);
          for ($ = ce; le = D.heap[1], D.heap[1] = D.heap[D.heap_len--], ze(D, se, 1), O = D.heap[1], D.heap[--D.heap_max] = le, D.heap[--D.heap_max] = O, se[2 * $] = se[2 * le] + se[2 * O], D.depth[$] = (D.depth[le] >= D.depth[O] ? D.depth[le] : D.depth[O]) + 1, se[2 * le + 1] = se[2 * O + 1] = $, D.heap[1] = $++, ze(D, se, 1), 2 <= D.heap_len; ) ;
          D.heap[--D.heap_max] = D.heap[1], (function(Ne, je) {
            var ft, it, wt, Ue, Cn, Jn, It = je.dyn_tree, In = je.max_code, Ur = je.stat_desc.static_tree, Sn = je.stat_desc.has_stree, Vn = je.stat_desc.extra_bits, En = je.stat_desc.extra_base, Be = je.stat_desc.max_length, Bt = 0;
            for (Ue = 0; Ue <= y; Ue++) Ne.bl_count[Ue] = 0;
            for (It[2 * Ne.heap[Ne.heap_max] + 1] = 0, ft = Ne.heap_max + 1; ft < k; ft++) Be < (Ue = It[2 * It[2 * (it = Ne.heap[ft]) + 1] + 1] + 1) && (Ue = Be, Bt++), It[2 * it + 1] = Ue, In < it || (Ne.bl_count[Ue]++, Cn = 0, En <= it && (Cn = Vn[it - En]), Jn = It[2 * it], Ne.opt_len += Jn * (Ue + Cn), Sn && (Ne.static_len += Jn * (Ur[2 * it + 1] + Cn)));
            if (Bt !== 0) {
              do {
                for (Ue = Be - 1; Ne.bl_count[Ue] === 0; ) Ue--;
                Ne.bl_count[Ue]--, Ne.bl_count[Ue + 1] += 2, Ne.bl_count[Be]--, Bt -= 2;
              } while (0 < Bt);
              for (Ue = Be; Ue !== 0; Ue--) for (it = Ne.bl_count[Ue]; it !== 0; ) In < (wt = Ne.heap[--ft]) || (It[2 * wt + 1] !== Ue && (Ne.opt_len += (Ue - It[2 * wt + 1]) * It[2 * wt], It[2 * wt + 1] = Ue), it--);
            }
          })(D, j), we(se, Se, D.bl_count);
        }
        function w(D, j, le) {
          var O, $, se = -1, ue = j[1], oe = 0, ce = 7, Se = 4;
          for (ue === 0 && (ce = 138, Se = 3), j[2 * (le + 1) + 1] = 65535, O = 0; O <= le; O++) $ = ue, ue = j[2 * (O + 1) + 1], ++oe < ce && $ === ue || (oe < Se ? D.bl_tree[2 * $] += oe : $ !== 0 ? ($ !== se && D.bl_tree[2 * $]++, D.bl_tree[2 * z]++) : oe <= 10 ? D.bl_tree[2 * N]++ : D.bl_tree[2 * R]++, se = $, Se = (oe = 0) === ue ? (ce = 138, 3) : $ === ue ? (ce = 6, 3) : (ce = 7, 4));
        }
        function ie(D, j, le) {
          var O, $, se = -1, ue = j[1], oe = 0, ce = 7, Se = 4;
          for (ue === 0 && (ce = 138, Se = 3), O = 0; O <= le; O++) if ($ = ue, ue = j[2 * (O + 1) + 1], !(++oe < ce && $ === ue)) {
            if (oe < Se) for (; de(D, $, D.bl_tree), --oe != 0; ) ;
            else $ !== 0 ? ($ !== se && (de(D, $, D.bl_tree), oe--), de(D, z, D.bl_tree), me(D, oe - 3, 2)) : oe <= 10 ? (de(D, N, D.bl_tree), me(D, oe - 3, 3)) : (de(D, R, D.bl_tree), me(D, oe - 11, 7));
            se = $, Se = (oe = 0) === ue ? (ce = 138, 3) : $ === ue ? (ce = 6, 3) : (ce = 7, 4);
          }
        }
        d(q);
        var X = !1;
        function M(D, j, le, O) {
          me(D, (h << 1) + (O ? 1 : 0), 3), (function($, se, ue, oe) {
            Ce($), ye($, ue), ye($, ~ue), s.arraySet($.pending_buf, $.window, se, ue, $.pending), $.pending += ue;
          })(D, j, le);
        }
        i._tr_init = function(D) {
          X || ((function() {
            var j, le, O, $, se, ue = new Array(y + 1);
            for ($ = O = 0; $ < b - 1; $++) for (T[$] = O, j = 0; j < 1 << B[$]; j++) v[O++] = $;
            for (v[O - 1] = $, $ = se = 0; $ < 16; $++) for (q[$] = se, j = 0; j < 1 << U[$]; j++) F[se++] = $;
            for (se >>= 7; $ < g; $++) for (q[$] = se << 7, j = 0; j < 1 << U[$] - 7; j++) F[256 + se++] = $;
            for (le = 0; le <= y; le++) ue[le] = 0;
            for (j = 0; j <= 143; ) pe[2 * j + 1] = 8, j++, ue[8]++;
            for (; j <= 255; ) pe[2 * j + 1] = 9, j++, ue[9]++;
            for (; j <= 279; ) pe[2 * j + 1] = 7, j++, ue[7]++;
            for (; j <= 287; ) pe[2 * j + 1] = 8, j++, ue[8]++;
            for (we(pe, p + 1, ue), j = 0; j < g; j++) E[2 * j + 1] = 5, E[2 * j] = re(j, 5);
            fe = new ge(pe, B, m + 1, p, y), Z = new ge(E, U, 0, g, y), ke = new ge(new Array(0), Q, 0, _, S);
          })(), X = !0), D.l_desc = new W(D.dyn_ltree, fe), D.d_desc = new W(D.dyn_dtree, Z), D.bl_desc = new W(D.bl_tree, ke), D.bi_buf = 0, D.bi_valid = 0, _e(D);
        }, i._tr_stored_block = M, i._tr_flush_block = function(D, j, le, O) {
          var $, se, ue = 0;
          0 < D.level ? (D.strm.data_type === 2 && (D.strm.data_type = (function(oe) {
            var ce, Se = 4093624447;
            for (ce = 0; ce <= 31; ce++, Se >>>= 1) if (1 & Se && oe.dyn_ltree[2 * ce] !== 0) return a;
            if (oe.dyn_ltree[18] !== 0 || oe.dyn_ltree[20] !== 0 || oe.dyn_ltree[26] !== 0) return l;
            for (ce = 32; ce < m; ce++) if (oe.dyn_ltree[2 * ce] !== 0) return l;
            return a;
          })(D)), Re(D, D.l_desc), Re(D, D.d_desc), ue = (function(oe) {
            var ce;
            for (w(oe, oe.dyn_ltree, oe.l_desc.max_code), w(oe, oe.dyn_dtree, oe.d_desc.max_code), Re(oe, oe.bl_desc), ce = _ - 1; 3 <= ce && oe.bl_tree[2 * K[ce] + 1] === 0; ce--) ;
            return oe.opt_len += 3 * (ce + 1) + 5 + 5 + 4, ce;
          })(D), $ = D.opt_len + 3 + 7 >>> 3, (se = D.static_len + 3 + 7 >>> 3) <= $ && ($ = se)) : $ = se = le + 5, le + 4 <= $ && j !== -1 ? M(D, j, le, O) : D.strategy === 4 || se === $ ? (me(D, 2 + (O ? 1 : 0), 3), Ge(D, pe, E)) : (me(D, 4 + (O ? 1 : 0), 3), (function(oe, ce, Se, Ne) {
            var je;
            for (me(oe, ce - 257, 5), me(oe, Se - 1, 5), me(oe, Ne - 4, 4), je = 0; je < Ne; je++) me(oe, oe.bl_tree[2 * K[je] + 1], 3);
            ie(oe, oe.dyn_ltree, ce - 1), ie(oe, oe.dyn_dtree, Se - 1);
          })(D, D.l_desc.max_code + 1, D.d_desc.max_code + 1, ue + 1), Ge(D, D.dyn_ltree, D.dyn_dtree)), _e(D), O && Ce(D);
        }, i._tr_tally = function(D, j, le) {
          return D.pending_buf[D.d_buf + 2 * D.last_lit] = j >>> 8 & 255, D.pending_buf[D.d_buf + 2 * D.last_lit + 1] = 255 & j, D.pending_buf[D.l_buf + D.last_lit] = 255 & le, D.last_lit++, j === 0 ? D.dyn_ltree[2 * le]++ : (D.matches++, j--, D.dyn_ltree[2 * (v[le] + m + 1)]++, D.dyn_dtree[2 * H(j)]++), D.last_lit === D.lit_bufsize - 1;
        }, i._tr_align = function(D) {
          me(D, 2, 3), de(D, x, pe), (function(j) {
            j.bi_valid === 16 ? (ye(j, j.bi_buf), j.bi_buf = 0, j.bi_valid = 0) : 8 <= j.bi_valid && (j.pending_buf[j.pending++] = 255 & j.bi_buf, j.bi_buf >>= 8, j.bi_valid -= 8);
          })(D);
        };
      }, { "../utils/common": 41 }], 53: [function(n, r, i) {
        r.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(n, r, i) {
        (function(s) {
          (function(a, l) {
            if (!a.setImmediate) {
              var d, h, b, m, p = 1, g = {}, _ = !1, k = a.document, y = Object.getPrototypeOf && Object.getPrototypeOf(a);
              y = y && y.setTimeout ? y : a, d = {}.toString.call(a.process) === "[object process]" ? function(z) {
                process.nextTick(function() {
                  S(z);
                });
              } : (function() {
                if (a.postMessage && !a.importScripts) {
                  var z = !0, N = a.onmessage;
                  return a.onmessage = function() {
                    z = !1;
                  }, a.postMessage("", "*"), a.onmessage = N, z;
                }
              })() ? (m = "setImmediate$" + Math.random() + "$", a.addEventListener ? a.addEventListener("message", x, !1) : a.attachEvent("onmessage", x), function(z) {
                a.postMessage(m + z, "*");
              }) : a.MessageChannel ? ((b = new MessageChannel()).port1.onmessage = function(z) {
                S(z.data);
              }, function(z) {
                b.port2.postMessage(z);
              }) : k && "onreadystatechange" in k.createElement("script") ? (h = k.documentElement, function(z) {
                var N = k.createElement("script");
                N.onreadystatechange = function() {
                  S(z), N.onreadystatechange = null, h.removeChild(N), N = null;
                }, h.appendChild(N);
              }) : function(z) {
                setTimeout(S, 0, z);
              }, y.setImmediate = function(z) {
                typeof z != "function" && (z = new Function("" + z));
                for (var N = new Array(arguments.length - 1), R = 0; R < N.length; R++) N[R] = arguments[R + 1];
                var B = { callback: z, args: N };
                return g[p] = B, d(p), p++;
              }, y.clearImmediate = C;
            }
            function C(z) {
              delete g[z];
            }
            function S(z) {
              if (_) setTimeout(S, 0, z);
              else {
                var N = g[z];
                if (N) {
                  _ = !0;
                  try {
                    (function(R) {
                      var B = R.callback, U = R.args;
                      switch (U.length) {
                        case 0:
                          B();
                          break;
                        case 1:
                          B(U[0]);
                          break;
                        case 2:
                          B(U[0], U[1]);
                          break;
                        case 3:
                          B(U[0], U[1], U[2]);
                          break;
                        default:
                          B.apply(l, U);
                      }
                    })(N);
                  } finally {
                    C(z), _ = !1;
                  }
                }
              }
            }
            function x(z) {
              z.source === a && typeof z.data == "string" && z.data.indexOf(m) === 0 && S(+z.data.slice(m.length));
            }
          })(typeof self > "u" ? s === void 0 ? this : s : self);
        }).call(this, typeof Ma < "u" ? Ma : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(yc)), yc.exports;
}
var zA = MA();
const RA = /* @__PURE__ */ PA(zA);
var st;
(function(t) {
  t.OfficeDocument = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument", t.FontTable = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable", t.Image = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image", t.Numbering = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering", t.Styles = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles", t.StylesWithEffects = "http://schemas.microsoft.com/office/2007/relationships/stylesWithEffects", t.Theme = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme", t.Settings = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings", t.WebSettings = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings", t.Hyperlink = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink", t.Footnotes = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes", t.Endnotes = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes", t.Footer = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer", t.Header = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/header", t.ExtendedProperties = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties", t.CoreProperties = "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties", t.CustomProperties = "http://schemas.openxmlformats.org/package/2006/relationships/metadata/custom-properties", t.Comments = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments", t.CommentsExtended = "http://schemas.microsoft.com/office/2011/relationships/commentsExtended", t.AltChunk = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk";
})(st || (st = {}));
function TA(t, e) {
  return e.elements(t).map((n) => ({
    id: e.attr(n, "Id"),
    type: e.attr(n, "Type"),
    target: e.attr(n, "Target"),
    targetMode: e.attr(n, "TargetMode")
  }));
}
function FA(t) {
  return t?.replace(/[ .]+/g, "-").replace(/[&]+/g, "and").toLowerCase();
}
function jc(t) {
  return /^[^"'].*\s.*[^"']$/.test(t) ? `'${t}'` : t;
}
function Wa(t) {
  let e = t.lastIndexOf("/") + 1, n = e == 0 ? "" : t.substring(0, e), r = e == 0 ? t : t.substring(e);
  return [n, r];
}
function wc(t, e) {
  try {
    const n = "http://docx/";
    return new URL(t, n + e).toString().substring(n.length);
  } catch {
    return `${e}${t}`;
  }
}
function dr(t, e) {
  return t.reduce((n, r) => (n[e(r)] = r, n), {});
}
function LA(t) {
  return new Promise((e, n) => {
    const r = new FileReader();
    r.onloadend = () => e(r.result), r.onerror = () => n(), r.readAsDataURL(t);
  });
}
function _c(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
function qc(t) {
  return typeof t == "string" || t instanceof String;
}
function Ao(t, ...e) {
  if (!e.length)
    return t;
  const n = e.shift();
  if (_c(t) && _c(n))
    for (const r in n)
      if (_c(n[r])) {
        const i = t[r] ?? (t[r] = {});
        Ao(i, n[r]);
      } else
        t[r] = n[r];
  return Ao(t, ...e);
}
function is(t) {
  return Array.isArray(t) ? t : [t];
}
function OA(t, e, n) {
  return e > t ? e : n < t ? n : t;
}
const Rg = {
  wordml: "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
}, ot = {
  Dxa: { mul: 0.05, unit: "pt" },
  Emu: { mul: 1 / 12700, unit: "pt" },
  FontSize: { mul: 0.5, unit: "pt" },
  Border: { mul: 0.125, unit: "pt", min: 0.25, max: 12 },
  Point: { mul: 1, unit: "pt" },
  Percent: { mul: 0.02, unit: "%" }
};
function Tg(t, e = ot.Dxa) {
  if (t == null || /.+(p[xt]|[%])$/.test(t))
    return t;
  var n = parseInt(t) * e.mul;
  return e.min && e.max && (n = OA(n, e.min, e.max)), `${n.toFixed(2)}${e.unit}`;
}
function UA(t, e = !1) {
  switch (t) {
    case "1":
      return !0;
    case "0":
      return !1;
    case "on":
      return !0;
    case "off":
      return !1;
    case "true":
      return !0;
    case "false":
      return !1;
    default:
      return e;
  }
}
function Fg(t, e, n) {
  if (t.namespaceURI != Rg.wordml)
    return !1;
  switch (t.localName) {
    case "color":
      e.color = n.attr(t, "val");
      break;
    case "sz":
      e.fontSize = n.lengthAttr(t, "val", ot.FontSize);
      break;
    default:
      return !1;
  }
  return !0;
}
function $A(t, e = !1) {
  e && (t = t.replace(/<[?].*[?]>/, "")), t = jA(t);
  const n = new DOMParser().parseFromString(t, "application/xml"), r = QA(n);
  if (r)
    throw new Error(r);
  return n;
}
function QA(t) {
  return t.getElementsByTagName("parsererror")[0]?.textContent;
}
function jA(t) {
  return t.charCodeAt(0) === 65279 ? t.substring(1) : t;
}
function qA(t) {
  return new XMLSerializer().serializeToString(t);
}
class Lg {
  elements(e, n = null) {
    const r = [];
    for (let i = 0, s = e.childNodes.length; i < s; i++) {
      let a = e.childNodes.item(i);
      a.nodeType == Node.ELEMENT_NODE && (n == null || a.localName == n) && r.push(a);
    }
    return r;
  }
  element(e, n) {
    for (let r = 0, i = e.childNodes.length; r < i; r++) {
      let s = e.childNodes.item(r);
      if (s.nodeType == 1 && s.localName == n)
        return s;
    }
    return null;
  }
  elementAttr(e, n, r) {
    var i = this.element(e, n);
    return i ? this.attr(i, r) : void 0;
  }
  attrs(e) {
    return Array.from(e.attributes);
  }
  attr(e, n) {
    for (let r = 0, i = e.attributes.length; r < i; r++) {
      let s = e.attributes.item(r);
      if (s.localName == n)
        return s.value;
    }
    return null;
  }
  intAttr(e, n, r = null) {
    var i = this.attr(e, n);
    return i ? parseInt(i) : r;
  }
  hexAttr(e, n, r = null) {
    var i = this.attr(e, n);
    return i ? parseInt(i, 16) : r;
  }
  floatAttr(e, n, r = null) {
    var i = this.attr(e, n);
    return i ? parseFloat(i) : r;
  }
  boolAttr(e, n, r = null) {
    return UA(this.attr(e, n), r);
  }
  lengthAttr(e, n, r = ot.Dxa) {
    return Tg(this.attr(e, n), r);
  }
}
const L = new Lg();
class Ut {
  constructor(e, n) {
    this._package = e, this.path = n;
  }
  async load() {
    this.rels = await this._package.loadRelationships(this.path);
    const e = await this._package.load(this.path), n = this._package.parseXmlDocument(e);
    this._package.options.keepOrigin && (this._xmlDocument = n), this.parseXml(n.firstElementChild);
  }
  save() {
    this._package.update(this.path, qA(this._xmlDocument));
  }
  parseXml(e) {
  }
}
const HA = {
  embedRegular: "regular",
  embedBold: "bold",
  embedItalic: "italic",
  embedBoldItalic: "boldItalic"
};
function GA(t, e) {
  return e.elements(t).map((n) => JA(n, e));
}
function JA(t, e) {
  let n = {
    name: e.attr(t, "name"),
    embedFontRefs: []
  };
  for (let r of e.elements(t))
    switch (r.localName) {
      case "family":
        n.family = e.attr(r, "val");
        break;
      case "altName":
        n.altName = e.attr(r, "val");
        break;
      case "embedRegular":
      case "embedBold":
      case "embedItalic":
      case "embedBoldItalic":
        n.embedFontRefs.push(VA(r, e));
        break;
    }
  return n;
}
function VA(t, e) {
  return {
    id: e.attr(t, "id"),
    key: e.attr(t, "fontKey"),
    type: HA[t.localName]
  };
}
class KA extends Ut {
  parseXml(e) {
    this.fonts = GA(e, this._package.xmlParser);
  }
}
function WA(t, e) {
  return e.elements(t).map((n) => ({
    extension: e.attr(n, "Extension"),
    partName: e.attr(n, "PartName"),
    contentType: e.attr(n, "ContentType")
  }));
}
class xd {
  constructor(e, n) {
    this._zip = e, this.options = n, this.xmlParser = new Lg();
  }
  get(e) {
    const n = XA(e);
    return this._zip.files[n] ?? this._zip.files[n.replace(/\//g, "\\")];
  }
  update(e, n) {
    this._zip.file(e, n);
  }
  static async load(e, n) {
    const r = await RA.loadAsync(e);
    return new xd(r, n);
  }
  save(e = "blob") {
    return this._zip.generateAsync({ type: e });
  }
  load(e, n = "string") {
    return this.get(e)?.async(n) ?? Promise.resolve(null);
  }
  async loadRelationships(e = null) {
    let n = "_rels/.rels";
    if (e != null) {
      const [i, s] = Wa(e);
      n = `${i}_rels/${s}.rels`;
    }
    const r = await this.load(n);
    return r ? TA(this.parseXmlDocument(r).firstElementChild, this.xmlParser) : null;
  }
  async loadContentTypes() {
    const e = await this.load("[Content_Types].xml");
    return e ? WA(this.parseXmlDocument(e).firstElementChild, this.xmlParser) : [];
  }
  parseXmlDocument(e) {
    return $A(e, this.options.trimXmlDeclaration);
  }
}
function XA(t) {
  return t.startsWith("/") ? t.substr(1) : t;
}
class ZA extends Ut {
  constructor(e, n, r) {
    super(e, n), this._documentParser = r;
  }
  parseXml(e) {
    this.body = this._documentParser.parseDocumentFile(e);
  }
}
function Ra(t, e) {
  return {
    type: e.attr(t, "val"),
    color: e.attr(t, "color"),
    size: e.lengthAttr(t, "sz", ot.Border),
    offset: e.lengthAttr(t, "space", ot.Point),
    frame: e.boolAttr(t, "frame"),
    shadow: e.boolAttr(t, "shadow")
  };
}
function YA(t, e) {
  var n = {};
  for (let r of e.elements(t))
    switch (r.localName) {
      case "left":
        n.left = Ra(r, e);
        break;
      case "top":
        n.top = Ra(r, e);
        break;
      case "right":
        n.right = Ra(r, e);
        break;
      case "bottom":
        n.bottom = Ra(r, e);
        break;
    }
  return n;
}
var df;
(function(t) {
  t.Continuous = "continuous", t.NextPage = "nextPage", t.NextColumn = "nextColumn", t.EvenPage = "evenPage", t.OddPage = "oddPage";
})(df || (df = {}));
function Og(t, e = L) {
  var n = {};
  for (let r of e.elements(t))
    switch (r.localName) {
      case "pgSz":
        n.pageSize = {
          width: e.lengthAttr(r, "w"),
          height: e.lengthAttr(r, "h"),
          orientation: e.attr(r, "orient")
        };
        break;
      case "type":
        n.type = e.attr(r, "val");
        break;
      case "pgMar":
        n.pageMargins = {
          left: e.lengthAttr(r, "left"),
          right: e.lengthAttr(r, "right"),
          top: e.lengthAttr(r, "top"),
          bottom: e.lengthAttr(r, "bottom"),
          header: e.lengthAttr(r, "header"),
          footer: e.lengthAttr(r, "footer"),
          gutter: e.lengthAttr(r, "gutter")
        };
        break;
      case "cols":
        n.columns = e0(r, e);
        break;
      case "headerReference":
        (n.headerRefs ?? (n.headerRefs = [])).push(uf(r, e));
        break;
      case "footerReference":
        (n.footerRefs ?? (n.footerRefs = [])).push(uf(r, e));
        break;
      case "titlePg":
        n.titlePage = e.boolAttr(r, "val", !0);
        break;
      case "pgBorders":
        n.pageBorders = YA(r, e);
        break;
      case "pgNumType":
        n.pageNumber = t0(r, e);
        break;
    }
  return n;
}
function e0(t, e) {
  return {
    numberOfColumns: e.intAttr(t, "num"),
    space: e.lengthAttr(t, "space"),
    separator: e.boolAttr(t, "sep"),
    equalWidth: e.boolAttr(t, "equalWidth", !0),
    columns: e.elements(t, "col").map((n) => ({
      width: e.lengthAttr(n, "w"),
      space: e.lengthAttr(n, "space")
    }))
  };
}
function t0(t, e) {
  return {
    chapSep: e.attr(t, "chapSep"),
    chapStyle: e.attr(t, "chapStyle"),
    format: e.attr(t, "fmt"),
    start: e.intAttr(t, "start")
  };
}
function uf(t, e) {
  return {
    id: e.attr(t, "id"),
    type: e.attr(t, "type")
  };
}
function n0(t, e) {
  return {
    before: e.lengthAttr(t, "before"),
    after: e.lengthAttr(t, "after"),
    line: e.intAttr(t, "line"),
    lineRule: e.attr(t, "lineRule")
  };
}
function Nd(t, e) {
  let n = {};
  for (let r of e.elements(t))
    r0(r, n, e);
  return n;
}
function r0(t, e, n) {
  return !!Fg(t, e, n);
}
function Ug(t, e) {
  let n = {};
  for (let r of e.elements(t))
    $g(r, n, e);
  return n;
}
function $g(t, e, n) {
  if (t.namespaceURI != Rg.wordml)
    return !1;
  if (Fg(t, e, n))
    return !0;
  switch (t.localName) {
    case "tabs":
      e.tabs = i0(t, n);
      break;
    case "sectPr":
      e.sectionProps = Og(t, n);
      break;
    case "numPr":
      e.numbering = s0(t, n);
      break;
    case "spacing":
      return e.lineSpacing = n0(t, n), !1;
    case "textAlignment":
      return e.textAlignment = n.attr(t, "val"), !1;
    case "keepLines":
      e.keepLines = n.boolAttr(t, "val", !0);
      break;
    case "keepNext":
      e.keepNext = n.boolAttr(t, "val", !0);
      break;
    case "pageBreakBefore":
      e.pageBreakBefore = n.boolAttr(t, "val", !0);
      break;
    case "outlineLvl":
      e.outlineLevel = n.intAttr(t, "val");
      break;
    case "pStyle":
      e.styleName = n.attr(t, "val");
      break;
    case "rPr":
      e.runProps = Nd(t, n);
      break;
    default:
      return !1;
  }
  return !0;
}
function i0(t, e) {
  return e.elements(t, "tab").map((n) => ({
    position: e.lengthAttr(n, "pos"),
    leader: e.attr(n, "leader"),
    style: e.attr(n, "val")
  }));
}
function s0(t, e) {
  var n = {};
  for (let r of e.elements(t))
    switch (r.localName) {
      case "numId":
        n.id = e.attr(r, "val");
        break;
      case "ilvl":
        n.level = e.intAttr(r, "val");
        break;
    }
  return n;
}
function a0(t, e) {
  let n = {
    numberings: [],
    abstractNumberings: [],
    bulletPictures: []
  };
  for (let r of e.elements(t))
    switch (r.localName) {
      case "num":
        n.numberings.push(o0(r, e));
        break;
      case "abstractNum":
        n.abstractNumberings.push(l0(r, e));
        break;
      case "numPicBullet":
        n.bulletPictures.push(d0(r, e));
        break;
    }
  return n;
}
function o0(t, e) {
  let n = {
    id: e.attr(t, "numId"),
    overrides: []
  };
  for (let r of e.elements(t))
    switch (r.localName) {
      case "abstractNumId":
        n.abstractId = e.attr(r, "val");
        break;
      case "lvlOverride":
        n.overrides.push(c0(r, e));
        break;
    }
  return n;
}
function l0(t, e) {
  let n = {
    id: e.attr(t, "abstractNumId"),
    levels: []
  };
  for (let r of e.elements(t))
    switch (r.localName) {
      case "name":
        n.name = e.attr(r, "val");
        break;
      case "multiLevelType":
        n.multiLevelType = e.attr(r, "val");
        break;
      case "numStyleLink":
        n.numberingStyleLink = e.attr(r, "val");
        break;
      case "styleLink":
        n.styleLink = e.attr(r, "val");
        break;
      case "lvl":
        n.levels.push(Qg(r, e));
        break;
    }
  return n;
}
function Qg(t, e) {
  let n = {
    level: e.intAttr(t, "ilvl")
  };
  for (let r of e.elements(t))
    switch (r.localName) {
      case "start":
        n.start = e.attr(r, "val");
        break;
      case "lvlRestart":
        n.restart = e.intAttr(r, "val");
        break;
      case "numFmt":
        n.format = e.attr(r, "val");
        break;
      case "lvlText":
        n.text = e.attr(r, "val");
        break;
      case "lvlJc":
        n.justification = e.attr(r, "val");
        break;
      case "lvlPicBulletId":
        n.bulletPictureId = e.attr(r, "val");
        break;
      case "pStyle":
        n.paragraphStyle = e.attr(r, "val");
        break;
      case "pPr":
        n.paragraphProps = Ug(r, e);
        break;
      case "rPr":
        n.runProps = Nd(r, e);
        break;
    }
  return n;
}
function c0(t, e) {
  let n = {
    level: e.intAttr(t, "ilvl")
  };
  for (let r of e.elements(t))
    switch (r.localName) {
      case "startOverride":
        n.start = e.intAttr(r, "val");
        break;
      case "lvl":
        n.numberingLevel = Qg(r, e);
        break;
    }
  return n;
}
function d0(t, e) {
  var n = e.element(t, "pict"), r = n && e.element(n, "shape"), i = r && e.element(r, "imagedata");
  return i ? {
    id: e.attr(t, "numPicBulletId"),
    referenceId: e.attr(i, "id"),
    style: e.attr(r, "style")
  } : null;
}
class u0 extends Ut {
  constructor(e, n, r) {
    super(e, n), this._documentParser = r;
  }
  parseXml(e) {
    Object.assign(this, a0(e, this._package.xmlParser)), this.domNumberings = this._documentParser.parseNumberingFile(e);
  }
}
class h0 extends Ut {
  constructor(e, n, r) {
    super(e, n), this._documentParser = r;
  }
  parseXml(e) {
    this.styles = this._documentParser.parseStylesFile(e);
  }
}
var ee;
(function(t) {
  t.Document = "document", t.Paragraph = "paragraph", t.Run = "run", t.Break = "break", t.NoBreakHyphen = "noBreakHyphen", t.Table = "table", t.Row = "row", t.Cell = "cell", t.Hyperlink = "hyperlink", t.SmartTag = "smartTag", t.Drawing = "drawing", t.Image = "image", t.Text = "text", t.Tab = "tab", t.Symbol = "symbol", t.BookmarkStart = "bookmarkStart", t.BookmarkEnd = "bookmarkEnd", t.Footer = "footer", t.Header = "header", t.FootnoteReference = "footnoteReference", t.EndnoteReference = "endnoteReference", t.Footnote = "footnote", t.Endnote = "endnote", t.SimpleField = "simpleField", t.ComplexField = "complexField", t.Instruction = "instruction", t.VmlPicture = "vmlPicture", t.MmlMath = "mmlMath", t.MmlMathParagraph = "mmlMathParagraph", t.MmlFraction = "mmlFraction", t.MmlFunction = "mmlFunction", t.MmlFunctionName = "mmlFunctionName", t.MmlNumerator = "mmlNumerator", t.MmlDenominator = "mmlDenominator", t.MmlRadical = "mmlRadical", t.MmlBase = "mmlBase", t.MmlDegree = "mmlDegree", t.MmlSuperscript = "mmlSuperscript", t.MmlSubscript = "mmlSubscript", t.MmlPreSubSuper = "mmlPreSubSuper", t.MmlSubArgument = "mmlSubArgument", t.MmlSuperArgument = "mmlSuperArgument", t.MmlNary = "mmlNary", t.MmlDelimiter = "mmlDelimiter", t.MmlRun = "mmlRun", t.MmlEquationArray = "mmlEquationArray", t.MmlLimit = "mmlLimit", t.MmlLimitLower = "mmlLimitLower", t.MmlMatrix = "mmlMatrix", t.MmlMatrixRow = "mmlMatrixRow", t.MmlBox = "mmlBox", t.MmlBar = "mmlBar", t.MmlGroupChar = "mmlGroupChar", t.VmlElement = "vmlElement", t.Inserted = "inserted", t.Deleted = "deleted", t.DeletedText = "deletedText", t.Comment = "comment", t.CommentReference = "commentReference", t.CommentRangeStart = "commentRangeStart", t.CommentRangeEnd = "commentRangeEnd", t.AltChunk = "altChunk";
})(ee || (ee = {}));
class Or {
  constructor() {
    this.children = [], this.cssStyle = {};
  }
}
class f0 extends Or {
  constructor() {
    super(...arguments), this.type = ee.Header;
  }
}
class p0 extends Or {
  constructor() {
    super(...arguments), this.type = ee.Footer;
  }
}
class jg extends Ut {
  constructor(e, n, r) {
    super(e, n), this._documentParser = r;
  }
  parseXml(e) {
    this.rootElement = this.createRootElement(), this.rootElement.children = this._documentParser.parseBodyElements(e);
  }
}
class g0 extends jg {
  createRootElement() {
    return new f0();
  }
}
class m0 extends jg {
  createRootElement() {
    return new p0();
  }
}
function b0(t, e) {
  const n = {};
  for (let r of e.elements(t))
    switch (r.localName) {
      case "Template":
        n.template = r.textContent;
        break;
      case "Pages":
        n.pages = ss(r.textContent);
        break;
      case "Words":
        n.words = ss(r.textContent);
        break;
      case "Characters":
        n.characters = ss(r.textContent);
        break;
      case "Application":
        n.application = r.textContent;
        break;
      case "Lines":
        n.lines = ss(r.textContent);
        break;
      case "Paragraphs":
        n.paragraphs = ss(r.textContent);
        break;
      case "Company":
        n.company = r.textContent;
        break;
      case "AppVersion":
        n.appVersion = r.textContent;
        break;
    }
  return n;
}
function ss(t) {
  if (!(typeof t > "u"))
    return parseInt(t);
}
class y0 extends Ut {
  parseXml(e) {
    this.props = b0(e, this._package.xmlParser);
  }
}
function w0(t, e) {
  const n = {};
  for (let r of e.elements(t))
    switch (r.localName) {
      case "title":
        n.title = r.textContent;
        break;
      case "description":
        n.description = r.textContent;
        break;
      case "subject":
        n.subject = r.textContent;
        break;
      case "creator":
        n.creator = r.textContent;
        break;
      case "keywords":
        n.keywords = r.textContent;
        break;
      case "language":
        n.language = r.textContent;
        break;
      case "lastModifiedBy":
        n.lastModifiedBy = r.textContent;
        break;
      case "revision":
        r.textContent && (n.revision = parseInt(r.textContent));
        break;
    }
  return n;
}
class _0 extends Ut {
  parseXml(e) {
    this.props = w0(e, this._package.xmlParser);
  }
}
class k0 {
}
function v0(t, e) {
  var n = new k0(), r = e.element(t, "themeElements");
  for (let i of e.elements(r))
    switch (i.localName) {
      case "clrScheme":
        n.colorScheme = A0(i, e);
        break;
      case "fontScheme":
        n.fontScheme = C0(i, e);
        break;
    }
  return n;
}
function A0(t, e) {
  var n = {
    name: e.attr(t, "name"),
    colors: {}
  };
  for (let s of e.elements(t)) {
    var r = e.element(s, "srgbClr"), i = e.element(s, "sysClr");
    r ? n.colors[s.localName] = e.attr(r, "val") : i && (n.colors[s.localName] = e.attr(i, "lastClr"));
  }
  return n;
}
function C0(t, e) {
  var n = {
    name: e.attr(t, "name")
  };
  for (let r of e.elements(t))
    switch (r.localName) {
      case "majorFont":
        n.majorFont = hf(r, e);
        break;
      case "minorFont":
        n.minorFont = hf(r, e);
        break;
    }
  return n;
}
function hf(t, e) {
  return {
    latinTypeface: e.elementAttr(t, "latin", "typeface"),
    eaTypeface: e.elementAttr(t, "ea", "typeface"),
    csTypeface: e.elementAttr(t, "cs", "typeface")
  };
}
class I0 extends Ut {
  constructor(e, n) {
    super(e, n);
  }
  parseXml(e) {
    this.theme = v0(e, this._package.xmlParser);
  }
}
class qg {
}
class S0 extends qg {
  constructor() {
    super(...arguments), this.type = ee.Footnote;
  }
}
class E0 extends qg {
  constructor() {
    super(...arguments), this.type = ee.Endnote;
  }
}
class Hg extends Ut {
  constructor(e, n, r) {
    super(e, n), this._documentParser = r;
  }
}
class x0 extends Hg {
  constructor(e, n, r) {
    super(e, n, r);
  }
  parseXml(e) {
    this.notes = this._documentParser.parseNotes(e, "footnote", S0);
  }
}
class N0 extends Hg {
  constructor(e, n, r) {
    super(e, n, r);
  }
  parseXml(e) {
    this.notes = this._documentParser.parseNotes(e, "endnote", E0);
  }
}
function D0(t, e) {
  var n = {};
  for (let r of e.elements(t))
    switch (r.localName) {
      case "defaultTabStop":
        n.defaultTabStop = e.lengthAttr(r, "val");
        break;
      case "footnotePr":
        n.footnoteProps = ff(r, e);
        break;
      case "endnotePr":
        n.endnoteProps = ff(r, e);
        break;
      case "autoHyphenation":
        n.autoHyphenation = e.boolAttr(r, "val");
        break;
    }
  return n;
}
function ff(t, e) {
  var n = {
    defaultNoteIds: []
  };
  for (let r of e.elements(t))
    switch (r.localName) {
      case "numFmt":
        n.nummeringFormat = e.attr(r, "val");
        break;
      case "footnote":
      case "endnote":
        n.defaultNoteIds.push(e.attr(r, "id"));
        break;
    }
  return n;
}
class B0 extends Ut {
  constructor(e, n) {
    super(e, n);
  }
  parseXml(e) {
    this.settings = D0(e, this._package.xmlParser);
  }
}
function P0(t, e) {
  return e.elements(t, "property").map((n) => {
    const r = n.firstChild;
    return {
      formatId: e.attr(n, "fmtid"),
      name: e.attr(n, "name"),
      type: r.nodeName,
      value: r.textContent
    };
  });
}
class M0 extends Ut {
  parseXml(e) {
    this.props = P0(e, this._package.xmlParser);
  }
}
class z0 extends Ut {
  constructor(e, n, r) {
    super(e, n), this._documentParser = r;
  }
  parseXml(e) {
    this.comments = this._documentParser.parseComments(e), this.commentMap = dr(this.comments, (n) => n.id);
  }
}
class R0 extends Ut {
  constructor(e, n) {
    super(e, n), this.comments = [];
  }
  parseXml(e) {
    const n = this._package.xmlParser;
    for (let r of n.elements(e, "commentEx"))
      this.comments.push({
        paraId: n.attr(r, "paraId"),
        paraIdParent: n.attr(r, "paraIdParent"),
        done: n.boolAttr(r, "done")
      });
    this.commentMap = dr(this.comments, (r) => r.paraId);
  }
}
const T0 = [
  { type: st.OfficeDocument, target: "word/document.xml" },
  { type: st.ExtendedProperties, target: "docProps/app.xml" },
  { type: st.CoreProperties, target: "docProps/core.xml" },
  { type: st.CustomProperties, target: "docProps/custom.xml" }
];
class Dd {
  constructor() {
    this.parts = [], this.partsMap = {}, this.contentTypes = [];
  }
  static async load(e, n, r) {
    var i = new Dd();
    return i._options = r, i._parser = n, i._package = await xd.load(e, r), i.rels = await i._package.loadRelationships(), i.contentTypes = await i._package.loadContentTypes(), await Promise.all(T0.map((s) => {
      const a = i.rels.find((l) => l.type === s.type) ?? s;
      return i.loadRelationshipPart(a.target, a.type);
    })), i;
  }
  save(e = "blob") {
    return this._package.save(e);
  }
  async loadRelationshipPart(e, n) {
    if (this.partsMap[e])
      return this.partsMap[e];
    if (!this._package.get(e))
      return null;
    let r = null;
    switch (n) {
      case st.OfficeDocument:
        this.documentPart = r = new ZA(this._package, e, this._parser);
        break;
      case st.FontTable:
        this.fontTablePart = r = new KA(this._package, e);
        break;
      case st.Numbering:
        this.numberingPart = r = new u0(this._package, e, this._parser);
        break;
      case st.Styles:
        this.stylesPart = r = new h0(this._package, e, this._parser);
        break;
      case st.Theme:
        this.themePart = r = new I0(this._package, e);
        break;
      case st.Footnotes:
        this.footnotesPart = r = new x0(this._package, e, this._parser);
        break;
      case st.Endnotes:
        this.endnotesPart = r = new N0(this._package, e, this._parser);
        break;
      case st.Footer:
        r = new m0(this._package, e, this._parser);
        break;
      case st.Header:
        r = new g0(this._package, e, this._parser);
        break;
      case st.CoreProperties:
        this.corePropsPart = r = new _0(this._package, e);
        break;
      case st.ExtendedProperties:
        this.extendedPropsPart = r = new y0(this._package, e);
        break;
      case st.CustomProperties:
        r = new M0(this._package, e);
        break;
      case st.Settings:
        this.settingsPart = r = new B0(this._package, e);
        break;
      case st.Comments:
        this.commentsPart = r = new z0(this._package, e, this._parser);
        break;
      case st.CommentsExtended:
        this.commentsExtendedPart = r = new R0(this._package, e);
        break;
    }
    if (r == null)
      return Promise.resolve(null);
    if (this.partsMap[e] = r, this.parts.push(r), await r.load(), r.rels?.length > 0) {
      const [i] = Wa(r.path);
      await Promise.all(r.rels.map((s) => this.loadRelationshipPart(wc(s.target, i), s.type)));
    }
    return r;
  }
  async loadDocumentImage(e, n) {
    const r = this.getPathById(n ?? this.documentPart, e);
    return r ? this.blobToURL(await this._package.load(r, "blob"), r) : null;
  }
  async loadNumberingImage(e) {
    const n = this.getPathById(this.numberingPart, e);
    return n ? this.blobToURL(await this._package.load(n, "blob"), n) : null;
  }
  async loadFont(e, n) {
    const r = this.getPathById(this.fontTablePart, e);
    if (!r)
      return null;
    const i = await this._package.load(r, "uint8array");
    return i && this.blobToURL(new Blob([F0(i, n)]), r);
  }
  async loadAltChunk(e, n) {
    const r = this.getPathById(n ?? this.documentPart, e);
    return r ? this._package.load(r, "string") : Promise.resolve(null);
  }
  blobToURL(e, n) {
    if (!e)
      return null;
    if (n) {
      const r = this.contentTypes.find((i) => i.partName === n || i.extension && n.endsWith(`.${i.extension}`));
      e = r ? new Blob([e], { type: r.contentType }) : e;
    }
    return this._options.useBase64URL ? LA(e) : URL.createObjectURL(e);
  }
  findPartByRelId(e, n = null) {
    var r = (n.rels ?? this.rels).find((s) => s.id == e);
    const i = n ? Wa(n.path)[0] : "";
    return r ? this.partsMap[wc(r.target, i)] : null;
  }
  getPathById(e, n) {
    const r = e.rels.find((s) => s.id == n), [i] = Wa(e.path);
    return r ? wc(r.target, i) : null;
  }
}
function F0(t, e) {
  const r = e.replace(/{|}|-/g, ""), i = new Array(16);
  for (let s = 0; s < 16; s++)
    i[16 - s - 1] = parseInt(r.substring(s * 2, s * 2 + 2), 16);
  for (let s = 0; s < 32; s++)
    t[s] = t[s] ^ i[s % 16];
  return t;
}
function L0(t, e) {
  return {
    type: ee.BookmarkStart,
    id: e.attr(t, "id"),
    name: e.attr(t, "name"),
    colFirst: e.intAttr(t, "colFirst"),
    colLast: e.intAttr(t, "colLast")
  };
}
function O0(t, e) {
  return {
    type: ee.BookmarkEnd,
    id: e.attr(t, "id")
  };
}
class U0 extends Or {
  constructor() {
    super(...arguments), this.type = ee.VmlElement, this.attrs = {};
  }
}
function Gg(t, e) {
  var n = new U0();
  switch (t.localName) {
    case "rect":
      n.tagName = "rect", Object.assign(n.attrs, { width: "100%", height: "100%" });
      break;
    case "oval":
      n.tagName = "ellipse", Object.assign(n.attrs, { cx: "50%", cy: "50%", rx: "50%", ry: "50%" });
      break;
    case "line":
      n.tagName = "line";
      break;
    case "shape":
      n.tagName = "g";
      break;
    case "textbox":
      n.tagName = "foreignObject", Object.assign(n.attrs, { width: "100%", height: "100%" });
      break;
    default:
      return null;
  }
  for (const r of L.attrs(t))
    switch (r.localName) {
      case "style":
        n.cssStyleText = r.value;
        break;
      case "fillcolor":
        n.attrs.fill = r.value;
        break;
      case "from":
        const [i, s] = pf(r.value);
        Object.assign(n.attrs, { x1: i, y1: s });
        break;
      case "to":
        const [a, l] = pf(r.value);
        Object.assign(n.attrs, { x2: a, y2: l });
        break;
    }
  for (const r of L.elements(t))
    switch (r.localName) {
      case "stroke":
        Object.assign(n.attrs, $0(r));
        break;
      case "fill":
        Object.assign(n.attrs, Q0());
        break;
      case "imagedata":
        n.tagName = "image", Object.assign(n.attrs, { width: "100%", height: "100%" }), n.imageHref = {
          id: L.attr(r, "id"),
          title: L.attr(r, "title")
        };
        break;
      case "txbxContent":
        n.children.push(...e.parseBodyElements(r));
        break;
      default:
        const i = Gg(r, e);
        i && n.children.push(i);
        break;
    }
  return n;
}
function $0(t) {
  return {
    stroke: L.attr(t, "color"),
    "stroke-width": L.lengthAttr(t, "weight", ot.Emu) ?? "1px"
  };
}
function Q0(t) {
  return {};
}
function pf(t) {
  return t.split(",");
}
class j0 extends Or {
  constructor() {
    super(...arguments), this.type = ee.Comment;
  }
}
class q0 extends Or {
  constructor(e) {
    super(), this.id = e, this.type = ee.CommentReference;
  }
}
class H0 extends Or {
  constructor(e) {
    super(), this.id = e, this.type = ee.CommentRangeStart;
  }
}
class G0 extends Or {
  constructor(e) {
    super(), this.id = e, this.type = ee.CommentRangeEnd;
  }
}
var Xa = {
  shd: "inherit",
  color: "black",
  borderColor: "black",
  highlight: "transparent"
};
const J0 = [], gf = {
  oMath: ee.MmlMath,
  oMathPara: ee.MmlMathParagraph,
  f: ee.MmlFraction,
  func: ee.MmlFunction,
  fName: ee.MmlFunctionName,
  num: ee.MmlNumerator,
  den: ee.MmlDenominator,
  rad: ee.MmlRadical,
  deg: ee.MmlDegree,
  e: ee.MmlBase,
  sSup: ee.MmlSuperscript,
  sSub: ee.MmlSubscript,
  sPre: ee.MmlPreSubSuper,
  sup: ee.MmlSuperArgument,
  sub: ee.MmlSubArgument,
  d: ee.MmlDelimiter,
  nary: ee.MmlNary,
  eqArr: ee.MmlEquationArray,
  lim: ee.MmlLimit,
  limLow: ee.MmlLimitLower,
  m: ee.MmlMatrix,
  mr: ee.MmlMatrixRow,
  box: ee.MmlBox,
  bar: ee.MmlBar,
  groupChr: ee.MmlGroupChar
};
class V0 {
  constructor(e) {
    this.options = {
      ignoreWidth: !1,
      debug: !1,
      ...e
    };
  }
  parseNotes(e, n, r) {
    var i = [];
    for (let s of L.elements(e, n)) {
      const a = new r();
      a.id = L.attr(s, "id"), a.noteType = L.attr(s, "type"), a.children = this.parseBodyElements(s), i.push(a);
    }
    return i;
  }
  parseComments(e) {
    var n = [];
    for (let r of L.elements(e, "comment")) {
      const i = new j0();
      i.id = L.attr(r, "id"), i.author = L.attr(r, "author"), i.initials = L.attr(r, "initials"), i.date = L.attr(r, "date"), i.children = this.parseBodyElements(r), n.push(i);
    }
    return n;
  }
  parseDocumentFile(e) {
    var n = L.element(e, "body"), r = L.element(e, "background"), i = L.element(n, "sectPr");
    return {
      type: ee.Document,
      children: this.parseBodyElements(n),
      props: i ? Og(i, L) : {},
      cssStyle: r ? this.parseBackground(r) : {}
    };
  }
  parseBackground(e) {
    var n = {}, r = ai.colorAttr(e, "color");
    return r && (n["background-color"] = r), n;
  }
  parseBodyElements(e) {
    var n = [];
    for (const r of L.elements(e))
      switch (r.localName) {
        case "p":
          n.push(this.parseParagraph(r));
          break;
        case "altChunk":
          n.push(this.parseAltChunk(r));
          break;
        case "tbl":
          n.push(this.parseTable(r));
          break;
        case "sdt":
          n.push(...this.parseSdt(r, (i) => this.parseBodyElements(i)));
          break;
      }
    return n;
  }
  parseStylesFile(e) {
    var n = [];
    for (const r of L.elements(e))
      switch (r.localName) {
        case "style":
          n.push(this.parseStyle(r));
          break;
        case "docDefaults":
          n.push(this.parseDefaultStyles(r));
          break;
      }
    return n;
  }
  parseDefaultStyles(e) {
    var n = {
      id: null,
      name: null,
      target: null,
      basedOn: null,
      styles: []
    };
    for (const s of L.elements(e))
      switch (s.localName) {
        case "rPrDefault":
          var r = L.element(s, "rPr");
          r && n.styles.push({
            target: "span",
            values: this.parseDefaultProperties(r, {})
          });
          break;
        case "pPrDefault":
          var i = L.element(s, "pPr");
          i && n.styles.push({
            target: "p",
            values: this.parseDefaultProperties(i, {})
          });
          break;
      }
    return n;
  }
  parseStyle(e) {
    var n = {
      id: L.attr(e, "styleId"),
      isDefault: L.boolAttr(e, "default"),
      name: null,
      target: null,
      basedOn: null,
      styles: [],
      linked: null
    };
    switch (L.attr(e, "type")) {
      case "paragraph":
        n.target = "p";
        break;
      case "table":
        n.target = "table";
        break;
      case "character":
        n.target = "span";
        break;
    }
    for (const r of L.elements(e))
      switch (r.localName) {
        case "basedOn":
          n.basedOn = L.attr(r, "val");
          break;
        case "name":
          n.name = L.attr(r, "val");
          break;
        case "link":
          n.linked = L.attr(r, "val");
          break;
        case "next":
          n.next = L.attr(r, "val");
          break;
        case "aliases":
          n.aliases = L.attr(r, "val").split(",");
          break;
        case "pPr":
          n.styles.push({
            target: "p",
            values: this.parseDefaultProperties(r, {})
          }), n.paragraphProps = Ug(r, L);
          break;
        case "rPr":
          n.styles.push({
            target: "span",
            values: this.parseDefaultProperties(r, {})
          }), n.runProps = Nd(r, L);
          break;
        case "tblPr":
        case "tcPr":
          n.styles.push({
            target: "td",
            values: this.parseDefaultProperties(r, {})
          });
          break;
        case "tblStylePr":
          for (let i of this.parseTableStyle(r))
            n.styles.push(i);
          break;
        case "rsid":
        case "qFormat":
        case "hidden":
        case "semiHidden":
        case "unhideWhenUsed":
        case "autoRedefine":
        case "uiPriority":
          break;
        default:
          this.options.debug && console.warn(`DOCX: Unknown style element: ${r.localName}`);
      }
    return n;
  }
  parseTableStyle(e) {
    var n = [], r = L.attr(e, "type"), i = "", s = "";
    switch (r) {
      case "firstRow":
        s = ".first-row", i = "tr.first-row td";
        break;
      case "lastRow":
        s = ".last-row", i = "tr.last-row td";
        break;
      case "firstCol":
        s = ".first-col", i = "td.first-col";
        break;
      case "lastCol":
        s = ".last-col", i = "td.last-col";
        break;
      case "band1Vert":
        s = ":not(.no-vband)", i = "td.odd-col";
        break;
      case "band2Vert":
        s = ":not(.no-vband)", i = "td.even-col";
        break;
      case "band1Horz":
        s = ":not(.no-hband)", i = "tr.odd-row";
        break;
      case "band2Horz":
        s = ":not(.no-hband)", i = "tr.even-row";
        break;
      default:
        return [];
    }
    for (const a of L.elements(e))
      switch (a.localName) {
        case "pPr":
          n.push({
            target: `${i} p`,
            mod: s,
            values: this.parseDefaultProperties(a, {})
          });
          break;
        case "rPr":
          n.push({
            target: `${i} span`,
            mod: s,
            values: this.parseDefaultProperties(a, {})
          });
          break;
        case "tblPr":
        case "tcPr":
          n.push({
            target: i,
            mod: s,
            values: this.parseDefaultProperties(a, {})
          });
          break;
      }
    return n;
  }
  parseNumberingFile(e) {
    const n = [], r = [], i = [];
    for (const s of L.elements(e))
      switch (s.localName) {
        case "abstractNum":
          n.push(...this.parseAbstractNumbering(s, i));
          break;
        case "numPicBullet":
          i.push(this.parseNumberingPicBullet(s));
          break;
        case "num":
          r.push({
            numId: L.attr(s, "numId"),
            abstractNumId: L.elementAttr(s, "abstractNumId", "val")
          });
          break;
      }
    return r.flatMap((s) => n.filter((a) => s.abstractNumId == a.id).map((a) => ({ ...a, id: s.numId })));
  }
  parseNumberingPicBullet(e) {
    var n = L.element(e, "pict"), r = n && L.element(n, "shape"), i = r && L.element(r, "imagedata");
    return i ? {
      id: L.intAttr(e, "numPicBulletId"),
      src: L.attr(i, "id"),
      style: L.attr(r, "style")
    } : null;
  }
  parseAbstractNumbering(e, n) {
    var r = [], i = L.attr(e, "abstractNumId");
    for (const s of L.elements(e))
      s.localName === "lvl" && r.push(this.parseNumberingLevel(i, s, n));
    return r;
  }
  parseNumberingLevel(e, n, r) {
    var i = {
      id: e,
      level: L.intAttr(n, "ilvl"),
      start: 1,
      pStyleName: void 0,
      pStyle: {},
      rStyle: {},
      suff: "tab"
    };
    for (const a of L.elements(n))
      switch (a.localName) {
        case "start":
          i.start = L.intAttr(a, "val");
          break;
        case "pPr":
          this.parseDefaultProperties(a, i.pStyle);
          break;
        case "rPr":
          this.parseDefaultProperties(a, i.rStyle);
          break;
        case "lvlPicBulletId":
          var s = L.intAttr(a, "val");
          i.bullet = r.find((l) => l?.id == s);
          break;
        case "lvlText":
          i.levelText = L.attr(a, "val");
          break;
        case "pStyle":
          i.pStyleName = L.attr(a, "val");
          break;
        case "numFmt":
          i.format = L.attr(a, "val");
          break;
        case "suff":
          i.suff = L.attr(a, "val");
          break;
      }
    return i;
  }
  parseSdt(e, n) {
    const r = L.element(e, "sdtContent");
    return r ? n(r) : [];
  }
  parseChange(e, n, r) {
    return {
      type: e,
      children: r(n)?.children ?? [],
      id: L.attr(n, "id"),
      author: L.attr(n, "author"),
      date: L.attr(n, "date")
    };
  }
  parseAltChunk(e) {
    return { type: ee.AltChunk, children: [], id: L.attr(e, "id") };
  }
  parseParagraph(e) {
    var n = { type: ee.Paragraph, children: [] };
    for (let r of L.elements(e))
      switch (r.localName) {
        case "pPr":
          this.parseParagraphProperties(r, n);
          break;
        case "r":
          n.children.push(this.parseRun(r, n));
          break;
        case "hyperlink":
          n.children.push(this.parseHyperlink(r, n));
          break;
        case "smartTag":
          n.children.push(this.parseSmartTag(r, n));
          break;
        case "bookmarkStart":
          n.children.push(L0(r, L));
          break;
        case "bookmarkEnd":
          n.children.push(O0(r, L));
          break;
        case "commentRangeStart":
          n.children.push(new H0(L.attr(r, "id")));
          break;
        case "commentRangeEnd":
          n.children.push(new G0(L.attr(r, "id")));
          break;
        case "oMath":
        case "oMathPara":
          n.children.push(this.parseMathElement(r));
          break;
        case "sdt":
          n.children.push(...this.parseSdt(r, (i) => this.parseParagraph(i).children));
          break;
        case "ins":
          n.children.push(this.parseChange(ee.Inserted, r, (i) => this.parseParagraph(i)));
          break;
        case "del":
          n.children.push(this.parseChange(ee.Deleted, r, (i) => this.parseParagraph(i)));
          break;
      }
    return n;
  }
  parseParagraphProperties(e, n) {
    this.parseDefaultProperties(e, n.cssStyle = {}, null, (r) => {
      if ($g(r, n, L))
        return !0;
      switch (r.localName) {
        case "pStyle":
          n.styleName = L.attr(r, "val");
          break;
        case "cnfStyle":
          n.className = Ve.classNameOfCnfStyle(r);
          break;
        case "framePr":
          this.parseFrame(r, n);
          break;
        case "rPr":
          break;
        default:
          return !1;
      }
      return !0;
    });
  }
  parseFrame(e, n) {
    var r = L.attr(e, "dropCap");
    r == "drop" && (n.cssStyle.float = "left");
  }
  parseHyperlink(e, n) {
    var r = { type: ee.Hyperlink, parent: n, children: [] };
    r.anchor = L.attr(e, "anchor"), r.id = L.attr(e, "id");
    for (const i of L.elements(e))
      i.localName === "r" && r.children.push(this.parseRun(i, r));
    return r;
  }
  parseSmartTag(e, n) {
    var r = { type: ee.SmartTag, parent: n, children: [] }, i = L.attr(e, "uri"), s = L.attr(e, "element");
    i && (r.uri = i), s && (r.element = s);
    for (const a of L.elements(e))
      switch (a.localName) {
        case "r":
          r.children.push(this.parseRun(a, r));
          break;
        case "smartTag":
          r.children.push(this.parseSmartTag(a, r));
          break;
      }
    return r;
  }
  parseRun(e, n) {
    var r = { type: ee.Run, parent: n, children: [] };
    for (let i of L.elements(e))
      switch (i = this.checkAlternateContent(i), i.localName) {
        case "t":
          r.children.push({
            type: ee.Text,
            text: i.textContent
          });
          break;
        case "delText":
          r.children.push({
            type: ee.DeletedText,
            text: i.textContent
          });
          break;
        case "commentReference":
          r.children.push(new q0(L.attr(i, "id")));
          break;
        case "fldSimple":
          r.children.push({
            type: ee.SimpleField,
            instruction: L.attr(i, "instr"),
            lock: L.boolAttr(i, "lock", !1),
            dirty: L.boolAttr(i, "dirty", !1)
          });
          break;
        case "instrText":
          r.fieldRun = !0, r.children.push({
            type: ee.Instruction,
            text: i.textContent
          });
          break;
        case "fldChar":
          r.fieldRun = !0, r.children.push({
            type: ee.ComplexField,
            charType: L.attr(i, "fldCharType"),
            lock: L.boolAttr(i, "lock", !1),
            dirty: L.boolAttr(i, "dirty", !1)
          });
          break;
        case "noBreakHyphen":
          r.children.push({ type: ee.NoBreakHyphen });
          break;
        case "br":
          r.children.push({
            type: ee.Break,
            break: L.attr(i, "type") || "textWrapping"
          });
          break;
        case "lastRenderedPageBreak":
          r.children.push({
            type: ee.Break,
            break: "lastRenderedPageBreak"
          });
          break;
        case "sym":
          r.children.push({
            type: ee.Symbol,
            font: jc(L.attr(i, "font")),
            char: L.hexAttr(i, "char")
          });
          break;
        case "tab":
          r.children.push({ type: ee.Tab });
          break;
        case "footnoteReference":
          r.children.push({
            type: ee.FootnoteReference,
            id: L.attr(i, "id")
          });
          break;
        case "endnoteReference":
          r.children.push({
            type: ee.EndnoteReference,
            id: L.attr(i, "id")
          });
          break;
        case "drawing":
          let s = this.parseDrawing(i);
          s && r.children.push(s);
          break;
        case "pict":
          r.children.push(this.parseVmlPicture(i));
          break;
        case "rPr":
          this.parseRunProperties(i, r);
          break;
      }
    return r;
  }
  parseMathElement(e) {
    const n = `${e.localName}Pr`, r = { type: gf[e.localName], children: [] };
    for (const s of L.elements(e))
      if (gf[s.localName])
        r.children.push(this.parseMathElement(s));
      else if (s.localName == "r") {
        var i = this.parseRun(s);
        i.type = ee.MmlRun, r.children.push(i);
      } else s.localName == n && (r.props = this.parseMathProperies(s));
    return r;
  }
  parseMathProperies(e) {
    const n = {};
    for (const r of L.elements(e))
      switch (r.localName) {
        case "chr":
          n.char = L.attr(r, "val");
          break;
        case "vertJc":
          n.verticalJustification = L.attr(r, "val");
          break;
        case "pos":
          n.position = L.attr(r, "val");
          break;
        case "degHide":
          n.hideDegree = L.boolAttr(r, "val");
          break;
        case "begChr":
          n.beginChar = L.attr(r, "val");
          break;
        case "endChr":
          n.endChar = L.attr(r, "val");
          break;
      }
    return n;
  }
  parseRunProperties(e, n) {
    this.parseDefaultProperties(e, n.cssStyle = {}, null, (r) => {
      switch (r.localName) {
        case "rStyle":
          n.styleName = L.attr(r, "val");
          break;
        case "vertAlign":
          n.verticalAlign = Ve.valueOfVertAlign(r, !0);
          break;
        default:
          return !1;
      }
      return !0;
    });
  }
  parseVmlPicture(e) {
    const n = { type: ee.VmlPicture, children: [] };
    for (const r of L.elements(e)) {
      const i = Gg(r, this);
      i && n.children.push(i);
    }
    return n;
  }
  checkAlternateContent(e) {
    if (e.localName != "AlternateContent")
      return e;
    var n = L.element(e, "Choice");
    if (n) {
      var r = L.attr(n, "Requires"), i = e.lookupNamespaceURI(r);
      if (J0.includes(i))
        return n.firstElementChild;
    }
    return L.element(e, "Fallback")?.firstElementChild;
  }
  parseDrawing(e) {
    for (var n of L.elements(e))
      switch (n.localName) {
        case "inline":
        case "anchor":
          return this.parseDrawingWrapper(n);
      }
  }
  parseDrawingWrapper(e) {
    var n = { type: ee.Drawing, children: [], cssStyle: {} }, r = e.localName == "anchor";
    let i = null, s = L.boolAttr(e, "simplePos");
    L.boolAttr(e, "behindDoc");
    let a = { relative: "page", align: "left", offset: "0" }, l = { relative: "page", align: "top", offset: "0" };
    for (var d of L.elements(e))
      switch (d.localName) {
        case "simplePos":
          s && (a.offset = L.lengthAttr(d, "x", ot.Emu), l.offset = L.lengthAttr(d, "y", ot.Emu));
          break;
        case "extent":
          n.cssStyle.width = L.lengthAttr(d, "cx", ot.Emu), n.cssStyle.height = L.lengthAttr(d, "cy", ot.Emu);
          break;
        case "positionH":
        case "positionV":
          if (!s) {
            let p = d.localName == "positionH" ? a : l;
            var h = L.element(d, "align"), b = L.element(d, "posOffset");
            p.relative = L.attr(d, "relativeFrom") ?? p.relative, h && (p.align = h.textContent), b && (p.offset = Tg(b.textContent, ot.Emu));
          }
          break;
        case "wrapTopAndBottom":
          i = "wrapTopAndBottom";
          break;
        case "wrapNone":
          i = "wrapNone";
          break;
        case "graphic":
          var m = this.parseGraphic(d);
          m && n.children.push(m);
          break;
      }
    return i == "wrapTopAndBottom" ? (n.cssStyle.display = "block", a.align && (n.cssStyle["text-align"] = a.align, n.cssStyle.width = "100%")) : i == "wrapNone" ? (n.cssStyle.display = "block", n.cssStyle.position = "relative", n.cssStyle.width = "0px", n.cssStyle.height = "0px", a.offset && (n.cssStyle.left = a.offset), l.offset && (n.cssStyle.top = l.offset)) : r && (a.align == "left" || a.align == "right") && (n.cssStyle.float = a.align), n;
  }
  parseGraphic(e) {
    var n = L.element(e, "graphicData");
    for (let r of L.elements(n))
      if (r.localName === "pic")
        return this.parsePicture(r);
    return null;
  }
  parsePicture(e) {
    var n = { type: ee.Image, src: "", cssStyle: {} }, r = L.element(e, "blipFill"), i = L.element(r, "blip"), s = L.element(r, "srcRect");
    n.src = L.attr(i, "embed"), s && (n.srcRect = [
      L.intAttr(s, "l", 0) / 1e5,
      L.intAttr(s, "t", 0) / 1e5,
      L.intAttr(s, "r", 0) / 1e5,
      L.intAttr(s, "b", 0) / 1e5
    ]);
    var a = L.element(e, "spPr"), l = L.element(a, "xfrm");
    if (n.cssStyle.position = "relative", l) {
      n.rotation = L.intAttr(l, "rot", 0) / 6e4;
      for (var d of L.elements(l))
        switch (d.localName) {
          case "ext":
            n.cssStyle.width = L.lengthAttr(d, "cx", ot.Emu), n.cssStyle.height = L.lengthAttr(d, "cy", ot.Emu);
            break;
          case "off":
            n.cssStyle.left = L.lengthAttr(d, "x", ot.Emu), n.cssStyle.top = L.lengthAttr(d, "y", ot.Emu);
            break;
        }
    }
    return n;
  }
  parseTable(e) {
    var n = { type: ee.Table, children: [] };
    for (const r of L.elements(e))
      switch (r.localName) {
        case "tr":
          n.children.push(this.parseTableRow(r));
          break;
        case "tblGrid":
          n.columns = this.parseTableColumns(r);
          break;
        case "tblPr":
          this.parseTableProperties(r, n);
          break;
      }
    return n;
  }
  parseTableColumns(e) {
    var n = [];
    for (const r of L.elements(e))
      r.localName === "gridCol" && n.push({ width: L.lengthAttr(r, "w") });
    return n;
  }
  parseTableProperties(e, n) {
    switch (n.cssStyle = {}, n.cellStyle = {}, this.parseDefaultProperties(e, n.cssStyle, n.cellStyle, (r) => {
      switch (r.localName) {
        case "tblStyle":
          n.styleName = L.attr(r, "val");
          break;
        case "tblLook":
          n.className = Ve.classNameOftblLook(r);
          break;
        case "tblpPr":
          this.parseTablePosition(r, n);
          break;
        case "tblStyleColBandSize":
          n.colBandSize = L.intAttr(r, "val");
          break;
        case "tblStyleRowBandSize":
          n.rowBandSize = L.intAttr(r, "val");
          break;
        case "hidden":
          n.cssStyle.display = "none";
          break;
        default:
          return !1;
      }
      return !0;
    }), n.cssStyle["text-align"]) {
      case "center":
        delete n.cssStyle["text-align"], n.cssStyle["margin-left"] = "auto", n.cssStyle["margin-right"] = "auto";
        break;
      case "right":
        delete n.cssStyle["text-align"], n.cssStyle["margin-left"] = "auto";
        break;
    }
  }
  parseTablePosition(e, n) {
    var r = L.lengthAttr(e, "topFromText"), i = L.lengthAttr(e, "bottomFromText"), s = L.lengthAttr(e, "rightFromText"), a = L.lengthAttr(e, "leftFromText");
    n.cssStyle.float = "left", n.cssStyle["margin-bottom"] = Ve.addSize(n.cssStyle["margin-bottom"], i), n.cssStyle["margin-left"] = Ve.addSize(n.cssStyle["margin-left"], a), n.cssStyle["margin-right"] = Ve.addSize(n.cssStyle["margin-right"], s), n.cssStyle["margin-top"] = Ve.addSize(n.cssStyle["margin-top"], r);
  }
  parseTableRow(e) {
    var n = { type: ee.Row, children: [] };
    for (const r of L.elements(e))
      switch (r.localName) {
        case "tc":
          n.children.push(this.parseTableCell(r));
          break;
        case "trPr":
        case "tblPrEx":
          this.parseTableRowProperties(r, n);
          break;
      }
    return n;
  }
  parseTableRowProperties(e, n) {
    n.cssStyle = this.parseDefaultProperties(e, {}, null, (r) => {
      switch (r.localName) {
        case "cnfStyle":
          n.className = Ve.classNameOfCnfStyle(r);
          break;
        case "tblHeader":
          n.isHeader = L.boolAttr(r, "val");
          break;
        case "gridBefore":
          n.gridBefore = L.intAttr(r, "val");
          break;
        case "gridAfter":
          n.gridAfter = L.intAttr(r, "val");
          break;
        default:
          return !1;
      }
      return !0;
    });
  }
  parseTableCell(e) {
    var n = { type: ee.Cell, children: [] };
    for (const r of L.elements(e))
      switch (r.localName) {
        case "tbl":
          n.children.push(this.parseTable(r));
          break;
        case "p":
          n.children.push(this.parseParagraph(r));
          break;
        case "tcPr":
          this.parseTableCellProperties(r, n);
          break;
      }
    return n;
  }
  parseTableCellProperties(e, n) {
    n.cssStyle = this.parseDefaultProperties(e, {}, null, (r) => {
      switch (r.localName) {
        case "gridSpan":
          n.span = L.intAttr(r, "val", null);
          break;
        case "vMerge":
          n.verticalMerge = L.attr(r, "val") ?? "continue";
          break;
        case "cnfStyle":
          n.className = Ve.classNameOfCnfStyle(r);
          break;
        default:
          return !1;
      }
      return !0;
    }), this.parseTableCellVerticalText(e, n);
  }
  parseTableCellVerticalText(e, n) {
    const r = {
      btLr: {
        writingMode: "vertical-rl",
        transform: "rotate(180deg)"
      },
      lrTb: {
        writingMode: "vertical-lr",
        transform: "none"
      },
      tbRl: {
        writingMode: "vertical-rl",
        transform: "none"
      }
    };
    for (const i of L.elements(e))
      if (i.localName === "textDirection") {
        const s = L.attr(i, "val"), a = r[s] || { writingMode: "horizontal-tb" };
        n.cssStyle["writing-mode"] = a.writingMode, n.cssStyle.transform = a.transform;
      }
  }
  parseDefaultProperties(e, n = null, r = null, i = null) {
    n = n || {};
    for (const s of L.elements(e))
      if (!i?.(s))
        switch (s.localName) {
          case "jc":
            n["text-align"] = Ve.valueOfJc(s);
            break;
          case "textAlignment":
            n["vertical-align"] = Ve.valueOfTextAlignment(s);
            break;
          case "color":
            n.color = ai.colorAttr(s, "val", null, Xa.color);
            break;
          case "sz":
            n["font-size"] = n["min-height"] = L.lengthAttr(s, "val", ot.FontSize);
            break;
          case "shd":
            n["background-color"] = ai.colorAttr(s, "fill", null, Xa.shd);
            break;
          case "highlight":
            n["background-color"] = ai.colorAttr(s, "val", null, Xa.highlight);
            break;
          case "vertAlign":
            break;
          case "position":
            n.verticalAlign = L.lengthAttr(s, "val", ot.FontSize);
            break;
          case "tcW":
            if (this.options.ignoreWidth)
              break;
          case "tblW":
            n.width = Ve.valueOfSize(s, "w");
            break;
          case "trHeight":
            this.parseTrHeight(s, n);
            break;
          case "strike":
            n["text-decoration"] = L.boolAttr(s, "val", !0) ? "line-through" : "none";
            break;
          case "b":
            n["font-weight"] = L.boolAttr(s, "val", !0) ? "bold" : "normal";
            break;
          case "i":
            n["font-style"] = L.boolAttr(s, "val", !0) ? "italic" : "normal";
            break;
          case "caps":
            n["text-transform"] = L.boolAttr(s, "val", !0) ? "uppercase" : "none";
            break;
          case "smallCaps":
            n["font-variant"] = L.boolAttr(s, "val", !0) ? "small-caps" : "none";
            break;
          case "u":
            this.parseUnderline(s, n);
            break;
          case "ind":
          case "tblInd":
            this.parseIndentation(s, n);
            break;
          case "rFonts":
            this.parseFont(s, n);
            break;
          case "tblBorders":
            this.parseBorderProperties(s, r || n);
            break;
          case "tblCellSpacing":
            n["border-spacing"] = Ve.valueOfMargin(s), n["border-collapse"] = "separate";
            break;
          case "pBdr":
            this.parseBorderProperties(s, n);
            break;
          case "bdr":
            n.border = Ve.valueOfBorder(s);
            break;
          case "tcBorders":
            this.parseBorderProperties(s, n);
            break;
          case "vanish":
            L.boolAttr(s, "val", !0) && (n.display = "none");
            break;
          case "kern":
            break;
          case "noWrap":
            break;
          case "tblCellMar":
          case "tcMar":
            this.parseMarginProperties(s, r || n);
            break;
          case "tblLayout":
            n["table-layout"] = Ve.valueOfTblLayout(s);
            break;
          case "vAlign":
            n["vertical-align"] = Ve.valueOfTextAlignment(s);
            break;
          case "spacing":
            e.localName == "pPr" && this.parseSpacing(s, n);
            break;
          case "wordWrap":
            L.boolAttr(s, "val") && (n["overflow-wrap"] = "break-word");
            break;
          case "suppressAutoHyphens":
            n.hyphens = L.boolAttr(s, "val", !0) ? "none" : "auto";
            break;
          case "lang":
            n.$lang = L.attr(s, "val");
            break;
          case "rtl":
          case "bidi":
            L.boolAttr(s, "val", !0) && (n.direction = "rtl");
            break;
          case "bCs":
          case "iCs":
          case "szCs":
          case "tabs":
          case "outlineLvl":
          case "contextualSpacing":
          case "tblStyleColBandSize":
          case "tblStyleRowBandSize":
          case "webHidden":
          case "pageBreakBefore":
          case "suppressLineNumbers":
          case "keepLines":
          case "keepNext":
          case "widowControl":
          case "noProof":
            break;
          default:
            this.options.debug && console.warn(`DOCX: Unknown document element: ${e.localName}.${s.localName}`);
            break;
        }
    return n;
  }
  parseUnderline(e, n) {
    var r = L.attr(e, "val");
    if (r != null) {
      switch (r) {
        case "dash":
        case "dashDotDotHeavy":
        case "dashDotHeavy":
        case "dashedHeavy":
        case "dashLong":
        case "dashLongHeavy":
        case "dotDash":
        case "dotDotDash":
          n["text-decoration"] = "underline dashed";
          break;
        case "dotted":
        case "dottedHeavy":
          n["text-decoration"] = "underline dotted";
          break;
        case "double":
          n["text-decoration"] = "underline double";
          break;
        case "single":
        case "thick":
          n["text-decoration"] = "underline";
          break;
        case "wave":
        case "wavyDouble":
        case "wavyHeavy":
          n["text-decoration"] = "underline wavy";
          break;
        case "words":
          n["text-decoration"] = "underline";
          break;
        case "none":
          n["text-decoration"] = "none";
          break;
      }
      var i = ai.colorAttr(e, "color");
      i && (n["text-decoration-color"] = i);
    }
  }
  parseFont(e, n) {
    var r = L.attr(e, "ascii"), i = Ve.themeValue(e, "asciiTheme"), s = L.attr(e, "eastAsia"), a = [r, i, s].filter((l) => l).map((l) => jc(l));
    a.length > 0 && (n["font-family"] = [...new Set(a)].join(", "));
  }
  parseIndentation(e, n) {
    var r = L.lengthAttr(e, "firstLine"), i = L.lengthAttr(e, "hanging"), s = L.lengthAttr(e, "left"), a = L.lengthAttr(e, "start"), l = L.lengthAttr(e, "right"), d = L.lengthAttr(e, "end");
    r && (n["text-indent"] = r), i && (n["text-indent"] = `-${i}`), (s || a) && (n["margin-inline-start"] = s || a), (l || d) && (n["margin-inline-end"] = l || d);
  }
  parseSpacing(e, n) {
    var r = L.lengthAttr(e, "before"), i = L.lengthAttr(e, "after"), s = L.intAttr(e, "line", null), a = L.attr(e, "lineRule");
    if (r && (n["margin-top"] = r), i && (n["margin-bottom"] = i), s !== null)
      switch (a) {
        case "auto":
          n["line-height"] = `${(s / 240).toFixed(2)}`;
          break;
        case "atLeast":
          n["line-height"] = `calc(100% + ${s / 20}pt)`;
          break;
        default:
          n["line-height"] = n["min-height"] = `${s / 20}pt`;
          break;
      }
  }
  parseMarginProperties(e, n) {
    for (const r of L.elements(e))
      switch (r.localName) {
        case "left":
          n["padding-left"] = Ve.valueOfMargin(r);
          break;
        case "right":
          n["padding-right"] = Ve.valueOfMargin(r);
          break;
        case "top":
          n["padding-top"] = Ve.valueOfMargin(r);
          break;
        case "bottom":
          n["padding-bottom"] = Ve.valueOfMargin(r);
          break;
      }
  }
  parseTrHeight(e, n) {
    L.attr(e, "hRule"), n.height = L.lengthAttr(e, "val");
  }
  parseBorderProperties(e, n) {
    for (const r of L.elements(e))
      switch (r.localName) {
        case "start":
        case "left":
          n["border-left"] = Ve.valueOfBorder(r);
          break;
        case "end":
        case "right":
          n["border-right"] = Ve.valueOfBorder(r);
          break;
        case "top":
          n["border-top"] = Ve.valueOfBorder(r);
          break;
        case "bottom":
          n["border-bottom"] = Ve.valueOfBorder(r);
          break;
      }
  }
}
const K0 = ["black", "blue", "cyan", "darkBlue", "darkCyan", "darkGray", "darkGreen", "darkMagenta", "darkRed", "darkYellow", "green", "lightGray", "magenta", "none", "red", "white", "yellow"];
class ai {
  static colorAttr(e, n, r = null, i = "black") {
    var s = L.attr(e, n);
    if (s)
      return s == "auto" ? i : K0.includes(s) ? s : `#${s}`;
    var a = L.attr(e, "themeColor");
    return a ? `var(--docx-${a}-color)` : r;
  }
}
class Ve {
  static themeValue(e, n) {
    var r = L.attr(e, n);
    return r ? `var(--docx-${r}-font)` : null;
  }
  static valueOfSize(e, n) {
    var r = ot.Dxa;
    switch (L.attr(e, "type")) {
      case "dxa":
        break;
      case "pct":
        r = ot.Percent;
        break;
      case "auto":
        return "auto";
    }
    return L.lengthAttr(e, n, r);
  }
  static valueOfMargin(e) {
    return L.lengthAttr(e, "w");
  }
  static valueOfBorder(e) {
    var n = Ve.parseBorderType(L.attr(e, "val"));
    if (n == "none")
      return "none";
    var r = ai.colorAttr(e, "color"), i = L.lengthAttr(e, "sz", ot.Border);
    return `${i} ${n} ${r == "auto" ? Xa.borderColor : r}`;
  }
  static parseBorderType(e) {
    switch (e) {
      case "single":
        return "solid";
      case "dashDotStroked":
        return "solid";
      case "dashed":
        return "dashed";
      case "dashSmallGap":
        return "dashed";
      case "dotDash":
        return "dotted";
      case "dotDotDash":
        return "dotted";
      case "dotted":
        return "dotted";
      case "double":
        return "double";
      case "doubleWave":
        return "double";
      case "inset":
        return "inset";
      case "nil":
        return "none";
      case "none":
        return "none";
      case "outset":
        return "outset";
      case "thick":
        return "solid";
      case "thickThinLargeGap":
        return "solid";
      case "thickThinMediumGap":
        return "solid";
      case "thickThinSmallGap":
        return "solid";
      case "thinThickLargeGap":
        return "solid";
      case "thinThickMediumGap":
        return "solid";
      case "thinThickSmallGap":
        return "solid";
      case "thinThickThinLargeGap":
        return "solid";
      case "thinThickThinMediumGap":
        return "solid";
      case "thinThickThinSmallGap":
        return "solid";
      case "threeDEmboss":
        return "solid";
      case "threeDEngrave":
        return "solid";
      case "triple":
        return "double";
      case "wave":
        return "solid";
    }
    return "solid";
  }
  static valueOfTblLayout(e) {
    var n = L.attr(e, "val");
    return n == "fixed" ? "fixed" : "auto";
  }
  static classNameOfCnfStyle(e) {
    const n = L.attr(e, "val"), r = [
      "first-row",
      "last-row",
      "first-col",
      "last-col",
      "odd-col",
      "even-col",
      "odd-row",
      "even-row",
      "ne-cell",
      "nw-cell",
      "se-cell",
      "sw-cell"
    ];
    if (n)
      return r.filter((s, a) => n[a] == "1").join(" ");
    const i = [
      "firstRow",
      "lastRow",
      "firstColumn",
      "lastColumn",
      "oddVBand",
      "evenVBand",
      "oddHBand",
      "evenHBand",
      "firstRowLastColumn",
      "firstRowFirstColumn",
      "lastRowLastColumn",
      "lastRowFirstColumn"
    ];
    return r.filter((s, a) => L.boolAttr(e, i[a])).join(" ");
  }
  static valueOfJc(e) {
    var n = L.attr(e, "val");
    switch (n) {
      case "start":
      case "left":
        return "left";
      case "center":
        return "center";
      case "end":
      case "right":
        return "right";
      case "both":
        return "justify";
    }
    return n;
  }
  static valueOfVertAlign(e, n = !1) {
    var r = L.attr(e, "val");
    switch (r) {
      case "subscript":
        return "sub";
      case "superscript":
        return n ? "sup" : "super";
    }
    return n ? null : r;
  }
  static valueOfTextAlignment(e) {
    var n = L.attr(e, "val");
    switch (n) {
      case "auto":
      case "baseline":
        return "baseline";
      case "top":
        return "top";
      case "center":
        return "middle";
      case "bottom":
        return "bottom";
    }
    return n;
  }
  static addSize(e, n) {
    return e == null ? n : n == null ? e : `calc(${e} + ${n})`;
  }
  static classNameOftblLook(e) {
    const n = L.hexAttr(e, "val", 0);
    let r = "";
    return (L.boolAttr(e, "firstRow") || n & 32) && (r += " first-row"), (L.boolAttr(e, "lastRow") || n & 64) && (r += " last-row"), (L.boolAttr(e, "firstColumn") || n & 128) && (r += " first-col"), (L.boolAttr(e, "lastColumn") || n & 256) && (r += " last-col"), (L.boolAttr(e, "noHBand") || n & 512) && (r += " no-hband"), (L.boolAttr(e, "noVBand") || n & 1024) && (r += " no-vband"), r.trim();
  }
}
const mf = { pos: 0, leader: "none", style: "left" }, W0 = 50;
function X0(t = document.body) {
  const e = document.createElement("div");
  e.style.width = "100pt", t.appendChild(e);
  const n = 100 / e.offsetWidth;
  return t.removeChild(e), n;
}
function Z0(t, e, n, r = 72 / 96) {
  const i = t.closest("p"), s = t.getBoundingClientRect(), a = i.getBoundingClientRect(), l = getComputedStyle(i), d = e?.length > 0 ? e.map((S) => ({
    pos: bf(S.position),
    leader: S.leader,
    style: S.style
  })).sort((S, x) => S.pos - x.pos) : [mf], h = d[d.length - 1], b = a.width * r, m = bf(n);
  let p = h.pos + m;
  if (p < b)
    for (; p < b && d.length < W0; p += m)
      d.push({ ...mf, pos: p });
  const g = parseFloat(l.marginLeft), _ = a.left + g, k = (s.left - _) * r, y = d.find((S) => S.style != "clear" && S.pos > k);
  if (y == null)
    return;
  let C = 1;
  if (y.style == "right" || y.style == "center") {
    const S = Array.from(i.querySelectorAll(`.${t.className}`)), x = S.indexOf(t) + 1, z = document.createRange();
    z.setStart(t, 1), x < S.length ? z.setEndBefore(S[x]) : z.setEndAfter(i);
    const N = y.style == "center" ? 0.5 : 1, R = z.getBoundingClientRect(), B = R.left + N * R.width - (a.left - g);
    C = y.pos - B * r;
  } else
    C = y.pos - k;
  switch (t.innerHTML = "&nbsp;", t.style.textDecoration = "inherit", t.style.wordSpacing = `${C.toFixed(0)}pt`, y.leader) {
    case "dot":
    case "middleDot":
      t.style.textDecoration = "underline", t.style.textDecorationStyle = "dotted";
      break;
    case "hyphen":
    case "heavy":
    case "underscore":
      t.style.textDecoration = "underline";
      break;
  }
}
function bf(t) {
  return parseFloat(t);
}
var He;
(function(t) {
  t.html = "http://www.w3.org/1999/xhtml", t.svg = "http://www.w3.org/2000/svg", t.mathML = "http://www.w3.org/1998/Math/MathML";
})(He || (He = {}));
function Co(t) {
  if (qc(t))
    return document.createTextNode(t);
  if (t instanceof Node)
    return t;
  const { ns: e, tagName: n, className: r, style: i, children: s, ...a } = t;
  if (n === "#fragment")
    return document.createDocumentFragment();
  if (n === "#comment")
    return document.createComment(s[0]);
  const l = e ? document.createElementNS(e, n) : document.createElement(n);
  if (r && l.setAttribute("class", r), i && (qc(i) ? l.setAttribute("style", i) : Object.assign(l.style, i)), a)
    for (const [d, h] of Object.entries(a))
      h !== void 0 && (l[d] = h);
  return s && s.forEach((d) => l.appendChild(Co(d))), l;
}
function Y0(...t) {
  return t.filter(Boolean).join(" ");
}
class e1 {
  constructor() {
    this.className = "docx", this.styleMap = {}, this.currentPart = null, this.tableVerticalMerges = [], this.currentVerticalMerge = null, this.tableCellPositions = [], this.currentCellPosition = null, this.footnoteMap = {}, this.endnoteMap = {}, this.currentEndnoteIds = [], this.usedHederFooterParts = [], this.currentTabs = [], this.commentMap = {}, this.tasks = [], this.postRenderTasks = [], this.h = Co;
  }
  async render(e, n) {
    this.document = e, this.options = n, this.className = n.className, this.rootSelector = n.inWrapper ? `.${this.className}-wrapper` : ":root", this.h = n.h ?? Co, this.styleMap = null, this.tasks = [], this.options.renderComments && globalThis.Highlight && (this.commentHighlight = new Highlight());
    const r = [...this.renderDefaultStyle()];
    e.themePart && r.push(...this.renderTheme(e.themePart)), e.stylesPart != null && (this.styleMap = this.processStyles(e.stylesPart.styles), r.push(...this.renderStyles(e.stylesPart.styles))), e.numberingPart && (this.prodessNumberings(e.numberingPart.domNumberings), r.push(...await this.renderNumbering(e.numberingPart.domNumberings))), e.footnotesPart && (this.footnoteMap = dr(e.footnotesPart.notes, (s) => s.id)), e.endnotesPart && (this.endnoteMap = dr(e.endnotesPart.notes, (s) => s.id)), e.settingsPart && (this.defaultTabSize = e.settingsPart.settings?.defaultTabStop), !n.ignoreFonts && e.fontTablePart && r.push(...await this.renderFontTable(e.fontTablePart));
    var i = this.renderSections(e.documentPart.body);
    return this.options.inWrapper ? r.push(this.renderWrapper(i)) : r.push(...i), this.commentHighlight && n.renderComments && CSS.highlights.set(`${this.className}-comments`, this.commentHighlight), this.postRenderTasks.forEach((s) => s()), await Promise.allSettled(this.tasks), this.refreshTabStops(), r;
  }
  renderTheme(e) {
    const n = {}, r = e.theme?.fontScheme;
    r && (r.majorFont && (n["--docx-majorHAnsi-font"] = r.majorFont.latinTypeface), r.minorFont && (n["--docx-minorHAnsi-font"] = r.minorFont.latinTypeface));
    const i = e.theme?.colorScheme;
    if (i)
      for (let [a, l] of Object.entries(i.colors))
        n[`--docx-${a}-color`] = `#${l}`;
    const s = this.styleToString(`.${this.className}`, n);
    return [
      this.h({ tagName: "#comment", children: ["docxjs document theme values"] }),
      this.h({ tagName: "style", children: [s] })
    ];
  }
  async renderFontTable(e) {
    const n = [];
    for (let r of e.fonts)
      for (let i of r.embedFontRefs)
        try {
          const s = await this.document.loadFont(i.id, i.key), a = {
            "font-family": jc(r.name),
            src: `url(${s})`
          };
          (i.type == "bold" || i.type == "boldItalic") && (a["font-weight"] = "bold"), (i.type == "italic" || i.type == "boldItalic") && (a["font-style"] = "italic"), n.push(this.h({ tagName: "#comment", children: [`docxjs ${r.name} font`] })), n.push(this.h({ tagName: "style", children: [this.styleToString("@font-face", a)] }));
        } catch {
          this.options.debug && console.warn(`Can't load font with id ${i.id} and key ${i.key}`);
        }
    return n;
  }
  processStyleName(e) {
    return e ? `${this.className}_${FA(e)}` : this.className;
  }
  processStyles(e) {
    const n = dr(e.filter((i) => i.id != null), (i) => i.id);
    for (const i of e.filter((s) => s.basedOn)) {
      var r = n[i.basedOn];
      if (r) {
        i.paragraphProps = Ao(i.paragraphProps, r.paragraphProps), i.runProps = Ao(i.runProps, r.runProps);
        for (const s of r.styles) {
          const a = i.styles.find((l) => l.target == s.target);
          a ? this.copyStyleProperties(s.values, a.values) : i.styles.push({ ...s, values: { ...s.values } });
        }
      } else this.options.debug && console.warn(`Can't find base style ${i.basedOn}`);
    }
    for (let i of e)
      i.cssName = this.processStyleName(i.id);
    return n;
  }
  prodessNumberings(e) {
    for (let n of e.filter((r) => r.pStyleName)) {
      const r = this.findStyle(n.pStyleName);
      r?.paragraphProps?.numbering && (r.paragraphProps.numbering.level = n.level);
    }
  }
  processElement(e) {
    if (e.children)
      for (var n of e.children)
        n.parent = e, n.type == ee.Table ? this.processTable(n) : this.processElement(n);
  }
  processTable(e) {
    for (var n of e.children)
      for (var r of n.children)
        r.cssStyle = this.copyStyleProperties(e.cellStyle, r.cssStyle, [
          "border-left",
          "border-right",
          "border-top",
          "border-bottom",
          "padding-left",
          "padding-right",
          "padding-top",
          "padding-bottom"
        ]), this.processElement(r);
  }
  copyStyleProperties(e, n, r = null) {
    if (!e)
      return n;
    n == null && (n = {}), r == null && (r = Object.getOwnPropertyNames(e));
    for (var i of r)
      e.hasOwnProperty(i) && !n.hasOwnProperty(i) && (n[i] = e[i]);
    return n;
  }
  createPageElement(e, n, r) {
    const i = { ...r };
    return n && (n.pageMargins && (i.paddingLeft = n.pageMargins.left, i.paddingRight = n.pageMargins.right, i.paddingTop = n.pageMargins.top, i.paddingBottom = n.pageMargins.bottom), n.pageSize && (this.options.ignoreWidth || (i.width = n.pageSize.width), this.options.ignoreHeight || (i.minHeight = n.pageSize.height))), this.h({ tagName: "section", className: e, style: i });
  }
  createSectionContent(e) {
    const n = {};
    return e.columns && e.columns.numberOfColumns && (n.columnCount = `${e.columns.numberOfColumns}`, n.columnGap = e.columns.space, e.columns.separator && (n.columnRule = "1px solid black")), this.h({ tagName: "article", style: n });
  }
  renderSections(e) {
    const n = [];
    this.processElement(e);
    const r = this.splitBySection(e.children, e.props), i = this.groupByPageBreaks(r);
    let s = null;
    for (let l = 0, d = i.length; l < d; l++) {
      this.currentFootnoteIds = [];
      let b = i[l][0].sectProps;
      const m = this.createPageElement(this.className, b, e.cssStyle);
      this.options.renderHeaders && this.renderHeaderFooter(b.headerRefs, b, n.length, s != b, m);
      for (const p of i[l]) {
        var a = this.createSectionContent(p.sectProps);
        this.renderElements(p.elements, a), m.appendChild(a), b = p.sectProps;
      }
      if (this.options.renderFootnotes) {
        const p = this.renderNotes(this.currentFootnoteIds, this.footnoteMap);
        p && m.appendChild(p);
      }
      if (this.options.renderEndnotes && l == d - 1) {
        const p = this.renderNotes(this.currentEndnoteIds, this.endnoteMap);
        p && m.appendChild(p);
      }
      this.options.renderFooters && this.renderHeaderFooter(b.footerRefs, b, n.length, s != b, m), n.push(m), s = b;
    }
    return n;
  }
  renderHeaderFooter(e, n, r, i, s) {
    if (e) {
      var a = (n.titlePage && i ? e.find((d) => d.type == "first") : null) ?? (r % 2 == 1 ? e.find((d) => d.type == "even") : null) ?? e.find((d) => d.type == "default"), l = a && this.document.findPartByRelId(a.id, this.document.documentPart);
      if (l) {
        this.currentPart = l, this.usedHederFooterParts.includes(l.path) || (this.processElement(l.rootElement), this.usedHederFooterParts.push(l.path));
        const [d] = this.renderElements([l.rootElement], s);
        n?.pageMargins && (l.rootElement.type === ee.Header ? (d.style.marginTop = `calc(${n.pageMargins.header} - ${n.pageMargins.top})`, d.style.minHeight = `calc(${n.pageMargins.top} - ${n.pageMargins.header})`) : l.rootElement.type === ee.Footer && (d.style.marginBottom = `calc(${n.pageMargins.footer} - ${n.pageMargins.bottom})`, d.style.minHeight = `calc(${n.pageMargins.bottom} - ${n.pageMargins.footer})`)), this.currentPart = null;
      }
    }
  }
  isPageBreakElement(e) {
    return e.type != ee.Break ? !1 : e.break == "lastRenderedPageBreak" ? !this.options.ignoreLastRenderedPageBreak : e.break == "page";
  }
  isPageBreakSection(e, n) {
    return !e || !n ? !1 : e.pageSize?.orientation != n.pageSize?.orientation || e.pageSize?.width != n.pageSize?.width || e.pageSize?.height != n.pageSize?.height;
  }
  splitBySection(e, n) {
    var r = { sectProps: null, elements: [], pageBreak: !1 }, i = [r];
    for (let m of e)
      if (m.type == ee.Paragraph && this.findStyle(m.styleName)?.paragraphProps?.pageBreakBefore && (r.sectProps = s, r.pageBreak = !0, r = { sectProps: null, elements: [], pageBreak: !1 }, i.push(r)), r.elements.push(m), m.type == ee.Paragraph) {
        const p = m;
        var s = p.sectionProps, a = -1, l = -1;
        if (this.options.breakPages && p.children && (a = p.children.findIndex((g) => (l = g.children?.findIndex(this.isPageBreakElement.bind(this)) ?? -1, l != -1))), (s || a != -1) && (r.sectProps = s, r.pageBreak = a != -1, r = { sectProps: null, elements: [], pageBreak: !1 }, i.push(r)), a != -1) {
          let g = p.children[a], _ = l < g.children.length - 1;
          if (a < p.children.length - 1 || _) {
            var d = m.children, h = { ...m, children: d.slice(a) };
            if (m.children = d.slice(0, a), r.elements.push(h), _) {
              let k = g.children, y = { ...g, children: k.slice(0, l) };
              m.children.push(y), g.children = k.slice(l);
            }
          }
        }
      }
    let b = null;
    for (let m = i.length - 1; m >= 0; m--)
      i[m].sectProps == null ? i[m].sectProps = b ?? n : b = i[m].sectProps;
    return i;
  }
  groupByPageBreaks(e) {
    let n = [], r;
    const i = [n];
    for (let s of e)
      n.push(s), (this.options.ignoreLastRenderedPageBreak || s.pageBreak || this.isPageBreakSection(r, s.sectProps)) && i.push(n = []), r = s.sectProps;
    return i.filter((s) => s.length > 0);
  }
  renderWrapper(e) {
    return this.h({ tagName: "div", className: `${this.className}-wrapper`, children: e });
  }
  renderDefaultStyle() {
    var e = this.className, n = `
.${e}-wrapper { background: gray; padding: 30px; padding-bottom: 0px; display: flex; flex-flow: column; align-items: center; } 
.${e}-wrapper>section.${e} { background: white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); margin-bottom: 30px; }`;
    this.options.hideWrapperOnPrint && (n = `@media not print { ${n} }`);
    var r = `${n}
.${e} { color: black; hyphens: auto; text-underline-position: from-font; }
section.${e} { box-sizing: border-box; display: flex; flex-flow: column nowrap; position: relative; overflow: hidden; }
section.${e}>article { margin-bottom: auto; z-index: 1; }
section.${e}>footer { z-index: 1; }
.${e} table { border-collapse: collapse; }
.${e} table td, .${e} table th { vertical-align: top; }
.${e} p { margin: 0pt; min-height: 1em; }
.${e} span { white-space: pre-wrap; overflow-wrap: break-word; }
.${e} a { color: inherit; text-decoration: inherit; }
.${e} svg { fill: transparent; }
`;
    return this.options.renderComments && (r += `
.${e}-comment-ref { cursor: default; }
.${e}-comment-popover { display: none; z-index: 1000; padding: 0.5rem; background: white; position: absolute; box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.25); width: 30ch; }
.${e}-comment-ref:hover~.${e}-comment-popover { display: block; }
.${e}-comment-author,.${e}-comment-date { font-size: 0.875rem; color: #888; }
`), [
      this.h({ tagName: "#comment", children: ["docxjs library predefined styles"] }),
      this.h({ tagName: "style", children: [r] })
    ];
  }
  async renderNumbering(e) {
    var n = "", r = [];
    for (var i of e) {
      var s = `p.${this.numberingClass(i.id, i.level)}`, a = "none";
      if (i.bullet) {
        let l = `--${this.className}-${i.bullet.src}`.toLowerCase();
        n += this.styleToString(`${s}:before`, {
          content: "' '",
          display: "inline-block",
          background: `var(${l})`
        }, i.bullet.style);
        try {
          const d = await this.document.loadNumberingImage(i.bullet.src);
          n += `${this.rootSelector} { ${l}: url(${d}) }`;
        } catch {
          this.options.debug && console.warn(`Can't load numbering image with src ${i.bullet.src}`);
        }
      } else if (i.levelText) {
        let l = this.numberingCounter(i.id, i.level);
        const d = l + " " + (i.start - 1);
        i.level > 0 && (n += this.styleToString(`p.${this.numberingClass(i.id, i.level - 1)}`, {
          "counter-set": d
        })), r.push(d), n += this.styleToString(`${s}:before`, {
          content: this.levelTextToContent(i.levelText, i.suff, i.id, this.numFormatToCssValue(i.format)),
          "counter-increment": l,
          ...i.rStyle
        });
      } else
        a = this.numFormatToCssValue(i.format);
      n += this.styleToString(s, {
        display: "list-item",
        "list-style-position": "inside",
        "list-style-type": a,
        ...i.pStyle
      });
    }
    return r.length > 0 && (n += this.styleToString(this.rootSelector, {
      "counter-reset": r.join(" ")
    })), [
      this.h({ tagName: "#comment", children: ["docxjs document numbering styles"] }),
      this.h({ tagName: "style", children: [n] })
    ];
  }
  renderStyles(e) {
    var n = "";
    const r = this.styleMap, i = dr(e.filter((d) => d.isDefault), (d) => d.target);
    for (const d of e) {
      var s = d.styles;
      if (d.linked) {
        var a = d.linked && r[d.linked];
        a ? s = s.concat(a.styles) : this.options.debug && console.warn(`Can't find linked style ${d.linked}`);
      }
      for (const h of s) {
        var l = `${d.target ?? ""}.${d.cssName}`;
        d.target != h.target && (l += ` ${h.target}`), i[d.target] == d && (l = `.${this.className} ${d.target}, ` + l), n += this.styleToString(l, h.values);
      }
    }
    return [
      this.h({ tagName: "#comment", children: ["docxjs document styles"] }),
      this.h({ tagName: "style", children: [n] })
    ];
  }
  renderNotes(e, n) {
    var r = e.map((i) => n[i]).filter((i) => i);
    if (r.length > 0)
      return this.h({ tagName: "ol", children: this.renderElements(r) });
  }
  renderElement(e) {
    switch (e.type) {
      case ee.Paragraph:
        return this.renderParagraph(e);
      case ee.BookmarkStart:
        return this.renderBookmarkStart(e);
      case ee.BookmarkEnd:
        return null;
      case ee.Run:
        return this.renderRun(e);
      case ee.Table:
        return this.renderTable(e);
      case ee.Row:
        return this.renderTableRow(e);
      case ee.Cell:
        return this.renderTableCell(e);
      case ee.Hyperlink:
        return this.renderHyperlink(e);
      case ee.SmartTag:
        return this.renderSmartTag(e);
      case ee.Drawing:
        return this.renderDrawing(e);
      case ee.Image:
        return this.renderImage(e);
      case ee.Text:
        return this.renderText(e);
      case ee.Text:
        return this.renderText(e);
      case ee.DeletedText:
        return this.renderDeletedText(e);
      case ee.Tab:
        return this.renderTab(e);
      case ee.Symbol:
        return this.renderSymbol(e);
      case ee.Break:
        return this.renderBreak(e);
      case ee.Footer:
        return this.renderContainer(e, "footer");
      case ee.Header:
        return this.renderContainer(e, "header");
      case ee.Footnote:
      case ee.Endnote:
        return this.renderContainer(e, "li");
      case ee.FootnoteReference:
        return this.renderFootnoteReference(e);
      case ee.EndnoteReference:
        return this.renderEndnoteReference(e);
      case ee.NoBreakHyphen:
        return this.h({ tagName: "wbr" });
      case ee.VmlPicture:
        return this.renderVmlPicture(e);
      case ee.VmlElement:
        return this.renderVmlElement(e);
      case ee.MmlMath:
        return this.renderContainerNS(e, He.mathML, "math", { xmlns: He.mathML });
      case ee.MmlMathParagraph:
        return this.renderContainer(e, "span");
      case ee.MmlFraction:
        return this.renderContainerNS(e, He.mathML, "mfrac");
      case ee.MmlBase:
        return this.renderContainerNS(e, He.mathML, e.parent.type == ee.MmlMatrixRow ? "mtd" : "mrow");
      case ee.MmlNumerator:
      case ee.MmlDenominator:
      case ee.MmlFunction:
      case ee.MmlLimit:
      case ee.MmlBox:
        return this.renderContainerNS(e, He.mathML, "mrow");
      case ee.MmlGroupChar:
        return this.renderMmlGroupChar(e);
      case ee.MmlLimitLower:
        return this.renderContainerNS(e, He.mathML, "munder");
      case ee.MmlMatrix:
        return this.renderContainerNS(e, He.mathML, "mtable");
      case ee.MmlMatrixRow:
        return this.renderContainerNS(e, He.mathML, "mtr");
      case ee.MmlRadical:
        return this.renderMmlRadical(e);
      case ee.MmlSuperscript:
        return this.renderContainerNS(e, He.mathML, "msup");
      case ee.MmlSubscript:
        return this.renderContainerNS(e, He.mathML, "msub");
      case ee.MmlDegree:
      case ee.MmlSuperArgument:
      case ee.MmlSubArgument:
        return this.renderContainerNS(e, He.mathML, "mn");
      case ee.MmlFunctionName:
        return this.renderContainerNS(e, He.mathML, "ms");
      case ee.MmlDelimiter:
        return this.renderMmlDelimiter(e);
      case ee.MmlRun:
        return this.renderMmlRun(e);
      case ee.MmlNary:
        return this.renderMmlNary(e);
      case ee.MmlPreSubSuper:
        return this.renderMmlPreSubSuper(e);
      case ee.MmlBar:
        return this.renderMmlBar(e);
      case ee.MmlEquationArray:
        return this.renderMllList(e);
      case ee.Inserted:
        return this.renderInserted(e);
      case ee.Deleted:
        return this.renderDeleted(e);
      case ee.CommentRangeStart:
        return this.renderCommentRangeStart(e);
      case ee.CommentRangeEnd:
        return this.renderCommentRangeEnd(e);
      case ee.CommentReference:
        return this.renderCommentReference(e);
      case ee.AltChunk:
        return this.renderAltChunk(e);
    }
    return null;
  }
  renderElements(e, n) {
    if (e == null)
      return null;
    var r = e.flatMap((i) => this.renderElement(i)).filter((i) => i != null);
    return n && r.forEach((i) => n.appendChild(qc(i) ? document.createTextNode(i) : i)), r;
  }
  renderContainer(e, n, r) {
    return this.h({ tagName: n, children: this.renderElements(e.children), ...r });
  }
  renderContainerNS(e, n, r, i) {
    return this.h({ ns: n, tagName: r, children: this.renderElements(e.children), ...i });
  }
  renderParagraph(e) {
    var n = this.toHTML(e, He.html, "p");
    const r = this.findStyle(e.styleName);
    e.tabs ?? (e.tabs = r?.paragraphProps?.tabs);
    const i = e.numbering ?? r?.paragraphProps?.numbering;
    return i && n.classList.add(this.numberingClass(i.id, i.level)), n;
  }
  renderHyperlink(e) {
    const n = this.toH(e, He.html, "a");
    if (n.href = "", e.id) {
      const r = this.document.documentPart.rels.find((i) => i.id == e.id && i.targetMode === "External");
      n.href = r?.target ?? n.href;
    }
    return e.anchor && (n.href += `#${e.anchor}`), this.h(n);
  }
  renderSmartTag(e) {
    return this.renderContainer(e, "span");
  }
  renderCommentRangeStart(e) {
    if (!this.options.renderComments)
      return null;
    const n = new Range();
    this.commentHighlight?.add(n);
    const r = this.h({ tagName: "#comment", children: [`start of comment #${e.id}`] });
    return this.later(() => n.setStart(r, 0)), this.commentMap[e.id] = n, r;
  }
  renderCommentRangeEnd(e) {
    if (!this.options.renderComments)
      return null;
    const n = this.commentMap[e.id], r = this.h({ tagName: "#comment", children: [`end of comment #${e.id}`] });
    return this.later(() => n?.setEnd(r, 0)), r;
  }
  renderCommentReference(e) {
    if (!this.options.renderComments)
      return null;
    var n = this.document.commentsPart?.commentMap[e.id];
    if (!n)
      return null;
    const r = this.h({ tagName: "span", className: `${this.className}-comment-ref`, children: ["💬"] }), i = this.h({
      tagName: "div",
      className: `${this.className}-comment-popover`,
      children: [
        this.h({ tagName: "div", className: `${this.className}-comment-author`, children: [n.author] }),
        this.h({ tagName: "div", className: `${this.className}-comment-date`, children: [new Date(n.date).toLocaleString()] }),
        ...this.renderElements(n.children)
      ]
    });
    return this.h({ tagName: "#fragment", children: [
      this.h({ tagName: "#comment", children: [`comment #${n.id} by ${n.author} on ${n.date}`] }),
      r,
      i
    ] });
  }
  renderAltChunk(e) {
    if (!this.options.renderAltChunks)
      return null;
    var n = this.h({ tagName: "iframe" });
    return this.tasks.push(this.document.loadAltChunk(e.id, this.currentPart).then((r) => {
      n.srcdoc = r;
    })), n;
  }
  renderDrawing(e) {
    var n = this.toHTML(e, He.html, "div");
    return n.style.display = "inline-block", n.style.position = "relative", n.style.textIndent = "0px", n;
  }
  renderImage(e) {
    let n = this.toHTML(e, He.html, "img", []), r = e.cssStyle?.transform;
    if (e.srcRect && e.srcRect.some((d) => d != 0)) {
      var [i, s, a, l] = e.srcRect;
      r = `scale(${1 / (1 - i - a)}, ${1 / (1 - s - l)})`, n.style["clip-path"] = `rect(${(100 * s).toFixed(2)}% ${(100 * (1 - a)).toFixed(2)}% ${(100 * (1 - l)).toFixed(2)}% ${(100 * i).toFixed(2)}%)`;
    }
    return e.rotation && (r = `rotate(${e.rotation}deg) ${r ?? ""}`), n.style.transform = r?.trim(), this.document && this.tasks.push(this.document.loadDocumentImage(e.src, this.currentPart).then((d) => {
      n.src = d;
    })), n;
  }
  renderText(e) {
    return this.h(e.text);
  }
  renderDeletedText(e) {
    return this.options.renderChanges ? this.renderText(e) : null;
  }
  renderBreak(e) {
    return e.break == "textWrapping" ? this.h({ tagName: "br" }) : null;
  }
  renderInserted(e) {
    return this.options.renderChanges ? this.renderChange(e, "ins") : this.renderElements(e.children);
  }
  renderDeleted(e) {
    return this.options.renderChanges ? this.renderChange(e, "del") : null;
  }
  renderChange(e, n) {
    return this.renderContainer(e, n, {
      dateTime: e.date
    });
  }
  renderSymbol(e) {
    return this.h({ tagName: "span", children: [String.fromCharCode(e.char)], style: { fontFamily: e.font } });
  }
  renderFootnoteReference(e) {
    return this.currentFootnoteIds.push(e.id), this.h({ tagName: "sup", children: [`${this.currentFootnoteIds.length}`] });
  }
  renderEndnoteReference(e) {
    return this.currentEndnoteIds.push(e.id), this.h({ tagName: "sup", children: [`${this.currentEndnoteIds.length}`] });
  }
  renderTab(e) {
    var n = this.h({ tagName: "span", children: [" "] });
    if (this.options.experimental) {
      n.className = this.tabStopClass();
      var r = t1(e, ee.Paragraph)?.tabs;
      this.currentTabs.push({ stops: r, span: n });
    }
    return n;
  }
  renderBookmarkStart(e) {
    return this.h({ tagName: "span", id: e.name });
  }
  renderRun(e) {
    if (e.fieldRun)
      return null;
    let n = this.renderElements(e.children);
    e.verticalAlign && (n = [this.h({ tagName: e.verticalAlign, children: this.renderElements(e.children) })]);
    const r = this.toHTML(e, He.html, "span", n);
    return e.id && (r.id = e.id), r;
  }
  renderTable(e) {
    this.tableCellPositions.push(this.currentCellPosition), this.tableVerticalMerges.push(this.currentVerticalMerge), this.currentVerticalMerge = {}, this.currentCellPosition = { col: 0, row: 0 };
    const n = [];
    return e.columns && n.push(this.renderTableColumns(e.columns)), n.push(...this.renderElements(e.children)), this.currentVerticalMerge = this.tableVerticalMerges.pop(), this.currentCellPosition = this.tableCellPositions.pop(), this.toHTML(e, He.html, "table", n);
  }
  renderTableColumns(e) {
    const n = e.map((r) => this.h({ tagName: "col", style: { width: r.width } }));
    return this.h({ tagName: "colgroup", children: n });
  }
  renderTableRow(e) {
    this.currentCellPosition.col = 0;
    const n = [];
    return e.gridBefore && n.push(this.renderTableCellPlaceholder(e.gridBefore)), n.push(...this.renderElements(e.children)), e.gridAfter && n.push(this.renderTableCellPlaceholder(e.gridAfter)), this.currentCellPosition.row++, this.toHTML(e, He.html, "tr", n);
  }
  renderTableCellPlaceholder(e) {
    return this.h({ tagName: "td", colSpan: e, style: { border: "none" } });
  }
  renderTableCell(e) {
    let n = this.toHTML(e, He.html, "td");
    const r = this.currentCellPosition.col;
    return e.verticalMerge ? e.verticalMerge == "restart" ? (this.currentVerticalMerge[r] = n, n.rowSpan = 1) : this.currentVerticalMerge[r] && (this.currentVerticalMerge[r].rowSpan += 1, n.style.display = "none") : this.currentVerticalMerge[r] = null, e.span && (n.colSpan = e.span), this.currentCellPosition.col += n.colSpan, n;
  }
  renderVmlPicture(e) {
    return this.renderContainer(e, "div");
  }
  renderVmlElement(e) {
    var n = this.h({ ns: He.svg, tagName: "svg", style: e.cssStyleText });
    const r = this.renderVmlChildElement(e);
    return e.imageHref?.id && this.tasks.push(this.document?.loadDocumentImage(e.imageHref.id, this.currentPart).then((i) => r.setAttribute("href", i))), n.appendChild(r), requestAnimationFrame(() => {
      const i = n.firstElementChild.getBBox();
      n.setAttribute("width", `${Math.ceil(i.x + i.width)}`), n.setAttribute("height", `${Math.ceil(i.y + i.height)}`);
    }), n;
  }
  renderVmlChildElement(e) {
    const n = this.createSvgElement(e.tagName);
    Object.entries(e.attrs).forEach(([r, i]) => n.setAttribute(r, i));
    for (let r of e.children)
      r.type == ee.VmlElement ? n.appendChild(this.renderVmlChildElement(r)) : n.appendChild(...is(this.renderElement(r)));
    return n;
  }
  renderMmlRadical(e) {
    const n = e.children.find((i) => i.type == ee.MmlBase);
    if (e.props?.hideDegree)
      return this.createMathMLElement("msqrt", null, this.renderElements([n]));
    const r = e.children.find((i) => i.type == ee.MmlDegree);
    return this.createMathMLElement("mroot", null, this.renderElements([n, r]));
  }
  renderMmlDelimiter(e) {
    const n = [];
    return n.push(this.createMathMLElement("mo", null, [e.props.beginChar ?? "("])), n.push(...this.renderElements(e.children)), n.push(this.createMathMLElement("mo", null, [e.props.endChar ?? ")"])), this.createMathMLElement("mrow", null, n);
  }
  renderMmlNary(e) {
    const n = [], r = dr(e.children, (h) => h.type), i = r[ee.MmlSuperArgument], s = r[ee.MmlSubArgument], a = i ? this.createMathMLElement("mo", null, is(this.renderElement(i))) : null, l = s ? this.createMathMLElement("mo", null, is(this.renderElement(s))) : null, d = this.createMathMLElement("mo", null, [e.props?.char ?? "∫"]);
    return a || l ? n.push(this.createMathMLElement("munderover", null, [d, l, a])) : a ? n.push(this.createMathMLElement("mover", null, [d, a])) : l ? n.push(this.createMathMLElement("munder", null, [d, l])) : n.push(d), n.push(...this.renderElements(r[ee.MmlBase].children)), this.createMathMLElement("mrow", null, n);
  }
  renderMmlPreSubSuper(e) {
    const n = [], r = dr(e.children, (h) => h.type), i = r[ee.MmlSuperArgument], s = r[ee.MmlSubArgument], a = i ? this.createMathMLElement("mo", null, is(this.renderElement(i))) : null, l = s ? this.createMathMLElement("mo", null, is(this.renderElement(s))) : null, d = this.createMathMLElement("mo", null);
    return n.push(this.createMathMLElement("msubsup", null, [d, l, a])), n.push(...this.renderElements(r[ee.MmlBase].children)), this.createMathMLElement("mrow", null, n);
  }
  renderMmlGroupChar(e) {
    const n = e.props.verticalJustification === "bot" ? "mover" : "munder", r = this.renderContainerNS(e, He.mathML, n);
    return e.props.char && r.appendChild(this.createMathMLElement("mo", null, [e.props.char])), r;
  }
  renderMmlBar(e) {
    const n = {};
    switch (e.props.position) {
      case "top":
        n.textDecoration = "overline";
        break;
      case "bottom":
        n.textDecoration = "underline";
        break;
    }
    return this.renderContainerNS(e, He.mathML, "mrow", { style: n });
  }
  renderMmlRun(e) {
    return this.toHTML(e, He.mathML, "ms");
  }
  renderMllList(e) {
    const n = this.renderElements(e.children).map((r) => this.createMathMLElement("mtr", null, [
      this.createMathMLElement("mtd", null, [r])
    ]));
    return this.toHTML(e, He.mathML, "mtable", n);
  }
  toH(e, n, r, i = null) {
    const { $lang: s, ...a } = e.cssStyle ?? {}, l = Y0(e.className, e.styleName && this.processStyleName(e.styleName));
    return { ns: n, tagName: r, className: l, lang: s, style: a, children: i ?? this.renderElements(e.children) };
  }
  toHTML(e, n, r, i = null) {
    return this.h(this.toH(e, n, r, i));
  }
  findStyle(e) {
    return e && this.styleMap?.[e];
  }
  numberingClass(e, n) {
    return `${this.className}-num-${e}-${n}`;
  }
  tabStopClass() {
    return `${this.className}-tab-stop`;
  }
  styleToString(e, n, r = null) {
    let i = `${e} {\r
`;
    for (const s in n)
      s.startsWith("$") || (i += `  ${s}: ${n[s]};\r
`);
    return r && (i += r), i + `}\r
`;
  }
  numberingCounter(e, n) {
    return `${this.className}-num-${e}-${n}`;
  }
  levelTextToContent(e, n, r, i) {
    const s = {
      tab: "\\9",
      space: "\\a0"
    };
    var a = e.replace(/%\d*/g, (l) => {
      let d = parseInt(l.substring(1), 10) - 1;
      return `"counter(${this.numberingCounter(r, d)}, ${i})"`;
    });
    return `"${a}${s[n] ?? ""}"`;
  }
  numFormatToCssValue(e) {
    var n = {
      none: "none",
      bullet: "disc",
      decimal: "decimal",
      lowerLetter: "lower-alpha",
      upperLetter: "upper-alpha",
      lowerRoman: "lower-roman",
      upperRoman: "upper-roman",
      decimalZero: "decimal-leading-zero",
      aiueo: "katakana",
      aiueoFullWidth: "katakana",
      chineseCounting: "simp-chinese-informal",
      chineseCountingThousand: "simp-chinese-informal",
      chineseLegalSimplified: "simp-chinese-formal",
      chosung: "hangul-consonant",
      ideographDigital: "cjk-ideographic",
      ideographTraditional: "cjk-heavenly-stem",
      ideographLegalTraditional: "trad-chinese-formal",
      ideographZodiac: "cjk-earthly-branch",
      iroha: "katakana-iroha",
      irohaFullWidth: "katakana-iroha",
      japaneseCounting: "japanese-informal",
      japaneseDigitalTenThousand: "cjk-decimal",
      japaneseLegal: "japanese-formal",
      thaiNumbers: "thai",
      koreanCounting: "korean-hangul-formal",
      koreanDigital: "korean-hangul-formal",
      koreanDigital2: "korean-hanja-informal",
      hebrew1: "hebrew",
      hebrew2: "hebrew",
      hindiNumbers: "devanagari",
      ganada: "hangul",
      taiwaneseCounting: "cjk-ideographic",
      taiwaneseCountingThousand: "cjk-ideographic",
      taiwaneseDigital: "cjk-decimal"
    };
    return n[e] ?? e;
  }
  refreshTabStops() {
    this.options.experimental && setTimeout(() => {
      const e = X0();
      for (let n of this.currentTabs)
        Z0(n.span, n.stops, this.defaultTabSize, e);
    }, 500);
  }
  createElementNS(e, n, r, i) {
    return this.h({ ns: e, tagName: n, children: i, ...r });
  }
  createElement(e, n, r) {
    return this.createElementNS(He.html, e, n, r);
  }
  createMathMLElement(e, n, r) {
    return this.createElementNS(He.mathML, e, n, r);
  }
  createSvgElement(e, n, r) {
    return this.createElementNS(He.svg, e, n, r);
  }
  later(e) {
    this.postRenderTasks.push(e);
  }
}
function t1(t, e) {
  for (var n = t.parent; n != null && n.type != e; )
    n = n.parent;
  return n;
}
const Jg = {
  ignoreHeight: !1,
  ignoreWidth: !1,
  ignoreFonts: !1,
  breakPages: !0,
  debug: !1,
  experimental: !1,
  className: "docx",
  inWrapper: !0,
  hideWrapperOnPrint: !1,
  trimXmlDeclaration: !0,
  ignoreLastRenderedPageBreak: !0,
  renderHeaders: !0,
  renderFooters: !0,
  renderFootnotes: !0,
  renderEndnotes: !0,
  useBase64URL: !1,
  renderChanges: !1,
  renderComments: !1,
  renderAltChunks: !0,
  h: Co
};
function n1(t, e) {
  const n = { ...Jg, ...e };
  return Dd.load(t, new V0(n), n);
}
async function r1(t, e) {
  const n = { ...Jg, ...e };
  return await new e1().render(t, n);
}
async function i1(t, e, n, r) {
  const i = await n1(t, r), s = await r1(i, r);
  n ?? (n = e), n.innerHTML = "", e.innerHTML = "";
  for (let a of s)
    (a.nodeName === "STYLE" ? n : e).appendChild(a);
  return i;
}
const s1 = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; font-src data: blob:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><style>body{margin:0;background:#f5f6f4;color:#25332e}.docx-wrapper{padding:16px!important}a{pointer-events:none}img{max-width:100%}@media(max-width:600px){.docx-wrapper{padding:8px!important}section.docx{padding:24px!important;width:auto!important;min-width:0!important}table{max-width:100%}}</style></head><body><main id="document"></main></body></html>`;
function a1({ blob: t }) {
  const e = De(null), [n, r] = P(!1), [i, s] = P(!0), [a, l] = P("");
  return Ae(() => {
    if (!n) return;
    const d = new AbortController();
    return Ed(t, "docx", d.signal).then(async () => {
      const h = e.current?.contentDocument?.getElementById("document");
      d.signal.aborted || !h || (await i1(t, h, h, { useBase64URL: !0, renderAltChunks: !1, renderComments: !1, breakPages: !0, ignoreLastRenderedPageBreak: !1 }), !d.signal.aborted && (h.querySelectorAll("a").forEach((b) => {
        b.removeAttribute("href"), b.removeAttribute("target");
      }), s(!1)));
    }).catch((h) => {
      d.signal.aborted || (l(h instanceof Error ? h.message : "Word 文件无法预览。"), s(!1));
    }), () => {
      d.abort(), e.current?.contentDocument?.getElementById("document")?.replaceChildren();
    };
  }, [t, n]), /* @__PURE__ */ u("div", { className: "knowledge-file-viewer", children: [
    /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "Word 只读预览 · 复杂排版可能与桌面 Word 有差异。" }),
    i && /* @__PURE__ */ c("p", { role: "status", children: "正在排版文档…" }),
    a && /* @__PURE__ */ c("p", { role: "alert", className: "knowledge-error", children: a }),
    /* @__PURE__ */ c("iframe", { className: "knowledge-word-frame", title: "Word 原文件预览", ref: e, sandbox: "allow-same-origin", srcDoc: s1, onLoad: () => r(!0), "aria-busy": i })
  ] });
}
function o1({ source: t, downloadSource: e = t, formatError: n = Es, onClose: r }) {
  const [i, s] = P(null), [a, l] = P(null), [d, h] = P(""), [b, m] = P(0), [p, g] = P(!1), _ = Qo(t.file.filename), k = _ === "pdf", y = ["mp3", "wav", "ogg", "flac", "m4a", "aac"].includes(_), C = ["mp4", "mov", "webm", "avi"].includes(_), S = Pg(t.file.filename);
  Ae(() => {
    const N = new AbortController();
    s(null), l(null), h("");
    const R = AbortSignal.any([N.signal, AbortSignal.timeout(3e4)]);
    return S ? k || y || C ? () => N.abort() : ((kA(_) ? CA(t, R).then(l) : Mg(t, R, ["docx", "pptx", "xlsx", "xlsm"].includes(_) ? gA : void 0).then(s)).catch((U) => {
      N.signal.aborted || h(n(U));
    }), () => N.abort()) : () => N.abort();
  }, [t.identity, _, n, k, y, C, b, S]);
  async function x() {
    if (!p) {
      g(!0), h("");
      try {
        await zg(e, AbortSignal.timeout(12e4));
      } catch (N) {
        h(n(N));
      } finally {
        g(!1);
      }
    }
  }
  const z = ["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(_);
  return wi(/* @__PURE__ */ c("div", { className: "knowledge-modal-backdrop", role: "presentation", onMouseDown: (N) => {
    N.target === N.currentTarget && r();
  }, children: /* @__PURE__ */ u("section", { className: "knowledge-preview-dialog", role: "dialog", "aria-modal": "true", "aria-label": i?.filename || a?.filename || t.file.filename, children: [
    /* @__PURE__ */ u("header", { children: [
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ c("h2", { children: i?.filename || a?.filename || t.file.filename }),
        /* @__PURE__ */ u("p", { children: [
          /* @__PURE__ */ c("span", { children: "原文件在线预览" }),
          " · 每次打开和下载都由宿主重新核对权限"
        ] })
      ] }),
      /* @__PURE__ */ c(te, { "aria-label": "关闭", onClick: r, children: /* @__PURE__ */ c(Fn, { size: 17 }) })
    ] }),
    /* @__PURE__ */ u("div", { className: "knowledge-file-toolbar", children: [
      /* @__PURE__ */ u(te, { disabled: p, onClick: () => {
        x();
      }, children: [
        /* @__PURE__ */ c(no, { size: 15 }),
        p ? "正在下载…" : "下载原文件"
      ] }),
      /* @__PURE__ */ u(te, { disabled: !S, onClick: () => m((N) => N + 1), children: [
        /* @__PURE__ */ c(lt, { size: 15 }),
        "重新打开"
      ] })
    ] }),
    S ? d ? /* @__PURE__ */ c("p", { role: "alert", className: "knowledge-error", children: d }) : k ? /* @__PURE__ */ c(EA, { source: t, location: t.file.location }) : y ? /* @__PURE__ */ c(sf, { source: t, kind: "audio" }) : C ? /* @__PURE__ */ c(sf, { source: t, kind: "video" }) : !i && !a ? /* @__PURE__ */ c("p", { children: "正在读取原文件…" }) : a ? /* @__PURE__ */ c(BA, { file: a }) : i?.format === "docx" ? /* @__PURE__ */ c(a1, { blob: i.blob }) : i?.format === "pptx" ? /* @__PURE__ */ c(NA, { blob: i.blob, location: t.file.location }) : i?.format === "xlsx" || i?.format === "xlsm" ? /* @__PURE__ */ c(xA, { blob: i.blob, location: t.file.location }) : i && z ? /* @__PURE__ */ c(SA, { blob: i.blob, filename: i.filename }) : /* @__PURE__ */ c("p", { children: "此格式暂不支持在线预览，请下载查看。" }) : /* @__PURE__ */ c("div", { className: "knowledge-preview-unsupported", children: /* @__PURE__ */ c("p", { children: "旧版 Word（.doc）和 Excel（.xls）不能在浏览器中可靠解析。请下载后查看，或另存为 .docx / .xlsx 再上传。" }) })
  ] }) }), window.document.body);
}
function yf(t, e) {
  return JSON.stringify({ document_id: t, display_mode: "preview", title: e });
}
function Vg(t) {
  try {
    const e = JSON.parse(t);
    return /^kdoc_[a-zA-Z0-9]{32}$/.test(e.document_id || "") && (e.display_mode === "preview" || e.display_mode === "card") && typeof e.title == "string" && e.title.trim().length > 0 ? e : null;
  } catch {
    return null;
  }
}
function l1(t) {
  return t >= 1024 ** 3 ? `${(t / 1024 ** 3).toFixed(1)} GiB` : t >= 1024 ** 2 ? `${(t / 1024 ** 2).toFixed(1)} MiB` : `${Math.max(0.1, t / 1024).toFixed(1)} KiB`;
}
function Hc({ client: t, libraryID: e, pageID: n, content: r, formatError: i }) {
  const s = Vg(r), [a, l] = P(null), [d, h] = P(!!s), [b, m] = P(s ? "" : "文件页面引用无效。"), [p, g] = P(!1), [_, k] = P(!1), [y, C] = P(0);
  Ae(() => {
    if (!s) {
      l(null), h(!1), m("文件页面引用无效。");
      return;
    }
    const z = new AbortController();
    return h(!0), m(""), t.getDocument(e, s.document_id, z.signal).then((N) => {
      z.signal.aborted || l(N);
    }).catch((N) => {
      z.signal.aborted || (l(null), m(`原文件当前不可用：${i(N)}`));
    }).finally(() => {
      z.signal.aborted || h(!1);
    }), () => z.abort();
  }, [t, i, e, s?.document_id, y]);
  async function S() {
    if (!(!a || _)) {
      k(!0), m("");
      try {
        await zg(rf(t, n, a), AbortSignal.timeout(7200 * 1e3));
      } catch (z) {
        m(i(z));
      } finally {
        k(!1);
      }
    }
  }
  if (d) return /* @__PURE__ */ u("section", { className: "knowledge-file-page is-loading", role: "status", children: [
    /* @__PURE__ */ c(lt, { size: 24, className: "knowledge-pulse" }),
    /* @__PURE__ */ c("p", { children: "正在核对原文件状态…" })
  ] });
  if (!a) return /* @__PURE__ */ u("section", { className: "knowledge-file-page is-unavailable", role: "alert", children: [
    /* @__PURE__ */ c(vb, { size: 30 }),
    /* @__PURE__ */ c("h3", { children: s?.title || "文件不可用" }),
    /* @__PURE__ */ c("p", { children: b || "原文件已删除、隔离或当前账号无权访问。" }),
    /* @__PURE__ */ u(te, { onClick: () => C((z) => z + 1), children: [
      /* @__PURE__ */ c(lt, { size: 14 }),
      "重新核对"
    ] })
  ] });
  const x = Wb(a);
  return /* @__PURE__ */ u("section", { className: `knowledge-file-page is-${a.state}`, children: [
    /* @__PURE__ */ c("div", { className: "knowledge-file-page-icon", children: /* @__PURE__ */ c("span", { children: a.filename.split(".").at(-1)?.slice(0, 4).toUpperCase() || "FILE" }) }),
    /* @__PURE__ */ u("div", { className: "knowledge-file-page-details", children: [
      /* @__PURE__ */ c("span", { className: `knowledge-file-state is-${a.security_status}`, children: Xb(a) }),
      /* @__PURE__ */ c("h3", { children: a.filename }),
      /* @__PURE__ */ u("p", { children: [
        l1(a.bytes),
        " · 原件版本 v",
        a.content_version,
        " · SHA-256 ",
        a.sha256.slice(0, 12),
        "…"
      ] }),
      /* @__PURE__ */ c("p", { children: Zb(a) }),
      a.error_code && /* @__PURE__ */ c("p", { className: "knowledge-error", children: a.error_code }),
      b && /* @__PURE__ */ c("p", { className: "knowledge-error", role: "alert", children: b }),
      /* @__PURE__ */ u("div", { className: "knowledge-actions", children: [
        Pg(a.filename) && /* @__PURE__ */ u(te, { className: "primary", disabled: !x, onClick: () => g(!0), children: [
          /* @__PURE__ */ c(Ab, { size: 15 }),
          "在线预览"
        ] }),
        /* @__PURE__ */ u(te, { disabled: !x || _, onClick: () => {
          S();
        }, children: [
          /* @__PURE__ */ c(no, { size: 15 }),
          _ ? "正在下载…" : "下载原文件"
        ] }),
        /* @__PURE__ */ u(te, { onClick: () => C((z) => z + 1), children: [
          /* @__PURE__ */ c(lt, { size: 14 }),
          "刷新状态"
        ] })
      ] })
    ] }),
    p && /* @__PURE__ */ c(o1, { source: IA(t, a), downloadSource: rf(t, n, a), formatError: i, onClose: () => g(!1) })
  ] });
}
const Kg = /^kshare_[A-Za-z0-9_-]{32}$/, Wg = /^kpage_[A-Za-z0-9_-]{32}$/;
function c1(t, e, n) {
  if (!Kg.test(e) || !Wg.test(n)) throw Error("Knowledge page share identifiers are invalid");
  const r = t instanceof URL ? new URL(t.href) : new URL(t);
  for (const i of ["knowledge_library", "knowledge_kind", "knowledge_block", "knowledge_mode"]) r.searchParams.delete(i);
  return r.searchParams.set("knowledge_share", e), r.searchParams.set("knowledge_page", n), r.href;
}
function zC(t) {
  const e = t instanceof URL ? t : new URL(t, "http://knowledge.local"), n = e.searchParams.get("knowledge_share") || "", r = e.searchParams.get("knowledge_page") || "";
  return Kg.test(n) && Wg.test(r) ? { shareID: n, pageID: r } : null;
}
function d1(t = 168) {
  const e = new Date(Date.now() + t * 60 * 60 * 1e3);
  return e.setMinutes(e.getMinutes() - e.getTimezoneOffset()), e.toISOString().slice(0, 16);
}
function u1({ client: t, libraryID: e, pageID: n, published: r, formatError: i, onNotice: s }) {
  const [a, l] = P([]), [d, h] = P(""), [b, m] = P(!0), [p, g] = P("user"), [_, k] = P("page"), [y, C] = P(""), [S, x] = P(""), [z, N] = P(""), [R, B] = P(() => d1()), [U, Q] = P([]), [K, pe] = P({}), [E, F] = P({}), [v, T] = P(""), [fe, Z] = P(""), ke = !!(t.listPageShares && t.createPageShare && t.revokePageShare);
  async function q(re, we) {
    const _e = [...new Set(re.filter((xe) => xe.target?.type === "user").map((xe) => xe.target.id))], Ce = [...new Set(re.filter((xe) => xe.target?.type === "organization").map((xe) => xe.target.id))];
    _e.length && t.resolvePrincipals(_e, we).then((xe) => pe((ze) => ({ ...ze, ...Object.fromEntries(xe.map((Ge) => [Ge.user_id, Ge])) }))).catch(() => {
    }), Ce.length && t.resolveOrganizationPrincipals(Ce, we).then((xe) => F((ze) => ({ ...ze, ...Object.fromEntries(xe.map((Ge) => [Ge.organization_id, Ge])) }))).catch(() => {
    });
  }
  async function ge(re = "", we = !1, _e = AbortSignal.timeout(3e4)) {
    if (t.listPageShares) {
      T(we ? "more" : "list"), Z("");
      try {
        const Ce = await t.listPageShares(e, n, re, 100, _e);
        l((xe) => we ? [...xe, ...Ce.items.filter((ze) => !xe.some((Ge) => Ge.id === ze.id))] : Ce.items), h(Ce.next_after || ""), m(Ce.complete), await q(Ce.items, _e);
      } catch (Ce) {
        _e.aborted || Z(i(Ce));
      } finally {
        _e.aborted || T("");
      }
    }
  }
  Ae(() => {
    if (!ke) return;
    const re = new AbortController();
    return ge("", !1, re.signal), () => re.abort();
  }, [ke, t, e, n]), Ae(() => {
    if (p !== "user" || !y.trim()) {
      Q([]);
      return;
    }
    const re = new AbortController(), we = window.setTimeout(() => {
      t.searchPrincipals(y.trim(), "", 20, re.signal).then((_e) => {
        re.signal.aborted || (Q(_e.items), pe((Ce) => ({ ...Ce, ...Object.fromEntries(_e.items.map((xe) => [xe.user_id, xe])) })));
      }).catch((_e) => {
        re.signal.aborted || Z(i(_e));
      });
    }, 200);
    return () => {
      window.clearTimeout(we), re.abort();
    };
  }, [t, i, p, y]), Ae(() => {
    x(""), C(""), Q([]), p !== "external" && N("");
  }, [p]);
  const W = Xe(() => r && !v && !!R && (p === "external" ? z.length >= 8 : !!S || p === "organization" && !!y.trim()), [v, R, p, z.length, r, S, y]);
  async function H() {
    if (!(!t.createPageShare || !W)) {
      T("create"), Z("");
      try {
        let re;
        if (p === "user" && (re = { type: "user", id: S }), p === "organization") {
          const Ce = y.trim(), [xe] = await t.resolveOrganizationPrincipals([Ce], AbortSignal.timeout(3e4));
          if (!xe || xe.organization_id !== Ce || xe.status !== "active") throw Error("组织不存在或已停用。请输入 Identity 中的有效组织 ID。");
          F((ze) => ({ ...ze, [Ce]: xe })), re = { type: "organization", id: Ce };
        }
        const we = new Date(R);
        if (!Number.isFinite(we.getTime()) || we <= /* @__PURE__ */ new Date()) throw Error("分享有效期必须晚于当前时间。");
        const _e = await t.createPageShare(e, n, { client_id: crypto.randomUUID(), kind: p, target: re, scope: _, expires_at: we.toISOString(), password: z || void 0 }, AbortSignal.timeout(3e4));
        l((Ce) => [_e, ...Ce.filter((xe) => xe.id !== _e.id)]), N(""), x(""), C(""), Q([]), s("受控分享已创建。访问者仍需登录，服务端会在每次阅读时重新核对身份、有效期与撤销状态。");
      } catch (re) {
        Z(i(re));
      } finally {
        T("");
      }
    }
  }
  async function ye(re) {
    if (!(!t.revokePageShare || re.state !== "active")) {
      T(re.id), Z("");
      try {
        const we = await t.revokePageShare(e, n, re.id, re.revision, AbortSignal.timeout(3e4));
        l((_e) => _e.map((Ce) => Ce.id === we.id ? we : Ce)), s("分享已撤销，已有兑换记录也已立即失效。");
      } catch (we) {
        Z(i(we));
      } finally {
        T("");
      }
    }
  }
  async function me(re) {
    try {
      await navigator.clipboard.writeText(c1(window.location.href, re.id, re.page_id)), s("分享链接已复制。链接只含非密钥定位符，不能绕过登录和服务端权限校验。");
    } catch {
      Z("浏览器未允许复制，请在地址栏手动复制分享链接。");
    }
  }
  function de(re) {
    return re.kind === "external" ? "工作区外部用户" : re.target?.type === "organization" ? E[re.target.id]?.display_name || re.target.id : re.target ? K[re.target.id]?.display_name || re.target.id : "未知主体";
  }
  return ke ? /* @__PURE__ */ u("section", { className: "knowledge-share-manager", children: [
    /* @__PURE__ */ u("header", { children: [
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ c("h3", { children: "受控分享" }),
        /* @__PURE__ */ c("p", { children: "只分享当前已发布版本；分享链接不是登录凭证，访问者必须登录并在服务端兑换。" })
      ] }),
      /* @__PURE__ */ c(te, { "aria-label": "刷新分享", title: "刷新分享", disabled: !!v, onClick: () => {
        ge();
      }, children: /* @__PURE__ */ c(lt, { size: 14 }) })
    ] }),
    !r && /* @__PURE__ */ c("p", { className: "knowledge-access-preview", children: "当前页面尚未发布，不能创建分享。发布后只读分享不会暴露草稿。" }),
    /* @__PURE__ */ u("div", { className: "knowledge-share-create", children: [
      /* @__PURE__ */ u("label", { children: [
        "分享对象",
        /* @__PURE__ */ u("select", { value: p, disabled: !!v || !r, onChange: (re) => g(re.target.value), children: [
          /* @__PURE__ */ c("option", { value: "user", children: "指定用户" }),
          /* @__PURE__ */ c("option", { value: "organization", children: "指定组织" }),
          /* @__PURE__ */ c("option", { value: "external", children: "外部用户" })
        ] })
      ] }),
      p === "user" && /* @__PURE__ */ u("label", { children: [
        "查找工作区用户",
        /* @__PURE__ */ c("input", { value: y, disabled: !!v || !r, onChange: (re) => {
          C(re.target.value), x("");
        }, placeholder: "输入姓名或邮箱" })
      ] }),
      p === "organization" && /* @__PURE__ */ u("label", { children: [
        "Identity 组织 ID",
        /* @__PURE__ */ c("input", { value: y, disabled: !!v || !r, onChange: (re) => C(re.target.value), placeholder: "输入准确的组织 ID" })
      ] }),
      p === "user" && U.length > 0 && /* @__PURE__ */ c("div", { className: "knowledge-principal-results", role: "listbox", children: U.map((re) => /* @__PURE__ */ u("button", { type: "button", role: "option", "aria-selected": S === re.user_id, onClick: () => {
        x(re.user_id), C(re.display_name || re.email || re.user_id), Q([]);
      }, children: [
        /* @__PURE__ */ c("span", { "aria-hidden": "true", children: (re.display_name || "?").slice(0, 1) }),
        /* @__PURE__ */ c("strong", { children: re.display_name || re.user_id }),
        /* @__PURE__ */ c("small", { children: re.email })
      ] }, re.user_id)) }),
      /* @__PURE__ */ u("div", { className: "knowledge-share-options", children: [
        /* @__PURE__ */ u("label", { children: [
          "范围",
          /* @__PURE__ */ u("select", { value: _, disabled: !!v || !r, onChange: (re) => k(re.target.value), children: [
            /* @__PURE__ */ c("option", { value: "page", children: "仅此页面" }),
            /* @__PURE__ */ c("option", { value: "subtree", children: "页面与已发布子树" })
          ] })
        ] }),
        /* @__PURE__ */ u("label", { children: [
          "有效期",
          /* @__PURE__ */ c("input", { type: "datetime-local", value: R, disabled: !!v || !r, onChange: (re) => B(re.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ u("label", { children: [
        "访问密码",
        p === "external" ? "（必填，至少 8 位）" : "（可选，至少 8 位）",
        /* @__PURE__ */ c("input", { type: "password", minLength: 8, maxLength: 72, autoComplete: "new-password", value: z, disabled: !!v || !r, onChange: (re) => N(re.target.value), placeholder: p === "external" ? "外部分享必须设置密码" : "需要二次验证时设置" })
      ] }),
      /* @__PURE__ */ u(te, { className: "primary", disabled: !W, onClick: () => {
        H();
      }, children: [
        /* @__PURE__ */ c(ro, { size: 14 }),
        v === "create" ? "正在创建…" : "创建分享"
      ] })
    ] }),
    fe && /* @__PURE__ */ c("p", { className: "knowledge-error", role: "alert", children: fe }),
    /* @__PURE__ */ u("div", { className: "knowledge-share-list", children: [
      a.map((re) => /* @__PURE__ */ u("article", { className: re.state === "revoked" || new Date(re.expires_at) <= /* @__PURE__ */ new Date() ? "is-inactive" : void 0, children: [
        /* @__PURE__ */ c("span", { className: "knowledge-share-icon", children: /* @__PURE__ */ c(_i, { size: 15 }) }),
        /* @__PURE__ */ u("span", { children: [
          /* @__PURE__ */ c("strong", { children: de(re) }),
          /* @__PURE__ */ u("small", { children: [
            re.kind === "organization" ? "组织" : re.kind === "user" ? "指定用户" : "受控外部访问",
            " · ",
            re.scope === "subtree" ? "页面与子树" : "仅此页面",
            " · ",
            re.password_protected ? "有密码" : "无密码"
          ] }),
          /* @__PURE__ */ c("small", { children: re.state === "revoked" ? "已撤销" : new Date(re.expires_at) <= /* @__PURE__ */ new Date() ? "已过期" : `有效至 ${new Date(re.expires_at).toLocaleString()}` })
        ] }),
        /* @__PURE__ */ u("div", { children: [
          /* @__PURE__ */ c(te, { "aria-label": "复制分享链接", title: "复制分享链接", disabled: re.state !== "active", onClick: () => {
            me(re);
          }, children: /* @__PURE__ */ c(Wc, { size: 14 }) }),
          re.state === "active" && /* @__PURE__ */ c(te, { className: "danger", "aria-label": "撤销分享", title: "撤销分享", disabled: !!v, onClick: () => {
            ye(re);
          }, children: /* @__PURE__ */ c(Fn, { size: 14 }) })
        ] })
      ] }, re.id)),
      !v && a.length === 0 && /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "尚未创建受控分享。" })
    ] }),
    !b && d && /* @__PURE__ */ c(te, { disabled: !!v, onClick: () => {
      ge(d, !0);
    }, children: "加载更多分享" }),
    /* @__PURE__ */ u("footer", { children: [
      /* @__PURE__ */ c(jn, { size: 14 }),
      /* @__PURE__ */ c("span", { children: "组织归属、用户状态、撤销状态和有效期均在每次阅读时重新核对。" })
    ] })
  ] }) : null;
}
const h1 = [
  { key: "allow_copy", label: "复制正文", detail: "复制选中文本或内容块到剪贴板", icon: Wc },
  { key: "allow_download", label: "下载原文件", detail: "下载文件页面绑定的不可变原件", icon: no },
  { key: "allow_print", label: "打印页面", detail: "打开系统打印与另存 PDF", icon: Ib },
  { key: "allow_export", label: "导出内容", detail: "导出 Markdown、JSON、CSV、XLSX、图片或演示文稿", icon: no },
  { key: "allow_duplicate", label: "创建副本", detail: "在当前知识库创建独立草稿副本", icon: Sb }
];
function f1({ client: t, libraryID: e, pageID: n, formatError: r, onNotice: i, onSaved: s }) {
  const [a, l] = P(null), [d, h] = P(!1), [b, m] = P("");
  Ae(() => {
    if (!t.getPageContentPolicy) return;
    const g = new AbortController();
    return l(null), m(""), t.getPageContentPolicy(e, n, g.signal).then((_) => {
      g.signal.aborted || l(_);
    }).catch((_) => {
      g.signal.aborted || m(r(_));
    }), () => g.abort();
  }, [t, r, e, n]);
  async function p() {
    if (!(!a || !t.setPageContentPolicy || d)) {
      h(!0), m("");
      try {
        const g = await t.setPageContentPolicy(e, n, {
          client_id: crypto.randomUUID(),
          expected_revision: a.revision,
          scope: a.scope,
          allow_copy: a.allow_copy,
          allow_download: a.allow_download,
          allow_print: a.allow_print,
          allow_export: a.allow_export,
          allow_duplicate: a.allow_duplicate,
          classification: a.classification,
          watermark_mode: a.watermark_mode,
          sensitive_content_action: a.sensitive_content_action,
          require_outbound_approval: a.require_outbound_approval
        }, AbortSignal.timeout(3e4));
        l(g), i("内容保护与分级策略已保存；后续操作会由服务端实时复核。"), s?.();
      } catch (g) {
        m(r(g));
      } finally {
        h(!1);
      }
    }
  }
  return !t.getPageContentPolicy || !t.setPageContentPolicy ? /* @__PURE__ */ c("p", { className: "knowledge-error", children: "当前宿主未启用内容保护策略。" }) : /* @__PURE__ */ u("section", { className: "knowledge-content-policy", children: [
    /* @__PURE__ */ u("header", { children: [
      /* @__PURE__ */ c("span", { children: /* @__PURE__ */ c(jn, { size: 18 }) }),
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ c("h3", { children: "内容保护" }),
        /* @__PURE__ */ c("p", { children: "控制页面内容离开工作区的产品入口；每次操作都会重新请求服务端裁决。" })
      ] })
    ] }),
    b && /* @__PURE__ */ c("p", { className: "knowledge-error", role: "alert", children: b }),
    a ? /* @__PURE__ */ u(xt, { children: [
      /* @__PURE__ */ u("label", { className: "knowledge-content-policy-scope", children: [
        /* @__PURE__ */ c("span", { children: "生效范围" }),
        /* @__PURE__ */ u("select", { disabled: d, value: a.scope, onChange: (g) => l((_) => _ && { ..._, scope: g.target.value }), children: [
          /* @__PURE__ */ c("option", { value: "page", children: "仅当前页面" }),
          /* @__PURE__ */ c("option", { value: "subtree", children: "当前页面与全部子页面" })
        ] })
      ] }),
      a.revision === 0 && /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "当前未保存页面级策略，显示的是最近祖先策略或系统默认值；保存后会建立当前页面的明确策略。" }),
      /* @__PURE__ */ u("div", { className: "knowledge-content-governance-fields", children: [
        /* @__PURE__ */ u("label", { children: [
          /* @__PURE__ */ u("span", { children: [
            /* @__PURE__ */ c(jn, { size: 15 }),
            "密级"
          ] }),
          /* @__PURE__ */ u("select", { disabled: d, value: a.classification, onChange: (g) => l((_) => _ && { ..._, classification: g.target.value }), children: [
            /* @__PURE__ */ c("option", { value: "public", children: "公开" }),
            /* @__PURE__ */ c("option", { value: "internal", children: "内部" }),
            /* @__PURE__ */ c("option", { value: "confidential", children: "机密" }),
            /* @__PURE__ */ c("option", { value: "restricted", children: "严格受限" })
          ] })
        ] }),
        /* @__PURE__ */ u("label", { children: [
          /* @__PURE__ */ u("span", { children: [
            /* @__PURE__ */ c(Cb, { size: 15 }),
            "动态水印"
          ] }),
          /* @__PURE__ */ u("select", { disabled: d, value: a.watermark_mode, onChange: (g) => l((_) => _ && { ..._, watermark_mode: g.target.value }), children: [
            /* @__PURE__ */ c("option", { value: "none", children: "不显示" }),
            /* @__PURE__ */ c("option", { value: "identity", children: "显示当前账号与时间" })
          ] })
        ] }),
        /* @__PURE__ */ u("label", { children: [
          /* @__PURE__ */ u("span", { children: [
            /* @__PURE__ */ c($u, { size: 15 }),
            "敏感内容"
          ] }),
          /* @__PURE__ */ u("select", { disabled: d, value: a.sensitive_content_action, onChange: (g) => l((_) => _ && { ..._, sensitive_content_action: g.target.value }), children: [
            /* @__PURE__ */ c("option", { value: "allow", children: "按下方入口策略处理" }),
            /* @__PURE__ */ c("option", { value: "block_outbound", children: "阻止全部复制、下载、打印、导出、副本与分享" })
          ] })
        ] }),
        /* @__PURE__ */ u("label", { className: "knowledge-content-approval", children: [
          /* @__PURE__ */ u("span", { children: [
            /* @__PURE__ */ c($u, { size: 15 }),
            "外发审批"
          ] }),
          /* @__PURE__ */ u("span", { children: [
            /* @__PURE__ */ c("strong", { children: "要求宿主审批系统实时放行" }),
            /* @__PURE__ */ c("small", { children: "未接入审批系统、审批失效或审批引用缺失时，服务端拒绝全部外发操作。" })
          ] }),
          /* @__PURE__ */ c("input", { type: "checkbox", checked: a.require_outbound_approval, disabled: d, onChange: (g) => l((_) => _ && { ..._, require_outbound_approval: g.target.checked }) })
        ] })
      ] }),
      /* @__PURE__ */ c("div", { className: "knowledge-content-policy-list", children: h1.map((g) => {
        const _ = g.icon;
        return /* @__PURE__ */ u("label", { children: [
          /* @__PURE__ */ c("span", { className: "knowledge-content-policy-icon", children: /* @__PURE__ */ c(_, { size: 16 }) }),
          /* @__PURE__ */ u("span", { children: [
            /* @__PURE__ */ c("strong", { children: g.label }),
            /* @__PURE__ */ c("small", { children: g.detail })
          ] }),
          /* @__PURE__ */ c("input", { type: "checkbox", checked: a[g.key], disabled: d, onChange: (k) => l((y) => y && { ...y, [g.key]: k.target.checked }) })
        ] }, g.key);
      }) }),
      /* @__PURE__ */ u("p", { className: "knowledge-subtle", children: [
        "策略 revision ",
        a.revision || "未建立",
        a.revision > 0 && a.updated_at ? ` · 更新于 ${new Date(a.updated_at).toLocaleString()}` : ""
      ] }),
      /* @__PURE__ */ u(te, { className: "primary", disabled: d, onClick: () => {
        p();
      }, children: [
        /* @__PURE__ */ c(cr, { size: 14 }),
        d ? "正在保存…" : "保存内容保护"
      ] })
    ] }) : /* @__PURE__ */ c("p", { role: "status", children: "正在读取服务端策略…" })
  ] });
}
const wf = {
  public: "公开",
  internal: "内部",
  confidential: "机密",
  restricted: "严格受限"
};
function Xg({ governance: t }) {
  return t?.classification ? /* @__PURE__ */ u("span", { className: `knowledge-classification is-${t.classification}`, title: `内容密级：${wf[t.classification]}`, children: [
    /* @__PURE__ */ c(jn, { size: 12 }),
    wf[t.classification]
  ] }) : null;
}
function Zg({ governance: t }) {
  const e = t?.dynamic_watermark;
  return e?.text ? /* @__PURE__ */ c("div", { className: "knowledge-dynamic-watermark", "aria-hidden": "true", children: Array.from({ length: 12 }, (n, r) => /* @__PURE__ */ c("span", { children: e.text }, r)) }) : null;
}
const Bd = /^lib_[a-f0-9]{32}$/, Pd = /^kpage_[a-f0-9]{32}$/, Yg = /^[A-Za-z0-9][A-Za-z0-9:_-]{0,127}$/;
function p1(t) {
  const e = t instanceof URL ? t : new URL(t, "http://knowledge.local"), n = e.searchParams.get("knowledge_library") || "", r = e.searchParams.get("knowledge_kind"), i = e.searchParams.get("knowledge_page") || "", s = e.searchParams.get("knowledge_block") || void 0, a = e.searchParams.get("knowledge_mode") === "edit" ? "edit" : "read";
  return !Bd.test(n) || !Pd.test(i) || r !== "personal" && r !== "shared" || s && !Yg.test(s) ? null : { libraryID: n, libraryKind: r, pageID: i, blockID: s, mode: a };
}
function g1(t, e, n) {
  if (!Bd.test(e.libraryID) || !Pd.test(e.pageID) || !Yg.test(n)) throw new Error("Knowledge block link identifiers are invalid");
  const r = t instanceof URL ? new URL(t.href) : new URL(t);
  return r.searchParams.set("knowledge_library", e.libraryID), r.searchParams.set("knowledge_kind", e.libraryKind), r.searchParams.set("knowledge_page", e.pageID), r.searchParams.set("knowledge_block", n), r.searchParams.set("knowledge_mode", e.mode), r.href;
}
function m1(t, e) {
  if (!Bd.test(e.libraryID) || !Pd.test(e.pageID)) throw new Error("Knowledge page link identifiers are invalid");
  const n = t instanceof URL ? new URL(t.href) : new URL(t);
  return n.searchParams.set("knowledge_library", e.libraryID), n.searchParams.set("knowledge_kind", e.libraryKind), n.searchParams.set("knowledge_page", e.pageID), n.searchParams.delete("knowledge_block"), n.searchParams.set("knowledge_mode", e.mode), n.href;
}
function Gc(t) {
  return Array.isArray(t) ? t.map(Gc) : t && typeof t == "object" ? Object.fromEntries(Object.entries(t).sort(([e], [n]) => e.localeCompare(n)).map(([e, n]) => [e, Gc(n)])) : t;
}
function Un(t) {
  return JSON.stringify(Gc(t));
}
async function Tt(t) {
  const e = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(Un(t)));
  return [...new Uint8Array(e)].map((n) => n.toString(16).padStart(2, "0")).join("");
}
function _f(t) {
  const e = JSON.parse(t);
  if (!e || !Array.isArray(e.fields) || !Array.isArray(e.records)) throw Error("多维表格内容结构无效。");
  const n = (r, i) => r.map((s) => {
    if (!s || typeof s != "object" || typeof s.id != "string" || !s.id.trim()) throw Error(`${i}缺少稳定 ID。`);
    return s;
  });
  return {
    schema_version: e.schema_version,
    fields: n(e.fields, "字段"),
    records: n(e.records, "记录"),
    views: n(Array.isArray(e.views) ? e.views : [], "视图"),
    permissions: e.permissions,
    automations: e.automations
  };
}
function Di(t) {
  return new Map(t.map((e) => [e.id, e]));
}
function kt() {
  return crypto.randomUUID();
}
function Ft(t, e) {
  return Object.fromEntries(Object.entries(t).filter(([n]) => !e.includes(n)));
}
function qn(t) {
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
async function Dt(t, e, n, r, i, s, a) {
  if (!(r === s && (!r || Un(n) === Un(i))))
    return s ? { id: kt(), target: t, target_id: e, parent_id: a, action: "upsert", expected_hash: r ? await Tt(n) : "", value: i } : { id: kt(), target: t, target_id: e, parent_id: a, action: "delete", expected_hash: await Tt(n) };
}
async function on(t, e, n) {
  const r = [], i = Di(e), s = Di(n);
  for (const a of n) {
    const l = i.get(a.id);
    (!l || Un(l) !== Un(a)) && r.push({ id: kt(), target: t, target_id: a.id, action: "upsert", expected_hash: l ? await Tt(l) : "", value: a });
  }
  for (const a of e)
    s.has(a.id) || r.push({ id: kt(), target: t, target_id: a.id, action: "delete", expected_hash: await Tt(a) });
  return r;
}
function kf(t) {
  const { values: e, ...n } = t;
  return n;
}
async function b1(t, e) {
  const n = _f(t), r = _f(e), i = Di(n.records), s = Di(r.records), a = new Set(r.fields.map((m) => m.id)), l = [];
  l.push(...await on("field", n.fields, r.fields));
  for (const m of r.records) {
    const p = i.get(m.id);
    if (!p) {
      l.push({ id: kt(), target: "record", target_id: m.id, action: "upsert", expected_hash: "", value: m });
      continue;
    }
    if (Un(kf(p)) !== Un(kf(m))) {
      l.push({ id: kt(), target: "record", target_id: m.id, action: "upsert", expected_hash: await Tt(p), value: m });
      continue;
    }
    const g = p.values || {}, _ = m.values || {};
    for (const k of Object.keys(_))
      a.has(k) && (!(k in g) || Un(g[k]) !== Un(_[k])) && l.push({
        id: kt(),
        target: "cell",
        target_id: m.id,
        parent_id: k,
        action: "upsert",
        expected_hash: k in g ? await Tt(g[k]) : "",
        value: _[k]
      });
    for (const k of Object.keys(g))
      a.has(k) && !(k in _) && l.push({ id: kt(), target: "cell", target_id: m.id, parent_id: k, action: "delete", expected_hash: await Tt(g[k]) });
  }
  for (const m of n.records)
    s.has(m.id) || l.push({ id: kt(), target: "record", target_id: m.id, action: "delete", expected_hash: await Tt(m) });
  l.push(...await on("view", n.views, r.views));
  const d = { schema_version: n.schema_version, ...n.permissions === void 0 ? {} : { permissions: n.permissions }, ...n.automations === void 0 ? {} : { automations: n.automations } }, h = { schema_version: r.schema_version, ...r.permissions === void 0 ? {} : { permissions: r.permissions }, ...r.automations === void 0 ? {} : { automations: r.automations } }, b = await Dt("table_structure", "table", d, !0, h, !0);
  return b && l.push(b), l;
}
function vf(t) {
  const e = JSON.parse(t), n = e.workbook;
  if (!e || e.schema_version !== 1 || !n || typeof n.id != "string" || !n.id.trim() || !Array.isArray(n.sheetOrder) || !n.sheets || typeof n.sheets != "object" || Array.isArray(n.sheets) || !Array.isArray(e.charts) || !Array.isArray(e.pivots) || !Array.isArray(e.protected_ranges)) throw Error("电子表格内容结构无效。");
  for (const [r, i] of Object.entries(n.sheets))
    if (!i || typeof i != "object" || Array.isArray(i) || i.id !== r) throw Error("工作表缺少稳定 ID。");
  return e;
}
function Af(t) {
  const e = /* @__PURE__ */ new Map();
  for (const [n, r] of Object.entries(qn(t.cellData)))
    for (const [i, s] of Object.entries(qn(r)))
      s && typeof s == "object" && !Array.isArray(s) && e.set(`${n}:${i}`, s);
  return e;
}
function Cf(t) {
  const e = t || {}, n = Ft(e, ["f", "si", "s"]), r = Object.fromEntries(["f", "si"].filter((i) => i in e).map((i) => [i, e[i]]));
  return {
    base: { value: n, found: Object.keys(n).length > 0 },
    formula: { value: r, found: Object.keys(r).length > 0 },
    style: { value: e.s, found: "s" in e }
  };
}
function y1(t) {
  const e = qn(t), n = ["startRow", "startColumn", "endRow", "endColumn"];
  return n.every((r) => r in e) ? n.map((r) => String(e[r])).join(":") : "";
}
async function Jc(t, e, n, r) {
  const i = [];
  for (const [s, a] of n) {
    const l = await Dt(t, s, e.get(s), e.has(s), a, !0, r);
    l && i.push(l);
  }
  for (const [s, a] of e)
    n.has(s) || i.push({ id: kt(), target: t, target_id: s, parent_id: r, action: "delete", expected_hash: await Tt(a) });
  return i;
}
async function w1(t, e) {
  const n = vf(t), r = vf(e), i = n.workbook, s = r.workbook;
  if (i.id !== s.id || n.schema_version !== r.schema_version) throw Error("电子表格稳定 ID 和协议版本不允许修改。");
  const a = [];
  for (const [p, g] of Object.entries(i.sheets))
    p in s.sheets || a.push({ id: kt(), target: "sheet", target_id: p, action: "delete", expected_hash: await Tt(g) });
  for (const [p, g] of Object.entries(s.sheets)) {
    const _ = i.sheets[p];
    if (!_) {
      a.push({ id: kt(), target: "sheet", target_id: p, action: "upsert", expected_hash: "", value: g });
      continue;
    }
    const k = Ft(_, ["cellData", "mergeData"]), y = Ft(g, ["cellData", "mergeData"]), C = await Dt("sheet_structure", p, k, !0, y, !0);
    C && a.push(C);
    const S = Af(_), x = Af(g), z = /* @__PURE__ */ new Set([...S.keys(), ...x.keys()]);
    for (const R of z) {
      const B = Cf(S.get(R)), U = Cf(x.get(R)), Q = await Dt("cell", R, B.base.value, B.base.found, U.base.value, U.base.found, p), K = await Dt("formula", R, B.formula.value, B.formula.found, U.formula.value, U.formula.found, p), pe = await Dt("cell_style", R, B.style.value, B.style.found, U.style.value, U.style.found, p);
      Q && a.push(Q), K && a.push(K), pe && a.push(pe);
    }
    const N = (R) => new Map((Array.isArray(R.mergeData) ? R.mergeData : []).map((B) => [y1(B), B]).filter(([B]) => !!B));
    a.push(...await Jc("merge", N(_), N(g), p));
  }
  const l = new Map(Object.entries(qn(i.styles))), d = new Map(Object.entries(qn(s.styles)));
  a.push(...await Jc("style", l, d));
  const h = Ft(i, ["sheets", "styles"]), b = Ft(s, ["sheets", "styles"]), m = await Dt("workbook_structure", i.id, h, !0, b, !0);
  return m && a.push(m), a.push(...await on("chart", n.charts, r.charts)), a.push(...await on("pivot", n.pivots, r.pivots)), a.push(...await on("protected_range", n.protected_ranges, r.protected_ranges)), a;
}
function vn(t) {
  const e = JSON.parse(t);
  if (!e || typeof e != "object" || Array.isArray(e)) throw Error("图形内容结构无效。");
  return e;
}
function rn(t, e) {
  if (!Array.isArray(t)) throw Error(`${e}内容结构无效。`);
  return t.map((n) => {
    if (!n || typeof n != "object" || Array.isArray(n) || typeof n.id != "string" || !n.id.trim()) throw Error(`${e}缺少稳定 ID。`);
    return n;
  });
}
async function em(t, e, n) {
  const r = Ft(t, n), i = Ft(e, n);
  return Dt("graph_structure", "graph", r, !0, i, !0);
}
async function _1(t, e) {
  const n = vn(t), r = vn(e), i = rn(n.elements, "画板元素"), s = rn(r.elements, "画板元素"), a = (h) => h.type === "arrow" || h.type === "line", l = [
    ...await on("node", i.filter((h) => !a(h)), s.filter((h) => !a(h))),
    ...await on("edge", i.filter(a), s.filter(a))
  ], d = await em(n, r, ["elements"]);
  return d && l.push(d), l;
}
async function k1(t, e) {
  const n = vn(t), r = vn(e), i = [
    ...await on("node", rn(n.nodes, "流程节点"), rn(r.nodes, "流程节点")),
    ...await on("edge", rn(n.edges, "流程连线"), rn(r.edges, "流程连线"))
  ], s = await em(n, r, ["nodes", "edges"]);
  return s && i.push(s), i;
}
function If(t) {
  const e = [], n = (r, i, s) => {
    if (!r || typeof r != "object" || Array.isArray(r)) throw Error("思维导图节点结构无效。");
    const a = r;
    if (typeof a.id != "string" || !a.id.trim()) throw Error("思维导图节点缺少稳定 ID。");
    const { children: l = [], ...d } = a;
    if (!Array.isArray(l)) throw Error("思维导图子节点结构无效。");
    e.push({ node: d, parent_id: i, index: s }), l.forEach((h, b) => n(h, a.id, b));
  };
  return n(t, "", 0), e;
}
async function v1(t, e) {
  const n = vn(t), r = vn(e), i = qn(n.root), s = qn(r.root), a = If(i), l = If(s), d = new Map(a.map((_) => [_.node.id, _])), h = new Map(l.map((_) => [_.node.id, _])), b = [];
  for (const _ of l) {
    const k = d.get(_.node.id), y = await Dt("node", _.node.id, k, !!k, _, !0);
    y && b.push(y);
  }
  for (const _ of a)
    h.has(_.node.id) || _.parent_id && !h.has(_.parent_id) || b.push({ id: kt(), target: "node", target_id: _.node.id, action: "delete", expected_hash: await Tt(_) });
  b.push(...await on("edge", rn(n.relations, "思维导图连线"), rn(r.relations, "思维导图连线")));
  const m = Ft(n, ["root", "relations"]), p = Ft(r, ["root", "relations"]), g = await Dt("graph_structure", "graph", m, !0, p, !0);
  return g && b.push(g), b;
}
function Sf(t) {
  return rn(t.slides, "幻灯片");
}
function Ef(t, e) {
  return { ...Ft(t, ["slides"]), slide_order: e.map((n) => n.id) };
}
async function A1(t, e) {
  const n = vn(t), r = vn(e), i = Sf(n), s = Sf(r), a = Di(i), l = Di(s), d = [];
  for (const p of i)
    l.has(p.id) || d.push({ id: kt(), target: "slide", target_id: p.id, action: "delete", expected_hash: await Tt(p) });
  for (const p of s) {
    const g = a.get(p.id);
    if (!g) {
      d.push({ id: kt(), target: "slide", target_id: p.id, action: "upsert", expected_hash: "", value: p });
      continue;
    }
    const _ = Ft(g, ["elements", "files"]), k = Ft(p, ["elements", "files"]), y = await Dt("slide", p.id, _, !0, k, !0);
    y && d.push(y);
    const C = await on("node", rn(Array.isArray(g.elements) ? g.elements : [], "幻灯片元素"), rn(Array.isArray(p.elements) ? p.elements : [], "幻灯片元素"));
    d.push(...C.map((S) => ({ ...S, target: "element", parent_id: p.id }))), d.push(...await Jc("asset", new Map(Object.entries(qn(g.files))), new Map(Object.entries(qn(p.files))), p.id));
  }
  const h = Ef(n, i), b = Ef(r, s), m = await Dt("presentation_structure", "presentation", h, !0, b, !0);
  return m && d.push(m), d;
}
function xf(t) {
  if (!Array.isArray(t.components)) throw Error("问卷组件结构无效。");
  return t.components.map((e) => {
    if (!e || typeof e != "object" || Array.isArray(e) || typeof e.key != "string" || !e.key) throw Error("问卷组件缺少稳定 key。");
    return e;
  });
}
function Nf(t, e) {
  return { ...Ft(t, ["components"]), component_order: e.map((n) => n.key) };
}
async function C1(t, e) {
  const n = vn(t), r = vn(e), i = xf(n), s = xf(r), a = new Map(i.map((p) => [p.key, p])), l = new Map(s.map((p) => [p.key, p])), d = [];
  for (const p of s) {
    const g = await Dt("component", p.key, a.get(p.key), a.has(p.key), p, !0);
    g && d.push(g);
  }
  for (const p of i)
    l.has(p.key) || d.push({ id: kt(), target: "component", target_id: p.key, action: "delete", expected_hash: await Tt(p) });
  const h = Nf(n, i), b = Nf(r, s), m = await Dt("form_structure", "form", h, !0, b, !0);
  return m && d.push(m), d;
}
async function tm(t, e, n) {
  switch (t) {
    case "multidimensional_table":
      return b1(e, n);
    case "spreadsheet":
      return w1(e, n);
    case "whiteboard":
      return _1(e, n);
    case "mind_map":
      return v1(e, n);
    case "flowchart":
      return k1(e, n);
    case "presentation":
      return A1(e, n);
    case "form":
      return C1(e, n);
    default:
      return;
  }
}
const I1 = [
  "text",
  "long_text",
  "number",
  "currency",
  "single_select",
  "multi_select",
  "person",
  "date",
  "attachment",
  "checkbox",
  "progress",
  "rating",
  "email",
  "phone",
  "url",
  "barcode",
  "formula",
  "relation",
  "lookup",
  "created_time",
  "updated_time",
  "auto_number"
], S1 = ["grid", "kanban", "gantt", "calendar", "gallery", "form"], Vc = (t) => Array.isArray(t) ? t.filter((e) => typeof e == "string") : [], Za = (t) => Array.isArray(t) ? t.filter((e) => !!e && typeof e == "object" && !Array.isArray(e)) : [];
function E1(t) {
  const e = JSON.parse(t);
  if (!e || !Array.isArray(e.fields) || !Array.isArray(e.records) || !Array.isArray(e.views)) throw Error("多维表格内容结构无效。");
  const n = Za(e.fields).map((s) => ({ ...s, id: String(s.id || ""), name: String(s.name || ""), type: String(s.type || "") })), r = Za(e.records).map((s) => ({ ...s, id: String(s.id || ""), values: s.values && typeof s.values == "object" && !Array.isArray(s.values) ? s.values : {} })), i = Za(e.views).map((s) => ({ ...s, id: String(s.id || ""), name: String(s.name || ""), type: String(s.type || "") }));
  if (n.some((s) => !s.id || !s.name || !I1.includes(s.type)) || r.some((s) => !s.id) || i.some((s) => !s.id || !s.name || !S1.includes(s.type))) throw Error("多维表格字段、记录或视图缺少稳定标识。");
  return { schema_version: 1, fields: n, records: r, views: i, permissions: e.permissions, automations: e.automations };
}
function RC(t) {
  return {
    text: "单行文本",
    long_text: "多行文本",
    number: "数字",
    currency: "金额",
    single_select: "单选",
    multi_select: "多选",
    person: "人员",
    date: "日期",
    attachment: "附件",
    checkbox: "复选框",
    progress: "进度",
    rating: "评分",
    email: "邮箱",
    phone: "电话",
    url: "网址",
    barcode: "条码",
    formula: "公式",
    relation: "关联",
    lookup: "查找引用",
    created_time: "创建时间",
    updated_time: "更新时间",
    auto_number: "自动编号"
  }[t];
}
function TC(t) {
  return { grid: "表格", kanban: "看板", gantt: "甘特", calendar: "日历", gallery: "画册", form: "表单" }[t];
}
function Io(t) {
  return Array.isArray(t) ? t.join(" ").toLocaleLowerCase() : typeof t == "boolean" ? t ? 1 : 0 : typeof t == "number" ? t : String(t ?? "").toLocaleLowerCase();
}
function nm(t, e) {
  const n = Io(t), r = Io(e.value);
  switch (e.operator) {
    case "eq":
      return n === r;
    case "neq":
      return n !== r;
    case "contains":
      return String(n).includes(String(r));
    case "empty":
      return t == null || t === "" || Array.isArray(t) && t.length === 0;
    case "not_empty":
      return !nm(t, { operator: "empty" });
    case "gt":
      return n > r;
    case "gte":
      return n >= r;
    case "lt":
      return n < r;
    case "lte":
      return n <= r;
  }
}
const kc = /\{([a-zA-Z0-9_-]{1,128})\}|(\d+(?:\.\d+)?)|([+\-*/()])/g;
function x1(t, e) {
  const n = t.replace(/\s+/g, "");
  let r = "", i = 0, s;
  for (kc.lastIndex = 0; s = kc.exec(n); ) {
    if (s.index !== i) return null;
    if (i = kc.lastIndex, s[1]) {
      const a = e.values[s[1]];
      if (typeof a != "number" || !Number.isFinite(a)) return null;
      r += String(a);
    } else r += s[0];
  }
  if (i !== n.length || !r || r.length > 512) return null;
  try {
    const a = Function(`"use strict"; return (${r})`)();
    return typeof a == "number" && Number.isFinite(a) ? a : null;
  } catch {
    return null;
  }
}
function Ya(t, e, n) {
  return n.type === "created_time" ? e.created_at || "" : n.type === "updated_time" ? e.updated_at || e.created_at || "" : n.type === "auto_number" ? t.records.findIndex((r) => r.id === e.id) + 1 : n.type === "formula" ? x1(n.formula || "", e) : n.type === "lookup" && n.lookup ? Vc(e.values[n.lookup.relation_field_id]).map((s) => t.records.find((a) => a.id === s)?.values[n.lookup.target_field_id]).filter((s) => s != null && s !== "") : e.values[n.id];
}
function FC(t, e) {
  const n = new Map(t.fields.map((s) => [s.id, s])), r = t.records.filter((s) => (e.filters || []).every((a) => {
    const l = n.get(a.field_id);
    return l ? nm(Ya(t, s, l), a) : !0;
  })), i = (e.sorts || []).filter((s) => n.has(s.field_id));
  return i.length ? [...r].sort((s, a) => {
    for (const l of i) {
      const d = n.get(l.field_id), h = Io(Ya(t, s, d)), b = Io(Ya(t, a, d)), m = h < b ? -1 : h > b ? 1 : 0;
      if (m) return l.direction === "asc" ? m : -m;
    }
    return 0;
  }) : r;
}
function LC(t, e, n) {
  const r = Ya(t, e, n);
  return n.type === "checkbox" ? r ? "是" : "否" : n.type === "progress" ? `${Number(r || 0)}%` : n.type === "rating" ? "★".repeat(Math.max(0, Math.min(5, Number(r || 0)))) : n.type === "currency" ? new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(Number(r || 0)) : n.type === "single_select" ? n.options?.find((i) => i.id === r)?.label || String(r ?? "") : n.type === "multi_select" ? Vc(r).map((i) => n.options?.find((s) => s.id === i)?.label || i).join("、") : n.type === "attachment" ? Za(r).map((i) => String(i.title || i.name || "附件")).join("、") : n.type === "relation" ? Vc(r).map((i) => t.records.find((s) => s.id === i)?.values.title || i).join("、") : Array.isArray(r) ? r.join("、") : String(r ?? "");
}
function OC(t, e) {
  switch (t.type) {
    case "number":
    case "currency":
      return e === "" ? null : Number(e);
    case "checkbox":
      return !!e;
    case "progress":
      return Math.max(0, Math.min(100, Number(e || 0)));
    case "rating":
      return Math.max(0, Math.min(5, Number(e || 0)));
    case "multi_select":
    case "person":
    case "relation":
      return String(e).split(",").map((n) => n.trim()).filter(Boolean);
    default:
      return e;
  }
}
function rm(t, e, n) {
  const r = E1(t), i = /* @__PURE__ */ new Map();
  for (const a of e)
    a.target === "record" ? i.set(a.target_id, { trigger: a.action === "upsert" && !a.expected_hash ? "record_created" : "record_updated", operationID: a.id }) : a.target === "cell" && !i.has(a.target_id) && i.set(a.target_id, { trigger: "record_updated", operationID: a.id });
  const s = [];
  for (const [a, l] of i) for (const d of r.automations || [])
    !d.enabled || d.trigger !== l.trigger || s.push({ execution_id: `exec_${l.operationID}_${d.id}`.slice(0, 96), automation_id: d.id, trigger: l.trigger, record_id: a, expected_draft_revision: n });
  return s;
}
const oi = 2, ni = {
  all: "全部页面",
  shortcuts: "快捷入口",
  favorites: "收藏",
  recent_views: "最近访问",
  recent_edits: "最近编辑",
  subscribed: "订阅",
  trash: "回收站"
}, N1 = /* @__PURE__ */ new Set(["multidimensional_table", "spreadsheet", "presentation", "form", "whiteboard", "mind_map", "flowchart"]), Df = { "": "未设置", in_progress: "编写中", in_review: "待复核", verified: "已核验", deprecated: "已过时" }, D1 = { write: "续写", summarize: "总结", translate: "翻译", rewrite: "改写", answer: "问答" }, B1 = { pending: "等待执行", running: "正在生成", completed: "等待确认", failed: "执行失败", confirmed: "已确认并写回" }, P1 = { text: "文本", number: "数字", date: "日期", select: "选项", checkbox: "勾选", person: "人员" }, M1 = {
  "knowledge.page.governance_set": "更新治理规则",
  "knowledge.page.governance_reviewed": "完成内容复核"
};
function z1(t) {
  if (!t) return "";
  const e = new Date(t);
  return Number.isNaN(e.getTime()) ? "" : new Date(e.getTime() - e.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
}
function R1(t) {
  if (!t) return;
  const e = new Date(t);
  return Number.isNaN(e.getTime()) ? void 0 : e.toISOString();
}
function as(t) {
  const e = (n) => {
    if (!n) return;
    const r = new Date(n);
    return !Number.isNaN(r.getTime()) && r.getUTCFullYear() >= 2e3 ? n : void 0;
  };
  return {
    ...t,
    aliases: t.aliases || [],
    related_page_ids: t.related_page_ids || [],
    tags: t.tags || [],
    content_admin_user_ids: t.content_admin_user_ids || [],
    properties: t.properties || [],
    review_interval_days: t.review_interval_days ?? 180,
    archive_retention_days: t.archive_retention_days ?? 365,
    next_review_at: e(t.next_review_at),
    last_reviewed_at: e(t.last_reviewed_at),
    archived_at: e(t.archived_at),
    retain_until: e(t.retain_until),
    updated_at: e(t.updated_at)
  };
}
function Ta(t) {
  return {
    ownerUserID: t.owner_user_id || "",
    contentAdminUserIDs: [...t.content_admin_user_ids],
    archiveRetentionDays: t.archive_retention_days,
    reviewIntervalDays: t.review_interval_days,
    nextReviewAt: t.next_review_at
  };
}
function eo(t) {
  const e = /* @__PURE__ */ new Set();
  return t.split(/[,，\n]/).map((n) => n.trim()).filter((n) => {
    const r = n.toLocaleLowerCase();
    return !n || e.has(r) ? !1 : (e.add(r), !0);
  });
}
function Fa(t) {
  return eo(t);
}
function to(t) {
  return t.path.map((e) => e.title).join(" / ") || t.title;
}
async function cs(t) {
  const e = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return [...new Uint8Array(e)].map((n) => n.toString(16).padStart(2, "0")).join("");
}
function At(t) {
  return typeof t == "object" && t !== null && "status" in t && typeof t.status == "number" ? t.status : 0;
}
function Bf(t) {
  if (typeof t != "object" || t === null || !("conflict" in t)) return null;
  const e = t.conflict;
  return typeof e != "object" || e === null || !("current_draft_revision" in e) || typeof e.current_draft_revision != "number" ? null : e;
}
function T1(t) {
  return { queued: "等待索引", indexing: "正在索引", ready: "已可检索", failed: "索引失败", none: "尚未索引" }[t.projection_status || "none"];
}
const Pf = ["#176b52", "#315f9d", "#9a5a17", "#7a4b9d", "#a13f5b"], F1 = ["👍", "❤️", "🎉", "👀", "😄", "🚀"];
function vc(t) {
  return Pf[[...t].reduce((e, n) => e + n.codePointAt(0), 0) % Pf.length];
}
function L1(t, e = Date.now()) {
  const n = Math.max(0, e - Date.parse(t));
  return !Number.isFinite(n) || n < 15e3 ? "刚刚活跃" : n < 6e4 ? `${Math.floor(n / 1e3)} 秒前活跃` : n < 36e5 ? `${Math.floor(n / 6e4)} 分钟前活跃` : new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " 活跃";
}
function O1({ client: t, library: e, currentUserID: n, canWrite: r, formatError: i, reference: s, onOpen: a }) {
  const [l, d] = P(null), [h, b] = P(null), [m, p] = P(""), [g, _] = P(!1), [k, y] = P(!1), [C, S] = P(!0), [x, z] = P(!1), [N, R] = P(""), B = De(!1);
  B.current = k;
  const U = s.referenceMode === "live", Q = U && s.embeddedEdit && r && l?.page.state === "active" && !!l.draft, K = hg({
    active: !!(g && Q && l?.page.content_type === "document"),
    client: t,
    libraryID: e.id,
    pageID: s.targetPageID,
    currentUserID: n,
    initialTitle: l?.draft?.title || l?.page.title || s.title,
    initialContent: m,
    onDocument(T, fe, Z) {
      p(fe), y(!Z);
    },
    onError(T) {
      _(!1), d(null), R(At(T) === 403 || At(T) === 404 ? "引用权限已撤销，内容已关闭。" : i(T));
    }
  });
  Ae(() => {
    let T = !0;
    const fe = new AbortController();
    let Z = !1, ke = 0, q = 0, ge = 0;
    const W = (re) => {
      Z = !0, fe.signal.aborted || fe.abort(), _(!1), d(null), b(null), p(""), R(re), S(!1);
    }, H = async (re) => {
      const we = ++q;
      re && S(!0);
      try {
        const _e = await t.getPage(e.id, s.targetPageID, r && U, fe.signal);
        let Ce = null;
        if (U || (Ce = await t.getPageVersion(e.id, s.targetPageID, s.targetVersion, fe.signal)), !T || we !== q) return !1;
        if (ke = _e.page.revision, d(_e), b(Ce), R(""), !B.current && !K.available) {
          const xe = Ce || (g && _e.draft ? _e.draft : _e.published || _e.draft);
          p(xe?.body.content || ""), y(!1);
        }
        return !0;
      } catch (_e) {
        return !T || fe.signal.aborted || we !== q || (At(_e) === 403 || At(_e) === 404 ? W("引用不可用或权限已撤销。") : R(i(_e))), !1;
      } finally {
        T && re && S(!1);
      }
    }, ye = (re) => new Promise((we) => {
      ge = window.setTimeout(we, re), fe.signal.addEventListener("abort", () => {
        window.clearTimeout(ge), we();
      }, { once: !0 });
    });
    (async () => {
      if (!await H(!0) || !T || !U || !t.streamKnowledgePageLiveEvents) return;
      let re = 0;
      for (; T && !Z && !fe.signal.aborted; ) {
        try {
          if (re > 0 && !await H(!1) && Z || (await t.streamKnowledgePageLiveEvents(e.id, s.targetPageID, ke, (we) => {
            ke = Math.max(ke, we.revision), we.type === "revoked" ? W("引用权限已撤销，内容已关闭。") : we.type === "changed" && H(!1);
          }, fe.signal), !T || Z || fe.signal.aborted)) return;
          re++;
        } catch (we) {
          if (!T || Z || fe.signal.aborted) return;
          if (At(we) === 403 || At(we) === 404) {
            W("引用权限已撤销，内容已关闭。");
            return;
          }
          re++, R("实时更新连接暂时中断，正在重连。");
        }
        await ye(Math.min(8e3, 500 * 2 ** Math.min(re - 1, 4)));
      }
    })();
    const de = () => {
      document.visibilityState === "visible" && H(!1);
    };
    return window.addEventListener("focus", de), document.addEventListener("visibilitychange", de), () => {
      T = !1, fe.abort(), ge && window.clearTimeout(ge), window.removeEventListener("focus", de), document.removeEventListener("visibilitychange", de);
    };
  }, [r, t, K.available, g, i, e.id, U, s.targetPageID, s.targetVersion]);
  const pe = async () => {
    if (!(!l?.draft || !Q || x)) {
      z(!0), R("");
      try {
        let T = l;
        const fe = t.applyPageNativeOperations ? await tm(l.page.content_type, l.draft.body.content, m) : void 0;
        if (fe && t.applyPageNativeOperations) {
          fe.length > 0 && (T = (await t.applyPageNativeOperations(e.id, l.page.id, { client_id: crypto.randomUUID(), base_draft_revision: l.draft.draft_revision, operations: fe }, AbortSignal.timeout(3e4))).view);
          const Z = T.draft;
          if (Z && T.page.content_type === "multidimensional_table" && t.executeGridAutomation)
            for (const ke of rm(Z.body.content, fe, Z.draft_revision)) {
              const q = T.draft;
              if (!q) throw Error("目标页面草稿不可用。");
              ke.expected_draft_revision = q.draft_revision, T = (await t.executeGridAutomation(e.id, T.page.id, ke, AbortSignal.timeout(3e4))).view;
            }
        } else
          T = await t.savePageDraft(e.id, l.page.id, {
            client_id: crypto.randomUUID(),
            expected_draft_revision: l.draft.draft_revision,
            expected_page_revision: l.page.revision,
            title: l.draft.title,
            parent_page_id: l.draft.parent_page_id,
            rank: l.draft.rank,
            content_schema_version: oi,
            content: m,
            content_sha256: await cs(m)
          }, AbortSignal.timeout(3e4));
        d(T), p(T.draft?.body.content || m), y(!1);
      } catch (T) {
        R(i(T));
      } finally {
        z(!1);
      }
    }
  };
  if (C) return /* @__PURE__ */ u("div", { className: "knowledge-reference-loading", children: [
    /* @__PURE__ */ c(si, { className: "knowledge-spin", size: 16 }),
    "正在加载引用…"
  ] });
  if (!l || N && !m) return /* @__PURE__ */ u("div", { className: "knowledge-reference-revoked", children: [
    /* @__PURE__ */ c(jn, { size: 17 }),
    /* @__PURE__ */ u("div", { children: [
      /* @__PURE__ */ c("strong", { children: "引用不可用" }),
      /* @__PURE__ */ c("small", { children: N || "你没有权限查看此页面" })
    ] })
  ] });
  const E = h || (g && l.draft ? l.draft : l.published || l.draft), F = U ? Q ? "可编辑" : "只读" : `固定版本 ${s.targetVersion}`, v = /* @__PURE__ */ u("header", { className: "knowledge-reference-header", children: [
    /* @__PURE__ */ c(Rt, { type: l.page.content_type, size: 17 }),
    /* @__PURE__ */ u("div", { children: [
      /* @__PURE__ */ c("strong", { children: E?.title || l.page.title }),
      /* @__PURE__ */ u("small", { children: [
        Vt[l.page.content_type].label,
        " · ",
        l.page.state === "active" ? F : "已归档",
        " · 更新于 $",
        new Date(l.page.updated_at).toLocaleString()
      ] })
    ] }),
    /* @__PURE__ */ c("button", { type: "button", onClick: () => a(l.page.id), children: "打开页面" })
  ] });
  return s.display === "card" ? /* @__PURE__ */ c("div", { className: "knowledge-reference-card", children: v }) : /* @__PURE__ */ u("section", { className: "knowledge-reference-embed", children: [
    v,
    /* @__PURE__ */ u("div", { className: "knowledge-reference-embed-actions", children: [
      Q && /* @__PURE__ */ c("button", { type: "button", onClick: () => {
        _((T) => !T), y(!1), p((l.draft || E)?.body.content || "");
      }, children: g ? "退出内嵌编辑" : "内嵌编辑" }),
      g && Q && l.page.content_type !== "document" && /* @__PURE__ */ c("button", { type: "button", disabled: !k || x, onClick: () => {
        pe();
      }, children: x ? "保存中…" : "保存目标草稿" }),
      K.available && /* @__PURE__ */ c("span", { children: K.state === "connected" ? "目标协作已连接" : "正在连接目标协作…" })
    ] }),
    l.page.content_type === "file" && E ? /* @__PURE__ */ c(Hc, { client: t, libraryID: e.id, pageID: l.page.id, content: E.body.content, formatError: i }) : E ? /* @__PURE__ */ c(
      di,
      {
        type: l.page.content_type,
        body: m || E.body.content,
        documentTitle: E.title,
        canManage: e.role === "manager",
        gridAccess: l.grid_access,
        collaboration: K.available && K.ready ? K.editorCollaboration : void 0,
        readOnly: !g || !Q || K.available && !K.ready,
        readFile: async (T) => {
          const fe = /^knowledge-document:(kdoc_[a-f0-9]{32})$/.exec(T);
          if (!fe) throw Error("文件引用无效。");
          const Z = await t.readDocumentContent(e.id, fe[1], { signal: AbortSignal.timeout(12e4) });
          if (!Z.ok) throw Error(`文件读取失败（HTTP ${Z.status}）。`);
          return Z.blob();
        },
        authorizeContentAction: async (T) => {
          if (!t.authorizePageContentOperation) throw Error("当前宿主未启用页面内容保护。");
          await t.authorizePageContentOperation(e.id, l.page.id, T, AbortSignal.timeout(3e4));
        },
        onActionFeedback: (T) => R(T),
        onChange: (T, fe) => {
          p(T), y(!0), K.available && K.edit(E.title, T, fe);
        },
        onPresence: K.available ? K.updatePresence : void 0
      }
    ) : /* @__PURE__ */ c("div", { className: "knowledge-reference-empty", children: "目标页面还没有可显示的内容。" }),
    N && /* @__PURE__ */ c("p", { className: "knowledge-reference-error", role: "alert", children: N })
  ] });
}
const Mf = { hierarchy: "父子层级", reference: "正文引用", related: "关联页面" };
function U1({ graph: t, onOpen: e }) {
  const a = t.nodes.find((h) => h.page_id === t.center_page_id), l = t.nodes.filter((h) => h.page_id !== t.center_page_id), d = /* @__PURE__ */ new Map();
  return a && d.set(a.page_id, { x: 410, y: 215 }), l.forEach((h, b) => {
    const m = -Math.PI / 2 + b * (Math.PI * 2 / Math.max(1, l.length));
    d.set(h.page_id, { x: 410 + Math.cos(m) * 300, y: 215 + Math.sin(m) * 155 });
  }), /* @__PURE__ */ u("div", { className: "knowledge-relationship-graph-view", children: [
    /* @__PURE__ */ u("svg", { viewBox: "0 0 820 430", role: "img", "aria-label": `以${a?.title || "当前页面"}为中心的知识关系图`, children: [
      /* @__PURE__ */ c("defs", { children: /* @__PURE__ */ c("marker", { id: "knowledge-relationship-arrow", viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse", children: /* @__PURE__ */ c("path", { d: "M 0 0 L 10 5 L 0 10 z" }) }) }),
      t.edges.map((h, b) => {
        const m = d.get(h.source_page_id), p = d.get(h.target_page_id);
        return !m || !p ? null : /* @__PURE__ */ u("g", { className: `is-${h.kind}`, children: [
          /* @__PURE__ */ c("line", { x1: m.x, y1: m.y, x2: p.x, y2: p.y, markerEnd: h.directed ? "url(#knowledge-relationship-arrow)" : void 0 }),
          /* @__PURE__ */ c("text", { x: (m.x + p.x) / 2, y: (m.y + p.y) / 2 - 5, children: Mf[h.kind] })
        ] }, `${h.source_page_id}:${h.target_page_id}:${h.kind}:${b}`);
      }),
      t.nodes.map((h) => {
        const b = d.get(h.page_id);
        if (!b) return null;
        const m = [...h.title].slice(0, 11).join("") + ([...h.title].length > 11 ? "…" : "");
        return /* @__PURE__ */ u("g", { className: `knowledge-relationship-node${h.center ? " is-center" : ""}`, transform: `translate(${b.x} ${b.y})`, role: "button", tabIndex: 0, "aria-label": `${h.title}，${to(h)}`, onClick: () => e(h.page_id), onKeyDown: (p) => {
          (p.key === "Enter" || p.key === " ") && (p.preventDefault(), e(h.page_id));
        }, children: [
          /* @__PURE__ */ c("rect", { x: "-75", y: "-29", width: "150", height: "58", rx: "12" }),
          /* @__PURE__ */ c("text", { className: "is-title", textAnchor: "middle", y: "-2", children: m }),
          /* @__PURE__ */ c("text", { className: "is-type", textAnchor: "middle", y: "16", children: Vt[h.content_type].label })
        ] }, h.page_id);
      })
    ] }),
    /* @__PURE__ */ u("div", { className: "knowledge-relationship-legend", "aria-label": "关系类型图例", children: [
      Object.entries(Mf).map(([h, b]) => /* @__PURE__ */ u("span", { className: `is-${h}`, children: [
        /* @__PURE__ */ c("i", {}),
        b
      ] }, h)),
      t.truncated && /* @__PURE__ */ u("em", { children: [
        "关系较多，图中仅展示受权范围内的前 ",
        t.nodes.length,
        " 个页面"
      ] })
    ] })
  ] });
}
function $1(t, e) {
  const n = [], r = e.toLocaleLowerCase();
  if (!r) return n;
  const i = document.createTreeWalker(t, NodeFilter.SHOW_TEXT, {
    acceptNode(s) {
      const a = s.parentElement;
      return !a || !s.textContent?.trim() || a.closest("button,input,textarea,select,script,style,[aria-hidden='true'],.knowledge-page-find-bar,.knowledge-page-toolbar,.knowledge-page-breadcrumbs,.knowledge-page-title") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  for (let s = i.nextNode(); s; s = i.nextNode()) {
    const a = s.textContent || "", l = a.toLocaleLowerCase();
    let d = l.indexOf(r);
    for (; d >= 0 && n.length < 500; ) {
      const h = document.createRange();
      h.setStart(s, d), h.setEnd(s, d + e.length), n.push(h), d = l.indexOf(r, d + Math.max(1, e.length));
    }
    if (n.length >= 500) break;
  }
  return n;
}
function Q1({ client: t, library: e, currentUserID: n = "", disabled: r, formatError: i, embedded: s = !1, initialPageID: a = "", initialBlockID: l, initialSearchLocation: d, initialPageMode: h = "read", onSelectionChange: b, onManage: m }) {
  const p = !e.archived && (e.role === "editor" || e.role === "manager"), [g, _] = P({}), [k, y] = P(/* @__PURE__ */ new Set()), [C, S] = P({}), [x, z] = P({}), [N, R] = P("all"), [B, U] = P([]), [Q, K] = P(""), [pe, E] = P(!0), [F, v] = P(!1), [T, fe] = P(null), [Z, ke] = P(!1), [q, ge] = P(null), [W, H] = P(""), [ye, me] = P(""), [de, re] = P(!1), [we, _e] = P(!1), [Ce, xe] = P(""), [ze, Ge] = P([]), [Re, w] = P(null), [ie, X] = P(!1), [M, D] = P(!1), [j, le] = P([]), [O, $] = P(""), [se, ue] = P(!0), [oe, ce] = P(!1), [Se, Ne] = P(""), [je, ft] = P(""), [it, wt] = P([]), [Ue, Cn] = P([]), [Jn, It] = P(""), [In, Ur] = P(""), [Sn, Vn] = P(!0), [En, Be] = P(!0), [Bt, wr] = P(!1), [$t, Kn] = P(null), [_r, $r] = P(!1), [St, Zt] = P(""), [kr, vr] = P([]), [Ts, Qr] = P(!1), [ne, et] = P(a), [Y, dt] = P(null), [Fs, jr] = P(!0), [qo, Ho] = P(0), [J, be] = P(""), [Qe, ae] = P(""), [Qt, Pe] = P(""), [Yt, Wn] = P(!1), [ln, Go] = P(""), [jt, zd] = P(0), [Jo, Ti] = P(0), [Ls, Xn] = P(!1), [sm, am] = P({ top: 0, left: 0, maxHeight: 560 }), [om, Fi] = P(!1), [Vo, Rd] = P([]), [Td, Fd] = P({}), [Os, Us] = P(""), [$s, Ko] = P(""), [Ld, Wo] = P(""), [Pt, cn] = P(""), [xn, Qs] = P(null), [js, qr] = P(null), [Xo, Od] = P(!1), [he, Je] = P("read"), [dn, Nn] = P(""), [un, hn] = P(""), [en, Dn] = P(!1), [Bn, qt] = P("idle"), [Zn, Pn] = P("idle"), [Li, Yn] = P(null), [qs, Hs] = P(""), [Zo, Yo] = P([]), [Gs, Ud] = P(null), [Oi, $d] = P([]), [Qd, el] = P(0), [tl, nl] = P(!0), [jd, rl] = P([]), [qd, il] = P(0), [Hd, sl] = P(!0), [er, Gd] = P(null), [Ui, tr] = P([]), [Js, al] = P(""), [$i, lm] = P(!1), [Jd, Vs] = P(""), [ol, Ks] = P(!0), [Vd, ll] = P(""), [cl, Ws] = P(""), [Xs, Kd] = P(""), [Wd, cm] = P([]), [Zs, Xd] = P([]), [qe, Hr] = P({}), [Qi, Ys] = P(""), [dm, Zd] = P({}), [Ht, ea] = P(null), [ta, ji] = P({ nodeID: "", revision: 0 }), [dl, ul] = P([]), [Ar, Yd] = P("insert"), [na, hl] = P(""), [eu, fl] = P(""), [tu, pl] = P([]), [qi, Hi] = P(""), [nu, ra] = P([]), [ia, ru] = P(!1), [Gr, Gi] = P([]), [gl, ml] = P(!1), [um, sa] = P([]), [bl, yl] = P(!1), [wl, iu] = P(""), [hm, su] = P([]), [aa, au] = P(""), [Jr, fm] = P("knowledge.pages.get"), [oa, pm] = P(""), [_t, _l] = P(null), [Ji, kl] = P(null), [Vr, vl] = P("inherit"), [Al, Kr] = P([]), [Wr, Vi] = P(""), [gm, Cl] = P([]), [la, mm] = P("user"), [Il, bm] = P("reader"), [Sl, ym] = P("page"), [nr, ca] = P(!1), [rr, da] = P(null), [ou, ua] = P(!1), [fn, wm] = P("summarize"), [Ki, lu] = P("published"), [El, _m] = P(""), [xl, km] = P("简体中文"), [tt, ir] = P(null), [tn, ha] = P(!1), [cu, Gt] = P(""), [vm, du] = P(), Fe = De(null), pt = De({ title: "", body: "" }), fa = De(Promise.resolve()), Xr = De(null), Wi = De(null), Xi = De(null), Nl = De(0), Zr = De(""), Dl = De(0), sr = De(null), uu = De({}), pa = De(null), hu = De(null), Zi = De(null), Bl = De(null), Pl = De(null), Ml = De([]), ga = De(null), Mn = De([]), ma = De(/* @__PURE__ */ new Map()), Cr = De([]), ba = De(/* @__PURE__ */ new Map()), ve = hg({
    active: he === "edit" && p && !!ne && !!Y?.draft && Y.page.content_type === "document",
    client: t,
    libraryID: e.id,
    pageID: ne,
    currentUserID: n,
    initialTitle: dn,
    initialContent: un,
    resolveUserName: (o) => qe[o]?.display_name || o,
    resolveUserColor: vc,
    onDocument(o, f, A) {
      Nn(o), hn(f), pt.current = { title: o, body: f }, A && o.trim() && Cm(ne, o), Dn(!A), qt(A ? "saved" : "saving"), Yn(null);
    },
    onError(o) {
      ae(i(o));
    }
  }), ar = Xk({
    active: he === "edit" && p && !!ne && !!Y?.draft && ["whiteboard", "mind_map", "flowchart"].includes(Y.page.content_type),
    client: t,
    libraryID: e.id,
    pageID: ne,
    onSnapshot(o) {
      const f = Fe.current;
      if (!f?.draft || o.draft_revision <= f.draft.draft_revision || pt.current.title !== f.draft.title || pt.current.body !== f.draft.body.content) return;
      const A = f.page.id;
      t.getPage(e.id, A, !0, AbortSignal.timeout(3e4)).then((I) => {
        Fe.current?.page.id !== A || !I.draft || pt.current.title !== f.draft.title || pt.current.body !== f.draft.body.content || (Fe.current = I, dt(I), Nn(I.draft.title), hn(I.draft.body.content), pt.current = { title: I.draft.title, body: I.draft.body.content }, qt("saved"));
      }).catch((I) => ae(i(I)));
    },
    onError(o) {
      ae(i(o));
    }
  }), ya = ve.available ? ve.presence : ar.presence, zl = ve.available ? ve.onlineUsers : ar.onlineUsers, Am = ve.available || ar.available, wa = ve.userID || n;
  Ae(() => {
    b?.(Y ? { id: Y.page.id, title: Y.page.title } : null);
  }, [b, Y?.page.id, Y?.page.title]), Ae(() => {
    sr.current?.abort(), sr.current = null, ua(!1), ir(null), Gt(""), du(void 0);
  }, [ne]), Ae(() => () => sr.current?.abort(), []), Ae(() => {
    const o = (f) => {
      !Y || !(f.metaKey || f.ctrlKey) || f.altKey || f.key.toLocaleLowerCase() !== "f" || (f.preventDefault(), Wn(!0), window.setTimeout(() => Bl.current?.select()));
    };
    return window.addEventListener("keydown", o), () => window.removeEventListener("keydown", o);
  }, [Y]), Ae(() => {
    const o = CSS.highlights;
    if (o?.delete("knowledge-page-find"), o?.delete("knowledge-page-find-active"), Ml.current = [], zd(0), Ti(0), !Yt || !ln || !Pl.current) return;
    const f = window.setTimeout(() => {
      const A = $1(Pl.current, ln);
      Ml.current = A, zd(A.length), Ti(0);
      const I = window.Highlight;
      o && I && A.length && o.set("knowledge-page-find", new I(...A));
    }, 0);
    return () => {
      window.clearTimeout(f), o?.delete("knowledge-page-find"), o?.delete("knowledge-page-find-active");
    };
  }, [un, he, Yt, ln, ne, Y?.page.revision]), Ae(() => {
    const o = CSS.highlights;
    o?.delete("knowledge-page-find-active");
    const f = Ml.current[Jo], A = window.Highlight;
    if (f)
      return o && A && o.set("knowledge-page-find-active", new A(f)), (f.startContainer.parentElement || f.commonAncestorContainer.parentElement)?.scrollIntoView({ block: "center", behavior: "smooth" }), () => o?.delete("knowledge-page-find-active");
  }, [Jo, jt]);
  function Cm(o, f) {
    const A = f.trim();
    if (!o || !A) return;
    _((Ie) => {
      let $e = !1;
      const Ze = Object.fromEntries(Object.entries(Ie).map(([Le, or]) => [Le, or.map((lr) => lr.id !== o || lr.title === A ? lr : ($e = !0, { ...lr, title: A }))]));
      return $e ? Ze : Ie;
    }), U((Ie) => {
      let $e = !1;
      const Ze = Ie.map((Le) => Le.page.id !== o || Le.page.title === A ? Le : ($e = !0, { ...Le, page: { ...Le.page, title: A } }));
      return $e ? Ze : Ie;
    });
    const I = Fe.current;
    if (!I) return;
    const G = I.page.id === o && I.page.title !== A ? { ...I.page, title: A } : I.page, V = I.breadcrumbs.map((Ie) => Ie.page_id === o && Ie.title !== A ? { ...Ie, title: A } : Ie);
    if (G === I.page && V.every((Ie, $e) => Ie === I.breadcrumbs[$e])) return;
    const Ee = { ...I, page: G, breadcrumbs: V };
    Fe.current = Ee, dt(Ee);
  }
  function Rl(o) {
    et(o), window.setTimeout(() => uu.current[o]?.focus());
  }
  async function ut(o, f) {
    const A = [...new Set(o.filter(Boolean))];
    if (A.length !== 0)
      try {
        const I = await t.resolvePrincipals(A, f);
        f.aborted || Hr((G) => ({ ...G, ...Object.fromEntries(I.filter((V) => V.status === "active").map((V) => [V.user_id, V])) }));
      } catch {
      }
  }
  async function fu(o, f) {
    const A = [...new Set(o.filter(Boolean))];
    if (!A.length) return;
    const I = await t.resolveOrganizationPrincipals(A, f);
    f.aborted || Zd((G) => ({ ...G, ...Object.fromEntries(I.map((V) => [V.organization_id, V])) }));
  }
  function pu(o) {
    return o.type === "user" ? qe[o.id]?.display_name || o.id : dm[o.id]?.display_name || o.id;
  }
  async function Et(o = "", f = AbortSignal.timeout(3e4), A = !1) {
    const I = await t.listPages(e.id, o, A && C[o] || "", 50, !1, f);
    _((G) => ({ ...G, [o]: A ? [...G[o] || [], ...I.items] : I.items })), S((G) => ({ ...G, [o]: I.next_after || "" })), z((G) => ({ ...G, [o]: I.complete })), o && (I.items.length > 0 || !I.complete || y((V) => {
      if (!V.has(o)) return V;
      const Ee = new Set(V);
      return Ee.delete(o), Ee;
    })), o === "" && I.items[0] && et((G) => G || I.items[0].id);
  }
  Ae(() => {
    const o = new AbortController();
    return _({}), S({}), z({}), y(/* @__PURE__ */ new Set()), et(a), dt(null), jr(!0), ae(""), R("all"), U([]), K(""), E(!0), fe(null), ke(!1), ge(null), H(""), me(""), re(!1), _e(!1), xe(""), Ge([]), Kn(null), $r(!1), Zt(""), vr([]), Qr(!1), Xn(!1), Fi(!1), Rd([]), Fd({}), Us(""), Zr.current = "", Et("", o.signal).catch((f) => {
      o.signal.aborted || ae(i(f));
    }).finally(() => {
      o.signal.aborted || jr(!1);
    }), () => o.abort();
  }, [t, i, a, e.id]), Ae(() => {
    if (N === "all") {
      U([]), K(""), E(!0), v(!1);
      return;
    }
    const o = new AbortController();
    return v(!0), U([]), K(""), E(!0), ae(""), t.listPageCollection(e.id, N, "", 50, o.signal).then((f) => {
      o.signal.aborted || (U(f.items), K(f.next_after || ""), E(f.complete));
    }).catch((f) => {
      o.signal.aborted || ae(i(f));
    }).finally(() => {
      o.signal.aborted || v(!1);
    }), () => o.abort();
  }, [t, i, e.id, N]), Ae(() => {
    if (!ne) {
      dt(null), fe(null), ge(null), w(null), Kn(null);
      return;
    }
    const o = new AbortController();
    return jr(!0), ae(""), fe(null), ge(null), H(""), me(""), re(!1), _e(!1), w(null), X(!1), D(!1), le([]), $(""), ue(!0), Kn(null), Zt(""), vr([]), Xr.current = null, Wi.current = null, Xi.current = null, Promise.all([t.getPage(e.id, ne, p, o.signal), t.getPageMetadata(e.id, ne, o.signal)]).then(([f, A]) => {
      if (o.signal.aborted) return;
      const I = as(A);
      dt(f), Fe.current = f, ge(I), H(I.tags.join(", ")), me(I.aliases.join(", ")), w(Ta(I));
      const G = f.draft || f.published;
      Nn(G?.title || f.page.title), hn(G?.body.content || ""), pt.current = { title: G?.title || f.page.title, body: G?.body.content || "" };
      const V = Zr.current === f.page.id;
      V && (Zr.current = "");
      const Ee = f.page.id === a && h === "edit" && p;
      Dn(!1), qt("idle"), Pn("idle"), Yn(null), Je(V || Ee ? "edit" : "read"), Ud(null), $d([]), Gd(null), Yo([]), el(0), nl(!0), rl([]), il(0), sl(!0), tr([]), Vs(""), Ks(!0), al(""), ea(null), ji({ nodeID: "", revision: 0 }), Ys(""), ul([]), hl(""), fl(""), pl([]), Hi(""), kl(null), Kr([]), da(null), ut([f.published?.published_by_user_id || "", I.owner_user_id || "", ...I.content_admin_user_ids, I.last_reviewed_by_user_id || "", I.updated_by_user_id || "", ...I.properties.filter((Ie) => Ie.type === "person").map((Ie) => Ie.value)], o.signal), V && window.setTimeout(() => Zi.current?.select()), t.recordPageView(e.id, f.page.id, { client_id: crypto.randomUUID() }, o.signal).then((Ie) => {
        !o.signal.aborted && f.page.id === Fe.current?.page.id && fe(Ie);
      }).catch((Ie) => {
        o.signal.aborted || ae(i(Ie));
      });
    }).catch((f) => {
      o.signal.aborted || (dt(null), ae(i(f)));
    }).finally(() => {
      o.signal.aborted || jr(!1);
    }), () => o.abort();
  }, [p, t, i, a, h, e.id, ne]);
  async function Tl(o, f = AbortSignal.timeout(3e4)) {
    v(!0);
    try {
      const A = await t.listPageCollection(e.id, o, "", 50, f);
      U(A.items), K(A.next_after || ""), E(A.complete);
    } finally {
      v(!1);
    }
  }
  async function Im() {
    if (!(N === "all" || pe || !Q || F)) {
      v(!0), ae("");
      try {
        const o = await t.listPageCollection(e.id, N, Q, 50, AbortSignal.timeout(3e4));
        U((f) => [...f, ...o.items.filter((A) => !f.some((I) => I.page.id === A.page.id))]), K(o.next_after || ""), E(o.complete);
      } catch (o) {
        ae(i(o));
      } finally {
        v(!1);
      }
    }
  }
  async function Fl(o, f) {
    const A = T;
    if (!(!A || !ne || Z || Y?.page.state !== "active")) {
      ke(!0), ae("");
      try {
        const I = await t.setPagePersonalState(e.id, ne, {
          client_id: crypto.randomUUID(),
          expected_revision: A.revision,
          favorite: o.favorite ?? A.favorite,
          subscribed: o.subscribed ?? A.subscribed,
          shortcut_rank: o.shortcutRank ?? A.shortcut_rank
        }, AbortSignal.timeout(3e4));
        fe(I), U((G) => G.map((V) => V.page.id === ne ? { ...V, state: I } : V)), Pe(f), N !== "all" && await Tl(N);
      } catch (I) {
        if (At(I) === 409)
          try {
            fe(await t.getPagePersonalState(e.id, ne, AbortSignal.timeout(3e4)));
          } catch {
          }
        ae(i(I));
      } finally {
        ke(!1);
      }
    }
  }
  function pn(o) {
    ge((f) => f && o(f)), re(!0);
  }
  function Sm() {
    if (!q || q.properties.length >= 32) return;
    const o = new Set(q.properties.map((I) => I.name));
    let f = q.properties.length + 1;
    for (; o.has(`属性 ${f}`); ) f++;
    const A = { id: `prop_${crypto.randomUUID()}`, name: `属性 ${f}`, type: "text", value: "" };
    pn((I) => ({ ...I, properties: [...I.properties, A] }));
  }
  async function gu() {
    if (ne) {
      _e(!0), ae("");
      try {
        const o = as(await t.getPageMetadata(e.id, ne, AbortSignal.timeout(3e4)));
        ge(o), H(o.tags.join(", ")), me(o.aliases.join(", ")), re(!1), w(Ta(o)), X(!1), ut([o.owner_user_id || "", ...o.content_admin_user_ids, o.last_reviewed_by_user_id || "", o.updated_by_user_id || "", ...o.properties.filter((f) => f.type === "person").map((f) => f.value)], AbortSignal.timeout(3e4));
      } catch (o) {
        ae(i(o));
      } finally {
        _e(!1);
      }
    }
  }
  async function mu() {
    if (!(!q || !ne || we || !p || Y?.page.state !== "active")) {
      _e(!0), ae("");
      try {
        const o = as(await t.setPageMetadata(e.id, ne, {
          client_id: crypto.randomUUID(),
          expected_revision: q.revision,
          aliases: Fa(ye),
          related_page_ids: q.related_page_ids,
          tags: eo(W),
          status: q.status,
          properties: q.properties
        }, AbortSignal.timeout(3e4)));
        ge(o), H(o.tags.join(", ")), me(o.aliases.join(", ")), re(!1), Pe("页面属性和关联已保存。"), ut([o.owner_user_id || "", ...o.content_admin_user_ids, o.last_reviewed_by_user_id || "", o.updated_by_user_id || "", ...o.properties.filter((f) => f.type === "person").map((f) => f.value)], AbortSignal.timeout(3e4)), he === "relationships" && Ll();
      } catch (o) {
        ae(At(o) === 409 ? "页面属性已被其他人更新。请重新加载后再修改。" : i(o));
      } finally {
        _e(!1);
      }
    }
  }
  function Yi(o) {
    w((f) => f && o(f)), X(!0);
  }
  async function Em() {
    if (!(!q || !Re || !ne || M || e.role !== "manager")) {
      D(!0), ae("");
      try {
        const o = as(await t.setPageGovernance(e.id, ne, {
          client_id: crypto.randomUUID(),
          expected_revision: q.revision,
          owner_user_id: Re.ownerUserID,
          content_admin_user_ids: Re.contentAdminUserIDs,
          archive_retention_days: Re.archiveRetentionDays,
          review_interval_days: Re.reviewIntervalDays,
          next_review_at: Re.nextReviewAt
        }, AbortSignal.timeout(3e4)));
        ge((f) => f && de ? {
          ...o,
          aliases: f.aliases,
          related_page_ids: f.related_page_ids,
          tags: f.tags,
          status: f.status,
          properties: f.properties
        } : o), w(Ta(o)), X(!1), Pe("页面治理规则已保存。"), ut([o.owner_user_id || "", ...o.content_admin_user_ids, o.last_reviewed_by_user_id || "", o.updated_by_user_id || ""], AbortSignal.timeout(3e4)), Yr(!0);
      } catch (o) {
        ae(At(o) === 409 ? "页面治理规则已被其他人更新，请重新加载。" : i(o));
      } finally {
        D(!1);
      }
    }
  }
  async function xm() {
    if (!(!q || !ne || M || ie || Y?.page.state !== "active")) {
      D(!0), ae("");
      try {
        const o = as(await t.reviewPageGovernance(e.id, ne, { client_id: crypto.randomUUID(), expected_revision: q.revision }, AbortSignal.timeout(3e4)));
        ge(o), w(Ta(o)), Pe("本次内容复核已记录，下次复核时间已更新。"), ut([o.owner_user_id || "", ...o.content_admin_user_ids, o.last_reviewed_by_user_id || "", o.updated_by_user_id || ""], AbortSignal.timeout(3e4)), Yr(!0);
      } catch (o) {
        ae(At(o) === 409 ? "页面治理状态已变化，请重新加载后再复核。" : i(o));
      } finally {
        D(!1);
      }
    }
  }
  async function Yr(o) {
    if (!(!ne || e.role !== "manager" || oe)) {
      ce(!0), ae("");
      try {
        const f = await t.listPageGovernanceAudit(e.id, ne, Se.trim(), je.trim(), o ? "" : O, 30, AbortSignal.timeout(3e4));
        le((A) => o ? f.items : [...A, ...f.items.filter((I) => !A.some((G) => G.id === I.id))]), $(f.next_after || ""), ue(f.complete), ut(f.items.map((A) => A.actor.user_id), AbortSignal.timeout(3e4));
      } catch (f) {
        ae(i(f));
      } finally {
        ce(!1);
      }
    }
  }
  async function Ll(o = AbortSignal.timeout(3e4)) {
    if (ne) {
      $r(!0);
      try {
        const [f, A] = await Promise.all([
          t.getPageRelationshipGraph(e.id, ne, 2, 120, o),
          t.searchPageIdentities(e.id, St.trim(), 30, o)
        ]);
        Kn(f), vr(A.items.filter((I) => I.page_id !== ne));
      } catch (f) {
        f instanceof DOMException && f.name === "AbortError" || ae(i(f));
      } finally {
        $r(!1);
      }
    }
  }
  Ae(() => {
    if (!en || he !== "edit" || !Y?.draft || r || ve.available) return;
    const o = window.setTimeout(() => {
      Ir();
    }, 900);
    return () => window.clearTimeout(o);
  }, [un, ve.available, en, r, he, dn]), Ae(() => {
    const o = ya.map((A) => A.user_id);
    if (o.length === 0) return;
    const f = new AbortController();
    return ut(o, f.signal), () => f.abort();
  }, [ya]), Ae(() => {
    const o = (f) => {
      (en || Bn === "saving" || de || we || ie || M) && f.preventDefault();
    };
    return window.addEventListener("beforeunload", o), () => window.removeEventListener("beforeunload", o);
  }, [en, ie, M, de, we, Bn]), Ae(() => {
    if (!Ls) return;
    const o = () => {
      const I = pa.current;
      if (!I) return;
      const G = I.getBoundingClientRect(), V = 280, Ee = 7, Ie = 8, $e = Math.max(Ie, Math.min(G.right - V, window.innerWidth - V - Ie)), Ze = window.innerHeight - G.bottom - Ee - Ie, Le = G.top - Ee - Ie, or = Ze < 320 && Le > Ze, lr = Math.max(180, Math.min(560, or ? Le : Ze));
      am({ top: or ? G.top - Ee - lr : G.bottom + Ee, left: $e, maxHeight: lr });
    }, f = (I) => {
      const G = I.target;
      !pa.current?.contains(G) && !hu.current?.contains(G) && Xn(!1);
    }, A = (I) => {
      I.key === "Escape" && (Xn(!1), pa.current?.querySelector("button")?.focus());
    };
    return o(), window.addEventListener("resize", o), window.addEventListener("scroll", o, !0), document.addEventListener("pointerdown", f), document.addEventListener("keydown", A), () => {
      window.removeEventListener("resize", o), window.removeEventListener("scroll", o, !0), document.removeEventListener("pointerdown", f), document.removeEventListener("keydown", A);
    };
  }, [Ls]), Ae(() => {
    if (he !== "history" && he !== "activity" || !ne) return;
    const o = new AbortController();
    return t.listPageVersions(e.id, ne, 0, 50, o.signal).then((f) => {
      o.signal.aborted || (Yo(f.items), el(f.next_before || 0), nl(f.complete), ut(f.items.map((A) => A.published_by_user_id), o.signal));
    }).catch((f) => {
      o.signal.aborted || ae(i(f));
    }), () => o.abort();
  }, [t, i, e.id, he, ne]), Ae(() => {
    if (he !== "history" || !ne) return;
    const o = new AbortController();
    return t.listPageEditHistory(e.id, ne, 0, 50, o.signal).then((f) => {
      o.signal.aborted || (rl(f.items), il(f.next_before || 0), sl(f.complete), ut(f.items.map((A) => A.user_id), o.signal));
    }).catch((f) => {
      o.signal.aborted || ae(i(f));
    }), () => o.abort();
  }, [t, i, e.id, he, ne]), Ae(() => {
    if (he !== "comments" && he !== "activity" || !ne) return;
    const o = new AbortController();
    return t.listPageComments(e.id, ne, "", 50, he === "comments" && $i, o.signal).then((f) => {
      o.signal.aborted || (tr(f.items), Vs(f.next_after || ""), Ks(f.complete), ut(f.items.flatMap((A) => [A.author_user_id, A.resolved_by_user_id || "", ...A.mentioned_user_ids]), o.signal));
    }).catch((f) => {
      o.signal.aborted || ae(i(f));
    }), () => o.abort();
  }, [t, i, e.id, he, ne, $i]), Ae(() => {
    if (he !== "suggestions" || !ne) return;
    const o = new AbortController();
    return Promise.all([t.getPage(e.id, ne, !0, o.signal), t.listPageSuggestions(e.id, ne, o.signal)]).then(([f, A]) => {
      o.signal.aborted || (dt(f), Fe.current = f, Nn(f.draft?.title || f.page.title), hn(f.draft?.body.content || ""), ul(A.items), ut(A.items.flatMap((I) => [I.author_user_id, I.decided_by_user_id || "", ...I.mentioned_user_ids]), o.signal));
    }).catch((f) => {
      o.signal.aborted || ae(i(f));
    }), () => o.abort();
  }, [t, i, e.id, he, ne]), Ae(() => {
    if (he !== "references" || !ne) return;
    const o = new AbortController();
    return wr(!0), Promise.all([
      t.listPageReferences(e.id, ne, "outgoing", "", 20, o.signal),
      t.listPageReferences(e.id, ne, "incoming", "", 20, o.signal)
    ]).then(([f, A]) => {
      o.signal.aborted || (wt(f.items), It(f.next_after || ""), Vn(f.complete), Cn(A.items), Ur(A.next_after || ""), Be(A.complete));
    }).catch((f) => {
      o.signal.aborted || ae(i(f));
    }).finally(() => {
      o.signal.aborted || wr(!1);
    }), () => o.abort();
  }, [t, i, e.id, he, ne]), Ae(() => {
    if (he !== "relationships" || !ne) return;
    const o = new AbortController();
    return Ll(o.signal), () => o.abort();
  }, [t, e.id, he, ne]), Ae(() => {
    if (he !== "relationships" || !ne) {
      vr([]), Qr(!1);
      return;
    }
    const o = new AbortController(), f = window.setTimeout(() => {
      Qr(!0), t.searchPageIdentities(e.id, St.trim(), 30, o.signal).then((A) => {
        o.signal.aborted || vr(A.items.filter((I) => I.page_id !== ne));
      }).catch((A) => {
        o.signal.aborted || ae(i(A));
      }).finally(() => {
        o.signal.aborted || Qr(!1);
      });
    }, 180);
    return () => {
      window.clearTimeout(f), o.abort();
    };
  }, [t, i, e.id, he, St, ne]), Ae(() => {
    if (!ne) {
      ra([]);
      return;
    }
    const o = new AbortController();
    return t.listPageAttachments(e.id, ne, o.signal).then((f) => {
      o.signal.aborted || ra(f.items);
    }).catch((f) => {
      o.signal.aborted || ae(i(f));
    }), () => o.abort();
  }, [t, i, e.id, ne]), Ae(() => {
    if (Mn.current = [], Gi([]), ml(!1), ma.current.clear(), !ne) return;
    const o = new AbortController();
    return t.listPageTasks(e.id, ne, o.signal).then((f) => {
      o.signal.aborted || (Mn.current = f.items, Gi(f.items), ml(!0), ut(f.items.flatMap((A) => A.assignee_user_ids), o.signal));
    }).catch((f) => {
      o.signal.aborted || (ml(!0), ae(i(f)));
    }), () => o.abort();
  }, [t, i, e.id, ne]), Ae(() => {
    if (Cr.current = [], sa([]), yl(!1), ba.current.clear(), !ne) return;
    const o = new AbortController();
    return t.listPagePolls(e.id, ne, o.signal).then((f) => {
      o.signal.aborted || (Cr.current = f.items, sa(f.items), yl(!0));
    }).catch((f) => {
      o.signal.aborted || (yl(!0), ae(i(f)));
    }), () => o.abort();
  }, [t, i, e.id, ne]), Ae(() => {
    if (he !== "comments" && he !== "suggestions") return;
    const o = new AbortController(), f = window.setTimeout(() => {
      t.searchLibraryMembers(e.id, Xs.trim(), "", 100, o.signal).then((A) => {
        o.signal.aborted || (cm(A.items), Hr((I) => ({ ...I, ...Object.fromEntries(A.items.map((G) => [G.user_id, G])) })));
      }).catch((A) => {
        o.signal.aborted || ae(i(A));
      });
    }, 200);
    return () => {
      window.clearTimeout(f), o.abort();
    };
  }, [t, i, e.id, Xs, he]), Ae(() => {
    if (he !== "metadata" && he !== "governance") return;
    const o = new AbortController(), f = window.setTimeout(() => {
      t.searchLibraryMembers(e.id, Ce.trim(), "", 100, o.signal).then((A) => {
        o.signal.aborted || (Ge(A.items), Hr((I) => ({ ...I, ...Object.fromEntries(A.items.map((G) => [G.user_id, G])) })));
      }).catch((A) => {
        o.signal.aborted || ae(i(A));
      });
    }, 200);
    return () => {
      window.clearTimeout(f), o.abort();
    };
  }, [t, i, e.id, Ce, he]), Ae(() => {
    he !== "governance" || e.role !== "manager" || !ne || Yr(!0);
  }, [e.id, e.role, he, ne]), Ae(() => {
    if (he !== "access" || e.role !== "manager") return;
    const o = new AbortController(), f = window.setTimeout(() => {
      t.searchPrincipals(wl.trim(), "", 20, o.signal).then((A) => {
        o.signal.aborted || su(A.items.filter((I) => I.status === "active"));
      }).catch((A) => {
        o.signal.aborted || ae(i(A));
      });
    }, 200);
    return () => {
      window.clearTimeout(f), o.abort();
    };
  }, [wl, t, i, e.role, he]), Ae(() => {
    if (he !== "access" || e.role !== "manager" || !ne || !aa || Jr === "knowledge.page_shares.read" && !oa.trim()) {
      _l(null);
      return;
    }
    const o = new AbortController();
    return t.explainAccess(e.id, { user_id: aa, page_id: ne, action: Jr, share_id: Jr === "knowledge.page_shares.read" ? oa.trim() : void 0 }, o.signal).then((f) => {
      o.signal.aborted || _l(f);
    }).catch((f) => {
      o.signal.aborted || (_l(null), ae(i(f)));
    }), () => o.abort();
  }, [Jr, oa, aa, t, i, e.id, e.role, he, ne]), Ae(() => {
    if (he !== "permissions" || e.role !== "manager" || !ne || !t.getPageAccess) return;
    const o = new AbortController();
    return t.getPageAccess(e.id, ne, o.signal).then((f) => {
      o.signal.aborted || (kl(f), vl(f.mode), Kr(f.grants), ut(f.grants.filter((A) => A.subject.type === "user").map((A) => A.subject.id), o.signal), fu(f.grants.filter((A) => A.subject.type === "organization").map((A) => A.subject.id), o.signal));
    }).catch((f) => {
      o.signal.aborted || ae(i(f));
    }), () => o.abort();
  }, [t, i, e.id, e.role, he, ne]), Ae(() => {
    if (he !== "permissions" || e.role !== "manager" || Vr !== "restricted" || la !== "user") {
      Cl([]);
      return;
    }
    const o = new AbortController(), f = window.setTimeout(() => {
      t.searchLibraryMembers(e.id, Wr.trim(), "", 50, o.signal).then((A) => {
        o.signal.aborted || (Cl(A.items), Hr((I) => ({ ...I, ...Object.fromEntries(A.items.map((G) => [G.user_id, G])) })));
      }).catch((A) => {
        o.signal.aborted || ae(i(A));
      });
    }, 200);
    return () => {
      window.clearTimeout(f), o.abort();
    };
  }, [t, i, e.id, e.role, he, Vr, Wr, la]);
  async function Ol(o) {
    if (!Ul(o)) return;
    const f = new Set(k);
    f.has(o.id) ? f.delete(o.id) : (f.add(o.id), g[o.id] || await Et(o.id)), y(f);
  }
  function Ul(o) {
    const f = g[o.id];
    return f ? f.length > 0 || x[o.id] === !1 : o.has_children;
  }
  function bu(o = "", f = 0) {
    const I = (g[o] || []).filter((G) => !J || G.title.toLocaleLowerCase().includes(J.toLocaleLowerCase())).flatMap((G) => [{ page: G, parent: o, depth: f }, ...k.has(G.id) ? bu(G.id, f + 1) : []]);
    return !J && g[o] && x[o] === !1 && I.push({ parent: o, depth: f, loadMore: !0 }), I;
  }
  async function Nm(o) {
    if (p)
      try {
        const f = ne, A = Vt[o], I = await t.createPage(e.id, { client_id: crypto.randomUUID(), parent_page_id: f || void 0, title: A.title, content_type: o }, AbortSignal.timeout(3e4));
        f && y((G) => new Set(G).add(f)), Pe(`已在当前节点下创建${A.label}，正在编辑。`), Zr.current = I.page.id, await Et(I.page.parent_page_id || ""), et(I.page.id);
      } catch (f) {
        ae(i(f));
      }
  }
  async function Dm(o, f, A) {
    const I = Fe.current;
    if (!p || !I?.draft || I.page.content_type !== "document" && I.page.content_type !== "mind_note") return;
    ae("");
    const G = I.page.parent_page_id || "";
    try {
      const V = await t.createPage(e.id, {
        client_id: crypto.randomUUID(),
        parent_page_id: G || void 0,
        title: f.trim().slice(0, 256) || Vt[o].title,
        content_type: o
      }, AbortSignal.timeout(3e4));
      if (!V.draft) throw Error("新页面没有可写草稿。");
      const Ee = await t.savePageDraft(e.id, V.page.id, {
        client_id: crypto.randomUUID(),
        expected_draft_revision: V.draft.draft_revision,
        expected_page_revision: V.page.revision,
        title: V.draft.title,
        parent_page_id: V.page.parent_page_id || void 0,
        rank: V.page.rank,
        content_schema_version: oi,
        content: A,
        content_sha256: await cs(A)
      }, AbortSignal.timeout(3e4));
      await Et(G), Zr.current = Ee.page.id, et(Ee.page.id), Pe(`已把“${I.page.title}”复制为${Vt[o].label}；原页面和历史版本未修改。`);
    } catch (V) {
      throw ae(i(V)), V;
    }
  }
  async function _a(o = AbortSignal.timeout(3e4)) {
    if (!t.listPageTemplates) return;
    const f = await t.listPageTemplates(e.id, "", 100, o);
    Rd(f.items);
  }
  async function Bm() {
    if (!(!t.listPageTemplates || !t.instantiatePageTemplate)) {
      Xn(!1), Fi(!0), Us(""), Ko(`${Y?.page.title || "当前页面"} 模板`), Wo(""), cn("list"), ae("");
      try {
        await _a();
      } catch (o) {
        ae(i(o));
      } finally {
        cn("");
      }
    }
  }
  async function Pm() {
    if (!(!ne || !t.createPageTemplate || !$s.trim())) {
      cn("create"), ae("");
      try {
        en && await Ir();
        const o = await t.createPageTemplate(e.id, { client_id: crypto.randomUUID(), source_page_id: ne, title: $s.trim(), description: Ld.trim() || void 0 }, AbortSignal.timeout(3e4));
        await _a(), Ko(`${Y?.page.title || "当前页面"} 模板`), Wo(""), Pe(`模板“${o.title}”已保存，共 ${o.node_count} 个页面。`);
      } catch (o) {
        ae(i(o));
      } finally {
        cn("");
      }
    }
  }
  async function Mm(o) {
    if (!(!ne || !t.updatePageTemplate)) {
      cn(`update:${o.id}`), ae("");
      try {
        en && await Ir();
        const f = await t.updatePageTemplate(e.id, o.id, { client_id: crypto.randomUUID(), expected_revision: o.revision, source_page_id: ne, title: o.title, description: o.description }, AbortSignal.timeout(3e4));
        await _a(), Pe(`模板“${f.title}”已生成版本 ${f.latest_version}。`), Os === o.id && await yu(o.id, !0);
      } catch (f) {
        ae(i(f));
      } finally {
        cn("");
      }
    }
  }
  async function yu(o, f = !1) {
    if (t.listPageTemplateVersions) {
      if (!f && Os === o) {
        Us("");
        return;
      }
      Us(o), cn(`versions:${o}`);
      try {
        const A = await t.listPageTemplateVersions(e.id, o, 0, 100, AbortSignal.timeout(3e4));
        Fd((I) => ({ ...I, [o]: A.items }));
      } catch (A) {
        ae(i(A));
      } finally {
        cn("");
      }
    }
  }
  async function wu(o, f = o.latest_version) {
    if (!t.instantiatePageTemplate) return;
    const A = ne;
    cn(`instantiate:${o.id}:${f}`), ae("");
    try {
      const I = await t.instantiatePageTemplate(e.id, o.id, { client_id: crypto.randomUUID(), version: f, parent_page_id: A || void 0 }, AbortSignal.timeout(3e4));
      A && y((G) => new Set(G).add(A)), await Et(A), Zr.current = I.root.page.id, et(I.root.page.id), Fi(!1), Pe(`已从“${o.title}”版本 ${f} 创建 ${I.created_page_ids.length} 个独立页面。`);
    } catch (I) {
      ae(i(I));
    } finally {
      cn("");
    }
  }
  async function zm(o) {
    if (!p || Xo) return;
    const f = ne, A = [...o.name.trim()].slice(0, 256).join("");
    let I = null, G = null, V = !1;
    Od(!0), Xn(!1), ae(""), Pe("正在校验并上传原文件…");
    const Ee = AbortSignal.timeout(7200 * 1e3);
    try {
      if (!e.documents_configured) throw Error("当前知识库尚未配置文件存储。");
      if (!A) throw Error("文件名不能为空。");
      if (!o.size || o.size > uh(e)) throw Error("文件大小超过当前知识库上传上限。");
      if (!dh(e, o.name)) throw Error("当前文件格式不支持入库。");
      const Ie = await hh(o, Ee);
      I = await t.uploadDocument({ libraryID: e.id, file: o, clientID: crypto.randomUUID(), sha256: Ie, signal: Ee }), Pe("原文件已保存，正在创建知识页面…"), G = await t.createPage(e.id, { client_id: crypto.randomUUID(), parent_page_id: f || void 0, title: A, content_type: "file" }, Ee), await t.setPageAttachment(e.id, G.page.id, I.id, { client_id: crypto.randomUUID(), title: A, rank: "a" }, Ee);
      const $e = yf(I.id, A), Ze = G.draft;
      G = await t.savePageDraft(e.id, G.page.id, {
        client_id: crypto.randomUUID(),
        expected_draft_revision: Ze.draft_revision,
        expected_page_revision: G.page.revision,
        title: A,
        parent_page_id: G.page.parent_page_id,
        rank: G.page.rank,
        content_schema_version: oi,
        content: $e,
        content_sha256: await cs($e)
      }, Ee), V = !0, f && y((Le) => new Set(Le).add(f)), await Et(f, Ee), et(G.page.id), Pe(`“${A}”已作为${f ? "当前节点的子" : "根"}知识条目创建。`);
    } catch (Ie) {
      if (G && !V)
        try {
          await t.setPageArchived(e.id, G.page.id, !0, { client_id: crypto.randomUUID(), expected_revision: G.page.revision }, AbortSignal.timeout(3e4));
        } catch {
        }
      if (I && !V)
        try {
          await t.deleteDocument(e.id, I.id, I.revision, AbortSignal.timeout(3e4));
        } catch {
        }
      Pe(""), ae(i(Ie));
    } finally {
      Od(!1), ga.current && (ga.current.value = "");
    }
  }
  function Ir() {
    if (!Fe.current?.draft || !p) return fa.current;
    const f = { ...pt.current };
    return qt("saving"), Yn(null), ae(""), fa.current = fa.current.then(async () => {
      const A = Fe.current;
      if (!A?.draft) return;
      const I = t.applyPageNativeOperations, G = I && A.draft.body.content !== f.body ? await tm(A.page.content_type, A.draft.body.content, f.body) : void 0;
      if (G && I) {
        const Ze = Wi.current || {
          clientID: crypto.randomUUID(),
          titleClientID: crypto.randomUUID(),
          pageID: A.page.id,
          baseDraftRevision: A.draft.draft_revision,
          operations: G,
          title: f.title,
          body: f.body
        };
        Wi.current = Ze;
        let Le = A;
        if (Ze.operations.length > 0 && (Le = (await I(e.id, Ze.pageID, {
          client_id: Ze.clientID,
          base_draft_revision: Ze.baseDraftRevision,
          operations: Ze.operations
        }, AbortSignal.timeout(3e4))).view, Le.draft && Le.page.content_type === "multidimensional_table" && t.executeGridAutomation)) {
          const fb = rm(Le.draft.body.content, Ze.operations, Le.draft.draft_revision);
          for (const Jl of fb)
            Jl.expected_draft_revision = Le.draft?.draft_revision || Jl.expected_draft_revision, Le = (await t.executeGridAutomation(e.id, Ze.pageID, Jl, AbortSignal.timeout(3e4))).view;
        }
        Le.draft && Ze.title.trim() !== Le.draft.title && (Le = await t.savePageDraft(e.id, Ze.pageID, {
          client_id: Ze.titleClientID,
          expected_draft_revision: Le.draft.draft_revision,
          expected_page_revision: Le.page.revision,
          title: Ze.title.trim(),
          parent_page_id: Le.draft.parent_page_id,
          rank: Le.draft.rank,
          content_schema_version: oi,
          content: Le.draft.body.content,
          content_sha256: Le.draft.body.content_sha256
        }, AbortSignal.timeout(3e4))), Wi.current = null;
        const or = pt.current.title === Ze.title && pt.current.body === Ze.body;
        or && Le.draft && Le.draft.body.content !== Ze.body && (pt.current = { title: Le.draft.title, body: Le.draft.body.content }, Nn(Le.draft.title), hn(Le.draft.body.content)), Fe.current = Le, dt(Le), Dn(!or), qt(or ? "saved" : "idle");
        return;
      }
      const V = Xr.current || {
        clientID: crypto.randomUUID(),
        pageID: A.page.id,
        expectedDraftRevision: A.draft.draft_revision,
        expectedPageRevision: A.page.revision,
        title: f.title,
        body: f.body,
        parentPageID: A.draft.parent_page_id,
        rank: A.draft.rank
      };
      Xr.current = V;
      const Ee = await cs(V.body), Ie = await t.savePageDraft(e.id, V.pageID, {
        client_id: V.clientID,
        expected_draft_revision: V.expectedDraftRevision,
        expected_page_revision: V.expectedPageRevision,
        title: V.title.trim(),
        parent_page_id: V.parentPageID,
        rank: V.rank,
        content_schema_version: oi,
        content: V.body,
        content_sha256: Ee
      }, AbortSignal.timeout(3e4));
      Xr.current = null, Fe.current = Ie, dt(Ie);
      const $e = pt.current.title === V.title && pt.current.body === V.body;
      Dn(!$e), qt($e ? "saved" : "idle");
    }).catch((A) => {
      At(A) === 409 ? (qt("conflict"), Yn(Bf(A))) : qt("error"), ae(i(A));
    }), fa.current;
  }
  async function _u() {
    if (!Fe.current?.draft || !p) return;
    if (ve.available) {
      Pn("publishing"), ae("");
      try {
        const f = await ve.publish(qs.trim() || void 0);
        Fe.current = f, dt(f), Hs(""), Dn(!1), Pn("idle"), Je("read"), Pe("协作快照已冻结并发布；所有在线成员看到的是同一版本。"), await Et(f.page.parent_page_id || "");
      } catch (f) {
        Pn("error"), ae(i(f));
      }
      return;
    }
    en && await Ir();
    const o = Fe.current;
    if (!(!o?.draft || Bn === "conflict" || Xr.current)) {
      Pn("publishing"), ae("");
      try {
        const f = Xi.current || {
          clientID: crypto.randomUUID(),
          pageID: o.page.id,
          expectedPageRevision: o.page.revision,
          expectedDraftRevision: o.draft.draft_revision,
          publishNote: qs.trim() || void 0
        };
        Xi.current = f;
        const A = await t.publishPage(e.id, f.pageID, { client_id: f.clientID, expected_page_revision: f.expectedPageRevision, expected_draft_revision: f.expectedDraftRevision, publish_note: f.publishNote }, AbortSignal.timeout(6e4));
        Xi.current = null, Fe.current = A, dt(A), Hs(""), Dn(!1), Pn("idle"), Je("read"), Pe("页面已发布；页面可以立即阅读，检索状态以页面标记为准。"), await Et(A.page.parent_page_id || "");
      } catch (f) {
        Pn("error"), At(f) === 409 && (qt("conflict"), Yn(Bf(f))), ae(i(f));
      }
    }
  }
  async function $l(o, f, A = "") {
    await t.movePage(e.id, o.id, { client_id: crypto.randomUUID(), expected_revision: o.revision, parent_page_id: f || void 0, rank: o.rank, access_impact_token: A || void 0 }, AbortSignal.timeout(3e4)), da(null), Pe("页面与子树权限继承已在同一事务中更新。"), await Et(o.parent_page_id || ""), await Et(f);
  }
  async function ku(o, f) {
    if (!(!p || o.id === f))
      try {
        if (e.role === "manager" && t.previewPageMove) {
          const A = await t.previewPageMove(e.id, o.id, { parent_page_id: f || void 0, rank: o.rank }, AbortSignal.timeout(3e4));
          if (A.requires_confirm) {
            da({ page: o, parentPageID: f, impact: A }), ut(A.changed_subjects.filter((I) => I.type === "user").map((I) => I.id), AbortSignal.timeout(3e4)), fu(A.changed_subjects.filter((I) => I.type === "organization").map((I) => I.id), AbortSignal.timeout(3e4));
            return;
          }
          await $l(o, f, A.token);
          return;
        }
        await $l(o, f);
      } catch (A) {
        ae(i(A));
      }
  }
  function Rm(o) {
    const f = { subject: { type: "user", id: o.user_id }, role: Il, scope: Sl };
    Kr((A) => [...A.filter((I) => I.subject.type !== f.subject.type || I.subject.id !== f.subject.id || I.scope !== f.scope), f]), Hr((A) => ({ ...A, [o.user_id]: o })), Vi(""), Cl([]);
  }
  async function Tm() {
    const o = Wr.trim();
    if (o) {
      ca(!0), ae("");
      try {
        const [f] = await t.resolveOrganizationPrincipals([o], AbortSignal.timeout(3e4));
        if (!f || f.organization_id !== o || f.status !== "active") throw Error("组织不存在或已停用。请输入 Identity 中的有效组织 ID。");
        const A = { subject: { type: "organization", id: o }, role: Il, scope: Sl };
        Zd((I) => ({ ...I, [o]: f })), Kr((I) => [...I.filter((G) => G.subject.type !== "organization" || G.subject.id !== o || G.scope !== A.scope), A]), Vi("");
      } catch (f) {
        ae(i(f));
      } finally {
        ca(!1);
      }
    }
  }
  async function Fm() {
    if (!(!ne || !Ji || !t.setPageAccess)) {
      ca(!0), ae("");
      try {
        const o = await t.setPageAccess(e.id, ne, {
          client_id: crypto.randomUUID(),
          expected_revision: Ji.revision,
          mode: Vr,
          grants: Vr === "restricted" ? Al : []
        }, AbortSignal.timeout(3e4));
        if (kl(o), vl(o.mode), Kr(o.grants), Pe(o.projection_status === "ready" ? "页面权限已生效。" : "本地撤权已立即生效；远端权限投影确认前，本页不会进入搜索结果。"), Fe.current) {
          const f = { ...Fe.current, page: { ...Fe.current.page, access_mode: o.mode, access_revision: o.revision, access_status: o.projection_status } };
          Fe.current = f, dt(f);
        }
      } catch (o) {
        ae(i(o));
      } finally {
        ca(!1);
      }
    }
  }
  async function Lm(o, f, A) {
    const I = f.parent_page_id || "", G = g[I] || [];
    if (!p || J || (o.parent_page_id || "") !== I || x[I] !== !0) return;
    const V = G.filter((Ie) => Ie.id !== o.id), Ee = V.findIndex((Ie) => Ie.id === f.id);
    if (!(Ee < 0) && (V.splice(Ee + (A === "after" ? 1 : 0), 0, o), !V.every((Ie, $e) => Ie.id === G[$e]?.id)))
      try {
        const Ie = await t.reorderPages(e.id, { client_id: crypto.randomUUID(), parent_page_id: I || void 0, items: V.map(($e) => ({ page_id: $e.id, expected_revision: $e.revision })) }, AbortSignal.timeout(3e4));
        _(($e) => ({ ...$e, [I]: Ie.items })), Pe("知识条目顺序已更新。");
      } catch (Ie) {
        ae(i(Ie));
      }
  }
  function vu(o, f) {
    if (!(!J && (xn?.parent_page_id || "") === f && x[f] === !0)) return "inside";
    const I = o.currentTarget.getBoundingClientRect(), G = I.height > 0 ? (o.clientY - I.top) / I.height : 0.5;
    return G < 0.3 ? "before" : G > 0.7 ? "after" : "inside";
  }
  async function Om(o, f, A) {
    o.id !== f.id && (A === "inside" ? await ku(o, f.id) : await Lm(o, f, A));
  }
  async function Um() {
    const o = Fe.current;
    if (!(!o || !p))
      try {
        const f = await t.copyPage(e.id, o.page.id, { client_id: crypto.randomUUID(), parent_page_id: o.page.parent_page_id, title: `${o.page.title} 副本` }, AbortSignal.timeout(3e4));
        await Et(f.page.parent_page_id || ""), et(f.page.id), Pe("页面已复制为一份新的未发布草稿。");
      } catch (f) {
        ae(i(f));
      }
  }
  async function ei(o) {
    const f = Fe.current;
    if (!f || !t.authorizePageContentOperation) throw Error("当前宿主未启用页面内容保护。");
    await t.authorizePageContentOperation(e.id, f.page.id, o, AbortSignal.timeout(3e4));
  }
  async function $m(o) {
    if (o.target?.closest("input, textarea, select")) return;
    const A = window.getSelection()?.toString() || "";
    if (A) {
      o.preventDefault();
      try {
        await ei("copy"), await navigator.clipboard.writeText(A), Pe("已通过服务端内容策略校验并复制选中内容。");
      } catch (I) {
        ae(i(I));
      }
    }
  }
  async function Qm() {
    try {
      await ei("copy"), await navigator.clipboard.writeText(un), Pe("已通过服务端内容策略校验并复制草稿正文。");
    } catch (o) {
      ae(i(o));
    }
  }
  Ae(() => {
    const o = () => {
      Date.now() <= Nl.current || (document.body.classList.add("knowledge-print-blocked"), ae("请使用 Ctrl/⌘ + P，由服务端校验当前页面的打印策略后再打印。"));
    }, f = () => {
      Nl.current = 0, document.body.classList.remove("knowledge-print-blocked");
    }, A = (I) => {
      !(I.ctrlKey || I.metaKey) || I.altKey || I.key.toLowerCase() !== "p" || !Fe.current || (I.preventDefault(), ei("print").then(() => {
        Nl.current = Date.now() + 5e3, window.print();
      }, (G) => ae(i(G))));
    };
    return window.addEventListener("beforeprint", o), window.addEventListener("afterprint", f), window.addEventListener("keydown", A, !0), () => {
      window.removeEventListener("beforeprint", o), window.removeEventListener("afterprint", f), window.removeEventListener("keydown", A, !0), document.body.classList.remove("knowledge-print-blocked");
    };
  }, [t, i, e.id]);
  async function jm(o) {
    const f = he;
    try {
      o.state !== "archived" && f === "edit" && (ve.available ? await ve.flush() : en && await Ir(), Je("read")), await t.setPageArchived(e.id, o.id, o.state !== "archived", { client_id: crypto.randomUUID(), expected_revision: o.revision }, AbortSignal.timeout(3e4)), Fe.current = null, dt(null), et(""), ae(""), await Et(o.parent_page_id || ""), N !== "all" && await Tl(N), Pe(o.state === "archived" ? "页面已恢复。" : "页面已归档并移入回收站，同时立即停止检索引用。");
    } catch (A) {
      o.state !== "archived" && f === "edit" && Je("edit"), ae(i(A));
    }
  }
  async function qm() {
    if (!(Oi.length !== 2 || !ne))
      try {
        Ud(await t.diffPageVersions(e.id, ne, Oi[1], Oi[0], AbortSignal.timeout(3e4)));
      } catch (o) {
        ae(i(o));
      }
  }
  async function Hm(o) {
    try {
      Gd(await t.getPageVersion(e.id, ne, o, AbortSignal.timeout(3e4)));
    } catch (f) {
      ae(i(f));
    }
  }
  async function Au() {
    if (!(!ne || tl || Qd < 1))
      try {
        const o = await t.listPageVersions(e.id, ne, Qd, 50, AbortSignal.timeout(3e4));
        Yo((f) => [...f, ...o.items.filter((A) => !f.some((I) => I.version === A.version))]), el(o.next_before || 0), nl(o.complete), ut(o.items.map((f) => f.published_by_user_id), AbortSignal.timeout(3e4));
      } catch (o) {
        ae(i(o));
      }
  }
  async function Gm() {
    if (!(!ne || Hd || qd < 1))
      try {
        const o = await t.listPageEditHistory(e.id, ne, qd, 50, AbortSignal.timeout(3e4));
        rl((f) => [...f, ...o.items.filter((A) => !f.some((I) => I.draft_revision === A.draft_revision))]), il(o.next_before || 0), sl(o.complete), ut(o.items.map((f) => f.user_id), AbortSignal.timeout(3e4));
      } catch (o) {
        ae(i(o));
      }
  }
  async function Cu() {
    if (!(!ne || ol || !Jd))
      try {
        const o = await t.listPageComments(e.id, ne, Jd, 50, he === "comments" && $i, AbortSignal.timeout(3e4));
        tr((f) => [...f, ...o.items.filter((A) => !f.some((I) => I.id === A.id))]), Vs(o.next_after || ""), Ks(o.complete), ut(o.items.flatMap((f) => [f.author_user_id, f.resolved_by_user_id || "", ...f.mentioned_user_ids]), AbortSignal.timeout(3e4));
      } catch (o) {
        ae(i(o));
      }
  }
  async function Iu(o) {
    if (!ne) return;
    const f = o === "outgoing" ? Sn : En, A = o === "outgoing" ? Jn : In;
    if (!(f || !A))
      try {
        wr(!0);
        const I = await t.listPageReferences(e.id, ne, o, A, 20, AbortSignal.timeout(3e4)), G = (V) => [...V, ...I.items.filter((Ee) => !V.some((Ie) => Ie.source_page_id === Ee.source_page_id && Ie.block_id === Ee.block_id))];
        o === "outgoing" ? (wt(G), It(I.next_after || ""), Vn(I.complete)) : (Cn(G), Ur(I.next_after || ""), Be(I.complete));
      } catch (I) {
        ae(i(I));
      } finally {
        wr(!1);
      }
  }
  async function Su(o = ne) {
    if (!o) return;
    const f = await t.listPageSuggestions(e.id, o, AbortSignal.timeout(3e4));
    ul(f.items), ut(f.items.flatMap((A) => [A.author_user_id, A.decided_by_user_id || "", ...A.mentioned_user_ids]), AbortSignal.timeout(3e4));
  }
  async function Jm() {
    const o = Fe.current;
    if (!(!o?.draft || !Ht || Ar === "insert" && !na.trim()))
      try {
        Hi("create"), ae(""), await t.createPageSuggestion(e.id, o.page.id, {
          client_id: crypto.randomUUID(),
          kind: Ar,
          base_draft_revision: o.draft.draft_revision,
          anchor: { node_id: Ht.nodeID, quote: Ht.quote },
          proposed_text: Ar === "insert" ? na.trim() : void 0,
          comment: eu.trim() || void 0,
          mentioned_user_ids: tu
        }, AbortSignal.timeout(3e4)), hl(""), fl(""), pl([]), Pe("修订提议已提交，正文还没有被改动。"), await Su(o.page.id);
      } catch (f) {
        ae(i(f));
      } finally {
        Hi("");
      }
  }
  async function Ql(o, f) {
    const A = Fe.current;
    if (A?.draft)
      try {
        Hi(o.id), ae(""), await t.decidePageSuggestion(e.id, A.page.id, o.id, {
          client_id: crypto.randomUUID(),
          expected_revision: o.revision,
          expected_draft_revision: A.draft.draft_revision,
          decision: f
        }, AbortSignal.timeout(3e4));
        const I = await t.getPage(e.id, A.page.id, !0, AbortSignal.timeout(3e4));
        dt(I), Fe.current = I, Nn(I.draft?.title || I.page.title), hn(I.draft?.body.content || ""), await Su(A.page.id), Pe(f === "accept" ? "修订已接受并原子写入当前草稿。" : f === "reject" ? "修订已拒绝。" : "修订已撤回。");
      } catch (I) {
        ae(i(I));
      } finally {
        Hi("");
      }
  }
  async function Vm(o) {
    const f = Fe.current;
    if (f?.draft)
      try {
        const A = await t.restorePageVersion(e.id, f.page.id, o, { client_id: crypto.randomUUID(), expected_page_revision: f.page.revision, expected_draft_revision: f.draft.draft_revision }, AbortSignal.timeout(3e4));
        Fe.current = A, dt(A), Nn(A.draft.title), hn(A.draft.body.content), pt.current = { title: A.draft.title, body: A.draft.body.content }, Je("edit"), Pe(`版本 ${o} 已恢复为草稿，历史版本未修改。`);
      } catch (A) {
        ae(i(A));
      }
  }
  async function Km() {
    const o = Fe.current;
    if (!o?.published || !Js.trim()) return;
    const f = Qi ? Ui.find((I) => I.id === Qi) : void 0, A = f?.anchor.node_id && f.anchor.quote ? { nodeID: f.anchor.node_id, quote: f.anchor.quote } : Ht;
    if (!A) {
      ae("请先在正文中选择一段文字，或点选一个内容块。");
      return;
    }
    try {
      await t.createPageComment(e.id, o.page.id, { client_id: crypto.randomUUID(), parent_comment_id: Qi || void 0, published_version: f?.published_version || o.published.version, anchor: { node_id: A.nodeID, quote: A.quote }, body: Js.trim(), mentioned_user_ids: Zs }, AbortSignal.timeout(3e4)), al(""), Xd([]), Ys("");
      const I = await t.listPageComments(e.id, o.page.id, "", 50, $i, AbortSignal.timeout(3e4));
      tr(I.items), Vs(I.next_after || ""), Ks(I.complete);
    } catch (I) {
      ae(i(I));
    }
  }
  function Wm(o) {
    o.anchor.changed || !o.anchor.node_id || ji((f) => ({ nodeID: o.anchor.node_id, revision: f.revision + 1 }));
  }
  function Xm(o) {
    const f = o.parent_comment_id || o.id;
    Ys(f);
    const A = Ui.find((I) => I.id === f) || o;
    !A.anchor.changed && A.anchor.node_id && A.anchor.quote && ea({ nodeID: A.anchor.node_id, quote: A.anchor.quote });
  }
  async function Zm(o) {
    try {
      const f = await t.resolvePageComment(e.id, o.page_id, o.id, { client_id: crypto.randomUUID(), expected_revision: o.revision, resolved: !o.resolved }, AbortSignal.timeout(3e4));
      tr((A) => A.map((I) => I.id === f.id ? f : I));
    } catch (f) {
      ae(i(f));
    }
  }
  async function Ym(o) {
    const f = cl.trim();
    if (f)
      try {
        const A = await t.updatePageComment(e.id, o.page_id, o.id, { client_id: crypto.randomUUID(), expected_revision: o.revision, body: f, mentioned_user_ids: o.mentioned_user_ids }, AbortSignal.timeout(3e4));
        tr((I) => I.map((G) => G.id === A.id ? A : G)), ll(""), Ws("");
      } catch (A) {
        ae(i(A));
      }
  }
  async function eb(o) {
    try {
      const f = await t.deletePageComment(e.id, o.page_id, o.id, { client_id: crypto.randomUUID(), expected_revision: o.revision }, AbortSignal.timeout(3e4));
      tr((A) => A.map((I) => I.id === f.id ? f : I));
    } catch (f) {
      ae(i(f));
    }
  }
  async function tb(o, f) {
    const A = o.reactions?.find((I) => I.emoji === f);
    try {
      const I = await t.setPageCommentReaction(e.id, o.page_id, o.id, { client_id: crypto.randomUUID(), emoji: f, active: !A?.reacted }, AbortSignal.timeout(3e4));
      tr((G) => G.map((V) => V.id === I.id ? I : V));
    } catch (I) {
      ae(i(I));
    }
  }
  async function nb(o) {
    if (!o.anchor.node_id || o.anchor.changed || !p) return;
    const f = [...new Set(o.mentioned_user_ids.length > 0 ? o.mentioned_user_ids : n ? [n] : [])], A = Gr.find((I) => I.source_block_id === o.anchor.node_id);
    try {
      const I = A ? await t.updatePageTask(e.id, o.page_id, A.id, {
        client_id: crypto.randomUUID(),
        expected_revision: A.revision,
        title: A.title,
        status: A.status,
        assignee_user_ids: [.../* @__PURE__ */ new Set([...A.assignee_user_ids, ...f])],
        due_at: A.due_at,
        reminder_at: A.reminder_at,
        priority: A.priority
      }, AbortSignal.timeout(3e4)) : await t.createPageTask(e.id, o.page_id, {
        client_id: crypto.randomUUID(),
        source_block_id: o.anchor.node_id,
        title: Array.from(o.body || o.anchor.quote || "评论任务").slice(0, 480).join(""),
        assignee_user_ids: f,
        priority: "none"
      }, AbortSignal.timeout(3e4));
      Gi((G) => [...G.filter((V) => V.id !== I.id), I]), Mn.current = [...Mn.current.filter((G) => G.id !== I.id), I], Pe(`已将评论关联到任务“${I.title}”${I.assignee_user_ids.length ? `，指派给 ${I.assignee_user_ids.map((G) => qe[G]?.display_name || G).join("、")}` : ""}。`);
    } catch (I) {
      ae(i(I));
    }
  }
  async function Eu(o) {
    const f = Fe.current;
    if (!f?.draft || !p) throw Error("当前页面不可上传附件。");
    if (!e.documents_configured) throw Error("当前知识库尚未配置文件存储。");
    if (!o.size || o.size > uh(e)) throw Error("文件大小超过当前知识库上传上限。");
    if (!dh(e, o.name)) throw Error("当前文件格式不支持入库。");
    Dl.current++, ru(!0);
    const A = AbortSignal.timeout(7200 * 1e3);
    try {
      const I = await hh(o, A), G = await t.uploadDocument({ libraryID: e.id, file: o, clientID: crypto.randomUUID(), sha256: I, signal: A }), V = await t.setPageAttachment(e.id, f.page.id, G.id, { client_id: crypto.randomUUID(), title: o.name, rank: `${Date.now()}:${G.id}` }, A);
      return ra((Ee) => [...Ee.filter((Ie) => Ie.document_id !== V.document_id), V]), G;
    } finally {
      Dl.current--, Dl.current === 0 && ru(!1);
    }
  }
  async function rb(o) {
    const f = Fe.current;
    if (!(!f?.draft || !p || ia)) {
      ae("");
      try {
        const A = await Eu(o);
        if (o.type.startsWith("image/") && f.page.content_type === "document") {
          const I = bv(pt.current.body, A.id, o.name);
          pt.current.body = I, hn(I), Dn(!0), qt("idle"), Je("edit");
        }
        Pe("附件已通过受权文件接口上传并关联到当前页面。图片引用会在草稿保存后生效。");
      } catch (A) {
        ae(i(A));
      }
    }
  }
  async function xu(o) {
    ae("");
    try {
      const f = await Eu(o);
      return Pe(`“${o.name}”已通过受权文件接口上传并插入页面。`), { props: { name: o.name, caption: "", url: `knowledge-document:${f.id}` } };
    } catch (f) {
      throw ae(i(f)), f;
    }
  }
  async function ka(o) {
    const f = /^knowledge-document:(kdoc_[a-f0-9]{32})$/.exec(o);
    if (!f) throw Error("文件引用无效。");
    const A = await t.readDocumentContent(e.id, f[1], { signal: AbortSignal.timeout(120 * 1e3) });
    if (!A.ok) throw Error(`文件读取失败（HTTP ${A.status}）。`);
    return A.blob();
  }
  async function ib(o) {
    try {
      await t.removePageAttachment(e.id, o.page_id, o.document_id, { client_id: crypto.randomUUID() }, AbortSignal.timeout(3e4)), ra((f) => f.filter((A) => A.document_id !== o.document_id));
    } catch (f) {
      ae(i(f));
    }
  }
  function jl(o, f, A) {
    if (Fe.current?.page.content_type === "file") {
      const I = Vg(f);
      I && (f = yf(I.document_id, o.trim() || I.title));
    }
    Nn(o), hn(f), pt.current = { title: o, body: f }, Dn(!0), qt(ve.available ? "saving" : "idle"), Pn("idle"), Yn(null), ve.available && ve.edit(o, f, A);
  }
  async function sb() {
    if (!ne || !t.createAIExecution || !t.getAIExecution || !ve.ready || !ve.sessionID) return;
    if ((fn === "write" || fn === "answer") && !El.trim()) {
      Gt("续写和问答需要填写明确要求。");
      return;
    }
    if (fn === "translate" && !xl.trim()) {
      Gt("翻译需要选择目标语言。");
      return;
    }
    sr.current?.abort();
    const o = new AbortController();
    sr.current = o, ha(!0), Gt(""), ir(null);
    try {
      Ki === "draft" && await ve.flush();
      let f = await t.createAIExecution(e.id, ne, {
        client_id: crypto.randomUUID(),
        operation: fn,
        prompt: El.trim() || void 0,
        language: fn === "translate" ? xl.trim() : void 0,
        source_scope: Ki,
        session_id: Ki === "draft" ? ve.sessionID : void 0
      }, o.signal);
      ir(f);
      for (let A = 0; A < 120 && (f.state === "pending" || f.state === "running"); A++)
        await new Promise((I, G) => {
          const V = window.setTimeout(I, 500);
          o.signal.addEventListener("abort", () => {
            window.clearTimeout(V), G(new DOMException("Aborted", "AbortError"));
          }, { once: !0 });
        }), f = await t.getAIExecution(e.id, ne, f.id, o.signal), ir(f);
      if (f.state === "pending" || f.state === "running") throw new Error("AI 执行超时，请稍后重试。");
      f.state === "failed" && Gt(`AI 执行失败：${f.error_code || "provider_failed"}`);
    } catch (f) {
      o.signal.aborted || Gt(i(f));
    } finally {
      sr.current === o && (sr.current = null), o.signal.aborted || ha(!1);
    }
  }
  async function ab() {
    if (!(!tt || tt.state !== "completed" || !tt.result || !t.confirmAIExecution || !ve.ready || !ve.sessionID)) {
      ha(!0), Gt("");
      try {
        await ve.flush();
        const o = await t.confirmAIExecution(e.id, ne, tt.id, {
          client_id: crypto.randomUUID(),
          expected_revision: tt.revision,
          session_id: ve.sessionID
        }, AbortSignal.timeout(3e4));
        ir(o), du({ id: `${o.id}:${o.revision}`, markdown: o.result || tt.result }), Pe("AI 候选已由你确认并追加到当前草稿；发布前仍可继续修改。");
      } catch (o) {
        Gt(i(o));
      } finally {
        ha(!1);
      }
    }
  }
  const va = Xe(() => bu(), [g, k, J]), Nu = Xe(() => B.filter((o) => !J || o.page.title.toLocaleLowerCase().includes(J.toLocaleLowerCase())), [B, J]);
  function ob(o) {
    const f = N === "favorites" ? o.state.favorite_at : N === "subscribed" ? o.state.subscribed_at : N === "recent_views" ? o.state.last_viewed_at : N === "recent_edits" ? o.state.last_edited_at : N === "trash" ? o.page.updated_at : void 0, A = Vt[o.page.content_type].label;
    return f && Date.parse(f) > 0 ? `${A} · ${new Date(f).toLocaleString()}` : A;
  }
  const Du = Xe(() => [
    ...Zo.map((o) => ({ key: `version-${o.version}`, at: o.published_at, title: `发布了版本 ${o.version}`, detail: `${qe[o.published_by_user_id]?.display_name || "账号不可用"} · ${o.publish_note || o.body.summary || "无发布说明"}` })),
    ...Ui.map((o) => ({ key: `comment-${o.id}-${o.revision}`, at: o.updated_at, title: o.deleted ? "删除了评论" : o.resolved ? "解决了评论" : o.revision > 1 ? "更新了评论" : o.parent_comment_id ? "回复了评论" : "发表了评论", detail: `${qe[o.author_user_id]?.display_name || "账号不可用"} · 版本 ${o.published_version}` })),
    ...Gr.map((o) => ({ key: `task-${o.id}-${o.revision}`, at: o.updated_at, title: o.status === "done" ? "完成了任务" : o.status === "canceled" ? "取消了任务" : o.revision > 1 ? "更新了任务" : "创建了任务", detail: `${o.title} · ${o.assignee_user_ids.map((f) => qe[f]?.display_name || f).join("、") || "未指派"}` }))
  ].sort((o, f) => f.at.localeCompare(o.at)), [Ui, qe, Gr, Zo]), Bu = Xe(() => {
    const o = /* @__PURE__ */ new Map();
    for (const f of ya) {
      const A = o.get(f.user_id) || { userID: f.user_id, sessions: 0, cursorBlockID: "", selectionBlockID: "", lastSeenAt: "" };
      A.sessions++, f.last_seen_at >= A.lastSeenAt && (A.cursorBlockID = f.cursor_block_id || "", A.selectionBlockID = f.selection_block_id || "", A.lastSeenAt = f.last_seen_at), o.set(f.user_id, A);
    }
    return [...o.values()].sort((f, A) => f.userID === wa ? -1 : A.userID === wa ? 1 : A.lastSeenAt.localeCompare(f.lastSeenAt));
  }, [ya, wa]), ql = Y?.published?.body.content || "", Pu = Y?.published?.body.content || Y?.draft?.body.content || "", Mu = Xe(() => Y?.page.content_type === "document" ? mv(ql) : [], [ql, Y?.page.content_type]), zu = Xe(() => gv(un), [un]), Sr = Xe(() => ({
    currentPageID: ne,
    async searchPeople(o, f) {
      return (await t.searchLibraryMembers(e.id, o, "", 20, f)).items.filter((I) => I.status === "active").map((I) => ({ userID: I.user_id, displayName: I.display_name, email: I.email }));
    },
    async resolvePerson(o, f) {
      const A = (await t.resolvePrincipals([o], f)).find((I) => I.user_id === o && I.status === "active");
      return A ? { userID: A.user_id, displayName: A.display_name, email: A.email } : null;
    },
    async searchPages(o, f) {
      return (await t.searchPageIdentities(e.id, o.trim(), 20, f)).items.map((I) => ({
        pageID: I.page_id,
        title: I.title,
        contentType: I.content_type,
        aliases: I.aliases,
        path: I.path.map((G) => ({ pageID: G.page_id, title: G.title }))
      }));
    },
    async resolvePage(o, f) {
      if (Y?.page.id === o) return { pageID: o, title: dn.trim() || Y.page.title, contentType: Y.page.content_type, aliases: q?.aliases || [], path: Y.breadcrumbs.map((A) => ({ pageID: A.page_id, title: A.title })) };
      try {
        const [A, I] = await Promise.all([t.getPage(e.id, o, p, f), t.getPageMetadata(e.id, o, f)]), G = A.draft || A.published;
        return { pageID: o, title: G?.title || A.page.title, contentType: A.page.content_type, aliases: I.aliases || [], path: A.breadcrumbs.map((V) => ({ pageID: V.page_id, title: V.title })) };
      } catch {
        return null;
      }
    }
  }), [p, t, e.id, q?.aliases, ne, dn, Y]), Aa = Xe(() => {
    const o = (A) => {
      const I = [...Mn.current.filter((G) => G.id !== A.id), A].sort((G, V) => G.id.localeCompare(V.id));
      return Mn.current = I, Gi(I), ut(A.assignee_user_ids, AbortSignal.timeout(3e4)), A;
    }, f = Y?.page.state === "active";
    return {
      ready: gl,
      canCreate: gl && p && f && he === "edit",
      taskForBlock: (A) => Mn.current.find((I) => I.source_block_id === A),
      canManage: () => !!(p && f && he !== "history"),
      canUpdateStatus: (A) => !!(f && he !== "history" && (p || !n || A.assignee_user_ids.includes(n))),
      ensureTask(A, I) {
        const G = Mn.current.find((Ie) => Ie.source_block_id === A);
        if (G) return Promise.resolve(G);
        const V = ma.current.get(A);
        if (V) return V;
        const Ee = t.createPageTask(e.id, ne, {
          client_id: crypto.randomUUID(),
          source_block_id: A,
          title: I.trim() || "待办任务",
          assignee_user_ids: [],
          priority: "none"
        }, AbortSignal.timeout(3e4)).then(o).catch((Ie) => {
          throw ae(i(Ie)), Ie;
        }).finally(() => ma.current.delete(A));
        return ma.current.set(A, Ee), Ee;
      },
      async updateTask(A, I) {
        try {
          return o(await t.updatePageTask(e.id, ne, A.id, {
            client_id: crypto.randomUUID(),
            expected_revision: A.revision,
            title: I.title ?? A.title,
            status: I.status ?? A.status,
            assignee_user_ids: I.assignee_user_ids ?? A.assignee_user_ids,
            due_at: Object.hasOwn(I, "due_at") ? I.due_at : A.due_at,
            reminder_at: Object.hasOwn(I, "reminder_at") ? I.reminder_at : A.reminder_at,
            priority: I.priority ?? A.priority
          }, AbortSignal.timeout(3e4)));
        } catch (G) {
          if (At(G) === 409)
            try {
              const V = await t.listPageTasks(e.id, ne, AbortSignal.timeout(3e4));
              Mn.current = V.items, Gi(V.items);
            } catch {
            }
          throw ae(i(G)), G;
        }
      },
      async searchMembers(A, I) {
        const V = (await t.searchLibraryMembers(e.id, A, "", 20, I)).items.filter((Ee) => Ee.status === "active");
        return Hr((Ee) => ({ ...Ee, ...Object.fromEntries(V.map((Ie) => [Ie.user_id, Ie])) })), V;
      },
      memberName: (A) => qe[A]?.display_name || A
    };
  }, [p, t, n, i, e.id, qe, he, ne, Gr, gl, Y?.page.state]), Ca = Xe(() => {
    const o = (I) => {
      const G = [...Cr.current.filter((V) => V.poll.id !== I.poll.id), I].sort((V, Ee) => V.poll.id.localeCompare(Ee.poll.id));
      return Cr.current = G, sa(G), I;
    }, f = async () => {
      const I = await t.listPagePolls(e.id, ne, AbortSignal.timeout(3e4));
      Cr.current = I.items, sa(I.items);
    }, A = Y?.page.state === "active";
    return {
      ready: bl,
      canCreate: bl && p && A && he === "edit",
      pollForBlock: (I) => Cr.current.find((G) => G.poll.source_block_id === I),
      canManage: () => !!(p && A && he !== "history"),
      ensurePoll(I, G) {
        const V = Cr.current.find(($e) => $e.poll.source_block_id === I);
        if (V) return Promise.resolve(V);
        const Ee = ba.current.get(I);
        if (Ee) return Ee;
        const Ie = t.createPagePoll(e.id, ne, {
          client_id: crypto.randomUUID(),
          source_block_id: I,
          question: G.trim() || "请选择一个选项",
          options: ["选项 1", "选项 2"],
          multiple: !1
        }, AbortSignal.timeout(3e4)).then(o).catch(($e) => {
          throw ae(i($e)), $e;
        }).finally(() => ba.current.delete(I));
        return ba.current.set(I, Ie), Ie;
      },
      async updatePoll(I, G) {
        try {
          return o(await t.updatePagePoll(e.id, ne, I.poll.id, {
            client_id: crypto.randomUUID(),
            expected_revision: I.poll.revision,
            question: G.question ?? I.poll.question,
            options: G.options ?? I.poll.options,
            multiple: G.multiple ?? I.poll.multiple,
            status: G.status ?? I.poll.status
          }, AbortSignal.timeout(3e4)));
        } catch (V) {
          if (At(V) === 409) try {
            await f();
          } catch {
          }
          throw ae(i(V)), V;
        }
      },
      async votePoll(I, G) {
        try {
          return o(await t.votePagePoll(e.id, ne, I.poll.id, {
            client_id: crypto.randomUUID(),
            expected_ballot_revision: I.ballot_revision,
            option_ids: G
          }, AbortSignal.timeout(3e4)));
        } catch (V) {
          if (At(V) === 409) try {
            await f();
          } catch {
          }
          throw ae(i(V)), V;
        }
      }
    };
  }, [p, t, i, e.id, he, um, bl, ne, Y?.page.state]), Hl = Xe(() => ({
    currentPageID: ne,
    canCreateChild: !!(p && he === "edit" && Y?.draft && Y.page.content_type === "document" && t.createPageReference),
    async listChildPages(o, f) {
      return (await t.listPages(e.id, ne, "", Math.max(1, Math.min(o, 50)), !1, f)).items.map((I) => ({ pageID: I.id, title: I.title, contentType: I.content_type, aliases: [], path: [{ pageID: ne, title: Y?.page.title || "当前页面" }, { pageID: I.id, title: I.title }] }));
    },
    searchPages: Sr.searchPages,
    resolvePage: Sr.resolvePage,
    async listPageVersions(o, f) {
      return (await t.listPageVersions(e.id, o, 0, 100, f)).items;
    },
    async createChildReference(o) {
      const f = Fe.current;
      if (!f?.draft || f.page.content_type !== "document" || !t.createPageReference) throw Error("当前页面不支持创建内嵌子页面。");
      ae("");
      try {
        let A = f.draft.draft_revision, I = o.parentContent;
        if (ve.available) {
          const V = await ve.flush();
          A = V.draftRevision, I = V.content;
        }
        const G = await t.createPageReference(e.id, f.page.id, {
          client_id: crypto.randomUUID(),
          expected_parent_draft_revision: A,
          expected_parent_page_revision: f.page.revision,
          parent_content_schema_version: oi,
          parent_content: I,
          parent_content_sha256: await cs(I),
          reference_block_id: o.blockID,
          title: o.title,
          content_type: o.contentType,
          display: o.display
        }, AbortSignal.timeout(3e4));
        if (!G.parent.draft) throw Error("父页面草稿不可用。");
        Fe.current = G.parent, dt(G.parent), Nn(G.parent.draft.title), hn(G.parent.draft.body.content), pt.current = { title: G.parent.draft.title, body: G.parent.draft.body.content }, Dn(!1), qt("saved"), Yn(null), Pn("idle"), _((V) => Object.fromEntries(Object.entries(V).map(([Ee, Ie]) => [Ee, Ie.map(($e) => $e.id === f.page.id ? { ...$e, has_children: !0 } : $e)]))), y((V) => new Set(V).add(f.page.id)), await Et(f.page.id, AbortSignal.timeout(3e4)), Ho((V) => V + 1), ve.available && ve.reconnect(), Pe(`已创建子${Vt[o.contentType].label}并插入当前文档。`);
      } catch (A) {
        throw ae(i(A)), A;
      }
    },
    renderReference(o) {
      return /* @__PURE__ */ c(O1, { client: t, library: e, currentUserID: n, canWrite: p, formatError: i, reference: o, onOpen: (f) => {
        Je("read"), et(f);
      } });
    },
    async listPageActivity(o, f) {
      const [A, I, G] = await Promise.all([
        t.listPageVersions(e.id, ne, 0, o, f),
        t.listPageComments(e.id, ne, "", o, !1, f),
        t.listPageTasks(e.id, ne, f)
      ]);
      return [
        ...A.items.map((V) => ({ id: `version-${V.version}`, title: `发布了版本 ${V.version}`, detail: `${V.published_by_user_id} · ${V.publish_note || V.body.summary || "无发布说明"}`, at: V.published_at })),
        ...I.items.map((V) => ({ id: `comment-${V.id}-${V.revision}`, title: V.deleted ? "删除了评论" : V.resolved ? "解决了评论" : V.revision > 1 ? "更新了评论" : V.parent_comment_id ? "回复了评论" : "发表了评论", detail: `${V.author_user_id} · 版本 ${V.published_version}`, at: V.updated_at })),
        ...G.items.map((V) => ({ id: `task-${V.id}-${V.revision}`, title: V.status === "done" ? "完成了任务" : V.status === "canceled" ? "取消了任务" : V.revision > 1 ? "更新了任务" : "创建了任务", detail: `${V.title} · ${V.updated_by_user_id}`, at: V.updated_at }))
      ].sort((V, Ee) => Ee.at.localeCompare(V.at)).slice(0, o);
    },
    resolveApplicationCard: t.resolveApplicationCard ? (o, f) => t.resolveApplicationCard(e.id, ne, o, f) : void 0,
    openPage(o) {
      Je("read"), et(o);
    }
  }), [p, t, ve, n, i, e, Sr, he, ne, Y?.draft, Y?.page.content_type]), Ru = Xe(() => {
    if (Y?.page.content_type !== "form" || !Y.published || !t.submitPageForm || !t.listPageFormSubmissions || !t.getPageFormAnalytics || !t.exportPageFormSubmissions) return;
    const o = nv(Y.published.body.content), f = { reader: 1, editor: 2, manager: 3 }, A = Date.now(), I = o.settings.opens_at ? Date.parse(o.settings.opens_at) : 0, G = o.settings.closes_at ? Date.parse(o.settings.closes_at) : 0, V = f[e.role] >= f[o.settings.submission_role] && (!I || A >= I) && (!G || A < G), Ee = typeof window > "u" ? "" : m1(window.location.href, { libraryID: e.id, libraryKind: e.kind, pageID: ne, mode: "read" });
    return {
      canSubmit: V,
      canManage: e.role === "manager",
      publishedVersion: Y.page.published_version || 0,
      shareURL: Ee,
      formatError: i,
      submit: (Ie) => t.submitPageForm(e.id, ne, { client_id: crypto.randomUUID(), answers: Ie }, AbortSignal.timeout(3e4)),
      listResponses: (Ie, $e) => t.listPageFormSubmissions(e.id, ne, Ie, $e, AbortSignal.timeout(3e4)),
      analytics: () => t.getPageFormAnalytics(e.id, ne, AbortSignal.timeout(3e4)),
      exportResponses: () => t.exportPageFormSubmissions(e.id, ne, AbortSignal.timeout(3e4))
    };
  }, [t, i, e.id, e.kind, e.role, ne, Y?.page.content_type, Y?.page.published_version, Y?.published]), lb = Xe(() => (o) => g1(window.location.href, {
    libraryID: e.id,
    libraryKind: e.kind,
    pageID: ne,
    mode: "edit"
  }, o), [e.id, e.kind, ne]), Ia = ne === a ? d : void 0, Tu = ne === a ? l || Ia?.block_id || Ia?.node_id : void 0, cb = ta.nodeID || Tu, Gl = Xe(() => [...new Set([
    ...ze.map((o) => o.user_id),
    q?.owner_user_id || "",
    ...q?.content_admin_user_ids || [],
    q?.last_reviewed_by_user_id || "",
    ...q?.properties.filter((o) => o.type === "person").map((o) => o.value) || []
  ].filter(Boolean))], [q?.content_admin_user_ids, q?.last_reviewed_by_user_id, q?.owner_user_id, q?.properties, ze]), Fu = !!q && p && (e.role === "manager" || q.owner_user_id === n || q.content_admin_user_ids.includes(n)), db = ve.available ? ve.state : ar.state, Lu = { unavailable: "标准草稿模式", connecting: "正在连接协作会话", connected: "在线状态已同步", syncing: "正在合并更改", reconnecting: "正在恢复会话", error: "协作连接中断" }[db], ub = Y?.page.content_type !== "document" && Y?.page.content_type !== "form" && Y?.page.content_type !== "presentation" && Y?.page.content_type !== "mind_note" && Y?.page.content_type !== "mind_map" && Y?.page.content_type !== "flowchart", Ou = Y?.page.content_type === "document" && p && !!t.createAIExecution && !!t.getAIExecution && !!t.confirmAIExecution, hb = !!(Y && he === "edit" && N1.has(Y.page.content_type));
  return /* @__PURE__ */ u("section", { className: `knowledge-pages${s ? " is-embedded" : ""}`, "aria-label": "知识页面", children: [
    !s && /* @__PURE__ */ u("header", { className: "knowledge-section-heading", children: [
      /* @__PURE__ */ u("div", { className: "knowledge-section-identity", children: [
        /* @__PURE__ */ c("span", { className: "knowledge-section-icon", "aria-hidden": "true", children: /* @__PURE__ */ c(Ln, { size: 18 }) }),
        /* @__PURE__ */ u("span", { children: [
          /* @__PURE__ */ c("small", { children: "Knowledge workspace" }),
          /* @__PURE__ */ c("h3", { children: "知识页面" }),
          /* @__PURE__ */ c("p", { children: "协作编辑、版本发布与访问治理集中在一个工作区。" })
        ] })
      ] }),
      Y && /* @__PURE__ */ u("span", { className: `knowledge-index-state is-${Y.page.projection_status || "none"}`, children: [
        /* @__PURE__ */ c("span", { "aria-hidden": "true" }),
        T1(Y.page)
      ] })
    ] }),
    /* @__PURE__ */ u("div", { className: "knowledge-pages-layout", children: [
      /* @__PURE__ */ u("aside", { className: "knowledge-page-tree", onDragOver: (o) => {
        p && o.preventDefault();
      }, onDrop: () => {
        xn && xn.parent_page_id && ku(xn, ""), Qs(null), qr(null);
      }, children: [
        /* @__PURE__ */ u("div", { className: "knowledge-tree-toolbar", children: [
          /* @__PURE__ */ u("label", { children: [
            /* @__PURE__ */ c(mn, { size: 14, "aria-hidden": "true" }),
            /* @__PURE__ */ c("input", { "aria-label": `筛选${ni[N]}`, value: J, onChange: (o) => be(o.target.value), placeholder: `搜索${ni[N]}` })
          ] }),
          p && /* @__PURE__ */ u("div", { ref: pa, className: "knowledge-create-menu-wrap", children: [
            /* @__PURE__ */ c(te, { "aria-label": "新建知识条目", title: "新建知识条目", "aria-haspopup": "menu", "aria-expanded": Ls, disabled: r, onClick: () => Xn((o) => !o), children: /* @__PURE__ */ c(ro, { size: 16 }) }),
            Ls && typeof document < "u" && wi(/* @__PURE__ */ u("div", { ref: hu, className: "knowledge-create-menu", role: "menu", "aria-label": "新建知识条目类型", style: sm, children: [
              t.listPageTemplates && t.instantiatePageTemplate && /* @__PURE__ */ u("button", { className: "knowledge-create-menu-template", role: "menuitem", onClick: () => {
                Bm();
              }, children: [
                /* @__PURE__ */ c(Qu, { size: 18 }),
                /* @__PURE__ */ u("span", { children: [
                  /* @__PURE__ */ c("strong", { children: "从模板创建" }),
                  /* @__PURE__ */ c("small", { children: "复用完整页面子树，并保留独立内容" })
                ] })
              ] }),
              dA.map((o) => /* @__PURE__ */ u("button", { role: "menuitem", onClick: () => {
                Xn(!1), Nm(o);
              }, children: [
                /* @__PURE__ */ c(Rt, { type: o, size: 18 }),
                /* @__PURE__ */ u("span", { children: [
                  /* @__PURE__ */ c("strong", { children: Vt[o].label }),
                  /* @__PURE__ */ c("small", { children: Vt[o].description })
                ] })
              ] }, o)),
              e.documents_configured && uA.map((o) => /* @__PURE__ */ u("button", { role: "menuitem", disabled: Xo, onClick: () => {
                Xn(!1), o.importer?.kind === "document-upload" && ga.current?.click();
              }, children: [
                /* @__PURE__ */ c(ju, { size: 18 }),
                /* @__PURE__ */ u("span", { children: [
                  /* @__PURE__ */ u("strong", { children: [
                    "上传及导入",
                    o.label
                  ] }),
                  /* @__PURE__ */ u("small", { children: [
                    "在当前节点下创建",
                    o.label,
                    "页面"
                  ] })
                ] })
              ] }, `import-${o.id}`))
            ] }), document.body)
          ] }),
          /* @__PURE__ */ c("input", { ref: ga, className: "knowledge-visually-hidden", type: "file", accept: ch(e), disabled: !p || Xo, onChange: (o) => {
            const f = o.target.files?.[0];
            f && zm(f);
          } }),
          m && /* @__PURE__ */ c(te, { "aria-label": "管理知识库", title: "管理知识库", disabled: r, onClick: m, children: /* @__PURE__ */ c(Eb, { size: 15 }) })
        ] }),
        /* @__PURE__ */ u("nav", { className: "knowledge-page-collections", "aria-label": "页面导航", children: [
          /* @__PURE__ */ u("button", { type: "button", "aria-pressed": N === "all", onClick: () => {
            R("all"), be("");
          }, children: [
            /* @__PURE__ */ c(Ln, { size: 14 }),
            /* @__PURE__ */ c("span", { children: "全部" })
          ] }),
          /* @__PURE__ */ u("button", { type: "button", "aria-pressed": N === "shortcuts", onClick: () => {
            R("shortcuts"), be("");
          }, children: [
            /* @__PURE__ */ c(qu, { size: 14 }),
            /* @__PURE__ */ c("span", { children: "快捷" })
          ] }),
          /* @__PURE__ */ u("button", { type: "button", "aria-pressed": N === "favorites", onClick: () => {
            R("favorites"), be("");
          }, children: [
            /* @__PURE__ */ c(Hu, { size: 14 }),
            /* @__PURE__ */ c("span", { children: "收藏" })
          ] }),
          /* @__PURE__ */ u("details", { className: "knowledge-page-collection-more", children: [
            /* @__PURE__ */ u("summary", { "aria-label": "更多页面筛选", children: [
              /* @__PURE__ */ c(Gu, { size: 14 }),
              /* @__PURE__ */ c("span", { children: ["recent_views", "recent_edits", "subscribed", "trash"].includes(N) ? ni[N] : "更多" }),
              /* @__PURE__ */ c(es, { size: 12 })
            ] }),
            /* @__PURE__ */ u("div", { role: "menu", "aria-label": "更多页面筛选", children: [
              /* @__PURE__ */ u("button", { type: "button", role: "menuitemradio", "aria-checked": N === "recent_views", onClick: (o) => {
                R("recent_views"), be(""), o.currentTarget.closest("details")?.removeAttribute("open");
              }, children: [
                /* @__PURE__ */ c(Ua, { size: 14 }),
                /* @__PURE__ */ c("span", { children: "最近访问" })
              ] }),
              /* @__PURE__ */ u("button", { type: "button", role: "menuitemradio", "aria-checked": N === "recent_edits", onClick: (o) => {
                R("recent_edits"), be(""), o.currentTarget.closest("details")?.removeAttribute("open");
              }, children: [
                /* @__PURE__ */ c(Vl, { size: 14 }),
                /* @__PURE__ */ c("span", { children: "最近编辑" })
              ] }),
              /* @__PURE__ */ u("button", { type: "button", role: "menuitemradio", "aria-checked": N === "subscribed", onClick: (o) => {
                R("subscribed"), be(""), o.currentTarget.closest("details")?.removeAttribute("open");
              }, children: [
                /* @__PURE__ */ c(Ju, { size: 14 }),
                /* @__PURE__ */ c("span", { children: "订阅页面" })
              ] }),
              p && /* @__PURE__ */ u(xt, { children: [
                /* @__PURE__ */ c("hr", {}),
                /* @__PURE__ */ u("button", { type: "button", role: "menuitemradio", "aria-checked": N === "trash", onClick: (o) => {
                  R("trash"), be(""), o.currentTarget.closest("details")?.removeAttribute("open");
                }, children: [
                  /* @__PURE__ */ c(Sa, { size: 14 }),
                  /* @__PURE__ */ c("span", { children: "回收站" })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ u("div", { className: "knowledge-tree-label", children: [
          /* @__PURE__ */ c("span", { children: ni[N] }),
          N !== "all" && /* @__PURE__ */ c("button", { type: "button", "aria-label": `刷新${ni[N]}`, title: "刷新", disabled: F, onClick: () => {
            Tl(N);
          }, children: /* @__PURE__ */ c(lt, { className: F ? "knowledge-spin" : void 0, size: 12 }) })
        ] }),
        N === "all" ? /* @__PURE__ */ u("div", { role: "tree", "aria-label": "知识条目树", children: [
          va.map(({ page: o, parent: f, depth: A, loadMore: I }, G) => I ? /* @__PURE__ */ c("button", { className: "knowledge-tree-more", style: { marginInlineStart: `${A * 16 + 24}px` }, onClick: () => {
            Et(f, AbortSignal.timeout(3e4), !0);
          }, children: "加载更多" }, `more-${f}-${G}`) : o && /* @__PURE__ */ u("div", { className: `knowledge-tree-row${xn?.id === o.id ? " is-dragging" : ""}${js?.pageID === o.id ? ` is-drop-${js.placement}` : ""}`, style: { paddingInlineStart: `${A * 16 + 4}px` }, draggable: p, title: p ? "按住并拖动以调整位置" : void 0, onDragStart: (V) => {
            V.dataTransfer.effectAllowed = "move", V.dataTransfer.setData("text/plain", o.id), et(o.id), Qs(o), qr(null);
          }, onDragEnd: () => {
            Qs(null), qr(null);
          }, onDragOver: (V) => {
            !p || !xn || xn.id === o.id || (V.preventDefault(), V.stopPropagation(), V.dataTransfer.dropEffect = "move", qr({ pageID: o.id, placement: vu(V, f) }));
          }, onDragLeave: (V) => {
            V.currentTarget.contains(V.relatedTarget) || qr((Ee) => Ee?.pageID === o.id ? null : Ee);
          }, onDrop: (V) => {
            V.preventDefault(), V.stopPropagation();
            const Ee = js?.pageID === o.id ? js.placement : vu(V, f);
            xn && Om(xn, o, Ee), Qs(null), qr(null);
          }, children: [
            Ul(o) ? /* @__PURE__ */ c("button", { className: "knowledge-tree-toggle", "aria-label": k.has(o.id) ? "折叠子页面" : "展开子页面", onClick: () => {
              Ol(o);
            }, children: k.has(o.id) ? /* @__PURE__ */ c(es, { size: 14 }) : /* @__PURE__ */ c(ii, { size: 14 }) }) : /* @__PURE__ */ c("span", { className: "knowledge-tree-toggle-spacer", "aria-hidden": "true" }),
            /* @__PURE__ */ u("button", { ref: (V) => {
              uu.current[o.id] = V;
            }, role: "treeitem", "aria-selected": ne === o.id, tabIndex: ne === o.id ? 0 : -1, onKeyDown: (V) => {
              if (V.key === "ArrowRight" && !k.has(o.id) && Ul(o))
                V.preventDefault(), Ol(o);
              else if (V.key === "ArrowLeft")
                V.preventDefault(), k.has(o.id) ? Ol(o) : f && Rl(f);
              else if (V.key === "ArrowDown") {
                V.preventDefault();
                const Ee = va.slice(G + 1).find((Ie) => Ie.page)?.page;
                Ee && Rl(Ee.id);
              } else if (V.key === "ArrowUp") {
                V.preventDefault();
                const Ee = va.slice(0, G).reverse().find((Ie) => Ie.page)?.page;
                Ee && Rl(Ee.id);
              } else V.key === "Enter" && et(o.id);
            }, onClick: () => et(o.id), children: [
              /* @__PURE__ */ c(Rt, { type: o.content_type, size: 14 }),
              /* @__PURE__ */ c("span", { children: o.title })
            ] })
          ] }, o.id)),
          !Fs && va.length === 0 && /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "没有知识条目。" })
        ] }) : /* @__PURE__ */ u("div", { className: "knowledge-collection-list", role: "list", children: [
          Nu.map((o) => /* @__PURE__ */ u("button", { type: "button", role: "listitem", "aria-current": ne === o.page.id ? "page" : void 0, onClick: () => et(o.page.id), children: [
            /* @__PURE__ */ c(Rt, { type: o.page.content_type, size: 15 }),
            /* @__PURE__ */ u("span", { children: [
              /* @__PURE__ */ c("strong", { children: o.page.title }),
              /* @__PURE__ */ c("small", { children: ob(o) })
            ] }),
            o.page.state === "archived" && /* @__PURE__ */ c(Sa, { size: 13, "aria-label": "已归档" })
          ] }, o.page.id)),
          F && B.length === 0 && /* @__PURE__ */ u("p", { role: "status", className: "knowledge-subtle", children: [
            /* @__PURE__ */ c(si, { className: "knowledge-spin", size: 14 }),
            "正在加载…"
          ] }),
          !F && Nu.length === 0 && /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: J ? "没有匹配页面。" : `${ni[N]}中还没有页面。` }),
          !pe && /* @__PURE__ */ c("button", { type: "button", className: "knowledge-tree-more", disabled: F, onClick: () => {
            Im();
          }, children: F ? "加载中…" : "加载更多" })
        ] })
      ] }),
      /* @__PURE__ */ u("article", { ref: Pl, onCopyCapture: (o) => {
        $m(o);
      }, className: `knowledge-page-main${he === "outline" || he === "comments" || he === "suggestions" || he === "activity" || he === "access" || he === "permissions" || he === "governance" ? " has-side-panel" : ""}${hb ? " is-workbench" : ""}`, children: [
        Qt && /* @__PURE__ */ c("p", { role: "status", className: "knowledge-notice", children: Qt }),
        Qe && /* @__PURE__ */ c("p", { role: "alert", className: "knowledge-error", children: Qe }),
        /* @__PURE__ */ c(Zg, { governance: Y?.governance }),
        rr && /* @__PURE__ */ u("section", { className: "knowledge-confirm knowledge-move-impact", role: "dialog", "aria-label": "确认页面权限影响", children: [
          /* @__PURE__ */ c("h3", { children: "移动会改变页面权限" }),
          /* @__PURE__ */ u("p", { children: [
            "将影响该子树中的 ",
            rr.impact.affected_pages,
            " 个页面，并改变 ",
            rr.impact.changed_subjects.length,
            " 个用户或组织的有效访问。"
          ] }),
          rr.impact.changed_subjects.length > 0 && /* @__PURE__ */ u("p", { className: "knowledge-subtle", children: [
            "涉及主体：",
            rr.impact.changed_subjects.map(pu).join("、")
          ] }),
          /* @__PURE__ */ u("div", { className: "knowledge-actions", children: [
            /* @__PURE__ */ c(te, { className: "danger", onClick: () => {
              $l(rr.page, rr.parentPageID, rr.impact.token);
            }, children: "确认移动并更新继承" }),
            /* @__PURE__ */ c(te, { onClick: () => da(null), children: "取消移动" })
          ] })
        ] }),
        !Y && !Fs ? /* @__PURE__ */ u(hi, { children: [
          /* @__PURE__ */ c(xb, { size: 28 }),
          /* @__PURE__ */ c("h3", { children: "选择或新建页面" })
        ] }) : null,
        Y && /* @__PURE__ */ u(xt, { children: [
          /* @__PURE__ */ c("nav", { className: "knowledge-page-breadcrumbs", "aria-label": "页面路径", children: Y.breadcrumbs.map((o, f) => /* @__PURE__ */ u("span", { children: [
            f > 0 && /* @__PURE__ */ c(ii, { size: 12, "aria-hidden": "true" }),
            /* @__PURE__ */ c("button", { onClick: () => et(o.page_id), children: o.title })
          ] }, o.page_id)) }),
          /* @__PURE__ */ u("header", { className: `knowledge-page-title${he === "edit" ? " is-editing" : ""}`, children: [
            /* @__PURE__ */ u("div", { className: "knowledge-page-heading", children: [
              /* @__PURE__ */ u("div", { className: "knowledge-page-heading-line", children: [
                he !== "edit" && /* @__PURE__ */ c("h2", { className: p && Y.page.state === "active" ? "is-editable" : void 0, title: p && Y.page.state === "active" ? "双击编辑标题" : void 0, onDoubleClick: () => {
                  p && Y.page.state === "active" && (Je("edit"), window.setTimeout(() => Zi.current?.select()));
                }, children: he === "suggestions" ? Y.draft?.title || Y.page.title : Y.published?.title || Y.page.title }),
                /* @__PURE__ */ c(Xg, { governance: Y.governance })
              ] }),
              /* @__PURE__ */ u("p", { children: [
                he === "suggestions" && Y.draft ? `草稿 revision ${Y.draft.draft_revision}` : `版本 ${Y.page.published_version || "未发布"}`,
                /* @__PURE__ */ c("span", { "aria-hidden": "true", children: " · " }),
                he === "suggestions" && Y.draft ? "修订提议基于当前草稿" : Y.published ? `${qe[Y.published.published_by_user_id]?.display_name || "账号不可用"} 发布于 ${new Date(Y.published.published_at).toLocaleString()}` : "仅草稿"
              ] }),
              q && (de || q.tags.length > 0 || q.aliases.length > 0 || q.related_page_ids.length > 0 || q.owner_user_id || q.status || q.next_review_at) && /* @__PURE__ */ u("div", { className: "knowledge-page-metadata-summary", "aria-label": "页面属性摘要", children: [
                de && /* @__PURE__ */ c("span", { className: "is-pending", children: "未保存" }),
                q.status && /* @__PURE__ */ u("span", { className: `is-status-${q.status}`, children: [
                  /* @__PURE__ */ c("i", { "aria-hidden": "true" }),
                  Df[q.status]
                ] }),
                q.owner_user_id && /* @__PURE__ */ u("span", { children: [
                  /* @__PURE__ */ c(ds, { size: 12 }),
                  "负责人 ",
                  qe[q.owner_user_id]?.display_name || q.owner_user_id
                ] }),
                q.next_review_at && /* @__PURE__ */ u("span", { children: [
                  /* @__PURE__ */ c(Vu, { size: 12 }),
                  "复核 ",
                  new Date(q.next_review_at).toLocaleString()
                ] }),
                q.aliases.map((o) => /* @__PURE__ */ u("span", { children: [
                  /* @__PURE__ */ c(Ku, { size: 11 }),
                  "别名 ",
                  o
                ] }, `alias-${o}`)),
                q.related_page_ids.length > 0 && /* @__PURE__ */ u("span", { children: [
                  /* @__PURE__ */ c(_i, { size: 11 }),
                  q.related_page_ids.length,
                  " 个关联页面"
                ] }),
                q.tags.map((o) => /* @__PURE__ */ u("span", { className: "is-tag", children: [
                  /* @__PURE__ */ c(Wu, { size: 11 }),
                  o
                ] }, o))
              ] })
            ] }),
            /* @__PURE__ */ u("div", { className: "knowledge-page-heading-actions", children: [
              he === "edit" && Am && /* @__PURE__ */ u("details", { className: "knowledge-presence-details", children: [
                /* @__PURE__ */ u("summary", { "aria-label": `${zl} 人在线编辑`, children: [
                  /* @__PURE__ */ c("div", { className: "knowledge-avatar-stack", children: Bu.slice(0, 4).map((o) => /* @__PURE__ */ c("span", { title: qe[o.userID]?.display_name || o.userID, style: { "--collaborator-color": vc(o.userID) }, children: (qe[o.userID]?.display_name || o.userID).slice(0, 1).toUpperCase() }, o.userID)) }),
                  /* @__PURE__ */ u("strong", { children: [
                    zl,
                    " 人在线"
                  ] }),
                  /* @__PURE__ */ c(es, { size: 13 })
                ] }),
                /* @__PURE__ */ u("aside", { className: "knowledge-collaboration-popover", "aria-label": "在线协作详情", children: [
                  /* @__PURE__ */ u("header", { children: [
                    /* @__PURE__ */ u("div", { children: [
                      /* @__PURE__ */ c(ds, { size: 17 }),
                      /* @__PURE__ */ c("strong", { children: "在线协作" })
                    ] }),
                    /* @__PURE__ */ u("span", { children: [
                      zl,
                      " 人"
                    ] })
                  ] }),
                  /* @__PURE__ */ u("section", { className: "knowledge-merge-strategy", children: [
                    /* @__PURE__ */ c(Xu, { size: 17 }),
                    /* @__PURE__ */ u("div", { children: [
                      /* @__PURE__ */ c("strong", { children: "内容冲突自动收敛" }),
                      /* @__PURE__ */ c("p", { children: ve.available ? "正文由 Yjs 按内容块与富文本节点合并；服务端串行确认时钟、校验 Block JSON，并持久化完整检查点。" : "图形由服务端按节点、连线和画布结构校验目标哈希后合并；不同目标可并行写入，同一目标的过期修改会明确冲突。" })
                    ] })
                  ] }),
                  ve.available && ve.mergeCount > 0 && /* @__PURE__ */ u("p", { className: "knowledge-merge-event", children: [
                    /* @__PURE__ */ c(Nr, { size: 14 }),
                    "已自动合并 ",
                    ve.mergeCount,
                    " 个远端更新",
                    ve.mergedUserIDs.length > 0 ? `，来自 ${ve.mergedUserIDs.map((o) => qe[o]?.display_name || o).join("、")}` : ""
                  ] }),
                  /* @__PURE__ */ c("div", { className: "knowledge-collaborator-list", children: Bu.map((o) => {
                    const A = qe[o.userID]?.display_name || o.userID, I = o.selectionBlockID ? `${ar.available ? "选中目标" : "选区"} ${o.cursorBlockID.slice(0, 8) || "起点"} → ${o.selectionBlockID.slice(0, 8)}` : o.cursorBlockID ? `${ar.available ? "选中" : "光标在内容块"} ${o.cursorBlockID.slice(0, 8)}` : "正在查看";
                    return /* @__PURE__ */ u("div", { className: "knowledge-collaborator", children: [
                      /* @__PURE__ */ u("span", { className: "knowledge-collaborator-avatar", style: { "--collaborator-color": vc(o.userID) }, children: [
                        A.slice(0, 1).toUpperCase(),
                        /* @__PURE__ */ c("i", {})
                      ] }),
                      /* @__PURE__ */ u("span", { children: [
                        /* @__PURE__ */ u("strong", { children: [
                          A,
                          o.userID === wa && /* @__PURE__ */ c("em", { children: "你" })
                        ] }),
                        /* @__PURE__ */ u("small", { children: [
                          I,
                          o.sessions > 1 ? ` · ${o.sessions} 个设备` : ""
                        ] })
                      ] }),
                      /* @__PURE__ */ c("time", { dateTime: o.lastSeenAt, children: L1(o.lastSeenAt) })
                    ] }, o.userID);
                  }) }),
                  /* @__PURE__ */ u("footer", { children: [
                    /* @__PURE__ */ u("span", { children: [
                      /* @__PURE__ */ c(Zu, { size: 13 }),
                      Lu
                    ] }),
                    ve.available && ve.state === "error" && /* @__PURE__ */ u(te, { onClick: ve.reconnect, children: [
                      /* @__PURE__ */ c(lt, { size: 13 }),
                      "重新连接"
                    ] })
                  ] })
                ] })
              ] }),
              he !== "edit" && p && Y.page.state === "active" && /* @__PURE__ */ u(te, { className: "primary", onClick: () => {
                Je("edit"), window.setTimeout(() => Zi.current?.select());
              }, children: [
                /* @__PURE__ */ c(Vl, { size: 14 }),
                "编辑"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ u("div", { className: "knowledge-page-toolbar", children: [
            /* @__PURE__ */ u("div", { className: "knowledge-view-tabs", role: "tablist", "aria-label": "页面视图", children: [
              /* @__PURE__ */ u("button", { role: "tab", "aria-selected": he === "read", onClick: () => Je("read"), children: [
                /* @__PURE__ */ c(Ln, { size: 14 }),
                "阅读"
              ] }),
              p && Y.page.state === "active" && /* @__PURE__ */ u("button", { role: "tab", "aria-selected": he === "edit", onClick: () => Je("edit"), children: [
                /* @__PURE__ */ c(Vl, { size: 14 }),
                "编辑"
              ] }),
              Y.page.content_type === "document" && /* @__PURE__ */ u("button", { role: "tab", "aria-selected": he === "suggestions", onClick: () => Je("suggestions"), children: [
                /* @__PURE__ */ c(Kl, { size: 14 }),
                "修订"
              ] }),
              /* @__PURE__ */ u("button", { role: "tab", "aria-selected": he === "history", onClick: () => Je("history"), children: [
                /* @__PURE__ */ c(Ua, { size: 14 }),
                "历史"
              ] }),
              /* @__PURE__ */ u("button", { role: "tab", "aria-selected": he === "comments", onClick: () => Je("comments"), children: [
                /* @__PURE__ */ c(Yu, { size: 14 }),
                "评论"
              ] }),
              /* @__PURE__ */ u("button", { role: "tab", "aria-selected": he === "activity", onClick: () => Je("activity"), children: [
                /* @__PURE__ */ c(eh, { size: 14 }),
                "活动"
              ] })
            ] }),
            /* @__PURE__ */ u("div", { className: "knowledge-page-tools", children: [
              /* @__PURE__ */ c(te, { "aria-pressed": Yt, "aria-label": "在当前页面查找", title: "在当前页面查找（⌘/Ctrl + F）", onClick: () => {
                Wn(!0), window.setTimeout(() => Bl.current?.select());
              }, children: /* @__PURE__ */ c(mn, { size: 15 }) }),
              T && Y.page.state === "active" && /* @__PURE__ */ u(xt, { children: [
                /* @__PURE__ */ c(te, { "aria-label": T.favorite ? "取消收藏" : "收藏页面", "aria-pressed": T.favorite, title: T.favorite ? "取消收藏" : "收藏页面", disabled: Z, onClick: () => {
                  Fl({ favorite: !T.favorite }, T.favorite ? "已取消收藏。" : "已收藏页面。");
                }, children: /* @__PURE__ */ c(Hu, { size: 15, fill: T.favorite ? "currentColor" : "none" }) }),
                /* @__PURE__ */ c(te, { "aria-label": T.subscribed ? "取消订阅" : "订阅页面", "aria-pressed": T.subscribed, title: T.subscribed ? "取消订阅" : "订阅页面", disabled: Z, onClick: () => {
                  Fl({ subscribed: !T.subscribed }, T.subscribed ? "已取消订阅。" : "已订阅页面更新。");
                }, children: /* @__PURE__ */ c(Ju, { size: 15, fill: T.subscribed ? "currentColor" : "none" }) }),
                /* @__PURE__ */ c(te, { "aria-label": T.shortcut_rank ? "移出快捷入口" : "添加到快捷入口", "aria-pressed": !!T.shortcut_rank, title: T.shortcut_rank ? "移出快捷入口" : "添加到快捷入口", disabled: Z, onClick: () => {
                  Fl({ shortcutRank: T.shortcut_rank ? "" : `${Date.now().toString().padStart(20, "0")}:${crypto.randomUUID()}` }, T.shortcut_rank ? "已移出快捷入口。" : "已添加到快捷入口。");
                }, children: /* @__PURE__ */ c(qu, { size: 15, fill: T.shortcut_rank ? "currentColor" : "none" }) })
              ] }),
              Y.page.content_type === "document" && /* @__PURE__ */ c(te, { "aria-pressed": he === "outline", title: "页面大纲", onClick: () => Je("outline"), children: /* @__PURE__ */ c(Tf, { size: 15 }) }),
              Ou && /* @__PURE__ */ c(te, { "aria-pressed": ou, "aria-label": "AI 写作助手", title: "AI 写作助手", onClick: () => {
                Je("edit"), lu(Y.published ? "published" : "draft"), ua(!0), Gt("");
              }, children: /* @__PURE__ */ c(Wl, { size: 15 }) }),
              /* @__PURE__ */ c(te, { "aria-pressed": he === "metadata", "aria-label": "页面属性", title: "页面属性", onClick: () => Je("metadata"), children: /* @__PURE__ */ c(Wu, { size: 15 }) }),
              /* @__PURE__ */ c(te, { "aria-pressed": he === "references", "aria-label": "页面引用与反向链接", title: "页面引用与反向链接", onClick: () => Je("references"), children: /* @__PURE__ */ c(_i, { size: 15 }) }),
              /* @__PURE__ */ c(te, { "aria-pressed": he === "relationships", "aria-label": "知识关系图", title: "关联页面与知识关系图", onClick: () => Je("relationships"), children: /* @__PURE__ */ c(Ku, { size: 15 }) }),
              e.role === "manager" && /* @__PURE__ */ c(te, { "aria-pressed": he === "access", title: "访问说明", onClick: () => Je("access"), children: /* @__PURE__ */ c(jn, { size: 15 }) }),
              e.role === "manager" && t.getPageAccess && t.setPageAccess && /* @__PURE__ */ c(te, { "aria-pressed": he === "permissions", title: "页面权限", onClick: () => Je("permissions"), children: /* @__PURE__ */ c(ds, { size: 15 }) }),
              (e.role === "manager" || Fu) && /* @__PURE__ */ c(te, { "aria-pressed": he === "governance", "aria-label": "页面治理", title: "页面治理与内容保护", onClick: () => Je("governance"), children: /* @__PURE__ */ c(Nb, { size: 15 }) }),
              p && /* @__PURE__ */ c(te, { title: "复制页面", onClick: () => {
                Um();
              }, children: /* @__PURE__ */ c(Wc, { size: 15 }) }),
              p && /* @__PURE__ */ c(te, { title: Y.page.state === "archived" ? "恢复页面" : "归档页面", onClick: () => {
                jm(Y.page);
              }, children: /* @__PURE__ */ c(Gu, { size: 15 }) })
            ] })
          ] }),
          ou && Ou && /* @__PURE__ */ c("div", { className: "knowledge-ai-dialog-backdrop", role: "presentation", onMouseDown: (o) => {
            o.target === o.currentTarget && !tn && ua(!1);
          }, children: /* @__PURE__ */ u("section", { className: "knowledge-ai-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "knowledge-ai-title", children: [
            /* @__PURE__ */ u("header", { children: [
              /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ c("span", { className: "knowledge-ai-icon", "aria-hidden": "true", children: /* @__PURE__ */ c(Wl, { size: 18 }) }),
                /* @__PURE__ */ u("div", { children: [
                  /* @__PURE__ */ c("h3", { id: "knowledge-ai-title", children: "AI 写作助手" }),
                  /* @__PURE__ */ c("p", { children: "只读取下方锁定的页面快照，结果不会自动改写正文。" })
                ] })
              ] }),
              /* @__PURE__ */ c(te, { "aria-label": "关闭 AI 写作助手", title: "关闭", disabled: tn, onClick: () => {
                sr.current?.abort(), ua(!1);
              }, children: /* @__PURE__ */ c(Fn, { size: 16 }) })
            ] }),
            /* @__PURE__ */ u("div", { className: "knowledge-ai-form", children: [
              /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ c("span", { children: "能力" }),
                /* @__PURE__ */ c("select", { value: fn, disabled: tn, onChange: (o) => {
                  wm(o.target.value), ir(null), Gt("");
                }, children: Object.entries(D1).map(([o, f]) => /* @__PURE__ */ c("option", { value: o, children: f }, o)) })
              ] }),
              /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ c("span", { children: "内容来源" }),
                /* @__PURE__ */ u("select", { value: Ki, disabled: tn, onChange: (o) => {
                  lu(o.target.value), ir(null), Gt("");
                }, children: [
                  /* @__PURE__ */ u("option", { value: "published", disabled: !Y.published, children: [
                    "当前已发布版本",
                    Y.published ? `（版本 ${Y.published.version}）` : "（暂无）"
                  ] }),
                  /* @__PURE__ */ u("option", { value: "draft", disabled: !ve.ready, children: [
                    "当前编辑会话草稿",
                    ve.ready ? `（revision ${ve.draftRevision}）` : "（连接中）"
                  ] })
                ] })
              ] }),
              fn === "translate" && /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ c("span", { children: "目标语言" }),
                /* @__PURE__ */ c("input", { value: xl, maxLength: 64, disabled: tn, onChange: (o) => km(o.target.value) })
              ] }),
              /* @__PURE__ */ u("label", { className: "knowledge-ai-prompt", children: [
                /* @__PURE__ */ c("span", { children: fn === "answer" ? "问题" : "补充要求" }),
                /* @__PURE__ */ c("textarea", { rows: 4, maxLength: 8e3, value: El, disabled: tn, onChange: (o) => _m(o.target.value), placeholder: fn === "write" ? "例如：继续补充验收步骤" : fn === "answer" ? "输入要基于当前页面回答的问题" : "可选：说明语气、长度或重点" })
              ] })
            ] }),
            tt && /* @__PURE__ */ u("article", { className: `knowledge-ai-execution is-${tt.state}`, children: [
              /* @__PURE__ */ u("header", { children: [
                /* @__PURE__ */ c("strong", { children: B1[tt.state] }),
                /* @__PURE__ */ u("span", { children: [
                  "尝试 ",
                  tt.attempt,
                  " 次 · revision ",
                  tt.revision
                ] })
              ] }),
              /* @__PURE__ */ u("dl", { children: [
                /* @__PURE__ */ u("div", { children: [
                  /* @__PURE__ */ c("dt", { children: "来源" }),
                  /* @__PURE__ */ c("dd", { children: tt.source.scope === "published" ? `已发布版本 ${tt.source.version}` : `编辑会话草稿 revision ${tt.source.draft_revision}` })
                ] }),
                /* @__PURE__ */ u("div", { children: [
                  /* @__PURE__ */ c("dt", { children: "页面" }),
                  /* @__PURE__ */ c("dd", { children: tt.source.title })
                ] }),
                /* @__PURE__ */ u("div", { children: [
                  /* @__PURE__ */ c("dt", { children: "内容校验" }),
                  /* @__PURE__ */ c("dd", { children: /* @__PURE__ */ c("code", { children: tt.source.content_sha256.slice(0, 16) }) })
                ] }),
                tt.provider && /* @__PURE__ */ u("div", { children: [
                  /* @__PURE__ */ c("dt", { children: "模型" }),
                  /* @__PURE__ */ u("dd", { children: [
                    tt.provider,
                    " / ",
                    tt.model
                  ] })
                ] })
              ] }),
              tt.result && /* @__PURE__ */ u("div", { className: "knowledge-ai-result", children: [
                /* @__PURE__ */ c("strong", { children: "候选结果" }),
                /* @__PURE__ */ c("pre", { children: tt.result })
              ] }),
              tt.state === "confirmed" && /* @__PURE__ */ u("p", { className: "knowledge-ai-confirmed", children: [
                /* @__PURE__ */ c(Nr, { size: 15 }),
                "你已确认；内容已通过当前协作会话追加到草稿，尚未发布。"
              ] })
            ] }),
            cu && /* @__PURE__ */ c("p", { className: "knowledge-ai-error", role: "alert", children: cu }),
            /* @__PURE__ */ u("footer", { children: [
              /* @__PURE__ */ c("p", { children: ve.ready ? "确认时会再次复核会话、权限、来源 revision 与 hash；任何变化都会拒绝写回。" : "正在建立受权编辑会话，连接完成后才能执行和确认。" }),
              /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ c(te, { disabled: tn, onClick: () => {
                  ir(null), Gt("");
                }, children: "清空" }),
                tt?.state === "completed" ? /* @__PURE__ */ u(te, { className: "primary", disabled: tn || !ve.ready, onClick: () => {
                  ab();
                }, children: [
                  /* @__PURE__ */ c(Nr, { size: 14 }),
                  "确认并追加到草稿"
                ] }) : tt?.state !== "confirmed" && /* @__PURE__ */ u(te, { className: "primary", disabled: tn || !ve.ready || Ki === "published" && !Y.published, onClick: () => {
                  sb();
                }, children: [
                  tn ? /* @__PURE__ */ c(si, { className: "knowledge-spin", size: 14 }) : /* @__PURE__ */ c(Wl, { size: 14 }),
                  tn ? "正在执行…" : "生成候选"
                ] })
              ] })
            ] })
          ] }) }),
          Yt && /* @__PURE__ */ u("div", { className: "knowledge-page-find-bar", role: "search", "aria-label": "在当前页面查找", children: [
            /* @__PURE__ */ c(mn, { size: 14, "aria-hidden": "true" }),
            /* @__PURE__ */ c("input", { ref: Bl, value: ln, maxLength: 256, onChange: (o) => Go(o.target.value), onKeyDown: (o) => {
              o.key === "Enter" && jt ? (o.preventDefault(), Ti((f) => o.shiftKey ? (f - 1 + jt) % jt : (f + 1) % jt)) : o.key === "Escape" && (o.preventDefault(), Wn(!1), Go(""));
            }, placeholder: "查找当前页面内容" }),
            /* @__PURE__ */ c("span", { "aria-live": "polite", children: ln ? jt ? `${Jo + 1} / ${jt}` : "无结果" : "输入关键词" }),
            /* @__PURE__ */ c(te, { "aria-label": "上一个匹配", title: "上一个匹配", disabled: !jt, onClick: () => Ti((o) => (o - 1 + jt) % jt), children: /* @__PURE__ */ c(es, { className: "knowledge-find-previous", size: 15 }) }),
            /* @__PURE__ */ c(te, { "aria-label": "下一个匹配", title: "下一个匹配", disabled: !jt, onClick: () => Ti((o) => (o + 1) % jt), children: /* @__PURE__ */ c(es, { size: 15 }) }),
            /* @__PURE__ */ c(te, { "aria-label": "关闭页内查找", title: "关闭", onClick: () => {
              Wn(!1), Go("");
            }, children: /* @__PURE__ */ c(Fn, { size: 15 }) })
          ] }),
          he === "metadata" && q && /* @__PURE__ */ u("section", { className: "knowledge-page-metadata", "aria-labelledby": "knowledge-page-metadata-title", children: [
            /* @__PURE__ */ u("header", { children: [
              /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ c("h3", { id: "knowledge-page-metadata-title", children: "页面属性" }),
                /* @__PURE__ */ c("p", { children: "属性属于页面本身，不会创建正文版本，也不会改变页面访问权限。" })
              ] }),
              /* @__PURE__ */ u("span", { children: [
                "revision ",
                q.revision
              ] })
            ] }),
            /* @__PURE__ */ u("div", { className: "knowledge-metadata-grid", children: [
              /* @__PURE__ */ u("label", { className: "knowledge-metadata-tags", children: [
                /* @__PURE__ */ c("span", { children: "页面别名" }),
                /* @__PURE__ */ c("textarea", { rows: 2, maxLength: 3100, value: ye, disabled: !p || Y.page.state !== "active" || we, onChange: (o) => {
                  me(o.target.value), re(!0);
                }, placeholder: "用逗号分隔；同一页可有多个检索别名" }),
                /* @__PURE__ */ u("small", { children: [
                  Fa(ye).length,
                  "/12 个别名"
                ] })
              ] }),
              /* @__PURE__ */ u("label", { className: "knowledge-metadata-tags", children: [
                /* @__PURE__ */ c("span", { children: "标签" }),
                /* @__PURE__ */ c("textarea", { rows: 2, maxLength: 1300, value: W, disabled: !p || Y.page.state !== "active" || we, onChange: (o) => {
                  H(o.target.value), re(!0);
                }, placeholder: "用逗号分隔，最多 20 个" }),
                /* @__PURE__ */ u("small", { children: [
                  eo(W).length,
                  "/20 个标签"
                ] })
              ] }),
              /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ c("span", { children: "状态" }),
                /* @__PURE__ */ c("select", { value: q.status, disabled: !p || Y.page.state !== "active" || we, onChange: (o) => pn((f) => ({ ...f, status: o.target.value })), children: Object.entries(Df).map(([o, f]) => /* @__PURE__ */ c("option", { value: o, children: f }, o || "unset")) })
              ] })
            ] }),
            /* @__PURE__ */ u("label", { className: "knowledge-metadata-member-search", children: [
              /* @__PURE__ */ c("span", { children: "查找知识库成员" }),
              /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ c(mn, { size: 14 }),
                /* @__PURE__ */ c("input", { value: Ce, onChange: (o) => xe(o.target.value), placeholder: "按姓名或邮箱筛选负责人和人员属性" })
              ] })
            ] }),
            /* @__PURE__ */ u("div", { className: "knowledge-metadata-properties-heading", children: [
              /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ c("h4", { children: "自定义属性" }),
                /* @__PURE__ */ c("p", { children: "支持文本、数字、日期、选项、勾选和当前知识库成员。" })
              ] }),
              p && Y.page.state === "active" && /* @__PURE__ */ u(te, { disabled: we || q.properties.length >= 32, onClick: Sm, children: [
                /* @__PURE__ */ c(ro, { size: 14 }),
                "添加属性"
              ] })
            ] }),
            /* @__PURE__ */ u("div", { className: "knowledge-metadata-properties", children: [
              q.properties.map((o, f) => /* @__PURE__ */ u("div", { className: "knowledge-metadata-property", children: [
                /* @__PURE__ */ c("input", { "aria-label": `属性 ${f + 1} 名称`, maxLength: 64, value: o.name, disabled: !p || Y.page.state !== "active" || we, onChange: (A) => pn((I) => ({ ...I, properties: I.properties.map((G) => G.id === o.id ? { ...G, name: A.target.value } : G) })) }),
                /* @__PURE__ */ c("select", { "aria-label": `属性 ${f + 1} 类型`, value: o.type, disabled: !p || Y.page.state !== "active" || we, onChange: (A) => pn((I) => ({ ...I, properties: I.properties.map((G) => G.id === o.id ? { ...G, type: A.target.value, value: "" } : G) })), children: Object.entries(P1).map(([A, I]) => /* @__PURE__ */ c("option", { value: A, children: I }, A)) }),
                o.type === "checkbox" ? /* @__PURE__ */ u("select", { "aria-label": `${o.name} 值`, value: o.value, disabled: !p || Y.page.state !== "active" || we, onChange: (A) => pn((I) => ({ ...I, properties: I.properties.map((G) => G.id === o.id ? { ...G, value: A.target.value } : G) })), children: [
                  /* @__PURE__ */ c("option", { value: "", children: "未设置" }),
                  /* @__PURE__ */ c("option", { value: "true", children: "是" }),
                  /* @__PURE__ */ c("option", { value: "false", children: "否" })
                ] }) : o.type === "person" ? /* @__PURE__ */ u("select", { "aria-label": `${o.name} 值`, value: o.value, disabled: !p || Y.page.state !== "active" || we, onChange: (A) => pn((I) => ({ ...I, properties: I.properties.map((G) => G.id === o.id ? { ...G, value: A.target.value } : G) })), children: [
                  /* @__PURE__ */ c("option", { value: "", children: "未设置" }),
                  Gl.map((A) => /* @__PURE__ */ c("option", { value: A, children: qe[A]?.display_name || A }, A))
                ] }) : /* @__PURE__ */ c("input", { "aria-label": `${o.name} 值`, type: o.type === "number" ? "number" : o.type === "date" ? "date" : "text", step: o.type === "number" ? "any" : void 0, maxLength: o.type === "text" ? 1024 : 128, value: o.value, disabled: !p || Y.page.state !== "active" || we, onChange: (A) => pn((I) => ({ ...I, properties: I.properties.map((G) => G.id === o.id ? { ...G, value: A.target.value } : G) })) }),
                p && Y.page.state === "active" && /* @__PURE__ */ c(te, { "aria-label": `删除属性 ${o.name}`, title: "删除属性", disabled: we, onClick: () => pn((A) => ({ ...A, properties: A.properties.filter((I) => I.id !== o.id) })), children: /* @__PURE__ */ c(Sa, { size: 14 }) })
              ] }, o.id)),
              q.properties.length === 0 && /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "还没有自定义属性。" })
            ] }),
            /* @__PURE__ */ u("footer", { children: [
              /* @__PURE__ */ c("p", { children: q.updated_at ? `${qe[q.updated_by_user_id || ""]?.display_name || q.updated_by_user_id || "账号不可用"} 更新于 ${new Date(q.updated_at).toLocaleString()}` : "尚未保存页面属性。" }),
              /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ u(te, { disabled: we || !de, onClick: () => {
                  gu();
                }, children: [
                  /* @__PURE__ */ c(lt, { size: 14 }),
                  "重新加载"
                ] }),
                p && Y.page.state === "active" && /* @__PURE__ */ u(te, { className: "primary", disabled: we || !de || eo(W).length > 20 || Fa(ye).length > 12, onClick: () => {
                  mu();
                }, children: [
                  /* @__PURE__ */ c(cr, { size: 14 }),
                  we ? "保存中…" : "保存属性"
                ] })
              ] })
            ] })
          ] }),
          he === "references" && /* @__PURE__ */ u("section", { className: "knowledge-page-references", "aria-labelledby": "knowledge-page-references-title", children: [
            /* @__PURE__ */ u("header", { children: [
              /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ c("h3", { id: "knowledge-page-references-title", children: "页面引用" }),
                /* @__PURE__ */ c("p", { children: "索引随正文保存更新；标题与可见性始终按当前页面和权限实时解析。" })
              ] }),
              Bt && /* @__PURE__ */ u("span", { role: "status", children: [
                /* @__PURE__ */ c(si, { className: "knowledge-spin", size: 14 }),
                "正在更新…"
              ] })
            ] }),
            /* @__PURE__ */ u("div", { className: "knowledge-reference-columns", children: [
              /* @__PURE__ */ u("article", { "aria-labelledby": "knowledge-outgoing-references", children: [
                /* @__PURE__ */ u("header", { children: [
                  /* @__PURE__ */ u("div", { children: [
                    /* @__PURE__ */ c("h4", { id: "knowledge-outgoing-references", children: "引用了谁" }),
                    /* @__PURE__ */ c("p", { children: "当前页面正文中的知识页面引用。" })
                  ] }),
                  /* @__PURE__ */ c("strong", { children: it.length })
                ] }),
                /* @__PURE__ */ u("div", { className: "knowledge-reference-index-list", children: [
                  it.map((o) => {
                    const f = o.target_content_type || "document";
                    return /* @__PURE__ */ u("button", { disabled: !o.available, onClick: () => {
                      et(o.target_page_id), Je("read");
                    }, children: [
                      /* @__PURE__ */ c(Rt, { type: f, size: 17 }),
                      /* @__PURE__ */ u("span", { children: [
                        /* @__PURE__ */ c("b", { children: o.available ? o.target_title || "未命名页面" : "引用页面不可用" }),
                        /* @__PURE__ */ u("small", { children: [
                          o.reference_mode === "fixed" ? `固定版本 ${o.target_version}` : "实时引用",
                          " · ",
                          o.display === "embed" ? "内嵌" : "卡片",
                          " · Block ",
                          o.block_id.slice(0, 10)
                        ] })
                      ] }),
                      /* @__PURE__ */ c(ii, { size: 15 })
                    ] }, `${o.source_page_id}:${o.block_id}`);
                  }),
                  it.length === 0 && !Bt && /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "当前页面没有引用其他页面。" })
                ] }),
                !Sn && /* @__PURE__ */ c(te, { disabled: Bt, onClick: () => {
                  Iu("outgoing");
                }, children: "加载更多引用" })
              ] }),
              /* @__PURE__ */ u("article", { "aria-labelledby": "knowledge-incoming-references", children: [
                /* @__PURE__ */ u("header", { children: [
                  /* @__PURE__ */ u("div", { children: [
                    /* @__PURE__ */ c("h4", { id: "knowledge-incoming-references", children: "被谁引用" }),
                    /* @__PURE__ */ c("p", { children: "你当前有权访问的来源页面。" })
                  ] }),
                  /* @__PURE__ */ c("strong", { children: Ue.length })
                ] }),
                /* @__PURE__ */ u("div", { className: "knowledge-reference-index-list", children: [
                  Ue.map((o) => {
                    const f = o.source_content_type || "document";
                    return /* @__PURE__ */ u("button", { onClick: () => {
                      et(o.source_page_id), Je("read");
                    }, children: [
                      /* @__PURE__ */ c(Rt, { type: f, size: 17 }),
                      /* @__PURE__ */ u("span", { children: [
                        /* @__PURE__ */ c("b", { children: o.source_title || "未命名页面" }),
                        /* @__PURE__ */ u("small", { children: [
                          o.reference_mode === "fixed" ? `固定引用版本 ${o.target_version}` : "实时引用",
                          " · ",
                          o.display === "embed" ? "内嵌" : "卡片",
                          " · 更新于 $",
                          new Date(o.updated_at).toLocaleString()
                        ] })
                      ] }),
                      /* @__PURE__ */ c(ii, { size: 15 })
                    ] }, `${o.source_page_id}:${o.block_id}`);
                  }),
                  Ue.length === 0 && !Bt && /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "当前页面还没有可见的反向链接。" })
                ] }),
                !En && /* @__PURE__ */ c(te, { disabled: Bt, onClick: () => {
                  Iu("incoming");
                }, children: "加载更多反向链接" })
              ] })
            ] })
          ] }),
          he === "relationships" && q && /* @__PURE__ */ u("section", { className: "knowledge-page-relationships", "aria-labelledby": "knowledge-page-relationships-title", children: [
            /* @__PURE__ */ u("header", { children: [
              /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ c("h3", { id: "knowledge-page-relationships-title", children: "关联页面与知识关系图" }),
                /* @__PURE__ */ c("p", { children: "标题、别名和路径只用于识别；关系始终保存稳定 page ID，重命名或移动不会断开关联。" })
              ] }),
              /* @__PURE__ */ c(te, { "aria-label": "刷新关系图", title: "刷新关系图", disabled: _r, onClick: () => {
                Ll();
              }, children: /* @__PURE__ */ c(lt, { className: _r ? "knowledge-spin" : void 0, size: 15 }) })
            ] }),
            /* @__PURE__ */ u("div", { className: "knowledge-relationship-layout", children: [
              /* @__PURE__ */ u("article", { className: "knowledge-related-editor", children: [
                /* @__PURE__ */ u("header", { children: [
                  /* @__PURE__ */ u("div", { children: [
                    /* @__PURE__ */ c("h4", { children: "显式关联" }),
                    /* @__PURE__ */ c("p", { children: "搜索所有当前有权页面，同名页用完整路径消歧。" })
                  ] }),
                  /* @__PURE__ */ c("strong", { children: q.related_page_ids.length })
                ] }),
                /* @__PURE__ */ u("label", { className: "knowledge-relationship-search", children: [
                  /* @__PURE__ */ c(mn, { size: 15, "aria-hidden": "true" }),
                  /* @__PURE__ */ c("input", { value: St, disabled: !p || Y.page.state !== "active" || we, onChange: (o) => Zt(o.target.value), placeholder: "搜索标题或页面别名" }),
                  Ts && /* @__PURE__ */ c(si, { className: "knowledge-spin", size: 15, "aria-label": "正在搜索" })
                ] }),
                /* @__PURE__ */ u("div", { className: "knowledge-related-search-results", role: "listbox", "aria-label": "可关联页面", children: [
                  kr.map((o) => {
                    const f = q.related_page_ids.includes(o.page_id);
                    return /* @__PURE__ */ u("button", { type: "button", role: "option", "aria-selected": f, disabled: !p || Y.page.state !== "active" || we, onClick: () => pn((A) => ({ ...A, related_page_ids: f ? A.related_page_ids.filter((I) => I !== o.page_id) : [...A.related_page_ids, o.page_id] })), children: [
                      /* @__PURE__ */ c(Rt, { type: o.content_type, size: 16 }),
                      /* @__PURE__ */ u("span", { children: [
                        /* @__PURE__ */ c("b", { children: o.title }),
                        /* @__PURE__ */ u("small", { children: [
                          to(o),
                          o.aliases.length > 0 ? ` · 别名 ${o.aliases.join("、")}` : ""
                        ] })
                      ] }),
                      /* @__PURE__ */ c("i", { children: f ? "已关联" : "关联" })
                    ] }, o.page_id);
                  }),
                  !Ts && kr.length === 0 && /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "没有找到可关联页面。" })
                ] }),
                q.related_page_ids.length > 0 && /* @__PURE__ */ u("div", { className: "knowledge-related-selected", children: [
                  /* @__PURE__ */ c("h5", { children: "已选关联" }),
                  q.related_page_ids.map((o) => {
                    const f = $t?.nodes.find((A) => A.page_id === o) || (de ? kr.find((A) => A.page_id === o) : void 0);
                    return /* @__PURE__ */ u("div", { className: f ? void 0 : "is-unavailable", children: [
                      /* @__PURE__ */ c(Rt, { type: f?.content_type || "document", size: 15 }),
                      /* @__PURE__ */ u("span", { children: [
                        /* @__PURE__ */ c("b", { children: f?.title || "页面不可用" }),
                        /* @__PURE__ */ c("small", { children: f ? to(f) : "目标已归档、已撤权或不存在" })
                      ] }),
                      p && Y.page.state === "active" && /* @__PURE__ */ c("button", { type: "button", "aria-label": `移除关联 ${f?.title || "不可用页面"}`, onClick: () => pn((A) => ({ ...A, related_page_ids: A.related_page_ids.filter((I) => I !== o) })), children: /* @__PURE__ */ c(Fn, { size: 14 }) })
                    ] }, o);
                  })
                ] }),
                /* @__PURE__ */ u("footer", { children: [
                  /* @__PURE__ */ c("span", { children: de ? "关联已修改，尚未保存" : `metadata revision ${q.revision}` }),
                  p && Y.page.state === "active" && /* @__PURE__ */ u(te, { className: "primary", disabled: we || !de || Fa(ye).length > 12 || q.related_page_ids.length > 64, onClick: () => {
                    mu();
                  }, children: [
                    /* @__PURE__ */ c(cr, { size: 14 }),
                    we ? "保存中…" : "保存关联"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ u("article", { className: "knowledge-relationship-graph", children: [
                /* @__PURE__ */ u("header", { children: [
                  /* @__PURE__ */ u("div", { children: [
                    /* @__PURE__ */ c("h4", { children: "知识关系图" }),
                    /* @__PURE__ */ c("p", { children: "合并展示父子层级、正文引用和显式关联，每个节点都重新执行实时 ACL。" })
                  ] }),
                  $t && /* @__PURE__ */ u("strong", { children: [
                    $t.nodes.length,
                    " 个页面"
                  ] })
                ] }),
                _r && !$t ? /* @__PURE__ */ u("p", { role: "status", className: "knowledge-relationship-loading", children: [
                  /* @__PURE__ */ c(si, { className: "knowledge-spin", size: 18 }),
                  "正在构建受权关系图…"
                ] }) : $t && $t.nodes.length > 0 ? /* @__PURE__ */ u(xt, { children: [
                  /* @__PURE__ */ c(U1, { graph: $t, onOpen: (o) => {
                    Je("read"), et(o);
                  } }),
                  /* @__PURE__ */ c("div", { className: "knowledge-relationship-node-list", children: $t.nodes.filter((o) => o.page_id !== $t.center_page_id).map((o) => /* @__PURE__ */ u("button", { type: "button", onClick: () => {
                    Je("read"), et(o.page_id);
                  }, children: [
                    /* @__PURE__ */ c(Rt, { type: o.content_type, size: 15 }),
                    /* @__PURE__ */ u("span", { children: [
                      /* @__PURE__ */ c("b", { children: o.title }),
                      /* @__PURE__ */ c("small", { children: to(o) })
                    ] }),
                    /* @__PURE__ */ c(ii, { size: 14 })
                  ] }, o.page_id)) })
                ] }) : /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "当前页面还没有可见关系。" })
              ] })
            ] })
          ] }),
          (he === "read" || he === "outline" || he === "comments" || he === "activity" || he === "access" || he === "permissions" || he === "governance") && (Y.page.content_type === "file" && Pu ? /* @__PURE__ */ c("div", { className: "knowledge-page-readable typed-readable", children: /* @__PURE__ */ c(Hc, { client: t, libraryID: e.id, pageID: Y.page.id, content: Pu, formatError: i }) }) : Y.published ? /* @__PURE__ */ c("div", { className: "knowledge-page-readable typed-readable", children: /* @__PURE__ */ c(di, { type: Y.page.content_type, body: ql, documentTitle: Y.published.title, canManage: e.role === "manager", gridAccess: Y.grid_access, readOnly: !0, mentions: Sr, tasks: Aa, polls: Ca, dynamicBlocks: Hl, form: Ru, initialBlockID: cb, initialSearchLocation: Ia, blockHighlightRevision: ta.revision, onCommentAnchor: ["document", "whiteboard", "mind_map", "flowchart"].includes(Y.page.content_type) ? (o) => ea(o || null) : void 0, authorizeContentAction: ei, uploadFile: Y.page.content_type === "form" ? xu : void 0, fileUploadsEnabled: e.documents_configured, readFile: ka, onActionFeedback: Pe, onChange: () => {
          } }) }) : /* @__PURE__ */ u(hi, { children: [
            /* @__PURE__ */ c(ju, { size: 28 }),
            /* @__PURE__ */ c("h3", { children: "页面尚未发布" }),
            /* @__PURE__ */ c("p", { children: "编辑者可以完善草稿后发布。" })
          ] })),
          he === "suggestions" && Y.draft && /* @__PURE__ */ c("div", { className: "knowledge-page-readable typed-readable knowledge-suggestion-draft", children: /* @__PURE__ */ c(di, { type: "document", body: Y.draft.body.content, documentTitle: Y.draft.title, readOnly: !0, mentions: Sr, tasks: Aa, polls: Ca, dynamicBlocks: Hl, initialBlockID: ta.nodeID || void 0, blockHighlightRevision: ta.revision, onCommentAnchor: (o) => ea(o || null), authorizeContentAction: ei, readFile: ka, onActionFeedback: Pe, onChange: () => {
          } }) }),
          he === "edit" && Y.draft && Y.page.content_type === "file" && /* @__PURE__ */ c("div", { className: "knowledge-editor-shell", children: /* @__PURE__ */ u("section", { className: "knowledge-page-editor knowledge-file-page-editor", children: [
            /* @__PURE__ */ u("div", { className: "knowledge-editor-canvas", children: [
              /* @__PURE__ */ c("input", { ref: Zi, className: "knowledge-editor-title", "aria-label": "标题", value: dn, maxLength: 256, onChange: (o) => jl(o.target.value, un), placeholder: "页面标题" }),
              /* @__PURE__ */ u("div", { className: "knowledge-editor-toolbar", children: [
                /* @__PURE__ */ c("span", { children: "文件页面" }),
                /* @__PURE__ */ c("span", { children: "正文只保存受权原件引用" })
              ] }),
              /* @__PURE__ */ c(Hc, { client: t, libraryID: e.id, pageID: Y.page.id, content: un, formatError: i })
            ] }),
            /* @__PURE__ */ u("footer", { className: "knowledge-editor-actions", children: [
              /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ u(te, { disabled: !en || Bn === "saving" || Zn === "publishing", onClick: () => {
                  Ir();
                }, children: [
                  /* @__PURE__ */ c(cr, { size: 14 }),
                  "保存草稿"
                ] }),
                /* @__PURE__ */ c("span", { className: "knowledge-editor-hint", children: "文件原件不可在页面正文中覆盖；标题和位置按页面版本管理。" })
              ] }),
              /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ c("input", { "aria-label": "发布说明", value: qs, maxLength: 2048, onChange: (o) => Hs(o.target.value), placeholder: "添加发布说明…" }),
                /* @__PURE__ */ u(te, { className: "primary", disabled: Bn === "conflict" || Zn === "publishing" || !dn.trim(), onClick: () => {
                  _u();
                }, children: [
                  /* @__PURE__ */ c(th, { size: 14 }),
                  Zn === "publishing" ? "发布中…" : "发布版本"
                ] })
              ] })
            ] })
          ] }) }),
          he === "edit" && Y.draft && Y.page.content_type !== "file" && /* @__PURE__ */ c("div", { className: "knowledge-editor-shell", children: /* @__PURE__ */ u("section", { className: "knowledge-page-editor", children: [
            /* @__PURE__ */ u("div", { className: "knowledge-editor-canvas", children: [
              /* @__PURE__ */ c("input", { ref: Zi, className: "knowledge-editor-title", "aria-label": "标题", value: dn, maxLength: 256, disabled: ve.available && !ve.ready, onChange: (o) => jl(o.target.value, un), placeholder: "页面标题" }),
              /* @__PURE__ */ u("div", { className: "knowledge-editor-toolbar", children: [
                /* @__PURE__ */ c("span", { children: Vt[Y.page.content_type].label }),
                /* @__PURE__ */ c("span", { children: Y.page.content_type === "document" ? `${zu.blocks} 个内容块 · ${zu.characters} 字符` : "结构化草稿" })
              ] }),
              /* @__PURE__ */ c(di, { type: Y.page.content_type, body: un, documentTitle: dn, canManage: e.role === "manager", gridAccess: Y.grid_access, collaboration: ve.available && ve.ready ? ve.editorCollaboration : void 0, readOnly: ve.available && !ve.ready, mentions: Sr, tasks: Aa, polls: Ca, dynamicBlocks: Hl, form: Ru, initialBlockID: Tu, initialSearchLocation: Ia, blockLink: lb, insertMarkdownRequest: vm, authorizeContentAction: ei, onActionFeedback: Pe, uploadFile: Y.page.content_type === "document" || Y.page.content_type === "multidimensional_table" || Y.page.content_type === "presentation" || Y.page.content_type === "form" ? xu : void 0, fileUploadsEnabled: e.documents_configured, readFile: ka, convertPage: Y.page.content_type === "document" || Y.page.content_type === "mind_note" ? Dm : void 0, onChange: (o, f) => jl(dn, o, f), onPresence: ve.available ? ve.updatePresence : ar.updatePresence }, `${Y.page.id}:${ub ? Y.draft.draft_revision : 0}:${qo}`)
            ] }),
            /* @__PURE__ */ u("div", { className: "knowledge-editor-meta", children: [
              /* @__PURE__ */ u("div", { className: `knowledge-sync-state is-${ve.state}`, role: "status", children: [
                ve.state === "syncing" || ve.state === "connecting" || ve.state === "reconnecting" ? /* @__PURE__ */ c(Db, { className: "knowledge-pulse", size: 15 }) : ve.state === "error" ? /* @__PURE__ */ c(Zu, { size: 15 }) : /* @__PURE__ */ c(Nr, { size: 15 }),
                /* @__PURE__ */ c("span", { children: Zn === "publishing" ? "正在冻结协作快照…" : Zn === "error" ? "发布失败" : ve.available ? Lu : { idle: en ? "有未保存更改" : "草稿未更改", saving: "正在保存…", saved: `已保存 revision ${Y.draft.draft_revision}`, conflict: "保存冲突：服务器已有更新", error: "保存失败" }[Bn] }),
                ve.available && ve.draftRevision > 0 && /* @__PURE__ */ u("small", { children: [
                  "revision ",
                  ve.draftRevision,
                  " · clock ",
                  ve.serverClock
                ] })
              ] }),
              /* @__PURE__ */ u("label", { className: "knowledge-attachment-trigger", children: [
                /* @__PURE__ */ c(Bb, { size: 15 }),
                "添加附件或粘贴图片",
                /* @__PURE__ */ c("input", { type: "file", accept: ch(e), disabled: ia, onChange: (o) => {
                  const f = o.target.files?.[0];
                  f && rb(f), o.currentTarget.value = "";
                } })
              ] })
            ] }),
            (ia || nu.length > 0) && /* @__PURE__ */ u("div", { className: "knowledge-page-attachments", children: [
              ia && /* @__PURE__ */ c("span", { role: "status", children: "正在校验并上传附件…" }),
              nu.map((o) => /* @__PURE__ */ u("span", { children: [
                o.title,
                /* @__PURE__ */ c("button", { type: "button", onClick: () => {
                  ib(o);
                }, children: "移除" })
              ] }, o.document_id))
            ] }),
            !ve.available && Bn === "conflict" && /* @__PURE__ */ u("div", { className: "knowledge-conflict", children: [
              /* @__PURE__ */ c(Xu, { size: 18 }),
              /* @__PURE__ */ c("span", { children: Li ? `服务器草稿 revision ${Li.current_draft_revision}，基于发布版本 ${Li.base_published_version}，更新时间 ${new Date(Li.current_updated_at).toLocaleString()}，摘要 ${Li.current_content_sha256.slice(0, 12)}` : "服务器上的同一编辑目标已经变化，请重新载入后决定保留哪一项。" }),
              /* @__PURE__ */ c(te, { onClick: () => {
                Qm();
              }, children: "复制我的内容" }),
              /* @__PURE__ */ u(te, { onClick: () => {
                Xr.current = null, Wi.current = null, Xi.current = null, Yn(null), et((o) => (window.setTimeout(() => et(o)), ""));
              }, children: [
                /* @__PURE__ */ c(lt, { size: 14 }),
                "重新载入"
              ] })
            ] }),
            /* @__PURE__ */ u("footer", { className: "knowledge-editor-actions", children: [
              /* @__PURE__ */ u("div", { children: [
                !ve.available && /* @__PURE__ */ u(te, { disabled: !en || Bn === "saving" || Zn === "publishing", onClick: () => {
                  Ir();
                }, children: [
                  /* @__PURE__ */ c(cr, { size: 14 }),
                  "保存草稿"
                ] }),
                /* @__PURE__ */ c("span", { className: "knowledge-editor-hint", children: ve.available ? "正文使用增量 CRDT 同步，不会整篇覆盖他人的修改。" : ar.available ? "图形按节点和连线合并；选中目标会同步给在线成员。" : "更改会自动保存为草稿。" })
              ] }),
              /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ c("input", { "aria-label": "发布说明", value: qs, maxLength: 2048, onChange: (o) => Hs(o.target.value), placeholder: "添加发布说明…" }),
                /* @__PURE__ */ u(te, { className: "primary", disabled: Bn === "conflict" || Zn === "publishing" || !dn.trim() || ve.available && (ve.state === "error" || ve.state === "connecting" || ve.state === "reconnecting"), onClick: () => {
                  _u();
                }, children: [
                  /* @__PURE__ */ c(th, { size: 14 }),
                  Zn === "publishing" ? "发布中…" : "发布版本"
                ] })
              ] })
            ] })
          ] }) }),
          he === "history" && /* @__PURE__ */ u("section", { className: "knowledge-page-history", children: [
            /* @__PURE__ */ c("div", { className: "knowledge-history-heading", children: /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ c("h3", { children: "连续编辑历史" }),
              /* @__PURE__ */ c("p", { children: "按草稿 revision 永久记录，显示作者、时间和 Block 级变化。" })
            ] }) }),
            jd.map((o) => /* @__PURE__ */ u("article", { className: "knowledge-edit-history", children: [
              /* @__PURE__ */ u("header", { children: [
                /* @__PURE__ */ c("strong", { children: qe[o.user_id]?.display_name || "账号不可用" }),
                /* @__PURE__ */ u("span", { children: [
                  new Date(o.created_at).toLocaleString(),
                  " · 草稿 revision ",
                  o.draft_revision,
                  o.clock > 0 ? ` · 协作时钟 ${o.clock}` : ""
                ] })
              ] }),
              /* @__PURE__ */ u("div", { className: "knowledge-edit-history-summary", children: [
                o.title_changed && /* @__PURE__ */ c("em", { children: "标题已修改" }),
                /* @__PURE__ */ u("span", { children: [
                  o.changed_block_count,
                  " 个 Block 变化",
                  o.truncated ? "（明细过多，已截断）" : ""
                ] })
              ] }),
              o.changes.length > 0 && /* @__PURE__ */ c("ul", { children: o.changes.map((f) => /* @__PURE__ */ u("li", { className: `is-${f.kind}`, children: [
                /* @__PURE__ */ c("b", { children: f.kind === "insert" ? "新增" : f.kind === "delete" ? "删除" : "修改" }),
                /* @__PURE__ */ c("code", { children: f.node_id.slice(0, 12) }),
                /* @__PURE__ */ c("span", { children: f.kind === "update" ? `${f.before_preview || "空内容"} → ${f.after_preview || "空内容"}` : f.after_preview || f.before_preview || "空内容" })
              ] }, `${o.draft_revision}-${f.node_id}`)) })
            ] }, o.draft_revision)),
            jd.length === 0 && /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "还没有编辑记录。" }),
            !Hd && /* @__PURE__ */ c(te, { onClick: () => {
              Gm();
            }, children: "加载更早编辑" }),
            /* @__PURE__ */ u("div", { className: "knowledge-history-heading", children: [
              /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ c("h3", { children: "发布版本" }),
                /* @__PURE__ */ c("p", { children: "发布后形成不可变快照，可查看、对比和恢复为新草稿。" })
              ] }),
              /* @__PURE__ */ c(te, { disabled: Oi.length !== 2, onClick: () => {
                qm();
              }, children: "对比所选版本" })
            ] }),
            Zo.map((o) => /* @__PURE__ */ u("div", { className: "knowledge-version", children: [
              /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ c("input", { type: "checkbox", checked: Oi.includes(o.version), onChange: (f) => $d((A) => f.target.checked ? [o.version, ...A].slice(0, 2) : A.filter((I) => I !== o.version)) }),
                "版本 ",
                o.version
              ] }),
              /* @__PURE__ */ u("span", { children: [
                qe[o.published_by_user_id]?.display_name || "账号不可用",
                " · ",
                new Date(o.published_at).toLocaleString(),
                " · ",
                o.publish_note || "无发布说明",
                " · ",
                o.body.summary || "无摘要"
              ] }),
              /* @__PURE__ */ c(te, { onClick: () => {
                Hm(o.version);
              }, children: "查看版本" }),
              p && /* @__PURE__ */ c(te, { onClick: () => {
                Vm(o.version);
              }, children: "恢复为草稿" })
            ] }, o.version)),
            !tl && /* @__PURE__ */ c(te, { onClick: () => {
              Au();
            }, children: "加载更早版本" }),
            er && /* @__PURE__ */ u("div", { className: "knowledge-version-preview", children: [
              /* @__PURE__ */ u("h4", { children: [
                "版本 ",
                er.version,
                "：",
                er.title
              ] }),
              /* @__PURE__ */ u("p", { className: "knowledge-subtle", children: [
                "页面位置 ",
                er.parent_page_id || "根目录",
                " · 排序 ",
                er.rank
              ] }),
              /* @__PURE__ */ c("div", { className: "knowledge-page-readable typed-readable", children: /* @__PURE__ */ c(di, { type: er.content_type, body: er.body.content, documentTitle: er.title, readOnly: !0, mentions: Sr, tasks: Aa, polls: Ca, readFile: ka, onActionFeedback: Pe, onChange: () => {
              } }) })
            ] }),
            Gs && /* @__PURE__ */ u("div", { className: "knowledge-diff", children: [
              /* @__PURE__ */ u("h4", { children: [
                "版本 ",
                Gs.from_version,
                " → ",
                Gs.to_version
              ] }),
              /* @__PURE__ */ c("pre", { children: Gs.content.map((o, f) => /* @__PURE__ */ u("span", { className: `is-${o.kind}`, children: [
                o.kind === "insert" ? "+ " : o.kind === "delete" ? "- " : "  ",
                o.text
              ] }, f)) })
            ] })
          ] }),
          he === "suggestions" && /* @__PURE__ */ u("aside", { className: "knowledge-page-suggestions", "aria-label": "修订提议", children: [
            /* @__PURE__ */ u("header", { children: [
              /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ c(Kl, { size: 17 }),
                /* @__PURE__ */ u("span", { children: [
                  /* @__PURE__ */ c("strong", { children: "修订提议" }),
                  /* @__PURE__ */ c("small", { children: "接受前不会改动草稿" })
                ] })
              ] }),
              /* @__PURE__ */ u("b", { children: [
                dl.filter((o) => o.status === "open").length,
                " 条待处理"
              ] })
            ] }),
            p && Y.page.state === "active" && Y.draft && /* @__PURE__ */ u("section", { className: "knowledge-suggestion-create", children: [
              /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "先在左侧草稿中选择文字或点选一个内容块，再提议在其后插入新段落，或删除该内容块。" }),
              Ht ? /* @__PURE__ */ u("button", { type: "button", className: "knowledge-comment-anchor", onClick: () => ji((o) => ({ nodeID: Ht.nodeID, revision: o.revision + 1 })), children: [
                /* @__PURE__ */ c(Kl, { size: 14 }),
                /* @__PURE__ */ u("span", { children: [
                  /* @__PURE__ */ c("strong", { children: "当前修订锚点" }),
                  /* @__PURE__ */ u("small", { children: [
                    "“",
                    Ht.quote,
                    "”"
                  ] })
                ] })
              ] }) : /* @__PURE__ */ c("p", { className: "knowledge-comment-anchor is-empty", children: "尚未选择内容块。" }),
              /* @__PURE__ */ u("div", { className: "knowledge-suggestion-kind", children: [
                /* @__PURE__ */ c("button", { type: "button", "aria-pressed": Ar === "insert", onClick: () => Yd("insert"), children: "插入段落" }),
                /* @__PURE__ */ c("button", { type: "button", "aria-pressed": Ar === "delete", onClick: () => Yd("delete"), children: "删除内容块" })
              ] }),
              Ar === "insert" && /* @__PURE__ */ c("textarea", { value: na, maxLength: 32768, onChange: (o) => hl(o.target.value), placeholder: "要插入的新段落内容" }),
              /* @__PURE__ */ c("textarea", { value: eu, maxLength: 16384, onChange: (o) => fl(o.target.value), placeholder: "说明修订原因（可选）" }),
              /* @__PURE__ */ u("label", { children: [
                "@ 提及当前资料库成员",
                /* @__PURE__ */ c("input", { value: Xs, onChange: (o) => Kd(o.target.value), placeholder: "按姓名或邮箱搜索" })
              ] }),
              /* @__PURE__ */ c("div", { className: "knowledge-mention-picker", children: Wd.map((o) => /* @__PURE__ */ u("button", { type: "button", "aria-pressed": tu.includes(o.user_id), onClick: () => pl((f) => f.includes(o.user_id) ? f.filter((A) => A !== o.user_id) : [...f, o.user_id]), children: [
                "@",
                o.display_name
              ] }, o.user_id)) }),
              /* @__PURE__ */ c(te, { className: "primary", disabled: qi === "create" || !Ht || Ar === "insert" && !na.trim(), onClick: () => {
                Jm();
              }, children: qi === "create" ? "正在提交…" : "提交修订" })
            ] }),
            /* @__PURE__ */ u("div", { className: "knowledge-suggestion-list", children: [
              dl.map((o) => /* @__PURE__ */ u("article", { className: `knowledge-suggestion is-${o.status}${o.anchor.changed ? " is-stale" : ""}`, children: [
                /* @__PURE__ */ u("header", { children: [
                  /* @__PURE__ */ u("span", { children: [
                    /* @__PURE__ */ c("strong", { children: o.kind === "insert" ? "提议插入" : "提议删除" }),
                    /* @__PURE__ */ u("small", { children: [
                      qe[o.author_user_id]?.display_name || "账号不可用",
                      " · ",
                      new Date(o.created_at).toLocaleString()
                    ] })
                  ] }),
                  /* @__PURE__ */ c("em", { children: o.status === "open" ? "待处理" : o.status === "accepted" ? "已接受" : o.status === "rejected" ? "已拒绝" : "已撤回" })
                ] }),
                /* @__PURE__ */ u("button", { type: "button", className: "knowledge-comment-quote", disabled: !!o.anchor.changed, onClick: () => ji((f) => ({ nodeID: o.anchor.node_id || "", revision: f.revision + 1 })), children: [
                  "“",
                  o.anchor.quote || "内容块",
                  "”"
                ] }),
                o.anchor.changed && o.status === "open" && /* @__PURE__ */ c("p", { className: "knowledge-comment-anchor-state is-invalid", children: "原内容块已改变，不能接受这条修订。" }),
                o.proposed_text && /* @__PURE__ */ u("p", { className: "knowledge-suggestion-proposal", children: [
                  "+ ",
                  o.proposed_text
                ] }),
                o.comment && /* @__PURE__ */ c("p", { children: o.comment }),
                o.mentioned_user_ids.length > 0 && /* @__PURE__ */ u("p", { className: "knowledge-subtle", children: [
                  "提及 ",
                  o.mentioned_user_ids.map((f) => `@${qe[f]?.display_name || "账号不可用"}`).join("、")
                ] }),
                o.status === "open" && /* @__PURE__ */ u("div", { className: "knowledge-actions", children: [
                  p && /* @__PURE__ */ u(xt, { children: [
                    /* @__PURE__ */ c(te, { disabled: qi === o.id || !!o.anchor.changed, onClick: () => {
                      Ql(o, "accept");
                    }, children: "接受" }),
                    /* @__PURE__ */ c(te, { disabled: qi === o.id, onClick: () => {
                      Ql(o, "reject");
                    }, children: "拒绝" })
                  ] }),
                  o.author_user_id === n && /* @__PURE__ */ c(te, { disabled: qi === o.id, onClick: () => {
                    Ql(o, "withdraw");
                  }, children: "撤回" })
                ] })
              ] }, o.id)),
              dl.length === 0 && /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "还没有修订提议。" })
            ] })
          ] }),
          he === "outline" && /* @__PURE__ */ u("aside", { className: "knowledge-page-outline", "aria-label": "页面大纲", children: [
            /* @__PURE__ */ c("h3", { children: "页面大纲" }),
            Mu.length === 0 ? /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "当前发布版本没有标题块。" }) : /* @__PURE__ */ c("ol", { children: Mu.map((o) => /* @__PURE__ */ c("li", { style: { paddingInlineStart: `${(o.level - 1) * 12}px` }, children: o.title }, o.key)) })
          ] }),
          he === "comments" && /* @__PURE__ */ u("section", { className: "knowledge-page-comments", children: [
            /* @__PURE__ */ u("label", { className: "knowledge-checkbox", children: [
              /* @__PURE__ */ c("input", { type: "checkbox", checked: $i, onChange: (o) => lm(o.target.checked) }),
              "只看未解决"
            ] }),
            Y.page.state === "archived" && /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "页面已归档，评论只读。" }),
            Y.published && Y.page.state === "active" && /* @__PURE__ */ u("div", { className: "knowledge-comment-create", children: [
              Qi ? /* @__PURE__ */ u("p", { className: "knowledge-comment-anchor is-replying", children: [
                "正在回复评论线程 ",
                /* @__PURE__ */ c("button", { onClick: () => Ys(""), children: "取消回复" })
              ] }) : Ht ? /* @__PURE__ */ u("button", { type: "button", className: "knowledge-comment-anchor", onClick: () => ji((o) => ({ nodeID: Ht.nodeID, revision: o.revision + 1 })), children: [
                /* @__PURE__ */ c(Yu, { size: 14 }),
                /* @__PURE__ */ u("span", { children: [
                  /* @__PURE__ */ c("strong", { children: "评论当前选区" }),
                  /* @__PURE__ */ u("small", { children: [
                    "“",
                    Ht.quote,
                    "”"
                  ] })
                ] })
              ] }) : /* @__PURE__ */ c("p", { className: "knowledge-comment-anchor is-empty", children: "请先选择正文内容块，或点选画板、思维导图、流程图元素。" }),
              /* @__PURE__ */ c("textarea", { value: Js, maxLength: 16384, onChange: (o) => al(o.target.value), placeholder: "针对当前发布版本发表评论" }),
              /* @__PURE__ */ u("label", { children: [
                "@ 提及当前资料库成员",
                /* @__PURE__ */ c("input", { value: Xs, onChange: (o) => Kd(o.target.value), placeholder: "按姓名或邮箱搜索" })
              ] }),
              /* @__PURE__ */ c("div", { className: "knowledge-mention-picker", children: Wd.map((o) => /* @__PURE__ */ u("button", { type: "button", "aria-pressed": Zs.includes(o.user_id), onClick: () => Xd((f) => f.includes(o.user_id) ? f.filter((A) => A !== o.user_id) : [...f, o.user_id]), children: [
                "@",
                o.display_name
              ] }, o.user_id)) }),
              Zs.length > 0 && /* @__PURE__ */ u("p", { className: "knowledge-subtle", children: [
                "将提及：",
                Zs.map((o) => qe[o]?.display_name || o).join("、")
              ] }),
              /* @__PURE__ */ c(te, { disabled: !Js.trim() || !Qi && !Ht, onClick: () => {
                Km();
              }, children: "评论" })
            ] }),
            Ui.map((o) => /* @__PURE__ */ u("div", { className: `knowledge-comment${o.resolved ? " is-resolved" : ""}${o.parent_comment_id ? " is-reply" : ""}`, children: [
              /* @__PURE__ */ u("header", { children: [
                /* @__PURE__ */ c("strong", { children: qe[o.author_user_id]?.display_name || "账号不可用" }),
                /* @__PURE__ */ u("span", { children: [
                  "版本 ",
                  o.published_version,
                  " · ",
                  new Date(o.created_at).toLocaleString()
                ] })
              ] }),
              o.anchor.changed ? /* @__PURE__ */ c("p", { className: "knowledge-comment-anchor-state is-invalid", children: "原内容块已删除或内容已经变化，锚点失效。" }) : /* @__PURE__ */ u("button", { type: "button", className: "knowledge-comment-quote", onClick: () => Wm(o), title: "定位并高亮原内容块", children: [
                "“",
                o.anchor.quote,
                "”"
              ] }),
              Vd === o.id ? /* @__PURE__ */ u("div", { className: "knowledge-comment-edit", children: [
                /* @__PURE__ */ c("textarea", { value: cl, maxLength: 16384, onChange: (f) => Ws(f.target.value) }),
                /* @__PURE__ */ u("div", { className: "knowledge-actions", children: [
                  /* @__PURE__ */ c(te, { disabled: !cl.trim(), onClick: () => {
                    Ym(o);
                  }, children: "保存评论" }),
                  /* @__PURE__ */ c(te, { onClick: () => {
                    ll(""), Ws("");
                  }, children: "取消" })
                ] })
              ] }) : /* @__PURE__ */ c("p", { children: o.deleted ? "评论已删除" : o.body }),
              o.mentioned_user_ids.length > 0 && /* @__PURE__ */ u("p", { className: "knowledge-subtle", children: [
                "提及 ",
                o.mentioned_user_ids.map((f) => `@${qe[f]?.display_name || "账号不可用"}`).join("、")
              ] }),
              !o.deleted && /* @__PURE__ */ c("div", { className: "knowledge-comment-reactions", "aria-label": "表情回应", children: F1.map((f) => {
                const A = o.reactions?.find((I) => I.emoji === f);
                return /* @__PURE__ */ u("button", { type: "button", className: A?.reacted ? "is-active" : void 0, "aria-pressed": A?.reacted || !1, title: `${A?.reacted ? "取消" : "添加"}${f}回应`, onClick: () => {
                  tb(o, f);
                }, children: [
                  /* @__PURE__ */ c("span", { children: f }),
                  A && A.count > 0 && /* @__PURE__ */ c("b", { children: A.count })
                ] }, f);
              }) }),
              Gr.filter((f) => f.source_block_id === o.anchor.node_id).map((f) => /* @__PURE__ */ u("div", { className: "knowledge-comment-task", children: [
                /* @__PURE__ */ c(Nr, { size: 14 }),
                /* @__PURE__ */ u("span", { children: [
                  /* @__PURE__ */ c("strong", { children: f.title }),
                  /* @__PURE__ */ u("small", { children: [
                    f.status === "done" ? "已完成" : f.status === "in_progress" ? "进行中" : f.status === "canceled" ? "已取消" : "待处理",
                    f.assignee_user_ids.length ? ` · ${f.assignee_user_ids.map((A) => qe[A]?.display_name || A).join("、")}` : " · 未指派"
                  ] })
                ] })
              ] }, f.id)),
              Y.page.state === "active" && !o.deleted && Vd !== o.id && /* @__PURE__ */ u("div", { className: "knowledge-actions", children: [
                /* @__PURE__ */ c(te, { onClick: () => Xm(o), children: "回复" }),
                /* @__PURE__ */ c(te, { onClick: () => {
                  ll(o.id), Ws(o.body);
                }, children: "编辑" }),
                /* @__PURE__ */ c(te, { onClick: () => {
                  Zm(o);
                }, children: o.resolved ? "重新打开" : "标记解决" }),
                p && !o.anchor.changed && /* @__PURE__ */ c(te, { onClick: () => {
                  nb(o);
                }, children: Gr.some((f) => f.source_block_id === o.anchor.node_id) ? "追加任务指派" : "指派任务" }),
                /* @__PURE__ */ c(te, { className: "danger", onClick: () => {
                  eb(o);
                }, children: "删除" })
              ] })
            ] }, o.id)),
            !ol && /* @__PURE__ */ c(te, { onClick: () => {
              Cu();
            }, children: "加载更多评论" })
          ] }),
          he === "activity" && /* @__PURE__ */ u("section", { className: "knowledge-page-activity", children: [
            /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "活动由发布版本与评论实时合并，不另存第三份活动记录。" }),
            Du.map((o) => /* @__PURE__ */ u("div", { className: "knowledge-activity-item", children: [
              /* @__PURE__ */ c(eh, { size: 15 }),
              /* @__PURE__ */ u("span", { children: [
                /* @__PURE__ */ c("strong", { children: o.title }),
                /* @__PURE__ */ u("small", { children: [
                  new Date(o.at).toLocaleString(),
                  " · ",
                  o.detail
                ] })
              ] })
            ] }, o.key)),
            Du.length === 0 && /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "暂无页面活动。" }),
            /* @__PURE__ */ u("div", { className: "knowledge-actions", children: [
              !tl && /* @__PURE__ */ c(te, { onClick: () => {
                Au();
              }, children: "加载更早发布" }),
              !ol && /* @__PURE__ */ c(te, { onClick: () => {
                Cu();
              }, children: "加载更多评论" })
            ] })
          ] }),
          he === "access" && e.role === "manager" && /* @__PURE__ */ u("section", { className: "knowledge-page-access", children: [
            /* @__PURE__ */ c("h3", { children: "当前页面访问说明" }),
            /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "结果由服务端同时计算 Identity 功能权限、资料库实时成员角色、页面继承关系和可选的受控分享状态。" }),
            /* @__PURE__ */ u("label", { children: [
              "查找用户",
              /* @__PURE__ */ c("input", { value: wl, onChange: (o) => {
                iu(o.target.value), au("");
              }, placeholder: "输入姓名或邮箱" })
            ] }),
            /* @__PURE__ */ c("div", { className: "knowledge-principal-results", role: "listbox", children: hm.map((o) => /* @__PURE__ */ u("button", { role: "option", "aria-selected": aa === o.user_id, onClick: () => {
              au(o.user_id), iu(o.display_name || o.email || o.user_id), su([]);
            }, children: [
              o.avatar_url ? /* @__PURE__ */ c("img", { src: o.avatar_url, alt: "" }) : /* @__PURE__ */ c("span", { "aria-hidden": "true", children: (o.display_name || "?").slice(0, 1) }),
              /* @__PURE__ */ c("strong", { children: o.display_name }),
              /* @__PURE__ */ c("small", { children: o.email })
            ] }, o.user_id)) }),
            /* @__PURE__ */ u("label", { children: [
              "动作",
              /* @__PURE__ */ u("select", { value: Jr, onChange: (o) => fm(o.target.value), children: [
                /* @__PURE__ */ c("option", { value: "knowledge.pages.get", children: "阅读页面" }),
                /* @__PURE__ */ c("option", { value: "knowledge.pages.update", children: "编辑草稿" }),
                /* @__PURE__ */ c("option", { value: "knowledge.pages.publish", children: "发布页面" }),
                /* @__PURE__ */ c("option", { value: "knowledge.page_comments.create", children: "发表评论" }),
                /* @__PURE__ */ c("option", { value: "knowledge.page_shares.read", children: "通过受控分享阅读" })
              ] })
            ] }),
            Jr === "knowledge.page_shares.read" && /* @__PURE__ */ u("label", { children: [
              "分享定位符",
              /* @__PURE__ */ c("input", { value: oa, onChange: (o) => pm(o.target.value), placeholder: "kshare_…" })
            ] }),
            _t && /* @__PURE__ */ u("div", { className: "knowledge-access-preview", children: [
              /* @__PURE__ */ u("p", { children: [
                /* @__PURE__ */ u("strong", { children: [
                  "最终结论：",
                  _t.final.allowed ? "允许" : "拒绝"
                ] }),
                "（",
                _t.final.label,
                " · ",
                _t.final.source === "share" ? "受控分享路径" : "正常页面权限路径",
                "）"
              ] }),
              /* @__PURE__ */ u("p", { children: [
                "Identity 功能权限：",
                _t.identity.allowed ? "允许" : "拒绝",
                " · ",
                _t.identity.label
              ] }),
              /* @__PURE__ */ u("p", { children: [
                "资料库成员角色：",
                _t.library.allowed ? "允许" : "拒绝",
                " · ",
                _t.library_role || "无成员关系",
                " · ",
                _t.library.label
              ] }),
              /* @__PURE__ */ u("p", { children: [
                "页面权限：",
                _t.page.allowed ? "允许" : "拒绝",
                " · ",
                _t.page.label,
                "；继承来源 ",
                _t.inherited_from || "资料库"
              ] }),
              _t.share && /* @__PURE__ */ u("p", { children: [
                "受控分享：",
                _t.share.allowed ? "允许" : "拒绝",
                " · ",
                _t.share.label,
                " · ",
                _t.share.source || "share"
              ] })
            ] })
          ] }),
          he === "permissions" && e.role === "manager" && t.getPageAccess && t.setPageAccess && /* @__PURE__ */ u("section", { className: "knowledge-page-access knowledge-page-permissions", children: [
            /* @__PURE__ */ c("h3", { children: "页面与子树权限" }),
            /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "管理者始终保留治理访问。受限模式可授权当前知识库中的用户或组织，实际权限不会超过其知识库角色。" }),
            Ji ? /* @__PURE__ */ u(xt, { children: [
              /* @__PURE__ */ u("label", { children: [
                "访问模式",
                /* @__PURE__ */ u("select", { value: Vr, disabled: nr, onChange: (o) => vl(o.target.value), children: [
                  /* @__PURE__ */ c("option", { value: "inherit", children: "继承知识库角色" }),
                  /* @__PURE__ */ c("option", { value: "restricted", children: "仅管理者和明确授权主体" })
                ] })
              ] }),
              Vr === "inherit" ? /* @__PURE__ */ c("p", { className: "knowledge-access-preview", children: "本页完全继承知识库成员角色，不保存额外授权。" }) : /* @__PURE__ */ u(xt, { children: [
                /* @__PURE__ */ u("div", { className: "knowledge-permission-grant-options", children: [
                  /* @__PURE__ */ u("label", { children: [
                    "授权主体",
                    /* @__PURE__ */ u("select", { value: la, disabled: nr, onChange: (o) => {
                      mm(o.target.value), Vi("");
                    }, children: [
                      /* @__PURE__ */ c("option", { value: "user", children: "用户" }),
                      /* @__PURE__ */ c("option", { value: "organization", children: "组织" })
                    ] })
                  ] }),
                  /* @__PURE__ */ u("label", { children: [
                    "授权角色",
                    /* @__PURE__ */ u("select", { value: Il, onChange: (o) => bm(o.target.value), children: [
                      /* @__PURE__ */ c("option", { value: "reader", children: "阅读者" }),
                      /* @__PURE__ */ c("option", { value: "editor", children: "编辑者" }),
                      /* @__PURE__ */ c("option", { value: "manager", children: "管理者" })
                    ] })
                  ] }),
                  /* @__PURE__ */ u("label", { children: [
                    "授权范围",
                    /* @__PURE__ */ u("select", { value: Sl, onChange: (o) => ym(o.target.value), children: [
                      /* @__PURE__ */ c("option", { value: "page", children: "仅此页面" }),
                      /* @__PURE__ */ c("option", { value: "subtree", children: "此页面与子树" })
                    ] })
                  ] })
                ] }),
                la === "user" ? /* @__PURE__ */ u(xt, { children: [
                  /* @__PURE__ */ u("label", { children: [
                    "查找当前知识库成员",
                    /* @__PURE__ */ c("input", { value: Wr, disabled: nr, onChange: (o) => Vi(o.target.value), placeholder: "按姓名或邮箱搜索" })
                  ] }),
                  /* @__PURE__ */ c("div", { className: "knowledge-principal-results", role: "listbox", children: gm.map((o) => /* @__PURE__ */ u("button", { role: "option", onClick: () => Rm(o), children: [
                    /* @__PURE__ */ c("span", { "aria-hidden": "true", children: (o.display_name || "?").slice(0, 1) }),
                    /* @__PURE__ */ c("strong", { children: o.display_name || o.user_id }),
                    /* @__PURE__ */ c("small", { children: o.email })
                  ] }, o.user_id)) })
                ] }) : /* @__PURE__ */ u("div", { className: "knowledge-member-editor", children: [
                  /* @__PURE__ */ u("label", { children: [
                    "Identity 组织 ID",
                    /* @__PURE__ */ c("input", { value: Wr, disabled: nr, onChange: (o) => Vi(o.target.value), placeholder: "输入准确的组织 ID" })
                  ] }),
                  /* @__PURE__ */ c(te, { disabled: nr || !Wr.trim(), onClick: () => {
                    Tm();
                  }, children: "验证并添加组织" })
                ] }),
                /* @__PURE__ */ u("div", { className: "knowledge-permission-grants", children: [
                  Al.map((o) => /* @__PURE__ */ u("div", { children: [
                    /* @__PURE__ */ u("span", { children: [
                      /* @__PURE__ */ c("strong", { children: pu(o.subject) }),
                      /* @__PURE__ */ u("small", { children: [
                        o.subject.type === "organization" ? "组织" : "用户",
                        " · ",
                        o.role === "reader" ? "阅读者" : o.role === "editor" ? "编辑者" : "管理者",
                        " · ",
                        o.scope === "page" ? "仅此页面" : "页面与子树"
                      ] })
                    ] }),
                    /* @__PURE__ */ c(te, { disabled: nr, onClick: () => Kr((f) => f.filter((A) => A.subject.type !== o.subject.type || A.subject.id !== o.subject.id || A.scope !== o.scope)), children: "移除" })
                  ] }, `${o.subject.type}:${o.subject.id}:${o.scope}`)),
                  Al.length === 0 && /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "尚未授权任何用户或组织；除管理者外无人可访问。" })
                ] })
              ] }),
              /* @__PURE__ */ u("p", { className: "knowledge-subtle", children: [
                "当前 ACL revision ",
                Ji.revision,
                " · 远端投影 ",
                Ji.projection_status === "ready" ? "已确认" : "确认中（页面已从搜索结果隐藏）"
              ] }),
              /* @__PURE__ */ u(te, { disabled: nr, onClick: () => {
                Fm();
              }, children: [
                /* @__PURE__ */ c(cr, { size: 14 }),
                nr ? "正在保存…" : "保存页面权限"
              ] })
            ] }) : /* @__PURE__ */ c("p", { role: "status", children: "正在读取服务端权限…" }),
            /* @__PURE__ */ c(u1, { client: t, libraryID: e.id, pageID: ne, published: !!Y.published, formatError: i, onNotice: Pe })
          ] }),
          he === "governance" && q && Re && /* @__PURE__ */ u("section", { className: "knowledge-page-governance", "aria-labelledby": "knowledge-page-governance-title", children: [
            /* @__PURE__ */ u("header", { children: [
              /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ c("h3", { id: "knowledge-page-governance-title", children: "页面治理" }),
                /* @__PURE__ */ c("p", { children: "负责人和内容管理员只承担治理责任，不会因此获得页面访问权限；复核人仍须拥有编辑权限。" })
              ] }),
              /* @__PURE__ */ u("span", { children: [
                "revision ",
                q.revision
              ] })
            ] }),
            /* @__PURE__ */ u("article", { className: "knowledge-governance-card", children: [
              /* @__PURE__ */ u("div", { className: "knowledge-governance-card-title", children: [
                /* @__PURE__ */ u("div", { children: [
                  /* @__PURE__ */ c("h4", { children: "责任人与复核周期" }),
                  /* @__PURE__ */ c("p", { children: "管理者配置规则；负责人、内容管理员或管理者可完成复核。" })
                ] }),
                ie && /* @__PURE__ */ c("span", { className: "is-pending", children: "未保存" })
              ] }),
              /* @__PURE__ */ u("div", { className: "knowledge-governance-grid", children: [
                /* @__PURE__ */ u("label", { children: [
                  /* @__PURE__ */ c("span", { children: "页面负责人" }),
                  /* @__PURE__ */ u("select", { value: Re.ownerUserID, disabled: e.role !== "manager" || M, onChange: (o) => Yi((f) => ({ ...f, ownerUserID: o.target.value, contentAdminUserIDs: f.contentAdminUserIDs.filter((A) => A !== o.target.value) })), children: [
                    /* @__PURE__ */ c("option", { value: "", children: "选择当前知识库成员" }),
                    Gl.map((o) => /* @__PURE__ */ c("option", { value: o, children: qe[o]?.display_name || o }, o))
                  ] })
                ] }),
                /* @__PURE__ */ u("label", { children: [
                  /* @__PURE__ */ c("span", { children: "下次复核时间" }),
                  /* @__PURE__ */ c("input", { type: "datetime-local", value: z1(Re.nextReviewAt), disabled: e.role !== "manager" || M || Re.reviewIntervalDays === 0, onChange: (o) => Yi((f) => ({ ...f, nextReviewAt: R1(o.target.value) })) })
                ] }),
                /* @__PURE__ */ u("label", { children: [
                  /* @__PURE__ */ c("span", { children: "复核周期（天）" }),
                  /* @__PURE__ */ c("input", { type: "number", min: 0, max: 3650, value: Re.reviewIntervalDays, disabled: e.role !== "manager" || M, onChange: (o) => Yi((f) => ({ ...f, reviewIntervalDays: Math.max(0, Number(o.target.value) || 0), nextReviewAt: Number(o.target.value) > 0 ? f.nextReviewAt : void 0 })) }),
                  /* @__PURE__ */ c("small", { children: "填 0 表示关闭定期复核。" })
                ] }),
                /* @__PURE__ */ u("label", { children: [
                  /* @__PURE__ */ c("span", { children: "归档保留期（天）" }),
                  /* @__PURE__ */ c("input", { type: "number", min: 1, max: 3650, value: Re.archiveRetentionDays, disabled: e.role !== "manager" || M, onChange: (o) => Yi((f) => ({ ...f, archiveRetentionDays: Math.max(1, Number(o.target.value) || 1) })) }),
                  /* @__PURE__ */ c("small", { children: "到期后页面不可恢复；首期不提供物理删除按钮。" })
                ] })
              ] }),
              /* @__PURE__ */ u("label", { className: "knowledge-metadata-member-search", children: [
                /* @__PURE__ */ c("span", { children: "查找知识库成员" }),
                /* @__PURE__ */ u("div", { children: [
                  /* @__PURE__ */ c(mn, { size: 14 }),
                  /* @__PURE__ */ c("input", { value: Ce, disabled: e.role !== "manager" || M, onChange: (o) => xe(o.target.value), placeholder: "按姓名或邮箱查找负责人、内容管理员" })
                ] })
              ] }),
              /* @__PURE__ */ u("div", { className: "knowledge-governance-admins", children: [
                /* @__PURE__ */ u("div", { children: [
                  /* @__PURE__ */ c("h5", { children: "内容管理员" }),
                  /* @__PURE__ */ c("p", { children: "可执行复核，但不会自动获得阅读或编辑权限。" })
                ] }),
                /* @__PURE__ */ c("div", { children: Gl.filter((o) => o !== Re.ownerUserID).map((o) => /* @__PURE__ */ u("label", { children: [
                  /* @__PURE__ */ c("input", { type: "checkbox", checked: Re.contentAdminUserIDs.includes(o), disabled: e.role !== "manager" || M, onChange: (f) => Yi((A) => ({ ...A, contentAdminUserIDs: f.target.checked ? [...A.contentAdminUserIDs, o].sort() : A.contentAdminUserIDs.filter((I) => I !== o) })) }),
                  /* @__PURE__ */ c("span", { children: qe[o]?.display_name || o }),
                  /* @__PURE__ */ c("small", { children: qe[o]?.email || o })
                ] }, o)) })
              ] }),
              /* @__PURE__ */ u("div", { className: "knowledge-governance-review-status", children: [
                /* @__PURE__ */ u("div", { children: [
                  /* @__PURE__ */ c(Vu, { size: 18 }),
                  /* @__PURE__ */ u("span", { children: [
                    /* @__PURE__ */ c("strong", { children: q.last_reviewed_at ? `上次复核：${new Date(q.last_reviewed_at).toLocaleString()}` : "尚未完成过复核" }),
                    /* @__PURE__ */ c("small", { children: q.last_reviewed_by_user_id ? `复核人：${qe[q.last_reviewed_by_user_id]?.display_name || q.last_reviewed_by_user_id}` : q.next_review_at ? `计划复核：${new Date(q.next_review_at).toLocaleString()}` : "未启用定期复核" })
                  ] })
                ] }),
                Fu && Y.page.state === "active" && /* @__PURE__ */ u(te, { disabled: M || ie, onClick: () => {
                  xm();
                }, children: [
                  /* @__PURE__ */ c(Nr, { size: 14 }),
                  "完成本次复核"
                ] })
              ] }),
              q.archived_at && /* @__PURE__ */ u("p", { className: "knowledge-governance-retention", children: [
                /* @__PURE__ */ c(Sa, { size: 15 }),
                "归档于 ",
                new Date(q.archived_at).toLocaleString(),
                "；",
                q.retain_until ? `保留至 ${new Date(q.retain_until).toLocaleString()}` : "尚未生成清理期限"
              ] }),
              e.role === "manager" && /* @__PURE__ */ u("footer", { children: [
                /* @__PURE__ */ u(te, { disabled: M || !ie, onClick: () => {
                  gu();
                }, children: [
                  /* @__PURE__ */ c(lt, { size: 14 }),
                  "重新加载"
                ] }),
                /* @__PURE__ */ u(te, { className: "primary", disabled: M || !ie || !Re.ownerUserID || Re.contentAdminUserIDs.length > 20 || Re.archiveRetentionDays < 1 || Re.archiveRetentionDays > 3650 || Re.reviewIntervalDays < 0 || Re.reviewIntervalDays > 3650, onClick: () => {
                  Em();
                }, children: [
                  /* @__PURE__ */ c(cr, { size: 14 }),
                  M ? "保存中…" : "保存治理规则"
                ] })
              ] })
            ] }),
            e.role === "manager" && /* @__PURE__ */ u("article", { className: "knowledge-governance-card knowledge-governance-audit", children: [
              /* @__PURE__ */ u("div", { className: "knowledge-governance-card-title", children: [
                /* @__PURE__ */ u("div", { children: [
                  /* @__PURE__ */ c("h4", { children: "治理审计" }),
                  /* @__PURE__ */ c("p", { children: "直接查询不可变 Audit 事件，不在知识库内复制第三份日志。" })
                ] }),
                /* @__PURE__ */ c(te, { "aria-label": "刷新治理审计", title: "刷新", disabled: oe, onClick: () => {
                  Yr(!0);
                }, children: /* @__PURE__ */ c(lt, { className: oe ? "knowledge-spin" : void 0, size: 14 }) })
              ] }),
              /* @__PURE__ */ u("div", { className: "knowledge-governance-audit-filters", children: [
                /* @__PURE__ */ u("label", { children: [
                  /* @__PURE__ */ c("span", { children: "事件" }),
                  /* @__PURE__ */ u("select", { value: Se, disabled: oe, onChange: (o) => Ne(o.target.value), children: [
                    /* @__PURE__ */ c("option", { value: "", children: "全部治理事件" }),
                    /* @__PURE__ */ c("option", { value: "knowledge.page.governance_set", children: "更新治理规则" }),
                    /* @__PURE__ */ c("option", { value: "knowledge.page.governance_reviewed", children: "完成内容复核" })
                  ] })
                ] }),
                /* @__PURE__ */ u("label", { children: [
                  /* @__PURE__ */ c("span", { children: "操作者用户 ID" }),
                  /* @__PURE__ */ c("input", { value: je, disabled: oe, onChange: (o) => ft(o.target.value), placeholder: "留空表示全部" })
                ] }),
                /* @__PURE__ */ u(te, { disabled: oe, onClick: () => {
                  Yr(!0);
                }, children: [
                  /* @__PURE__ */ c(mn, { size: 14 }),
                  "查询"
                ] })
              ] }),
              /* @__PURE__ */ u("div", { className: "knowledge-governance-audit-list", children: [
                j.map((o) => /* @__PURE__ */ u("article", { children: [
                  /* @__PURE__ */ c("span", { className: "knowledge-governance-audit-icon", children: /* @__PURE__ */ c(jn, { size: 15 }) }),
                  /* @__PURE__ */ u("div", { children: [
                    /* @__PURE__ */ c("strong", { children: M1[o.type] || o.type }),
                    /* @__PURE__ */ u("small", { children: [
                      qe[o.actor.user_id]?.display_name || o.actor.user_id,
                      " · ",
                      new Date(o.occurred_at).toLocaleString(),
                      " · revision ",
                      o.version || "-"
                    ] }),
                    o.after && /* @__PURE__ */ c("p", { children: Object.entries(o.after).map(([f, A]) => `${f}: ${A}`).join(" · ") })
                  ] })
                ] }, o.id)),
                !oe && j.length === 0 && /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "没有符合条件的治理事件。" })
              ] }),
              !se && /* @__PURE__ */ c(te, { disabled: oe || !O, onClick: () => {
                Yr(!1);
              }, children: oe ? "加载中…" : "加载更多" })
            ] }),
            e.role === "manager" && t.getPageContentPolicy && t.setPageContentPolicy && /* @__PURE__ */ c(f1, { client: t, libraryID: e.id, pageID: ne, formatError: i, onNotice: Pe, onSaved: () => {
              t.getPage(e.id, ne, p, AbortSignal.timeout(3e4)).then((o) => {
                Fe.current = o, dt(o);
              }, (o) => ae(i(o)));
            } })
          ] })
        ] })
      ] })
    ] }),
    om && typeof document < "u" && wi(/* @__PURE__ */ c("div", { className: "knowledge-modal-backdrop", onMouseDown: (o) => {
      o.target === o.currentTarget && !Pt && Fi(!1);
    }, children: /* @__PURE__ */ u("section", { className: "knowledge-template-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "knowledge-template-title", children: [
      /* @__PURE__ */ u("header", { children: [
        /* @__PURE__ */ u("div", { children: [
          /* @__PURE__ */ c("h2", { id: "knowledge-template-title", children: "页面模板" }),
          /* @__PURE__ */ c("p", { children: "模板冻结当前页面及其子页面；创建出的页面与模板后续版本互不影响。" })
        ] }),
        /* @__PURE__ */ c(te, { "aria-label": "关闭模板", title: "关闭", disabled: !!Pt, onClick: () => Fi(!1), children: /* @__PURE__ */ c(Fn, { size: 17 }) })
      ] }),
      /* @__PURE__ */ u("div", { className: "knowledge-template-dialog-body", children: [
        p && ne && t.createPageTemplate && /* @__PURE__ */ u("section", { className: "knowledge-template-create", children: [
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ c("h3", { children: "保存当前页面为模板" }),
            /* @__PURE__ */ c("p", { children: "包含当前页面下最多 200 个可编辑子页面。" })
          ] }),
          /* @__PURE__ */ u("label", { children: [
            "模板名称",
            /* @__PURE__ */ c("input", { maxLength: 256, value: $s, disabled: !!Pt, onChange: (o) => Ko(o.target.value) })
          ] }),
          /* @__PURE__ */ u("label", { children: [
            "说明",
            /* @__PURE__ */ c("textarea", { maxLength: 2048, rows: 2, value: Ld, disabled: !!Pt, onChange: (o) => Wo(o.target.value), placeholder: "说明适用场景" })
          ] }),
          /* @__PURE__ */ u(te, { className: "primary", disabled: !!Pt || !$s.trim(), onClick: () => {
            Pm();
          }, children: [
            /* @__PURE__ */ c(cr, { size: 15 }),
            Pt === "create" ? "正在保存…" : "保存模板"
          ] })
        ] }),
        /* @__PURE__ */ u("section", { className: "knowledge-template-library", children: [
          /* @__PURE__ */ u("div", { className: "knowledge-template-section-title", children: [
            /* @__PURE__ */ u("span", { children: [
              /* @__PURE__ */ c("h3", { children: "当前知识库模板" }),
              /* @__PURE__ */ c("p", { children: "默认在当前选中节点下创建，也可选择历史版本。" })
            ] }),
            /* @__PURE__ */ c(te, { "aria-label": "刷新模板", title: "刷新", disabled: !!Pt, onClick: () => {
              _a();
            }, children: /* @__PURE__ */ c(lt, { size: 15 }) })
          ] }),
          Pt === "list" && Vo.length === 0 ? /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "正在读取模板…" }) : Vo.length === 0 ? /* @__PURE__ */ u(hi, { children: [
            /* @__PURE__ */ c(Qu, { size: 26 }),
            /* @__PURE__ */ c("h3", { children: "还没有模板" }),
            /* @__PURE__ */ c("p", { children: "把当前页面及子页面保存为可复用模板。" })
          ] }) : /* @__PURE__ */ c("div", { className: "knowledge-template-list", children: Vo.map((o) => /* @__PURE__ */ u("article", { className: "knowledge-template-card", children: [
            /* @__PURE__ */ c("div", { className: "knowledge-template-card-icon", children: /* @__PURE__ */ c(Rt, { type: o.root_content_type, size: 18 }) }),
            /* @__PURE__ */ u("div", { className: "knowledge-template-card-main", children: [
              /* @__PURE__ */ c("h4", { children: o.title }),
              /* @__PURE__ */ c("p", { children: o.description || "暂无说明" }),
              /* @__PURE__ */ u("small", { children: [
                o.node_count,
                " 个页面 · 最新版本 ",
                o.latest_version,
                " · ",
                new Date(o.updated_at).toLocaleString()
              ] }),
              /* @__PURE__ */ u("div", { className: "knowledge-template-card-actions", children: [
                /* @__PURE__ */ c(te, { className: "primary", disabled: !!Pt, onClick: () => {
                  wu(o);
                }, children: "在当前节点下创建" }),
                t.listPageTemplateVersions && /* @__PURE__ */ u(te, { disabled: !!Pt, "aria-expanded": Os === o.id, onClick: () => {
                  yu(o.id);
                }, children: [
                  /* @__PURE__ */ c(Ua, { size: 14 }),
                  "历史版本"
                ] }),
                p && ne && t.updatePageTemplate && /* @__PURE__ */ u(te, { disabled: !!Pt, onClick: () => {
                  Mm(o);
                }, children: [
                  /* @__PURE__ */ c(lt, { size: 14 }),
                  "用当前页面生成新版本"
                ] })
              ] }),
              Os === o.id && /* @__PURE__ */ c("div", { className: "knowledge-template-versions", children: Pt === `versions:${o.id}` && !Td[o.id]?.length ? /* @__PURE__ */ c("p", { children: "正在读取版本…" }) : (Td[o.id] || []).map((f) => /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ u("span", { children: [
                  /* @__PURE__ */ u("strong", { children: [
                    "版本 ",
                    f.version
                  ] }),
                  /* @__PURE__ */ u("small", { children: [
                    f.node_count,
                    " 个页面 · ",
                    new Date(f.created_at).toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ c(te, { disabled: !!Pt, onClick: () => {
                  wu(o, f.version);
                }, children: "使用此版本" })
              ] }, f.version)) })
            ] })
          ] }, o.id)) })
        ] })
      ] })
    ] }) }), document.body)
  ] });
}
const ri = { reader: "阅读", editor: "编辑", manager: "管理" };
function UC({ client: t, currentUserID: e = "", formatError: n = Es }) {
  const r = Xe(() => typeof window > "u" ? null : p1(window.location.href), []), [i, s] = P(r?.libraryKind || "personal"), [a, l] = P(""), [d, h] = P({ query: "", revision: 0 });
  return /* @__PURE__ */ u("main", { className: "knowledge-workspace", children: [
    /* @__PURE__ */ u("div", { className: "knowledge-workspace-toolbar", children: [
      /* @__PURE__ */ u("div", { className: "knowledge-workspace-tabs", role: "tablist", "aria-label": "知识库范围", children: [
        /* @__PURE__ */ u("button", { role: "tab", "aria-selected": i === "personal", onClick: () => s("personal"), children: [
          /* @__PURE__ */ c(Ln, { size: 17 }),
          /* @__PURE__ */ u("span", { children: [
            "个人知识库",
            /* @__PURE__ */ c("small", { children: "仅自己可见的知识空间" })
          ] })
        ] }),
        /* @__PURE__ */ u("button", { role: "tab", "aria-selected": i === "shared", onClick: () => s("shared"), children: [
          /* @__PURE__ */ c(ds, { size: 17 }),
          /* @__PURE__ */ u("span", { children: [
            "团队知识库",
            /* @__PURE__ */ c("small", { children: "按成员角色共同维护" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ u("form", { className: "knowledge-global-search", role: "search", onSubmit: (b) => {
        b.preventDefault();
        const m = a.trim();
        m && h((p) => ({ query: m, revision: p.revision + 1 }));
      }, children: [
        /* @__PURE__ */ c(mn, { size: 17, "aria-hidden": "true" }),
        /* @__PURE__ */ c("input", { "aria-label": "全文检索当前知识库", value: a, maxLength: 4096, onChange: (b) => l(b.target.value), placeholder: "全文检索当前知识库" }),
        d.query && /* @__PURE__ */ c(te, { type: "button", "aria-label": "清除全文检索", onClick: () => {
          l(""), h((b) => ({ query: "", revision: b.revision + 1 }));
        }, children: /* @__PURE__ */ c(Fn, { size: 15 }) }),
        /* @__PURE__ */ c(te, { type: "submit", className: "primary", disabled: !a.trim(), children: "搜索" })
      ] })
    ] }),
    /* @__PURE__ */ c(im, { client: t, currentUserID: e, formatError: n, initialLibraryID: r?.libraryKind === i ? r.libraryID : "", initialPageID: r?.libraryKind === i ? r.pageID : "", initialBlockID: r?.libraryKind === i ? r.blockID : void 0, initialPageMode: r?.libraryKind === i ? r.mode : "read", libraryKind: i, searchQuery: d.query, searchRevision: d.revision }, i)
  ] });
}
const La = { scope: "library", contentType: "", authorUserID: "", updatedAfter: "", updatedBefore: "", tags: "", path: "", publicationStatus: "" };
function zf(t, e) {
  if (!t) return;
  const n = /* @__PURE__ */ new Date(`${t}T${e ? "23:59:59.999" : "00:00:00.000"}`);
  return Number.isNaN(n.getTime()) ? void 0 : n.toISOString();
}
function j1(t, e, n) {
  return {
    query: t,
    content_types: e.contentType ? [e.contentType] : [],
    author_user_ids: e.authorUserID.trim() ? [e.authorUserID.trim()] : [],
    updated_after: zf(e.updatedAfter, !1),
    updated_before: zf(e.updatedBefore, !0),
    tags: [...new Set(e.tags.split(/[，,]/).map((r) => r.trim()).filter(Boolean))],
    path_query: e.path.trim() || void 0,
    ancestor_page_id: e.scope === "subtree" ? n?.pageID : void 0,
    publication_statuses: e.publicationStatus ? [e.publicationStatus] : [],
    limit: 100
  };
}
function q1(t) {
  return t.scope === "subtree" || Object.entries(t).some(([e, n]) => e !== "scope" && !!n);
}
function Md(t, e) {
  return `knowledge.page-search.recent.v1:${encodeURIComponent(t || "anonymous")}:${encodeURIComponent(e)}`;
}
function Kc(t, e) {
  if (typeof window > "u") return [];
  try {
    const n = JSON.parse(window.localStorage.getItem(Md(t, e)) || "[]");
    return Array.isArray(n) ? n.filter((r) => typeof r == "string" && r.trim().length > 0 && r.length <= 512).slice(0, 10) : [];
  } catch {
    return [];
  }
}
function H1(t, e, n) {
  const r = n.trim();
  if (!r || typeof window > "u") return Kc(t, e);
  const i = [r, ...Kc(t, e).filter((s) => s.toLocaleLowerCase() !== r.toLocaleLowerCase())].slice(0, 10);
  try {
    window.localStorage.setItem(Md(t, e), JSON.stringify(i));
  } catch {
  }
  return i;
}
function G1(t) {
  return t.location.kind === "block" ? `内容块 ${t.location.block_id || ""}`.trim() : t.location.kind === "cell" ? t.location.cell ? `${t.location.sheet_id ? `${t.location.sheet_id} · ` : ""}单元格 ${t.location.cell}` : `记录 ${t.location.record_id || ""} · 字段 ${t.location.field_id || ""}` : t.location.kind === "node" ? `节点 ${t.location.node_id || ""}`.trim() : "页面信息";
}
function J1(t) {
  return { none: "未索引", queued: "等待索引", indexing: "索引中", ready: "已索引", failed: "索引失败" }[t];
}
function V1({ client: t, formatError: e, library: n, currentUserID: r, initialQuery: i, subtreeRoot: s, onOpen: a }) {
  const [l, d] = P(La), [h, b] = P(La), [m, p] = P(i.trim()), [g, _] = P(() => Kc(r, n.id)), [k, y] = P(0), [C, S] = P(!1), [x, z] = P(null), [N, R] = P(!1), [B, U] = P(""), [Q, K] = P(!t.streamKnowledgePageSearchEvents);
  Ae(() => p(i.trim()), [i]), Ae(() => {
    if (!t.streamKnowledgePageSearchEvents) {
      K(!0);
      return;
    }
    const E = new AbortController();
    let F = 0, v = 0, T = !1;
    return K(!1), (async () => {
      for (; !E.signal.aborted && !T; )
        try {
          await t.streamKnowledgePageSearchEvents(n.id, F, (Z) => {
            if (F = Z.revision, Z.type === "revoked") {
              T = !0, K(!1), z(null), R(!1), U("当前知识库访问权限已撤销。"), E.abort();
              return;
            }
            K(!0), Z.type === "changed" && (z(null), y((ke) => ke + 1));
          }, E.signal), E.signal.aborted || (K(!1), z(null), y((Z) => Z + 1)), v = 0;
        } catch {
          if (E.signal.aborted) return;
          K(!1), z(null), v += 1, await new Promise((Z) => window.setTimeout(Z, Math.min(5e3, 250 * 2 ** Math.min(v - 1, 5)))), F = 0;
        }
    })(), () => E.abort();
  }, [t, n.id]), Ae(() => {
    const E = m.trim();
    if (!Q) return;
    if (!E && !q1(h)) {
      z(null);
      return;
    }
    const F = new AbortController();
    return R(!0), U(""), z(null), t.searchPages(n.id, j1(E, h, s), F.signal).then((v) => {
      F.signal.aborted || (z(v), E && _(H1(r, n.id, E)));
    }).catch((v) => {
      F.signal.aborted || U(e(v));
    }).finally(() => {
      F.signal.aborted || R(!1);
    }), () => F.abort();
  }, [Q, h, t, r, e, n.id, m, k, s]);
  const pe = Object.entries(h).filter(([E, F]) => E === "scope" ? F === "subtree" : !!F).length;
  return /* @__PURE__ */ u("section", { className: "knowledge-page-search", "aria-label": `全文检索「${n.name}」`, children: [
    /* @__PURE__ */ u("header", { className: "knowledge-page-search-header", children: [
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ c("span", { children: /* @__PURE__ */ c(Xl, { size: 19 }) }),
        /* @__PURE__ */ u("div", { children: [
          /* @__PURE__ */ u("h2", { children: [
            "全文检索「",
            n.name,
            "」"
          ] }),
          /* @__PURE__ */ c("p", { children: "只返回你当前有权读取的页面、文件和原生应用。" })
        ] })
      ] }),
      /* @__PURE__ */ u(te, { "aria-expanded": C, "aria-controls": "knowledge-page-search-filters", onClick: () => S((E) => !E), children: [
        /* @__PURE__ */ c(Mb, { size: 15 }),
        "筛选",
        pe ? ` ${pe}` : ""
      ] })
    ] }),
    C && /* @__PURE__ */ u("form", { id: "knowledge-page-search-filters", className: "knowledge-page-search-filters", onSubmit: (E) => {
      E.preventDefault(), b({ ...l }), y((F) => F + 1);
    }, children: [
      /* @__PURE__ */ u("label", { children: [
        /* @__PURE__ */ c("span", { children: "检索范围" }),
        /* @__PURE__ */ u("select", { value: l.scope, onChange: (E) => d((F) => ({ ...F, scope: E.target.value })), children: [
          /* @__PURE__ */ c("option", { value: "library", children: "当前知识库" }),
          /* @__PURE__ */ u("option", { value: "subtree", disabled: !s, children: [
            "当前页面与子树",
            s ? `：${s.title}` : "（请先打开页面）"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ u("label", { children: [
        /* @__PURE__ */ c("span", { children: "内容类型" }),
        /* @__PURE__ */ u("select", { value: l.contentType, onChange: (E) => d((F) => ({ ...F, contentType: E.target.value })), children: [
          /* @__PURE__ */ c("option", { value: "", children: "全部类型" }),
          Rs.map((E) => /* @__PURE__ */ c("option", { value: E.id, children: E.label }, E.id))
        ] })
      ] }),
      /* @__PURE__ */ u("label", { children: [
        /* @__PURE__ */ c("span", { children: "作者账号" }),
        /* @__PURE__ */ c("input", { value: l.authorUserID, onChange: (E) => d((F) => ({ ...F, authorUserID: E.target.value })), placeholder: "用户 ID" })
      ] }),
      /* @__PURE__ */ u("label", { children: [
        /* @__PURE__ */ c("span", { children: "更新开始" }),
        /* @__PURE__ */ c("input", { type: "date", value: l.updatedAfter, onChange: (E) => d((F) => ({ ...F, updatedAfter: E.target.value })) })
      ] }),
      /* @__PURE__ */ u("label", { children: [
        /* @__PURE__ */ c("span", { children: "更新结束" }),
        /* @__PURE__ */ c("input", { type: "date", value: l.updatedBefore, onChange: (E) => d((F) => ({ ...F, updatedBefore: E.target.value })) })
      ] }),
      /* @__PURE__ */ u("label", { children: [
        /* @__PURE__ */ c("span", { children: "标签" }),
        /* @__PURE__ */ c("input", { value: l.tags, onChange: (E) => d((F) => ({ ...F, tags: E.target.value })), placeholder: "多个标签用逗号分隔" })
      ] }),
      /* @__PURE__ */ u("label", { children: [
        /* @__PURE__ */ c("span", { children: "页面路径" }),
        /* @__PURE__ */ c("input", { value: l.path, onChange: (E) => d((F) => ({ ...F, path: E.target.value })), placeholder: "例如：产品 / 运行手册" })
      ] }),
      /* @__PURE__ */ u("label", { children: [
        /* @__PURE__ */ c("span", { children: "发布状态" }),
        /* @__PURE__ */ u("select", { value: l.publicationStatus, onChange: (E) => d((F) => ({ ...F, publicationStatus: E.target.value })), children: [
          /* @__PURE__ */ c("option", { value: "", children: "全部状态" }),
          /* @__PURE__ */ c("option", { value: "published", children: "已发布" }),
          /* @__PURE__ */ c("option", { value: "unpublished", children: "未发布" })
        ] })
      ] }),
      /* @__PURE__ */ u("div", { className: "knowledge-page-search-filter-actions", children: [
        /* @__PURE__ */ c(te, { type: "button", onClick: () => {
          d(La), b(La), y((E) => E + 1);
        }, children: "重置" }),
        /* @__PURE__ */ c(te, { type: "submit", className: "primary", children: "应用筛选" })
      ] })
    ] }),
    g.length > 0 && /* @__PURE__ */ u("div", { className: "knowledge-page-search-recent", "aria-label": "最近搜索", children: [
      /* @__PURE__ */ c("span", { children: "最近搜索" }),
      g.map((E) => /* @__PURE__ */ c("button", { type: "button", "aria-pressed": m === E, onClick: () => {
        p(E), y((F) => F + 1);
      }, children: E }, E)),
      /* @__PURE__ */ c("button", { type: "button", className: "is-clear", onClick: () => {
        try {
          window.localStorage.removeItem(Md(r, n.id));
        } catch {
        }
        _([]);
      }, children: "清除" })
    ] }),
    !Q && !B && /* @__PURE__ */ u("div", { className: "knowledge-page-search-state", children: [
      /* @__PURE__ */ c(lt, { className: "knowledge-spin", size: 25 }),
      /* @__PURE__ */ c("p", { children: "正在确认实时访问权限…" })
    ] }),
    Q && N && /* @__PURE__ */ u("div", { className: "knowledge-page-search-state", children: [
      /* @__PURE__ */ c(lt, { className: "knowledge-spin", size: 25 }),
      /* @__PURE__ */ c("p", { children: "正在检索当前权限范围…" })
    ] }),
    B && /* @__PURE__ */ c("p", { role: "alert", className: "knowledge-error knowledge-page-error", children: B }),
    Q && !N && !B && x && /* @__PURE__ */ u(xt, { children: [
      /* @__PURE__ */ u("div", { className: "knowledge-page-search-summary", children: [
        /* @__PURE__ */ u("strong", { children: [
          x.items.length,
          " 个结果"
        ] }),
        /* @__PURE__ */ c("span", { children: x.truncated ? "结果较多，已显示前 100 条" : "已按相关度与更新时间排序" })
      ] }),
      x.items.length ? /* @__PURE__ */ c("div", { className: "knowledge-page-search-results", children: x.items.map((E) => /* @__PURE__ */ u("button", { type: "button", onClick: () => a(E), children: [
        /* @__PURE__ */ c("span", { className: `knowledge-page-search-type is-${E.kind}`, children: /* @__PURE__ */ c(Rt, { type: E.content_type, size: 19 }) }),
        /* @__PURE__ */ u("span", { className: "knowledge-page-search-copy", children: [
          /* @__PURE__ */ c("strong", { children: E.title }),
          /* @__PURE__ */ c("small", { children: E.path.map((F) => F.title).join(" / ") }),
          E.excerpt && /* @__PURE__ */ c("p", { children: E.excerpt }),
          /* @__PURE__ */ c("em", { children: G1(E) })
        ] }),
        /* @__PURE__ */ u("span", { className: "knowledge-page-search-meta", children: [
          /* @__PURE__ */ u("b", { children: [
            E.kind === "file" ? "文件" : E.kind === "page" ? "页面" : "原生应用",
            " · ",
            Vt[E.content_type].label
          ] }),
          /* @__PURE__ */ u("small", { children: [
            E.author_user_id,
            " · ",
            E.published_version ? `版本 ${E.published_version}` : "未发布"
          ] }),
          /* @__PURE__ */ c("small", { className: `is-index-${E.index_status}`, children: J1(E.index_status) }),
          /* @__PURE__ */ c(ii, { size: 16 })
        ] })
      ] }, E.page_id)) }) : /* @__PURE__ */ u(hi, { children: [
        /* @__PURE__ */ c(Xl, { size: 30 }),
        /* @__PURE__ */ c("h3", { children: "没有匹配结果" }),
        /* @__PURE__ */ c("p", { children: "可以减少筛选条件，或换一个更具体的关键词。" })
      ] })
    ] }),
    Q && !N && !B && !x && /* @__PURE__ */ u(hi, { children: [
      /* @__PURE__ */ c(Xl, { size: 30 }),
      /* @__PURE__ */ c("h3", { children: "从顶部输入关键词" }),
      /* @__PURE__ */ c("p", { children: "搜索页面标题、路径、标签以及已经发布的正文内容。" })
    ] })
  ] });
}
function K1({ client: t, library: e, open: n, onClose: r, onOpen: i }) {
  const [s, a] = P(""), [l, d] = P([]), [h, b] = P(!1), [m, p] = P(0), [g, _] = P(!t.streamKnowledgePageSearchEvents), [k, y] = P(0), C = De(null);
  if (Ae(() => {
    if (!n) {
      a(""), d([]);
      return;
    }
    window.setTimeout(() => C.current?.focus());
  }, [n]), Ae(() => {
    if (!n || !t.streamKnowledgePageSearchEvents) {
      _(!0);
      return;
    }
    const x = new AbortController();
    let z = 0, N = 0, R = !1;
    return _(!1), d([]), (async () => {
      for (; !x.signal.aborted && !R; )
        try {
          await t.streamKnowledgePageSearchEvents(e.id, z, (U) => {
            if (z = U.revision, U.type === "revoked") {
              R = !0, _(!1), d([]), x.abort(), r();
              return;
            }
            _(!0), U.type === "changed" && (d([]), y((Q) => Q + 1));
          }, x.signal), x.signal.aborted || (_(!1), d([])), N = 0;
        } catch {
          if (x.signal.aborted) return;
          _(!1), d([]), N += 1, z = 0, await new Promise((U) => window.setTimeout(U, Math.min(5e3, 250 * 2 ** Math.min(N - 1, 5))));
        }
    })(), () => x.abort();
  }, [t, e.id, r, n]), Ae(() => {
    if (!n || !g) return;
    const x = new AbortController(), z = window.setTimeout(() => {
      b(!0), t.searchPageIdentities(e.id, s.trim(), 30, x.signal).then((N) => {
        x.signal.aborted || (d(N.items), p(0));
      }).catch(() => {
        x.signal.aborted || d([]);
      }).finally(() => {
        x.signal.aborted || b(!1);
      });
    }, 120);
    return () => {
      window.clearTimeout(z), x.abort();
    };
  }, [g, k, t, e.id, n, s]), !n || typeof document > "u") return null;
  const S = (x) => {
    x && (i(x), r());
  };
  return wi(/* @__PURE__ */ c("div", { className: "knowledge-modal-backdrop knowledge-quick-open-backdrop", role: "presentation", onMouseDown: (x) => {
    x.target === x.currentTarget && r();
  }, children: /* @__PURE__ */ u("section", { className: "knowledge-quick-open", role: "dialog", "aria-modal": "true", "aria-label": `快速打开「${e.name}」中的页面`, onKeyDown: (x) => {
    x.key === "Escape" ? (x.preventDefault(), r()) : x.key === "ArrowDown" ? (x.preventDefault(), p((z) => l.length ? (z + 1) % l.length : 0)) : x.key === "ArrowUp" ? (x.preventDefault(), p((z) => l.length ? (z - 1 + l.length) % l.length : 0)) : x.key === "Enter" && (x.preventDefault(), S(l[m]));
  }, children: [
    /* @__PURE__ */ u("header", { children: [
      /* @__PURE__ */ c(mn, { size: 19 }),
      /* @__PURE__ */ c("input", { ref: C, value: s, maxLength: 128, onChange: (x) => a(x.target.value), placeholder: "输入页面标题、别名或路径", "aria-activedescendant": l[m] ? `quick-page-${l[m].page_id}` : void 0 }),
      /* @__PURE__ */ c("kbd", { children: "Esc" })
    ] }),
    /* @__PURE__ */ u("div", { className: "knowledge-quick-open-results", role: "listbox", "aria-label": "可打开页面", children: [
      l.map((x, z) => /* @__PURE__ */ u("button", { id: `quick-page-${x.page_id}`, type: "button", role: "option", "aria-selected": z === m, onMouseEnter: () => p(z), onClick: () => S(x), children: [
        /* @__PURE__ */ c(Rt, { type: x.content_type, size: 17 }),
        /* @__PURE__ */ u("span", { children: [
          /* @__PURE__ */ c("strong", { children: x.title }),
          /* @__PURE__ */ u("small", { children: [
            x.path.map((N) => N.title).join(" / "),
            x.aliases.length ? ` · 别名 ${x.aliases.join("、")}` : ""
          ] })
        ] }),
        /* @__PURE__ */ c("kbd", { children: "↵" })
      ] }, x.page_id)),
      !g && /* @__PURE__ */ u("p", { children: [
        /* @__PURE__ */ c(lt, { className: "knowledge-spin", size: 15 }),
        "正在确认实时访问权限…"
      ] }),
      g && h && /* @__PURE__ */ u("p", { children: [
        /* @__PURE__ */ c(lt, { className: "knowledge-spin", size: 15 }),
        "正在查找…"
      ] }),
      g && !h && l.length === 0 && /* @__PURE__ */ c("p", { children: "没有可打开的页面" })
    ] }),
    /* @__PURE__ */ u("footer", { children: [
      /* @__PURE__ */ u("span", { children: [
        /* @__PURE__ */ c("kbd", { children: "↑" }),
        /* @__PURE__ */ c("kbd", { children: "↓" }),
        " 选择"
      ] }),
      /* @__PURE__ */ u("span", { children: [
        /* @__PURE__ */ c("kbd", { children: "Enter" }),
        " 打开"
      ] }),
      /* @__PURE__ */ c("span", { children: "结果始终执行当前页面 ACL" })
    ] })
  ] }) }), document.body);
}
function im({ client: t, currentUserID: e = "", formatError: n = Es, initialLibraryID: r = "", initialPageID: i = "", initialBlockID: s, initialPageMode: a = "read", libraryKind: l, searchQuery: d = "", searchRevision: h = 0 }) {
  const [b, m] = P({ items: [], complete: !0 }), [p, g] = P([""]), [_, k] = P(r), [y, C] = P(null), [S, x] = P(0), [z, N] = P(!0), [R, B] = P(!1), [U, Q] = P(""), [K, pe] = P(""), [E, F] = P(""), [v, T] = P(""), [fe, Z] = P(""), [ke, q] = P(null), [ge, W] = P([""]), [H, ye] = P(null), [me, de] = P([""]), [re, we] = P(""), [_e, Ce] = P("reader"), [xe, ze] = P(""), [Ge, Re] = P(""), [w, ie] = P("reader"), [X, M] = P(""), [D, j] = P(""), [le, O] = P([]), [$, se] = P({}), [ue, oe] = P({}), [ce, Se] = P(null), [Ne, je] = P(!1), [ft, it] = P("content"), [wt, Ue] = P(null), [Cn, Jn] = P(null), [It, In] = P(!1), [Ur, Sn] = P(null), Vn = De(null), En = De(!1), Be = R || Ne, Bt = p.at(-1) || "", wr = ge.at(-1) || "", $t = me.at(-1) || "", Kn = l ? b.items.filter((J) => J.kind === l) : b.items, _r = l !== "shared" && !z && !b.items.some((J) => J.kind === "personal"), $r = l !== "personal";
  Ae(() => {
    const J = new AbortController();
    return N(!0), Q(""), (async () => {
      let be = await t.listLibraries(Bt, 20, J.signal);
      if (l) {
        const Qe = be.items.filter((Yt) => Yt.kind === l), ae = new Set(be.items.map((Yt) => Yt.id));
        let Qt = be.next_after, Pe = be.complete;
        for (let Yt = 1; Qe.length < 20 && !Pe && Qt && Yt < 20; Yt += 1) {
          const Wn = await t.listLibraries(Qt, 20, J.signal);
          if (J.signal.aborted) return;
          for (const ln of Wn.items) ae.has(ln.id) || (ae.add(ln.id), ln.kind === l && Qe.push(ln));
          Pe = Wn.complete, Qt = Wn.next_after;
        }
        be = { items: Qe, next_after: Pe ? void 0 : Qt, complete: Pe };
      }
      J.signal.aborted || (m(be), k((Qe) => Qe && (Qe === r || be.items.some((ae) => ae.id === Qe && (!l || ae.kind === l))) ? Qe : be.items.find((ae) => !l || ae.kind === l)?.id || ""));
    })().catch((be) => {
      J.signal.aborted || (m({ items: [], complete: !0 }), Q(n(be)));
    }).finally(() => {
      J.signal.aborted || N(!1);
    }), () => J.abort();
  }, [t, n, r, Bt, l, S]), Ae(() => {
    if (q(null), ye(null), ze(""), M(""), !_) {
      C(null);
      return;
    }
    const J = new AbortController();
    return t.getLibrary(_, J.signal).then(async (be) => {
      if (!J.signal.aborted && (C(be), T(be.name), Z(be.description), be.role === "manager" && be.kind === "shared")) {
        const [Qe, ae] = await Promise.all([
          t.listMembers(be.id, wr, 20, J.signal),
          t.listOrganizationMembers(be.id, $t, 20, J.signal)
        ]);
        q(Qe), ye(ae);
      }
    }).catch((be) => {
      J.signal.aborted || (C(null), q(null), ye(null), Q(n(be)));
    }), () => J.abort();
  }, [t, n, wr, $t, S, _]), Ae(() => {
    if (!ke?.items.length) {
      se({});
      return;
    }
    const J = new AbortController();
    return t.resolvePrincipals(ke.items.map((be) => be.user_id), J.signal).then((be) => {
      J.signal.aborted || se(Object.fromEntries(be.filter((Qe) => Qe.status === "active").map((Qe) => [Qe.user_id, Qe])));
    }).catch(() => {
      J.signal.aborted || se({});
    }), () => J.abort();
  }, [t, ke]), Ae(() => {
    if (!H?.items.length) {
      oe({});
      return;
    }
    const J = new AbortController();
    return t.resolveOrganizationPrincipals(H.items.map((be) => be.organization_id), J.signal).then((be) => {
      J.signal.aborted || oe(Object.fromEntries(be.map((Qe) => [Qe.organization_id, Qe])));
    }).catch(() => {
      J.signal.aborted || oe({});
    }), () => J.abort();
  }, [t, H]), Ae(() => {
    h < 1 || it(d ? "search" : "content");
  }, [d, h]), Ae(() => {
    const J = (be) => {
      !y || !(be.metaKey || be.ctrlKey) || be.altKey || be.key.toLocaleLowerCase() !== "k" || (be.preventDefault(), In(!0));
    };
    return window.addEventListener("keydown", J), () => window.removeEventListener("keydown", J);
  }, [y]), Ae(() => {
    const J = D.trim();
    if (!J || !y || y.role !== "manager") {
      O([]);
      return;
    }
    const be = new AbortController(), Qe = window.setTimeout(() => {
      t.searchPrincipals(J, "", 20, be.signal).then((ae) => {
        be.signal.aborted || O(ae.items.filter((Qt) => Qt.status === "active"));
      }).catch(() => {
        be.signal.aborted || O([]);
      });
    }, 250);
    return () => {
      window.clearTimeout(Qe), be.abort();
    };
  }, [t, D, y]), Ae(() => {
    if (!y || !re) {
      Se(null);
      return;
    }
    const J = new AbortController();
    return t.explainAccess(y.id, { user_id: re, action: "knowledge.pages.get", proposed_role: _e }, J.signal).then((be) => {
      J.signal.aborted || Se(be);
    }).catch(() => {
      J.signal.aborted || Se(null);
    }), () => J.abort();
  }, [t, _e, y, re]);
  async function St(J) {
    if (!(En.current || Ne)) {
      En.current = !0, B(!0), Q(""), pe("");
      try {
        await J(AbortSignal.timeout(6e4));
      } catch (be) {
        Q(n(be));
      } finally {
        En.current = !1, B(!1), x((be) => be + 1);
      }
    }
  }
  function Zt(J, be) {
    k(J.id), C(J), W([""]), de([""]), pe(be);
  }
  async function kr(J, be) {
    const Qe = J === "personal" ? "个人知识库" : E.trim();
    if (!Qe) return;
    const ae = Vn.current;
    if (ae && (ae.kind !== J || ae.name !== Qe)) throw Error("上次创建结果待确认；重试时需保持资料库名称不变。");
    const Qt = ae || { kind: J, name: Qe, clientID: crypto.randomUUID() };
    Vn.current = Qt;
    const Pe = await t.createLibrary(Qt, be);
    Vn.current = null, F(""), Zt(Pe, J === "personal" ? "个人知识库已创建。" : "团队知识库已创建，当前只有你一位成员。");
  }
  async function vr(J) {
    y && Zt(await t.updateLibrary(y.id, { name: v.trim(), description: fe, archived: y.archived, expectedRevision: y.revision }, J), "资料库设置已保存。");
  }
  async function Ts(J) {
    y && Zt(await t.setLibraryArchived(y.id, !y.archived, y.revision, J), y.archived ? "资料库已恢复。" : "资料库已归档。");
  }
  async function Qr(J) {
    !y || !re.trim() || (Zt(await t.setMember(y.id, re.trim(), _e, ke?.revision ?? y.revision, J), "成员角色已保存，后续访问使用新权限。"), we(""), j(""), O([]), Se(null));
  }
  async function ne(J) {
    !y || !xe || (Zt(await t.removeMember(y.id, xe, ke?.revision ?? y.revision, J), "成员已移出资料库。"), ze(""));
  }
  async function et(J) {
    if (!y || !Ge.trim()) return;
    const be = Ge.trim(), [Qe] = await t.resolveOrganizationPrincipals([be], J);
    if (!Qe || Qe.organization_id !== be || Qe.status !== "active") throw Error("组织不存在或已停用。请输入 Identity 中的有效组织 ID。");
    Zt(await t.setOrganizationMember(y.id, be, w, H?.revision ?? y.revision, J), "组织角色已保存，后续访问按 Identity 实时组织归属计算。"), oe((ae) => ({ ...ae, [be]: Qe })), Re("");
  }
  async function Y(J) {
    !y || !X || (Zt(await t.removeOrganizationMember(y.id, X, H?.revision ?? y.revision, J), "组织已移出知识库，相关页面授权和在线会话已撤销。"), M(""));
  }
  function dt(J) {
    k(J.id), W([""]), de([""]), Ue(null), it("content"), Sn(null), Jn(null), In(!1);
  }
  const Fs = ui((J) => Jn(J ? { pageID: J.id, title: J.title } : null), []), jr = ui((J) => {
    Ue((be) => ({ pageID: J.page_id, mode: "read", location: { kind: "page" }, revision: (be?.revision || 0) + 1 })), it("content");
  }, []), qo = ui(() => In(!1), []);
  function Ho(J) {
    return /* @__PURE__ */ u("button", { "aria-current": _ === J.id ? "true" : void 0, disabled: Be, onClick: () => dt(J), children: [
      /* @__PURE__ */ c(Ln, { size: 18 }),
      /* @__PURE__ */ u("span", { children: [
        /* @__PURE__ */ c("strong", { children: J.name }),
        /* @__PURE__ */ u("small", { children: [
          J.kind === "personal" ? "仅自己可见" : `${ri[J.role] || J.role}权限`,
          J.archived ? " · 已归档" : ""
        ] })
      ] })
    ] }, J.id);
  }
  return /* @__PURE__ */ u("div", { className: `managed-library-browser${l === "personal" ? " is-personal" : ""}`, children: [
    /* @__PURE__ */ u("aside", { className: "managed-library-list", children: [
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ c("h2", { children: l === "personal" ? "个人知识库" : l === "shared" ? "团队知识库" : "知识库" }),
        /* @__PURE__ */ c(te, { "aria-label": "刷新知识库", disabled: Be || z, onClick: () => x((J) => J + 1), children: /* @__PURE__ */ c(lt, { size: 14 }) })
      ] }),
      (_r || $r) && /* @__PURE__ */ u("div", { className: "knowledge-library-create", children: [
        _r && /* @__PURE__ */ u(te, { disabled: Be, onClick: () => {
          St((J) => kr("personal", J));
        }, children: [
          /* @__PURE__ */ c(Ln, { size: 15 }),
          "创建个人知识库"
        ] }),
        $r && /* @__PURE__ */ u("div", { children: [
          /* @__PURE__ */ c("input", { "aria-label": "新团队知识库名称", maxLength: 128, value: E, disabled: Be, onChange: (J) => F(J.target.value), placeholder: "新团队知识库名称" }),
          /* @__PURE__ */ c(te, { "aria-label": "创建团队知识库", disabled: Be || !E.trim(), onClick: () => {
            St((J) => kr("shared", J));
          }, children: /* @__PURE__ */ c(ro, { size: 15 }) })
        ] })
      ] }),
      y && !b.items.some((J) => J.id === y.id) && /* @__PURE__ */ u("button", { "aria-current": "true", disabled: Be, children: [
        /* @__PURE__ */ c(Ln, { size: 18 }),
        /* @__PURE__ */ u("span", { children: [
          /* @__PURE__ */ c("strong", { children: y.name }),
          /* @__PURE__ */ c("small", { children: "当前知识库 · 不在本页" })
        ] })
      ] }),
      z ? /* @__PURE__ */ c("p", { className: "knowledge-subtle", children: "正在读取知识库…" }) : Kn.length ? Kn.map(Ho) : /* @__PURE__ */ c("p", { className: "knowledge-library-group-empty", children: l === "personal" ? "尚未创建个人知识库" : l === "shared" ? "尚未加入团队知识库" : "暂无可访问的知识库" }),
      (p.length > 1 || !b.complete) && /* @__PURE__ */ u("nav", { className: "knowledge-pagination", children: [
        /* @__PURE__ */ c(te, { disabled: Be || z || p.length === 1, onClick: () => {
          k(""), g((J) => J.slice(0, -1));
        }, children: "上一页" }),
        /* @__PURE__ */ c(te, { disabled: Be || z || !b.next_after, onClick: () => {
          k(""), g((J) => [...J, b.next_after]);
        }, children: "下一页" })
      ] }),
      U && /* @__PURE__ */ c("p", { role: "alert", className: "knowledge-error", children: U })
    ] }),
    /* @__PURE__ */ u("section", { className: "managed-library-content", children: [
      K && /* @__PURE__ */ c("p", { role: "status", className: "knowledge-notice", children: K }),
      y ? /* @__PURE__ */ u(xt, { children: [
        /* @__PURE__ */ u(te, { className: "knowledge-quick-open-trigger", title: "快速打开页面（⌘/Ctrl + K）", onClick: () => In(!0), children: [
          /* @__PURE__ */ c(mn, { size: 14 }),
          "快速打开",
          /* @__PURE__ */ c("kbd", { children: "⌘K" })
        ] }),
        /* @__PURE__ */ c("div", { className: `knowledge-library-surface${ft === "search" ? " is-search" : " is-pages"}`, children: ft === "search" ? /* @__PURE__ */ c(V1, { client: t, formatError: n, library: y, currentUserID: e, initialQuery: d, subtreeRoot: Cn, onOpen: (J) => {
          Ue((be) => ({ pageID: J.page_id, mode: J.publication_status === "unpublished" ? "edit" : "read", location: J.location, revision: (be?.revision || 0) + 1 })), it("content");
        } }, `${y.id}:${h}`) : /* @__PURE__ */ c(Q1, { client: t, library: y, currentUserID: e, disabled: Be, formatError: n, embedded: !0, initialPageID: wt?.pageID || (y.id === r ? i : ""), initialBlockID: !wt && y.id === r ? s : void 0, initialSearchLocation: wt?.location, initialPageMode: wt?.mode || (y.id === r ? a : "read"), onSelectionChange: Fs, onManage: y.role === "manager" ? () => Sn("manage") : void 0 }, `${y.id}:${wt?.revision || 0}`) }),
        /* @__PURE__ */ c(K1, { client: t, library: y, open: It, onClose: qo, onOpen: jr }),
        Ur === "manage" && y.role === "manager" && wi(/* @__PURE__ */ c("div", { className: "knowledge-modal-backdrop", role: "presentation", onMouseDown: (J) => {
          J.target === J.currentTarget && !Be && Sn(null);
        }, children: /* @__PURE__ */ u("section", { className: "knowledge-manager-dialog knowledge-library-management-dialog", role: "dialog", "aria-modal": "true", "aria-label": "知识库管理", children: [
          /* @__PURE__ */ u("header", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ u("h2", { children: [
                "管理“",
                y.name,
                "”"
              ] }),
              /* @__PURE__ */ c("p", { children: "维护知识库信息、成员权限与外部内容连接。" })
            ] }),
            /* @__PURE__ */ c(te, { "aria-label": "关闭知识库管理", disabled: Be, onClick: () => Sn(null), children: /* @__PURE__ */ c(Fn, { size: 17 }) })
          ] }),
          /* @__PURE__ */ u("div", { className: "knowledge-dialog-scroll knowledge-management-sections", children: [
            /* @__PURE__ */ u("section", { className: "knowledge-settings", children: [
              /* @__PURE__ */ c("header", { children: /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ c("h3", { children: "基本信息" }),
                /* @__PURE__ */ c("p", { children: "名称和说明会展示给所有知识库成员。" })
              ] }) }),
              /* @__PURE__ */ u("div", { className: "knowledge-form-grid", children: [
                /* @__PURE__ */ u("label", { children: [
                  "名称",
                  /* @__PURE__ */ c("input", { value: v, maxLength: 128, disabled: Be, onChange: (J) => T(J.target.value) })
                ] }),
                /* @__PURE__ */ u("label", { children: [
                  "说明",
                  /* @__PURE__ */ c("textarea", { value: fe, maxLength: 1024, disabled: Be, onChange: (J) => Z(J.target.value) })
                ] })
              ] }),
              /* @__PURE__ */ u("div", { className: "knowledge-actions", children: [
                /* @__PURE__ */ c(te, { className: "primary", disabled: Be || !v.trim(), onClick: () => {
                  St(vr);
                }, children: "保存信息" }),
                /* @__PURE__ */ c(te, { className: y.archived ? void 0 : "danger", disabled: Be, onClick: () => {
                  St(Ts);
                }, children: y.archived ? "恢复知识库" : "归档知识库" })
              ] })
            ] }),
            y.kind === "shared" && /* @__PURE__ */ u("section", { className: "knowledge-members", children: [
              /* @__PURE__ */ c("header", { children: /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ c("h3", { children: "成员与角色" }),
                /* @__PURE__ */ c("p", { children: "阅读者可查看与评论，编辑者可维护内容，管理者负责成员及配置。至少保留一位管理者。" })
              ] }) }),
              /* @__PURE__ */ c("div", { className: "knowledge-member-list", children: ke?.items.map((J) => {
                const be = $[J.user_id];
                return /* @__PURE__ */ u("div", { className: "knowledge-member", children: [
                  /* @__PURE__ */ c("span", { className: "knowledge-member-avatar", "aria-hidden": "true", children: (be?.display_name || "?").slice(0, 1) }),
                  /* @__PURE__ */ u("span", { children: [
                    be?.display_name || "账号不可用",
                    /* @__PURE__ */ u("small", { children: [
                      be?.email || J.user_id,
                      " · ",
                      ri[J.role]
                    ] })
                  ] }),
                  /* @__PURE__ */ c(te, { disabled: Be, onClick: () => {
                    we(J.user_id), j(be?.display_name || J.user_id), Ce(J.role), ze("");
                  }, children: "调整" }),
                  /* @__PURE__ */ c(te, { className: "danger", disabled: Be, onClick: () => ze(J.user_id), children: "移除" })
                ] }, J.user_id);
              }) }),
              ke && (ge.length > 1 || !ke.complete) && /* @__PURE__ */ u("nav", { className: "knowledge-pagination", children: [
                /* @__PURE__ */ c(te, { disabled: Be || ge.length === 1, onClick: () => W((J) => J.slice(0, -1)), children: "上一页" }),
                /* @__PURE__ */ c(te, { disabled: Be || !ke.next_after, onClick: () => W((J) => [...J, ke.next_after]), children: "下一页" })
              ] }),
              /* @__PURE__ */ u("div", { className: "knowledge-member-editor", children: [
                /* @__PURE__ */ u("label", { children: [
                  "搜索工作区成员",
                  /* @__PURE__ */ c("input", { value: D, maxLength: 255, disabled: Be, onChange: (J) => {
                    j(J.target.value), we("");
                  }, placeholder: "输入姓名或邮箱" })
                ] }),
                le.length > 0 && /* @__PURE__ */ c("div", { className: "knowledge-principal-results", role: "listbox", children: le.map((J) => /* @__PURE__ */ u("button", { role: "option", "aria-selected": re === J.user_id, onClick: () => {
                  we(J.user_id), j(J.display_name || J.email || J.user_id), O([]);
                }, children: [
                  J.avatar_url ? /* @__PURE__ */ c("img", { src: J.avatar_url, alt: "" }) : /* @__PURE__ */ c("span", { "aria-hidden": "true", children: (J.display_name || "?").slice(0, 1) }),
                  /* @__PURE__ */ c("strong", { children: J.display_name || J.user_id }),
                  /* @__PURE__ */ c("small", { children: J.email })
                ] }, J.user_id)) }),
                /* @__PURE__ */ u("label", { children: [
                  "角色",
                  /* @__PURE__ */ c("select", { value: _e, disabled: Be, onChange: (J) => Ce(J.target.value), children: Object.entries(ri).map(([J, be]) => /* @__PURE__ */ c("option", { value: J, children: be }, J)) })
                ] }),
                /* @__PURE__ */ c(te, { className: "primary", disabled: Be || !re, onClick: () => {
                  St(Qr);
                }, children: "保存成员角色" })
              ] }),
              ce && /* @__PURE__ */ u("div", { className: "knowledge-access-preview", children: [
                /* @__PURE__ */ c("strong", { children: "邀请前访问预览" }),
                /* @__PURE__ */ u("p", { children: [
                  "Identity 功能权限：",
                  ce.identity.allowed ? "允许" : "拒绝",
                  "；拟授予知识库角色：",
                  ri[_e],
                  "；影响 ",
                  ce.impact_pages,
                  " 个活动页面。"
                ] }),
                /* @__PURE__ */ u("p", { children: [
                  "最终页面阅读：",
                  ce.final.allowed ? "允许" : "拒绝",
                  "。页面权限继承自知识库，不存在前端自算 ACL。"
                ] })
              ] }),
              xe && /* @__PURE__ */ u("div", { className: "knowledge-confirm", children: [
                /* @__PURE__ */ u("p", { children: [
                  "将“",
                  $[xe]?.display_name || "账号不可用",
                  "”移出“",
                  y.name,
                  "”？该成员将失去知识库访问权限。"
                ] }),
                /* @__PURE__ */ u("div", { className: "knowledge-actions", children: [
                  /* @__PURE__ */ c(te, { className: "danger", disabled: Be, onClick: () => {
                    St(ne);
                  }, children: "确认移除" }),
                  /* @__PURE__ */ c(te, { disabled: Be, onClick: () => ze(""), children: "保留成员" })
                ] })
              ] })
            ] }),
            y.kind === "shared" && /* @__PURE__ */ u("section", { className: "knowledge-members knowledge-organization-members", children: [
              /* @__PURE__ */ c("header", { children: /* @__PURE__ */ u("div", { children: [
                /* @__PURE__ */ c("h3", { children: "组织与角色" }),
                /* @__PURE__ */ c("p", { children: "Knowledge 只保存 Identity 组织 ID 与知识库角色；成员归属、组织名称和停用状态始终从 Identity 实时读取。" })
              ] }) }),
              /* @__PURE__ */ c("div", { className: "knowledge-member-list", children: H?.items.map((J) => {
                const be = ue[J.organization_id];
                return /* @__PURE__ */ u("div", { className: "knowledge-member", children: [
                  /* @__PURE__ */ c("span", { className: "knowledge-member-avatar", "aria-hidden": "true", children: (be?.display_name || "组").slice(0, 1) }),
                  /* @__PURE__ */ u("span", { children: [
                    be?.display_name || "组织不可用",
                    /* @__PURE__ */ u("small", { children: [
                      J.organization_id,
                      " · ",
                      be?.node_type || "组织",
                      " · ",
                      ri[J.role]
                    ] })
                  ] }),
                  /* @__PURE__ */ c(te, { disabled: Be, onClick: () => {
                    Re(J.organization_id), ie(J.role), M("");
                  }, children: "调整" }),
                  /* @__PURE__ */ c(te, { className: "danger", disabled: Be, onClick: () => M(J.organization_id), children: "移除" })
                ] }, J.organization_id);
              }) }),
              H && (me.length > 1 || !H.complete) && /* @__PURE__ */ u("nav", { className: "knowledge-pagination", children: [
                /* @__PURE__ */ c(te, { disabled: Be || me.length === 1, onClick: () => de((J) => J.slice(0, -1)), children: "上一页" }),
                /* @__PURE__ */ c(te, { disabled: Be || !H.next_after, onClick: () => de((J) => [...J, H.next_after]), children: "下一页" })
              ] }),
              /* @__PURE__ */ u("div", { className: "knowledge-member-editor", children: [
                /* @__PURE__ */ u("label", { children: [
                  "Identity 组织 ID",
                  /* @__PURE__ */ c("input", { value: Ge, maxLength: 255, disabled: Be, onChange: (J) => Re(J.target.value), placeholder: "输入准确的组织 ID" })
                ] }),
                /* @__PURE__ */ u("label", { children: [
                  "角色",
                  /* @__PURE__ */ c("select", { value: w, disabled: Be, onChange: (J) => ie(J.target.value), children: Object.entries(ri).map(([J, be]) => /* @__PURE__ */ c("option", { value: J, children: be }, J)) })
                ] }),
                /* @__PURE__ */ c(te, { className: "primary", disabled: Be || !Ge.trim(), onClick: () => {
                  St(et);
                }, children: "验证并保存组织角色" })
              ] }),
              X && /* @__PURE__ */ u("div", { className: "knowledge-confirm", children: [
                /* @__PURE__ */ u("p", { children: [
                  "将“",
                  ue[X]?.display_name || X,
                  "”移出“",
                  y.name,
                  "”？该组织成员将失去知识库访问，相关页面授权会同时删除。"
                ] }),
                /* @__PURE__ */ u("div", { className: "knowledge-actions", children: [
                  /* @__PURE__ */ c(te, { className: "danger", disabled: Be, onClick: () => {
                    St(Y);
                  }, children: "确认移除" }),
                  /* @__PURE__ */ c(te, { disabled: Be, onClick: () => M(""), children: "保留组织" })
                ] })
              ] })
            ] }),
            y.sources_manageable && /* @__PURE__ */ c(Tb, { client: t, library: y, disabled: R, formatError: n, onBusyChange: je, onBound: (J) => {
              C(J), x((be) => be + 1);
            } }),
            U && /* @__PURE__ */ c("p", { role: "alert", className: "knowledge-error", children: U })
          ] })
        ] }) }), window.document.body)
      ] }) : z ? null : /* @__PURE__ */ u(hi, { children: [
        /* @__PURE__ */ c(Pb, { size: 32 }),
        /* @__PURE__ */ c("h3", { children: Kn.length > 0 ? "请选择知识库" : l === "personal" ? "还没有个人知识库" : "还没有可访问的团队知识库" }),
        /* @__PURE__ */ c("p", { children: l === "personal" ? "打开个人知识库后，可在自己的空间内检索、编辑和整理内容。" : "创建团队知识库，或请团队管理员将你添加为成员。" }),
        _r && /* @__PURE__ */ u(te, { className: "primary", disabled: Be, onClick: () => {
          St((J) => kr("personal", J));
        }, children: [
          /* @__PURE__ */ c(Ln, { size: 15 }),
          "创建个人知识库"
        ] })
      ] })
    ] })
  ] });
}
function $C({ client: t, formatError: e = Es, onClose: n }) {
  const [r, i] = P("personal");
  return wi(/* @__PURE__ */ c("div", { className: "knowledge-modal-backdrop", role: "presentation", children: /* @__PURE__ */ u("section", { className: "knowledge-manager-dialog", role: "dialog", "aria-modal": "true", "aria-label": "知识库", children: [
    /* @__PURE__ */ u("header", { children: [
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ c("h2", { children: "知识库" }),
        /* @__PURE__ */ c("p", { children: "个人知识库仅自己可见；团队知识库按成员角色共同维护。" })
      ] }),
      /* @__PURE__ */ c(te, { "aria-label": "关闭", onClick: n, children: /* @__PURE__ */ c(Fn, { size: 17 }) })
    ] }),
    /* @__PURE__ */ u("div", { className: "knowledge-workspace-tabs", role: "tablist", "aria-label": "知识库范围", children: [
      /* @__PURE__ */ u("button", { role: "tab", "aria-selected": r === "personal", onClick: () => i("personal"), children: [
        /* @__PURE__ */ c(Ln, { size: 17 }),
        /* @__PURE__ */ c("span", { children: "个人知识库" })
      ] }),
      /* @__PURE__ */ u("button", { role: "tab", "aria-selected": r === "shared", onClick: () => i("shared"), children: [
        /* @__PURE__ */ c(ds, { size: 17 }),
        /* @__PURE__ */ c("span", { children: "团队知识库" })
      ] })
    ] }),
    /* @__PURE__ */ c(im, { client: t, formatError: e, libraryKind: r }, r)
  ] }) }), window.document.body);
}
function Rf(t) {
  return typeof t == "object" && t !== null && "code" in t && typeof t.code == "string" ? t.code : "";
}
function QC({ client: t, shareID: e, pageID: n, formatError: r }) {
  const [i, s] = P(null), [a, l] = P(""), [d, h] = P(!0), [b, m] = P(!1), [p, g] = P(""), _ = De(0);
  async function k(N) {
    if (!t.authorizePageShareContentOperation) throw Error("当前前端未启用受控分享内容保护。");
    await t.authorizePageShareContentOperation(e, n, N, AbortSignal.timeout(3e4));
  }
  async function y(N) {
    if (!t.readPageShare) throw Error("当前前端未启用受控分享读取能力。");
    const R = await t.readPageShare(e, n, N);
    s(R), m(!1), g("");
  }
  async function C(N, R) {
    if (!t.redeemPageShare) throw Error("当前前端未启用受控分享兑换能力。");
    await t.redeemPageShare(e, N, R), await y(R);
  }
  Ae(() => {
    const N = new AbortController(), R = AbortSignal.any([N.signal, AbortSignal.timeout(3e4)]);
    return h(!0), g(""), s(null), m(!1), y(R).catch(async (B) => {
      if (!R.aborted) {
        if (Rf(B) !== "knowledge.page_share_redeem_required") throw B;
        try {
          await C("", R);
        } catch (U) {
          if (Rf(U) === "knowledge.page_share_password_invalid") {
            m(!0);
            return;
          }
          throw U;
        }
      }
    }).catch((B) => {
      R.aborted || g(r(B));
    }).finally(() => {
      R.aborted || h(!1);
    }), () => N.abort();
  }, [t, r, n, e]), Ae(() => {
    const N = () => {
      Date.now() <= _.current || (document.body.classList.add("knowledge-print-blocked"), g("请使用 Ctrl/⌘ + P，由服务端重新校验分享与打印策略后再打印。"));
    }, R = () => {
      _.current = 0, document.body.classList.remove("knowledge-print-blocked");
    }, B = (U) => {
      !(U.ctrlKey || U.metaKey) || U.altKey || U.key.toLowerCase() !== "p" || !i || (U.preventDefault(), k("print").then(() => {
        _.current = Date.now() + 5e3, window.print();
      }, (Q) => g(r(Q))));
    };
    return window.addEventListener("beforeprint", N), window.addEventListener("afterprint", R), window.addEventListener("keydown", B, !0), () => {
      window.removeEventListener("beforeprint", N), window.removeEventListener("afterprint", R), window.removeEventListener("keydown", B, !0), document.body.classList.remove("knowledge-print-blocked");
    };
  }, [t, r, n, e, i]);
  async function S(N) {
    const R = window.getSelection()?.toString() || "";
    if (R) {
      N.preventDefault();
      try {
        await k("copy"), await navigator.clipboard.writeText(R);
      } catch (B) {
        g(r(B));
      }
    }
  }
  async function x() {
    if (!(!a || d)) {
      h(!0), g("");
      try {
        await C(a, AbortSignal.timeout(3e4));
      } catch (N) {
        g(r(N));
      } finally {
        h(!1);
      }
    }
  }
  if (d && !i) return /* @__PURE__ */ u("main", { className: "knowledge-shared-state", role: "status", children: [
    /* @__PURE__ */ c(_i, { size: 28 }),
    /* @__PURE__ */ c("h1", { children: "正在核对分享权限…" }),
    /* @__PURE__ */ c("p", { children: "服务端正在确认登录身份、分享状态和有效期。" })
  ] });
  if (b && !i) return /* @__PURE__ */ u("main", { className: "knowledge-shared-state", children: [
    /* @__PURE__ */ c(zb, { size: 28 }),
    /* @__PURE__ */ c("h1", { children: "此分享需要访问密码" }),
    /* @__PURE__ */ c("p", { children: "密码只用于本次登录账号的服务端兑换，不会写入分享链接。" }),
    /* @__PURE__ */ u("label", { children: [
      "访问密码",
      /* @__PURE__ */ c("input", { autoFocus: !0, type: "password", minLength: 8, maxLength: 72, value: a, onChange: (N) => l(N.target.value), onKeyDown: (N) => {
        N.key === "Enter" && x();
      } })
    ] }),
    p && /* @__PURE__ */ c("p", { className: "knowledge-error", role: "alert", children: p }),
    /* @__PURE__ */ c(te, { className: "primary", disabled: d || a.length < 8, onClick: () => {
      x();
    }, children: d ? "正在验证…" : "验证并打开" })
  ] });
  if (!i?.view.published) return /* @__PURE__ */ u("main", { className: "knowledge-shared-state", children: [
    /* @__PURE__ */ c(jn, { size: 28 }),
    /* @__PURE__ */ c("h1", { children: "分享当前不可访问" }),
    /* @__PURE__ */ c("p", { children: p || "分享已撤销、已过期、账号不在允许范围，或页面不再发布。" })
  ] });
  const z = i.view.published;
  return /* @__PURE__ */ u("main", { className: "knowledge-shared-page", children: [
    /* @__PURE__ */ c(Zg, { governance: i.view.governance }),
    /* @__PURE__ */ u("header", { children: [
      /* @__PURE__ */ c("span", { className: "knowledge-shared-page-icon", children: /* @__PURE__ */ c(Rt, { type: z.content_type, size: 20 }) }),
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ u("small", { children: [
          "受控分享 · ",
          Vt[z.content_type].label
        ] }),
        /* @__PURE__ */ c("h1", { children: z.title }),
        /* @__PURE__ */ c(Xg, { governance: i.view.governance }),
        /* @__PURE__ */ u("p", { children: [
          /* @__PURE__ */ c(Ua, { size: 13 }),
          "版本 ",
          z.version,
          " · 发布于 ",
          new Date(z.published_at).toLocaleString(),
          " · 分享有效至 ",
          new Date(i.share.expires_at).toLocaleString()
        ] })
      ] })
    ] }),
    /* @__PURE__ */ u("div", { className: "knowledge-shared-security", children: [
      /* @__PURE__ */ c(jn, { size: 15 }),
      /* @__PURE__ */ c("span", { children: "只读的已发布版本；每次打开都会重新核对账号、分享范围、有效期与撤销状态。" })
    ] }),
    /* @__PURE__ */ c("article", { className: "knowledge-page-readable typed-readable", onCopyCapture: (N) => {
      S(N);
    }, children: /* @__PURE__ */ c(di, { type: z.content_type, body: z.body.content, documentTitle: z.title, readOnly: !0, authorizeContentAction: k, onActionFeedback: g, onChange: () => {
    } }) })
  ] });
}
export {
  xi as $,
  Ya as A,
  te as B,
  CC as C,
  Sg as D,
  IC as E,
  _g as F,
  $v as G,
  BC as H,
  xC as I,
  RA as J,
  PC as K,
  gC as L,
  pC as M,
  dv as N,
  mC as O,
  lC as P,
  Fr as Q,
  Ap as R,
  _n as S,
  Ii as T,
  dC as U,
  f_ as V,
  cC as W,
  p_ as X,
  Ds as Y,
  Ni as Z,
  go as _,
  yC as a,
  kn as a0,
  ht as a1,
  Ww as a2,
  We as a3,
  sC as a4,
  Np as a5,
  xp as a6,
  aC as a7,
  co as a8,
  Me as a9,
  im as aA,
  $C as aB,
  u1 as aC,
  Q1 as aD,
  QC as aE,
  UC as aF,
  Pg as aG,
  c1 as aH,
  zg as aI,
  vA as aJ,
  yA as aK,
  IA as aL,
  cs as aM,
  hA as aN,
  zC as aO,
  oC as aa,
  iC as ab,
  An as ac,
  Cp as ad,
  s_ as ae,
  rC as af,
  Rs as ag,
  mt as ah,
  uv as ai,
  $o as aj,
  fv as ak,
  _C as al,
  SC as am,
  Eg as an,
  EC as ao,
  qv as ap,
  Qv as aq,
  DC as ar,
  NC as as,
  MC as at,
  nv as au,
  uC as av,
  pg as aw,
  fC as ax,
  hC as ay,
  o1 as az,
  kC as b,
  Iv as c,
  ko as d,
  AC as e,
  xv as f,
  Sv as g,
  vC as h,
  Nv as i,
  Dv as j,
  fc as k,
  pc as l,
  wC as m,
  Ev as n,
  za as o,
  bC as p,
  Ma as q,
  PA as r,
  E1 as s,
  S1 as t,
  TC as u,
  RC as v,
  I1 as w,
  FC as x,
  LC as y,
  OC as z
};
