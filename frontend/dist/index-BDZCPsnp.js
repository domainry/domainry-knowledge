import { jsx as d, jsxs as v, Fragment as at } from "react/jsx-runtime";
import { useRef as Be, useState as T, useEffect as ye, useMemo as ct, useCallback as Uc, lazy as Dt, Suspense as Oc } from "react";
import { createPortal as Wr } from "react-dom";
import { X as Xr, Download as xo, RefreshCw as $t, Upload as Pn, FileText as Tt, Eye as $c, RotateCcw as Hc, Trash2 as jc, Check as si, Link2 as va, BookOpen as Vt, Search as wi, Plus as Do, Settings as qc, ChevronDown as Gc, ChevronRight as _a, ArrowUp as Jc, ArrowDown as Vc, FilePlus2 as Wc, Pencil as Xc, Clock3 as Zc, MessageSquare as Kc, Activity as Ia, ListTree as Mo, ShieldCheck as Yc, Users as Fn, Copy as ed, MoreHorizontal as td, Cloud as rd, Wifi as Ca, Paperclip as nd, GitMerge as Ea, Save as Sa, Send as sd, GitBranch as id, Network as ad, Paintbrush as od, ListChecks as ld, Presentation as cd, FileSpreadsheet as dd, LayoutGrid as hd, Table2 as ud, FolderOpen as fd, FileSearch as Na } from "lucide-react";
function ce({ className: r = "", ...e }) {
  return /* @__PURE__ */ d("button", { className: `knowledge-button ${r}`.trim(), ...e });
}
function Lt({ children: r }) {
  return /* @__PURE__ */ d("div", { className: "knowledge-page-empty", children: r });
}
function er(r) {
  return r instanceof DOMException && r.name === "AbortError" ? "操作已取消。" : r instanceof Error && r.message ? r.message : "知识库暂时不可用，请稍后重试。";
}
function Sn(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(a) {
      a(i);
    });
  }
  return new (t || (t = Promise))(function(i, a) {
    function o(p) {
      try {
        h(n.next(p));
      } catch (b) {
        a(b);
      }
    }
    function l(p) {
      try {
        h(n.throw(p));
      } catch (b) {
        a(b);
      }
    }
    function h(p) {
      p.done ? i(p.value) : s(p.value).then(o, l);
    }
    h((n = n.apply(r, [])).next());
  });
}
class Te {
  constructor() {
    this.mutex = Promise.resolve();
  }
  lock() {
    let e = () => {
    };
    return this.mutex = this.mutex.then(() => new Promise(e)), new Promise((t) => {
      e = t;
    });
  }
  dispatch(e) {
    return Sn(this, void 0, void 0, function* () {
      const t = yield this.lock();
      try {
        return yield Promise.resolve(e());
      } finally {
        t();
      }
    });
  }
}
var Ts;
function gd() {
  return typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global;
}
const ii = gd(), Ls = (Ts = ii.Buffer) !== null && Ts !== void 0 ? Ts : null, pd = ii.TextEncoder ? new ii.TextEncoder() : null;
function Ro(r, e) {
  return (r & 15) + (r >> 6 | r >> 3 & 8) << 4 | (e & 15) + (e >> 6 | e >> 3 & 8);
}
function md(r, e) {
  const t = e.length >> 1;
  for (let n = 0; n < t; n++) {
    const s = n << 1;
    r[n] = Ro(e.charCodeAt(s), e.charCodeAt(s + 1));
  }
}
function bd(r, e) {
  if (r.length !== e.length * 2)
    return !1;
  for (let t = 0; t < e.length; t++) {
    const n = t << 1;
    if (e[t] !== Ro(r.charCodeAt(n), r.charCodeAt(n + 1)))
      return !1;
  }
  return !0;
}
const Ba = 87, xa = 48;
function Da(r, e, t) {
  let n = 0;
  for (let s = 0; s < t; s++) {
    let i = e[s] >>> 4;
    r[n++] = i > 9 ? i + Ba : i + xa, i = e[s] & 15, r[n++] = i > 9 ? i + Ba : i + xa;
  }
  return String.fromCharCode.apply(null, r);
}
const Ma = Ls !== null ? (r) => {
  if (typeof r == "string") {
    const e = Ls.from(r, "utf8");
    return new Uint8Array(e.buffer, e.byteOffset, e.length);
  }
  if (Ls.isBuffer(r))
    return new Uint8Array(r.buffer, r.byteOffset, r.length);
  if (ArrayBuffer.isView(r))
    return new Uint8Array(r.buffer, r.byteOffset, r.byteLength);
  throw new Error("Invalid data type!");
} : (r) => {
  if (typeof r == "string")
    return pd.encode(r);
  if (ArrayBuffer.isView(r))
    return new Uint8Array(r.buffer, r.byteOffset, r.byteLength);
  throw new Error("Invalid data type!");
}, Ra = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Fr = new Uint8Array(256);
for (let r = 0; r < Ra.length; r++)
  Fr[Ra.charCodeAt(r)] = r;
function Ad(r) {
  let e = Math.floor(r.length * 0.75);
  const t = r.length;
  return r[t - 1] === "=" && (e -= 1, r[t - 2] === "=" && (e -= 1)), e;
}
function wd(r) {
  const e = Ad(r), t = r.length, n = new Uint8Array(e);
  let s = 0;
  for (let i = 0; i < t; i += 4) {
    const a = Fr[r.charCodeAt(i)], o = Fr[r.charCodeAt(i + 1)], l = Fr[r.charCodeAt(i + 2)], h = Fr[r.charCodeAt(i + 3)];
    n[s] = a << 2 | o >> 4, s += 1, n[s] = (o & 15) << 4 | l >> 2, s += 1, n[s] = (l & 3) << 6 | h & 63, s += 1;
  }
  return n;
}
const pn = 16 * 1024, Dr = 4, yd = new Te(), Us = /* @__PURE__ */ new Map();
function kd(r, e) {
  return Sn(this, void 0, void 0, function* () {
    let t = null, n = null, s = !1;
    if (typeof WebAssembly > "u")
      throw new Error("WebAssembly is not supported in this environment!");
    const i = (z, x = 0) => {
      n.set(z, x);
    }, a = () => n, o = () => t.exports, l = (z) => {
      t.exports.Hash_SetMemorySize(z);
      const x = t.exports.Hash_GetBuffer(), U = t.exports.memory.buffer;
      n = new Uint8Array(U, x, z);
    }, h = () => new DataView(t.exports.memory.buffer).getUint32(t.exports.STATE_SIZE, !0), p = yd.dispatch(() => Sn(this, void 0, void 0, function* () {
      if (!Us.has(r.name)) {
        const x = wd(r.data), U = WebAssembly.compile(x);
        Us.set(r.name, U);
      }
      const z = yield Us.get(r.name);
      t = yield WebAssembly.instantiate(z, {
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
    })), b = () => Sn(this, void 0, void 0, function* () {
      t || (yield p);
      const z = t.exports.Hash_GetBuffer(), x = t.exports.memory.buffer;
      n = new Uint8Array(x, z, pn);
    }), m = (z = null) => {
      s = !0, t.exports.Hash_Init(z);
    }, u = (z) => {
      let x = 0;
      for (; x < z.length; ) {
        const U = z.subarray(x, x + pn);
        x += U.length, n.set(U), t.exports.Hash_Update(U.length);
      }
    }, y = (z) => {
      if (!s)
        throw new Error("update() called before init()");
      const x = Ma(z);
      u(x);
    }, A = new Uint8Array(e * 2), w = (z, x = null) => {
      if (!s)
        throw new Error("digest() called before init()");
      return s = !1, t.exports.Hash_Final(x), z === "binary" ? n.slice(0, e) : Da(A, n, e);
    }, k = () => {
      if (!s)
        throw new Error("save() can only be called after init() and before digest()");
      const z = t.exports.Hash_GetState(), x = h(), U = t.exports.memory.buffer, Q = new Uint8Array(U, z, x), $ = new Uint8Array(Dr + x);
      return md($, r.hash), $.set(Q, Dr), $;
    }, _ = (z) => {
      if (!(z instanceof Uint8Array))
        throw new Error("load() expects an Uint8Array generated by save()");
      const x = t.exports.Hash_GetState(), U = h(), Q = Dr + U, $ = t.exports.memory.buffer;
      if (z.length !== Q)
        throw new Error(`Bad state length (expected ${Q} bytes, got ${z.length})`);
      if (!bd(r.hash, z.subarray(0, Dr)))
        throw new Error("This state was written by an incompatible hash implementation");
      const X = z.subarray(Dr);
      new Uint8Array($, x, U).set(X), s = !0;
    }, B = (z) => typeof z == "string" ? z.length < pn / 4 : z.byteLength < pn;
    let C = B;
    switch (r.name) {
      case "argon2":
      case "scrypt":
        C = () => !0;
        break;
      case "blake2b":
      case "blake2s":
        C = (z, x) => x <= 512 && B(z);
        break;
      case "blake3":
        C = (z, x) => x === 0 && B(z);
        break;
      case "xxhash64":
      // cannot simplify
      case "xxhash3":
      case "xxhash128":
      case "crc64":
        C = () => !1;
        break;
    }
    const S = (z, x = null, U = null) => {
      if (!C(z, x))
        return m(x), y(z), w("hex", U);
      const Q = Ma(z);
      return n.set(Q), t.exports.Hash_Calculate(Q.length, x, U), Da(A, n, e);
    };
    return yield b(), {
      getMemory: a,
      writeMemory: i,
      getExports: o,
      setMemorySize: l,
      init: m,
      update: y,
      digest: w,
      save: k,
      load: _,
      calculate: S,
      hashLength: e
    };
  });
}
new Te();
new Te();
new Te();
new Te();
new Te();
new Te();
new Te();
new Te();
new Te();
new Te();
new Te();
var vd = "sha256", _d = "AGFzbQEAAAABEQRgAAF/YAF/AGAAAGACf38AAwgHAAEBAQIAAwUEAQECAgYOAn8BQfCJBQt/AEGACAsHcAgGbWVtb3J5AgAOSGFzaF9HZXRCdWZmZXIAAAlIYXNoX0luaXQAAQtIYXNoX1VwZGF0ZQACCkhhc2hfRmluYWwABA1IYXNoX0dldFN0YXRlAAUOSGFzaF9DYWxjdWxhdGUABgpTVEFURV9TSVpFAwEKnEoHBQBBgAkLnQEAQQBCADcDwIkBQQBBHEEgIABB4AFGIgAbNgLoiQFBAEKnn+anxvST/b5/Qquzj/yRo7Pw2wAgABs3A+CJAUEAQrGWgP6fooWs6ABC/6S5iMWR2oKbfyAAGzcD2IkBQQBCl7rDg5Onlod3QvLmu+Ojp/2npX8gABs3A9CJAUEAQti9loj8oLW+NkLnzKfQ1tDrs7t/IAAbNwPIiQEL7wICAX4Gf0EAQQApA8CJASIBIACtfDcDwIkBAkACQAJAIAGnQT9xIgINAEGACSEDDAELAkBBwAAgAmsiBCAAIAQgAEkbIgNFDQAgA0EDcSEFIAJBgIkBaiEGQQAhAgJAIANBBEkNACADQfwAcSEHQQAhAgNAIAYgAmoiAyACQYAJai0AADoAACADQQFqIAJBgQlqLQAAOgAAIANBAmogAkGCCWotAAA6AAAgA0EDaiACQYMJai0AADoAACAHIAJBBGoiAkcNAAsLIAVFDQADQCAGIAJqIAJBgAlqLQAAOgAAIAJBAWohAiAFQX9qIgUNAAsLIAAgBEkNAUGAiQEQAyAAIARrIQAgBEGACWohAwsCQCAAQcAASQ0AA0AgAxADIANBwABqIQMgAEFAaiIAQT9LDQALCyAARQ0AQQAhAkEAIQUDQCACQYCJAWogAyACai0AADoAACACQQFqIQIgACAFQQFqIgVB/wFxSw0ACwsLoz4BRX9BACAAKAI8IgFBGHQgAUGA/gNxQQh0ciABQQh2QYD+A3EgAUEYdnJyIgFBGXcgAUEOd3MgAUEDdnMgACgCOCICQRh0IAJBgP4DcUEIdHIgAkEIdkGA/gNxIAJBGHZyciICaiAAKAIgIgNBGHQgA0GA/gNxQQh0ciADQQh2QYD+A3EgA0EYdnJyIgRBGXcgBEEOd3MgBEEDdnMgACgCHCIDQRh0IANBgP4DcUEIdHIgA0EIdkGA/gNxIANBGHZyciIFaiAAKAIEIgNBGHQgA0GA/gNxQQh0ciADQQh2QYD+A3EgA0EYdnJyIgZBGXcgBkEOd3MgBkEDdnMgACgCACIDQRh0IANBgP4DcUEIdHIgA0EIdkGA/gNxIANBGHZyciIHaiAAKAIkIgNBGHQgA0GA/gNxQQh0ciADQQh2QYD+A3EgA0EYdnJyIghqIAJBD3cgAkENd3MgAkEKdnNqIgNqIAAoAhgiCUEYdCAJQYD+A3FBCHRyIAlBCHZBgP4DcSAJQRh2cnIiCkEZdyAKQQ53cyAKQQN2cyAAKAIUIglBGHQgCUGA/gNxQQh0ciAJQQh2QYD+A3EgCUEYdnJyIgtqIAJqIAAoAhAiCUEYdCAJQYD+A3FBCHRyIAlBCHZBgP4DcSAJQRh2cnIiDEEZdyAMQQ53cyAMQQN2cyAAKAIMIglBGHQgCUGA/gNxQQh0ciAJQQh2QYD+A3EgCUEYdnJyIg1qIAAoAjAiCUEYdCAJQYD+A3FBCHRyIAlBCHZBgP4DcSAJQRh2cnIiDmogACgCCCIJQRh0IAlBgP4DcUEIdHIgCUEIdkGA/gNxIAlBGHZyciIPQRl3IA9BDndzIA9BA3ZzIAZqIAAoAigiCUEYdCAJQYD+A3FBCHRyIAlBCHZBgP4DcSAJQRh2cnIiEGogAUEPdyABQQ13cyABQQp2c2oiCUEPdyAJQQ13cyAJQQp2c2oiEUEPdyARQQ13cyARQQp2c2oiEkEPdyASQQ13cyASQQp2c2oiE2ogACgCNCIUQRh0IBRBgP4DcUEIdHIgFEEIdkGA/gNxIBRBGHZyciIVQRl3IBVBDndzIBVBA3ZzIA5qIBJqIAAoAiwiAEEYdCAAQYD+A3FBCHRyIABBCHZBgP4DcSAAQRh2cnIiFkEZdyAWQQ53cyAWQQN2cyAQaiARaiAIQRl3IAhBDndzIAhBA3ZzIARqIAlqIAVBGXcgBUEOd3MgBUEDdnMgCmogAWogC0EZdyALQQ53cyALQQN2cyAMaiAVaiANQRl3IA1BDndzIA1BA3ZzIA9qIBZqIANBD3cgA0ENd3MgA0EKdnNqIhRBD3cgFEENd3MgFEEKdnNqIhdBD3cgF0ENd3MgF0EKdnNqIhhBD3cgGEENd3MgGEEKdnNqIhlBD3cgGUENd3MgGUEKdnNqIhpBD3cgGkENd3MgGkEKdnNqIhtBD3cgG0ENd3MgG0EKdnNqIhxBGXcgHEEOd3MgHEEDdnMgAkEZdyACQQ53cyACQQN2cyAVaiAYaiAOQRl3IA5BDndzIA5BA3ZzIBZqIBdqIBBBGXcgEEEOd3MgEEEDdnMgCGogFGogE0EPdyATQQ13cyATQQp2c2oiHUEPdyAdQQ13cyAdQQp2c2oiHkEPdyAeQQ13cyAeQQp2c2oiH2ogE0EZdyATQQ53cyATQQN2cyAYaiADQRl3IANBDndzIANBA3ZzIAFqIBlqIB9BD3cgH0ENd3MgH0EKdnNqIiBqIBJBGXcgEkEOd3MgEkEDdnMgF2ogH2ogEUEZdyARQQ53cyARQQN2cyAUaiAeaiAJQRl3IAlBDndzIAlBA3ZzIANqIB1qIBxBD3cgHEENd3MgHEEKdnNqIiFBD3cgIUENd3MgIUEKdnNqIiJBD3cgIkENd3MgIkEKdnNqIiNBD3cgI0ENd3MgI0EKdnNqIiRqIBtBGXcgG0EOd3MgG0EDdnMgHmogI2ogGkEZdyAaQQ53cyAaQQN2cyAdaiAiaiAZQRl3IBlBDndzIBlBA3ZzIBNqICFqIBhBGXcgGEEOd3MgGEEDdnMgEmogHGogF0EZdyAXQQ53cyAXQQN2cyARaiAbaiAUQRl3IBRBDndzIBRBA3ZzIAlqIBpqICBBD3cgIEENd3MgIEEKdnNqIiVBD3cgJUENd3MgJUEKdnNqIiZBD3cgJkENd3MgJkEKdnNqIidBD3cgJ0ENd3MgJ0EKdnNqIihBD3cgKEENd3MgKEEKdnNqIilBD3cgKUENd3MgKUEKdnNqIipBD3cgKkENd3MgKkEKdnNqIitBGXcgK0EOd3MgK0EDdnMgH0EZdyAfQQ53cyAfQQN2cyAbaiAnaiAeQRl3IB5BDndzIB5BA3ZzIBpqICZqIB1BGXcgHUEOd3MgHUEDdnMgGWogJWogJEEPdyAkQQ13cyAkQQp2c2oiLEEPdyAsQQ13cyAsQQp2c2oiLUEPdyAtQQ13cyAtQQp2c2oiLmogJEEZdyAkQQ53cyAkQQN2cyAnaiAgQRl3ICBBDndzICBBA3ZzIBxqIChqIC5BD3cgLkENd3MgLkEKdnNqIi9qICNBGXcgI0EOd3MgI0EDdnMgJmogLmogIkEZdyAiQQ53cyAiQQN2cyAlaiAtaiAhQRl3ICFBDndzICFBA3ZzICBqICxqICtBD3cgK0ENd3MgK0EKdnNqIjBBD3cgMEENd3MgMEEKdnNqIjFBD3cgMUENd3MgMUEKdnNqIjJBD3cgMkENd3MgMkEKdnNqIjNqICpBGXcgKkEOd3MgKkEDdnMgLWogMmogKUEZdyApQQ53cyApQQN2cyAsaiAxaiAoQRl3IChBDndzIChBA3ZzICRqIDBqICdBGXcgJ0EOd3MgJ0EDdnMgI2ogK2ogJkEZdyAmQQ53cyAmQQN2cyAiaiAqaiAlQRl3ICVBDndzICVBA3ZzICFqIClqIC9BD3cgL0ENd3MgL0EKdnNqIjRBD3cgNEENd3MgNEEKdnNqIjVBD3cgNUENd3MgNUEKdnNqIjZBD3cgNkENd3MgNkEKdnNqIjdBD3cgN0ENd3MgN0EKdnNqIjhBD3cgOEENd3MgOEEKdnNqIjlBD3cgOUENd3MgOUEKdnNqIjogOCA0IC4gLCAhIBsgGSADIA4gBEEAKALYiQEiO0EadyA7QRV3cyA7QQd3c0EAKALkiQEiPGpBACgC4IkBIj1BACgC3IkBIj5zIDtxID1zaiAHakGY36iUBGoiB0EAKALUiQEiP2oiACAMaiA7IA1qID4gD2ogPSAGaiAAID4gO3NxID5zaiAAQRp3IABBFXdzIABBB3dzakGRid2JB2oiQEEAKALQiQEiQWoiDCAAIDtzcSA7c2ogDEEadyAMQRV3cyAMQQd3c2pBz/eDrntqIkJBACgCzIkBIkNqIg0gDCAAc3EgAHNqIA1BGncgDUEVd3MgDUEHd3NqQaW3181+aiJEQQAoAsiJASIAaiIPIA0gDHNxIAxzaiAPQRp3IA9BFXdzIA9BB3dzakHbhNvKA2oiRSBBIEMgAHNxIEMgAHFzIABBHncgAEETd3MgAEEKd3NqIAdqIgZqIgdqIAUgD2ogCiANaiALIAxqIAcgDyANc3EgDXNqIAdBGncgB0EVd3MgB0EHd3NqQfGjxM8FaiIKIAYgAHMgQ3EgBiAAcXMgBkEedyAGQRN3cyAGQQp3c2ogQGoiDGoiBCAHIA9zcSAPc2ogBEEadyAEQRV3cyAEQQd3c2pBpIX+kXlqIgsgDCAGcyAAcSAMIAZxcyAMQR53IAxBE3dzIAxBCndzaiBCaiINaiIPIAQgB3NxIAdzaiAPQRp3IA9BFXdzIA9BB3dzakHVvfHYemoiQCANIAxzIAZxIA0gDHFzIA1BHncgDUETd3MgDUEKd3NqIERqIgZqIgcgDyAEc3EgBHNqIAdBGncgB0EVd3MgB0EHd3NqQZjVnsB9aiJCIAYgDXMgDHEgBiANcXMgBkEedyAGQRN3cyAGQQp3c2ogRWoiDGoiBWogFiAHaiAQIA9qIAggBGogBSAHIA9zcSAPc2ogBUEadyAFQRV3cyAFQQd3c2pBgbaNlAFqIgggDCAGcyANcSAMIAZxcyAMQR53IAxBE3dzIAxBCndzaiAKaiINaiIPIAUgB3NxIAdzaiAPQRp3IA9BFXdzIA9BB3dzakG+i8ahAmoiDiANIAxzIAZxIA0gDHFzIA1BHncgDUETd3MgDUEKd3NqIAtqIgZqIgcgDyAFc3EgBXNqIAdBGncgB0EVd3MgB0EHd3NqQcP7sagFaiIQIAYgDXMgDHEgBiANcXMgBkEedyAGQRN3cyAGQQp3c2ogQGoiDGoiBCAHIA9zcSAPc2ogBEEadyAEQRV3cyAEQQd3c2pB9Lr5lQdqIhYgDCAGcyANcSAMIAZxcyAMQR53IAxBE3dzIAxBCndzaiBCaiINaiIFaiABIARqIAIgB2ogFSAPaiAFIAQgB3NxIAdzaiAFQRp3IAVBFXdzIAVBB3dzakH+4/qGeGoiByANIAxzIAZxIA0gDHFzIA1BHncgDUETd3MgDUEKd3NqIAhqIgFqIgYgBSAEc3EgBHNqIAZBGncgBkEVd3MgBkEHd3NqQaeN8N55aiIEIAEgDXMgDHEgASANcXMgAUEedyABQRN3cyABQQp3c2ogDmoiAmoiDCAGIAVzcSAFc2ogDEEadyAMQRV3cyAMQQd3c2pB9OLvjHxqIgUgAiABcyANcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAQaiIDaiINIAwgBnNxIAZzaiANQRp3IA1BFXdzIA1BB3dzakHB0+2kfmoiCCADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBZqIgFqIg8gF2ogESANaiAUIAxqIAkgBmogDyANIAxzcSAMc2ogD0EadyAPQRV3cyAPQQd3c2pBho/5/X5qIgYgASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAHaiICaiIJIA8gDXNxIA1zaiAJQRp3IAlBFXdzIAlBB3dzakHGu4b+AGoiDCACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIARqIgNqIhEgCSAPc3EgD3NqIBFBGncgEUEVd3MgEUEHd3NqQczDsqACaiINIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogBWoiAWoiFCARIAlzcSAJc2ogFEEadyAUQRV3cyAUQQd3c2pB79ik7wJqIg8gASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAIaiICaiIXaiATIBRqIBggEWogEiAJaiAXIBQgEXNxIBFzaiAXQRp3IBdBFXdzIBdBB3dzakGqidLTBGoiGCACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIAZqIgNqIgkgFyAUc3EgFHNqIAlBGncgCUEVd3MgCUEHd3NqQdzTwuUFaiIUIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogDGoiAWoiESAJIBdzcSAXc2ogEUEadyARQRV3cyARQQd3c2pB2pHmtwdqIhcgASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiANaiICaiISIBEgCXNxIAlzaiASQRp3IBJBFXdzIBJBB3dzakHSovnBeWoiGSACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIA9qIgNqIhNqIB4gEmogGiARaiAdIAlqIBMgEiARc3EgEXNqIBNBGncgE0EVd3MgE0EHd3NqQe2Mx8F6aiIaIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogGGoiAWoiCSATIBJzcSASc2ogCUEadyAJQRV3cyAJQQd3c2pByM+MgHtqIhggASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAUaiICaiIRIAkgE3NxIBNzaiARQRp3IBFBFXdzIBFBB3dzakHH/+X6e2oiFCACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIBdqIgNqIhIgESAJc3EgCXNqIBJBGncgEkEVd3MgEkEHd3NqQfOXgLd8aiIXIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogGWoiAWoiE2ogICASaiAcIBFqIB8gCWogEyASIBFzcSARc2ogE0EadyATQRV3cyATQQd3c2pBx6KerX1qIhkgASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAaaiICaiIJIBMgEnNxIBJzaiAJQRp3IAlBFXdzIAlBB3dzakHRxqk2aiIaIAIgAXMgA3EgAiABcXMgAkEedyACQRN3cyACQQp3c2ogGGoiA2oiESAJIBNzcSATc2ogEUEadyARQRV3cyARQQd3c2pB59KkoQFqIhggAyACcyABcSADIAJxcyADQR53IANBE3dzIANBCndzaiAUaiIBaiISIBEgCXNxIAlzaiASQRp3IBJBFXdzIBJBB3dzakGFldy9AmoiFCABIANzIAJxIAEgA3FzIAFBHncgAUETd3MgAUEKd3NqIBdqIgJqIhMgI2ogJiASaiAiIBFqICUgCWogEyASIBFzcSARc2ogE0EadyATQRV3cyATQQd3c2pBuMLs8AJqIhcgAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAZaiIDaiIJIBMgEnNxIBJzaiAJQRp3IAlBFXdzIAlBB3dzakH827HpBGoiGSADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBpqIgFqIhEgCSATc3EgE3NqIBFBGncgEUEVd3MgEUEHd3NqQZOa4JkFaiIaIAEgA3MgAnEgASADcXMgAUEedyABQRN3cyABQQp3c2ogGGoiAmoiEiARIAlzcSAJc2ogEkEadyASQRV3cyASQQd3c2pB1OapqAZqIhggAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAUaiIDaiITaiAoIBJqICQgEWogJyAJaiATIBIgEXNxIBFzaiATQRp3IBNBFXdzIBNBB3dzakG7laizB2oiFCADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBdqIgFqIgkgEyASc3EgEnNqIAlBGncgCUEVd3MgCUEHd3NqQa6Si454aiIXIAEgA3MgAnEgASADcXMgAUEedyABQRN3cyABQQp3c2ogGWoiAmoiESAJIBNzcSATc2ogEUEadyARQRV3cyARQQd3c2pBhdnIk3lqIhkgAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAaaiIDaiISIBEgCXNxIAlzaiASQRp3IBJBFXdzIBJBB3dzakGh0f+VemoiGiADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBhqIgFqIhNqICogEmogLSARaiApIAlqIBMgEiARc3EgEXNqIBNBGncgE0EVd3MgE0EHd3NqQcvM6cB6aiIYIAEgA3MgAnEgASADcXMgAUEedyABQRN3cyABQQp3c2ogFGoiAmoiCSATIBJzcSASc2ogCUEadyAJQRV3cyAJQQd3c2pB8JauknxqIhQgAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAXaiIDaiIRIAkgE3NxIBNzaiARQRp3IBFBFXdzIBFBB3dzakGjo7G7fGoiFyADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBlqIgFqIhIgESAJc3EgCXNqIBJBGncgEkEVd3MgEkEHd3NqQZnQy4x9aiIZIAEgA3MgAnEgASADcXMgAUEedyABQRN3cyABQQp3c2ogGmoiAmoiE2ogMCASaiAvIBFqICsgCWogEyASIBFzcSARc2ogE0EadyATQRV3cyATQQd3c2pBpIzktH1qIhogAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAYaiIDaiIJIBMgEnNxIBJzaiAJQRp3IAlBFXdzIAlBB3dzakGF67igf2oiGCADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBRqIgFqIhEgCSATc3EgE3NqIBFBGncgEUEVd3MgEUEHd3NqQfDAqoMBaiIUIAEgA3MgAnEgASADcXMgAUEedyABQRN3cyABQQp3c2ogF2oiAmoiEiARIAlzcSAJc2ogEkEadyASQRV3cyASQQd3c2pBloKTzQFqIhcgAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAZaiIDaiITIDZqIDIgEmogNSARaiAxIAlqIBMgEiARc3EgEXNqIBNBGncgE0EVd3MgE0EHd3NqQYjY3fEBaiIZIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogGmoiAWoiCSATIBJzcSASc2ogCUEadyAJQRV3cyAJQQd3c2pBzO6hugJqIhogASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAYaiICaiIRIAkgE3NxIBNzaiARQRp3IBFBFXdzIBFBB3dzakG1+cKlA2oiGCACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIBRqIgNqIhIgESAJc3EgCXNqIBJBGncgEkEVd3MgEkEHd3NqQbOZ8MgDaiIUIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogF2oiAWoiE2ogLEEZdyAsQQ53cyAsQQN2cyAoaiA0aiAzQQ93IDNBDXdzIDNBCnZzaiIXIBJqIDcgEWogMyAJaiATIBIgEXNxIBFzaiATQRp3IBNBFXdzIBNBB3dzakHK1OL2BGoiGyABIANzIAJxIAEgA3FzIAFBHncgAUETd3MgAUEKd3NqIBlqIgJqIgkgEyASc3EgEnNqIAlBGncgCUEVd3MgCUEHd3NqQc+U89wFaiIZIAIgAXMgA3EgAiABcXMgAkEedyACQRN3cyACQQp3c2ogGmoiA2oiESAJIBNzcSATc2ogEUEadyARQRV3cyARQQd3c2pB89+5wQZqIhogAyACcyABcSADIAJxcyADQR53IANBE3dzIANBCndzaiAYaiIBaiISIBEgCXNxIAlzaiASQRp3IBJBFXdzIBJBB3dzakHuhb6kB2oiHCABIANzIAJxIAEgA3FzIAFBHncgAUETd3MgAUEKd3NqIBRqIgJqIhNqIC5BGXcgLkEOd3MgLkEDdnMgKmogNmogLUEZdyAtQQ53cyAtQQN2cyApaiA1aiAXQQ93IBdBDXdzIBdBCnZzaiIUQQ93IBRBDXdzIBRBCnZzaiIYIBJqIDkgEWogFCAJaiATIBIgEXNxIBFzaiATQRp3IBNBFXdzIBNBB3dzakHvxpXFB2oiCSACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIBtqIgNqIhEgEyASc3EgEnNqIBFBGncgEUEVd3MgEUEHd3NqQZTwoaZ4aiIbIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogGWoiAWoiEiARIBNzcSATc2ogEkEadyASQRV3cyASQQd3c2pBiISc5nhqIhkgASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAaaiICaiITIBIgEXNxIBFzaiATQRp3IBNBFXdzIBNBB3dzakH6//uFeWoiGiACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIBxqIgNqIhQgPGo2AuSJAUEAID8gAyACcyABcSADIAJxcyADQR53IANBE3dzIANBCndzaiAJaiIBIANzIAJxIAEgA3FzIAFBHncgAUETd3MgAUEKd3NqIBtqIgIgAXMgA3EgAiABcXMgAkEedyACQRN3cyACQQp3c2ogGWoiAyACcyABcSADIAJxcyADQR53IANBE3dzIANBCndzaiAaaiIJajYC1IkBQQAgPSAvQRl3IC9BDndzIC9BA3ZzICtqIDdqIBhBD3cgGEENd3MgGEEKdnNqIhggEWogFCATIBJzcSASc2ogFEEadyAUQRV3cyAUQQd3c2pB69nBonpqIhkgAWoiEWo2AuCJAUEAIEEgCSADcyACcSAJIANxcyAJQR53IAlBE3dzIAlBCndzaiAZaiIBajYC0IkBQQAgPiAwQRl3IDBBDndzIDBBA3ZzIC9qIBdqIDpBD3cgOkENd3MgOkEKdnNqIBJqIBEgFCATc3EgE3NqIBFBGncgEUEVd3MgEUEHd3NqQffH5vd7aiIXIAJqIhJqNgLciQFBACBDIAEgCXMgA3EgASAJcXMgAUEedyABQRN3cyABQQp3c2ogF2oiAmo2AsyJAUEAIDsgNEEZdyA0QQ53cyA0QQN2cyAwaiA4aiAYQQ93IBhBDXdzIBhBCnZzaiATaiASIBEgFHNxIBRzaiASQRp3IBJBFXdzIBJBB3dzakHy8cWzfGoiESADamo2AtiJAUEAIAAgAiABcyAJcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiARamo2AsiJAQuyBgIEfwF+QQAoAsCJASIAQQJ2QQ9xIgFBAnRBgIkBaiICIAIoAgBBfyAAQQN0IgB0QX9zcUGAASAAdHM2AgACQAJAAkAgAUEOSQ0AAkAgAUEORw0AQQBBADYCvIkBC0GAiQEQA0EAIQIMAQsgAUENRg0BIAFBAWohAgsgAiEDAkBBBiACa0EHcSIARQ0AIAIgAGohAyACQQJ0QYCJAWohAQNAIAFBADYCACABQQRqIQEgAEF/aiIADQALCyACQXlqQQdJDQAgA0ECdCEBA0AgAUGYiQFqQgA3AgAgAUGQiQFqQgA3AgAgAUGIiQFqQgA3AgAgAUGAiQFqQgA3AgAgAUEgaiIBQThHDQALC0EAIQFBAEEAKQPAiQEiBKciAEEbdCAAQQt0QYCA/AdxciAAQQV2QYD+A3EgAEEDdEEYdnJyNgK8iQFBACAEQh2IpyIAQRh0IABBgP4DcUEIdHIgAEEIdkGA/gNxIABBGHZycjYCuIkBQYCJARADQQBBACgC5IkBIgBBGHQgAEGA/gNxQQh0ciAAQQh2QYD+A3EgAEEYdnJyNgLkiQFBAEEAKALgiQEiAEEYdCAAQYD+A3FBCHRyIABBCHZBgP4DcSAAQRh2cnI2AuCJAUEAQQAoAtyJASIAQRh0IABBgP4DcUEIdHIgAEEIdkGA/gNxIABBGHZycjYC3IkBQQBBACgC2IkBIgBBGHQgAEGA/gNxQQh0ciAAQQh2QYD+A3EgAEEYdnJyNgLYiQFBAEEAKALUiQEiAEEYdCAAQYD+A3FBCHRyIABBCHZBgP4DcSAAQRh2cnI2AtSJAUEAQQAoAtCJASIAQRh0IABBgP4DcUEIdHIgAEEIdkGA/gNxIABBGHZycjYC0IkBQQBBACgCzIkBIgBBGHQgAEGA/gNxQQh0ciAAQQh2QYD+A3EgAEEYdnJyNgLMiQFBAEEAKALIiQEiAEEYdCAAQYD+A3FBCHRyIABBCHZBgP4DcSAAQRh2cnI2AsiJAQJAQQAoAuiJASICRQ0AQQAhAANAIAFBgAlqIAFByIkBai0AADoAACABQQFqIQEgAiAAQQFqIgBB/wFxSw0ACwsLBgBBgIkBC6MBAEEAQgA3A8CJAUEAQRxBICABQeABRiIBGzYC6IkBQQBCp5/mp8b0k/2+f0Krs4/8kaOz8NsAIAEbNwPgiQFBAEKxloD+n6KFrOgAQv+kuYjFkdqCm38gARs3A9iJAUEAQpe6w4OTp5aHd0Ly5rvjo6f9p6V/IAEbNwPQiQFBAELYvZaI/KC1vjZC58yn0NbQ67O7fyABGzcDyIkBIAAQAhAECwsLAQBBgAgLBHAAAAA=", Id = "8c18dd94", Cd = {
  name: vd,
  data: _d,
  hash: Id
};
new Te();
new Te();
function Ed() {
  return kd(Cd, 32).then((r) => {
    r.init(256);
    const e = {
      init: () => (r.init(256), e),
      update: (t) => (r.update(t), e),
      // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
      digest: (t) => r.digest(t),
      save: () => r.save(),
      load: (t) => (r.load(t), e),
      blockSize: 64,
      digestSize: 32
    };
    return e;
  });
}
new Te();
new Te();
new Te();
new Te();
new Te();
new Te();
new Te();
new Te();
new Te();
const Qn = 1024 * 1024 * 1024;
function zo(r) {
  return r.document_formats?.map((t) => t.extension).filter((t) => /^\.[a-z0-9]{1,8}$/.test(t)) || [];
}
function Po(r) {
  return zo(r).join(",");
}
function Sd(r, e) {
  const t = e.toLowerCase();
  return zo(r).some((n) => t.endsWith(n));
}
function Nd(r) {
  const e = r.document_max_bytes;
  return Number.isSafeInteger(e) && e > 0 ? Math.min(e, Qn) : Qn;
}
function Fo(r) {
  const e = r.document_index_max_bytes;
  return Number.isSafeInteger(e) && e > 0 ? Math.min(e, Qn) : Qn;
}
function Bd(r, e) {
  const t = e.toLowerCase();
  return r.document_formats?.find((n) => /^\.[a-z0-9]{1,8}$/.test(n.extension) && t.endsWith(n.extension));
}
function xd(r, e) {
  const t = Bd(r, e);
  if (!t) return 0;
  const n = Fo(r);
  return Number.isSafeInteger(t.builder_max_bytes) && t.builder_max_bytes > 0 ? Math.min(n, t.builder_max_bytes) : n;
}
function Qo(r) {
  return r.role === "editor" || r.role === "manager";
}
function Os(r) {
  return r.security_status === "clean" && ["queued", "indexing", "ready", "failed", "needs_reconcile"].includes(r.state);
}
function za(r) {
  return r.security_status === "rejected" || r.state === "deleting" || r.state === "deleted" ? !1 : r.state === "failed" || r.state === "needs_reconcile" || !!r.error_code;
}
function Pa(r) {
  return r.state === "ready" && r.security_status === "clean" && !r.reindexing && !r.error_code;
}
function ai(r) {
  return r.reindexing ? "可检索 · 正在重新索引" : r.state === "indexing" && r.error_code === "document_index_failed" ? "索引失败" : {
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
  }[r.state] || "状态未知";
}
function Dd(r) {
  if (r.reindexing) return "当前索引保持可用；新一代索引在后台建立，确认完成后才会原子切换。";
  const e = Md(r.error_code);
  return e || (r.state === "deleting" ? "已停止检索和下载；原文件与远端索引清理完成前，此记录会继续保留。" : r.state === "needs_reconcile" ? "远端可能已收到文件，系统正在核对结果，不会盲目重复推送。" : r.security_status === "rejected" ? "安全检查未通过。原文件保持隔离，不会进入解析、索引或下载链路。" : r.state === "quarantined" ? "原文件已进入隔离区，安全检查通过前不会开放下载，也不会交给解析器。" : r.state === "scanning" ? "正在检查文件类型、恶意特征、活动内容和压缩包膨胀风险。" : r.error_code === "document_index_failed" ? "知识服务未能完成索引，原文件仍可查看和下载。" : r.state === "indexing" ? r.index_status === "CHUNKED" ? "资料已完成分段，正在等待索引完成。" : "原文件已保存，正在建立索引。" : r.state === "queued" ? "原文件已保存，后台将继续处理。" : r.state === "uploading" ? "上传尚未完成，可重新选择同一文件继续。" : r.state === "ready" ? "知识索引已经完成，可以检索。" : "处理尚未完成，请稍后刷新状态。");
}
function Md(r) {
  return r ? {
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
  }[r] || `文档处理未完成（${r}）。原件和现有索引会按当前状态保持隔离或可用，不会把未知结果当作成功。` : "";
}
const To = [
  { key: "upload", label: "上传" },
  { key: "scan", label: "安全扫描" },
  { key: "parse", label: "解析" },
  { key: "chunk", label: "切块" },
  { key: "index", label: "索引" },
  { key: "complete", label: "完成" }
];
function Rd(r) {
  if (r.processing_stage === "failed")
    return r.security_status === "rejected" ? 1 : r.index_status === "CHUNKED" ? 4 : 2;
  const e = To.findIndex((t) => t.key === r.processing_stage);
  return e < 0 ? 0 : e;
}
async function Lo(r, e, t) {
  e?.throwIfAborted();
  const n = await Ed(), s = r.stream().getReader();
  let i = 0;
  n.init();
  try {
    for (; ; ) {
      e?.throwIfAborted();
      const a = await s.read();
      if (a.done) break;
      n.update(a.value), i += a.value.byteLength, t?.(Math.min(1, i / r.size));
    }
  } catch (a) {
    throw await s.cancel().catch(() => {
    }), a;
  } finally {
    s.releaseLock();
  }
  return e?.throwIfAborted(), t?.(1), n.digest("hex");
}
const zd = 512 * 1024, Pd = 8 * 1024 * 1024, Fd = 64 * 1024 * 1024, Qd = 128 * 1024 * 1024, Td = "X-Domainry-File-SHA256", Uo = /* @__PURE__ */ new Set(["txt", "md", "rst", "html", "htm", "csv", "json", "jsonl", "py", "js", "ts", "tsx", "jsx", "java", "go", "rs", "c", "h", "cpp", "hpp", "cs", "rb", "php", "kt", "swift", "scala", "sh"]), Ld = /* @__PURE__ */ new Set(["pdf", "docx", "pptx", "xlsx", "xlsm", "png", "jpg", "jpeg", "gif", "bmp", "webp", "mp3", "wav", "ogg", "flac", "m4a", "aac", "mp4", "mov", "webm", "avi"]), Ud = {
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
function es(r) {
  return r.split(".").at(-1)?.toLowerCase() || "";
}
function Od(r) {
  return Uo.has(r);
}
function Oo(r) {
  const e = es(r);
  return Uo.has(e) || Ld.has(e);
}
function $d(r) {
  const e = r?.match(/filename\*=UTF-8''([^;]+)/i)?.[1], t = r?.match(/filename="((?:[^"\\]|\\.)*)"/i)?.[1]?.replace(/\\(.)/g, "$1") || r?.match(/filename=([^;\s]+)/i)?.[1];
  let n;
  try {
    n = e ? decodeURIComponent(e) : t;
  } catch {
    throw Error("文档文件名无效。");
  }
  if (!n || n.length > 512 || /[\x00-\x1f/\\]/.test(n)) throw Error("文档文件名无效。");
  return n;
}
function Hd(r) {
  const e = Number(r.headers.get("Content-Length")), t = r.headers.get("Content-Range")?.match(/^bytes (\d+)-(\d+)\/(\d+)$/), n = t ? Number(t[3]) : e, s = t ? Number(t[2]) - Number(t[1]) + 1 : e, i = t ? Number(t[1]) : 0, a = t ? Number(t[2]) + 1 : e;
  if (!Number.isSafeInteger(e) || e < 1 || !Number.isSafeInteger(n) || n < 1 || !Number.isSafeInteger(s) || s !== e || !Number.isSafeInteger(i) || !Number.isSafeInteger(a) || i < 0 || a > n) throw Error("文件内容长度无法核对。");
  return { total: n, loaded: s, start: i, end: a };
}
async function ts(r, e, t) {
  const n = await r.read({ signal: e, range: t });
  if (!n.ok && n.status !== 206) {
    const p = await n.json().catch(() => ({}));
    throw Error(p.code || `读取文件失败（${n.status}）`);
  }
  const s = $d(n.headers.get("Content-Disposition")), i = n.headers.get(Td) || "", { total: a, loaded: o, start: l, end: h } = Hd(n);
  if (!/^[a-f0-9]{64}$/.test(i) || r.file.sha256 && i !== r.file.sha256 || r.file.bytes !== void 0 && a !== r.file.bytes)
    throw await n.body?.cancel(), Error("文件内容与所选版本不一致，请刷新后重试。");
  return { response: n, filename: s, sha256: i, total: a, loaded: o, start: l, end: h };
}
async function $o(r, e, t = Fd) {
  const n = await ts(r, e);
  if (n.total > t)
    throw await n.response.body?.cancel(), Error(`此文件有 ${(n.total / 1024 / 1024).toFixed(1)} MiB，超过当前查看器 ${(t / 1024 / 1024).toFixed(0)} MiB 的安全预览上限，请下载原文件查看。`);
  let s = await n.response.blob();
  if (s.size !== n.total) throw Error("文件内容没有完整读取。");
  e.throwIfAborted();
  const i = es(n.filename);
  return s = s.slice(0, s.size, Ud[i] || "application/octet-stream"), { filename: n.filename, blob: s, format: i, bytes: n.total, sha256: n.sha256 };
}
async function jd(r, e) {
  const t = await ts(r, e, `bytes=0-${zd - 1}`), n = await t.response.arrayBuffer();
  if (n.byteLength !== t.loaded) throw Error("文件内容没有完整读取。");
  let s;
  try {
    s = new TextDecoder("utf-8", { fatal: !0 }).decode(n);
  } catch {
    throw Error("此文件不是有效的 UTF-8 文本，请下载原文件查看。");
  }
  if (/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(s)) throw Error("此文件包含二进制控制字符，不能作为文本安全预览。");
  return { filename: t.filename, format: es(t.filename), text: s, bytes: t.total, loadedBytes: t.loaded, truncated: t.loaded < t.total };
}
async function Fa(r, e, t, n) {
  if (!Number.isSafeInteger(e) || !Number.isSafeInteger(t) || e < 0 || t <= e) throw Error("文件分段范围无效。");
  const s = await ts(r, n, `bytes=${e}-${t - 1}`);
  if (s.start !== e || s.end !== Math.min(t, s.total))
    throw await s.response.body?.cancel(), Error("服务端返回了错误的文件分段。");
  const i = new Uint8Array(await s.response.arrayBuffer());
  if (i.byteLength !== s.loaded) throw Error("文件分段没有完整读取。");
  return { data: i, total: s.total, filename: s.filename, sha256: s.sha256 };
}
async function Ho(r, e) {
  const t = window.showSaveFilePicker;
  if (t) {
    const a = await t({ suggestedName: r.file.filename }), o = await ts(r, e);
    if (!o.response.body) throw Error("浏览器无法读取下载内容。");
    await o.response.body.pipeTo(await a.createWritable(), { signal: e });
    return;
  }
  const n = await $o(r, e, Qd), s = URL.createObjectURL(n.blob), i = window.document.createElement("a");
  i.href = s, i.download = n.filename, i.click(), setTimeout(() => URL.revokeObjectURL(s), 1e3);
}
function jo(r, e) {
  return {
    identity: `knowledge:${e.library_id}:${e.id}:${e.revision}:${e.bytes}:${e.sha256}`,
    file: { filename: e.filename, bytes: e.bytes, sha256: e.sha256 },
    streamURL: r.documentContentURL?.(e.library_id, e.id),
    async read(t) {
      const n = await r.readDocumentContent(e.library_id, e.id, t), s = new Headers(n.headers);
      return new Response(n.body, { status: n.status, statusText: n.statusText, headers: s });
    }
  };
}
function qd(r, e, t) {
  return Ho(jo(r, e), t);
}
function Gd({ blob: r, filename: e }) {
  const [t, n] = T("");
  return ye(() => {
    const s = URL.createObjectURL(r);
    return n(s), () => URL.revokeObjectURL(s);
  }, [r]), /* @__PURE__ */ v("div", { className: "knowledge-file-viewer", children: [
    /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "图片原始比例预览" }),
    t && /* @__PURE__ */ d("div", { className: "knowledge-image-scroll", children: /* @__PURE__ */ d("img", { src: t, alt: e }) })
  ] });
}
function Qa({ source: r, kind: e }) {
  const t = Be(null), n = Math.max(0, r.file.location?.start_ms || 0) / 1e3;
  if (ye(() => {
    const i = t.current;
    if (!i || !Number.isFinite(n)) return;
    const a = () => {
      Math.abs(i.currentTime - n) > 0.05 && (i.currentTime = n);
    };
    return i.readyState >= 1 ? a() : i.addEventListener("loadedmetadata", a, { once: !0 }), () => i.removeEventListener("loadedmetadata", a);
  }, [r.identity, n]), !r.streamURL) return /* @__PURE__ */ d("div", { className: "knowledge-preview-unsupported", children: /* @__PURE__ */ d("p", { children: "当前宿主没有提供授权后的媒体流地址，请下载原文件查看。" }) });
  const s = (i) => {
    t.current = i;
  };
  return /* @__PURE__ */ v("div", { className: "knowledge-file-viewer knowledge-media-viewer", children: [
    e === "video" ? /* @__PURE__ */ d("video", { ref: s, src: r.streamURL, controls: !0, preload: "metadata", playsInline: !0 }) : /* @__PURE__ */ d("audio", { ref: s, src: r.streamURL, controls: !0, preload: "metadata" }),
    r.file.location?.end_ms ? /* @__PURE__ */ v("p", { className: "knowledge-subtle", children: [
      "引用时间：",
      Ta(r.file.location.start_ms || 0),
      " – ",
      Ta(r.file.location.end_ms)
    ] }) : null
  ] });
}
function Ta(r) {
  const e = Math.max(0, Math.floor(r / 1e3)), t = Math.floor(e / 3600), n = Math.floor(e % 3600 / 60), s = e % 60;
  return t ? `${t}:${String(n).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${n}:${String(s).padStart(2, "0")}`;
}
const La = 256 * 1024;
function Jd({ source: r, location: e }) {
  const t = Be(null), n = Be(null), [s, i] = T(null), [a, o] = T(Math.max(1, e?.page || 1)), [l, h] = T(1), [p, b] = T(800), [m, u] = T(""), [y, A] = T(!1);
  return ye(() => {
    const w = n.current;
    if (!w) return;
    const k = new ResizeObserver((_) => b(Math.max(200, _[0].contentRect.width - 32)));
    return k.observe(w), () => k.disconnect();
  }, []), ye(() => {
    let w = !0, k;
    const _ = new AbortController(), B = /* @__PURE__ */ new Set();
    return i(null), u(""), Promise.all([Fa(r, 0, La, _.signal), import("pdfjs-dist"), import("pdfjs-dist/build/pdf.worker.min.mjs?url")]).then(([C, S, z]) => {
      if (w) {
        if (S.GlobalWorkerOptions.workerSrc = z.default, C.data.byteLength === C.total)
          k = S.getDocument({ data: C.data, stopAtErrors: !0 });
        else {
          class x extends S.PDFDataRangeTransport {
            requestDataRange($, X) {
              const N = new AbortController();
              B.add(N), Fa(r, $, X, N.signal).then((R) => {
                B.delete(N), w && this.onDataRange($, R.data);
              }).catch((R) => {
                B.delete(N), !(!w || N.signal.aborted) && (u(R instanceof Error ? R.message : "PDF 分段读取失败，请下载原文件查看。"), k?.destroy());
              });
            }
            abort() {
              B.forEach(($) => $.abort()), B.clear();
            }
          }
          const U = new x(C.total, C.data, !1, C.filename);
          k = S.getDocument({ range: U, rangeChunkSize: La, disableAutoFetch: !0, disableStream: !0, stopAtErrors: !0 });
        }
        return k.promise.then((x) => {
          w && (i(x), o(Math.min(x.numPages, Math.max(1, e?.page || 1))));
        });
      }
    }).catch((C) => {
      w && !_.signal.aborted && u(C instanceof Error ? C.message : "PDF 无法打开，文件可能已损坏或需要密码。可下载原文件查看。");
    }), () => {
      w = !1, _.abort(), B.forEach((C) => C.abort()), B.clear(), k?.destroy();
    };
  }, [e?.page, r.identity]), ye(() => {
    if (!s) return;
    let w = !0, k;
    return A(!1), s.getPage(a).then((_) => {
      if (!w || !t.current) return;
      const B = _.getViewport({ scale: 1 }), C = Math.min(p / B.width, 2) * l, S = _.getViewport({ scale: C }), z = Math.min(window.devicePixelRatio || 1, 2), x = t.current;
      return x.width = Math.ceil(S.width * z), x.height = Math.ceil(S.height * z), x.style.width = `${S.width}px`, x.style.height = `${S.height}px`, k = _.render({ canvas: x, canvasContext: x.getContext("2d"), viewport: S, transform: [z, 0, 0, z, 0, 0] }), k.promise.then(() => {
        w && A(!0);
      });
    }).catch((_) => {
      w && _?.name !== "RenderingCancelledException" && u("此页无法显示，请下载原文件查看。");
    }), () => {
      w = !1, k?.cancel();
    };
  }, [s, a, p, l]), /* @__PURE__ */ v("div", { className: "knowledge-file-viewer", children: [
    /* @__PURE__ */ v("nav", { className: "knowledge-file-toolbar", "aria-label": "PDF 翻页", children: [
      /* @__PURE__ */ d(ce, { disabled: !s || a <= 1, onClick: () => o((w) => w - 1), children: "上一页" }),
      /* @__PURE__ */ v("span", { children: [
        "第 ",
        a,
        " / ",
        s?.numPages || "—",
        " 页"
      ] }),
      /* @__PURE__ */ d(ce, { disabled: !s || a >= s.numPages, onClick: () => o((w) => w + 1), children: "下一页" }),
      /* @__PURE__ */ v("label", { children: [
        "缩放 ",
        /* @__PURE__ */ v("select", { "aria-label": "PDF 缩放", value: l, onChange: (w) => h(Number(w.target.value)), children: [
          /* @__PURE__ */ d("option", { value: 0.75, children: "75%" }),
          /* @__PURE__ */ d("option", { value: 1, children: "适合宽度" }),
          /* @__PURE__ */ d("option", { value: 1.5, children: "150%" }),
          /* @__PURE__ */ d("option", { value: 2, children: "200%" })
        ] })
      ] })
    ] }),
    m && /* @__PURE__ */ d("p", { role: "alert", className: "knowledge-error", children: m }),
    /* @__PURE__ */ d("div", { className: "knowledge-pdf-canvas", ref: n, "aria-busy": !y && !m, children: /* @__PURE__ */ d("canvas", { ref: t, "aria-label": `PDF 第 ${a} 页`, "data-rendered": y }) })
  ] });
}
async function yi(r, e, t) {
  const n = await r.arrayBuffer();
  return t.throwIfAborted(), new Promise((s, i) => {
    const a = new Worker(new URL(
      /* @vite-ignore */
      "" + new URL("assets/office-worker-CYysu3ts.js", import.meta.url).href,
      import.meta.url
    ), { type: "module" }), o = (p, b) => {
      clearTimeout(h), a.terminate(), t.removeEventListener("abort", l), p ? i(p) : s(b);
    }, l = () => o(new DOMException("Aborted", "AbortError")), h = setTimeout(() => o(Error("文件预览处理超时，请下载原文件查看。")), 2e4);
    t.addEventListener("abort", l, { once: !0 }), a.onerror = () => o(Error("文件预览失败，请下载原文件查看。")), a.onmessage = (p) => p.data.error ? o(Error(p.data.error)) : o(void 0, p.data), a.postMessage({ data: n, kind: e }, [n]);
  });
}
const Gt = 50, Jt = 16;
function Mr(r) {
  let e = "";
  for (; r > 0; r = Math.floor((r - 1) / 26)) e = String.fromCharCode(65 + (r - 1) % 26) + e;
  return e;
}
function Vd({ blob: r, location: e }) {
  const [t, n] = T([]), [s, i] = T(0), [a, o] = T(0), [l, h] = T(0), [p, b] = T(e?.cell || ""), [m, u] = T(""), [y, A] = T(""), w = t[s], k = ct(() => new Map(w?.cells.map((x) => [`${x.row}:${x.col}`, x])), [w]);
  function _(x) {
    const U = /^([A-Z]{1,3})([1-9][0-9]{0,5})$/.exec(x.toUpperCase());
    if (!U || !w) {
      A("请输入有效单元格，例如 B12。");
      return;
    }
    const Q = [...U[1]].reduce((X, N) => X * 26 + N.charCodeAt(0) - 64, 0), $ = Number(U[2]);
    if ($ > w.rows || Q > w.cols) {
      A("该位置超出当前工作表范围。");
      return;
    }
    A(""), o(Math.floor(($ - 1) / Gt)), h(Math.floor((Q - 1) / Jt)), u(`${$}:${Q}`);
  }
  ye(() => {
    const x = new AbortController();
    return yi(r, "xlsx", x.signal).then((U) => {
      if (x.signal.aborted) return;
      const Q = U.sheets || [];
      n(Q);
      const $ = Q.findIndex((X) => X.name === e?.sheet);
      $ >= 0 && i($);
    }).catch((U) => {
      x.signal.aborted || A(U instanceof Error ? U.message : "Excel 文件无法预览。");
    }), () => x.abort();
  }, [r, e?.sheet]), ye(() => {
    !w || w.name !== e?.sheet || (e.cell ? _(e.cell) : e.row && e.row <= w.rows && o(Math.floor((e.row - 1) / Gt)));
  }, [w, e?.cell, e?.row, e?.sheet]);
  const B = w ? Array.from({ length: Math.min(Gt, Math.max(0, w.rows - a * Gt)) }, (x, U) => a * Gt + U + 1).filter((x) => !w.hiddenRows.includes(x)) : [], C = w ? Array.from({ length: Math.min(Jt, Math.max(0, w.cols - l * Jt)) }, (x, U) => l * Jt + U + 1).filter((x) => !w.hiddenCols.includes(x)) : [], S = /* @__PURE__ */ new Map();
  for (const x of w?.merges || []) {
    const U = B.filter(($) => $ >= x.top && $ <= x.bottom), Q = C.filter(($) => $ >= x.left && $ <= x.right);
    for (const $ of U) for (const X of Q) S.set(`${$}:${X}`, $ === U[0] && X === Q[0] ? { master: `${x.top}:${x.left}`, rowSpan: U.length, colSpan: Q.length } : null);
  }
  const z = k.get(m);
  return /* @__PURE__ */ v("div", { className: "knowledge-file-viewer", "data-static-ui-list": !0, children: [
    y && /* @__PURE__ */ d("p", { role: "alert", className: "knowledge-error", children: y }),
    !w && !y && /* @__PURE__ */ d("p", { role: "status", children: "正在打开工作簿…" }),
    w && /* @__PURE__ */ v(at, { children: [
      /* @__PURE__ */ v("div", { className: "knowledge-file-toolbar", children: [
        /* @__PURE__ */ v("label", { children: [
          "工作表 ",
          /* @__PURE__ */ d("select", { "aria-label": "工作表", value: s, onChange: (x) => {
            i(Number(x.target.value)), o(0), h(0), u(""), A("");
          }, children: t.map((x, U) => /* @__PURE__ */ d("option", { value: U, children: x.name }, U)) })
        ] }),
        /* @__PURE__ */ v("form", { onSubmit: (x) => {
          x.preventDefault(), _(p);
        }, children: [
          /* @__PURE__ */ v("label", { children: [
            "定位单元格 ",
            /* @__PURE__ */ d("input", { value: p, onChange: (x) => b(x.target.value), placeholder: "B12", maxLength: 10 })
          ] }),
          /* @__PURE__ */ d(ce, { type: "submit", children: "定位" })
        ] })
      ] }),
      /* @__PURE__ */ v("p", { className: "knowledge-subtle", children: [
        w.rows,
        " 行 × ",
        w.cols,
        " 列 · 只读预览，公式显示文件保存的结果；图表与嵌入对象请下载查看。"
      ] }),
      z && /* @__PURE__ */ v("p", { className: "knowledge-spreadsheet-value", children: [
        /* @__PURE__ */ v("strong", { children: [
          Mr(z.col),
          z.row
        ] }),
        " ",
        z.formula ? `=${z.formula} → ` : "",
        z.text
      ] }),
      /* @__PURE__ */ d("div", { className: "knowledge-sheet-scroll", children: /* @__PURE__ */ v("table", { "aria-label": `${w.name} 工作表`, children: [
        /* @__PURE__ */ v("colgroup", { children: [
          /* @__PURE__ */ d("col", { style: { width: 50 } }),
          C.map((x) => /* @__PURE__ */ d("col", { style: { width: w.widths[x] || 110 } }, x))
        ] }),
        /* @__PURE__ */ d("thead", { children: /* @__PURE__ */ v("tr", { children: [
          /* @__PURE__ */ d("th", { scope: "col", children: "行" }),
          C.map((x) => /* @__PURE__ */ d("th", { scope: "col", children: Mr(x) }, x))
        ] }) }),
        /* @__PURE__ */ d("tbody", { children: B.map((x) => /* @__PURE__ */ v("tr", { style: { height: w.heights[x] }, children: [
          /* @__PURE__ */ d("th", { scope: "row", children: x }),
          C.map((U) => {
            const Q = `${x}:${U}`, $ = S.get(Q);
            if ($ === null) return null;
            const X = k.get($?.master || Q);
            return /* @__PURE__ */ d("td", { rowSpan: $?.rowSpan, colSpan: $?.colSpan, style: X?.style, "data-selected": m === ($?.master || Q), onClick: () => {
              u($?.master || Q), b(`${Mr(X?.col || U)}${X?.row || x}`);
            }, children: X?.text || "" }, U);
          })
        ] }, x)) })
      ] }) }),
      /* @__PURE__ */ v("nav", { className: "knowledge-file-toolbar", "aria-label": "工作表行分页", "data-static-ui-pagination": !0, children: [
        /* @__PURE__ */ d(ce, { disabled: a === 0, onClick: () => o((x) => x - 1), children: "上一页行" }),
        /* @__PURE__ */ v("span", { children: [
          "第 ",
          a + 1,
          " / ",
          Math.max(1, Math.ceil(w.rows / Gt)),
          " 页"
        ] }),
        /* @__PURE__ */ d(ce, { disabled: (a + 1) * Gt >= w.rows, onClick: () => o((x) => x + 1), children: "下一页行" }),
        /* @__PURE__ */ d(ce, { disabled: l === 0, onClick: () => h((x) => x - 1), children: "前一组列" }),
        /* @__PURE__ */ v("span", { children: [
          Mr(l * Jt + 1),
          "–",
          Mr(Math.max(1, Math.min(w.cols, (l + 1) * Jt)))
        ] }),
        /* @__PURE__ */ d(ce, { disabled: (l + 1) * Jt >= w.cols, onClick: () => h((x) => x + 1), children: "后一组列" })
      ] })
    ] })
  ] });
}
function Wd({ blob: r, location: e }) {
  const [t, n] = T([]), [s, i] = T(0), [a, o] = T("");
  ye(() => {
    const h = new AbortController();
    return yi(r, "pptx", h.signal).then((p) => {
      if (h.signal.aborted) return;
      const b = p.slides || [];
      n(b);
      const m = b.findIndex((u) => u.number === e?.slide);
      i(m >= 0 ? m : 0);
    }).catch((p) => {
      h.signal.aborted || o(p instanceof Error ? p.message : "PowerPoint 文件无法预览。");
    }), () => h.abort();
  }, [r, e?.slide]);
  const l = t[s];
  return /* @__PURE__ */ v("div", { className: "knowledge-file-viewer", children: [
    /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "PowerPoint 只读文本预览 · 保留幻灯片顺序和文字；版式、图片、图表、动画与备注请下载原文件查看。" }),
    a && /* @__PURE__ */ d("p", { role: "alert", className: "knowledge-error", children: a }),
    !l && !a && /* @__PURE__ */ d("p", { role: "status", children: "正在读取幻灯片…" }),
    l && /* @__PURE__ */ v("div", { className: "knowledge-presentation", children: [
      /* @__PURE__ */ d("nav", { "aria-label": "幻灯片列表", children: t.map((h, p) => /* @__PURE__ */ v("button", { "aria-current": p === s ? "true" : void 0, onClick: () => i(p), children: [
        /* @__PURE__ */ d("span", { children: h.number }),
        /* @__PURE__ */ d("strong", { children: h.title })
      ] }, h.number)) }),
      /* @__PURE__ */ v("article", { "aria-label": `第 ${l.number} 张幻灯片`, children: [
        /* @__PURE__ */ v("small", { children: [
          "第 ",
          l.number,
          " / ",
          t.length,
          " 张"
        ] }),
        /* @__PURE__ */ d("h2", { children: l.title }),
        l.lines.length ? l.lines.map((h, p) => /* @__PURE__ */ d("p", { children: h }, p)) : /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "这张幻灯片没有可提取的正文文字。" })
      ] })
    ] })
  ] });
}
const mn = 50, bn = 2e5, Ua = 2e3, $s = 100;
function Xd(r, e) {
  const t = [];
  let n = [], s = "", i = !1, a = !1;
  for (let o = 0; o < r.length; o++) {
    const l = r[o];
    if (i) {
      l === '"' && r[o + 1] === '"' ? (s += '"', o++) : l === '"' ? i = !1 : s += l;
      continue;
    }
    if (l === '"' && s === "") {
      i = !0;
      continue;
    }
    if (l === e) {
      n.length < $s ? n.push(s) : a = !0, s = "";
      continue;
    }
    if (l === `
`) {
      if (n.length < $s ? n.push(s.replace(/\r$/, "")) : a = !0, t.push(n), n = [], s = "", t.length >= Ua) {
        a = !0;
        break;
      }
      continue;
    }
    s += l;
  }
  return (s || n.length) && t.length < Ua && (n.length < $s && n.push(s.replace(/\r$/, "")), t.push(n)), { rows: t, limited: a };
}
function Zd({ file: r }) {
  const [e, t] = T(0), n = ct(() => r.format === "csv" || r.format === "tsv" ? Xd(r.text, r.format === "tsv" ? "	" : ",") : null, [r]), s = ct(() => {
    if (r.format !== "json" || r.truncated) return r.text.slice(0, bn);
    try {
      return JSON.stringify(JSON.parse(r.text), null, 2).slice(0, bn);
    } catch {
      return r.text.slice(0, bn);
    }
  }, [r]), i = r.truncated || r.text.length > bn || !!n?.limited;
  if (n) {
    const a = e * mn, o = n.rows.slice(a, a + mn), l = Math.max(0, ...o.map((h) => h.length));
    return /* @__PURE__ */ v("div", { className: "knowledge-file-viewer", children: [
      /* @__PURE__ */ v("p", { className: "knowledge-subtle", children: [
        "表格文本只读预览",
        i ? " · 已限制展示量" : ""
      ] }),
      /* @__PURE__ */ d("div", { className: "knowledge-sheet-scroll", children: /* @__PURE__ */ v("table", { children: [
        /* @__PURE__ */ d("thead", { children: /* @__PURE__ */ v("tr", { children: [
          /* @__PURE__ */ d("th", { children: "行" }),
          Array.from({ length: l }, (h, p) => /* @__PURE__ */ d("th", { children: p + 1 }, p))
        ] }) }),
        /* @__PURE__ */ d("tbody", { children: o.map((h, p) => /* @__PURE__ */ v("tr", { children: [
          /* @__PURE__ */ d("th", { children: a + p + 1 }),
          Array.from({ length: l }, (b, m) => /* @__PURE__ */ d("td", { children: h[m] || "" }, m))
        ] }, a + p)) })
      ] }) }),
      /* @__PURE__ */ v("nav", { className: "knowledge-file-toolbar", children: [
        /* @__PURE__ */ d(ce, { disabled: e === 0, onClick: () => t((h) => h - 1), children: "上一页" }),
        /* @__PURE__ */ d("span", { children: n.rows.length ? `${a + 1}–${Math.min(a + mn, n.rows.length)} / ${n.rows.length}` : "无数据" }),
        /* @__PURE__ */ d(ce, { disabled: a + mn >= n.rows.length, onClick: () => t((h) => h + 1), children: "下一页" })
      ] })
    ] });
  }
  return /* @__PURE__ */ v("div", { className: "knowledge-file-viewer", children: [
    /* @__PURE__ */ v("p", { className: "knowledge-subtle", children: [
      r.format === "md" ? "Markdown 源文" : r.format === "json" ? "JSON" : "文本",
      "只读预览",
      i ? " · 仅展示开头" : ""
    ] }),
    /* @__PURE__ */ d("pre", { className: "knowledge-text-preview", children: s })
  ] });
}
var An = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Kd(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function xm(r) {
  if (Object.prototype.hasOwnProperty.call(r, "__esModule")) return r;
  var e = r.default;
  if (typeof e == "function") {
    var t = function n() {
      var s = !1;
      try {
        s = this instanceof n;
      } catch {
      }
      return s ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(r).forEach(function(n) {
    var s = Object.getOwnPropertyDescriptor(r, n);
    Object.defineProperty(t, n, s.get ? s : {
      enumerable: !0,
      get: function() {
        return r[n];
      }
    });
  }), t;
}
function wn(r) {
  throw new Error('Could not dynamically require "' + r + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Hs = { exports: {} };
var Oa;
function Yd() {
  return Oa || (Oa = 1, (function(r, e) {
    (function(t) {
      r.exports = t();
    })(function() {
      return (function t(n, s, i) {
        function a(h, p) {
          if (!s[h]) {
            if (!n[h]) {
              var b = typeof wn == "function" && wn;
              if (!p && b) return b(h, !0);
              if (o) return o(h, !0);
              var m = new Error("Cannot find module '" + h + "'");
              throw m.code = "MODULE_NOT_FOUND", m;
            }
            var u = s[h] = { exports: {} };
            n[h][0].call(u.exports, function(y) {
              var A = n[h][1][y];
              return a(A || y);
            }, u, u.exports, t, n, s, i);
          }
          return s[h].exports;
        }
        for (var o = typeof wn == "function" && wn, l = 0; l < i.length; l++) a(i[l]);
        return a;
      })({ 1: [function(t, n, s) {
        var i = t("./utils"), a = t("./support"), o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        s.encode = function(l) {
          for (var h, p, b, m, u, y, A, w = [], k = 0, _ = l.length, B = _, C = i.getTypeOf(l) !== "string"; k < l.length; ) B = _ - k, b = C ? (h = l[k++], p = k < _ ? l[k++] : 0, k < _ ? l[k++] : 0) : (h = l.charCodeAt(k++), p = k < _ ? l.charCodeAt(k++) : 0, k < _ ? l.charCodeAt(k++) : 0), m = h >> 2, u = (3 & h) << 4 | p >> 4, y = 1 < B ? (15 & p) << 2 | b >> 6 : 64, A = 2 < B ? 63 & b : 64, w.push(o.charAt(m) + o.charAt(u) + o.charAt(y) + o.charAt(A));
          return w.join("");
        }, s.decode = function(l) {
          var h, p, b, m, u, y, A = 0, w = 0, k = "data:";
          if (l.substr(0, k.length) === k) throw new Error("Invalid base64 input, it looks like a data url.");
          var _, B = 3 * (l = l.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (l.charAt(l.length - 1) === o.charAt(64) && B--, l.charAt(l.length - 2) === o.charAt(64) && B--, B % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (_ = a.uint8array ? new Uint8Array(0 | B) : new Array(0 | B); A < l.length; ) h = o.indexOf(l.charAt(A++)) << 2 | (m = o.indexOf(l.charAt(A++))) >> 4, p = (15 & m) << 4 | (u = o.indexOf(l.charAt(A++))) >> 2, b = (3 & u) << 6 | (y = o.indexOf(l.charAt(A++))), _[w++] = h, u !== 64 && (_[w++] = p), y !== 64 && (_[w++] = b);
          return _;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(t, n, s) {
        var i = t("./external"), a = t("./stream/DataWorker"), o = t("./stream/Crc32Probe"), l = t("./stream/DataLengthProbe");
        function h(p, b, m, u, y) {
          this.compressedSize = p, this.uncompressedSize = b, this.crc32 = m, this.compression = u, this.compressedContent = y;
        }
        h.prototype = { getContentWorker: function() {
          var p = new a(i.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new l("data_length")), b = this;
          return p.on("end", function() {
            if (this.streamInfo.data_length !== b.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), p;
        }, getCompressedWorker: function() {
          return new a(i.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, h.createWorkerFrom = function(p, b, m) {
          return p.pipe(new o()).pipe(new l("uncompressedSize")).pipe(b.compressWorker(m)).pipe(new l("compressedSize")).withStreamInfo("compression", b);
        }, n.exports = h;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(t, n, s) {
        var i = t("./stream/GenericWorker");
        s.STORE = { magic: "\0\0", compressWorker: function() {
          return new i("STORE compression");
        }, uncompressWorker: function() {
          return new i("STORE decompression");
        } }, s.DEFLATE = t("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(t, n, s) {
        var i = t("./utils"), a = (function() {
          for (var o, l = [], h = 0; h < 256; h++) {
            o = h;
            for (var p = 0; p < 8; p++) o = 1 & o ? 3988292384 ^ o >>> 1 : o >>> 1;
            l[h] = o;
          }
          return l;
        })();
        n.exports = function(o, l) {
          return o !== void 0 && o.length ? i.getTypeOf(o) !== "string" ? (function(h, p, b, m) {
            var u = a, y = m + b;
            h ^= -1;
            for (var A = m; A < y; A++) h = h >>> 8 ^ u[255 & (h ^ p[A])];
            return -1 ^ h;
          })(0 | l, o, o.length, 0) : (function(h, p, b, m) {
            var u = a, y = m + b;
            h ^= -1;
            for (var A = m; A < y; A++) h = h >>> 8 ^ u[255 & (h ^ p.charCodeAt(A))];
            return -1 ^ h;
          })(0 | l, o, o.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(t, n, s) {
        s.base64 = !1, s.binary = !1, s.dir = !1, s.createFolders = !0, s.date = null, s.compression = null, s.compressionOptions = null, s.comment = null, s.unixPermissions = null, s.dosPermissions = null;
      }, {}], 6: [function(t, n, s) {
        var i = null;
        i = typeof Promise < "u" ? Promise : t("lie"), n.exports = { Promise: i };
      }, { lie: 37 }], 7: [function(t, n, s) {
        var i = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", a = t("pako"), o = t("./utils"), l = t("./stream/GenericWorker"), h = i ? "uint8array" : "array";
        function p(b, m) {
          l.call(this, "FlateWorker/" + b), this._pako = null, this._pakoAction = b, this._pakoOptions = m, this.meta = {};
        }
        s.magic = "\b\0", o.inherits(p, l), p.prototype.processChunk = function(b) {
          this.meta = b.meta, this._pako === null && this._createPako(), this._pako.push(o.transformTo(h, b.data), !1);
        }, p.prototype.flush = function() {
          l.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, p.prototype.cleanUp = function() {
          l.prototype.cleanUp.call(this), this._pako = null;
        }, p.prototype._createPako = function() {
          this._pako = new a[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var b = this;
          this._pako.onData = function(m) {
            b.push({ data: m, meta: b.meta });
          };
        }, s.compressWorker = function(b) {
          return new p("Deflate", b);
        }, s.uncompressWorker = function() {
          return new p("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(t, n, s) {
        function i(u, y) {
          var A, w = "";
          for (A = 0; A < y; A++) w += String.fromCharCode(255 & u), u >>>= 8;
          return w;
        }
        function a(u, y, A, w, k, _) {
          var B, C, S = u.file, z = u.compression, x = _ !== h.utf8encode, U = o.transformTo("string", _(S.name)), Q = o.transformTo("string", h.utf8encode(S.name)), $ = S.comment, X = o.transformTo("string", _($)), N = o.transformTo("string", h.utf8encode($)), R = Q.length !== S.name.length, g = N.length !== $.length, G = "", oe = "", L = "", le = S.dir, ee = S.date, de = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          y && !A || (de.crc32 = u.crc32, de.compressedSize = u.compressedSize, de.uncompressedSize = u.uncompressedSize);
          var H = 0;
          y && (H |= 8), x || !R && !g || (H |= 2048);
          var O = 0, K = 0;
          le && (O |= 16), k === "UNIX" ? (K = 798, O |= (function(se, we) {
            var Ae = se;
            return se || (Ae = we ? 16893 : 33204), (65535 & Ae) << 16;
          })(S.unixPermissions, le)) : (K = 20, O |= (function(se) {
            return 63 & (se || 0);
          })(S.dosPermissions)), B = ee.getUTCHours(), B <<= 6, B |= ee.getUTCMinutes(), B <<= 5, B |= ee.getUTCSeconds() / 2, C = ee.getUTCFullYear() - 1980, C <<= 4, C |= ee.getUTCMonth() + 1, C <<= 5, C |= ee.getUTCDate(), R && (oe = i(1, 1) + i(p(U), 4) + Q, G += "up" + i(oe.length, 2) + oe), g && (L = i(1, 1) + i(p(X), 4) + N, G += "uc" + i(L.length, 2) + L);
          var ae = "";
          return ae += `
\0`, ae += i(H, 2), ae += z.magic, ae += i(B, 2), ae += i(C, 2), ae += i(de.crc32, 4), ae += i(de.compressedSize, 4), ae += i(de.uncompressedSize, 4), ae += i(U.length, 2), ae += i(G.length, 2), { fileRecord: b.LOCAL_FILE_HEADER + ae + U + G, dirRecord: b.CENTRAL_FILE_HEADER + i(K, 2) + ae + i(X.length, 2) + "\0\0\0\0" + i(O, 4) + i(w, 4) + U + G + X };
        }
        var o = t("../utils"), l = t("../stream/GenericWorker"), h = t("../utf8"), p = t("../crc32"), b = t("../signature");
        function m(u, y, A, w) {
          l.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = y, this.zipPlatform = A, this.encodeFileName = w, this.streamFiles = u, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        o.inherits(m, l), m.prototype.push = function(u) {
          var y = u.meta.percent || 0, A = this.entriesCount, w = this._sources.length;
          this.accumulate ? this.contentBuffer.push(u) : (this.bytesWritten += u.data.length, l.prototype.push.call(this, { data: u.data, meta: { currentFile: this.currentFile, percent: A ? (y + 100 * (A - w - 1)) / A : 100 } }));
        }, m.prototype.openedSource = function(u) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = u.file.name;
          var y = this.streamFiles && !u.file.dir;
          if (y) {
            var A = a(u, y, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: A.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, m.prototype.closedSource = function(u) {
          this.accumulate = !1;
          var y = this.streamFiles && !u.file.dir, A = a(u, y, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(A.dirRecord), y) this.push({ data: (function(w) {
            return b.DATA_DESCRIPTOR + i(w.crc32, 4) + i(w.compressedSize, 4) + i(w.uncompressedSize, 4);
          })(u), meta: { percent: 100 } });
          else for (this.push({ data: A.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, m.prototype.flush = function() {
          for (var u = this.bytesWritten, y = 0; y < this.dirRecords.length; y++) this.push({ data: this.dirRecords[y], meta: { percent: 100 } });
          var A = this.bytesWritten - u, w = (function(k, _, B, C, S) {
            var z = o.transformTo("string", S(C));
            return b.CENTRAL_DIRECTORY_END + "\0\0\0\0" + i(k, 2) + i(k, 2) + i(_, 4) + i(B, 4) + i(z.length, 2) + z;
          })(this.dirRecords.length, A, u, this.zipComment, this.encodeFileName);
          this.push({ data: w, meta: { percent: 100 } });
        }, m.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, m.prototype.registerPrevious = function(u) {
          this._sources.push(u);
          var y = this;
          return u.on("data", function(A) {
            y.processChunk(A);
          }), u.on("end", function() {
            y.closedSource(y.previous.streamInfo), y._sources.length ? y.prepareNextSource() : y.end();
          }), u.on("error", function(A) {
            y.error(A);
          }), this;
        }, m.prototype.resume = function() {
          return !!l.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, m.prototype.error = function(u) {
          var y = this._sources;
          if (!l.prototype.error.call(this, u)) return !1;
          for (var A = 0; A < y.length; A++) try {
            y[A].error(u);
          } catch {
          }
          return !0;
        }, m.prototype.lock = function() {
          l.prototype.lock.call(this);
          for (var u = this._sources, y = 0; y < u.length; y++) u[y].lock();
        }, n.exports = m;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(t, n, s) {
        var i = t("../compressions"), a = t("./ZipFileWorker");
        s.generateWorker = function(o, l, h) {
          var p = new a(l.streamFiles, h, l.platform, l.encodeFileName), b = 0;
          try {
            o.forEach(function(m, u) {
              b++;
              var y = (function(_, B) {
                var C = _ || B, S = i[C];
                if (!S) throw new Error(C + " is not a valid compression method !");
                return S;
              })(u.options.compression, l.compression), A = u.options.compressionOptions || l.compressionOptions || {}, w = u.dir, k = u.date;
              u._compressWorker(y, A).withStreamInfo("file", { name: m, dir: w, date: k, comment: u.comment || "", unixPermissions: u.unixPermissions, dosPermissions: u.dosPermissions }).pipe(p);
            }), p.entriesCount = b;
          } catch (m) {
            p.error(m);
          }
          return p;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(t, n, s) {
        function i() {
          if (!(this instanceof i)) return new i();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var a = new i();
            for (var o in this) typeof this[o] != "function" && (a[o] = this[o]);
            return a;
          };
        }
        (i.prototype = t("./object")).loadAsync = t("./load"), i.support = t("./support"), i.defaults = t("./defaults"), i.version = "3.10.2", i.loadAsync = function(a, o) {
          return new i().loadAsync(a, o);
        }, i.external = t("./external"), n.exports = i;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(t, n, s) {
        var i = t("./utils"), a = t("./external"), o = t("./utf8"), l = t("./zipEntries"), h = t("./stream/Crc32Probe"), p = t("./nodejsUtils");
        function b(m) {
          return new a.Promise(function(u, y) {
            var A = m.decompressed.getContentWorker().pipe(new h());
            A.on("error", function(w) {
              y(w);
            }).on("end", function() {
              A.streamInfo.crc32 !== m.decompressed.crc32 ? y(new Error("Corrupted zip : CRC32 mismatch")) : u();
            }).resume();
          });
        }
        n.exports = function(m, u) {
          var y = this;
          return u = i.extend(u || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: o.utf8decode }), p.isNode && p.isStream(m) ? a.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : i.prepareContent("the loaded zip file", m, !0, u.optimizedBinaryString, u.base64).then(function(A) {
            var w = new l(u);
            return w.load(A), w;
          }).then(function(A) {
            var w = [a.Promise.resolve(A)], k = A.files;
            if (u.checkCRC32) for (var _ = 0; _ < k.length; _++) w.push(b(k[_]));
            return a.Promise.all(w);
          }).then(function(A) {
            for (var w = A.shift(), k = w.files, _ = 0; _ < k.length; _++) {
              var B = k[_], C = B.fileNameStr, S = i.resolve(B.fileNameStr);
              y.file(S, B.decompressed, { binary: !0, optimizedBinaryString: !0, date: B.date, dir: B.dir, comment: B.fileCommentStr.length ? B.fileCommentStr : null, unixPermissions: B.unixPermissions, dosPermissions: B.dosPermissions, createFolders: u.createFolders }), B.dir || (y.file(S).unsafeOriginalName = C);
            }
            return w.zipComment.length && (y.comment = w.zipComment), y;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(t, n, s) {
        var i = t("../utils"), a = t("../stream/GenericWorker");
        function o(l, h) {
          a.call(this, "Nodejs stream input adapter for " + l), this._upstreamEnded = !1, this._bindStream(h);
        }
        i.inherits(o, a), o.prototype._bindStream = function(l) {
          var h = this;
          (this._stream = l).pause(), l.on("data", function(p) {
            h.push({ data: p, meta: { percent: 0 } });
          }).on("error", function(p) {
            h.isPaused ? this.generatedError = p : h.error(p);
          }).on("end", function() {
            h.isPaused ? h._upstreamEnded = !0 : h.end();
          });
        }, o.prototype.pause = function() {
          return !!a.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, o.prototype.resume = function() {
          return !!a.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, n.exports = o;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(t, n, s) {
        var i = t("readable-stream").Readable;
        function a(o, l, h) {
          i.call(this, l), this._helper = o;
          var p = this;
          o.on("data", function(b, m) {
            p.push(b) || p._helper.pause(), h && h(m);
          }).on("error", function(b) {
            p.emit("error", b);
          }).on("end", function() {
            p.push(null);
          });
        }
        t("../utils").inherits(a, i), a.prototype._read = function() {
          this._helper.resume();
        }, n.exports = a;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(t, n, s) {
        n.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(i, a) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(i, a);
          if (typeof i == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(i, a);
        }, allocBuffer: function(i) {
          if (Buffer.alloc) return Buffer.alloc(i);
          var a = new Buffer(i);
          return a.fill(0), a;
        }, isBuffer: function(i) {
          return Buffer.isBuffer(i);
        }, isStream: function(i) {
          return i && typeof i.on == "function" && typeof i.pause == "function" && typeof i.resume == "function";
        } };
      }, {}], 15: [function(t, n, s) {
        function i(S, z, x) {
          var U, Q = o.getTypeOf(z), $ = o.extend(x || {}, p);
          $.date = $.date || /* @__PURE__ */ new Date(), $.compression !== null && ($.compression = $.compression.toUpperCase()), typeof $.unixPermissions == "string" && ($.unixPermissions = parseInt($.unixPermissions, 8)), $.unixPermissions && 16384 & $.unixPermissions && ($.dir = !0), $.dosPermissions && 16 & $.dosPermissions && ($.dir = !0), $.dir && (S = k(S)), $.createFolders && (U = w(S)) && _.call(this, U, !0);
          var X = Q === "string" && $.binary === !1 && $.base64 === !1;
          x && x.binary !== void 0 || ($.binary = !X), (z instanceof b && z.uncompressedSize === 0 || $.dir || !z || z.length === 0) && ($.base64 = !1, $.binary = !0, z = "", $.compression = "STORE", Q = "string");
          var N = null;
          N = z instanceof b || z instanceof l ? z : y.isNode && y.isStream(z) ? new A(S, z) : o.prepareContent(S, z, $.binary, $.optimizedBinaryString, $.base64);
          var R = new m(S, N, $);
          this.files[S] = R;
        }
        var a = t("./utf8"), o = t("./utils"), l = t("./stream/GenericWorker"), h = t("./stream/StreamHelper"), p = t("./defaults"), b = t("./compressedObject"), m = t("./zipObject"), u = t("./generate"), y = t("./nodejsUtils"), A = t("./nodejs/NodejsStreamInputAdapter"), w = function(S) {
          S.slice(-1) === "/" && (S = S.substring(0, S.length - 1));
          var z = S.lastIndexOf("/");
          return 0 < z ? S.substring(0, z) : "";
        }, k = function(S) {
          return S.slice(-1) !== "/" && (S += "/"), S;
        }, _ = function(S, z) {
          return z = z !== void 0 ? z : p.createFolders, S = k(S), this.files[S] || i.call(this, S, null, { dir: !0, createFolders: z }), this.files[S];
        };
        function B(S) {
          return Object.prototype.toString.call(S) === "[object RegExp]";
        }
        var C = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(S) {
          var z, x, U;
          for (z in this.files) U = this.files[z], (x = z.slice(this.root.length, z.length)) && z.slice(0, this.root.length) === this.root && S(x, U);
        }, filter: function(S) {
          var z = [];
          return this.forEach(function(x, U) {
            S(x, U) && z.push(U);
          }), z;
        }, file: function(S, z, x) {
          if (arguments.length !== 1) return S = this.root + S, i.call(this, S, z, x), this;
          if (B(S)) {
            var U = S;
            return this.filter(function($, X) {
              return !X.dir && U.test($);
            });
          }
          var Q = this.files[this.root + S];
          return Q && !Q.dir ? Q : null;
        }, folder: function(S) {
          if (!S) return this;
          if (B(S)) return this.filter(function(Q, $) {
            return $.dir && S.test(Q);
          });
          var z = this.root + S, x = _.call(this, z), U = this.clone();
          return U.root = x.name, U;
        }, remove: function(S) {
          S = this.root + S;
          var z = this.files[S];
          if (z || (S.slice(-1) !== "/" && (S += "/"), z = this.files[S]), z && !z.dir) delete this.files[S];
          else for (var x = this.filter(function(Q, $) {
            return $.name.slice(0, S.length) === S;
          }), U = 0; U < x.length; U++) delete this.files[x[U].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(S) {
          var z, x = {};
          try {
            if ((x = o.extend(S || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: a.utf8encode })).type = x.type.toLowerCase(), x.compression = x.compression.toUpperCase(), x.type === "binarystring" && (x.type = "string"), !x.type) throw new Error("No output type specified.");
            o.checkSupport(x.type), x.platform !== "darwin" && x.platform !== "freebsd" && x.platform !== "linux" && x.platform !== "sunos" || (x.platform = "UNIX"), x.platform === "win32" && (x.platform = "DOS");
            var U = x.comment || this.comment || "";
            z = u.generateWorker(this, x, U);
          } catch (Q) {
            (z = new l("error")).error(Q);
          }
          return new h(z, x.type || "string", x.mimeType);
        }, generateAsync: function(S, z) {
          return this.generateInternalStream(S).accumulate(z);
        }, generateNodeStream: function(S, z) {
          return (S = S || {}).type || (S.type = "nodebuffer"), this.generateInternalStream(S).toNodejsStream(z);
        } };
        n.exports = C;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(t, n, s) {
        n.exports = t("stream");
      }, { stream: void 0 }], 17: [function(t, n, s) {
        var i = t("./DataReader");
        function a(o) {
          i.call(this, o);
          for (var l = 0; l < this.data.length; l++) o[l] = 255 & o[l];
        }
        t("../utils").inherits(a, i), a.prototype.byteAt = function(o) {
          return this.data[this.zero + o];
        }, a.prototype.lastIndexOfSignature = function(o) {
          for (var l = o.charCodeAt(0), h = o.charCodeAt(1), p = o.charCodeAt(2), b = o.charCodeAt(3), m = this.length - 4; 0 <= m; --m) if (this.data[m] === l && this.data[m + 1] === h && this.data[m + 2] === p && this.data[m + 3] === b) return m - this.zero;
          return -1;
        }, a.prototype.readAndCheckSignature = function(o) {
          var l = o.charCodeAt(0), h = o.charCodeAt(1), p = o.charCodeAt(2), b = o.charCodeAt(3), m = this.readData(4);
          return l === m[0] && h === m[1] && p === m[2] && b === m[3];
        }, a.prototype.readData = function(o) {
          if (this.checkOffset(o), o === 0) return [];
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, l;
        }, n.exports = a;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(t, n, s) {
        var i = t("../utils");
        function a(o) {
          this.data = o, this.length = o.length, this.index = 0, this.zero = 0;
        }
        a.prototype = { checkOffset: function(o) {
          this.checkIndex(this.index + o);
        }, checkIndex: function(o) {
          if (this.length < this.zero + o || o < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + o + "). Corrupted zip ?");
        }, setIndex: function(o) {
          this.checkIndex(o), this.index = o;
        }, skip: function(o) {
          this.setIndex(this.index + o);
        }, byteAt: function() {
        }, readInt: function(o) {
          var l, h = 0;
          for (this.checkOffset(o), l = this.index + o - 1; l >= this.index; l--) h = (h << 8) + this.byteAt(l);
          return this.index += o, h;
        }, readString: function(o) {
          return i.transformTo("string", this.readData(o));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var o = this.readInt(4);
          return new Date(Date.UTC(1980 + (o >> 25 & 127), (o >> 21 & 15) - 1, o >> 16 & 31, o >> 11 & 31, o >> 5 & 63, (31 & o) << 1));
        } }, n.exports = a;
      }, { "../utils": 32 }], 19: [function(t, n, s) {
        var i = t("./Uint8ArrayReader");
        function a(o) {
          i.call(this, o);
        }
        t("../utils").inherits(a, i), a.prototype.readData = function(o) {
          this.checkOffset(o);
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, l;
        }, n.exports = a;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(t, n, s) {
        var i = t("./DataReader");
        function a(o) {
          i.call(this, o);
        }
        t("../utils").inherits(a, i), a.prototype.byteAt = function(o) {
          return this.data.charCodeAt(this.zero + o);
        }, a.prototype.lastIndexOfSignature = function(o) {
          return this.data.lastIndexOf(o) - this.zero;
        }, a.prototype.readAndCheckSignature = function(o) {
          return o === this.readData(4);
        }, a.prototype.readData = function(o) {
          this.checkOffset(o);
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, l;
        }, n.exports = a;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(t, n, s) {
        var i = t("./ArrayReader");
        function a(o) {
          i.call(this, o);
        }
        t("../utils").inherits(a, i), a.prototype.readData = function(o) {
          if (this.checkOffset(o), o === 0) return new Uint8Array(0);
          var l = this.data.subarray(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, l;
        }, n.exports = a;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(t, n, s) {
        var i = t("../utils"), a = t("../support"), o = t("./ArrayReader"), l = t("./StringReader"), h = t("./NodeBufferReader"), p = t("./Uint8ArrayReader");
        n.exports = function(b) {
          var m = i.getTypeOf(b);
          return i.checkSupport(m), m !== "string" || a.uint8array ? m === "nodebuffer" ? new h(b) : a.uint8array ? new p(i.transformTo("uint8array", b)) : new o(i.transformTo("array", b)) : new l(b);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(t, n, s) {
        s.LOCAL_FILE_HEADER = "PK", s.CENTRAL_FILE_HEADER = "PK", s.CENTRAL_DIRECTORY_END = "PK", s.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", s.ZIP64_CENTRAL_DIRECTORY_END = "PK", s.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(t, n, s) {
        var i = t("./GenericWorker"), a = t("../utils");
        function o(l) {
          i.call(this, "ConvertWorker to " + l), this.destType = l;
        }
        a.inherits(o, i), o.prototype.processChunk = function(l) {
          this.push({ data: a.transformTo(this.destType, l.data), meta: l.meta });
        }, n.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(t, n, s) {
        var i = t("./GenericWorker"), a = t("../crc32");
        function o() {
          i.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        t("../utils").inherits(o, i), o.prototype.processChunk = function(l) {
          this.streamInfo.crc32 = a(l.data, this.streamInfo.crc32 || 0), this.push(l);
        }, n.exports = o;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(t, n, s) {
        var i = t("../utils"), a = t("./GenericWorker");
        function o(l) {
          a.call(this, "DataLengthProbe for " + l), this.propName = l, this.withStreamInfo(l, 0);
        }
        i.inherits(o, a), o.prototype.processChunk = function(l) {
          if (l) {
            var h = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = h + l.data.length;
          }
          a.prototype.processChunk.call(this, l);
        }, n.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(t, n, s) {
        var i = t("../utils"), a = t("./GenericWorker");
        function o(l) {
          a.call(this, "DataWorker");
          var h = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, l.then(function(p) {
            h.dataIsReady = !0, h.data = p, h.max = p && p.length || 0, h.type = i.getTypeOf(p), h.isPaused || h._tickAndRepeat();
          }, function(p) {
            h.error(p);
          });
        }
        i.inherits(o, a), o.prototype.cleanUp = function() {
          a.prototype.cleanUp.call(this), this.data = null;
        }, o.prototype.resume = function() {
          return !!a.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, i.delay(this._tickAndRepeat, [], this)), !0);
        }, o.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (i.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, o.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var l = null, h = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              l = this.data.substring(this.index, h);
              break;
            case "uint8array":
              l = this.data.subarray(this.index, h);
              break;
            case "array":
            case "nodebuffer":
              l = this.data.slice(this.index, h);
          }
          return this.index = h, this.push({ data: l, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, n.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(t, n, s) {
        function i(a) {
          this.name = a || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        i.prototype = { push: function(a) {
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
        }, on: function(a, o) {
          return this._listeners[a].push(o), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(a, o) {
          if (this._listeners[a]) for (var l = 0; l < this._listeners[a].length; l++) this._listeners[a][l].call(this, o);
        }, pipe: function(a) {
          return a.registerPrevious(this);
        }, registerPrevious: function(a) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = a.streamInfo, this.mergeStreamInfo(), this.previous = a;
          var o = this;
          return a.on("data", function(l) {
            o.processChunk(l);
          }), a.on("end", function() {
            o.end();
          }), a.on("error", function(l) {
            o.error(l);
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
        }, withStreamInfo: function(a, o) {
          return this.extraStreamInfo[a] = o, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var a in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, a) && (this.streamInfo[a] = this.extraStreamInfo[a]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var a = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + a : a;
        } }, n.exports = i;
      }, {}], 29: [function(t, n, s) {
        var i = t("../utils"), a = t("./ConvertWorker"), o = t("./GenericWorker"), l = t("../base64"), h = t("../support"), p = t("../external"), b = null;
        if (h.nodestream) try {
          b = t("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function m(y, A) {
          return new p.Promise(function(w, k) {
            var _ = [], B = y._internalType, C = y._outputType, S = y._mimeType;
            y.on("data", function(z, x) {
              _.push(z), A && A(x);
            }).on("error", function(z) {
              _ = [], k(z);
            }).on("end", function() {
              try {
                var z = (function(x, U, Q) {
                  switch (x) {
                    case "blob":
                      return i.newBlob(i.transformTo("arraybuffer", U), Q);
                    case "base64":
                      return l.encode(U);
                    default:
                      return i.transformTo(x, U);
                  }
                })(C, (function(x, U) {
                  var Q, $ = 0, X = null, N = 0;
                  for (Q = 0; Q < U.length; Q++) N += U[Q].length;
                  switch (x) {
                    case "string":
                      return U.join("");
                    case "array":
                      return Array.prototype.concat.apply([], U);
                    case "uint8array":
                      for (X = new Uint8Array(N), Q = 0; Q < U.length; Q++) X.set(U[Q], $), $ += U[Q].length;
                      return X;
                    case "nodebuffer":
                      return Buffer.concat(U);
                    default:
                      throw new Error("concat : unsupported type '" + x + "'");
                  }
                })(B, _), S);
                w(z);
              } catch (x) {
                k(x);
              }
              _ = [];
            }).resume();
          });
        }
        function u(y, A, w) {
          var k = A;
          switch (A) {
            case "blob":
            case "arraybuffer":
              k = "uint8array";
              break;
            case "base64":
              k = "string";
          }
          try {
            this._internalType = k, this._outputType = A, this._mimeType = w, i.checkSupport(k), this._worker = y.pipe(new a(k)), y.lock();
          } catch (_) {
            this._worker = new o("error"), this._worker.error(_);
          }
        }
        u.prototype = { accumulate: function(y) {
          return m(this, y);
        }, on: function(y, A) {
          var w = this;
          return y === "data" ? this._worker.on(y, function(k) {
            A.call(w, k.data, k.meta);
          }) : this._worker.on(y, function() {
            i.delay(A, arguments, w);
          }), this;
        }, resume: function() {
          return i.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(y) {
          if (i.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new b(this, { objectMode: this._outputType !== "nodebuffer" }, y);
        } }, n.exports = u;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(t, n, s) {
        if (s.base64 = !0, s.array = !0, s.string = !0, s.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", s.nodebuffer = typeof Buffer < "u", s.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") s.blob = !1;
        else {
          var i = new ArrayBuffer(0);
          try {
            s.blob = new Blob([i], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var a = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              a.append(i), s.blob = a.getBlob("application/zip").size === 0;
            } catch {
              s.blob = !1;
            }
          }
        }
        try {
          s.nodestream = !!t("readable-stream").Readable;
        } catch {
          s.nodestream = !1;
        }
      }, { "readable-stream": 16 }], 31: [function(t, n, s) {
        for (var i = t("./utils"), a = t("./support"), o = t("./nodejsUtils"), l = t("./stream/GenericWorker"), h = new Array(256), p = 0; p < 256; p++) h[p] = 252 <= p ? 6 : 248 <= p ? 5 : 240 <= p ? 4 : 224 <= p ? 3 : 192 <= p ? 2 : 1;
        h[254] = h[254] = 1;
        function b() {
          l.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function m() {
          l.call(this, "utf-8 encode");
        }
        s.utf8encode = function(u) {
          return a.nodebuffer ? o.newBufferFrom(u, "utf-8") : (function(y) {
            var A, w, k, _, B, C = y.length, S = 0;
            for (_ = 0; _ < C; _++) (64512 & (w = y.charCodeAt(_))) == 55296 && _ + 1 < C && (64512 & (k = y.charCodeAt(_ + 1))) == 56320 && (w = 65536 + (w - 55296 << 10) + (k - 56320), _++), S += w < 128 ? 1 : w < 2048 ? 2 : w < 65536 ? 3 : 4;
            for (A = a.uint8array ? new Uint8Array(S) : new Array(S), _ = B = 0; B < S; _++) (64512 & (w = y.charCodeAt(_))) == 55296 && _ + 1 < C && (64512 & (k = y.charCodeAt(_ + 1))) == 56320 && (w = 65536 + (w - 55296 << 10) + (k - 56320), _++), w < 128 ? A[B++] = w : (w < 2048 ? A[B++] = 192 | w >>> 6 : (w < 65536 ? A[B++] = 224 | w >>> 12 : (A[B++] = 240 | w >>> 18, A[B++] = 128 | w >>> 12 & 63), A[B++] = 128 | w >>> 6 & 63), A[B++] = 128 | 63 & w);
            return A;
          })(u);
        }, s.utf8decode = function(u) {
          return a.nodebuffer ? i.transformTo("nodebuffer", u).toString("utf-8") : (function(y) {
            var A, w, k, _, B = y.length, C = new Array(2 * B);
            for (A = w = 0; A < B; ) if ((k = y[A++]) < 128) C[w++] = k;
            else if (4 < (_ = h[k])) C[w++] = 65533, A += _ - 1;
            else {
              for (k &= _ === 2 ? 31 : _ === 3 ? 15 : 7; 1 < _ && A < B; ) k = k << 6 | 63 & y[A++], _--;
              1 < _ ? C[w++] = 65533 : k < 65536 ? C[w++] = k : (k -= 65536, C[w++] = 55296 | k >> 10 & 1023, C[w++] = 56320 | 1023 & k);
            }
            return C.length !== w && (C.subarray ? C = C.subarray(0, w) : C.length = w), i.applyFromCharCode(C);
          })(u = i.transformTo(a.uint8array ? "uint8array" : "array", u));
        }, i.inherits(b, l), b.prototype.processChunk = function(u) {
          var y = i.transformTo(a.uint8array ? "uint8array" : "array", u.data);
          if (this.leftOver && this.leftOver.length) {
            if (a.uint8array) {
              var A = y;
              (y = new Uint8Array(A.length + this.leftOver.length)).set(this.leftOver, 0), y.set(A, this.leftOver.length);
            } else y = this.leftOver.concat(y);
            this.leftOver = null;
          }
          var w = (function(_, B) {
            var C;
            for ((B = B || _.length) > _.length && (B = _.length), C = B - 1; 0 <= C && (192 & _[C]) == 128; ) C--;
            return C < 0 || C === 0 ? B : C + h[_[C]] > B ? C : B;
          })(y), k = y;
          w !== y.length && (a.uint8array ? (k = y.subarray(0, w), this.leftOver = y.subarray(w, y.length)) : (k = y.slice(0, w), this.leftOver = y.slice(w, y.length))), this.push({ data: s.utf8decode(k), meta: u.meta });
        }, b.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: s.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, s.Utf8DecodeWorker = b, i.inherits(m, l), m.prototype.processChunk = function(u) {
          this.push({ data: s.utf8encode(u.data), meta: u.meta });
        }, s.Utf8EncodeWorker = m;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(t, n, s) {
        var i = t("./support"), a = t("./base64"), o = t("./nodejsUtils"), l = t("./external");
        function h(A) {
          return A;
        }
        function p(A, w) {
          for (var k = 0; k < A.length; ++k) w[k] = 255 & A.charCodeAt(k);
          return w;
        }
        t("setimmediate"), s.newBlob = function(A, w) {
          s.checkSupport("blob");
          try {
            return new Blob([A], { type: w });
          } catch {
            try {
              var k = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return k.append(A), k.getBlob(w);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var b = { stringifyByChunk: function(A, w, k) {
          var _ = [], B = 0, C = A.length;
          if (C <= k) return String.fromCharCode.apply(null, A);
          for (; B < C; ) w === "array" || w === "nodebuffer" ? _.push(String.fromCharCode.apply(null, A.slice(B, Math.min(B + k, C)))) : _.push(String.fromCharCode.apply(null, A.subarray(B, Math.min(B + k, C)))), B += k;
          return _.join("");
        }, stringifyByChar: function(A) {
          for (var w = "", k = 0; k < A.length; k++) w += String.fromCharCode(A[k]);
          return w;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return i.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        })(), nodebuffer: (function() {
          try {
            return i.nodebuffer && String.fromCharCode.apply(null, o.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        })() } };
        function m(A) {
          var w = 65536, k = s.getTypeOf(A), _ = !0;
          if (k === "uint8array" ? _ = b.applyCanBeUsed.uint8array : k === "nodebuffer" && (_ = b.applyCanBeUsed.nodebuffer), _) for (; 1 < w; ) try {
            return b.stringifyByChunk(A, k, w);
          } catch {
            w = Math.floor(w / 2);
          }
          return b.stringifyByChar(A);
        }
        function u(A, w) {
          for (var k = 0; k < A.length; k++) w[k] = A[k];
          return w;
        }
        s.applyFromCharCode = m;
        var y = {};
        y.string = { string: h, array: function(A) {
          return p(A, new Array(A.length));
        }, arraybuffer: function(A) {
          return y.string.uint8array(A).buffer;
        }, uint8array: function(A) {
          return p(A, new Uint8Array(A.length));
        }, nodebuffer: function(A) {
          return p(A, o.allocBuffer(A.length));
        } }, y.array = { string: m, array: h, arraybuffer: function(A) {
          return new Uint8Array(A).buffer;
        }, uint8array: function(A) {
          return new Uint8Array(A);
        }, nodebuffer: function(A) {
          return o.newBufferFrom(A);
        } }, y.arraybuffer = { string: function(A) {
          return m(new Uint8Array(A));
        }, array: function(A) {
          return u(new Uint8Array(A), new Array(A.byteLength));
        }, arraybuffer: h, uint8array: function(A) {
          return new Uint8Array(A);
        }, nodebuffer: function(A) {
          return o.newBufferFrom(new Uint8Array(A));
        } }, y.uint8array = { string: m, array: function(A) {
          return u(A, new Array(A.length));
        }, arraybuffer: function(A) {
          return A.buffer;
        }, uint8array: h, nodebuffer: function(A) {
          return o.newBufferFrom(A);
        } }, y.nodebuffer = { string: m, array: function(A) {
          return u(A, new Array(A.length));
        }, arraybuffer: function(A) {
          return y.nodebuffer.uint8array(A).buffer;
        }, uint8array: function(A) {
          return u(A, new Uint8Array(A.length));
        }, nodebuffer: h }, s.transformTo = function(A, w) {
          if (w = w || "", !A) return w;
          s.checkSupport(A);
          var k = s.getTypeOf(w);
          return y[k][A](w);
        }, s.resolve = function(A) {
          for (var w = A.split("/"), k = [], _ = 0; _ < w.length; _++) {
            var B = w[_];
            B === "." || B === "" && _ !== 0 && _ !== w.length - 1 || (B === ".." ? k.pop() : k.push(B));
          }
          return k.join("/");
        }, s.getTypeOf = function(A) {
          if (typeof A == "string") return "string";
          var w = Object.prototype.toString.call(A);
          return w === "[object Array]" ? "array" : i.nodebuffer && o.isBuffer(A) ? "nodebuffer" : i.uint8array && w === "[object Uint8Array]" ? "uint8array" : i.arraybuffer && w === "[object ArrayBuffer]" ? "arraybuffer" : void 0;
        }, s.checkSupport = function(A) {
          if (!i[A.toLowerCase()]) throw new Error(A + " is not supported by this platform");
        }, s.MAX_VALUE_16BITS = 65535, s.MAX_VALUE_32BITS = -1, s.pretty = function(A) {
          var w, k, _ = "";
          for (k = 0; k < (A || "").length; k++) _ += "\\x" + ((w = A.charCodeAt(k)) < 16 ? "0" : "") + w.toString(16).toUpperCase();
          return _;
        }, s.delay = function(A, w, k) {
          setImmediate(function() {
            A.apply(k || null, w || []);
          });
        }, s.inherits = function(A, w) {
          function k() {
          }
          k.prototype = w.prototype, A.prototype = new k();
        }, s.extend = function() {
          var A, w, k = {};
          for (A = 0; A < arguments.length; A++) for (w in arguments[A]) Object.prototype.hasOwnProperty.call(arguments[A], w) && k[w] === void 0 && (k[w] = arguments[A][w]);
          return k;
        }, s.prepareContent = function(A, w, k, _, B) {
          return l.Promise.resolve(w).then(function(C) {
            return i.blob && (C instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(C)) !== -1) ? Blob.prototype.arrayBuffer !== void 0 ? C.arrayBuffer() : typeof FileReader < "u" ? new l.Promise(function(S, z) {
              var x = new FileReader();
              x.onload = function(U) {
                S(U.target.result);
              }, x.onerror = function(U) {
                z(U.target.error);
              }, x.readAsArrayBuffer(C);
            }) : l.Promise.reject(new Error(A + " is a Blob, but we have no way of reading it.")) : C;
          }).then(function(C) {
            var S = s.getTypeOf(C);
            return S ? (S === "arraybuffer" ? C = s.transformTo("uint8array", C) : S === "string" && (B ? C = a.decode(C) : k && _ !== !0 && (C = (function(z) {
              return p(z, i.uint8array ? new Uint8Array(z.length) : new Array(z.length));
            })(C))), C) : l.Promise.reject(new Error("Can't read the data of '" + A + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(t, n, s) {
        var i = t("./reader/readerFor"), a = t("./utils"), o = t("./signature"), l = t("./zipEntry"), h = t("./support");
        function p(b) {
          this.files = [], this.loadOptions = b;
        }
        p.prototype = { checkSignature: function(b) {
          if (!this.reader.readAndCheckSignature(b)) {
            this.reader.index -= 4;
            var m = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + a.pretty(m) + ", expected " + a.pretty(b) + ")");
          }
        }, isSignature: function(b, m) {
          var u = this.reader.index;
          this.reader.setIndex(b);
          var y = this.reader.readString(4) === m;
          return this.reader.setIndex(u), y;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var b = this.reader.readData(this.zipCommentLength), m = h.uint8array ? "uint8array" : "array", u = a.transformTo(m, b);
          this.zipComment = this.loadOptions.decodeFileName(u);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var b, m, u, y = this.zip64EndOfCentralSize - 44; 0 < y; ) b = this.reader.readInt(2), m = this.reader.readInt(4), u = this.reader.readData(m), this.zip64ExtensibleData[b] = { id: b, length: m, value: u };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var b, m;
          for (b = 0; b < this.files.length; b++) m = this.files[b], this.reader.setIndex(m.localHeaderOffset), this.checkSignature(o.LOCAL_FILE_HEADER), m.readLocalPart(this.reader), m.handleUTF8(), m.processAttributes();
        }, readCentralDir: function() {
          var b;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(o.CENTRAL_FILE_HEADER); ) (b = new l({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(b);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var b = this.reader.lastIndexOfSignature(o.CENTRAL_DIRECTORY_END);
          if (b < 0) throw this.isSignature(0, o.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(b);
          var m = b;
          if (this.checkSignature(o.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === a.MAX_VALUE_16BITS || this.diskWithCentralDirStart === a.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === a.MAX_VALUE_16BITS || this.centralDirRecords === a.MAX_VALUE_16BITS || this.centralDirSize === a.MAX_VALUE_32BITS || this.centralDirOffset === a.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (b = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(b), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, o.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var u = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (u += 20, u += 12 + this.zip64EndOfCentralSize);
          var y = m - u;
          if (0 < y) this.isSignature(m, o.CENTRAL_FILE_HEADER) || (this.reader.zero = y);
          else if (y < 0) throw new Error("Corrupted zip: missing " + Math.abs(y) + " bytes.");
        }, prepareReader: function(b) {
          this.reader = i(b);
        }, load: function(b) {
          this.prepareReader(b), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, n.exports = p;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(t, n, s) {
        var i = t("./reader/readerFor"), a = t("./utils"), o = t("./compressedObject"), l = t("./crc32"), h = t("./utf8"), p = t("./compressions"), b = t("./support");
        function m(u, y) {
          this.options = u, this.loadOptions = y;
        }
        m.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(u) {
          var y, A;
          if (u.skip(22), this.fileNameLength = u.readInt(2), A = u.readInt(2), this.fileName = u.readData(this.fileNameLength), u.skip(A), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((y = (function(w) {
            for (var k in p) if (Object.prototype.hasOwnProperty.call(p, k) && p[k].magic === w) return p[k];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + a.pretty(this.compressionMethod) + " unknown (inner file : " + a.transformTo("string", this.fileName) + ")");
          this.decompressed = new o(this.compressedSize, this.uncompressedSize, this.crc32, y, u.readData(this.compressedSize));
        }, readCentralPart: function(u) {
          this.versionMadeBy = u.readInt(2), u.skip(2), this.bitFlag = u.readInt(2), this.compressionMethod = u.readString(2), this.date = u.readDate(), this.crc32 = u.readInt(4), this.compressedSize = u.readInt(4), this.uncompressedSize = u.readInt(4);
          var y = u.readInt(2);
          if (this.extraFieldsLength = u.readInt(2), this.fileCommentLength = u.readInt(2), this.diskNumberStart = u.readInt(2), this.internalFileAttributes = u.readInt(2), this.externalFileAttributes = u.readInt(4), this.localHeaderOffset = u.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          u.skip(y), this.readExtraFields(u), this.parseZIP64ExtraField(u), this.fileComment = u.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var u = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), u == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), u == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var u = i(this.extraFields[1].value);
            this.uncompressedSize === a.MAX_VALUE_32BITS && (this.uncompressedSize = u.readInt(8)), this.compressedSize === a.MAX_VALUE_32BITS && (this.compressedSize = u.readInt(8)), this.localHeaderOffset === a.MAX_VALUE_32BITS && (this.localHeaderOffset = u.readInt(8)), this.diskNumberStart === a.MAX_VALUE_32BITS && (this.diskNumberStart = u.readInt(4));
          }
        }, readExtraFields: function(u) {
          var y, A, w, k = u.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); u.index + 4 < k; ) y = u.readInt(2), A = u.readInt(2), w = u.readData(A), this.extraFields[y] = { id: y, length: A, value: w };
          u.setIndex(k);
        }, handleUTF8: function() {
          var u = b.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = h.utf8decode(this.fileName), this.fileCommentStr = h.utf8decode(this.fileComment);
          else {
            var y = this.findExtraFieldUnicodePath();
            if (y !== null) this.fileNameStr = y;
            else {
              var A = a.transformTo(u, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(A);
            }
            var w = this.findExtraFieldUnicodeComment();
            if (w !== null) this.fileCommentStr = w;
            else {
              var k = a.transformTo(u, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(k);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var u = this.extraFields[28789];
          if (u) {
            var y = i(u.value);
            return y.readInt(1) !== 1 || l(this.fileName) !== y.readInt(4) ? null : h.utf8decode(y.readData(u.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var u = this.extraFields[25461];
          if (u) {
            var y = i(u.value);
            return y.readInt(1) !== 1 || l(this.fileComment) !== y.readInt(4) ? null : h.utf8decode(y.readData(u.length - 5));
          }
          return null;
        } }, n.exports = m;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(t, n, s) {
        function i(y, A, w) {
          this.name = y, this.dir = w.dir, this.date = w.date, this.comment = w.comment, this.unixPermissions = w.unixPermissions, this.dosPermissions = w.dosPermissions, this._data = A, this._dataBinary = w.binary, this.options = { compression: w.compression, compressionOptions: w.compressionOptions };
        }
        var a = t("./stream/StreamHelper"), o = t("./stream/DataWorker"), l = t("./utf8"), h = t("./compressedObject"), p = t("./stream/GenericWorker");
        i.prototype = { internalStream: function(y) {
          var A = null, w = "string";
          try {
            if (!y) throw new Error("No output type specified.");
            var k = (w = y.toLowerCase()) === "string" || w === "text";
            w !== "binarystring" && w !== "text" || (w = "string"), A = this._decompressWorker();
            var _ = !this._dataBinary;
            _ && !k && (A = A.pipe(new l.Utf8EncodeWorker())), !_ && k && (A = A.pipe(new l.Utf8DecodeWorker()));
          } catch (B) {
            (A = new p("error")).error(B);
          }
          return new a(A, w, "");
        }, async: function(y, A) {
          return this.internalStream(y).accumulate(A);
        }, nodeStream: function(y, A) {
          return this.internalStream(y || "nodebuffer").toNodejsStream(A);
        }, _compressWorker: function(y, A) {
          if (this._data instanceof h && this._data.compression.magic === y.magic) return this._data.getCompressedWorker();
          var w = this._decompressWorker();
          return this._dataBinary || (w = w.pipe(new l.Utf8EncodeWorker())), h.createWorkerFrom(w, y, A);
        }, _decompressWorker: function() {
          return this._data instanceof h ? this._data.getContentWorker() : this._data instanceof p ? this._data : new o(this._data);
        } };
        for (var b = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], m = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, u = 0; u < b.length; u++) i.prototype[b[u]] = m;
        n.exports = i;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(t, n, s) {
        (function(i) {
          var a, o, l = i.MutationObserver || i.WebKitMutationObserver;
          if (l) {
            var h = 0, p = new l(y), b = i.document.createTextNode("");
            p.observe(b, { characterData: !0 }), a = function() {
              b.data = h = ++h % 2;
            };
          } else if (i.setImmediate || i.MessageChannel === void 0) a = "document" in i && "onreadystatechange" in i.document.createElement("script") ? function() {
            var A = i.document.createElement("script");
            A.onreadystatechange = function() {
              y(), A.onreadystatechange = null, A.parentNode.removeChild(A), A = null;
            }, i.document.documentElement.appendChild(A);
          } : function() {
            setTimeout(y, 0);
          };
          else {
            var m = new i.MessageChannel();
            m.port1.onmessage = y, a = function() {
              m.port2.postMessage(0);
            };
          }
          var u = [];
          function y() {
            var A, w;
            o = !0;
            for (var k = u.length; k; ) {
              for (w = u, u = [], A = -1; ++A < k; ) w[A]();
              k = u.length;
            }
            o = !1;
          }
          n.exports = function(A) {
            u.push(A) !== 1 || o || a();
          };
        }).call(this, typeof An < "u" ? An : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(t, n, s) {
        var i = t("immediate");
        function a() {
        }
        var o = {}, l = ["REJECTED"], h = ["FULFILLED"], p = ["PENDING"];
        function b(k) {
          if (typeof k != "function") throw new TypeError("resolver must be a function");
          this.state = p, this.queue = [], this.outcome = void 0, k !== a && A(this, k);
        }
        function m(k, _, B) {
          this.promise = k, typeof _ == "function" && (this.onFulfilled = _, this.callFulfilled = this.otherCallFulfilled), typeof B == "function" && (this.onRejected = B, this.callRejected = this.otherCallRejected);
        }
        function u(k, _, B) {
          i(function() {
            var C;
            try {
              C = _(B);
            } catch (S) {
              return o.reject(k, S);
            }
            C === k ? o.reject(k, new TypeError("Cannot resolve promise with itself")) : o.resolve(k, C);
          });
        }
        function y(k) {
          var _ = k && k.then;
          if (k && (typeof k == "object" || typeof k == "function") && typeof _ == "function") return function() {
            _.apply(k, arguments);
          };
        }
        function A(k, _) {
          var B = !1;
          function C(x) {
            B || (B = !0, o.reject(k, x));
          }
          function S(x) {
            B || (B = !0, o.resolve(k, x));
          }
          var z = w(function() {
            _(S, C);
          });
          z.status === "error" && C(z.value);
        }
        function w(k, _) {
          var B = {};
          try {
            B.value = k(_), B.status = "success";
          } catch (C) {
            B.status = "error", B.value = C;
          }
          return B;
        }
        (n.exports = b).prototype.finally = function(k) {
          if (typeof k != "function") return this;
          var _ = this.constructor;
          return this.then(function(B) {
            return _.resolve(k()).then(function() {
              return B;
            });
          }, function(B) {
            return _.resolve(k()).then(function() {
              throw B;
            });
          });
        }, b.prototype.catch = function(k) {
          return this.then(null, k);
        }, b.prototype.then = function(k, _) {
          if (typeof k != "function" && this.state === h || typeof _ != "function" && this.state === l) return this;
          var B = new this.constructor(a);
          return this.state !== p ? u(B, this.state === h ? k : _, this.outcome) : this.queue.push(new m(B, k, _)), B;
        }, m.prototype.callFulfilled = function(k) {
          o.resolve(this.promise, k);
        }, m.prototype.otherCallFulfilled = function(k) {
          u(this.promise, this.onFulfilled, k);
        }, m.prototype.callRejected = function(k) {
          o.reject(this.promise, k);
        }, m.prototype.otherCallRejected = function(k) {
          u(this.promise, this.onRejected, k);
        }, o.resolve = function(k, _) {
          var B = w(y, _);
          if (B.status === "error") return o.reject(k, B.value);
          var C = B.value;
          if (C) A(k, C);
          else {
            k.state = h, k.outcome = _;
            for (var S = -1, z = k.queue.length; ++S < z; ) k.queue[S].callFulfilled(_);
          }
          return k;
        }, o.reject = function(k, _) {
          k.state = l, k.outcome = _;
          for (var B = -1, C = k.queue.length; ++B < C; ) k.queue[B].callRejected(_);
          return k;
        }, b.resolve = function(k) {
          return k instanceof this ? k : o.resolve(new this(a), k);
        }, b.reject = function(k) {
          var _ = new this(a);
          return o.reject(_, k);
        }, b.all = function(k) {
          var _ = this;
          if (Object.prototype.toString.call(k) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var B = k.length, C = !1;
          if (!B) return this.resolve([]);
          for (var S = new Array(B), z = 0, x = -1, U = new this(a); ++x < B; ) Q(k[x], x);
          return U;
          function Q($, X) {
            _.resolve($).then(function(N) {
              S[X] = N, ++z !== B || C || (C = !0, o.resolve(U, S));
            }, function(N) {
              C || (C = !0, o.reject(U, N));
            });
          }
        }, b.race = function(k) {
          var _ = this;
          if (Object.prototype.toString.call(k) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var B = k.length, C = !1;
          if (!B) return this.resolve([]);
          for (var S = -1, z = new this(a); ++S < B; ) x = k[S], _.resolve(x).then(function(U) {
            C || (C = !0, o.resolve(z, U));
          }, function(U) {
            C || (C = !0, o.reject(z, U));
          });
          var x;
          return z;
        };
      }, { immediate: 36 }], 38: [function(t, n, s) {
        var i = {};
        (0, t("./lib/utils/common").assign)(i, t("./lib/deflate"), t("./lib/inflate"), t("./lib/zlib/constants")), n.exports = i;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(t, n, s) {
        var i = t("./zlib/deflate"), a = t("./utils/common"), o = t("./utils/strings"), l = t("./zlib/messages"), h = t("./zlib/zstream"), p = Object.prototype.toString, b = 0, m = -1, u = 0, y = 8;
        function A(k) {
          if (!(this instanceof A)) return new A(k);
          this.options = a.assign({ level: m, method: y, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: u, to: "" }, k || {});
          var _ = this.options;
          _.raw && 0 < _.windowBits ? _.windowBits = -_.windowBits : _.gzip && 0 < _.windowBits && _.windowBits < 16 && (_.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new h(), this.strm.avail_out = 0;
          var B = i.deflateInit2(this.strm, _.level, _.method, _.windowBits, _.memLevel, _.strategy);
          if (B !== b) throw new Error(l[B]);
          if (_.header && i.deflateSetHeader(this.strm, _.header), _.dictionary) {
            var C;
            if (C = typeof _.dictionary == "string" ? o.string2buf(_.dictionary) : p.call(_.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(_.dictionary) : _.dictionary, (B = i.deflateSetDictionary(this.strm, C)) !== b) throw new Error(l[B]);
            this._dict_set = !0;
          }
        }
        function w(k, _) {
          var B = new A(_);
          if (B.push(k, !0), B.err) throw B.msg || l[B.err];
          return B.result;
        }
        A.prototype.push = function(k, _) {
          var B, C, S = this.strm, z = this.options.chunkSize;
          if (this.ended) return !1;
          C = _ === ~~_ ? _ : _ === !0 ? 4 : 0, typeof k == "string" ? S.input = o.string2buf(k) : p.call(k) === "[object ArrayBuffer]" ? S.input = new Uint8Array(k) : S.input = k, S.next_in = 0, S.avail_in = S.input.length;
          do {
            if (S.avail_out === 0 && (S.output = new a.Buf8(z), S.next_out = 0, S.avail_out = z), (B = i.deflate(S, C)) !== 1 && B !== b) return this.onEnd(B), !(this.ended = !0);
            S.avail_out !== 0 && (S.avail_in !== 0 || C !== 4 && C !== 2) || (this.options.to === "string" ? this.onData(o.buf2binstring(a.shrinkBuf(S.output, S.next_out))) : this.onData(a.shrinkBuf(S.output, S.next_out)));
          } while ((0 < S.avail_in || S.avail_out === 0) && B !== 1);
          return C === 4 ? (B = i.deflateEnd(this.strm), this.onEnd(B), this.ended = !0, B === b) : C !== 2 || (this.onEnd(b), !(S.avail_out = 0));
        }, A.prototype.onData = function(k) {
          this.chunks.push(k);
        }, A.prototype.onEnd = function(k) {
          k === b && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = a.flattenChunks(this.chunks)), this.chunks = [], this.err = k, this.msg = this.strm.msg;
        }, s.Deflate = A, s.deflate = w, s.deflateRaw = function(k, _) {
          return (_ = _ || {}).raw = !0, w(k, _);
        }, s.gzip = function(k, _) {
          return (_ = _ || {}).gzip = !0, w(k, _);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(t, n, s) {
        var i = t("./zlib/inflate"), a = t("./utils/common"), o = t("./utils/strings"), l = t("./zlib/constants"), h = t("./zlib/messages"), p = t("./zlib/zstream"), b = t("./zlib/gzheader"), m = Object.prototype.toString;
        function u(A) {
          if (!(this instanceof u)) return new u(A);
          this.options = a.assign({ chunkSize: 16384, windowBits: 0, to: "" }, A || {});
          var w = this.options;
          w.raw && 0 <= w.windowBits && w.windowBits < 16 && (w.windowBits = -w.windowBits, w.windowBits === 0 && (w.windowBits = -15)), !(0 <= w.windowBits && w.windowBits < 16) || A && A.windowBits || (w.windowBits += 32), 15 < w.windowBits && w.windowBits < 48 && (15 & w.windowBits) == 0 && (w.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new p(), this.strm.avail_out = 0;
          var k = i.inflateInit2(this.strm, w.windowBits);
          if (k !== l.Z_OK) throw new Error(h[k]);
          this.header = new b(), i.inflateGetHeader(this.strm, this.header);
        }
        function y(A, w) {
          var k = new u(w);
          if (k.push(A, !0), k.err) throw k.msg || h[k.err];
          return k.result;
        }
        u.prototype.push = function(A, w) {
          var k, _, B, C, S, z, x = this.strm, U = this.options.chunkSize, Q = this.options.dictionary, $ = !1;
          if (this.ended) return !1;
          _ = w === ~~w ? w : w === !0 ? l.Z_FINISH : l.Z_NO_FLUSH, typeof A == "string" ? x.input = o.binstring2buf(A) : m.call(A) === "[object ArrayBuffer]" ? x.input = new Uint8Array(A) : x.input = A, x.next_in = 0, x.avail_in = x.input.length;
          do {
            if (x.avail_out === 0 && (x.output = new a.Buf8(U), x.next_out = 0, x.avail_out = U), (k = i.inflate(x, l.Z_NO_FLUSH)) === l.Z_NEED_DICT && Q && (z = typeof Q == "string" ? o.string2buf(Q) : m.call(Q) === "[object ArrayBuffer]" ? new Uint8Array(Q) : Q, k = i.inflateSetDictionary(this.strm, z)), k === l.Z_BUF_ERROR && $ === !0 && (k = l.Z_OK, $ = !1), k !== l.Z_STREAM_END && k !== l.Z_OK) return this.onEnd(k), !(this.ended = !0);
            x.next_out && (x.avail_out !== 0 && k !== l.Z_STREAM_END && (x.avail_in !== 0 || _ !== l.Z_FINISH && _ !== l.Z_SYNC_FLUSH) || (this.options.to === "string" ? (B = o.utf8border(x.output, x.next_out), C = x.next_out - B, S = o.buf2string(x.output, B), x.next_out = C, x.avail_out = U - C, C && a.arraySet(x.output, x.output, B, C, 0), this.onData(S)) : this.onData(a.shrinkBuf(x.output, x.next_out)))), x.avail_in === 0 && x.avail_out === 0 && ($ = !0);
          } while ((0 < x.avail_in || x.avail_out === 0) && k !== l.Z_STREAM_END);
          return k === l.Z_STREAM_END && (_ = l.Z_FINISH), _ === l.Z_FINISH ? (k = i.inflateEnd(this.strm), this.onEnd(k), this.ended = !0, k === l.Z_OK) : _ !== l.Z_SYNC_FLUSH || (this.onEnd(l.Z_OK), !(x.avail_out = 0));
        }, u.prototype.onData = function(A) {
          this.chunks.push(A);
        }, u.prototype.onEnd = function(A) {
          A === l.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = a.flattenChunks(this.chunks)), this.chunks = [], this.err = A, this.msg = this.strm.msg;
        }, s.Inflate = u, s.inflate = y, s.inflateRaw = function(A, w) {
          return (w = w || {}).raw = !0, y(A, w);
        }, s.ungzip = y;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(t, n, s) {
        var i = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        s.assign = function(l) {
          for (var h = Array.prototype.slice.call(arguments, 1); h.length; ) {
            var p = h.shift();
            if (p) {
              if (typeof p != "object") throw new TypeError(p + "must be non-object");
              for (var b in p) p.hasOwnProperty(b) && (l[b] = p[b]);
            }
          }
          return l;
        }, s.shrinkBuf = function(l, h) {
          return l.length === h ? l : l.subarray ? l.subarray(0, h) : (l.length = h, l);
        };
        var a = { arraySet: function(l, h, p, b, m) {
          if (h.subarray && l.subarray) l.set(h.subarray(p, p + b), m);
          else for (var u = 0; u < b; u++) l[m + u] = h[p + u];
        }, flattenChunks: function(l) {
          var h, p, b, m, u, y;
          for (h = b = 0, p = l.length; h < p; h++) b += l[h].length;
          for (y = new Uint8Array(b), h = m = 0, p = l.length; h < p; h++) u = l[h], y.set(u, m), m += u.length;
          return y;
        } }, o = { arraySet: function(l, h, p, b, m) {
          for (var u = 0; u < b; u++) l[m + u] = h[p + u];
        }, flattenChunks: function(l) {
          return [].concat.apply([], l);
        } };
        s.setTyped = function(l) {
          l ? (s.Buf8 = Uint8Array, s.Buf16 = Uint16Array, s.Buf32 = Int32Array, s.assign(s, a)) : (s.Buf8 = Array, s.Buf16 = Array, s.Buf32 = Array, s.assign(s, o));
        }, s.setTyped(i);
      }, {}], 42: [function(t, n, s) {
        var i = t("./common"), a = !0, o = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          a = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          o = !1;
        }
        for (var l = new i.Buf8(256), h = 0; h < 256; h++) l[h] = 252 <= h ? 6 : 248 <= h ? 5 : 240 <= h ? 4 : 224 <= h ? 3 : 192 <= h ? 2 : 1;
        function p(b, m) {
          if (m < 65537 && (b.subarray && o || !b.subarray && a)) return String.fromCharCode.apply(null, i.shrinkBuf(b, m));
          for (var u = "", y = 0; y < m; y++) u += String.fromCharCode(b[y]);
          return u;
        }
        l[254] = l[254] = 1, s.string2buf = function(b) {
          var m, u, y, A, w, k = b.length, _ = 0;
          for (A = 0; A < k; A++) (64512 & (u = b.charCodeAt(A))) == 55296 && A + 1 < k && (64512 & (y = b.charCodeAt(A + 1))) == 56320 && (u = 65536 + (u - 55296 << 10) + (y - 56320), A++), _ += u < 128 ? 1 : u < 2048 ? 2 : u < 65536 ? 3 : 4;
          for (m = new i.Buf8(_), A = w = 0; w < _; A++) (64512 & (u = b.charCodeAt(A))) == 55296 && A + 1 < k && (64512 & (y = b.charCodeAt(A + 1))) == 56320 && (u = 65536 + (u - 55296 << 10) + (y - 56320), A++), u < 128 ? m[w++] = u : (u < 2048 ? m[w++] = 192 | u >>> 6 : (u < 65536 ? m[w++] = 224 | u >>> 12 : (m[w++] = 240 | u >>> 18, m[w++] = 128 | u >>> 12 & 63), m[w++] = 128 | u >>> 6 & 63), m[w++] = 128 | 63 & u);
          return m;
        }, s.buf2binstring = function(b) {
          return p(b, b.length);
        }, s.binstring2buf = function(b) {
          for (var m = new i.Buf8(b.length), u = 0, y = m.length; u < y; u++) m[u] = b.charCodeAt(u);
          return m;
        }, s.buf2string = function(b, m) {
          var u, y, A, w, k = m || b.length, _ = new Array(2 * k);
          for (u = y = 0; u < k; ) if ((A = b[u++]) < 128) _[y++] = A;
          else if (4 < (w = l[A])) _[y++] = 65533, u += w - 1;
          else {
            for (A &= w === 2 ? 31 : w === 3 ? 15 : 7; 1 < w && u < k; ) A = A << 6 | 63 & b[u++], w--;
            1 < w ? _[y++] = 65533 : A < 65536 ? _[y++] = A : (A -= 65536, _[y++] = 55296 | A >> 10 & 1023, _[y++] = 56320 | 1023 & A);
          }
          return p(_, y);
        }, s.utf8border = function(b, m) {
          var u;
          for ((m = m || b.length) > b.length && (m = b.length), u = m - 1; 0 <= u && (192 & b[u]) == 128; ) u--;
          return u < 0 || u === 0 ? m : u + l[b[u]] > m ? u : m;
        };
      }, { "./common": 41 }], 43: [function(t, n, s) {
        n.exports = function(i, a, o, l) {
          for (var h = 65535 & i | 0, p = i >>> 16 & 65535 | 0, b = 0; o !== 0; ) {
            for (o -= b = 2e3 < o ? 2e3 : o; p = p + (h = h + a[l++] | 0) | 0, --b; ) ;
            h %= 65521, p %= 65521;
          }
          return h | p << 16 | 0;
        };
      }, {}], 44: [function(t, n, s) {
        n.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(t, n, s) {
        var i = (function() {
          for (var a, o = [], l = 0; l < 256; l++) {
            a = l;
            for (var h = 0; h < 8; h++) a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
            o[l] = a;
          }
          return o;
        })();
        n.exports = function(a, o, l, h) {
          var p = i, b = h + l;
          a ^= -1;
          for (var m = h; m < b; m++) a = a >>> 8 ^ p[255 & (a ^ o[m])];
          return -1 ^ a;
        };
      }, {}], 46: [function(t, n, s) {
        var i, a = t("../utils/common"), o = t("./trees"), l = t("./adler32"), h = t("./crc32"), p = t("./messages"), b = 0, m = 4, u = 0, y = -2, A = -1, w = 4, k = 2, _ = 8, B = 9, C = 286, S = 30, z = 19, x = 2 * C + 1, U = 15, Q = 3, $ = 258, X = $ + Q + 1, N = 42, R = 113, g = 1, G = 2, oe = 3, L = 4;
        function le(c, Z) {
          return c.msg = p[Z], Z;
        }
        function ee(c) {
          return (c << 1) - (4 < c ? 9 : 0);
        }
        function de(c) {
          for (var Z = c.length; 0 <= --Z; ) c[Z] = 0;
        }
        function H(c) {
          var Z = c.state, j = Z.pending;
          j > c.avail_out && (j = c.avail_out), j !== 0 && (a.arraySet(c.output, Z.pending_buf, Z.pending_out, j, c.next_out), c.next_out += j, Z.pending_out += j, c.total_out += j, c.avail_out -= j, Z.pending -= j, Z.pending === 0 && (Z.pending_out = 0));
        }
        function O(c, Z) {
          o._tr_flush_block(c, 0 <= c.block_start ? c.block_start : -1, c.strstart - c.block_start, Z), c.block_start = c.strstart, H(c.strm);
        }
        function K(c, Z) {
          c.pending_buf[c.pending++] = Z;
        }
        function ae(c, Z) {
          c.pending_buf[c.pending++] = Z >>> 8 & 255, c.pending_buf[c.pending++] = 255 & Z;
        }
        function se(c, Z) {
          var j, E, I = c.max_chain_length, P = c.strstart, te = c.prev_length, re = c.nice_match, F = c.strstart > c.w_size - X ? c.strstart - (c.w_size - X) : 0, J = c.window, ie = c.w_mask, ne = c.prev, fe = c.strstart + $, Ie = J[P + te - 1], me = J[P + te];
          c.prev_length >= c.good_match && (I >>= 2), re > c.lookahead && (re = c.lookahead);
          do
            if (J[(j = Z) + te] === me && J[j + te - 1] === Ie && J[j] === J[P] && J[++j] === J[P + 1]) {
              P += 2, j++;
              do
                ;
              while (J[++P] === J[++j] && J[++P] === J[++j] && J[++P] === J[++j] && J[++P] === J[++j] && J[++P] === J[++j] && J[++P] === J[++j] && J[++P] === J[++j] && J[++P] === J[++j] && P < fe);
              if (E = $ - (fe - P), P = fe - $, te < E) {
                if (c.match_start = Z, re <= (te = E)) break;
                Ie = J[P + te - 1], me = J[P + te];
              }
            }
          while ((Z = ne[Z & ie]) > F && --I != 0);
          return te <= c.lookahead ? te : c.lookahead;
        }
        function we(c) {
          var Z, j, E, I, P, te, re, F, J, ie, ne = c.w_size;
          do {
            if (I = c.window_size - c.lookahead - c.strstart, c.strstart >= ne + (ne - X)) {
              for (a.arraySet(c.window, c.window, ne, ne, 0), c.match_start -= ne, c.strstart -= ne, c.block_start -= ne, Z = j = c.hash_size; E = c.head[--Z], c.head[Z] = ne <= E ? E - ne : 0, --j; ) ;
              for (Z = j = ne; E = c.prev[--Z], c.prev[Z] = ne <= E ? E - ne : 0, --j; ) ;
              I += ne;
            }
            if (c.strm.avail_in === 0) break;
            if (te = c.strm, re = c.window, F = c.strstart + c.lookahead, J = I, ie = void 0, ie = te.avail_in, J < ie && (ie = J), j = ie === 0 ? 0 : (te.avail_in -= ie, a.arraySet(re, te.input, te.next_in, ie, F), te.state.wrap === 1 ? te.adler = l(te.adler, re, ie, F) : te.state.wrap === 2 && (te.adler = h(te.adler, re, ie, F)), te.next_in += ie, te.total_in += ie, ie), c.lookahead += j, c.lookahead + c.insert >= Q) for (P = c.strstart - c.insert, c.ins_h = c.window[P], c.ins_h = (c.ins_h << c.hash_shift ^ c.window[P + 1]) & c.hash_mask; c.insert && (c.ins_h = (c.ins_h << c.hash_shift ^ c.window[P + Q - 1]) & c.hash_mask, c.prev[P & c.w_mask] = c.head[c.ins_h], c.head[c.ins_h] = P, P++, c.insert--, !(c.lookahead + c.insert < Q)); ) ;
          } while (c.lookahead < X && c.strm.avail_in !== 0);
        }
        function Ae(c, Z) {
          for (var j, E; ; ) {
            if (c.lookahead < X) {
              if (we(c), c.lookahead < X && Z === b) return g;
              if (c.lookahead === 0) break;
            }
            if (j = 0, c.lookahead >= Q && (c.ins_h = (c.ins_h << c.hash_shift ^ c.window[c.strstart + Q - 1]) & c.hash_mask, j = c.prev[c.strstart & c.w_mask] = c.head[c.ins_h], c.head[c.ins_h] = c.strstart), j !== 0 && c.strstart - j <= c.w_size - X && (c.match_length = se(c, j)), c.match_length >= Q) if (E = o._tr_tally(c, c.strstart - c.match_start, c.match_length - Q), c.lookahead -= c.match_length, c.match_length <= c.max_lazy_match && c.lookahead >= Q) {
              for (c.match_length--; c.strstart++, c.ins_h = (c.ins_h << c.hash_shift ^ c.window[c.strstart + Q - 1]) & c.hash_mask, j = c.prev[c.strstart & c.w_mask] = c.head[c.ins_h], c.head[c.ins_h] = c.strstart, --c.match_length != 0; ) ;
              c.strstart++;
            } else c.strstart += c.match_length, c.match_length = 0, c.ins_h = c.window[c.strstart], c.ins_h = (c.ins_h << c.hash_shift ^ c.window[c.strstart + 1]) & c.hash_mask;
            else E = o._tr_tally(c, 0, c.window[c.strstart]), c.lookahead--, c.strstart++;
            if (E && (O(c, !1), c.strm.avail_out === 0)) return g;
          }
          return c.insert = c.strstart < Q - 1 ? c.strstart : Q - 1, Z === m ? (O(c, !0), c.strm.avail_out === 0 ? oe : L) : c.last_lit && (O(c, !1), c.strm.avail_out === 0) ? g : G;
        }
        function Y(c, Z) {
          for (var j, E, I; ; ) {
            if (c.lookahead < X) {
              if (we(c), c.lookahead < X && Z === b) return g;
              if (c.lookahead === 0) break;
            }
            if (j = 0, c.lookahead >= Q && (c.ins_h = (c.ins_h << c.hash_shift ^ c.window[c.strstart + Q - 1]) & c.hash_mask, j = c.prev[c.strstart & c.w_mask] = c.head[c.ins_h], c.head[c.ins_h] = c.strstart), c.prev_length = c.match_length, c.prev_match = c.match_start, c.match_length = Q - 1, j !== 0 && c.prev_length < c.max_lazy_match && c.strstart - j <= c.w_size - X && (c.match_length = se(c, j), c.match_length <= 5 && (c.strategy === 1 || c.match_length === Q && 4096 < c.strstart - c.match_start) && (c.match_length = Q - 1)), c.prev_length >= Q && c.match_length <= c.prev_length) {
              for (I = c.strstart + c.lookahead - Q, E = o._tr_tally(c, c.strstart - 1 - c.prev_match, c.prev_length - Q), c.lookahead -= c.prev_length - 1, c.prev_length -= 2; ++c.strstart <= I && (c.ins_h = (c.ins_h << c.hash_shift ^ c.window[c.strstart + Q - 1]) & c.hash_mask, j = c.prev[c.strstart & c.w_mask] = c.head[c.ins_h], c.head[c.ins_h] = c.strstart), --c.prev_length != 0; ) ;
              if (c.match_available = 0, c.match_length = Q - 1, c.strstart++, E && (O(c, !1), c.strm.avail_out === 0)) return g;
            } else if (c.match_available) {
              if ((E = o._tr_tally(c, 0, c.window[c.strstart - 1])) && O(c, !1), c.strstart++, c.lookahead--, c.strm.avail_out === 0) return g;
            } else c.match_available = 1, c.strstart++, c.lookahead--;
          }
          return c.match_available && (E = o._tr_tally(c, 0, c.window[c.strstart - 1]), c.match_available = 0), c.insert = c.strstart < Q - 1 ? c.strstart : Q - 1, Z === m ? (O(c, !0), c.strm.avail_out === 0 ? oe : L) : c.last_lit && (O(c, !1), c.strm.avail_out === 0) ? g : G;
        }
        function ue(c, Z, j, E, I) {
          this.good_length = c, this.max_lazy = Z, this.nice_length = j, this.max_chain = E, this.func = I;
        }
        function Ce() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = _, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new a.Buf16(2 * x), this.dyn_dtree = new a.Buf16(2 * (2 * S + 1)), this.bl_tree = new a.Buf16(2 * (2 * z + 1)), de(this.dyn_ltree), de(this.dyn_dtree), de(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new a.Buf16(U + 1), this.heap = new a.Buf16(2 * C + 1), de(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new a.Buf16(2 * C + 1), de(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function _e(c) {
          var Z;
          return c && c.state ? (c.total_in = c.total_out = 0, c.data_type = k, (Z = c.state).pending = 0, Z.pending_out = 0, Z.wrap < 0 && (Z.wrap = -Z.wrap), Z.status = Z.wrap ? N : R, c.adler = Z.wrap === 2 ? 0 : 1, Z.last_flush = b, o._tr_init(Z), u) : le(c, y);
        }
        function Ne(c) {
          var Z = _e(c);
          return Z === u && (function(j) {
            j.window_size = 2 * j.w_size, de(j.head), j.max_lazy_match = i[j.level].max_lazy, j.good_match = i[j.level].good_length, j.nice_match = i[j.level].nice_length, j.max_chain_length = i[j.level].max_chain, j.strstart = 0, j.block_start = 0, j.lookahead = 0, j.insert = 0, j.match_length = j.prev_length = Q - 1, j.match_available = 0, j.ins_h = 0;
          })(c.state), Z;
        }
        function De(c, Z, j, E, I, P) {
          if (!c) return y;
          var te = 1;
          if (Z === A && (Z = 6), E < 0 ? (te = 0, E = -E) : 15 < E && (te = 2, E -= 16), I < 1 || B < I || j !== _ || E < 8 || 15 < E || Z < 0 || 9 < Z || P < 0 || w < P) return le(c, y);
          E === 8 && (E = 9);
          var re = new Ce();
          return (c.state = re).strm = c, re.wrap = te, re.gzhead = null, re.w_bits = E, re.w_size = 1 << re.w_bits, re.w_mask = re.w_size - 1, re.hash_bits = I + 7, re.hash_size = 1 << re.hash_bits, re.hash_mask = re.hash_size - 1, re.hash_shift = ~~((re.hash_bits + Q - 1) / Q), re.window = new a.Buf8(2 * re.w_size), re.head = new a.Buf16(re.hash_size), re.prev = new a.Buf16(re.w_size), re.lit_bufsize = 1 << I + 6, re.pending_buf_size = 4 * re.lit_bufsize, re.pending_buf = new a.Buf8(re.pending_buf_size), re.d_buf = 1 * re.lit_bufsize, re.l_buf = 3 * re.lit_bufsize, re.level = Z, re.strategy = P, re.method = j, Ne(c);
        }
        i = [new ue(0, 0, 0, 0, function(c, Z) {
          var j = 65535;
          for (j > c.pending_buf_size - 5 && (j = c.pending_buf_size - 5); ; ) {
            if (c.lookahead <= 1) {
              if (we(c), c.lookahead === 0 && Z === b) return g;
              if (c.lookahead === 0) break;
            }
            c.strstart += c.lookahead, c.lookahead = 0;
            var E = c.block_start + j;
            if ((c.strstart === 0 || c.strstart >= E) && (c.lookahead = c.strstart - E, c.strstart = E, O(c, !1), c.strm.avail_out === 0) || c.strstart - c.block_start >= c.w_size - X && (O(c, !1), c.strm.avail_out === 0)) return g;
          }
          return c.insert = 0, Z === m ? (O(c, !0), c.strm.avail_out === 0 ? oe : L) : (c.strstart > c.block_start && (O(c, !1), c.strm.avail_out), g);
        }), new ue(4, 4, 8, 4, Ae), new ue(4, 5, 16, 8, Ae), new ue(4, 6, 32, 32, Ae), new ue(4, 4, 16, 16, Y), new ue(8, 16, 32, 32, Y), new ue(8, 16, 128, 128, Y), new ue(8, 32, 128, 256, Y), new ue(32, 128, 258, 1024, Y), new ue(32, 258, 258, 4096, Y)], s.deflateInit = function(c, Z) {
          return De(c, Z, _, 15, 8, 0);
        }, s.deflateInit2 = De, s.deflateReset = Ne, s.deflateResetKeep = _e, s.deflateSetHeader = function(c, Z) {
          return c && c.state ? c.state.wrap !== 2 ? y : (c.state.gzhead = Z, u) : y;
        }, s.deflate = function(c, Z) {
          var j, E, I, P;
          if (!c || !c.state || 5 < Z || Z < 0) return c ? le(c, y) : y;
          if (E = c.state, !c.output || !c.input && c.avail_in !== 0 || E.status === 666 && Z !== m) return le(c, c.avail_out === 0 ? -5 : y);
          if (E.strm = c, j = E.last_flush, E.last_flush = Z, E.status === N) if (E.wrap === 2) c.adler = 0, K(E, 31), K(E, 139), K(E, 8), E.gzhead ? (K(E, (E.gzhead.text ? 1 : 0) + (E.gzhead.hcrc ? 2 : 0) + (E.gzhead.extra ? 4 : 0) + (E.gzhead.name ? 8 : 0) + (E.gzhead.comment ? 16 : 0)), K(E, 255 & E.gzhead.time), K(E, E.gzhead.time >> 8 & 255), K(E, E.gzhead.time >> 16 & 255), K(E, E.gzhead.time >> 24 & 255), K(E, E.level === 9 ? 2 : 2 <= E.strategy || E.level < 2 ? 4 : 0), K(E, 255 & E.gzhead.os), E.gzhead.extra && E.gzhead.extra.length && (K(E, 255 & E.gzhead.extra.length), K(E, E.gzhead.extra.length >> 8 & 255)), E.gzhead.hcrc && (c.adler = h(c.adler, E.pending_buf, E.pending, 0)), E.gzindex = 0, E.status = 69) : (K(E, 0), K(E, 0), K(E, 0), K(E, 0), K(E, 0), K(E, E.level === 9 ? 2 : 2 <= E.strategy || E.level < 2 ? 4 : 0), K(E, 3), E.status = R);
          else {
            var te = _ + (E.w_bits - 8 << 4) << 8;
            te |= (2 <= E.strategy || E.level < 2 ? 0 : E.level < 6 ? 1 : E.level === 6 ? 2 : 3) << 6, E.strstart !== 0 && (te |= 32), te += 31 - te % 31, E.status = R, ae(E, te), E.strstart !== 0 && (ae(E, c.adler >>> 16), ae(E, 65535 & c.adler)), c.adler = 1;
          }
          if (E.status === 69) if (E.gzhead.extra) {
            for (I = E.pending; E.gzindex < (65535 & E.gzhead.extra.length) && (E.pending !== E.pending_buf_size || (E.gzhead.hcrc && E.pending > I && (c.adler = h(c.adler, E.pending_buf, E.pending - I, I)), H(c), I = E.pending, E.pending !== E.pending_buf_size)); ) K(E, 255 & E.gzhead.extra[E.gzindex]), E.gzindex++;
            E.gzhead.hcrc && E.pending > I && (c.adler = h(c.adler, E.pending_buf, E.pending - I, I)), E.gzindex === E.gzhead.extra.length && (E.gzindex = 0, E.status = 73);
          } else E.status = 73;
          if (E.status === 73) if (E.gzhead.name) {
            I = E.pending;
            do {
              if (E.pending === E.pending_buf_size && (E.gzhead.hcrc && E.pending > I && (c.adler = h(c.adler, E.pending_buf, E.pending - I, I)), H(c), I = E.pending, E.pending === E.pending_buf_size)) {
                P = 1;
                break;
              }
              P = E.gzindex < E.gzhead.name.length ? 255 & E.gzhead.name.charCodeAt(E.gzindex++) : 0, K(E, P);
            } while (P !== 0);
            E.gzhead.hcrc && E.pending > I && (c.adler = h(c.adler, E.pending_buf, E.pending - I, I)), P === 0 && (E.gzindex = 0, E.status = 91);
          } else E.status = 91;
          if (E.status === 91) if (E.gzhead.comment) {
            I = E.pending;
            do {
              if (E.pending === E.pending_buf_size && (E.gzhead.hcrc && E.pending > I && (c.adler = h(c.adler, E.pending_buf, E.pending - I, I)), H(c), I = E.pending, E.pending === E.pending_buf_size)) {
                P = 1;
                break;
              }
              P = E.gzindex < E.gzhead.comment.length ? 255 & E.gzhead.comment.charCodeAt(E.gzindex++) : 0, K(E, P);
            } while (P !== 0);
            E.gzhead.hcrc && E.pending > I && (c.adler = h(c.adler, E.pending_buf, E.pending - I, I)), P === 0 && (E.status = 103);
          } else E.status = 103;
          if (E.status === 103 && (E.gzhead.hcrc ? (E.pending + 2 > E.pending_buf_size && H(c), E.pending + 2 <= E.pending_buf_size && (K(E, 255 & c.adler), K(E, c.adler >> 8 & 255), c.adler = 0, E.status = R)) : E.status = R), E.pending !== 0) {
            if (H(c), c.avail_out === 0) return E.last_flush = -1, u;
          } else if (c.avail_in === 0 && ee(Z) <= ee(j) && Z !== m) return le(c, -5);
          if (E.status === 666 && c.avail_in !== 0) return le(c, -5);
          if (c.avail_in !== 0 || E.lookahead !== 0 || Z !== b && E.status !== 666) {
            var re = E.strategy === 2 ? (function(F, J) {
              for (var ie; ; ) {
                if (F.lookahead === 0 && (we(F), F.lookahead === 0)) {
                  if (J === b) return g;
                  break;
                }
                if (F.match_length = 0, ie = o._tr_tally(F, 0, F.window[F.strstart]), F.lookahead--, F.strstart++, ie && (O(F, !1), F.strm.avail_out === 0)) return g;
              }
              return F.insert = 0, J === m ? (O(F, !0), F.strm.avail_out === 0 ? oe : L) : F.last_lit && (O(F, !1), F.strm.avail_out === 0) ? g : G;
            })(E, Z) : E.strategy === 3 ? (function(F, J) {
              for (var ie, ne, fe, Ie, me = F.window; ; ) {
                if (F.lookahead <= $) {
                  if (we(F), F.lookahead <= $ && J === b) return g;
                  if (F.lookahead === 0) break;
                }
                if (F.match_length = 0, F.lookahead >= Q && 0 < F.strstart && (ne = me[fe = F.strstart - 1]) === me[++fe] && ne === me[++fe] && ne === me[++fe]) {
                  Ie = F.strstart + $;
                  do
                    ;
                  while (ne === me[++fe] && ne === me[++fe] && ne === me[++fe] && ne === me[++fe] && ne === me[++fe] && ne === me[++fe] && ne === me[++fe] && ne === me[++fe] && fe < Ie);
                  F.match_length = $ - (Ie - fe), F.match_length > F.lookahead && (F.match_length = F.lookahead);
                }
                if (F.match_length >= Q ? (ie = o._tr_tally(F, 1, F.match_length - Q), F.lookahead -= F.match_length, F.strstart += F.match_length, F.match_length = 0) : (ie = o._tr_tally(F, 0, F.window[F.strstart]), F.lookahead--, F.strstart++), ie && (O(F, !1), F.strm.avail_out === 0)) return g;
              }
              return F.insert = 0, J === m ? (O(F, !0), F.strm.avail_out === 0 ? oe : L) : F.last_lit && (O(F, !1), F.strm.avail_out === 0) ? g : G;
            })(E, Z) : i[E.level].func(E, Z);
            if (re !== oe && re !== L || (E.status = 666), re === g || re === oe) return c.avail_out === 0 && (E.last_flush = -1), u;
            if (re === G && (Z === 1 ? o._tr_align(E) : Z !== 5 && (o._tr_stored_block(E, 0, 0, !1), Z === 3 && (de(E.head), E.lookahead === 0 && (E.strstart = 0, E.block_start = 0, E.insert = 0))), H(c), c.avail_out === 0)) return E.last_flush = -1, u;
          }
          return Z !== m ? u : E.wrap <= 0 ? 1 : (E.wrap === 2 ? (K(E, 255 & c.adler), K(E, c.adler >> 8 & 255), K(E, c.adler >> 16 & 255), K(E, c.adler >> 24 & 255), K(E, 255 & c.total_in), K(E, c.total_in >> 8 & 255), K(E, c.total_in >> 16 & 255), K(E, c.total_in >> 24 & 255)) : (ae(E, c.adler >>> 16), ae(E, 65535 & c.adler)), H(c), 0 < E.wrap && (E.wrap = -E.wrap), E.pending !== 0 ? u : 1);
        }, s.deflateEnd = function(c) {
          var Z;
          return c && c.state ? (Z = c.state.status) !== N && Z !== 69 && Z !== 73 && Z !== 91 && Z !== 103 && Z !== R && Z !== 666 ? le(c, y) : (c.state = null, Z === R ? le(c, -3) : u) : y;
        }, s.deflateSetDictionary = function(c, Z) {
          var j, E, I, P, te, re, F, J, ie = Z.length;
          if (!c || !c.state || (P = (j = c.state).wrap) === 2 || P === 1 && j.status !== N || j.lookahead) return y;
          for (P === 1 && (c.adler = l(c.adler, Z, ie, 0)), j.wrap = 0, ie >= j.w_size && (P === 0 && (de(j.head), j.strstart = 0, j.block_start = 0, j.insert = 0), J = new a.Buf8(j.w_size), a.arraySet(J, Z, ie - j.w_size, j.w_size, 0), Z = J, ie = j.w_size), te = c.avail_in, re = c.next_in, F = c.input, c.avail_in = ie, c.next_in = 0, c.input = Z, we(j); j.lookahead >= Q; ) {
            for (E = j.strstart, I = j.lookahead - (Q - 1); j.ins_h = (j.ins_h << j.hash_shift ^ j.window[E + Q - 1]) & j.hash_mask, j.prev[E & j.w_mask] = j.head[j.ins_h], j.head[j.ins_h] = E, E++, --I; ) ;
            j.strstart = E, j.lookahead = Q - 1, we(j);
          }
          return j.strstart += j.lookahead, j.block_start = j.strstart, j.insert = j.lookahead, j.lookahead = 0, j.match_length = j.prev_length = Q - 1, j.match_available = 0, c.next_in = re, c.input = F, c.avail_in = te, j.wrap = P, u;
        }, s.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(t, n, s) {
        n.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(t, n, s) {
        n.exports = function(i, a) {
          var o, l, h, p, b, m, u, y, A, w, k, _, B, C, S, z, x, U, Q, $, X, N, R, g, G;
          o = i.state, l = i.next_in, g = i.input, h = l + (i.avail_in - 5), p = i.next_out, G = i.output, b = p - (a - i.avail_out), m = p + (i.avail_out - 257), u = o.dmax, y = o.wsize, A = o.whave, w = o.wnext, k = o.window, _ = o.hold, B = o.bits, C = o.lencode, S = o.distcode, z = (1 << o.lenbits) - 1, x = (1 << o.distbits) - 1;
          e: do {
            B < 15 && (_ += g[l++] << B, B += 8, _ += g[l++] << B, B += 8), U = C[_ & z];
            t: for (; ; ) {
              if (_ >>>= Q = U >>> 24, B -= Q, (Q = U >>> 16 & 255) === 0) G[p++] = 65535 & U;
              else {
                if (!(16 & Q)) {
                  if ((64 & Q) == 0) {
                    U = C[(65535 & U) + (_ & (1 << Q) - 1)];
                    continue t;
                  }
                  if (32 & Q) {
                    o.mode = 12;
                    break e;
                  }
                  i.msg = "invalid literal/length code", o.mode = 30;
                  break e;
                }
                $ = 65535 & U, (Q &= 15) && (B < Q && (_ += g[l++] << B, B += 8), $ += _ & (1 << Q) - 1, _ >>>= Q, B -= Q), B < 15 && (_ += g[l++] << B, B += 8, _ += g[l++] << B, B += 8), U = S[_ & x];
                r: for (; ; ) {
                  if (_ >>>= Q = U >>> 24, B -= Q, !(16 & (Q = U >>> 16 & 255))) {
                    if ((64 & Q) == 0) {
                      U = S[(65535 & U) + (_ & (1 << Q) - 1)];
                      continue r;
                    }
                    i.msg = "invalid distance code", o.mode = 30;
                    break e;
                  }
                  if (X = 65535 & U, B < (Q &= 15) && (_ += g[l++] << B, (B += 8) < Q && (_ += g[l++] << B, B += 8)), u < (X += _ & (1 << Q) - 1)) {
                    i.msg = "invalid distance too far back", o.mode = 30;
                    break e;
                  }
                  if (_ >>>= Q, B -= Q, (Q = p - b) < X) {
                    if (A < (Q = X - Q) && o.sane) {
                      i.msg = "invalid distance too far back", o.mode = 30;
                      break e;
                    }
                    if (R = k, (N = 0) === w) {
                      if (N += y - Q, Q < $) {
                        for ($ -= Q; G[p++] = k[N++], --Q; ) ;
                        N = p - X, R = G;
                      }
                    } else if (w < Q) {
                      if (N += y + w - Q, (Q -= w) < $) {
                        for ($ -= Q; G[p++] = k[N++], --Q; ) ;
                        if (N = 0, w < $) {
                          for ($ -= Q = w; G[p++] = k[N++], --Q; ) ;
                          N = p - X, R = G;
                        }
                      }
                    } else if (N += w - Q, Q < $) {
                      for ($ -= Q; G[p++] = k[N++], --Q; ) ;
                      N = p - X, R = G;
                    }
                    for (; 2 < $; ) G[p++] = R[N++], G[p++] = R[N++], G[p++] = R[N++], $ -= 3;
                    $ && (G[p++] = R[N++], 1 < $ && (G[p++] = R[N++]));
                  } else {
                    for (N = p - X; G[p++] = G[N++], G[p++] = G[N++], G[p++] = G[N++], 2 < ($ -= 3); ) ;
                    $ && (G[p++] = G[N++], 1 < $ && (G[p++] = G[N++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (l < h && p < m);
          l -= $ = B >> 3, _ &= (1 << (B -= $ << 3)) - 1, i.next_in = l, i.next_out = p, i.avail_in = l < h ? h - l + 5 : 5 - (l - h), i.avail_out = p < m ? m - p + 257 : 257 - (p - m), o.hold = _, o.bits = B;
        };
      }, {}], 49: [function(t, n, s) {
        var i = t("../utils/common"), a = t("./adler32"), o = t("./crc32"), l = t("./inffast"), h = t("./inftrees"), p = 1, b = 2, m = 0, u = -2, y = 1, A = 852, w = 592;
        function k(N) {
          return (N >>> 24 & 255) + (N >>> 8 & 65280) + ((65280 & N) << 8) + ((255 & N) << 24);
        }
        function _() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new i.Buf16(320), this.work = new i.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function B(N) {
          var R;
          return N && N.state ? (R = N.state, N.total_in = N.total_out = R.total = 0, N.msg = "", R.wrap && (N.adler = 1 & R.wrap), R.mode = y, R.last = 0, R.havedict = 0, R.dmax = 32768, R.head = null, R.hold = 0, R.bits = 0, R.lencode = R.lendyn = new i.Buf32(A), R.distcode = R.distdyn = new i.Buf32(w), R.sane = 1, R.back = -1, m) : u;
        }
        function C(N) {
          var R;
          return N && N.state ? ((R = N.state).wsize = 0, R.whave = 0, R.wnext = 0, B(N)) : u;
        }
        function S(N, R) {
          var g, G;
          return N && N.state ? (G = N.state, R < 0 ? (g = 0, R = -R) : (g = 1 + (R >> 4), R < 48 && (R &= 15)), R && (R < 8 || 15 < R) ? u : (G.window !== null && G.wbits !== R && (G.window = null), G.wrap = g, G.wbits = R, C(N))) : u;
        }
        function z(N, R) {
          var g, G;
          return N ? (G = new _(), (N.state = G).window = null, (g = S(N, R)) !== m && (N.state = null), g) : u;
        }
        var x, U, Q = !0;
        function $(N) {
          if (Q) {
            var R;
            for (x = new i.Buf32(512), U = new i.Buf32(32), R = 0; R < 144; ) N.lens[R++] = 8;
            for (; R < 256; ) N.lens[R++] = 9;
            for (; R < 280; ) N.lens[R++] = 7;
            for (; R < 288; ) N.lens[R++] = 8;
            for (h(p, N.lens, 0, 288, x, 0, N.work, { bits: 9 }), R = 0; R < 32; ) N.lens[R++] = 5;
            h(b, N.lens, 0, 32, U, 0, N.work, { bits: 5 }), Q = !1;
          }
          N.lencode = x, N.lenbits = 9, N.distcode = U, N.distbits = 5;
        }
        function X(N, R, g, G) {
          var oe, L = N.state;
          return L.window === null && (L.wsize = 1 << L.wbits, L.wnext = 0, L.whave = 0, L.window = new i.Buf8(L.wsize)), G >= L.wsize ? (i.arraySet(L.window, R, g - L.wsize, L.wsize, 0), L.wnext = 0, L.whave = L.wsize) : (G < (oe = L.wsize - L.wnext) && (oe = G), i.arraySet(L.window, R, g - G, oe, L.wnext), (G -= oe) ? (i.arraySet(L.window, R, g - G, G, 0), L.wnext = G, L.whave = L.wsize) : (L.wnext += oe, L.wnext === L.wsize && (L.wnext = 0), L.whave < L.wsize && (L.whave += oe))), 0;
        }
        s.inflateReset = C, s.inflateReset2 = S, s.inflateResetKeep = B, s.inflateInit = function(N) {
          return z(N, 15);
        }, s.inflateInit2 = z, s.inflate = function(N, R) {
          var g, G, oe, L, le, ee, de, H, O, K, ae, se, we, Ae, Y, ue, Ce, _e, Ne, De, c, Z, j, E, I = 0, P = new i.Buf8(4), te = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!N || !N.state || !N.output || !N.input && N.avail_in !== 0) return u;
          (g = N.state).mode === 12 && (g.mode = 13), le = N.next_out, oe = N.output, de = N.avail_out, L = N.next_in, G = N.input, ee = N.avail_in, H = g.hold, O = g.bits, K = ee, ae = de, Z = m;
          e: for (; ; ) switch (g.mode) {
            case y:
              if (g.wrap === 0) {
                g.mode = 13;
                break;
              }
              for (; O < 16; ) {
                if (ee === 0) break e;
                ee--, H += G[L++] << O, O += 8;
              }
              if (2 & g.wrap && H === 35615) {
                P[g.check = 0] = 255 & H, P[1] = H >>> 8 & 255, g.check = o(g.check, P, 2, 0), O = H = 0, g.mode = 2;
                break;
              }
              if (g.flags = 0, g.head && (g.head.done = !1), !(1 & g.wrap) || (((255 & H) << 8) + (H >> 8)) % 31) {
                N.msg = "incorrect header check", g.mode = 30;
                break;
              }
              if ((15 & H) != 8) {
                N.msg = "unknown compression method", g.mode = 30;
                break;
              }
              if (O -= 4, c = 8 + (15 & (H >>>= 4)), g.wbits === 0) g.wbits = c;
              else if (c > g.wbits) {
                N.msg = "invalid window size", g.mode = 30;
                break;
              }
              g.dmax = 1 << c, N.adler = g.check = 1, g.mode = 512 & H ? 10 : 12, O = H = 0;
              break;
            case 2:
              for (; O < 16; ) {
                if (ee === 0) break e;
                ee--, H += G[L++] << O, O += 8;
              }
              if (g.flags = H, (255 & g.flags) != 8) {
                N.msg = "unknown compression method", g.mode = 30;
                break;
              }
              if (57344 & g.flags) {
                N.msg = "unknown header flags set", g.mode = 30;
                break;
              }
              g.head && (g.head.text = H >> 8 & 1), 512 & g.flags && (P[0] = 255 & H, P[1] = H >>> 8 & 255, g.check = o(g.check, P, 2, 0)), O = H = 0, g.mode = 3;
            case 3:
              for (; O < 32; ) {
                if (ee === 0) break e;
                ee--, H += G[L++] << O, O += 8;
              }
              g.head && (g.head.time = H), 512 & g.flags && (P[0] = 255 & H, P[1] = H >>> 8 & 255, P[2] = H >>> 16 & 255, P[3] = H >>> 24 & 255, g.check = o(g.check, P, 4, 0)), O = H = 0, g.mode = 4;
            case 4:
              for (; O < 16; ) {
                if (ee === 0) break e;
                ee--, H += G[L++] << O, O += 8;
              }
              g.head && (g.head.xflags = 255 & H, g.head.os = H >> 8), 512 & g.flags && (P[0] = 255 & H, P[1] = H >>> 8 & 255, g.check = o(g.check, P, 2, 0)), O = H = 0, g.mode = 5;
            case 5:
              if (1024 & g.flags) {
                for (; O < 16; ) {
                  if (ee === 0) break e;
                  ee--, H += G[L++] << O, O += 8;
                }
                g.length = H, g.head && (g.head.extra_len = H), 512 & g.flags && (P[0] = 255 & H, P[1] = H >>> 8 & 255, g.check = o(g.check, P, 2, 0)), O = H = 0;
              } else g.head && (g.head.extra = null);
              g.mode = 6;
            case 6:
              if (1024 & g.flags && (ee < (se = g.length) && (se = ee), se && (g.head && (c = g.head.extra_len - g.length, g.head.extra || (g.head.extra = new Array(g.head.extra_len)), i.arraySet(g.head.extra, G, L, se, c)), 512 & g.flags && (g.check = o(g.check, G, se, L)), ee -= se, L += se, g.length -= se), g.length)) break e;
              g.length = 0, g.mode = 7;
            case 7:
              if (2048 & g.flags) {
                if (ee === 0) break e;
                for (se = 0; c = G[L + se++], g.head && c && g.length < 65536 && (g.head.name += String.fromCharCode(c)), c && se < ee; ) ;
                if (512 & g.flags && (g.check = o(g.check, G, se, L)), ee -= se, L += se, c) break e;
              } else g.head && (g.head.name = null);
              g.length = 0, g.mode = 8;
            case 8:
              if (4096 & g.flags) {
                if (ee === 0) break e;
                for (se = 0; c = G[L + se++], g.head && c && g.length < 65536 && (g.head.comment += String.fromCharCode(c)), c && se < ee; ) ;
                if (512 & g.flags && (g.check = o(g.check, G, se, L)), ee -= se, L += se, c) break e;
              } else g.head && (g.head.comment = null);
              g.mode = 9;
            case 9:
              if (512 & g.flags) {
                for (; O < 16; ) {
                  if (ee === 0) break e;
                  ee--, H += G[L++] << O, O += 8;
                }
                if (H !== (65535 & g.check)) {
                  N.msg = "header crc mismatch", g.mode = 30;
                  break;
                }
                O = H = 0;
              }
              g.head && (g.head.hcrc = g.flags >> 9 & 1, g.head.done = !0), N.adler = g.check = 0, g.mode = 12;
              break;
            case 10:
              for (; O < 32; ) {
                if (ee === 0) break e;
                ee--, H += G[L++] << O, O += 8;
              }
              N.adler = g.check = k(H), O = H = 0, g.mode = 11;
            case 11:
              if (g.havedict === 0) return N.next_out = le, N.avail_out = de, N.next_in = L, N.avail_in = ee, g.hold = H, g.bits = O, 2;
              N.adler = g.check = 1, g.mode = 12;
            case 12:
              if (R === 5 || R === 6) break e;
            case 13:
              if (g.last) {
                H >>>= 7 & O, O -= 7 & O, g.mode = 27;
                break;
              }
              for (; O < 3; ) {
                if (ee === 0) break e;
                ee--, H += G[L++] << O, O += 8;
              }
              switch (g.last = 1 & H, O -= 1, 3 & (H >>>= 1)) {
                case 0:
                  g.mode = 14;
                  break;
                case 1:
                  if ($(g), g.mode = 20, R !== 6) break;
                  H >>>= 2, O -= 2;
                  break e;
                case 2:
                  g.mode = 17;
                  break;
                case 3:
                  N.msg = "invalid block type", g.mode = 30;
              }
              H >>>= 2, O -= 2;
              break;
            case 14:
              for (H >>>= 7 & O, O -= 7 & O; O < 32; ) {
                if (ee === 0) break e;
                ee--, H += G[L++] << O, O += 8;
              }
              if ((65535 & H) != (H >>> 16 ^ 65535)) {
                N.msg = "invalid stored block lengths", g.mode = 30;
                break;
              }
              if (g.length = 65535 & H, O = H = 0, g.mode = 15, R === 6) break e;
            case 15:
              g.mode = 16;
            case 16:
              if (se = g.length) {
                if (ee < se && (se = ee), de < se && (se = de), se === 0) break e;
                i.arraySet(oe, G, L, se, le), ee -= se, L += se, de -= se, le += se, g.length -= se;
                break;
              }
              g.mode = 12;
              break;
            case 17:
              for (; O < 14; ) {
                if (ee === 0) break e;
                ee--, H += G[L++] << O, O += 8;
              }
              if (g.nlen = 257 + (31 & H), H >>>= 5, O -= 5, g.ndist = 1 + (31 & H), H >>>= 5, O -= 5, g.ncode = 4 + (15 & H), H >>>= 4, O -= 4, 286 < g.nlen || 30 < g.ndist) {
                N.msg = "too many length or distance symbols", g.mode = 30;
                break;
              }
              g.have = 0, g.mode = 18;
            case 18:
              for (; g.have < g.ncode; ) {
                for (; O < 3; ) {
                  if (ee === 0) break e;
                  ee--, H += G[L++] << O, O += 8;
                }
                g.lens[te[g.have++]] = 7 & H, H >>>= 3, O -= 3;
              }
              for (; g.have < 19; ) g.lens[te[g.have++]] = 0;
              if (g.lencode = g.lendyn, g.lenbits = 7, j = { bits: g.lenbits }, Z = h(0, g.lens, 0, 19, g.lencode, 0, g.work, j), g.lenbits = j.bits, Z) {
                N.msg = "invalid code lengths set", g.mode = 30;
                break;
              }
              g.have = 0, g.mode = 19;
            case 19:
              for (; g.have < g.nlen + g.ndist; ) {
                for (; ue = (I = g.lencode[H & (1 << g.lenbits) - 1]) >>> 16 & 255, Ce = 65535 & I, !((Y = I >>> 24) <= O); ) {
                  if (ee === 0) break e;
                  ee--, H += G[L++] << O, O += 8;
                }
                if (Ce < 16) H >>>= Y, O -= Y, g.lens[g.have++] = Ce;
                else {
                  if (Ce === 16) {
                    for (E = Y + 2; O < E; ) {
                      if (ee === 0) break e;
                      ee--, H += G[L++] << O, O += 8;
                    }
                    if (H >>>= Y, O -= Y, g.have === 0) {
                      N.msg = "invalid bit length repeat", g.mode = 30;
                      break;
                    }
                    c = g.lens[g.have - 1], se = 3 + (3 & H), H >>>= 2, O -= 2;
                  } else if (Ce === 17) {
                    for (E = Y + 3; O < E; ) {
                      if (ee === 0) break e;
                      ee--, H += G[L++] << O, O += 8;
                    }
                    O -= Y, c = 0, se = 3 + (7 & (H >>>= Y)), H >>>= 3, O -= 3;
                  } else {
                    for (E = Y + 7; O < E; ) {
                      if (ee === 0) break e;
                      ee--, H += G[L++] << O, O += 8;
                    }
                    O -= Y, c = 0, se = 11 + (127 & (H >>>= Y)), H >>>= 7, O -= 7;
                  }
                  if (g.have + se > g.nlen + g.ndist) {
                    N.msg = "invalid bit length repeat", g.mode = 30;
                    break;
                  }
                  for (; se--; ) g.lens[g.have++] = c;
                }
              }
              if (g.mode === 30) break;
              if (g.lens[256] === 0) {
                N.msg = "invalid code -- missing end-of-block", g.mode = 30;
                break;
              }
              if (g.lenbits = 9, j = { bits: g.lenbits }, Z = h(p, g.lens, 0, g.nlen, g.lencode, 0, g.work, j), g.lenbits = j.bits, Z) {
                N.msg = "invalid literal/lengths set", g.mode = 30;
                break;
              }
              if (g.distbits = 6, g.distcode = g.distdyn, j = { bits: g.distbits }, Z = h(b, g.lens, g.nlen, g.ndist, g.distcode, 0, g.work, j), g.distbits = j.bits, Z) {
                N.msg = "invalid distances set", g.mode = 30;
                break;
              }
              if (g.mode = 20, R === 6) break e;
            case 20:
              g.mode = 21;
            case 21:
              if (6 <= ee && 258 <= de) {
                N.next_out = le, N.avail_out = de, N.next_in = L, N.avail_in = ee, g.hold = H, g.bits = O, l(N, ae), le = N.next_out, oe = N.output, de = N.avail_out, L = N.next_in, G = N.input, ee = N.avail_in, H = g.hold, O = g.bits, g.mode === 12 && (g.back = -1);
                break;
              }
              for (g.back = 0; ue = (I = g.lencode[H & (1 << g.lenbits) - 1]) >>> 16 & 255, Ce = 65535 & I, !((Y = I >>> 24) <= O); ) {
                if (ee === 0) break e;
                ee--, H += G[L++] << O, O += 8;
              }
              if (ue && (240 & ue) == 0) {
                for (_e = Y, Ne = ue, De = Ce; ue = (I = g.lencode[De + ((H & (1 << _e + Ne) - 1) >> _e)]) >>> 16 & 255, Ce = 65535 & I, !(_e + (Y = I >>> 24) <= O); ) {
                  if (ee === 0) break e;
                  ee--, H += G[L++] << O, O += 8;
                }
                H >>>= _e, O -= _e, g.back += _e;
              }
              if (H >>>= Y, O -= Y, g.back += Y, g.length = Ce, ue === 0) {
                g.mode = 26;
                break;
              }
              if (32 & ue) {
                g.back = -1, g.mode = 12;
                break;
              }
              if (64 & ue) {
                N.msg = "invalid literal/length code", g.mode = 30;
                break;
              }
              g.extra = 15 & ue, g.mode = 22;
            case 22:
              if (g.extra) {
                for (E = g.extra; O < E; ) {
                  if (ee === 0) break e;
                  ee--, H += G[L++] << O, O += 8;
                }
                g.length += H & (1 << g.extra) - 1, H >>>= g.extra, O -= g.extra, g.back += g.extra;
              }
              g.was = g.length, g.mode = 23;
            case 23:
              for (; ue = (I = g.distcode[H & (1 << g.distbits) - 1]) >>> 16 & 255, Ce = 65535 & I, !((Y = I >>> 24) <= O); ) {
                if (ee === 0) break e;
                ee--, H += G[L++] << O, O += 8;
              }
              if ((240 & ue) == 0) {
                for (_e = Y, Ne = ue, De = Ce; ue = (I = g.distcode[De + ((H & (1 << _e + Ne) - 1) >> _e)]) >>> 16 & 255, Ce = 65535 & I, !(_e + (Y = I >>> 24) <= O); ) {
                  if (ee === 0) break e;
                  ee--, H += G[L++] << O, O += 8;
                }
                H >>>= _e, O -= _e, g.back += _e;
              }
              if (H >>>= Y, O -= Y, g.back += Y, 64 & ue) {
                N.msg = "invalid distance code", g.mode = 30;
                break;
              }
              g.offset = Ce, g.extra = 15 & ue, g.mode = 24;
            case 24:
              if (g.extra) {
                for (E = g.extra; O < E; ) {
                  if (ee === 0) break e;
                  ee--, H += G[L++] << O, O += 8;
                }
                g.offset += H & (1 << g.extra) - 1, H >>>= g.extra, O -= g.extra, g.back += g.extra;
              }
              if (g.offset > g.dmax) {
                N.msg = "invalid distance too far back", g.mode = 30;
                break;
              }
              g.mode = 25;
            case 25:
              if (de === 0) break e;
              if (se = ae - de, g.offset > se) {
                if ((se = g.offset - se) > g.whave && g.sane) {
                  N.msg = "invalid distance too far back", g.mode = 30;
                  break;
                }
                we = se > g.wnext ? (se -= g.wnext, g.wsize - se) : g.wnext - se, se > g.length && (se = g.length), Ae = g.window;
              } else Ae = oe, we = le - g.offset, se = g.length;
              for (de < se && (se = de), de -= se, g.length -= se; oe[le++] = Ae[we++], --se; ) ;
              g.length === 0 && (g.mode = 21);
              break;
            case 26:
              if (de === 0) break e;
              oe[le++] = g.length, de--, g.mode = 21;
              break;
            case 27:
              if (g.wrap) {
                for (; O < 32; ) {
                  if (ee === 0) break e;
                  ee--, H |= G[L++] << O, O += 8;
                }
                if (ae -= de, N.total_out += ae, g.total += ae, ae && (N.adler = g.check = g.flags ? o(g.check, oe, ae, le - ae) : a(g.check, oe, ae, le - ae)), ae = de, (g.flags ? H : k(H)) !== g.check) {
                  N.msg = "incorrect data check", g.mode = 30;
                  break;
                }
                O = H = 0;
              }
              g.mode = 28;
            case 28:
              if (g.wrap && g.flags) {
                for (; O < 32; ) {
                  if (ee === 0) break e;
                  ee--, H += G[L++] << O, O += 8;
                }
                if (H !== (4294967295 & g.total)) {
                  N.msg = "incorrect length check", g.mode = 30;
                  break;
                }
                O = H = 0;
              }
              g.mode = 29;
            case 29:
              Z = 1;
              break e;
            case 30:
              Z = -3;
              break e;
            case 31:
              return -4;
            default:
              return u;
          }
          return N.next_out = le, N.avail_out = de, N.next_in = L, N.avail_in = ee, g.hold = H, g.bits = O, (g.wsize || ae !== N.avail_out && g.mode < 30 && (g.mode < 27 || R !== 4)) && X(N, N.output, N.next_out, ae - N.avail_out) ? (g.mode = 31, -4) : (K -= N.avail_in, ae -= N.avail_out, N.total_in += K, N.total_out += ae, g.total += ae, g.wrap && ae && (N.adler = g.check = g.flags ? o(g.check, oe, ae, N.next_out - ae) : a(g.check, oe, ae, N.next_out - ae)), N.data_type = g.bits + (g.last ? 64 : 0) + (g.mode === 12 ? 128 : 0) + (g.mode === 20 || g.mode === 15 ? 256 : 0), (K == 0 && ae === 0 || R === 4) && Z === m && (Z = -5), Z);
        }, s.inflateEnd = function(N) {
          if (!N || !N.state) return u;
          var R = N.state;
          return R.window && (R.window = null), N.state = null, m;
        }, s.inflateGetHeader = function(N, R) {
          var g;
          return N && N.state ? (2 & (g = N.state).wrap) == 0 ? u : ((g.head = R).done = !1, m) : u;
        }, s.inflateSetDictionary = function(N, R) {
          var g, G = R.length;
          return N && N.state ? (g = N.state).wrap !== 0 && g.mode !== 11 ? u : g.mode === 11 && a(1, R, G, 0) !== g.check ? -3 : X(N, R, G, G) ? (g.mode = 31, -4) : (g.havedict = 1, m) : u;
        }, s.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(t, n, s) {
        var i = t("../utils/common"), a = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], o = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], l = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], h = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        n.exports = function(p, b, m, u, y, A, w, k) {
          var _, B, C, S, z, x, U, Q, $, X = k.bits, N = 0, R = 0, g = 0, G = 0, oe = 0, L = 0, le = 0, ee = 0, de = 0, H = 0, O = null, K = 0, ae = new i.Buf16(16), se = new i.Buf16(16), we = null, Ae = 0;
          for (N = 0; N <= 15; N++) ae[N] = 0;
          for (R = 0; R < u; R++) ae[b[m + R]]++;
          for (oe = X, G = 15; 1 <= G && ae[G] === 0; G--) ;
          if (G < oe && (oe = G), G === 0) return y[A++] = 20971520, y[A++] = 20971520, k.bits = 1, 0;
          for (g = 1; g < G && ae[g] === 0; g++) ;
          for (oe < g && (oe = g), N = ee = 1; N <= 15; N++) if (ee <<= 1, (ee -= ae[N]) < 0) return -1;
          if (0 < ee && (p === 0 || G !== 1)) return -1;
          for (se[1] = 0, N = 1; N < 15; N++) se[N + 1] = se[N] + ae[N];
          for (R = 0; R < u; R++) b[m + R] !== 0 && (w[se[b[m + R]]++] = R);
          if (x = p === 0 ? (O = we = w, 19) : p === 1 ? (O = a, K -= 257, we = o, Ae -= 257, 256) : (O = l, we = h, -1), N = g, z = A, le = R = H = 0, C = -1, S = (de = 1 << (L = oe)) - 1, p === 1 && 852 < de || p === 2 && 592 < de) return 1;
          for (; ; ) {
            for (U = N - le, $ = w[R] < x ? (Q = 0, w[R]) : w[R] > x ? (Q = we[Ae + w[R]], O[K + w[R]]) : (Q = 96, 0), _ = 1 << N - le, g = B = 1 << L; y[z + (H >> le) + (B -= _)] = U << 24 | Q << 16 | $ | 0, B !== 0; ) ;
            for (_ = 1 << N - 1; H & _; ) _ >>= 1;
            if (_ !== 0 ? (H &= _ - 1, H += _) : H = 0, R++, --ae[N] == 0) {
              if (N === G) break;
              N = b[m + w[R]];
            }
            if (oe < N && (H & S) !== C) {
              for (le === 0 && (le = oe), z += g, ee = 1 << (L = N - le); L + le < G && !((ee -= ae[L + le]) <= 0); ) L++, ee <<= 1;
              if (de += 1 << L, p === 1 && 852 < de || p === 2 && 592 < de) return 1;
              y[C = H & S] = oe << 24 | L << 16 | z - A | 0;
            }
          }
          return H !== 0 && (y[z + H] = N - le << 24 | 64 << 16 | 0), k.bits = oe, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(t, n, s) {
        n.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(t, n, s) {
        var i = t("../utils/common"), a = 0, o = 1;
        function l(I) {
          for (var P = I.length; 0 <= --P; ) I[P] = 0;
        }
        var h = 0, p = 29, b = 256, m = b + 1 + p, u = 30, y = 19, A = 2 * m + 1, w = 15, k = 16, _ = 7, B = 256, C = 16, S = 17, z = 18, x = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], U = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], Q = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], $ = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], X = new Array(2 * (m + 2));
        l(X);
        var N = new Array(2 * u);
        l(N);
        var R = new Array(512);
        l(R);
        var g = new Array(256);
        l(g);
        var G = new Array(p);
        l(G);
        var oe, L, le, ee = new Array(u);
        function de(I, P, te, re, F) {
          this.static_tree = I, this.extra_bits = P, this.extra_base = te, this.elems = re, this.max_length = F, this.has_stree = I && I.length;
        }
        function H(I, P) {
          this.dyn_tree = I, this.max_code = 0, this.stat_desc = P;
        }
        function O(I) {
          return I < 256 ? R[I] : R[256 + (I >>> 7)];
        }
        function K(I, P) {
          I.pending_buf[I.pending++] = 255 & P, I.pending_buf[I.pending++] = P >>> 8 & 255;
        }
        function ae(I, P, te) {
          I.bi_valid > k - te ? (I.bi_buf |= P << I.bi_valid & 65535, K(I, I.bi_buf), I.bi_buf = P >> k - I.bi_valid, I.bi_valid += te - k) : (I.bi_buf |= P << I.bi_valid & 65535, I.bi_valid += te);
        }
        function se(I, P, te) {
          ae(I, te[2 * P], te[2 * P + 1]);
        }
        function we(I, P) {
          for (var te = 0; te |= 1 & I, I >>>= 1, te <<= 1, 0 < --P; ) ;
          return te >>> 1;
        }
        function Ae(I, P, te) {
          var re, F, J = new Array(w + 1), ie = 0;
          for (re = 1; re <= w; re++) J[re] = ie = ie + te[re - 1] << 1;
          for (F = 0; F <= P; F++) {
            var ne = I[2 * F + 1];
            ne !== 0 && (I[2 * F] = we(J[ne]++, ne));
          }
        }
        function Y(I) {
          var P;
          for (P = 0; P < m; P++) I.dyn_ltree[2 * P] = 0;
          for (P = 0; P < u; P++) I.dyn_dtree[2 * P] = 0;
          for (P = 0; P < y; P++) I.bl_tree[2 * P] = 0;
          I.dyn_ltree[2 * B] = 1, I.opt_len = I.static_len = 0, I.last_lit = I.matches = 0;
        }
        function ue(I) {
          8 < I.bi_valid ? K(I, I.bi_buf) : 0 < I.bi_valid && (I.pending_buf[I.pending++] = I.bi_buf), I.bi_buf = 0, I.bi_valid = 0;
        }
        function Ce(I, P, te, re) {
          var F = 2 * P, J = 2 * te;
          return I[F] < I[J] || I[F] === I[J] && re[P] <= re[te];
        }
        function _e(I, P, te) {
          for (var re = I.heap[te], F = te << 1; F <= I.heap_len && (F < I.heap_len && Ce(P, I.heap[F + 1], I.heap[F], I.depth) && F++, !Ce(P, re, I.heap[F], I.depth)); ) I.heap[te] = I.heap[F], te = F, F <<= 1;
          I.heap[te] = re;
        }
        function Ne(I, P, te) {
          var re, F, J, ie, ne = 0;
          if (I.last_lit !== 0) for (; re = I.pending_buf[I.d_buf + 2 * ne] << 8 | I.pending_buf[I.d_buf + 2 * ne + 1], F = I.pending_buf[I.l_buf + ne], ne++, re === 0 ? se(I, F, P) : (se(I, (J = g[F]) + b + 1, P), (ie = x[J]) !== 0 && ae(I, F -= G[J], ie), se(I, J = O(--re), te), (ie = U[J]) !== 0 && ae(I, re -= ee[J], ie)), ne < I.last_lit; ) ;
          se(I, B, P);
        }
        function De(I, P) {
          var te, re, F, J = P.dyn_tree, ie = P.stat_desc.static_tree, ne = P.stat_desc.has_stree, fe = P.stat_desc.elems, Ie = -1;
          for (I.heap_len = 0, I.heap_max = A, te = 0; te < fe; te++) J[2 * te] !== 0 ? (I.heap[++I.heap_len] = Ie = te, I.depth[te] = 0) : J[2 * te + 1] = 0;
          for (; I.heap_len < 2; ) J[2 * (F = I.heap[++I.heap_len] = Ie < 2 ? ++Ie : 0)] = 1, I.depth[F] = 0, I.opt_len--, ne && (I.static_len -= ie[2 * F + 1]);
          for (P.max_code = Ie, te = I.heap_len >> 1; 1 <= te; te--) _e(I, J, te);
          for (F = fe; te = I.heap[1], I.heap[1] = I.heap[I.heap_len--], _e(I, J, 1), re = I.heap[1], I.heap[--I.heap_max] = te, I.heap[--I.heap_max] = re, J[2 * F] = J[2 * te] + J[2 * re], I.depth[F] = (I.depth[te] >= I.depth[re] ? I.depth[te] : I.depth[re]) + 1, J[2 * te + 1] = J[2 * re + 1] = F, I.heap[1] = F++, _e(I, J, 1), 2 <= I.heap_len; ) ;
          I.heap[--I.heap_max] = I.heap[1], (function(me, Le) {
            var pt, Ze, mt, Me, st, zt, rt = Le.dyn_tree, W = Le.max_code, ge = Le.stat_desc.static_tree, Pe = Le.stat_desc.has_stree, Fe = Le.stat_desc.extra_bits, Ke = Le.stat_desc.extra_base, Ve = Le.stat_desc.max_length, Ye = 0;
            for (Me = 0; Me <= w; Me++) me.bl_count[Me] = 0;
            for (rt[2 * me.heap[me.heap_max] + 1] = 0, pt = me.heap_max + 1; pt < A; pt++) Ve < (Me = rt[2 * rt[2 * (Ze = me.heap[pt]) + 1] + 1] + 1) && (Me = Ve, Ye++), rt[2 * Ze + 1] = Me, W < Ze || (me.bl_count[Me]++, st = 0, Ke <= Ze && (st = Fe[Ze - Ke]), zt = rt[2 * Ze], me.opt_len += zt * (Me + st), Pe && (me.static_len += zt * (ge[2 * Ze + 1] + st)));
            if (Ye !== 0) {
              do {
                for (Me = Ve - 1; me.bl_count[Me] === 0; ) Me--;
                me.bl_count[Me]--, me.bl_count[Me + 1] += 2, me.bl_count[Ve]--, Ye -= 2;
              } while (0 < Ye);
              for (Me = Ve; Me !== 0; Me--) for (Ze = me.bl_count[Me]; Ze !== 0; ) W < (mt = me.heap[--pt]) || (rt[2 * mt + 1] !== Me && (me.opt_len += (Me - rt[2 * mt + 1]) * rt[2 * mt], rt[2 * mt + 1] = Me), Ze--);
            }
          })(I, P), Ae(J, Ie, I.bl_count);
        }
        function c(I, P, te) {
          var re, F, J = -1, ie = P[1], ne = 0, fe = 7, Ie = 4;
          for (ie === 0 && (fe = 138, Ie = 3), P[2 * (te + 1) + 1] = 65535, re = 0; re <= te; re++) F = ie, ie = P[2 * (re + 1) + 1], ++ne < fe && F === ie || (ne < Ie ? I.bl_tree[2 * F] += ne : F !== 0 ? (F !== J && I.bl_tree[2 * F]++, I.bl_tree[2 * C]++) : ne <= 10 ? I.bl_tree[2 * S]++ : I.bl_tree[2 * z]++, J = F, Ie = (ne = 0) === ie ? (fe = 138, 3) : F === ie ? (fe = 6, 3) : (fe = 7, 4));
        }
        function Z(I, P, te) {
          var re, F, J = -1, ie = P[1], ne = 0, fe = 7, Ie = 4;
          for (ie === 0 && (fe = 138, Ie = 3), re = 0; re <= te; re++) if (F = ie, ie = P[2 * (re + 1) + 1], !(++ne < fe && F === ie)) {
            if (ne < Ie) for (; se(I, F, I.bl_tree), --ne != 0; ) ;
            else F !== 0 ? (F !== J && (se(I, F, I.bl_tree), ne--), se(I, C, I.bl_tree), ae(I, ne - 3, 2)) : ne <= 10 ? (se(I, S, I.bl_tree), ae(I, ne - 3, 3)) : (se(I, z, I.bl_tree), ae(I, ne - 11, 7));
            J = F, Ie = (ne = 0) === ie ? (fe = 138, 3) : F === ie ? (fe = 6, 3) : (fe = 7, 4);
          }
        }
        l(ee);
        var j = !1;
        function E(I, P, te, re) {
          ae(I, (h << 1) + (re ? 1 : 0), 3), (function(F, J, ie, ne) {
            ue(F), K(F, ie), K(F, ~ie), i.arraySet(F.pending_buf, F.window, J, ie, F.pending), F.pending += ie;
          })(I, P, te);
        }
        s._tr_init = function(I) {
          j || ((function() {
            var P, te, re, F, J, ie = new Array(w + 1);
            for (F = re = 0; F < p - 1; F++) for (G[F] = re, P = 0; P < 1 << x[F]; P++) g[re++] = F;
            for (g[re - 1] = F, F = J = 0; F < 16; F++) for (ee[F] = J, P = 0; P < 1 << U[F]; P++) R[J++] = F;
            for (J >>= 7; F < u; F++) for (ee[F] = J << 7, P = 0; P < 1 << U[F] - 7; P++) R[256 + J++] = F;
            for (te = 0; te <= w; te++) ie[te] = 0;
            for (P = 0; P <= 143; ) X[2 * P + 1] = 8, P++, ie[8]++;
            for (; P <= 255; ) X[2 * P + 1] = 9, P++, ie[9]++;
            for (; P <= 279; ) X[2 * P + 1] = 7, P++, ie[7]++;
            for (; P <= 287; ) X[2 * P + 1] = 8, P++, ie[8]++;
            for (Ae(X, m + 1, ie), P = 0; P < u; P++) N[2 * P + 1] = 5, N[2 * P] = we(P, 5);
            oe = new de(X, x, b + 1, m, w), L = new de(N, U, 0, u, w), le = new de(new Array(0), Q, 0, y, _);
          })(), j = !0), I.l_desc = new H(I.dyn_ltree, oe), I.d_desc = new H(I.dyn_dtree, L), I.bl_desc = new H(I.bl_tree, le), I.bi_buf = 0, I.bi_valid = 0, Y(I);
        }, s._tr_stored_block = E, s._tr_flush_block = function(I, P, te, re) {
          var F, J, ie = 0;
          0 < I.level ? (I.strm.data_type === 2 && (I.strm.data_type = (function(ne) {
            var fe, Ie = 4093624447;
            for (fe = 0; fe <= 31; fe++, Ie >>>= 1) if (1 & Ie && ne.dyn_ltree[2 * fe] !== 0) return a;
            if (ne.dyn_ltree[18] !== 0 || ne.dyn_ltree[20] !== 0 || ne.dyn_ltree[26] !== 0) return o;
            for (fe = 32; fe < b; fe++) if (ne.dyn_ltree[2 * fe] !== 0) return o;
            return a;
          })(I)), De(I, I.l_desc), De(I, I.d_desc), ie = (function(ne) {
            var fe;
            for (c(ne, ne.dyn_ltree, ne.l_desc.max_code), c(ne, ne.dyn_dtree, ne.d_desc.max_code), De(ne, ne.bl_desc), fe = y - 1; 3 <= fe && ne.bl_tree[2 * $[fe] + 1] === 0; fe--) ;
            return ne.opt_len += 3 * (fe + 1) + 5 + 5 + 4, fe;
          })(I), F = I.opt_len + 3 + 7 >>> 3, (J = I.static_len + 3 + 7 >>> 3) <= F && (F = J)) : F = J = te + 5, te + 4 <= F && P !== -1 ? E(I, P, te, re) : I.strategy === 4 || J === F ? (ae(I, 2 + (re ? 1 : 0), 3), Ne(I, X, N)) : (ae(I, 4 + (re ? 1 : 0), 3), (function(ne, fe, Ie, me) {
            var Le;
            for (ae(ne, fe - 257, 5), ae(ne, Ie - 1, 5), ae(ne, me - 4, 4), Le = 0; Le < me; Le++) ae(ne, ne.bl_tree[2 * $[Le] + 1], 3);
            Z(ne, ne.dyn_ltree, fe - 1), Z(ne, ne.dyn_dtree, Ie - 1);
          })(I, I.l_desc.max_code + 1, I.d_desc.max_code + 1, ie + 1), Ne(I, I.dyn_ltree, I.dyn_dtree)), Y(I), re && ue(I);
        }, s._tr_tally = function(I, P, te) {
          return I.pending_buf[I.d_buf + 2 * I.last_lit] = P >>> 8 & 255, I.pending_buf[I.d_buf + 2 * I.last_lit + 1] = 255 & P, I.pending_buf[I.l_buf + I.last_lit] = 255 & te, I.last_lit++, P === 0 ? I.dyn_ltree[2 * te]++ : (I.matches++, P--, I.dyn_ltree[2 * (g[te] + b + 1)]++, I.dyn_dtree[2 * O(P)]++), I.last_lit === I.lit_bufsize - 1;
        }, s._tr_align = function(I) {
          ae(I, 2, 3), se(I, B, X), (function(P) {
            P.bi_valid === 16 ? (K(P, P.bi_buf), P.bi_buf = 0, P.bi_valid = 0) : 8 <= P.bi_valid && (P.pending_buf[P.pending++] = 255 & P.bi_buf, P.bi_buf >>= 8, P.bi_valid -= 8);
          })(I);
        };
      }, { "../utils/common": 41 }], 53: [function(t, n, s) {
        n.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(t, n, s) {
        (function(i) {
          (function(a, o) {
            if (!a.setImmediate) {
              var l, h, p, b, m = 1, u = {}, y = !1, A = a.document, w = Object.getPrototypeOf && Object.getPrototypeOf(a);
              w = w && w.setTimeout ? w : a, l = {}.toString.call(a.process) === "[object process]" ? function(C) {
                process.nextTick(function() {
                  _(C);
                });
              } : (function() {
                if (a.postMessage && !a.importScripts) {
                  var C = !0, S = a.onmessage;
                  return a.onmessage = function() {
                    C = !1;
                  }, a.postMessage("", "*"), a.onmessage = S, C;
                }
              })() ? (b = "setImmediate$" + Math.random() + "$", a.addEventListener ? a.addEventListener("message", B, !1) : a.attachEvent("onmessage", B), function(C) {
                a.postMessage(b + C, "*");
              }) : a.MessageChannel ? ((p = new MessageChannel()).port1.onmessage = function(C) {
                _(C.data);
              }, function(C) {
                p.port2.postMessage(C);
              }) : A && "onreadystatechange" in A.createElement("script") ? (h = A.documentElement, function(C) {
                var S = A.createElement("script");
                S.onreadystatechange = function() {
                  _(C), S.onreadystatechange = null, h.removeChild(S), S = null;
                }, h.appendChild(S);
              }) : function(C) {
                setTimeout(_, 0, C);
              }, w.setImmediate = function(C) {
                typeof C != "function" && (C = new Function("" + C));
                for (var S = new Array(arguments.length - 1), z = 0; z < S.length; z++) S[z] = arguments[z + 1];
                var x = { callback: C, args: S };
                return u[m] = x, l(m), m++;
              }, w.clearImmediate = k;
            }
            function k(C) {
              delete u[C];
            }
            function _(C) {
              if (y) setTimeout(_, 0, C);
              else {
                var S = u[C];
                if (S) {
                  y = !0;
                  try {
                    (function(z) {
                      var x = z.callback, U = z.args;
                      switch (U.length) {
                        case 0:
                          x();
                          break;
                        case 1:
                          x(U[0]);
                          break;
                        case 2:
                          x(U[0], U[1]);
                          break;
                        case 3:
                          x(U[0], U[1], U[2]);
                          break;
                        default:
                          x.apply(o, U);
                      }
                    })(S);
                  } finally {
                    k(C), y = !1;
                  }
                }
              }
            }
            function B(C) {
              C.source === a && typeof C.data == "string" && C.data.indexOf(b) === 0 && _(+C.data.slice(b.length));
            }
          })(typeof self > "u" ? i === void 0 ? this : i : self);
        }).call(this, typeof An < "u" ? An : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Hs)), Hs.exports;
}
var eh = Yd();
const th = /* @__PURE__ */ Kd(eh);
var Ue;
(function(r) {
  r.OfficeDocument = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument", r.FontTable = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable", r.Image = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image", r.Numbering = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering", r.Styles = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles", r.StylesWithEffects = "http://schemas.microsoft.com/office/2007/relationships/stylesWithEffects", r.Theme = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme", r.Settings = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings", r.WebSettings = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings", r.Hyperlink = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink", r.Footnotes = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes", r.Endnotes = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes", r.Footer = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer", r.Header = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/header", r.ExtendedProperties = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties", r.CoreProperties = "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties", r.CustomProperties = "http://schemas.openxmlformats.org/package/2006/relationships/metadata/custom-properties", r.Comments = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments", r.CommentsExtended = "http://schemas.microsoft.com/office/2011/relationships/commentsExtended", r.AltChunk = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk";
})(Ue || (Ue = {}));
function rh(r, e) {
  return e.elements(r).map((t) => ({
    id: e.attr(t, "Id"),
    type: e.attr(t, "Type"),
    target: e.attr(t, "Target"),
    targetMode: e.attr(t, "TargetMode")
  }));
}
function nh(r) {
  return r?.replace(/[ .]+/g, "-").replace(/[&]+/g, "and").toLowerCase();
}
function oi(r) {
  return /^[^"'].*\s.*[^"']$/.test(r) ? `'${r}'` : r;
}
function Nn(r) {
  let e = r.lastIndexOf("/") + 1, t = e == 0 ? "" : r.substring(0, e), n = e == 0 ? r : r.substring(e);
  return [t, n];
}
function js(r, e) {
  try {
    const t = "http://docx/";
    return new URL(r, t + e).toString().substring(t.length);
  } catch {
    return `${e}${r}`;
  }
}
function Qt(r, e) {
  return r.reduce((t, n) => (t[e(n)] = n, t), {});
}
function sh(r) {
  return new Promise((e, t) => {
    const n = new FileReader();
    n.onloadend = () => e(n.result), n.onerror = () => t(), n.readAsDataURL(r);
  });
}
function qs(r) {
  return r && typeof r == "object" && !Array.isArray(r);
}
function li(r) {
  return typeof r == "string" || r instanceof String;
}
function Tn(r, ...e) {
  if (!e.length)
    return r;
  const t = e.shift();
  if (qs(r) && qs(t))
    for (const n in t)
      if (qs(t[n])) {
        const s = r[n] ?? (r[n] = {});
        Tn(s, t[n]);
      } else
        r[n] = t[n];
  return Tn(r, ...e);
}
function Rr(r) {
  return Array.isArray(r) ? r : [r];
}
function ih(r, e, t) {
  return e > r ? e : t < r ? t : r;
}
const qo = {
  wordml: "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
}, Oe = {
  Dxa: { mul: 0.05, unit: "pt" },
  Emu: { mul: 1 / 12700, unit: "pt" },
  FontSize: { mul: 0.5, unit: "pt" },
  Border: { mul: 0.125, unit: "pt", min: 0.25, max: 12 },
  Point: { mul: 1, unit: "pt" },
  Percent: { mul: 0.02, unit: "%" }
};
function Go(r, e = Oe.Dxa) {
  if (r == null || /.+(p[xt]|[%])$/.test(r))
    return r;
  var t = parseInt(r) * e.mul;
  return e.min && e.max && (t = ih(t, e.min, e.max)), `${t.toFixed(2)}${e.unit}`;
}
function ah(r, e = !1) {
  switch (r) {
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
function Jo(r, e, t) {
  if (r.namespaceURI != qo.wordml)
    return !1;
  switch (r.localName) {
    case "color":
      e.color = t.attr(r, "val");
      break;
    case "sz":
      e.fontSize = t.lengthAttr(r, "val", Oe.FontSize);
      break;
    default:
      return !1;
  }
  return !0;
}
function oh(r, e = !1) {
  e && (r = r.replace(/<[?].*[?]>/, "")), r = ch(r);
  const t = new DOMParser().parseFromString(r, "application/xml"), n = lh(t);
  if (n)
    throw new Error(n);
  return t;
}
function lh(r) {
  return r.getElementsByTagName("parsererror")[0]?.textContent;
}
function ch(r) {
  return r.charCodeAt(0) === 65279 ? r.substring(1) : r;
}
function dh(r) {
  return new XMLSerializer().serializeToString(r);
}
class Vo {
  elements(e, t = null) {
    const n = [];
    for (let s = 0, i = e.childNodes.length; s < i; s++) {
      let a = e.childNodes.item(s);
      a.nodeType == Node.ELEMENT_NODE && (t == null || a.localName == t) && n.push(a);
    }
    return n;
  }
  element(e, t) {
    for (let n = 0, s = e.childNodes.length; n < s; n++) {
      let i = e.childNodes.item(n);
      if (i.nodeType == 1 && i.localName == t)
        return i;
    }
    return null;
  }
  elementAttr(e, t, n) {
    var s = this.element(e, t);
    return s ? this.attr(s, n) : void 0;
  }
  attrs(e) {
    return Array.from(e.attributes);
  }
  attr(e, t) {
    for (let n = 0, s = e.attributes.length; n < s; n++) {
      let i = e.attributes.item(n);
      if (i.localName == t)
        return i.value;
    }
    return null;
  }
  intAttr(e, t, n = null) {
    var s = this.attr(e, t);
    return s ? parseInt(s) : n;
  }
  hexAttr(e, t, n = null) {
    var s = this.attr(e, t);
    return s ? parseInt(s, 16) : n;
  }
  floatAttr(e, t, n = null) {
    var s = this.attr(e, t);
    return s ? parseFloat(s) : n;
  }
  boolAttr(e, t, n = null) {
    return ah(this.attr(e, t), n);
  }
  lengthAttr(e, t, n = Oe.Dxa) {
    return Go(this.attr(e, t), n);
  }
}
const M = new Vo();
class ht {
  constructor(e, t) {
    this._package = e, this.path = t;
  }
  async load() {
    this.rels = await this._package.loadRelationships(this.path);
    const e = await this._package.load(this.path), t = this._package.parseXmlDocument(e);
    this._package.options.keepOrigin && (this._xmlDocument = t), this.parseXml(t.firstElementChild);
  }
  save() {
    this._package.update(this.path, dh(this._xmlDocument));
  }
  parseXml(e) {
  }
}
const hh = {
  embedRegular: "regular",
  embedBold: "bold",
  embedItalic: "italic",
  embedBoldItalic: "boldItalic"
};
function uh(r, e) {
  return e.elements(r).map((t) => fh(t, e));
}
function fh(r, e) {
  let t = {
    name: e.attr(r, "name"),
    embedFontRefs: []
  };
  for (let n of e.elements(r))
    switch (n.localName) {
      case "family":
        t.family = e.attr(n, "val");
        break;
      case "altName":
        t.altName = e.attr(n, "val");
        break;
      case "embedRegular":
      case "embedBold":
      case "embedItalic":
      case "embedBoldItalic":
        t.embedFontRefs.push(gh(n, e));
        break;
    }
  return t;
}
function gh(r, e) {
  return {
    id: e.attr(r, "id"),
    key: e.attr(r, "fontKey"),
    type: hh[r.localName]
  };
}
class ph extends ht {
  parseXml(e) {
    this.fonts = uh(e, this._package.xmlParser);
  }
}
function mh(r, e) {
  return e.elements(r).map((t) => ({
    extension: e.attr(t, "Extension"),
    partName: e.attr(t, "PartName"),
    contentType: e.attr(t, "ContentType")
  }));
}
class ki {
  constructor(e, t) {
    this._zip = e, this.options = t, this.xmlParser = new Vo();
  }
  get(e) {
    const t = bh(e);
    return this._zip.files[t] ?? this._zip.files[t.replace(/\//g, "\\")];
  }
  update(e, t) {
    this._zip.file(e, t);
  }
  static async load(e, t) {
    const n = await th.loadAsync(e);
    return new ki(n, t);
  }
  save(e = "blob") {
    return this._zip.generateAsync({ type: e });
  }
  load(e, t = "string") {
    return this.get(e)?.async(t) ?? Promise.resolve(null);
  }
  async loadRelationships(e = null) {
    let t = "_rels/.rels";
    if (e != null) {
      const [s, i] = Nn(e);
      t = `${s}_rels/${i}.rels`;
    }
    const n = await this.load(t);
    return n ? rh(this.parseXmlDocument(n).firstElementChild, this.xmlParser) : null;
  }
  async loadContentTypes() {
    const e = await this.load("[Content_Types].xml");
    return e ? mh(this.parseXmlDocument(e).firstElementChild, this.xmlParser) : [];
  }
  parseXmlDocument(e) {
    return oh(e, this.options.trimXmlDeclaration);
  }
}
function bh(r) {
  return r.startsWith("/") ? r.substr(1) : r;
}
class Ah extends ht {
  constructor(e, t, n) {
    super(e, t), this._documentParser = n;
  }
  parseXml(e) {
    this.body = this._documentParser.parseDocumentFile(e);
  }
}
function yn(r, e) {
  return {
    type: e.attr(r, "val"),
    color: e.attr(r, "color"),
    size: e.lengthAttr(r, "sz", Oe.Border),
    offset: e.lengthAttr(r, "space", Oe.Point),
    frame: e.boolAttr(r, "frame"),
    shadow: e.boolAttr(r, "shadow")
  };
}
function wh(r, e) {
  var t = {};
  for (let n of e.elements(r))
    switch (n.localName) {
      case "left":
        t.left = yn(n, e);
        break;
      case "top":
        t.top = yn(n, e);
        break;
      case "right":
        t.right = yn(n, e);
        break;
      case "bottom":
        t.bottom = yn(n, e);
        break;
    }
  return t;
}
var $a;
(function(r) {
  r.Continuous = "continuous", r.NextPage = "nextPage", r.NextColumn = "nextColumn", r.EvenPage = "evenPage", r.OddPage = "oddPage";
})($a || ($a = {}));
function Wo(r, e = M) {
  var t = {};
  for (let n of e.elements(r))
    switch (n.localName) {
      case "pgSz":
        t.pageSize = {
          width: e.lengthAttr(n, "w"),
          height: e.lengthAttr(n, "h"),
          orientation: e.attr(n, "orient")
        };
        break;
      case "type":
        t.type = e.attr(n, "val");
        break;
      case "pgMar":
        t.pageMargins = {
          left: e.lengthAttr(n, "left"),
          right: e.lengthAttr(n, "right"),
          top: e.lengthAttr(n, "top"),
          bottom: e.lengthAttr(n, "bottom"),
          header: e.lengthAttr(n, "header"),
          footer: e.lengthAttr(n, "footer"),
          gutter: e.lengthAttr(n, "gutter")
        };
        break;
      case "cols":
        t.columns = yh(n, e);
        break;
      case "headerReference":
        (t.headerRefs ?? (t.headerRefs = [])).push(Ha(n, e));
        break;
      case "footerReference":
        (t.footerRefs ?? (t.footerRefs = [])).push(Ha(n, e));
        break;
      case "titlePg":
        t.titlePage = e.boolAttr(n, "val", !0);
        break;
      case "pgBorders":
        t.pageBorders = wh(n, e);
        break;
      case "pgNumType":
        t.pageNumber = kh(n, e);
        break;
    }
  return t;
}
function yh(r, e) {
  return {
    numberOfColumns: e.intAttr(r, "num"),
    space: e.lengthAttr(r, "space"),
    separator: e.boolAttr(r, "sep"),
    equalWidth: e.boolAttr(r, "equalWidth", !0),
    columns: e.elements(r, "col").map((t) => ({
      width: e.lengthAttr(t, "w"),
      space: e.lengthAttr(t, "space")
    }))
  };
}
function kh(r, e) {
  return {
    chapSep: e.attr(r, "chapSep"),
    chapStyle: e.attr(r, "chapStyle"),
    format: e.attr(r, "fmt"),
    start: e.intAttr(r, "start")
  };
}
function Ha(r, e) {
  return {
    id: e.attr(r, "id"),
    type: e.attr(r, "type")
  };
}
function vh(r, e) {
  return {
    before: e.lengthAttr(r, "before"),
    after: e.lengthAttr(r, "after"),
    line: e.intAttr(r, "line"),
    lineRule: e.attr(r, "lineRule")
  };
}
function vi(r, e) {
  let t = {};
  for (let n of e.elements(r))
    _h(n, t, e);
  return t;
}
function _h(r, e, t) {
  return !!Jo(r, e, t);
}
function Xo(r, e) {
  let t = {};
  for (let n of e.elements(r))
    Zo(n, t, e);
  return t;
}
function Zo(r, e, t) {
  if (r.namespaceURI != qo.wordml)
    return !1;
  if (Jo(r, e, t))
    return !0;
  switch (r.localName) {
    case "tabs":
      e.tabs = Ih(r, t);
      break;
    case "sectPr":
      e.sectionProps = Wo(r, t);
      break;
    case "numPr":
      e.numbering = Ch(r, t);
      break;
    case "spacing":
      return e.lineSpacing = vh(r, t), !1;
    case "textAlignment":
      return e.textAlignment = t.attr(r, "val"), !1;
    case "keepLines":
      e.keepLines = t.boolAttr(r, "val", !0);
      break;
    case "keepNext":
      e.keepNext = t.boolAttr(r, "val", !0);
      break;
    case "pageBreakBefore":
      e.pageBreakBefore = t.boolAttr(r, "val", !0);
      break;
    case "outlineLvl":
      e.outlineLevel = t.intAttr(r, "val");
      break;
    case "pStyle":
      e.styleName = t.attr(r, "val");
      break;
    case "rPr":
      e.runProps = vi(r, t);
      break;
    default:
      return !1;
  }
  return !0;
}
function Ih(r, e) {
  return e.elements(r, "tab").map((t) => ({
    position: e.lengthAttr(t, "pos"),
    leader: e.attr(t, "leader"),
    style: e.attr(t, "val")
  }));
}
function Ch(r, e) {
  var t = {};
  for (let n of e.elements(r))
    switch (n.localName) {
      case "numId":
        t.id = e.attr(n, "val");
        break;
      case "ilvl":
        t.level = e.intAttr(n, "val");
        break;
    }
  return t;
}
function Eh(r, e) {
  let t = {
    numberings: [],
    abstractNumberings: [],
    bulletPictures: []
  };
  for (let n of e.elements(r))
    switch (n.localName) {
      case "num":
        t.numberings.push(Sh(n, e));
        break;
      case "abstractNum":
        t.abstractNumberings.push(Nh(n, e));
        break;
      case "numPicBullet":
        t.bulletPictures.push(xh(n, e));
        break;
    }
  return t;
}
function Sh(r, e) {
  let t = {
    id: e.attr(r, "numId"),
    overrides: []
  };
  for (let n of e.elements(r))
    switch (n.localName) {
      case "abstractNumId":
        t.abstractId = e.attr(n, "val");
        break;
      case "lvlOverride":
        t.overrides.push(Bh(n, e));
        break;
    }
  return t;
}
function Nh(r, e) {
  let t = {
    id: e.attr(r, "abstractNumId"),
    levels: []
  };
  for (let n of e.elements(r))
    switch (n.localName) {
      case "name":
        t.name = e.attr(n, "val");
        break;
      case "multiLevelType":
        t.multiLevelType = e.attr(n, "val");
        break;
      case "numStyleLink":
        t.numberingStyleLink = e.attr(n, "val");
        break;
      case "styleLink":
        t.styleLink = e.attr(n, "val");
        break;
      case "lvl":
        t.levels.push(Ko(n, e));
        break;
    }
  return t;
}
function Ko(r, e) {
  let t = {
    level: e.intAttr(r, "ilvl")
  };
  for (let n of e.elements(r))
    switch (n.localName) {
      case "start":
        t.start = e.attr(n, "val");
        break;
      case "lvlRestart":
        t.restart = e.intAttr(n, "val");
        break;
      case "numFmt":
        t.format = e.attr(n, "val");
        break;
      case "lvlText":
        t.text = e.attr(n, "val");
        break;
      case "lvlJc":
        t.justification = e.attr(n, "val");
        break;
      case "lvlPicBulletId":
        t.bulletPictureId = e.attr(n, "val");
        break;
      case "pStyle":
        t.paragraphStyle = e.attr(n, "val");
        break;
      case "pPr":
        t.paragraphProps = Xo(n, e);
        break;
      case "rPr":
        t.runProps = vi(n, e);
        break;
    }
  return t;
}
function Bh(r, e) {
  let t = {
    level: e.intAttr(r, "ilvl")
  };
  for (let n of e.elements(r))
    switch (n.localName) {
      case "startOverride":
        t.start = e.intAttr(n, "val");
        break;
      case "lvl":
        t.numberingLevel = Ko(n, e);
        break;
    }
  return t;
}
function xh(r, e) {
  var t = e.element(r, "pict"), n = t && e.element(t, "shape"), s = n && e.element(n, "imagedata");
  return s ? {
    id: e.attr(r, "numPicBulletId"),
    referenceId: e.attr(s, "id"),
    style: e.attr(n, "style")
  } : null;
}
class Dh extends ht {
  constructor(e, t, n) {
    super(e, t), this._documentParser = n;
  }
  parseXml(e) {
    Object.assign(this, Eh(e, this._package.xmlParser)), this.domNumberings = this._documentParser.parseNumberingFile(e);
  }
}
class Mh extends ht {
  constructor(e, t, n) {
    super(e, t), this._documentParser = n;
  }
  parseXml(e) {
    this.styles = this._documentParser.parseStylesFile(e);
  }
}
var q;
(function(r) {
  r.Document = "document", r.Paragraph = "paragraph", r.Run = "run", r.Break = "break", r.NoBreakHyphen = "noBreakHyphen", r.Table = "table", r.Row = "row", r.Cell = "cell", r.Hyperlink = "hyperlink", r.SmartTag = "smartTag", r.Drawing = "drawing", r.Image = "image", r.Text = "text", r.Tab = "tab", r.Symbol = "symbol", r.BookmarkStart = "bookmarkStart", r.BookmarkEnd = "bookmarkEnd", r.Footer = "footer", r.Header = "header", r.FootnoteReference = "footnoteReference", r.EndnoteReference = "endnoteReference", r.Footnote = "footnote", r.Endnote = "endnote", r.SimpleField = "simpleField", r.ComplexField = "complexField", r.Instruction = "instruction", r.VmlPicture = "vmlPicture", r.MmlMath = "mmlMath", r.MmlMathParagraph = "mmlMathParagraph", r.MmlFraction = "mmlFraction", r.MmlFunction = "mmlFunction", r.MmlFunctionName = "mmlFunctionName", r.MmlNumerator = "mmlNumerator", r.MmlDenominator = "mmlDenominator", r.MmlRadical = "mmlRadical", r.MmlBase = "mmlBase", r.MmlDegree = "mmlDegree", r.MmlSuperscript = "mmlSuperscript", r.MmlSubscript = "mmlSubscript", r.MmlPreSubSuper = "mmlPreSubSuper", r.MmlSubArgument = "mmlSubArgument", r.MmlSuperArgument = "mmlSuperArgument", r.MmlNary = "mmlNary", r.MmlDelimiter = "mmlDelimiter", r.MmlRun = "mmlRun", r.MmlEquationArray = "mmlEquationArray", r.MmlLimit = "mmlLimit", r.MmlLimitLower = "mmlLimitLower", r.MmlMatrix = "mmlMatrix", r.MmlMatrixRow = "mmlMatrixRow", r.MmlBox = "mmlBox", r.MmlBar = "mmlBar", r.MmlGroupChar = "mmlGroupChar", r.VmlElement = "vmlElement", r.Inserted = "inserted", r.Deleted = "deleted", r.DeletedText = "deletedText", r.Comment = "comment", r.CommentReference = "commentReference", r.CommentRangeStart = "commentRangeStart", r.CommentRangeEnd = "commentRangeEnd", r.AltChunk = "altChunk";
})(q || (q = {}));
class tr {
  constructor() {
    this.children = [], this.cssStyle = {};
  }
}
class Rh extends tr {
  constructor() {
    super(...arguments), this.type = q.Header;
  }
}
class zh extends tr {
  constructor() {
    super(...arguments), this.type = q.Footer;
  }
}
class Yo extends ht {
  constructor(e, t, n) {
    super(e, t), this._documentParser = n;
  }
  parseXml(e) {
    this.rootElement = this.createRootElement(), this.rootElement.children = this._documentParser.parseBodyElements(e);
  }
}
class Ph extends Yo {
  createRootElement() {
    return new Rh();
  }
}
class Fh extends Yo {
  createRootElement() {
    return new zh();
  }
}
function Qh(r, e) {
  const t = {};
  for (let n of e.elements(r))
    switch (n.localName) {
      case "Template":
        t.template = n.textContent;
        break;
      case "Pages":
        t.pages = zr(n.textContent);
        break;
      case "Words":
        t.words = zr(n.textContent);
        break;
      case "Characters":
        t.characters = zr(n.textContent);
        break;
      case "Application":
        t.application = n.textContent;
        break;
      case "Lines":
        t.lines = zr(n.textContent);
        break;
      case "Paragraphs":
        t.paragraphs = zr(n.textContent);
        break;
      case "Company":
        t.company = n.textContent;
        break;
      case "AppVersion":
        t.appVersion = n.textContent;
        break;
    }
  return t;
}
function zr(r) {
  if (!(typeof r > "u"))
    return parseInt(r);
}
class Th extends ht {
  parseXml(e) {
    this.props = Qh(e, this._package.xmlParser);
  }
}
function Lh(r, e) {
  const t = {};
  for (let n of e.elements(r))
    switch (n.localName) {
      case "title":
        t.title = n.textContent;
        break;
      case "description":
        t.description = n.textContent;
        break;
      case "subject":
        t.subject = n.textContent;
        break;
      case "creator":
        t.creator = n.textContent;
        break;
      case "keywords":
        t.keywords = n.textContent;
        break;
      case "language":
        t.language = n.textContent;
        break;
      case "lastModifiedBy":
        t.lastModifiedBy = n.textContent;
        break;
      case "revision":
        n.textContent && (t.revision = parseInt(n.textContent));
        break;
    }
  return t;
}
class Uh extends ht {
  parseXml(e) {
    this.props = Lh(e, this._package.xmlParser);
  }
}
class Oh {
}
function $h(r, e) {
  var t = new Oh(), n = e.element(r, "themeElements");
  for (let s of e.elements(n))
    switch (s.localName) {
      case "clrScheme":
        t.colorScheme = Hh(s, e);
        break;
      case "fontScheme":
        t.fontScheme = jh(s, e);
        break;
    }
  return t;
}
function Hh(r, e) {
  var t = {
    name: e.attr(r, "name"),
    colors: {}
  };
  for (let i of e.elements(r)) {
    var n = e.element(i, "srgbClr"), s = e.element(i, "sysClr");
    n ? t.colors[i.localName] = e.attr(n, "val") : s && (t.colors[i.localName] = e.attr(s, "lastClr"));
  }
  return t;
}
function jh(r, e) {
  var t = {
    name: e.attr(r, "name")
  };
  for (let n of e.elements(r))
    switch (n.localName) {
      case "majorFont":
        t.majorFont = ja(n, e);
        break;
      case "minorFont":
        t.minorFont = ja(n, e);
        break;
    }
  return t;
}
function ja(r, e) {
  return {
    latinTypeface: e.elementAttr(r, "latin", "typeface"),
    eaTypeface: e.elementAttr(r, "ea", "typeface"),
    csTypeface: e.elementAttr(r, "cs", "typeface")
  };
}
class qh extends ht {
  constructor(e, t) {
    super(e, t);
  }
  parseXml(e) {
    this.theme = $h(e, this._package.xmlParser);
  }
}
class el {
}
class Gh extends el {
  constructor() {
    super(...arguments), this.type = q.Footnote;
  }
}
class Jh extends el {
  constructor() {
    super(...arguments), this.type = q.Endnote;
  }
}
class tl extends ht {
  constructor(e, t, n) {
    super(e, t), this._documentParser = n;
  }
}
class Vh extends tl {
  constructor(e, t, n) {
    super(e, t, n);
  }
  parseXml(e) {
    this.notes = this._documentParser.parseNotes(e, "footnote", Gh);
  }
}
class Wh extends tl {
  constructor(e, t, n) {
    super(e, t, n);
  }
  parseXml(e) {
    this.notes = this._documentParser.parseNotes(e, "endnote", Jh);
  }
}
function Xh(r, e) {
  var t = {};
  for (let n of e.elements(r))
    switch (n.localName) {
      case "defaultTabStop":
        t.defaultTabStop = e.lengthAttr(n, "val");
        break;
      case "footnotePr":
        t.footnoteProps = qa(n, e);
        break;
      case "endnotePr":
        t.endnoteProps = qa(n, e);
        break;
      case "autoHyphenation":
        t.autoHyphenation = e.boolAttr(n, "val");
        break;
    }
  return t;
}
function qa(r, e) {
  var t = {
    defaultNoteIds: []
  };
  for (let n of e.elements(r))
    switch (n.localName) {
      case "numFmt":
        t.nummeringFormat = e.attr(n, "val");
        break;
      case "footnote":
      case "endnote":
        t.defaultNoteIds.push(e.attr(n, "id"));
        break;
    }
  return t;
}
class Zh extends ht {
  constructor(e, t) {
    super(e, t);
  }
  parseXml(e) {
    this.settings = Xh(e, this._package.xmlParser);
  }
}
function Kh(r, e) {
  return e.elements(r, "property").map((t) => {
    const n = t.firstChild;
    return {
      formatId: e.attr(t, "fmtid"),
      name: e.attr(t, "name"),
      type: n.nodeName,
      value: n.textContent
    };
  });
}
class Yh extends ht {
  parseXml(e) {
    this.props = Kh(e, this._package.xmlParser);
  }
}
class eu extends ht {
  constructor(e, t, n) {
    super(e, t), this._documentParser = n;
  }
  parseXml(e) {
    this.comments = this._documentParser.parseComments(e), this.commentMap = Qt(this.comments, (t) => t.id);
  }
}
class tu extends ht {
  constructor(e, t) {
    super(e, t), this.comments = [];
  }
  parseXml(e) {
    const t = this._package.xmlParser;
    for (let n of t.elements(e, "commentEx"))
      this.comments.push({
        paraId: t.attr(n, "paraId"),
        paraIdParent: t.attr(n, "paraIdParent"),
        done: t.boolAttr(n, "done")
      });
    this.commentMap = Qt(this.comments, (n) => n.paraId);
  }
}
const ru = [
  { type: Ue.OfficeDocument, target: "word/document.xml" },
  { type: Ue.ExtendedProperties, target: "docProps/app.xml" },
  { type: Ue.CoreProperties, target: "docProps/core.xml" },
  { type: Ue.CustomProperties, target: "docProps/custom.xml" }
];
class _i {
  constructor() {
    this.parts = [], this.partsMap = {}, this.contentTypes = [];
  }
  static async load(e, t, n) {
    var s = new _i();
    return s._options = n, s._parser = t, s._package = await ki.load(e, n), s.rels = await s._package.loadRelationships(), s.contentTypes = await s._package.loadContentTypes(), await Promise.all(ru.map((i) => {
      const a = s.rels.find((o) => o.type === i.type) ?? i;
      return s.loadRelationshipPart(a.target, a.type);
    })), s;
  }
  save(e = "blob") {
    return this._package.save(e);
  }
  async loadRelationshipPart(e, t) {
    if (this.partsMap[e])
      return this.partsMap[e];
    if (!this._package.get(e))
      return null;
    let n = null;
    switch (t) {
      case Ue.OfficeDocument:
        this.documentPart = n = new Ah(this._package, e, this._parser);
        break;
      case Ue.FontTable:
        this.fontTablePart = n = new ph(this._package, e);
        break;
      case Ue.Numbering:
        this.numberingPart = n = new Dh(this._package, e, this._parser);
        break;
      case Ue.Styles:
        this.stylesPart = n = new Mh(this._package, e, this._parser);
        break;
      case Ue.Theme:
        this.themePart = n = new qh(this._package, e);
        break;
      case Ue.Footnotes:
        this.footnotesPart = n = new Vh(this._package, e, this._parser);
        break;
      case Ue.Endnotes:
        this.endnotesPart = n = new Wh(this._package, e, this._parser);
        break;
      case Ue.Footer:
        n = new Fh(this._package, e, this._parser);
        break;
      case Ue.Header:
        n = new Ph(this._package, e, this._parser);
        break;
      case Ue.CoreProperties:
        this.corePropsPart = n = new Uh(this._package, e);
        break;
      case Ue.ExtendedProperties:
        this.extendedPropsPart = n = new Th(this._package, e);
        break;
      case Ue.CustomProperties:
        n = new Yh(this._package, e);
        break;
      case Ue.Settings:
        this.settingsPart = n = new Zh(this._package, e);
        break;
      case Ue.Comments:
        this.commentsPart = n = new eu(this._package, e, this._parser);
        break;
      case Ue.CommentsExtended:
        this.commentsExtendedPart = n = new tu(this._package, e);
        break;
    }
    if (n == null)
      return Promise.resolve(null);
    if (this.partsMap[e] = n, this.parts.push(n), await n.load(), n.rels?.length > 0) {
      const [s] = Nn(n.path);
      await Promise.all(n.rels.map((i) => this.loadRelationshipPart(js(i.target, s), i.type)));
    }
    return n;
  }
  async loadDocumentImage(e, t) {
    const n = this.getPathById(t ?? this.documentPart, e);
    return n ? this.blobToURL(await this._package.load(n, "blob"), n) : null;
  }
  async loadNumberingImage(e) {
    const t = this.getPathById(this.numberingPart, e);
    return t ? this.blobToURL(await this._package.load(t, "blob"), t) : null;
  }
  async loadFont(e, t) {
    const n = this.getPathById(this.fontTablePart, e);
    if (!n)
      return null;
    const s = await this._package.load(n, "uint8array");
    return s && this.blobToURL(new Blob([nu(s, t)]), n);
  }
  async loadAltChunk(e, t) {
    const n = this.getPathById(t ?? this.documentPart, e);
    return n ? this._package.load(n, "string") : Promise.resolve(null);
  }
  blobToURL(e, t) {
    if (!e)
      return null;
    if (t) {
      const n = this.contentTypes.find((s) => s.partName === t || s.extension && t.endsWith(`.${s.extension}`));
      e = n ? new Blob([e], { type: n.contentType }) : e;
    }
    return this._options.useBase64URL ? sh(e) : URL.createObjectURL(e);
  }
  findPartByRelId(e, t = null) {
    var n = (t.rels ?? this.rels).find((i) => i.id == e);
    const s = t ? Nn(t.path)[0] : "";
    return n ? this.partsMap[js(n.target, s)] : null;
  }
  getPathById(e, t) {
    const n = e.rels.find((i) => i.id == t), [s] = Nn(e.path);
    return n ? js(n.target, s) : null;
  }
}
function nu(r, e) {
  const n = e.replace(/{|}|-/g, ""), s = new Array(16);
  for (let i = 0; i < 16; i++)
    s[16 - i - 1] = parseInt(n.substring(i * 2, i * 2 + 2), 16);
  for (let i = 0; i < 32; i++)
    r[i] = r[i] ^ s[i % 16];
  return r;
}
function su(r, e) {
  return {
    type: q.BookmarkStart,
    id: e.attr(r, "id"),
    name: e.attr(r, "name"),
    colFirst: e.intAttr(r, "colFirst"),
    colLast: e.intAttr(r, "colLast")
  };
}
function iu(r, e) {
  return {
    type: q.BookmarkEnd,
    id: e.attr(r, "id")
  };
}
class au extends tr {
  constructor() {
    super(...arguments), this.type = q.VmlElement, this.attrs = {};
  }
}
function rl(r, e) {
  var t = new au();
  switch (r.localName) {
    case "rect":
      t.tagName = "rect", Object.assign(t.attrs, { width: "100%", height: "100%" });
      break;
    case "oval":
      t.tagName = "ellipse", Object.assign(t.attrs, { cx: "50%", cy: "50%", rx: "50%", ry: "50%" });
      break;
    case "line":
      t.tagName = "line";
      break;
    case "shape":
      t.tagName = "g";
      break;
    case "textbox":
      t.tagName = "foreignObject", Object.assign(t.attrs, { width: "100%", height: "100%" });
      break;
    default:
      return null;
  }
  for (const n of M.attrs(r))
    switch (n.localName) {
      case "style":
        t.cssStyleText = n.value;
        break;
      case "fillcolor":
        t.attrs.fill = n.value;
        break;
      case "from":
        const [s, i] = Ga(n.value);
        Object.assign(t.attrs, { x1: s, y1: i });
        break;
      case "to":
        const [a, o] = Ga(n.value);
        Object.assign(t.attrs, { x2: a, y2: o });
        break;
    }
  for (const n of M.elements(r))
    switch (n.localName) {
      case "stroke":
        Object.assign(t.attrs, ou(n));
        break;
      case "fill":
        Object.assign(t.attrs, lu());
        break;
      case "imagedata":
        t.tagName = "image", Object.assign(t.attrs, { width: "100%", height: "100%" }), t.imageHref = {
          id: M.attr(n, "id"),
          title: M.attr(n, "title")
        };
        break;
      case "txbxContent":
        t.children.push(...e.parseBodyElements(n));
        break;
      default:
        const s = rl(n, e);
        s && t.children.push(s);
        break;
    }
  return t;
}
function ou(r) {
  return {
    stroke: M.attr(r, "color"),
    "stroke-width": M.lengthAttr(r, "weight", Oe.Emu) ?? "1px"
  };
}
function lu(r) {
  return {};
}
function Ga(r) {
  return r.split(",");
}
class cu extends tr {
  constructor() {
    super(...arguments), this.type = q.Comment;
  }
}
class du extends tr {
  constructor(e) {
    super(), this.id = e, this.type = q.CommentReference;
  }
}
class hu extends tr {
  constructor(e) {
    super(), this.id = e, this.type = q.CommentRangeStart;
  }
}
class uu extends tr {
  constructor(e) {
    super(), this.id = e, this.type = q.CommentRangeEnd;
  }
}
var Bn = {
  shd: "inherit",
  color: "black",
  borderColor: "black",
  highlight: "transparent"
};
const fu = [], Ja = {
  oMath: q.MmlMath,
  oMathPara: q.MmlMathParagraph,
  f: q.MmlFraction,
  func: q.MmlFunction,
  fName: q.MmlFunctionName,
  num: q.MmlNumerator,
  den: q.MmlDenominator,
  rad: q.MmlRadical,
  deg: q.MmlDegree,
  e: q.MmlBase,
  sSup: q.MmlSuperscript,
  sSub: q.MmlSubscript,
  sPre: q.MmlPreSubSuper,
  sup: q.MmlSuperArgument,
  sub: q.MmlSubArgument,
  d: q.MmlDelimiter,
  nary: q.MmlNary,
  eqArr: q.MmlEquationArray,
  lim: q.MmlLimit,
  limLow: q.MmlLimitLower,
  m: q.MmlMatrix,
  mr: q.MmlMatrixRow,
  box: q.MmlBox,
  bar: q.MmlBar,
  groupChr: q.MmlGroupChar
};
class gu {
  constructor(e) {
    this.options = {
      ignoreWidth: !1,
      debug: !1,
      ...e
    };
  }
  parseNotes(e, t, n) {
    var s = [];
    for (let i of M.elements(e, t)) {
      const a = new n();
      a.id = M.attr(i, "id"), a.noteType = M.attr(i, "type"), a.children = this.parseBodyElements(i), s.push(a);
    }
    return s;
  }
  parseComments(e) {
    var t = [];
    for (let n of M.elements(e, "comment")) {
      const s = new cu();
      s.id = M.attr(n, "id"), s.author = M.attr(n, "author"), s.initials = M.attr(n, "initials"), s.date = M.attr(n, "date"), s.children = this.parseBodyElements(n), t.push(s);
    }
    return t;
  }
  parseDocumentFile(e) {
    var t = M.element(e, "body"), n = M.element(e, "background"), s = M.element(t, "sectPr");
    return {
      type: q.Document,
      children: this.parseBodyElements(t),
      props: s ? Wo(s, M) : {},
      cssStyle: n ? this.parseBackground(n) : {}
    };
  }
  parseBackground(e) {
    var t = {}, n = lr.colorAttr(e, "color");
    return n && (t["background-color"] = n), t;
  }
  parseBodyElements(e) {
    var t = [];
    for (const n of M.elements(e))
      switch (n.localName) {
        case "p":
          t.push(this.parseParagraph(n));
          break;
        case "altChunk":
          t.push(this.parseAltChunk(n));
          break;
        case "tbl":
          t.push(this.parseTable(n));
          break;
        case "sdt":
          t.push(...this.parseSdt(n, (s) => this.parseBodyElements(s)));
          break;
      }
    return t;
  }
  parseStylesFile(e) {
    var t = [];
    for (const n of M.elements(e))
      switch (n.localName) {
        case "style":
          t.push(this.parseStyle(n));
          break;
        case "docDefaults":
          t.push(this.parseDefaultStyles(n));
          break;
      }
    return t;
  }
  parseDefaultStyles(e) {
    var t = {
      id: null,
      name: null,
      target: null,
      basedOn: null,
      styles: []
    };
    for (const i of M.elements(e))
      switch (i.localName) {
        case "rPrDefault":
          var n = M.element(i, "rPr");
          n && t.styles.push({
            target: "span",
            values: this.parseDefaultProperties(n, {})
          });
          break;
        case "pPrDefault":
          var s = M.element(i, "pPr");
          s && t.styles.push({
            target: "p",
            values: this.parseDefaultProperties(s, {})
          });
          break;
      }
    return t;
  }
  parseStyle(e) {
    var t = {
      id: M.attr(e, "styleId"),
      isDefault: M.boolAttr(e, "default"),
      name: null,
      target: null,
      basedOn: null,
      styles: [],
      linked: null
    };
    switch (M.attr(e, "type")) {
      case "paragraph":
        t.target = "p";
        break;
      case "table":
        t.target = "table";
        break;
      case "character":
        t.target = "span";
        break;
    }
    for (const n of M.elements(e))
      switch (n.localName) {
        case "basedOn":
          t.basedOn = M.attr(n, "val");
          break;
        case "name":
          t.name = M.attr(n, "val");
          break;
        case "link":
          t.linked = M.attr(n, "val");
          break;
        case "next":
          t.next = M.attr(n, "val");
          break;
        case "aliases":
          t.aliases = M.attr(n, "val").split(",");
          break;
        case "pPr":
          t.styles.push({
            target: "p",
            values: this.parseDefaultProperties(n, {})
          }), t.paragraphProps = Xo(n, M);
          break;
        case "rPr":
          t.styles.push({
            target: "span",
            values: this.parseDefaultProperties(n, {})
          }), t.runProps = vi(n, M);
          break;
        case "tblPr":
        case "tcPr":
          t.styles.push({
            target: "td",
            values: this.parseDefaultProperties(n, {})
          });
          break;
        case "tblStylePr":
          for (let s of this.parseTableStyle(n))
            t.styles.push(s);
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
          this.options.debug && console.warn(`DOCX: Unknown style element: ${n.localName}`);
      }
    return t;
  }
  parseTableStyle(e) {
    var t = [], n = M.attr(e, "type"), s = "", i = "";
    switch (n) {
      case "firstRow":
        i = ".first-row", s = "tr.first-row td";
        break;
      case "lastRow":
        i = ".last-row", s = "tr.last-row td";
        break;
      case "firstCol":
        i = ".first-col", s = "td.first-col";
        break;
      case "lastCol":
        i = ".last-col", s = "td.last-col";
        break;
      case "band1Vert":
        i = ":not(.no-vband)", s = "td.odd-col";
        break;
      case "band2Vert":
        i = ":not(.no-vband)", s = "td.even-col";
        break;
      case "band1Horz":
        i = ":not(.no-hband)", s = "tr.odd-row";
        break;
      case "band2Horz":
        i = ":not(.no-hband)", s = "tr.even-row";
        break;
      default:
        return [];
    }
    for (const a of M.elements(e))
      switch (a.localName) {
        case "pPr":
          t.push({
            target: `${s} p`,
            mod: i,
            values: this.parseDefaultProperties(a, {})
          });
          break;
        case "rPr":
          t.push({
            target: `${s} span`,
            mod: i,
            values: this.parseDefaultProperties(a, {})
          });
          break;
        case "tblPr":
        case "tcPr":
          t.push({
            target: s,
            mod: i,
            values: this.parseDefaultProperties(a, {})
          });
          break;
      }
    return t;
  }
  parseNumberingFile(e) {
    const t = [], n = [], s = [];
    for (const i of M.elements(e))
      switch (i.localName) {
        case "abstractNum":
          t.push(...this.parseAbstractNumbering(i, s));
          break;
        case "numPicBullet":
          s.push(this.parseNumberingPicBullet(i));
          break;
        case "num":
          n.push({
            numId: M.attr(i, "numId"),
            abstractNumId: M.elementAttr(i, "abstractNumId", "val")
          });
          break;
      }
    return n.flatMap((i) => t.filter((a) => i.abstractNumId == a.id).map((a) => ({ ...a, id: i.numId })));
  }
  parseNumberingPicBullet(e) {
    var t = M.element(e, "pict"), n = t && M.element(t, "shape"), s = n && M.element(n, "imagedata");
    return s ? {
      id: M.intAttr(e, "numPicBulletId"),
      src: M.attr(s, "id"),
      style: M.attr(n, "style")
    } : null;
  }
  parseAbstractNumbering(e, t) {
    var n = [], s = M.attr(e, "abstractNumId");
    for (const i of M.elements(e))
      i.localName === "lvl" && n.push(this.parseNumberingLevel(s, i, t));
    return n;
  }
  parseNumberingLevel(e, t, n) {
    var s = {
      id: e,
      level: M.intAttr(t, "ilvl"),
      start: 1,
      pStyleName: void 0,
      pStyle: {},
      rStyle: {},
      suff: "tab"
    };
    for (const a of M.elements(t))
      switch (a.localName) {
        case "start":
          s.start = M.intAttr(a, "val");
          break;
        case "pPr":
          this.parseDefaultProperties(a, s.pStyle);
          break;
        case "rPr":
          this.parseDefaultProperties(a, s.rStyle);
          break;
        case "lvlPicBulletId":
          var i = M.intAttr(a, "val");
          s.bullet = n.find((o) => o?.id == i);
          break;
        case "lvlText":
          s.levelText = M.attr(a, "val");
          break;
        case "pStyle":
          s.pStyleName = M.attr(a, "val");
          break;
        case "numFmt":
          s.format = M.attr(a, "val");
          break;
        case "suff":
          s.suff = M.attr(a, "val");
          break;
      }
    return s;
  }
  parseSdt(e, t) {
    const n = M.element(e, "sdtContent");
    return n ? t(n) : [];
  }
  parseChange(e, t, n) {
    return {
      type: e,
      children: n(t)?.children ?? [],
      id: M.attr(t, "id"),
      author: M.attr(t, "author"),
      date: M.attr(t, "date")
    };
  }
  parseAltChunk(e) {
    return { type: q.AltChunk, children: [], id: M.attr(e, "id") };
  }
  parseParagraph(e) {
    var t = { type: q.Paragraph, children: [] };
    for (let n of M.elements(e))
      switch (n.localName) {
        case "pPr":
          this.parseParagraphProperties(n, t);
          break;
        case "r":
          t.children.push(this.parseRun(n, t));
          break;
        case "hyperlink":
          t.children.push(this.parseHyperlink(n, t));
          break;
        case "smartTag":
          t.children.push(this.parseSmartTag(n, t));
          break;
        case "bookmarkStart":
          t.children.push(su(n, M));
          break;
        case "bookmarkEnd":
          t.children.push(iu(n, M));
          break;
        case "commentRangeStart":
          t.children.push(new hu(M.attr(n, "id")));
          break;
        case "commentRangeEnd":
          t.children.push(new uu(M.attr(n, "id")));
          break;
        case "oMath":
        case "oMathPara":
          t.children.push(this.parseMathElement(n));
          break;
        case "sdt":
          t.children.push(...this.parseSdt(n, (s) => this.parseParagraph(s).children));
          break;
        case "ins":
          t.children.push(this.parseChange(q.Inserted, n, (s) => this.parseParagraph(s)));
          break;
        case "del":
          t.children.push(this.parseChange(q.Deleted, n, (s) => this.parseParagraph(s)));
          break;
      }
    return t;
  }
  parseParagraphProperties(e, t) {
    this.parseDefaultProperties(e, t.cssStyle = {}, null, (n) => {
      if (Zo(n, t, M))
        return !0;
      switch (n.localName) {
        case "pStyle":
          t.styleName = M.attr(n, "val");
          break;
        case "cnfStyle":
          t.className = Re.classNameOfCnfStyle(n);
          break;
        case "framePr":
          this.parseFrame(n, t);
          break;
        case "rPr":
          break;
        default:
          return !1;
      }
      return !0;
    });
  }
  parseFrame(e, t) {
    var n = M.attr(e, "dropCap");
    n == "drop" && (t.cssStyle.float = "left");
  }
  parseHyperlink(e, t) {
    var n = { type: q.Hyperlink, parent: t, children: [] };
    n.anchor = M.attr(e, "anchor"), n.id = M.attr(e, "id");
    for (const s of M.elements(e))
      s.localName === "r" && n.children.push(this.parseRun(s, n));
    return n;
  }
  parseSmartTag(e, t) {
    var n = { type: q.SmartTag, parent: t, children: [] }, s = M.attr(e, "uri"), i = M.attr(e, "element");
    s && (n.uri = s), i && (n.element = i);
    for (const a of M.elements(e))
      switch (a.localName) {
        case "r":
          n.children.push(this.parseRun(a, n));
          break;
        case "smartTag":
          n.children.push(this.parseSmartTag(a, n));
          break;
      }
    return n;
  }
  parseRun(e, t) {
    var n = { type: q.Run, parent: t, children: [] };
    for (let s of M.elements(e))
      switch (s = this.checkAlternateContent(s), s.localName) {
        case "t":
          n.children.push({
            type: q.Text,
            text: s.textContent
          });
          break;
        case "delText":
          n.children.push({
            type: q.DeletedText,
            text: s.textContent
          });
          break;
        case "commentReference":
          n.children.push(new du(M.attr(s, "id")));
          break;
        case "fldSimple":
          n.children.push({
            type: q.SimpleField,
            instruction: M.attr(s, "instr"),
            lock: M.boolAttr(s, "lock", !1),
            dirty: M.boolAttr(s, "dirty", !1)
          });
          break;
        case "instrText":
          n.fieldRun = !0, n.children.push({
            type: q.Instruction,
            text: s.textContent
          });
          break;
        case "fldChar":
          n.fieldRun = !0, n.children.push({
            type: q.ComplexField,
            charType: M.attr(s, "fldCharType"),
            lock: M.boolAttr(s, "lock", !1),
            dirty: M.boolAttr(s, "dirty", !1)
          });
          break;
        case "noBreakHyphen":
          n.children.push({ type: q.NoBreakHyphen });
          break;
        case "br":
          n.children.push({
            type: q.Break,
            break: M.attr(s, "type") || "textWrapping"
          });
          break;
        case "lastRenderedPageBreak":
          n.children.push({
            type: q.Break,
            break: "lastRenderedPageBreak"
          });
          break;
        case "sym":
          n.children.push({
            type: q.Symbol,
            font: oi(M.attr(s, "font")),
            char: M.hexAttr(s, "char")
          });
          break;
        case "tab":
          n.children.push({ type: q.Tab });
          break;
        case "footnoteReference":
          n.children.push({
            type: q.FootnoteReference,
            id: M.attr(s, "id")
          });
          break;
        case "endnoteReference":
          n.children.push({
            type: q.EndnoteReference,
            id: M.attr(s, "id")
          });
          break;
        case "drawing":
          let i = this.parseDrawing(s);
          i && n.children.push(i);
          break;
        case "pict":
          n.children.push(this.parseVmlPicture(s));
          break;
        case "rPr":
          this.parseRunProperties(s, n);
          break;
      }
    return n;
  }
  parseMathElement(e) {
    const t = `${e.localName}Pr`, n = { type: Ja[e.localName], children: [] };
    for (const i of M.elements(e))
      if (Ja[i.localName])
        n.children.push(this.parseMathElement(i));
      else if (i.localName == "r") {
        var s = this.parseRun(i);
        s.type = q.MmlRun, n.children.push(s);
      } else i.localName == t && (n.props = this.parseMathProperies(i));
    return n;
  }
  parseMathProperies(e) {
    const t = {};
    for (const n of M.elements(e))
      switch (n.localName) {
        case "chr":
          t.char = M.attr(n, "val");
          break;
        case "vertJc":
          t.verticalJustification = M.attr(n, "val");
          break;
        case "pos":
          t.position = M.attr(n, "val");
          break;
        case "degHide":
          t.hideDegree = M.boolAttr(n, "val");
          break;
        case "begChr":
          t.beginChar = M.attr(n, "val");
          break;
        case "endChr":
          t.endChar = M.attr(n, "val");
          break;
      }
    return t;
  }
  parseRunProperties(e, t) {
    this.parseDefaultProperties(e, t.cssStyle = {}, null, (n) => {
      switch (n.localName) {
        case "rStyle":
          t.styleName = M.attr(n, "val");
          break;
        case "vertAlign":
          t.verticalAlign = Re.valueOfVertAlign(n, !0);
          break;
        default:
          return !1;
      }
      return !0;
    });
  }
  parseVmlPicture(e) {
    const t = { type: q.VmlPicture, children: [] };
    for (const n of M.elements(e)) {
      const s = rl(n, this);
      s && t.children.push(s);
    }
    return t;
  }
  checkAlternateContent(e) {
    if (e.localName != "AlternateContent")
      return e;
    var t = M.element(e, "Choice");
    if (t) {
      var n = M.attr(t, "Requires"), s = e.lookupNamespaceURI(n);
      if (fu.includes(s))
        return t.firstElementChild;
    }
    return M.element(e, "Fallback")?.firstElementChild;
  }
  parseDrawing(e) {
    for (var t of M.elements(e))
      switch (t.localName) {
        case "inline":
        case "anchor":
          return this.parseDrawingWrapper(t);
      }
  }
  parseDrawingWrapper(e) {
    var t = { type: q.Drawing, children: [], cssStyle: {} }, n = e.localName == "anchor";
    let s = null, i = M.boolAttr(e, "simplePos");
    M.boolAttr(e, "behindDoc");
    let a = { relative: "page", align: "left", offset: "0" }, o = { relative: "page", align: "top", offset: "0" };
    for (var l of M.elements(e))
      switch (l.localName) {
        case "simplePos":
          i && (a.offset = M.lengthAttr(l, "x", Oe.Emu), o.offset = M.lengthAttr(l, "y", Oe.Emu));
          break;
        case "extent":
          t.cssStyle.width = M.lengthAttr(l, "cx", Oe.Emu), t.cssStyle.height = M.lengthAttr(l, "cy", Oe.Emu);
          break;
        case "positionH":
        case "positionV":
          if (!i) {
            let m = l.localName == "positionH" ? a : o;
            var h = M.element(l, "align"), p = M.element(l, "posOffset");
            m.relative = M.attr(l, "relativeFrom") ?? m.relative, h && (m.align = h.textContent), p && (m.offset = Go(p.textContent, Oe.Emu));
          }
          break;
        case "wrapTopAndBottom":
          s = "wrapTopAndBottom";
          break;
        case "wrapNone":
          s = "wrapNone";
          break;
        case "graphic":
          var b = this.parseGraphic(l);
          b && t.children.push(b);
          break;
      }
    return s == "wrapTopAndBottom" ? (t.cssStyle.display = "block", a.align && (t.cssStyle["text-align"] = a.align, t.cssStyle.width = "100%")) : s == "wrapNone" ? (t.cssStyle.display = "block", t.cssStyle.position = "relative", t.cssStyle.width = "0px", t.cssStyle.height = "0px", a.offset && (t.cssStyle.left = a.offset), o.offset && (t.cssStyle.top = o.offset)) : n && (a.align == "left" || a.align == "right") && (t.cssStyle.float = a.align), t;
  }
  parseGraphic(e) {
    var t = M.element(e, "graphicData");
    for (let n of M.elements(t))
      if (n.localName === "pic")
        return this.parsePicture(n);
    return null;
  }
  parsePicture(e) {
    var t = { type: q.Image, src: "", cssStyle: {} }, n = M.element(e, "blipFill"), s = M.element(n, "blip"), i = M.element(n, "srcRect");
    t.src = M.attr(s, "embed"), i && (t.srcRect = [
      M.intAttr(i, "l", 0) / 1e5,
      M.intAttr(i, "t", 0) / 1e5,
      M.intAttr(i, "r", 0) / 1e5,
      M.intAttr(i, "b", 0) / 1e5
    ]);
    var a = M.element(e, "spPr"), o = M.element(a, "xfrm");
    if (t.cssStyle.position = "relative", o) {
      t.rotation = M.intAttr(o, "rot", 0) / 6e4;
      for (var l of M.elements(o))
        switch (l.localName) {
          case "ext":
            t.cssStyle.width = M.lengthAttr(l, "cx", Oe.Emu), t.cssStyle.height = M.lengthAttr(l, "cy", Oe.Emu);
            break;
          case "off":
            t.cssStyle.left = M.lengthAttr(l, "x", Oe.Emu), t.cssStyle.top = M.lengthAttr(l, "y", Oe.Emu);
            break;
        }
    }
    return t;
  }
  parseTable(e) {
    var t = { type: q.Table, children: [] };
    for (const n of M.elements(e))
      switch (n.localName) {
        case "tr":
          t.children.push(this.parseTableRow(n));
          break;
        case "tblGrid":
          t.columns = this.parseTableColumns(n);
          break;
        case "tblPr":
          this.parseTableProperties(n, t);
          break;
      }
    return t;
  }
  parseTableColumns(e) {
    var t = [];
    for (const n of M.elements(e))
      n.localName === "gridCol" && t.push({ width: M.lengthAttr(n, "w") });
    return t;
  }
  parseTableProperties(e, t) {
    switch (t.cssStyle = {}, t.cellStyle = {}, this.parseDefaultProperties(e, t.cssStyle, t.cellStyle, (n) => {
      switch (n.localName) {
        case "tblStyle":
          t.styleName = M.attr(n, "val");
          break;
        case "tblLook":
          t.className = Re.classNameOftblLook(n);
          break;
        case "tblpPr":
          this.parseTablePosition(n, t);
          break;
        case "tblStyleColBandSize":
          t.colBandSize = M.intAttr(n, "val");
          break;
        case "tblStyleRowBandSize":
          t.rowBandSize = M.intAttr(n, "val");
          break;
        case "hidden":
          t.cssStyle.display = "none";
          break;
        default:
          return !1;
      }
      return !0;
    }), t.cssStyle["text-align"]) {
      case "center":
        delete t.cssStyle["text-align"], t.cssStyle["margin-left"] = "auto", t.cssStyle["margin-right"] = "auto";
        break;
      case "right":
        delete t.cssStyle["text-align"], t.cssStyle["margin-left"] = "auto";
        break;
    }
  }
  parseTablePosition(e, t) {
    var n = M.lengthAttr(e, "topFromText"), s = M.lengthAttr(e, "bottomFromText"), i = M.lengthAttr(e, "rightFromText"), a = M.lengthAttr(e, "leftFromText");
    t.cssStyle.float = "left", t.cssStyle["margin-bottom"] = Re.addSize(t.cssStyle["margin-bottom"], s), t.cssStyle["margin-left"] = Re.addSize(t.cssStyle["margin-left"], a), t.cssStyle["margin-right"] = Re.addSize(t.cssStyle["margin-right"], i), t.cssStyle["margin-top"] = Re.addSize(t.cssStyle["margin-top"], n);
  }
  parseTableRow(e) {
    var t = { type: q.Row, children: [] };
    for (const n of M.elements(e))
      switch (n.localName) {
        case "tc":
          t.children.push(this.parseTableCell(n));
          break;
        case "trPr":
        case "tblPrEx":
          this.parseTableRowProperties(n, t);
          break;
      }
    return t;
  }
  parseTableRowProperties(e, t) {
    t.cssStyle = this.parseDefaultProperties(e, {}, null, (n) => {
      switch (n.localName) {
        case "cnfStyle":
          t.className = Re.classNameOfCnfStyle(n);
          break;
        case "tblHeader":
          t.isHeader = M.boolAttr(n, "val");
          break;
        case "gridBefore":
          t.gridBefore = M.intAttr(n, "val");
          break;
        case "gridAfter":
          t.gridAfter = M.intAttr(n, "val");
          break;
        default:
          return !1;
      }
      return !0;
    });
  }
  parseTableCell(e) {
    var t = { type: q.Cell, children: [] };
    for (const n of M.elements(e))
      switch (n.localName) {
        case "tbl":
          t.children.push(this.parseTable(n));
          break;
        case "p":
          t.children.push(this.parseParagraph(n));
          break;
        case "tcPr":
          this.parseTableCellProperties(n, t);
          break;
      }
    return t;
  }
  parseTableCellProperties(e, t) {
    t.cssStyle = this.parseDefaultProperties(e, {}, null, (n) => {
      switch (n.localName) {
        case "gridSpan":
          t.span = M.intAttr(n, "val", null);
          break;
        case "vMerge":
          t.verticalMerge = M.attr(n, "val") ?? "continue";
          break;
        case "cnfStyle":
          t.className = Re.classNameOfCnfStyle(n);
          break;
        default:
          return !1;
      }
      return !0;
    }), this.parseTableCellVerticalText(e, t);
  }
  parseTableCellVerticalText(e, t) {
    const n = {
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
    for (const s of M.elements(e))
      if (s.localName === "textDirection") {
        const i = M.attr(s, "val"), a = n[i] || { writingMode: "horizontal-tb" };
        t.cssStyle["writing-mode"] = a.writingMode, t.cssStyle.transform = a.transform;
      }
  }
  parseDefaultProperties(e, t = null, n = null, s = null) {
    t = t || {};
    for (const i of M.elements(e))
      if (!s?.(i))
        switch (i.localName) {
          case "jc":
            t["text-align"] = Re.valueOfJc(i);
            break;
          case "textAlignment":
            t["vertical-align"] = Re.valueOfTextAlignment(i);
            break;
          case "color":
            t.color = lr.colorAttr(i, "val", null, Bn.color);
            break;
          case "sz":
            t["font-size"] = t["min-height"] = M.lengthAttr(i, "val", Oe.FontSize);
            break;
          case "shd":
            t["background-color"] = lr.colorAttr(i, "fill", null, Bn.shd);
            break;
          case "highlight":
            t["background-color"] = lr.colorAttr(i, "val", null, Bn.highlight);
            break;
          case "vertAlign":
            break;
          case "position":
            t.verticalAlign = M.lengthAttr(i, "val", Oe.FontSize);
            break;
          case "tcW":
            if (this.options.ignoreWidth)
              break;
          case "tblW":
            t.width = Re.valueOfSize(i, "w");
            break;
          case "trHeight":
            this.parseTrHeight(i, t);
            break;
          case "strike":
            t["text-decoration"] = M.boolAttr(i, "val", !0) ? "line-through" : "none";
            break;
          case "b":
            t["font-weight"] = M.boolAttr(i, "val", !0) ? "bold" : "normal";
            break;
          case "i":
            t["font-style"] = M.boolAttr(i, "val", !0) ? "italic" : "normal";
            break;
          case "caps":
            t["text-transform"] = M.boolAttr(i, "val", !0) ? "uppercase" : "none";
            break;
          case "smallCaps":
            t["font-variant"] = M.boolAttr(i, "val", !0) ? "small-caps" : "none";
            break;
          case "u":
            this.parseUnderline(i, t);
            break;
          case "ind":
          case "tblInd":
            this.parseIndentation(i, t);
            break;
          case "rFonts":
            this.parseFont(i, t);
            break;
          case "tblBorders":
            this.parseBorderProperties(i, n || t);
            break;
          case "tblCellSpacing":
            t["border-spacing"] = Re.valueOfMargin(i), t["border-collapse"] = "separate";
            break;
          case "pBdr":
            this.parseBorderProperties(i, t);
            break;
          case "bdr":
            t.border = Re.valueOfBorder(i);
            break;
          case "tcBorders":
            this.parseBorderProperties(i, t);
            break;
          case "vanish":
            M.boolAttr(i, "val", !0) && (t.display = "none");
            break;
          case "kern":
            break;
          case "noWrap":
            break;
          case "tblCellMar":
          case "tcMar":
            this.parseMarginProperties(i, n || t);
            break;
          case "tblLayout":
            t["table-layout"] = Re.valueOfTblLayout(i);
            break;
          case "vAlign":
            t["vertical-align"] = Re.valueOfTextAlignment(i);
            break;
          case "spacing":
            e.localName == "pPr" && this.parseSpacing(i, t);
            break;
          case "wordWrap":
            M.boolAttr(i, "val") && (t["overflow-wrap"] = "break-word");
            break;
          case "suppressAutoHyphens":
            t.hyphens = M.boolAttr(i, "val", !0) ? "none" : "auto";
            break;
          case "lang":
            t.$lang = M.attr(i, "val");
            break;
          case "rtl":
          case "bidi":
            M.boolAttr(i, "val", !0) && (t.direction = "rtl");
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
            this.options.debug && console.warn(`DOCX: Unknown document element: ${e.localName}.${i.localName}`);
            break;
        }
    return t;
  }
  parseUnderline(e, t) {
    var n = M.attr(e, "val");
    if (n != null) {
      switch (n) {
        case "dash":
        case "dashDotDotHeavy":
        case "dashDotHeavy":
        case "dashedHeavy":
        case "dashLong":
        case "dashLongHeavy":
        case "dotDash":
        case "dotDotDash":
          t["text-decoration"] = "underline dashed";
          break;
        case "dotted":
        case "dottedHeavy":
          t["text-decoration"] = "underline dotted";
          break;
        case "double":
          t["text-decoration"] = "underline double";
          break;
        case "single":
        case "thick":
          t["text-decoration"] = "underline";
          break;
        case "wave":
        case "wavyDouble":
        case "wavyHeavy":
          t["text-decoration"] = "underline wavy";
          break;
        case "words":
          t["text-decoration"] = "underline";
          break;
        case "none":
          t["text-decoration"] = "none";
          break;
      }
      var s = lr.colorAttr(e, "color");
      s && (t["text-decoration-color"] = s);
    }
  }
  parseFont(e, t) {
    var n = M.attr(e, "ascii"), s = Re.themeValue(e, "asciiTheme"), i = M.attr(e, "eastAsia"), a = [n, s, i].filter((o) => o).map((o) => oi(o));
    a.length > 0 && (t["font-family"] = [...new Set(a)].join(", "));
  }
  parseIndentation(e, t) {
    var n = M.lengthAttr(e, "firstLine"), s = M.lengthAttr(e, "hanging"), i = M.lengthAttr(e, "left"), a = M.lengthAttr(e, "start"), o = M.lengthAttr(e, "right"), l = M.lengthAttr(e, "end");
    n && (t["text-indent"] = n), s && (t["text-indent"] = `-${s}`), (i || a) && (t["margin-inline-start"] = i || a), (o || l) && (t["margin-inline-end"] = o || l);
  }
  parseSpacing(e, t) {
    var n = M.lengthAttr(e, "before"), s = M.lengthAttr(e, "after"), i = M.intAttr(e, "line", null), a = M.attr(e, "lineRule");
    if (n && (t["margin-top"] = n), s && (t["margin-bottom"] = s), i !== null)
      switch (a) {
        case "auto":
          t["line-height"] = `${(i / 240).toFixed(2)}`;
          break;
        case "atLeast":
          t["line-height"] = `calc(100% + ${i / 20}pt)`;
          break;
        default:
          t["line-height"] = t["min-height"] = `${i / 20}pt`;
          break;
      }
  }
  parseMarginProperties(e, t) {
    for (const n of M.elements(e))
      switch (n.localName) {
        case "left":
          t["padding-left"] = Re.valueOfMargin(n);
          break;
        case "right":
          t["padding-right"] = Re.valueOfMargin(n);
          break;
        case "top":
          t["padding-top"] = Re.valueOfMargin(n);
          break;
        case "bottom":
          t["padding-bottom"] = Re.valueOfMargin(n);
          break;
      }
  }
  parseTrHeight(e, t) {
    M.attr(e, "hRule"), t.height = M.lengthAttr(e, "val");
  }
  parseBorderProperties(e, t) {
    for (const n of M.elements(e))
      switch (n.localName) {
        case "start":
        case "left":
          t["border-left"] = Re.valueOfBorder(n);
          break;
        case "end":
        case "right":
          t["border-right"] = Re.valueOfBorder(n);
          break;
        case "top":
          t["border-top"] = Re.valueOfBorder(n);
          break;
        case "bottom":
          t["border-bottom"] = Re.valueOfBorder(n);
          break;
      }
  }
}
const pu = ["black", "blue", "cyan", "darkBlue", "darkCyan", "darkGray", "darkGreen", "darkMagenta", "darkRed", "darkYellow", "green", "lightGray", "magenta", "none", "red", "white", "yellow"];
class lr {
  static colorAttr(e, t, n = null, s = "black") {
    var i = M.attr(e, t);
    if (i)
      return i == "auto" ? s : pu.includes(i) ? i : `#${i}`;
    var a = M.attr(e, "themeColor");
    return a ? `var(--docx-${a}-color)` : n;
  }
}
class Re {
  static themeValue(e, t) {
    var n = M.attr(e, t);
    return n ? `var(--docx-${n}-font)` : null;
  }
  static valueOfSize(e, t) {
    var n = Oe.Dxa;
    switch (M.attr(e, "type")) {
      case "dxa":
        break;
      case "pct":
        n = Oe.Percent;
        break;
      case "auto":
        return "auto";
    }
    return M.lengthAttr(e, t, n);
  }
  static valueOfMargin(e) {
    return M.lengthAttr(e, "w");
  }
  static valueOfBorder(e) {
    var t = Re.parseBorderType(M.attr(e, "val"));
    if (t == "none")
      return "none";
    var n = lr.colorAttr(e, "color"), s = M.lengthAttr(e, "sz", Oe.Border);
    return `${s} ${t} ${n == "auto" ? Bn.borderColor : n}`;
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
    var t = M.attr(e, "val");
    return t == "fixed" ? "fixed" : "auto";
  }
  static classNameOfCnfStyle(e) {
    const t = M.attr(e, "val"), n = [
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
    if (t)
      return n.filter((i, a) => t[a] == "1").join(" ");
    const s = [
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
    return n.filter((i, a) => M.boolAttr(e, s[a])).join(" ");
  }
  static valueOfJc(e) {
    var t = M.attr(e, "val");
    switch (t) {
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
    return t;
  }
  static valueOfVertAlign(e, t = !1) {
    var n = M.attr(e, "val");
    switch (n) {
      case "subscript":
        return "sub";
      case "superscript":
        return t ? "sup" : "super";
    }
    return t ? null : n;
  }
  static valueOfTextAlignment(e) {
    var t = M.attr(e, "val");
    switch (t) {
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
    return t;
  }
  static addSize(e, t) {
    return e == null ? t : t == null ? e : `calc(${e} + ${t})`;
  }
  static classNameOftblLook(e) {
    const t = M.hexAttr(e, "val", 0);
    let n = "";
    return (M.boolAttr(e, "firstRow") || t & 32) && (n += " first-row"), (M.boolAttr(e, "lastRow") || t & 64) && (n += " last-row"), (M.boolAttr(e, "firstColumn") || t & 128) && (n += " first-col"), (M.boolAttr(e, "lastColumn") || t & 256) && (n += " last-col"), (M.boolAttr(e, "noHBand") || t & 512) && (n += " no-hband"), (M.boolAttr(e, "noVBand") || t & 1024) && (n += " no-vband"), n.trim();
  }
}
const Va = { pos: 0, leader: "none", style: "left" }, mu = 50;
function bu(r = document.body) {
  const e = document.createElement("div");
  e.style.width = "100pt", r.appendChild(e);
  const t = 100 / e.offsetWidth;
  return r.removeChild(e), t;
}
function Au(r, e, t, n = 72 / 96) {
  const s = r.closest("p"), i = r.getBoundingClientRect(), a = s.getBoundingClientRect(), o = getComputedStyle(s), l = e?.length > 0 ? e.map((_) => ({
    pos: Wa(_.position),
    leader: _.leader,
    style: _.style
  })).sort((_, B) => _.pos - B.pos) : [Va], h = l[l.length - 1], p = a.width * n, b = Wa(t);
  let m = h.pos + b;
  if (m < p)
    for (; m < p && l.length < mu; m += b)
      l.push({ ...Va, pos: m });
  const u = parseFloat(o.marginLeft), y = a.left + u, A = (i.left - y) * n, w = l.find((_) => _.style != "clear" && _.pos > A);
  if (w == null)
    return;
  let k = 1;
  if (w.style == "right" || w.style == "center") {
    const _ = Array.from(s.querySelectorAll(`.${r.className}`)), B = _.indexOf(r) + 1, C = document.createRange();
    C.setStart(r, 1), B < _.length ? C.setEndBefore(_[B]) : C.setEndAfter(s);
    const S = w.style == "center" ? 0.5 : 1, z = C.getBoundingClientRect(), x = z.left + S * z.width - (a.left - u);
    k = w.pos - x * n;
  } else
    k = w.pos - A;
  switch (r.innerHTML = "&nbsp;", r.style.textDecoration = "inherit", r.style.wordSpacing = `${k.toFixed(0)}pt`, w.leader) {
    case "dot":
    case "middleDot":
      r.style.textDecoration = "underline", r.style.textDecorationStyle = "dotted";
      break;
    case "hyphen":
    case "heavy":
    case "underscore":
      r.style.textDecoration = "underline";
      break;
  }
}
function Wa(r) {
  return parseFloat(r);
}
var xe;
(function(r) {
  r.html = "http://www.w3.org/1999/xhtml", r.svg = "http://www.w3.org/2000/svg", r.mathML = "http://www.w3.org/1998/Math/MathML";
})(xe || (xe = {}));
function Ln(r) {
  if (li(r))
    return document.createTextNode(r);
  if (r instanceof Node)
    return r;
  const { ns: e, tagName: t, className: n, style: s, children: i, ...a } = r;
  if (t === "#fragment")
    return document.createDocumentFragment();
  if (t === "#comment")
    return document.createComment(i[0]);
  const o = e ? document.createElementNS(e, t) : document.createElement(t);
  if (n && o.setAttribute("class", n), s && (li(s) ? o.setAttribute("style", s) : Object.assign(o.style, s)), a)
    for (const [l, h] of Object.entries(a))
      h !== void 0 && (o[l] = h);
  return i && i.forEach((l) => o.appendChild(Ln(l))), o;
}
function wu(...r) {
  return r.filter(Boolean).join(" ");
}
class yu {
  constructor() {
    this.className = "docx", this.styleMap = {}, this.currentPart = null, this.tableVerticalMerges = [], this.currentVerticalMerge = null, this.tableCellPositions = [], this.currentCellPosition = null, this.footnoteMap = {}, this.endnoteMap = {}, this.currentEndnoteIds = [], this.usedHederFooterParts = [], this.currentTabs = [], this.commentMap = {}, this.tasks = [], this.postRenderTasks = [], this.h = Ln;
  }
  async render(e, t) {
    this.document = e, this.options = t, this.className = t.className, this.rootSelector = t.inWrapper ? `.${this.className}-wrapper` : ":root", this.h = t.h ?? Ln, this.styleMap = null, this.tasks = [], this.options.renderComments && globalThis.Highlight && (this.commentHighlight = new Highlight());
    const n = [...this.renderDefaultStyle()];
    e.themePart && n.push(...this.renderTheme(e.themePart)), e.stylesPart != null && (this.styleMap = this.processStyles(e.stylesPart.styles), n.push(...this.renderStyles(e.stylesPart.styles))), e.numberingPart && (this.prodessNumberings(e.numberingPart.domNumberings), n.push(...await this.renderNumbering(e.numberingPart.domNumberings))), e.footnotesPart && (this.footnoteMap = Qt(e.footnotesPart.notes, (i) => i.id)), e.endnotesPart && (this.endnoteMap = Qt(e.endnotesPart.notes, (i) => i.id)), e.settingsPart && (this.defaultTabSize = e.settingsPart.settings?.defaultTabStop), !t.ignoreFonts && e.fontTablePart && n.push(...await this.renderFontTable(e.fontTablePart));
    var s = this.renderSections(e.documentPart.body);
    return this.options.inWrapper ? n.push(this.renderWrapper(s)) : n.push(...s), this.commentHighlight && t.renderComments && CSS.highlights.set(`${this.className}-comments`, this.commentHighlight), this.postRenderTasks.forEach((i) => i()), await Promise.allSettled(this.tasks), this.refreshTabStops(), n;
  }
  renderTheme(e) {
    const t = {}, n = e.theme?.fontScheme;
    n && (n.majorFont && (t["--docx-majorHAnsi-font"] = n.majorFont.latinTypeface), n.minorFont && (t["--docx-minorHAnsi-font"] = n.minorFont.latinTypeface));
    const s = e.theme?.colorScheme;
    if (s)
      for (let [a, o] of Object.entries(s.colors))
        t[`--docx-${a}-color`] = `#${o}`;
    const i = this.styleToString(`.${this.className}`, t);
    return [
      this.h({ tagName: "#comment", children: ["docxjs document theme values"] }),
      this.h({ tagName: "style", children: [i] })
    ];
  }
  async renderFontTable(e) {
    const t = [];
    for (let n of e.fonts)
      for (let s of n.embedFontRefs)
        try {
          const i = await this.document.loadFont(s.id, s.key), a = {
            "font-family": oi(n.name),
            src: `url(${i})`
          };
          (s.type == "bold" || s.type == "boldItalic") && (a["font-weight"] = "bold"), (s.type == "italic" || s.type == "boldItalic") && (a["font-style"] = "italic"), t.push(this.h({ tagName: "#comment", children: [`docxjs ${n.name} font`] })), t.push(this.h({ tagName: "style", children: [this.styleToString("@font-face", a)] }));
        } catch {
          this.options.debug && console.warn(`Can't load font with id ${s.id} and key ${s.key}`);
        }
    return t;
  }
  processStyleName(e) {
    return e ? `${this.className}_${nh(e)}` : this.className;
  }
  processStyles(e) {
    const t = Qt(e.filter((s) => s.id != null), (s) => s.id);
    for (const s of e.filter((i) => i.basedOn)) {
      var n = t[s.basedOn];
      if (n) {
        s.paragraphProps = Tn(s.paragraphProps, n.paragraphProps), s.runProps = Tn(s.runProps, n.runProps);
        for (const i of n.styles) {
          const a = s.styles.find((o) => o.target == i.target);
          a ? this.copyStyleProperties(i.values, a.values) : s.styles.push({ ...i, values: { ...i.values } });
        }
      } else this.options.debug && console.warn(`Can't find base style ${s.basedOn}`);
    }
    for (let s of e)
      s.cssName = this.processStyleName(s.id);
    return t;
  }
  prodessNumberings(e) {
    for (let t of e.filter((n) => n.pStyleName)) {
      const n = this.findStyle(t.pStyleName);
      n?.paragraphProps?.numbering && (n.paragraphProps.numbering.level = t.level);
    }
  }
  processElement(e) {
    if (e.children)
      for (var t of e.children)
        t.parent = e, t.type == q.Table ? this.processTable(t) : this.processElement(t);
  }
  processTable(e) {
    for (var t of e.children)
      for (var n of t.children)
        n.cssStyle = this.copyStyleProperties(e.cellStyle, n.cssStyle, [
          "border-left",
          "border-right",
          "border-top",
          "border-bottom",
          "padding-left",
          "padding-right",
          "padding-top",
          "padding-bottom"
        ]), this.processElement(n);
  }
  copyStyleProperties(e, t, n = null) {
    if (!e)
      return t;
    t == null && (t = {}), n == null && (n = Object.getOwnPropertyNames(e));
    for (var s of n)
      e.hasOwnProperty(s) && !t.hasOwnProperty(s) && (t[s] = e[s]);
    return t;
  }
  createPageElement(e, t, n) {
    const s = { ...n };
    return t && (t.pageMargins && (s.paddingLeft = t.pageMargins.left, s.paddingRight = t.pageMargins.right, s.paddingTop = t.pageMargins.top, s.paddingBottom = t.pageMargins.bottom), t.pageSize && (this.options.ignoreWidth || (s.width = t.pageSize.width), this.options.ignoreHeight || (s.minHeight = t.pageSize.height))), this.h({ tagName: "section", className: e, style: s });
  }
  createSectionContent(e) {
    const t = {};
    return e.columns && e.columns.numberOfColumns && (t.columnCount = `${e.columns.numberOfColumns}`, t.columnGap = e.columns.space, e.columns.separator && (t.columnRule = "1px solid black")), this.h({ tagName: "article", style: t });
  }
  renderSections(e) {
    const t = [];
    this.processElement(e);
    const n = this.splitBySection(e.children, e.props), s = this.groupByPageBreaks(n);
    let i = null;
    for (let o = 0, l = s.length; o < l; o++) {
      this.currentFootnoteIds = [];
      let p = s[o][0].sectProps;
      const b = this.createPageElement(this.className, p, e.cssStyle);
      this.options.renderHeaders && this.renderHeaderFooter(p.headerRefs, p, t.length, i != p, b);
      for (const m of s[o]) {
        var a = this.createSectionContent(m.sectProps);
        this.renderElements(m.elements, a), b.appendChild(a), p = m.sectProps;
      }
      if (this.options.renderFootnotes) {
        const m = this.renderNotes(this.currentFootnoteIds, this.footnoteMap);
        m && b.appendChild(m);
      }
      if (this.options.renderEndnotes && o == l - 1) {
        const m = this.renderNotes(this.currentEndnoteIds, this.endnoteMap);
        m && b.appendChild(m);
      }
      this.options.renderFooters && this.renderHeaderFooter(p.footerRefs, p, t.length, i != p, b), t.push(b), i = p;
    }
    return t;
  }
  renderHeaderFooter(e, t, n, s, i) {
    if (e) {
      var a = (t.titlePage && s ? e.find((l) => l.type == "first") : null) ?? (n % 2 == 1 ? e.find((l) => l.type == "even") : null) ?? e.find((l) => l.type == "default"), o = a && this.document.findPartByRelId(a.id, this.document.documentPart);
      if (o) {
        this.currentPart = o, this.usedHederFooterParts.includes(o.path) || (this.processElement(o.rootElement), this.usedHederFooterParts.push(o.path));
        const [l] = this.renderElements([o.rootElement], i);
        t?.pageMargins && (o.rootElement.type === q.Header ? (l.style.marginTop = `calc(${t.pageMargins.header} - ${t.pageMargins.top})`, l.style.minHeight = `calc(${t.pageMargins.top} - ${t.pageMargins.header})`) : o.rootElement.type === q.Footer && (l.style.marginBottom = `calc(${t.pageMargins.footer} - ${t.pageMargins.bottom})`, l.style.minHeight = `calc(${t.pageMargins.bottom} - ${t.pageMargins.footer})`)), this.currentPart = null;
      }
    }
  }
  isPageBreakElement(e) {
    return e.type != q.Break ? !1 : e.break == "lastRenderedPageBreak" ? !this.options.ignoreLastRenderedPageBreak : e.break == "page";
  }
  isPageBreakSection(e, t) {
    return !e || !t ? !1 : e.pageSize?.orientation != t.pageSize?.orientation || e.pageSize?.width != t.pageSize?.width || e.pageSize?.height != t.pageSize?.height;
  }
  splitBySection(e, t) {
    var n = { sectProps: null, elements: [], pageBreak: !1 }, s = [n];
    for (let b of e)
      if (b.type == q.Paragraph && this.findStyle(b.styleName)?.paragraphProps?.pageBreakBefore && (n.sectProps = i, n.pageBreak = !0, n = { sectProps: null, elements: [], pageBreak: !1 }, s.push(n)), n.elements.push(b), b.type == q.Paragraph) {
        const m = b;
        var i = m.sectionProps, a = -1, o = -1;
        if (this.options.breakPages && m.children && (a = m.children.findIndex((u) => (o = u.children?.findIndex(this.isPageBreakElement.bind(this)) ?? -1, o != -1))), (i || a != -1) && (n.sectProps = i, n.pageBreak = a != -1, n = { sectProps: null, elements: [], pageBreak: !1 }, s.push(n)), a != -1) {
          let u = m.children[a], y = o < u.children.length - 1;
          if (a < m.children.length - 1 || y) {
            var l = b.children, h = { ...b, children: l.slice(a) };
            if (b.children = l.slice(0, a), n.elements.push(h), y) {
              let A = u.children, w = { ...u, children: A.slice(0, o) };
              b.children.push(w), u.children = A.slice(o);
            }
          }
        }
      }
    let p = null;
    for (let b = s.length - 1; b >= 0; b--)
      s[b].sectProps == null ? s[b].sectProps = p ?? t : p = s[b].sectProps;
    return s;
  }
  groupByPageBreaks(e) {
    let t = [], n;
    const s = [t];
    for (let i of e)
      t.push(i), (this.options.ignoreLastRenderedPageBreak || i.pageBreak || this.isPageBreakSection(n, i.sectProps)) && s.push(t = []), n = i.sectProps;
    return s.filter((i) => i.length > 0);
  }
  renderWrapper(e) {
    return this.h({ tagName: "div", className: `${this.className}-wrapper`, children: e });
  }
  renderDefaultStyle() {
    var e = this.className, t = `
.${e}-wrapper { background: gray; padding: 30px; padding-bottom: 0px; display: flex; flex-flow: column; align-items: center; } 
.${e}-wrapper>section.${e} { background: white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); margin-bottom: 30px; }`;
    this.options.hideWrapperOnPrint && (t = `@media not print { ${t} }`);
    var n = `${t}
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
    return this.options.renderComments && (n += `
.${e}-comment-ref { cursor: default; }
.${e}-comment-popover { display: none; z-index: 1000; padding: 0.5rem; background: white; position: absolute; box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.25); width: 30ch; }
.${e}-comment-ref:hover~.${e}-comment-popover { display: block; }
.${e}-comment-author,.${e}-comment-date { font-size: 0.875rem; color: #888; }
`), [
      this.h({ tagName: "#comment", children: ["docxjs library predefined styles"] }),
      this.h({ tagName: "style", children: [n] })
    ];
  }
  async renderNumbering(e) {
    var t = "", n = [];
    for (var s of e) {
      var i = `p.${this.numberingClass(s.id, s.level)}`, a = "none";
      if (s.bullet) {
        let o = `--${this.className}-${s.bullet.src}`.toLowerCase();
        t += this.styleToString(`${i}:before`, {
          content: "' '",
          display: "inline-block",
          background: `var(${o})`
        }, s.bullet.style);
        try {
          const l = await this.document.loadNumberingImage(s.bullet.src);
          t += `${this.rootSelector} { ${o}: url(${l}) }`;
        } catch {
          this.options.debug && console.warn(`Can't load numbering image with src ${s.bullet.src}`);
        }
      } else if (s.levelText) {
        let o = this.numberingCounter(s.id, s.level);
        const l = o + " " + (s.start - 1);
        s.level > 0 && (t += this.styleToString(`p.${this.numberingClass(s.id, s.level - 1)}`, {
          "counter-set": l
        })), n.push(l), t += this.styleToString(`${i}:before`, {
          content: this.levelTextToContent(s.levelText, s.suff, s.id, this.numFormatToCssValue(s.format)),
          "counter-increment": o,
          ...s.rStyle
        });
      } else
        a = this.numFormatToCssValue(s.format);
      t += this.styleToString(i, {
        display: "list-item",
        "list-style-position": "inside",
        "list-style-type": a,
        ...s.pStyle
      });
    }
    return n.length > 0 && (t += this.styleToString(this.rootSelector, {
      "counter-reset": n.join(" ")
    })), [
      this.h({ tagName: "#comment", children: ["docxjs document numbering styles"] }),
      this.h({ tagName: "style", children: [t] })
    ];
  }
  renderStyles(e) {
    var t = "";
    const n = this.styleMap, s = Qt(e.filter((l) => l.isDefault), (l) => l.target);
    for (const l of e) {
      var i = l.styles;
      if (l.linked) {
        var a = l.linked && n[l.linked];
        a ? i = i.concat(a.styles) : this.options.debug && console.warn(`Can't find linked style ${l.linked}`);
      }
      for (const h of i) {
        var o = `${l.target ?? ""}.${l.cssName}`;
        l.target != h.target && (o += ` ${h.target}`), s[l.target] == l && (o = `.${this.className} ${l.target}, ` + o), t += this.styleToString(o, h.values);
      }
    }
    return [
      this.h({ tagName: "#comment", children: ["docxjs document styles"] }),
      this.h({ tagName: "style", children: [t] })
    ];
  }
  renderNotes(e, t) {
    var n = e.map((s) => t[s]).filter((s) => s);
    if (n.length > 0)
      return this.h({ tagName: "ol", children: this.renderElements(n) });
  }
  renderElement(e) {
    switch (e.type) {
      case q.Paragraph:
        return this.renderParagraph(e);
      case q.BookmarkStart:
        return this.renderBookmarkStart(e);
      case q.BookmarkEnd:
        return null;
      case q.Run:
        return this.renderRun(e);
      case q.Table:
        return this.renderTable(e);
      case q.Row:
        return this.renderTableRow(e);
      case q.Cell:
        return this.renderTableCell(e);
      case q.Hyperlink:
        return this.renderHyperlink(e);
      case q.SmartTag:
        return this.renderSmartTag(e);
      case q.Drawing:
        return this.renderDrawing(e);
      case q.Image:
        return this.renderImage(e);
      case q.Text:
        return this.renderText(e);
      case q.Text:
        return this.renderText(e);
      case q.DeletedText:
        return this.renderDeletedText(e);
      case q.Tab:
        return this.renderTab(e);
      case q.Symbol:
        return this.renderSymbol(e);
      case q.Break:
        return this.renderBreak(e);
      case q.Footer:
        return this.renderContainer(e, "footer");
      case q.Header:
        return this.renderContainer(e, "header");
      case q.Footnote:
      case q.Endnote:
        return this.renderContainer(e, "li");
      case q.FootnoteReference:
        return this.renderFootnoteReference(e);
      case q.EndnoteReference:
        return this.renderEndnoteReference(e);
      case q.NoBreakHyphen:
        return this.h({ tagName: "wbr" });
      case q.VmlPicture:
        return this.renderVmlPicture(e);
      case q.VmlElement:
        return this.renderVmlElement(e);
      case q.MmlMath:
        return this.renderContainerNS(e, xe.mathML, "math", { xmlns: xe.mathML });
      case q.MmlMathParagraph:
        return this.renderContainer(e, "span");
      case q.MmlFraction:
        return this.renderContainerNS(e, xe.mathML, "mfrac");
      case q.MmlBase:
        return this.renderContainerNS(e, xe.mathML, e.parent.type == q.MmlMatrixRow ? "mtd" : "mrow");
      case q.MmlNumerator:
      case q.MmlDenominator:
      case q.MmlFunction:
      case q.MmlLimit:
      case q.MmlBox:
        return this.renderContainerNS(e, xe.mathML, "mrow");
      case q.MmlGroupChar:
        return this.renderMmlGroupChar(e);
      case q.MmlLimitLower:
        return this.renderContainerNS(e, xe.mathML, "munder");
      case q.MmlMatrix:
        return this.renderContainerNS(e, xe.mathML, "mtable");
      case q.MmlMatrixRow:
        return this.renderContainerNS(e, xe.mathML, "mtr");
      case q.MmlRadical:
        return this.renderMmlRadical(e);
      case q.MmlSuperscript:
        return this.renderContainerNS(e, xe.mathML, "msup");
      case q.MmlSubscript:
        return this.renderContainerNS(e, xe.mathML, "msub");
      case q.MmlDegree:
      case q.MmlSuperArgument:
      case q.MmlSubArgument:
        return this.renderContainerNS(e, xe.mathML, "mn");
      case q.MmlFunctionName:
        return this.renderContainerNS(e, xe.mathML, "ms");
      case q.MmlDelimiter:
        return this.renderMmlDelimiter(e);
      case q.MmlRun:
        return this.renderMmlRun(e);
      case q.MmlNary:
        return this.renderMmlNary(e);
      case q.MmlPreSubSuper:
        return this.renderMmlPreSubSuper(e);
      case q.MmlBar:
        return this.renderMmlBar(e);
      case q.MmlEquationArray:
        return this.renderMllList(e);
      case q.Inserted:
        return this.renderInserted(e);
      case q.Deleted:
        return this.renderDeleted(e);
      case q.CommentRangeStart:
        return this.renderCommentRangeStart(e);
      case q.CommentRangeEnd:
        return this.renderCommentRangeEnd(e);
      case q.CommentReference:
        return this.renderCommentReference(e);
      case q.AltChunk:
        return this.renderAltChunk(e);
    }
    return null;
  }
  renderElements(e, t) {
    if (e == null)
      return null;
    var n = e.flatMap((s) => this.renderElement(s)).filter((s) => s != null);
    return t && n.forEach((s) => t.appendChild(li(s) ? document.createTextNode(s) : s)), n;
  }
  renderContainer(e, t, n) {
    return this.h({ tagName: t, children: this.renderElements(e.children), ...n });
  }
  renderContainerNS(e, t, n, s) {
    return this.h({ ns: t, tagName: n, children: this.renderElements(e.children), ...s });
  }
  renderParagraph(e) {
    var t = this.toHTML(e, xe.html, "p");
    const n = this.findStyle(e.styleName);
    e.tabs ?? (e.tabs = n?.paragraphProps?.tabs);
    const s = e.numbering ?? n?.paragraphProps?.numbering;
    return s && t.classList.add(this.numberingClass(s.id, s.level)), t;
  }
  renderHyperlink(e) {
    const t = this.toH(e, xe.html, "a");
    if (t.href = "", e.id) {
      const n = this.document.documentPart.rels.find((s) => s.id == e.id && s.targetMode === "External");
      t.href = n?.target ?? t.href;
    }
    return e.anchor && (t.href += `#${e.anchor}`), this.h(t);
  }
  renderSmartTag(e) {
    return this.renderContainer(e, "span");
  }
  renderCommentRangeStart(e) {
    if (!this.options.renderComments)
      return null;
    const t = new Range();
    this.commentHighlight?.add(t);
    const n = this.h({ tagName: "#comment", children: [`start of comment #${e.id}`] });
    return this.later(() => t.setStart(n, 0)), this.commentMap[e.id] = t, n;
  }
  renderCommentRangeEnd(e) {
    if (!this.options.renderComments)
      return null;
    const t = this.commentMap[e.id], n = this.h({ tagName: "#comment", children: [`end of comment #${e.id}`] });
    return this.later(() => t?.setEnd(n, 0)), n;
  }
  renderCommentReference(e) {
    if (!this.options.renderComments)
      return null;
    var t = this.document.commentsPart?.commentMap[e.id];
    if (!t)
      return null;
    const n = this.h({ tagName: "span", className: `${this.className}-comment-ref`, children: ["💬"] }), s = this.h({
      tagName: "div",
      className: `${this.className}-comment-popover`,
      children: [
        this.h({ tagName: "div", className: `${this.className}-comment-author`, children: [t.author] }),
        this.h({ tagName: "div", className: `${this.className}-comment-date`, children: [new Date(t.date).toLocaleString()] }),
        ...this.renderElements(t.children)
      ]
    });
    return this.h({ tagName: "#fragment", children: [
      this.h({ tagName: "#comment", children: [`comment #${t.id} by ${t.author} on ${t.date}`] }),
      n,
      s
    ] });
  }
  renderAltChunk(e) {
    if (!this.options.renderAltChunks)
      return null;
    var t = this.h({ tagName: "iframe" });
    return this.tasks.push(this.document.loadAltChunk(e.id, this.currentPart).then((n) => {
      t.srcdoc = n;
    })), t;
  }
  renderDrawing(e) {
    var t = this.toHTML(e, xe.html, "div");
    return t.style.display = "inline-block", t.style.position = "relative", t.style.textIndent = "0px", t;
  }
  renderImage(e) {
    let t = this.toHTML(e, xe.html, "img", []), n = e.cssStyle?.transform;
    if (e.srcRect && e.srcRect.some((l) => l != 0)) {
      var [s, i, a, o] = e.srcRect;
      n = `scale(${1 / (1 - s - a)}, ${1 / (1 - i - o)})`, t.style["clip-path"] = `rect(${(100 * i).toFixed(2)}% ${(100 * (1 - a)).toFixed(2)}% ${(100 * (1 - o)).toFixed(2)}% ${(100 * s).toFixed(2)}%)`;
    }
    return e.rotation && (n = `rotate(${e.rotation}deg) ${n ?? ""}`), t.style.transform = n?.trim(), this.document && this.tasks.push(this.document.loadDocumentImage(e.src, this.currentPart).then((l) => {
      t.src = l;
    })), t;
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
  renderChange(e, t) {
    return this.renderContainer(e, t, {
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
    var t = this.h({ tagName: "span", children: [" "] });
    if (this.options.experimental) {
      t.className = this.tabStopClass();
      var n = ku(e, q.Paragraph)?.tabs;
      this.currentTabs.push({ stops: n, span: t });
    }
    return t;
  }
  renderBookmarkStart(e) {
    return this.h({ tagName: "span", id: e.name });
  }
  renderRun(e) {
    if (e.fieldRun)
      return null;
    let t = this.renderElements(e.children);
    e.verticalAlign && (t = [this.h({ tagName: e.verticalAlign, children: this.renderElements(e.children) })]);
    const n = this.toHTML(e, xe.html, "span", t);
    return e.id && (n.id = e.id), n;
  }
  renderTable(e) {
    this.tableCellPositions.push(this.currentCellPosition), this.tableVerticalMerges.push(this.currentVerticalMerge), this.currentVerticalMerge = {}, this.currentCellPosition = { col: 0, row: 0 };
    const t = [];
    return e.columns && t.push(this.renderTableColumns(e.columns)), t.push(...this.renderElements(e.children)), this.currentVerticalMerge = this.tableVerticalMerges.pop(), this.currentCellPosition = this.tableCellPositions.pop(), this.toHTML(e, xe.html, "table", t);
  }
  renderTableColumns(e) {
    const t = e.map((n) => this.h({ tagName: "col", style: { width: n.width } }));
    return this.h({ tagName: "colgroup", children: t });
  }
  renderTableRow(e) {
    this.currentCellPosition.col = 0;
    const t = [];
    return e.gridBefore && t.push(this.renderTableCellPlaceholder(e.gridBefore)), t.push(...this.renderElements(e.children)), e.gridAfter && t.push(this.renderTableCellPlaceholder(e.gridAfter)), this.currentCellPosition.row++, this.toHTML(e, xe.html, "tr", t);
  }
  renderTableCellPlaceholder(e) {
    return this.h({ tagName: "td", colSpan: e, style: { border: "none" } });
  }
  renderTableCell(e) {
    let t = this.toHTML(e, xe.html, "td");
    const n = this.currentCellPosition.col;
    return e.verticalMerge ? e.verticalMerge == "restart" ? (this.currentVerticalMerge[n] = t, t.rowSpan = 1) : this.currentVerticalMerge[n] && (this.currentVerticalMerge[n].rowSpan += 1, t.style.display = "none") : this.currentVerticalMerge[n] = null, e.span && (t.colSpan = e.span), this.currentCellPosition.col += t.colSpan, t;
  }
  renderVmlPicture(e) {
    return this.renderContainer(e, "div");
  }
  renderVmlElement(e) {
    var t = this.h({ ns: xe.svg, tagName: "svg", style: e.cssStyleText });
    const n = this.renderVmlChildElement(e);
    return e.imageHref?.id && this.tasks.push(this.document?.loadDocumentImage(e.imageHref.id, this.currentPart).then((s) => n.setAttribute("href", s))), t.appendChild(n), requestAnimationFrame(() => {
      const s = t.firstElementChild.getBBox();
      t.setAttribute("width", `${Math.ceil(s.x + s.width)}`), t.setAttribute("height", `${Math.ceil(s.y + s.height)}`);
    }), t;
  }
  renderVmlChildElement(e) {
    const t = this.createSvgElement(e.tagName);
    Object.entries(e.attrs).forEach(([n, s]) => t.setAttribute(n, s));
    for (let n of e.children)
      n.type == q.VmlElement ? t.appendChild(this.renderVmlChildElement(n)) : t.appendChild(...Rr(this.renderElement(n)));
    return t;
  }
  renderMmlRadical(e) {
    const t = e.children.find((s) => s.type == q.MmlBase);
    if (e.props?.hideDegree)
      return this.createMathMLElement("msqrt", null, this.renderElements([t]));
    const n = e.children.find((s) => s.type == q.MmlDegree);
    return this.createMathMLElement("mroot", null, this.renderElements([t, n]));
  }
  renderMmlDelimiter(e) {
    const t = [];
    return t.push(this.createMathMLElement("mo", null, [e.props.beginChar ?? "("])), t.push(...this.renderElements(e.children)), t.push(this.createMathMLElement("mo", null, [e.props.endChar ?? ")"])), this.createMathMLElement("mrow", null, t);
  }
  renderMmlNary(e) {
    const t = [], n = Qt(e.children, (h) => h.type), s = n[q.MmlSuperArgument], i = n[q.MmlSubArgument], a = s ? this.createMathMLElement("mo", null, Rr(this.renderElement(s))) : null, o = i ? this.createMathMLElement("mo", null, Rr(this.renderElement(i))) : null, l = this.createMathMLElement("mo", null, [e.props?.char ?? "∫"]);
    return a || o ? t.push(this.createMathMLElement("munderover", null, [l, o, a])) : a ? t.push(this.createMathMLElement("mover", null, [l, a])) : o ? t.push(this.createMathMLElement("munder", null, [l, o])) : t.push(l), t.push(...this.renderElements(n[q.MmlBase].children)), this.createMathMLElement("mrow", null, t);
  }
  renderMmlPreSubSuper(e) {
    const t = [], n = Qt(e.children, (h) => h.type), s = n[q.MmlSuperArgument], i = n[q.MmlSubArgument], a = s ? this.createMathMLElement("mo", null, Rr(this.renderElement(s))) : null, o = i ? this.createMathMLElement("mo", null, Rr(this.renderElement(i))) : null, l = this.createMathMLElement("mo", null);
    return t.push(this.createMathMLElement("msubsup", null, [l, o, a])), t.push(...this.renderElements(n[q.MmlBase].children)), this.createMathMLElement("mrow", null, t);
  }
  renderMmlGroupChar(e) {
    const t = e.props.verticalJustification === "bot" ? "mover" : "munder", n = this.renderContainerNS(e, xe.mathML, t);
    return e.props.char && n.appendChild(this.createMathMLElement("mo", null, [e.props.char])), n;
  }
  renderMmlBar(e) {
    const t = {};
    switch (e.props.position) {
      case "top":
        t.textDecoration = "overline";
        break;
      case "bottom":
        t.textDecoration = "underline";
        break;
    }
    return this.renderContainerNS(e, xe.mathML, "mrow", { style: t });
  }
  renderMmlRun(e) {
    return this.toHTML(e, xe.mathML, "ms");
  }
  renderMllList(e) {
    const t = this.renderElements(e.children).map((n) => this.createMathMLElement("mtr", null, [
      this.createMathMLElement("mtd", null, [n])
    ]));
    return this.toHTML(e, xe.mathML, "mtable", t);
  }
  toH(e, t, n, s = null) {
    const { $lang: i, ...a } = e.cssStyle ?? {}, o = wu(e.className, e.styleName && this.processStyleName(e.styleName));
    return { ns: t, tagName: n, className: o, lang: i, style: a, children: s ?? this.renderElements(e.children) };
  }
  toHTML(e, t, n, s = null) {
    return this.h(this.toH(e, t, n, s));
  }
  findStyle(e) {
    return e && this.styleMap?.[e];
  }
  numberingClass(e, t) {
    return `${this.className}-num-${e}-${t}`;
  }
  tabStopClass() {
    return `${this.className}-tab-stop`;
  }
  styleToString(e, t, n = null) {
    let s = `${e} {\r
`;
    for (const i in t)
      i.startsWith("$") || (s += `  ${i}: ${t[i]};\r
`);
    return n && (s += n), s + `}\r
`;
  }
  numberingCounter(e, t) {
    return `${this.className}-num-${e}-${t}`;
  }
  levelTextToContent(e, t, n, s) {
    const i = {
      tab: "\\9",
      space: "\\a0"
    };
    var a = e.replace(/%\d*/g, (o) => {
      let l = parseInt(o.substring(1), 10) - 1;
      return `"counter(${this.numberingCounter(n, l)}, ${s})"`;
    });
    return `"${a}${i[t] ?? ""}"`;
  }
  numFormatToCssValue(e) {
    var t = {
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
    return t[e] ?? e;
  }
  refreshTabStops() {
    this.options.experimental && setTimeout(() => {
      const e = bu();
      for (let t of this.currentTabs)
        Au(t.span, t.stops, this.defaultTabSize, e);
    }, 500);
  }
  createElementNS(e, t, n, s) {
    return this.h({ ns: e, tagName: t, children: s, ...n });
  }
  createElement(e, t, n) {
    return this.createElementNS(xe.html, e, t, n);
  }
  createMathMLElement(e, t, n) {
    return this.createElementNS(xe.mathML, e, t, n);
  }
  createSvgElement(e, t, n) {
    return this.createElementNS(xe.svg, e, t, n);
  }
  later(e) {
    this.postRenderTasks.push(e);
  }
}
function ku(r, e) {
  for (var t = r.parent; t != null && t.type != e; )
    t = t.parent;
  return t;
}
const nl = {
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
  h: Ln
};
function vu(r, e) {
  const t = { ...nl, ...e };
  return _i.load(r, new gu(t), t);
}
async function _u(r, e) {
  const t = { ...nl, ...e };
  return await new yu().render(r, t);
}
async function Iu(r, e, t, n) {
  const s = await vu(r, n), i = await _u(s, n);
  t ?? (t = e), t.innerHTML = "", e.innerHTML = "";
  for (let a of i)
    (a.nodeName === "STYLE" ? t : e).appendChild(a);
  return s;
}
const Cu = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; font-src data: blob:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><style>body{margin:0;background:#f5f6f4;color:#25332e}.docx-wrapper{padding:16px!important}a{pointer-events:none}img{max-width:100%}@media(max-width:600px){.docx-wrapper{padding:8px!important}section.docx{padding:24px!important;width:auto!important;min-width:0!important}table{max-width:100%}}</style></head><body><main id="document"></main></body></html>`;
function Eu({ blob: r }) {
  const e = Be(null), [t, n] = T(!1), [s, i] = T(!0), [a, o] = T("");
  return ye(() => {
    if (!t) return;
    const l = new AbortController();
    return yi(r, "docx", l.signal).then(async () => {
      const h = e.current?.contentDocument?.getElementById("document");
      l.signal.aborted || !h || (await Iu(r, h, h, { useBase64URL: !0, renderAltChunks: !1, renderComments: !1, breakPages: !0, ignoreLastRenderedPageBreak: !1 }), !l.signal.aborted && (h.querySelectorAll("a").forEach((p) => {
        p.removeAttribute("href"), p.removeAttribute("target");
      }), i(!1)));
    }).catch((h) => {
      l.signal.aborted || (o(h instanceof Error ? h.message : "Word 文件无法预览。"), i(!1));
    }), () => {
      l.abort(), e.current?.contentDocument?.getElementById("document")?.replaceChildren();
    };
  }, [r, t]), /* @__PURE__ */ v("div", { className: "knowledge-file-viewer", children: [
    /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "Word 只读预览 · 复杂排版可能与桌面 Word 有差异。" }),
    s && /* @__PURE__ */ d("p", { role: "status", children: "正在排版文档…" }),
    a && /* @__PURE__ */ d("p", { role: "alert", className: "knowledge-error", children: a }),
    /* @__PURE__ */ d("iframe", { className: "knowledge-word-frame", title: "Word 原文件预览", ref: e, sandbox: "allow-same-origin", srcDoc: Cu, onLoad: () => n(!0), "aria-busy": s })
  ] });
}
function Su({ source: r, formatError: e = er, onClose: t }) {
  const [n, s] = T(null), [i, a] = T(null), [o, l] = T(""), [h, p] = T(0), [b, m] = T(!1), u = es(r.file.filename), y = u === "pdf", A = ["mp3", "wav", "ogg", "flac", "m4a", "aac"].includes(u), w = ["mp4", "mov", "webm", "avi"].includes(u), k = Oo(r.file.filename);
  ye(() => {
    const C = new AbortController();
    s(null), a(null), l("");
    const S = AbortSignal.any([C.signal, AbortSignal.timeout(3e4)]);
    return k ? y || A || w ? () => C.abort() : ((Od(u) ? jd(r, S).then(a) : $o(r, S, ["docx", "pptx", "xlsx", "xlsm"].includes(u) ? Pd : void 0).then(s)).catch((x) => {
      C.signal.aborted || l(e(x));
    }), () => C.abort()) : () => C.abort();
  }, [r.identity, u, e, y, A, w, h, k]);
  async function _() {
    if (!b) {
      m(!0), l("");
      try {
        await Ho(r, AbortSignal.timeout(12e4));
      } catch (C) {
        l(e(C));
      } finally {
        m(!1);
      }
    }
  }
  const B = ["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(u);
  return Wr(/* @__PURE__ */ d("div", { className: "knowledge-modal-backdrop", role: "presentation", onMouseDown: (C) => {
    C.target === C.currentTarget && t();
  }, children: /* @__PURE__ */ v("section", { className: "knowledge-preview-dialog", role: "dialog", "aria-modal": "true", "aria-label": n?.filename || i?.filename || r.file.filename, children: [
    /* @__PURE__ */ v("header", { children: [
      /* @__PURE__ */ v("div", { children: [
        /* @__PURE__ */ d("h2", { children: n?.filename || i?.filename || r.file.filename }),
        /* @__PURE__ */ v("p", { children: [
          /* @__PURE__ */ d("span", { children: "原文件在线预览" }),
          " · 每次打开和下载都由宿主重新核对权限"
        ] })
      ] }),
      /* @__PURE__ */ d(ce, { "aria-label": "关闭", onClick: t, children: /* @__PURE__ */ d(Xr, { size: 17 }) })
    ] }),
    /* @__PURE__ */ v("div", { className: "knowledge-file-toolbar", children: [
      /* @__PURE__ */ v(ce, { disabled: b, onClick: () => {
        _();
      }, children: [
        /* @__PURE__ */ d(xo, { size: 15 }),
        b ? "正在下载…" : "下载原文件"
      ] }),
      /* @__PURE__ */ v(ce, { disabled: !k, onClick: () => p((C) => C + 1), children: [
        /* @__PURE__ */ d($t, { size: 15 }),
        "重新打开"
      ] })
    ] }),
    k ? o ? /* @__PURE__ */ d("p", { role: "alert", className: "knowledge-error", children: o }) : y ? /* @__PURE__ */ d(Jd, { source: r, location: r.file.location }) : A ? /* @__PURE__ */ d(Qa, { source: r, kind: "audio" }) : w ? /* @__PURE__ */ d(Qa, { source: r, kind: "video" }) : !n && !i ? /* @__PURE__ */ d("p", { children: "正在读取原文件…" }) : i ? /* @__PURE__ */ d(Zd, { file: i }) : n?.format === "docx" ? /* @__PURE__ */ d(Eu, { blob: n.blob }) : n?.format === "pptx" ? /* @__PURE__ */ d(Wd, { blob: n.blob, location: r.file.location }) : n?.format === "xlsx" || n?.format === "xlsm" ? /* @__PURE__ */ d(Vd, { blob: n.blob, location: r.file.location }) : n && B ? /* @__PURE__ */ d(Gd, { blob: n.blob, filename: n.filename }) : /* @__PURE__ */ d("p", { children: "此格式暂不支持在线预览，请下载查看。" }) : /* @__PURE__ */ d("div", { className: "knowledge-preview-unsupported", children: /* @__PURE__ */ d("p", { children: "旧版 Word（.doc）和 Excel（.xls）不能在浏览器中可靠解析。请下载后查看，或另存为 .docx / .xlsx 再上传。" }) })
  ] }) }), window.document.body);
}
function sl(r) {
  return `domainry-knowledge-transfer:${r.scope?.() || "default"}`;
}
function ci(r) {
  if (!r || r.length > 4096) return null;
  try {
    const e = JSON.parse(r), t = e.source;
    return !t || !t.id || !t.library_id || !e.targetLibraryID || t.library_id === e.targetLibraryID || !/^[a-zA-Z0-9_.:-]{1,96}$/.test(e.clientID) || !["copy", "move"].includes(e.mode) || !/^[a-f0-9]{64}$/.test(t.sha256) || !t.filename || t.filename.length > 255 || !Number.isSafeInteger(t.bytes) || t.bytes < 1 || !Number.isSafeInteger(t.revision) || t.revision < 1 ? null : e;
  } catch {
    return null;
  }
}
function il(r) {
  try {
    return ci(localStorage.getItem(sl(r)));
  } catch {
    return null;
  }
}
function Nu(r, e, t) {
  return r.id !== e && Qo(r) && !r.archived && (r.documents_configured === !0 || t === r.id);
}
function Bu({ client: r, source: e, canMove: t, formatError: n = er, onClose: s, onOpenTarget: i }) {
  const [a, o] = T(() => il(r)), l = a?.source || e, h = sl(r), [p, b] = T(a?.mode || "copy"), [m, u] = T({ items: [], complete: !0 }), [y, A] = T([""]), [w, k] = T(null), [_, B] = T(null), [C, S] = T(!0), [z, x] = T(!1), [U, Q] = T(""), $ = Be(!1), X = Be(null), N = y.at(-1) || "";
  ye(() => () => X.current?.abort(), []), ye(() => {
    const oe = new AbortController();
    S(!0);
    const L = AbortSignal.any([oe.signal, AbortSignal.timeout(15e3)]);
    return Promise.all([r.listLibraries(N, 20, L), a ? r.getLibrary(a.targetLibraryID, L) : Promise.resolve(null)]).then(([le, ee]) => {
      oe.signal.aborted || (u(le), ee && k(ee));
    }).catch((le) => {
      oe.signal.aborted || (k(null), u({ items: [], complete: !0 }), Q(n(le)));
    }).finally(() => {
      oe.signal.aborted || S(!1);
    }), () => oe.abort();
  }, [r, N, n, a]);
  const R = (oe) => Nu(oe, l.library_id, a?.targetLibraryID);
  function g(oe) {
    ci(localStorage.getItem(h))?.clientID === oe.clientID && localStorage.removeItem(h), o(null);
  }
  async function G() {
    if ($.current || !w || !R(w)) return;
    $.current = !0, x(!0), Q("");
    const oe = new AbortController();
    X.current = oe;
    const L = AbortSignal.any([oe.signal, AbortSignal.timeout(6e4)]);
    try {
      const le = a || { source: l, targetLibraryID: w.id, mode: p, clientID: crypto.randomUUID() }, ee = () => {
        const H = ci(localStorage.getItem(h));
        if (H && H.clientID !== le.clientID) throw Error("另一项文档复制或移动仍待确认，请先处理。 ");
        localStorage.setItem(h, JSON.stringify(le));
      };
      navigator.locks ? await navigator.locks.request(`domainry-knowledge:transfer:${r.scope?.() || "default"}`, ee) : ee(), L.throwIfAborted(), o(le);
      const de = await r.transferDocument({ ...le, targetLibraryID: le.targetLibraryID, signal: L });
      if (de.library_id !== le.targetLibraryID || de.filename !== l.filename || de.bytes !== l.bytes || de.sha256 !== l.sha256) throw Error("目标文档与本次操作不一致，请刷新核对。");
      g(le), B(de);
    } catch (le) {
      oe.signal.aborted || Q(n(le));
    } finally {
      $.current = !1, oe.signal.aborted || x(!1);
    }
  }
  return Wr(/* @__PURE__ */ d("div", { className: "knowledge-modal-backdrop", role: "presentation", onMouseDown: (oe) => {
    oe.target === oe.currentTarget && !z && s();
  }, children: /* @__PURE__ */ v("section", { className: "knowledge-transfer-dialog", role: "dialog", "aria-modal": "true", "aria-label": "复制或移动文档", children: [
    /* @__PURE__ */ v("header", { children: [
      /* @__PURE__ */ v("div", { children: [
        /* @__PURE__ */ d("h2", { children: "复制或移动文档" }),
        /* @__PURE__ */ d("p", { children: "选择目标资料库并确认可见范围；目标保存独立原文件，索引由后台处理。" })
      ] }),
      /* @__PURE__ */ d(ce, { "aria-label": "关闭", disabled: z, onClick: s, children: /* @__PURE__ */ d(Xr, { size: 17 }) })
    ] }),
    /* @__PURE__ */ d("p", { children: /* @__PURE__ */ d("strong", { children: l.filename }) }),
    U && /* @__PURE__ */ d("p", { role: "alert", className: "knowledge-error", children: U }),
    _ ? /* @__PURE__ */ v(at, { children: [
      /* @__PURE__ */ v("p", { role: "status", children: [
        p === "move" ? "目标原文件已保存，原位置已停止访问。" : "独立副本已保存，原位置保留。",
        "当前目标状态：",
        ai(_),
        "。"
      ] }),
      /* @__PURE__ */ d(ce, { onClick: () => i(_.library_id), children: "查看目标资料库" })
    ] }) : /* @__PURE__ */ v(at, { children: [
      a ? /* @__PURE__ */ v("p", { className: "knowledge-subtle", children: [
        "上次",
        a.mode === "move" ? "移动" : "复制",
        "结果待确认；继续会使用原请求编号，不会重复创建目标文档。"
      ] }) : /* @__PURE__ */ v(at, { children: [
        /* @__PURE__ */ v("label", { children: [
          "操作方式 ",
          /* @__PURE__ */ v("select", { disabled: z, value: p, onChange: (oe) => b(oe.target.value), children: [
            /* @__PURE__ */ d("option", { value: "copy", children: "复制，保留原文档" }),
            /* @__PURE__ */ d("option", { value: "move", disabled: !t, children: "移动，原位置停止访问" })
          ] })
        ] }),
        !t && /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "移动需要原资料库的编辑或管理权限。" }),
        C ? /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "正在读取目标知识库…" }) : /* @__PURE__ */ d("div", { className: "knowledge-transfer-list", children: m.items.map((oe) => /* @__PURE__ */ v("button", { "aria-current": w?.id === oe.id ? "true" : void 0, disabled: z || !R(oe), onClick: () => k(oe), children: [
          /* @__PURE__ */ d("strong", { children: oe.name }),
          /* @__PURE__ */ v("small", { children: [
            oe.kind === "personal" ? "个人知识库 · 仅自己可见" : "团队知识库 · 阅读成员可见",
            R(oe) ? "" : " · 不可选择"
          ] })
        ] }, oe.id)) }),
        (y.length > 1 || !m.complete) && /* @__PURE__ */ v("div", { className: "knowledge-pagination", children: [
          /* @__PURE__ */ d(ce, { disabled: z || C || y.length === 1, onClick: () => A((oe) => oe.slice(0, -1)), children: "上一页" }),
          /* @__PURE__ */ d(ce, { disabled: z || C || !m.next_after, onClick: () => A((oe) => [...oe, m.next_after]), children: "下一页" })
        ] })
      ] }),
      w && /* @__PURE__ */ v("div", { className: "knowledge-confirm", children: [
        /* @__PURE__ */ v("p", { children: [
          p === "move" ? "移动" : "复制",
          "“",
          l.filename,
          "”到“",
          w.name,
          "”？",
          w.kind === "shared" ? "目标资料库的所有阅读成员都能访问该文件。" : "目标文件仅自己可见。"
        ] }),
        /* @__PURE__ */ d(ce, { disabled: z || C || !R(w), onClick: () => {
          G();
        }, children: z ? "正在处理…" : a ? "继续核对上次操作" : p === "move" ? "确认移动文档" : "确认复制文档" })
      ] }),
      a && /* @__PURE__ */ d(ce, { disabled: z, onClick: () => {
        g(a), s();
      }, children: "结束重试，不撤销已受理操作" })
    ] })
  ] }) }), window.document.body);
}
function xu(r) {
  if (!r || r.length > 2048) return null;
  try {
    const e = JSON.parse(r);
    return e && /^[a-zA-Z0-9_.:-]{1,96}$/.test(e.clientID) && e.filename && Number.isSafeInteger(e.bytes) && e.bytes > 0 && /^[a-f0-9]{64}$/.test(e.sha256) ? e : null;
  } catch {
    return null;
  }
}
function Pr(r) {
  return r >= 1024 ** 3 ? `${(r / 1024 ** 3).toFixed(r % 1024 ** 3 ? 1 : 0)} GiB` : r >= 1024 ** 2 ? `${(r / 1024 ** 2).toFixed(1)} MiB` : `${(r / 1024).toFixed(1)} KiB`;
}
function Du({ document: r }) {
  const e = Rd(r), t = r.processing_stage === "failed";
  return /* @__PURE__ */ d("ol", { className: "knowledge-pipeline", "aria-label": "文档处理进度", children: To.map((n, s) => /* @__PURE__ */ v("li", { "data-state": s < e ? "done" : s === e ? t ? "failed" : "active" : "pending", children: [
    /* @__PURE__ */ d("span", { children: s < e ? "✓" : s + 1 }),
    /* @__PURE__ */ d("small", { children: n.label })
  ] }, n.key)) });
}
function Mu({ client: r, initialLibrary: e, formatError: t = er, onBusyChange: n, onOpenLibrary: s, embedded: i = !1, hideList: a = !1, showUploader: o = !0, selectedDocumentID: l, onSelectedDocumentChange: h, onDocumentsChange: p }) {
  const b = e.id, m = `domainry-knowledge-upload:${r.scope?.() || "default"}:${b}`, [u, y] = T(e), [A, w] = T({ items: [], complete: !0 }), [k, _] = T([""]), [B, C] = T(0), [S, z] = T(null), [x, U] = T(!1), [Q, $] = T(!1), [X, N] = T(null), [R, g] = T(null), [G, oe] = T(() => xu(localStorage.getItem(m))), [L, le] = T(null), [ee, de] = T(null), [H, O] = T(!0), [K, ae] = T(!1), [se, we] = T(""), [Ae, Y] = T(""), ue = Be(null), Ce = k.at(-1) || "", _e = Uc((J) => {
    ae(J), n?.(J);
  }, [n]);
  ye(() => y(e), [e]), ye(() => {
    const J = new AbortController();
    return O(!0), we(""), Promise.all([
      r.getLibrary(b, J.signal),
      r.listDocuments(b, Ce, 50, J.signal)
    ]).then(([ie, ne]) => {
      J.signal.aborted || (y(ie), w(ne), p?.(ne.items), z((fe) => {
        const Ie = l === void 0 ? fe?.id : l;
        return Ie && ne.items.find((me) => me.id === Ie) || null;
      }));
    }).catch((ie) => {
      J.signal.aborted || (w({ items: [], complete: !0 }), z(null), we(t(ie)));
    }).finally(() => {
      J.signal.aborted || O(!1);
    }), () => J.abort();
  }, [r, Ce, t, b, p, B, l]), ye(() => {
    const J = window.setInterval(() => {
      !K && document.visibilityState !== "hidden" && C((ie) => ie + 1);
    }, 5e3);
    return () => window.clearInterval(J);
  }, [K]);
  const Ne = Qo(u), De = Ne && !!u.documents_configured && !u.archived, c = Nd(u), Z = Fo(u), j = Po(u), E = R ? xd(u, R.name) : Z;
  async function I(J) {
    if (K) return;
    _e(!0), we(""), Y("");
    const ie = new AbortController();
    try {
      await J(AbortSignal.any([ie.signal, AbortSignal.timeout(7200 * 1e3)]));
    } catch (ne) {
      ne instanceof DOMException && ne.name === "AbortError" || we(t(ne));
    } finally {
      le(null), de(null), _e(!1), C((ne) => ne + 1);
    }
  }
  async function P(J) {
    if (!R || !De) return;
    if (!R.size || R.size > c) throw Error(`单文件不能超过 ${Pr(c)}。`);
    if (!Sd(u, R.name)) throw Error("当前文件格式不支持入库。");
    le(0);
    const ie = await Lo(R, J, le);
    if (J.throwIfAborted(), G && (G.filename !== R.name || G.bytes !== R.size || G.sha256 !== ie)) throw Error(`请重新选择上次的“${G.filename}”继续上传，或先结束上次重试。`);
    const ne = G || { clientID: crypto.randomUUID(), filename: R.name, bytes: R.size, sha256: ie };
    localStorage.setItem(m, JSON.stringify(ne)), oe(ne), de(0);
    const fe = await r.uploadDocument({ libraryID: b, file: R, clientID: ne.clientID, sha256: ie, signal: J, onProgress: (Ie, me) => de(Math.min(1, Ie / me)) });
    localStorage.removeItem(m), oe(null), g(null), ue.current && (ue.current.value = ""), z(fe), h?.(fe.id), _([""]), Y(fe.state === "ready" ? "文件已入库，可以检索。" : "原文件已保存，后台正在处理。可以关闭页面后再回来查看。 ");
  }
  async function te(J) {
    if (!S) return;
    const ie = await r.deleteDocument(b, S.id, S.revision, J);
    $(!1), U(!1), ie.state === "deleted" ? (z(null), h?.("")) : z(ie), Y(ie.state === "deleted" ? "文档已删除。" : "文档已停止访问，后台正在清理原文件与索引。 ");
  }
  async function re(J) {
    if (!S || !Ne || !za(S)) return;
    const ie = await r.retryDocument(b, S.id, S.revision, J);
    z(ie), Y("已立即重新调度当前处理阶段；不会重复提交状态不确定的远端写入。");
  }
  async function F(J) {
    if (!S || !Ne || !Pa(S)) return;
    const ie = await r.reindexDocument(b, S.id, S.revision, J);
    z(ie), Y("新一代索引已开始建立；当前索引在切换成功前仍可检索。");
  }
  return /* @__PURE__ */ v("section", { className: `knowledge-documents${i ? " is-embedded" : ""}`, "aria-label": "资料文件", children: [
    !i && /* @__PURE__ */ v("div", { className: "knowledge-section-heading", children: [
      /* @__PURE__ */ d("h3", { children: "资料文件" }),
      /* @__PURE__ */ v(ce, { disabled: H || K, onClick: () => C((J) => J + 1), children: [
        /* @__PURE__ */ d($t, { size: 14 }),
        "刷新"
      ] })
    ] }),
    o && De && /* @__PURE__ */ v("div", { className: "knowledge-upload", children: [
      /* @__PURE__ */ v("label", { className: "knowledge-file-picker", children: [
        /* @__PURE__ */ d(Pn, { size: 18 }),
        /* @__PURE__ */ d("span", { children: R ? R.name : "选择本地文件" }),
        /* @__PURE__ */ d("small", { children: R ? Pr(R.size) : "支持安全扫描后的文档、图片与音视频" }),
        /* @__PURE__ */ d("input", { ref: ue, type: "file", accept: j, disabled: K, onChange: (J) => {
          g(J.target.files?.[0] || null), we("");
        } })
      ] }),
      /* @__PURE__ */ v("p", { children: [
        "单个文件最大 ",
        Pr(c),
        Z < c ? `；超过 ${Pr(Z)} 时仍可保存和预览，但暂不参与全文检索。` : "。"
      ] }),
      R && R.size > E && /* @__PURE__ */ d("p", { className: "knowledge-notice", children: "此文件可以保存、预览和下载，但超过当前可检索处理上限，暂时不会进入全文检索。" }),
      L !== null && /* @__PURE__ */ v("p", { role: "status", children: [
        "正在分段校验文件：",
        Math.round(L * 100),
        "%"
      ] }),
      ee !== null && /* @__PURE__ */ v("p", { role: "status", children: [
        "正在分片上传：",
        Math.round(ee * 100),
        "% · 每片最多 8 MiB，刷新后重新选择同一文件可继续。"
      ] }),
      /* @__PURE__ */ v(ce, { className: "primary", disabled: K || !R, onClick: () => {
        I(P);
      }, children: [
        /* @__PURE__ */ d(Pn, { size: 15 }),
        L !== null ? "正在校验…" : ee !== null ? "正在上传…" : G ? "继续上次上传" : "上传文件"
      ] })
    ] }),
    G && /* @__PURE__ */ v("div", { className: "knowledge-confirm", children: [
      /* @__PURE__ */ v("p", { children: [
        "上次上传待确认：",
        G.filename
      ] }),
      /* @__PURE__ */ d(ce, { disabled: K, onClick: () => {
        localStorage.removeItem(m), oe(null);
      }, children: "结束这次重试" })
    ] }),
    se && /* @__PURE__ */ d("p", { role: "alert", className: "knowledge-error", children: se }),
    Ae && /* @__PURE__ */ d("p", { role: "status", className: "knowledge-notice", children: Ae }),
    !a && (H ? /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "正在读取资料文件…" }) : A.items.length === 0 ? /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "还没有资料文件。" }) : /* @__PURE__ */ d("div", { className: "knowledge-document-list", children: A.items.map((J) => /* @__PURE__ */ v("button", { "aria-current": S?.id === J.id ? "true" : void 0, disabled: K, onClick: () => {
      z(J), h?.(J.id), $(!1), we("");
    }, children: [
      /* @__PURE__ */ d(Tt, { size: 18 }),
      /* @__PURE__ */ v("span", { children: [
        /* @__PURE__ */ d("strong", { children: J.filename }),
        /* @__PURE__ */ v("small", { children: [
          ai(J),
          " · ",
          Pr(J.bytes)
        ] })
      ] })
    ] }, J.id)) })),
    !a && (k.length > 1 || !A.complete) && /* @__PURE__ */ v("nav", { className: "knowledge-pagination", children: [
      /* @__PURE__ */ d(ce, { disabled: K || H || k.length === 1, onClick: () => _((J) => J.slice(0, -1)), children: "上一页" }),
      /* @__PURE__ */ d(ce, { disabled: K || H || !A.next_after, onClick: () => _((J) => [...J, A.next_after]), children: "下一页" })
    ] }),
    S && /* @__PURE__ */ v("section", { className: "knowledge-document-detail", children: [
      /* @__PURE__ */ d("h3", { children: S.filename }),
      /* @__PURE__ */ v("p", { children: [
        ai(S),
        " · 内容版本 v",
        S.content_version,
        " · 索引代次 g",
        S.index_generation,
        " · ",
        u.kind === "shared" ? "继承资料库成员权限" : "仅自己可见"
      ] }),
      /* @__PURE__ */ d(Du, { document: S }),
      /* @__PURE__ */ d("p", { children: Dd(S) }),
      S.security_scanner && /* @__PURE__ */ v("p", { children: [
        "安全策略：",
        S.security_scanner,
        " · 报告 ",
        S.security_report_sha256?.slice(0, 12)
      ] }),
      S.error_code && /* @__PURE__ */ v("p", { className: "knowledge-error", children: [
        "错误代码：",
        S.error_code
      ] }),
      /* @__PURE__ */ v("div", { className: "knowledge-actions", children: [
        Oo(S.filename) && /* @__PURE__ */ v(ce, { disabled: K || u.archived || !Os(S), onClick: () => U(!0), children: [
          /* @__PURE__ */ d($c, { size: 15 }),
          "在线预览"
        ] }),
        /* @__PURE__ */ v(ce, { disabled: K || u.archived || !Os(S), onClick: () => {
          I((J) => qd(r, S, J));
        }, children: [
          /* @__PURE__ */ d(xo, { size: 15 }),
          "下载原文件"
        ] }),
        /* @__PURE__ */ d(ce, { disabled: K || u.archived || !Os(S), onClick: () => {
          il(r) && Y("检测到上次待确认的复制或移动，将继续核对原操作。"), N({ source: S, canMove: Ne });
        }, children: "复制／移动" }),
        Ne && za(S) && /* @__PURE__ */ v(ce, { disabled: K || u.archived, onClick: () => {
          I(re);
        }, children: [
          /* @__PURE__ */ d(Hc, { size: 15 }),
          "立即重试"
        ] }),
        Ne && Pa(S) && /* @__PURE__ */ v(ce, { disabled: K || u.archived, onClick: () => {
          I(F);
        }, children: [
          /* @__PURE__ */ d($t, { size: 15 }),
          "重新索引"
        ] }),
        Ne && /* @__PURE__ */ v(ce, { className: "danger", disabled: K || S.reindexing || S.state === "deleting" || S.state === "deleted", onClick: () => $(!0), children: [
          /* @__PURE__ */ d(jc, { size: 15 }),
          "删除"
        ] })
      ] }),
      Q && /* @__PURE__ */ v("div", { className: "knowledge-confirm", children: [
        /* @__PURE__ */ v("p", { children: [
          "确认删除“",
          S.filename,
          "”？它会立即停止检索和下载，随后清理原文件和索引。"
        ] }),
        /* @__PURE__ */ v("div", { className: "knowledge-actions", children: [
          /* @__PURE__ */ d(ce, { className: "danger", disabled: K, onClick: () => {
            I(te);
          }, children: "确认删除" }),
          /* @__PURE__ */ d(ce, { disabled: K, onClick: () => $(!1), children: "保留文档" })
        ] })
      ] })
    ] }),
    x && S && /* @__PURE__ */ d(Su, { source: jo(r, S), formatError: t, onClose: () => U(!1) }),
    X && /* @__PURE__ */ d(Bu, { client: r, source: X.source, canMove: X.canMove, formatError: t, onClose: () => {
      N(null), C((J) => J + 1);
    }, onOpenTarget: (J) => {
      N(null), s?.(J), C((ie) => ie + 1);
    } })
  ] });
}
const Ru = /^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,95}$/;
function Xa(r) {
  if (!r || r.length > 1024) return null;
  try {
    const e = JSON.parse(r);
    return Ru.test(e?.datasourceKey || "") && Number.isSafeInteger(e?.expectedRevision) && e.expectedRevision > 0 ? e : null;
  } catch {
    return null;
  }
}
function zu({ client: r, library: e, disabled: t, formatError: n = er, onBusyChange: s, onBound: i }) {
  const a = `domainry-knowledge-source:${r.scope?.() || "default"}:${e.id}`, [o, l] = T(() => Xa(localStorage.getItem(a))), [h, p] = T(null), [b, m] = T([""]), [u, y] = T(0), [A, w] = T(""), [k, _] = T(!1), [B, C] = T(!0), [S, z] = T(""), x = Be(!1), U = Be(null), Q = b.at(-1) || "";
  ye(() => {
    const R = new AbortController();
    return C(!0), p(null), r.listSources(e.id, Q, 10, R.signal).then((g) => {
      R.signal.aborted || (p(g), z(""), g.current_key && Xa(localStorage.getItem(a))?.datasourceKey === g.current_key && g.status === "connected" && (localStorage.removeItem(a), l(null)));
    }).catch((g) => {
      R.signal.aborted || (p(null), z(n(g)));
    }).finally(() => {
      R.signal.aborted || C(!1);
    }), () => R.abort();
  }, [r, Q, n, e.id, u, a]), ye(() => () => {
    U.current?.abort(), s?.(!1);
  }, [s]);
  const $ = t || k, X = h?.items.find((R) => R.key === A && R.available);
  async function N() {
    if (x.current || t || !h?.can_bind || !o && !X) return;
    x.current = !0, _(!0), s?.(!0), z("");
    const R = new AbortController();
    U.current = R;
    try {
      const g = o || { datasourceKey: A, expectedRevision: h.revision };
      localStorage.setItem(a, JSON.stringify(g)), l(g);
      const G = await r.bindSource(e.id, g.datasourceKey, g.expectedRevision, AbortSignal.any([R.signal, AbortSignal.timeout(3e4)]));
      if (R.signal.aborted) return;
      localStorage.removeItem(a), l(null), w(""), i(G), y((oe) => oe + 1);
    } catch (g) {
      R.signal.aborted || z(n(g));
    } finally {
      x.current = !1, R.signal.aborted || (_(!1), s?.(!1));
    }
  }
  return /* @__PURE__ */ v("section", { className: "knowledge-sources", "aria-label": "外部内容连接", "data-static-ui-list": !0, children: [
    /* @__PURE__ */ v("div", { className: "knowledge-section-heading", children: [
      /* @__PURE__ */ d("h3", { children: "外部内容连接" }),
      /* @__PURE__ */ v(ce, { disabled: $ || B, onClick: () => y((R) => R + 1), children: [
        /* @__PURE__ */ d($t, { size: 14 }),
        "刷新"
      ] })
    ] }),
    S && /* @__PURE__ */ d("p", { role: "alert", className: "knowledge-error", children: S }),
    B ? /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "正在读取可用知识源…" }) : h && /* @__PURE__ */ v(at, { children: [
      h.status === "connected" ? /* @__PURE__ */ v("p", { className: "knowledge-subtle", children: [
        /* @__PURE__ */ d(si, { size: 15, className: "knowledge-inline" }),
        " 已连接外部内容，可上传资料并建立索引。"
      ] }) : h.status === "unavailable" ? /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "当前连接暂不可用；已保存原文件仍按知识库权限保留。" }) : h.status === "host_managed" ? /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "此知识库的外部内容连接由宿主管理。" }) : /* @__PURE__ */ v("p", { className: "knowledge-subtle", children: [
        "选择一个外部内容连接到“",
        e.name,
        "”。"
      ] }),
      h.status === "unbound" && /* @__PURE__ */ v(at, { children: [
        !h.can_bind && /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "当前没有连接权限，或资料库已归档。" }),
        h.items.length === 0 ? /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "暂无可选择的知识源。" }) : /* @__PURE__ */ d("div", { className: "knowledge-source-list", children: h.items.map((R) => /* @__PURE__ */ v("button", { "aria-current": A === R.key ? "true" : void 0, disabled: $ || !!o || !R.available, onClick: () => w(R.key), children: [
          /* @__PURE__ */ d(va, { size: 16 }),
          /* @__PURE__ */ v("span", { children: [
            /* @__PURE__ */ d("strong", { children: R.name }),
            /* @__PURE__ */ d("small", { children: R.available ? R.description || "可连接" : "暂不可连接" })
          ] })
        ] }, R.key)) })
      ] }),
      (b.length > 1 || !h.complete) && /* @__PURE__ */ v("nav", { className: "knowledge-pagination", children: [
        /* @__PURE__ */ d(ce, { disabled: $ || B || b.length === 1, onClick: () => {
          w(""), m((R) => R.slice(0, -1));
        }, children: "上一页" }),
        /* @__PURE__ */ d(ce, { disabled: $ || B || !h.next_after, onClick: () => {
          w(""), m((R) => [...R, h.next_after]);
        }, children: "下一页" })
      ] }),
      o && /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "上次连接结果待确认；继续时使用同一个知识源，不会重复创建绑定。" }),
      (h.status === "unbound" || o) && /* @__PURE__ */ v("div", { className: "knowledge-actions", children: [
        /* @__PURE__ */ v(ce, { disabled: $ || !h.can_bind || !o && !X, onClick: () => {
          N();
        }, children: [
          /* @__PURE__ */ d(va, { size: 15 }),
          k ? "正在连接…" : o ? "继续确认连接" : "连接知识源"
        ] }),
        o && /* @__PURE__ */ d(ce, { disabled: $, onClick: () => {
          localStorage.removeItem(a), l(null);
        }, children: "结束重试" })
      ] })
    ] })
  ] });
}
const At = () => /* @__PURE__ */ new Map(), di = (r) => {
  const e = At();
  return r.forEach((t, n) => {
    e.set(n, t);
  }), e;
}, jt = (r, e, t) => {
  let n = r.get(e);
  return n === void 0 && r.set(e, n = t()), n;
}, Pu = (r, e) => {
  const t = [];
  for (const [n, s] of r)
    t.push(e(s, n));
  return t;
}, Fu = (r, e) => {
  for (const [t, n] of r)
    if (e(n, t))
      return !0;
  return !1;
}, pr = () => /* @__PURE__ */ new Set(), Gs = (r) => r[r.length - 1], Qu = (r, e) => {
  for (let t = 0; t < e.length; t++)
    r.push(e[t]);
}, Xt = Array.from, Ii = (r, e) => {
  for (let t = 0; t < r.length; t++)
    if (!e(r[t], t, r))
      return !1;
  return !0;
}, al = (r, e) => {
  for (let t = 0; t < r.length; t++)
    if (e(r[t], t, r))
      return !0;
  return !1;
}, Tu = (r, e) => {
  const t = new Array(r);
  for (let n = 0; n < r; n++)
    t[n] = e(n, t);
  return t;
}, rs = Array.isArray;
class Lu {
  constructor() {
    this._observers = At();
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  on(e, t) {
    return jt(
      this._observers,
      /** @type {string} */
      e,
      pr
    ).add(t), t;
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  once(e, t) {
    const n = (...s) => {
      this.off(
        e,
        /** @type {any} */
        n
      ), t(...s);
    };
    this.on(
      e,
      /** @type {any} */
      n
    );
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  off(e, t) {
    const n = this._observers.get(e);
    n !== void 0 && (n.delete(t), n.size === 0 && this._observers.delete(e));
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
  emit(e, t) {
    return Xt((this._observers.get(e) || At()).values()).forEach((n) => n(...t));
  }
  destroy() {
    this._observers = At();
  }
}
const _t = Math.floor, xn = Math.abs, ol = (r, e) => r < e ? r : e, rr = (r, e) => r > e ? r : e, ll = (r) => r !== 0 ? r < 0 : 1 / r < 0, Za = 1, Ka = 2, Js = 4, Vs = 8, Lr = 32, xt = 64, dt = 128, ns = 31, hi = 63, Wt = 127, Uu = 2147483647, Un = Number.MAX_SAFE_INTEGER, Ya = Number.MIN_SAFE_INTEGER, Ou = Number.isInteger || ((r) => typeof r == "number" && isFinite(r) && _t(r) === r), $u = String.fromCharCode, Hu = (r) => r.toLowerCase(), ju = /^\s*/g, qu = (r) => r.replace(ju, ""), Gu = /([A-Z])/g, eo = (r, e) => qu(r.replace(Gu, (t) => `${e}${Hu(t)}`)), Ju = (r) => {
  const e = unescape(encodeURIComponent(r)), t = e.length, n = new Uint8Array(t);
  for (let s = 0; s < t; s++)
    n[s] = /** @type {number} */
    e.codePointAt(s);
  return n;
}, Ur = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), Vu = (r) => Ur.encode(r), Wu = Ur ? Vu : Ju;
let Tr = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
Tr && Tr.decode(new Uint8Array()).length === 1 && (Tr = null);
const Xu = (r, e) => Tu(e, () => r).join("");
class Zr {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
}
const ss = () => new Zr(), Zu = (r) => {
  let e = r.cpos;
  for (let t = 0; t < r.bufs.length; t++)
    e += r.bufs[t].length;
  return e;
}, vt = (r) => {
  const e = new Uint8Array(Zu(r));
  let t = 0;
  for (let n = 0; n < r.bufs.length; n++) {
    const s = r.bufs[n];
    e.set(s, t), t += s.length;
  }
  return e.set(new Uint8Array(r.cbuf.buffer, 0, r.cpos), t), e;
}, Ku = (r, e) => {
  const t = r.cbuf.length;
  t - r.cpos < e && (r.bufs.push(new Uint8Array(r.cbuf.buffer, 0, r.cpos)), r.cbuf = new Uint8Array(rr(t, e) * 2), r.cpos = 0);
}, qe = (r, e) => {
  const t = r.cbuf.length;
  r.cpos === t && (r.bufs.push(r.cbuf), r.cbuf = new Uint8Array(t * 2), r.cpos = 0), r.cbuf[r.cpos++] = e;
}, ui = qe, Se = (r, e) => {
  for (; e > Wt; )
    qe(r, dt | Wt & e), e = _t(e / 128);
  qe(r, Wt & e);
}, Ci = (r, e) => {
  const t = ll(e);
  for (t && (e = -e), qe(r, (e > hi ? dt : 0) | (t ? xt : 0) | hi & e), e = _t(e / 64); e > 0; )
    qe(r, (e > Wt ? dt : 0) | Wt & e), e = _t(e / 128);
}, fi = new Uint8Array(3e4), Yu = fi.length / 3, ef = (r, e) => {
  if (e.length < Yu) {
    const t = Ur.encodeInto(e, fi).written || 0;
    Se(r, t);
    for (let n = 0; n < t; n++)
      qe(r, fi[n]);
  } else
    ot(r, Wu(e));
}, tf = (r, e) => {
  const t = unescape(encodeURIComponent(e)), n = t.length;
  Se(r, n);
  for (let s = 0; s < n; s++)
    qe(
      r,
      /** @type {number} */
      t.codePointAt(s)
    );
}, dr = Ur && /** @type {any} */
Ur.encodeInto ? ef : tf, is = (r, e) => {
  const t = r.cbuf.length, n = r.cpos, s = ol(t - n, e.length), i = e.length - s;
  r.cbuf.set(e.subarray(0, s), n), r.cpos += s, i > 0 && (r.bufs.push(r.cbuf), r.cbuf = new Uint8Array(rr(t * 2, i)), r.cbuf.set(e.subarray(s)), r.cpos = i);
}, ot = (r, e) => {
  Se(r, e.byteLength), is(r, e);
}, Ei = (r, e) => {
  Ku(r, e);
  const t = new DataView(r.cbuf.buffer, r.cpos, e);
  return r.cpos += e, t;
}, rf = (r, e) => Ei(r, 4).setFloat32(0, e, !1), nf = (r, e) => Ei(r, 8).setFloat64(0, e, !1), sf = (r, e) => (
  /** @type {any} */
  Ei(r, 8).setBigInt64(0, e, !1)
), to = new DataView(new ArrayBuffer(4)), af = (r) => (to.setFloat32(0, r), to.getFloat32(0) === r), Or = (r, e) => {
  switch (typeof e) {
    case "string":
      qe(r, 119), dr(r, e);
      break;
    case "number":
      Ou(e) && xn(e) <= Uu ? (qe(r, 125), Ci(r, e)) : af(e) ? (qe(r, 124), rf(r, e)) : (qe(r, 123), nf(r, e));
      break;
    case "bigint":
      qe(r, 122), sf(r, e);
      break;
    case "object":
      if (e === null)
        qe(r, 126);
      else if (rs(e)) {
        qe(r, 117), Se(r, e.length);
        for (let t = 0; t < e.length; t++)
          Or(r, e[t]);
      } else if (e instanceof Uint8Array)
        qe(r, 116), ot(r, e);
      else {
        qe(r, 118);
        const t = Object.keys(e);
        Se(r, t.length);
        for (let n = 0; n < t.length; n++) {
          const s = t[n];
          dr(r, s), Or(r, e[s]);
        }
      }
      break;
    case "boolean":
      qe(r, e ? 120 : 121);
      break;
    default:
      qe(r, 127);
  }
};
class ro extends Zr {
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
    this.s === e ? this.count++ : (this.count > 0 && Se(this, this.count - 1), this.count = 1, this.w(this, e), this.s = e);
  }
}
const no = (r) => {
  r.count > 0 && (Ci(r.encoder, r.count === 1 ? r.s : -r.s), r.count > 1 && Se(r.encoder, r.count - 2));
};
class Dn {
  constructor() {
    this.encoder = new Zr(), this.s = 0, this.count = 0;
  }
  /**
   * @param {number} v
   */
  write(e) {
    this.s === e ? this.count++ : (no(this), this.count = 1, this.s = e);
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    return no(this), vt(this.encoder);
  }
}
const so = (r) => {
  if (r.count > 0) {
    const e = r.diff * 2 + (r.count === 1 ? 0 : 1);
    Ci(r.encoder, e), r.count > 1 && Se(r.encoder, r.count - 2);
  }
};
class Ws {
  constructor() {
    this.encoder = new Zr(), this.s = 0, this.count = 0, this.diff = 0;
  }
  /**
   * @param {number} v
   */
  write(e) {
    this.diff === e - this.s ? (this.s = e, this.count++) : (so(this), this.count = 1, this.diff = e - this.s, this.s = e);
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    return so(this), vt(this.encoder);
  }
}
class of {
  constructor() {
    this.sarr = [], this.s = "", this.lensE = new Dn();
  }
  /**
   * @param {string} string
   */
  write(e) {
    this.s += e, this.s.length > 19 && (this.sarr.push(this.s), this.s = ""), this.lensE.write(e.length);
  }
  toUint8Array() {
    const e = new Zr();
    return this.sarr.push(this.s), this.s = "", dr(e, this.sarr.join("")), is(e, this.lensE.toUint8Array()), vt(e);
  }
}
const It = (r) => new Error(r), wt = () => {
  throw It("Method unimplemented");
}, gt = () => {
  throw It("Unexpected case");
}, as = It("Unexpected end of array"), cl = It("Integer out of Range"), lf = (r, e, t) => {
  if (e < 0 || t < 0 || e + t > r.length)
    throw as;
  return new Uint8Array(r.buffer, r.byteOffset + e, t);
}, cf = (r, e, t) => {
  if (e < 0 || t < 0 || e + t > r.length)
    throw as;
  return new DataView(r.buffer, r.byteOffset + e, t);
};
class os {
  /**
   * @param {Uint8Array<Buf>} uint8Array Binary data to decode
   */
  constructor(e) {
    this.arr = e, this.pos = 0;
  }
}
const vr = (r) => new os(r), df = (r) => r.pos !== r.arr.length, hf = (r, e) => {
  const t = lf(r.arr, r.pos, e);
  return r.pos += e, t;
}, lt = (r) => hf(r, ve(r)), mr = (r) => r.arr[r.pos++], ve = (r) => {
  let e = 0, t = 1;
  const n = r.arr.length;
  for (; r.pos < n; ) {
    const s = r.arr[r.pos++];
    if (e = e + (s & Wt) * t, t *= 128, s < dt)
      return e;
    if (e > Un)
      throw cl;
  }
  throw as;
}, Si = (r) => {
  let e = r.arr[r.pos++], t = e & hi, n = 64;
  const s = (e & xt) > 0 ? -1 : 1;
  if ((e & dt) === 0)
    return s * t;
  const i = r.arr.length;
  for (; r.pos < i; ) {
    if (e = r.arr[r.pos++], t = t + (e & Wt) * n, n *= 128, e < dt)
      return s * t;
    if (t > Un)
      throw cl;
  }
  throw as;
}, uf = (r) => {
  let e = ve(r);
  if (e === 0)
    return "";
  {
    let t = String.fromCodePoint(mr(r));
    if (--e < 100)
      for (; e--; )
        t += String.fromCodePoint(mr(r));
    else
      for (; e > 0; ) {
        const n = e < 1e4 ? e : 1e4, s = r.arr.subarray(r.pos, r.pos + n);
        r.pos += n, t += String.fromCodePoint.apply(
          null,
          /** @type {any} */
          s
        ), e -= n;
      }
    return decodeURIComponent(escape(t));
  }
}, ff = (r) => (
  /** @type any */
  Tr.decode(lt(r))
), hr = Tr ? ff : uf, Ni = (r, e) => {
  const t = cf(r.arr, r.pos, e);
  return r.pos += e, t;
}, gf = (r) => Ni(r, 4).getFloat32(0, !1), pf = (r) => Ni(r, 8).getFloat64(0, !1), mf = (r) => (
  /** @type {any} */
  Ni(r, 8).getBigInt64(0, !1)
), bf = [
  (r) => {
  },
  // CASE 127: undefined
  (r) => null,
  // CASE 126: null
  Si,
  // CASE 125: integer
  gf,
  // CASE 124: float32
  pf,
  // CASE 123: float64
  mf,
  // CASE 122: bigint
  (r) => !1,
  // CASE 121: boolean (false)
  (r) => !0,
  // CASE 120: boolean (true)
  hr,
  // CASE 119: string
  (r) => {
    const e = ve(r), t = {};
    for (let n = 0; n < e; n++) {
      const s = hr(r);
      t[s] = $r(r);
    }
    return t;
  },
  (r) => {
    const e = ve(r), t = [];
    for (let n = 0; n < e; n++)
      t.push($r(r));
    return t;
  },
  lt
  // CASE 116: Uint8Array
], $r = (r) => bf[127 - mr(r)](r);
class io extends os {
  /**
   * @param {Uint8Array} uint8Array
   * @param {function(Decoder):T} reader
   */
  constructor(e, t) {
    super(e), this.reader = t, this.s = null, this.count = 0;
  }
  read() {
    return this.count === 0 && (this.s = this.reader(this), df(this) ? this.count = ve(this) + 1 : this.count = -1), this.count--, /** @type {T} */
    this.s;
  }
}
class Mn extends os {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(e) {
    super(e), this.s = 0, this.count = 0;
  }
  read() {
    if (this.count === 0) {
      this.s = Si(this);
      const e = ll(this.s);
      this.count = 1, e && (this.s = -this.s, this.count = ve(this) + 2);
    }
    return this.count--, /** @type {number} */
    this.s;
  }
}
class Xs extends os {
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
      const e = Si(this), t = e & 1;
      this.diff = _t(e / 2), this.count = 1, t && (this.count = ve(this) + 2);
    }
    return this.s += this.diff, this.count--, this.s;
  }
}
class Af {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(e) {
    this.decoder = new Mn(e), this.str = hr(this.decoder), this.spos = 0;
  }
  /**
   * @return {string}
   */
  read() {
    const e = this.spos + this.decoder.read(), t = this.str.slice(this.spos, e);
    return this.spos = e, t;
  }
}
const wf = crypto.getRandomValues.bind(crypto), dl = () => wf(new Uint32Array(1))[0], yf = "10000000-1000-4000-8000" + -1e11, kf = () => yf.replace(
  /[018]/g,
  /** @param {number} c */
  (r) => (r ^ dl() & 15 >> r / 4).toString(16)
), ao = (r) => (
  /** @type {Promise<T>} */
  new Promise(r)
);
Promise.all.bind(Promise);
const oo = (r) => r === void 0 ? null : r;
class vf {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  /**
   * @param {string} key
   * @param {any} newValue
   */
  setItem(e, t) {
    this.map.set(e, t);
  }
  /**
   * @param {string} key
   */
  getItem(e) {
    return this.map.get(e);
  }
}
let hl = new vf(), _f = !0;
try {
  typeof localStorage < "u" && localStorage && (hl = localStorage, _f = !1);
} catch {
}
const If = hl, Hr = /* @__PURE__ */ Symbol("Equality"), ul = (r, e) => r === e || !!r?.[Hr]?.(e) || !1, Cf = (r) => typeof r == "object", Ef = Object.assign, Sf = Object.keys, Nf = (r, e) => {
  for (const t in r)
    e(r[t], t);
}, On = (r) => Sf(r).length, Bf = (r) => {
  for (const e in r)
    return !1;
  return !0;
}, Kr = (r, e) => {
  for (const t in r)
    if (!e(r[t], t))
      return !1;
  return !0;
}, Bi = (r, e) => Object.prototype.hasOwnProperty.call(r, e), xf = (r, e) => r === e || On(r) === On(e) && Kr(r, (t, n) => (t !== void 0 || Bi(e, n)) && ul(e[n], t)), Df = Object.freeze, fl = (r) => {
  for (const e in r) {
    const t = r[e];
    (typeof t == "object" || typeof t == "function") && fl(r[e]);
  }
  return Df(r);
}, xi = (r, e, t = 0) => {
  try {
    for (; t < r.length; t++)
      r[t](...e);
  } finally {
    t < r.length && xi(r, e, t + 1);
  }
}, Mf = (r) => r, Rn = (r, e) => {
  if (r === e)
    return !0;
  if (r == null || e == null || r.constructor !== e.constructor && (r.constructor || Object) !== (e.constructor || Object))
    return !1;
  if (r[Hr] != null)
    return r[Hr](e);
  switch (r.constructor) {
    case ArrayBuffer:
      r = new Uint8Array(r), e = new Uint8Array(e);
    // eslint-disable-next-line no-fallthrough
    case Uint8Array: {
      if (r.byteLength !== e.byteLength)
        return !1;
      for (let t = 0; t < r.length; t++)
        if (r[t] !== e[t])
          return !1;
      break;
    }
    case Set: {
      if (r.size !== e.size)
        return !1;
      for (const t of r)
        if (!e.has(t))
          return !1;
      break;
    }
    case Map: {
      if (r.size !== e.size)
        return !1;
      for (const t of r.keys())
        if (!e.has(t) || !Rn(r.get(t), e.get(t)))
          return !1;
      break;
    }
    case void 0:
    case Object:
      if (On(r) !== On(e))
        return !1;
      for (const t in r)
        if (!Bi(r, t) || !Rn(r[t], e[t]))
          return !1;
      break;
    case Array:
      if (r.length !== e.length)
        return !1;
      for (let t = 0; t < r.length; t++)
        if (!Rn(r[t], e[t]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, Rf = (r, e) => e.includes(r), jr = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]";
let kt;
const zf = () => {
  if (kt === void 0)
    if (jr) {
      kt = At();
      const r = process.argv;
      let e = null;
      for (let t = 0; t < r.length; t++) {
        const n = r[t];
        n[0] === "-" ? (e !== null && kt.set(e, ""), e = n) : e !== null && (kt.set(e, n), e = null);
      }
      e !== null && kt.set(e, "");
    } else typeof location == "object" ? (kt = At(), (location.search || "?").slice(1).split("&").forEach((r) => {
      if (r.length !== 0) {
        const [e, t] = r.split("=");
        kt.set(`--${eo(e, "-")}`, t), kt.set(`-${eo(e, "-")}`, t);
      }
    })) : kt = At();
  return kt;
}, gi = (r) => zf().has(r), $n = (r) => oo(jr ? process.env[r.toUpperCase().replaceAll("-", "_")] : If.getItem(r)), gl = (r) => gi("--" + r) || $n(r) !== null, Pf = gl("production"), Ff = jr && Rf(process.env.FORCE_COLOR, ["true", "1", "2"]), Qf = Ff || !gi("--no-colors") && // @todo deprecate --no-colors
!gl("no-color") && (!jr || process.stdout.isTTY) && (!jr || gi("--color") || $n("COLORTERM") !== null || ($n("TERM") || "").includes("color")), Tf = (r) => new Uint8Array(r), Lf = (r) => {
  const e = Tf(r.byteLength);
  return e.set(r), e;
};
class Uf {
  /**
   * @param {L} left
   * @param {R} right
   */
  constructor(e, t) {
    this.left = e, this.right = t;
  }
}
const Bt = (r, e) => new Uf(r, e), lo = (r) => r.next() >= 0.5, Zs = (r, e, t) => _t(r.next() * (t + 1 - e) + e), pl = (r, e, t) => _t(r.next() * (t + 1 - e) + e), Di = (r, e, t) => pl(r, e, t), Of = (r) => $u(Di(r, 97, 122)), $f = (r, e = 0, t = 20) => {
  const n = Di(r, e, t);
  let s = "";
  for (let i = 0; i < n; i++)
    s += Of(r);
  return s;
}, Ks = (r, e) => e[Di(r, 0, e.length - 1)], Hf = /* @__PURE__ */ Symbol("0schema");
class jf {
  constructor() {
    this._rerrs = [];
  }
  /**
   * @param {string?} path
   * @param {string} expected
   * @param {string} has
   * @param {string?} message
   */
  extend(e, t, n, s = null) {
    this._rerrs.push({ path: e, expected: t, has: n, message: s });
  }
  toString() {
    const e = [];
    for (let t = this._rerrs.length - 1; t > 0; t--) {
      const n = this._rerrs[t];
      e.push(Xu(" ", (this._rerrs.length - t) * 2) + `${n.path != null ? `[${n.path}] ` : ""}${n.has} doesn't match ${n.expected}. ${n.message}`);
    }
    return e.join(`
`);
  }
}
const pi = (r, e) => r === e ? !0 : r == null || e == null || r.constructor !== e.constructor ? !1 : r[Hr] ? ul(r, e) : rs(r) ? Ii(
  r,
  (t) => al(e, (n) => pi(t, n))
) : Cf(r) ? Kr(
  r,
  (t, n) => pi(t, e[n])
) : !1;
class nt {
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
    let [t, n] = [
      /** @type {any} */
      this.shape,
      /** @type {any} */
      e.shape
    ];
    return (
      /** @type {typeof Schema<any>} */
      this.constructor._dilutes && ([n, t] = [t, n]), pi(t, n)
    );
  }
  /**
   * Overwrite this when necessary. By default, we only check the `shape` property which every shape
   * should have.
   * @param {Schema<any>} other
   */
  equals(e) {
    return this.constructor === e.constructor && Rn(this.shape, e.shape);
  }
  [Hf]() {
    return !0;
  }
  /**
   * @param {object} other
   */
  [Hr](e) {
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
  check(e, t) {
    wt();
  }
  /* c8 ignore stop */
  /**
   * @type {Schema<T?>}
   */
  get nullable() {
    return _r(this, us);
  }
  /**
   * @type {$Optional<Schema<T>>}
   */
  get optional() {
    return new Al(
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
    return co(e, this), /** @type {any} */
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
    return co(e, this), e;
  }
}
class Mi extends nt {
  /**
   * @param {C} c
   * @param {((o:Instance<C>)=>boolean)|null} check
   */
  constructor(e, t) {
    super(), this.shape = e, this._c = t;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is C extends ((...args:any[]) => infer T) ? T : (C extends (new (...args:any[]) => any) ? InstanceType<C> : never)} o
   */
  check(e, t = void 0) {
    const n = e?.constructor === this.shape && (this._c == null || this._c(e));
    return !n && t?.extend(null, this.shape.name, e?.constructor.name, e?.constructor !== this.shape ? "Constructor match failed" : "Check failed"), n;
  }
}
const $e = (r, e = null) => new Mi(r, e);
$e(Mi);
class Ri extends nt {
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
  check(e, t) {
    const n = this.shape(e);
    return !n && t?.extend(null, "custom prop", e?.constructor.name, "failed to check custom prop"), n;
  }
}
const Je = (r) => new Ri(r);
$e(Ri);
class ls extends nt {
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
  check(e, t) {
    const n = this.shape.some((s) => s === e);
    return !n && t?.extend(null, this.shape.join(" | "), e.toString()), n;
  }
}
const cs = (...r) => new ls(r), ml = $e(ls), qf = (
  /** @type {any} */
  RegExp.escape || /** @type {(str:string) => string} */
  ((r) => r.replace(/[().|&,$^[\]]/g, (e) => "\\" + e))
), bl = (r) => {
  if (br.check(r))
    return [qf(r)];
  if (ml.check(r))
    return (
      /** @type {Array<string|number>} */
      r.shape.map((e) => e + "")
    );
  if (Sl.check(r))
    return ["[+-]?\\d+.?\\d*"];
  if (Nl.check(r))
    return [".*"];
  if (Hn.check(r))
    return r.shape.map(bl).flat(1);
  gt();
};
class Gf extends nt {
  /**
   * @param {T} shape
   */
  constructor(e) {
    super(), this.shape = e, this._r = new RegExp("^" + e.map(bl).map((t) => `(${t.join("|")})`).join("") + "$");
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is CastStringTemplateArgsToTemplate<T>}
   */
  check(e, t) {
    const n = this._r.exec(e) != null;
    return !n && t?.extend(null, this._r.toString(), e.toString(), "String doesn't match string template."), n;
  }
}
$e(Gf);
const Jf = /* @__PURE__ */ Symbol("optional");
class Al extends nt {
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
  check(e, t) {
    const n = e === void 0 || this.shape.check(e);
    return !n && t?.extend(null, "undefined (optional)", "()"), n;
  }
  get [Jf]() {
    return !0;
  }
}
const Vf = $e(Al);
class Wf extends nt {
  /**
   * @param {any} _o
   * @param {ValidationError} [err]
   * @return {_o is never}
   */
  check(e, t) {
    return t?.extend(null, "never", typeof e), !1;
  }
}
$e(Wf);
class ds extends nt {
  /**
   * @param {S} shape
   * @param {boolean} partial
   */
  constructor(e, t = !1) {
    super(), this.shape = e, this._isPartial = t;
  }
  static _dilutes = !0;
  /**
   * @type {Schema<Partial<$ObjectToType<S>>>}
   */
  get partial() {
    return new ds(this.shape, !0);
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is $ObjectToType<S>}
   */
  check(e, t) {
    return e == null ? (t?.extend(null, "object", "null"), !1) : Kr(this.shape, (n, s) => {
      const i = this._isPartial && !Bi(e, s) || n.check(e[s], t);
      return !i && t?.extend(s.toString(), n.toString(), typeof e[s], "Object property does not match"), i;
    });
  }
}
const Xf = (r) => (
  /** @type {any} */
  new ds(r)
), Zf = $e(ds), Kf = Je((r) => r != null && (r.constructor === Object || r.constructor == null));
class wl extends nt {
  /**
   * @param {Keys} keys
   * @param {Values} values
   */
  constructor(e, t) {
    super(), this.shape = {
      keys: e,
      values: t
    };
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is { [key in Unwrap<Keys>]: Unwrap<Values> }}
   */
  check(e, t) {
    return e != null && Kr(e, (n, s) => {
      const i = this.shape.keys.check(s, t);
      return !i && t?.extend(s + "", "Record", typeof e, i ? "Key doesn't match schema" : "Value doesn't match value"), i && this.shape.values.check(n, t);
    });
  }
}
const yl = (r, e) => new wl(r, e), Yf = $e(wl);
class kl extends nt {
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
  check(e, t) {
    return e != null && Kr(this.shape, (n, s) => {
      const i = (
        /** @type {Schema<any>} */
        n.check(e[s], t)
      );
      return !i && t?.extend(s.toString(), "Tuple", typeof n), i;
    });
  }
}
const eg = (...r) => new kl(r);
$e(kl);
class vl extends nt {
  /**
   * @param {Array<S>} v
   */
  constructor(e) {
    super(), this.shape = e.length === 1 ? e[0] : new zi(e);
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Array<S extends Schema<infer T> ? T : never>} o
   */
  check(e, t) {
    const n = rs(e) && Ii(e, (s) => this.shape.check(s));
    return !n && t?.extend(null, "Array", ""), n;
  }
}
const _l = (...r) => new vl(r), tg = $e(vl), rg = Je((r) => rs(r));
class Il extends nt {
  /**
   * @param {new (...args:any) => T} constructor
   * @param {((o:T) => boolean)|null} check
   */
  constructor(e, t) {
    super(), this.shape = e, this._c = t;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is T}
   */
  check(e, t) {
    const n = e instanceof this.shape && (this._c == null || this._c(e));
    return !n && t?.extend(null, this.shape.name, e?.constructor.name), n;
  }
}
const ng = (r, e = null) => new Il(r, e);
$e(Il);
const sg = ng(nt);
class ig extends nt {
  /**
   * @param {Args} args
   */
  constructor(e) {
    super(), this.len = e.length - 1, this.args = eg(...e.slice(-1)), this.res = e[this.len];
  }
  /**
   * @param {any} f
   * @param {ValidationError} err
   * @return {f is _LArgsToLambdaDef<Args>}
   */
  check(e, t) {
    const n = e.constructor === Function && e.length <= this.len;
    return !n && t?.extend(null, "function", typeof e), n;
  }
}
const ag = $e(ig), og = Je((r) => typeof r == "function");
class lg extends nt {
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
  check(e, t) {
    const n = Ii(this.shape, (s) => s.check(e, t));
    return !n && t?.extend(null, "Intersectinon", typeof e), n;
  }
}
$e(lg, (r) => r.shape.length > 0);
class zi extends nt {
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
  check(e, t) {
    const n = al(this.shape, (s) => s.check(e, t));
    return t?.extend(null, "Union", typeof e), n;
  }
}
const _r = (...r) => r.findIndex((e) => Hn.check(e)) >= 0 ? _r(...r.map((e) => qr(e)).map((e) => Hn.check(e) ? e.shape : [e]).flat(1)) : r.length === 1 ? r[0] : new zi(r), Hn = (
  /** @type {Schema<$Union<any>>} */
  $e(zi)
), Cl = () => !0, jn = Je(Cl), cg = (
  /** @type {Schema<Schema<any>>} */
  $e(Ri, (r) => r.shape === Cl)
), Pi = Je((r) => typeof r == "bigint"), dg = (
  /** @type {Schema<Schema<BigInt>>} */
  Je((r) => r === Pi)
), El = Je((r) => typeof r == "symbol");
Je((r) => r === El);
const ur = Je((r) => typeof r == "number"), Sl = (
  /** @type {Schema<Schema<number>>} */
  Je((r) => r === ur)
), br = Je((r) => typeof r == "string"), Nl = (
  /** @type {Schema<Schema<string>>} */
  Je((r) => r === br)
), hs = Je((r) => typeof r == "boolean"), hg = (
  /** @type {Schema<Schema<Boolean>>} */
  Je((r) => r === hs)
), Bl = cs(void 0);
$e(ls, (r) => r.shape.length === 1 && r.shape[0] === void 0);
cs(void 0);
const us = cs(null), ug = (
  /** @type {Schema<Schema<null>>} */
  $e(ls, (r) => r.shape.length === 1 && r.shape[0] === null)
);
$e(Uint8Array);
$e(Mi, (r) => r.shape === Uint8Array);
const fg = _r(ur, br, us, Bl, Pi, hs, El);
(() => {
  const r = (
    /** @type {$Array<$any>} */
    _l(jn)
  ), e = (
    /** @type {$Record<$string,$any>} */
    yl(br, jn)
  ), t = _r(ur, br, us, hs, r, e);
  return r.shape = t, e.shape.values = t, t;
})();
const qr = (r) => {
  if (sg.check(r))
    return (
      /** @type {any} */
      r
    );
  if (Kf.check(r)) {
    const e = {};
    for (const t in r)
      e[t] = qr(r[t]);
    return (
      /** @type {any} */
      Xf(e)
    );
  } else {
    if (rg.check(r))
      return (
        /** @type {any} */
        _r(...r.map(qr))
      );
    if (fg.check(r))
      return (
        /** @type {any} */
        cs(r)
      );
    if (og.check(r))
      return (
        /** @type {any} */
        $e(
          /** @type {any} */
          r
        )
      );
  }
  gt();
}, co = Pf ? () => {
} : (r, e) => {
  const t = new jf();
  if (!e.check(r, t))
    throw It(`Expected value to be of type ${e.constructor.name}.
${t.toString()}`);
};
class gg {
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
  if(e, t) {
    return this.patterns.push({ if: qr(e), h: t }), this;
  }
  /**
   * @template R
   * @param {(o:any,s:State)=>R} h
   */
  else(e) {
    return this.if(jn, e);
  }
  /**
   * @return {State extends undefined
   *   ? <In extends Unwrap<Patterns['if']>>(o:In,state?:undefined)=>PatternMatchResult<Patterns,In>
   *   : <In extends Unwrap<Patterns['if']>>(o:In,state:State)=>PatternMatchResult<Patterns,In>}
   */
  done() {
    return (
      /** @type {any} */
      (e, t) => {
        for (let n = 0; n < this.patterns.length; n++) {
          const s = this.patterns[n];
          if (s.if.check(e))
            return s.h(e, t);
        }
        throw It("Unhandled pattern");
      }
    );
  }
}
const pg = (r) => new gg(
  /** @type {any} */
  r
), xl = (
  /** @type {any} */
  pg(
    /** @type {Schema<prng.PRNG>} */
    jn
  ).if(Sl, (r, e) => Zs(e, Ya, Un)).if(Nl, (r, e) => $f(e)).if(hg, (r, e) => lo(e)).if(dg, (r, e) => BigInt(Zs(e, Ya, Un))).if(Hn, (r, e) => or(e, Ks(e, r.shape))).if(Zf, (r, e) => {
    const t = {};
    for (const n in r.shape) {
      let s = r.shape[n];
      if (Vf.check(s)) {
        if (lo(e))
          continue;
        s = s.shape;
      }
      t[n] = xl(s, e);
    }
    return t;
  }).if(tg, (r, e) => {
    const t = [], n = pl(e, 0, 42);
    for (let s = 0; s < n; s++)
      t.push(or(e, r.shape));
    return t;
  }).if(ml, (r, e) => Ks(e, r.shape)).if(ug, (r, e) => null).if(ag, (r, e) => {
    const t = or(e, r.res);
    return () => t;
  }).if(cg, (r, e) => or(e, Ks(e, [
    ur,
    br,
    us,
    Bl,
    Pi,
    hs,
    _l(ur),
    yl(_r("a", "b", "c"), ur)
  ]))).if(Yf, (r, e) => {
    const t = {}, n = Zs(e, 0, 3);
    for (let s = 0; s < n; s++) {
      const i = or(e, r.shape.keys), a = or(e, r.shape.values);
      t[i] = a;
    }
    return t;
  }).done()
), or = (r, e) => (
  /** @type {any} */
  xl(qr(e), r)
), fs = (
  /** @type {Document} */
  typeof document < "u" ? document : {}
);
Je((r) => r.nodeType === yg);
typeof DOMParser < "u" && new DOMParser();
Je((r) => r.nodeType === bg);
Je((r) => r.nodeType === Ag);
const mg = (r) => Pu(r, (e, t) => `${t}:${e};`).join(""), bg = fs.ELEMENT_NODE, Ag = fs.TEXT_NODE, wg = fs.DOCUMENT_NODE, yg = fs.DOCUMENT_FRAGMENT_NODE;
Je((r) => r.nodeType === wg);
const Mt = Symbol, Dl = Mt(), Ml = Mt(), kg = Mt(), vg = Mt(), _g = Mt(), Rl = Mt(), Ig = Mt(), Fi = Mt(), Cg = Mt(), Eg = (r) => {
  r.length === 1 && r[0]?.constructor === Function && (r = /** @type {Array<string|Symbol|Object|number>} */
  /** @type {[function]} */
  r[0]());
  const e = [], t = [];
  let n = 0;
  for (; n < r.length; n++) {
    const s = r[n];
    if (s === void 0)
      break;
    if (s.constructor === String || s.constructor === Number)
      e.push(s);
    else if (s.constructor === Object)
      break;
  }
  for (n > 0 && t.push(e.join("")); n < r.length; n++) {
    const s = r[n];
    s instanceof Symbol || t.push(s);
  }
  return t;
}, Sg = {
  [Dl]: Bt("font-weight", "bold"),
  [Ml]: Bt("font-weight", "normal"),
  [kg]: Bt("color", "blue"),
  [_g]: Bt("color", "green"),
  [vg]: Bt("color", "grey"),
  [Rl]: Bt("color", "red"),
  [Ig]: Bt("color", "purple"),
  [Fi]: Bt("color", "orange"),
  // not well supported in chrome when debugging node with inspector - TODO: deprecate
  [Cg]: Bt("color", "black")
}, Ng = (r) => {
  r.length === 1 && r[0]?.constructor === Function && (r = /** @type {Array<string|Symbol|Object|number>} */
  /** @type {[function]} */
  r[0]());
  const e = [], t = [], n = At();
  let s = [], i = 0;
  for (; i < r.length; i++) {
    const a = r[i], o = Sg[a];
    if (o !== void 0)
      n.set(o.left, o.right);
    else {
      if (a === void 0)
        break;
      if (a.constructor === String || a.constructor === Number) {
        const l = mg(n);
        i > 0 || l.length > 0 ? (e.push("%c" + a), t.push(l)) : e.push(a);
      } else
        break;
    }
  }
  for (i > 0 && (s = t, s.unshift(e.join(""))); i < r.length; i++) {
    const a = r[i];
    a instanceof Symbol || s.push(a);
  }
  return s;
}, zl = Qf ? Ng : Eg, Bg = (...r) => {
  console.log(...zl(r)), Pl.forEach((e) => e.print(r));
}, xg = (...r) => {
  console.warn(...zl(r)), r.unshift(Fi), Pl.forEach((e) => e.print(r));
}, Pl = pr(), Fl = (r) => ({
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return this;
  },
  // @ts-ignore
  next: r
}), Dg = (r, e) => Fl(() => {
  let t;
  do
    t = r.next();
  while (!t.done && !e(t.value));
  return t;
}), Ys = (r, e) => Fl(() => {
  const { done: t, value: n } = r.next();
  return { done: t, value: t ? void 0 : e(n) };
});
class gs {
  /**
   * @param {number} clock
   * @param {number} len
   */
  constructor(e, t) {
    this.clock = e, this.len = t;
  }
}
class Yr {
  constructor() {
    this.clients = /* @__PURE__ */ new Map();
  }
}
const Ql = (r, e, t) => e.clients.forEach((n, s) => {
  const i = (
    /** @type {Array<GC|Item>} */
    r.doc.store.clients.get(s)
  );
  if (i != null) {
    const a = i[i.length - 1], o = a.id.clock + a.length;
    for (let l = 0, h = n[l]; l < n.length && h.clock < o; h = n[++l])
      Jl(r, i, h.clock, h.len, t);
  }
}), Mg = (r, e) => {
  let t = 0, n = r.length - 1;
  for (; t <= n; ) {
    const s = _t((t + n) / 2), i = r[s], a = i.clock;
    if (a <= e) {
      if (e < a + i.len)
        return s;
      t = s + 1;
    } else
      n = s - 1;
  }
  return null;
}, Tl = (r, e) => {
  const t = r.clients.get(e.client);
  return t !== void 0 && Mg(t, e.clock) !== null;
}, Qi = (r) => {
  r.clients.forEach((e) => {
    e.sort((s, i) => s.clock - i.clock);
    let t, n;
    for (t = 1, n = 1; t < e.length; t++) {
      const s = e[n - 1], i = e[t];
      s.clock + s.len >= i.clock ? e[n - 1] = new gs(s.clock, rr(s.len, i.clock + i.len - s.clock)) : (n < t && (e[n] = i), n++);
    }
    e.length = n;
  });
}, Rg = (r) => {
  const e = new Yr();
  for (let t = 0; t < r.length; t++)
    r[t].clients.forEach((n, s) => {
      if (!e.clients.has(s)) {
        const i = n.slice();
        for (let a = t + 1; a < r.length; a++)
          Qu(i, r[a].clients.get(s) || []);
        e.clients.set(s, i);
      }
    });
  return Qi(e), e;
}, qn = (r, e, t, n) => {
  jt(r.clients, e, () => (
    /** @type {Array<DeleteItem>} */
    []
  )).push(new gs(t, n));
}, zg = () => new Yr(), Pg = (r) => {
  const e = zg();
  return r.clients.forEach((t, n) => {
    const s = [];
    for (let i = 0; i < t.length; i++) {
      const a = t[i];
      if (a.deleted) {
        const o = a.id.clock;
        let l = a.length;
        if (i + 1 < t.length)
          for (let h = t[i + 1]; i + 1 < t.length && h.deleted; h = t[++i + 1])
            l += h.length;
        s.push(new gs(o, l));
      }
    }
    s.length > 0 && e.clients.set(n, s);
  }), e;
}, Ir = (r, e) => {
  Se(r.restEncoder, e.clients.size), Xt(e.clients.entries()).sort((t, n) => n[0] - t[0]).forEach(([t, n]) => {
    r.resetDsCurVal(), Se(r.restEncoder, t);
    const s = n.length;
    Se(r.restEncoder, s);
    for (let i = 0; i < s; i++) {
      const a = n[i];
      r.writeDsClock(a.clock), r.writeDsLen(a.len);
    }
  });
}, Ti = (r) => {
  const e = new Yr(), t = ve(r.restDecoder);
  for (let n = 0; n < t; n++) {
    r.resetDsCurVal();
    const s = ve(r.restDecoder), i = ve(r.restDecoder);
    if (i > 0) {
      const a = jt(e.clients, s, () => (
        /** @type {Array<DeleteItem>} */
        []
      ));
      for (let o = 0; o < i; o++)
        a.push(new gs(r.readDsClock(), r.readDsLen()));
    }
  }
  return e;
}, ho = (r, e, t) => {
  const n = new Yr(), s = ve(r.restDecoder);
  for (let i = 0; i < s; i++) {
    r.resetDsCurVal();
    const a = ve(r.restDecoder), o = ve(r.restDecoder), l = t.clients.get(a) || [], h = Ge(t, a);
    for (let p = 0; p < o; p++) {
      const b = r.readDsClock(), m = b + r.readDsLen();
      if (b < h) {
        h < m && qn(n, a, h, m - h);
        let u = Ct(l, b), y = l[u];
        for (!y.deleted && y.id.clock < b && (l.splice(u + 1, 0, Kn(e, y, b - y.id.clock)), u++); u < l.length && (y = l[u++], y.id.clock < m); )
          y.deleted || (m < y.id.clock + y.length && l.splice(u, 0, Kn(e, y, m - y.id.clock)), y.delete(e));
      } else
        qn(n, a, b, m - b);
    }
  }
  if (n.clients.size > 0) {
    const i = new Zt();
    return Se(i.restEncoder, 0), Ir(i, n), i.toUint8Array();
  }
  return null;
}, Ll = dl;
class Cr extends Lu {
  /**
   * @param {DocOpts} opts configuration
   */
  constructor({ guid: e = kf(), collectionid: t = null, gc: n = !0, gcFilter: s = () => !0, meta: i = null, autoLoad: a = !1, shouldLoad: o = !0 } = {}) {
    super(), this.gc = n, this.gcFilter = s, this.clientID = Ll(), this.guid = e, this.collectionid = t, this.share = /* @__PURE__ */ new Map(), this.store = new ql(), this._transaction = null, this._transactionCleanups = [], this.subdocs = /* @__PURE__ */ new Set(), this._item = null, this.shouldLoad = o, this.autoLoad = a, this.meta = i, this.isLoaded = !1, this.isSynced = !1, this.isDestroyed = !1, this.whenLoaded = ao((h) => {
      this.on("load", () => {
        this.isLoaded = !0, h(this);
      });
    });
    const l = () => ao((h) => {
      const p = (b) => {
        (b === void 0 || b === !0) && (this.off("sync", p), h());
      };
      this.on("sync", p);
    });
    this.on("sync", (h) => {
      h === !1 && this.isSynced && (this.whenSynced = l()), this.isSynced = h === void 0 || h === !0, this.isSynced && !this.isLoaded && this.emit("load", [this]);
    }), this.whenSynced = l();
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
    e !== null && !this.shouldLoad && ze(
      /** @type {any} */
      e.parent.doc,
      (t) => {
        t.subdocsLoaded.add(this);
      },
      null,
      !0
    ), this.shouldLoad = !0;
  }
  getSubdocs() {
    return this.subdocs;
  }
  getSubdocGuids() {
    return new Set(Xt(this.subdocs).map((e) => e.guid));
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
  transact(e, t = null) {
    return ze(this, e, t);
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
  get(e, t = (
    /** @type {any} */
    Xe
  )) {
    const n = jt(this.share, e, () => {
      const i = new t();
      return i._integrate(this, null), i;
    }), s = n.constructor;
    if (t !== Xe && s !== t)
      if (s === Xe) {
        const i = new t();
        i._map = n._map, n._map.forEach(
          /** @param {Item?} n */
          (a) => {
            for (; a !== null; a = a.left)
              a.parent = i;
          }
        ), i._start = n._start;
        for (let a = i._start; a !== null; a = a.right)
          a.parent = i;
        return i._length = n._length, this.share.set(e, i), i._integrate(this, null), /** @type {InstanceType<Type>} */
        i;
      } else
        throw new Error(`Type with the name ${e} has already been defined with a different constructor`);
    return (
      /** @type {InstanceType<Type>} */
      n
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
      this.get(e, gr)
    );
  }
  /**
   * @param {string} [name]
   * @return {YText}
   *
   * @public
   */
  getText(e = "") {
    return this.get(e, yr);
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
      this.get(e, wr)
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
      this.get(e, kr)
    );
  }
  /**
   * @param {string} [name]
   * @return {YXmlFragment}
   *
   * @public
   */
  getXmlFragment(e = "") {
    return this.get(e, Kt);
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
    return this.share.forEach((t, n) => {
      e[n] = t.toJSON();
    }), e;
  }
  /**
   * Emit `destroy` event and unregister all event handlers.
   */
  destroy() {
    this.isDestroyed = !0, Xt(this.subdocs).forEach((t) => t.destroy());
    const e = this._item;
    if (e !== null) {
      this._item = null;
      const t = (
        /** @type {ContentDoc} */
        e.content
      );
      t.doc = new Cr({ guid: this.guid, ...t.opts, shouldLoad: !1 }), t.doc._item = e, ze(
        /** @type {any} */
        e.parent.doc,
        (n) => {
          const s = t.doc;
          e.deleted || n.subdocsAdded.add(s), n.subdocsRemoved.add(this);
        },
        null,
        !0
      );
    }
    this.emit("destroyed", [!0]), this.emit("destroy", [this]), super.destroy();
  }
}
class Ul {
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
    return ve(this.restDecoder);
  }
  /**
   * @return {number}
   */
  readDsLen() {
    return ve(this.restDecoder);
  }
}
class Ol extends Ul {
  /**
   * @return {ID}
   */
  readLeftID() {
    return Ee(ve(this.restDecoder), ve(this.restDecoder));
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return Ee(ve(this.restDecoder), ve(this.restDecoder));
  }
  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient() {
    return ve(this.restDecoder);
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo() {
    return mr(this.restDecoder);
  }
  /**
   * @return {string}
   */
  readString() {
    return hr(this.restDecoder);
  }
  /**
   * @return {boolean} isKey
   */
  readParentInfo() {
    return ve(this.restDecoder) === 1;
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readTypeRef() {
    return ve(this.restDecoder);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number} len
   */
  readLen() {
    return ve(this.restDecoder);
  }
  /**
   * @return {any}
   */
  readAny() {
    return $r(this.restDecoder);
  }
  /**
   * @return {Uint8Array}
   */
  readBuf() {
    return Lf(lt(this.restDecoder));
  }
  /**
   * Legacy implementation uses JSON parse. We use any-decoding in v2.
   *
   * @return {any}
   */
  readJSON() {
    return JSON.parse(hr(this.restDecoder));
  }
  /**
   * @return {string}
   */
  readKey() {
    return hr(this.restDecoder);
  }
}
class Fg {
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
    return this.dsCurrVal += ve(this.restDecoder), this.dsCurrVal;
  }
  /**
   * @return {number}
   */
  readDsLen() {
    const e = ve(this.restDecoder) + 1;
    return this.dsCurrVal += e, e;
  }
}
class Ar extends Fg {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(e) {
    super(e), this.keys = [], ve(e), this.keyClockDecoder = new Xs(lt(e)), this.clientDecoder = new Mn(lt(e)), this.leftClockDecoder = new Xs(lt(e)), this.rightClockDecoder = new Xs(lt(e)), this.infoDecoder = new io(lt(e), mr), this.stringDecoder = new Af(lt(e)), this.parentInfoDecoder = new io(lt(e), mr), this.typeRefDecoder = new Mn(lt(e)), this.lenDecoder = new Mn(lt(e));
  }
  /**
   * @return {ID}
   */
  readLeftID() {
    return new fr(this.clientDecoder.read(), this.leftClockDecoder.read());
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return new fr(this.clientDecoder.read(), this.rightClockDecoder.read());
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
    return $r(this.restDecoder);
  }
  /**
   * @return {Uint8Array}
   */
  readBuf() {
    return lt(this.restDecoder);
  }
  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @return {any}
   */
  readJSON() {
    return $r(this.restDecoder);
  }
  /**
   * @return {string}
   */
  readKey() {
    const e = this.keyClockDecoder.read();
    if (e < this.keys.length)
      return this.keys[e];
    {
      const t = this.stringDecoder.read();
      return this.keys.push(t), t;
    }
  }
}
class Qg {
  constructor() {
    this.restEncoder = ss();
  }
  toUint8Array() {
    return vt(this.restEncoder);
  }
  resetDsCurVal() {
  }
  /**
   * @param {number} clock
   */
  writeDsClock(e) {
    Se(this.restEncoder, e);
  }
  /**
   * @param {number} len
   */
  writeDsLen(e) {
    Se(this.restEncoder, e);
  }
}
class en extends Qg {
  /**
   * @param {ID} id
   */
  writeLeftID(e) {
    Se(this.restEncoder, e.client), Se(this.restEncoder, e.clock);
  }
  /**
   * @param {ID} id
   */
  writeRightID(e) {
    Se(this.restEncoder, e.client), Se(this.restEncoder, e.clock);
  }
  /**
   * Use writeClient and writeClock instead of writeID if possible.
   * @param {number} client
   */
  writeClient(e) {
    Se(this.restEncoder, e);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo(e) {
    ui(this.restEncoder, e);
  }
  /**
   * @param {string} s
   */
  writeString(e) {
    dr(this.restEncoder, e);
  }
  /**
   * @param {boolean} isYKey
   */
  writeParentInfo(e) {
    Se(this.restEncoder, e ? 1 : 0);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef(e) {
    Se(this.restEncoder, e);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen(e) {
    Se(this.restEncoder, e);
  }
  /**
   * @param {any} any
   */
  writeAny(e) {
    Or(this.restEncoder, e);
  }
  /**
   * @param {Uint8Array} buf
   */
  writeBuf(e) {
    ot(this.restEncoder, e);
  }
  /**
   * @param {any} embed
   */
  writeJSON(e) {
    dr(this.restEncoder, JSON.stringify(e));
  }
  /**
   * @param {string} key
   */
  writeKey(e) {
    dr(this.restEncoder, e);
  }
}
class Tg {
  constructor() {
    this.restEncoder = ss(), this.dsCurrVal = 0;
  }
  toUint8Array() {
    return vt(this.restEncoder);
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  /**
   * @param {number} clock
   */
  writeDsClock(e) {
    const t = e - this.dsCurrVal;
    this.dsCurrVal = e, Se(this.restEncoder, t);
  }
  /**
   * @param {number} len
   */
  writeDsLen(e) {
    e === 0 && gt(), Se(this.restEncoder, e - 1), this.dsCurrVal += e;
  }
}
class Zt extends Tg {
  constructor() {
    super(), this.keyMap = /* @__PURE__ */ new Map(), this.keyClock = 0, this.keyClockEncoder = new Ws(), this.clientEncoder = new Dn(), this.leftClockEncoder = new Ws(), this.rightClockEncoder = new Ws(), this.infoEncoder = new ro(ui), this.stringEncoder = new of(), this.parentInfoEncoder = new ro(ui), this.typeRefEncoder = new Dn(), this.lenEncoder = new Dn();
  }
  toUint8Array() {
    const e = ss();
    return Se(e, 0), ot(e, this.keyClockEncoder.toUint8Array()), ot(e, this.clientEncoder.toUint8Array()), ot(e, this.leftClockEncoder.toUint8Array()), ot(e, this.rightClockEncoder.toUint8Array()), ot(e, vt(this.infoEncoder)), ot(e, this.stringEncoder.toUint8Array()), ot(e, vt(this.parentInfoEncoder)), ot(e, this.typeRefEncoder.toUint8Array()), ot(e, this.lenEncoder.toUint8Array()), is(e, vt(this.restEncoder)), vt(e);
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
    Or(this.restEncoder, e);
  }
  /**
   * @param {Uint8Array} buf
   */
  writeBuf(e) {
    ot(this.restEncoder, e);
  }
  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @param {any} embed
   */
  writeJSON(e) {
    Or(this.restEncoder, e);
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
    const t = this.keyMap.get(e);
    t === void 0 ? (this.keyClockEncoder.write(this.keyClock++), this.stringEncoder.write(e)) : this.keyClockEncoder.write(t);
  }
}
const Lg = (r, e, t, n) => {
  n = rr(n, e[0].id.clock);
  const s = Ct(e, n);
  Se(r.restEncoder, e.length - s), r.writeClient(t), Se(r.restEncoder, n);
  const i = e[s];
  i.write(r, n - i.id.clock);
  for (let a = s + 1; a < e.length; a++)
    e[a].write(r, 0);
}, Li = (r, e, t) => {
  const n = /* @__PURE__ */ new Map();
  t.forEach((s, i) => {
    Ge(e, i) > s && n.set(i, s);
  }), Ui(e).forEach((s, i) => {
    t.has(i) || n.set(i, 0);
  }), Se(r.restEncoder, n.size), Xt(n.entries()).sort((s, i) => i[0] - s[0]).forEach(([s, i]) => {
    Lg(
      r,
      /** @type {Array<GC|Item>} */
      e.clients.get(s),
      s,
      i
    );
  });
}, Ug = (r, e) => {
  const t = At(), n = ve(r.restDecoder);
  for (let s = 0; s < n; s++) {
    const i = ve(r.restDecoder), a = new Array(i), o = r.readClient();
    let l = ve(r.restDecoder);
    t.set(o, { i: 0, refs: a });
    for (let h = 0; h < i; h++) {
      const p = r.readInfo();
      switch (ns & p) {
        case 0: {
          const b = r.readLen();
          a[h] = new ut(Ee(o, l), b), l += b;
          break;
        }
        case 10: {
          const b = ve(r.restDecoder);
          a[h] = new ft(Ee(o, l), b), l += b;
          break;
        }
        default: {
          const b = (p & (xt | dt)) === 0, m = new He(
            Ee(o, l),
            null,
            // left
            (p & dt) === dt ? r.readLeftID() : null,
            // origin
            null,
            // right
            (p & xt) === xt ? r.readRightID() : null,
            // right origin
            b ? r.readParentInfo() ? e.get(r.readString()) : r.readLeftID() : null,
            // parent
            b && (p & Lr) === Lr ? r.readString() : null,
            // parentSub
            uc(r, p)
            // item content
          );
          a[h] = m, l += m.length;
        }
      }
    }
  }
  return t;
}, Og = (r, e, t) => {
  const n = [];
  let s = Xt(t.keys()).sort((u, y) => u - y);
  if (s.length === 0)
    return null;
  const i = () => {
    if (s.length === 0)
      return null;
    let u = (
      /** @type {{i:number,refs:Array<GC|Item>}} */
      t.get(s[s.length - 1])
    );
    for (; u.refs.length === u.i; )
      if (s.pop(), s.length > 0)
        u = /** @type {{i:number,refs:Array<GC|Item>}} */
        t.get(s[s.length - 1]);
      else
        return null;
    return u;
  };
  let a = i();
  if (a === null)
    return null;
  const o = new ql(), l = /* @__PURE__ */ new Map(), h = (u, y) => {
    const A = l.get(u);
    (A == null || A > y) && l.set(u, y);
  };
  let p = (
    /** @type {any} */
    a.refs[
      /** @type {any} */
      a.i++
    ]
  );
  const b = /* @__PURE__ */ new Map(), m = () => {
    for (const u of n) {
      const y = u.id.client, A = t.get(y);
      A ? (A.i--, o.clients.set(y, A.refs.slice(A.i)), t.delete(y), A.i = 0, A.refs = []) : o.clients.set(y, [u]), s = s.filter((w) => w !== y);
    }
    n.length = 0;
  };
  for (; ; ) {
    if (p.constructor !== ft) {
      const y = jt(b, p.id.client, () => Ge(e, p.id.client)) - p.id.clock;
      if (y < 0)
        n.push(p), h(p.id.client, p.id.clock - 1), m();
      else {
        const A = p.getMissing(r, e);
        if (A !== null) {
          n.push(p);
          const w = t.get(
            /** @type {number} */
            A
          ) || { refs: [], i: 0 };
          if (w.refs.length === w.i)
            h(
              /** @type {number} */
              A,
              Ge(e, A)
            ), m();
          else {
            p = w.refs[w.i++];
            continue;
          }
        } else (y === 0 || y < p.length) && (p.integrate(r, y), b.set(p.id.client, p.id.clock + p.length));
      }
    }
    if (n.length > 0)
      p = /** @type {GC|Item} */
      n.pop();
    else if (a !== null && a.i < a.refs.length)
      p = /** @type {GC|Item} */
      a.refs[a.i++];
    else {
      if (a = i(), a === null)
        break;
      p = /** @type {GC|Item} */
      a.refs[a.i++];
    }
  }
  if (o.clients.size > 0) {
    const u = new Zt();
    return Li(u, o, /* @__PURE__ */ new Map()), Se(u.restEncoder, 0), { missing: l, update: u.toUint8Array() };
  }
  return null;
}, $g = (r, e) => Li(r, e.doc.store, e.beforeState), Hg = (r, e, t, n = new Ar(r)) => ze(e, (s) => {
  s.local = !1;
  let i = !1;
  const a = s.doc, o = a.store, l = Ug(n, a), h = Og(s, o, l), p = o.pendingStructs;
  if (p) {
    for (const [m, u] of p.missing)
      if (u < Ge(o, m)) {
        i = !0;
        break;
      }
    if (h) {
      for (const [m, u] of h.missing) {
        const y = p.missing.get(m);
        (y == null || y > u) && p.missing.set(m, u);
      }
      p.update = Gn([p.update, h.update]);
    }
  } else
    o.pendingStructs = h;
  const b = ho(n, s, o);
  if (o.pendingDs) {
    const m = new Ar(vr(o.pendingDs));
    ve(m.restDecoder);
    const u = ho(m, s, o);
    b && u ? o.pendingDs = Gn([b, u]) : o.pendingDs = b || u;
  } else
    o.pendingDs = b;
  if (i) {
    const m = (
      /** @type {{update: Uint8Array}} */
      o.pendingStructs.update
    );
    o.pendingStructs = null, $l(s.doc, m);
  }
}, t, !1), $l = (r, e, t, n = Ar) => {
  const s = vr(e);
  Hg(s, r, t, new n(s));
}, jg = (r, e, t) => $l(r, e, t, Ol), qg = (r, e, t = /* @__PURE__ */ new Map()) => {
  Li(r, e.store, t), Ir(r, Pg(e.store));
}, Gg = (r, e = new Uint8Array([0]), t = new Zt()) => {
  const n = Hl(e);
  qg(t, r, n);
  const s = [t.toUint8Array()];
  if (r.store.pendingDs && s.push(r.store.pendingDs), r.store.pendingStructs && s.push(ip(r.store.pendingStructs.update, e)), s.length > 1) {
    if (t.constructor === en)
      return np(s.map((i, a) => a === 0 ? i : op(i)));
    if (t.constructor === Zt)
      return Gn(s);
  }
  return s[0];
}, Jg = (r, e) => Gg(r, e, new en()), Vg = (r) => {
  const e = /* @__PURE__ */ new Map(), t = ve(r.restDecoder);
  for (let n = 0; n < t; n++) {
    const s = ve(r.restDecoder), i = ve(r.restDecoder);
    e.set(s, i);
  }
  return e;
}, Hl = (r) => Vg(new Ul(vr(r)));
class Wg {
  constructor() {
    this.l = [];
  }
}
const uo = () => new Wg(), fo = (r, e) => r.l.push(e), go = (r, e) => {
  const t = r.l, n = t.length;
  r.l = t.filter((s) => e !== s), n === r.l.length && console.error("[yjs] Tried to remove event handler that doesn't exist.");
}, jl = (r, e, t) => xi(r.l, [e, t]);
class fr {
  /**
   * @param {number} client client id
   * @param {number} clock unique per client id, continuous number
   */
  constructor(e, t) {
    this.client = e, this.clock = t;
  }
}
const kn = (r, e) => r === e || r !== null && e !== null && r.client === e.client && r.clock === e.clock, Ee = (r, e) => new fr(r, e), Xg = (r) => {
  for (const [e, t] of r.doc.share.entries())
    if (t === r)
      return e;
  throw gt();
}, cr = (r, e) => e === void 0 ? !r.deleted : e.sv.has(r.id.client) && (e.sv.get(r.id.client) || 0) > r.id.clock && !Tl(e.ds, r.id), mi = (r, e) => {
  const t = jt(r.meta, mi, pr), n = r.doc.store;
  t.has(e) || (e.sv.forEach((s, i) => {
    s < Ge(n, i) && Ht(r, Ee(i, s));
  }), Ql(r, e.ds, (s) => {
  }), t.add(e));
};
class ql {
  constructor() {
    this.clients = /* @__PURE__ */ new Map(), this.pendingStructs = null, this.pendingDs = null;
  }
}
const Ui = (r) => {
  const e = /* @__PURE__ */ new Map();
  return r.clients.forEach((t, n) => {
    const s = t[t.length - 1];
    e.set(n, s.id.clock + s.length);
  }), e;
}, Ge = (r, e) => {
  const t = r.clients.get(e);
  if (t === void 0)
    return 0;
  const n = t[t.length - 1];
  return n.id.clock + n.length;
}, Gl = (r, e) => {
  let t = r.clients.get(e.id.client);
  if (t === void 0)
    t = [], r.clients.set(e.id.client, t);
  else {
    const n = t[t.length - 1];
    if (n.id.clock + n.length !== e.id.clock)
      throw gt();
  }
  t.push(e);
}, Ct = (r, e) => {
  let t = 0, n = r.length - 1, s = r[n], i = s.id.clock;
  if (i === e)
    return n;
  let a = _t(e / (i + s.length - 1) * n);
  for (; t <= n; ) {
    if (s = r[a], i = s.id.clock, i <= e) {
      if (e < i + s.length)
        return a;
      t = a + 1;
    } else
      n = a - 1;
    a = _t((t + n) / 2);
  }
  throw gt();
}, Zg = (r, e) => {
  const t = r.clients.get(e.client);
  return t[Ct(t, e.clock)];
}, ei = (
  /** @type {function(StructStore,ID):Item} */
  Zg
), bi = (r, e, t) => {
  const n = Ct(e, t), s = e[n];
  return s.id.clock < t && s instanceof He ? (e.splice(n + 1, 0, Kn(r, s, t - s.id.clock)), n + 1) : n;
}, Ht = (r, e) => {
  const t = (
    /** @type {Array<Item>} */
    r.doc.store.clients.get(e.client)
  );
  return t[bi(r, t, e.clock)];
}, po = (r, e, t) => {
  const n = e.clients.get(t.client), s = Ct(n, t.clock), i = n[s];
  return t.clock !== i.id.clock + i.length - 1 && i.constructor !== ut && n.splice(s + 1, 0, Kn(r, i, t.clock - i.id.clock + 1)), i;
}, Kg = (r, e, t) => {
  const n = (
    /** @type {Array<GC|Item>} */
    r.clients.get(e.id.client)
  );
  n[Ct(n, e.id.clock)] = t;
}, Jl = (r, e, t, n, s) => {
  if (n === 0)
    return;
  const i = t + n;
  let a = bi(r, e, t), o;
  do
    o = e[a++], i < o.id.clock + o.length && bi(r, e, i), s(o);
  while (a < e.length && e[a].id.clock < i);
};
class Yg {
  /**
   * @param {Doc} doc
   * @param {any} origin
   * @param {boolean} local
   */
  constructor(e, t, n) {
    this.doc = e, this.deleteSet = new Yr(), this.beforeState = Ui(e.store), this.afterState = /* @__PURE__ */ new Map(), this.changed = /* @__PURE__ */ new Map(), this.changedParentTypes = /* @__PURE__ */ new Map(), this._mergeStructs = [], this.origin = t, this.meta = /* @__PURE__ */ new Map(), this.local = n, this.subdocsAdded = /* @__PURE__ */ new Set(), this.subdocsRemoved = /* @__PURE__ */ new Set(), this.subdocsLoaded = /* @__PURE__ */ new Set(), this._needFormattingCleanup = !1;
  }
}
const mo = (r, e) => e.deleteSet.clients.size === 0 && !Fu(e.afterState, (t, n) => e.beforeState.get(n) !== t) ? !1 : (Qi(e.deleteSet), $g(r, e), Ir(r, e.deleteSet), !0), bo = (r, e, t) => {
  const n = e._item;
  (n === null || n.id.clock < (r.beforeState.get(n.id.client) || 0) && !n.deleted) && jt(r.changed, e, pr).add(t);
}, zn = (r, e) => {
  let t = r[e], n = r[e - 1], s = e;
  for (; s > 0; t = n, n = r[--s - 1]) {
    if (n.deleted === t.deleted && n.constructor === t.constructor && n.mergeWith(t)) {
      t instanceof He && t.parentSub !== null && /** @type {AbstractType<any>} */
      t.parent._map.get(t.parentSub) === t && t.parent._map.set(
        t.parentSub,
        /** @type {Item} */
        n
      );
      continue;
    }
    break;
  }
  const i = e - s;
  return i && r.splice(e + 1 - i, i), i;
}, ep = (r, e, t) => {
  for (const [n, s] of r.clients.entries()) {
    const i = (
      /** @type {Array<GC|Item>} */
      e.clients.get(n)
    );
    for (let a = s.length - 1; a >= 0; a--) {
      const o = s[a], l = o.clock + o.len;
      for (let h = Ct(i, o.clock), p = i[h]; h < i.length && p.id.clock < l; p = i[++h]) {
        const b = i[h];
        if (o.clock + o.len <= b.id.clock)
          break;
        b instanceof He && b.deleted && !b.keep && t(b) && b.gc(e, !1);
      }
    }
  }
}, tp = (r, e) => {
  r.clients.forEach((t, n) => {
    const s = (
      /** @type {Array<GC|Item>} */
      e.clients.get(n)
    );
    for (let i = t.length - 1; i >= 0; i--) {
      const a = t[i], o = ol(s.length - 1, 1 + Ct(s, a.clock + a.len - 1));
      for (let l = o, h = s[l]; l > 0 && h.id.clock >= a.clock; h = s[l])
        l -= 1 + zn(s, l);
    }
  });
}, Vl = (r, e) => {
  if (e < r.length) {
    const t = r[e], n = t.doc, s = n.store, i = t.deleteSet, a = t._mergeStructs;
    try {
      Qi(i), t.afterState = Ui(t.doc.store), n.emit("beforeObserverCalls", [t, n]);
      const o = [];
      t.changed.forEach(
        (l, h) => o.push(() => {
          (h._item === null || !h._item.deleted) && h._callObserver(t, l);
        })
      ), o.push(() => {
        t.changedParentTypes.forEach((l, h) => {
          h._dEH.l.length > 0 && (h._item === null || !h._item.deleted) && o.push(() => {
            l = l.filter(
              (p) => p.target._item === null || !p.target._item.deleted
            ), l.forEach((p) => {
              p.currentTarget = h, p._path = null;
            }), l.sort((p, b) => p.path.length - b.path.length), jl(h._dEH, l, t);
          });
        }), o.push(() => n.emit("afterTransaction", [t, n])), o.push(() => {
          t._needFormattingCleanup && kp(t);
        });
      }), xi(o, []);
    } finally {
      n.gc && ep(i, s, n.gcFilter), tp(i, s), t.afterState.forEach((p, b) => {
        const m = t.beforeState.get(b) || 0;
        if (m !== p) {
          const u = (
            /** @type {Array<GC|Item>} */
            s.clients.get(b)
          ), y = rr(Ct(u, m), 1);
          for (let A = u.length - 1; A >= y; )
            A -= 1 + zn(u, A);
        }
      });
      for (let p = a.length - 1; p >= 0; p--) {
        const { client: b, clock: m } = a[p].id, u = (
          /** @type {Array<GC|Item>} */
          s.clients.get(b)
        ), y = Ct(u, m);
        y + 1 < u.length && zn(u, y + 1) > 1 || y > 0 && zn(u, y);
      }
      if (!t.local && t.afterState.get(n.clientID) !== t.beforeState.get(n.clientID) && (Bg(Fi, Dl, "[yjs] ", Ml, Rl, "Changed the client-id because another client seems to be using it."), n.clientID = Ll()), n.emit("afterTransactionCleanup", [t, n]), n._observers.has("update")) {
        const p = new en();
        mo(p, t) && n.emit("update", [p.toUint8Array(), t.origin, n, t]);
      }
      if (n._observers.has("updateV2")) {
        const p = new Zt();
        mo(p, t) && n.emit("updateV2", [p.toUint8Array(), t.origin, n, t]);
      }
      const { subdocsAdded: o, subdocsLoaded: l, subdocsRemoved: h } = t;
      (o.size > 0 || h.size > 0 || l.size > 0) && (o.forEach((p) => {
        p.clientID = n.clientID, p.collectionid == null && (p.collectionid = n.collectionid), n.subdocs.add(p);
      }), h.forEach((p) => n.subdocs.delete(p)), n.emit("subdocs", [{ loaded: l, added: o, removed: h }, n, t]), h.forEach((p) => p.destroy())), r.length <= e + 1 ? (n._transactionCleanups = [], n.emit("afterAllTransactions", [n, r])) : Vl(r, e + 1);
    }
  }
}, ze = (r, e, t = null, n = !0) => {
  const s = r._transactionCleanups;
  let i = !1, a = null;
  r._transaction === null && (i = !0, r._transaction = new Yg(r, t, n), s.push(r._transaction), s.length === 1 && r.emit("beforeAllTransactions", [r]), r.emit("beforeTransaction", [r._transaction, r]));
  try {
    a = e(r._transaction);
  } finally {
    if (i) {
      const o = r._transaction === s[0];
      r._transaction = null, o && Vl(s, 0);
    }
  }
  return a;
};
function* rp(r) {
  const e = ve(r.restDecoder);
  for (let t = 0; t < e; t++) {
    const n = ve(r.restDecoder), s = r.readClient();
    let i = ve(r.restDecoder);
    for (let a = 0; a < n; a++) {
      const o = r.readInfo();
      if (o === 10) {
        const l = ve(r.restDecoder);
        yield new ft(Ee(s, i), l), i += l;
      } else if ((ns & o) !== 0) {
        const l = (o & (xt | dt)) === 0, h = new He(
          Ee(s, i),
          null,
          // left
          (o & dt) === dt ? r.readLeftID() : null,
          // origin
          null,
          // right
          (o & xt) === xt ? r.readRightID() : null,
          // right origin
          // @ts-ignore Force writing a string here.
          l ? r.readParentInfo() ? r.readString() : r.readLeftID() : null,
          // parent
          l && (o & Lr) === Lr ? r.readString() : null,
          // parentSub
          uc(r, o)
          // item content
        );
        yield h, i += h.length;
      } else {
        const l = r.readLen();
        yield new ut(Ee(s, i), l), i += l;
      }
    }
  }
}
class Oi {
  /**
   * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
   * @param {boolean} filterSkips
   */
  constructor(e, t) {
    this.gen = rp(e), this.curr = null, this.done = !1, this.filterSkips = t, this.next();
  }
  /**
   * @return {Item | GC | Skip |null}
   */
  next() {
    do
      this.curr = this.gen.next().value || null;
    while (this.filterSkips && this.curr !== null && this.curr.constructor === ft);
    return this.curr;
  }
}
class $i {
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  constructor(e) {
    this.currClient = 0, this.startClock = 0, this.written = 0, this.encoder = e, this.clientStructs = [];
  }
}
const np = (r) => Gn(r, Ol, en), sp = (r, e) => {
  if (r.constructor === ut) {
    const { client: t, clock: n } = r.id;
    return new ut(Ee(t, n + e), r.length - e);
  } else if (r.constructor === ft) {
    const { client: t, clock: n } = r.id;
    return new ft(Ee(t, n + e), r.length - e);
  } else {
    const t = (
      /** @type {Item} */
      r
    ), { client: n, clock: s } = t.id;
    return new He(
      Ee(n, s + e),
      null,
      Ee(n, s + e - 1),
      null,
      t.rightOrigin,
      t.parent,
      t.parentSub,
      t.content.splice(e)
    );
  }
}, Gn = (r, e = Ar, t = Zt) => {
  if (r.length === 1)
    return r[0];
  const n = r.map((p) => new e(vr(p)));
  let s = n.map((p) => new Oi(p, !0)), i = null;
  const a = new t(), o = new $i(a);
  for (; s = s.filter((m) => m.curr !== null), s.sort(
    /** @type {function(any,any):number} */
    (m, u) => {
      if (m.curr.id.client === u.curr.id.client) {
        const y = m.curr.id.clock - u.curr.id.clock;
        return y === 0 ? m.curr.constructor === u.curr.constructor ? 0 : m.curr.constructor === ft ? 1 : -1 : y;
      } else
        return u.curr.id.client - m.curr.id.client;
    }
  ), s.length !== 0; ) {
    const p = s[0], b = (
      /** @type {Item | GC} */
      p.curr.id.client
    );
    if (i !== null) {
      let m = (
        /** @type {Item | GC | null} */
        p.curr
      ), u = !1;
      for (; m !== null && m.id.clock + m.length <= i.struct.id.clock + i.struct.length && m.id.client >= i.struct.id.client; )
        m = p.next(), u = !0;
      if (m === null || // current decoder is empty
      m.id.client !== b || // check whether there is another decoder that has has updates from `firstClient`
      u && m.id.clock > i.struct.id.clock + i.struct.length)
        continue;
      if (b !== i.struct.id.client)
        Ut(o, i.struct, i.offset), i = { struct: m, offset: 0 }, p.next();
      else if (i.struct.id.clock + i.struct.length < m.id.clock)
        if (i.struct.constructor === ft)
          i.struct.length = m.id.clock + m.length - i.struct.id.clock;
        else {
          Ut(o, i.struct, i.offset);
          const y = m.id.clock - i.struct.id.clock - i.struct.length;
          i = { struct: new ft(Ee(b, i.struct.id.clock + i.struct.length), y), offset: 0 };
        }
      else {
        const y = i.struct.id.clock + i.struct.length - m.id.clock;
        y > 0 && (i.struct.constructor === ft ? i.struct.length -= y : m = sp(m, y)), i.struct.mergeWith(
          /** @type {any} */
          m
        ) || (Ut(o, i.struct, i.offset), i = { struct: m, offset: 0 }, p.next());
      }
    } else
      i = { struct: (
        /** @type {Item | GC} */
        p.curr
      ), offset: 0 }, p.next();
    for (let m = p.curr; m !== null && m.id.client === b && m.id.clock === i.struct.id.clock + i.struct.length && m.constructor !== ft; m = p.next())
      Ut(o, i.struct, i.offset), i = { struct: m, offset: 0 };
  }
  i !== null && (Ut(o, i.struct, i.offset), i = null), Hi(o);
  const l = n.map((p) => Ti(p)), h = Rg(l);
  return Ir(a, h), a.toUint8Array();
}, ip = (r, e, t = Ar, n = Zt) => {
  const s = Hl(e), i = new n(), a = new $i(i), o = new t(vr(r)), l = new Oi(o, !1);
  for (; l.curr; ) {
    const p = l.curr, b = p.id.client, m = s.get(b) || 0;
    if (l.curr.constructor === ft) {
      l.next();
      continue;
    }
    if (p.id.clock + p.length > m)
      for (Ut(a, p, rr(m - p.id.clock, 0)), l.next(); l.curr && l.curr.id.client === b; )
        Ut(a, l.curr, 0), l.next();
    else
      for (; l.curr && l.curr.id.client === b && l.curr.id.clock + l.curr.length <= m; )
        l.next();
  }
  Hi(a);
  const h = Ti(o);
  return Ir(i, h), i.toUint8Array();
}, Wl = (r) => {
  r.written > 0 && (r.clientStructs.push({ written: r.written, restEncoder: vt(r.encoder.restEncoder) }), r.encoder.restEncoder = ss(), r.written = 0);
}, Ut = (r, e, t) => {
  r.written > 0 && r.currClient !== e.id.client && Wl(r), r.written === 0 && (r.currClient = e.id.client, r.encoder.writeClient(e.id.client), Se(r.encoder.restEncoder, e.id.clock + t)), e.write(r.encoder, t), r.written++;
}, Hi = (r) => {
  Wl(r);
  const e = r.encoder.restEncoder;
  Se(e, r.clientStructs.length);
  for (let t = 0; t < r.clientStructs.length; t++) {
    const n = r.clientStructs[t];
    Se(e, n.written), is(e, n.restEncoder);
  }
}, ap = (r, e, t, n) => {
  const s = new t(vr(r)), i = new Oi(s, !1), a = new n(), o = new $i(a);
  for (let h = i.curr; h !== null; h = i.next())
    Ut(o, e(h), 0);
  Hi(o);
  const l = Ti(s);
  return Ir(a, l), a.toUint8Array();
}, op = (r) => ap(r, Mf, Ar, en), Ao = "You must not compute changes after the event-handler fired.";
class ps {
  /**
   * @param {T} target The changed type.
   * @param {Transaction} transaction
   */
  constructor(e, t) {
    this.target = e, this.currentTarget = e, this.transaction = t, this._changes = null, this._keys = null, this._delta = null, this._path = null;
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
    return this._path || (this._path = lp(this.currentTarget, this.target));
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
    return Tl(this.transaction.deleteSet, e.id);
  }
  /**
   * @type {Map<string, { action: 'add' | 'update' | 'delete', oldValue: any }>}
   */
  get keys() {
    if (this._keys === null) {
      if (this.transaction.doc._transactionCleanups.length === 0)
        throw It(Ao);
      const e = /* @__PURE__ */ new Map(), t = this.target;
      /** @type Set<string|null> */
      this.transaction.changed.get(t).forEach((s) => {
        if (s !== null) {
          const i = (
            /** @type {Item} */
            t._map.get(s)
          );
          let a, o;
          if (this.adds(i)) {
            let l = i.left;
            for (; l !== null && this.adds(l); )
              l = l.left;
            if (this.deletes(i))
              if (l !== null && this.deletes(l))
                a = "delete", o = Gs(l.content.getContent());
              else
                return;
            else
              l !== null && this.deletes(l) ? (a = "update", o = Gs(l.content.getContent())) : (a = "add", o = void 0);
          } else if (this.deletes(i))
            a = "delete", o = Gs(
              /** @type {Item} */
              i.content.getContent()
            );
          else
            return;
          e.set(s, { action: a, oldValue: o });
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
        throw It(Ao);
      const t = this.target, n = pr(), s = pr(), i = [];
      if (e = {
        added: n,
        deleted: s,
        delta: i,
        keys: this.keys
      }, /** @type Set<string|null> */
      this.transaction.changed.get(t).has(null)) {
        let o = null;
        const l = () => {
          o && i.push(o);
        };
        for (let h = t._start; h !== null; h = h.right)
          h.deleted ? this.deletes(h) && !this.adds(h) && ((o === null || o.delete === void 0) && (l(), o = { delete: 0 }), o.delete += h.length, s.add(h)) : this.adds(h) ? ((o === null || o.insert === void 0) && (l(), o = { insert: [] }), o.insert = o.insert.concat(h.content.getContent()), n.add(h)) : ((o === null || o.retain === void 0) && (l(), o = { retain: 0 }), o.retain += h.length);
        o !== null && o.retain === void 0 && l();
      }
      this._changes = e;
    }
    return (
      /** @type {any} */
      e
    );
  }
}
const lp = (r, e) => {
  const t = [];
  for (; e._item !== null && e !== r; ) {
    if (e._item.parentSub !== null)
      t.unshift(e._item.parentSub);
    else {
      let n = 0, s = (
        /** @type {AbstractType<any>} */
        e._item.parent._start
      );
      for (; s !== e._item && s !== null; )
        !s.deleted && s.countable && (n += s.length), s = s.right;
      t.unshift(n);
    }
    e = /** @type {AbstractType<any>} */
    e._item.parent;
  }
  return t;
}, tt = () => {
  xg("Invalid access: Add Yjs type to a document before reading data.");
}, Xl = 80;
let ji = 0;
class cp {
  /**
   * @param {Item} p
   * @param {number} index
   */
  constructor(e, t) {
    e.marker = !0, this.p = e, this.index = t, this.timestamp = ji++;
  }
}
const dp = (r) => {
  r.timestamp = ji++;
}, Zl = (r, e, t) => {
  r.p.marker = !1, r.p = e, e.marker = !0, r.index = t, r.timestamp = ji++;
}, hp = (r, e, t) => {
  if (r.length >= Xl) {
    const n = r.reduce((s, i) => s.timestamp < i.timestamp ? s : i);
    return Zl(n, e, t), n;
  } else {
    const n = new cp(e, t);
    return r.push(n), n;
  }
}, ms = (r, e) => {
  if (r._start === null || e === 0 || r._searchMarker === null)
    return null;
  const t = r._searchMarker.length === 0 ? null : r._searchMarker.reduce((i, a) => xn(e - i.index) < xn(e - a.index) ? i : a);
  let n = r._start, s = 0;
  for (t !== null && (n = t.p, s = t.index, dp(t)); n.right !== null && s < e; ) {
    if (!n.deleted && n.countable) {
      if (e < s + n.length)
        break;
      s += n.length;
    }
    n = n.right;
  }
  for (; n.left !== null && s > e; )
    n = n.left, !n.deleted && n.countable && (s -= n.length);
  for (; n.left !== null && n.left.id.client === n.id.client && n.left.id.clock + n.left.length === n.id.clock; )
    n = n.left, !n.deleted && n.countable && (s -= n.length);
  return t !== null && xn(t.index - s) < /** @type {YText|YArray<any>} */
  n.parent.length / Xl ? (Zl(t, n, s), t) : hp(r._searchMarker, n, s);
}, Gr = (r, e, t) => {
  for (let n = r.length - 1; n >= 0; n--) {
    const s = r[n];
    if (t > 0) {
      let i = s.p;
      for (i.marker = !1; i && (i.deleted || !i.countable); )
        i = i.left, i && !i.deleted && i.countable && (s.index -= i.length);
      if (i === null || i.marker === !0) {
        r.splice(n, 1);
        continue;
      }
      s.p = i, i.marker = !0;
    }
    (e < s.index || t > 0 && e === s.index) && (s.index = rr(e, s.index + t));
  }
}, bs = (r, e, t) => {
  const n = r, s = e.changedParentTypes;
  for (; jt(s, r, () => []).push(t), r._item !== null; )
    r = /** @type {AbstractType<any>} */
    r._item.parent;
  jl(n._eH, t, e);
};
class Xe {
  constructor() {
    this._item = null, this._map = /* @__PURE__ */ new Map(), this._start = null, this.doc = null, this._length = 0, this._eH = uo(), this._dEH = uo(), this._searchMarker = null;
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
  _integrate(e, t) {
    this.doc = e, this._item = t;
  }
  /**
   * @return {AbstractType<EventType>}
   */
  _copy() {
    throw wt();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {AbstractType<EventType>}
   */
  clone() {
    throw wt();
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
  _callObserver(e, t) {
    !e.local && this._searchMarker && (this._searchMarker.length = 0);
  }
  /**
   * Observe all events that are created on this type.
   *
   * @param {function(EventType, Transaction):void} f Observer function
   */
  observe(e) {
    fo(this._eH, e);
  }
  /**
   * Observe all events that are created by this type and its children.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  observeDeep(e) {
    fo(this._dEH, e);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(EventType,Transaction):void} f Observer function
   */
  unobserve(e) {
    go(this._eH, e);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  unobserveDeep(e) {
    go(this._dEH, e);
  }
  /**
   * @abstract
   * @return {any}
   */
  toJSON() {
  }
}
const Kl = (r, e, t) => {
  r.doc ?? tt(), e < 0 && (e = r._length + e), t < 0 && (t = r._length + t);
  let n = t - e;
  const s = [];
  let i = r._start;
  for (; i !== null && n > 0; ) {
    if (i.countable && !i.deleted) {
      const a = i.content.getContent();
      if (a.length <= e)
        e -= a.length;
      else {
        for (let o = e; o < a.length && n > 0; o++)
          s.push(a[o]), n--;
        e = 0;
      }
    }
    i = i.right;
  }
  return s;
}, Yl = (r) => {
  r.doc ?? tt();
  const e = [];
  let t = r._start;
  for (; t !== null; ) {
    if (t.countable && !t.deleted) {
      const n = t.content.getContent();
      for (let s = 0; s < n.length; s++)
        e.push(n[s]);
    }
    t = t.right;
  }
  return e;
}, Jr = (r, e) => {
  let t = 0, n = r._start;
  for (r.doc ?? tt(); n !== null; ) {
    if (n.countable && !n.deleted) {
      const s = n.content.getContent();
      for (let i = 0; i < s.length; i++)
        e(s[i], t++, r);
    }
    n = n.right;
  }
}, ec = (r, e) => {
  const t = [];
  return Jr(r, (n, s) => {
    t.push(e(n, s, r));
  }), t;
}, up = (r) => {
  let e = r._start, t = null, n = 0;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next: () => {
      if (t === null) {
        for (; e !== null && e.deleted; )
          e = e.right;
        if (e === null)
          return {
            done: !0,
            value: void 0
          };
        t = e.content.getContent(), n = 0, e = e.right;
      }
      const s = t[n++];
      return t.length <= n && (t = null), {
        done: !1,
        value: s
      };
    }
  };
}, tc = (r, e) => {
  r.doc ?? tt();
  const t = ms(r, e);
  let n = r._start;
  for (t !== null && (n = t.p, e -= t.index); n !== null; n = n.right)
    if (!n.deleted && n.countable) {
      if (e < n.length)
        return n.content.getContent()[e];
      e -= n.length;
    }
}, Jn = (r, e, t, n) => {
  let s = t;
  const i = r.doc, a = i.clientID, o = i.store, l = t === null ? e._start : t.right;
  let h = [];
  const p = () => {
    h.length > 0 && (s = new He(Ee(a, Ge(o, a)), s, s && s.lastId, l, l && l.id, e, null, new Yt(h)), s.integrate(r, 0), h = []);
  };
  n.forEach((b) => {
    if (b === null)
      h.push(b);
    else
      switch (b.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
          h.push(b);
          break;
        default:
          switch (p(), b.constructor) {
            case Uint8Array:
            case ArrayBuffer:
              s = new He(Ee(a, Ge(o, a)), s, s && s.lastId, l, l && l.id, e, null, new tn(new Uint8Array(
                /** @type {Uint8Array} */
                b
              ))), s.integrate(r, 0);
              break;
            case Cr:
              s = new He(Ee(a, Ge(o, a)), s, s && s.lastId, l, l && l.id, e, null, new rn(
                /** @type {Doc} */
                b
              )), s.integrate(r, 0);
              break;
            default:
              if (b instanceof Xe)
                s = new He(Ee(a, Ge(o, a)), s, s && s.lastId, l, l && l.id, e, null, new Rt(b)), s.integrate(r, 0);
              else
                throw new Error("Unexpected content type in insert operation");
          }
      }
  }), p();
}, rc = () => It("Length exceeded!"), nc = (r, e, t, n) => {
  if (t > e._length)
    throw rc();
  if (t === 0)
    return e._searchMarker && Gr(e._searchMarker, t, n.length), Jn(r, e, null, n);
  const s = t, i = ms(e, t);
  let a = e._start;
  for (i !== null && (a = i.p, t -= i.index, t === 0 && (a = a.prev, t += a && a.countable && !a.deleted ? a.length : 0)); a !== null; a = a.right)
    if (!a.deleted && a.countable) {
      if (t <= a.length) {
        t < a.length && Ht(r, Ee(a.id.client, a.id.clock + t));
        break;
      }
      t -= a.length;
    }
  return e._searchMarker && Gr(e._searchMarker, s, n.length), Jn(r, e, a, n);
}, fp = (r, e, t) => {
  let s = (e._searchMarker || []).reduce((i, a) => a.index > i.index ? a : i, { index: 0, p: e._start }).p;
  if (s)
    for (; s.right; )
      s = s.right;
  return Jn(r, e, s, t);
}, sc = (r, e, t, n) => {
  if (n === 0)
    return;
  const s = t, i = n, a = ms(e, t);
  let o = e._start;
  for (a !== null && (o = a.p, t -= a.index); o !== null && t > 0; o = o.right)
    !o.deleted && o.countable && (t < o.length && Ht(r, Ee(o.id.client, o.id.clock + t)), t -= o.length);
  for (; n > 0 && o !== null; )
    o.deleted || (n < o.length && Ht(r, Ee(o.id.client, o.id.clock + n)), o.delete(r), n -= o.length), o = o.right;
  if (n > 0)
    throw rc();
  e._searchMarker && Gr(
    e._searchMarker,
    s,
    -i + n
    /* in case we remove the above exception */
  );
}, Vn = (r, e, t) => {
  const n = e._map.get(t);
  n !== void 0 && n.delete(r);
}, qi = (r, e, t, n) => {
  const s = e._map.get(t) || null, i = r.doc, a = i.clientID;
  let o;
  if (n == null)
    o = new Yt([n]);
  else
    switch (n.constructor) {
      case Number:
      case Object:
      case Boolean:
      case Array:
      case String:
      case Date:
      case BigInt:
        o = new Yt([n]);
        break;
      case Uint8Array:
        o = new tn(
          /** @type {Uint8Array} */
          n
        );
        break;
      case Cr:
        o = new rn(
          /** @type {Doc} */
          n
        );
        break;
      default:
        if (n instanceof Xe)
          o = new Rt(n);
        else
          throw new Error("Unexpected content type");
    }
  new He(Ee(a, Ge(i.store, a)), s, s && s.lastId, null, null, e, t, o).integrate(r, 0);
}, Gi = (r, e) => {
  r.doc ?? tt();
  const t = r._map.get(e);
  return t !== void 0 && !t.deleted ? t.content.getContent()[t.length - 1] : void 0;
}, ic = (r) => {
  const e = {};
  return r.doc ?? tt(), r._map.forEach((t, n) => {
    t.deleted || (e[n] = t.content.getContent()[t.length - 1]);
  }), e;
}, ac = (r, e) => {
  r.doc ?? tt();
  const t = r._map.get(e);
  return t !== void 0 && !t.deleted;
}, gp = (r, e) => {
  const t = {};
  return r._map.forEach((n, s) => {
    let i = n;
    for (; i !== null && (!e.sv.has(i.id.client) || i.id.clock >= (e.sv.get(i.id.client) || 0)); )
      i = i.left;
    i !== null && cr(i, e) && (t[s] = i.content.getContent()[i.length - 1]);
  }), t;
}, vn = (r) => (r.doc ?? tt(), Dg(
  r._map.entries(),
  /** @param {any} entry */
  (e) => !e[1].deleted
));
class pp extends ps {
}
class gr extends Xe {
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
    const t = new gr();
    return t.push(e), t;
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
  _integrate(e, t) {
    super._integrate(e, t), this.insert(
      0,
      /** @type {Array<any>} */
      this._prelimContent
    ), this._prelimContent = null;
  }
  /**
   * @return {YArray<T>}
   */
  _copy() {
    return new gr();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YArray<T>}
   */
  clone() {
    const e = new gr();
    return e.insert(0, this.toArray().map(
      (t) => t instanceof Xe ? (
        /** @type {typeof el} */
        t.clone()
      ) : t
    )), e;
  }
  get length() {
    return this.doc ?? tt(), this._length;
  }
  /**
   * Creates YArrayEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, t) {
    super._callObserver(e, t), bs(this, e, new pp(this, e));
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
  insert(e, t) {
    this.doc !== null ? ze(this.doc, (n) => {
      nc(
        n,
        this,
        e,
        /** @type {any} */
        t
      );
    }) : this._prelimContent.splice(e, 0, ...t);
  }
  /**
   * Appends content to this YArray.
   *
   * @param {Array<T>} content Array of content to append.
   *
   * @todo Use the following implementation in all types.
   */
  push(e) {
    this.doc !== null ? ze(this.doc, (t) => {
      fp(
        t,
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
  delete(e, t = 1) {
    this.doc !== null ? ze(this.doc, (n) => {
      sc(n, this, e, t);
    }) : this._prelimContent.splice(e, t);
  }
  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {T}
   */
  get(e) {
    return tc(this, e);
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<T>}
   */
  toArray() {
    return Yl(this);
  }
  /**
   * Returns a portion of this YArray into a JavaScript Array selected
   * from start to end (end not included).
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<T>}
   */
  slice(e = 0, t = this.length) {
    return Kl(this, e, t);
  }
  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Array<any>}
   */
  toJSON() {
    return this.map((e) => e instanceof Xe ? e.toJSON() : e);
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
    return ec(
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
    Jr(this, e);
  }
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return up(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef(Up);
  }
}
const mp = (r) => new gr();
class bp extends ps {
  /**
   * @param {YMap<T>} ymap The YArray that changed.
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed.
   */
  constructor(e, t, n) {
    super(e, t), this.keysChanged = n;
  }
}
class wr extends Xe {
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
  _integrate(e, t) {
    super._integrate(e, t), this._prelimContent.forEach((n, s) => {
      this.set(s, n);
    }), this._prelimContent = null;
  }
  /**
   * @return {YMap<MapType>}
   */
  _copy() {
    return new wr();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YMap<MapType>}
   */
  clone() {
    const e = new wr();
    return this.forEach((t, n) => {
      e.set(n, t instanceof Xe ? (
        /** @type {typeof value} */
        t.clone()
      ) : t);
    }), e;
  }
  /**
   * Creates YMapEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, t) {
    bs(this, e, new bp(this, e, t));
  }
  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Object<string,any>}
   */
  toJSON() {
    this.doc ?? tt();
    const e = {};
    return this._map.forEach((t, n) => {
      if (!t.deleted) {
        const s = t.content.getContent()[t.length - 1];
        e[n] = s instanceof Xe ? s.toJSON() : s;
      }
    }), e;
  }
  /**
   * Returns the size of the YMap (count of key/value pairs)
   *
   * @return {number}
   */
  get size() {
    return [...vn(this)].length;
  }
  /**
   * Returns the keys for each element in the YMap Type.
   *
   * @return {IterableIterator<string>}
   */
  keys() {
    return Ys(
      vn(this),
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
    return Ys(
      vn(this),
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
    return Ys(
      vn(this),
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
    this.doc ?? tt(), this._map.forEach((t, n) => {
      t.deleted || e(t.content.getContent()[t.length - 1], n, this);
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
    this.doc !== null ? ze(this.doc, (t) => {
      Vn(t, this, e);
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
  set(e, t) {
    return this.doc !== null ? ze(this.doc, (n) => {
      qi(
        n,
        this,
        e,
        /** @type {any} */
        t
      );
    }) : this._prelimContent.set(e, t), t;
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
      Gi(this, e)
    );
  }
  /**
   * Returns a boolean indicating whether the specified key exists or not.
   *
   * @param {string} key The key to test.
   * @return {boolean}
   */
  has(e) {
    return ac(this, e);
  }
  /**
   * Removes all elements from this YMap.
   */
  clear() {
    this.doc !== null ? ze(this.doc, (e) => {
      this.forEach(function(t, n, s) {
        Vn(e, s, n);
      });
    }) : this._prelimContent.clear();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef(Op);
  }
}
const Ap = (r) => new wr(), Ot = (r, e) => r === e || typeof r == "object" && typeof e == "object" && r && e && xf(r, e);
class Ai {
  /**
   * @param {Item|null} left
   * @param {Item|null} right
   * @param {number} index
   * @param {Map<string,any>} currentAttributes
   */
  constructor(e, t, n, s) {
    this.left = e, this.right = t, this.index = n, this.currentAttributes = s;
  }
  /**
   * Only call this if you know that this.right is defined
   */
  forward() {
    this.right === null && gt(), this.right.content.constructor === je ? this.right.deleted || Er(
      this.currentAttributes,
      /** @type {ContentFormat} */
      this.right.content
    ) : this.right.deleted || (this.index += this.right.length), this.left = this.right, this.right = this.right.right;
  }
}
const wo = (r, e, t) => {
  for (; e.right !== null && t > 0; )
    e.right.content.constructor === je ? e.right.deleted || Er(
      e.currentAttributes,
      /** @type {ContentFormat} */
      e.right.content
    ) : e.right.deleted || (t < e.right.length && Ht(r, Ee(e.right.id.client, e.right.id.clock + t)), e.index += e.right.length, t -= e.right.length), e.left = e.right, e.right = e.right.right;
  return e;
}, _n = (r, e, t, n) => {
  const s = /* @__PURE__ */ new Map(), i = n ? ms(e, t) : null;
  if (i) {
    const a = new Ai(i.p.left, i.p, i.index, s);
    return wo(r, a, t - i.index);
  } else {
    const a = new Ai(null, e._start, 0, s);
    return wo(r, a, t);
  }
}, oc = (r, e, t, n) => {
  for (; t.right !== null && (t.right.deleted === !0 || t.right.content.constructor === je && Ot(
    n.get(
      /** @type {ContentFormat} */
      t.right.content.key
    ),
    /** @type {ContentFormat} */
    t.right.content.value
  )); )
    t.right.deleted || n.delete(
      /** @type {ContentFormat} */
      t.right.content.key
    ), t.forward();
  const s = r.doc, i = s.clientID;
  n.forEach((a, o) => {
    const l = t.left, h = t.right, p = new He(Ee(i, Ge(s.store, i)), l, l && l.lastId, h, h && h.id, e, null, new je(o, a));
    p.integrate(r, 0), t.right = p, t.forward();
  });
}, Er = (r, e) => {
  const { key: t, value: n } = e;
  n === null ? r.delete(t) : r.set(t, n);
}, lc = (r, e) => {
  for (; r.right !== null; ) {
    if (!(r.right.deleted || r.right.content.constructor === je && Ot(
      e[
        /** @type {ContentFormat} */
        r.right.content.key
      ] ?? null,
      /** @type {ContentFormat} */
      r.right.content.value
    ))) break;
    r.forward();
  }
}, cc = (r, e, t, n) => {
  const s = r.doc, i = s.clientID, a = /* @__PURE__ */ new Map();
  for (const o in n) {
    const l = n[o], h = t.currentAttributes.get(o) ?? null;
    if (!Ot(h, l)) {
      a.set(o, h);
      const { left: p, right: b } = t;
      t.right = new He(Ee(i, Ge(s.store, i)), p, p && p.lastId, b, b && b.id, e, null, new je(o, l)), t.right.integrate(r, 0), t.forward();
    }
  }
  return a;
}, ti = (r, e, t, n, s) => {
  t.currentAttributes.forEach((m, u) => {
    s[u] === void 0 && (s[u] = null);
  });
  const i = r.doc, a = i.clientID;
  lc(t, s);
  const o = cc(r, e, t, s), l = n.constructor === String ? new Et(
    /** @type {string} */
    n
  ) : n instanceof Xe ? new Rt(n) : new nr(n);
  let { left: h, right: p, index: b } = t;
  e._searchMarker && Gr(e._searchMarker, t.index, l.getLength()), p = new He(Ee(a, Ge(i.store, a)), h, h && h.lastId, p, p && p.id, e, null, l), p.integrate(r, 0), t.right = p, t.index = b, t.forward(), oc(r, e, t, o);
}, yo = (r, e, t, n, s) => {
  const i = r.doc, a = i.clientID;
  lc(t, s);
  const o = cc(r, e, t, s);
  e: for (; t.right !== null && (n > 0 || o.size > 0 && (t.right.deleted || t.right.content.constructor === je)); ) {
    if (!t.right.deleted)
      switch (t.right.content.constructor) {
        case je: {
          const { key: l, value: h } = (
            /** @type {ContentFormat} */
            t.right.content
          ), p = s[l];
          if (p !== void 0) {
            if (Ot(p, h))
              o.delete(l);
            else {
              if (n === 0)
                break e;
              o.set(l, h);
            }
            t.right.delete(r);
          } else
            t.currentAttributes.set(l, h);
          break;
        }
        default:
          n < t.right.length && Ht(r, Ee(t.right.id.client, t.right.id.clock + n)), n -= t.right.length;
          break;
      }
    t.forward();
  }
  if (n > 0) {
    let l = "";
    for (; n > 0; n--)
      l += `
`;
    t.right = new He(Ee(a, Ge(i.store, a)), t.left, t.left && t.left.lastId, t.right, t.right && t.right.id, e, null, new Et(l)), t.right.integrate(r, 0), t.forward();
  }
  oc(r, e, t, o);
}, dc = (r, e, t, n, s) => {
  let i = e;
  const a = At();
  for (; i && (!i.countable || i.deleted); ) {
    if (!i.deleted && i.content.constructor === je) {
      const h = (
        /** @type {ContentFormat} */
        i.content
      );
      a.set(h.key, h);
    }
    i = i.right;
  }
  let o = 0, l = !1;
  for (; e !== i; ) {
    if (t === e && (l = !0), !e.deleted) {
      const h = e.content;
      if (h.constructor === je) {
        const { key: p, value: b } = (
          /** @type {ContentFormat} */
          h
        ), m = n.get(p) ?? null;
        (a.get(p) !== h || m === b) && (e.delete(r), o++, !l && (s.get(p) ?? null) === b && m !== b && (m === null ? s.delete(p) : s.set(p, m))), !l && !e.deleted && Er(
          s,
          /** @type {ContentFormat} */
          h
        );
      }
    }
    e = /** @type {Item} */
    e.right;
  }
  return o;
}, wp = (r, e) => {
  for (; e && e.right && (e.right.deleted || !e.right.countable); )
    e = e.right;
  const t = /* @__PURE__ */ new Set();
  for (; e && (e.deleted || !e.countable); ) {
    if (!e.deleted && e.content.constructor === je) {
      const n = (
        /** @type {ContentFormat} */
        e.content.key
      );
      t.has(n) ? e.delete(r) : t.add(n);
    }
    e = e.left;
  }
}, yp = (r) => {
  let e = 0;
  return ze(
    /** @type {Doc} */
    r.doc,
    (t) => {
      let n = (
        /** @type {Item} */
        r._start
      ), s = r._start, i = At();
      const a = di(i);
      for (; s; )
        s.deleted === !1 && (s.content.constructor === je ? Er(
          a,
          /** @type {ContentFormat} */
          s.content
        ) : (e += dc(t, n, s, i, a), i = di(a), n = s)), s = s.right;
    }
  ), e;
}, kp = (r) => {
  const e = /* @__PURE__ */ new Set(), t = r.doc;
  for (const [n, s] of r.afterState.entries()) {
    const i = r.beforeState.get(n) || 0;
    s !== i && Jl(
      r,
      /** @type {Array<Item|GC>} */
      t.store.clients.get(n),
      i,
      s,
      (a) => {
        !a.deleted && /** @type {Item} */
        a.content.constructor === je && a.constructor !== ut && e.add(
          /** @type {any} */
          a.parent
        );
      }
    );
  }
  ze(t, (n) => {
    Ql(r, r.deleteSet, (s) => {
      if (s instanceof ut || !/** @type {YText} */
      s.parent._hasFormatting || e.has(
        /** @type {YText} */
        s.parent
      ))
        return;
      const i = (
        /** @type {YText} */
        s.parent
      );
      s.content.constructor === je ? e.add(i) : wp(n, s);
    });
    for (const s of e)
      yp(s);
  });
}, ko = (r, e, t) => {
  const n = t, s = di(e.currentAttributes), i = e.right;
  for (; t > 0 && e.right !== null; ) {
    if (e.right.deleted === !1)
      switch (e.right.content.constructor) {
        case Rt:
        case nr:
        case Et:
          t < e.right.length && Ht(r, Ee(e.right.id.client, e.right.id.clock + t)), t -= e.right.length, e.right.delete(r);
          break;
      }
    e.forward();
  }
  i && dc(r, i, e.right, s, e.currentAttributes);
  const a = (
    /** @type {AbstractType<any>} */
    /** @type {Item} */
    (e.left || e.right).parent
  );
  return a._searchMarker && Gr(a._searchMarker, e.index, -n + t), e;
};
class vp extends ps {
  /**
   * @param {YText} ytext
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed
   */
  constructor(e, t, n) {
    super(e, t), this.childListChanged = !1, this.keysChanged = /* @__PURE__ */ new Set(), n.forEach((s) => {
      s === null ? this.childListChanged = !0 : this.keysChanged.add(s);
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
      ), t = [];
      ze(e, (n) => {
        const s = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
        let a = this.target._start, o = null;
        const l = {};
        let h = "", p = 0, b = 0;
        const m = () => {
          if (o !== null) {
            let u = null;
            switch (o) {
              case "delete":
                b > 0 && (u = { delete: b }), b = 0;
                break;
              case "insert":
                (typeof h == "object" || h.length > 0) && (u = { insert: h }, s.size > 0 && (u.attributes = {}, s.forEach((y, A) => {
                  y !== null && (u.attributes[A] = y);
                }))), h = "";
                break;
              case "retain":
                p > 0 && (u = { retain: p }, Bf(l) || (u.attributes = Ef({}, l))), p = 0;
                break;
            }
            u && t.push(u), o = null;
          }
        };
        for (; a !== null; ) {
          switch (a.content.constructor) {
            case Rt:
            case nr:
              this.adds(a) ? this.deletes(a) || (m(), o = "insert", h = a.content.getContent()[0], m()) : this.deletes(a) ? (o !== "delete" && (m(), o = "delete"), b += 1) : a.deleted || (o !== "retain" && (m(), o = "retain"), p += 1);
              break;
            case Et:
              this.adds(a) ? this.deletes(a) || (o !== "insert" && (m(), o = "insert"), h += /** @type {ContentString} */
              a.content.str) : this.deletes(a) ? (o !== "delete" && (m(), o = "delete"), b += a.length) : a.deleted || (o !== "retain" && (m(), o = "retain"), p += a.length);
              break;
            case je: {
              const { key: u, value: y } = (
                /** @type {ContentFormat} */
                a.content
              );
              if (this.adds(a)) {
                if (!this.deletes(a)) {
                  const A = s.get(u) ?? null;
                  Ot(A, y) ? y !== null && a.delete(n) : (o === "retain" && m(), Ot(y, i.get(u) ?? null) ? delete l[u] : l[u] = y);
                }
              } else if (this.deletes(a)) {
                i.set(u, y);
                const A = s.get(u) ?? null;
                Ot(A, y) || (o === "retain" && m(), l[u] = A);
              } else if (!a.deleted) {
                i.set(u, y);
                const A = l[u];
                A !== void 0 && (Ot(A, y) ? A !== null && a.delete(n) : (o === "retain" && m(), y === null ? delete l[u] : l[u] = y));
              }
              a.deleted || (o === "insert" && m(), Er(
                s,
                /** @type {ContentFormat} */
                a.content
              ));
              break;
            }
          }
          a = a.right;
        }
        for (m(); t.length > 0; ) {
          const u = t[t.length - 1];
          if (u.retain !== void 0 && u.attributes === void 0)
            t.pop();
          else
            break;
        }
      }), this._delta = t;
    }
    return (
      /** @type {any} */
      this._delta
    );
  }
}
class yr extends Xe {
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
    return this.doc ?? tt(), this._length;
  }
  /**
   * @param {Doc} y
   * @param {Item} item
   */
  _integrate(e, t) {
    super._integrate(e, t);
    try {
      this._pending.forEach((n) => n());
    } catch (n) {
      console.error(n);
    }
    this._pending = null;
  }
  _copy() {
    return new yr();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YText}
   */
  clone() {
    const e = new yr();
    return e.applyDelta(this.toDelta()), e;
  }
  /**
   * Creates YTextEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, t) {
    super._callObserver(e, t);
    const n = new vp(this, e, t);
    bs(this, e, n), !e.local && this._hasFormatting && (e._needFormattingCleanup = !0);
  }
  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @public
   */
  toString() {
    this.doc ?? tt();
    let e = "", t = this._start;
    for (; t !== null; )
      !t.deleted && t.countable && t.content.constructor === Et && (e += /** @type {ContentString} */
      t.content.str), t = t.right;
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
  applyDelta(e, { sanitize: t = !0 } = {}) {
    this.doc !== null ? ze(this.doc, (n) => {
      const s = new Ai(null, this._start, 0, /* @__PURE__ */ new Map());
      for (let i = 0; i < e.length; i++) {
        const a = e[i];
        if (a.insert !== void 0) {
          const o = !t && typeof a.insert == "string" && i === e.length - 1 && s.right === null && a.insert.slice(-1) === `
` ? a.insert.slice(0, -1) : a.insert;
          (typeof o != "string" || o.length > 0) && ti(n, this, s, o, a.attributes || {});
        } else a.retain !== void 0 ? yo(n, this, s, a.retain, a.attributes || {}) : a.delete !== void 0 && ko(n, s, a.delete);
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
  toDelta(e, t, n) {
    this.doc ?? tt();
    const s = [], i = /* @__PURE__ */ new Map(), a = (
      /** @type {Doc} */
      this.doc
    );
    let o = "", l = this._start;
    function h() {
      if (o.length > 0) {
        const b = {};
        let m = !1;
        i.forEach((y, A) => {
          m = !0, b[A] = y;
        });
        const u = { insert: o };
        m && (u.attributes = b), s.push(u), o = "";
      }
    }
    const p = () => {
      for (; l !== null; ) {
        if (cr(l, e) || t !== void 0 && cr(l, t))
          switch (l.content.constructor) {
            case Et: {
              const b = i.get("ychange");
              e !== void 0 && !cr(l, e) ? (b === void 0 || b.user !== l.id.client || b.type !== "removed") && (h(), i.set("ychange", n ? n("removed", l.id) : { type: "removed" })) : t !== void 0 && !cr(l, t) ? (b === void 0 || b.user !== l.id.client || b.type !== "added") && (h(), i.set("ychange", n ? n("added", l.id) : { type: "added" })) : b !== void 0 && (h(), i.delete("ychange")), o += /** @type {ContentString} */
              l.content.str;
              break;
            }
            case Rt:
            case nr: {
              h();
              const b = {
                insert: l.content.getContent()[0]
              };
              if (i.size > 0) {
                const m = (
                  /** @type {Object<string,any>} */
                  {}
                );
                b.attributes = m, i.forEach((u, y) => {
                  m[y] = u;
                });
              }
              s.push(b);
              break;
            }
            case je:
              cr(l, e) && (h(), Er(
                i,
                /** @type {ContentFormat} */
                l.content
              ));
              break;
          }
        l = l.right;
      }
      h();
    };
    return e || t ? ze(a, (b) => {
      e && mi(b, e), t && mi(b, t), p();
    }, "cleanup") : p(), s;
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
  insert(e, t, n) {
    if (t.length <= 0)
      return;
    const s = this.doc;
    s !== null ? ze(s, (i) => {
      const a = _n(i, this, e, !n);
      n || (n = {}, a.currentAttributes.forEach((o, l) => {
        n[l] = o;
      })), ti(i, this, a, t, n);
    }) : this._pending.push(() => this.insert(e, t, n));
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
  insertEmbed(e, t, n) {
    const s = this.doc;
    s !== null ? ze(s, (i) => {
      const a = _n(i, this, e, !n);
      ti(i, this, a, t, n || {});
    }) : this._pending.push(() => this.insertEmbed(e, t, n || {}));
  }
  /**
   * Deletes text starting from an index.
   *
   * @param {number} index Index at which to start deleting.
   * @param {number} length The number of characters to remove. Defaults to 1.
   *
   * @public
   */
  delete(e, t) {
    if (t === 0)
      return;
    const n = this.doc;
    n !== null ? ze(n, (s) => {
      ko(s, _n(s, this, e, !0), t);
    }) : this._pending.push(() => this.delete(e, t));
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
  format(e, t, n) {
    if (t === 0)
      return;
    const s = this.doc;
    s !== null ? ze(s, (i) => {
      const a = _n(i, this, e, !1);
      a.right !== null && yo(i, this, a, t, n);
    }) : this._pending.push(() => this.format(e, t, n));
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
    this.doc !== null ? ze(this.doc, (t) => {
      Vn(t, this, e);
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
  setAttribute(e, t) {
    this.doc !== null ? ze(this.doc, (n) => {
      qi(n, this, e, t);
    }) : this._pending.push(() => this.setAttribute(e, t));
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
      Gi(this, e)
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
    return ic(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef($p);
  }
}
const _p = (r) => new yr();
class ri {
  /**
   * @param {YXmlFragment | YXmlElement} root
   * @param {function(AbstractType<any>):boolean} [f]
   */
  constructor(e, t = () => !0) {
    this._filter = t, this._root = e, this._currentNode = /** @type {Item} */
    e._start, this._firstCall = !0, e.doc ?? tt();
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
    let e = this._currentNode, t = e && e.content && /** @type {any} */
    e.content.type;
    if (e !== null && (!this._firstCall || e.deleted || !this._filter(t)))
      do
        if (t = /** @type {any} */
        e.content.type, !e.deleted && (t.constructor === kr || t.constructor === Kt) && t._start !== null)
          e = t._start;
        else
          for (; e !== null; ) {
            const n = e.next;
            if (n !== null) {
              e = n;
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
class Kt extends Xe {
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
  _integrate(e, t) {
    super._integrate(e, t), this.insert(
      0,
      /** @type {Array<any>} */
      this._prelimContent
    ), this._prelimContent = null;
  }
  _copy() {
    return new Kt();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlFragment}
   */
  clone() {
    const e = new Kt();
    return e.insert(0, this.toArray().map((t) => t instanceof Xe ? t.clone() : t)), e;
  }
  get length() {
    return this.doc ?? tt(), this._prelimContent === null ? this._length : this._prelimContent.length;
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
    return new ri(this, e);
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
    const n = new ri(this, (s) => s.nodeName && s.nodeName.toUpperCase() === e).next();
    return n.done ? null : n.value;
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
    return e = e.toUpperCase(), Xt(new ri(this, (t) => t.nodeName && t.nodeName.toUpperCase() === e));
  }
  /**
   * Creates YXmlEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, t) {
    bs(this, e, new Ep(this, t, e));
  }
  /**
   * Get the string representation of all the children of this YXmlFragment.
   *
   * @return {string} The string representation of all children.
   */
  toString() {
    return ec(this, (e) => e.toString()).join("");
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
  toDOM(e = document, t = {}, n) {
    const s = e.createDocumentFragment();
    return n !== void 0 && n._createAssociation(s, this), Jr(this, (i) => {
      s.insertBefore(i.toDOM(e, t, n), null);
    }), s;
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
  insert(e, t) {
    this.doc !== null ? ze(this.doc, (n) => {
      nc(n, this, e, t);
    }) : this._prelimContent.splice(e, 0, ...t);
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
  insertAfter(e, t) {
    if (this.doc !== null)
      ze(this.doc, (n) => {
        const s = e && e instanceof Xe ? e._item : e;
        Jn(n, this, s, t);
      });
    else {
      const n = (
        /** @type {Array<any>} */
        this._prelimContent
      ), s = e === null ? 0 : n.findIndex((i) => i === e) + 1;
      if (s === 0 && e !== null)
        throw It("Reference item not found");
      n.splice(s, 0, ...t);
    }
  }
  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} [length=1] The number of elements to remove. Defaults to 1.
   */
  delete(e, t = 1) {
    this.doc !== null ? ze(this.doc, (n) => {
      sc(n, this, e, t);
    }) : this._prelimContent.splice(e, t);
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<YXmlElement|YXmlText|YXmlHook>}
   */
  toArray() {
    return Yl(this);
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
    return tc(this, e);
  }
  /**
   * Returns a portion of this YXmlFragment into a JavaScript Array selected
   * from start to end (end not included).
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<YXmlElement|YXmlText>}
   */
  slice(e = 0, t = this.length) {
    return Kl(this, e, t);
  }
  /**
   * Executes a provided function on once on every child element.
   *
   * @param {function(YXmlElement|YXmlText,number, typeof self):void} f A function to execute on every element of this YArray.
   */
  forEach(e) {
    Jr(this, e);
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
    e.writeTypeRef(jp);
  }
}
const Ip = (r) => new Kt();
class kr extends Kt {
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
  _integrate(e, t) {
    super._integrate(e, t), /** @type {Map<string, any>} */
    this._prelimAttrs.forEach((n, s) => {
      this.setAttribute(s, n);
    }), this._prelimAttrs = null;
  }
  /**
   * Creates an Item with the same effect as this Item (without position effect)
   *
   * @return {YXmlElement}
   */
  _copy() {
    return new kr(this.nodeName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlElement<KV>}
   */
  clone() {
    const e = new kr(this.nodeName), t = this.getAttributes();
    return Nf(t, (n, s) => {
      e.setAttribute(
        s,
        /** @type {any} */
        n
      );
    }), e.insert(0, this.toArray().map((n) => n instanceof Xe ? n.clone() : n)), e;
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
    const e = this.getAttributes(), t = [], n = [];
    for (const o in e)
      n.push(o);
    n.sort();
    const s = n.length;
    for (let o = 0; o < s; o++) {
      const l = n[o];
      t.push(l + '="' + e[l] + '"');
    }
    const i = this.nodeName.toLocaleLowerCase(), a = t.length > 0 ? " " + t.join(" ") : "";
    return `<${i}${a}>${super.toString()}</${i}>`;
  }
  /**
   * Removes an attribute from this YXmlElement.
   *
   * @param {string} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute(e) {
    this.doc !== null ? ze(this.doc, (t) => {
      Vn(t, this, e);
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
  setAttribute(e, t) {
    this.doc !== null ? ze(this.doc, (n) => {
      qi(n, this, e, t);
    }) : this._prelimAttrs.set(e, t);
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
      Gi(this, e)
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
      ac(this, e)
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
      e ? gp(this, e) : ic(this)
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
  toDOM(e = document, t = {}, n) {
    const s = e.createElement(this.nodeName), i = this.getAttributes();
    for (const a in i) {
      const o = i[a];
      typeof o == "string" && s.setAttribute(a, o);
    }
    return Jr(this, (a) => {
      s.appendChild(a.toDOM(e, t, n));
    }), n !== void 0 && n._createAssociation(s, this), s;
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
    e.writeTypeRef(Hp), e.writeKey(this.nodeName);
  }
}
const Cp = (r) => new kr(r.readKey());
class Ep extends ps {
  /**
   * @param {YXmlElement|YXmlText|YXmlFragment} target The target on which the event is created.
   * @param {Set<string|null>} subs The set of changed attributes. `null` is included if the
   *                   child list changed.
   * @param {Transaction} transaction The transaction instance with which the
   *                                  change was created.
   */
  constructor(e, t, n) {
    super(e, n), this.childListChanged = !1, this.attributesChanged = /* @__PURE__ */ new Set(), t.forEach((s) => {
      s === null ? this.childListChanged = !0 : this.attributesChanged.add(s);
    });
  }
}
class Wn extends wr {
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
    return new Wn(this.hookName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlHook}
   */
  clone() {
    const e = new Wn(this.hookName);
    return this.forEach((t, n) => {
      e.set(n, t);
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
  toDOM(e = document, t = {}, n) {
    const s = t[this.hookName];
    let i;
    return s !== void 0 ? i = s.createDom(this) : i = document.createElement(this.hookName), i.setAttribute("data-yjs-hook", this.hookName), n !== void 0 && n._createAssociation(i, this), i;
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
    e.writeTypeRef(qp), e.writeKey(this.hookName);
  }
}
const Sp = (r) => new Wn(r.readKey());
class Xn extends yr {
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
    return new Xn();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlText}
   */
  clone() {
    const e = new Xn();
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
  toDOM(e = document, t, n) {
    const s = e.createTextNode(this.toString());
    return n !== void 0 && n._createAssociation(s, this), s;
  }
  toString() {
    return this.toDelta().map((e) => {
      const t = [];
      for (const s in e.attributes) {
        const i = [];
        for (const a in e.attributes[s])
          i.push({ key: a, value: e.attributes[s][a] });
        i.sort((a, o) => a.key < o.key ? -1 : 1), t.push({ nodeName: s, attrs: i });
      }
      t.sort((s, i) => s.nodeName < i.nodeName ? -1 : 1);
      let n = "";
      for (let s = 0; s < t.length; s++) {
        const i = t[s];
        n += `<${i.nodeName}`;
        for (let a = 0; a < i.attrs.length; a++) {
          const o = i.attrs[a];
          n += ` ${o.key}="${o.value}"`;
        }
        n += ">";
      }
      n += e.insert;
      for (let s = t.length - 1; s >= 0; s--)
        n += `</${t[s].nodeName}>`;
      return n;
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
    e.writeTypeRef(Gp);
  }
}
const Np = (r) => new Xn();
class Ji {
  /**
   * @param {ID} id
   * @param {number} length
   */
  constructor(e, t) {
    this.id = e, this.length = t;
  }
  /**
   * @type {boolean}
   */
  get deleted() {
    throw wt();
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
  write(e, t, n) {
    throw wt();
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(e, t) {
    throw wt();
  }
}
const Bp = 0;
class ut extends Ji {
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
  integrate(e, t) {
    t > 0 && (this.id.clock += t, this.length -= t), Gl(e.doc.store, this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, t) {
    e.writeInfo(Bp), e.writeLen(this.length - t);
  }
  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(e, t) {
    return null;
  }
}
class tn {
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
    return new tn(this.content);
  }
  /**
   * @param {number} offset
   * @return {ContentBinary}
   */
  splice(e) {
    throw wt();
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
  integrate(e, t) {
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
  write(e, t) {
    e.writeBuf(this.content);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 3;
  }
}
const xp = (r) => new tn(r.readBuf());
class Vr {
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
    return new Vr(this.len);
  }
  /**
   * @param {number} offset
   * @return {ContentDeleted}
   */
  splice(e) {
    const t = new Vr(this.len - e);
    return this.len = e, t;
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
  integrate(e, t) {
    qn(e.deleteSet, t.id.client, t.id.clock, this.len), t.markDeleted();
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
  write(e, t) {
    e.writeLen(this.len - t);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 1;
  }
}
const Dp = (r) => new Vr(r.readLen()), hc = (r, e) => new Cr({ guid: r, ...e, shouldLoad: e.shouldLoad || e.autoLoad || !1 });
class rn {
  /**
   * @param {Doc} doc
   */
  constructor(e) {
    e._item && console.error("This document was already integrated as a sub-document. You should create a second instance instead with the same guid."), this.doc = e;
    const t = {};
    this.opts = t, e.gc || (t.gc = !1), e.autoLoad && (t.autoLoad = !0), e.meta !== null && (t.meta = e.meta);
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
    return new rn(hc(this.doc.guid, this.opts));
  }
  /**
   * @param {number} offset
   * @return {ContentDoc}
   */
  splice(e) {
    throw wt();
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
  integrate(e, t) {
    this.doc._item = t, e.subdocsAdded.add(this.doc), this.doc.shouldLoad && e.subdocsLoaded.add(this.doc);
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
  write(e, t) {
    e.writeString(this.doc.guid), e.writeAny(this.opts);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 9;
  }
}
const Mp = (r) => new rn(hc(r.readString(), r.readAny()));
class nr {
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
    return new nr(this.embed);
  }
  /**
   * @param {number} offset
   * @return {ContentEmbed}
   */
  splice(e) {
    throw wt();
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
  integrate(e, t) {
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
  write(e, t) {
    e.writeJSON(this.embed);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 5;
  }
}
const Rp = (r) => new nr(r.readJSON());
class je {
  /**
   * @param {string} key
   * @param {Object} value
   */
  constructor(e, t) {
    this.key = e, this.value = t;
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
    return new je(this.key, this.value);
  }
  /**
   * @param {number} _offset
   * @return {ContentFormat}
   */
  splice(e) {
    throw wt();
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
  integrate(e, t) {
    const n = (
      /** @type {YText} */
      t.parent
    );
    n._searchMarker = null, n._hasFormatting = !0;
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
  write(e, t) {
    e.writeKey(this.key), e.writeJSON(this.value);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 6;
  }
}
const zp = (r) => new je(r.readKey(), r.readJSON());
class Zn {
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
    return new Zn(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentJSON}
   */
  splice(e) {
    const t = new Zn(this.arr.slice(e));
    return this.arr = this.arr.slice(0, e), t;
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
  integrate(e, t) {
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
  write(e, t) {
    const n = this.arr.length;
    e.writeLen(n - t);
    for (let s = t; s < n; s++) {
      const i = this.arr[s];
      e.writeString(i === void 0 ? "undefined" : JSON.stringify(i));
    }
  }
  /**
   * @return {number}
   */
  getRef() {
    return 2;
  }
}
const Pp = (r) => {
  const e = r.readLen(), t = [];
  for (let n = 0; n < e; n++) {
    const s = r.readString();
    s === "undefined" ? t.push(void 0) : t.push(JSON.parse(s));
  }
  return new Zn(t);
}, Fp = $n("node_env") === "development";
class Yt {
  /**
   * @param {Array<any>} arr
   */
  constructor(e) {
    this.arr = e, Fp && fl(e);
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
    return new Yt(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentAny}
   */
  splice(e) {
    const t = new Yt(this.arr.slice(e));
    return this.arr = this.arr.slice(0, e), t;
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
  integrate(e, t) {
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
  write(e, t) {
    const n = this.arr.length;
    e.writeLen(n - t);
    for (let s = t; s < n; s++) {
      const i = this.arr[s];
      e.writeAny(i);
    }
  }
  /**
   * @return {number}
   */
  getRef() {
    return 8;
  }
}
const Qp = (r) => {
  const e = r.readLen(), t = [];
  for (let n = 0; n < e; n++)
    t.push(r.readAny());
  return new Yt(t);
};
class Et {
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
    return new Et(this.str);
  }
  /**
   * @param {number} offset
   * @return {ContentString}
   */
  splice(e) {
    const t = new Et(this.str.slice(e));
    this.str = this.str.slice(0, e);
    const n = this.str.charCodeAt(e - 1);
    return n >= 55296 && n <= 56319 && (this.str = this.str.slice(0, e - 1) + "�", t.str = "�" + t.str.slice(1)), t;
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
  integrate(e, t) {
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
  write(e, t) {
    e.writeString(t === 0 ? this.str : this.str.slice(t));
  }
  /**
   * @return {number}
   */
  getRef() {
    return 4;
  }
}
const Tp = (r) => new Et(r.readString()), Lp = [
  mp,
  Ap,
  _p,
  Cp,
  Ip,
  Sp,
  Np
], Up = 0, Op = 1, $p = 2, Hp = 3, jp = 4, qp = 5, Gp = 6;
class Rt {
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
    return new Rt(this.type._copy());
  }
  /**
   * @param {number} offset
   * @return {ContentType}
   */
  splice(e) {
    throw wt();
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
  integrate(e, t) {
    this.type._integrate(e.doc, t);
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
    let t = this.type._start;
    for (; t !== null; )
      t.deleted ? t.id.clock < (e.beforeState.get(t.id.client) || 0) && e._mergeStructs.push(t) : t.delete(e), t = t.right;
    this.type._map.forEach((n) => {
      n.deleted ? n.id.clock < (e.beforeState.get(n.id.client) || 0) && e._mergeStructs.push(n) : n.delete(e);
    }), e.changed.delete(this.type);
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
    let t = this.type._start;
    for (; t !== null; )
      t.gc(e, !0), t = t.right;
    this.type._start = null, this.type._map.forEach(
      /** @param {Item | null} item */
      (n) => {
        for (; n !== null; )
          n.gc(e, !0), n = n.left;
      }
    ), this.type._map = /* @__PURE__ */ new Map();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, t) {
    this.type._write(e);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 7;
  }
}
const Jp = (r) => new Rt(Lp[r.readTypeRef()](r)), Kn = (r, e, t) => {
  const { client: n, clock: s } = e.id, i = new He(
    Ee(n, s + t),
    e,
    Ee(n, s + t - 1),
    e.right,
    e.rightOrigin,
    e.parent,
    e.parentSub,
    e.content.splice(t)
  );
  return e.deleted && i.markDeleted(), e.keep && (i.keep = !0), e.redone !== null && (i.redone = Ee(e.redone.client, e.redone.clock + t)), e.right = i, i.right !== null && (i.right.left = i), r._mergeStructs.push(i), i.parentSub !== null && i.right === null && i.parent._map.set(i.parentSub, i), e.length = t, i;
};
class He extends Ji {
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
  constructor(e, t, n, s, i, a, o, l) {
    super(e, l.getLength()), this.origin = n, this.left = t, this.right = s, this.rightOrigin = i, this.parent = a, this.parentSub = o, this.redone = null, this.content = l, this.info = this.content.isCountable() ? Ka : 0;
  }
  /**
   * This is used to mark the item as an indexed fast-search marker
   *
   * @type {boolean}
   */
  set marker(e) {
    (this.info & Vs) > 0 !== e && (this.info ^= Vs);
  }
  get marker() {
    return (this.info & Vs) > 0;
  }
  /**
   * If true, do not garbage collect this Item.
   */
  get keep() {
    return (this.info & Za) > 0;
  }
  set keep(e) {
    this.keep !== e && (this.info ^= Za);
  }
  get countable() {
    return (this.info & Ka) > 0;
  }
  /**
   * Whether this item was deleted or not.
   * @type {Boolean}
   */
  get deleted() {
    return (this.info & Js) > 0;
  }
  set deleted(e) {
    this.deleted !== e && (this.info ^= Js);
  }
  markDeleted() {
    this.info |= Js;
  }
  /**
   * Return the creator clientID of the missing op or define missing items and return null.
   *
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(e, t) {
    if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= Ge(t, this.origin.client))
      return this.origin.client;
    if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= Ge(t, this.rightOrigin.client))
      return this.rightOrigin.client;
    if (this.parent && this.parent.constructor === fr && this.id.client !== this.parent.client && this.parent.clock >= Ge(t, this.parent.client))
      return this.parent.client;
    if (this.origin && (this.left = po(e, t, this.origin), this.origin = this.left.lastId), this.rightOrigin && (this.right = Ht(e, this.rightOrigin), this.rightOrigin = this.right.id), this.left && this.left.constructor === ut || this.right && this.right.constructor === ut)
      this.parent = null;
    else if (!this.parent)
      this.left && this.left.constructor === He ? (this.parent = this.left.parent, this.parentSub = this.left.parentSub) : this.right && this.right.constructor === He && (this.parent = this.right.parent, this.parentSub = this.right.parentSub);
    else if (this.parent.constructor === fr) {
      const n = ei(t, this.parent);
      n.constructor === ut ? this.parent = null : this.parent = /** @type {ContentType} */
      n.content.type;
    }
    return null;
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(e, t) {
    if (t > 0 && (this.id.clock += t, this.left = po(e, e.doc.store, Ee(this.id.client, this.id.clock - 1)), this.origin = this.left.lastId, this.content = this.content.splice(t), this.length -= t), this.parent) {
      if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
        let n = this.left, s;
        if (n !== null)
          s = n.right;
        else if (this.parentSub !== null)
          for (s = /** @type {AbstractType<any>} */
          this.parent._map.get(this.parentSub) || null; s !== null && s.left !== null; )
            s = s.left;
        else
          s = /** @type {AbstractType<any>} */
          this.parent._start;
        const i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
        for (; s !== null && s !== this.right; ) {
          if (a.add(s), i.add(s), kn(this.origin, s.origin)) {
            if (s.id.client < this.id.client)
              n = s, i.clear();
            else if (kn(this.rightOrigin, s.rightOrigin))
              break;
          } else if (s.origin !== null && a.has(ei(e.doc.store, s.origin)))
            i.has(ei(e.doc.store, s.origin)) || (n = s, i.clear());
          else
            break;
          s = s.right;
        }
        this.left = n;
      }
      if (this.left !== null) {
        const n = this.left.right;
        this.right = n, this.left.right = this;
      } else {
        let n;
        if (this.parentSub !== null)
          for (n = /** @type {AbstractType<any>} */
          this.parent._map.get(this.parentSub) || null; n !== null && n.left !== null; )
            n = n.left;
        else
          n = /** @type {AbstractType<any>} */
          this.parent._start, this.parent._start = this;
        this.right = n;
      }
      this.right !== null ? this.right.left = this : this.parentSub !== null && (this.parent._map.set(this.parentSub, this), this.left !== null && this.left.delete(e)), this.parentSub === null && this.countable && !this.deleted && (this.parent._length += this.length), Gl(e.doc.store, this), this.content.integrate(e, this), bo(
        e,
        /** @type {AbstractType<any>} */
        this.parent,
        this.parentSub
      ), /** @type {AbstractType<any>} */
      (this.parent._item !== null && /** @type {AbstractType<any>} */
      this.parent._item.deleted || this.parentSub !== null && this.right !== null) && this.delete(e);
    } else
      new ut(this.id, this.length).integrate(e, 0);
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
    return this.length === 1 ? this.id : Ee(this.id.client, this.id.clock + this.length - 1);
  }
  /**
   * Try to merge two items
   *
   * @param {Item} right
   * @return {boolean}
   */
  mergeWith(e) {
    if (this.constructor === e.constructor && kn(e.origin, this.lastId) && this.right === e && kn(this.rightOrigin, e.rightOrigin) && this.id.client === e.id.client && this.id.clock + this.length === e.id.clock && this.deleted === e.deleted && this.redone === null && e.redone === null && this.content.constructor === e.content.constructor && this.content.mergeWith(e.content)) {
      const t = (
        /** @type {AbstractType<any>} */
        this.parent._searchMarker
      );
      return t && t.forEach((n) => {
        n.p === e && (n.p = this, !this.deleted && this.countable && (n.index -= this.length));
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
      const t = (
        /** @type {AbstractType<any>} */
        this.parent
      );
      this.countable && this.parentSub === null && (t._length -= this.length), this.markDeleted(), qn(e.deleteSet, this.id.client, this.id.clock, this.length), bo(e, t, this.parentSub), this.content.delete(e);
    }
  }
  /**
   * @param {StructStore} store
   * @param {boolean} parentGCd
   */
  gc(e, t) {
    if (!this.deleted)
      throw gt();
    this.content.gc(e), t ? Kg(e, this, new ut(this.id, this.length)) : this.content = new Vr(this.length);
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
  write(e, t) {
    const n = t > 0 ? Ee(this.id.client, this.id.clock + t - 1) : this.origin, s = this.rightOrigin, i = this.parentSub, a = this.content.getRef() & ns | (n === null ? 0 : dt) | // origin is defined
    (s === null ? 0 : xt) | // right origin is defined
    (i === null ? 0 : Lr);
    if (e.writeInfo(a), n !== null && e.writeLeftID(n), s !== null && e.writeRightID(s), n === null && s === null) {
      const o = (
        /** @type {AbstractType<any>} */
        this.parent
      );
      if (o._item !== void 0) {
        const l = o._item;
        if (l === null) {
          const h = Xg(o);
          e.writeParentInfo(!0), e.writeString(h);
        } else
          e.writeParentInfo(!1), e.writeLeftID(l.id);
      } else o.constructor === String ? (e.writeParentInfo(!0), e.writeString(o)) : o.constructor === fr ? (e.writeParentInfo(!1), e.writeLeftID(o)) : gt();
      i !== null && e.writeString(i);
    }
    this.content.write(e, t);
  }
}
const uc = (r, e) => Vp[e & ns](r), Vp = [
  () => {
    gt();
  },
  // GC is not ItemContent
  Dp,
  // 1
  Pp,
  // 2
  xp,
  // 3
  Tp,
  // 4
  Rp,
  // 5
  zp,
  // 6
  Jp,
  // 7
  Qp,
  // 8
  Mp,
  // 9
  () => {
    gt();
  }
  // 10 - Skip is not ItemContent
], Wp = 10;
class ft extends Ji {
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
  integrate(e, t) {
    gt();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, t) {
    e.writeInfo(Wp), Se(e.restEncoder, this.length - t);
  }
  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(e, t) {
    return null;
  }
}
const fc = (
  /** @type {any} */
  typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : {}
), gc = "__ $YJS$ __";
fc[gc] === !0 && console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438");
fc[gc] = !0;
function Xp(r) {
  let e = "";
  for (let n = 0; n < r.length; n += 32768)
    e += String.fromCharCode(...r.subarray(n, n + 32768));
  return btoa(e);
}
function Zp(r) {
  const e = atob(r), t = new Uint8Array(e.length);
  for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
  return t;
}
function Kp(r, e) {
  return e ? (jg(r, Zp(e), "knowledge-remote"), !0) : !1;
}
function vo(r) {
  return Xp(Jg(r));
}
async function Yp(r) {
  const e = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(r));
  return [...new Uint8Array(e)].map((t) => t.toString(16).padStart(2, "0")).join("");
}
function em(r) {
  const e = !!(r.client.connectKnowledgeCollaboration && r.client.syncKnowledgeCollaboration && r.client.closeKnowledgeCollaboration && r.client.publishKnowledgeCollaboration), t = ct(() => new Cr(), [r.pageID]), n = ct(() => t.getXmlFragment("knowledge-document"), [t]), [s, i] = T(e ? "connecting" : "unavailable"), [a, o] = T(!1), [l, h] = T(!1), [p, b] = T([]), [m, u] = T([]), [y, A] = T(0), [w, k] = T(0), [_, B] = T(0), [C, S] = T(""), [z, x] = T(0), U = Be(null), Q = Be(null), $ = Be(null), X = Be({ cursor: "", selection: "" }), N = Be(null), R = Be(async () => {
  }), g = Be(0), G = Be(crypto.randomUUID()), oe = Be(""), L = Be({ onDocument: r.onDocument, onError: r.onError });
  L.current = { onDocument: r.onDocument, onError: r.onError };
  function le(K, ae, se) {
    U.current = K, Q.current = K.snapshot, K.snapshot.yjs_state && K.snapshot.yjs_state !== oe.current && (Kp(t, K.snapshot.yjs_state), oe.current = K.snapshot.yjs_state), K.snapshot.yjs_state && h(!1), b(K.presence), k(K.snapshot.server_clock), B(K.snapshot.draft_revision), S(K.user_id);
    const we = [...new Set(ae.map((Ae) => Ae.user_id || "").filter((Ae) => Ae && Ae !== K.user_id))];
    we.length > 0 && (u(we), A((Ae) => Ae + ae.filter((Y) => Y.user_id && Y.user_id !== K.user_id).length)), L.current.onDocument($.current?.title || K.snapshot.title, K.snapshot.content, se);
  }
  ye(() => {
    if (!r.active || !e) {
      i(e ? "connecting" : "unavailable"), o(!1), b([]);
      return;
    }
    const K = ++g.current, ae = new AbortController(), se = crypto.randomUUID();
    G.current = se, U.current = null, Q.current = null, $.current = null, N.current = null, o(!1), i(z > 0 ? "reconnecting" : "connecting"), b([]);
    const we = async () => {
      if (N.current) return N.current;
      const Y = (async () => {
        try {
          for (; g.current === K && U.current && $.current; ) {
            i("syncing");
            const ue = $.current, Ce = Q.current;
            if (!Ce) return;
            const _e = ue.title.trim(), Ne = {
              client_id: G.current,
              update_id: ue.updateID,
              title: _e !== Ce.title ? _e : void 0,
              yjs_update: ue.change.yjsUpdate,
              yjs_state: ue.change.yjsState,
              content: ue.content,
              content_sha256: await Yp(ue.content),
              edited_block_ids: ue.change.editedBlockIDs
            }, De = await r.client.syncKnowledgeCollaboration(r.libraryID, r.pageID, {
              session_id: U.current.id,
              after_clock: Ce.server_clock,
              update: Ne,
              cursor_block_id: X.current.cursor || void 0,
              selection_block_id: X.current.selection || void 0
            }, AbortSignal.timeout(3e4));
            if (g.current !== K) return;
            if (De.applied && $.current?.updateID === ue.updateID && ($.current = null), le(De.session, De.events, De.applied && $.current === null), !De.applied) {
              window.setTimeout(() => {
                g.current === K && $.current?.updateID !== ue.updateID && R.current();
              }, 0);
              break;
            }
          }
          g.current === K && !$.current && i("connected");
        } catch (ue) {
          g.current === K && (i("error"), L.current.onError(ue));
        }
      })();
      N.current = Y;
      try {
        await Y;
      } finally {
        N.current === Y && (N.current = null);
      }
    };
    R.current = we, r.client.connectKnowledgeCollaboration(r.libraryID, r.pageID, { client_id: se }, ae.signal).then((Y) => {
      ae.signal.aborted || g.current !== K || (U.current = Y, Q.current = Y.snapshot, h(!Y.snapshot.yjs_state), le(Y, [], !0), o(!0), i("connected"));
    }).catch((Y) => {
      !ae.signal.aborted && g.current === K && (i("error"), L.current.onError(Y));
    });
    const Ae = window.setInterval(() => {
      const Y = U.current;
      !Y || N.current || $.current || g.current !== K || r.client.syncKnowledgeCollaboration(r.libraryID, r.pageID, {
        session_id: Y.id,
        after_clock: Q.current?.server_clock || 0,
        cursor_block_id: X.current.cursor || void 0,
        selection_block_id: X.current.selection || void 0
      }, AbortSignal.timeout(15e3)).then((ue) => {
        g.current === K && le(ue.session, ue.events, !0);
      }).catch((ue) => {
        g.current === K && (i("error"), L.current.onError(ue));
      });
    }, 2e3);
    return () => {
      ae.abort(), window.clearInterval(Ae), g.current++, N.current = null, $.current = null;
      const Y = U.current;
      U.current = null, Y && r.client.closeKnowledgeCollaboration(r.libraryID, r.pageID, Y.id, AbortSignal.timeout(1e4)).catch(() => {
      });
    };
  }, [e, t, r.active, r.client, r.libraryID, r.pageID, z]);
  function ee(K, ae, se) {
    const we = Q.current;
    if (!we || !a || s === "connecting" || s === "reconnecting" || s === "error") return;
    const Ae = se || (() => {
      const Y = vo(t);
      return { yjsUpdate: Y, yjsState: Y, editedBlockIDs: [] };
    })();
    !$.current && K.trim() === we.title && ae === we.content || ($.current = { updateID: crypto.randomUUID(), title: K, content: ae, change: Ae }, X.current = { cursor: Ae.cursorBlockID || "", selection: Ae.selectionBlockID || "" }, i("syncing"), R.current());
  }
  async function de(K) {
    await R.current();
    const ae = U.current;
    if (!ae || $.current) throw new Error("协作更改尚未完成合并");
    return r.client.publishKnowledgeCollaboration(r.libraryID, r.pageID, {
      session_id: ae.id,
      client_id: ae.client_id,
      publish_note: K
    }, AbortSignal.timeout(6e4));
  }
  const H = ct(() => ({
    document: t,
    fragment: n,
    initializeFromBody: l,
    user: { name: C || "当前用户", color: "#0b8f72" }
  }), [t, n, l, C]), O = ct(() => new Set(p.map((K) => K.user_id)).size, [p]);
  return {
    available: e && r.active,
    ready: a,
    editorCollaboration: H,
    state: s,
    presence: p,
    onlineUsers: O,
    mergedUserIDs: m,
    mergeCount: y,
    serverClock: w,
    draftRevision: _,
    userID: C,
    edit: ee,
    publish: de,
    reconnect: () => x((K) => K + 1),
    encodeState: () => vo(t)
  };
}
const Qr = {
  document: { label: "文档", description: "富文本、内容块与内嵌应用", title: "未命名文档" },
  multidimensional_table: { label: "多维表格", description: "字段化记录与多视图数据", title: "未命名多维表格" },
  spreadsheet: { label: "表格", description: "行列单元格数据", title: "未命名表格" },
  presentation: { label: "幻灯片", description: "分镜式演示内容", title: "未命名幻灯片" },
  form: { label: "问卷", description: "问题、选项与必填规则", title: "未命名问卷" },
  mind_note: { label: "思维笔记", description: "可缩进的大纲笔记", title: "未命名思维笔记" },
  whiteboard: { label: "画板", description: "自由卡片与连接关系", title: "未命名画板" },
  mind_map: { label: "思维导图", description: "中心主题与分支节点", title: "未命名思维导图" },
  flowchart: { label: "流程图", description: "步骤节点与流程关系", title: "未命名流程图" }
}, tm = Object.keys(Qr), rm = Dt(() => import("./BlockNoteEditor-DUzqFvfW.js").then((r) => ({ default: r.DocumentEditor }))), nm = Dt(() => import("./BlockNoteEditor-DUzqFvfW.js").then((r) => ({ default: r.MindNoteEditor }))), sm = Dt(() => import("./GridEditor-DNG1G41A.js").then((r) => ({ default: r.GridEditor }))), im = Dt(() => import("./SpreadsheetEditor-DhsU9IIq.js").then((r) => ({ default: r.SpreadsheetEditor }))), am = Dt(() => import("./CanvasEditor-CaltLRIl.js").then((r) => r.J).then((r) => ({ default: r.PresentationEditor }))), om = Dt(() => import("./CanvasEditor-CaltLRIl.js").then((r) => r.J).then((r) => ({ default: r.WhiteboardEditor }))), lm = Dt(() => import("./FormEditor-qTZZeKxZ.js").then((r) => ({ default: r.FormEditor }))), cm = Dt(() => import("./MindMapEditor-DrhnNgVb.js").then((r) => ({ default: r.MindMapEditor }))), dm = Dt(() => import("./FlowchartEditor-BZYZ_8u2.js").then((r) => ({ default: r.FlowchartEditor }))), hm = {
  document: rm,
  multidimensional_table: sm,
  spreadsheet: im,
  presentation: am,
  form: lm,
  mind_note: nm,
  whiteboard: om,
  mind_map: cm,
  flowchart: dm
};
function ni({ type: r, ...e }) {
  const t = hm[r];
  return /* @__PURE__ */ d(Oc, { fallback: /* @__PURE__ */ d("div", { className: "knowledge-editor-loading", role: "status", children: "正在载入编辑器…" }), children: /* @__PURE__ */ d(t, { ...e }) });
}
function As(r) {
  try {
    const e = JSON.parse(r);
    return Array.isArray(e.blocks) ? e.blocks : [];
  } catch {
    return [];
  }
}
function um(r) {
  return JSON.stringify({ blocks: r });
}
function Yn(r) {
  if (typeof r == "string") return r;
  if (Array.isArray(r)) return r.map(Yn).join("");
  if (!r || typeof r != "object") return "";
  const e = r;
  return typeof e.text == "string" ? e.text : Yn(e.content);
}
function fm(r) {
  const e = [], t = (n) => {
    for (const s of n) {
      const i = Yn(s.content).trim();
      i && e.push(i), s.children?.length && t(s.children);
    }
  };
  return t(As(r)), e.join(`
`);
}
function gm(r) {
  const e = As(r);
  let t = 0;
  const n = (s) => {
    for (const i of s)
      t++, i.children?.length && n(i.children);
  };
  return n(e), { blocks: t, characters: Array.from(fm(r)).length };
}
function pm(r) {
  const e = [], t = (n) => {
    for (const s of n) {
      if (s.type === "heading") {
        const i = Yn(s.content).trim();
        i && e.push({ key: s.id, level: Number(s.props.level) || 1, title: i });
      }
      s.children?.length && t(s.children);
    }
  };
  return t(As(r)), e;
}
function mm(r, e, t) {
  const n = As(r);
  return n.push({
    id: crypto.randomUUID(),
    type: "image",
    props: { name: t, caption: t, url: `knowledge-document:${e}`, showPreview: !0 },
    children: []
  }), um(n);
}
const bm = 2;
async function Am(r) {
  const e = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(r));
  return [...new Uint8Array(e)].map((t) => t.toString(16).padStart(2, "0")).join("");
}
function _o(r) {
  return typeof r == "object" && r !== null && "status" in r && typeof r.status == "number" ? r.status : 0;
}
function Io(r) {
  if (typeof r != "object" || r === null || !("conflict" in r)) return null;
  const e = r.conflict;
  return typeof e != "object" || e === null || !("current_draft_revision" in e) || typeof e.current_draft_revision != "number" ? null : e;
}
function wm(r) {
  return { queued: "等待索引", indexing: "正在索引", ready: "已可检索", failed: "索引失败", none: "尚未索引" }[r.projection_status || "none"];
}
const Co = ["#176b52", "#315f9d", "#9a5a17", "#7a4b9d", "#a13f5b"];
function Eo(r) {
  return Co[[...r].reduce((e, t) => e + t.codePointAt(0), 0) % Co.length];
}
function So({ type: r, size: e = 16 }) {
  const t = { document: Tt, multidimensional_table: hd, spreadsheet: dd, presentation: cd, form: ld, mind_note: Mo, whiteboard: od, mind_map: ad, flowchart: id }[r] || ud;
  return /* @__PURE__ */ d(t, { size: e, "aria-hidden": "true" });
}
function ym({ client: r, library: e, disabled: t, formatError: n, embedded: s = !1, documents: i, onManage: a }) {
  const o = !e.archived && (e.role === "editor" || e.role === "manager"), [l, h] = T({}), [p, b] = T(/* @__PURE__ */ new Set()), [m, u] = T({}), [y, A] = T({}), [w, k] = T(!1), [_, B] = T(""), [C, S] = T(null), [z, x] = T(!0), [U, Q] = T(""), [$, X] = T(""), [N, R] = T(""), [g, G] = T(!1), [oe, L] = T({ top: 0, left: 0, maxHeight: 560 }), [le, ee] = T("page"), [de, H] = T(null), [O, K] = T([]), [ae, se] = T(""), [we, Ae] = T(!1), [Y, ue] = T("read"), [Ce, _e] = T(""), [Ne, De] = T(""), [c, Z] = T(!1), [j, E] = T("idle"), [I, P] = T("idle"), [te, re] = T(null), [F, J] = T(""), [ie, ne] = T([]), [fe, Ie] = T(null), [me, Le] = T([]), [pt, Ze] = T(0), [mt, Me] = T(!0), [st, zt] = T(null), [rt, W] = T([]), [ge, Pe] = T(""), [Fe, Ke] = T(!1), [Ve, Ye] = T(""), [qt, St] = T(!0), [Vi, ws] = T(""), [ys, nn] = T(""), [ks, bc] = T(""), [Ac, wc] = T([]), [sn, Wi] = T([]), [it, an] = T({}), [vs, _s] = T(""), [Xi, on] = T([]), [ln, Zi] = T(!1), [Is, Ki] = T(""), [yc, Yi] = T([]), [cn, ea] = T(""), [Cs, kc] = T("knowledge.pages.get"), [bt, Es] = T(null), [Sr, Ss] = T(null), [sr, Ns] = T("inherit"), [Bs, Nr] = T([]), [xs, ta] = T(""), [vc, ra] = T([]), [na, _c] = T("reader"), [sa, Ic] = T("page"), [Br, ia] = T(!1), [Pt, dn] = T(null), We = Be(null), Nt = Be({ title: "", body: "" }), hn = Be(Promise.resolve()), ir = Be(null), xr = Be(null), un = Be(""), aa = Be({}), fn = Be(null), oa = Be(null), Ds = Be(null), pe = em({
    active: Y === "edit" && o && !!_ && !!C?.draft && C.page.content_type === "document",
    client: r,
    libraryID: e.id,
    pageID: _,
    initialTitle: Ce,
    initialContent: Ne,
    onDocument(f, D, V) {
      _e(f), De(D), Nt.current = { title: f, body: D }, Z(!V), E(V ? "saved" : "saving"), re(null);
    },
    onError(f) {
      X(n(f));
    }
  });
  function Ms(f) {
    ee("page"), B(f), window.setTimeout(() => aa.current[f]?.focus());
  }
  async function Ft(f, D) {
    const V = [...new Set(f.filter(Boolean))];
    if (V.length !== 0)
      try {
        const he = await r.resolvePrincipals(V, D);
        D.aborted || an((be) => ({ ...be, ...Object.fromEntries(he.filter((ke) => ke.status === "active").map((ke) => [ke.user_id, ke])) }));
      } catch {
      }
  }
  async function yt(f = "", D = AbortSignal.timeout(3e4), V = !1) {
    const he = await r.listPages(e.id, f, V && m[f] || "", 50, w, D);
    h((be) => ({ ...be, [f]: V ? [...be[f] || [], ...he.items] : he.items })), u((be) => ({ ...be, [f]: he.next_after || "" })), A((be) => ({ ...be, [f]: he.complete })), !_ && f === "" && he.items[0] && B(he.items[0].id);
  }
  ye(() => {
    const f = new AbortController();
    return h({}), u({}), A({}), b(/* @__PURE__ */ new Set()), B(""), S(null), x(!0), X(""), ee("page"), G(!1), K([]), se(""), Ae(!1), un.current = "", yt("", f.signal).catch((D) => {
      f.signal.aborted || X(n(D));
    }).finally(() => {
      f.signal.aborted || x(!1);
    }), () => f.abort();
  }, [r, n, e.id, w]), ye(() => {
    if (!i) {
      K([]);
      return;
    }
    const f = new AbortController();
    return r.listDocuments(e.id, "", 50, f.signal).then((D) => {
      f.signal.aborted || K(D.items);
    }).catch((D) => {
      f.signal.aborted || X(n(D));
    }), () => f.abort();
  }, [r, n, e.id, !!i]), ye(() => {
    if (!_) {
      S(null);
      return;
    }
    const f = new AbortController();
    return x(!0), X(""), ir.current = null, xr.current = null, r.getPage(e.id, _, o, f.signal).then((D) => {
      if (f.signal.aborted) return;
      S(D), We.current = D;
      const V = D.draft || D.published;
      _e(V?.title || D.page.title), De(V?.body.content || ""), Nt.current = { title: V?.title || D.page.title, body: V?.body.content || "" };
      const he = un.current === D.page.id;
      he && (un.current = ""), Z(!1), E("idle"), P("idle"), re(null), ue(he ? "edit" : "read"), Ie(null), Le([]), zt(null), ne([]), Ze(0), Me(!0), W([]), Ye(""), St(!0), Ss(null), Nr([]), dn(null), D.published?.published_by_user_id && Ft([D.published.published_by_user_id], f.signal), he && window.setTimeout(() => Ds.current?.select());
    }).catch((D) => {
      f.signal.aborted || (S(null), X(n(D)));
    }).finally(() => {
      f.signal.aborted || x(!1);
    }), () => f.abort();
  }, [o, r, n, e.id, _]), ye(() => {
    if (!c || Y !== "edit" || !C?.draft || t || pe.available) return;
    const f = window.setTimeout(() => {
      zs();
    }, 900);
    return () => window.clearTimeout(f);
  }, [Ne, pe.available, c, t, Y, Ce]), ye(() => {
    const f = pe.presence.map((V) => V.user_id);
    if (f.length === 0) return;
    const D = new AbortController();
    return Ft(f, D.signal), () => D.abort();
  }, [pe.presence]), ye(() => {
    const f = (D) => {
      (c || j === "saving") && D.preventDefault();
    };
    return window.addEventListener("beforeunload", f), () => window.removeEventListener("beforeunload", f);
  }, [c, j]), ye(() => {
    if (!g) return;
    const f = () => {
      const he = fn.current;
      if (!he) return;
      const be = he.getBoundingClientRect(), ke = 280, Qe = 7, et = 8, ar = Math.max(et, Math.min(be.right - ke, window.innerWidth - ke - et)), Qs = window.innerHeight - be.bottom - Qe - et, wa = be.top - Qe - et, ya = Qs < 320 && wa > Qs, ka = Math.max(180, Math.min(560, ya ? wa : Qs));
      L({ top: ya ? be.top - Qe - ka : be.bottom + Qe, left: ar, maxHeight: ka });
    }, D = (he) => {
      const be = he.target;
      !fn.current?.contains(be) && !oa.current?.contains(be) && G(!1);
    }, V = (he) => {
      he.key === "Escape" && (G(!1), fn.current?.querySelector("button")?.focus());
    };
    return f(), window.addEventListener("resize", f), window.addEventListener("scroll", f, !0), document.addEventListener("pointerdown", D), document.addEventListener("keydown", V), () => {
      window.removeEventListener("resize", f), window.removeEventListener("scroll", f, !0), document.removeEventListener("pointerdown", D), document.removeEventListener("keydown", V);
    };
  }, [g]), ye(() => {
    if (Y !== "history" && Y !== "activity" || !_) return;
    const f = new AbortController();
    return r.listPageVersions(e.id, _, 0, 50, f.signal).then((D) => {
      f.signal.aborted || (ne(D.items), Ze(D.next_before || 0), Me(D.complete), Ft(D.items.map((V) => V.published_by_user_id), f.signal));
    }).catch((D) => {
      f.signal.aborted || X(n(D));
    }), () => f.abort();
  }, [r, n, e.id, Y, _]), ye(() => {
    if (Y !== "comments" && Y !== "activity" || !_) return;
    const f = new AbortController();
    return r.listPageComments(e.id, _, "", 50, Y === "comments" && Fe, f.signal).then((D) => {
      f.signal.aborted || (W(D.items), Ye(D.next_after || ""), St(D.complete), Ft(D.items.flatMap((V) => [V.author_user_id, V.resolved_by_user_id || "", ...V.mentioned_user_ids]), f.signal));
    }).catch((D) => {
      f.signal.aborted || X(n(D));
    }), () => f.abort();
  }, [r, n, e.id, Y, _, Fe]), ye(() => {
    if (!_) {
      on([]);
      return;
    }
    const f = new AbortController();
    return r.listPageAttachments(e.id, _, f.signal).then((D) => {
      f.signal.aborted || on(D.items);
    }).catch((D) => {
      f.signal.aborted || X(n(D));
    }), () => f.abort();
  }, [r, n, e.id, _]), ye(() => {
    if (Y !== "comments") return;
    const f = new AbortController(), D = window.setTimeout(() => {
      r.searchLibraryMembers(e.id, ks.trim(), "", 100, f.signal).then((V) => {
        f.signal.aborted || (wc(V.items), an((he) => ({ ...he, ...Object.fromEntries(V.items.map((be) => [be.user_id, be])) })));
      }).catch((V) => {
        f.signal.aborted || X(n(V));
      });
    }, 200);
    return () => {
      window.clearTimeout(D), f.abort();
    };
  }, [r, n, e.id, ks, Y]), ye(() => {
    if (Y !== "access" || e.role !== "manager") return;
    const f = new AbortController(), D = window.setTimeout(() => {
      r.searchPrincipals(Is.trim(), "", 20, f.signal).then((V) => {
        f.signal.aborted || Yi(V.items.filter((he) => he.status === "active"));
      }).catch((V) => {
        f.signal.aborted || X(n(V));
      });
    }, 200);
    return () => {
      window.clearTimeout(D), f.abort();
    };
  }, [Is, r, n, e.role, Y]), ye(() => {
    if (Y !== "access" || e.role !== "manager" || !_ || !cn) {
      Es(null);
      return;
    }
    const f = new AbortController();
    return r.explainAccess(e.id, { user_id: cn, page_id: _, action: Cs }, f.signal).then((D) => {
      f.signal.aborted || Es(D);
    }).catch((D) => {
      f.signal.aborted || (Es(null), X(n(D)));
    }), () => f.abort();
  }, [Cs, cn, r, n, e.id, e.role, Y, _]), ye(() => {
    if (Y !== "permissions" || e.role !== "manager" || !_ || !r.getPageAccess) return;
    const f = new AbortController();
    return r.getPageAccess(e.id, _, f.signal).then((D) => {
      f.signal.aborted || (Ss(D), Ns(D.mode), Nr(D.grants), Ft(D.grants.map((V) => V.user_id), f.signal));
    }).catch((D) => {
      f.signal.aborted || X(n(D));
    }), () => f.abort();
  }, [r, n, e.id, e.role, Y, _]), ye(() => {
    if (Y !== "permissions" || e.role !== "manager" || sr !== "restricted") return;
    const f = new AbortController(), D = window.setTimeout(() => {
      r.searchLibraryMembers(e.id, xs.trim(), "", 50, f.signal).then((V) => {
        f.signal.aborted || (ra(V.items), an((he) => ({ ...he, ...Object.fromEntries(V.items.map((be) => [be.user_id, be])) })));
      }).catch((V) => {
        f.signal.aborted || X(n(V));
      });
    }, 200);
    return () => {
      window.clearTimeout(D), f.abort();
    };
  }, [r, n, e.id, e.role, Y, sr, xs]);
  async function Rs(f) {
    const D = new Set(p);
    D.has(f.id) ? D.delete(f.id) : (D.add(f.id), l[f.id] || await yt(f.id)), b(D);
  }
  function la(f = "", D = 0) {
    const he = (l[f] || []).filter((be) => !U || be.title.toLocaleLowerCase().includes(U.toLocaleLowerCase())).flatMap((be) => [{ page: be, parent: f, depth: D }, ...p.has(be.id) ? la(be.id, D + 1) : []]);
    return !U && l[f] && y[f] === !1 && he.push({ parent: f, depth: D, loadMore: !0 }), he;
  }
  async function Cc(f) {
    if (o)
      try {
        const D = le === "page" ? _ : "", V = Qr[f], he = await r.createPage(e.id, { client_id: crypto.randomUUID(), parent_page_id: D || void 0, title: V.title, content_type: f }, AbortSignal.timeout(3e4));
        D && b((be) => new Set(be).add(D)), ee("page"), R(`已在当前节点下创建${V.label}，正在编辑。`), un.current = he.page.id, await yt(he.page.parent_page_id || ""), B(he.page.id);
      } catch (D) {
        X(n(D));
      }
  }
  function zs() {
    if (!We.current?.draft || !o) return hn.current;
    const D = { ...Nt.current };
    return E("saving"), re(null), X(""), hn.current = hn.current.then(async () => {
      const V = We.current;
      if (!V?.draft) return;
      const he = ir.current || {
        clientID: crypto.randomUUID(),
        pageID: V.page.id,
        expectedDraftRevision: V.draft.draft_revision,
        expectedPageRevision: V.page.revision,
        title: D.title,
        body: D.body,
        parentPageID: V.draft.parent_page_id,
        rank: V.draft.rank
      };
      ir.current = he;
      const be = await Am(he.body), ke = await r.savePageDraft(e.id, he.pageID, {
        client_id: he.clientID,
        expected_draft_revision: he.expectedDraftRevision,
        expected_page_revision: he.expectedPageRevision,
        title: he.title.trim(),
        parent_page_id: he.parentPageID,
        rank: he.rank,
        content_schema_version: bm,
        content: he.body,
        content_sha256: be
      }, AbortSignal.timeout(3e4));
      ir.current = null, We.current = ke, S(ke);
      const Qe = Nt.current.title === he.title && Nt.current.body === he.body;
      Z(!Qe), E(Qe ? "saved" : "idle");
    }).catch((V) => {
      _o(V) === 409 ? (E("conflict"), re(Io(V))) : E("error"), X(n(V));
    }), hn.current;
  }
  async function Ec() {
    if (!We.current?.draft || !o) return;
    if (pe.available) {
      P("publishing"), X("");
      try {
        const D = await pe.publish(F.trim() || void 0);
        We.current = D, S(D), J(""), Z(!1), P("idle"), ue("read"), R("协作快照已冻结并发布；所有在线成员看到的是同一版本。"), await yt(D.page.parent_page_id || "");
      } catch (D) {
        P("error"), X(n(D));
      }
      return;
    }
    c && await zs();
    const f = We.current;
    if (!(!f?.draft || j === "conflict" || ir.current)) {
      P("publishing"), X("");
      try {
        const D = xr.current || {
          clientID: crypto.randomUUID(),
          pageID: f.page.id,
          expectedPageRevision: f.page.revision,
          expectedDraftRevision: f.draft.draft_revision,
          publishNote: F.trim() || void 0
        };
        xr.current = D;
        const V = await r.publishPage(e.id, D.pageID, { client_id: D.clientID, expected_page_revision: D.expectedPageRevision, expected_draft_revision: D.expectedDraftRevision, publish_note: D.publishNote }, AbortSignal.timeout(6e4));
        xr.current = null, We.current = V, S(V), J(""), Z(!1), P("idle"), ue("read"), R("页面已发布；页面可以立即阅读，检索状态以页面标记为准。"), await yt(V.page.parent_page_id || "");
      } catch (D) {
        P("error"), _o(D) === 409 && (E("conflict"), re(Io(D))), X(n(D));
      }
    }
  }
  async function Ps(f, D, V = "") {
    await r.movePage(e.id, f.id, { client_id: crypto.randomUUID(), expected_revision: f.revision, parent_page_id: D || void 0, rank: f.rank, access_impact_token: V || void 0 }, AbortSignal.timeout(3e4)), dn(null), R("页面与子树权限继承已在同一事务中更新。"), await yt(f.parent_page_id || ""), await yt(D);
  }
  async function ca(f, D) {
    if (!(!o || f.id === D))
      try {
        if (e.role === "manager" && r.previewPageMove) {
          const V = await r.previewPageMove(e.id, f.id, { parent_page_id: D || void 0, rank: f.rank }, AbortSignal.timeout(3e4));
          if (V.requires_confirm) {
            dn({ page: f, parentPageID: D, impact: V }), Ft(V.changed_user_ids, AbortSignal.timeout(3e4));
            return;
          }
          await Ps(f, D, V.token);
          return;
        }
        await Ps(f, D);
      } catch (V) {
        X(n(V));
      }
  }
  function Sc(f) {
    const D = { user_id: f.user_id, role: na, scope: sa };
    Nr((V) => [...V.filter((he) => he.user_id !== D.user_id || he.scope !== D.scope), D]), an((V) => ({ ...V, [f.user_id]: f })), ta(""), ra([]);
  }
  async function Nc() {
    if (!(!_ || !Sr || !r.setPageAccess)) {
      ia(!0), X("");
      try {
        const f = await r.setPageAccess(e.id, _, {
          client_id: crypto.randomUUID(),
          expected_revision: Sr.revision,
          mode: sr,
          grants: sr === "restricted" ? Bs : []
        }, AbortSignal.timeout(3e4));
        if (Ss(f), Ns(f.mode), Nr(f.grants), R(f.projection_status === "ready" ? "页面权限已生效。" : "本地撤权已立即生效；远端权限投影确认前，本页不会进入搜索结果。"), We.current) {
          const D = { ...We.current, page: { ...We.current.page, access_mode: f.mode, access_revision: f.revision, access_status: f.projection_status } };
          We.current = D, S(D);
        }
      } catch (f) {
        X(n(f));
      } finally {
        ia(!1);
      }
    }
  }
  async function da(f, D) {
    const V = f.parent_page_id || "", he = l[V] || [];
    if (!o || w || y[V] !== !0) return;
    const be = he.findIndex((et) => et.id === f.id), ke = be + D;
    if (be < 0 || ke < 0 || ke >= he.length) return;
    const Qe = [...he];
    [Qe[be], Qe[ke]] = [Qe[ke], Qe[be]];
    try {
      const et = await r.reorderPages(e.id, { client_id: crypto.randomUUID(), parent_page_id: V || void 0, items: Qe.map((ar) => ({ page_id: ar.id, expected_revision: ar.revision })) }, AbortSignal.timeout(3e4));
      h((ar) => ({ ...ar, [V]: et.items })), R("同级页面顺序已原子更新。");
    } catch (et) {
      X(n(et));
    }
  }
  async function Bc() {
    const f = We.current;
    if (!(!f || !o))
      try {
        const D = await r.copyPage(e.id, f.page.id, { client_id: crypto.randomUUID(), parent_page_id: f.page.parent_page_id, title: `${f.page.title} 副本` }, AbortSignal.timeout(3e4));
        await yt(D.page.parent_page_id || ""), B(D.page.id), R("页面已复制为一份新的未发布草稿。");
      } catch (D) {
        X(n(D));
      }
  }
  async function xc(f) {
    try {
      await r.setPageArchived(e.id, f.id, f.state !== "archived", { client_id: crypto.randomUUID(), expected_revision: f.revision }, AbortSignal.timeout(3e4)), B(""), await yt(f.parent_page_id || ""), R(f.state === "archived" ? "页面已恢复。" : "页面已归档并立即停止检索引用。 ");
    } catch (D) {
      X(n(D));
    }
  }
  async function Dc() {
    if (!(me.length !== 2 || !_))
      try {
        Ie(await r.diffPageVersions(e.id, _, me[1], me[0], AbortSignal.timeout(3e4)));
      } catch (f) {
        X(n(f));
      }
  }
  async function Mc(f) {
    try {
      zt(await r.getPageVersion(e.id, _, f, AbortSignal.timeout(3e4)));
    } catch (D) {
      X(n(D));
    }
  }
  async function ha() {
    if (!(!_ || mt || pt < 1))
      try {
        const f = await r.listPageVersions(e.id, _, pt, 50, AbortSignal.timeout(3e4));
        ne((D) => [...D, ...f.items.filter((V) => !D.some((he) => he.version === V.version))]), Ze(f.next_before || 0), Me(f.complete), Ft(f.items.map((D) => D.published_by_user_id), AbortSignal.timeout(3e4));
      } catch (f) {
        X(n(f));
      }
  }
  async function ua() {
    if (!(!_ || qt || !Ve))
      try {
        const f = await r.listPageComments(e.id, _, Ve, 50, Y === "comments" && Fe, AbortSignal.timeout(3e4));
        W((D) => [...D, ...f.items.filter((V) => !D.some((he) => he.id === V.id))]), Ye(f.next_after || ""), St(f.complete), Ft(f.items.flatMap((D) => [D.author_user_id, D.resolved_by_user_id || "", ...D.mentioned_user_ids]), AbortSignal.timeout(3e4));
      } catch (f) {
        X(n(f));
      }
  }
  async function Rc(f) {
    const D = We.current;
    if (D?.draft)
      try {
        const V = await r.restorePageVersion(e.id, D.page.id, f, { client_id: crypto.randomUUID(), expected_page_revision: D.page.revision, expected_draft_revision: D.draft.draft_revision }, AbortSignal.timeout(3e4));
        We.current = V, S(V), _e(V.draft.title), De(V.draft.body.content), Nt.current = { title: V.draft.title, body: V.draft.body.content }, ue("edit"), R(`版本 ${f} 已恢复为草稿，历史版本未修改。`);
      } catch (V) {
        X(n(V));
      }
  }
  async function zc() {
    const f = We.current;
    if (!(!f?.published || !ge.trim()))
      try {
        await r.createPageComment(e.id, f.page.id, { client_id: crypto.randomUUID(), parent_comment_id: vs || void 0, published_version: f.published.version, anchor: {}, body: ge.trim(), mentioned_user_ids: sn }, AbortSignal.timeout(3e4)), Pe(""), Wi([]), _s("");
        const D = await r.listPageComments(e.id, f.page.id, "", 50, Fe, AbortSignal.timeout(3e4));
        W(D.items), Ye(D.next_after || ""), St(D.complete);
      } catch (D) {
        X(n(D));
      }
  }
  async function Pc(f) {
    try {
      const D = await r.resolvePageComment(e.id, f.page_id, f.id, { client_id: crypto.randomUUID(), expected_revision: f.revision, resolved: !f.resolved }, AbortSignal.timeout(3e4));
      W((V) => V.map((he) => he.id === D.id ? D : he));
    } catch (D) {
      X(n(D));
    }
  }
  async function Fc(f) {
    const D = ys.trim();
    if (D)
      try {
        const V = await r.updatePageComment(e.id, f.page_id, f.id, { client_id: crypto.randomUUID(), expected_revision: f.revision, body: D, mentioned_user_ids: f.mentioned_user_ids }, AbortSignal.timeout(3e4));
        W((he) => he.map((be) => be.id === V.id ? V : be)), ws(""), nn("");
      } catch (V) {
        X(n(V));
      }
  }
  async function Qc(f) {
    try {
      const D = await r.deletePageComment(e.id, f.page_id, f.id, { client_id: crypto.randomUUID(), expected_revision: f.revision }, AbortSignal.timeout(3e4));
      W((V) => V.map((he) => he.id === D.id ? D : he));
    } catch (D) {
      X(n(D));
    }
  }
  async function Tc(f) {
    const D = We.current;
    if (!D?.draft || !o || ln) return;
    Zi(!0), X("");
    const V = AbortSignal.timeout(7200 * 1e3);
    try {
      const he = await Lo(f, V), be = await r.uploadDocument({ libraryID: e.id, file: f, clientID: crypto.randomUUID(), sha256: he, signal: V }), ke = await r.setPageAttachment(e.id, D.page.id, be.id, { client_id: crypto.randomUUID(), title: f.name, rank: `${Date.now()}:${be.id}` }, V);
      if (on((Qe) => [...Qe.filter((et) => et.document_id !== ke.document_id), ke]), f.type.startsWith("image/") && D.page.content_type === "document") {
        const Qe = mm(Nt.current.body, be.id, f.name);
        Nt.current.body = Qe, De(Qe), Z(!0), E("idle"), ue("edit");
      }
      R("附件已通过受权文件接口上传并关联到当前页面。图片引用会在草稿保存后生效。");
    } catch (he) {
      X(n(he));
    } finally {
      Zi(!1);
    }
  }
  async function Lc(f) {
    try {
      await r.removePageAttachment(e.id, f.page_id, f.document_id, { client_id: crypto.randomUUID() }, AbortSignal.timeout(3e4)), on((D) => D.filter((V) => V.document_id !== f.document_id));
    } catch (D) {
      X(n(D));
    }
  }
  function fa(f, D, V) {
    _e(f), De(D), Nt.current = { title: f, body: D }, Z(!0), E(pe.available ? "saving" : "idle"), P("idle"), re(null), pe.available && pe.edit(f, D, V);
  }
  const gn = ct(() => la(), [l, p, U]), ga = ct(() => [
    ...ie.map((f) => ({ key: `version-${f.version}`, at: f.published_at, title: `发布了版本 ${f.version}`, detail: `${it[f.published_by_user_id]?.display_name || "账号不可用"} · ${f.publish_note || f.body.summary || "无发布说明"}` })),
    ...rt.map((f) => ({ key: `comment-${f.id}-${f.revision}`, at: f.updated_at, title: f.deleted ? "删除了评论" : f.resolved ? "解决了评论" : f.revision > 1 ? "更新了评论" : f.parent_comment_id ? "回复了评论" : "发表了评论", detail: `${it[f.author_user_id]?.display_name || "账号不可用"} · 版本 ${f.published_version}` }))
  ].sort((f, D) => D.at.localeCompare(f.at)), [rt, it, ie]), pa = ct(() => {
    const f = /* @__PURE__ */ new Map();
    for (const D of pe.presence) {
      const V = f.get(D.user_id) || { userID: D.user_id, sessions: 0, editedBlocks: 0, cursorBlockID: "", selectionBlockID: "", lastSeenAt: "" };
      V.sessions++, V.editedBlocks += D.edited_blocks || 0, D.last_seen_at >= V.lastSeenAt && (V.cursorBlockID = D.cursor_block_id || "", V.selectionBlockID = D.selection_block_id || "", V.lastSeenAt = D.last_seen_at), f.set(D.user_id, V);
    }
    return [...f.values()].sort((D, V) => D.userID === pe.userID ? -1 : V.userID === pe.userID ? 1 : V.lastSeenAt.localeCompare(D.lastSeenAt));
  }, [pe.presence, pe.userID]), Fs = C?.published?.body.content || "", ma = ct(() => C?.page.content_type === "document" ? pm(Fs) : [], [Fs, C?.page.content_type]), ba = ct(() => gm(Ne), [Ne]), Aa = { unavailable: "标准草稿模式", connecting: "正在连接协作会话", connected: "所有更改已同步", syncing: "正在合并更改", reconnecting: "正在恢复会话", error: "协作连接中断" }[pe.state];
  return /* @__PURE__ */ v("section", { className: `knowledge-pages${s ? " is-embedded" : ""}`, "aria-label": "知识页面", children: [
    !s && /* @__PURE__ */ v("header", { className: "knowledge-section-heading", children: [
      /* @__PURE__ */ v("div", { className: "knowledge-section-identity", children: [
        /* @__PURE__ */ d("span", { className: "knowledge-section-icon", "aria-hidden": "true", children: /* @__PURE__ */ d(Vt, { size: 18 }) }),
        /* @__PURE__ */ v("span", { children: [
          /* @__PURE__ */ d("small", { children: "Knowledge workspace" }),
          /* @__PURE__ */ d("h3", { children: "知识页面" }),
          /* @__PURE__ */ d("p", { children: "协作编辑、版本发布与访问治理集中在一个工作区。" })
        ] })
      ] }),
      C && /* @__PURE__ */ v("span", { className: `knowledge-index-state is-${C.page.projection_status || "none"}`, children: [
        /* @__PURE__ */ d("span", { "aria-hidden": "true" }),
        wm(C.page)
      ] })
    ] }),
    /* @__PURE__ */ v("div", { className: "knowledge-pages-layout", children: [
      /* @__PURE__ */ v("aside", { className: "knowledge-page-tree", onDragOver: (f) => {
        o && f.preventDefault();
      }, onDrop: () => {
        de && ca(de, ""), H(null);
      }, children: [
        /* @__PURE__ */ v("div", { className: "knowledge-tree-toolbar", children: [
          /* @__PURE__ */ v("label", { children: [
            /* @__PURE__ */ d(wi, { size: 14, "aria-hidden": "true" }),
            /* @__PURE__ */ d("input", { "aria-label": "筛选当前知识条目", value: U, onChange: (f) => Q(f.target.value), placeholder: "搜索知识条目" })
          ] }),
          o && /* @__PURE__ */ v("div", { ref: fn, className: "knowledge-create-menu-wrap", children: [
            /* @__PURE__ */ d(ce, { "aria-label": "新建知识条目", title: "新建知识条目", "aria-haspopup": "menu", "aria-expanded": g, disabled: t, onClick: () => G((f) => !f), children: /* @__PURE__ */ d(Do, { size: 16 }) }),
            g && typeof document < "u" && Wr(/* @__PURE__ */ v("div", { ref: oa, className: "knowledge-create-menu", role: "menu", "aria-label": "新建知识条目类型", style: oe, children: [
              tm.map((f) => /* @__PURE__ */ v("button", { role: "menuitem", onClick: () => {
                G(!1), Cc(f);
              }, children: [
                /* @__PURE__ */ d(So, { type: f, size: 18 }),
                /* @__PURE__ */ v("span", { children: [
                  /* @__PURE__ */ d("strong", { children: Qr[f].label }),
                  /* @__PURE__ */ d("small", { children: Qr[f].description })
                ] })
              ] }, f)),
              i && /* @__PURE__ */ v("button", { role: "menuitem", onClick: () => {
                G(!1), se(""), Ae(!0), ee("documents");
              }, children: [
                /* @__PURE__ */ d(Pn, { size: 18 }),
                /* @__PURE__ */ v("span", { children: [
                  /* @__PURE__ */ d("strong", { children: "上传及导入" }),
                  /* @__PURE__ */ d("small", { children: "导入 PDF、Office、图片或音视频" })
                ] })
              ] })
            ] }), document.body)
          ] }),
          a && /* @__PURE__ */ d(ce, { "aria-label": "管理知识库", title: "管理知识库", disabled: t, onClick: a, children: /* @__PURE__ */ d(qc, { size: 15 }) })
        ] }),
        /* @__PURE__ */ v("div", { className: "knowledge-tree-label", children: [
          /* @__PURE__ */ d("span", { children: "知识条目" }),
          o && /* @__PURE__ */ v("label", { className: "knowledge-checkbox", children: [
            /* @__PURE__ */ d("input", { type: "checkbox", checked: w, onChange: (f) => k(f.target.checked) }),
            "归档"
          ] })
        ] }),
        /* @__PURE__ */ v("div", { role: "tree", "aria-label": "知识条目树", children: [
          O.map((f) => /* @__PURE__ */ v("button", { role: "treeitem", className: "knowledge-document-entry-row", "aria-selected": le === "documents" && ae === f.id, onClick: () => {
            ee("documents"), se(f.id), Ae(!1);
          }, children: [
            /* @__PURE__ */ d(Tt, { size: 15 }),
            /* @__PURE__ */ v("span", { children: [
              /* @__PURE__ */ d("strong", { children: f.filename }),
              /* @__PURE__ */ d("small", { children: "导入文件" })
            ] })
          ] }, f.id)),
          gn.map(({ page: f, parent: D, depth: V, loadMore: he }, be) => he ? /* @__PURE__ */ d("button", { className: "knowledge-tree-more", style: { marginInlineStart: `${V * 16 + 24}px` }, onClick: () => {
            yt(D, AbortSignal.timeout(3e4), !0);
          }, children: "加载更多" }, `more-${D}-${be}`) : f && /* @__PURE__ */ v("div", { className: "knowledge-tree-row", style: { paddingInlineStart: `${V * 16 + 4}px` }, draggable: o, onDragStart: () => H(f), onDragOver: (ke) => {
            o && ke.preventDefault();
          }, onDrop: (ke) => {
            ke.stopPropagation(), de && ca(de, f.id), H(null);
          }, children: [
            /* @__PURE__ */ d("button", { "aria-label": p.has(f.id) ? "折叠子页面" : "展开子页面", onClick: () => {
              Rs(f);
            }, children: p.has(f.id) ? /* @__PURE__ */ d(Gc, { size: 14 }) : /* @__PURE__ */ d(_a, { size: 14 }) }),
            /* @__PURE__ */ v("button", { ref: (ke) => {
              aa.current[f.id] = ke;
            }, role: "treeitem", "aria-selected": le === "page" && _ === f.id, tabIndex: le === "page" && _ === f.id ? 0 : -1, onKeyDown: (ke) => {
              if (ke.key === "ArrowRight" && !p.has(f.id))
                ke.preventDefault(), Rs(f);
              else if (ke.key === "ArrowLeft")
                ke.preventDefault(), p.has(f.id) ? Rs(f) : D && Ms(D);
              else if (ke.key === "ArrowDown") {
                ke.preventDefault();
                const Qe = gn.slice(be + 1).find((et) => et.page)?.page;
                Qe && Ms(Qe.id);
              } else if (ke.key === "ArrowUp") {
                ke.preventDefault();
                const Qe = gn.slice(0, be).reverse().find((et) => et.page)?.page;
                Qe && Ms(Qe.id);
              } else ke.key === "Enter" && (ee("page"), B(f.id));
            }, onClick: () => {
              ee("page"), B(f.id);
            }, children: [
              /* @__PURE__ */ d(So, { type: f.content_type, size: 14 }),
              /* @__PURE__ */ d("span", { children: f.title })
            ] }),
            o && !w && y[D] === !0 && /* @__PURE__ */ v(at, { children: [
              /* @__PURE__ */ d("button", { "aria-label": `上移 ${f.title}`, disabled: (l[D] || [])[0]?.id === f.id, onClick: (ke) => {
                ke.stopPropagation(), da(f, -1);
              }, children: /* @__PURE__ */ d(Jc, { size: 12 }) }),
              /* @__PURE__ */ d("button", { "aria-label": `下移 ${f.title}`, disabled: (l[D] || []).at(-1)?.id === f.id, onClick: (ke) => {
                ke.stopPropagation(), da(f, 1);
              }, children: /* @__PURE__ */ d(Vc, { size: 12 }) })
            ] })
          ] }, f.id)),
          !z && gn.length === 0 && O.length === 0 && /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "没有知识条目。" })
        ] })
      ] }),
      /* @__PURE__ */ d("article", { className: le === "documents" ? "knowledge-page-main knowledge-document-main" : `knowledge-page-main${Y === "outline" || Y === "comments" || Y === "activity" || Y === "access" || Y === "permissions" ? " has-side-panel" : ""}${Y === "edit" && pe.available ? " has-collaboration" : ""}`, children: le === "documents" ? i?.({ selectedDocumentID: ae, showUploader: we, onDocumentsChange: K, onSelectedDocumentChange(f) {
        se(f), Ae(!1);
      } }) : /* @__PURE__ */ v(at, { children: [
        N && /* @__PURE__ */ d("p", { role: "status", className: "knowledge-notice", children: N }),
        $ && /* @__PURE__ */ d("p", { role: "alert", className: "knowledge-error", children: $ }),
        Pt && /* @__PURE__ */ v("section", { className: "knowledge-confirm knowledge-move-impact", role: "dialog", "aria-label": "确认页面权限影响", children: [
          /* @__PURE__ */ d("h3", { children: "移动会改变页面权限" }),
          /* @__PURE__ */ v("p", { children: [
            "将影响该子树中的 ",
            Pt.impact.affected_pages,
            " 个页面，并改变 ",
            Pt.impact.changed_user_ids.length,
            " 位成员的有效访问。"
          ] }),
          Pt.impact.changed_user_ids.length > 0 && /* @__PURE__ */ v("p", { className: "knowledge-subtle", children: [
            "涉及成员：",
            Pt.impact.changed_user_ids.map((f) => it[f]?.display_name || f).join("、")
          ] }),
          /* @__PURE__ */ v("div", { className: "knowledge-actions", children: [
            /* @__PURE__ */ d(ce, { className: "danger", onClick: () => {
              Ps(Pt.page, Pt.parentPageID, Pt.impact.token);
            }, children: "确认移动并更新继承" }),
            /* @__PURE__ */ d(ce, { onClick: () => dn(null), children: "取消移动" })
          ] })
        ] }),
        !C && !z ? /* @__PURE__ */ v(Lt, { children: [
          /* @__PURE__ */ d(Wc, { size: 28 }),
          /* @__PURE__ */ d("h3", { children: "选择或新建页面" })
        ] }) : null,
        C && /* @__PURE__ */ v(at, { children: [
          /* @__PURE__ */ d("nav", { className: "knowledge-page-breadcrumbs", "aria-label": "页面路径", children: C.breadcrumbs.map((f, D) => /* @__PURE__ */ v("span", { children: [
            D > 0 && /* @__PURE__ */ d(_a, { size: 12, "aria-hidden": "true" }),
            /* @__PURE__ */ d("button", { onClick: () => B(f.page_id), children: f.title })
          ] }, f.page_id)) }),
          /* @__PURE__ */ v("header", { className: `knowledge-page-title${Y === "edit" ? " is-editing" : ""}`, children: [
            /* @__PURE__ */ v("div", { className: "knowledge-page-heading", children: [
              Y !== "edit" && /* @__PURE__ */ d("h2", { className: o && C.page.state === "active" ? "is-editable" : void 0, title: o && C.page.state === "active" ? "双击编辑标题" : void 0, onDoubleClick: () => {
                o && C.page.state === "active" && (ue("edit"), window.setTimeout(() => Ds.current?.select()));
              }, children: C.published?.title || C.page.title }),
              /* @__PURE__ */ v("p", { children: [
                "版本 ",
                C.page.published_version || "未发布",
                /* @__PURE__ */ d("span", { "aria-hidden": "true", children: " · " }),
                C.published ? `${it[C.published.published_by_user_id]?.display_name || "账号不可用"} 发布于 ${new Date(C.published.published_at).toLocaleString()}` : "仅草稿"
              ] })
            ] }),
            /* @__PURE__ */ d("div", { className: "knowledge-page-presence-summary", "aria-label": `${pe.onlineUsers} 人在线编辑`, children: Y === "edit" && pe.available && /* @__PURE__ */ v(at, { children: [
              /* @__PURE__ */ d("div", { className: "knowledge-avatar-stack", children: pa.slice(0, 4).map((f) => /* @__PURE__ */ d("span", { title: it[f.userID]?.display_name || f.userID, style: { "--collaborator-color": Eo(f.userID) }, children: (it[f.userID]?.display_name || f.userID).slice(0, 1).toUpperCase() }, f.userID)) }),
              /* @__PURE__ */ v("strong", { children: [
                pe.onlineUsers,
                " 人在线"
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ v("div", { className: "knowledge-page-toolbar", children: [
            /* @__PURE__ */ v("div", { className: "knowledge-view-tabs", role: "tablist", "aria-label": "页面视图", children: [
              /* @__PURE__ */ v("button", { role: "tab", "aria-selected": Y === "read", onClick: () => ue("read"), children: [
                /* @__PURE__ */ d(Vt, { size: 14 }),
                "阅读"
              ] }),
              o && C.page.state === "active" && /* @__PURE__ */ v("button", { role: "tab", "aria-selected": Y === "edit", onClick: () => ue("edit"), children: [
                /* @__PURE__ */ d(Xc, { size: 14 }),
                "编辑"
              ] }),
              /* @__PURE__ */ v("button", { role: "tab", "aria-selected": Y === "history", onClick: () => ue("history"), children: [
                /* @__PURE__ */ d(Zc, { size: 14 }),
                "历史"
              ] }),
              /* @__PURE__ */ v("button", { role: "tab", "aria-selected": Y === "comments", onClick: () => ue("comments"), children: [
                /* @__PURE__ */ d(Kc, { size: 14 }),
                "评论"
              ] }),
              /* @__PURE__ */ v("button", { role: "tab", "aria-selected": Y === "activity", onClick: () => ue("activity"), children: [
                /* @__PURE__ */ d(Ia, { size: 14 }),
                "活动"
              ] })
            ] }),
            /* @__PURE__ */ v("div", { className: "knowledge-page-tools", children: [
              C.page.content_type === "document" && /* @__PURE__ */ d(ce, { "aria-pressed": Y === "outline", title: "页面大纲", onClick: () => ue("outline"), children: /* @__PURE__ */ d(Mo, { size: 15 }) }),
              e.role === "manager" && /* @__PURE__ */ d(ce, { "aria-pressed": Y === "access", title: "访问说明", onClick: () => ue("access"), children: /* @__PURE__ */ d(Yc, { size: 15 }) }),
              e.role === "manager" && r.getPageAccess && r.setPageAccess && /* @__PURE__ */ d(ce, { "aria-pressed": Y === "permissions", title: "页面权限", onClick: () => ue("permissions"), children: /* @__PURE__ */ d(Fn, { size: 15 }) }),
              o && /* @__PURE__ */ d(ce, { title: "复制页面", onClick: () => {
                Bc();
              }, children: /* @__PURE__ */ d(ed, { size: 15 }) }),
              o && /* @__PURE__ */ d(ce, { title: C.page.state === "archived" ? "恢复页面" : "归档页面", onClick: () => {
                xc(C.page);
              }, children: /* @__PURE__ */ d(td, { size: 15 }) })
            ] })
          ] }),
          (Y === "read" || Y === "outline" || Y === "comments" || Y === "activity" || Y === "access" || Y === "permissions") && (C.published ? /* @__PURE__ */ d("div", { className: "knowledge-page-readable typed-readable", children: /* @__PURE__ */ d(ni, { type: C.page.content_type, body: Fs, readOnly: !0, onChange: () => {
          } }) }) : /* @__PURE__ */ v(Lt, { children: [
            /* @__PURE__ */ d(Pn, { size: 28 }),
            /* @__PURE__ */ d("h3", { children: "页面尚未发布" }),
            /* @__PURE__ */ d("p", { children: "编辑者可以完善草稿后发布。" })
          ] })),
          Y === "edit" && C.draft && /* @__PURE__ */ v("div", { className: "knowledge-editor-shell", children: [
            /* @__PURE__ */ v("section", { className: "knowledge-page-editor", children: [
              /* @__PURE__ */ v("div", { className: "knowledge-editor-canvas", children: [
                /* @__PURE__ */ d("input", { ref: Ds, className: "knowledge-editor-title", "aria-label": "标题", value: Ce, maxLength: 256, disabled: pe.available && !pe.ready, onChange: (f) => fa(f.target.value, Ne), placeholder: "页面标题" }),
                /* @__PURE__ */ v("div", { className: "knowledge-editor-toolbar", children: [
                  /* @__PURE__ */ d("span", { children: Qr[C.page.content_type].label }),
                  /* @__PURE__ */ d("span", { children: C.page.content_type === "document" ? `${ba.blocks} 个内容块 · ${ba.characters} 字符` : "结构化草稿" })
                ] }),
                /* @__PURE__ */ d(ni, { type: C.page.content_type, body: Ne, collaboration: pe.available && pe.ready ? pe.editorCollaboration : void 0, readOnly: pe.available && !pe.ready, onChange: (f, D) => fa(Ce, f, D) })
              ] }),
              /* @__PURE__ */ v("div", { className: "knowledge-editor-meta", children: [
                /* @__PURE__ */ v("div", { className: `knowledge-sync-state is-${pe.state}`, role: "status", children: [
                  pe.state === "syncing" || pe.state === "connecting" || pe.state === "reconnecting" ? /* @__PURE__ */ d(rd, { className: "knowledge-pulse", size: 15 }) : pe.state === "error" ? /* @__PURE__ */ d(Ca, { size: 15 }) : /* @__PURE__ */ d(si, { size: 15 }),
                  /* @__PURE__ */ d("span", { children: I === "publishing" ? "正在冻结协作快照…" : I === "error" ? "发布失败" : pe.available ? Aa : { idle: c ? "有未保存更改" : "草稿未更改", saving: "正在保存…", saved: `已保存 revision ${C.draft.draft_revision}`, conflict: "保存冲突：服务器已有更新", error: "保存失败" }[j] }),
                  pe.available && pe.draftRevision > 0 && /* @__PURE__ */ v("small", { children: [
                    "revision ",
                    pe.draftRevision,
                    " · clock ",
                    pe.serverClock
                  ] })
                ] }),
                /* @__PURE__ */ v("label", { className: "knowledge-attachment-trigger", children: [
                  /* @__PURE__ */ d(nd, { size: 15 }),
                  "添加附件或粘贴图片",
                  /* @__PURE__ */ d("input", { type: "file", accept: Po(e), disabled: ln, onChange: (f) => {
                    const D = f.target.files?.[0];
                    D && Tc(D), f.currentTarget.value = "";
                  } })
                ] })
              ] }),
              (ln || Xi.length > 0) && /* @__PURE__ */ v("div", { className: "knowledge-page-attachments", children: [
                ln && /* @__PURE__ */ d("span", { role: "status", children: "正在校验并上传附件…" }),
                Xi.map((f) => /* @__PURE__ */ v("span", { children: [
                  f.title,
                  /* @__PURE__ */ d("button", { type: "button", onClick: () => {
                    Lc(f);
                  }, children: "移除" })
                ] }, f.document_id))
              ] }),
              !pe.available && j === "conflict" && /* @__PURE__ */ v("div", { className: "knowledge-conflict", children: [
                /* @__PURE__ */ d(Ea, { size: 18 }),
                /* @__PURE__ */ d("span", { children: te ? `服务器草稿 revision ${te.current_draft_revision}，基于发布版本 ${te.base_published_version}，更新时间 ${new Date(te.current_updated_at).toLocaleString()}，摘要 ${te.current_content_sha256.slice(0, 12)}` : "服务器已有新草稿，请重新载入后合并。" }),
                /* @__PURE__ */ d(ce, { onClick: () => {
                  navigator.clipboard.writeText(Ne), R("你的正文已复制到剪贴板。");
                }, children: "复制我的内容" }),
                /* @__PURE__ */ v(ce, { onClick: () => {
                  ir.current = null, xr.current = null, re(null), B((f) => (window.setTimeout(() => B(f)), ""));
                }, children: [
                  /* @__PURE__ */ d($t, { size: 14 }),
                  "重新载入"
                ] })
              ] }),
              /* @__PURE__ */ v("footer", { className: "knowledge-editor-actions", children: [
                /* @__PURE__ */ v("div", { children: [
                  !pe.available && /* @__PURE__ */ v(ce, { disabled: !c || j === "saving" || I === "publishing", onClick: () => {
                    zs();
                  }, children: [
                    /* @__PURE__ */ d(Sa, { size: 14 }),
                    "保存草稿"
                  ] }),
                  /* @__PURE__ */ d("span", { className: "knowledge-editor-hint", children: pe.available ? "正文使用增量 CRDT 同步，不会整篇覆盖他人的修改。" : "更改会自动保存为草稿。" })
                ] }),
                /* @__PURE__ */ v("div", { children: [
                  /* @__PURE__ */ d("input", { "aria-label": "发布说明", value: F, maxLength: 2048, onChange: (f) => J(f.target.value), placeholder: "添加发布说明…" }),
                  /* @__PURE__ */ v(ce, { className: "primary", disabled: j === "conflict" || I === "publishing" || !Ce.trim() || pe.available && (pe.state === "error" || pe.state === "connecting" || pe.state === "reconnecting"), onClick: () => {
                    Ec();
                  }, children: [
                    /* @__PURE__ */ d(sd, { size: 14 }),
                    I === "publishing" ? "发布中…" : "发布版本"
                  ] })
                ] })
              ] })
            ] }),
            pe.available && /* @__PURE__ */ v("aside", { className: "knowledge-collaboration-rail", "aria-label": "在线协作", children: [
              /* @__PURE__ */ v("header", { children: [
                /* @__PURE__ */ v("div", { children: [
                  /* @__PURE__ */ d(Fn, { size: 17 }),
                  /* @__PURE__ */ d("strong", { children: "在线协作" })
                ] }),
                /* @__PURE__ */ v("span", { children: [
                  pe.onlineUsers,
                  " 人"
                ] })
              ] }),
              /* @__PURE__ */ v("section", { className: "knowledge-merge-strategy", children: [
                /* @__PURE__ */ d(Ea, { size: 17 }),
                /* @__PURE__ */ v("div", { children: [
                  /* @__PURE__ */ d("strong", { children: "内容冲突自动收敛" }),
                  /* @__PURE__ */ d("p", { children: "正文由 Yjs 按内容块与富文本节点合并；服务端串行确认时钟、校验 Block JSON，并持久化完整检查点。标题按服务端时钟顺序提交。" })
                ] })
              ] }),
              pe.mergeCount > 0 && /* @__PURE__ */ v("p", { className: "knowledge-merge-event", children: [
                /* @__PURE__ */ d(si, { size: 14 }),
                "已自动合并 ",
                pe.mergeCount,
                " 个远端更新",
                pe.mergedUserIDs.length > 0 ? `，来自 ${pe.mergedUserIDs.map((f) => it[f]?.display_name || f).join("、")}` : ""
              ] }),
              /* @__PURE__ */ d("div", { className: "knowledge-collaborator-list", children: pa.map((f) => {
                const V = it[f.userID]?.display_name || f.userID;
                return /* @__PURE__ */ v("div", { className: "knowledge-collaborator", children: [
                  /* @__PURE__ */ v("span", { className: "knowledge-collaborator-avatar", style: { "--collaborator-color": Eo(f.userID) }, children: [
                    V.slice(0, 1).toUpperCase(),
                    /* @__PURE__ */ d("i", {})
                  ] }),
                  /* @__PURE__ */ v("span", { children: [
                    /* @__PURE__ */ v("strong", { children: [
                      V,
                      f.userID === pe.userID && /* @__PURE__ */ d("em", { children: "你" })
                    ] }),
                    /* @__PURE__ */ v("small", { children: [
                      f.cursorBlockID ? `正在编辑内容块 ${f.cursorBlockID.slice(0, 8)}` : "正在查看",
                      f.sessions > 1 ? ` · ${f.sessions} 个设备` : ""
                    ] })
                  ] }),
                  /* @__PURE__ */ v("b", { children: [
                    f.editedBlocks,
                    /* @__PURE__ */ d("small", { children: "编辑块" })
                  ] })
                ] }, f.userID);
              }) }),
              /* @__PURE__ */ v("footer", { children: [
                /* @__PURE__ */ v("span", { children: [
                  /* @__PURE__ */ d(Ca, { size: 13 }),
                  Aa
                ] }),
                pe.state === "error" && /* @__PURE__ */ v(ce, { onClick: pe.reconnect, children: [
                  /* @__PURE__ */ d($t, { size: 13 }),
                  "重新连接"
                ] })
              ] })
            ] })
          ] }),
          Y === "history" && /* @__PURE__ */ v("section", { className: "knowledge-page-history", children: [
            /* @__PURE__ */ d("div", { className: "knowledge-actions", children: /* @__PURE__ */ d(ce, { disabled: me.length !== 2, onClick: () => {
              Dc();
            }, children: "对比所选版本" }) }),
            ie.map((f) => /* @__PURE__ */ v("div", { className: "knowledge-version", children: [
              /* @__PURE__ */ v("label", { children: [
                /* @__PURE__ */ d("input", { type: "checkbox", checked: me.includes(f.version), onChange: (D) => Le((V) => D.target.checked ? [f.version, ...V].slice(0, 2) : V.filter((he) => he !== f.version)) }),
                "版本 ",
                f.version
              ] }),
              /* @__PURE__ */ v("span", { children: [
                it[f.published_by_user_id]?.display_name || "账号不可用",
                " · ",
                new Date(f.published_at).toLocaleString(),
                " · ",
                f.publish_note || "无发布说明",
                " · ",
                f.body.summary || "无摘要"
              ] }),
              /* @__PURE__ */ d(ce, { onClick: () => {
                Mc(f.version);
              }, children: "查看版本" }),
              o && /* @__PURE__ */ d(ce, { onClick: () => {
                Rc(f.version);
              }, children: "恢复为草稿" })
            ] }, f.version)),
            !mt && /* @__PURE__ */ d(ce, { onClick: () => {
              ha();
            }, children: "加载更早版本" }),
            st && /* @__PURE__ */ v("div", { className: "knowledge-version-preview", children: [
              /* @__PURE__ */ v("h4", { children: [
                "版本 ",
                st.version,
                "：",
                st.title
              ] }),
              /* @__PURE__ */ v("p", { className: "knowledge-subtle", children: [
                "页面位置 ",
                st.parent_page_id || "根目录",
                " · 排序 ",
                st.rank
              ] }),
              /* @__PURE__ */ d("div", { className: "knowledge-page-readable typed-readable", children: /* @__PURE__ */ d(ni, { type: st.content_type, body: st.body.content, readOnly: !0, onChange: () => {
              } }) })
            ] }),
            fe && /* @__PURE__ */ v("div", { className: "knowledge-diff", children: [
              /* @__PURE__ */ v("h4", { children: [
                "版本 ",
                fe.from_version,
                " → ",
                fe.to_version
              ] }),
              /* @__PURE__ */ d("pre", { children: fe.content.map((f, D) => /* @__PURE__ */ v("span", { className: `is-${f.kind}`, children: [
                f.kind === "insert" ? "+ " : f.kind === "delete" ? "- " : "  ",
                f.text
              ] }, D)) })
            ] })
          ] }),
          Y === "outline" && /* @__PURE__ */ v("aside", { className: "knowledge-page-outline", "aria-label": "页面大纲", children: [
            /* @__PURE__ */ d("h3", { children: "页面大纲" }),
            ma.length === 0 ? /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "当前发布版本没有标题块。" }) : /* @__PURE__ */ d("ol", { children: ma.map((f) => /* @__PURE__ */ d("li", { style: { paddingInlineStart: `${(f.level - 1) * 12}px` }, children: f.title }, f.key)) })
          ] }),
          Y === "comments" && /* @__PURE__ */ v("section", { className: "knowledge-page-comments", children: [
            /* @__PURE__ */ v("label", { className: "knowledge-checkbox", children: [
              /* @__PURE__ */ d("input", { type: "checkbox", checked: Fe, onChange: (f) => Ke(f.target.checked) }),
              "只看未解决"
            ] }),
            C.page.state === "archived" && /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "页面已归档，评论只读。" }),
            C.published && C.page.state === "active" && /* @__PURE__ */ v("div", { className: "knowledge-comment-create", children: [
              vs && /* @__PURE__ */ v("p", { className: "knowledge-subtle", children: [
                "正在回复评论 ",
                vs,
                /* @__PURE__ */ d("button", { onClick: () => _s(""), children: "取消" })
              ] }),
              /* @__PURE__ */ d("textarea", { value: ge, maxLength: 16384, onChange: (f) => Pe(f.target.value), placeholder: "针对当前发布版本发表评论" }),
              /* @__PURE__ */ v("label", { children: [
                "@ 提及当前资料库成员",
                /* @__PURE__ */ d("input", { value: ks, onChange: (f) => bc(f.target.value), placeholder: "按姓名或邮箱搜索" })
              ] }),
              /* @__PURE__ */ d("div", { className: "knowledge-mention-picker", children: Ac.map((f) => /* @__PURE__ */ v("button", { type: "button", "aria-pressed": sn.includes(f.user_id), onClick: () => Wi((D) => D.includes(f.user_id) ? D.filter((V) => V !== f.user_id) : [...D, f.user_id]), children: [
                "@",
                f.display_name
              ] }, f.user_id)) }),
              sn.length > 0 && /* @__PURE__ */ v("p", { className: "knowledge-subtle", children: [
                "将提及：",
                sn.map((f) => it[f]?.display_name || f).join("、")
              ] }),
              /* @__PURE__ */ d(ce, { disabled: !ge.trim(), onClick: () => {
                zc();
              }, children: "评论" })
            ] }),
            rt.map((f) => /* @__PURE__ */ v("div", { className: `knowledge-comment${f.resolved ? " is-resolved" : ""}${f.parent_comment_id ? " is-reply" : ""}`, children: [
              /* @__PURE__ */ v("header", { children: [
                /* @__PURE__ */ d("strong", { children: it[f.author_user_id]?.display_name || "账号不可用" }),
                /* @__PURE__ */ v("span", { children: [
                  "版本 ",
                  f.published_version,
                  " · ",
                  new Date(f.created_at).toLocaleString()
                ] })
              ] }),
              Vi === f.id ? /* @__PURE__ */ v("div", { className: "knowledge-comment-edit", children: [
                /* @__PURE__ */ d("textarea", { value: ys, maxLength: 16384, onChange: (D) => nn(D.target.value) }),
                /* @__PURE__ */ v("div", { className: "knowledge-actions", children: [
                  /* @__PURE__ */ d(ce, { disabled: !ys.trim(), onClick: () => {
                    Fc(f);
                  }, children: "保存评论" }),
                  /* @__PURE__ */ d(ce, { onClick: () => {
                    ws(""), nn("");
                  }, children: "取消" })
                ] })
              ] }) : /* @__PURE__ */ d("p", { children: f.deleted ? "评论已删除" : f.body }),
              f.anchor.changed && /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "原评论位置已随页面版本变化。" }),
              f.mentioned_user_ids.length > 0 && /* @__PURE__ */ v("p", { className: "knowledge-subtle", children: [
                "提及 ",
                f.mentioned_user_ids.map((D) => `@${it[D]?.display_name || "账号不可用"}`).join("、")
              ] }),
              C.page.state === "active" && !f.deleted && Vi !== f.id && /* @__PURE__ */ v("div", { className: "knowledge-actions", children: [
                /* @__PURE__ */ d(ce, { onClick: () => _s(f.id), children: "回复" }),
                /* @__PURE__ */ d(ce, { onClick: () => {
                  ws(f.id), nn(f.body);
                }, children: "编辑" }),
                /* @__PURE__ */ d(ce, { onClick: () => {
                  Pc(f);
                }, children: f.resolved ? "重新打开" : "标记解决" }),
                /* @__PURE__ */ d(ce, { className: "danger", onClick: () => {
                  Qc(f);
                }, children: "删除" })
              ] })
            ] }, f.id)),
            !qt && /* @__PURE__ */ d(ce, { onClick: () => {
              ua();
            }, children: "加载更多评论" })
          ] }),
          Y === "activity" && /* @__PURE__ */ v("section", { className: "knowledge-page-activity", children: [
            /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "活动由发布版本与评论实时合并，不另存第三份活动记录。" }),
            ga.map((f) => /* @__PURE__ */ v("div", { className: "knowledge-activity-item", children: [
              /* @__PURE__ */ d(Ia, { size: 15 }),
              /* @__PURE__ */ v("span", { children: [
                /* @__PURE__ */ d("strong", { children: f.title }),
                /* @__PURE__ */ v("small", { children: [
                  new Date(f.at).toLocaleString(),
                  " · ",
                  f.detail
                ] })
              ] })
            ] }, f.key)),
            ga.length === 0 && /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "暂无页面活动。" }),
            /* @__PURE__ */ v("div", { className: "knowledge-actions", children: [
              !mt && /* @__PURE__ */ d(ce, { onClick: () => {
                ha();
              }, children: "加载更早发布" }),
              !qt && /* @__PURE__ */ d(ce, { onClick: () => {
                ua();
              }, children: "加载更多评论" })
            ] })
          ] }),
          Y === "access" && e.role === "manager" && /* @__PURE__ */ v("section", { className: "knowledge-page-access", children: [
            /* @__PURE__ */ d("h3", { children: "当前页面访问说明" }),
            /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "结果由服务端同时计算 Identity 功能权限、资料库实时成员角色和页面继承关系。" }),
            /* @__PURE__ */ v("label", { children: [
              "查找用户",
              /* @__PURE__ */ d("input", { value: Is, onChange: (f) => {
                Ki(f.target.value), ea("");
              }, placeholder: "输入姓名或邮箱" })
            ] }),
            /* @__PURE__ */ d("div", { className: "knowledge-principal-results", role: "listbox", children: yc.map((f) => /* @__PURE__ */ v("button", { role: "option", "aria-selected": cn === f.user_id, onClick: () => {
              ea(f.user_id), Ki(f.display_name || f.email || f.user_id), Yi([]);
            }, children: [
              f.avatar_url ? /* @__PURE__ */ d("img", { src: f.avatar_url, alt: "" }) : /* @__PURE__ */ d("span", { "aria-hidden": "true", children: (f.display_name || "?").slice(0, 1) }),
              /* @__PURE__ */ d("strong", { children: f.display_name }),
              /* @__PURE__ */ d("small", { children: f.email })
            ] }, f.user_id)) }),
            /* @__PURE__ */ v("label", { children: [
              "动作",
              /* @__PURE__ */ v("select", { value: Cs, onChange: (f) => kc(f.target.value), children: [
                /* @__PURE__ */ d("option", { value: "knowledge.pages.get", children: "阅读页面" }),
                /* @__PURE__ */ d("option", { value: "knowledge.pages.update", children: "编辑草稿" }),
                /* @__PURE__ */ d("option", { value: "knowledge.pages.publish", children: "发布页面" }),
                /* @__PURE__ */ d("option", { value: "knowledge.page_comments.create", children: "发表评论" })
              ] })
            ] }),
            bt && /* @__PURE__ */ v("div", { className: "knowledge-access-preview", children: [
              /* @__PURE__ */ v("p", { children: [
                /* @__PURE__ */ v("strong", { children: [
                  "最终结论：",
                  bt.final.allowed ? "允许" : "拒绝"
                ] }),
                "（",
                bt.final.label,
                "）"
              ] }),
              /* @__PURE__ */ v("p", { children: [
                "Identity 功能权限：",
                bt.identity.allowed ? "允许" : "拒绝",
                " · ",
                bt.identity.label
              ] }),
              /* @__PURE__ */ v("p", { children: [
                "资料库成员角色：",
                bt.library.allowed ? "允许" : "拒绝",
                " · ",
                bt.library_role || "无成员关系",
                " · ",
                bt.library.label
              ] }),
              /* @__PURE__ */ v("p", { children: [
                "页面权限：",
                bt.page.allowed ? "允许" : "拒绝",
                " · ",
                bt.page.label,
                "；继承来源 ",
                bt.inherited_from || "资料库"
              ] })
            ] })
          ] }),
          Y === "permissions" && e.role === "manager" && r.getPageAccess && r.setPageAccess && /* @__PURE__ */ v("section", { className: "knowledge-page-access knowledge-page-permissions", children: [
            /* @__PURE__ */ d("h3", { children: "页面与子树权限" }),
            /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "管理者始终保留治理访问。受限模式只允许当前资料库成员通过页面或子树 grant 访问，grant 角色不会超过成员的资料库角色。" }),
            Sr ? /* @__PURE__ */ v(at, { children: [
              /* @__PURE__ */ v("label", { children: [
                "访问模式",
                /* @__PURE__ */ v("select", { value: sr, disabled: Br, onChange: (f) => Ns(f.target.value), children: [
                  /* @__PURE__ */ d("option", { value: "inherit", children: "继承资料库角色" }),
                  /* @__PURE__ */ d("option", { value: "restricted", children: "仅管理者和明确授权成员" })
                ] })
              ] }),
              sr === "inherit" ? /* @__PURE__ */ d("p", { className: "knowledge-access-preview", children: "本页完全继承资料库成员角色，不保存额外 grant。" }) : /* @__PURE__ */ v(at, { children: [
                /* @__PURE__ */ v("label", { children: [
                  "查找当前资料库成员",
                  /* @__PURE__ */ d("input", { value: xs, disabled: Br, onChange: (f) => ta(f.target.value), placeholder: "按姓名或邮箱搜索" })
                ] }),
                /* @__PURE__ */ v("div", { className: "knowledge-permission-grant-options", children: [
                  /* @__PURE__ */ v("label", { children: [
                    "授权角色",
                    /* @__PURE__ */ v("select", { value: na, onChange: (f) => _c(f.target.value), children: [
                      /* @__PURE__ */ d("option", { value: "reader", children: "阅读者" }),
                      /* @__PURE__ */ d("option", { value: "editor", children: "编辑者" }),
                      /* @__PURE__ */ d("option", { value: "manager", children: "管理者" })
                    ] })
                  ] }),
                  /* @__PURE__ */ v("label", { children: [
                    "授权范围",
                    /* @__PURE__ */ v("select", { value: sa, onChange: (f) => Ic(f.target.value), children: [
                      /* @__PURE__ */ d("option", { value: "page", children: "仅此页面" }),
                      /* @__PURE__ */ d("option", { value: "subtree", children: "此页面与子树" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ d("div", { className: "knowledge-principal-results", role: "listbox", children: vc.map((f) => /* @__PURE__ */ v("button", { role: "option", onClick: () => Sc(f), children: [
                  /* @__PURE__ */ d("span", { "aria-hidden": "true", children: (f.display_name || "?").slice(0, 1) }),
                  /* @__PURE__ */ d("strong", { children: f.display_name || f.user_id }),
                  /* @__PURE__ */ d("small", { children: f.email })
                ] }, f.user_id)) }),
                /* @__PURE__ */ v("div", { className: "knowledge-permission-grants", children: [
                  Bs.map((f) => /* @__PURE__ */ v("div", { children: [
                    /* @__PURE__ */ v("span", { children: [
                      /* @__PURE__ */ d("strong", { children: it[f.user_id]?.display_name || "账号不可用" }),
                      /* @__PURE__ */ v("small", { children: [
                        f.role === "reader" ? "阅读者" : f.role === "editor" ? "编辑者" : "管理者",
                        " · ",
                        f.scope === "page" ? "仅此页面" : "页面与子树"
                      ] })
                    ] }),
                    /* @__PURE__ */ d(ce, { disabled: Br, onClick: () => Nr((D) => D.filter((V) => V.user_id !== f.user_id || V.scope !== f.scope)), children: "移除" })
                  ] }, `${f.user_id}:${f.scope}`)),
                  Bs.length === 0 && /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "尚未授权任何成员；除管理者外无人可访问。" })
                ] })
              ] }),
              /* @__PURE__ */ v("p", { className: "knowledge-subtle", children: [
                "当前 ACL revision ",
                Sr.revision,
                " · 远端投影 ",
                Sr.projection_status === "ready" ? "已确认" : "确认中（页面已从搜索结果隐藏）"
              ] }),
              /* @__PURE__ */ v(ce, { disabled: Br, onClick: () => {
                Nc();
              }, children: [
                /* @__PURE__ */ d(Sa, { size: 14 }),
                Br ? "正在保存…" : "保存页面权限"
              ] })
            ] }) : /* @__PURE__ */ d("p", { role: "status", children: "正在读取服务端权限…" })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
const km = { hybrid: "混合检索", dense: "语义检索", sparse: "关键词检索" }, vm = {
  embedder_unavailable: "语义向量服务不可用，本次已降级为关键词检索。",
  bm25_unavailable: "关键词召回不可用，本次已降级为语义检索。",
  rerank_unavailable: "精排服务不可用，本次结果使用召回顺序。"
};
function _m(r) {
  if (!r || r.operation !== "search") return null;
  const e = [];
  return r.search_mode && e.push(km[r.search_mode]), Number.isSafeInteger(r.search_top_k) && r.search_top_k > 0 && e.push(`Top ${r.search_top_k}`), r.search_reranked !== void 0 && e.push(r.search_reranked ? "已精排" : "未精排"), {
    summary: e.join(" · "),
    degraded: r.search_degraded_reason ? vm[r.search_degraded_reason] : ""
  };
}
function pc(r) {
  return (r?.citations || []).filter((e) => e && e.doc_id && ["search", "fetch"].includes(e.operation));
}
function Im(r) {
  const e = [], t = /* @__PURE__ */ new Map();
  for (const n of pc(r)) {
    const s = `${n.library_id || ""}:${n.doc_id}`, i = t.get(s);
    if (i === void 0) {
      t.set(s, e.length), e.push({ ...n, matchedPassages: 1 });
      continue;
    }
    const a = e[i], o = Number.isFinite(n.score) ? n.score : Number.NEGATIVE_INFINITY, l = Number.isFinite(a.score) ? a.score : Number.NEGATIVE_INFINITY, h = o > l || !a.excerpt && n.excerpt ? n : a;
    e[i] = { ...h, matchedPassages: a.matchedPassages + 1 };
  }
  return e;
}
const In = { reader: "阅读", editor: "编辑", manager: "管理" };
function No(r) {
  try {
    const e = new URL(r || "");
    return ["https:", "http:"].includes(e.protocol) && !e.username && !e.password && !/[\r\n\t]/.test(r || "") ? e.href : void 0;
  } catch {
    return;
  }
}
function Cn(r) {
  const e = r.location;
  if (!e) return "";
  const t = [];
  return Number.isInteger(e.page) && e.page > 0 && t.push(`第 ${e.page} 页`), Number.isInteger(e.slide) && e.slide > 0 && t.push(`第 ${e.slide} 张幻灯片`), e.section && e.section.length <= 256 && t.push(e.section), e.chunk_id && e.chunk_id.length <= 128 && t.push(`分块 ${e.chunk_id}`), e.sheet && e.sheet.length <= 128 && t.push(`工作表：${e.sheet}`), e.cell && /^[A-Z]{1,3}[1-9][0-9]{0,6}$/.test(e.cell) ? t.push(`单元格 ${e.cell}`) : Number.isInteger(e.row) && e.row > 0 && t.push(Number.isInteger(e.row_end) && e.row_end >= e.row ? `第 ${e.row}–${e.row_end} 行` : `第 ${e.row} 行`), Number.isInteger(e.line) && e.line > 0 && t.push(Number.isInteger(e.line_end) && e.line_end >= e.line ? `第 ${e.line}–${e.line_end} 行` : `第 ${e.line} 行`), Number.isInteger(e.paragraph) && e.paragraph >= 0 && t.push(`第 ${e.paragraph + 1} 段`), e.json_path && e.json_path.length <= 512 && t.push(`JSON ${e.json_path}`), e.html_id && e.html_id.length <= 256 && t.push(`#${e.html_id}`), Number.isInteger(e.start_ms) && e.start_ms >= 0 && t.push(`${e.media_kind === "video" ? "视频" : e.media_kind === "audio" ? "音频" : "媒体"} ${Bo(e.start_ms)}${Number.isInteger(e.end_ms) && e.end_ms > e.start_ms ? `–${Bo(e.end_ms)}` : ""}`), t.join(" · ");
}
function Bo(r) {
  const e = Math.floor(r / 1e3), t = Math.floor(e / 3600), n = Math.floor(e % 3600 / 60), s = e % 60;
  return t ? `${t}:${String(n).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${n}:${String(s).padStart(2, "0")}`;
}
function En(r) {
  const e = [];
  return Number.isSafeInteger(r.document_version) && r.document_version > 0 && e.push(`版本 ${r.document_version}`), r.source_revision && r.source_revision.length <= 128 && e.push(`来源修订 ${r.source_revision}`), Number.isFinite(r.score) && e.push(`相关度 ${r.score.toFixed(3)}`), r.content_sha256 && /^[a-f0-9]{64}$/i.test(r.content_sha256) && e.push(`SHA-256 ${r.content_sha256.slice(0, 12)}…`), e.join(" · ");
}
function Dm({ client: r, navigation: e, formatError: t = er, title: n = "知识库" }) {
  const [s, i] = T("personal"), [a, o] = T(""), [l, h] = T({ query: "", revision: 0 });
  return /* @__PURE__ */ v("main", { className: "knowledge-workspace", children: [
    /* @__PURE__ */ v("header", { className: "knowledge-workspace-header", children: [
      /* @__PURE__ */ v("div", { className: "knowledge-heading", children: [
        e,
        /* @__PURE__ */ v("div", { children: [
          /* @__PURE__ */ v("div", { className: "knowledge-eyebrow", children: [
            "工作空间 ",
            /* @__PURE__ */ d("span", { children: "/" }),
            " 知识库"
          ] }),
          /* @__PURE__ */ d("h1", { children: n })
        ] })
      ] }),
      /* @__PURE__ */ v("form", { className: "knowledge-global-search", role: "search", onSubmit: (p) => {
        p.preventDefault();
        const b = a.trim();
        b && h((m) => ({ query: b, revision: m.revision + 1 }));
      }, children: [
        /* @__PURE__ */ d(wi, { size: 17, "aria-hidden": "true" }),
        /* @__PURE__ */ d("input", { "aria-label": "全文检索当前知识库", value: a, maxLength: 4096, onChange: (p) => o(p.target.value), placeholder: "全文检索当前知识库" }),
        l.query && /* @__PURE__ */ d(ce, { type: "button", "aria-label": "清除全文检索", onClick: () => {
          o(""), h((p) => ({ query: "", revision: p.revision + 1 }));
        }, children: /* @__PURE__ */ d(Xr, { size: 15 }) }),
        /* @__PURE__ */ d(ce, { type: "submit", className: "primary", disabled: !a.trim(), children: "搜索" })
      ] })
    ] }),
    /* @__PURE__ */ v("div", { className: "knowledge-workspace-tabs", role: "tablist", "aria-label": "知识库范围", children: [
      /* @__PURE__ */ v("button", { role: "tab", "aria-selected": s === "personal", onClick: () => i("personal"), children: [
        /* @__PURE__ */ d(Vt, { size: 17 }),
        /* @__PURE__ */ v("span", { children: [
          "个人知识库",
          /* @__PURE__ */ d("small", { children: "仅自己可见的知识空间" })
        ] })
      ] }),
      /* @__PURE__ */ v("button", { role: "tab", "aria-selected": s === "shared", onClick: () => i("shared"), children: [
        /* @__PURE__ */ d(Fn, { size: 17 }),
        /* @__PURE__ */ v("span", { children: [
          "团队知识库",
          /* @__PURE__ */ d("small", { children: "按成员角色共同维护" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d(mc, { client: r, formatError: t, libraryKind: s, searchQuery: l.query, searchRevision: l.revision }, s)
  ] });
}
function Cm({ client: r, formatError: e, library: t, initialQuery: n = "", hideSearchForm: s = !1 }) {
  const [i, a] = T(n), [o, l] = T(n), [h, p] = T(0), [b, m] = T(t?.id || ""), [u, y] = T(t ? [t] : []), [A, w] = T(""), [k, _] = T(null), [B, C] = T(null), [S, z] = T(null), [x, U] = T(!1), [Q, $] = T(!1), [X, N] = T("");
  ye(() => {
    if (t) {
      y([t]), m(t.id), w("");
      return;
    }
    const L = new AbortController();
    return (async () => {
      const le = [], ee = /* @__PURE__ */ new Set();
      let de = "", H = !1;
      for (let O = 0; O < 20 && !H; O += 1) {
        const K = await r.listLibraries(de, 100, L.signal);
        if (L.signal.aborted) return;
        for (const ae of K.items) ee.has(ae.id) || (ee.add(ae.id), le.push(ae));
        if (H = K.complete, H || !K.next_after || K.next_after === de) break;
        de = K.next_after;
      }
      L.signal.aborted || (y(le.filter((O) => O.knowledge_configured)), w(H ? "" : "资料库较多，仅显示前 2000 个可检索资料库。"));
    })().catch(() => {
      L.signal.aborted || w("资料库范围暂时无法读取，仍可检索默认知识源。");
    }), () => L.abort();
  }, [r, t]), ye(() => {
    if (!o) return;
    const L = new AbortController();
    return U(!0), N(""), _(null), C(null), z(null), r.search({ query: o, libraryID: b || void 0, signal: L.signal }).then((le) => {
      L.signal.aborted || _(le);
    }).catch((le) => {
      L.signal.aborted || (_(null), N(e(le)));
    }).finally(() => {
      L.signal.aborted || U(!1);
    }), () => L.abort();
  }, [r, e, b, o, h]);
  const R = ct(() => Im(k), [k]), g = _m(k);
  async function G(L) {
    if (!Q) {
      $(!0), N(""), z(L), C(null);
      try {
        C(await r.read(L.doc_id, L.library_id || b || void 0, AbortSignal.timeout(3e4)));
      } catch (le) {
        N(e(le));
      } finally {
        $(!1);
      }
    }
  }
  const oe = pc(B);
  return /* @__PURE__ */ v("div", { className: "knowledge-browser-body", children: [
    /* @__PURE__ */ v("section", { className: "knowledge-search-column", children: [
      /* @__PURE__ */ v("div", { className: "knowledge-page-intro", children: [
        /* @__PURE__ */ d("span", { children: /* @__PURE__ */ d(Na, { size: 22 }) }),
        /* @__PURE__ */ v("div", { children: [
          /* @__PURE__ */ d("h2", { children: t ? `全文检索「${t.name}」` : "全文检索" }),
          /* @__PURE__ */ d("p", { children: t ? "搜索当前知识库内有权读取的页面与文档。" : "选择默认知识源或一座资料库，再输入主题、问题或关键词。" })
        ] })
      ] }),
      !t && /* @__PURE__ */ v("label", { className: "knowledge-search-scope", children: [
        /* @__PURE__ */ d("span", { children: "检索范围" }),
        /* @__PURE__ */ v("select", { value: b, onChange: (L) => m(L.target.value), children: [
          /* @__PURE__ */ d("option", { value: "", children: "默认知识源" }),
          u.map((L) => /* @__PURE__ */ v("option", { value: L.id, children: [
            L.name,
            L.archived ? "（已归档）" : ""
          ] }, L.id))
        ] })
      ] }),
      A && /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: A }),
      !s && /* @__PURE__ */ v("form", { className: "knowledge-search-form", onSubmit: (L) => {
        L.preventDefault();
        const le = i.trim();
        le && (l(le), p((ee) => ee + 1));
      }, children: [
        /* @__PURE__ */ d(wi, { size: 18 }),
        /* @__PURE__ */ d("input", { "aria-label": "搜索知识库", value: i, maxLength: 4096, onChange: (L) => a(L.target.value), placeholder: "输入主题、问题或关键词" }),
        /* @__PURE__ */ d(ce, { type: "submit", disabled: x || !i.trim(), children: x ? "正在检索…" : "搜索" })
      ] }),
      g?.summary && /* @__PURE__ */ v("p", { className: "knowledge-subtle", children: [
        "检索策略：",
        g.summary
      ] }),
      g?.degraded && /* @__PURE__ */ d("p", { role: "status", className: "knowledge-notice", children: g.degraded }),
      X && /* @__PURE__ */ d("p", { role: "alert", className: "knowledge-error knowledge-page-error", children: X }),
      !o && /* @__PURE__ */ v(Lt, { children: [
        /* @__PURE__ */ d(Na, { size: 30 }),
        /* @__PURE__ */ d("h3", { children: "从一个问题开始" }),
        /* @__PURE__ */ d("p", { children: "知识服务只返回当前账号在所选范围内有权读取的内容。" })
      ] }),
      o && !x && k && R.length === 0 && /* @__PURE__ */ v(Lt, { children: [
        /* @__PURE__ */ d(Tt, { size: 30 }),
        /* @__PURE__ */ d("h3", { children: "没有可展示的文档" }),
        /* @__PURE__ */ d("p", { children: "没有命中相关内容，可以换一个更具体的关键词或检索范围。" })
      ] }),
      R.length > 0 && /* @__PURE__ */ d("div", { className: "knowledge-hit-list", children: R.map((L) => /* @__PURE__ */ v("button", { "aria-current": S?.doc_id === L.doc_id && (S.library_id || b || "") === (L.library_id || b || "") ? "true" : void 0, onClick: () => {
        G(L);
      }, children: [
        /* @__PURE__ */ d("span", { className: "knowledge-hit-icon", children: /* @__PURE__ */ d(Tt, { size: 19 }) }),
        /* @__PURE__ */ v("span", { children: [
          /* @__PURE__ */ d("strong", { children: L.title || L.doc_id }),
          /* @__PURE__ */ d("small", { children: L.excerpt || "打开查看文档内容" }),
          /* @__PURE__ */ v("em", { children: [
            "文档编号：",
            L.doc_id,
            L.matchedPassages > 1 ? ` · 命中 ${L.matchedPassages} 个片段` : "",
            Cn(L) ? ` · ${Cn(L)}` : ""
          ] }),
          En(L) && /* @__PURE__ */ d("em", { children: En(L) })
        ] })
      ] }, `${L.library_id || b || "default"}:${L.doc_id}`)) })
    ] }),
    /* @__PURE__ */ d("aside", { className: "knowledge-reader", "aria-label": "文档阅读区", children: S ? Q ? /* @__PURE__ */ v(Lt, { children: [
      /* @__PURE__ */ d($t, { className: "knowledge-spin", size: 28 }),
      /* @__PURE__ */ d("p", { children: "正在读取文档…" })
    ] }) : B ? /* @__PURE__ */ v(at, { children: [
      /* @__PURE__ */ v("header", { children: [
        /* @__PURE__ */ d("span", { className: "knowledge-reader-icon", children: /* @__PURE__ */ d(Tt, { size: 20 }) }),
        /* @__PURE__ */ v("div", { children: [
          /* @__PURE__ */ d("h2", { children: S.title || B.doc_id || S.doc_id }),
          /* @__PURE__ */ v("p", { children: [
            "文档编号：",
            B.doc_id || S.doc_id,
            B.kb_id ? ` · 知识库 ${B.kb_id}` : ""
          ] })
        ] })
      ] }),
      oe.length ? /* @__PURE__ */ d("article", { className: "knowledge-passages", children: oe.map((L, le) => /* @__PURE__ */ v("section", { children: [
        /* @__PURE__ */ v("small", { children: [
          "片段 ",
          le + 1,
          Cn(L) ? ` · ${Cn(L)}` : "",
          L.excerpt_truncated ? " · 内容已截断" : ""
        ] }),
        En(L) && /* @__PURE__ */ d("small", { children: En(L) }),
        /* @__PURE__ */ d("p", { children: L.excerpt || "此片段没有可展示的正文。" })
      ] }, L.id || `${L.doc_id}:${L.chunk_id || le}`)) }) : /* @__PURE__ */ d("div", { className: "knowledge-raw-document", children: /* @__PURE__ */ d("p", { children: "知识服务返回了文档，但没有生成可展示的正文片段。" }) }),
      No(S.url) && /* @__PURE__ */ d("a", { className: "knowledge-source-link", href: No(S.url), target: "_blank", rel: "noopener noreferrer", children: "打开来源链接 ↗" })
    ] }) : /* @__PURE__ */ v(Lt, { children: [
      /* @__PURE__ */ d(Tt, { size: 34 }),
      /* @__PURE__ */ d("h3", { children: "文档暂时无法显示" }),
      /* @__PURE__ */ d("p", { children: "请重新选择搜索结果。" })
    ] }) : /* @__PURE__ */ v(Lt, { children: [
      /* @__PURE__ */ d(Tt, { size: 34 }),
      /* @__PURE__ */ d("h3", { children: "选择一份文档查看" }),
      /* @__PURE__ */ d("p", { children: "搜索结果会在这里展开。" })
    ] }) })
  ] });
}
function mc({ client: r, formatError: e = er, initialLibraryID: t = "", libraryKind: n, searchQuery: s = "", searchRevision: i = 0 }) {
  const [a, o] = T({ items: [], complete: !0 }), [l, h] = T([""]), [p, b] = T(t), [m, u] = T(null), [y, A] = T(0), [w, k] = T(!0), [_, B] = T(!1), [C, S] = T(""), [z, x] = T(""), [U, Q] = T(""), [$, X] = T(""), [N, R] = T(""), [g, G] = T(null), [oe, L] = T([""]), [le, ee] = T(""), [de, H] = T("reader"), [O, K] = T(""), [ae, se] = T(""), [we, Ae] = T([]), [Y, ue] = T({}), [Ce, _e] = T(null), [Ne, De] = T(!1), [c, Z] = T(!1), [j, E] = T("content"), [I, P] = T(null), te = Be(null), re = Be(!1), F = _ || Ne || c, J = l.at(-1) || "", ie = oe.at(-1) || "", ne = n ? a.items.filter((W) => W.kind === n) : a.items, fe = n !== "shared" && !w && !a.items.some((W) => W.kind === "personal"), Ie = n !== "personal";
  ye(() => {
    const W = new AbortController();
    return k(!0), S(""), (async () => {
      let ge = await r.listLibraries(J, 20, W.signal);
      if (n) {
        const Pe = ge.items.filter((Ye) => Ye.kind === n), Fe = new Set(ge.items.map((Ye) => Ye.id));
        let Ke = ge.next_after, Ve = ge.complete;
        for (let Ye = 1; Pe.length < 20 && !Ve && Ke && Ye < 20; Ye += 1) {
          const qt = await r.listLibraries(Ke, 20, W.signal);
          if (W.signal.aborted) return;
          for (const St of qt.items) Fe.has(St.id) || (Fe.add(St.id), St.kind === n && Pe.push(St));
          Ve = qt.complete, Ke = qt.next_after;
        }
        ge = { items: Pe, next_after: Ve ? void 0 : Ke, complete: Ve };
      }
      W.signal.aborted || (o(ge), b((Pe) => Pe && ge.items.some((Fe) => Fe.id === Pe && (!n || Fe.kind === n)) ? Pe : ge.items.find((Fe) => !n || Fe.kind === n)?.id || ""));
    })().catch((ge) => {
      W.signal.aborted || (o({ items: [], complete: !0 }), S(e(ge)));
    }).finally(() => {
      W.signal.aborted || k(!1);
    }), () => W.abort();
  }, [r, e, J, n, y]), ye(() => {
    if (G(null), K(""), !p) {
      u(null);
      return;
    }
    const W = new AbortController();
    return r.getLibrary(p, W.signal).then(async (ge) => {
      W.signal.aborted || (u(ge), X(ge.name), R(ge.description), ge.role === "manager" && ge.kind === "shared" && G(await r.listMembers(ge.id, ie, 20, W.signal)));
    }).catch((ge) => {
      W.signal.aborted || (u(null), G(null), S(e(ge)));
    }), () => W.abort();
  }, [r, e, ie, y, p]), ye(() => {
    if (!g?.items.length) {
      ue({});
      return;
    }
    const W = new AbortController();
    return r.resolvePrincipals(g.items.map((ge) => ge.user_id), W.signal).then((ge) => {
      W.signal.aborted || ue(Object.fromEntries(ge.filter((Pe) => Pe.status === "active").map((Pe) => [Pe.user_id, Pe])));
    }).catch(() => {
      W.signal.aborted || ue({});
    }), () => W.abort();
  }, [r, g]), ye(() => {
    i < 1 || E(s ? "search" : "content");
  }, [s, i]), ye(() => {
    const W = ae.trim();
    if (!W || !m || m.role !== "manager") {
      Ae([]);
      return;
    }
    const ge = new AbortController(), Pe = window.setTimeout(() => {
      r.searchPrincipals(W, "", 20, ge.signal).then((Fe) => {
        ge.signal.aborted || Ae(Fe.items.filter((Ke) => Ke.status === "active"));
      }).catch(() => {
        ge.signal.aborted || Ae([]);
      });
    }, 250);
    return () => {
      window.clearTimeout(Pe), ge.abort();
    };
  }, [r, ae, m]), ye(() => {
    if (!m || !le) {
      _e(null);
      return;
    }
    const W = new AbortController();
    return r.explainAccess(m.id, { user_id: le, action: "knowledge.pages.get", proposed_role: de }, W.signal).then((ge) => {
      W.signal.aborted || _e(ge);
    }).catch(() => {
      W.signal.aborted || _e(null);
    }), () => W.abort();
  }, [r, de, m, le]);
  async function me(W) {
    if (!(re.current || Ne || c)) {
      re.current = !0, B(!0), S(""), x("");
      try {
        await W(AbortSignal.timeout(6e4));
      } catch (ge) {
        S(e(ge));
      } finally {
        re.current = !1, B(!1), A((ge) => ge + 1);
      }
    }
  }
  function Le(W, ge) {
    b(W.id), u(W), L([""]), x(ge);
  }
  async function pt(W, ge) {
    const Pe = W === "personal" ? "个人知识库" : U.trim();
    if (!Pe) return;
    const Fe = te.current;
    if (Fe && (Fe.kind !== W || Fe.name !== Pe)) throw Error("上次创建结果待确认；重试时需保持资料库名称不变。");
    const Ke = Fe || { kind: W, name: Pe, clientID: crypto.randomUUID() };
    te.current = Ke;
    const Ve = await r.createLibrary(Ke, ge);
    te.current = null, Q(""), Le(Ve, W === "personal" ? "个人知识库已创建。" : "团队知识库已创建，当前只有你一位成员。");
  }
  async function Ze(W) {
    m && Le(await r.updateLibrary(m.id, { name: $.trim(), description: N, archived: m.archived, expectedRevision: m.revision }, W), "资料库设置已保存。");
  }
  async function mt(W) {
    m && Le(await r.setLibraryArchived(m.id, !m.archived, m.revision, W), m.archived ? "资料库已恢复。" : "资料库已归档。");
  }
  async function Me(W) {
    !m || !le.trim() || (Le(await r.setMember(m.id, le.trim(), de, g?.revision ?? m.revision, W), "成员角色已保存，后续访问使用新权限。"), ee(""), se(""), Ae([]), _e(null));
  }
  async function st(W) {
    !m || !O || (Le(await r.removeMember(m.id, O, g?.revision ?? m.revision, W), "成员已移出资料库。"), K(""));
  }
  function zt(W) {
    b(W.id), L([""]), E("content"), P(null);
  }
  function rt(W) {
    return /* @__PURE__ */ v("button", { "aria-current": p === W.id ? "true" : void 0, disabled: F, onClick: () => zt(W), children: [
      /* @__PURE__ */ d(Vt, { size: 18 }),
      /* @__PURE__ */ v("span", { children: [
        /* @__PURE__ */ d("strong", { children: W.name }),
        /* @__PURE__ */ v("small", { children: [
          W.kind === "personal" ? "仅自己可见" : `${In[W.role] || W.role}权限`,
          W.archived ? " · 已归档" : ""
        ] })
      ] })
    ] }, W.id);
  }
  return /* @__PURE__ */ v("div", { className: `managed-library-browser${n === "personal" ? " is-personal" : ""}`, children: [
    /* @__PURE__ */ v("aside", { className: "managed-library-list", children: [
      /* @__PURE__ */ v("div", { children: [
        /* @__PURE__ */ d("h2", { children: n === "personal" ? "个人知识库" : n === "shared" ? "团队知识库" : "知识库" }),
        /* @__PURE__ */ d(ce, { "aria-label": "刷新知识库", disabled: F || w, onClick: () => A((W) => W + 1), children: /* @__PURE__ */ d($t, { size: 14 }) })
      ] }),
      (fe || Ie) && /* @__PURE__ */ v("div", { className: "knowledge-library-create", children: [
        fe && /* @__PURE__ */ v(ce, { disabled: F, onClick: () => {
          me((W) => pt("personal", W));
        }, children: [
          /* @__PURE__ */ d(Vt, { size: 15 }),
          "创建个人知识库"
        ] }),
        Ie && /* @__PURE__ */ v("div", { children: [
          /* @__PURE__ */ d("input", { "aria-label": "新团队知识库名称", maxLength: 128, value: U, disabled: F, onChange: (W) => Q(W.target.value), placeholder: "新团队知识库名称" }),
          /* @__PURE__ */ d(ce, { "aria-label": "创建团队知识库", disabled: F || !U.trim(), onClick: () => {
            me((W) => pt("shared", W));
          }, children: /* @__PURE__ */ d(Do, { size: 15 }) })
        ] })
      ] }),
      m && !a.items.some((W) => W.id === m.id) && /* @__PURE__ */ v("button", { "aria-current": "true", disabled: F, children: [
        /* @__PURE__ */ d(Vt, { size: 18 }),
        /* @__PURE__ */ v("span", { children: [
          /* @__PURE__ */ d("strong", { children: m.name }),
          /* @__PURE__ */ d("small", { children: "当前知识库 · 不在本页" })
        ] })
      ] }),
      w ? /* @__PURE__ */ d("p", { className: "knowledge-subtle", children: "正在读取知识库…" }) : ne.length ? ne.map(rt) : /* @__PURE__ */ d("p", { className: "knowledge-library-group-empty", children: n === "personal" ? "尚未创建个人知识库" : n === "shared" ? "尚未加入团队知识库" : "暂无可访问的知识库" }),
      (l.length > 1 || !a.complete) && /* @__PURE__ */ v("nav", { className: "knowledge-pagination", children: [
        /* @__PURE__ */ d(ce, { disabled: F || w || l.length === 1, onClick: () => {
          b(""), h((W) => W.slice(0, -1));
        }, children: "上一页" }),
        /* @__PURE__ */ d(ce, { disabled: F || w || !a.next_after, onClick: () => {
          b(""), h((W) => [...W, a.next_after]);
        }, children: "下一页" })
      ] }),
      C && /* @__PURE__ */ d("p", { role: "alert", className: "knowledge-error", children: C })
    ] }),
    /* @__PURE__ */ v("section", { className: "managed-library-content", children: [
      z && /* @__PURE__ */ d("p", { role: "status", className: "knowledge-notice", children: z }),
      m ? /* @__PURE__ */ v(at, { children: [
        /* @__PURE__ */ d("div", { className: `knowledge-library-surface${j === "search" ? " is-search" : " is-pages"}`, children: j === "search" ? /* @__PURE__ */ d(Cm, { client: r, formatError: e, library: m, initialQuery: s, hideSearchForm: !0 }, `${m.id}:${i}`) : /* @__PURE__ */ d(ym, { client: r, library: m, disabled: F, formatError: e, embedded: !0, onManage: m.role === "manager" ? () => P("manage") : void 0, documents: ({ selectedDocumentID: W, showUploader: ge, onDocumentsChange: Pe, onSelectedDocumentChange: Fe }) => /* @__PURE__ */ d(Mu, { client: r, initialLibrary: m, formatError: e, onBusyChange: De, onOpenLibrary: (Ke) => {
          b(Ke), L([""]), A((Ve) => Ve + 1);
        }, embedded: !0, hideList: !0, showUploader: ge, selectedDocumentID: W, onSelectedDocumentChange: Fe, onDocumentsChange: Pe }, m.id) }) }),
        I === "manage" && m.role === "manager" && Wr(/* @__PURE__ */ d("div", { className: "knowledge-modal-backdrop", role: "presentation", onMouseDown: (W) => {
          W.target === W.currentTarget && !F && P(null);
        }, children: /* @__PURE__ */ v("section", { className: "knowledge-manager-dialog knowledge-library-management-dialog", role: "dialog", "aria-modal": "true", "aria-label": "知识库管理", children: [
          /* @__PURE__ */ v("header", { children: [
            /* @__PURE__ */ v("div", { children: [
              /* @__PURE__ */ v("h2", { children: [
                "管理“",
                m.name,
                "”"
              ] }),
              /* @__PURE__ */ d("p", { children: "维护知识库信息、成员权限与外部内容连接。" })
            ] }),
            /* @__PURE__ */ d(ce, { "aria-label": "关闭知识库管理", disabled: F, onClick: () => P(null), children: /* @__PURE__ */ d(Xr, { size: 17 }) })
          ] }),
          /* @__PURE__ */ v("div", { className: "knowledge-dialog-scroll knowledge-management-sections", children: [
            /* @__PURE__ */ v("section", { className: "knowledge-settings", children: [
              /* @__PURE__ */ d("header", { children: /* @__PURE__ */ v("div", { children: [
                /* @__PURE__ */ d("h3", { children: "基本信息" }),
                /* @__PURE__ */ d("p", { children: "名称和说明会展示给所有知识库成员。" })
              ] }) }),
              /* @__PURE__ */ v("div", { className: "knowledge-form-grid", children: [
                /* @__PURE__ */ v("label", { children: [
                  "名称",
                  /* @__PURE__ */ d("input", { value: $, maxLength: 128, disabled: F, onChange: (W) => X(W.target.value) })
                ] }),
                /* @__PURE__ */ v("label", { children: [
                  "说明",
                  /* @__PURE__ */ d("textarea", { value: N, maxLength: 1024, disabled: F, onChange: (W) => R(W.target.value) })
                ] })
              ] }),
              /* @__PURE__ */ v("div", { className: "knowledge-actions", children: [
                /* @__PURE__ */ d(ce, { className: "primary", disabled: F || !$.trim(), onClick: () => {
                  me(Ze);
                }, children: "保存信息" }),
                /* @__PURE__ */ d(ce, { className: m.archived ? void 0 : "danger", disabled: F, onClick: () => {
                  me(mt);
                }, children: m.archived ? "恢复知识库" : "归档知识库" })
              ] })
            ] }),
            m.kind === "shared" && /* @__PURE__ */ v("section", { className: "knowledge-members", children: [
              /* @__PURE__ */ d("header", { children: /* @__PURE__ */ v("div", { children: [
                /* @__PURE__ */ d("h3", { children: "成员与角色" }),
                /* @__PURE__ */ d("p", { children: "阅读者可查看与评论，编辑者可维护内容，管理者负责成员及配置。至少保留一位管理者。" })
              ] }) }),
              /* @__PURE__ */ d("div", { className: "knowledge-member-list", children: g?.items.map((W) => {
                const ge = Y[W.user_id];
                return /* @__PURE__ */ v("div", { className: "knowledge-member", children: [
                  /* @__PURE__ */ d("span", { className: "knowledge-member-avatar", "aria-hidden": "true", children: (ge?.display_name || "?").slice(0, 1) }),
                  /* @__PURE__ */ v("span", { children: [
                    ge?.display_name || "账号不可用",
                    /* @__PURE__ */ v("small", { children: [
                      ge?.email || W.user_id,
                      " · ",
                      In[W.role]
                    ] })
                  ] }),
                  /* @__PURE__ */ d(ce, { disabled: F, onClick: () => {
                    ee(W.user_id), se(ge?.display_name || W.user_id), H(W.role), K("");
                  }, children: "调整" }),
                  /* @__PURE__ */ d(ce, { className: "danger", disabled: F, onClick: () => K(W.user_id), children: "移除" })
                ] }, W.user_id);
              }) }),
              g && (oe.length > 1 || !g.complete) && /* @__PURE__ */ v("nav", { className: "knowledge-pagination", children: [
                /* @__PURE__ */ d(ce, { disabled: F || oe.length === 1, onClick: () => L((W) => W.slice(0, -1)), children: "上一页" }),
                /* @__PURE__ */ d(ce, { disabled: F || !g.next_after, onClick: () => L((W) => [...W, g.next_after]), children: "下一页" })
              ] }),
              /* @__PURE__ */ v("div", { className: "knowledge-member-editor", children: [
                /* @__PURE__ */ v("label", { children: [
                  "搜索工作区成员",
                  /* @__PURE__ */ d("input", { value: ae, maxLength: 255, disabled: F, onChange: (W) => {
                    se(W.target.value), ee("");
                  }, placeholder: "输入姓名或邮箱" })
                ] }),
                we.length > 0 && /* @__PURE__ */ d("div", { className: "knowledge-principal-results", role: "listbox", children: we.map((W) => /* @__PURE__ */ v("button", { role: "option", "aria-selected": le === W.user_id, onClick: () => {
                  ee(W.user_id), se(W.display_name || W.email || W.user_id), Ae([]);
                }, children: [
                  W.avatar_url ? /* @__PURE__ */ d("img", { src: W.avatar_url, alt: "" }) : /* @__PURE__ */ d("span", { "aria-hidden": "true", children: (W.display_name || "?").slice(0, 1) }),
                  /* @__PURE__ */ d("strong", { children: W.display_name || W.user_id }),
                  /* @__PURE__ */ d("small", { children: W.email })
                ] }, W.user_id)) }),
                /* @__PURE__ */ v("label", { children: [
                  "角色",
                  /* @__PURE__ */ d("select", { value: de, disabled: F, onChange: (W) => H(W.target.value), children: Object.entries(In).map(([W, ge]) => /* @__PURE__ */ d("option", { value: W, children: ge }, W)) })
                ] }),
                /* @__PURE__ */ d(ce, { className: "primary", disabled: F || !le, onClick: () => {
                  me(Me);
                }, children: "保存成员角色" })
              ] }),
              Ce && /* @__PURE__ */ v("div", { className: "knowledge-access-preview", children: [
                /* @__PURE__ */ d("strong", { children: "邀请前访问预览" }),
                /* @__PURE__ */ v("p", { children: [
                  "Identity 功能权限：",
                  Ce.identity.allowed ? "允许" : "拒绝",
                  "；拟授予知识库角色：",
                  In[de],
                  "；影响 ",
                  Ce.impact_pages,
                  " 个活动页面。"
                ] }),
                /* @__PURE__ */ v("p", { children: [
                  "最终页面阅读：",
                  Ce.final.allowed ? "允许" : "拒绝",
                  "。页面权限继承自知识库，不存在前端自算 ACL。"
                ] })
              ] }),
              O && /* @__PURE__ */ v("div", { className: "knowledge-confirm", children: [
                /* @__PURE__ */ v("p", { children: [
                  "将“",
                  Y[O]?.display_name || "账号不可用",
                  "”移出“",
                  m.name,
                  "”？该成员将失去知识库访问权限。"
                ] }),
                /* @__PURE__ */ v("div", { className: "knowledge-actions", children: [
                  /* @__PURE__ */ d(ce, { className: "danger", disabled: F, onClick: () => {
                    me(st);
                  }, children: "确认移除" }),
                  /* @__PURE__ */ d(ce, { disabled: F, onClick: () => K(""), children: "保留成员" })
                ] })
              ] })
            ] }),
            m.sources_manageable && /* @__PURE__ */ d(zu, { client: r, library: m, disabled: _ || Ne, formatError: e, onBusyChange: Z, onBound: (W) => {
              u(W), A((ge) => ge + 1);
            } }),
            C && /* @__PURE__ */ d("p", { role: "alert", className: "knowledge-error", children: C })
          ] })
        ] }) }), window.document.body)
      ] }) : w ? null : /* @__PURE__ */ v(Lt, { children: [
        /* @__PURE__ */ d(fd, { size: 32 }),
        /* @__PURE__ */ d("h3", { children: ne.length > 0 ? "请选择知识库" : n === "personal" ? "还没有个人知识库" : "还没有可访问的团队知识库" }),
        /* @__PURE__ */ d("p", { children: n === "personal" ? "打开个人知识库后，可在自己的空间内检索、编辑和整理内容。" : "创建团队知识库，或请团队管理员将你添加为成员。" })
      ] })
    ] })
  ] });
}
function Mm({ client: r, formatError: e = er, onClose: t }) {
  const [n, s] = T("personal");
  return Wr(/* @__PURE__ */ d("div", { className: "knowledge-modal-backdrop", role: "presentation", children: /* @__PURE__ */ v("section", { className: "knowledge-manager-dialog", role: "dialog", "aria-modal": "true", "aria-label": "知识库", children: [
    /* @__PURE__ */ v("header", { children: [
      /* @__PURE__ */ v("div", { children: [
        /* @__PURE__ */ d("h2", { children: "知识库" }),
        /* @__PURE__ */ d("p", { children: "个人知识库仅自己可见；团队知识库按成员角色共同维护。" })
      ] }),
      /* @__PURE__ */ d(ce, { "aria-label": "关闭", onClick: t, children: /* @__PURE__ */ d(Xr, { size: 17 }) })
    ] }),
    /* @__PURE__ */ v("div", { className: "knowledge-workspace-tabs", role: "tablist", "aria-label": "知识库范围", children: [
      /* @__PURE__ */ v("button", { role: "tab", "aria-selected": n === "personal", onClick: () => s("personal"), children: [
        /* @__PURE__ */ d(Vt, { size: 17 }),
        /* @__PURE__ */ d("span", { children: "个人知识库" })
      ] }),
      /* @__PURE__ */ v("button", { role: "tab", "aria-selected": n === "shared", onClick: () => s("shared"), children: [
        /* @__PURE__ */ d(Fn, { size: 17 }),
        /* @__PURE__ */ d("span", { children: "团队知识库" })
      ] })
    ] }),
    /* @__PURE__ */ d(mc, { client: r, formatError: e, libraryKind: n }, n)
  ] }) }), window.document.body);
}
export {
  ce as B,
  Su as F,
  mc as K,
  An as a,
  xm as b,
  wn as c,
  Mm as d,
  vo as e,
  ym as f,
  Kd as g,
  Dm as h,
  Oo as i,
  Ho as j,
  $d as k,
  Td as l,
  jo as m,
  Am as n,
  As as p,
  um as s
};
