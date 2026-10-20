import { jsx as h, jsxs as _, Fragment as at } from "react/jsx-runtime";
import { useRef as Be, useState as L, useEffect as ve, useMemo as dt, useCallback as sd, lazy as Rt, Suspense as id } from "react";
import { createPortal as tn } from "react-dom";
import { X as rn, Download as $o, RefreshCw as jt, Upload as $n, FileText as Lt, Eye as ad, RotateCcw as od, Trash2 as ld, Check as ci, Link2 as xa, BookOpen as $t, Search as Ei, Plus as Ho, Settings as cd, ChevronDown as dd, ChevronRight as Da, ArrowUp as ud, ArrowDown as hd, FilePlus2 as fd, Pencil as gd, Clock3 as pd, MessageSquare as md, Activity as Ma, ListTree as jo, ShieldCheck as bd, Users as Hn, Copy as wd, MoreHorizontal as Ad, Cloud as yd, Wifi as Ra, Paperclip as kd, GitMerge as za, Save as Pa, Send as _d, GitBranch as vd, Network as Id, Paintbrush as Cd, ListChecks as Ed, Presentation as Sd, FileSpreadsheet as Nd, LayoutGrid as Bd, Table2 as xd, FolderOpen as Dd, FileSearch as Fa } from "lucide-react";
function le({ className: r = "", ...e }) {
  return /* @__PURE__ */ h("button", { className: `knowledge-button ${r}`.trim(), ...e });
}
function Ut({ children: r }) {
  return /* @__PURE__ */ h("div", { className: "knowledge-page-empty", children: r });
}
function tr(r) {
  return r instanceof DOMException && r.name === "AbortError" ? "操作已取消。" : r instanceof Error && r.message ? r.message : "知识库暂时不可用，请稍后重试。";
}
function zn(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(a) {
      a(i);
    });
  }
  return new (t || (t = Promise))(function(i, a) {
    function o(f) {
      try {
        d(n.next(f));
      } catch (g) {
        a(g);
      }
    }
    function l(f) {
      try {
        d(n.throw(f));
      } catch (g) {
        a(g);
      }
    }
    function d(f) {
      f.done ? i(f.value) : s(f.value).then(o, l);
    }
    d((n = n.apply(r, [])).next());
  });
}
class Le {
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
    return zn(this, void 0, void 0, function* () {
      const t = yield this.lock();
      try {
        return yield Promise.resolve(e());
      } finally {
        t();
      }
    });
  }
}
var js;
function Md() {
  return typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global;
}
const di = Md(), qs = (js = di.Buffer) !== null && js !== void 0 ? js : null, Rd = di.TextEncoder ? new di.TextEncoder() : null;
function qo(r, e) {
  return (r & 15) + (r >> 6 | r >> 3 & 8) << 4 | (e & 15) + (e >> 6 | e >> 3 & 8);
}
function zd(r, e) {
  const t = e.length >> 1;
  for (let n = 0; n < t; n++) {
    const s = n << 1;
    r[n] = qo(e.charCodeAt(s), e.charCodeAt(s + 1));
  }
}
function Pd(r, e) {
  if (r.length !== e.length * 2)
    return !1;
  for (let t = 0; t < e.length; t++) {
    const n = t << 1;
    if (e[t] !== qo(r.charCodeAt(n), r.charCodeAt(n + 1)))
      return !1;
  }
  return !0;
}
const Ta = 87, Qa = 48;
function La(r, e, t) {
  let n = 0;
  for (let s = 0; s < t; s++) {
    let i = e[s] >>> 4;
    r[n++] = i > 9 ? i + Ta : i + Qa, i = e[s] & 15, r[n++] = i > 9 ? i + Ta : i + Qa;
  }
  return String.fromCharCode.apply(null, r);
}
const Ua = qs !== null ? (r) => {
  if (typeof r == "string") {
    const e = qs.from(r, "utf8");
    return new Uint8Array(e.buffer, e.byteOffset, e.length);
  }
  if (qs.isBuffer(r))
    return new Uint8Array(r.buffer, r.byteOffset, r.length);
  if (ArrayBuffer.isView(r))
    return new Uint8Array(r.buffer, r.byteOffset, r.byteLength);
  throw new Error("Invalid data type!");
} : (r) => {
  if (typeof r == "string")
    return Rd.encode(r);
  if (ArrayBuffer.isView(r))
    return new Uint8Array(r.buffer, r.byteOffset, r.byteLength);
  throw new Error("Invalid data type!");
}, Oa = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Or = new Uint8Array(256);
for (let r = 0; r < Oa.length; r++)
  Or[Oa.charCodeAt(r)] = r;
function Fd(r) {
  let e = Math.floor(r.length * 0.75);
  const t = r.length;
  return r[t - 1] === "=" && (e -= 1, r[t - 2] === "=" && (e -= 1)), e;
}
function Td(r) {
  const e = Fd(r), t = r.length, n = new Uint8Array(e);
  let s = 0;
  for (let i = 0; i < t; i += 4) {
    const a = Or[r.charCodeAt(i)], o = Or[r.charCodeAt(i + 1)], l = Or[r.charCodeAt(i + 2)], d = Or[r.charCodeAt(i + 3)];
    n[s] = a << 2 | o >> 4, s += 1, n[s] = (o & 15) << 4 | l >> 2, s += 1, n[s] = (l & 3) << 6 | d & 63, s += 1;
  }
  return n;
}
const _n = 16 * 1024, Fr = 4, Qd = new Le(), Gs = /* @__PURE__ */ new Map();
function Ld(r, e) {
  return zn(this, void 0, void 0, function* () {
    let t = null, n = null, s = !1;
    if (typeof WebAssembly > "u")
      throw new Error("WebAssembly is not supported in this environment!");
    const i = (z, x = 0) => {
      n.set(z, x);
    }, a = () => n, o = () => t.exports, l = (z) => {
      t.exports.Hash_SetMemorySize(z);
      const x = t.exports.Hash_GetBuffer(), U = t.exports.memory.buffer;
      n = new Uint8Array(U, x, z);
    }, d = () => new DataView(t.exports.memory.buffer).getUint32(t.exports.STATE_SIZE, !0), f = Qd.dispatch(() => zn(this, void 0, void 0, function* () {
      if (!Gs.has(r.name)) {
        const x = Td(r.data), U = WebAssembly.compile(x);
        Gs.set(r.name, U);
      }
      const z = yield Gs.get(r.name);
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
    })), g = () => zn(this, void 0, void 0, function* () {
      t || (yield f);
      const z = t.exports.Hash_GetBuffer(), x = t.exports.memory.buffer;
      n = new Uint8Array(x, z, _n);
    }), m = (z = null) => {
      s = !0, t.exports.Hash_Init(z);
    }, u = (z) => {
      let x = 0;
      for (; x < z.length; ) {
        const U = z.subarray(x, x + _n);
        x += U.length, n.set(U), t.exports.Hash_Update(U.length);
      }
    }, y = (z) => {
      if (!s)
        throw new Error("update() called before init()");
      const x = Ua(z);
      u(x);
    }, w = new Uint8Array(e * 2), A = (z, x = null) => {
      if (!s)
        throw new Error("digest() called before init()");
      return s = !1, t.exports.Hash_Final(x), z === "binary" ? n.slice(0, e) : La(w, n, e);
    }, k = () => {
      if (!s)
        throw new Error("save() can only be called after init() and before digest()");
      const z = t.exports.Hash_GetState(), x = d(), U = t.exports.memory.buffer, Q = new Uint8Array(U, z, x), O = new Uint8Array(Fr + x);
      return zd(O, r.hash), O.set(Q, Fr), O;
    }, v = (z) => {
      if (!(z instanceof Uint8Array))
        throw new Error("load() expects an Uint8Array generated by save()");
      const x = t.exports.Hash_GetState(), U = d(), Q = Fr + U, O = t.exports.memory.buffer;
      if (z.length !== Q)
        throw new Error(`Bad state length (expected ${Q} bytes, got ${z.length})`);
      if (!Pd(r.hash, z.subarray(0, Fr)))
        throw new Error("This state was written by an incompatible hash implementation");
      const K = z.subarray(Fr);
      new Uint8Array(O, x, U).set(K), s = !0;
    }, N = (z) => typeof z == "string" ? z.length < _n / 4 : z.byteLength < _n;
    let E = N;
    switch (r.name) {
      case "argon2":
      case "scrypt":
        E = () => !0;
        break;
      case "blake2b":
      case "blake2s":
        E = (z, x) => x <= 512 && N(z);
        break;
      case "blake3":
        E = (z, x) => x === 0 && N(z);
        break;
      case "xxhash64":
      // cannot simplify
      case "xxhash3":
      case "xxhash128":
      case "crc64":
        E = () => !1;
        break;
    }
    const S = (z, x = null, U = null) => {
      if (!E(z, x))
        return m(x), y(z), A("hex", U);
      const Q = Ua(z);
      return n.set(Q), t.exports.Hash_Calculate(Q.length, x, U), La(w, n, e);
    };
    return yield g(), {
      getMemory: a,
      writeMemory: i,
      getExports: o,
      setMemorySize: l,
      init: m,
      update: y,
      digest: A,
      save: k,
      load: v,
      calculate: S,
      hashLength: e
    };
  });
}
new Le();
new Le();
new Le();
new Le();
new Le();
new Le();
new Le();
new Le();
new Le();
new Le();
new Le();
var Ud = "sha256", Od = "AGFzbQEAAAABEQRgAAF/YAF/AGAAAGACf38AAwgHAAEBAQIAAwUEAQECAgYOAn8BQfCJBQt/AEGACAsHcAgGbWVtb3J5AgAOSGFzaF9HZXRCdWZmZXIAAAlIYXNoX0luaXQAAQtIYXNoX1VwZGF0ZQACCkhhc2hfRmluYWwABA1IYXNoX0dldFN0YXRlAAUOSGFzaF9DYWxjdWxhdGUABgpTVEFURV9TSVpFAwEKnEoHBQBBgAkLnQEAQQBCADcDwIkBQQBBHEEgIABB4AFGIgAbNgLoiQFBAEKnn+anxvST/b5/Qquzj/yRo7Pw2wAgABs3A+CJAUEAQrGWgP6fooWs6ABC/6S5iMWR2oKbfyAAGzcD2IkBQQBCl7rDg5Onlod3QvLmu+Ojp/2npX8gABs3A9CJAUEAQti9loj8oLW+NkLnzKfQ1tDrs7t/IAAbNwPIiQEL7wICAX4Gf0EAQQApA8CJASIBIACtfDcDwIkBAkACQAJAIAGnQT9xIgINAEGACSEDDAELAkBBwAAgAmsiBCAAIAQgAEkbIgNFDQAgA0EDcSEFIAJBgIkBaiEGQQAhAgJAIANBBEkNACADQfwAcSEHQQAhAgNAIAYgAmoiAyACQYAJai0AADoAACADQQFqIAJBgQlqLQAAOgAAIANBAmogAkGCCWotAAA6AAAgA0EDaiACQYMJai0AADoAACAHIAJBBGoiAkcNAAsLIAVFDQADQCAGIAJqIAJBgAlqLQAAOgAAIAJBAWohAiAFQX9qIgUNAAsLIAAgBEkNAUGAiQEQAyAAIARrIQAgBEGACWohAwsCQCAAQcAASQ0AA0AgAxADIANBwABqIQMgAEFAaiIAQT9LDQALCyAARQ0AQQAhAkEAIQUDQCACQYCJAWogAyACai0AADoAACACQQFqIQIgACAFQQFqIgVB/wFxSw0ACwsLoz4BRX9BACAAKAI8IgFBGHQgAUGA/gNxQQh0ciABQQh2QYD+A3EgAUEYdnJyIgFBGXcgAUEOd3MgAUEDdnMgACgCOCICQRh0IAJBgP4DcUEIdHIgAkEIdkGA/gNxIAJBGHZyciICaiAAKAIgIgNBGHQgA0GA/gNxQQh0ciADQQh2QYD+A3EgA0EYdnJyIgRBGXcgBEEOd3MgBEEDdnMgACgCHCIDQRh0IANBgP4DcUEIdHIgA0EIdkGA/gNxIANBGHZyciIFaiAAKAIEIgNBGHQgA0GA/gNxQQh0ciADQQh2QYD+A3EgA0EYdnJyIgZBGXcgBkEOd3MgBkEDdnMgACgCACIDQRh0IANBgP4DcUEIdHIgA0EIdkGA/gNxIANBGHZyciIHaiAAKAIkIgNBGHQgA0GA/gNxQQh0ciADQQh2QYD+A3EgA0EYdnJyIghqIAJBD3cgAkENd3MgAkEKdnNqIgNqIAAoAhgiCUEYdCAJQYD+A3FBCHRyIAlBCHZBgP4DcSAJQRh2cnIiCkEZdyAKQQ53cyAKQQN2cyAAKAIUIglBGHQgCUGA/gNxQQh0ciAJQQh2QYD+A3EgCUEYdnJyIgtqIAJqIAAoAhAiCUEYdCAJQYD+A3FBCHRyIAlBCHZBgP4DcSAJQRh2cnIiDEEZdyAMQQ53cyAMQQN2cyAAKAIMIglBGHQgCUGA/gNxQQh0ciAJQQh2QYD+A3EgCUEYdnJyIg1qIAAoAjAiCUEYdCAJQYD+A3FBCHRyIAlBCHZBgP4DcSAJQRh2cnIiDmogACgCCCIJQRh0IAlBgP4DcUEIdHIgCUEIdkGA/gNxIAlBGHZyciIPQRl3IA9BDndzIA9BA3ZzIAZqIAAoAigiCUEYdCAJQYD+A3FBCHRyIAlBCHZBgP4DcSAJQRh2cnIiEGogAUEPdyABQQ13cyABQQp2c2oiCUEPdyAJQQ13cyAJQQp2c2oiEUEPdyARQQ13cyARQQp2c2oiEkEPdyASQQ13cyASQQp2c2oiE2ogACgCNCIUQRh0IBRBgP4DcUEIdHIgFEEIdkGA/gNxIBRBGHZyciIVQRl3IBVBDndzIBVBA3ZzIA5qIBJqIAAoAiwiAEEYdCAAQYD+A3FBCHRyIABBCHZBgP4DcSAAQRh2cnIiFkEZdyAWQQ53cyAWQQN2cyAQaiARaiAIQRl3IAhBDndzIAhBA3ZzIARqIAlqIAVBGXcgBUEOd3MgBUEDdnMgCmogAWogC0EZdyALQQ53cyALQQN2cyAMaiAVaiANQRl3IA1BDndzIA1BA3ZzIA9qIBZqIANBD3cgA0ENd3MgA0EKdnNqIhRBD3cgFEENd3MgFEEKdnNqIhdBD3cgF0ENd3MgF0EKdnNqIhhBD3cgGEENd3MgGEEKdnNqIhlBD3cgGUENd3MgGUEKdnNqIhpBD3cgGkENd3MgGkEKdnNqIhtBD3cgG0ENd3MgG0EKdnNqIhxBGXcgHEEOd3MgHEEDdnMgAkEZdyACQQ53cyACQQN2cyAVaiAYaiAOQRl3IA5BDndzIA5BA3ZzIBZqIBdqIBBBGXcgEEEOd3MgEEEDdnMgCGogFGogE0EPdyATQQ13cyATQQp2c2oiHUEPdyAdQQ13cyAdQQp2c2oiHkEPdyAeQQ13cyAeQQp2c2oiH2ogE0EZdyATQQ53cyATQQN2cyAYaiADQRl3IANBDndzIANBA3ZzIAFqIBlqIB9BD3cgH0ENd3MgH0EKdnNqIiBqIBJBGXcgEkEOd3MgEkEDdnMgF2ogH2ogEUEZdyARQQ53cyARQQN2cyAUaiAeaiAJQRl3IAlBDndzIAlBA3ZzIANqIB1qIBxBD3cgHEENd3MgHEEKdnNqIiFBD3cgIUENd3MgIUEKdnNqIiJBD3cgIkENd3MgIkEKdnNqIiNBD3cgI0ENd3MgI0EKdnNqIiRqIBtBGXcgG0EOd3MgG0EDdnMgHmogI2ogGkEZdyAaQQ53cyAaQQN2cyAdaiAiaiAZQRl3IBlBDndzIBlBA3ZzIBNqICFqIBhBGXcgGEEOd3MgGEEDdnMgEmogHGogF0EZdyAXQQ53cyAXQQN2cyARaiAbaiAUQRl3IBRBDndzIBRBA3ZzIAlqIBpqICBBD3cgIEENd3MgIEEKdnNqIiVBD3cgJUENd3MgJUEKdnNqIiZBD3cgJkENd3MgJkEKdnNqIidBD3cgJ0ENd3MgJ0EKdnNqIihBD3cgKEENd3MgKEEKdnNqIilBD3cgKUENd3MgKUEKdnNqIipBD3cgKkENd3MgKkEKdnNqIitBGXcgK0EOd3MgK0EDdnMgH0EZdyAfQQ53cyAfQQN2cyAbaiAnaiAeQRl3IB5BDndzIB5BA3ZzIBpqICZqIB1BGXcgHUEOd3MgHUEDdnMgGWogJWogJEEPdyAkQQ13cyAkQQp2c2oiLEEPdyAsQQ13cyAsQQp2c2oiLUEPdyAtQQ13cyAtQQp2c2oiLmogJEEZdyAkQQ53cyAkQQN2cyAnaiAgQRl3ICBBDndzICBBA3ZzIBxqIChqIC5BD3cgLkENd3MgLkEKdnNqIi9qICNBGXcgI0EOd3MgI0EDdnMgJmogLmogIkEZdyAiQQ53cyAiQQN2cyAlaiAtaiAhQRl3ICFBDndzICFBA3ZzICBqICxqICtBD3cgK0ENd3MgK0EKdnNqIjBBD3cgMEENd3MgMEEKdnNqIjFBD3cgMUENd3MgMUEKdnNqIjJBD3cgMkENd3MgMkEKdnNqIjNqICpBGXcgKkEOd3MgKkEDdnMgLWogMmogKUEZdyApQQ53cyApQQN2cyAsaiAxaiAoQRl3IChBDndzIChBA3ZzICRqIDBqICdBGXcgJ0EOd3MgJ0EDdnMgI2ogK2ogJkEZdyAmQQ53cyAmQQN2cyAiaiAqaiAlQRl3ICVBDndzICVBA3ZzICFqIClqIC9BD3cgL0ENd3MgL0EKdnNqIjRBD3cgNEENd3MgNEEKdnNqIjVBD3cgNUENd3MgNUEKdnNqIjZBD3cgNkENd3MgNkEKdnNqIjdBD3cgN0ENd3MgN0EKdnNqIjhBD3cgOEENd3MgOEEKdnNqIjlBD3cgOUENd3MgOUEKdnNqIjogOCA0IC4gLCAhIBsgGSADIA4gBEEAKALYiQEiO0EadyA7QRV3cyA7QQd3c0EAKALkiQEiPGpBACgC4IkBIj1BACgC3IkBIj5zIDtxID1zaiAHakGY36iUBGoiB0EAKALUiQEiP2oiACAMaiA7IA1qID4gD2ogPSAGaiAAID4gO3NxID5zaiAAQRp3IABBFXdzIABBB3dzakGRid2JB2oiQEEAKALQiQEiQWoiDCAAIDtzcSA7c2ogDEEadyAMQRV3cyAMQQd3c2pBz/eDrntqIkJBACgCzIkBIkNqIg0gDCAAc3EgAHNqIA1BGncgDUEVd3MgDUEHd3NqQaW3181+aiJEQQAoAsiJASIAaiIPIA0gDHNxIAxzaiAPQRp3IA9BFXdzIA9BB3dzakHbhNvKA2oiRSBBIEMgAHNxIEMgAHFzIABBHncgAEETd3MgAEEKd3NqIAdqIgZqIgdqIAUgD2ogCiANaiALIAxqIAcgDyANc3EgDXNqIAdBGncgB0EVd3MgB0EHd3NqQfGjxM8FaiIKIAYgAHMgQ3EgBiAAcXMgBkEedyAGQRN3cyAGQQp3c2ogQGoiDGoiBCAHIA9zcSAPc2ogBEEadyAEQRV3cyAEQQd3c2pBpIX+kXlqIgsgDCAGcyAAcSAMIAZxcyAMQR53IAxBE3dzIAxBCndzaiBCaiINaiIPIAQgB3NxIAdzaiAPQRp3IA9BFXdzIA9BB3dzakHVvfHYemoiQCANIAxzIAZxIA0gDHFzIA1BHncgDUETd3MgDUEKd3NqIERqIgZqIgcgDyAEc3EgBHNqIAdBGncgB0EVd3MgB0EHd3NqQZjVnsB9aiJCIAYgDXMgDHEgBiANcXMgBkEedyAGQRN3cyAGQQp3c2ogRWoiDGoiBWogFiAHaiAQIA9qIAggBGogBSAHIA9zcSAPc2ogBUEadyAFQRV3cyAFQQd3c2pBgbaNlAFqIgggDCAGcyANcSAMIAZxcyAMQR53IAxBE3dzIAxBCndzaiAKaiINaiIPIAUgB3NxIAdzaiAPQRp3IA9BFXdzIA9BB3dzakG+i8ahAmoiDiANIAxzIAZxIA0gDHFzIA1BHncgDUETd3MgDUEKd3NqIAtqIgZqIgcgDyAFc3EgBXNqIAdBGncgB0EVd3MgB0EHd3NqQcP7sagFaiIQIAYgDXMgDHEgBiANcXMgBkEedyAGQRN3cyAGQQp3c2ogQGoiDGoiBCAHIA9zcSAPc2ogBEEadyAEQRV3cyAEQQd3c2pB9Lr5lQdqIhYgDCAGcyANcSAMIAZxcyAMQR53IAxBE3dzIAxBCndzaiBCaiINaiIFaiABIARqIAIgB2ogFSAPaiAFIAQgB3NxIAdzaiAFQRp3IAVBFXdzIAVBB3dzakH+4/qGeGoiByANIAxzIAZxIA0gDHFzIA1BHncgDUETd3MgDUEKd3NqIAhqIgFqIgYgBSAEc3EgBHNqIAZBGncgBkEVd3MgBkEHd3NqQaeN8N55aiIEIAEgDXMgDHEgASANcXMgAUEedyABQRN3cyABQQp3c2ogDmoiAmoiDCAGIAVzcSAFc2ogDEEadyAMQRV3cyAMQQd3c2pB9OLvjHxqIgUgAiABcyANcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAQaiIDaiINIAwgBnNxIAZzaiANQRp3IA1BFXdzIA1BB3dzakHB0+2kfmoiCCADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBZqIgFqIg8gF2ogESANaiAUIAxqIAkgBmogDyANIAxzcSAMc2ogD0EadyAPQRV3cyAPQQd3c2pBho/5/X5qIgYgASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAHaiICaiIJIA8gDXNxIA1zaiAJQRp3IAlBFXdzIAlBB3dzakHGu4b+AGoiDCACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIARqIgNqIhEgCSAPc3EgD3NqIBFBGncgEUEVd3MgEUEHd3NqQczDsqACaiINIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogBWoiAWoiFCARIAlzcSAJc2ogFEEadyAUQRV3cyAUQQd3c2pB79ik7wJqIg8gASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAIaiICaiIXaiATIBRqIBggEWogEiAJaiAXIBQgEXNxIBFzaiAXQRp3IBdBFXdzIBdBB3dzakGqidLTBGoiGCACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIAZqIgNqIgkgFyAUc3EgFHNqIAlBGncgCUEVd3MgCUEHd3NqQdzTwuUFaiIUIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogDGoiAWoiESAJIBdzcSAXc2ogEUEadyARQRV3cyARQQd3c2pB2pHmtwdqIhcgASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiANaiICaiISIBEgCXNxIAlzaiASQRp3IBJBFXdzIBJBB3dzakHSovnBeWoiGSACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIA9qIgNqIhNqIB4gEmogGiARaiAdIAlqIBMgEiARc3EgEXNqIBNBGncgE0EVd3MgE0EHd3NqQe2Mx8F6aiIaIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogGGoiAWoiCSATIBJzcSASc2ogCUEadyAJQRV3cyAJQQd3c2pByM+MgHtqIhggASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAUaiICaiIRIAkgE3NxIBNzaiARQRp3IBFBFXdzIBFBB3dzakHH/+X6e2oiFCACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIBdqIgNqIhIgESAJc3EgCXNqIBJBGncgEkEVd3MgEkEHd3NqQfOXgLd8aiIXIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogGWoiAWoiE2ogICASaiAcIBFqIB8gCWogEyASIBFzcSARc2ogE0EadyATQRV3cyATQQd3c2pBx6KerX1qIhkgASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAaaiICaiIJIBMgEnNxIBJzaiAJQRp3IAlBFXdzIAlBB3dzakHRxqk2aiIaIAIgAXMgA3EgAiABcXMgAkEedyACQRN3cyACQQp3c2ogGGoiA2oiESAJIBNzcSATc2ogEUEadyARQRV3cyARQQd3c2pB59KkoQFqIhggAyACcyABcSADIAJxcyADQR53IANBE3dzIANBCndzaiAUaiIBaiISIBEgCXNxIAlzaiASQRp3IBJBFXdzIBJBB3dzakGFldy9AmoiFCABIANzIAJxIAEgA3FzIAFBHncgAUETd3MgAUEKd3NqIBdqIgJqIhMgI2ogJiASaiAiIBFqICUgCWogEyASIBFzcSARc2ogE0EadyATQRV3cyATQQd3c2pBuMLs8AJqIhcgAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAZaiIDaiIJIBMgEnNxIBJzaiAJQRp3IAlBFXdzIAlBB3dzakH827HpBGoiGSADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBpqIgFqIhEgCSATc3EgE3NqIBFBGncgEUEVd3MgEUEHd3NqQZOa4JkFaiIaIAEgA3MgAnEgASADcXMgAUEedyABQRN3cyABQQp3c2ogGGoiAmoiEiARIAlzcSAJc2ogEkEadyASQRV3cyASQQd3c2pB1OapqAZqIhggAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAUaiIDaiITaiAoIBJqICQgEWogJyAJaiATIBIgEXNxIBFzaiATQRp3IBNBFXdzIBNBB3dzakG7laizB2oiFCADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBdqIgFqIgkgEyASc3EgEnNqIAlBGncgCUEVd3MgCUEHd3NqQa6Si454aiIXIAEgA3MgAnEgASADcXMgAUEedyABQRN3cyABQQp3c2ogGWoiAmoiESAJIBNzcSATc2ogEUEadyARQRV3cyARQQd3c2pBhdnIk3lqIhkgAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAaaiIDaiISIBEgCXNxIAlzaiASQRp3IBJBFXdzIBJBB3dzakGh0f+VemoiGiADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBhqIgFqIhNqICogEmogLSARaiApIAlqIBMgEiARc3EgEXNqIBNBGncgE0EVd3MgE0EHd3NqQcvM6cB6aiIYIAEgA3MgAnEgASADcXMgAUEedyABQRN3cyABQQp3c2ogFGoiAmoiCSATIBJzcSASc2ogCUEadyAJQRV3cyAJQQd3c2pB8JauknxqIhQgAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAXaiIDaiIRIAkgE3NxIBNzaiARQRp3IBFBFXdzIBFBB3dzakGjo7G7fGoiFyADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBlqIgFqIhIgESAJc3EgCXNqIBJBGncgEkEVd3MgEkEHd3NqQZnQy4x9aiIZIAEgA3MgAnEgASADcXMgAUEedyABQRN3cyABQQp3c2ogGmoiAmoiE2ogMCASaiAvIBFqICsgCWogEyASIBFzcSARc2ogE0EadyATQRV3cyATQQd3c2pBpIzktH1qIhogAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAYaiIDaiIJIBMgEnNxIBJzaiAJQRp3IAlBFXdzIAlBB3dzakGF67igf2oiGCADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBRqIgFqIhEgCSATc3EgE3NqIBFBGncgEUEVd3MgEUEHd3NqQfDAqoMBaiIUIAEgA3MgAnEgASADcXMgAUEedyABQRN3cyABQQp3c2ogF2oiAmoiEiARIAlzcSAJc2ogEkEadyASQRV3cyASQQd3c2pBloKTzQFqIhcgAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAZaiIDaiITIDZqIDIgEmogNSARaiAxIAlqIBMgEiARc3EgEXNqIBNBGncgE0EVd3MgE0EHd3NqQYjY3fEBaiIZIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogGmoiAWoiCSATIBJzcSASc2ogCUEadyAJQRV3cyAJQQd3c2pBzO6hugJqIhogASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAYaiICaiIRIAkgE3NxIBNzaiARQRp3IBFBFXdzIBFBB3dzakG1+cKlA2oiGCACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIBRqIgNqIhIgESAJc3EgCXNqIBJBGncgEkEVd3MgEkEHd3NqQbOZ8MgDaiIUIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogF2oiAWoiE2ogLEEZdyAsQQ53cyAsQQN2cyAoaiA0aiAzQQ93IDNBDXdzIDNBCnZzaiIXIBJqIDcgEWogMyAJaiATIBIgEXNxIBFzaiATQRp3IBNBFXdzIBNBB3dzakHK1OL2BGoiGyABIANzIAJxIAEgA3FzIAFBHncgAUETd3MgAUEKd3NqIBlqIgJqIgkgEyASc3EgEnNqIAlBGncgCUEVd3MgCUEHd3NqQc+U89wFaiIZIAIgAXMgA3EgAiABcXMgAkEedyACQRN3cyACQQp3c2ogGmoiA2oiESAJIBNzcSATc2ogEUEadyARQRV3cyARQQd3c2pB89+5wQZqIhogAyACcyABcSADIAJxcyADQR53IANBE3dzIANBCndzaiAYaiIBaiISIBEgCXNxIAlzaiASQRp3IBJBFXdzIBJBB3dzakHuhb6kB2oiHCABIANzIAJxIAEgA3FzIAFBHncgAUETd3MgAUEKd3NqIBRqIgJqIhNqIC5BGXcgLkEOd3MgLkEDdnMgKmogNmogLUEZdyAtQQ53cyAtQQN2cyApaiA1aiAXQQ93IBdBDXdzIBdBCnZzaiIUQQ93IBRBDXdzIBRBCnZzaiIYIBJqIDkgEWogFCAJaiATIBIgEXNxIBFzaiATQRp3IBNBFXdzIBNBB3dzakHvxpXFB2oiCSACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIBtqIgNqIhEgEyASc3EgEnNqIBFBGncgEUEVd3MgEUEHd3NqQZTwoaZ4aiIbIAMgAnMgAXEgAyACcXMgA0EedyADQRN3cyADQQp3c2ogGWoiAWoiEiARIBNzcSATc2ogEkEadyASQRV3cyASQQd3c2pBiISc5nhqIhkgASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAaaiICaiITIBIgEXNxIBFzaiATQRp3IBNBFXdzIBNBB3dzakH6//uFeWoiGiACIAFzIANxIAIgAXFzIAJBHncgAkETd3MgAkEKd3NqIBxqIgNqIhQgPGo2AuSJAUEAID8gAyACcyABcSADIAJxcyADQR53IANBE3dzIANBCndzaiAJaiIBIANzIAJxIAEgA3FzIAFBHncgAUETd3MgAUEKd3NqIBtqIgIgAXMgA3EgAiABcXMgAkEedyACQRN3cyACQQp3c2ogGWoiAyACcyABcSADIAJxcyADQR53IANBE3dzIANBCndzaiAaaiIJajYC1IkBQQAgPSAvQRl3IC9BDndzIC9BA3ZzICtqIDdqIBhBD3cgGEENd3MgGEEKdnNqIhggEWogFCATIBJzcSASc2ogFEEadyAUQRV3cyAUQQd3c2pB69nBonpqIhkgAWoiEWo2AuCJAUEAIEEgCSADcyACcSAJIANxcyAJQR53IAlBE3dzIAlBCndzaiAZaiIBajYC0IkBQQAgPiAwQRl3IDBBDndzIDBBA3ZzIC9qIBdqIDpBD3cgOkENd3MgOkEKdnNqIBJqIBEgFCATc3EgE3NqIBFBGncgEUEVd3MgEUEHd3NqQffH5vd7aiIXIAJqIhJqNgLciQFBACBDIAEgCXMgA3EgASAJcXMgAUEedyABQRN3cyABQQp3c2ogF2oiAmo2AsyJAUEAIDsgNEEZdyA0QQ53cyA0QQN2cyAwaiA4aiAYQQ93IBhBDXdzIBhBCnZzaiATaiASIBEgFHNxIBRzaiASQRp3IBJBFXdzIBJBB3dzakHy8cWzfGoiESADamo2AtiJAUEAIAAgAiABcyAJcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiARamo2AsiJAQuyBgIEfwF+QQAoAsCJASIAQQJ2QQ9xIgFBAnRBgIkBaiICIAIoAgBBfyAAQQN0IgB0QX9zcUGAASAAdHM2AgACQAJAAkAgAUEOSQ0AAkAgAUEORw0AQQBBADYCvIkBC0GAiQEQA0EAIQIMAQsgAUENRg0BIAFBAWohAgsgAiEDAkBBBiACa0EHcSIARQ0AIAIgAGohAyACQQJ0QYCJAWohAQNAIAFBADYCACABQQRqIQEgAEF/aiIADQALCyACQXlqQQdJDQAgA0ECdCEBA0AgAUGYiQFqQgA3AgAgAUGQiQFqQgA3AgAgAUGIiQFqQgA3AgAgAUGAiQFqQgA3AgAgAUEgaiIBQThHDQALC0EAIQFBAEEAKQPAiQEiBKciAEEbdCAAQQt0QYCA/AdxciAAQQV2QYD+A3EgAEEDdEEYdnJyNgK8iQFBACAEQh2IpyIAQRh0IABBgP4DcUEIdHIgAEEIdkGA/gNxIABBGHZycjYCuIkBQYCJARADQQBBACgC5IkBIgBBGHQgAEGA/gNxQQh0ciAAQQh2QYD+A3EgAEEYdnJyNgLkiQFBAEEAKALgiQEiAEEYdCAAQYD+A3FBCHRyIABBCHZBgP4DcSAAQRh2cnI2AuCJAUEAQQAoAtyJASIAQRh0IABBgP4DcUEIdHIgAEEIdkGA/gNxIABBGHZycjYC3IkBQQBBACgC2IkBIgBBGHQgAEGA/gNxQQh0ciAAQQh2QYD+A3EgAEEYdnJyNgLYiQFBAEEAKALUiQEiAEEYdCAAQYD+A3FBCHRyIABBCHZBgP4DcSAAQRh2cnI2AtSJAUEAQQAoAtCJASIAQRh0IABBgP4DcUEIdHIgAEEIdkGA/gNxIABBGHZycjYC0IkBQQBBACgCzIkBIgBBGHQgAEGA/gNxQQh0ciAAQQh2QYD+A3EgAEEYdnJyNgLMiQFBAEEAKALIiQEiAEEYdCAAQYD+A3FBCHRyIABBCHZBgP4DcSAAQRh2cnI2AsiJAQJAQQAoAuiJASICRQ0AQQAhAANAIAFBgAlqIAFByIkBai0AADoAACABQQFqIQEgAiAAQQFqIgBB/wFxSw0ACwsLBgBBgIkBC6MBAEEAQgA3A8CJAUEAQRxBICABQeABRiIBGzYC6IkBQQBCp5/mp8b0k/2+f0Krs4/8kaOz8NsAIAEbNwPgiQFBAEKxloD+n6KFrOgAQv+kuYjFkdqCm38gARs3A9iJAUEAQpe6w4OTp5aHd0Ly5rvjo6f9p6V/IAEbNwPQiQFBAELYvZaI/KC1vjZC58yn0NbQ67O7fyABGzcDyIkBIAAQAhAECwsLAQBBgAgLBHAAAAA=", $d = "8c18dd94", Hd = {
  name: Ud,
  data: Od,
  hash: $d
};
new Le();
new Le();
function jd() {
  return Ld(Hd, 32).then((r) => {
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
new Le();
new Le();
new Le();
new Le();
new Le();
new Le();
new Le();
new Le();
new Le();
const jn = 1024 * 1024 * 1024;
function Go(r) {
  return r.document_formats?.map((t) => t.extension).filter((t) => /^\.[a-z0-9]{1,8}$/.test(t)) || [];
}
function Jo(r) {
  return Go(r).join(",");
}
function qd(r, e) {
  const t = e.toLowerCase();
  return Go(r).some((n) => t.endsWith(n));
}
function Gd(r) {
  const e = r.document_max_bytes;
  return Number.isSafeInteger(e) && e > 0 ? Math.min(e, jn) : jn;
}
function Vo(r) {
  const e = r.document_index_max_bytes;
  return Number.isSafeInteger(e) && e > 0 ? Math.min(e, jn) : jn;
}
function Jd(r, e) {
  const t = e.toLowerCase();
  return r.document_formats?.find((n) => /^\.[a-z0-9]{1,8}$/.test(n.extension) && t.endsWith(n.extension));
}
function Vd(r, e) {
  const t = Jd(r, e);
  if (!t) return 0;
  const n = Vo(r);
  return Number.isSafeInteger(t.builder_max_bytes) && t.builder_max_bytes > 0 ? Math.min(n, t.builder_max_bytes) : n;
}
function Wo(r) {
  return r.role === "editor" || r.role === "manager";
}
function Js(r) {
  return r.security_status === "clean" && ["queued", "indexing", "ready", "failed", "needs_reconcile"].includes(r.state);
}
function $a(r) {
  return r.security_status === "rejected" || r.state === "deleting" || r.state === "deleted" ? !1 : r.state === "failed" || r.state === "needs_reconcile" || !!r.error_code;
}
function Ha(r) {
  return r.state === "ready" && r.security_status === "clean" && !r.reindexing && !r.error_code;
}
function ui(r) {
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
function Wd(r) {
  if (r.reindexing) return "当前索引保持可用；新一代索引在后台建立，确认完成后才会原子切换。";
  const e = Xd(r.error_code);
  return e || (r.state === "deleting" ? "已停止检索和下载；原文件与远端索引清理完成前，此记录会继续保留。" : r.state === "needs_reconcile" ? "远端可能已收到文件，系统正在核对结果，不会盲目重复推送。" : r.security_status === "rejected" ? "安全检查未通过。原文件保持隔离，不会进入解析、索引或下载链路。" : r.state === "quarantined" ? "原文件已进入隔离区，安全检查通过前不会开放下载，也不会交给解析器。" : r.state === "scanning" ? "正在检查文件类型、恶意特征、活动内容和压缩包膨胀风险。" : r.error_code === "document_index_failed" ? "知识服务未能完成索引，原文件仍可查看和下载。" : r.state === "indexing" ? r.index_status === "CHUNKED" ? "资料已完成分段，正在等待索引完成。" : "原文件已保存，正在建立索引。" : r.state === "queued" ? "原文件已保存，后台将继续处理。" : r.state === "uploading" ? "上传尚未完成，可重新选择同一文件继续。" : r.state === "ready" ? "知识索引已经完成，可以检索。" : "处理尚未完成，请稍后刷新状态。");
}
function Xd(r) {
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
const Xo = [
  { key: "upload", label: "上传" },
  { key: "scan", label: "安全扫描" },
  { key: "parse", label: "解析" },
  { key: "chunk", label: "切块" },
  { key: "index", label: "索引" },
  { key: "complete", label: "完成" }
];
function Zd(r) {
  if (r.processing_stage === "failed")
    return r.security_status === "rejected" ? 1 : r.index_status === "CHUNKED" ? 4 : 2;
  const e = Xo.findIndex((t) => t.key === r.processing_stage);
  return e < 0 ? 0 : e;
}
async function Zo(r, e, t) {
  e?.throwIfAborted();
  const n = await jd(), s = r.stream().getReader();
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
function Kd(r) {
  if (!r || typeof r != "object" || Array.isArray(r)) return null;
  const e = r;
  return typeof e.code != "string" || !e.code.trim() || typeof e.message != "string" || !e.message.trim() || typeof e.request_id != "string" || e.params !== void 0 && (!e.params || typeof e.params != "object" || Array.isArray(e.params) || Object.values(e.params).some((t) => typeof t != "string")) ? null : {
    code: e.code,
    message: e.message,
    ...e.params === void 0 ? {} : { params: e.params },
    request_id: e.request_id
  };
}
async function Yd(r) {
  return Kd(await r.json().catch(() => {
  }));
}
const eu = 512 * 1024, tu = 8 * 1024 * 1024, ru = 64 * 1024 * 1024, nu = 128 * 1024 * 1024, su = "X-Domainry-File-SHA256", Ko = /* @__PURE__ */ new Set(["txt", "md", "rst", "html", "htm", "csv", "json", "jsonl", "py", "js", "ts", "tsx", "jsx", "java", "go", "rs", "c", "h", "cpp", "hpp", "cs", "rb", "php", "kt", "swift", "scala", "sh"]), iu = /* @__PURE__ */ new Set(["pdf", "docx", "pptx", "xlsx", "xlsm", "png", "jpg", "jpeg", "gif", "bmp", "webp", "mp3", "wav", "ogg", "flac", "m4a", "aac", "mp4", "mov", "webm", "avi"]), au = {
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
function os(r) {
  return r.split(".").at(-1)?.toLowerCase() || "";
}
function ou(r) {
  return Ko.has(r);
}
function Yo(r) {
  const e = os(r);
  return Ko.has(e) || iu.has(e);
}
function lu(r) {
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
function cu(r) {
  const e = Number(r.headers.get("Content-Length")), t = r.headers.get("Content-Range")?.match(/^bytes (\d+)-(\d+)\/(\d+)$/), n = t ? Number(t[3]) : e, s = t ? Number(t[2]) - Number(t[1]) + 1 : e, i = t ? Number(t[1]) : 0, a = t ? Number(t[2]) + 1 : e;
  if (!Number.isSafeInteger(e) || e < 1 || !Number.isSafeInteger(n) || n < 1 || !Number.isSafeInteger(s) || s !== e || !Number.isSafeInteger(i) || !Number.isSafeInteger(a) || i < 0 || a > n) throw Error("文件内容长度无法核对。");
  return { total: n, loaded: s, start: i, end: a };
}
async function ls(r, e, t) {
  const n = await r.read({ signal: e, range: t });
  if (!n.ok && n.status !== 206) {
    const f = await Yd(n);
    throw Error(f ? `${f.message}（${f.code}）` : `读取文件失败（${n.status}）`);
  }
  const s = lu(n.headers.get("Content-Disposition")), i = n.headers.get(su) || "", { total: a, loaded: o, start: l, end: d } = cu(n);
  if (!/^[a-f0-9]{64}$/.test(i) || r.file.sha256 && i !== r.file.sha256 || r.file.bytes !== void 0 && a !== r.file.bytes)
    throw await n.body?.cancel(), Error("文件内容与所选版本不一致，请刷新后重试。");
  return { response: n, filename: s, sha256: i, total: a, loaded: o, start: l, end: d };
}
async function el(r, e, t = ru) {
  const n = await ls(r, e);
  if (n.total > t)
    throw await n.response.body?.cancel(), Error(`此文件有 ${(n.total / 1024 / 1024).toFixed(1)} MiB，超过当前查看器 ${(t / 1024 / 1024).toFixed(0)} MiB 的安全预览上限，请下载原文件查看。`);
  let s = await n.response.blob();
  if (s.size !== n.total) throw Error("文件内容没有完整读取。");
  e.throwIfAborted();
  const i = os(n.filename);
  return s = s.slice(0, s.size, au[i] || "application/octet-stream"), { filename: n.filename, blob: s, format: i, bytes: n.total, sha256: n.sha256 };
}
async function du(r, e) {
  const t = await ls(r, e, `bytes=0-${eu - 1}`), n = await t.response.arrayBuffer();
  if (n.byteLength !== t.loaded) throw Error("文件内容没有完整读取。");
  let s;
  try {
    s = new TextDecoder("utf-8", { fatal: !0 }).decode(n);
  } catch {
    throw Error("此文件不是有效的 UTF-8 文本，请下载原文件查看。");
  }
  if (/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(s)) throw Error("此文件包含二进制控制字符，不能作为文本安全预览。");
  return { filename: t.filename, format: os(t.filename), text: s, bytes: t.total, loadedBytes: t.loaded, truncated: t.loaded < t.total };
}
async function ja(r, e, t, n) {
  if (!Number.isSafeInteger(e) || !Number.isSafeInteger(t) || e < 0 || t <= e) throw Error("文件分段范围无效。");
  const s = await ls(r, n, `bytes=${e}-${t - 1}`);
  if (s.start !== e || s.end !== Math.min(t, s.total))
    throw await s.response.body?.cancel(), Error("服务端返回了错误的文件分段。");
  const i = new Uint8Array(await s.response.arrayBuffer());
  if (i.byteLength !== s.loaded) throw Error("文件分段没有完整读取。");
  return { data: i, total: s.total, filename: s.filename, sha256: s.sha256 };
}
async function tl(r, e) {
  const t = window.showSaveFilePicker;
  if (t) {
    const a = await t({ suggestedName: r.file.filename }), o = await ls(r, e);
    if (!o.response.body) throw Error("浏览器无法读取下载内容。");
    await o.response.body.pipeTo(await a.createWritable(), { signal: e });
    return;
  }
  const n = await el(r, e, nu), s = URL.createObjectURL(n.blob), i = window.document.createElement("a");
  i.href = s, i.download = n.filename, i.click(), setTimeout(() => URL.revokeObjectURL(s), 1e3);
}
function rl(r, e) {
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
function uu(r, e, t) {
  return tl(rl(r, e), t);
}
function hu({ blob: r, filename: e }) {
  const [t, n] = L("");
  return ve(() => {
    const s = URL.createObjectURL(r);
    return n(s), () => URL.revokeObjectURL(s);
  }, [r]), /* @__PURE__ */ _("div", { className: "knowledge-file-viewer", children: [
    /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "图片原始比例预览" }),
    t && /* @__PURE__ */ h("div", { className: "knowledge-image-scroll", children: /* @__PURE__ */ h("img", { src: t, alt: e }) })
  ] });
}
function qa({ source: r, kind: e }) {
  const t = Be(null), n = Math.max(0, r.file.location?.start_ms || 0) / 1e3;
  if (ve(() => {
    const i = t.current;
    if (!i || !Number.isFinite(n)) return;
    const a = () => {
      Math.abs(i.currentTime - n) > 0.05 && (i.currentTime = n);
    };
    return i.readyState >= 1 ? a() : i.addEventListener("loadedmetadata", a, { once: !0 }), () => i.removeEventListener("loadedmetadata", a);
  }, [r.identity, n]), !r.streamURL) return /* @__PURE__ */ h("div", { className: "knowledge-preview-unsupported", children: /* @__PURE__ */ h("p", { children: "当前宿主没有提供授权后的媒体流地址，请下载原文件查看。" }) });
  const s = (i) => {
    t.current = i;
  };
  return /* @__PURE__ */ _("div", { className: "knowledge-file-viewer knowledge-media-viewer", children: [
    e === "video" ? /* @__PURE__ */ h("video", { ref: s, src: r.streamURL, controls: !0, preload: "metadata", playsInline: !0 }) : /* @__PURE__ */ h("audio", { ref: s, src: r.streamURL, controls: !0, preload: "metadata" }),
    r.file.location?.end_ms ? /* @__PURE__ */ _("p", { className: "knowledge-subtle", children: [
      "引用时间：",
      Ga(r.file.location.start_ms || 0),
      " – ",
      Ga(r.file.location.end_ms)
    ] }) : null
  ] });
}
function Ga(r) {
  const e = Math.max(0, Math.floor(r / 1e3)), t = Math.floor(e / 3600), n = Math.floor(e % 3600 / 60), s = e % 60;
  return t ? `${t}:${String(n).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${n}:${String(s).padStart(2, "0")}`;
}
const Ja = 256 * 1024;
function fu({ source: r, location: e }) {
  const t = Be(null), n = Be(null), [s, i] = L(null), [a, o] = L(Math.max(1, e?.page || 1)), [l, d] = L(1), [f, g] = L(800), [m, u] = L(""), [y, w] = L(!1);
  return ve(() => {
    const A = n.current;
    if (!A) return;
    const k = new ResizeObserver((v) => g(Math.max(200, v[0].contentRect.width - 32)));
    return k.observe(A), () => k.disconnect();
  }, []), ve(() => {
    let A = !0, k;
    const v = new AbortController(), N = /* @__PURE__ */ new Set();
    return i(null), u(""), Promise.all([ja(r, 0, Ja, v.signal), import("pdfjs-dist"), import("pdfjs-dist/build/pdf.worker.min.mjs?url")]).then(([E, S, z]) => {
      if (A) {
        if (S.GlobalWorkerOptions.workerSrc = z.default, E.data.byteLength === E.total)
          k = S.getDocument({ data: E.data, stopAtErrors: !0 });
        else {
          class x extends S.PDFDataRangeTransport {
            requestDataRange(O, K) {
              const B = new AbortController();
              N.add(B), ja(r, O, K, B.signal).then((R) => {
                N.delete(B), A && this.onDataRange(O, R.data);
              }).catch((R) => {
                N.delete(B), !(!A || B.signal.aborted) && (u(R instanceof Error ? R.message : "PDF 分段读取失败，请下载原文件查看。"), k?.destroy());
              });
            }
            abort() {
              N.forEach((O) => O.abort()), N.clear();
            }
          }
          const U = new x(E.total, E.data, !1, E.filename);
          k = S.getDocument({ range: U, rangeChunkSize: Ja, disableAutoFetch: !0, disableStream: !0, stopAtErrors: !0 });
        }
        return k.promise.then((x) => {
          A && (i(x), o(Math.min(x.numPages, Math.max(1, e?.page || 1))));
        });
      }
    }).catch((E) => {
      A && !v.signal.aborted && u(E instanceof Error ? E.message : "PDF 无法打开，文件可能已损坏或需要密码。可下载原文件查看。");
    }), () => {
      A = !1, v.abort(), N.forEach((E) => E.abort()), N.clear(), k?.destroy();
    };
  }, [e?.page, r.identity]), ve(() => {
    if (!s) return;
    let A = !0, k;
    return w(!1), s.getPage(a).then((v) => {
      if (!A || !t.current) return;
      const N = v.getViewport({ scale: 1 }), E = Math.min(f / N.width, 2) * l, S = v.getViewport({ scale: E }), z = Math.min(window.devicePixelRatio || 1, 2), x = t.current;
      return x.width = Math.ceil(S.width * z), x.height = Math.ceil(S.height * z), x.style.width = `${S.width}px`, x.style.height = `${S.height}px`, k = v.render({ canvas: x, canvasContext: x.getContext("2d"), viewport: S, transform: [z, 0, 0, z, 0, 0] }), k.promise.then(() => {
        A && w(!0);
      });
    }).catch((v) => {
      A && v?.name !== "RenderingCancelledException" && u("此页无法显示，请下载原文件查看。");
    }), () => {
      A = !1, k?.cancel();
    };
  }, [s, a, f, l]), /* @__PURE__ */ _("div", { className: "knowledge-file-viewer", children: [
    /* @__PURE__ */ _("nav", { className: "knowledge-file-toolbar", "aria-label": "PDF 翻页", children: [
      /* @__PURE__ */ h(le, { disabled: !s || a <= 1, onClick: () => o((A) => A - 1), children: "上一页" }),
      /* @__PURE__ */ _("span", { children: [
        "第 ",
        a,
        " / ",
        s?.numPages || "—",
        " 页"
      ] }),
      /* @__PURE__ */ h(le, { disabled: !s || a >= s.numPages, onClick: () => o((A) => A + 1), children: "下一页" }),
      /* @__PURE__ */ _("label", { children: [
        "缩放 ",
        /* @__PURE__ */ _("select", { "aria-label": "PDF 缩放", value: l, onChange: (A) => d(Number(A.target.value)), children: [
          /* @__PURE__ */ h("option", { value: 0.75, children: "75%" }),
          /* @__PURE__ */ h("option", { value: 1, children: "适合宽度" }),
          /* @__PURE__ */ h("option", { value: 1.5, children: "150%" }),
          /* @__PURE__ */ h("option", { value: 2, children: "200%" })
        ] })
      ] })
    ] }),
    m && /* @__PURE__ */ h("p", { role: "alert", className: "knowledge-error", children: m }),
    /* @__PURE__ */ h("div", { className: "knowledge-pdf-canvas", ref: n, "aria-busy": !y && !m, children: /* @__PURE__ */ h("canvas", { ref: t, "aria-label": `PDF 第 ${a} 页`, "data-rendered": y }) })
  ] });
}
async function Si(r, e, t) {
  const n = await r.arrayBuffer();
  return t.throwIfAborted(), new Promise((s, i) => {
    const a = new Worker(new URL(
      /* @vite-ignore */
      "" + new URL("assets/office-worker-CYysu3ts.js", import.meta.url).href,
      import.meta.url
    ), { type: "module" }), o = (f, g) => {
      clearTimeout(d), a.terminate(), t.removeEventListener("abort", l), f ? i(f) : s(g);
    }, l = () => o(new DOMException("Aborted", "AbortError")), d = setTimeout(() => o(Error("文件预览处理超时，请下载原文件查看。")), 2e4);
    t.addEventListener("abort", l, { once: !0 }), a.onerror = () => o(Error("文件预览失败，请下载原文件查看。")), a.onmessage = (f) => f.data.error ? o(Error(f.data.error)) : o(void 0, f.data), a.postMessage({ data: n, kind: e }, [n]);
  });
}
const Vt = 50, Wt = 16;
function Tr(r) {
  let e = "";
  for (; r > 0; r = Math.floor((r - 1) / 26)) e = String.fromCharCode(65 + (r - 1) % 26) + e;
  return e;
}
function gu({ blob: r, location: e }) {
  const [t, n] = L([]), [s, i] = L(0), [a, o] = L(0), [l, d] = L(0), [f, g] = L(e?.cell || ""), [m, u] = L(""), [y, w] = L(""), A = t[s], k = dt(() => new Map(A?.cells.map((x) => [`${x.row}:${x.col}`, x])), [A]);
  function v(x) {
    const U = /^([A-Z]{1,3})([1-9][0-9]{0,5})$/.exec(x.toUpperCase());
    if (!U || !A) {
      w("请输入有效单元格，例如 B12。");
      return;
    }
    const Q = [...U[1]].reduce((K, B) => K * 26 + B.charCodeAt(0) - 64, 0), O = Number(U[2]);
    if (O > A.rows || Q > A.cols) {
      w("该位置超出当前工作表范围。");
      return;
    }
    w(""), o(Math.floor((O - 1) / Vt)), d(Math.floor((Q - 1) / Wt)), u(`${O}:${Q}`);
  }
  ve(() => {
    const x = new AbortController();
    return Si(r, "xlsx", x.signal).then((U) => {
      if (x.signal.aborted) return;
      const Q = U.sheets || [];
      n(Q);
      const O = Q.findIndex((K) => K.name === e?.sheet);
      O >= 0 && i(O);
    }).catch((U) => {
      x.signal.aborted || w(U instanceof Error ? U.message : "Excel 文件无法预览。");
    }), () => x.abort();
  }, [r, e?.sheet]), ve(() => {
    !A || A.name !== e?.sheet || (e.cell ? v(e.cell) : e.row && e.row <= A.rows && o(Math.floor((e.row - 1) / Vt)));
  }, [A, e?.cell, e?.row, e?.sheet]);
  const N = A ? Array.from({ length: Math.min(Vt, Math.max(0, A.rows - a * Vt)) }, (x, U) => a * Vt + U + 1).filter((x) => !A.hiddenRows.includes(x)) : [], E = A ? Array.from({ length: Math.min(Wt, Math.max(0, A.cols - l * Wt)) }, (x, U) => l * Wt + U + 1).filter((x) => !A.hiddenCols.includes(x)) : [], S = /* @__PURE__ */ new Map();
  for (const x of A?.merges || []) {
    const U = N.filter((O) => O >= x.top && O <= x.bottom), Q = E.filter((O) => O >= x.left && O <= x.right);
    for (const O of U) for (const K of Q) S.set(`${O}:${K}`, O === U[0] && K === Q[0] ? { master: `${x.top}:${x.left}`, rowSpan: U.length, colSpan: Q.length } : null);
  }
  const z = k.get(m);
  return /* @__PURE__ */ _("div", { className: "knowledge-file-viewer", "data-static-ui-list": !0, children: [
    y && /* @__PURE__ */ h("p", { role: "alert", className: "knowledge-error", children: y }),
    !A && !y && /* @__PURE__ */ h("p", { role: "status", children: "正在打开工作簿…" }),
    A && /* @__PURE__ */ _(at, { children: [
      /* @__PURE__ */ _("div", { className: "knowledge-file-toolbar", children: [
        /* @__PURE__ */ _("label", { children: [
          "工作表 ",
          /* @__PURE__ */ h("select", { "aria-label": "工作表", value: s, onChange: (x) => {
            i(Number(x.target.value)), o(0), d(0), u(""), w("");
          }, children: t.map((x, U) => /* @__PURE__ */ h("option", { value: U, children: x.name }, U)) })
        ] }),
        /* @__PURE__ */ _("form", { onSubmit: (x) => {
          x.preventDefault(), v(f);
        }, children: [
          /* @__PURE__ */ _("label", { children: [
            "定位单元格 ",
            /* @__PURE__ */ h("input", { value: f, onChange: (x) => g(x.target.value), placeholder: "B12", maxLength: 10 })
          ] }),
          /* @__PURE__ */ h(le, { type: "submit", children: "定位" })
        ] })
      ] }),
      /* @__PURE__ */ _("p", { className: "knowledge-subtle", children: [
        A.rows,
        " 行 × ",
        A.cols,
        " 列 · 只读预览，公式显示文件保存的结果；图表与嵌入对象请下载查看。"
      ] }),
      z && /* @__PURE__ */ _("p", { className: "knowledge-spreadsheet-value", children: [
        /* @__PURE__ */ _("strong", { children: [
          Tr(z.col),
          z.row
        ] }),
        " ",
        z.formula ? `=${z.formula} → ` : "",
        z.text
      ] }),
      /* @__PURE__ */ h("div", { className: "knowledge-sheet-scroll", children: /* @__PURE__ */ _("table", { "aria-label": `${A.name} 工作表`, children: [
        /* @__PURE__ */ _("colgroup", { children: [
          /* @__PURE__ */ h("col", { style: { width: 50 } }),
          E.map((x) => /* @__PURE__ */ h("col", { style: { width: A.widths[x] || 110 } }, x))
        ] }),
        /* @__PURE__ */ h("thead", { children: /* @__PURE__ */ _("tr", { children: [
          /* @__PURE__ */ h("th", { scope: "col", children: "行" }),
          E.map((x) => /* @__PURE__ */ h("th", { scope: "col", children: Tr(x) }, x))
        ] }) }),
        /* @__PURE__ */ h("tbody", { children: N.map((x) => /* @__PURE__ */ _("tr", { style: { height: A.heights[x] }, children: [
          /* @__PURE__ */ h("th", { scope: "row", children: x }),
          E.map((U) => {
            const Q = `${x}:${U}`, O = S.get(Q);
            if (O === null) return null;
            const K = k.get(O?.master || Q);
            return /* @__PURE__ */ h("td", { rowSpan: O?.rowSpan, colSpan: O?.colSpan, style: K?.style, "data-selected": m === (O?.master || Q), onClick: () => {
              u(O?.master || Q), g(`${Tr(K?.col || U)}${K?.row || x}`);
            }, children: K?.text || "" }, U);
          })
        ] }, x)) })
      ] }) }),
      /* @__PURE__ */ _("nav", { className: "knowledge-file-toolbar", "aria-label": "工作表行分页", "data-static-ui-pagination": !0, children: [
        /* @__PURE__ */ h(le, { disabled: a === 0, onClick: () => o((x) => x - 1), children: "上一页行" }),
        /* @__PURE__ */ _("span", { children: [
          "第 ",
          a + 1,
          " / ",
          Math.max(1, Math.ceil(A.rows / Vt)),
          " 页"
        ] }),
        /* @__PURE__ */ h(le, { disabled: (a + 1) * Vt >= A.rows, onClick: () => o((x) => x + 1), children: "下一页行" }),
        /* @__PURE__ */ h(le, { disabled: l === 0, onClick: () => d((x) => x - 1), children: "前一组列" }),
        /* @__PURE__ */ _("span", { children: [
          Tr(l * Wt + 1),
          "–",
          Tr(Math.max(1, Math.min(A.cols, (l + 1) * Wt)))
        ] }),
        /* @__PURE__ */ h(le, { disabled: (l + 1) * Wt >= A.cols, onClick: () => d((x) => x + 1), children: "后一组列" })
      ] })
    ] })
  ] });
}
function pu({ blob: r, location: e }) {
  const [t, n] = L([]), [s, i] = L(0), [a, o] = L("");
  ve(() => {
    const d = new AbortController();
    return Si(r, "pptx", d.signal).then((f) => {
      if (d.signal.aborted) return;
      const g = f.slides || [];
      n(g);
      const m = g.findIndex((u) => u.number === e?.slide);
      i(m >= 0 ? m : 0);
    }).catch((f) => {
      d.signal.aborted || o(f instanceof Error ? f.message : "PowerPoint 文件无法预览。");
    }), () => d.abort();
  }, [r, e?.slide]);
  const l = t[s];
  return /* @__PURE__ */ _("div", { className: "knowledge-file-viewer", children: [
    /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "PowerPoint 只读文本预览 · 保留幻灯片顺序和文字；版式、图片、图表、动画与备注请下载原文件查看。" }),
    a && /* @__PURE__ */ h("p", { role: "alert", className: "knowledge-error", children: a }),
    !l && !a && /* @__PURE__ */ h("p", { role: "status", children: "正在读取幻灯片…" }),
    l && /* @__PURE__ */ _("div", { className: "knowledge-presentation", children: [
      /* @__PURE__ */ h("nav", { "aria-label": "幻灯片列表", children: t.map((d, f) => /* @__PURE__ */ _("button", { "aria-current": f === s ? "true" : void 0, onClick: () => i(f), children: [
        /* @__PURE__ */ h("span", { children: d.number }),
        /* @__PURE__ */ h("strong", { children: d.title })
      ] }, d.number)) }),
      /* @__PURE__ */ _("article", { "aria-label": `第 ${l.number} 张幻灯片`, children: [
        /* @__PURE__ */ _("small", { children: [
          "第 ",
          l.number,
          " / ",
          t.length,
          " 张"
        ] }),
        /* @__PURE__ */ h("h2", { children: l.title }),
        l.lines.length ? l.lines.map((d, f) => /* @__PURE__ */ h("p", { children: d }, f)) : /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "这张幻灯片没有可提取的正文文字。" })
      ] })
    ] })
  ] });
}
const vn = 50, In = 2e5, Va = 2e3, Vs = 100;
function mu(r, e) {
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
      n.length < Vs ? n.push(s) : a = !0, s = "";
      continue;
    }
    if (l === `
`) {
      if (n.length < Vs ? n.push(s.replace(/\r$/, "")) : a = !0, t.push(n), n = [], s = "", t.length >= Va) {
        a = !0;
        break;
      }
      continue;
    }
    s += l;
  }
  return (s || n.length) && t.length < Va && (n.length < Vs && n.push(s.replace(/\r$/, "")), t.push(n)), { rows: t, limited: a };
}
function bu({ file: r }) {
  const [e, t] = L(0), n = dt(() => r.format === "csv" || r.format === "tsv" ? mu(r.text, r.format === "tsv" ? "	" : ",") : null, [r]), s = dt(() => {
    if (r.format !== "json" || r.truncated) return r.text.slice(0, In);
    try {
      return JSON.stringify(JSON.parse(r.text), null, 2).slice(0, In);
    } catch {
      return r.text.slice(0, In);
    }
  }, [r]), i = r.truncated || r.text.length > In || !!n?.limited;
  if (n) {
    const a = e * vn, o = n.rows.slice(a, a + vn), l = Math.max(0, ...o.map((d) => d.length));
    return /* @__PURE__ */ _("div", { className: "knowledge-file-viewer", children: [
      /* @__PURE__ */ _("p", { className: "knowledge-subtle", children: [
        "表格文本只读预览",
        i ? " · 已限制展示量" : ""
      ] }),
      /* @__PURE__ */ h("div", { className: "knowledge-sheet-scroll", children: /* @__PURE__ */ _("table", { children: [
        /* @__PURE__ */ h("thead", { children: /* @__PURE__ */ _("tr", { children: [
          /* @__PURE__ */ h("th", { children: "行" }),
          Array.from({ length: l }, (d, f) => /* @__PURE__ */ h("th", { children: f + 1 }, f))
        ] }) }),
        /* @__PURE__ */ h("tbody", { children: o.map((d, f) => /* @__PURE__ */ _("tr", { children: [
          /* @__PURE__ */ h("th", { children: a + f + 1 }),
          Array.from({ length: l }, (g, m) => /* @__PURE__ */ h("td", { children: d[m] || "" }, m))
        ] }, a + f)) })
      ] }) }),
      /* @__PURE__ */ _("nav", { className: "knowledge-file-toolbar", children: [
        /* @__PURE__ */ h(le, { disabled: e === 0, onClick: () => t((d) => d - 1), children: "上一页" }),
        /* @__PURE__ */ h("span", { children: n.rows.length ? `${a + 1}–${Math.min(a + vn, n.rows.length)} / ${n.rows.length}` : "无数据" }),
        /* @__PURE__ */ h(le, { disabled: a + vn >= n.rows.length, onClick: () => t((d) => d + 1), children: "下一页" })
      ] })
    ] });
  }
  return /* @__PURE__ */ _("div", { className: "knowledge-file-viewer", children: [
    /* @__PURE__ */ _("p", { className: "knowledge-subtle", children: [
      r.format === "md" ? "Markdown 源文" : r.format === "json" ? "JSON" : "文本",
      "只读预览",
      i ? " · 仅展示开头" : ""
    ] }),
    /* @__PURE__ */ h("pre", { className: "knowledge-text-preview", children: s })
  ] });
}
var Cn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function wu(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function Zm(r) {
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
function En(r) {
  throw new Error('Could not dynamically require "' + r + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Ws = { exports: {} };
var Wa;
function Au() {
  return Wa || (Wa = 1, (function(r, e) {
    (function(t) {
      r.exports = t();
    })(function() {
      return (function t(n, s, i) {
        function a(d, f) {
          if (!s[d]) {
            if (!n[d]) {
              var g = typeof En == "function" && En;
              if (!f && g) return g(d, !0);
              if (o) return o(d, !0);
              var m = new Error("Cannot find module '" + d + "'");
              throw m.code = "MODULE_NOT_FOUND", m;
            }
            var u = s[d] = { exports: {} };
            n[d][0].call(u.exports, function(y) {
              var w = n[d][1][y];
              return a(w || y);
            }, u, u.exports, t, n, s, i);
          }
          return s[d].exports;
        }
        for (var o = typeof En == "function" && En, l = 0; l < i.length; l++) a(i[l]);
        return a;
      })({ 1: [function(t, n, s) {
        var i = t("./utils"), a = t("./support"), o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        s.encode = function(l) {
          for (var d, f, g, m, u, y, w, A = [], k = 0, v = l.length, N = v, E = i.getTypeOf(l) !== "string"; k < l.length; ) N = v - k, g = E ? (d = l[k++], f = k < v ? l[k++] : 0, k < v ? l[k++] : 0) : (d = l.charCodeAt(k++), f = k < v ? l.charCodeAt(k++) : 0, k < v ? l.charCodeAt(k++) : 0), m = d >> 2, u = (3 & d) << 4 | f >> 4, y = 1 < N ? (15 & f) << 2 | g >> 6 : 64, w = 2 < N ? 63 & g : 64, A.push(o.charAt(m) + o.charAt(u) + o.charAt(y) + o.charAt(w));
          return A.join("");
        }, s.decode = function(l) {
          var d, f, g, m, u, y, w = 0, A = 0, k = "data:";
          if (l.substr(0, k.length) === k) throw new Error("Invalid base64 input, it looks like a data url.");
          var v, N = 3 * (l = l.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (l.charAt(l.length - 1) === o.charAt(64) && N--, l.charAt(l.length - 2) === o.charAt(64) && N--, N % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (v = a.uint8array ? new Uint8Array(0 | N) : new Array(0 | N); w < l.length; ) d = o.indexOf(l.charAt(w++)) << 2 | (m = o.indexOf(l.charAt(w++))) >> 4, f = (15 & m) << 4 | (u = o.indexOf(l.charAt(w++))) >> 2, g = (3 & u) << 6 | (y = o.indexOf(l.charAt(w++))), v[A++] = d, u !== 64 && (v[A++] = f), y !== 64 && (v[A++] = g);
          return v;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(t, n, s) {
        var i = t("./external"), a = t("./stream/DataWorker"), o = t("./stream/Crc32Probe"), l = t("./stream/DataLengthProbe");
        function d(f, g, m, u, y) {
          this.compressedSize = f, this.uncompressedSize = g, this.crc32 = m, this.compression = u, this.compressedContent = y;
        }
        d.prototype = { getContentWorker: function() {
          var f = new a(i.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new l("data_length")), g = this;
          return f.on("end", function() {
            if (this.streamInfo.data_length !== g.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), f;
        }, getCompressedWorker: function() {
          return new a(i.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, d.createWorkerFrom = function(f, g, m) {
          return f.pipe(new o()).pipe(new l("uncompressedSize")).pipe(g.compressWorker(m)).pipe(new l("compressedSize")).withStreamInfo("compression", g);
        }, n.exports = d;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(t, n, s) {
        var i = t("./stream/GenericWorker");
        s.STORE = { magic: "\0\0", compressWorker: function() {
          return new i("STORE compression");
        }, uncompressWorker: function() {
          return new i("STORE decompression");
        } }, s.DEFLATE = t("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(t, n, s) {
        var i = t("./utils"), a = (function() {
          for (var o, l = [], d = 0; d < 256; d++) {
            o = d;
            for (var f = 0; f < 8; f++) o = 1 & o ? 3988292384 ^ o >>> 1 : o >>> 1;
            l[d] = o;
          }
          return l;
        })();
        n.exports = function(o, l) {
          return o !== void 0 && o.length ? i.getTypeOf(o) !== "string" ? (function(d, f, g, m) {
            var u = a, y = m + g;
            d ^= -1;
            for (var w = m; w < y; w++) d = d >>> 8 ^ u[255 & (d ^ f[w])];
            return -1 ^ d;
          })(0 | l, o, o.length, 0) : (function(d, f, g, m) {
            var u = a, y = m + g;
            d ^= -1;
            for (var w = m; w < y; w++) d = d >>> 8 ^ u[255 & (d ^ f.charCodeAt(w))];
            return -1 ^ d;
          })(0 | l, o, o.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(t, n, s) {
        s.base64 = !1, s.binary = !1, s.dir = !1, s.createFolders = !0, s.date = null, s.compression = null, s.compressionOptions = null, s.comment = null, s.unixPermissions = null, s.dosPermissions = null;
      }, {}], 6: [function(t, n, s) {
        var i = null;
        i = typeof Promise < "u" ? Promise : t("lie"), n.exports = { Promise: i };
      }, { lie: 37 }], 7: [function(t, n, s) {
        var i = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", a = t("pako"), o = t("./utils"), l = t("./stream/GenericWorker"), d = i ? "uint8array" : "array";
        function f(g, m) {
          l.call(this, "FlateWorker/" + g), this._pako = null, this._pakoAction = g, this._pakoOptions = m, this.meta = {};
        }
        s.magic = "\b\0", o.inherits(f, l), f.prototype.processChunk = function(g) {
          this.meta = g.meta, this._pako === null && this._createPako(), this._pako.push(o.transformTo(d, g.data), !1);
        }, f.prototype.flush = function() {
          l.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, f.prototype.cleanUp = function() {
          l.prototype.cleanUp.call(this), this._pako = null;
        }, f.prototype._createPako = function() {
          this._pako = new a[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var g = this;
          this._pako.onData = function(m) {
            g.push({ data: m, meta: g.meta });
          };
        }, s.compressWorker = function(g) {
          return new f("Deflate", g);
        }, s.uncompressWorker = function() {
          return new f("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(t, n, s) {
        function i(u, y) {
          var w, A = "";
          for (w = 0; w < y; w++) A += String.fromCharCode(255 & u), u >>>= 8;
          return A;
        }
        function a(u, y, w, A, k, v) {
          var N, E, S = u.file, z = u.compression, x = v !== d.utf8encode, U = o.transformTo("string", v(S.name)), Q = o.transformTo("string", d.utf8encode(S.name)), O = S.comment, K = o.transformTo("string", v(O)), B = o.transformTo("string", d.utf8encode(O)), R = Q.length !== S.name.length, b = B.length !== O.length, G = "", ne = "", T = "", ae = S.dir, Y = S.date, de = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          y && !w || (de.crc32 = u.crc32, de.compressedSize = u.compressedSize, de.uncompressedSize = u.uncompressedSize);
          var H = 0;
          y && (H |= 8), x || !R && !b || (H |= 2048);
          var $ = 0, oe = 0;
          ae && ($ |= 16), k === "UNIX" ? (oe = 798, $ |= (function(ie, Ne) {
            var xe = ie;
            return ie || (xe = Ne ? 16893 : 33204), (65535 & xe) << 16;
          })(S.unixPermissions, ae)) : (oe = 20, $ |= (function(ie) {
            return 63 & (ie || 0);
          })(S.dosPermissions)), N = Y.getUTCHours(), N <<= 6, N |= Y.getUTCMinutes(), N <<= 5, N |= Y.getUTCSeconds() / 2, E = Y.getUTCFullYear() - 1980, E <<= 4, E |= Y.getUTCMonth() + 1, E <<= 5, E |= Y.getUTCDate(), R && (ne = i(1, 1) + i(f(U), 4) + Q, G += "up" + i(ne.length, 2) + ne), b && (T = i(1, 1) + i(f(K), 4) + B, G += "uc" + i(T.length, 2) + T);
          var ce = "";
          return ce += `
\0`, ce += i(H, 2), ce += z.magic, ce += i(N, 2), ce += i(E, 2), ce += i(de.crc32, 4), ce += i(de.compressedSize, 4), ce += i(de.uncompressedSize, 4), ce += i(U.length, 2), ce += i(G.length, 2), { fileRecord: g.LOCAL_FILE_HEADER + ce + U + G, dirRecord: g.CENTRAL_FILE_HEADER + i(oe, 2) + ce + i(K.length, 2) + "\0\0\0\0" + i($, 4) + i(A, 4) + U + G + K };
        }
        var o = t("../utils"), l = t("../stream/GenericWorker"), d = t("../utf8"), f = t("../crc32"), g = t("../signature");
        function m(u, y, w, A) {
          l.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = y, this.zipPlatform = w, this.encodeFileName = A, this.streamFiles = u, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        o.inherits(m, l), m.prototype.push = function(u) {
          var y = u.meta.percent || 0, w = this.entriesCount, A = this._sources.length;
          this.accumulate ? this.contentBuffer.push(u) : (this.bytesWritten += u.data.length, l.prototype.push.call(this, { data: u.data, meta: { currentFile: this.currentFile, percent: w ? (y + 100 * (w - A - 1)) / w : 100 } }));
        }, m.prototype.openedSource = function(u) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = u.file.name;
          var y = this.streamFiles && !u.file.dir;
          if (y) {
            var w = a(u, y, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: w.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, m.prototype.closedSource = function(u) {
          this.accumulate = !1;
          var y = this.streamFiles && !u.file.dir, w = a(u, y, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(w.dirRecord), y) this.push({ data: (function(A) {
            return g.DATA_DESCRIPTOR + i(A.crc32, 4) + i(A.compressedSize, 4) + i(A.uncompressedSize, 4);
          })(u), meta: { percent: 100 } });
          else for (this.push({ data: w.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, m.prototype.flush = function() {
          for (var u = this.bytesWritten, y = 0; y < this.dirRecords.length; y++) this.push({ data: this.dirRecords[y], meta: { percent: 100 } });
          var w = this.bytesWritten - u, A = (function(k, v, N, E, S) {
            var z = o.transformTo("string", S(E));
            return g.CENTRAL_DIRECTORY_END + "\0\0\0\0" + i(k, 2) + i(k, 2) + i(v, 4) + i(N, 4) + i(z.length, 2) + z;
          })(this.dirRecords.length, w, u, this.zipComment, this.encodeFileName);
          this.push({ data: A, meta: { percent: 100 } });
        }, m.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, m.prototype.registerPrevious = function(u) {
          this._sources.push(u);
          var y = this;
          return u.on("data", function(w) {
            y.processChunk(w);
          }), u.on("end", function() {
            y.closedSource(y.previous.streamInfo), y._sources.length ? y.prepareNextSource() : y.end();
          }), u.on("error", function(w) {
            y.error(w);
          }), this;
        }, m.prototype.resume = function() {
          return !!l.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, m.prototype.error = function(u) {
          var y = this._sources;
          if (!l.prototype.error.call(this, u)) return !1;
          for (var w = 0; w < y.length; w++) try {
            y[w].error(u);
          } catch {
          }
          return !0;
        }, m.prototype.lock = function() {
          l.prototype.lock.call(this);
          for (var u = this._sources, y = 0; y < u.length; y++) u[y].lock();
        }, n.exports = m;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(t, n, s) {
        var i = t("../compressions"), a = t("./ZipFileWorker");
        s.generateWorker = function(o, l, d) {
          var f = new a(l.streamFiles, d, l.platform, l.encodeFileName), g = 0;
          try {
            o.forEach(function(m, u) {
              g++;
              var y = (function(v, N) {
                var E = v || N, S = i[E];
                if (!S) throw new Error(E + " is not a valid compression method !");
                return S;
              })(u.options.compression, l.compression), w = u.options.compressionOptions || l.compressionOptions || {}, A = u.dir, k = u.date;
              u._compressWorker(y, w).withStreamInfo("file", { name: m, dir: A, date: k, comment: u.comment || "", unixPermissions: u.unixPermissions, dosPermissions: u.dosPermissions }).pipe(f);
            }), f.entriesCount = g;
          } catch (m) {
            f.error(m);
          }
          return f;
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
        var i = t("./utils"), a = t("./external"), o = t("./utf8"), l = t("./zipEntries"), d = t("./stream/Crc32Probe"), f = t("./nodejsUtils");
        function g(m) {
          return new a.Promise(function(u, y) {
            var w = m.decompressed.getContentWorker().pipe(new d());
            w.on("error", function(A) {
              y(A);
            }).on("end", function() {
              w.streamInfo.crc32 !== m.decompressed.crc32 ? y(new Error("Corrupted zip : CRC32 mismatch")) : u();
            }).resume();
          });
        }
        n.exports = function(m, u) {
          var y = this;
          return u = i.extend(u || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: o.utf8decode }), f.isNode && f.isStream(m) ? a.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : i.prepareContent("the loaded zip file", m, !0, u.optimizedBinaryString, u.base64).then(function(w) {
            var A = new l(u);
            return A.load(w), A;
          }).then(function(w) {
            var A = [a.Promise.resolve(w)], k = w.files;
            if (u.checkCRC32) for (var v = 0; v < k.length; v++) A.push(g(k[v]));
            return a.Promise.all(A);
          }).then(function(w) {
            for (var A = w.shift(), k = A.files, v = 0; v < k.length; v++) {
              var N = k[v], E = N.fileNameStr, S = i.resolve(N.fileNameStr);
              y.file(S, N.decompressed, { binary: !0, optimizedBinaryString: !0, date: N.date, dir: N.dir, comment: N.fileCommentStr.length ? N.fileCommentStr : null, unixPermissions: N.unixPermissions, dosPermissions: N.dosPermissions, createFolders: u.createFolders }), N.dir || (y.file(S).unsafeOriginalName = E);
            }
            return A.zipComment.length && (y.comment = A.zipComment), y;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(t, n, s) {
        var i = t("../utils"), a = t("../stream/GenericWorker");
        function o(l, d) {
          a.call(this, "Nodejs stream input adapter for " + l), this._upstreamEnded = !1, this._bindStream(d);
        }
        i.inherits(o, a), o.prototype._bindStream = function(l) {
          var d = this;
          (this._stream = l).pause(), l.on("data", function(f) {
            d.push({ data: f, meta: { percent: 0 } });
          }).on("error", function(f) {
            d.isPaused ? this.generatedError = f : d.error(f);
          }).on("end", function() {
            d.isPaused ? d._upstreamEnded = !0 : d.end();
          });
        }, o.prototype.pause = function() {
          return !!a.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, o.prototype.resume = function() {
          return !!a.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, n.exports = o;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(t, n, s) {
        var i = t("readable-stream").Readable;
        function a(o, l, d) {
          i.call(this, l), this._helper = o;
          var f = this;
          o.on("data", function(g, m) {
            f.push(g) || f._helper.pause(), d && d(m);
          }).on("error", function(g) {
            f.emit("error", g);
          }).on("end", function() {
            f.push(null);
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
          var U, Q = o.getTypeOf(z), O = o.extend(x || {}, f);
          O.date = O.date || /* @__PURE__ */ new Date(), O.compression !== null && (O.compression = O.compression.toUpperCase()), typeof O.unixPermissions == "string" && (O.unixPermissions = parseInt(O.unixPermissions, 8)), O.unixPermissions && 16384 & O.unixPermissions && (O.dir = !0), O.dosPermissions && 16 & O.dosPermissions && (O.dir = !0), O.dir && (S = k(S)), O.createFolders && (U = A(S)) && v.call(this, U, !0);
          var K = Q === "string" && O.binary === !1 && O.base64 === !1;
          x && x.binary !== void 0 || (O.binary = !K), (z instanceof g && z.uncompressedSize === 0 || O.dir || !z || z.length === 0) && (O.base64 = !1, O.binary = !0, z = "", O.compression = "STORE", Q = "string");
          var B = null;
          B = z instanceof g || z instanceof l ? z : y.isNode && y.isStream(z) ? new w(S, z) : o.prepareContent(S, z, O.binary, O.optimizedBinaryString, O.base64);
          var R = new m(S, B, O);
          this.files[S] = R;
        }
        var a = t("./utf8"), o = t("./utils"), l = t("./stream/GenericWorker"), d = t("./stream/StreamHelper"), f = t("./defaults"), g = t("./compressedObject"), m = t("./zipObject"), u = t("./generate"), y = t("./nodejsUtils"), w = t("./nodejs/NodejsStreamInputAdapter"), A = function(S) {
          S.slice(-1) === "/" && (S = S.substring(0, S.length - 1));
          var z = S.lastIndexOf("/");
          return 0 < z ? S.substring(0, z) : "";
        }, k = function(S) {
          return S.slice(-1) !== "/" && (S += "/"), S;
        }, v = function(S, z) {
          return z = z !== void 0 ? z : f.createFolders, S = k(S), this.files[S] || i.call(this, S, null, { dir: !0, createFolders: z }), this.files[S];
        };
        function N(S) {
          return Object.prototype.toString.call(S) === "[object RegExp]";
        }
        var E = { load: function() {
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
          if (N(S)) {
            var U = S;
            return this.filter(function(O, K) {
              return !K.dir && U.test(O);
            });
          }
          var Q = this.files[this.root + S];
          return Q && !Q.dir ? Q : null;
        }, folder: function(S) {
          if (!S) return this;
          if (N(S)) return this.filter(function(Q, O) {
            return O.dir && S.test(Q);
          });
          var z = this.root + S, x = v.call(this, z), U = this.clone();
          return U.root = x.name, U;
        }, remove: function(S) {
          S = this.root + S;
          var z = this.files[S];
          if (z || (S.slice(-1) !== "/" && (S += "/"), z = this.files[S]), z && !z.dir) delete this.files[S];
          else for (var x = this.filter(function(Q, O) {
            return O.name.slice(0, S.length) === S;
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
          return new d(z, x.type || "string", x.mimeType);
        }, generateAsync: function(S, z) {
          return this.generateInternalStream(S).accumulate(z);
        }, generateNodeStream: function(S, z) {
          return (S = S || {}).type || (S.type = "nodebuffer"), this.generateInternalStream(S).toNodejsStream(z);
        } };
        n.exports = E;
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
          for (var l = o.charCodeAt(0), d = o.charCodeAt(1), f = o.charCodeAt(2), g = o.charCodeAt(3), m = this.length - 4; 0 <= m; --m) if (this.data[m] === l && this.data[m + 1] === d && this.data[m + 2] === f && this.data[m + 3] === g) return m - this.zero;
          return -1;
        }, a.prototype.readAndCheckSignature = function(o) {
          var l = o.charCodeAt(0), d = o.charCodeAt(1), f = o.charCodeAt(2), g = o.charCodeAt(3), m = this.readData(4);
          return l === m[0] && d === m[1] && f === m[2] && g === m[3];
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
          var l, d = 0;
          for (this.checkOffset(o), l = this.index + o - 1; l >= this.index; l--) d = (d << 8) + this.byteAt(l);
          return this.index += o, d;
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
        var i = t("../utils"), a = t("../support"), o = t("./ArrayReader"), l = t("./StringReader"), d = t("./NodeBufferReader"), f = t("./Uint8ArrayReader");
        n.exports = function(g) {
          var m = i.getTypeOf(g);
          return i.checkSupport(m), m !== "string" || a.uint8array ? m === "nodebuffer" ? new d(g) : a.uint8array ? new f(i.transformTo("uint8array", g)) : new o(i.transformTo("array", g)) : new l(g);
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
            var d = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = d + l.data.length;
          }
          a.prototype.processChunk.call(this, l);
        }, n.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(t, n, s) {
        var i = t("../utils"), a = t("./GenericWorker");
        function o(l) {
          a.call(this, "DataWorker");
          var d = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, l.then(function(f) {
            d.dataIsReady = !0, d.data = f, d.max = f && f.length || 0, d.type = i.getTypeOf(f), d.isPaused || d._tickAndRepeat();
          }, function(f) {
            d.error(f);
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
          var l = null, d = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              l = this.data.substring(this.index, d);
              break;
            case "uint8array":
              l = this.data.subarray(this.index, d);
              break;
            case "array":
            case "nodebuffer":
              l = this.data.slice(this.index, d);
          }
          return this.index = d, this.push({ data: l, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
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
        var i = t("../utils"), a = t("./ConvertWorker"), o = t("./GenericWorker"), l = t("../base64"), d = t("../support"), f = t("../external"), g = null;
        if (d.nodestream) try {
          g = t("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function m(y, w) {
          return new f.Promise(function(A, k) {
            var v = [], N = y._internalType, E = y._outputType, S = y._mimeType;
            y.on("data", function(z, x) {
              v.push(z), w && w(x);
            }).on("error", function(z) {
              v = [], k(z);
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
                })(E, (function(x, U) {
                  var Q, O = 0, K = null, B = 0;
                  for (Q = 0; Q < U.length; Q++) B += U[Q].length;
                  switch (x) {
                    case "string":
                      return U.join("");
                    case "array":
                      return Array.prototype.concat.apply([], U);
                    case "uint8array":
                      for (K = new Uint8Array(B), Q = 0; Q < U.length; Q++) K.set(U[Q], O), O += U[Q].length;
                      return K;
                    case "nodebuffer":
                      return Buffer.concat(U);
                    default:
                      throw new Error("concat : unsupported type '" + x + "'");
                  }
                })(N, v), S);
                A(z);
              } catch (x) {
                k(x);
              }
              v = [];
            }).resume();
          });
        }
        function u(y, w, A) {
          var k = w;
          switch (w) {
            case "blob":
            case "arraybuffer":
              k = "uint8array";
              break;
            case "base64":
              k = "string";
          }
          try {
            this._internalType = k, this._outputType = w, this._mimeType = A, i.checkSupport(k), this._worker = y.pipe(new a(k)), y.lock();
          } catch (v) {
            this._worker = new o("error"), this._worker.error(v);
          }
        }
        u.prototype = { accumulate: function(y) {
          return m(this, y);
        }, on: function(y, w) {
          var A = this;
          return y === "data" ? this._worker.on(y, function(k) {
            w.call(A, k.data, k.meta);
          }) : this._worker.on(y, function() {
            i.delay(w, arguments, A);
          }), this;
        }, resume: function() {
          return i.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(y) {
          if (i.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new g(this, { objectMode: this._outputType !== "nodebuffer" }, y);
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
        for (var i = t("./utils"), a = t("./support"), o = t("./nodejsUtils"), l = t("./stream/GenericWorker"), d = new Array(256), f = 0; f < 256; f++) d[f] = 252 <= f ? 6 : 248 <= f ? 5 : 240 <= f ? 4 : 224 <= f ? 3 : 192 <= f ? 2 : 1;
        d[254] = d[254] = 1;
        function g() {
          l.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function m() {
          l.call(this, "utf-8 encode");
        }
        s.utf8encode = function(u) {
          return a.nodebuffer ? o.newBufferFrom(u, "utf-8") : (function(y) {
            var w, A, k, v, N, E = y.length, S = 0;
            for (v = 0; v < E; v++) (64512 & (A = y.charCodeAt(v))) == 55296 && v + 1 < E && (64512 & (k = y.charCodeAt(v + 1))) == 56320 && (A = 65536 + (A - 55296 << 10) + (k - 56320), v++), S += A < 128 ? 1 : A < 2048 ? 2 : A < 65536 ? 3 : 4;
            for (w = a.uint8array ? new Uint8Array(S) : new Array(S), v = N = 0; N < S; v++) (64512 & (A = y.charCodeAt(v))) == 55296 && v + 1 < E && (64512 & (k = y.charCodeAt(v + 1))) == 56320 && (A = 65536 + (A - 55296 << 10) + (k - 56320), v++), A < 128 ? w[N++] = A : (A < 2048 ? w[N++] = 192 | A >>> 6 : (A < 65536 ? w[N++] = 224 | A >>> 12 : (w[N++] = 240 | A >>> 18, w[N++] = 128 | A >>> 12 & 63), w[N++] = 128 | A >>> 6 & 63), w[N++] = 128 | 63 & A);
            return w;
          })(u);
        }, s.utf8decode = function(u) {
          return a.nodebuffer ? i.transformTo("nodebuffer", u).toString("utf-8") : (function(y) {
            var w, A, k, v, N = y.length, E = new Array(2 * N);
            for (w = A = 0; w < N; ) if ((k = y[w++]) < 128) E[A++] = k;
            else if (4 < (v = d[k])) E[A++] = 65533, w += v - 1;
            else {
              for (k &= v === 2 ? 31 : v === 3 ? 15 : 7; 1 < v && w < N; ) k = k << 6 | 63 & y[w++], v--;
              1 < v ? E[A++] = 65533 : k < 65536 ? E[A++] = k : (k -= 65536, E[A++] = 55296 | k >> 10 & 1023, E[A++] = 56320 | 1023 & k);
            }
            return E.length !== A && (E.subarray ? E = E.subarray(0, A) : E.length = A), i.applyFromCharCode(E);
          })(u = i.transformTo(a.uint8array ? "uint8array" : "array", u));
        }, i.inherits(g, l), g.prototype.processChunk = function(u) {
          var y = i.transformTo(a.uint8array ? "uint8array" : "array", u.data);
          if (this.leftOver && this.leftOver.length) {
            if (a.uint8array) {
              var w = y;
              (y = new Uint8Array(w.length + this.leftOver.length)).set(this.leftOver, 0), y.set(w, this.leftOver.length);
            } else y = this.leftOver.concat(y);
            this.leftOver = null;
          }
          var A = (function(v, N) {
            var E;
            for ((N = N || v.length) > v.length && (N = v.length), E = N - 1; 0 <= E && (192 & v[E]) == 128; ) E--;
            return E < 0 || E === 0 ? N : E + d[v[E]] > N ? E : N;
          })(y), k = y;
          A !== y.length && (a.uint8array ? (k = y.subarray(0, A), this.leftOver = y.subarray(A, y.length)) : (k = y.slice(0, A), this.leftOver = y.slice(A, y.length))), this.push({ data: s.utf8decode(k), meta: u.meta });
        }, g.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: s.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, s.Utf8DecodeWorker = g, i.inherits(m, l), m.prototype.processChunk = function(u) {
          this.push({ data: s.utf8encode(u.data), meta: u.meta });
        }, s.Utf8EncodeWorker = m;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(t, n, s) {
        var i = t("./support"), a = t("./base64"), o = t("./nodejsUtils"), l = t("./external");
        function d(w) {
          return w;
        }
        function f(w, A) {
          for (var k = 0; k < w.length; ++k) A[k] = 255 & w.charCodeAt(k);
          return A;
        }
        t("setimmediate"), s.newBlob = function(w, A) {
          s.checkSupport("blob");
          try {
            return new Blob([w], { type: A });
          } catch {
            try {
              var k = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return k.append(w), k.getBlob(A);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var g = { stringifyByChunk: function(w, A, k) {
          var v = [], N = 0, E = w.length;
          if (E <= k) return String.fromCharCode.apply(null, w);
          for (; N < E; ) A === "array" || A === "nodebuffer" ? v.push(String.fromCharCode.apply(null, w.slice(N, Math.min(N + k, E)))) : v.push(String.fromCharCode.apply(null, w.subarray(N, Math.min(N + k, E)))), N += k;
          return v.join("");
        }, stringifyByChar: function(w) {
          for (var A = "", k = 0; k < w.length; k++) A += String.fromCharCode(w[k]);
          return A;
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
        function m(w) {
          var A = 65536, k = s.getTypeOf(w), v = !0;
          if (k === "uint8array" ? v = g.applyCanBeUsed.uint8array : k === "nodebuffer" && (v = g.applyCanBeUsed.nodebuffer), v) for (; 1 < A; ) try {
            return g.stringifyByChunk(w, k, A);
          } catch {
            A = Math.floor(A / 2);
          }
          return g.stringifyByChar(w);
        }
        function u(w, A) {
          for (var k = 0; k < w.length; k++) A[k] = w[k];
          return A;
        }
        s.applyFromCharCode = m;
        var y = {};
        y.string = { string: d, array: function(w) {
          return f(w, new Array(w.length));
        }, arraybuffer: function(w) {
          return y.string.uint8array(w).buffer;
        }, uint8array: function(w) {
          return f(w, new Uint8Array(w.length));
        }, nodebuffer: function(w) {
          return f(w, o.allocBuffer(w.length));
        } }, y.array = { string: m, array: d, arraybuffer: function(w) {
          return new Uint8Array(w).buffer;
        }, uint8array: function(w) {
          return new Uint8Array(w);
        }, nodebuffer: function(w) {
          return o.newBufferFrom(w);
        } }, y.arraybuffer = { string: function(w) {
          return m(new Uint8Array(w));
        }, array: function(w) {
          return u(new Uint8Array(w), new Array(w.byteLength));
        }, arraybuffer: d, uint8array: function(w) {
          return new Uint8Array(w);
        }, nodebuffer: function(w) {
          return o.newBufferFrom(new Uint8Array(w));
        } }, y.uint8array = { string: m, array: function(w) {
          return u(w, new Array(w.length));
        }, arraybuffer: function(w) {
          return w.buffer;
        }, uint8array: d, nodebuffer: function(w) {
          return o.newBufferFrom(w);
        } }, y.nodebuffer = { string: m, array: function(w) {
          return u(w, new Array(w.length));
        }, arraybuffer: function(w) {
          return y.nodebuffer.uint8array(w).buffer;
        }, uint8array: function(w) {
          return u(w, new Uint8Array(w.length));
        }, nodebuffer: d }, s.transformTo = function(w, A) {
          if (A = A || "", !w) return A;
          s.checkSupport(w);
          var k = s.getTypeOf(A);
          return y[k][w](A);
        }, s.resolve = function(w) {
          for (var A = w.split("/"), k = [], v = 0; v < A.length; v++) {
            var N = A[v];
            N === "." || N === "" && v !== 0 && v !== A.length - 1 || (N === ".." ? k.pop() : k.push(N));
          }
          return k.join("/");
        }, s.getTypeOf = function(w) {
          if (typeof w == "string") return "string";
          var A = Object.prototype.toString.call(w);
          return A === "[object Array]" ? "array" : i.nodebuffer && o.isBuffer(w) ? "nodebuffer" : i.uint8array && A === "[object Uint8Array]" ? "uint8array" : i.arraybuffer && A === "[object ArrayBuffer]" ? "arraybuffer" : void 0;
        }, s.checkSupport = function(w) {
          if (!i[w.toLowerCase()]) throw new Error(w + " is not supported by this platform");
        }, s.MAX_VALUE_16BITS = 65535, s.MAX_VALUE_32BITS = -1, s.pretty = function(w) {
          var A, k, v = "";
          for (k = 0; k < (w || "").length; k++) v += "\\x" + ((A = w.charCodeAt(k)) < 16 ? "0" : "") + A.toString(16).toUpperCase();
          return v;
        }, s.delay = function(w, A, k) {
          setImmediate(function() {
            w.apply(k || null, A || []);
          });
        }, s.inherits = function(w, A) {
          function k() {
          }
          k.prototype = A.prototype, w.prototype = new k();
        }, s.extend = function() {
          var w, A, k = {};
          for (w = 0; w < arguments.length; w++) for (A in arguments[w]) Object.prototype.hasOwnProperty.call(arguments[w], A) && k[A] === void 0 && (k[A] = arguments[w][A]);
          return k;
        }, s.prepareContent = function(w, A, k, v, N) {
          return l.Promise.resolve(A).then(function(E) {
            return i.blob && (E instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(E)) !== -1) ? Blob.prototype.arrayBuffer !== void 0 ? E.arrayBuffer() : typeof FileReader < "u" ? new l.Promise(function(S, z) {
              var x = new FileReader();
              x.onload = function(U) {
                S(U.target.result);
              }, x.onerror = function(U) {
                z(U.target.error);
              }, x.readAsArrayBuffer(E);
            }) : l.Promise.reject(new Error(w + " is a Blob, but we have no way of reading it.")) : E;
          }).then(function(E) {
            var S = s.getTypeOf(E);
            return S ? (S === "arraybuffer" ? E = s.transformTo("uint8array", E) : S === "string" && (N ? E = a.decode(E) : k && v !== !0 && (E = (function(z) {
              return f(z, i.uint8array ? new Uint8Array(z.length) : new Array(z.length));
            })(E))), E) : l.Promise.reject(new Error("Can't read the data of '" + w + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(t, n, s) {
        var i = t("./reader/readerFor"), a = t("./utils"), o = t("./signature"), l = t("./zipEntry"), d = t("./support");
        function f(g) {
          this.files = [], this.loadOptions = g;
        }
        f.prototype = { checkSignature: function(g) {
          if (!this.reader.readAndCheckSignature(g)) {
            this.reader.index -= 4;
            var m = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + a.pretty(m) + ", expected " + a.pretty(g) + ")");
          }
        }, isSignature: function(g, m) {
          var u = this.reader.index;
          this.reader.setIndex(g);
          var y = this.reader.readString(4) === m;
          return this.reader.setIndex(u), y;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var g = this.reader.readData(this.zipCommentLength), m = d.uint8array ? "uint8array" : "array", u = a.transformTo(m, g);
          this.zipComment = this.loadOptions.decodeFileName(u);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var g, m, u, y = this.zip64EndOfCentralSize - 44; 0 < y; ) g = this.reader.readInt(2), m = this.reader.readInt(4), u = this.reader.readData(m), this.zip64ExtensibleData[g] = { id: g, length: m, value: u };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var g, m;
          for (g = 0; g < this.files.length; g++) m = this.files[g], this.reader.setIndex(m.localHeaderOffset), this.checkSignature(o.LOCAL_FILE_HEADER), m.readLocalPart(this.reader), m.handleUTF8(), m.processAttributes();
        }, readCentralDir: function() {
          var g;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(o.CENTRAL_FILE_HEADER); ) (g = new l({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(g);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var g = this.reader.lastIndexOfSignature(o.CENTRAL_DIRECTORY_END);
          if (g < 0) throw this.isSignature(0, o.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(g);
          var m = g;
          if (this.checkSignature(o.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === a.MAX_VALUE_16BITS || this.diskWithCentralDirStart === a.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === a.MAX_VALUE_16BITS || this.centralDirRecords === a.MAX_VALUE_16BITS || this.centralDirSize === a.MAX_VALUE_32BITS || this.centralDirOffset === a.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (g = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(g), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, o.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var u = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (u += 20, u += 12 + this.zip64EndOfCentralSize);
          var y = m - u;
          if (0 < y) this.isSignature(m, o.CENTRAL_FILE_HEADER) || (this.reader.zero = y);
          else if (y < 0) throw new Error("Corrupted zip: missing " + Math.abs(y) + " bytes.");
        }, prepareReader: function(g) {
          this.reader = i(g);
        }, load: function(g) {
          this.prepareReader(g), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, n.exports = f;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(t, n, s) {
        var i = t("./reader/readerFor"), a = t("./utils"), o = t("./compressedObject"), l = t("./crc32"), d = t("./utf8"), f = t("./compressions"), g = t("./support");
        function m(u, y) {
          this.options = u, this.loadOptions = y;
        }
        m.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(u) {
          var y, w;
          if (u.skip(22), this.fileNameLength = u.readInt(2), w = u.readInt(2), this.fileName = u.readData(this.fileNameLength), u.skip(w), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((y = (function(A) {
            for (var k in f) if (Object.prototype.hasOwnProperty.call(f, k) && f[k].magic === A) return f[k];
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
          var y, w, A, k = u.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); u.index + 4 < k; ) y = u.readInt(2), w = u.readInt(2), A = u.readData(w), this.extraFields[y] = { id: y, length: w, value: A };
          u.setIndex(k);
        }, handleUTF8: function() {
          var u = g.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = d.utf8decode(this.fileName), this.fileCommentStr = d.utf8decode(this.fileComment);
          else {
            var y = this.findExtraFieldUnicodePath();
            if (y !== null) this.fileNameStr = y;
            else {
              var w = a.transformTo(u, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(w);
            }
            var A = this.findExtraFieldUnicodeComment();
            if (A !== null) this.fileCommentStr = A;
            else {
              var k = a.transformTo(u, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(k);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var u = this.extraFields[28789];
          if (u) {
            var y = i(u.value);
            return y.readInt(1) !== 1 || l(this.fileName) !== y.readInt(4) ? null : d.utf8decode(y.readData(u.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var u = this.extraFields[25461];
          if (u) {
            var y = i(u.value);
            return y.readInt(1) !== 1 || l(this.fileComment) !== y.readInt(4) ? null : d.utf8decode(y.readData(u.length - 5));
          }
          return null;
        } }, n.exports = m;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(t, n, s) {
        function i(y, w, A) {
          this.name = y, this.dir = A.dir, this.date = A.date, this.comment = A.comment, this.unixPermissions = A.unixPermissions, this.dosPermissions = A.dosPermissions, this._data = w, this._dataBinary = A.binary, this.options = { compression: A.compression, compressionOptions: A.compressionOptions };
        }
        var a = t("./stream/StreamHelper"), o = t("./stream/DataWorker"), l = t("./utf8"), d = t("./compressedObject"), f = t("./stream/GenericWorker");
        i.prototype = { internalStream: function(y) {
          var w = null, A = "string";
          try {
            if (!y) throw new Error("No output type specified.");
            var k = (A = y.toLowerCase()) === "string" || A === "text";
            A !== "binarystring" && A !== "text" || (A = "string"), w = this._decompressWorker();
            var v = !this._dataBinary;
            v && !k && (w = w.pipe(new l.Utf8EncodeWorker())), !v && k && (w = w.pipe(new l.Utf8DecodeWorker()));
          } catch (N) {
            (w = new f("error")).error(N);
          }
          return new a(w, A, "");
        }, async: function(y, w) {
          return this.internalStream(y).accumulate(w);
        }, nodeStream: function(y, w) {
          return this.internalStream(y || "nodebuffer").toNodejsStream(w);
        }, _compressWorker: function(y, w) {
          if (this._data instanceof d && this._data.compression.magic === y.magic) return this._data.getCompressedWorker();
          var A = this._decompressWorker();
          return this._dataBinary || (A = A.pipe(new l.Utf8EncodeWorker())), d.createWorkerFrom(A, y, w);
        }, _decompressWorker: function() {
          return this._data instanceof d ? this._data.getContentWorker() : this._data instanceof f ? this._data : new o(this._data);
        } };
        for (var g = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], m = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, u = 0; u < g.length; u++) i.prototype[g[u]] = m;
        n.exports = i;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(t, n, s) {
        (function(i) {
          var a, o, l = i.MutationObserver || i.WebKitMutationObserver;
          if (l) {
            var d = 0, f = new l(y), g = i.document.createTextNode("");
            f.observe(g, { characterData: !0 }), a = function() {
              g.data = d = ++d % 2;
            };
          } else if (i.setImmediate || i.MessageChannel === void 0) a = "document" in i && "onreadystatechange" in i.document.createElement("script") ? function() {
            var w = i.document.createElement("script");
            w.onreadystatechange = function() {
              y(), w.onreadystatechange = null, w.parentNode.removeChild(w), w = null;
            }, i.document.documentElement.appendChild(w);
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
            var w, A;
            o = !0;
            for (var k = u.length; k; ) {
              for (A = u, u = [], w = -1; ++w < k; ) A[w]();
              k = u.length;
            }
            o = !1;
          }
          n.exports = function(w) {
            u.push(w) !== 1 || o || a();
          };
        }).call(this, typeof Cn < "u" ? Cn : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(t, n, s) {
        var i = t("immediate");
        function a() {
        }
        var o = {}, l = ["REJECTED"], d = ["FULFILLED"], f = ["PENDING"];
        function g(k) {
          if (typeof k != "function") throw new TypeError("resolver must be a function");
          this.state = f, this.queue = [], this.outcome = void 0, k !== a && w(this, k);
        }
        function m(k, v, N) {
          this.promise = k, typeof v == "function" && (this.onFulfilled = v, this.callFulfilled = this.otherCallFulfilled), typeof N == "function" && (this.onRejected = N, this.callRejected = this.otherCallRejected);
        }
        function u(k, v, N) {
          i(function() {
            var E;
            try {
              E = v(N);
            } catch (S) {
              return o.reject(k, S);
            }
            E === k ? o.reject(k, new TypeError("Cannot resolve promise with itself")) : o.resolve(k, E);
          });
        }
        function y(k) {
          var v = k && k.then;
          if (k && (typeof k == "object" || typeof k == "function") && typeof v == "function") return function() {
            v.apply(k, arguments);
          };
        }
        function w(k, v) {
          var N = !1;
          function E(x) {
            N || (N = !0, o.reject(k, x));
          }
          function S(x) {
            N || (N = !0, o.resolve(k, x));
          }
          var z = A(function() {
            v(S, E);
          });
          z.status === "error" && E(z.value);
        }
        function A(k, v) {
          var N = {};
          try {
            N.value = k(v), N.status = "success";
          } catch (E) {
            N.status = "error", N.value = E;
          }
          return N;
        }
        (n.exports = g).prototype.finally = function(k) {
          if (typeof k != "function") return this;
          var v = this.constructor;
          return this.then(function(N) {
            return v.resolve(k()).then(function() {
              return N;
            });
          }, function(N) {
            return v.resolve(k()).then(function() {
              throw N;
            });
          });
        }, g.prototype.catch = function(k) {
          return this.then(null, k);
        }, g.prototype.then = function(k, v) {
          if (typeof k != "function" && this.state === d || typeof v != "function" && this.state === l) return this;
          var N = new this.constructor(a);
          return this.state !== f ? u(N, this.state === d ? k : v, this.outcome) : this.queue.push(new m(N, k, v)), N;
        }, m.prototype.callFulfilled = function(k) {
          o.resolve(this.promise, k);
        }, m.prototype.otherCallFulfilled = function(k) {
          u(this.promise, this.onFulfilled, k);
        }, m.prototype.callRejected = function(k) {
          o.reject(this.promise, k);
        }, m.prototype.otherCallRejected = function(k) {
          u(this.promise, this.onRejected, k);
        }, o.resolve = function(k, v) {
          var N = A(y, v);
          if (N.status === "error") return o.reject(k, N.value);
          var E = N.value;
          if (E) w(k, E);
          else {
            k.state = d, k.outcome = v;
            for (var S = -1, z = k.queue.length; ++S < z; ) k.queue[S].callFulfilled(v);
          }
          return k;
        }, o.reject = function(k, v) {
          k.state = l, k.outcome = v;
          for (var N = -1, E = k.queue.length; ++N < E; ) k.queue[N].callRejected(v);
          return k;
        }, g.resolve = function(k) {
          return k instanceof this ? k : o.resolve(new this(a), k);
        }, g.reject = function(k) {
          var v = new this(a);
          return o.reject(v, k);
        }, g.all = function(k) {
          var v = this;
          if (Object.prototype.toString.call(k) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var N = k.length, E = !1;
          if (!N) return this.resolve([]);
          for (var S = new Array(N), z = 0, x = -1, U = new this(a); ++x < N; ) Q(k[x], x);
          return U;
          function Q(O, K) {
            v.resolve(O).then(function(B) {
              S[K] = B, ++z !== N || E || (E = !0, o.resolve(U, S));
            }, function(B) {
              E || (E = !0, o.reject(U, B));
            });
          }
        }, g.race = function(k) {
          var v = this;
          if (Object.prototype.toString.call(k) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var N = k.length, E = !1;
          if (!N) return this.resolve([]);
          for (var S = -1, z = new this(a); ++S < N; ) x = k[S], v.resolve(x).then(function(U) {
            E || (E = !0, o.resolve(z, U));
          }, function(U) {
            E || (E = !0, o.reject(z, U));
          });
          var x;
          return z;
        };
      }, { immediate: 36 }], 38: [function(t, n, s) {
        var i = {};
        (0, t("./lib/utils/common").assign)(i, t("./lib/deflate"), t("./lib/inflate"), t("./lib/zlib/constants")), n.exports = i;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(t, n, s) {
        var i = t("./zlib/deflate"), a = t("./utils/common"), o = t("./utils/strings"), l = t("./zlib/messages"), d = t("./zlib/zstream"), f = Object.prototype.toString, g = 0, m = -1, u = 0, y = 8;
        function w(k) {
          if (!(this instanceof w)) return new w(k);
          this.options = a.assign({ level: m, method: y, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: u, to: "" }, k || {});
          var v = this.options;
          v.raw && 0 < v.windowBits ? v.windowBits = -v.windowBits : v.gzip && 0 < v.windowBits && v.windowBits < 16 && (v.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new d(), this.strm.avail_out = 0;
          var N = i.deflateInit2(this.strm, v.level, v.method, v.windowBits, v.memLevel, v.strategy);
          if (N !== g) throw new Error(l[N]);
          if (v.header && i.deflateSetHeader(this.strm, v.header), v.dictionary) {
            var E;
            if (E = typeof v.dictionary == "string" ? o.string2buf(v.dictionary) : f.call(v.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(v.dictionary) : v.dictionary, (N = i.deflateSetDictionary(this.strm, E)) !== g) throw new Error(l[N]);
            this._dict_set = !0;
          }
        }
        function A(k, v) {
          var N = new w(v);
          if (N.push(k, !0), N.err) throw N.msg || l[N.err];
          return N.result;
        }
        w.prototype.push = function(k, v) {
          var N, E, S = this.strm, z = this.options.chunkSize;
          if (this.ended) return !1;
          E = v === ~~v ? v : v === !0 ? 4 : 0, typeof k == "string" ? S.input = o.string2buf(k) : f.call(k) === "[object ArrayBuffer]" ? S.input = new Uint8Array(k) : S.input = k, S.next_in = 0, S.avail_in = S.input.length;
          do {
            if (S.avail_out === 0 && (S.output = new a.Buf8(z), S.next_out = 0, S.avail_out = z), (N = i.deflate(S, E)) !== 1 && N !== g) return this.onEnd(N), !(this.ended = !0);
            S.avail_out !== 0 && (S.avail_in !== 0 || E !== 4 && E !== 2) || (this.options.to === "string" ? this.onData(o.buf2binstring(a.shrinkBuf(S.output, S.next_out))) : this.onData(a.shrinkBuf(S.output, S.next_out)));
          } while ((0 < S.avail_in || S.avail_out === 0) && N !== 1);
          return E === 4 ? (N = i.deflateEnd(this.strm), this.onEnd(N), this.ended = !0, N === g) : E !== 2 || (this.onEnd(g), !(S.avail_out = 0));
        }, w.prototype.onData = function(k) {
          this.chunks.push(k);
        }, w.prototype.onEnd = function(k) {
          k === g && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = a.flattenChunks(this.chunks)), this.chunks = [], this.err = k, this.msg = this.strm.msg;
        }, s.Deflate = w, s.deflate = A, s.deflateRaw = function(k, v) {
          return (v = v || {}).raw = !0, A(k, v);
        }, s.gzip = function(k, v) {
          return (v = v || {}).gzip = !0, A(k, v);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(t, n, s) {
        var i = t("./zlib/inflate"), a = t("./utils/common"), o = t("./utils/strings"), l = t("./zlib/constants"), d = t("./zlib/messages"), f = t("./zlib/zstream"), g = t("./zlib/gzheader"), m = Object.prototype.toString;
        function u(w) {
          if (!(this instanceof u)) return new u(w);
          this.options = a.assign({ chunkSize: 16384, windowBits: 0, to: "" }, w || {});
          var A = this.options;
          A.raw && 0 <= A.windowBits && A.windowBits < 16 && (A.windowBits = -A.windowBits, A.windowBits === 0 && (A.windowBits = -15)), !(0 <= A.windowBits && A.windowBits < 16) || w && w.windowBits || (A.windowBits += 32), 15 < A.windowBits && A.windowBits < 48 && (15 & A.windowBits) == 0 && (A.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new f(), this.strm.avail_out = 0;
          var k = i.inflateInit2(this.strm, A.windowBits);
          if (k !== l.Z_OK) throw new Error(d[k]);
          this.header = new g(), i.inflateGetHeader(this.strm, this.header);
        }
        function y(w, A) {
          var k = new u(A);
          if (k.push(w, !0), k.err) throw k.msg || d[k.err];
          return k.result;
        }
        u.prototype.push = function(w, A) {
          var k, v, N, E, S, z, x = this.strm, U = this.options.chunkSize, Q = this.options.dictionary, O = !1;
          if (this.ended) return !1;
          v = A === ~~A ? A : A === !0 ? l.Z_FINISH : l.Z_NO_FLUSH, typeof w == "string" ? x.input = o.binstring2buf(w) : m.call(w) === "[object ArrayBuffer]" ? x.input = new Uint8Array(w) : x.input = w, x.next_in = 0, x.avail_in = x.input.length;
          do {
            if (x.avail_out === 0 && (x.output = new a.Buf8(U), x.next_out = 0, x.avail_out = U), (k = i.inflate(x, l.Z_NO_FLUSH)) === l.Z_NEED_DICT && Q && (z = typeof Q == "string" ? o.string2buf(Q) : m.call(Q) === "[object ArrayBuffer]" ? new Uint8Array(Q) : Q, k = i.inflateSetDictionary(this.strm, z)), k === l.Z_BUF_ERROR && O === !0 && (k = l.Z_OK, O = !1), k !== l.Z_STREAM_END && k !== l.Z_OK) return this.onEnd(k), !(this.ended = !0);
            x.next_out && (x.avail_out !== 0 && k !== l.Z_STREAM_END && (x.avail_in !== 0 || v !== l.Z_FINISH && v !== l.Z_SYNC_FLUSH) || (this.options.to === "string" ? (N = o.utf8border(x.output, x.next_out), E = x.next_out - N, S = o.buf2string(x.output, N), x.next_out = E, x.avail_out = U - E, E && a.arraySet(x.output, x.output, N, E, 0), this.onData(S)) : this.onData(a.shrinkBuf(x.output, x.next_out)))), x.avail_in === 0 && x.avail_out === 0 && (O = !0);
          } while ((0 < x.avail_in || x.avail_out === 0) && k !== l.Z_STREAM_END);
          return k === l.Z_STREAM_END && (v = l.Z_FINISH), v === l.Z_FINISH ? (k = i.inflateEnd(this.strm), this.onEnd(k), this.ended = !0, k === l.Z_OK) : v !== l.Z_SYNC_FLUSH || (this.onEnd(l.Z_OK), !(x.avail_out = 0));
        }, u.prototype.onData = function(w) {
          this.chunks.push(w);
        }, u.prototype.onEnd = function(w) {
          w === l.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = a.flattenChunks(this.chunks)), this.chunks = [], this.err = w, this.msg = this.strm.msg;
        }, s.Inflate = u, s.inflate = y, s.inflateRaw = function(w, A) {
          return (A = A || {}).raw = !0, y(w, A);
        }, s.ungzip = y;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(t, n, s) {
        var i = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        s.assign = function(l) {
          for (var d = Array.prototype.slice.call(arguments, 1); d.length; ) {
            var f = d.shift();
            if (f) {
              if (typeof f != "object") throw new TypeError(f + "must be non-object");
              for (var g in f) f.hasOwnProperty(g) && (l[g] = f[g]);
            }
          }
          return l;
        }, s.shrinkBuf = function(l, d) {
          return l.length === d ? l : l.subarray ? l.subarray(0, d) : (l.length = d, l);
        };
        var a = { arraySet: function(l, d, f, g, m) {
          if (d.subarray && l.subarray) l.set(d.subarray(f, f + g), m);
          else for (var u = 0; u < g; u++) l[m + u] = d[f + u];
        }, flattenChunks: function(l) {
          var d, f, g, m, u, y;
          for (d = g = 0, f = l.length; d < f; d++) g += l[d].length;
          for (y = new Uint8Array(g), d = m = 0, f = l.length; d < f; d++) u = l[d], y.set(u, m), m += u.length;
          return y;
        } }, o = { arraySet: function(l, d, f, g, m) {
          for (var u = 0; u < g; u++) l[m + u] = d[f + u];
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
        for (var l = new i.Buf8(256), d = 0; d < 256; d++) l[d] = 252 <= d ? 6 : 248 <= d ? 5 : 240 <= d ? 4 : 224 <= d ? 3 : 192 <= d ? 2 : 1;
        function f(g, m) {
          if (m < 65537 && (g.subarray && o || !g.subarray && a)) return String.fromCharCode.apply(null, i.shrinkBuf(g, m));
          for (var u = "", y = 0; y < m; y++) u += String.fromCharCode(g[y]);
          return u;
        }
        l[254] = l[254] = 1, s.string2buf = function(g) {
          var m, u, y, w, A, k = g.length, v = 0;
          for (w = 0; w < k; w++) (64512 & (u = g.charCodeAt(w))) == 55296 && w + 1 < k && (64512 & (y = g.charCodeAt(w + 1))) == 56320 && (u = 65536 + (u - 55296 << 10) + (y - 56320), w++), v += u < 128 ? 1 : u < 2048 ? 2 : u < 65536 ? 3 : 4;
          for (m = new i.Buf8(v), w = A = 0; A < v; w++) (64512 & (u = g.charCodeAt(w))) == 55296 && w + 1 < k && (64512 & (y = g.charCodeAt(w + 1))) == 56320 && (u = 65536 + (u - 55296 << 10) + (y - 56320), w++), u < 128 ? m[A++] = u : (u < 2048 ? m[A++] = 192 | u >>> 6 : (u < 65536 ? m[A++] = 224 | u >>> 12 : (m[A++] = 240 | u >>> 18, m[A++] = 128 | u >>> 12 & 63), m[A++] = 128 | u >>> 6 & 63), m[A++] = 128 | 63 & u);
          return m;
        }, s.buf2binstring = function(g) {
          return f(g, g.length);
        }, s.binstring2buf = function(g) {
          for (var m = new i.Buf8(g.length), u = 0, y = m.length; u < y; u++) m[u] = g.charCodeAt(u);
          return m;
        }, s.buf2string = function(g, m) {
          var u, y, w, A, k = m || g.length, v = new Array(2 * k);
          for (u = y = 0; u < k; ) if ((w = g[u++]) < 128) v[y++] = w;
          else if (4 < (A = l[w])) v[y++] = 65533, u += A - 1;
          else {
            for (w &= A === 2 ? 31 : A === 3 ? 15 : 7; 1 < A && u < k; ) w = w << 6 | 63 & g[u++], A--;
            1 < A ? v[y++] = 65533 : w < 65536 ? v[y++] = w : (w -= 65536, v[y++] = 55296 | w >> 10 & 1023, v[y++] = 56320 | 1023 & w);
          }
          return f(v, y);
        }, s.utf8border = function(g, m) {
          var u;
          for ((m = m || g.length) > g.length && (m = g.length), u = m - 1; 0 <= u && (192 & g[u]) == 128; ) u--;
          return u < 0 || u === 0 ? m : u + l[g[u]] > m ? u : m;
        };
      }, { "./common": 41 }], 43: [function(t, n, s) {
        n.exports = function(i, a, o, l) {
          for (var d = 65535 & i | 0, f = i >>> 16 & 65535 | 0, g = 0; o !== 0; ) {
            for (o -= g = 2e3 < o ? 2e3 : o; f = f + (d = d + a[l++] | 0) | 0, --g; ) ;
            d %= 65521, f %= 65521;
          }
          return d | f << 16 | 0;
        };
      }, {}], 44: [function(t, n, s) {
        n.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(t, n, s) {
        var i = (function() {
          for (var a, o = [], l = 0; l < 256; l++) {
            a = l;
            for (var d = 0; d < 8; d++) a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
            o[l] = a;
          }
          return o;
        })();
        n.exports = function(a, o, l, d) {
          var f = i, g = d + l;
          a ^= -1;
          for (var m = d; m < g; m++) a = a >>> 8 ^ f[255 & (a ^ o[m])];
          return -1 ^ a;
        };
      }, {}], 46: [function(t, n, s) {
        var i, a = t("../utils/common"), o = t("./trees"), l = t("./adler32"), d = t("./crc32"), f = t("./messages"), g = 0, m = 4, u = 0, y = -2, w = -1, A = 4, k = 2, v = 8, N = 9, E = 286, S = 30, z = 19, x = 2 * E + 1, U = 15, Q = 3, O = 258, K = O + Q + 1, B = 42, R = 113, b = 1, G = 2, ne = 3, T = 4;
        function ae(c, W) {
          return c.msg = f[W], W;
        }
        function Y(c) {
          return (c << 1) - (4 < c ? 9 : 0);
        }
        function de(c) {
          for (var W = c.length; 0 <= --W; ) c[W] = 0;
        }
        function H(c) {
          var W = c.state, q = W.pending;
          q > c.avail_out && (q = c.avail_out), q !== 0 && (a.arraySet(c.output, W.pending_buf, W.pending_out, q, c.next_out), c.next_out += q, W.pending_out += q, c.total_out += q, c.avail_out -= q, W.pending -= q, W.pending === 0 && (W.pending_out = 0));
        }
        function $(c, W) {
          o._tr_flush_block(c, 0 <= c.block_start ? c.block_start : -1, c.strstart - c.block_start, W), c.block_start = c.strstart, H(c.strm);
        }
        function oe(c, W) {
          c.pending_buf[c.pending++] = W;
        }
        function ce(c, W) {
          c.pending_buf[c.pending++] = W >>> 8 & 255, c.pending_buf[c.pending++] = 255 & W;
        }
        function ie(c, W) {
          var q, C, I = c.max_chain_length, P = c.strstart, ee = c.prev_length, te = c.nice_match, F = c.strstart > c.w_size - K ? c.strstart - (c.w_size - K) : 0, V = c.window, se = c.w_mask, re = c.prev, fe = c.strstart + O, Ee = V[P + ee - 1], we = V[P + ee];
          c.prev_length >= c.good_match && (I >>= 2), te > c.lookahead && (te = c.lookahead);
          do
            if (V[(q = W) + ee] === we && V[q + ee - 1] === Ee && V[q] === V[P] && V[++q] === V[P + 1]) {
              P += 2, q++;
              do
                ;
              while (V[++P] === V[++q] && V[++P] === V[++q] && V[++P] === V[++q] && V[++P] === V[++q] && V[++P] === V[++q] && V[++P] === V[++q] && V[++P] === V[++q] && V[++P] === V[++q] && P < fe);
              if (C = O - (fe - P), P = fe - O, ee < C) {
                if (c.match_start = W, te <= (ee = C)) break;
                Ee = V[P + ee - 1], we = V[P + ee];
              }
            }
          while ((W = re[W & se]) > F && --I != 0);
          return ee <= c.lookahead ? ee : c.lookahead;
        }
        function Ne(c) {
          var W, q, C, I, P, ee, te, F, V, se, re = c.w_size;
          do {
            if (I = c.window_size - c.lookahead - c.strstart, c.strstart >= re + (re - K)) {
              for (a.arraySet(c.window, c.window, re, re, 0), c.match_start -= re, c.strstart -= re, c.block_start -= re, W = q = c.hash_size; C = c.head[--W], c.head[W] = re <= C ? C - re : 0, --q; ) ;
              for (W = q = re; C = c.prev[--W], c.prev[W] = re <= C ? C - re : 0, --q; ) ;
              I += re;
            }
            if (c.strm.avail_in === 0) break;
            if (ee = c.strm, te = c.window, F = c.strstart + c.lookahead, V = I, se = void 0, se = ee.avail_in, V < se && (se = V), q = se === 0 ? 0 : (ee.avail_in -= se, a.arraySet(te, ee.input, ee.next_in, se, F), ee.state.wrap === 1 ? ee.adler = l(ee.adler, te, se, F) : ee.state.wrap === 2 && (ee.adler = d(ee.adler, te, se, F)), ee.next_in += se, ee.total_in += se, se), c.lookahead += q, c.lookahead + c.insert >= Q) for (P = c.strstart - c.insert, c.ins_h = c.window[P], c.ins_h = (c.ins_h << c.hash_shift ^ c.window[P + 1]) & c.hash_mask; c.insert && (c.ins_h = (c.ins_h << c.hash_shift ^ c.window[P + Q - 1]) & c.hash_mask, c.prev[P & c.w_mask] = c.head[c.ins_h], c.head[c.ins_h] = P, P++, c.insert--, !(c.lookahead + c.insert < Q)); ) ;
          } while (c.lookahead < K && c.strm.avail_in !== 0);
        }
        function xe(c, W) {
          for (var q, C; ; ) {
            if (c.lookahead < K) {
              if (Ne(c), c.lookahead < K && W === g) return b;
              if (c.lookahead === 0) break;
            }
            if (q = 0, c.lookahead >= Q && (c.ins_h = (c.ins_h << c.hash_shift ^ c.window[c.strstart + Q - 1]) & c.hash_mask, q = c.prev[c.strstart & c.w_mask] = c.head[c.ins_h], c.head[c.ins_h] = c.strstart), q !== 0 && c.strstart - q <= c.w_size - K && (c.match_length = ie(c, q)), c.match_length >= Q) if (C = o._tr_tally(c, c.strstart - c.match_start, c.match_length - Q), c.lookahead -= c.match_length, c.match_length <= c.max_lazy_match && c.lookahead >= Q) {
              for (c.match_length--; c.strstart++, c.ins_h = (c.ins_h << c.hash_shift ^ c.window[c.strstart + Q - 1]) & c.hash_mask, q = c.prev[c.strstart & c.w_mask] = c.head[c.ins_h], c.head[c.ins_h] = c.strstart, --c.match_length != 0; ) ;
              c.strstart++;
            } else c.strstart += c.match_length, c.match_length = 0, c.ins_h = c.window[c.strstart], c.ins_h = (c.ins_h << c.hash_shift ^ c.window[c.strstart + 1]) & c.hash_mask;
            else C = o._tr_tally(c, 0, c.window[c.strstart]), c.lookahead--, c.strstart++;
            if (C && ($(c, !1), c.strm.avail_out === 0)) return b;
          }
          return c.insert = c.strstart < Q - 1 ? c.strstart : Q - 1, W === m ? ($(c, !0), c.strm.avail_out === 0 ? ne : T) : c.last_lit && ($(c, !1), c.strm.avail_out === 0) ? b : G;
        }
        function j(c, W) {
          for (var q, C, I; ; ) {
            if (c.lookahead < K) {
              if (Ne(c), c.lookahead < K && W === g) return b;
              if (c.lookahead === 0) break;
            }
            if (q = 0, c.lookahead >= Q && (c.ins_h = (c.ins_h << c.hash_shift ^ c.window[c.strstart + Q - 1]) & c.hash_mask, q = c.prev[c.strstart & c.w_mask] = c.head[c.ins_h], c.head[c.ins_h] = c.strstart), c.prev_length = c.match_length, c.prev_match = c.match_start, c.match_length = Q - 1, q !== 0 && c.prev_length < c.max_lazy_match && c.strstart - q <= c.w_size - K && (c.match_length = ie(c, q), c.match_length <= 5 && (c.strategy === 1 || c.match_length === Q && 4096 < c.strstart - c.match_start) && (c.match_length = Q - 1)), c.prev_length >= Q && c.match_length <= c.prev_length) {
              for (I = c.strstart + c.lookahead - Q, C = o._tr_tally(c, c.strstart - 1 - c.prev_match, c.prev_length - Q), c.lookahead -= c.prev_length - 1, c.prev_length -= 2; ++c.strstart <= I && (c.ins_h = (c.ins_h << c.hash_shift ^ c.window[c.strstart + Q - 1]) & c.hash_mask, q = c.prev[c.strstart & c.w_mask] = c.head[c.ins_h], c.head[c.ins_h] = c.strstart), --c.prev_length != 0; ) ;
              if (c.match_available = 0, c.match_length = Q - 1, c.strstart++, C && ($(c, !1), c.strm.avail_out === 0)) return b;
            } else if (c.match_available) {
              if ((C = o._tr_tally(c, 0, c.window[c.strstart - 1])) && $(c, !1), c.strstart++, c.lookahead--, c.strm.avail_out === 0) return b;
            } else c.match_available = 1, c.strstart++, c.lookahead--;
          }
          return c.match_available && (C = o._tr_tally(c, 0, c.window[c.strstart - 1]), c.match_available = 0), c.insert = c.strstart < Q - 1 ? c.strstart : Q - 1, W === m ? ($(c, !0), c.strm.avail_out === 0 ? ne : T) : c.last_lit && ($(c, !1), c.strm.avail_out === 0) ? b : G;
        }
        function ue(c, W, q, C, I) {
          this.good_length = c, this.max_lazy = W, this.nice_length = q, this.max_chain = C, this.func = I;
        }
        function ye() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new a.Buf16(2 * x), this.dyn_dtree = new a.Buf16(2 * (2 * S + 1)), this.bl_tree = new a.Buf16(2 * (2 * z + 1)), de(this.dyn_ltree), de(this.dyn_dtree), de(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new a.Buf16(U + 1), this.heap = new a.Buf16(2 * E + 1), de(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new a.Buf16(2 * E + 1), de(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function pe(c) {
          var W;
          return c && c.state ? (c.total_in = c.total_out = 0, c.data_type = k, (W = c.state).pending = 0, W.pending_out = 0, W.wrap < 0 && (W.wrap = -W.wrap), W.status = W.wrap ? B : R, c.adler = W.wrap === 2 ? 0 : 1, W.last_flush = g, o._tr_init(W), u) : ae(c, y);
        }
        function ge(c) {
          var W = pe(c);
          return W === u && (function(q) {
            q.window_size = 2 * q.w_size, de(q.head), q.max_lazy_match = i[q.level].max_lazy, q.good_match = i[q.level].good_length, q.nice_match = i[q.level].nice_length, q.max_chain_length = i[q.level].max_chain, q.strstart = 0, q.block_start = 0, q.lookahead = 0, q.insert = 0, q.match_length = q.prev_length = Q - 1, q.match_available = 0, q.ins_h = 0;
          })(c.state), W;
        }
        function ke(c, W, q, C, I, P) {
          if (!c) return y;
          var ee = 1;
          if (W === w && (W = 6), C < 0 ? (ee = 0, C = -C) : 15 < C && (ee = 2, C -= 16), I < 1 || N < I || q !== v || C < 8 || 15 < C || W < 0 || 9 < W || P < 0 || A < P) return ae(c, y);
          C === 8 && (C = 9);
          var te = new ye();
          return (c.state = te).strm = c, te.wrap = ee, te.gzhead = null, te.w_bits = C, te.w_size = 1 << te.w_bits, te.w_mask = te.w_size - 1, te.hash_bits = I + 7, te.hash_size = 1 << te.hash_bits, te.hash_mask = te.hash_size - 1, te.hash_shift = ~~((te.hash_bits + Q - 1) / Q), te.window = new a.Buf8(2 * te.w_size), te.head = new a.Buf16(te.hash_size), te.prev = new a.Buf16(te.w_size), te.lit_bufsize = 1 << I + 6, te.pending_buf_size = 4 * te.lit_bufsize, te.pending_buf = new a.Buf8(te.pending_buf_size), te.d_buf = 1 * te.lit_bufsize, te.l_buf = 3 * te.lit_bufsize, te.level = W, te.strategy = P, te.method = q, ge(c);
        }
        i = [new ue(0, 0, 0, 0, function(c, W) {
          var q = 65535;
          for (q > c.pending_buf_size - 5 && (q = c.pending_buf_size - 5); ; ) {
            if (c.lookahead <= 1) {
              if (Ne(c), c.lookahead === 0 && W === g) return b;
              if (c.lookahead === 0) break;
            }
            c.strstart += c.lookahead, c.lookahead = 0;
            var C = c.block_start + q;
            if ((c.strstart === 0 || c.strstart >= C) && (c.lookahead = c.strstart - C, c.strstart = C, $(c, !1), c.strm.avail_out === 0) || c.strstart - c.block_start >= c.w_size - K && ($(c, !1), c.strm.avail_out === 0)) return b;
          }
          return c.insert = 0, W === m ? ($(c, !0), c.strm.avail_out === 0 ? ne : T) : (c.strstart > c.block_start && ($(c, !1), c.strm.avail_out), b);
        }), new ue(4, 4, 8, 4, xe), new ue(4, 5, 16, 8, xe), new ue(4, 6, 32, 32, xe), new ue(4, 4, 16, 16, j), new ue(8, 16, 32, 32, j), new ue(8, 16, 128, 128, j), new ue(8, 32, 128, 256, j), new ue(32, 128, 258, 1024, j), new ue(32, 258, 258, 4096, j)], s.deflateInit = function(c, W) {
          return ke(c, W, v, 15, 8, 0);
        }, s.deflateInit2 = ke, s.deflateReset = ge, s.deflateResetKeep = pe, s.deflateSetHeader = function(c, W) {
          return c && c.state ? c.state.wrap !== 2 ? y : (c.state.gzhead = W, u) : y;
        }, s.deflate = function(c, W) {
          var q, C, I, P;
          if (!c || !c.state || 5 < W || W < 0) return c ? ae(c, y) : y;
          if (C = c.state, !c.output || !c.input && c.avail_in !== 0 || C.status === 666 && W !== m) return ae(c, c.avail_out === 0 ? -5 : y);
          if (C.strm = c, q = C.last_flush, C.last_flush = W, C.status === B) if (C.wrap === 2) c.adler = 0, oe(C, 31), oe(C, 139), oe(C, 8), C.gzhead ? (oe(C, (C.gzhead.text ? 1 : 0) + (C.gzhead.hcrc ? 2 : 0) + (C.gzhead.extra ? 4 : 0) + (C.gzhead.name ? 8 : 0) + (C.gzhead.comment ? 16 : 0)), oe(C, 255 & C.gzhead.time), oe(C, C.gzhead.time >> 8 & 255), oe(C, C.gzhead.time >> 16 & 255), oe(C, C.gzhead.time >> 24 & 255), oe(C, C.level === 9 ? 2 : 2 <= C.strategy || C.level < 2 ? 4 : 0), oe(C, 255 & C.gzhead.os), C.gzhead.extra && C.gzhead.extra.length && (oe(C, 255 & C.gzhead.extra.length), oe(C, C.gzhead.extra.length >> 8 & 255)), C.gzhead.hcrc && (c.adler = d(c.adler, C.pending_buf, C.pending, 0)), C.gzindex = 0, C.status = 69) : (oe(C, 0), oe(C, 0), oe(C, 0), oe(C, 0), oe(C, 0), oe(C, C.level === 9 ? 2 : 2 <= C.strategy || C.level < 2 ? 4 : 0), oe(C, 3), C.status = R);
          else {
            var ee = v + (C.w_bits - 8 << 4) << 8;
            ee |= (2 <= C.strategy || C.level < 2 ? 0 : C.level < 6 ? 1 : C.level === 6 ? 2 : 3) << 6, C.strstart !== 0 && (ee |= 32), ee += 31 - ee % 31, C.status = R, ce(C, ee), C.strstart !== 0 && (ce(C, c.adler >>> 16), ce(C, 65535 & c.adler)), c.adler = 1;
          }
          if (C.status === 69) if (C.gzhead.extra) {
            for (I = C.pending; C.gzindex < (65535 & C.gzhead.extra.length) && (C.pending !== C.pending_buf_size || (C.gzhead.hcrc && C.pending > I && (c.adler = d(c.adler, C.pending_buf, C.pending - I, I)), H(c), I = C.pending, C.pending !== C.pending_buf_size)); ) oe(C, 255 & C.gzhead.extra[C.gzindex]), C.gzindex++;
            C.gzhead.hcrc && C.pending > I && (c.adler = d(c.adler, C.pending_buf, C.pending - I, I)), C.gzindex === C.gzhead.extra.length && (C.gzindex = 0, C.status = 73);
          } else C.status = 73;
          if (C.status === 73) if (C.gzhead.name) {
            I = C.pending;
            do {
              if (C.pending === C.pending_buf_size && (C.gzhead.hcrc && C.pending > I && (c.adler = d(c.adler, C.pending_buf, C.pending - I, I)), H(c), I = C.pending, C.pending === C.pending_buf_size)) {
                P = 1;
                break;
              }
              P = C.gzindex < C.gzhead.name.length ? 255 & C.gzhead.name.charCodeAt(C.gzindex++) : 0, oe(C, P);
            } while (P !== 0);
            C.gzhead.hcrc && C.pending > I && (c.adler = d(c.adler, C.pending_buf, C.pending - I, I)), P === 0 && (C.gzindex = 0, C.status = 91);
          } else C.status = 91;
          if (C.status === 91) if (C.gzhead.comment) {
            I = C.pending;
            do {
              if (C.pending === C.pending_buf_size && (C.gzhead.hcrc && C.pending > I && (c.adler = d(c.adler, C.pending_buf, C.pending - I, I)), H(c), I = C.pending, C.pending === C.pending_buf_size)) {
                P = 1;
                break;
              }
              P = C.gzindex < C.gzhead.comment.length ? 255 & C.gzhead.comment.charCodeAt(C.gzindex++) : 0, oe(C, P);
            } while (P !== 0);
            C.gzhead.hcrc && C.pending > I && (c.adler = d(c.adler, C.pending_buf, C.pending - I, I)), P === 0 && (C.status = 103);
          } else C.status = 103;
          if (C.status === 103 && (C.gzhead.hcrc ? (C.pending + 2 > C.pending_buf_size && H(c), C.pending + 2 <= C.pending_buf_size && (oe(C, 255 & c.adler), oe(C, c.adler >> 8 & 255), c.adler = 0, C.status = R)) : C.status = R), C.pending !== 0) {
            if (H(c), c.avail_out === 0) return C.last_flush = -1, u;
          } else if (c.avail_in === 0 && Y(W) <= Y(q) && W !== m) return ae(c, -5);
          if (C.status === 666 && c.avail_in !== 0) return ae(c, -5);
          if (c.avail_in !== 0 || C.lookahead !== 0 || W !== g && C.status !== 666) {
            var te = C.strategy === 2 ? (function(F, V) {
              for (var se; ; ) {
                if (F.lookahead === 0 && (Ne(F), F.lookahead === 0)) {
                  if (V === g) return b;
                  break;
                }
                if (F.match_length = 0, se = o._tr_tally(F, 0, F.window[F.strstart]), F.lookahead--, F.strstart++, se && ($(F, !1), F.strm.avail_out === 0)) return b;
              }
              return F.insert = 0, V === m ? ($(F, !0), F.strm.avail_out === 0 ? ne : T) : F.last_lit && ($(F, !1), F.strm.avail_out === 0) ? b : G;
            })(C, W) : C.strategy === 3 ? (function(F, V) {
              for (var se, re, fe, Ee, we = F.window; ; ) {
                if (F.lookahead <= O) {
                  if (Ne(F), F.lookahead <= O && V === g) return b;
                  if (F.lookahead === 0) break;
                }
                if (F.match_length = 0, F.lookahead >= Q && 0 < F.strstart && (re = we[fe = F.strstart - 1]) === we[++fe] && re === we[++fe] && re === we[++fe]) {
                  Ee = F.strstart + O;
                  do
                    ;
                  while (re === we[++fe] && re === we[++fe] && re === we[++fe] && re === we[++fe] && re === we[++fe] && re === we[++fe] && re === we[++fe] && re === we[++fe] && fe < Ee);
                  F.match_length = O - (Ee - fe), F.match_length > F.lookahead && (F.match_length = F.lookahead);
                }
                if (F.match_length >= Q ? (se = o._tr_tally(F, 1, F.match_length - Q), F.lookahead -= F.match_length, F.strstart += F.match_length, F.match_length = 0) : (se = o._tr_tally(F, 0, F.window[F.strstart]), F.lookahead--, F.strstart++), se && ($(F, !1), F.strm.avail_out === 0)) return b;
              }
              return F.insert = 0, V === m ? ($(F, !0), F.strm.avail_out === 0 ? ne : T) : F.last_lit && ($(F, !1), F.strm.avail_out === 0) ? b : G;
            })(C, W) : i[C.level].func(C, W);
            if (te !== ne && te !== T || (C.status = 666), te === b || te === ne) return c.avail_out === 0 && (C.last_flush = -1), u;
            if (te === G && (W === 1 ? o._tr_align(C) : W !== 5 && (o._tr_stored_block(C, 0, 0, !1), W === 3 && (de(C.head), C.lookahead === 0 && (C.strstart = 0, C.block_start = 0, C.insert = 0))), H(c), c.avail_out === 0)) return C.last_flush = -1, u;
          }
          return W !== m ? u : C.wrap <= 0 ? 1 : (C.wrap === 2 ? (oe(C, 255 & c.adler), oe(C, c.adler >> 8 & 255), oe(C, c.adler >> 16 & 255), oe(C, c.adler >> 24 & 255), oe(C, 255 & c.total_in), oe(C, c.total_in >> 8 & 255), oe(C, c.total_in >> 16 & 255), oe(C, c.total_in >> 24 & 255)) : (ce(C, c.adler >>> 16), ce(C, 65535 & c.adler)), H(c), 0 < C.wrap && (C.wrap = -C.wrap), C.pending !== 0 ? u : 1);
        }, s.deflateEnd = function(c) {
          var W;
          return c && c.state ? (W = c.state.status) !== B && W !== 69 && W !== 73 && W !== 91 && W !== 103 && W !== R && W !== 666 ? ae(c, y) : (c.state = null, W === R ? ae(c, -3) : u) : y;
        }, s.deflateSetDictionary = function(c, W) {
          var q, C, I, P, ee, te, F, V, se = W.length;
          if (!c || !c.state || (P = (q = c.state).wrap) === 2 || P === 1 && q.status !== B || q.lookahead) return y;
          for (P === 1 && (c.adler = l(c.adler, W, se, 0)), q.wrap = 0, se >= q.w_size && (P === 0 && (de(q.head), q.strstart = 0, q.block_start = 0, q.insert = 0), V = new a.Buf8(q.w_size), a.arraySet(V, W, se - q.w_size, q.w_size, 0), W = V, se = q.w_size), ee = c.avail_in, te = c.next_in, F = c.input, c.avail_in = se, c.next_in = 0, c.input = W, Ne(q); q.lookahead >= Q; ) {
            for (C = q.strstart, I = q.lookahead - (Q - 1); q.ins_h = (q.ins_h << q.hash_shift ^ q.window[C + Q - 1]) & q.hash_mask, q.prev[C & q.w_mask] = q.head[q.ins_h], q.head[q.ins_h] = C, C++, --I; ) ;
            q.strstart = C, q.lookahead = Q - 1, Ne(q);
          }
          return q.strstart += q.lookahead, q.block_start = q.strstart, q.insert = q.lookahead, q.lookahead = 0, q.match_length = q.prev_length = Q - 1, q.match_available = 0, c.next_in = te, c.input = F, c.avail_in = ee, q.wrap = P, u;
        }, s.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(t, n, s) {
        n.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(t, n, s) {
        n.exports = function(i, a) {
          var o, l, d, f, g, m, u, y, w, A, k, v, N, E, S, z, x, U, Q, O, K, B, R, b, G;
          o = i.state, l = i.next_in, b = i.input, d = l + (i.avail_in - 5), f = i.next_out, G = i.output, g = f - (a - i.avail_out), m = f + (i.avail_out - 257), u = o.dmax, y = o.wsize, w = o.whave, A = o.wnext, k = o.window, v = o.hold, N = o.bits, E = o.lencode, S = o.distcode, z = (1 << o.lenbits) - 1, x = (1 << o.distbits) - 1;
          e: do {
            N < 15 && (v += b[l++] << N, N += 8, v += b[l++] << N, N += 8), U = E[v & z];
            t: for (; ; ) {
              if (v >>>= Q = U >>> 24, N -= Q, (Q = U >>> 16 & 255) === 0) G[f++] = 65535 & U;
              else {
                if (!(16 & Q)) {
                  if ((64 & Q) == 0) {
                    U = E[(65535 & U) + (v & (1 << Q) - 1)];
                    continue t;
                  }
                  if (32 & Q) {
                    o.mode = 12;
                    break e;
                  }
                  i.msg = "invalid literal/length code", o.mode = 30;
                  break e;
                }
                O = 65535 & U, (Q &= 15) && (N < Q && (v += b[l++] << N, N += 8), O += v & (1 << Q) - 1, v >>>= Q, N -= Q), N < 15 && (v += b[l++] << N, N += 8, v += b[l++] << N, N += 8), U = S[v & x];
                r: for (; ; ) {
                  if (v >>>= Q = U >>> 24, N -= Q, !(16 & (Q = U >>> 16 & 255))) {
                    if ((64 & Q) == 0) {
                      U = S[(65535 & U) + (v & (1 << Q) - 1)];
                      continue r;
                    }
                    i.msg = "invalid distance code", o.mode = 30;
                    break e;
                  }
                  if (K = 65535 & U, N < (Q &= 15) && (v += b[l++] << N, (N += 8) < Q && (v += b[l++] << N, N += 8)), u < (K += v & (1 << Q) - 1)) {
                    i.msg = "invalid distance too far back", o.mode = 30;
                    break e;
                  }
                  if (v >>>= Q, N -= Q, (Q = f - g) < K) {
                    if (w < (Q = K - Q) && o.sane) {
                      i.msg = "invalid distance too far back", o.mode = 30;
                      break e;
                    }
                    if (R = k, (B = 0) === A) {
                      if (B += y - Q, Q < O) {
                        for (O -= Q; G[f++] = k[B++], --Q; ) ;
                        B = f - K, R = G;
                      }
                    } else if (A < Q) {
                      if (B += y + A - Q, (Q -= A) < O) {
                        for (O -= Q; G[f++] = k[B++], --Q; ) ;
                        if (B = 0, A < O) {
                          for (O -= Q = A; G[f++] = k[B++], --Q; ) ;
                          B = f - K, R = G;
                        }
                      }
                    } else if (B += A - Q, Q < O) {
                      for (O -= Q; G[f++] = k[B++], --Q; ) ;
                      B = f - K, R = G;
                    }
                    for (; 2 < O; ) G[f++] = R[B++], G[f++] = R[B++], G[f++] = R[B++], O -= 3;
                    O && (G[f++] = R[B++], 1 < O && (G[f++] = R[B++]));
                  } else {
                    for (B = f - K; G[f++] = G[B++], G[f++] = G[B++], G[f++] = G[B++], 2 < (O -= 3); ) ;
                    O && (G[f++] = G[B++], 1 < O && (G[f++] = G[B++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (l < d && f < m);
          l -= O = N >> 3, v &= (1 << (N -= O << 3)) - 1, i.next_in = l, i.next_out = f, i.avail_in = l < d ? d - l + 5 : 5 - (l - d), i.avail_out = f < m ? m - f + 257 : 257 - (f - m), o.hold = v, o.bits = N;
        };
      }, {}], 49: [function(t, n, s) {
        var i = t("../utils/common"), a = t("./adler32"), o = t("./crc32"), l = t("./inffast"), d = t("./inftrees"), f = 1, g = 2, m = 0, u = -2, y = 1, w = 852, A = 592;
        function k(B) {
          return (B >>> 24 & 255) + (B >>> 8 & 65280) + ((65280 & B) << 8) + ((255 & B) << 24);
        }
        function v() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new i.Buf16(320), this.work = new i.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function N(B) {
          var R;
          return B && B.state ? (R = B.state, B.total_in = B.total_out = R.total = 0, B.msg = "", R.wrap && (B.adler = 1 & R.wrap), R.mode = y, R.last = 0, R.havedict = 0, R.dmax = 32768, R.head = null, R.hold = 0, R.bits = 0, R.lencode = R.lendyn = new i.Buf32(w), R.distcode = R.distdyn = new i.Buf32(A), R.sane = 1, R.back = -1, m) : u;
        }
        function E(B) {
          var R;
          return B && B.state ? ((R = B.state).wsize = 0, R.whave = 0, R.wnext = 0, N(B)) : u;
        }
        function S(B, R) {
          var b, G;
          return B && B.state ? (G = B.state, R < 0 ? (b = 0, R = -R) : (b = 1 + (R >> 4), R < 48 && (R &= 15)), R && (R < 8 || 15 < R) ? u : (G.window !== null && G.wbits !== R && (G.window = null), G.wrap = b, G.wbits = R, E(B))) : u;
        }
        function z(B, R) {
          var b, G;
          return B ? (G = new v(), (B.state = G).window = null, (b = S(B, R)) !== m && (B.state = null), b) : u;
        }
        var x, U, Q = !0;
        function O(B) {
          if (Q) {
            var R;
            for (x = new i.Buf32(512), U = new i.Buf32(32), R = 0; R < 144; ) B.lens[R++] = 8;
            for (; R < 256; ) B.lens[R++] = 9;
            for (; R < 280; ) B.lens[R++] = 7;
            for (; R < 288; ) B.lens[R++] = 8;
            for (d(f, B.lens, 0, 288, x, 0, B.work, { bits: 9 }), R = 0; R < 32; ) B.lens[R++] = 5;
            d(g, B.lens, 0, 32, U, 0, B.work, { bits: 5 }), Q = !1;
          }
          B.lencode = x, B.lenbits = 9, B.distcode = U, B.distbits = 5;
        }
        function K(B, R, b, G) {
          var ne, T = B.state;
          return T.window === null && (T.wsize = 1 << T.wbits, T.wnext = 0, T.whave = 0, T.window = new i.Buf8(T.wsize)), G >= T.wsize ? (i.arraySet(T.window, R, b - T.wsize, T.wsize, 0), T.wnext = 0, T.whave = T.wsize) : (G < (ne = T.wsize - T.wnext) && (ne = G), i.arraySet(T.window, R, b - G, ne, T.wnext), (G -= ne) ? (i.arraySet(T.window, R, b - G, G, 0), T.wnext = G, T.whave = T.wsize) : (T.wnext += ne, T.wnext === T.wsize && (T.wnext = 0), T.whave < T.wsize && (T.whave += ne))), 0;
        }
        s.inflateReset = E, s.inflateReset2 = S, s.inflateResetKeep = N, s.inflateInit = function(B) {
          return z(B, 15);
        }, s.inflateInit2 = z, s.inflate = function(B, R) {
          var b, G, ne, T, ae, Y, de, H, $, oe, ce, ie, Ne, xe, j, ue, ye, pe, ge, ke, c, W, q, C, I = 0, P = new i.Buf8(4), ee = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!B || !B.state || !B.output || !B.input && B.avail_in !== 0) return u;
          (b = B.state).mode === 12 && (b.mode = 13), ae = B.next_out, ne = B.output, de = B.avail_out, T = B.next_in, G = B.input, Y = B.avail_in, H = b.hold, $ = b.bits, oe = Y, ce = de, W = m;
          e: for (; ; ) switch (b.mode) {
            case y:
              if (b.wrap === 0) {
                b.mode = 13;
                break;
              }
              for (; $ < 16; ) {
                if (Y === 0) break e;
                Y--, H += G[T++] << $, $ += 8;
              }
              if (2 & b.wrap && H === 35615) {
                P[b.check = 0] = 255 & H, P[1] = H >>> 8 & 255, b.check = o(b.check, P, 2, 0), $ = H = 0, b.mode = 2;
                break;
              }
              if (b.flags = 0, b.head && (b.head.done = !1), !(1 & b.wrap) || (((255 & H) << 8) + (H >> 8)) % 31) {
                B.msg = "incorrect header check", b.mode = 30;
                break;
              }
              if ((15 & H) != 8) {
                B.msg = "unknown compression method", b.mode = 30;
                break;
              }
              if ($ -= 4, c = 8 + (15 & (H >>>= 4)), b.wbits === 0) b.wbits = c;
              else if (c > b.wbits) {
                B.msg = "invalid window size", b.mode = 30;
                break;
              }
              b.dmax = 1 << c, B.adler = b.check = 1, b.mode = 512 & H ? 10 : 12, $ = H = 0;
              break;
            case 2:
              for (; $ < 16; ) {
                if (Y === 0) break e;
                Y--, H += G[T++] << $, $ += 8;
              }
              if (b.flags = H, (255 & b.flags) != 8) {
                B.msg = "unknown compression method", b.mode = 30;
                break;
              }
              if (57344 & b.flags) {
                B.msg = "unknown header flags set", b.mode = 30;
                break;
              }
              b.head && (b.head.text = H >> 8 & 1), 512 & b.flags && (P[0] = 255 & H, P[1] = H >>> 8 & 255, b.check = o(b.check, P, 2, 0)), $ = H = 0, b.mode = 3;
            case 3:
              for (; $ < 32; ) {
                if (Y === 0) break e;
                Y--, H += G[T++] << $, $ += 8;
              }
              b.head && (b.head.time = H), 512 & b.flags && (P[0] = 255 & H, P[1] = H >>> 8 & 255, P[2] = H >>> 16 & 255, P[3] = H >>> 24 & 255, b.check = o(b.check, P, 4, 0)), $ = H = 0, b.mode = 4;
            case 4:
              for (; $ < 16; ) {
                if (Y === 0) break e;
                Y--, H += G[T++] << $, $ += 8;
              }
              b.head && (b.head.xflags = 255 & H, b.head.os = H >> 8), 512 & b.flags && (P[0] = 255 & H, P[1] = H >>> 8 & 255, b.check = o(b.check, P, 2, 0)), $ = H = 0, b.mode = 5;
            case 5:
              if (1024 & b.flags) {
                for (; $ < 16; ) {
                  if (Y === 0) break e;
                  Y--, H += G[T++] << $, $ += 8;
                }
                b.length = H, b.head && (b.head.extra_len = H), 512 & b.flags && (P[0] = 255 & H, P[1] = H >>> 8 & 255, b.check = o(b.check, P, 2, 0)), $ = H = 0;
              } else b.head && (b.head.extra = null);
              b.mode = 6;
            case 6:
              if (1024 & b.flags && (Y < (ie = b.length) && (ie = Y), ie && (b.head && (c = b.head.extra_len - b.length, b.head.extra || (b.head.extra = new Array(b.head.extra_len)), i.arraySet(b.head.extra, G, T, ie, c)), 512 & b.flags && (b.check = o(b.check, G, ie, T)), Y -= ie, T += ie, b.length -= ie), b.length)) break e;
              b.length = 0, b.mode = 7;
            case 7:
              if (2048 & b.flags) {
                if (Y === 0) break e;
                for (ie = 0; c = G[T + ie++], b.head && c && b.length < 65536 && (b.head.name += String.fromCharCode(c)), c && ie < Y; ) ;
                if (512 & b.flags && (b.check = o(b.check, G, ie, T)), Y -= ie, T += ie, c) break e;
              } else b.head && (b.head.name = null);
              b.length = 0, b.mode = 8;
            case 8:
              if (4096 & b.flags) {
                if (Y === 0) break e;
                for (ie = 0; c = G[T + ie++], b.head && c && b.length < 65536 && (b.head.comment += String.fromCharCode(c)), c && ie < Y; ) ;
                if (512 & b.flags && (b.check = o(b.check, G, ie, T)), Y -= ie, T += ie, c) break e;
              } else b.head && (b.head.comment = null);
              b.mode = 9;
            case 9:
              if (512 & b.flags) {
                for (; $ < 16; ) {
                  if (Y === 0) break e;
                  Y--, H += G[T++] << $, $ += 8;
                }
                if (H !== (65535 & b.check)) {
                  B.msg = "header crc mismatch", b.mode = 30;
                  break;
                }
                $ = H = 0;
              }
              b.head && (b.head.hcrc = b.flags >> 9 & 1, b.head.done = !0), B.adler = b.check = 0, b.mode = 12;
              break;
            case 10:
              for (; $ < 32; ) {
                if (Y === 0) break e;
                Y--, H += G[T++] << $, $ += 8;
              }
              B.adler = b.check = k(H), $ = H = 0, b.mode = 11;
            case 11:
              if (b.havedict === 0) return B.next_out = ae, B.avail_out = de, B.next_in = T, B.avail_in = Y, b.hold = H, b.bits = $, 2;
              B.adler = b.check = 1, b.mode = 12;
            case 12:
              if (R === 5 || R === 6) break e;
            case 13:
              if (b.last) {
                H >>>= 7 & $, $ -= 7 & $, b.mode = 27;
                break;
              }
              for (; $ < 3; ) {
                if (Y === 0) break e;
                Y--, H += G[T++] << $, $ += 8;
              }
              switch (b.last = 1 & H, $ -= 1, 3 & (H >>>= 1)) {
                case 0:
                  b.mode = 14;
                  break;
                case 1:
                  if (O(b), b.mode = 20, R !== 6) break;
                  H >>>= 2, $ -= 2;
                  break e;
                case 2:
                  b.mode = 17;
                  break;
                case 3:
                  B.msg = "invalid block type", b.mode = 30;
              }
              H >>>= 2, $ -= 2;
              break;
            case 14:
              for (H >>>= 7 & $, $ -= 7 & $; $ < 32; ) {
                if (Y === 0) break e;
                Y--, H += G[T++] << $, $ += 8;
              }
              if ((65535 & H) != (H >>> 16 ^ 65535)) {
                B.msg = "invalid stored block lengths", b.mode = 30;
                break;
              }
              if (b.length = 65535 & H, $ = H = 0, b.mode = 15, R === 6) break e;
            case 15:
              b.mode = 16;
            case 16:
              if (ie = b.length) {
                if (Y < ie && (ie = Y), de < ie && (ie = de), ie === 0) break e;
                i.arraySet(ne, G, T, ie, ae), Y -= ie, T += ie, de -= ie, ae += ie, b.length -= ie;
                break;
              }
              b.mode = 12;
              break;
            case 17:
              for (; $ < 14; ) {
                if (Y === 0) break e;
                Y--, H += G[T++] << $, $ += 8;
              }
              if (b.nlen = 257 + (31 & H), H >>>= 5, $ -= 5, b.ndist = 1 + (31 & H), H >>>= 5, $ -= 5, b.ncode = 4 + (15 & H), H >>>= 4, $ -= 4, 286 < b.nlen || 30 < b.ndist) {
                B.msg = "too many length or distance symbols", b.mode = 30;
                break;
              }
              b.have = 0, b.mode = 18;
            case 18:
              for (; b.have < b.ncode; ) {
                for (; $ < 3; ) {
                  if (Y === 0) break e;
                  Y--, H += G[T++] << $, $ += 8;
                }
                b.lens[ee[b.have++]] = 7 & H, H >>>= 3, $ -= 3;
              }
              for (; b.have < 19; ) b.lens[ee[b.have++]] = 0;
              if (b.lencode = b.lendyn, b.lenbits = 7, q = { bits: b.lenbits }, W = d(0, b.lens, 0, 19, b.lencode, 0, b.work, q), b.lenbits = q.bits, W) {
                B.msg = "invalid code lengths set", b.mode = 30;
                break;
              }
              b.have = 0, b.mode = 19;
            case 19:
              for (; b.have < b.nlen + b.ndist; ) {
                for (; ue = (I = b.lencode[H & (1 << b.lenbits) - 1]) >>> 16 & 255, ye = 65535 & I, !((j = I >>> 24) <= $); ) {
                  if (Y === 0) break e;
                  Y--, H += G[T++] << $, $ += 8;
                }
                if (ye < 16) H >>>= j, $ -= j, b.lens[b.have++] = ye;
                else {
                  if (ye === 16) {
                    for (C = j + 2; $ < C; ) {
                      if (Y === 0) break e;
                      Y--, H += G[T++] << $, $ += 8;
                    }
                    if (H >>>= j, $ -= j, b.have === 0) {
                      B.msg = "invalid bit length repeat", b.mode = 30;
                      break;
                    }
                    c = b.lens[b.have - 1], ie = 3 + (3 & H), H >>>= 2, $ -= 2;
                  } else if (ye === 17) {
                    for (C = j + 3; $ < C; ) {
                      if (Y === 0) break e;
                      Y--, H += G[T++] << $, $ += 8;
                    }
                    $ -= j, c = 0, ie = 3 + (7 & (H >>>= j)), H >>>= 3, $ -= 3;
                  } else {
                    for (C = j + 7; $ < C; ) {
                      if (Y === 0) break e;
                      Y--, H += G[T++] << $, $ += 8;
                    }
                    $ -= j, c = 0, ie = 11 + (127 & (H >>>= j)), H >>>= 7, $ -= 7;
                  }
                  if (b.have + ie > b.nlen + b.ndist) {
                    B.msg = "invalid bit length repeat", b.mode = 30;
                    break;
                  }
                  for (; ie--; ) b.lens[b.have++] = c;
                }
              }
              if (b.mode === 30) break;
              if (b.lens[256] === 0) {
                B.msg = "invalid code -- missing end-of-block", b.mode = 30;
                break;
              }
              if (b.lenbits = 9, q = { bits: b.lenbits }, W = d(f, b.lens, 0, b.nlen, b.lencode, 0, b.work, q), b.lenbits = q.bits, W) {
                B.msg = "invalid literal/lengths set", b.mode = 30;
                break;
              }
              if (b.distbits = 6, b.distcode = b.distdyn, q = { bits: b.distbits }, W = d(g, b.lens, b.nlen, b.ndist, b.distcode, 0, b.work, q), b.distbits = q.bits, W) {
                B.msg = "invalid distances set", b.mode = 30;
                break;
              }
              if (b.mode = 20, R === 6) break e;
            case 20:
              b.mode = 21;
            case 21:
              if (6 <= Y && 258 <= de) {
                B.next_out = ae, B.avail_out = de, B.next_in = T, B.avail_in = Y, b.hold = H, b.bits = $, l(B, ce), ae = B.next_out, ne = B.output, de = B.avail_out, T = B.next_in, G = B.input, Y = B.avail_in, H = b.hold, $ = b.bits, b.mode === 12 && (b.back = -1);
                break;
              }
              for (b.back = 0; ue = (I = b.lencode[H & (1 << b.lenbits) - 1]) >>> 16 & 255, ye = 65535 & I, !((j = I >>> 24) <= $); ) {
                if (Y === 0) break e;
                Y--, H += G[T++] << $, $ += 8;
              }
              if (ue && (240 & ue) == 0) {
                for (pe = j, ge = ue, ke = ye; ue = (I = b.lencode[ke + ((H & (1 << pe + ge) - 1) >> pe)]) >>> 16 & 255, ye = 65535 & I, !(pe + (j = I >>> 24) <= $); ) {
                  if (Y === 0) break e;
                  Y--, H += G[T++] << $, $ += 8;
                }
                H >>>= pe, $ -= pe, b.back += pe;
              }
              if (H >>>= j, $ -= j, b.back += j, b.length = ye, ue === 0) {
                b.mode = 26;
                break;
              }
              if (32 & ue) {
                b.back = -1, b.mode = 12;
                break;
              }
              if (64 & ue) {
                B.msg = "invalid literal/length code", b.mode = 30;
                break;
              }
              b.extra = 15 & ue, b.mode = 22;
            case 22:
              if (b.extra) {
                for (C = b.extra; $ < C; ) {
                  if (Y === 0) break e;
                  Y--, H += G[T++] << $, $ += 8;
                }
                b.length += H & (1 << b.extra) - 1, H >>>= b.extra, $ -= b.extra, b.back += b.extra;
              }
              b.was = b.length, b.mode = 23;
            case 23:
              for (; ue = (I = b.distcode[H & (1 << b.distbits) - 1]) >>> 16 & 255, ye = 65535 & I, !((j = I >>> 24) <= $); ) {
                if (Y === 0) break e;
                Y--, H += G[T++] << $, $ += 8;
              }
              if ((240 & ue) == 0) {
                for (pe = j, ge = ue, ke = ye; ue = (I = b.distcode[ke + ((H & (1 << pe + ge) - 1) >> pe)]) >>> 16 & 255, ye = 65535 & I, !(pe + (j = I >>> 24) <= $); ) {
                  if (Y === 0) break e;
                  Y--, H += G[T++] << $, $ += 8;
                }
                H >>>= pe, $ -= pe, b.back += pe;
              }
              if (H >>>= j, $ -= j, b.back += j, 64 & ue) {
                B.msg = "invalid distance code", b.mode = 30;
                break;
              }
              b.offset = ye, b.extra = 15 & ue, b.mode = 24;
            case 24:
              if (b.extra) {
                for (C = b.extra; $ < C; ) {
                  if (Y === 0) break e;
                  Y--, H += G[T++] << $, $ += 8;
                }
                b.offset += H & (1 << b.extra) - 1, H >>>= b.extra, $ -= b.extra, b.back += b.extra;
              }
              if (b.offset > b.dmax) {
                B.msg = "invalid distance too far back", b.mode = 30;
                break;
              }
              b.mode = 25;
            case 25:
              if (de === 0) break e;
              if (ie = ce - de, b.offset > ie) {
                if ((ie = b.offset - ie) > b.whave && b.sane) {
                  B.msg = "invalid distance too far back", b.mode = 30;
                  break;
                }
                Ne = ie > b.wnext ? (ie -= b.wnext, b.wsize - ie) : b.wnext - ie, ie > b.length && (ie = b.length), xe = b.window;
              } else xe = ne, Ne = ae - b.offset, ie = b.length;
              for (de < ie && (ie = de), de -= ie, b.length -= ie; ne[ae++] = xe[Ne++], --ie; ) ;
              b.length === 0 && (b.mode = 21);
              break;
            case 26:
              if (de === 0) break e;
              ne[ae++] = b.length, de--, b.mode = 21;
              break;
            case 27:
              if (b.wrap) {
                for (; $ < 32; ) {
                  if (Y === 0) break e;
                  Y--, H |= G[T++] << $, $ += 8;
                }
                if (ce -= de, B.total_out += ce, b.total += ce, ce && (B.adler = b.check = b.flags ? o(b.check, ne, ce, ae - ce) : a(b.check, ne, ce, ae - ce)), ce = de, (b.flags ? H : k(H)) !== b.check) {
                  B.msg = "incorrect data check", b.mode = 30;
                  break;
                }
                $ = H = 0;
              }
              b.mode = 28;
            case 28:
              if (b.wrap && b.flags) {
                for (; $ < 32; ) {
                  if (Y === 0) break e;
                  Y--, H += G[T++] << $, $ += 8;
                }
                if (H !== (4294967295 & b.total)) {
                  B.msg = "incorrect length check", b.mode = 30;
                  break;
                }
                $ = H = 0;
              }
              b.mode = 29;
            case 29:
              W = 1;
              break e;
            case 30:
              W = -3;
              break e;
            case 31:
              return -4;
            default:
              return u;
          }
          return B.next_out = ae, B.avail_out = de, B.next_in = T, B.avail_in = Y, b.hold = H, b.bits = $, (b.wsize || ce !== B.avail_out && b.mode < 30 && (b.mode < 27 || R !== 4)) && K(B, B.output, B.next_out, ce - B.avail_out) ? (b.mode = 31, -4) : (oe -= B.avail_in, ce -= B.avail_out, B.total_in += oe, B.total_out += ce, b.total += ce, b.wrap && ce && (B.adler = b.check = b.flags ? o(b.check, ne, ce, B.next_out - ce) : a(b.check, ne, ce, B.next_out - ce)), B.data_type = b.bits + (b.last ? 64 : 0) + (b.mode === 12 ? 128 : 0) + (b.mode === 20 || b.mode === 15 ? 256 : 0), (oe == 0 && ce === 0 || R === 4) && W === m && (W = -5), W);
        }, s.inflateEnd = function(B) {
          if (!B || !B.state) return u;
          var R = B.state;
          return R.window && (R.window = null), B.state = null, m;
        }, s.inflateGetHeader = function(B, R) {
          var b;
          return B && B.state ? (2 & (b = B.state).wrap) == 0 ? u : ((b.head = R).done = !1, m) : u;
        }, s.inflateSetDictionary = function(B, R) {
          var b, G = R.length;
          return B && B.state ? (b = B.state).wrap !== 0 && b.mode !== 11 ? u : b.mode === 11 && a(1, R, G, 0) !== b.check ? -3 : K(B, R, G, G) ? (b.mode = 31, -4) : (b.havedict = 1, m) : u;
        }, s.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(t, n, s) {
        var i = t("../utils/common"), a = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], o = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], l = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], d = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        n.exports = function(f, g, m, u, y, w, A, k) {
          var v, N, E, S, z, x, U, Q, O, K = k.bits, B = 0, R = 0, b = 0, G = 0, ne = 0, T = 0, ae = 0, Y = 0, de = 0, H = 0, $ = null, oe = 0, ce = new i.Buf16(16), ie = new i.Buf16(16), Ne = null, xe = 0;
          for (B = 0; B <= 15; B++) ce[B] = 0;
          for (R = 0; R < u; R++) ce[g[m + R]]++;
          for (ne = K, G = 15; 1 <= G && ce[G] === 0; G--) ;
          if (G < ne && (ne = G), G === 0) return y[w++] = 20971520, y[w++] = 20971520, k.bits = 1, 0;
          for (b = 1; b < G && ce[b] === 0; b++) ;
          for (ne < b && (ne = b), B = Y = 1; B <= 15; B++) if (Y <<= 1, (Y -= ce[B]) < 0) return -1;
          if (0 < Y && (f === 0 || G !== 1)) return -1;
          for (ie[1] = 0, B = 1; B < 15; B++) ie[B + 1] = ie[B] + ce[B];
          for (R = 0; R < u; R++) g[m + R] !== 0 && (A[ie[g[m + R]]++] = R);
          if (x = f === 0 ? ($ = Ne = A, 19) : f === 1 ? ($ = a, oe -= 257, Ne = o, xe -= 257, 256) : ($ = l, Ne = d, -1), B = b, z = w, ae = R = H = 0, E = -1, S = (de = 1 << (T = ne)) - 1, f === 1 && 852 < de || f === 2 && 592 < de) return 1;
          for (; ; ) {
            for (U = B - ae, O = A[R] < x ? (Q = 0, A[R]) : A[R] > x ? (Q = Ne[xe + A[R]], $[oe + A[R]]) : (Q = 96, 0), v = 1 << B - ae, b = N = 1 << T; y[z + (H >> ae) + (N -= v)] = U << 24 | Q << 16 | O | 0, N !== 0; ) ;
            for (v = 1 << B - 1; H & v; ) v >>= 1;
            if (v !== 0 ? (H &= v - 1, H += v) : H = 0, R++, --ce[B] == 0) {
              if (B === G) break;
              B = g[m + A[R]];
            }
            if (ne < B && (H & S) !== E) {
              for (ae === 0 && (ae = ne), z += b, Y = 1 << (T = B - ae); T + ae < G && !((Y -= ce[T + ae]) <= 0); ) T++, Y <<= 1;
              if (de += 1 << T, f === 1 && 852 < de || f === 2 && 592 < de) return 1;
              y[E = H & S] = ne << 24 | T << 16 | z - w | 0;
            }
          }
          return H !== 0 && (y[z + H] = B - ae << 24 | 64 << 16 | 0), k.bits = ne, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(t, n, s) {
        n.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(t, n, s) {
        var i = t("../utils/common"), a = 0, o = 1;
        function l(I) {
          for (var P = I.length; 0 <= --P; ) I[P] = 0;
        }
        var d = 0, f = 29, g = 256, m = g + 1 + f, u = 30, y = 19, w = 2 * m + 1, A = 15, k = 16, v = 7, N = 256, E = 16, S = 17, z = 18, x = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], U = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], Q = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], O = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], K = new Array(2 * (m + 2));
        l(K);
        var B = new Array(2 * u);
        l(B);
        var R = new Array(512);
        l(R);
        var b = new Array(256);
        l(b);
        var G = new Array(f);
        l(G);
        var ne, T, ae, Y = new Array(u);
        function de(I, P, ee, te, F) {
          this.static_tree = I, this.extra_bits = P, this.extra_base = ee, this.elems = te, this.max_length = F, this.has_stree = I && I.length;
        }
        function H(I, P) {
          this.dyn_tree = I, this.max_code = 0, this.stat_desc = P;
        }
        function $(I) {
          return I < 256 ? R[I] : R[256 + (I >>> 7)];
        }
        function oe(I, P) {
          I.pending_buf[I.pending++] = 255 & P, I.pending_buf[I.pending++] = P >>> 8 & 255;
        }
        function ce(I, P, ee) {
          I.bi_valid > k - ee ? (I.bi_buf |= P << I.bi_valid & 65535, oe(I, I.bi_buf), I.bi_buf = P >> k - I.bi_valid, I.bi_valid += ee - k) : (I.bi_buf |= P << I.bi_valid & 65535, I.bi_valid += ee);
        }
        function ie(I, P, ee) {
          ce(I, ee[2 * P], ee[2 * P + 1]);
        }
        function Ne(I, P) {
          for (var ee = 0; ee |= 1 & I, I >>>= 1, ee <<= 1, 0 < --P; ) ;
          return ee >>> 1;
        }
        function xe(I, P, ee) {
          var te, F, V = new Array(A + 1), se = 0;
          for (te = 1; te <= A; te++) V[te] = se = se + ee[te - 1] << 1;
          for (F = 0; F <= P; F++) {
            var re = I[2 * F + 1];
            re !== 0 && (I[2 * F] = Ne(V[re]++, re));
          }
        }
        function j(I) {
          var P;
          for (P = 0; P < m; P++) I.dyn_ltree[2 * P] = 0;
          for (P = 0; P < u; P++) I.dyn_dtree[2 * P] = 0;
          for (P = 0; P < y; P++) I.bl_tree[2 * P] = 0;
          I.dyn_ltree[2 * N] = 1, I.opt_len = I.static_len = 0, I.last_lit = I.matches = 0;
        }
        function ue(I) {
          8 < I.bi_valid ? oe(I, I.bi_buf) : 0 < I.bi_valid && (I.pending_buf[I.pending++] = I.bi_buf), I.bi_buf = 0, I.bi_valid = 0;
        }
        function ye(I, P, ee, te) {
          var F = 2 * P, V = 2 * ee;
          return I[F] < I[V] || I[F] === I[V] && te[P] <= te[ee];
        }
        function pe(I, P, ee) {
          for (var te = I.heap[ee], F = ee << 1; F <= I.heap_len && (F < I.heap_len && ye(P, I.heap[F + 1], I.heap[F], I.depth) && F++, !ye(P, te, I.heap[F], I.depth)); ) I.heap[ee] = I.heap[F], ee = F, F <<= 1;
          I.heap[ee] = te;
        }
        function ge(I, P, ee) {
          var te, F, V, se, re = 0;
          if (I.last_lit !== 0) for (; te = I.pending_buf[I.d_buf + 2 * re] << 8 | I.pending_buf[I.d_buf + 2 * re + 1], F = I.pending_buf[I.l_buf + re], re++, te === 0 ? ie(I, F, P) : (ie(I, (V = b[F]) + g + 1, P), (se = x[V]) !== 0 && ce(I, F -= G[V], se), ie(I, V = $(--te), ee), (se = U[V]) !== 0 && ce(I, te -= Y[V], se)), re < I.last_lit; ) ;
          ie(I, N, P);
        }
        function ke(I, P) {
          var ee, te, F, V = P.dyn_tree, se = P.stat_desc.static_tree, re = P.stat_desc.has_stree, fe = P.stat_desc.elems, Ee = -1;
          for (I.heap_len = 0, I.heap_max = w, ee = 0; ee < fe; ee++) V[2 * ee] !== 0 ? (I.heap[++I.heap_len] = Ee = ee, I.depth[ee] = 0) : V[2 * ee + 1] = 0;
          for (; I.heap_len < 2; ) V[2 * (F = I.heap[++I.heap_len] = Ee < 2 ? ++Ee : 0)] = 1, I.depth[F] = 0, I.opt_len--, re && (I.static_len -= se[2 * F + 1]);
          for (P.max_code = Ee, ee = I.heap_len >> 1; 1 <= ee; ee--) pe(I, V, ee);
          for (F = fe; ee = I.heap[1], I.heap[1] = I.heap[I.heap_len--], pe(I, V, 1), te = I.heap[1], I.heap[--I.heap_max] = ee, I.heap[--I.heap_max] = te, V[2 * F] = V[2 * ee] + V[2 * te], I.depth[F] = (I.depth[ee] >= I.depth[te] ? I.depth[ee] : I.depth[te]) + 1, V[2 * ee + 1] = V[2 * te + 1] = F, I.heap[1] = F++, pe(I, V, 1), 2 <= I.heap_len; ) ;
          I.heap[--I.heap_max] = I.heap[1], (function(we, Ue) {
            var gt, Ze, bt, Me, st, Pt, rt = Ue.dyn_tree, Z = Ue.max_code, me = Ue.stat_desc.static_tree, Fe = Ue.stat_desc.has_stree, Te = Ue.stat_desc.extra_bits, Ke = Ue.stat_desc.extra_base, We = Ue.stat_desc.max_length, Ye = 0;
            for (Me = 0; Me <= A; Me++) we.bl_count[Me] = 0;
            for (rt[2 * we.heap[we.heap_max] + 1] = 0, gt = we.heap_max + 1; gt < w; gt++) We < (Me = rt[2 * rt[2 * (Ze = we.heap[gt]) + 1] + 1] + 1) && (Me = We, Ye++), rt[2 * Ze + 1] = Me, Z < Ze || (we.bl_count[Me]++, st = 0, Ke <= Ze && (st = Te[Ze - Ke]), Pt = rt[2 * Ze], we.opt_len += Pt * (Me + st), Fe && (we.static_len += Pt * (me[2 * Ze + 1] + st)));
            if (Ye !== 0) {
              do {
                for (Me = We - 1; we.bl_count[Me] === 0; ) Me--;
                we.bl_count[Me]--, we.bl_count[Me + 1] += 2, we.bl_count[We]--, Ye -= 2;
              } while (0 < Ye);
              for (Me = We; Me !== 0; Me--) for (Ze = we.bl_count[Me]; Ze !== 0; ) Z < (bt = we.heap[--gt]) || (rt[2 * bt + 1] !== Me && (we.opt_len += (Me - rt[2 * bt + 1]) * rt[2 * bt], rt[2 * bt + 1] = Me), Ze--);
            }
          })(I, P), xe(V, Ee, I.bl_count);
        }
        function c(I, P, ee) {
          var te, F, V = -1, se = P[1], re = 0, fe = 7, Ee = 4;
          for (se === 0 && (fe = 138, Ee = 3), P[2 * (ee + 1) + 1] = 65535, te = 0; te <= ee; te++) F = se, se = P[2 * (te + 1) + 1], ++re < fe && F === se || (re < Ee ? I.bl_tree[2 * F] += re : F !== 0 ? (F !== V && I.bl_tree[2 * F]++, I.bl_tree[2 * E]++) : re <= 10 ? I.bl_tree[2 * S]++ : I.bl_tree[2 * z]++, V = F, Ee = (re = 0) === se ? (fe = 138, 3) : F === se ? (fe = 6, 3) : (fe = 7, 4));
        }
        function W(I, P, ee) {
          var te, F, V = -1, se = P[1], re = 0, fe = 7, Ee = 4;
          for (se === 0 && (fe = 138, Ee = 3), te = 0; te <= ee; te++) if (F = se, se = P[2 * (te + 1) + 1], !(++re < fe && F === se)) {
            if (re < Ee) for (; ie(I, F, I.bl_tree), --re != 0; ) ;
            else F !== 0 ? (F !== V && (ie(I, F, I.bl_tree), re--), ie(I, E, I.bl_tree), ce(I, re - 3, 2)) : re <= 10 ? (ie(I, S, I.bl_tree), ce(I, re - 3, 3)) : (ie(I, z, I.bl_tree), ce(I, re - 11, 7));
            V = F, Ee = (re = 0) === se ? (fe = 138, 3) : F === se ? (fe = 6, 3) : (fe = 7, 4);
          }
        }
        l(Y);
        var q = !1;
        function C(I, P, ee, te) {
          ce(I, (d << 1) + (te ? 1 : 0), 3), (function(F, V, se, re) {
            ue(F), oe(F, se), oe(F, ~se), i.arraySet(F.pending_buf, F.window, V, se, F.pending), F.pending += se;
          })(I, P, ee);
        }
        s._tr_init = function(I) {
          q || ((function() {
            var P, ee, te, F, V, se = new Array(A + 1);
            for (F = te = 0; F < f - 1; F++) for (G[F] = te, P = 0; P < 1 << x[F]; P++) b[te++] = F;
            for (b[te - 1] = F, F = V = 0; F < 16; F++) for (Y[F] = V, P = 0; P < 1 << U[F]; P++) R[V++] = F;
            for (V >>= 7; F < u; F++) for (Y[F] = V << 7, P = 0; P < 1 << U[F] - 7; P++) R[256 + V++] = F;
            for (ee = 0; ee <= A; ee++) se[ee] = 0;
            for (P = 0; P <= 143; ) K[2 * P + 1] = 8, P++, se[8]++;
            for (; P <= 255; ) K[2 * P + 1] = 9, P++, se[9]++;
            for (; P <= 279; ) K[2 * P + 1] = 7, P++, se[7]++;
            for (; P <= 287; ) K[2 * P + 1] = 8, P++, se[8]++;
            for (xe(K, m + 1, se), P = 0; P < u; P++) B[2 * P + 1] = 5, B[2 * P] = Ne(P, 5);
            ne = new de(K, x, g + 1, m, A), T = new de(B, U, 0, u, A), ae = new de(new Array(0), Q, 0, y, v);
          })(), q = !0), I.l_desc = new H(I.dyn_ltree, ne), I.d_desc = new H(I.dyn_dtree, T), I.bl_desc = new H(I.bl_tree, ae), I.bi_buf = 0, I.bi_valid = 0, j(I);
        }, s._tr_stored_block = C, s._tr_flush_block = function(I, P, ee, te) {
          var F, V, se = 0;
          0 < I.level ? (I.strm.data_type === 2 && (I.strm.data_type = (function(re) {
            var fe, Ee = 4093624447;
            for (fe = 0; fe <= 31; fe++, Ee >>>= 1) if (1 & Ee && re.dyn_ltree[2 * fe] !== 0) return a;
            if (re.dyn_ltree[18] !== 0 || re.dyn_ltree[20] !== 0 || re.dyn_ltree[26] !== 0) return o;
            for (fe = 32; fe < g; fe++) if (re.dyn_ltree[2 * fe] !== 0) return o;
            return a;
          })(I)), ke(I, I.l_desc), ke(I, I.d_desc), se = (function(re) {
            var fe;
            for (c(re, re.dyn_ltree, re.l_desc.max_code), c(re, re.dyn_dtree, re.d_desc.max_code), ke(re, re.bl_desc), fe = y - 1; 3 <= fe && re.bl_tree[2 * O[fe] + 1] === 0; fe--) ;
            return re.opt_len += 3 * (fe + 1) + 5 + 5 + 4, fe;
          })(I), F = I.opt_len + 3 + 7 >>> 3, (V = I.static_len + 3 + 7 >>> 3) <= F && (F = V)) : F = V = ee + 5, ee + 4 <= F && P !== -1 ? C(I, P, ee, te) : I.strategy === 4 || V === F ? (ce(I, 2 + (te ? 1 : 0), 3), ge(I, K, B)) : (ce(I, 4 + (te ? 1 : 0), 3), (function(re, fe, Ee, we) {
            var Ue;
            for (ce(re, fe - 257, 5), ce(re, Ee - 1, 5), ce(re, we - 4, 4), Ue = 0; Ue < we; Ue++) ce(re, re.bl_tree[2 * O[Ue] + 1], 3);
            W(re, re.dyn_ltree, fe - 1), W(re, re.dyn_dtree, Ee - 1);
          })(I, I.l_desc.max_code + 1, I.d_desc.max_code + 1, se + 1), ge(I, I.dyn_ltree, I.dyn_dtree)), j(I), te && ue(I);
        }, s._tr_tally = function(I, P, ee) {
          return I.pending_buf[I.d_buf + 2 * I.last_lit] = P >>> 8 & 255, I.pending_buf[I.d_buf + 2 * I.last_lit + 1] = 255 & P, I.pending_buf[I.l_buf + I.last_lit] = 255 & ee, I.last_lit++, P === 0 ? I.dyn_ltree[2 * ee]++ : (I.matches++, P--, I.dyn_ltree[2 * (b[ee] + g + 1)]++, I.dyn_dtree[2 * $(P)]++), I.last_lit === I.lit_bufsize - 1;
        }, s._tr_align = function(I) {
          ce(I, 2, 3), ie(I, N, K), (function(P) {
            P.bi_valid === 16 ? (oe(P, P.bi_buf), P.bi_buf = 0, P.bi_valid = 0) : 8 <= P.bi_valid && (P.pending_buf[P.pending++] = 255 & P.bi_buf, P.bi_buf >>= 8, P.bi_valid -= 8);
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
              var l, d, f, g, m = 1, u = {}, y = !1, w = a.document, A = Object.getPrototypeOf && Object.getPrototypeOf(a);
              A = A && A.setTimeout ? A : a, l = {}.toString.call(a.process) === "[object process]" ? function(E) {
                process.nextTick(function() {
                  v(E);
                });
              } : (function() {
                if (a.postMessage && !a.importScripts) {
                  var E = !0, S = a.onmessage;
                  return a.onmessage = function() {
                    E = !1;
                  }, a.postMessage("", "*"), a.onmessage = S, E;
                }
              })() ? (g = "setImmediate$" + Math.random() + "$", a.addEventListener ? a.addEventListener("message", N, !1) : a.attachEvent("onmessage", N), function(E) {
                a.postMessage(g + E, "*");
              }) : a.MessageChannel ? ((f = new MessageChannel()).port1.onmessage = function(E) {
                v(E.data);
              }, function(E) {
                f.port2.postMessage(E);
              }) : w && "onreadystatechange" in w.createElement("script") ? (d = w.documentElement, function(E) {
                var S = w.createElement("script");
                S.onreadystatechange = function() {
                  v(E), S.onreadystatechange = null, d.removeChild(S), S = null;
                }, d.appendChild(S);
              }) : function(E) {
                setTimeout(v, 0, E);
              }, A.setImmediate = function(E) {
                typeof E != "function" && (E = new Function("" + E));
                for (var S = new Array(arguments.length - 1), z = 0; z < S.length; z++) S[z] = arguments[z + 1];
                var x = { callback: E, args: S };
                return u[m] = x, l(m), m++;
              }, A.clearImmediate = k;
            }
            function k(E) {
              delete u[E];
            }
            function v(E) {
              if (y) setTimeout(v, 0, E);
              else {
                var S = u[E];
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
                    k(E), y = !1;
                  }
                }
              }
            }
            function N(E) {
              E.source === a && typeof E.data == "string" && E.data.indexOf(g) === 0 && v(+E.data.slice(g.length));
            }
          })(typeof self > "u" ? i === void 0 ? this : i : self);
        }).call(this, typeof Cn < "u" ? Cn : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Ws)), Ws.exports;
}
var yu = Au();
const ku = /* @__PURE__ */ wu(yu);
var Oe;
(function(r) {
  r.OfficeDocument = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument", r.FontTable = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable", r.Image = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image", r.Numbering = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering", r.Styles = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles", r.StylesWithEffects = "http://schemas.microsoft.com/office/2007/relationships/stylesWithEffects", r.Theme = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme", r.Settings = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings", r.WebSettings = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings", r.Hyperlink = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink", r.Footnotes = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes", r.Endnotes = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes", r.Footer = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer", r.Header = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/header", r.ExtendedProperties = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties", r.CoreProperties = "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties", r.CustomProperties = "http://schemas.openxmlformats.org/package/2006/relationships/metadata/custom-properties", r.Comments = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments", r.CommentsExtended = "http://schemas.microsoft.com/office/2011/relationships/commentsExtended", r.AltChunk = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk";
})(Oe || (Oe = {}));
function _u(r, e) {
  return e.elements(r).map((t) => ({
    id: e.attr(t, "Id"),
    type: e.attr(t, "Type"),
    target: e.attr(t, "Target"),
    targetMode: e.attr(t, "TargetMode")
  }));
}
function vu(r) {
  return r?.replace(/[ .]+/g, "-").replace(/[&]+/g, "and").toLowerCase();
}
function hi(r) {
  return /^[^"'].*\s.*[^"']$/.test(r) ? `'${r}'` : r;
}
function Pn(r) {
  let e = r.lastIndexOf("/") + 1, t = e == 0 ? "" : r.substring(0, e), n = e == 0 ? r : r.substring(e);
  return [t, n];
}
function Xs(r, e) {
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
function Iu(r) {
  return new Promise((e, t) => {
    const n = new FileReader();
    n.onloadend = () => e(n.result), n.onerror = () => t(), n.readAsDataURL(r);
  });
}
function Zs(r) {
  return r && typeof r == "object" && !Array.isArray(r);
}
function fi(r) {
  return typeof r == "string" || r instanceof String;
}
function qn(r, ...e) {
  if (!e.length)
    return r;
  const t = e.shift();
  if (Zs(r) && Zs(t))
    for (const n in t)
      if (Zs(t[n])) {
        const s = r[n] ?? (r[n] = {});
        qn(s, t[n]);
      } else
        r[n] = t[n];
  return qn(r, ...e);
}
function Qr(r) {
  return Array.isArray(r) ? r : [r];
}
function Cu(r, e, t) {
  return e > r ? e : t < r ? t : r;
}
const nl = {
  wordml: "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
}, He = {
  Dxa: { mul: 0.05, unit: "pt" },
  Emu: { mul: 1 / 12700, unit: "pt" },
  FontSize: { mul: 0.5, unit: "pt" },
  Border: { mul: 0.125, unit: "pt", min: 0.25, max: 12 },
  Point: { mul: 1, unit: "pt" },
  Percent: { mul: 0.02, unit: "%" }
};
function sl(r, e = He.Dxa) {
  if (r == null || /.+(p[xt]|[%])$/.test(r))
    return r;
  var t = parseInt(r) * e.mul;
  return e.min && e.max && (t = Cu(t, e.min, e.max)), `${t.toFixed(2)}${e.unit}`;
}
function Eu(r, e = !1) {
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
function il(r, e, t) {
  if (r.namespaceURI != nl.wordml)
    return !1;
  switch (r.localName) {
    case "color":
      e.color = t.attr(r, "val");
      break;
    case "sz":
      e.fontSize = t.lengthAttr(r, "val", He.FontSize);
      break;
    default:
      return !1;
  }
  return !0;
}
function Su(r, e = !1) {
  e && (r = r.replace(/<[?].*[?]>/, "")), r = Bu(r);
  const t = new DOMParser().parseFromString(r, "application/xml"), n = Nu(t);
  if (n)
    throw new Error(n);
  return t;
}
function Nu(r) {
  return r.getElementsByTagName("parsererror")[0]?.textContent;
}
function Bu(r) {
  return r.charCodeAt(0) === 65279 ? r.substring(1) : r;
}
function xu(r) {
  return new XMLSerializer().serializeToString(r);
}
class al {
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
    return Eu(this.attr(e, t), n);
  }
  lengthAttr(e, t, n = He.Dxa) {
    return sl(this.attr(e, t), n);
  }
}
const M = new al();
class ft {
  constructor(e, t) {
    this._package = e, this.path = t;
  }
  async load() {
    this.rels = await this._package.loadRelationships(this.path);
    const e = await this._package.load(this.path), t = this._package.parseXmlDocument(e);
    this._package.options.keepOrigin && (this._xmlDocument = t), this.parseXml(t.firstElementChild);
  }
  save() {
    this._package.update(this.path, xu(this._xmlDocument));
  }
  parseXml(e) {
  }
}
const Du = {
  embedRegular: "regular",
  embedBold: "bold",
  embedItalic: "italic",
  embedBoldItalic: "boldItalic"
};
function Mu(r, e) {
  return e.elements(r).map((t) => Ru(t, e));
}
function Ru(r, e) {
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
        t.embedFontRefs.push(zu(n, e));
        break;
    }
  return t;
}
function zu(r, e) {
  return {
    id: e.attr(r, "id"),
    key: e.attr(r, "fontKey"),
    type: Du[r.localName]
  };
}
class Pu extends ft {
  parseXml(e) {
    this.fonts = Mu(e, this._package.xmlParser);
  }
}
function Fu(r, e) {
  return e.elements(r).map((t) => ({
    extension: e.attr(t, "Extension"),
    partName: e.attr(t, "PartName"),
    contentType: e.attr(t, "ContentType")
  }));
}
class Ni {
  constructor(e, t) {
    this._zip = e, this.options = t, this.xmlParser = new al();
  }
  get(e) {
    const t = Tu(e);
    return this._zip.files[t] ?? this._zip.files[t.replace(/\//g, "\\")];
  }
  update(e, t) {
    this._zip.file(e, t);
  }
  static async load(e, t) {
    const n = await ku.loadAsync(e);
    return new Ni(n, t);
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
      const [s, i] = Pn(e);
      t = `${s}_rels/${i}.rels`;
    }
    const n = await this.load(t);
    return n ? _u(this.parseXmlDocument(n).firstElementChild, this.xmlParser) : null;
  }
  async loadContentTypes() {
    const e = await this.load("[Content_Types].xml");
    return e ? Fu(this.parseXmlDocument(e).firstElementChild, this.xmlParser) : [];
  }
  parseXmlDocument(e) {
    return Su(e, this.options.trimXmlDeclaration);
  }
}
function Tu(r) {
  return r.startsWith("/") ? r.substr(1) : r;
}
class Qu extends ft {
  constructor(e, t, n) {
    super(e, t), this._documentParser = n;
  }
  parseXml(e) {
    this.body = this._documentParser.parseDocumentFile(e);
  }
}
function Sn(r, e) {
  return {
    type: e.attr(r, "val"),
    color: e.attr(r, "color"),
    size: e.lengthAttr(r, "sz", He.Border),
    offset: e.lengthAttr(r, "space", He.Point),
    frame: e.boolAttr(r, "frame"),
    shadow: e.boolAttr(r, "shadow")
  };
}
function Lu(r, e) {
  var t = {};
  for (let n of e.elements(r))
    switch (n.localName) {
      case "left":
        t.left = Sn(n, e);
        break;
      case "top":
        t.top = Sn(n, e);
        break;
      case "right":
        t.right = Sn(n, e);
        break;
      case "bottom":
        t.bottom = Sn(n, e);
        break;
    }
  return t;
}
var Xa;
(function(r) {
  r.Continuous = "continuous", r.NextPage = "nextPage", r.NextColumn = "nextColumn", r.EvenPage = "evenPage", r.OddPage = "oddPage";
})(Xa || (Xa = {}));
function ol(r, e = M) {
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
        t.columns = Uu(n, e);
        break;
      case "headerReference":
        (t.headerRefs ?? (t.headerRefs = [])).push(Za(n, e));
        break;
      case "footerReference":
        (t.footerRefs ?? (t.footerRefs = [])).push(Za(n, e));
        break;
      case "titlePg":
        t.titlePage = e.boolAttr(n, "val", !0);
        break;
      case "pgBorders":
        t.pageBorders = Lu(n, e);
        break;
      case "pgNumType":
        t.pageNumber = Ou(n, e);
        break;
    }
  return t;
}
function Uu(r, e) {
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
function Ou(r, e) {
  return {
    chapSep: e.attr(r, "chapSep"),
    chapStyle: e.attr(r, "chapStyle"),
    format: e.attr(r, "fmt"),
    start: e.intAttr(r, "start")
  };
}
function Za(r, e) {
  return {
    id: e.attr(r, "id"),
    type: e.attr(r, "type")
  };
}
function $u(r, e) {
  return {
    before: e.lengthAttr(r, "before"),
    after: e.lengthAttr(r, "after"),
    line: e.intAttr(r, "line"),
    lineRule: e.attr(r, "lineRule")
  };
}
function Bi(r, e) {
  let t = {};
  for (let n of e.elements(r))
    Hu(n, t, e);
  return t;
}
function Hu(r, e, t) {
  return !!il(r, e, t);
}
function ll(r, e) {
  let t = {};
  for (let n of e.elements(r))
    cl(n, t, e);
  return t;
}
function cl(r, e, t) {
  if (r.namespaceURI != nl.wordml)
    return !1;
  if (il(r, e, t))
    return !0;
  switch (r.localName) {
    case "tabs":
      e.tabs = ju(r, t);
      break;
    case "sectPr":
      e.sectionProps = ol(r, t);
      break;
    case "numPr":
      e.numbering = qu(r, t);
      break;
    case "spacing":
      return e.lineSpacing = $u(r, t), !1;
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
      e.runProps = Bi(r, t);
      break;
    default:
      return !1;
  }
  return !0;
}
function ju(r, e) {
  return e.elements(r, "tab").map((t) => ({
    position: e.lengthAttr(t, "pos"),
    leader: e.attr(t, "leader"),
    style: e.attr(t, "val")
  }));
}
function qu(r, e) {
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
function Gu(r, e) {
  let t = {
    numberings: [],
    abstractNumberings: [],
    bulletPictures: []
  };
  for (let n of e.elements(r))
    switch (n.localName) {
      case "num":
        t.numberings.push(Ju(n, e));
        break;
      case "abstractNum":
        t.abstractNumberings.push(Vu(n, e));
        break;
      case "numPicBullet":
        t.bulletPictures.push(Xu(n, e));
        break;
    }
  return t;
}
function Ju(r, e) {
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
        t.overrides.push(Wu(n, e));
        break;
    }
  return t;
}
function Vu(r, e) {
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
        t.levels.push(dl(n, e));
        break;
    }
  return t;
}
function dl(r, e) {
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
        t.paragraphProps = ll(n, e);
        break;
      case "rPr":
        t.runProps = Bi(n, e);
        break;
    }
  return t;
}
function Wu(r, e) {
  let t = {
    level: e.intAttr(r, "ilvl")
  };
  for (let n of e.elements(r))
    switch (n.localName) {
      case "startOverride":
        t.start = e.intAttr(n, "val");
        break;
      case "lvl":
        t.numberingLevel = dl(n, e);
        break;
    }
  return t;
}
function Xu(r, e) {
  var t = e.element(r, "pict"), n = t && e.element(t, "shape"), s = n && e.element(n, "imagedata");
  return s ? {
    id: e.attr(r, "numPicBulletId"),
    referenceId: e.attr(s, "id"),
    style: e.attr(n, "style")
  } : null;
}
class Zu extends ft {
  constructor(e, t, n) {
    super(e, t), this._documentParser = n;
  }
  parseXml(e) {
    Object.assign(this, Gu(e, this._package.xmlParser)), this.domNumberings = this._documentParser.parseNumberingFile(e);
  }
}
class Ku extends ft {
  constructor(e, t, n) {
    super(e, t), this._documentParser = n;
  }
  parseXml(e) {
    this.styles = this._documentParser.parseStylesFile(e);
  }
}
var J;
(function(r) {
  r.Document = "document", r.Paragraph = "paragraph", r.Run = "run", r.Break = "break", r.NoBreakHyphen = "noBreakHyphen", r.Table = "table", r.Row = "row", r.Cell = "cell", r.Hyperlink = "hyperlink", r.SmartTag = "smartTag", r.Drawing = "drawing", r.Image = "image", r.Text = "text", r.Tab = "tab", r.Symbol = "symbol", r.BookmarkStart = "bookmarkStart", r.BookmarkEnd = "bookmarkEnd", r.Footer = "footer", r.Header = "header", r.FootnoteReference = "footnoteReference", r.EndnoteReference = "endnoteReference", r.Footnote = "footnote", r.Endnote = "endnote", r.SimpleField = "simpleField", r.ComplexField = "complexField", r.Instruction = "instruction", r.VmlPicture = "vmlPicture", r.MmlMath = "mmlMath", r.MmlMathParagraph = "mmlMathParagraph", r.MmlFraction = "mmlFraction", r.MmlFunction = "mmlFunction", r.MmlFunctionName = "mmlFunctionName", r.MmlNumerator = "mmlNumerator", r.MmlDenominator = "mmlDenominator", r.MmlRadical = "mmlRadical", r.MmlBase = "mmlBase", r.MmlDegree = "mmlDegree", r.MmlSuperscript = "mmlSuperscript", r.MmlSubscript = "mmlSubscript", r.MmlPreSubSuper = "mmlPreSubSuper", r.MmlSubArgument = "mmlSubArgument", r.MmlSuperArgument = "mmlSuperArgument", r.MmlNary = "mmlNary", r.MmlDelimiter = "mmlDelimiter", r.MmlRun = "mmlRun", r.MmlEquationArray = "mmlEquationArray", r.MmlLimit = "mmlLimit", r.MmlLimitLower = "mmlLimitLower", r.MmlMatrix = "mmlMatrix", r.MmlMatrixRow = "mmlMatrixRow", r.MmlBox = "mmlBox", r.MmlBar = "mmlBar", r.MmlGroupChar = "mmlGroupChar", r.VmlElement = "vmlElement", r.Inserted = "inserted", r.Deleted = "deleted", r.DeletedText = "deletedText", r.Comment = "comment", r.CommentReference = "commentReference", r.CommentRangeStart = "commentRangeStart", r.CommentRangeEnd = "commentRangeEnd", r.AltChunk = "altChunk";
})(J || (J = {}));
class rr {
  constructor() {
    this.children = [], this.cssStyle = {};
  }
}
class Yu extends rr {
  constructor() {
    super(...arguments), this.type = J.Header;
  }
}
class eh extends rr {
  constructor() {
    super(...arguments), this.type = J.Footer;
  }
}
class ul extends ft {
  constructor(e, t, n) {
    super(e, t), this._documentParser = n;
  }
  parseXml(e) {
    this.rootElement = this.createRootElement(), this.rootElement.children = this._documentParser.parseBodyElements(e);
  }
}
class th extends ul {
  createRootElement() {
    return new Yu();
  }
}
class rh extends ul {
  createRootElement() {
    return new eh();
  }
}
function nh(r, e) {
  const t = {};
  for (let n of e.elements(r))
    switch (n.localName) {
      case "Template":
        t.template = n.textContent;
        break;
      case "Pages":
        t.pages = Lr(n.textContent);
        break;
      case "Words":
        t.words = Lr(n.textContent);
        break;
      case "Characters":
        t.characters = Lr(n.textContent);
        break;
      case "Application":
        t.application = n.textContent;
        break;
      case "Lines":
        t.lines = Lr(n.textContent);
        break;
      case "Paragraphs":
        t.paragraphs = Lr(n.textContent);
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
function Lr(r) {
  if (!(typeof r > "u"))
    return parseInt(r);
}
class sh extends ft {
  parseXml(e) {
    this.props = nh(e, this._package.xmlParser);
  }
}
function ih(r, e) {
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
class ah extends ft {
  parseXml(e) {
    this.props = ih(e, this._package.xmlParser);
  }
}
class oh {
}
function lh(r, e) {
  var t = new oh(), n = e.element(r, "themeElements");
  for (let s of e.elements(n))
    switch (s.localName) {
      case "clrScheme":
        t.colorScheme = ch(s, e);
        break;
      case "fontScheme":
        t.fontScheme = dh(s, e);
        break;
    }
  return t;
}
function ch(r, e) {
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
function dh(r, e) {
  var t = {
    name: e.attr(r, "name")
  };
  for (let n of e.elements(r))
    switch (n.localName) {
      case "majorFont":
        t.majorFont = Ka(n, e);
        break;
      case "minorFont":
        t.minorFont = Ka(n, e);
        break;
    }
  return t;
}
function Ka(r, e) {
  return {
    latinTypeface: e.elementAttr(r, "latin", "typeface"),
    eaTypeface: e.elementAttr(r, "ea", "typeface"),
    csTypeface: e.elementAttr(r, "cs", "typeface")
  };
}
class uh extends ft {
  constructor(e, t) {
    super(e, t);
  }
  parseXml(e) {
    this.theme = lh(e, this._package.xmlParser);
  }
}
class hl {
}
class hh extends hl {
  constructor() {
    super(...arguments), this.type = J.Footnote;
  }
}
class fh extends hl {
  constructor() {
    super(...arguments), this.type = J.Endnote;
  }
}
class fl extends ft {
  constructor(e, t, n) {
    super(e, t), this._documentParser = n;
  }
}
class gh extends fl {
  constructor(e, t, n) {
    super(e, t, n);
  }
  parseXml(e) {
    this.notes = this._documentParser.parseNotes(e, "footnote", hh);
  }
}
class ph extends fl {
  constructor(e, t, n) {
    super(e, t, n);
  }
  parseXml(e) {
    this.notes = this._documentParser.parseNotes(e, "endnote", fh);
  }
}
function mh(r, e) {
  var t = {};
  for (let n of e.elements(r))
    switch (n.localName) {
      case "defaultTabStop":
        t.defaultTabStop = e.lengthAttr(n, "val");
        break;
      case "footnotePr":
        t.footnoteProps = Ya(n, e);
        break;
      case "endnotePr":
        t.endnoteProps = Ya(n, e);
        break;
      case "autoHyphenation":
        t.autoHyphenation = e.boolAttr(n, "val");
        break;
    }
  return t;
}
function Ya(r, e) {
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
class bh extends ft {
  constructor(e, t) {
    super(e, t);
  }
  parseXml(e) {
    this.settings = mh(e, this._package.xmlParser);
  }
}
function wh(r, e) {
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
class Ah extends ft {
  parseXml(e) {
    this.props = wh(e, this._package.xmlParser);
  }
}
class yh extends ft {
  constructor(e, t, n) {
    super(e, t), this._documentParser = n;
  }
  parseXml(e) {
    this.comments = this._documentParser.parseComments(e), this.commentMap = Qt(this.comments, (t) => t.id);
  }
}
class kh extends ft {
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
const _h = [
  { type: Oe.OfficeDocument, target: "word/document.xml" },
  { type: Oe.ExtendedProperties, target: "docProps/app.xml" },
  { type: Oe.CoreProperties, target: "docProps/core.xml" },
  { type: Oe.CustomProperties, target: "docProps/custom.xml" }
];
class xi {
  constructor() {
    this.parts = [], this.partsMap = {}, this.contentTypes = [];
  }
  static async load(e, t, n) {
    var s = new xi();
    return s._options = n, s._parser = t, s._package = await Ni.load(e, n), s.rels = await s._package.loadRelationships(), s.contentTypes = await s._package.loadContentTypes(), await Promise.all(_h.map((i) => {
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
      case Oe.OfficeDocument:
        this.documentPart = n = new Qu(this._package, e, this._parser);
        break;
      case Oe.FontTable:
        this.fontTablePart = n = new Pu(this._package, e);
        break;
      case Oe.Numbering:
        this.numberingPart = n = new Zu(this._package, e, this._parser);
        break;
      case Oe.Styles:
        this.stylesPart = n = new Ku(this._package, e, this._parser);
        break;
      case Oe.Theme:
        this.themePart = n = new uh(this._package, e);
        break;
      case Oe.Footnotes:
        this.footnotesPart = n = new gh(this._package, e, this._parser);
        break;
      case Oe.Endnotes:
        this.endnotesPart = n = new ph(this._package, e, this._parser);
        break;
      case Oe.Footer:
        n = new rh(this._package, e, this._parser);
        break;
      case Oe.Header:
        n = new th(this._package, e, this._parser);
        break;
      case Oe.CoreProperties:
        this.corePropsPart = n = new ah(this._package, e);
        break;
      case Oe.ExtendedProperties:
        this.extendedPropsPart = n = new sh(this._package, e);
        break;
      case Oe.CustomProperties:
        n = new Ah(this._package, e);
        break;
      case Oe.Settings:
        this.settingsPart = n = new bh(this._package, e);
        break;
      case Oe.Comments:
        this.commentsPart = n = new yh(this._package, e, this._parser);
        break;
      case Oe.CommentsExtended:
        this.commentsExtendedPart = n = new kh(this._package, e);
        break;
    }
    if (n == null)
      return Promise.resolve(null);
    if (this.partsMap[e] = n, this.parts.push(n), await n.load(), n.rels?.length > 0) {
      const [s] = Pn(n.path);
      await Promise.all(n.rels.map((i) => this.loadRelationshipPart(Xs(i.target, s), i.type)));
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
    return s && this.blobToURL(new Blob([vh(s, t)]), n);
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
    return this._options.useBase64URL ? Iu(e) : URL.createObjectURL(e);
  }
  findPartByRelId(e, t = null) {
    var n = (t.rels ?? this.rels).find((i) => i.id == e);
    const s = t ? Pn(t.path)[0] : "";
    return n ? this.partsMap[Xs(n.target, s)] : null;
  }
  getPathById(e, t) {
    const n = e.rels.find((i) => i.id == t), [s] = Pn(e.path);
    return n ? Xs(n.target, s) : null;
  }
}
function vh(r, e) {
  const n = e.replace(/{|}|-/g, ""), s = new Array(16);
  for (let i = 0; i < 16; i++)
    s[16 - i - 1] = parseInt(n.substring(i * 2, i * 2 + 2), 16);
  for (let i = 0; i < 32; i++)
    r[i] = r[i] ^ s[i % 16];
  return r;
}
function Ih(r, e) {
  return {
    type: J.BookmarkStart,
    id: e.attr(r, "id"),
    name: e.attr(r, "name"),
    colFirst: e.intAttr(r, "colFirst"),
    colLast: e.intAttr(r, "colLast")
  };
}
function Ch(r, e) {
  return {
    type: J.BookmarkEnd,
    id: e.attr(r, "id")
  };
}
class Eh extends rr {
  constructor() {
    super(...arguments), this.type = J.VmlElement, this.attrs = {};
  }
}
function gl(r, e) {
  var t = new Eh();
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
        const [s, i] = eo(n.value);
        Object.assign(t.attrs, { x1: s, y1: i });
        break;
      case "to":
        const [a, o] = eo(n.value);
        Object.assign(t.attrs, { x2: a, y2: o });
        break;
    }
  for (const n of M.elements(r))
    switch (n.localName) {
      case "stroke":
        Object.assign(t.attrs, Sh(n));
        break;
      case "fill":
        Object.assign(t.attrs, Nh());
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
        const s = gl(n, e);
        s && t.children.push(s);
        break;
    }
  return t;
}
function Sh(r) {
  return {
    stroke: M.attr(r, "color"),
    "stroke-width": M.lengthAttr(r, "weight", He.Emu) ?? "1px"
  };
}
function Nh(r) {
  return {};
}
function eo(r) {
  return r.split(",");
}
class Bh extends rr {
  constructor() {
    super(...arguments), this.type = J.Comment;
  }
}
class xh extends rr {
  constructor(e) {
    super(), this.id = e, this.type = J.CommentReference;
  }
}
class Dh extends rr {
  constructor(e) {
    super(), this.id = e, this.type = J.CommentRangeStart;
  }
}
class Mh extends rr {
  constructor(e) {
    super(), this.id = e, this.type = J.CommentRangeEnd;
  }
}
var Fn = {
  shd: "inherit",
  color: "black",
  borderColor: "black",
  highlight: "transparent"
};
const Rh = [], to = {
  oMath: J.MmlMath,
  oMathPara: J.MmlMathParagraph,
  f: J.MmlFraction,
  func: J.MmlFunction,
  fName: J.MmlFunctionName,
  num: J.MmlNumerator,
  den: J.MmlDenominator,
  rad: J.MmlRadical,
  deg: J.MmlDegree,
  e: J.MmlBase,
  sSup: J.MmlSuperscript,
  sSub: J.MmlSubscript,
  sPre: J.MmlPreSubSuper,
  sup: J.MmlSuperArgument,
  sub: J.MmlSubArgument,
  d: J.MmlDelimiter,
  nary: J.MmlNary,
  eqArr: J.MmlEquationArray,
  lim: J.MmlLimit,
  limLow: J.MmlLimitLower,
  m: J.MmlMatrix,
  mr: J.MmlMatrixRow,
  box: J.MmlBox,
  bar: J.MmlBar,
  groupChr: J.MmlGroupChar
};
class zh {
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
      const s = new Bh();
      s.id = M.attr(n, "id"), s.author = M.attr(n, "author"), s.initials = M.attr(n, "initials"), s.date = M.attr(n, "date"), s.children = this.parseBodyElements(n), t.push(s);
    }
    return t;
  }
  parseDocumentFile(e) {
    var t = M.element(e, "body"), n = M.element(e, "background"), s = M.element(t, "sectPr");
    return {
      type: J.Document,
      children: this.parseBodyElements(t),
      props: s ? ol(s, M) : {},
      cssStyle: n ? this.parseBackground(n) : {}
    };
  }
  parseBackground(e) {
    var t = {}, n = dr.colorAttr(e, "color");
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
          }), t.paragraphProps = ll(n, M);
          break;
        case "rPr":
          t.styles.push({
            target: "span",
            values: this.parseDefaultProperties(n, {})
          }), t.runProps = Bi(n, M);
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
    return { type: J.AltChunk, children: [], id: M.attr(e, "id") };
  }
  parseParagraph(e) {
    var t = { type: J.Paragraph, children: [] };
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
          t.children.push(Ih(n, M));
          break;
        case "bookmarkEnd":
          t.children.push(Ch(n, M));
          break;
        case "commentRangeStart":
          t.children.push(new Dh(M.attr(n, "id")));
          break;
        case "commentRangeEnd":
          t.children.push(new Mh(M.attr(n, "id")));
          break;
        case "oMath":
        case "oMathPara":
          t.children.push(this.parseMathElement(n));
          break;
        case "sdt":
          t.children.push(...this.parseSdt(n, (s) => this.parseParagraph(s).children));
          break;
        case "ins":
          t.children.push(this.parseChange(J.Inserted, n, (s) => this.parseParagraph(s)));
          break;
        case "del":
          t.children.push(this.parseChange(J.Deleted, n, (s) => this.parseParagraph(s)));
          break;
      }
    return t;
  }
  parseParagraphProperties(e, t) {
    this.parseDefaultProperties(e, t.cssStyle = {}, null, (n) => {
      if (cl(n, t, M))
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
    var n = { type: J.Hyperlink, parent: t, children: [] };
    n.anchor = M.attr(e, "anchor"), n.id = M.attr(e, "id");
    for (const s of M.elements(e))
      s.localName === "r" && n.children.push(this.parseRun(s, n));
    return n;
  }
  parseSmartTag(e, t) {
    var n = { type: J.SmartTag, parent: t, children: [] }, s = M.attr(e, "uri"), i = M.attr(e, "element");
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
    var n = { type: J.Run, parent: t, children: [] };
    for (let s of M.elements(e))
      switch (s = this.checkAlternateContent(s), s.localName) {
        case "t":
          n.children.push({
            type: J.Text,
            text: s.textContent
          });
          break;
        case "delText":
          n.children.push({
            type: J.DeletedText,
            text: s.textContent
          });
          break;
        case "commentReference":
          n.children.push(new xh(M.attr(s, "id")));
          break;
        case "fldSimple":
          n.children.push({
            type: J.SimpleField,
            instruction: M.attr(s, "instr"),
            lock: M.boolAttr(s, "lock", !1),
            dirty: M.boolAttr(s, "dirty", !1)
          });
          break;
        case "instrText":
          n.fieldRun = !0, n.children.push({
            type: J.Instruction,
            text: s.textContent
          });
          break;
        case "fldChar":
          n.fieldRun = !0, n.children.push({
            type: J.ComplexField,
            charType: M.attr(s, "fldCharType"),
            lock: M.boolAttr(s, "lock", !1),
            dirty: M.boolAttr(s, "dirty", !1)
          });
          break;
        case "noBreakHyphen":
          n.children.push({ type: J.NoBreakHyphen });
          break;
        case "br":
          n.children.push({
            type: J.Break,
            break: M.attr(s, "type") || "textWrapping"
          });
          break;
        case "lastRenderedPageBreak":
          n.children.push({
            type: J.Break,
            break: "lastRenderedPageBreak"
          });
          break;
        case "sym":
          n.children.push({
            type: J.Symbol,
            font: hi(M.attr(s, "font")),
            char: M.hexAttr(s, "char")
          });
          break;
        case "tab":
          n.children.push({ type: J.Tab });
          break;
        case "footnoteReference":
          n.children.push({
            type: J.FootnoteReference,
            id: M.attr(s, "id")
          });
          break;
        case "endnoteReference":
          n.children.push({
            type: J.EndnoteReference,
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
    const t = `${e.localName}Pr`, n = { type: to[e.localName], children: [] };
    for (const i of M.elements(e))
      if (to[i.localName])
        n.children.push(this.parseMathElement(i));
      else if (i.localName == "r") {
        var s = this.parseRun(i);
        s.type = J.MmlRun, n.children.push(s);
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
    const t = { type: J.VmlPicture, children: [] };
    for (const n of M.elements(e)) {
      const s = gl(n, this);
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
      if (Rh.includes(s))
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
    var t = { type: J.Drawing, children: [], cssStyle: {} }, n = e.localName == "anchor";
    let s = null, i = M.boolAttr(e, "simplePos");
    M.boolAttr(e, "behindDoc");
    let a = { relative: "page", align: "left", offset: "0" }, o = { relative: "page", align: "top", offset: "0" };
    for (var l of M.elements(e))
      switch (l.localName) {
        case "simplePos":
          i && (a.offset = M.lengthAttr(l, "x", He.Emu), o.offset = M.lengthAttr(l, "y", He.Emu));
          break;
        case "extent":
          t.cssStyle.width = M.lengthAttr(l, "cx", He.Emu), t.cssStyle.height = M.lengthAttr(l, "cy", He.Emu);
          break;
        case "positionH":
        case "positionV":
          if (!i) {
            let m = l.localName == "positionH" ? a : o;
            var d = M.element(l, "align"), f = M.element(l, "posOffset");
            m.relative = M.attr(l, "relativeFrom") ?? m.relative, d && (m.align = d.textContent), f && (m.offset = sl(f.textContent, He.Emu));
          }
          break;
        case "wrapTopAndBottom":
          s = "wrapTopAndBottom";
          break;
        case "wrapNone":
          s = "wrapNone";
          break;
        case "graphic":
          var g = this.parseGraphic(l);
          g && t.children.push(g);
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
    var t = { type: J.Image, src: "", cssStyle: {} }, n = M.element(e, "blipFill"), s = M.element(n, "blip"), i = M.element(n, "srcRect");
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
            t.cssStyle.width = M.lengthAttr(l, "cx", He.Emu), t.cssStyle.height = M.lengthAttr(l, "cy", He.Emu);
            break;
          case "off":
            t.cssStyle.left = M.lengthAttr(l, "x", He.Emu), t.cssStyle.top = M.lengthAttr(l, "y", He.Emu);
            break;
        }
    }
    return t;
  }
  parseTable(e) {
    var t = { type: J.Table, children: [] };
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
    var t = { type: J.Row, children: [] };
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
    var t = { type: J.Cell, children: [] };
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
            t.color = dr.colorAttr(i, "val", null, Fn.color);
            break;
          case "sz":
            t["font-size"] = t["min-height"] = M.lengthAttr(i, "val", He.FontSize);
            break;
          case "shd":
            t["background-color"] = dr.colorAttr(i, "fill", null, Fn.shd);
            break;
          case "highlight":
            t["background-color"] = dr.colorAttr(i, "val", null, Fn.highlight);
            break;
          case "vertAlign":
            break;
          case "position":
            t.verticalAlign = M.lengthAttr(i, "val", He.FontSize);
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
      var s = dr.colorAttr(e, "color");
      s && (t["text-decoration-color"] = s);
    }
  }
  parseFont(e, t) {
    var n = M.attr(e, "ascii"), s = Re.themeValue(e, "asciiTheme"), i = M.attr(e, "eastAsia"), a = [n, s, i].filter((o) => o).map((o) => hi(o));
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
const Ph = ["black", "blue", "cyan", "darkBlue", "darkCyan", "darkGray", "darkGreen", "darkMagenta", "darkRed", "darkYellow", "green", "lightGray", "magenta", "none", "red", "white", "yellow"];
class dr {
  static colorAttr(e, t, n = null, s = "black") {
    var i = M.attr(e, t);
    if (i)
      return i == "auto" ? s : Ph.includes(i) ? i : `#${i}`;
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
    var n = He.Dxa;
    switch (M.attr(e, "type")) {
      case "dxa":
        break;
      case "pct":
        n = He.Percent;
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
    var n = dr.colorAttr(e, "color"), s = M.lengthAttr(e, "sz", He.Border);
    return `${s} ${t} ${n == "auto" ? Fn.borderColor : n}`;
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
const ro = { pos: 0, leader: "none", style: "left" }, Fh = 50;
function Th(r = document.body) {
  const e = document.createElement("div");
  e.style.width = "100pt", r.appendChild(e);
  const t = 100 / e.offsetWidth;
  return r.removeChild(e), t;
}
function Qh(r, e, t, n = 72 / 96) {
  const s = r.closest("p"), i = r.getBoundingClientRect(), a = s.getBoundingClientRect(), o = getComputedStyle(s), l = e?.length > 0 ? e.map((v) => ({
    pos: no(v.position),
    leader: v.leader,
    style: v.style
  })).sort((v, N) => v.pos - N.pos) : [ro], d = l[l.length - 1], f = a.width * n, g = no(t);
  let m = d.pos + g;
  if (m < f)
    for (; m < f && l.length < Fh; m += g)
      l.push({ ...ro, pos: m });
  const u = parseFloat(o.marginLeft), y = a.left + u, w = (i.left - y) * n, A = l.find((v) => v.style != "clear" && v.pos > w);
  if (A == null)
    return;
  let k = 1;
  if (A.style == "right" || A.style == "center") {
    const v = Array.from(s.querySelectorAll(`.${r.className}`)), N = v.indexOf(r) + 1, E = document.createRange();
    E.setStart(r, 1), N < v.length ? E.setEndBefore(v[N]) : E.setEndAfter(s);
    const S = A.style == "center" ? 0.5 : 1, z = E.getBoundingClientRect(), x = z.left + S * z.width - (a.left - u);
    k = A.pos - x * n;
  } else
    k = A.pos - w;
  switch (r.innerHTML = "&nbsp;", r.style.textDecoration = "inherit", r.style.wordSpacing = `${k.toFixed(0)}pt`, A.leader) {
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
function no(r) {
  return parseFloat(r);
}
var De;
(function(r) {
  r.html = "http://www.w3.org/1999/xhtml", r.svg = "http://www.w3.org/2000/svg", r.mathML = "http://www.w3.org/1998/Math/MathML";
})(De || (De = {}));
function Gn(r) {
  if (fi(r))
    return document.createTextNode(r);
  if (r instanceof Node)
    return r;
  const { ns: e, tagName: t, className: n, style: s, children: i, ...a } = r;
  if (t === "#fragment")
    return document.createDocumentFragment();
  if (t === "#comment")
    return document.createComment(i[0]);
  const o = e ? document.createElementNS(e, t) : document.createElement(t);
  if (n && o.setAttribute("class", n), s && (fi(s) ? o.setAttribute("style", s) : Object.assign(o.style, s)), a)
    for (const [l, d] of Object.entries(a))
      d !== void 0 && (o[l] = d);
  return i && i.forEach((l) => o.appendChild(Gn(l))), o;
}
function Lh(...r) {
  return r.filter(Boolean).join(" ");
}
class Uh {
  constructor() {
    this.className = "docx", this.styleMap = {}, this.currentPart = null, this.tableVerticalMerges = [], this.currentVerticalMerge = null, this.tableCellPositions = [], this.currentCellPosition = null, this.footnoteMap = {}, this.endnoteMap = {}, this.currentEndnoteIds = [], this.usedHederFooterParts = [], this.currentTabs = [], this.commentMap = {}, this.tasks = [], this.postRenderTasks = [], this.h = Gn;
  }
  async render(e, t) {
    this.document = e, this.options = t, this.className = t.className, this.rootSelector = t.inWrapper ? `.${this.className}-wrapper` : ":root", this.h = t.h ?? Gn, this.styleMap = null, this.tasks = [], this.options.renderComments && globalThis.Highlight && (this.commentHighlight = new Highlight());
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
            "font-family": hi(n.name),
            src: `url(${i})`
          };
          (s.type == "bold" || s.type == "boldItalic") && (a["font-weight"] = "bold"), (s.type == "italic" || s.type == "boldItalic") && (a["font-style"] = "italic"), t.push(this.h({ tagName: "#comment", children: [`docxjs ${n.name} font`] })), t.push(this.h({ tagName: "style", children: [this.styleToString("@font-face", a)] }));
        } catch {
          this.options.debug && console.warn(`Can't load font with id ${s.id} and key ${s.key}`);
        }
    return t;
  }
  processStyleName(e) {
    return e ? `${this.className}_${vu(e)}` : this.className;
  }
  processStyles(e) {
    const t = Qt(e.filter((s) => s.id != null), (s) => s.id);
    for (const s of e.filter((i) => i.basedOn)) {
      var n = t[s.basedOn];
      if (n) {
        s.paragraphProps = qn(s.paragraphProps, n.paragraphProps), s.runProps = qn(s.runProps, n.runProps);
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
        t.parent = e, t.type == J.Table ? this.processTable(t) : this.processElement(t);
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
      let f = s[o][0].sectProps;
      const g = this.createPageElement(this.className, f, e.cssStyle);
      this.options.renderHeaders && this.renderHeaderFooter(f.headerRefs, f, t.length, i != f, g);
      for (const m of s[o]) {
        var a = this.createSectionContent(m.sectProps);
        this.renderElements(m.elements, a), g.appendChild(a), f = m.sectProps;
      }
      if (this.options.renderFootnotes) {
        const m = this.renderNotes(this.currentFootnoteIds, this.footnoteMap);
        m && g.appendChild(m);
      }
      if (this.options.renderEndnotes && o == l - 1) {
        const m = this.renderNotes(this.currentEndnoteIds, this.endnoteMap);
        m && g.appendChild(m);
      }
      this.options.renderFooters && this.renderHeaderFooter(f.footerRefs, f, t.length, i != f, g), t.push(g), i = f;
    }
    return t;
  }
  renderHeaderFooter(e, t, n, s, i) {
    if (e) {
      var a = (t.titlePage && s ? e.find((l) => l.type == "first") : null) ?? (n % 2 == 1 ? e.find((l) => l.type == "even") : null) ?? e.find((l) => l.type == "default"), o = a && this.document.findPartByRelId(a.id, this.document.documentPart);
      if (o) {
        this.currentPart = o, this.usedHederFooterParts.includes(o.path) || (this.processElement(o.rootElement), this.usedHederFooterParts.push(o.path));
        const [l] = this.renderElements([o.rootElement], i);
        t?.pageMargins && (o.rootElement.type === J.Header ? (l.style.marginTop = `calc(${t.pageMargins.header} - ${t.pageMargins.top})`, l.style.minHeight = `calc(${t.pageMargins.top} - ${t.pageMargins.header})`) : o.rootElement.type === J.Footer && (l.style.marginBottom = `calc(${t.pageMargins.footer} - ${t.pageMargins.bottom})`, l.style.minHeight = `calc(${t.pageMargins.bottom} - ${t.pageMargins.footer})`)), this.currentPart = null;
      }
    }
  }
  isPageBreakElement(e) {
    return e.type != J.Break ? !1 : e.break == "lastRenderedPageBreak" ? !this.options.ignoreLastRenderedPageBreak : e.break == "page";
  }
  isPageBreakSection(e, t) {
    return !e || !t ? !1 : e.pageSize?.orientation != t.pageSize?.orientation || e.pageSize?.width != t.pageSize?.width || e.pageSize?.height != t.pageSize?.height;
  }
  splitBySection(e, t) {
    var n = { sectProps: null, elements: [], pageBreak: !1 }, s = [n];
    for (let g of e)
      if (g.type == J.Paragraph && this.findStyle(g.styleName)?.paragraphProps?.pageBreakBefore && (n.sectProps = i, n.pageBreak = !0, n = { sectProps: null, elements: [], pageBreak: !1 }, s.push(n)), n.elements.push(g), g.type == J.Paragraph) {
        const m = g;
        var i = m.sectionProps, a = -1, o = -1;
        if (this.options.breakPages && m.children && (a = m.children.findIndex((u) => (o = u.children?.findIndex(this.isPageBreakElement.bind(this)) ?? -1, o != -1))), (i || a != -1) && (n.sectProps = i, n.pageBreak = a != -1, n = { sectProps: null, elements: [], pageBreak: !1 }, s.push(n)), a != -1) {
          let u = m.children[a], y = o < u.children.length - 1;
          if (a < m.children.length - 1 || y) {
            var l = g.children, d = { ...g, children: l.slice(a) };
            if (g.children = l.slice(0, a), n.elements.push(d), y) {
              let w = u.children, A = { ...u, children: w.slice(0, o) };
              g.children.push(A), u.children = w.slice(o);
            }
          }
        }
      }
    let f = null;
    for (let g = s.length - 1; g >= 0; g--)
      s[g].sectProps == null ? s[g].sectProps = f ?? t : f = s[g].sectProps;
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
      for (const d of i) {
        var o = `${l.target ?? ""}.${l.cssName}`;
        l.target != d.target && (o += ` ${d.target}`), s[l.target] == l && (o = `.${this.className} ${l.target}, ` + o), t += this.styleToString(o, d.values);
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
      case J.Paragraph:
        return this.renderParagraph(e);
      case J.BookmarkStart:
        return this.renderBookmarkStart(e);
      case J.BookmarkEnd:
        return null;
      case J.Run:
        return this.renderRun(e);
      case J.Table:
        return this.renderTable(e);
      case J.Row:
        return this.renderTableRow(e);
      case J.Cell:
        return this.renderTableCell(e);
      case J.Hyperlink:
        return this.renderHyperlink(e);
      case J.SmartTag:
        return this.renderSmartTag(e);
      case J.Drawing:
        return this.renderDrawing(e);
      case J.Image:
        return this.renderImage(e);
      case J.Text:
        return this.renderText(e);
      case J.Text:
        return this.renderText(e);
      case J.DeletedText:
        return this.renderDeletedText(e);
      case J.Tab:
        return this.renderTab(e);
      case J.Symbol:
        return this.renderSymbol(e);
      case J.Break:
        return this.renderBreak(e);
      case J.Footer:
        return this.renderContainer(e, "footer");
      case J.Header:
        return this.renderContainer(e, "header");
      case J.Footnote:
      case J.Endnote:
        return this.renderContainer(e, "li");
      case J.FootnoteReference:
        return this.renderFootnoteReference(e);
      case J.EndnoteReference:
        return this.renderEndnoteReference(e);
      case J.NoBreakHyphen:
        return this.h({ tagName: "wbr" });
      case J.VmlPicture:
        return this.renderVmlPicture(e);
      case J.VmlElement:
        return this.renderVmlElement(e);
      case J.MmlMath:
        return this.renderContainerNS(e, De.mathML, "math", { xmlns: De.mathML });
      case J.MmlMathParagraph:
        return this.renderContainer(e, "span");
      case J.MmlFraction:
        return this.renderContainerNS(e, De.mathML, "mfrac");
      case J.MmlBase:
        return this.renderContainerNS(e, De.mathML, e.parent.type == J.MmlMatrixRow ? "mtd" : "mrow");
      case J.MmlNumerator:
      case J.MmlDenominator:
      case J.MmlFunction:
      case J.MmlLimit:
      case J.MmlBox:
        return this.renderContainerNS(e, De.mathML, "mrow");
      case J.MmlGroupChar:
        return this.renderMmlGroupChar(e);
      case J.MmlLimitLower:
        return this.renderContainerNS(e, De.mathML, "munder");
      case J.MmlMatrix:
        return this.renderContainerNS(e, De.mathML, "mtable");
      case J.MmlMatrixRow:
        return this.renderContainerNS(e, De.mathML, "mtr");
      case J.MmlRadical:
        return this.renderMmlRadical(e);
      case J.MmlSuperscript:
        return this.renderContainerNS(e, De.mathML, "msup");
      case J.MmlSubscript:
        return this.renderContainerNS(e, De.mathML, "msub");
      case J.MmlDegree:
      case J.MmlSuperArgument:
      case J.MmlSubArgument:
        return this.renderContainerNS(e, De.mathML, "mn");
      case J.MmlFunctionName:
        return this.renderContainerNS(e, De.mathML, "ms");
      case J.MmlDelimiter:
        return this.renderMmlDelimiter(e);
      case J.MmlRun:
        return this.renderMmlRun(e);
      case J.MmlNary:
        return this.renderMmlNary(e);
      case J.MmlPreSubSuper:
        return this.renderMmlPreSubSuper(e);
      case J.MmlBar:
        return this.renderMmlBar(e);
      case J.MmlEquationArray:
        return this.renderMllList(e);
      case J.Inserted:
        return this.renderInserted(e);
      case J.Deleted:
        return this.renderDeleted(e);
      case J.CommentRangeStart:
        return this.renderCommentRangeStart(e);
      case J.CommentRangeEnd:
        return this.renderCommentRangeEnd(e);
      case J.CommentReference:
        return this.renderCommentReference(e);
      case J.AltChunk:
        return this.renderAltChunk(e);
    }
    return null;
  }
  renderElements(e, t) {
    if (e == null)
      return null;
    var n = e.flatMap((s) => this.renderElement(s)).filter((s) => s != null);
    return t && n.forEach((s) => t.appendChild(fi(s) ? document.createTextNode(s) : s)), n;
  }
  renderContainer(e, t, n) {
    return this.h({ tagName: t, children: this.renderElements(e.children), ...n });
  }
  renderContainerNS(e, t, n, s) {
    return this.h({ ns: t, tagName: n, children: this.renderElements(e.children), ...s });
  }
  renderParagraph(e) {
    var t = this.toHTML(e, De.html, "p");
    const n = this.findStyle(e.styleName);
    e.tabs ?? (e.tabs = n?.paragraphProps?.tabs);
    const s = e.numbering ?? n?.paragraphProps?.numbering;
    return s && t.classList.add(this.numberingClass(s.id, s.level)), t;
  }
  renderHyperlink(e) {
    const t = this.toH(e, De.html, "a");
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
    var t = this.toHTML(e, De.html, "div");
    return t.style.display = "inline-block", t.style.position = "relative", t.style.textIndent = "0px", t;
  }
  renderImage(e) {
    let t = this.toHTML(e, De.html, "img", []), n = e.cssStyle?.transform;
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
      var n = Oh(e, J.Paragraph)?.tabs;
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
    const n = this.toHTML(e, De.html, "span", t);
    return e.id && (n.id = e.id), n;
  }
  renderTable(e) {
    this.tableCellPositions.push(this.currentCellPosition), this.tableVerticalMerges.push(this.currentVerticalMerge), this.currentVerticalMerge = {}, this.currentCellPosition = { col: 0, row: 0 };
    const t = [];
    return e.columns && t.push(this.renderTableColumns(e.columns)), t.push(...this.renderElements(e.children)), this.currentVerticalMerge = this.tableVerticalMerges.pop(), this.currentCellPosition = this.tableCellPositions.pop(), this.toHTML(e, De.html, "table", t);
  }
  renderTableColumns(e) {
    const t = e.map((n) => this.h({ tagName: "col", style: { width: n.width } }));
    return this.h({ tagName: "colgroup", children: t });
  }
  renderTableRow(e) {
    this.currentCellPosition.col = 0;
    const t = [];
    return e.gridBefore && t.push(this.renderTableCellPlaceholder(e.gridBefore)), t.push(...this.renderElements(e.children)), e.gridAfter && t.push(this.renderTableCellPlaceholder(e.gridAfter)), this.currentCellPosition.row++, this.toHTML(e, De.html, "tr", t);
  }
  renderTableCellPlaceholder(e) {
    return this.h({ tagName: "td", colSpan: e, style: { border: "none" } });
  }
  renderTableCell(e) {
    let t = this.toHTML(e, De.html, "td");
    const n = this.currentCellPosition.col;
    return e.verticalMerge ? e.verticalMerge == "restart" ? (this.currentVerticalMerge[n] = t, t.rowSpan = 1) : this.currentVerticalMerge[n] && (this.currentVerticalMerge[n].rowSpan += 1, t.style.display = "none") : this.currentVerticalMerge[n] = null, e.span && (t.colSpan = e.span), this.currentCellPosition.col += t.colSpan, t;
  }
  renderVmlPicture(e) {
    return this.renderContainer(e, "div");
  }
  renderVmlElement(e) {
    var t = this.h({ ns: De.svg, tagName: "svg", style: e.cssStyleText });
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
      n.type == J.VmlElement ? t.appendChild(this.renderVmlChildElement(n)) : t.appendChild(...Qr(this.renderElement(n)));
    return t;
  }
  renderMmlRadical(e) {
    const t = e.children.find((s) => s.type == J.MmlBase);
    if (e.props?.hideDegree)
      return this.createMathMLElement("msqrt", null, this.renderElements([t]));
    const n = e.children.find((s) => s.type == J.MmlDegree);
    return this.createMathMLElement("mroot", null, this.renderElements([t, n]));
  }
  renderMmlDelimiter(e) {
    const t = [];
    return t.push(this.createMathMLElement("mo", null, [e.props.beginChar ?? "("])), t.push(...this.renderElements(e.children)), t.push(this.createMathMLElement("mo", null, [e.props.endChar ?? ")"])), this.createMathMLElement("mrow", null, t);
  }
  renderMmlNary(e) {
    const t = [], n = Qt(e.children, (d) => d.type), s = n[J.MmlSuperArgument], i = n[J.MmlSubArgument], a = s ? this.createMathMLElement("mo", null, Qr(this.renderElement(s))) : null, o = i ? this.createMathMLElement("mo", null, Qr(this.renderElement(i))) : null, l = this.createMathMLElement("mo", null, [e.props?.char ?? "∫"]);
    return a || o ? t.push(this.createMathMLElement("munderover", null, [l, o, a])) : a ? t.push(this.createMathMLElement("mover", null, [l, a])) : o ? t.push(this.createMathMLElement("munder", null, [l, o])) : t.push(l), t.push(...this.renderElements(n[J.MmlBase].children)), this.createMathMLElement("mrow", null, t);
  }
  renderMmlPreSubSuper(e) {
    const t = [], n = Qt(e.children, (d) => d.type), s = n[J.MmlSuperArgument], i = n[J.MmlSubArgument], a = s ? this.createMathMLElement("mo", null, Qr(this.renderElement(s))) : null, o = i ? this.createMathMLElement("mo", null, Qr(this.renderElement(i))) : null, l = this.createMathMLElement("mo", null);
    return t.push(this.createMathMLElement("msubsup", null, [l, o, a])), t.push(...this.renderElements(n[J.MmlBase].children)), this.createMathMLElement("mrow", null, t);
  }
  renderMmlGroupChar(e) {
    const t = e.props.verticalJustification === "bot" ? "mover" : "munder", n = this.renderContainerNS(e, De.mathML, t);
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
    return this.renderContainerNS(e, De.mathML, "mrow", { style: t });
  }
  renderMmlRun(e) {
    return this.toHTML(e, De.mathML, "ms");
  }
  renderMllList(e) {
    const t = this.renderElements(e.children).map((n) => this.createMathMLElement("mtr", null, [
      this.createMathMLElement("mtd", null, [n])
    ]));
    return this.toHTML(e, De.mathML, "mtable", t);
  }
  toH(e, t, n, s = null) {
    const { $lang: i, ...a } = e.cssStyle ?? {}, o = Lh(e.className, e.styleName && this.processStyleName(e.styleName));
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
      const e = Th();
      for (let t of this.currentTabs)
        Qh(t.span, t.stops, this.defaultTabSize, e);
    }, 500);
  }
  createElementNS(e, t, n, s) {
    return this.h({ ns: e, tagName: t, children: s, ...n });
  }
  createElement(e, t, n) {
    return this.createElementNS(De.html, e, t, n);
  }
  createMathMLElement(e, t, n) {
    return this.createElementNS(De.mathML, e, t, n);
  }
  createSvgElement(e, t, n) {
    return this.createElementNS(De.svg, e, t, n);
  }
  later(e) {
    this.postRenderTasks.push(e);
  }
}
function Oh(r, e) {
  for (var t = r.parent; t != null && t.type != e; )
    t = t.parent;
  return t;
}
const pl = {
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
  h: Gn
};
function $h(r, e) {
  const t = { ...pl, ...e };
  return xi.load(r, new zh(t), t);
}
async function Hh(r, e) {
  const t = { ...pl, ...e };
  return await new Uh().render(r, t);
}
async function jh(r, e, t, n) {
  const s = await $h(r, n), i = await Hh(s, n);
  t ?? (t = e), t.innerHTML = "", e.innerHTML = "";
  for (let a of i)
    (a.nodeName === "STYLE" ? t : e).appendChild(a);
  return s;
}
const qh = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; font-src data: blob:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><style>body{margin:0;background:#f5f6f4;color:#25332e}.docx-wrapper{padding:16px!important}a{pointer-events:none}img{max-width:100%}@media(max-width:600px){.docx-wrapper{padding:8px!important}section.docx{padding:24px!important;width:auto!important;min-width:0!important}table{max-width:100%}}</style></head><body><main id="document"></main></body></html>`;
function Gh({ blob: r }) {
  const e = Be(null), [t, n] = L(!1), [s, i] = L(!0), [a, o] = L("");
  return ve(() => {
    if (!t) return;
    const l = new AbortController();
    return Si(r, "docx", l.signal).then(async () => {
      const d = e.current?.contentDocument?.getElementById("document");
      l.signal.aborted || !d || (await jh(r, d, d, { useBase64URL: !0, renderAltChunks: !1, renderComments: !1, breakPages: !0, ignoreLastRenderedPageBreak: !1 }), !l.signal.aborted && (d.querySelectorAll("a").forEach((f) => {
        f.removeAttribute("href"), f.removeAttribute("target");
      }), i(!1)));
    }).catch((d) => {
      l.signal.aborted || (o(d instanceof Error ? d.message : "Word 文件无法预览。"), i(!1));
    }), () => {
      l.abort(), e.current?.contentDocument?.getElementById("document")?.replaceChildren();
    };
  }, [r, t]), /* @__PURE__ */ _("div", { className: "knowledge-file-viewer", children: [
    /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "Word 只读预览 · 复杂排版可能与桌面 Word 有差异。" }),
    s && /* @__PURE__ */ h("p", { role: "status", children: "正在排版文档…" }),
    a && /* @__PURE__ */ h("p", { role: "alert", className: "knowledge-error", children: a }),
    /* @__PURE__ */ h("iframe", { className: "knowledge-word-frame", title: "Word 原文件预览", ref: e, sandbox: "allow-same-origin", srcDoc: qh, onLoad: () => n(!0), "aria-busy": s })
  ] });
}
function Jh({ source: r, formatError: e = tr, onClose: t }) {
  const [n, s] = L(null), [i, a] = L(null), [o, l] = L(""), [d, f] = L(0), [g, m] = L(!1), u = os(r.file.filename), y = u === "pdf", w = ["mp3", "wav", "ogg", "flac", "m4a", "aac"].includes(u), A = ["mp4", "mov", "webm", "avi"].includes(u), k = Yo(r.file.filename);
  ve(() => {
    const E = new AbortController();
    s(null), a(null), l("");
    const S = AbortSignal.any([E.signal, AbortSignal.timeout(3e4)]);
    return k ? y || w || A ? () => E.abort() : ((ou(u) ? du(r, S).then(a) : el(r, S, ["docx", "pptx", "xlsx", "xlsm"].includes(u) ? tu : void 0).then(s)).catch((x) => {
      E.signal.aborted || l(e(x));
    }), () => E.abort()) : () => E.abort();
  }, [r.identity, u, e, y, w, A, d, k]);
  async function v() {
    if (!g) {
      m(!0), l("");
      try {
        await tl(r, AbortSignal.timeout(12e4));
      } catch (E) {
        l(e(E));
      } finally {
        m(!1);
      }
    }
  }
  const N = ["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(u);
  return tn(/* @__PURE__ */ h("div", { className: "knowledge-modal-backdrop", role: "presentation", onMouseDown: (E) => {
    E.target === E.currentTarget && t();
  }, children: /* @__PURE__ */ _("section", { className: "knowledge-preview-dialog", role: "dialog", "aria-modal": "true", "aria-label": n?.filename || i?.filename || r.file.filename, children: [
    /* @__PURE__ */ _("header", { children: [
      /* @__PURE__ */ _("div", { children: [
        /* @__PURE__ */ h("h2", { children: n?.filename || i?.filename || r.file.filename }),
        /* @__PURE__ */ _("p", { children: [
          /* @__PURE__ */ h("span", { children: "原文件在线预览" }),
          " · 每次打开和下载都由宿主重新核对权限"
        ] })
      ] }),
      /* @__PURE__ */ h(le, { "aria-label": "关闭", onClick: t, children: /* @__PURE__ */ h(rn, { size: 17 }) })
    ] }),
    /* @__PURE__ */ _("div", { className: "knowledge-file-toolbar", children: [
      /* @__PURE__ */ _(le, { disabled: g, onClick: () => {
        v();
      }, children: [
        /* @__PURE__ */ h($o, { size: 15 }),
        g ? "正在下载…" : "下载原文件"
      ] }),
      /* @__PURE__ */ _(le, { disabled: !k, onClick: () => f((E) => E + 1), children: [
        /* @__PURE__ */ h(jt, { size: 15 }),
        "重新打开"
      ] })
    ] }),
    k ? o ? /* @__PURE__ */ h("p", { role: "alert", className: "knowledge-error", children: o }) : y ? /* @__PURE__ */ h(fu, { source: r, location: r.file.location }) : w ? /* @__PURE__ */ h(qa, { source: r, kind: "audio" }) : A ? /* @__PURE__ */ h(qa, { source: r, kind: "video" }) : !n && !i ? /* @__PURE__ */ h("p", { children: "正在读取原文件…" }) : i ? /* @__PURE__ */ h(bu, { file: i }) : n?.format === "docx" ? /* @__PURE__ */ h(Gh, { blob: n.blob }) : n?.format === "pptx" ? /* @__PURE__ */ h(pu, { blob: n.blob, location: r.file.location }) : n?.format === "xlsx" || n?.format === "xlsm" ? /* @__PURE__ */ h(gu, { blob: n.blob, location: r.file.location }) : n && N ? /* @__PURE__ */ h(hu, { blob: n.blob, filename: n.filename }) : /* @__PURE__ */ h("p", { children: "此格式暂不支持在线预览，请下载查看。" }) : /* @__PURE__ */ h("div", { className: "knowledge-preview-unsupported", children: /* @__PURE__ */ h("p", { children: "旧版 Word（.doc）和 Excel（.xls）不能在浏览器中可靠解析。请下载后查看，或另存为 .docx / .xlsx 再上传。" }) })
  ] }) }), window.document.body);
}
function ml(r) {
  return `domainry-knowledge-transfer:${r.scope?.() || "default"}`;
}
function gi(r) {
  if (!r || r.length > 4096) return null;
  try {
    const e = JSON.parse(r), t = e.source;
    return !t || !t.id || !t.library_id || !e.targetLibraryID || t.library_id === e.targetLibraryID || !/^[a-zA-Z0-9_.:-]{1,96}$/.test(e.clientID) || !["copy", "move"].includes(e.mode) || !/^[a-f0-9]{64}$/.test(t.sha256) || !t.filename || t.filename.length > 255 || !Number.isSafeInteger(t.bytes) || t.bytes < 1 || !Number.isSafeInteger(t.revision) || t.revision < 1 ? null : e;
  } catch {
    return null;
  }
}
function bl(r) {
  try {
    return gi(localStorage.getItem(ml(r)));
  } catch {
    return null;
  }
}
function Vh(r, e, t) {
  return r.id !== e && Wo(r) && !r.archived && (r.documents_configured === !0 || t === r.id);
}
function Wh({ client: r, source: e, canMove: t, formatError: n = tr, onClose: s, onOpenTarget: i }) {
  const [a, o] = L(() => bl(r)), l = a?.source || e, d = ml(r), [f, g] = L(a?.mode || "copy"), [m, u] = L({ items: [], complete: !0 }), [y, w] = L([""]), [A, k] = L(null), [v, N] = L(null), [E, S] = L(!0), [z, x] = L(!1), [U, Q] = L(""), O = Be(!1), K = Be(null), B = y.at(-1) || "";
  ve(() => () => K.current?.abort(), []), ve(() => {
    const ne = new AbortController();
    S(!0);
    const T = AbortSignal.any([ne.signal, AbortSignal.timeout(15e3)]);
    return Promise.all([r.listLibraries(B, 20, T), a ? r.getLibrary(a.targetLibraryID, T) : Promise.resolve(null)]).then(([ae, Y]) => {
      ne.signal.aborted || (u(ae), Y && k(Y));
    }).catch((ae) => {
      ne.signal.aborted || (k(null), u({ items: [], complete: !0 }), Q(n(ae)));
    }).finally(() => {
      ne.signal.aborted || S(!1);
    }), () => ne.abort();
  }, [r, B, n, a]);
  const R = (ne) => Vh(ne, l.library_id, a?.targetLibraryID);
  function b(ne) {
    gi(localStorage.getItem(d))?.clientID === ne.clientID && localStorage.removeItem(d), o(null);
  }
  async function G() {
    if (O.current || !A || !R(A)) return;
    O.current = !0, x(!0), Q("");
    const ne = new AbortController();
    K.current = ne;
    const T = AbortSignal.any([ne.signal, AbortSignal.timeout(6e4)]);
    try {
      const ae = a || { source: l, targetLibraryID: A.id, mode: f, clientID: crypto.randomUUID() }, Y = () => {
        const H = gi(localStorage.getItem(d));
        if (H && H.clientID !== ae.clientID) throw Error("另一项文档复制或移动仍待确认，请先处理。 ");
        localStorage.setItem(d, JSON.stringify(ae));
      };
      navigator.locks ? await navigator.locks.request(`domainry-knowledge:transfer:${r.scope?.() || "default"}`, Y) : Y(), T.throwIfAborted(), o(ae);
      const de = await r.transferDocument({ ...ae, targetLibraryID: ae.targetLibraryID, signal: T });
      if (de.library_id !== ae.targetLibraryID || de.filename !== l.filename || de.bytes !== l.bytes || de.sha256 !== l.sha256) throw Error("目标文档与本次操作不一致，请刷新核对。");
      b(ae), N(de);
    } catch (ae) {
      ne.signal.aborted || Q(n(ae));
    } finally {
      O.current = !1, ne.signal.aborted || x(!1);
    }
  }
  return tn(/* @__PURE__ */ h("div", { className: "knowledge-modal-backdrop", role: "presentation", onMouseDown: (ne) => {
    ne.target === ne.currentTarget && !z && s();
  }, children: /* @__PURE__ */ _("section", { className: "knowledge-transfer-dialog", role: "dialog", "aria-modal": "true", "aria-label": "复制或移动文档", children: [
    /* @__PURE__ */ _("header", { children: [
      /* @__PURE__ */ _("div", { children: [
        /* @__PURE__ */ h("h2", { children: "复制或移动文档" }),
        /* @__PURE__ */ h("p", { children: "选择目标资料库并确认可见范围；目标保存独立原文件，索引由后台处理。" })
      ] }),
      /* @__PURE__ */ h(le, { "aria-label": "关闭", disabled: z, onClick: s, children: /* @__PURE__ */ h(rn, { size: 17 }) })
    ] }),
    /* @__PURE__ */ h("p", { children: /* @__PURE__ */ h("strong", { children: l.filename }) }),
    U && /* @__PURE__ */ h("p", { role: "alert", className: "knowledge-error", children: U }),
    v ? /* @__PURE__ */ _(at, { children: [
      /* @__PURE__ */ _("p", { role: "status", children: [
        f === "move" ? "目标原文件已保存，原位置已停止访问。" : "独立副本已保存，原位置保留。",
        "当前目标状态：",
        ui(v),
        "。"
      ] }),
      /* @__PURE__ */ h(le, { onClick: () => i(v.library_id), children: "查看目标资料库" })
    ] }) : /* @__PURE__ */ _(at, { children: [
      a ? /* @__PURE__ */ _("p", { className: "knowledge-subtle", children: [
        "上次",
        a.mode === "move" ? "移动" : "复制",
        "结果待确认；继续会使用原请求编号，不会重复创建目标文档。"
      ] }) : /* @__PURE__ */ _(at, { children: [
        /* @__PURE__ */ _("label", { children: [
          "操作方式 ",
          /* @__PURE__ */ _("select", { disabled: z, value: f, onChange: (ne) => g(ne.target.value), children: [
            /* @__PURE__ */ h("option", { value: "copy", children: "复制，保留原文档" }),
            /* @__PURE__ */ h("option", { value: "move", disabled: !t, children: "移动，原位置停止访问" })
          ] })
        ] }),
        !t && /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "移动需要原资料库的编辑或管理权限。" }),
        E ? /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "正在读取目标知识库…" }) : /* @__PURE__ */ h("div", { className: "knowledge-transfer-list", children: m.items.map((ne) => /* @__PURE__ */ _("button", { "aria-current": A?.id === ne.id ? "true" : void 0, disabled: z || !R(ne), onClick: () => k(ne), children: [
          /* @__PURE__ */ h("strong", { children: ne.name }),
          /* @__PURE__ */ _("small", { children: [
            ne.kind === "personal" ? "个人知识库 · 仅自己可见" : "团队知识库 · 阅读成员可见",
            R(ne) ? "" : " · 不可选择"
          ] })
        ] }, ne.id)) }),
        (y.length > 1 || !m.complete) && /* @__PURE__ */ _("div", { className: "knowledge-pagination", children: [
          /* @__PURE__ */ h(le, { disabled: z || E || y.length === 1, onClick: () => w((ne) => ne.slice(0, -1)), children: "上一页" }),
          /* @__PURE__ */ h(le, { disabled: z || E || !m.next_after, onClick: () => w((ne) => [...ne, m.next_after]), children: "下一页" })
        ] })
      ] }),
      A && /* @__PURE__ */ _("div", { className: "knowledge-confirm", children: [
        /* @__PURE__ */ _("p", { children: [
          f === "move" ? "移动" : "复制",
          "“",
          l.filename,
          "”到“",
          A.name,
          "”？",
          A.kind === "shared" ? "目标资料库的所有阅读成员都能访问该文件。" : "目标文件仅自己可见。"
        ] }),
        /* @__PURE__ */ h(le, { disabled: z || E || !R(A), onClick: () => {
          G();
        }, children: z ? "正在处理…" : a ? "继续核对上次操作" : f === "move" ? "确认移动文档" : "确认复制文档" })
      ] }),
      a && /* @__PURE__ */ h(le, { disabled: z, onClick: () => {
        b(a), s();
      }, children: "结束重试，不撤销已受理操作" })
    ] })
  ] }) }), window.document.body);
}
function Xh(r) {
  if (!r || r.length > 2048) return null;
  try {
    const e = JSON.parse(r);
    return e && /^[a-zA-Z0-9_.:-]{1,96}$/.test(e.clientID) && e.filename && Number.isSafeInteger(e.bytes) && e.bytes > 0 && /^[a-f0-9]{64}$/.test(e.sha256) ? e : null;
  } catch {
    return null;
  }
}
function Ur(r) {
  return r >= 1024 ** 3 ? `${(r / 1024 ** 3).toFixed(r % 1024 ** 3 ? 1 : 0)} GiB` : r >= 1024 ** 2 ? `${(r / 1024 ** 2).toFixed(1)} MiB` : `${(r / 1024).toFixed(1)} KiB`;
}
function Zh({ document: r }) {
  const e = Zd(r), t = r.processing_stage === "failed";
  return /* @__PURE__ */ h("ol", { className: "knowledge-pipeline", "aria-label": "文档处理进度", children: Xo.map((n, s) => /* @__PURE__ */ _("li", { "data-state": s < e ? "done" : s === e ? t ? "failed" : "active" : "pending", children: [
    /* @__PURE__ */ h("span", { children: s < e ? "✓" : s + 1 }),
    /* @__PURE__ */ h("small", { children: n.label })
  ] }, n.key)) });
}
function Kh({ client: r, initialLibrary: e, formatError: t = tr, onBusyChange: n, onOpenLibrary: s, embedded: i = !1, hideList: a = !1, showUploader: o = !0, selectedDocumentID: l, onSelectedDocumentChange: d, onDocumentsChange: f }) {
  const g = e.id, m = `domainry-knowledge-upload:${r.scope?.() || "default"}:${g}`, [u, y] = L(e), [w, A] = L({ items: [], complete: !0 }), [k, v] = L([""]), [N, E] = L(0), [S, z] = L(null), [x, U] = L(!1), [Q, O] = L(!1), [K, B] = L(null), [R, b] = L(null), [G, ne] = L(() => Xh(localStorage.getItem(m))), [T, ae] = L(null), [Y, de] = L(null), [H, $] = L(!0), [oe, ce] = L(!1), [ie, Ne] = L(""), [xe, j] = L(""), ue = Be(null), ye = k.at(-1) || "", pe = sd((V) => {
    ce(V), n?.(V);
  }, [n]);
  ve(() => y(e), [e]), ve(() => {
    const V = new AbortController();
    return $(!0), Ne(""), Promise.all([
      r.getLibrary(g, V.signal),
      r.listDocuments(g, ye, 50, V.signal)
    ]).then(([se, re]) => {
      V.signal.aborted || (y(se), A(re), f?.(re.items), z((fe) => {
        const Ee = l === void 0 ? fe?.id : l;
        return Ee && re.items.find((we) => we.id === Ee) || null;
      }));
    }).catch((se) => {
      V.signal.aborted || (A({ items: [], complete: !0 }), z(null), Ne(t(se)));
    }).finally(() => {
      V.signal.aborted || $(!1);
    }), () => V.abort();
  }, [r, ye, t, g, f, N, l]), ve(() => {
    const V = window.setInterval(() => {
      !oe && document.visibilityState !== "hidden" && E((se) => se + 1);
    }, 5e3);
    return () => window.clearInterval(V);
  }, [oe]);
  const ge = Wo(u), ke = ge && !!u.documents_configured && !u.archived, c = Gd(u), W = Vo(u), q = Jo(u), C = R ? Vd(u, R.name) : W;
  async function I(V) {
    if (oe) return;
    pe(!0), Ne(""), j("");
    const se = new AbortController();
    try {
      await V(AbortSignal.any([se.signal, AbortSignal.timeout(7200 * 1e3)]));
    } catch (re) {
      re instanceof DOMException && re.name === "AbortError" || Ne(t(re));
    } finally {
      ae(null), de(null), pe(!1), E((re) => re + 1);
    }
  }
  async function P(V) {
    if (!R || !ke) return;
    if (!R.size || R.size > c) throw Error(`单文件不能超过 ${Ur(c)}。`);
    if (!qd(u, R.name)) throw Error("当前文件格式不支持入库。");
    ae(0);
    const se = await Zo(R, V, ae);
    if (V.throwIfAborted(), G && (G.filename !== R.name || G.bytes !== R.size || G.sha256 !== se)) throw Error(`请重新选择上次的“${G.filename}”继续上传，或先结束上次重试。`);
    const re = G || { clientID: crypto.randomUUID(), filename: R.name, bytes: R.size, sha256: se };
    localStorage.setItem(m, JSON.stringify(re)), ne(re), de(0);
    const fe = await r.uploadDocument({ libraryID: g, file: R, clientID: re.clientID, sha256: se, signal: V, onProgress: (Ee, we) => de(Math.min(1, Ee / we)) });
    localStorage.removeItem(m), ne(null), b(null), ue.current && (ue.current.value = ""), z(fe), d?.(fe.id), v([""]), j(fe.state === "ready" ? "文件已入库，可以检索。" : "原文件已保存，后台正在处理。可以关闭页面后再回来查看。 ");
  }
  async function ee(V) {
    if (!S) return;
    const se = await r.deleteDocument(g, S.id, S.revision, V);
    O(!1), U(!1), se.state === "deleted" ? (z(null), d?.("")) : z(se), j(se.state === "deleted" ? "文档已删除。" : "文档已停止访问，后台正在清理原文件与索引。 ");
  }
  async function te(V) {
    if (!S || !ge || !$a(S)) return;
    const se = await r.retryDocument(g, S.id, S.revision, V);
    z(se), j("已立即重新调度当前处理阶段；不会重复提交状态不确定的远端写入。");
  }
  async function F(V) {
    if (!S || !ge || !Ha(S)) return;
    const se = await r.reindexDocument(g, S.id, S.revision, V);
    z(se), j("新一代索引已开始建立；当前索引在切换成功前仍可检索。");
  }
  return /* @__PURE__ */ _("section", { className: `knowledge-documents${i ? " is-embedded" : ""}`, "aria-label": "资料文件", children: [
    !i && /* @__PURE__ */ _("div", { className: "knowledge-section-heading", children: [
      /* @__PURE__ */ h("h3", { children: "资料文件" }),
      /* @__PURE__ */ _(le, { disabled: H || oe, onClick: () => E((V) => V + 1), children: [
        /* @__PURE__ */ h(jt, { size: 14 }),
        "刷新"
      ] })
    ] }),
    o && ke && /* @__PURE__ */ _("div", { className: "knowledge-upload", children: [
      /* @__PURE__ */ _("label", { className: "knowledge-file-picker", children: [
        /* @__PURE__ */ h($n, { size: 18 }),
        /* @__PURE__ */ h("span", { children: R ? R.name : "选择本地文件" }),
        /* @__PURE__ */ h("small", { children: R ? Ur(R.size) : "支持安全扫描后的文档、图片与音视频" }),
        /* @__PURE__ */ h("input", { ref: ue, type: "file", accept: q, disabled: oe, onChange: (V) => {
          b(V.target.files?.[0] || null), Ne("");
        } })
      ] }),
      /* @__PURE__ */ _("p", { children: [
        "单个文件最大 ",
        Ur(c),
        W < c ? `；超过 ${Ur(W)} 时仍可保存和预览，但暂不参与全文检索。` : "。"
      ] }),
      R && R.size > C && /* @__PURE__ */ h("p", { className: "knowledge-notice", children: "此文件可以保存、预览和下载，但超过当前可检索处理上限，暂时不会进入全文检索。" }),
      T !== null && /* @__PURE__ */ _("p", { role: "status", children: [
        "正在分段校验文件：",
        Math.round(T * 100),
        "%"
      ] }),
      Y !== null && /* @__PURE__ */ _("p", { role: "status", children: [
        "正在分片上传：",
        Math.round(Y * 100),
        "% · 每片最多 8 MiB，刷新后重新选择同一文件可继续。"
      ] }),
      /* @__PURE__ */ _(le, { className: "primary", disabled: oe || !R, onClick: () => {
        I(P);
      }, children: [
        /* @__PURE__ */ h($n, { size: 15 }),
        T !== null ? "正在校验…" : Y !== null ? "正在上传…" : G ? "继续上次上传" : "上传文件"
      ] })
    ] }),
    G && /* @__PURE__ */ _("div", { className: "knowledge-confirm", children: [
      /* @__PURE__ */ _("p", { children: [
        "上次上传待确认：",
        G.filename
      ] }),
      /* @__PURE__ */ h(le, { disabled: oe, onClick: () => {
        localStorage.removeItem(m), ne(null);
      }, children: "结束这次重试" })
    ] }),
    ie && /* @__PURE__ */ h("p", { role: "alert", className: "knowledge-error", children: ie }),
    xe && /* @__PURE__ */ h("p", { role: "status", className: "knowledge-notice", children: xe }),
    !a && (H ? /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "正在读取资料文件…" }) : w.items.length === 0 ? /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "还没有资料文件。" }) : /* @__PURE__ */ h("div", { className: "knowledge-document-list", children: w.items.map((V) => /* @__PURE__ */ _("button", { "aria-current": S?.id === V.id ? "true" : void 0, disabled: oe, onClick: () => {
      z(V), d?.(V.id), O(!1), Ne("");
    }, children: [
      /* @__PURE__ */ h(Lt, { size: 18 }),
      /* @__PURE__ */ _("span", { children: [
        /* @__PURE__ */ h("strong", { children: V.filename }),
        /* @__PURE__ */ _("small", { children: [
          ui(V),
          " · ",
          Ur(V.bytes)
        ] })
      ] })
    ] }, V.id)) })),
    !a && (k.length > 1 || !w.complete) && /* @__PURE__ */ _("nav", { className: "knowledge-pagination", children: [
      /* @__PURE__ */ h(le, { disabled: oe || H || k.length === 1, onClick: () => v((V) => V.slice(0, -1)), children: "上一页" }),
      /* @__PURE__ */ h(le, { disabled: oe || H || !w.next_after, onClick: () => v((V) => [...V, w.next_after]), children: "下一页" })
    ] }),
    S && /* @__PURE__ */ _("section", { className: "knowledge-document-detail", children: [
      /* @__PURE__ */ h("h3", { children: S.filename }),
      /* @__PURE__ */ _("p", { children: [
        ui(S),
        " · 内容版本 v",
        S.content_version,
        " · 索引代次 g",
        S.index_generation,
        " · ",
        u.kind === "shared" ? "继承资料库成员权限" : "仅自己可见"
      ] }),
      /* @__PURE__ */ h(Zh, { document: S }),
      /* @__PURE__ */ h("p", { children: Wd(S) }),
      S.security_scanner && /* @__PURE__ */ _("p", { children: [
        "安全策略：",
        S.security_scanner,
        " · 报告 ",
        S.security_report_sha256?.slice(0, 12)
      ] }),
      S.error_code && /* @__PURE__ */ _("p", { className: "knowledge-error", children: [
        "错误代码：",
        S.error_code
      ] }),
      /* @__PURE__ */ _("div", { className: "knowledge-actions", children: [
        Yo(S.filename) && /* @__PURE__ */ _(le, { disabled: oe || u.archived || !Js(S), onClick: () => U(!0), children: [
          /* @__PURE__ */ h(ad, { size: 15 }),
          "在线预览"
        ] }),
        /* @__PURE__ */ _(le, { disabled: oe || u.archived || !Js(S), onClick: () => {
          I((V) => uu(r, S, V));
        }, children: [
          /* @__PURE__ */ h($o, { size: 15 }),
          "下载原文件"
        ] }),
        /* @__PURE__ */ h(le, { disabled: oe || u.archived || !Js(S), onClick: () => {
          bl(r) && j("检测到上次待确认的复制或移动，将继续核对原操作。"), B({ source: S, canMove: ge });
        }, children: "复制／移动" }),
        ge && $a(S) && /* @__PURE__ */ _(le, { disabled: oe || u.archived, onClick: () => {
          I(te);
        }, children: [
          /* @__PURE__ */ h(od, { size: 15 }),
          "立即重试"
        ] }),
        ge && Ha(S) && /* @__PURE__ */ _(le, { disabled: oe || u.archived, onClick: () => {
          I(F);
        }, children: [
          /* @__PURE__ */ h(jt, { size: 15 }),
          "重新索引"
        ] }),
        ge && /* @__PURE__ */ _(le, { className: "danger", disabled: oe || S.reindexing || S.state === "deleting" || S.state === "deleted", onClick: () => O(!0), children: [
          /* @__PURE__ */ h(ld, { size: 15 }),
          "删除"
        ] })
      ] }),
      Q && /* @__PURE__ */ _("div", { className: "knowledge-confirm", children: [
        /* @__PURE__ */ _("p", { children: [
          "确认删除“",
          S.filename,
          "”？它会立即停止检索和下载，随后清理原文件和索引。"
        ] }),
        /* @__PURE__ */ _("div", { className: "knowledge-actions", children: [
          /* @__PURE__ */ h(le, { className: "danger", disabled: oe, onClick: () => {
            I(ee);
          }, children: "确认删除" }),
          /* @__PURE__ */ h(le, { disabled: oe, onClick: () => O(!1), children: "保留文档" })
        ] })
      ] })
    ] }),
    x && S && /* @__PURE__ */ h(Jh, { source: rl(r, S), formatError: t, onClose: () => U(!1) }),
    K && /* @__PURE__ */ h(Wh, { client: r, source: K.source, canMove: K.canMove, formatError: t, onClose: () => {
      B(null), E((V) => V + 1);
    }, onOpenTarget: (V) => {
      B(null), s?.(V), E((se) => se + 1);
    } })
  ] });
}
const Yh = /^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,95}$/;
function so(r) {
  if (!r || r.length > 1024) return null;
  try {
    const e = JSON.parse(r);
    return Yh.test(e?.datasourceKey || "") && Number.isSafeInteger(e?.expectedRevision) && e.expectedRevision > 0 ? e : null;
  } catch {
    return null;
  }
}
function ef({ client: r, library: e, disabled: t, formatError: n = tr, onBusyChange: s, onBound: i }) {
  const a = `domainry-knowledge-source:${r.scope?.() || "default"}:${e.id}`, [o, l] = L(() => so(localStorage.getItem(a))), [d, f] = L(null), [g, m] = L([""]), [u, y] = L(0), [w, A] = L(""), [k, v] = L(!1), [N, E] = L(!0), [S, z] = L(""), x = Be(!1), U = Be(null), Q = g.at(-1) || "";
  ve(() => {
    const R = new AbortController();
    return E(!0), f(null), r.listSources(e.id, Q, 10, R.signal).then((b) => {
      R.signal.aborted || (f(b), z(""), b.current_key && so(localStorage.getItem(a))?.datasourceKey === b.current_key && b.status === "connected" && (localStorage.removeItem(a), l(null)));
    }).catch((b) => {
      R.signal.aborted || (f(null), z(n(b)));
    }).finally(() => {
      R.signal.aborted || E(!1);
    }), () => R.abort();
  }, [r, Q, n, e.id, u, a]), ve(() => () => {
    U.current?.abort(), s?.(!1);
  }, [s]);
  const O = t || k, K = d?.items.find((R) => R.key === w && R.available);
  async function B() {
    if (x.current || t || !d?.can_bind || !o && !K) return;
    x.current = !0, v(!0), s?.(!0), z("");
    const R = new AbortController();
    U.current = R;
    try {
      const b = o || { datasourceKey: w, expectedRevision: d.revision };
      localStorage.setItem(a, JSON.stringify(b)), l(b);
      const G = await r.bindSource(e.id, b.datasourceKey, b.expectedRevision, AbortSignal.any([R.signal, AbortSignal.timeout(3e4)]));
      if (R.signal.aborted) return;
      localStorage.removeItem(a), l(null), A(""), i(G), y((ne) => ne + 1);
    } catch (b) {
      R.signal.aborted || z(n(b));
    } finally {
      x.current = !1, R.signal.aborted || (v(!1), s?.(!1));
    }
  }
  return /* @__PURE__ */ _("section", { className: "knowledge-sources", "aria-label": "外部内容连接", "data-static-ui-list": !0, children: [
    /* @__PURE__ */ _("div", { className: "knowledge-section-heading", children: [
      /* @__PURE__ */ h("h3", { children: "外部内容连接" }),
      /* @__PURE__ */ _(le, { disabled: O || N, onClick: () => y((R) => R + 1), children: [
        /* @__PURE__ */ h(jt, { size: 14 }),
        "刷新"
      ] })
    ] }),
    S && /* @__PURE__ */ h("p", { role: "alert", className: "knowledge-error", children: S }),
    N ? /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "正在读取可用知识源…" }) : d && /* @__PURE__ */ _(at, { children: [
      d.status === "connected" ? /* @__PURE__ */ _("p", { className: "knowledge-subtle", children: [
        /* @__PURE__ */ h(ci, { size: 15, className: "knowledge-inline" }),
        " 已连接外部内容，可上传资料并建立索引。"
      ] }) : d.status === "unavailable" ? /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "当前连接暂不可用；已保存原文件仍按知识库权限保留。" }) : d.status === "host_managed" ? /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "此知识库的外部内容连接由宿主管理。" }) : /* @__PURE__ */ _("p", { className: "knowledge-subtle", children: [
        "选择一个外部内容连接到“",
        e.name,
        "”。"
      ] }),
      d.status === "unbound" && /* @__PURE__ */ _(at, { children: [
        !d.can_bind && /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "当前没有连接权限，或资料库已归档。" }),
        d.items.length === 0 ? /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "暂无可选择的知识源。" }) : /* @__PURE__ */ h("div", { className: "knowledge-source-list", children: d.items.map((R) => /* @__PURE__ */ _("button", { "aria-current": w === R.key ? "true" : void 0, disabled: O || !!o || !R.available, onClick: () => A(R.key), children: [
          /* @__PURE__ */ h(xa, { size: 16 }),
          /* @__PURE__ */ _("span", { children: [
            /* @__PURE__ */ h("strong", { children: R.name }),
            /* @__PURE__ */ h("small", { children: R.available ? R.description || "可连接" : "暂不可连接" })
          ] })
        ] }, R.key)) })
      ] }),
      (g.length > 1 || !d.complete) && /* @__PURE__ */ _("nav", { className: "knowledge-pagination", children: [
        /* @__PURE__ */ h(le, { disabled: O || N || g.length === 1, onClick: () => {
          A(""), m((R) => R.slice(0, -1));
        }, children: "上一页" }),
        /* @__PURE__ */ h(le, { disabled: O || N || !d.next_after, onClick: () => {
          A(""), m((R) => [...R, d.next_after]);
        }, children: "下一页" })
      ] }),
      o && /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "上次连接结果待确认；继续时使用同一个知识源，不会重复创建绑定。" }),
      (d.status === "unbound" || o) && /* @__PURE__ */ _("div", { className: "knowledge-actions", children: [
        /* @__PURE__ */ _(le, { disabled: O || !d.can_bind || !o && !K, onClick: () => {
          B();
        }, children: [
          /* @__PURE__ */ h(xa, { size: 15 }),
          k ? "正在连接…" : o ? "继续确认连接" : "连接知识源"
        ] }),
        o && /* @__PURE__ */ h(le, { disabled: O, onClick: () => {
          localStorage.removeItem(a), l(null);
        }, children: "结束重试" })
      ] })
    ] })
  ] });
}
const At = () => /* @__PURE__ */ new Map(), pi = (r) => {
  const e = At();
  return r.forEach((t, n) => {
    e.set(n, t);
  }), e;
}, Gt = (r, e, t) => {
  let n = r.get(e);
  return n === void 0 && r.set(e, n = t()), n;
}, tf = (r, e) => {
  const t = [];
  for (const [n, s] of r)
    t.push(e(s, n));
  return t;
}, rf = (r, e) => {
  for (const [t, n] of r)
    if (e(n, t))
      return !0;
  return !1;
}, wr = () => /* @__PURE__ */ new Set(), Ks = (r) => r[r.length - 1], nf = (r, e) => {
  for (let t = 0; t < e.length; t++)
    r.push(e[t]);
}, qt = Array.from, Di = (r, e) => {
  for (let t = 0; t < r.length; t++)
    if (!e(r[t], t, r))
      return !1;
  return !0;
}, Mi = (r, e) => {
  for (let t = 0; t < r.length; t++)
    if (e(r[t], t, r))
      return !0;
  return !1;
}, sf = (r, e) => {
  const t = new Array(r);
  for (let n = 0; n < r; n++)
    t[n] = e(n, t);
  return t;
}, Ar = Array.isArray;
class wl {
  constructor() {
    this._observers = At();
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  on(e, t) {
    return Gt(
      this._observers,
      /** @type {string} */
      e,
      wr
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
    return qt((this._observers.get(e) || At()).values()).forEach((n) => n(...t));
  }
  destroy() {
    this._observers = At();
  }
}
const It = Math.floor, Tn = Math.abs, Al = (r, e) => r < e ? r : e, nr = (r, e) => r > e ? r : e, yl = (r) => r !== 0 ? r < 0 : 1 / r < 0, io = 1, ao = 2, Ys = 4, ei = 8, jr = 32, Mt = 64, ut = 128, cs = 31, mi = 63, Zt = 127, af = 2147483647, Jn = Number.MAX_SAFE_INTEGER, oo = Number.MIN_SAFE_INTEGER, of = Number.isInteger || ((r) => typeof r == "number" && isFinite(r) && It(r) === r), lf = String.fromCharCode, cf = (r) => r.toLowerCase(), df = /^\s*/g, uf = (r) => r.replace(df, ""), hf = /([A-Z])/g, lo = (r, e) => uf(r.replace(hf, (t) => `${e}${cf(t)}`)), ff = (r) => {
  const e = unescape(encodeURIComponent(r)), t = e.length, n = new Uint8Array(t);
  for (let s = 0; s < t; s++)
    n[s] = /** @type {number} */
    e.codePointAt(s);
  return n;
}, qr = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), gf = (r) => qr.encode(r), pf = qr ? gf : ff;
let Hr = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
Hr && Hr.decode(new Uint8Array()).length === 1 && (Hr = null);
const mf = (r, e) => sf(e, () => r).join("");
class nn {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
}
const ds = () => new nn(), bf = (r) => {
  let e = r.cpos;
  for (let t = 0; t < r.bufs.length; t++)
    e += r.bufs[t].length;
  return e;
}, vt = (r) => {
  const e = new Uint8Array(bf(r));
  let t = 0;
  for (let n = 0; n < r.bufs.length; n++) {
    const s = r.bufs[n];
    e.set(s, t), t += s.length;
  }
  return e.set(new Uint8Array(r.cbuf.buffer, 0, r.cpos), t), e;
}, wf = (r, e) => {
  const t = r.cbuf.length;
  t - r.cpos < e && (r.bufs.push(new Uint8Array(r.cbuf.buffer, 0, r.cpos)), r.cbuf = new Uint8Array(nr(t, e) * 2), r.cpos = 0);
}, Ge = (r, e) => {
  const t = r.cbuf.length;
  r.cpos === t && (r.bufs.push(r.cbuf), r.cbuf = new Uint8Array(t * 2), r.cpos = 0), r.cbuf[r.cpos++] = e;
}, bi = Ge, Se = (r, e) => {
  for (; e > Zt; )
    Ge(r, ut | Zt & e), e = It(e / 128);
  Ge(r, Zt & e);
}, Ri = (r, e) => {
  const t = yl(e);
  for (t && (e = -e), Ge(r, (e > mi ? ut : 0) | (t ? Mt : 0) | mi & e), e = It(e / 64); e > 0; )
    Ge(r, (e > Zt ? ut : 0) | Zt & e), e = It(e / 128);
}, wi = new Uint8Array(3e4), Af = wi.length / 3, yf = (r, e) => {
  if (e.length < Af) {
    const t = qr.encodeInto(e, wi).written || 0;
    Se(r, t);
    for (let n = 0; n < t; n++)
      Ge(r, wi[n]);
  } else
    lt(r, pf(e));
}, kf = (r, e) => {
  const t = unescape(encodeURIComponent(e)), n = t.length;
  Se(r, n);
  for (let s = 0; s < n; s++)
    Ge(
      r,
      /** @type {number} */
      t.codePointAt(s)
    );
}, hr = qr && /** @type {any} */
qr.encodeInto ? yf : kf, us = (r, e) => {
  const t = r.cbuf.length, n = r.cpos, s = Al(t - n, e.length), i = e.length - s;
  r.cbuf.set(e.subarray(0, s), n), r.cpos += s, i > 0 && (r.bufs.push(r.cbuf), r.cbuf = new Uint8Array(nr(t * 2, i)), r.cbuf.set(e.subarray(s)), r.cpos = i);
}, lt = (r, e) => {
  Se(r, e.byteLength), us(r, e);
}, zi = (r, e) => {
  wf(r, e);
  const t = new DataView(r.cbuf.buffer, r.cpos, e);
  return r.cpos += e, t;
}, _f = (r, e) => zi(r, 4).setFloat32(0, e, !1), vf = (r, e) => zi(r, 8).setFloat64(0, e, !1), If = (r, e) => (
  /** @type {any} */
  zi(r, 8).setBigInt64(0, e, !1)
), co = new DataView(new ArrayBuffer(4)), Cf = (r) => (co.setFloat32(0, r), co.getFloat32(0) === r), Gr = (r, e) => {
  switch (typeof e) {
    case "string":
      Ge(r, 119), hr(r, e);
      break;
    case "number":
      of(e) && Tn(e) <= af ? (Ge(r, 125), Ri(r, e)) : Cf(e) ? (Ge(r, 124), _f(r, e)) : (Ge(r, 123), vf(r, e));
      break;
    case "bigint":
      Ge(r, 122), If(r, e);
      break;
    case "object":
      if (e === null)
        Ge(r, 126);
      else if (Ar(e)) {
        Ge(r, 117), Se(r, e.length);
        for (let t = 0; t < e.length; t++)
          Gr(r, e[t]);
      } else if (e instanceof Uint8Array)
        Ge(r, 116), lt(r, e);
      else {
        Ge(r, 118);
        const t = Object.keys(e);
        Se(r, t.length);
        for (let n = 0; n < t.length; n++) {
          const s = t[n];
          hr(r, s), Gr(r, e[s]);
        }
      }
      break;
    case "boolean":
      Ge(r, e ? 120 : 121);
      break;
    default:
      Ge(r, 127);
  }
};
class uo extends nn {
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
const ho = (r) => {
  r.count > 0 && (Ri(r.encoder, r.count === 1 ? r.s : -r.s), r.count > 1 && Se(r.encoder, r.count - 2));
};
class Qn {
  constructor() {
    this.encoder = new nn(), this.s = 0, this.count = 0;
  }
  /**
   * @param {number} v
   */
  write(e) {
    this.s === e ? this.count++ : (ho(this), this.count = 1, this.s = e);
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    return ho(this), vt(this.encoder);
  }
}
const fo = (r) => {
  if (r.count > 0) {
    const e = r.diff * 2 + (r.count === 1 ? 0 : 1);
    Ri(r.encoder, e), r.count > 1 && Se(r.encoder, r.count - 2);
  }
};
class ti {
  constructor() {
    this.encoder = new nn(), this.s = 0, this.count = 0, this.diff = 0;
  }
  /**
   * @param {number} v
   */
  write(e) {
    this.diff === e - this.s ? (this.s = e, this.count++) : (fo(this), this.count = 1, this.diff = e - this.s, this.s = e);
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    return fo(this), vt(this.encoder);
  }
}
class Ef {
  constructor() {
    this.sarr = [], this.s = "", this.lensE = new Qn();
  }
  /**
   * @param {string} string
   */
  write(e) {
    this.s += e, this.s.length > 19 && (this.sarr.push(this.s), this.s = ""), this.lensE.write(e.length);
  }
  toUint8Array() {
    const e = new nn();
    return this.sarr.push(this.s), this.s = "", hr(e, this.sarr.join("")), us(e, this.lensE.toUint8Array()), vt(e);
  }
}
const Ct = (r) => new Error(r), yt = () => {
  throw Ct("Method unimplemented");
}, ht = () => {
  throw Ct("Unexpected case");
}, hs = Ct("Unexpected end of array"), kl = Ct("Integer out of Range"), Sf = (r, e, t) => {
  if (e < 0 || t < 0 || e + t > r.length)
    throw hs;
  return new Uint8Array(r.buffer, r.byteOffset + e, t);
}, Nf = (r, e, t) => {
  if (e < 0 || t < 0 || e + t > r.length)
    throw hs;
  return new DataView(r.buffer, r.byteOffset + e, t);
};
class fs {
  /**
   * @param {Uint8Array<Buf>} uint8Array Binary data to decode
   */
  constructor(e) {
    this.arr = e, this.pos = 0;
  }
}
const Sr = (r) => new fs(r), Bf = (r) => r.pos !== r.arr.length, xf = (r, e) => {
  const t = Sf(r.arr, r.pos, e);
  return r.pos += e, t;
}, ct = (r) => xf(r, Ce(r)), yr = (r) => r.arr[r.pos++], Ce = (r) => {
  let e = 0, t = 1;
  const n = r.arr.length;
  for (; r.pos < n; ) {
    const s = r.arr[r.pos++];
    if (e = e + (s & Zt) * t, t *= 128, s < ut)
      return e;
    if (e > Jn)
      throw kl;
  }
  throw hs;
}, Pi = (r) => {
  let e = r.arr[r.pos++], t = e & mi, n = 64;
  const s = (e & Mt) > 0 ? -1 : 1;
  if ((e & ut) === 0)
    return s * t;
  const i = r.arr.length;
  for (; r.pos < i; ) {
    if (e = r.arr[r.pos++], t = t + (e & Zt) * n, n *= 128, e < ut)
      return s * t;
    if (t > Jn)
      throw kl;
  }
  throw hs;
}, Df = (r) => {
  let e = Ce(r);
  if (e === 0)
    return "";
  {
    let t = String.fromCodePoint(yr(r));
    if (--e < 100)
      for (; e--; )
        t += String.fromCodePoint(yr(r));
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
}, Mf = (r) => (
  /** @type any */
  Hr.decode(ct(r))
), fr = Hr ? Mf : Df, Fi = (r, e) => {
  const t = Nf(r.arr, r.pos, e);
  return r.pos += e, t;
}, Rf = (r) => Fi(r, 4).getFloat32(0, !1), zf = (r) => Fi(r, 8).getFloat64(0, !1), Pf = (r) => (
  /** @type {any} */
  Fi(r, 8).getBigInt64(0, !1)
), Ff = [
  (r) => {
  },
  // CASE 127: undefined
  (r) => null,
  // CASE 126: null
  Pi,
  // CASE 125: integer
  Rf,
  // CASE 124: float32
  zf,
  // CASE 123: float64
  Pf,
  // CASE 122: bigint
  (r) => !1,
  // CASE 121: boolean (false)
  (r) => !0,
  // CASE 120: boolean (true)
  fr,
  // CASE 119: string
  (r) => {
    const e = Ce(r), t = {};
    for (let n = 0; n < e; n++) {
      const s = fr(r);
      t[s] = Jr(r);
    }
    return t;
  },
  (r) => {
    const e = Ce(r), t = [];
    for (let n = 0; n < e; n++)
      t.push(Jr(r));
    return t;
  },
  ct
  // CASE 116: Uint8Array
], Jr = (r) => Ff[127 - yr(r)](r);
class go extends fs {
  /**
   * @param {Uint8Array} uint8Array
   * @param {function(Decoder):T} reader
   */
  constructor(e, t) {
    super(e), this.reader = t, this.s = null, this.count = 0;
  }
  read() {
    return this.count === 0 && (this.s = this.reader(this), Bf(this) ? this.count = Ce(this) + 1 : this.count = -1), this.count--, /** @type {T} */
    this.s;
  }
}
class Ln extends fs {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(e) {
    super(e), this.s = 0, this.count = 0;
  }
  read() {
    if (this.count === 0) {
      this.s = Pi(this);
      const e = yl(this.s);
      this.count = 1, e && (this.s = -this.s, this.count = Ce(this) + 2);
    }
    return this.count--, /** @type {number} */
    this.s;
  }
}
class ri extends fs {
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
      const e = Pi(this), t = e & 1;
      this.diff = It(e / 2), this.count = 1, t && (this.count = Ce(this) + 2);
    }
    return this.s += this.diff, this.count--, this.s;
  }
}
class Tf {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(e) {
    this.decoder = new Ln(e), this.str = fr(this.decoder), this.spos = 0;
  }
  /**
   * @return {string}
   */
  read() {
    const e = this.spos + this.decoder.read(), t = this.str.slice(this.spos, e);
    return this.spos = e, t;
  }
}
const Qf = crypto.getRandomValues.bind(crypto), _l = () => Qf(new Uint32Array(1))[0], Lf = "10000000-1000-4000-8000" + -1e11, Uf = () => Lf.replace(
  /[018]/g,
  /** @param {number} c */
  (r) => (r ^ _l() & 15 >> r / 4).toString(16)
), Of = Date.now, po = (r) => (
  /** @type {Promise<T>} */
  new Promise(r)
);
Promise.all.bind(Promise);
const mo = (r) => r === void 0 ? null : r;
class $f {
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
let vl = new $f(), Hf = !0;
try {
  typeof localStorage < "u" && localStorage && (vl = localStorage, Hf = !1);
} catch {
}
const jf = vl, Vr = /* @__PURE__ */ Symbol("Equality"), Il = (r, e) => r === e || !!r?.[Vr]?.(e) || !1, qf = (r) => typeof r == "object", Gf = Object.assign, Jf = Object.keys, Vf = (r, e) => {
  for (const t in r)
    e(r[t], t);
}, Vn = (r) => Jf(r).length, Wf = (r) => {
  for (const e in r)
    return !1;
  return !0;
}, sn = (r, e) => {
  for (const t in r)
    if (!e(r[t], t))
      return !1;
  return !0;
}, Ti = (r, e) => Object.prototype.hasOwnProperty.call(r, e), Xf = (r, e) => r === e || Vn(r) === Vn(e) && sn(r, (t, n) => (t !== void 0 || Ti(e, n)) && Il(e[n], t)), Zf = Object.freeze, Cl = (r) => {
  for (const e in r) {
    const t = r[e];
    (typeof t == "object" || typeof t == "function") && Cl(r[e]);
  }
  return Zf(r);
}, Qi = (r, e, t = 0) => {
  try {
    for (; t < r.length; t++)
      r[t](...e);
  } finally {
    t < r.length && Qi(r, e, t + 1);
  }
}, Kf = (r) => r, Un = (r, e) => {
  if (r === e)
    return !0;
  if (r == null || e == null || r.constructor !== e.constructor && (r.constructor || Object) !== (e.constructor || Object))
    return !1;
  if (r[Vr] != null)
    return r[Vr](e);
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
        if (!e.has(t) || !Un(r.get(t), e.get(t)))
          return !1;
      break;
    }
    case void 0:
    case Object:
      if (Vn(r) !== Vn(e))
        return !1;
      for (const t in r)
        if (!Ti(r, t) || !Un(r[t], e[t]))
          return !1;
      break;
    case Array:
      if (r.length !== e.length)
        return !1;
      for (let t = 0; t < r.length; t++)
        if (!Un(r[t], e[t]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, Yf = (r, e) => e.includes(r), Wr = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]";
let _t;
const eg = () => {
  if (_t === void 0)
    if (Wr) {
      _t = At();
      const r = process.argv;
      let e = null;
      for (let t = 0; t < r.length; t++) {
        const n = r[t];
        n[0] === "-" ? (e !== null && _t.set(e, ""), e = n) : e !== null && (_t.set(e, n), e = null);
      }
      e !== null && _t.set(e, "");
    } else typeof location == "object" ? (_t = At(), (location.search || "?").slice(1).split("&").forEach((r) => {
      if (r.length !== 0) {
        const [e, t] = r.split("=");
        _t.set(`--${lo(e, "-")}`, t), _t.set(`-${lo(e, "-")}`, t);
      }
    })) : _t = At();
  return _t;
}, Ai = (r) => eg().has(r), Wn = (r) => mo(Wr ? process.env[r.toUpperCase().replaceAll("-", "_")] : jf.getItem(r)), El = (r) => Ai("--" + r) || Wn(r) !== null, tg = El("production"), rg = Wr && Yf(process.env.FORCE_COLOR, ["true", "1", "2"]), ng = rg || !Ai("--no-colors") && // @todo deprecate --no-colors
!El("no-color") && (!Wr || process.stdout.isTTY) && (!Wr || Ai("--color") || Wn("COLORTERM") !== null || (Wn("TERM") || "").includes("color")), sg = (r) => new Uint8Array(r), ig = (r) => {
  const e = sg(r.byteLength);
  return e.set(r), e;
};
class ag {
  /**
   * @param {L} left
   * @param {R} right
   */
  constructor(e, t) {
    this.left = e, this.right = t;
  }
}
const Dt = (r, e) => new ag(r, e), bo = (r) => r.next() >= 0.5, ni = (r, e, t) => It(r.next() * (t + 1 - e) + e), Sl = (r, e, t) => It(r.next() * (t + 1 - e) + e), Li = (r, e, t) => Sl(r, e, t), og = (r) => lf(Li(r, 97, 122)), lg = (r, e = 0, t = 20) => {
  const n = Li(r, e, t);
  let s = "";
  for (let i = 0; i < n; i++)
    s += og(r);
  return s;
}, si = (r, e) => e[Li(r, 0, e.length - 1)], cg = /* @__PURE__ */ Symbol("0schema");
class dg {
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
      e.push(mf(" ", (this._rerrs.length - t) * 2) + `${n.path != null ? `[${n.path}] ` : ""}${n.has} doesn't match ${n.expected}. ${n.message}`);
    }
    return e.join(`
`);
  }
}
const yi = (r, e) => r === e ? !0 : r == null || e == null || r.constructor !== e.constructor ? !1 : r[Vr] ? Il(r, e) : Ar(r) ? Di(
  r,
  (t) => Mi(e, (n) => yi(t, n))
) : qf(r) ? sn(
  r,
  (t, n) => yi(t, e[n])
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
      this.constructor._dilutes && ([n, t] = [t, n]), yi(t, n)
    );
  }
  /**
   * Overwrite this when necessary. By default, we only check the `shape` property which every shape
   * should have.
   * @param {Schema<any>} other
   */
  equals(e) {
    return this.constructor === e.constructor && Un(this.shape, e.shape);
  }
  [cg]() {
    return !0;
  }
  /**
   * @param {object} other
   */
  [Vr](e) {
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
    yt();
  }
  /* c8 ignore stop */
  /**
   * @type {Schema<T?>}
   */
  get nullable() {
    return Nr(this, ws);
  }
  /**
   * @type {$Optional<Schema<T>>}
   */
  get optional() {
    return new xl(
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
    return wo(e, this), /** @type {any} */
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
    return wo(e, this), e;
  }
}
class Ui extends nt {
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
const je = (r, e = null) => new Ui(r, e);
je(Ui);
class Oi extends nt {
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
const Ve = (r) => new Oi(r);
je(Oi);
class gs extends nt {
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
const ps = (...r) => new gs(r), Nl = je(gs), ug = (
  /** @type {any} */
  RegExp.escape || /** @type {(str:string) => string} */
  ((r) => r.replace(/[().|&,$^[\]]/g, (e) => "\\" + e))
), Bl = (r) => {
  if (kr.check(r))
    return [ug(r)];
  if (Nl.check(r))
    return (
      /** @type {Array<string|number>} */
      r.shape.map((e) => e + "")
    );
  if (Ll.check(r))
    return ["[+-]?\\d+.?\\d*"];
  if (Ul.check(r))
    return [".*"];
  if (Xn.check(r))
    return r.shape.map(Bl).flat(1);
  ht();
};
class hg extends nt {
  /**
   * @param {T} shape
   */
  constructor(e) {
    super(), this.shape = e, this._r = new RegExp("^" + e.map(Bl).map((t) => `(${t.join("|")})`).join("") + "$");
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
je(hg);
const fg = /* @__PURE__ */ Symbol("optional");
class xl extends nt {
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
  get [fg]() {
    return !0;
  }
}
const gg = je(xl);
class pg extends nt {
  /**
   * @param {any} _o
   * @param {ValidationError} [err]
   * @return {_o is never}
   */
  check(e, t) {
    return t?.extend(null, "never", typeof e), !1;
  }
}
je(pg);
class ms extends nt {
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
    return new ms(this.shape, !0);
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is $ObjectToType<S>}
   */
  check(e, t) {
    return e == null ? (t?.extend(null, "object", "null"), !1) : sn(this.shape, (n, s) => {
      const i = this._isPartial && !Ti(e, s) || n.check(e[s], t);
      return !i && t?.extend(s.toString(), n.toString(), typeof e[s], "Object property does not match"), i;
    });
  }
}
const mg = (r) => (
  /** @type {any} */
  new ms(r)
), bg = je(ms), wg = Ve((r) => r != null && (r.constructor === Object || r.constructor == null));
class Dl extends nt {
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
    return e != null && sn(e, (n, s) => {
      const i = this.shape.keys.check(s, t);
      return !i && t?.extend(s + "", "Record", typeof e, i ? "Key doesn't match schema" : "Value doesn't match value"), i && this.shape.values.check(n, t);
    });
  }
}
const Ml = (r, e) => new Dl(r, e), Ag = je(Dl);
class Rl extends nt {
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
    return e != null && sn(this.shape, (n, s) => {
      const i = (
        /** @type {Schema<any>} */
        n.check(e[s], t)
      );
      return !i && t?.extend(s.toString(), "Tuple", typeof n), i;
    });
  }
}
const yg = (...r) => new Rl(r);
je(Rl);
class zl extends nt {
  /**
   * @param {Array<S>} v
   */
  constructor(e) {
    super(), this.shape = e.length === 1 ? e[0] : new $i(e);
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Array<S extends Schema<infer T> ? T : never>} o
   */
  check(e, t) {
    const n = Ar(e) && Di(e, (s) => this.shape.check(s));
    return !n && t?.extend(null, "Array", ""), n;
  }
}
const Pl = (...r) => new zl(r), kg = je(zl), _g = Ve((r) => Ar(r));
class Fl extends nt {
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
const vg = (r, e = null) => new Fl(r, e);
je(Fl);
const Ig = vg(nt);
class Cg extends nt {
  /**
   * @param {Args} args
   */
  constructor(e) {
    super(), this.len = e.length - 1, this.args = yg(...e.slice(-1)), this.res = e[this.len];
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
const Eg = je(Cg), Sg = Ve((r) => typeof r == "function");
class Ng extends nt {
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
    const n = Di(this.shape, (s) => s.check(e, t));
    return !n && t?.extend(null, "Intersectinon", typeof e), n;
  }
}
je(Ng, (r) => r.shape.length > 0);
class $i extends nt {
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
    const n = Mi(this.shape, (s) => s.check(e, t));
    return t?.extend(null, "Union", typeof e), n;
  }
}
const Nr = (...r) => r.findIndex((e) => Xn.check(e)) >= 0 ? Nr(...r.map((e) => Xr(e)).map((e) => Xn.check(e) ? e.shape : [e]).flat(1)) : r.length === 1 ? r[0] : new $i(r), Xn = (
  /** @type {Schema<$Union<any>>} */
  je($i)
), Tl = () => !0, Zn = Ve(Tl), Bg = (
  /** @type {Schema<Schema<any>>} */
  je(Oi, (r) => r.shape === Tl)
), Hi = Ve((r) => typeof r == "bigint"), xg = (
  /** @type {Schema<Schema<BigInt>>} */
  Ve((r) => r === Hi)
), Ql = Ve((r) => typeof r == "symbol");
Ve((r) => r === Ql);
const gr = Ve((r) => typeof r == "number"), Ll = (
  /** @type {Schema<Schema<number>>} */
  Ve((r) => r === gr)
), kr = Ve((r) => typeof r == "string"), Ul = (
  /** @type {Schema<Schema<string>>} */
  Ve((r) => r === kr)
), bs = Ve((r) => typeof r == "boolean"), Dg = (
  /** @type {Schema<Schema<Boolean>>} */
  Ve((r) => r === bs)
), Ol = ps(void 0);
je(gs, (r) => r.shape.length === 1 && r.shape[0] === void 0);
ps(void 0);
const ws = ps(null), Mg = (
  /** @type {Schema<Schema<null>>} */
  je(gs, (r) => r.shape.length === 1 && r.shape[0] === null)
);
je(Uint8Array);
je(Ui, (r) => r.shape === Uint8Array);
const Rg = Nr(gr, kr, ws, Ol, Hi, bs, Ql);
(() => {
  const r = (
    /** @type {$Array<$any>} */
    Pl(Zn)
  ), e = (
    /** @type {$Record<$string,$any>} */
    Ml(kr, Zn)
  ), t = Nr(gr, kr, ws, bs, r, e);
  return r.shape = t, e.shape.values = t, t;
})();
const Xr = (r) => {
  if (Ig.check(r))
    return (
      /** @type {any} */
      r
    );
  if (wg.check(r)) {
    const e = {};
    for (const t in r)
      e[t] = Xr(r[t]);
    return (
      /** @type {any} */
      mg(e)
    );
  } else {
    if (_g.check(r))
      return (
        /** @type {any} */
        Nr(...r.map(Xr))
      );
    if (Rg.check(r))
      return (
        /** @type {any} */
        ps(r)
      );
    if (Sg.check(r))
      return (
        /** @type {any} */
        je(
          /** @type {any} */
          r
        )
      );
  }
  ht();
}, wo = tg ? () => {
} : (r, e) => {
  const t = new dg();
  if (!e.check(r, t))
    throw Ct(`Expected value to be of type ${e.constructor.name}.
${t.toString()}`);
};
class zg {
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
    return this.patterns.push({ if: Xr(e), h: t }), this;
  }
  /**
   * @template R
   * @param {(o:any,s:State)=>R} h
   */
  else(e) {
    return this.if(Zn, e);
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
        throw Ct("Unhandled pattern");
      }
    );
  }
}
const Pg = (r) => new zg(
  /** @type {any} */
  r
), $l = (
  /** @type {any} */
  Pg(
    /** @type {Schema<prng.PRNG>} */
    Zn
  ).if(Ll, (r, e) => ni(e, oo, Jn)).if(Ul, (r, e) => lg(e)).if(Dg, (r, e) => bo(e)).if(xg, (r, e) => BigInt(ni(e, oo, Jn))).if(Xn, (r, e) => cr(e, si(e, r.shape))).if(bg, (r, e) => {
    const t = {};
    for (const n in r.shape) {
      let s = r.shape[n];
      if (gg.check(s)) {
        if (bo(e))
          continue;
        s = s.shape;
      }
      t[n] = $l(s, e);
    }
    return t;
  }).if(kg, (r, e) => {
    const t = [], n = Sl(e, 0, 42);
    for (let s = 0; s < n; s++)
      t.push(cr(e, r.shape));
    return t;
  }).if(Nl, (r, e) => si(e, r.shape)).if(Mg, (r, e) => null).if(Eg, (r, e) => {
    const t = cr(e, r.res);
    return () => t;
  }).if(Bg, (r, e) => cr(e, si(e, [
    gr,
    kr,
    ws,
    Ol,
    Hi,
    bs,
    Pl(gr),
    Ml(Nr("a", "b", "c"), gr)
  ]))).if(Ag, (r, e) => {
    const t = {}, n = ni(e, 0, 3);
    for (let s = 0; s < n; s++) {
      const i = cr(e, r.shape.keys), a = cr(e, r.shape.values);
      t[i] = a;
    }
    return t;
  }).done()
), cr = (r, e) => (
  /** @type {any} */
  $l(Xr(e), r)
), As = (
  /** @type {Document} */
  typeof document < "u" ? document : {}
);
Ve((r) => r.nodeType === Ug);
typeof DOMParser < "u" && new DOMParser();
Ve((r) => r.nodeType === Tg);
Ve((r) => r.nodeType === Qg);
const Fg = (r) => tf(r, (e, t) => `${t}:${e};`).join(""), Tg = As.ELEMENT_NODE, Qg = As.TEXT_NODE, Lg = As.DOCUMENT_NODE, Ug = As.DOCUMENT_FRAGMENT_NODE;
Ve((r) => r.nodeType === Lg);
const zt = Symbol, Hl = zt(), jl = zt(), Og = zt(), $g = zt(), Hg = zt(), ql = zt(), jg = zt(), ji = zt(), qg = zt(), Gg = (r) => {
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
}, Jg = {
  [Hl]: Dt("font-weight", "bold"),
  [jl]: Dt("font-weight", "normal"),
  [Og]: Dt("color", "blue"),
  [Hg]: Dt("color", "green"),
  [$g]: Dt("color", "grey"),
  [ql]: Dt("color", "red"),
  [jg]: Dt("color", "purple"),
  [ji]: Dt("color", "orange"),
  // not well supported in chrome when debugging node with inspector - TODO: deprecate
  [qg]: Dt("color", "black")
}, Vg = (r) => {
  r.length === 1 && r[0]?.constructor === Function && (r = /** @type {Array<string|Symbol|Object|number>} */
  /** @type {[function]} */
  r[0]());
  const e = [], t = [], n = At();
  let s = [], i = 0;
  for (; i < r.length; i++) {
    const a = r[i], o = Jg[a];
    if (o !== void 0)
      n.set(o.left, o.right);
    else {
      if (a === void 0)
        break;
      if (a.constructor === String || a.constructor === Number) {
        const l = Fg(n);
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
}, Gl = ng ? Vg : Gg, Wg = (...r) => {
  console.log(...Gl(r)), Vl.forEach((e) => e.print(r));
}, Jl = (...r) => {
  console.warn(...Gl(r)), r.unshift(ji), Vl.forEach((e) => e.print(r));
}, Vl = wr(), Wl = (r) => ({
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return this;
  },
  // @ts-ignore
  next: r
}), Xg = (r, e) => Wl(() => {
  let t;
  do
    t = r.next();
  while (!t.done && !e(t.value));
  return t;
}), ii = (r, e) => Wl(() => {
  const { done: t, value: n } = r.next();
  return { done: t, value: t ? void 0 : e(n) };
});
class ys {
  /**
   * @param {number} clock
   * @param {number} len
   */
  constructor(e, t) {
    this.clock = e, this.len = t;
  }
}
class Br {
  constructor() {
    this.clients = /* @__PURE__ */ new Map();
  }
}
const _r = (r, e, t) => e.clients.forEach((n, s) => {
  const i = (
    /** @type {Array<GC|Item>} */
    r.doc.store.clients.get(s)
  );
  if (i != null) {
    const a = i[i.length - 1], o = a.id.clock + a.length;
    for (let l = 0, d = n[l]; l < n.length && d.clock < o; d = n[++l])
      dc(r, i, d.clock, d.len, t);
  }
}), Zg = (r, e) => {
  let t = 0, n = r.length - 1;
  for (; t <= n; ) {
    const s = It((t + n) / 2), i = r[s], a = i.clock;
    if (a <= e) {
      if (e < a + i.len)
        return s;
      t = s + 1;
    } else
      n = s - 1;
  }
  return null;
}, an = (r, e) => {
  const t = r.clients.get(e.client);
  return t !== void 0 && Zg(t, e.clock) !== null;
}, qi = (r) => {
  r.clients.forEach((e) => {
    e.sort((s, i) => s.clock - i.clock);
    let t, n;
    for (t = 1, n = 1; t < e.length; t++) {
      const s = e[n - 1], i = e[t];
      s.clock + s.len >= i.clock ? e[n - 1] = new ys(s.clock, nr(s.len, i.clock + i.len - s.clock)) : (n < t && (e[n] = i), n++);
    }
    e.length = n;
  });
}, ki = (r) => {
  const e = new Br();
  for (let t = 0; t < r.length; t++)
    r[t].clients.forEach((n, s) => {
      if (!e.clients.has(s)) {
        const i = n.slice();
        for (let a = t + 1; a < r.length; a++)
          nf(i, r[a].clients.get(s) || []);
        e.clients.set(s, i);
      }
    });
  return qi(e), e;
}, Zr = (r, e, t, n) => {
  Gt(r.clients, e, () => (
    /** @type {Array<DeleteItem>} */
    []
  )).push(new ys(t, n));
}, Kg = () => new Br(), Xl = (r) => {
  const e = Kg();
  return r.clients.forEach((t, n) => {
    const s = [];
    for (let i = 0; i < t.length; i++) {
      const a = t[i];
      if (a.deleted) {
        const o = a.id.clock;
        let l = a.length;
        if (i + 1 < t.length)
          for (let d = t[i + 1]; i + 1 < t.length && d.deleted; d = t[++i + 1])
            l += d.length;
        s.push(new ys(o, l));
      }
    }
    s.length > 0 && e.clients.set(n, s);
  }), e;
}, xr = (r, e) => {
  Se(r.restEncoder, e.clients.size), qt(e.clients.entries()).sort((t, n) => n[0] - t[0]).forEach(([t, n]) => {
    r.resetDsCurVal(), Se(r.restEncoder, t);
    const s = n.length;
    Se(r.restEncoder, s);
    for (let i = 0; i < s; i++) {
      const a = n[i];
      r.writeDsClock(a.clock), r.writeDsLen(a.len);
    }
  });
}, Gi = (r) => {
  const e = new Br(), t = Ce(r.restDecoder);
  for (let n = 0; n < t; n++) {
    r.resetDsCurVal();
    const s = Ce(r.restDecoder), i = Ce(r.restDecoder);
    if (i > 0) {
      const a = Gt(e.clients, s, () => (
        /** @type {Array<DeleteItem>} */
        []
      ));
      for (let o = 0; o < i; o++)
        a.push(new ys(r.readDsClock(), r.readDsLen()));
    }
  }
  return e;
}, Ao = (r, e, t) => {
  const n = new Br(), s = Ce(r.restDecoder);
  for (let i = 0; i < s; i++) {
    r.resetDsCurVal();
    const a = Ce(r.restDecoder), o = Ce(r.restDecoder), l = t.clients.get(a) || [], d = $e(t, a);
    for (let f = 0; f < o; f++) {
      const g = r.readDsClock(), m = g + r.readDsLen();
      if (g < d) {
        d < m && Zr(n, a, d, m - d);
        let u = Et(l, g), y = l[u];
        for (!y.deleted && y.id.clock < g && (l.splice(u + 1, 0, is(e, y, g - y.id.clock)), u++); u < l.length && (y = l[u++], y.id.clock < m); )
          y.deleted || (m < y.id.clock + y.length && l.splice(u, 0, is(e, y, m - y.id.clock)), y.delete(e));
      } else
        Zr(n, a, g, m - g);
    }
  }
  if (n.clients.size > 0) {
    const i = new Kt();
    return Se(i.restEncoder, 0), xr(i, n), i.toUint8Array();
  }
  return null;
}, Zl = _l;
class sr extends wl {
  /**
   * @param {DocOpts} opts configuration
   */
  constructor({ guid: e = Uf(), collectionid: t = null, gc: n = !0, gcFilter: s = () => !0, meta: i = null, autoLoad: a = !1, shouldLoad: o = !0 } = {}) {
    super(), this.gc = n, this.gcFilter = s, this.clientID = Zl(), this.guid = e, this.collectionid = t, this.share = /* @__PURE__ */ new Map(), this.store = new lc(), this._transaction = null, this._transactionCleanups = [], this.subdocs = /* @__PURE__ */ new Set(), this._item = null, this.shouldLoad = o, this.autoLoad = a, this.meta = i, this.isLoaded = !1, this.isSynced = !1, this.isDestroyed = !1, this.whenLoaded = po((d) => {
      this.on("load", () => {
        this.isLoaded = !0, d(this);
      });
    });
    const l = () => po((d) => {
      const f = (g) => {
        (g === void 0 || g === !0) && (this.off("sync", f), d());
      };
      this.on("sync", f);
    });
    this.on("sync", (d) => {
      d === !1 && this.isSynced && (this.whenSynced = l()), this.isSynced = d === void 0 || d === !0, this.isSynced && !this.isLoaded && this.emit("load", [this]);
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
    return new Set(qt(this.subdocs).map((e) => e.guid));
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
    Je
  )) {
    const n = Gt(this.share, e, () => {
      const i = new t();
      return i._integrate(this, null), i;
    }), s = n.constructor;
    if (t !== Je && s !== t)
      if (s === Je) {
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
      this.get(e, br)
    );
  }
  /**
   * @param {string} [name]
   * @return {YText}
   *
   * @public
   */
  getText(e = "") {
    return this.get(e, Cr);
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
      this.get(e, Ir)
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
      this.get(e, Er)
    );
  }
  /**
   * @param {string} [name]
   * @return {YXmlFragment}
   *
   * @public
   */
  getXmlFragment(e = "") {
    return this.get(e, Yt);
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
    this.isDestroyed = !0, qt(this.subdocs).forEach((t) => t.destroy());
    const e = this._item;
    if (e !== null) {
      this._item = null;
      const t = (
        /** @type {ContentDoc} */
        e.content
      );
      t.doc = new sr({ guid: this.guid, ...t.opts, shouldLoad: !1 }), t.doc._item = e, ze(
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
class Kl {
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
    return Ce(this.restDecoder);
  }
  /**
   * @return {number}
   */
  readDsLen() {
    return Ce(this.restDecoder);
  }
}
class Yl extends Kl {
  /**
   * @return {ID}
   */
  readLeftID() {
    return _e(Ce(this.restDecoder), Ce(this.restDecoder));
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return _e(Ce(this.restDecoder), Ce(this.restDecoder));
  }
  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient() {
    return Ce(this.restDecoder);
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo() {
    return yr(this.restDecoder);
  }
  /**
   * @return {string}
   */
  readString() {
    return fr(this.restDecoder);
  }
  /**
   * @return {boolean} isKey
   */
  readParentInfo() {
    return Ce(this.restDecoder) === 1;
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readTypeRef() {
    return Ce(this.restDecoder);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number} len
   */
  readLen() {
    return Ce(this.restDecoder);
  }
  /**
   * @return {any}
   */
  readAny() {
    return Jr(this.restDecoder);
  }
  /**
   * @return {Uint8Array}
   */
  readBuf() {
    return ig(ct(this.restDecoder));
  }
  /**
   * Legacy implementation uses JSON parse. We use any-decoding in v2.
   *
   * @return {any}
   */
  readJSON() {
    return JSON.parse(fr(this.restDecoder));
  }
  /**
   * @return {string}
   */
  readKey() {
    return fr(this.restDecoder);
  }
}
class Yg {
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
    return this.dsCurrVal += Ce(this.restDecoder), this.dsCurrVal;
  }
  /**
   * @return {number}
   */
  readDsLen() {
    const e = Ce(this.restDecoder) + 1;
    return this.dsCurrVal += e, e;
  }
}
class vr extends Yg {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(e) {
    super(e), this.keys = [], Ce(e), this.keyClockDecoder = new ri(ct(e)), this.clientDecoder = new Ln(ct(e)), this.leftClockDecoder = new ri(ct(e)), this.rightClockDecoder = new ri(ct(e)), this.infoDecoder = new go(ct(e), yr), this.stringDecoder = new Tf(ct(e)), this.parentInfoDecoder = new go(ct(e), yr), this.typeRefDecoder = new Ln(ct(e)), this.lenDecoder = new Ln(ct(e));
  }
  /**
   * @return {ID}
   */
  readLeftID() {
    return new pr(this.clientDecoder.read(), this.leftClockDecoder.read());
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return new pr(this.clientDecoder.read(), this.rightClockDecoder.read());
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
    return Jr(this.restDecoder);
  }
  /**
   * @return {Uint8Array}
   */
  readBuf() {
    return ct(this.restDecoder);
  }
  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @return {any}
   */
  readJSON() {
    return Jr(this.restDecoder);
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
class ec {
  constructor() {
    this.restEncoder = ds();
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
class on extends ec {
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
    bi(this.restEncoder, e);
  }
  /**
   * @param {string} s
   */
  writeString(e) {
    hr(this.restEncoder, e);
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
    Gr(this.restEncoder, e);
  }
  /**
   * @param {Uint8Array} buf
   */
  writeBuf(e) {
    lt(this.restEncoder, e);
  }
  /**
   * @param {any} embed
   */
  writeJSON(e) {
    hr(this.restEncoder, JSON.stringify(e));
  }
  /**
   * @param {string} key
   */
  writeKey(e) {
    hr(this.restEncoder, e);
  }
}
class tc {
  constructor() {
    this.restEncoder = ds(), this.dsCurrVal = 0;
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
    e === 0 && ht(), Se(this.restEncoder, e - 1), this.dsCurrVal += e;
  }
}
class Kt extends tc {
  constructor() {
    super(), this.keyMap = /* @__PURE__ */ new Map(), this.keyClock = 0, this.keyClockEncoder = new ti(), this.clientEncoder = new Qn(), this.leftClockEncoder = new ti(), this.rightClockEncoder = new ti(), this.infoEncoder = new uo(bi), this.stringEncoder = new Ef(), this.parentInfoEncoder = new uo(bi), this.typeRefEncoder = new Qn(), this.lenEncoder = new Qn();
  }
  toUint8Array() {
    const e = ds();
    return Se(e, 0), lt(e, this.keyClockEncoder.toUint8Array()), lt(e, this.clientEncoder.toUint8Array()), lt(e, this.leftClockEncoder.toUint8Array()), lt(e, this.rightClockEncoder.toUint8Array()), lt(e, vt(this.infoEncoder)), lt(e, this.stringEncoder.toUint8Array()), lt(e, vt(this.parentInfoEncoder)), lt(e, this.typeRefEncoder.toUint8Array()), lt(e, this.lenEncoder.toUint8Array()), us(e, vt(this.restEncoder)), vt(e);
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
    Gr(this.restEncoder, e);
  }
  /**
   * @param {Uint8Array} buf
   */
  writeBuf(e) {
    lt(this.restEncoder, e);
  }
  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @param {any} embed
   */
  writeJSON(e) {
    Gr(this.restEncoder, e);
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
const ep = (r, e, t, n) => {
  n = nr(n, e[0].id.clock);
  const s = Et(e, n);
  Se(r.restEncoder, e.length - s), r.writeClient(t), Se(r.restEncoder, n);
  const i = e[s];
  i.write(r, n - i.id.clock);
  for (let a = s + 1; a < e.length; a++)
    e[a].write(r, 0);
}, Ji = (r, e, t) => {
  const n = /* @__PURE__ */ new Map();
  t.forEach((s, i) => {
    $e(e, i) > s && n.set(i, s);
  }), ln(e).forEach((s, i) => {
    t.has(i) || n.set(i, 0);
  }), Se(r.restEncoder, n.size), qt(n.entries()).sort((s, i) => i[0] - s[0]).forEach(([s, i]) => {
    ep(
      r,
      /** @type {Array<GC|Item>} */
      e.clients.get(s),
      s,
      i
    );
  });
}, tp = (r, e) => {
  const t = At(), n = Ce(r.restDecoder);
  for (let s = 0; s < n; s++) {
    const i = Ce(r.restDecoder), a = new Array(i), o = r.readClient();
    let l = Ce(r.restDecoder);
    t.set(o, { i: 0, refs: a });
    for (let d = 0; d < i; d++) {
      const f = r.readInfo();
      switch (cs & f) {
        case 0: {
          const g = r.readLen();
          a[d] = new pt(_e(o, l), g), l += g;
          break;
        }
        case 10: {
          const g = Ce(r.restDecoder);
          a[d] = new mt(_e(o, l), g), l += g;
          break;
        }
        default: {
          const g = (f & (Mt | ut)) === 0, m = new Pe(
            _e(o, l),
            null,
            // left
            (f & ut) === ut ? r.readLeftID() : null,
            // origin
            null,
            // right
            (f & Mt) === Mt ? r.readRightID() : null,
            // right origin
            g ? r.readParentInfo() ? e.get(r.readString()) : r.readLeftID() : null,
            // parent
            g && (f & jr) === jr ? r.readString() : null,
            // parentSub
            xc(r, f)
            // item content
          );
          a[d] = m, l += m.length;
        }
      }
    }
  }
  return t;
}, rp = (r, e, t) => {
  const n = [];
  let s = qt(t.keys()).sort((u, y) => u - y);
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
  const o = new lc(), l = /* @__PURE__ */ new Map(), d = (u, y) => {
    const w = l.get(u);
    (w == null || w > y) && l.set(u, y);
  };
  let f = (
    /** @type {any} */
    a.refs[
      /** @type {any} */
      a.i++
    ]
  );
  const g = /* @__PURE__ */ new Map(), m = () => {
    for (const u of n) {
      const y = u.id.client, w = t.get(y);
      w ? (w.i--, o.clients.set(y, w.refs.slice(w.i)), t.delete(y), w.i = 0, w.refs = []) : o.clients.set(y, [u]), s = s.filter((A) => A !== y);
    }
    n.length = 0;
  };
  for (; ; ) {
    if (f.constructor !== mt) {
      const y = Gt(g, f.id.client, () => $e(e, f.id.client)) - f.id.clock;
      if (y < 0)
        n.push(f), d(f.id.client, f.id.clock - 1), m();
      else {
        const w = f.getMissing(r, e);
        if (w !== null) {
          n.push(f);
          const A = t.get(
            /** @type {number} */
            w
          ) || { refs: [], i: 0 };
          if (A.refs.length === A.i)
            d(
              /** @type {number} */
              w,
              $e(e, w)
            ), m();
          else {
            f = A.refs[A.i++];
            continue;
          }
        } else (y === 0 || y < f.length) && (f.integrate(r, y), g.set(f.id.client, f.id.clock + f.length));
      }
    }
    if (n.length > 0)
      f = /** @type {GC|Item} */
      n.pop();
    else if (a !== null && a.i < a.refs.length)
      f = /** @type {GC|Item} */
      a.refs[a.i++];
    else {
      if (a = i(), a === null)
        break;
      f = /** @type {GC|Item} */
      a.refs[a.i++];
    }
  }
  if (o.clients.size > 0) {
    const u = new Kt();
    return Ji(u, o, /* @__PURE__ */ new Map()), Se(u.restEncoder, 0), { missing: l, update: u.toUint8Array() };
  }
  return null;
}, np = (r, e) => Ji(r, e.doc.store, e.beforeState), sp = (r, e, t, n = new vr(r)) => ze(e, (s) => {
  s.local = !1;
  let i = !1;
  const a = s.doc, o = a.store, l = tp(n, a), d = rp(s, o, l), f = o.pendingStructs;
  if (f) {
    for (const [m, u] of f.missing)
      if (u < $e(o, m)) {
        i = !0;
        break;
      }
    if (d) {
      for (const [m, u] of d.missing) {
        const y = f.missing.get(m);
        (y == null || y > u) && f.missing.set(m, u);
      }
      f.update = Yn([f.update, d.update]);
    }
  } else
    o.pendingStructs = d;
  const g = Ao(n, s, o);
  if (o.pendingDs) {
    const m = new vr(Sr(o.pendingDs));
    Ce(m.restDecoder);
    const u = Ao(m, s, o);
    g && u ? o.pendingDs = Yn([g, u]) : o.pendingDs = g || u;
  } else
    o.pendingDs = g;
  if (i) {
    const m = (
      /** @type {{update: Uint8Array}} */
      o.pendingStructs.update
    );
    o.pendingStructs = null, rc(s.doc, m);
  }
}, t, !1), rc = (r, e, t, n = vr) => {
  const s = Sr(e);
  sp(s, r, t, new n(s));
}, ip = (r, e, t) => rc(r, e, t, Yl), ap = (r, e, t = /* @__PURE__ */ new Map()) => {
  Ji(r, e.store, t), xr(r, Xl(e.store));
}, op = (r, e = new Uint8Array([0]), t = new Kt()) => {
  const n = nc(e);
  ap(t, r, n);
  const s = [t.toUint8Array()];
  if (r.store.pendingDs && s.push(r.store.pendingDs), r.store.pendingStructs && s.push(Sp(r.store.pendingStructs.update, e)), s.length > 1) {
    if (t.constructor === on)
      return Cp(s.map((i, a) => a === 0 ? i : Bp(i)));
    if (t.constructor === Kt)
      return Yn(s);
  }
  return s[0];
}, lp = (r, e) => op(r, e, new on()), cp = (r) => {
  const e = /* @__PURE__ */ new Map(), t = Ce(r.restDecoder);
  for (let n = 0; n < t; n++) {
    const s = Ce(r.restDecoder), i = Ce(r.restDecoder);
    e.set(s, i);
  }
  return e;
}, nc = (r) => cp(new Kl(Sr(r))), sc = (r, e) => (Se(r.restEncoder, e.size), qt(e.entries()).sort((t, n) => n[0] - t[0]).forEach(([t, n]) => {
  Se(r.restEncoder, t), Se(r.restEncoder, n);
}), r), dp = (r, e) => sc(r, ln(e.store)), up = (r, e = new tc()) => (r instanceof Map ? sc(e, r) : dp(e, r), e.toUint8Array()), Km = (r) => up(r, new ec());
class hp {
  constructor() {
    this.l = [];
  }
}
const yo = () => new hp(), ko = (r, e) => r.l.push(e), _o = (r, e) => {
  const t = r.l, n = t.length;
  r.l = t.filter((s) => e !== s), n === r.l.length && console.error("[yjs] Tried to remove event handler that doesn't exist.");
}, ic = (r, e, t) => Qi(r.l, [e, t]);
class pr {
  /**
   * @param {number} client client id
   * @param {number} clock unique per client id, continuous number
   */
  constructor(e, t) {
    this.client = e, this.clock = t;
  }
}
const ur = (r, e) => r === e || r !== null && e !== null && r.client === e.client && r.clock === e.clock, _e = (r, e) => new pr(r, e), ac = (r) => {
  for (const [e, t] of r.doc.share.entries())
    if (t === r)
      return e;
  throw ht();
}, Kn = (r, e) => {
  for (; e !== null; ) {
    if (e.parent === r)
      return !0;
    e = /** @type {AbstractType<any>} */
    e.parent._item;
  }
  return !1;
};
class oc {
  /**
   * @param {ID|null} type
   * @param {string|null} tname
   * @param {ID|null} item
   * @param {number} assoc
   */
  constructor(e, t, n, s = 0) {
    this.type = e, this.tname = t, this.item = n, this.assoc = s;
  }
}
const Ym = (r) => new oc(r.type == null ? null : _e(r.type.client, r.type.clock), r.tname ?? null, r.item == null ? null : _e(r.item.client, r.item.clock), r.assoc == null ? 0 : r.assoc);
class fp {
  /**
   * @param {AbstractType<any>} type
   * @param {number} index
   * @param {number} [assoc]
   */
  constructor(e, t, n = 0) {
    this.type = e, this.index = t, this.assoc = n;
  }
}
const gp = (r, e, t = 0) => new fp(r, e, t), Nn = (r, e, t) => {
  let n = null, s = null;
  return r._item === null ? s = ac(r) : n = _e(r._item.id.client, r._item.id.clock), new oc(n, s, e, t);
}, eb = (r, e, t = 0) => {
  let n = r._start;
  if (t < 0) {
    if (e === 0)
      return Nn(r, null, t);
    e--;
  }
  for (; n !== null; ) {
    if (!n.deleted && n.countable) {
      if (n.length > e)
        return Nn(r, _e(n.id.client, n.id.clock + e), t);
      e -= n.length;
    }
    if (n.right === null && t < 0)
      return Nn(r, n.lastId, t);
    n = n.right;
  }
  return Nn(r, null, t);
}, pp = (r, e) => {
  const t = mr(r, e), n = e.clock - t.id.clock;
  return {
    item: t,
    diff: n
  };
}, tb = (r, e, t = !0) => {
  const n = e.store, s = r.item, i = r.type, a = r.tname, o = r.assoc;
  let l = null, d = 0;
  if (s !== null) {
    if ($e(n, s.client) <= s.clock)
      return null;
    const f = t ? Ci(n, s) : pp(n, s), g = f.item;
    if (!(g instanceof Pe))
      return null;
    if (l = /** @type {AbstractType<any>} */
    g.parent, l._item === null || !l._item.deleted) {
      d = g.deleted || !g.countable ? 0 : f.diff + (o >= 0 ? 0 : 1);
      let m = g.left;
      for (; m !== null; )
        !m.deleted && m.countable && (d += m.length), m = m.left;
    }
  } else {
    if (a !== null)
      l = e.get(a);
    else if (i !== null) {
      if ($e(n, i.client) <= i.clock)
        return null;
      const { item: f } = t ? Ci(n, i) : { item: mr(n, i) };
      if (f instanceof Pe && f.content instanceof Nt)
        l = f.content.type;
      else
        return null;
    } else
      throw ht();
    o >= 0 ? d = l._length : d = 0;
  }
  return gp(l, d, r.assoc);
}, rb = (r, e) => r === e || r !== null && e !== null && r.tname === e.tname && ur(r.item, e.item) && ur(r.type, e.type) && r.assoc === e.assoc;
class mp {
  /**
   * @param {DeleteSet} ds
   * @param {Map<number,number>} sv state map
   */
  constructor(e, t) {
    this.ds = e, this.sv = t;
  }
}
const bp = (r, e) => new mp(r, e), nb = (r) => bp(Xl(r.store), ln(r.store)), Xt = (r, e) => e === void 0 ? !r.deleted : e.sv.has(r.id.client) && (e.sv.get(r.id.client) || 0) > r.id.clock && !an(e.ds, r.id), _i = (r, e) => {
  const t = Gt(r.meta, _i, wr), n = r.doc.store;
  t.has(e) || (e.sv.forEach((s, i) => {
    s < $e(n, i) && ot(r, _e(i, s));
  }), _r(r, e.ds, (s) => {
  }), t.add(e));
};
class lc {
  constructor() {
    this.clients = /* @__PURE__ */ new Map(), this.pendingStructs = null, this.pendingDs = null;
  }
}
const ln = (r) => {
  const e = /* @__PURE__ */ new Map();
  return r.clients.forEach((t, n) => {
    const s = t[t.length - 1];
    e.set(n, s.id.clock + s.length);
  }), e;
}, $e = (r, e) => {
  const t = r.clients.get(e);
  if (t === void 0)
    return 0;
  const n = t[t.length - 1];
  return n.id.clock + n.length;
}, cc = (r, e) => {
  let t = r.clients.get(e.id.client);
  if (t === void 0)
    t = [], r.clients.set(e.id.client, t);
  else {
    const n = t[t.length - 1];
    if (n.id.clock + n.length !== e.id.clock)
      throw ht();
  }
  t.push(e);
}, Et = (r, e) => {
  let t = 0, n = r.length - 1, s = r[n], i = s.id.clock;
  if (i === e)
    return n;
  let a = It(e / (i + s.length - 1) * n);
  for (; t <= n; ) {
    if (s = r[a], i = s.id.clock, i <= e) {
      if (e < i + s.length)
        return a;
      t = a + 1;
    } else
      n = a - 1;
    a = It((t + n) / 2);
  }
  throw ht();
}, wp = (r, e) => {
  const t = r.clients.get(e.client);
  return t[Et(t, e.clock)];
}, mr = (
  /** @type {function(StructStore,ID):Item} */
  wp
), vi = (r, e, t) => {
  const n = Et(e, t), s = e[n];
  return s.id.clock < t && s instanceof Pe ? (e.splice(n + 1, 0, is(r, s, t - s.id.clock)), n + 1) : n;
}, ot = (r, e) => {
  const t = (
    /** @type {Array<Item>} */
    r.doc.store.clients.get(e.client)
  );
  return t[vi(r, t, e.clock)];
}, vo = (r, e, t) => {
  const n = e.clients.get(t.client), s = Et(n, t.clock), i = n[s];
  return t.clock !== i.id.clock + i.length - 1 && i.constructor !== pt && n.splice(s + 1, 0, is(r, i, t.clock - i.id.clock + 1)), i;
}, Ap = (r, e, t) => {
  const n = (
    /** @type {Array<GC|Item>} */
    r.clients.get(e.id.client)
  );
  n[Et(n, e.id.clock)] = t;
}, dc = (r, e, t, n, s) => {
  if (n === 0)
    return;
  const i = t + n;
  let a = vi(r, e, t), o;
  do
    o = e[a++], i < o.id.clock + o.length && vi(r, e, i), s(o);
  while (a < e.length && e[a].id.clock < i);
};
class yp {
  /**
   * @param {Doc} doc
   * @param {any} origin
   * @param {boolean} local
   */
  constructor(e, t, n) {
    this.doc = e, this.deleteSet = new Br(), this.beforeState = ln(e.store), this.afterState = /* @__PURE__ */ new Map(), this.changed = /* @__PURE__ */ new Map(), this.changedParentTypes = /* @__PURE__ */ new Map(), this._mergeStructs = [], this.origin = t, this.meta = /* @__PURE__ */ new Map(), this.local = n, this.subdocsAdded = /* @__PURE__ */ new Set(), this.subdocsRemoved = /* @__PURE__ */ new Set(), this.subdocsLoaded = /* @__PURE__ */ new Set(), this._needFormattingCleanup = !1;
  }
}
const Io = (r, e) => e.deleteSet.clients.size === 0 && !rf(e.afterState, (t, n) => e.beforeState.get(n) !== t) ? !1 : (qi(e.deleteSet), np(r, e), xr(r, e.deleteSet), !0), Co = (r, e, t) => {
  const n = e._item;
  (n === null || n.id.clock < (r.beforeState.get(n.id.client) || 0) && !n.deleted) && Gt(r.changed, e, wr).add(t);
}, On = (r, e) => {
  let t = r[e], n = r[e - 1], s = e;
  for (; s > 0; t = n, n = r[--s - 1]) {
    if (n.deleted === t.deleted && n.constructor === t.constructor && n.mergeWith(t)) {
      t instanceof Pe && t.parentSub !== null && /** @type {AbstractType<any>} */
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
}, kp = (r, e, t) => {
  for (const [n, s] of r.clients.entries()) {
    const i = (
      /** @type {Array<GC|Item>} */
      e.clients.get(n)
    );
    for (let a = s.length - 1; a >= 0; a--) {
      const o = s[a], l = o.clock + o.len;
      for (let d = Et(i, o.clock), f = i[d]; d < i.length && f.id.clock < l; f = i[++d]) {
        const g = i[d];
        if (o.clock + o.len <= g.id.clock)
          break;
        g instanceof Pe && g.deleted && !g.keep && t(g) && g.gc(e, !1);
      }
    }
  }
}, _p = (r, e) => {
  r.clients.forEach((t, n) => {
    const s = (
      /** @type {Array<GC|Item>} */
      e.clients.get(n)
    );
    for (let i = t.length - 1; i >= 0; i--) {
      const a = t[i], o = Al(s.length - 1, 1 + Et(s, a.clock + a.len - 1));
      for (let l = o, d = s[l]; l > 0 && d.id.clock >= a.clock; d = s[l])
        l -= 1 + On(s, l);
    }
  });
}, uc = (r, e) => {
  if (e < r.length) {
    const t = r[e], n = t.doc, s = n.store, i = t.deleteSet, a = t._mergeStructs;
    try {
      qi(i), t.afterState = ln(t.doc.store), n.emit("beforeObserverCalls", [t, n]);
      const o = [];
      t.changed.forEach(
        (l, d) => o.push(() => {
          (d._item === null || !d._item.deleted) && d._callObserver(t, l);
        })
      ), o.push(() => {
        t.changedParentTypes.forEach((l, d) => {
          d._dEH.l.length > 0 && (d._item === null || !d._item.deleted) && o.push(() => {
            l = l.filter(
              (f) => f.target._item === null || !f.target._item.deleted
            ), l.forEach((f) => {
              f.currentTarget = d, f._path = null;
            }), l.sort((f, g) => f.path.length - g.path.length), ic(d._dEH, l, t);
          });
        }), o.push(() => n.emit("afterTransaction", [t, n])), o.push(() => {
          t._needFormattingCleanup && Hp(t);
        });
      }), Qi(o, []);
    } finally {
      n.gc && kp(i, s, n.gcFilter), _p(i, s), t.afterState.forEach((f, g) => {
        const m = t.beforeState.get(g) || 0;
        if (m !== f) {
          const u = (
            /** @type {Array<GC|Item>} */
            s.clients.get(g)
          ), y = nr(Et(u, m), 1);
          for (let w = u.length - 1; w >= y; )
            w -= 1 + On(u, w);
        }
      });
      for (let f = a.length - 1; f >= 0; f--) {
        const { client: g, clock: m } = a[f].id, u = (
          /** @type {Array<GC|Item>} */
          s.clients.get(g)
        ), y = Et(u, m);
        y + 1 < u.length && On(u, y + 1) > 1 || y > 0 && On(u, y);
      }
      if (!t.local && t.afterState.get(n.clientID) !== t.beforeState.get(n.clientID) && (Wg(ji, Hl, "[yjs] ", jl, ql, "Changed the client-id because another client seems to be using it."), n.clientID = Zl()), n.emit("afterTransactionCleanup", [t, n]), n._observers.has("update")) {
        const f = new on();
        Io(f, t) && n.emit("update", [f.toUint8Array(), t.origin, n, t]);
      }
      if (n._observers.has("updateV2")) {
        const f = new Kt();
        Io(f, t) && n.emit("updateV2", [f.toUint8Array(), t.origin, n, t]);
      }
      const { subdocsAdded: o, subdocsLoaded: l, subdocsRemoved: d } = t;
      (o.size > 0 || d.size > 0 || l.size > 0) && (o.forEach((f) => {
        f.clientID = n.clientID, f.collectionid == null && (f.collectionid = n.collectionid), n.subdocs.add(f);
      }), d.forEach((f) => n.subdocs.delete(f)), n.emit("subdocs", [{ loaded: l, added: o, removed: d }, n, t]), d.forEach((f) => f.destroy())), r.length <= e + 1 ? (n._transactionCleanups = [], n.emit("afterAllTransactions", [n, r])) : uc(r, e + 1);
    }
  }
}, ze = (r, e, t = null, n = !0) => {
  const s = r._transactionCleanups;
  let i = !1, a = null;
  r._transaction === null && (i = !0, r._transaction = new yp(r, t, n), s.push(r._transaction), s.length === 1 && r.emit("beforeAllTransactions", [r]), r.emit("beforeTransaction", [r._transaction, r]));
  try {
    a = e(r._transaction);
  } finally {
    if (i) {
      const o = r._transaction === s[0];
      r._transaction = null, o && uc(s, 0);
    }
  }
  return a;
};
class vp {
  /**
   * @param {DeleteSet} deletions
   * @param {DeleteSet} insertions
   */
  constructor(e, t) {
    this.insertions = t, this.deletions = e, this.meta = /* @__PURE__ */ new Map();
  }
}
const Eo = (r, e, t) => {
  _r(r, t.deletions, (n) => {
    n instanceof Pe && e.scope.some((s) => s === r.doc || Kn(
      /** @type {AbstractType<any>} */
      s,
      n
    )) && ta(n, !1);
  });
}, So = (r, e, t) => {
  let n = null;
  const s = r.doc, i = r.scope;
  ze(s, (o) => {
    for (; e.length > 0 && r.currStackItem === null; ) {
      const l = s.store, d = (
        /** @type {StackItem} */
        e.pop()
      ), f = /* @__PURE__ */ new Set(), g = [];
      let m = !1;
      _r(o, d.insertions, (u) => {
        if (u instanceof Pe) {
          if (u.redone !== null) {
            let { item: y, diff: w } = Ci(l, u.id);
            w > 0 && (y = ot(o, _e(y.id.client, y.id.clock + w))), u = y;
          }
          !u.deleted && i.some((y) => y === o.doc || Kn(
            /** @type {AbstractType<any>} */
            y,
            /** @type {Item} */
            u
          )) && g.push(u);
        }
      }), _r(o, d.deletions, (u) => {
        u instanceof Pe && i.some((y) => y === o.doc || Kn(
          /** @type {AbstractType<any>} */
          y,
          u
        )) && // Never redo structs in stackItem.insertions because they were created and deleted in the same capture interval.
        !an(d.insertions, u.id) && f.add(u);
      }), f.forEach((u) => {
        m = Bc(o, u, f, d.insertions, r.ignoreRemoteMapChanges, r) !== null || m;
      });
      for (let u = g.length - 1; u >= 0; u--) {
        const y = g[u];
        r.deleteFilter(y) && (y.delete(o), m = !0);
      }
      r.currStackItem = m ? d : null;
    }
    o.changed.forEach((l, d) => {
      l.has(null) && d._searchMarker && (d._searchMarker.length = 0);
    }), n = o;
  }, r);
  const a = r.currStackItem;
  if (a != null) {
    const o = n.changedParentTypes;
    r.emit("stack-item-popped", [{ stackItem: a, type: t, changedParentTypes: o, origin: r }, r]), r.currStackItem = null;
  }
  return a;
};
class sb extends wl {
  /**
   * @param {Doc|AbstractType<any>|Array<AbstractType<any>>} typeScope Limits the scope of the UndoManager. If this is set to a ydoc instance, all changes on that ydoc will be undone. If set to a specific type, only changes on that type or its children will be undone. Also accepts an array of types.
   * @param {UndoManagerOptions} options
   */
  constructor(e, {
    captureTimeout: t = 500,
    captureTransaction: n = (l) => !0,
    deleteFilter: s = () => !0,
    trackedOrigins: i = /* @__PURE__ */ new Set([null]),
    ignoreRemoteMapChanges: a = !1,
    doc: o = (
      /** @type {Doc} */
      Ar(e) ? e[0].doc : e instanceof sr ? e : e.doc
    )
  } = {}) {
    super(), this.scope = [], this.doc = o, this.addToScope(e), this.deleteFilter = s, i.add(this), this.trackedOrigins = i, this.captureTransaction = n, this.undoStack = [], this.redoStack = [], this.undoing = !1, this.redoing = !1, this.currStackItem = null, this.lastChange = 0, this.ignoreRemoteMapChanges = a, this.captureTimeout = t, this.afterTransactionHandler = (l) => {
      if (!this.captureTransaction(l) || !this.scope.some((A) => l.changedParentTypes.has(
        /** @type {AbstractType<any>} */
        A
      ) || A === this.doc) || !this.trackedOrigins.has(l.origin) && (!l.origin || !this.trackedOrigins.has(l.origin.constructor)))
        return;
      const d = this.undoing, f = this.redoing, g = d ? this.redoStack : this.undoStack;
      d ? this.stopCapturing() : f || this.clear(!1, !0);
      const m = new Br();
      l.afterState.forEach((A, k) => {
        const v = l.beforeState.get(k) || 0, N = A - v;
        N > 0 && Zr(m, k, v, N);
      });
      const u = Of();
      let y = !1;
      if (this.lastChange > 0 && u - this.lastChange < this.captureTimeout && g.length > 0 && !d && !f) {
        const A = g[g.length - 1];
        A.deletions = ki([A.deletions, l.deleteSet]), A.insertions = ki([A.insertions, m]);
      } else
        g.push(new vp(l.deleteSet, m)), y = !0;
      !d && !f && (this.lastChange = u), _r(
        l,
        l.deleteSet,
        /** @param {Item|GC} item */
        (A) => {
          A instanceof Pe && this.scope.some((k) => k === l.doc || Kn(
            /** @type {AbstractType<any>} */
            k,
            A
          )) && ta(A, !0);
        }
      );
      const w = [{ stackItem: g[g.length - 1], origin: l.origin, type: d ? "redo" : "undo", changedParentTypes: l.changedParentTypes }, this];
      y ? this.emit("stack-item-added", w) : this.emit("stack-item-updated", w);
    }, this.destroy = this.destroy.bind(this), this.doc.on("afterTransaction", this.afterTransactionHandler), this.doc.on("destroy", this.destroy);
  }
  /**
   * Extend the scope.
   *
   * @param {Array<AbstractType<any> | Doc> | AbstractType<any> | Doc} ytypes
   */
  addToScope(e) {
    const t = new Set(this.scope);
    e = Ar(e) ? e : [e], e.forEach((n) => {
      t.has(n) || (t.add(n), (n instanceof Je ? n.doc !== this.doc : n !== this.doc) && Jl("[yjs#509] Not same Y.Doc"), this.scope.push(n));
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
  clear(e = !0, t = !0) {
    (e && this.canUndo() || t && this.canRedo()) && this.doc.transact((n) => {
      e && (this.undoStack.forEach((s) => Eo(n, this, s)), this.undoStack = []), t && (this.redoStack.forEach((s) => Eo(n, this, s)), this.redoStack = []), this.emit("stack-cleared", [{ undoStackCleared: e, redoStackCleared: t }]);
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
      e = So(this, this.undoStack, "undo");
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
      e = So(this, this.redoStack, "redo");
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
function* Ip(r) {
  const e = Ce(r.restDecoder);
  for (let t = 0; t < e; t++) {
    const n = Ce(r.restDecoder), s = r.readClient();
    let i = Ce(r.restDecoder);
    for (let a = 0; a < n; a++) {
      const o = r.readInfo();
      if (o === 10) {
        const l = Ce(r.restDecoder);
        yield new mt(_e(s, i), l), i += l;
      } else if ((cs & o) !== 0) {
        const l = (o & (Mt | ut)) === 0, d = new Pe(
          _e(s, i),
          null,
          // left
          (o & ut) === ut ? r.readLeftID() : null,
          // origin
          null,
          // right
          (o & Mt) === Mt ? r.readRightID() : null,
          // right origin
          // @ts-ignore Force writing a string here.
          l ? r.readParentInfo() ? r.readString() : r.readLeftID() : null,
          // parent
          l && (o & jr) === jr ? r.readString() : null,
          // parentSub
          xc(r, o)
          // item content
        );
        yield d, i += d.length;
      } else {
        const l = r.readLen();
        yield new pt(_e(s, i), l), i += l;
      }
    }
  }
}
class Vi {
  /**
   * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
   * @param {boolean} filterSkips
   */
  constructor(e, t) {
    this.gen = Ip(e), this.curr = null, this.done = !1, this.filterSkips = t, this.next();
  }
  /**
   * @return {Item | GC | Skip |null}
   */
  next() {
    do
      this.curr = this.gen.next().value || null;
    while (this.filterSkips && this.curr !== null && this.curr.constructor === mt);
    return this.curr;
  }
}
class Wi {
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  constructor(e) {
    this.currClient = 0, this.startClock = 0, this.written = 0, this.encoder = e, this.clientStructs = [];
  }
}
const Cp = (r) => Yn(r, Yl, on), Ep = (r, e) => {
  if (r.constructor === pt) {
    const { client: t, clock: n } = r.id;
    return new pt(_e(t, n + e), r.length - e);
  } else if (r.constructor === mt) {
    const { client: t, clock: n } = r.id;
    return new mt(_e(t, n + e), r.length - e);
  } else {
    const t = (
      /** @type {Item} */
      r
    ), { client: n, clock: s } = t.id;
    return new Pe(
      _e(n, s + e),
      null,
      _e(n, s + e - 1),
      null,
      t.rightOrigin,
      t.parent,
      t.parentSub,
      t.content.splice(e)
    );
  }
}, Yn = (r, e = vr, t = Kt) => {
  if (r.length === 1)
    return r[0];
  const n = r.map((f) => new e(Sr(f)));
  let s = n.map((f) => new Vi(f, !0)), i = null;
  const a = new t(), o = new Wi(a);
  for (; s = s.filter((m) => m.curr !== null), s.sort(
    /** @type {function(any,any):number} */
    (m, u) => {
      if (m.curr.id.client === u.curr.id.client) {
        const y = m.curr.id.clock - u.curr.id.clock;
        return y === 0 ? m.curr.constructor === u.curr.constructor ? 0 : m.curr.constructor === mt ? 1 : -1 : y;
      } else
        return u.curr.id.client - m.curr.id.client;
    }
  ), s.length !== 0; ) {
    const f = s[0], g = (
      /** @type {Item | GC} */
      f.curr.id.client
    );
    if (i !== null) {
      let m = (
        /** @type {Item | GC | null} */
        f.curr
      ), u = !1;
      for (; m !== null && m.id.clock + m.length <= i.struct.id.clock + i.struct.length && m.id.client >= i.struct.id.client; )
        m = f.next(), u = !0;
      if (m === null || // current decoder is empty
      m.id.client !== g || // check whether there is another decoder that has has updates from `firstClient`
      u && m.id.clock > i.struct.id.clock + i.struct.length)
        continue;
      if (g !== i.struct.id.client)
        Ot(o, i.struct, i.offset), i = { struct: m, offset: 0 }, f.next();
      else if (i.struct.id.clock + i.struct.length < m.id.clock)
        if (i.struct.constructor === mt)
          i.struct.length = m.id.clock + m.length - i.struct.id.clock;
        else {
          Ot(o, i.struct, i.offset);
          const y = m.id.clock - i.struct.id.clock - i.struct.length;
          i = { struct: new mt(_e(g, i.struct.id.clock + i.struct.length), y), offset: 0 };
        }
      else {
        const y = i.struct.id.clock + i.struct.length - m.id.clock;
        y > 0 && (i.struct.constructor === mt ? i.struct.length -= y : m = Ep(m, y)), i.struct.mergeWith(
          /** @type {any} */
          m
        ) || (Ot(o, i.struct, i.offset), i = { struct: m, offset: 0 }, f.next());
      }
    } else
      i = { struct: (
        /** @type {Item | GC} */
        f.curr
      ), offset: 0 }, f.next();
    for (let m = f.curr; m !== null && m.id.client === g && m.id.clock === i.struct.id.clock + i.struct.length && m.constructor !== mt; m = f.next())
      Ot(o, i.struct, i.offset), i = { struct: m, offset: 0 };
  }
  i !== null && (Ot(o, i.struct, i.offset), i = null), Xi(o);
  const l = n.map((f) => Gi(f)), d = ki(l);
  return xr(a, d), a.toUint8Array();
}, Sp = (r, e, t = vr, n = Kt) => {
  const s = nc(e), i = new n(), a = new Wi(i), o = new t(Sr(r)), l = new Vi(o, !1);
  for (; l.curr; ) {
    const f = l.curr, g = f.id.client, m = s.get(g) || 0;
    if (l.curr.constructor === mt) {
      l.next();
      continue;
    }
    if (f.id.clock + f.length > m)
      for (Ot(a, f, nr(m - f.id.clock, 0)), l.next(); l.curr && l.curr.id.client === g; )
        Ot(a, l.curr, 0), l.next();
    else
      for (; l.curr && l.curr.id.client === g && l.curr.id.clock + l.curr.length <= m; )
        l.next();
  }
  Xi(a);
  const d = Gi(o);
  return xr(i, d), i.toUint8Array();
}, hc = (r) => {
  r.written > 0 && (r.clientStructs.push({ written: r.written, restEncoder: vt(r.encoder.restEncoder) }), r.encoder.restEncoder = ds(), r.written = 0);
}, Ot = (r, e, t) => {
  r.written > 0 && r.currClient !== e.id.client && hc(r), r.written === 0 && (r.currClient = e.id.client, r.encoder.writeClient(e.id.client), Se(r.encoder.restEncoder, e.id.clock + t)), e.write(r.encoder, t), r.written++;
}, Xi = (r) => {
  hc(r);
  const e = r.encoder.restEncoder;
  Se(e, r.clientStructs.length);
  for (let t = 0; t < r.clientStructs.length; t++) {
    const n = r.clientStructs[t];
    Se(e, n.written), us(e, n.restEncoder);
  }
}, Np = (r, e, t, n) => {
  const s = new t(Sr(r)), i = new Vi(s, !1), a = new n(), o = new Wi(a);
  for (let d = i.curr; d !== null; d = i.next())
    Ot(o, e(d), 0);
  Xi(o);
  const l = Gi(s);
  return xr(a, l), a.toUint8Array();
}, Bp = (r) => Np(r, Kf, vr, on), No = "You must not compute changes after the event-handler fired.";
class ks {
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
    return this._path || (this._path = xp(this.currentTarget, this.target));
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
    return an(this.transaction.deleteSet, e.id);
  }
  /**
   * @type {Map<string, { action: 'add' | 'update' | 'delete', oldValue: any }>}
   */
  get keys() {
    if (this._keys === null) {
      if (this.transaction.doc._transactionCleanups.length === 0)
        throw Ct(No);
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
                a = "delete", o = Ks(l.content.getContent());
              else
                return;
            else
              l !== null && this.deletes(l) ? (a = "update", o = Ks(l.content.getContent())) : (a = "add", o = void 0);
          } else if (this.deletes(i))
            a = "delete", o = Ks(
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
        throw Ct(No);
      const t = this.target, n = wr(), s = wr(), i = [];
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
        for (let d = t._start; d !== null; d = d.right)
          d.deleted ? this.deletes(d) && !this.adds(d) && ((o === null || o.delete === void 0) && (l(), o = { delete: 0 }), o.delete += d.length, s.add(d)) : this.adds(d) ? ((o === null || o.insert === void 0) && (l(), o = { insert: [] }), o.insert = o.insert.concat(d.content.getContent()), n.add(d)) : ((o === null || o.retain === void 0) && (l(), o = { retain: 0 }), o.retain += d.length);
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
const xp = (r, e) => {
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
  Jl("Invalid access: Add Yjs type to a document before reading data.");
}, fc = 80;
let Zi = 0;
class Dp {
  /**
   * @param {Item} p
   * @param {number} index
   */
  constructor(e, t) {
    e.marker = !0, this.p = e, this.index = t, this.timestamp = Zi++;
  }
}
const Mp = (r) => {
  r.timestamp = Zi++;
}, gc = (r, e, t) => {
  r.p.marker = !1, r.p = e, e.marker = !0, r.index = t, r.timestamp = Zi++;
}, Rp = (r, e, t) => {
  if (r.length >= fc) {
    const n = r.reduce((s, i) => s.timestamp < i.timestamp ? s : i);
    return gc(n, e, t), n;
  } else {
    const n = new Dp(e, t);
    return r.push(n), n;
  }
}, _s = (r, e) => {
  if (r._start === null || e === 0 || r._searchMarker === null)
    return null;
  const t = r._searchMarker.length === 0 ? null : r._searchMarker.reduce((i, a) => Tn(e - i.index) < Tn(e - a.index) ? i : a);
  let n = r._start, s = 0;
  for (t !== null && (n = t.p, s = t.index, Mp(t)); n.right !== null && s < e; ) {
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
  return t !== null && Tn(t.index - s) < /** @type {YText|YArray<any>} */
  n.parent.length / fc ? (gc(t, n, s), t) : Rp(r._searchMarker, n, s);
}, Kr = (r, e, t) => {
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
    (e < s.index || t > 0 && e === s.index) && (s.index = nr(e, s.index + t));
  }
}, vs = (r, e, t) => {
  const n = r, s = e.changedParentTypes;
  for (; Gt(s, r, () => []).push(t), r._item !== null; )
    r = /** @type {AbstractType<any>} */
    r._item.parent;
  ic(n._eH, t, e);
};
class Je {
  constructor() {
    this._item = null, this._map = /* @__PURE__ */ new Map(), this._start = null, this.doc = null, this._length = 0, this._eH = yo(), this._dEH = yo(), this._searchMarker = null;
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
    throw yt();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {AbstractType<EventType>}
   */
  clone() {
    throw yt();
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
    ko(this._eH, e);
  }
  /**
   * Observe all events that are created by this type and its children.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  observeDeep(e) {
    ko(this._dEH, e);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(EventType,Transaction):void} f Observer function
   */
  unobserve(e) {
    _o(this._eH, e);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  unobserveDeep(e) {
    _o(this._dEH, e);
  }
  /**
   * @abstract
   * @return {any}
   */
  toJSON() {
  }
}
const pc = (r, e, t) => {
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
}, mc = (r) => {
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
}, ib = (r, e) => {
  const t = [];
  let n = r._start;
  for (; n !== null; ) {
    if (n.countable && Xt(n, e)) {
      const s = n.content.getContent();
      for (let i = 0; i < s.length; i++)
        t.push(s[i]);
    }
    n = n.right;
  }
  return t;
}, Yr = (r, e) => {
  let t = 0, n = r._start;
  for (r.doc ?? tt(); n !== null; ) {
    if (n.countable && !n.deleted) {
      const s = n.content.getContent();
      for (let i = 0; i < s.length; i++)
        e(s[i], t++, r);
    }
    n = n.right;
  }
}, bc = (r, e) => {
  const t = [];
  return Yr(r, (n, s) => {
    t.push(e(n, s, r));
  }), t;
}, zp = (r) => {
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
}, wc = (r, e) => {
  r.doc ?? tt();
  const t = _s(r, e);
  let n = r._start;
  for (t !== null && (n = t.p, e -= t.index); n !== null; n = n.right)
    if (!n.deleted && n.countable) {
      if (e < n.length)
        return n.content.getContent()[e];
      e -= n.length;
    }
}, es = (r, e, t, n) => {
  let s = t;
  const i = r.doc, a = i.clientID, o = i.store, l = t === null ? e._start : t.right;
  let d = [];
  const f = () => {
    d.length > 0 && (s = new Pe(_e(a, $e(o, a)), s, s && s.lastId, l, l && l.id, e, null, new er(d)), s.integrate(r, 0), d = []);
  };
  n.forEach((g) => {
    if (g === null)
      d.push(g);
    else
      switch (g.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
          d.push(g);
          break;
        default:
          switch (f(), g.constructor) {
            case Uint8Array:
            case ArrayBuffer:
              s = new Pe(_e(a, $e(o, a)), s, s && s.lastId, l, l && l.id, e, null, new cn(new Uint8Array(
                /** @type {Uint8Array} */
                g
              ))), s.integrate(r, 0);
              break;
            case sr:
              s = new Pe(_e(a, $e(o, a)), s, s && s.lastId, l, l && l.id, e, null, new dn(
                /** @type {Doc} */
                g
              )), s.integrate(r, 0);
              break;
            default:
              if (g instanceof Je)
                s = new Pe(_e(a, $e(o, a)), s, s && s.lastId, l, l && l.id, e, null, new Nt(g)), s.integrate(r, 0);
              else
                throw new Error("Unexpected content type in insert operation");
          }
      }
  }), f();
}, Ac = () => Ct("Length exceeded!"), yc = (r, e, t, n) => {
  if (t > e._length)
    throw Ac();
  if (t === 0)
    return e._searchMarker && Kr(e._searchMarker, t, n.length), es(r, e, null, n);
  const s = t, i = _s(e, t);
  let a = e._start;
  for (i !== null && (a = i.p, t -= i.index, t === 0 && (a = a.prev, t += a && a.countable && !a.deleted ? a.length : 0)); a !== null; a = a.right)
    if (!a.deleted && a.countable) {
      if (t <= a.length) {
        t < a.length && ot(r, _e(a.id.client, a.id.clock + t));
        break;
      }
      t -= a.length;
    }
  return e._searchMarker && Kr(e._searchMarker, s, n.length), es(r, e, a, n);
}, Pp = (r, e, t) => {
  let s = (e._searchMarker || []).reduce((i, a) => a.index > i.index ? a : i, { index: 0, p: e._start }).p;
  if (s)
    for (; s.right; )
      s = s.right;
  return es(r, e, s, t);
}, kc = (r, e, t, n) => {
  if (n === 0)
    return;
  const s = t, i = n, a = _s(e, t);
  let o = e._start;
  for (a !== null && (o = a.p, t -= a.index); o !== null && t > 0; o = o.right)
    !o.deleted && o.countable && (t < o.length && ot(r, _e(o.id.client, o.id.clock + t)), t -= o.length);
  for (; n > 0 && o !== null; )
    o.deleted || (n < o.length && ot(r, _e(o.id.client, o.id.clock + n)), o.delete(r), n -= o.length), o = o.right;
  if (n > 0)
    throw Ac();
  e._searchMarker && Kr(
    e._searchMarker,
    s,
    -i + n
    /* in case we remove the above exception */
  );
}, ts = (r, e, t) => {
  const n = e._map.get(t);
  n !== void 0 && n.delete(r);
}, Ki = (r, e, t, n) => {
  const s = e._map.get(t) || null, i = r.doc, a = i.clientID;
  let o;
  if (n == null)
    o = new er([n]);
  else
    switch (n.constructor) {
      case Number:
      case Object:
      case Boolean:
      case Array:
      case String:
      case Date:
      case BigInt:
        o = new er([n]);
        break;
      case Uint8Array:
        o = new cn(
          /** @type {Uint8Array} */
          n
        );
        break;
      case sr:
        o = new dn(
          /** @type {Doc} */
          n
        );
        break;
      default:
        if (n instanceof Je)
          o = new Nt(n);
        else
          throw new Error("Unexpected content type");
    }
  new Pe(_e(a, $e(i.store, a)), s, s && s.lastId, null, null, e, t, o).integrate(r, 0);
}, Yi = (r, e) => {
  r.doc ?? tt();
  const t = r._map.get(e);
  return t !== void 0 && !t.deleted ? t.content.getContent()[t.length - 1] : void 0;
}, _c = (r) => {
  const e = {};
  return r.doc ?? tt(), r._map.forEach((t, n) => {
    t.deleted || (e[n] = t.content.getContent()[t.length - 1]);
  }), e;
}, vc = (r, e) => {
  r.doc ?? tt();
  const t = r._map.get(e);
  return t !== void 0 && !t.deleted;
}, Fp = (r, e) => {
  const t = {};
  return r._map.forEach((n, s) => {
    let i = n;
    for (; i !== null && (!e.sv.has(i.id.client) || i.id.clock >= (e.sv.get(i.id.client) || 0)); )
      i = i.left;
    i !== null && Xt(i, e) && (t[s] = i.content.getContent()[i.length - 1]);
  }), t;
}, Bn = (r) => (r.doc ?? tt(), Xg(
  r._map.entries(),
  /** @param {any} entry */
  (e) => !e[1].deleted
));
class Tp extends ks {
}
class br extends Je {
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
    const t = new br();
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
    return new br();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YArray<T>}
   */
  clone() {
    const e = new br();
    return e.insert(0, this.toArray().map(
      (t) => t instanceof Je ? (
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
    super._callObserver(e, t), vs(this, e, new Tp(this, e));
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
      yc(
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
      Pp(
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
      kc(n, this, e, t);
    }) : this._prelimContent.splice(e, t);
  }
  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {T}
   */
  get(e) {
    return wc(this, e);
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<T>}
   */
  toArray() {
    return mc(this);
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
    return pc(this, e, t);
  }
  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Array<any>}
   */
  toJSON() {
    return this.map((e) => e instanceof Je ? e.toJSON() : e);
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
    return bc(
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
    Yr(this, e);
  }
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return zp(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef(lm);
  }
}
const Qp = (r) => new br();
class Lp extends ks {
  /**
   * @param {YMap<T>} ymap The YArray that changed.
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed.
   */
  constructor(e, t, n) {
    super(e, t), this.keysChanged = n;
  }
}
class Ir extends Je {
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
    return new Ir();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YMap<MapType>}
   */
  clone() {
    const e = new Ir();
    return this.forEach((t, n) => {
      e.set(n, t instanceof Je ? (
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
    vs(this, e, new Lp(this, e, t));
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
        e[n] = s instanceof Je ? s.toJSON() : s;
      }
    }), e;
  }
  /**
   * Returns the size of the YMap (count of key/value pairs)
   *
   * @return {number}
   */
  get size() {
    return [...Bn(this)].length;
  }
  /**
   * Returns the keys for each element in the YMap Type.
   *
   * @return {IterableIterator<string>}
   */
  keys() {
    return ii(
      Bn(this),
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
    return ii(
      Bn(this),
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
    return ii(
      Bn(this),
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
      ts(t, this, e);
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
      Ki(
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
      Yi(this, e)
    );
  }
  /**
   * Returns a boolean indicating whether the specified key exists or not.
   *
   * @param {string} key The key to test.
   * @return {boolean}
   */
  has(e) {
    return vc(this, e);
  }
  /**
   * Removes all elements from this YMap.
   */
  clear() {
    this.doc !== null ? ze(this.doc, (e) => {
      this.forEach(function(t, n, s) {
        ts(e, s, n);
      });
    }) : this._prelimContent.clear();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef(cm);
  }
}
const Up = (r) => new Ir(), Ht = (r, e) => r === e || typeof r == "object" && typeof e == "object" && r && e && Xf(r, e);
class Ii {
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
    this.right === null && ht(), this.right.content.constructor === qe ? this.right.deleted || Dr(
      this.currentAttributes,
      /** @type {ContentFormat} */
      this.right.content
    ) : this.right.deleted || (this.index += this.right.length), this.left = this.right, this.right = this.right.right;
  }
}
const Bo = (r, e, t) => {
  for (; e.right !== null && t > 0; )
    e.right.content.constructor === qe ? e.right.deleted || Dr(
      e.currentAttributes,
      /** @type {ContentFormat} */
      e.right.content
    ) : e.right.deleted || (t < e.right.length && ot(r, _e(e.right.id.client, e.right.id.clock + t)), e.index += e.right.length, t -= e.right.length), e.left = e.right, e.right = e.right.right;
  return e;
}, xn = (r, e, t, n) => {
  const s = /* @__PURE__ */ new Map(), i = n ? _s(e, t) : null;
  if (i) {
    const a = new Ii(i.p.left, i.p, i.index, s);
    return Bo(r, a, t - i.index);
  } else {
    const a = new Ii(null, e._start, 0, s);
    return Bo(r, a, t);
  }
}, Ic = (r, e, t, n) => {
  for (; t.right !== null && (t.right.deleted === !0 || t.right.content.constructor === qe && Ht(
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
    const l = t.left, d = t.right, f = new Pe(_e(i, $e(s.store, i)), l, l && l.lastId, d, d && d.id, e, null, new qe(o, a));
    f.integrate(r, 0), t.right = f, t.forward();
  });
}, Dr = (r, e) => {
  const { key: t, value: n } = e;
  n === null ? r.delete(t) : r.set(t, n);
}, Cc = (r, e) => {
  for (; r.right !== null; ) {
    if (!(r.right.deleted || r.right.content.constructor === qe && Ht(
      e[
        /** @type {ContentFormat} */
        r.right.content.key
      ] ?? null,
      /** @type {ContentFormat} */
      r.right.content.value
    ))) break;
    r.forward();
  }
}, Ec = (r, e, t, n) => {
  const s = r.doc, i = s.clientID, a = /* @__PURE__ */ new Map();
  for (const o in n) {
    const l = n[o], d = t.currentAttributes.get(o) ?? null;
    if (!Ht(d, l)) {
      a.set(o, d);
      const { left: f, right: g } = t;
      t.right = new Pe(_e(i, $e(s.store, i)), f, f && f.lastId, g, g && g.id, e, null, new qe(o, l)), t.right.integrate(r, 0), t.forward();
    }
  }
  return a;
}, ai = (r, e, t, n, s) => {
  t.currentAttributes.forEach((m, u) => {
    s[u] === void 0 && (s[u] = null);
  });
  const i = r.doc, a = i.clientID;
  Cc(t, s);
  const o = Ec(r, e, t, s), l = n.constructor === String ? new St(
    /** @type {string} */
    n
  ) : n instanceof Je ? new Nt(n) : new ir(n);
  let { left: d, right: f, index: g } = t;
  e._searchMarker && Kr(e._searchMarker, t.index, l.getLength()), f = new Pe(_e(a, $e(i.store, a)), d, d && d.lastId, f, f && f.id, e, null, l), f.integrate(r, 0), t.right = f, t.index = g, t.forward(), Ic(r, e, t, o);
}, xo = (r, e, t, n, s) => {
  const i = r.doc, a = i.clientID;
  Cc(t, s);
  const o = Ec(r, e, t, s);
  e: for (; t.right !== null && (n > 0 || o.size > 0 && (t.right.deleted || t.right.content.constructor === qe)); ) {
    if (!t.right.deleted)
      switch (t.right.content.constructor) {
        case qe: {
          const { key: l, value: d } = (
            /** @type {ContentFormat} */
            t.right.content
          ), f = s[l];
          if (f !== void 0) {
            if (Ht(f, d))
              o.delete(l);
            else {
              if (n === 0)
                break e;
              o.set(l, d);
            }
            t.right.delete(r);
          } else
            t.currentAttributes.set(l, d);
          break;
        }
        default:
          n < t.right.length && ot(r, _e(t.right.id.client, t.right.id.clock + n)), n -= t.right.length;
          break;
      }
    t.forward();
  }
  if (n > 0) {
    let l = "";
    for (; n > 0; n--)
      l += `
`;
    t.right = new Pe(_e(a, $e(i.store, a)), t.left, t.left && t.left.lastId, t.right, t.right && t.right.id, e, null, new St(l)), t.right.integrate(r, 0), t.forward();
  }
  Ic(r, e, t, o);
}, Sc = (r, e, t, n, s) => {
  let i = e;
  const a = At();
  for (; i && (!i.countable || i.deleted); ) {
    if (!i.deleted && i.content.constructor === qe) {
      const d = (
        /** @type {ContentFormat} */
        i.content
      );
      a.set(d.key, d);
    }
    i = i.right;
  }
  let o = 0, l = !1;
  for (; e !== i; ) {
    if (t === e && (l = !0), !e.deleted) {
      const d = e.content;
      if (d.constructor === qe) {
        const { key: f, value: g } = (
          /** @type {ContentFormat} */
          d
        ), m = n.get(f) ?? null;
        (a.get(f) !== d || m === g) && (e.delete(r), o++, !l && (s.get(f) ?? null) === g && m !== g && (m === null ? s.delete(f) : s.set(f, m))), !l && !e.deleted && Dr(
          s,
          /** @type {ContentFormat} */
          d
        );
      }
    }
    e = /** @type {Item} */
    e.right;
  }
  return o;
}, Op = (r, e) => {
  for (; e && e.right && (e.right.deleted || !e.right.countable); )
    e = e.right;
  const t = /* @__PURE__ */ new Set();
  for (; e && (e.deleted || !e.countable); ) {
    if (!e.deleted && e.content.constructor === qe) {
      const n = (
        /** @type {ContentFormat} */
        e.content.key
      );
      t.has(n) ? e.delete(r) : t.add(n);
    }
    e = e.left;
  }
}, $p = (r) => {
  let e = 0;
  return ze(
    /** @type {Doc} */
    r.doc,
    (t) => {
      let n = (
        /** @type {Item} */
        r._start
      ), s = r._start, i = At();
      const a = pi(i);
      for (; s; )
        s.deleted === !1 && (s.content.constructor === qe ? Dr(
          a,
          /** @type {ContentFormat} */
          s.content
        ) : (e += Sc(t, n, s, i, a), i = pi(a), n = s)), s = s.right;
    }
  ), e;
}, Hp = (r) => {
  const e = /* @__PURE__ */ new Set(), t = r.doc;
  for (const [n, s] of r.afterState.entries()) {
    const i = r.beforeState.get(n) || 0;
    s !== i && dc(
      r,
      /** @type {Array<Item|GC>} */
      t.store.clients.get(n),
      i,
      s,
      (a) => {
        !a.deleted && /** @type {Item} */
        a.content.constructor === qe && a.constructor !== pt && e.add(
          /** @type {any} */
          a.parent
        );
      }
    );
  }
  ze(t, (n) => {
    _r(r, r.deleteSet, (s) => {
      if (s instanceof pt || !/** @type {YText} */
      s.parent._hasFormatting || e.has(
        /** @type {YText} */
        s.parent
      ))
        return;
      const i = (
        /** @type {YText} */
        s.parent
      );
      s.content.constructor === qe ? e.add(i) : Op(n, s);
    });
    for (const s of e)
      $p(s);
  });
}, Do = (r, e, t) => {
  const n = t, s = pi(e.currentAttributes), i = e.right;
  for (; t > 0 && e.right !== null; ) {
    if (e.right.deleted === !1)
      switch (e.right.content.constructor) {
        case Nt:
        case ir:
        case St:
          t < e.right.length && ot(r, _e(e.right.id.client, e.right.id.clock + t)), t -= e.right.length, e.right.delete(r);
          break;
      }
    e.forward();
  }
  i && Sc(r, i, e.right, s, e.currentAttributes);
  const a = (
    /** @type {AbstractType<any>} */
    /** @type {Item} */
    (e.left || e.right).parent
  );
  return a._searchMarker && Kr(a._searchMarker, e.index, -n + t), e;
};
class jp extends ks {
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
        let d = "", f = 0, g = 0;
        const m = () => {
          if (o !== null) {
            let u = null;
            switch (o) {
              case "delete":
                g > 0 && (u = { delete: g }), g = 0;
                break;
              case "insert":
                (typeof d == "object" || d.length > 0) && (u = { insert: d }, s.size > 0 && (u.attributes = {}, s.forEach((y, w) => {
                  y !== null && (u.attributes[w] = y);
                }))), d = "";
                break;
              case "retain":
                f > 0 && (u = { retain: f }, Wf(l) || (u.attributes = Gf({}, l))), f = 0;
                break;
            }
            u && t.push(u), o = null;
          }
        };
        for (; a !== null; ) {
          switch (a.content.constructor) {
            case Nt:
            case ir:
              this.adds(a) ? this.deletes(a) || (m(), o = "insert", d = a.content.getContent()[0], m()) : this.deletes(a) ? (o !== "delete" && (m(), o = "delete"), g += 1) : a.deleted || (o !== "retain" && (m(), o = "retain"), f += 1);
              break;
            case St:
              this.adds(a) ? this.deletes(a) || (o !== "insert" && (m(), o = "insert"), d += /** @type {ContentString} */
              a.content.str) : this.deletes(a) ? (o !== "delete" && (m(), o = "delete"), g += a.length) : a.deleted || (o !== "retain" && (m(), o = "retain"), f += a.length);
              break;
            case qe: {
              const { key: u, value: y } = (
                /** @type {ContentFormat} */
                a.content
              );
              if (this.adds(a)) {
                if (!this.deletes(a)) {
                  const w = s.get(u) ?? null;
                  Ht(w, y) ? y !== null && a.delete(n) : (o === "retain" && m(), Ht(y, i.get(u) ?? null) ? delete l[u] : l[u] = y);
                }
              } else if (this.deletes(a)) {
                i.set(u, y);
                const w = s.get(u) ?? null;
                Ht(w, y) || (o === "retain" && m(), l[u] = w);
              } else if (!a.deleted) {
                i.set(u, y);
                const w = l[u];
                w !== void 0 && (Ht(w, y) ? w !== null && a.delete(n) : (o === "retain" && m(), y === null ? delete l[u] : l[u] = y));
              }
              a.deleted || (o === "insert" && m(), Dr(
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
class Cr extends Je {
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
    return new Cr();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YText}
   */
  clone() {
    const e = new Cr();
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
    const n = new jp(this, e, t);
    vs(this, e, n), !e.local && this._hasFormatting && (e._needFormattingCleanup = !0);
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
      !t.deleted && t.countable && t.content.constructor === St && (e += /** @type {ContentString} */
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
      const s = new Ii(null, this._start, 0, /* @__PURE__ */ new Map());
      for (let i = 0; i < e.length; i++) {
        const a = e[i];
        if (a.insert !== void 0) {
          const o = !t && typeof a.insert == "string" && i === e.length - 1 && s.right === null && a.insert.slice(-1) === `
` ? a.insert.slice(0, -1) : a.insert;
          (typeof o != "string" || o.length > 0) && ai(n, this, s, o, a.attributes || {});
        } else a.retain !== void 0 ? xo(n, this, s, a.retain, a.attributes || {}) : a.delete !== void 0 && Do(n, s, a.delete);
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
    function d() {
      if (o.length > 0) {
        const g = {};
        let m = !1;
        i.forEach((y, w) => {
          m = !0, g[w] = y;
        });
        const u = { insert: o };
        m && (u.attributes = g), s.push(u), o = "";
      }
    }
    const f = () => {
      for (; l !== null; ) {
        if (Xt(l, e) || t !== void 0 && Xt(l, t))
          switch (l.content.constructor) {
            case St: {
              const g = i.get("ychange");
              e !== void 0 && !Xt(l, e) ? (g === void 0 || g.user !== l.id.client || g.type !== "removed") && (d(), i.set("ychange", n ? n("removed", l.id) : { type: "removed" })) : t !== void 0 && !Xt(l, t) ? (g === void 0 || g.user !== l.id.client || g.type !== "added") && (d(), i.set("ychange", n ? n("added", l.id) : { type: "added" })) : g !== void 0 && (d(), i.delete("ychange")), o += /** @type {ContentString} */
              l.content.str;
              break;
            }
            case Nt:
            case ir: {
              d();
              const g = {
                insert: l.content.getContent()[0]
              };
              if (i.size > 0) {
                const m = (
                  /** @type {Object<string,any>} */
                  {}
                );
                g.attributes = m, i.forEach((u, y) => {
                  m[y] = u;
                });
              }
              s.push(g);
              break;
            }
            case qe:
              Xt(l, e) && (d(), Dr(
                i,
                /** @type {ContentFormat} */
                l.content
              ));
              break;
          }
        l = l.right;
      }
      d();
    };
    return e || t ? ze(a, (g) => {
      e && _i(g, e), t && _i(g, t), f();
    }, "cleanup") : f(), s;
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
      const a = xn(i, this, e, !n);
      n || (n = {}, a.currentAttributes.forEach((o, l) => {
        n[l] = o;
      })), ai(i, this, a, t, n);
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
      const a = xn(i, this, e, !n);
      ai(i, this, a, t, n || {});
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
      Do(s, xn(s, this, e, !0), t);
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
      const a = xn(i, this, e, !1);
      a.right !== null && xo(i, this, a, t, n);
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
      ts(t, this, e);
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
      Ki(n, this, e, t);
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
      Yi(this, e)
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
    return _c(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef(dm);
  }
}
const qp = (r) => new Cr();
class oi {
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
        e.content.type, !e.deleted && (t.constructor === Er || t.constructor === Yt) && t._start !== null)
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
class Yt extends Je {
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
    return new Yt();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlFragment}
   */
  clone() {
    const e = new Yt();
    return e.insert(0, this.toArray().map((t) => t instanceof Je ? t.clone() : t)), e;
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
    return new oi(this, e);
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
    const n = new oi(this, (s) => s.nodeName && s.nodeName.toUpperCase() === e).next();
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
    return e = e.toUpperCase(), qt(new oi(this, (t) => t.nodeName && t.nodeName.toUpperCase() === e));
  }
  /**
   * Creates YXmlEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, t) {
    vs(this, e, new Vp(this, t, e));
  }
  /**
   * Get the string representation of all the children of this YXmlFragment.
   *
   * @return {string} The string representation of all children.
   */
  toString() {
    return bc(this, (e) => e.toString()).join("");
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
    return n !== void 0 && n._createAssociation(s, this), Yr(this, (i) => {
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
      yc(n, this, e, t);
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
        const s = e && e instanceof Je ? e._item : e;
        es(n, this, s, t);
      });
    else {
      const n = (
        /** @type {Array<any>} */
        this._prelimContent
      ), s = e === null ? 0 : n.findIndex((i) => i === e) + 1;
      if (s === 0 && e !== null)
        throw Ct("Reference item not found");
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
      kc(n, this, e, t);
    }) : this._prelimContent.splice(e, t);
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<YXmlElement|YXmlText|YXmlHook>}
   */
  toArray() {
    return mc(this);
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
    return wc(this, e);
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
    return pc(this, e, t);
  }
  /**
   * Executes a provided function on once on every child element.
   *
   * @param {function(YXmlElement|YXmlText,number, typeof self):void} f A function to execute on every element of this YArray.
   */
  forEach(e) {
    Yr(this, e);
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
    e.writeTypeRef(hm);
  }
}
const Gp = (r) => new Yt();
class Er extends Yt {
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
    return new Er(this.nodeName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlElement<KV>}
   */
  clone() {
    const e = new Er(this.nodeName), t = this.getAttributes();
    return Vf(t, (n, s) => {
      e.setAttribute(
        s,
        /** @type {any} */
        n
      );
    }), e.insert(0, this.toArray().map((n) => n instanceof Je ? n.clone() : n)), e;
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
      ts(t, this, e);
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
      Ki(n, this, e, t);
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
      Yi(this, e)
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
      vc(this, e)
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
      e ? Fp(this, e) : _c(this)
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
    return Yr(this, (a) => {
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
    e.writeTypeRef(um), e.writeKey(this.nodeName);
  }
}
const Jp = (r) => new Er(r.readKey());
class Vp extends ks {
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
class rs extends Ir {
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
    return new rs(this.hookName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlHook}
   */
  clone() {
    const e = new rs(this.hookName);
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
    e.writeTypeRef(fm), e.writeKey(this.hookName);
  }
}
const Wp = (r) => new rs(r.readKey());
class ns extends Cr {
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
    return new ns();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlText}
   */
  clone() {
    const e = new ns();
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
    e.writeTypeRef(gm);
  }
}
const Xp = (r) => new ns();
class ea {
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
    throw yt();
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
    throw yt();
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(e, t) {
    throw yt();
  }
}
const Zp = 0;
class pt extends ea {
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
    t > 0 && (this.id.clock += t, this.length -= t), cc(e.doc.store, this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, t) {
    e.writeInfo(Zp), e.writeLen(this.length - t);
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
class cn {
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
    return new cn(this.content);
  }
  /**
   * @param {number} offset
   * @return {ContentBinary}
   */
  splice(e) {
    throw yt();
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
const Kp = (r) => new cn(r.readBuf());
class en {
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
    return new en(this.len);
  }
  /**
   * @param {number} offset
   * @return {ContentDeleted}
   */
  splice(e) {
    const t = new en(this.len - e);
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
    Zr(e.deleteSet, t.id.client, t.id.clock, this.len), t.markDeleted();
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
const Yp = (r) => new en(r.readLen()), Nc = (r, e) => new sr({ guid: r, ...e, shouldLoad: e.shouldLoad || e.autoLoad || !1 });
class dn {
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
    return new dn(Nc(this.doc.guid, this.opts));
  }
  /**
   * @param {number} offset
   * @return {ContentDoc}
   */
  splice(e) {
    throw yt();
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
const em = (r) => new dn(Nc(r.readString(), r.readAny()));
class ir {
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
    return new ir(this.embed);
  }
  /**
   * @param {number} offset
   * @return {ContentEmbed}
   */
  splice(e) {
    throw yt();
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
const tm = (r) => new ir(r.readJSON());
class qe {
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
    return new qe(this.key, this.value);
  }
  /**
   * @param {number} _offset
   * @return {ContentFormat}
   */
  splice(e) {
    throw yt();
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
const rm = (r) => new qe(r.readKey(), r.readJSON());
class ss {
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
    return new ss(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentJSON}
   */
  splice(e) {
    const t = new ss(this.arr.slice(e));
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
const nm = (r) => {
  const e = r.readLen(), t = [];
  for (let n = 0; n < e; n++) {
    const s = r.readString();
    s === "undefined" ? t.push(void 0) : t.push(JSON.parse(s));
  }
  return new ss(t);
}, sm = Wn("node_env") === "development";
class er {
  /**
   * @param {Array<any>} arr
   */
  constructor(e) {
    this.arr = e, sm && Cl(e);
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
    return new er(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentAny}
   */
  splice(e) {
    const t = new er(this.arr.slice(e));
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
const im = (r) => {
  const e = r.readLen(), t = [];
  for (let n = 0; n < e; n++)
    t.push(r.readAny());
  return new er(t);
};
class St {
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
    return new St(this.str);
  }
  /**
   * @param {number} offset
   * @return {ContentString}
   */
  splice(e) {
    const t = new St(this.str.slice(e));
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
const am = (r) => new St(r.readString()), om = [
  Qp,
  Up,
  qp,
  Jp,
  Gp,
  Wp,
  Xp
], lm = 0, cm = 1, dm = 2, um = 3, hm = 4, fm = 5, gm = 6;
class Nt {
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
    return new Nt(this.type._copy());
  }
  /**
   * @param {number} offset
   * @return {ContentType}
   */
  splice(e) {
    throw yt();
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
const pm = (r) => new Nt(om[r.readTypeRef()](r)), Ci = (r, e) => {
  let t = e, n = 0, s;
  do
    n > 0 && (t = _e(t.client, t.clock + n)), s = mr(r, t), n = t.clock - s.id.clock, t = s.redone;
  while (t !== null && s instanceof Pe);
  return {
    item: s,
    diff: n
  };
}, ta = (r, e) => {
  for (; r !== null && r.keep !== e; )
    r.keep = e, r = /** @type {AbstractType<any>} */
    r.parent._item;
}, is = (r, e, t) => {
  const { client: n, clock: s } = e.id, i = new Pe(
    _e(n, s + t),
    e,
    _e(n, s + t - 1),
    e.right,
    e.rightOrigin,
    e.parent,
    e.parentSub,
    e.content.splice(t)
  );
  return e.deleted && i.markDeleted(), e.keep && (i.keep = !0), e.redone !== null && (i.redone = _e(e.redone.client, e.redone.clock + t)), e.right = i, i.right !== null && (i.right.left = i), r._mergeStructs.push(i), i.parentSub !== null && i.right === null && i.parent._map.set(i.parentSub, i), e.length = t, i;
}, Mo = (r, e) => Mi(
  r,
  /** @param {StackItem} s */
  (t) => an(t.deletions, e)
), Bc = (r, e, t, n, s, i) => {
  const a = r.doc, o = a.store, l = a.clientID, d = e.redone;
  if (d !== null)
    return ot(r, d);
  let f = (
    /** @type {AbstractType<any>} */
    e.parent._item
  ), g = null, m;
  if (f !== null && f.deleted === !0) {
    if (f.redone === null && (!t.has(f) || Bc(r, f, t, n, s, i) === null))
      return null;
    for (; f.redone !== null; )
      f = ot(r, f.redone);
  }
  const u = f === null ? (
    /** @type {AbstractType<any>} */
    e.parent
  ) : (
    /** @type {ContentType} */
    f.content.type
  );
  if (e.parentSub === null) {
    for (g = e.left, m = e; g !== null; ) {
      let k = g;
      for (; k !== null && /** @type {AbstractType<any>} */
      k.parent._item !== f; )
        k = k.redone === null ? null : ot(r, k.redone);
      if (k !== null && /** @type {AbstractType<any>} */
      k.parent._item === f) {
        g = k;
        break;
      }
      g = g.left;
    }
    for (; m !== null; ) {
      let k = m;
      for (; k !== null && /** @type {AbstractType<any>} */
      k.parent._item !== f; )
        k = k.redone === null ? null : ot(r, k.redone);
      if (k !== null && /** @type {AbstractType<any>} */
      k.parent._item === f) {
        m = k;
        break;
      }
      m = m.right;
    }
  } else {
    if (m = null, e.right && !s) {
      for (g = e; g !== null && g.right !== null && (g.right.redone || an(n, g.right.id) || Mo(i.undoStack, g.right.id) || Mo(i.redoStack, g.right.id)); )
        for (g = g.right; g.redone; ) g = ot(r, g.redone);
      if (g && g.right !== null)
        return null;
    } else
      g = u._map.get(e.parentSub) || null;
    g !== null && /** @type {AbstractType<any>} */
    g.parent._item !== f && (g = u._map.get(e.parentSub) || null);
  }
  const y = $e(o, l), w = _e(l, y), A = new Pe(
    w,
    g,
    g && g.lastId,
    m,
    m && m.id,
    u,
    e.parentSub,
    e.content.copy()
  );
  return e.redone = w, ta(A, !0), A.integrate(r, 0), A;
};
class Pe extends ea {
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
    super(e, l.getLength()), this.origin = n, this.left = t, this.right = s, this.rightOrigin = i, this.parent = a, this.parentSub = o, this.redone = null, this.content = l, this.info = this.content.isCountable() ? ao : 0;
  }
  /**
   * This is used to mark the item as an indexed fast-search marker
   *
   * @type {boolean}
   */
  set marker(e) {
    (this.info & ei) > 0 !== e && (this.info ^= ei);
  }
  get marker() {
    return (this.info & ei) > 0;
  }
  /**
   * If true, do not garbage collect this Item.
   */
  get keep() {
    return (this.info & io) > 0;
  }
  set keep(e) {
    this.keep !== e && (this.info ^= io);
  }
  get countable() {
    return (this.info & ao) > 0;
  }
  /**
   * Whether this item was deleted or not.
   * @type {Boolean}
   */
  get deleted() {
    return (this.info & Ys) > 0;
  }
  set deleted(e) {
    this.deleted !== e && (this.info ^= Ys);
  }
  markDeleted() {
    this.info |= Ys;
  }
  /**
   * Return the creator clientID of the missing op or define missing items and return null.
   *
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(e, t) {
    if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= $e(t, this.origin.client))
      return this.origin.client;
    if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= $e(t, this.rightOrigin.client))
      return this.rightOrigin.client;
    if (this.parent && this.parent.constructor === pr && this.id.client !== this.parent.client && this.parent.clock >= $e(t, this.parent.client))
      return this.parent.client;
    if (this.origin && (this.left = vo(e, t, this.origin), this.origin = this.left.lastId), this.rightOrigin && (this.right = ot(e, this.rightOrigin), this.rightOrigin = this.right.id), this.left && this.left.constructor === pt || this.right && this.right.constructor === pt)
      this.parent = null;
    else if (!this.parent)
      this.left && this.left.constructor === Pe ? (this.parent = this.left.parent, this.parentSub = this.left.parentSub) : this.right && this.right.constructor === Pe && (this.parent = this.right.parent, this.parentSub = this.right.parentSub);
    else if (this.parent.constructor === pr) {
      const n = mr(t, this.parent);
      n.constructor === pt ? this.parent = null : this.parent = /** @type {ContentType} */
      n.content.type;
    }
    return null;
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(e, t) {
    if (t > 0 && (this.id.clock += t, this.left = vo(e, e.doc.store, _e(this.id.client, this.id.clock - 1)), this.origin = this.left.lastId, this.content = this.content.splice(t), this.length -= t), this.parent) {
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
          if (a.add(s), i.add(s), ur(this.origin, s.origin)) {
            if (s.id.client < this.id.client)
              n = s, i.clear();
            else if (ur(this.rightOrigin, s.rightOrigin))
              break;
          } else if (s.origin !== null && a.has(mr(e.doc.store, s.origin)))
            i.has(mr(e.doc.store, s.origin)) || (n = s, i.clear());
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
      this.right !== null ? this.right.left = this : this.parentSub !== null && (this.parent._map.set(this.parentSub, this), this.left !== null && this.left.delete(e)), this.parentSub === null && this.countable && !this.deleted && (this.parent._length += this.length), cc(e.doc.store, this), this.content.integrate(e, this), Co(
        e,
        /** @type {AbstractType<any>} */
        this.parent,
        this.parentSub
      ), /** @type {AbstractType<any>} */
      (this.parent._item !== null && /** @type {AbstractType<any>} */
      this.parent._item.deleted || this.parentSub !== null && this.right !== null) && this.delete(e);
    } else
      new pt(this.id, this.length).integrate(e, 0);
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
    return this.length === 1 ? this.id : _e(this.id.client, this.id.clock + this.length - 1);
  }
  /**
   * Try to merge two items
   *
   * @param {Item} right
   * @return {boolean}
   */
  mergeWith(e) {
    if (this.constructor === e.constructor && ur(e.origin, this.lastId) && this.right === e && ur(this.rightOrigin, e.rightOrigin) && this.id.client === e.id.client && this.id.clock + this.length === e.id.clock && this.deleted === e.deleted && this.redone === null && e.redone === null && this.content.constructor === e.content.constructor && this.content.mergeWith(e.content)) {
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
      this.countable && this.parentSub === null && (t._length -= this.length), this.markDeleted(), Zr(e.deleteSet, this.id.client, this.id.clock, this.length), Co(e, t, this.parentSub), this.content.delete(e);
    }
  }
  /**
   * @param {StructStore} store
   * @param {boolean} parentGCd
   */
  gc(e, t) {
    if (!this.deleted)
      throw ht();
    this.content.gc(e), t ? Ap(e, this, new pt(this.id, this.length)) : this.content = new en(this.length);
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
    const n = t > 0 ? _e(this.id.client, this.id.clock + t - 1) : this.origin, s = this.rightOrigin, i = this.parentSub, a = this.content.getRef() & cs | (n === null ? 0 : ut) | // origin is defined
    (s === null ? 0 : Mt) | // right origin is defined
    (i === null ? 0 : jr);
    if (e.writeInfo(a), n !== null && e.writeLeftID(n), s !== null && e.writeRightID(s), n === null && s === null) {
      const o = (
        /** @type {AbstractType<any>} */
        this.parent
      );
      if (o._item !== void 0) {
        const l = o._item;
        if (l === null) {
          const d = ac(o);
          e.writeParentInfo(!0), e.writeString(d);
        } else
          e.writeParentInfo(!1), e.writeLeftID(l.id);
      } else o.constructor === String ? (e.writeParentInfo(!0), e.writeString(o)) : o.constructor === pr ? (e.writeParentInfo(!1), e.writeLeftID(o)) : ht();
      i !== null && e.writeString(i);
    }
    this.content.write(e, t);
  }
}
const xc = (r, e) => mm[e & cs](r), mm = [
  () => {
    ht();
  },
  // GC is not ItemContent
  Yp,
  // 1
  nm,
  // 2
  Kp,
  // 3
  am,
  // 4
  tm,
  // 5
  rm,
  // 6
  pm,
  // 7
  im,
  // 8
  em,
  // 9
  () => {
    ht();
  }
  // 10 - Skip is not ItemContent
], bm = 10;
class mt extends ea {
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
    ht();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, t) {
    e.writeInfo(bm), Se(e.restEncoder, this.length - t);
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
const Dc = (
  /** @type {any} */
  typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : {}
), Mc = "__ $YJS$ __";
Dc[Mc] === !0 && console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438");
Dc[Mc] = !0;
function wm(r) {
  let e = "";
  for (let n = 0; n < r.length; n += 32768)
    e += String.fromCharCode(...r.subarray(n, n + 32768));
  return btoa(e);
}
function Am(r) {
  const e = atob(r), t = new Uint8Array(e.length);
  for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
  return t;
}
function Ro(r, e) {
  return e ? (ip(r, Am(e), "knowledge-remote"), !0) : !1;
}
function zo(r) {
  return wm(lp(r));
}
async function ym(r) {
  const e = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(r));
  return [...new Uint8Array(e)].map((t) => t.toString(16).padStart(2, "0")).join("");
}
function km(r) {
  const e = !!(r.client.connectKnowledgeCollaboration && r.client.syncKnowledgeCollaboration && r.client.streamKnowledgeCollaborationEvents && r.client.closeKnowledgeCollaboration && r.client.publishKnowledgeCollaboration), t = dt(() => new sr(), [r.pageID]), n = dt(() => t.getXmlFragment("knowledge-document"), [t]), [s, i] = L(e ? "connecting" : "unavailable"), [a, o] = L(!1), [l, d] = L(!1), [f, g] = L([]), [m, u] = L([]), [y, w] = L(0), [A, k] = L(0), [v, N] = L(0), [E, S] = L(""), [z, x] = L(0), U = Be(null), Q = Be(null), O = Be(null), K = Be({ cursor: "", selection: "" }), B = Be(null), R = Be(async () => {
  }), b = Be(async () => {
  }), G = Be(null), ne = Be(null), T = Be(0), ae = Be(crypto.randomUUID()), Y = Be(""), de = Be({ onDocument: r.onDocument, onError: r.onError });
  de.current = { onDocument: r.onDocument, onError: r.onError };
  function H(j, ue, ye) {
    U.current = j, Q.current = j.snapshot, j.snapshot.yjs_state && j.snapshot.yjs_state !== Y.current && (Ro(t, j.snapshot.yjs_state), Y.current = j.snapshot.yjs_state), j.snapshot.yjs_state && d(!1), g(j.presence), k(j.snapshot.server_clock), N(j.snapshot.draft_revision), S(j.user_id);
    const pe = [...new Set(ue.map((ge) => ge.user_id || "").filter((ge) => ge && ge !== j.user_id))];
    pe.length > 0 && (u(pe), w((ge) => ge + ue.filter((ke) => ke.user_id && ke.user_id !== j.user_id).length)), de.current.onDocument(O.current?.title || j.snapshot.title, j.snapshot.content, ye);
  }
  function $(j) {
    const ue = U.current;
    if (!ue) return;
    if (j.type === "presence") {
      const ge = j.presence || [];
      U.current = { ...ue, presence: ge }, g(ge);
      return;
    }
    if (j.type === "heartbeat") {
      !O.current && !B.current && i("connected");
      return;
    }
    if (j.type !== "update" && j.type !== "snapshot") return;
    const ye = Q.current, pe = j.snapshot || (j.update && ye ? {
      ...ye,
      draft_revision: ye.draft_revision + 1,
      server_clock: j.clock,
      title: j.update.title?.trim() || ye.title,
      content: j.update.content,
      content_sha256: j.update.content_sha256,
      yjs_state: j.update.yjs_state
    } : void 0);
    pe && (Q.current = pe, U.current = { ...ue, server_clock: pe.server_clock, snapshot: pe }, pe.yjs_state && pe.yjs_state !== Y.current && (Ro(t, pe.yjs_state), Y.current = pe.yjs_state, d(!1)), k(pe.server_clock), N(pe.draft_revision), j.user_id && j.user_id !== ue.user_id && (u([j.user_id]), w((ge) => ge + 1)), de.current.onDocument(O.current?.title || pe.title, pe.content, !O.current), !O.current && !B.current && i("connected"));
  }
  ve(() => {
    if (!r.active || !e) {
      i(e ? "connecting" : "unavailable"), o(!1), g([]);
      return;
    }
    const j = ++T.current, ue = new AbortController(), ye = crypto.randomUUID();
    ae.current = ye, U.current = null, Q.current = null, O.current = null, B.current = null, G.current !== null && window.clearTimeout(G.current), ne.current !== null && window.clearTimeout(ne.current), G.current = null, ne.current = null, o(!1), i(z > 0 ? "reconnecting" : "connecting"), g([]);
    const pe = async () => {
      if (B.current) return B.current;
      const ge = (async () => {
        try {
          for (; T.current === j && U.current && O.current; ) {
            i("syncing");
            const ke = O.current, c = Q.current;
            if (!c) return;
            const W = ke.title.trim(), q = {
              client_id: ae.current,
              update_id: ke.updateID,
              title: W !== c.title ? W : void 0,
              yjs_update: ke.change.yjsUpdate,
              yjs_state: ke.change.yjsState,
              content: ke.content,
              content_sha256: await ym(ke.content),
              edited_block_ids: ke.change.editedBlockIDs
            }, C = await r.client.syncKnowledgeCollaboration(r.libraryID, r.pageID, {
              session_id: U.current.id,
              after_clock: c.server_clock,
              update: q,
              cursor_block_id: K.current.cursor || void 0,
              selection_block_id: K.current.selection || void 0
            }, AbortSignal.timeout(3e4));
            if (T.current !== j) return;
            if (C.applied && O.current?.updateID === ke.updateID && (O.current = null), H(C.session, C.events, C.applied && O.current === null), !C.applied) {
              window.setTimeout(() => {
                T.current === j && O.current?.updateID !== ke.updateID && R.current();
              }, 0);
              break;
            }
          }
          T.current === j && !O.current && i("connected");
        } catch (ke) {
          T.current === j && (i("error"), de.current.onError(ke));
        }
      })();
      B.current = ge;
      try {
        await ge;
      } finally {
        B.current === ge && (B.current = null);
      }
    };
    return R.current = pe, b.current = async () => {
      const ge = U.current;
      if (!(!ge || O.current || B.current || T.current !== j))
        try {
          await r.client.syncKnowledgeCollaboration(r.libraryID, r.pageID, {
            session_id: ge.id,
            after_clock: Q.current?.server_clock || 0,
            cursor_block_id: K.current.cursor || void 0,
            selection_block_id: K.current.selection || void 0
          }, AbortSignal.timeout(1e4));
        } catch {
        }
    }, r.client.connectKnowledgeCollaboration(r.libraryID, r.pageID, { client_id: ye }, ue.signal).then((ge) => {
      ue.signal.aborted || T.current !== j || (U.current = ge, Q.current = ge.snapshot, d(!ge.snapshot.yjs_state), H(ge, [], !0), o(!0), i("connected"), (async () => {
        let ke = 0;
        for (; !ue.signal.aborted && T.current === j && U.current; ) {
          let c = "";
          try {
            if (await r.client.streamKnowledgeCollaborationEvents(r.libraryID, r.pageID, ge.id, Q.current?.server_clock || 0, (W) => {
              if (W.type === "revoked")
                throw c = W.code || "knowledge.collaboration_revoked", new Error(c);
              $(W);
            }, ue.signal), ue.signal.aborted || T.current !== j) return;
            throw new Error("knowledge.collaboration_stream_closed");
          } catch (W) {
            if (ue.signal.aborted || T.current !== j) return;
            if (c) {
              i("error"), de.current.onError(W);
              return;
            }
            if (ke++, i("reconnecting"), ke >= 5) {
              de.current.onError(W), x((q) => q + 1);
              return;
            }
            await new Promise((q) => window.setTimeout(q, Math.min(4e3, 500 * 2 ** (ke - 1))));
          }
        }
      })());
    }).catch((ge) => {
      !ue.signal.aborted && T.current === j && (i("error"), de.current.onError(ge));
    }), () => {
      ue.abort(), T.current++, G.current !== null && window.clearTimeout(G.current), ne.current !== null && window.clearTimeout(ne.current), G.current = null, ne.current = null, B.current = null, O.current = null;
      const ge = U.current;
      U.current = null, ge && r.client.closeKnowledgeCollaboration(r.libraryID, r.pageID, ge.id, AbortSignal.timeout(1e4)).catch(() => {
      });
    };
  }, [e, t, r.active, r.client, r.libraryID, r.pageID, z]);
  function oe(j, ue, ye) {
    const pe = Q.current;
    if (!pe || !a || s === "connecting" || s === "reconnecting" || s === "error") return;
    const ge = ye || (() => {
      const ke = zo(t);
      return { yjsUpdate: ke, yjsState: ke, editedBlockIDs: [] };
    })();
    !O.current && j.trim() === pe.title && ue === pe.content || (O.current = { updateID: crypto.randomUUID(), title: j, content: ue, change: ge }, K.current = { cursor: ge.cursorBlockID || "", selection: ge.selectionBlockID || "" }, i("syncing"), G.current !== null && window.clearTimeout(G.current), G.current = window.setTimeout(() => {
      G.current = null, R.current();
    }, 120));
  }
  function ce(j, ue) {
    K.current = { cursor: j || "", selection: ue || "" }, !(!a || s === "connecting" || s === "reconnecting" || s === "error") && (ne.current !== null && window.clearTimeout(ne.current), ne.current = window.setTimeout(() => {
      ne.current = null, b.current();
    }, 250));
  }
  async function ie(j) {
    G.current !== null && (window.clearTimeout(G.current), G.current = null), await R.current();
    const ue = U.current;
    if (!ue || O.current) throw new Error("协作更改尚未完成合并");
    return r.client.publishKnowledgeCollaboration(r.libraryID, r.pageID, {
      session_id: ue.id,
      client_id: ue.client_id,
      publish_note: j
    }, AbortSignal.timeout(6e4));
  }
  const Ne = dt(() => ({
    document: t,
    fragment: n,
    initializeFromBody: l,
    user: { name: E || "当前用户", color: "#0b8f72" }
  }), [t, n, l, E]), xe = dt(() => new Set(f.map((j) => j.user_id)).size, [f]);
  return {
    available: e && r.active,
    ready: a,
    editorCollaboration: Ne,
    state: s,
    presence: f,
    onlineUsers: xe,
    mergedUserIDs: m,
    mergeCount: y,
    serverClock: A,
    draftRevision: v,
    userID: E,
    edit: oe,
    updatePresence: ce,
    publish: ie,
    reconnect: () => x((j) => j + 1),
    encodeState: () => zo(t)
  };
}
const $r = {
  document: { label: "文档", description: "富文本、内容块与内嵌应用", title: "未命名文档" },
  multidimensional_table: { label: "多维表格", description: "字段化记录与多视图数据", title: "未命名多维表格" },
  spreadsheet: { label: "表格", description: "行列单元格数据", title: "未命名表格" },
  presentation: { label: "幻灯片", description: "分镜式演示内容", title: "未命名幻灯片" },
  form: { label: "问卷", description: "问题、选项与必填规则", title: "未命名问卷" },
  mind_note: { label: "思维笔记", description: "可缩进的大纲笔记", title: "未命名思维笔记" },
  whiteboard: { label: "画板", description: "自由卡片与连接关系", title: "未命名画板" },
  mind_map: { label: "思维导图", description: "中心主题与分支节点", title: "未命名思维导图" },
  flowchart: { label: "流程图", description: "步骤节点与流程关系", title: "未命名流程图" }
}, _m = Object.keys($r), vm = Rt(() => import("./BlockNoteEditor-CQhG5KeR.js").then((r) => ({ default: r.DocumentEditor }))), Im = Rt(() => import("./BlockNoteEditor-CQhG5KeR.js").then((r) => ({ default: r.MindNoteEditor }))), Cm = Rt(() => import("./GridEditor-BpXjFCjL.js").then((r) => ({ default: r.GridEditor }))), Em = Rt(() => import("./SpreadsheetEditor-DJct1DHZ.js").then((r) => ({ default: r.SpreadsheetEditor }))), Sm = Rt(() => import("./CanvasEditor-CRWl9x0I.js").then((r) => r.J).then((r) => ({ default: r.PresentationEditor }))), Nm = Rt(() => import("./CanvasEditor-CRWl9x0I.js").then((r) => r.J).then((r) => ({ default: r.WhiteboardEditor }))), Bm = Rt(() => import("./FormEditor-W-eekyNl.js").then((r) => ({ default: r.FormEditor }))), xm = Rt(() => import("./MindMapEditor-DrhnNgVb.js").then((r) => ({ default: r.MindMapEditor }))), Dm = Rt(() => import("./FlowchartEditor-D867Bj8G.js").then((r) => ({ default: r.FlowchartEditor }))), Mm = {
  document: vm,
  multidimensional_table: Cm,
  spreadsheet: Em,
  presentation: Sm,
  form: Bm,
  mind_note: Im,
  whiteboard: Nm,
  mind_map: xm,
  flowchart: Dm
};
function li({ type: r, ...e }) {
  const t = Mm[r];
  return /* @__PURE__ */ h(id, { fallback: /* @__PURE__ */ h("div", { className: "knowledge-editor-loading", role: "status", children: "正在载入编辑器…" }), children: /* @__PURE__ */ h(t, { ...e }) });
}
function Is(r) {
  try {
    const e = JSON.parse(r);
    return Array.isArray(e.blocks) ? e.blocks : [];
  } catch {
    return [];
  }
}
function Rm(r) {
  return JSON.stringify({ blocks: r });
}
function as(r) {
  if (typeof r == "string") return r;
  if (Array.isArray(r)) return r.map(as).join("");
  if (!r || typeof r != "object") return "";
  const e = r;
  return typeof e.text == "string" ? e.text : as(e.content);
}
function zm(r) {
  const e = [], t = (n) => {
    for (const s of n) {
      const i = as(s.content).trim();
      i && e.push(i), s.children?.length && t(s.children);
    }
  };
  return t(Is(r)), e.join(`
`);
}
function Pm(r) {
  const e = Is(r);
  let t = 0;
  const n = (s) => {
    for (const i of s)
      t++, i.children?.length && n(i.children);
  };
  return n(e), { blocks: t, characters: Array.from(zm(r)).length };
}
function Fm(r) {
  const e = [], t = (n) => {
    for (const s of n) {
      if (s.type === "heading") {
        const i = as(s.content).trim();
        i && e.push({ key: s.id, level: Number(s.props.level) || 1, title: i });
      }
      s.children?.length && t(s.children);
    }
  };
  return t(Is(r)), e;
}
function Tm(r, e, t) {
  const n = Is(r);
  return n.push({
    id: crypto.randomUUID(),
    type: "image",
    props: { name: t, caption: t, url: `knowledge-document:${e}`, showPreview: !0 },
    children: []
  }), Rm(n);
}
const Qm = 2;
async function Lm(r) {
  const e = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(r));
  return [...new Uint8Array(e)].map((t) => t.toString(16).padStart(2, "0")).join("");
}
function Po(r) {
  return typeof r == "object" && r !== null && "status" in r && typeof r.status == "number" ? r.status : 0;
}
function Fo(r) {
  if (typeof r != "object" || r === null || !("conflict" in r)) return null;
  const e = r.conflict;
  return typeof e != "object" || e === null || !("current_draft_revision" in e) || typeof e.current_draft_revision != "number" ? null : e;
}
function Um(r) {
  return { queued: "等待索引", indexing: "正在索引", ready: "已可检索", failed: "索引失败", none: "尚未索引" }[r.projection_status || "none"];
}
const To = ["#176b52", "#315f9d", "#9a5a17", "#7a4b9d", "#a13f5b"];
function Qo(r) {
  return To[[...r].reduce((e, t) => e + t.codePointAt(0), 0) % To.length];
}
function Lo({ type: r, size: e = 16 }) {
  const t = { document: Lt, multidimensional_table: Bd, spreadsheet: Nd, presentation: Sd, form: Ed, mind_note: jo, whiteboard: Cd, mind_map: Id, flowchart: vd }[r] || xd;
  return /* @__PURE__ */ h(t, { size: e, "aria-hidden": "true" });
}
function Om({ client: r, library: e, disabled: t, formatError: n, embedded: s = !1, documents: i, onManage: a }) {
  const o = !e.archived && (e.role === "editor" || e.role === "manager"), [l, d] = L({}), [f, g] = L(/* @__PURE__ */ new Set()), [m, u] = L({}), [y, w] = L({}), [A, k] = L(!1), [v, N] = L(""), [E, S] = L(null), [z, x] = L(!0), [U, Q] = L(""), [O, K] = L(""), [B, R] = L(""), [b, G] = L(!1), [ne, T] = L({ top: 0, left: 0, maxHeight: 560 }), [ae, Y] = L("page"), [de, H] = L(null), [$, oe] = L([]), [ce, ie] = L(""), [Ne, xe] = L(!1), [j, ue] = L("read"), [ye, pe] = L(""), [ge, ke] = L(""), [c, W] = L(!1), [q, C] = L("idle"), [I, P] = L("idle"), [ee, te] = L(null), [F, V] = L(""), [se, re] = L([]), [fe, Ee] = L(null), [we, Ue] = L([]), [gt, Ze] = L(0), [bt, Me] = L(!0), [st, Pt] = L(null), [rt, Z] = L([]), [me, Fe] = L(""), [Te, Ke] = L(!1), [We, Ye] = L(""), [Jt, Bt] = L(!0), [ra, Cs] = L(""), [Es, un] = L(""), [Ss, Pc] = L(""), [Fc, Tc] = L([]), [hn, na] = L([]), [it, fn] = L({}), [Ns, Bs] = L(""), [sa, gn] = L([]), [pn, ia] = L(!1), [xs, aa] = L(""), [Qc, oa] = L([]), [mn, la] = L(""), [Ds, Lc] = L("knowledge.pages.get"), [wt, Ms] = L(null), [Mr, Rs] = L(null), [ar, zs] = L("inherit"), [Ps, Rr] = L([]), [Fs, ca] = L(""), [Uc, da] = L([]), [ua, Oc] = L("reader"), [ha, $c] = L("page"), [zr, fa] = L(!1), [Ft, bn] = L(null), Xe = Be(null), xt = Be({ title: "", body: "" }), wn = Be(Promise.resolve()), or = Be(null), Pr = Be(null), An = Be(""), ga = Be({}), yn = Be(null), pa = Be(null), Ts = Be(null), be = km({
    active: j === "edit" && o && !!v && !!E?.draft && E.page.content_type === "document",
    client: r,
    libraryID: e.id,
    pageID: v,
    initialTitle: ye,
    initialContent: ge,
    onDocument(p, D, X) {
      pe(p), ke(D), xt.current = { title: p, body: D }, W(!X), C(X ? "saved" : "saving"), te(null);
    },
    onError(p) {
      K(n(p));
    }
  });
  function Qs(p) {
    Y("page"), N(p), window.setTimeout(() => ga.current[p]?.focus());
  }
  async function Tt(p, D) {
    const X = [...new Set(p.filter(Boolean))];
    if (X.length !== 0)
      try {
        const he = await r.resolvePrincipals(X, D);
        D.aborted || fn((Ae) => ({ ...Ae, ...Object.fromEntries(he.filter((Ie) => Ie.status === "active").map((Ie) => [Ie.user_id, Ie])) }));
      } catch {
      }
  }
  async function kt(p = "", D = AbortSignal.timeout(3e4), X = !1) {
    const he = await r.listPages(e.id, p, X && m[p] || "", 50, A, D);
    d((Ae) => ({ ...Ae, [p]: X ? [...Ae[p] || [], ...he.items] : he.items })), u((Ae) => ({ ...Ae, [p]: he.next_after || "" })), w((Ae) => ({ ...Ae, [p]: he.complete })), !v && p === "" && he.items[0] && N(he.items[0].id);
  }
  ve(() => {
    const p = new AbortController();
    return d({}), u({}), w({}), g(/* @__PURE__ */ new Set()), N(""), S(null), x(!0), K(""), Y("page"), G(!1), oe([]), ie(""), xe(!1), An.current = "", kt("", p.signal).catch((D) => {
      p.signal.aborted || K(n(D));
    }).finally(() => {
      p.signal.aborted || x(!1);
    }), () => p.abort();
  }, [r, n, e.id, A]), ve(() => {
    if (!i) {
      oe([]);
      return;
    }
    const p = new AbortController();
    return r.listDocuments(e.id, "", 50, p.signal).then((D) => {
      p.signal.aborted || oe(D.items);
    }).catch((D) => {
      p.signal.aborted || K(n(D));
    }), () => p.abort();
  }, [r, n, e.id, !!i]), ve(() => {
    if (!v) {
      S(null);
      return;
    }
    const p = new AbortController();
    return x(!0), K(""), or.current = null, Pr.current = null, r.getPage(e.id, v, o, p.signal).then((D) => {
      if (p.signal.aborted) return;
      S(D), Xe.current = D;
      const X = D.draft || D.published;
      pe(X?.title || D.page.title), ke(X?.body.content || ""), xt.current = { title: X?.title || D.page.title, body: X?.body.content || "" };
      const he = An.current === D.page.id;
      he && (An.current = ""), W(!1), C("idle"), P("idle"), te(null), ue(he ? "edit" : "read"), Ee(null), Ue([]), Pt(null), re([]), Ze(0), Me(!0), Z([]), Ye(""), Bt(!0), Rs(null), Rr([]), bn(null), D.published?.published_by_user_id && Tt([D.published.published_by_user_id], p.signal), he && window.setTimeout(() => Ts.current?.select());
    }).catch((D) => {
      p.signal.aborted || (S(null), K(n(D)));
    }).finally(() => {
      p.signal.aborted || x(!1);
    }), () => p.abort();
  }, [o, r, n, e.id, v]), ve(() => {
    if (!c || j !== "edit" || !E?.draft || t || be.available) return;
    const p = window.setTimeout(() => {
      Us();
    }, 900);
    return () => window.clearTimeout(p);
  }, [ge, be.available, c, t, j, ye]), ve(() => {
    const p = be.presence.map((X) => X.user_id);
    if (p.length === 0) return;
    const D = new AbortController();
    return Tt(p, D.signal), () => D.abort();
  }, [be.presence]), ve(() => {
    const p = (D) => {
      (c || q === "saving") && D.preventDefault();
    };
    return window.addEventListener("beforeunload", p), () => window.removeEventListener("beforeunload", p);
  }, [c, q]), ve(() => {
    if (!b) return;
    const p = () => {
      const he = yn.current;
      if (!he) return;
      const Ae = he.getBoundingClientRect(), Ie = 280, Qe = 7, et = 8, lr = Math.max(et, Math.min(Ae.right - Ie, window.innerWidth - Ie - et)), Hs = window.innerHeight - Ae.bottom - Qe - et, Sa = Ae.top - Qe - et, Na = Hs < 320 && Sa > Hs, Ba = Math.max(180, Math.min(560, Na ? Sa : Hs));
      T({ top: Na ? Ae.top - Qe - Ba : Ae.bottom + Qe, left: lr, maxHeight: Ba });
    }, D = (he) => {
      const Ae = he.target;
      !yn.current?.contains(Ae) && !pa.current?.contains(Ae) && G(!1);
    }, X = (he) => {
      he.key === "Escape" && (G(!1), yn.current?.querySelector("button")?.focus());
    };
    return p(), window.addEventListener("resize", p), window.addEventListener("scroll", p, !0), document.addEventListener("pointerdown", D), document.addEventListener("keydown", X), () => {
      window.removeEventListener("resize", p), window.removeEventListener("scroll", p, !0), document.removeEventListener("pointerdown", D), document.removeEventListener("keydown", X);
    };
  }, [b]), ve(() => {
    if (j !== "history" && j !== "activity" || !v) return;
    const p = new AbortController();
    return r.listPageVersions(e.id, v, 0, 50, p.signal).then((D) => {
      p.signal.aborted || (re(D.items), Ze(D.next_before || 0), Me(D.complete), Tt(D.items.map((X) => X.published_by_user_id), p.signal));
    }).catch((D) => {
      p.signal.aborted || K(n(D));
    }), () => p.abort();
  }, [r, n, e.id, j, v]), ve(() => {
    if (j !== "comments" && j !== "activity" || !v) return;
    const p = new AbortController();
    return r.listPageComments(e.id, v, "", 50, j === "comments" && Te, p.signal).then((D) => {
      p.signal.aborted || (Z(D.items), Ye(D.next_after || ""), Bt(D.complete), Tt(D.items.flatMap((X) => [X.author_user_id, X.resolved_by_user_id || "", ...X.mentioned_user_ids]), p.signal));
    }).catch((D) => {
      p.signal.aborted || K(n(D));
    }), () => p.abort();
  }, [r, n, e.id, j, v, Te]), ve(() => {
    if (!v) {
      gn([]);
      return;
    }
    const p = new AbortController();
    return r.listPageAttachments(e.id, v, p.signal).then((D) => {
      p.signal.aborted || gn(D.items);
    }).catch((D) => {
      p.signal.aborted || K(n(D));
    }), () => p.abort();
  }, [r, n, e.id, v]), ve(() => {
    if (j !== "comments") return;
    const p = new AbortController(), D = window.setTimeout(() => {
      r.searchLibraryMembers(e.id, Ss.trim(), "", 100, p.signal).then((X) => {
        p.signal.aborted || (Tc(X.items), fn((he) => ({ ...he, ...Object.fromEntries(X.items.map((Ae) => [Ae.user_id, Ae])) })));
      }).catch((X) => {
        p.signal.aborted || K(n(X));
      });
    }, 200);
    return () => {
      window.clearTimeout(D), p.abort();
    };
  }, [r, n, e.id, Ss, j]), ve(() => {
    if (j !== "access" || e.role !== "manager") return;
    const p = new AbortController(), D = window.setTimeout(() => {
      r.searchPrincipals(xs.trim(), "", 20, p.signal).then((X) => {
        p.signal.aborted || oa(X.items.filter((he) => he.status === "active"));
      }).catch((X) => {
        p.signal.aborted || K(n(X));
      });
    }, 200);
    return () => {
      window.clearTimeout(D), p.abort();
    };
  }, [xs, r, n, e.role, j]), ve(() => {
    if (j !== "access" || e.role !== "manager" || !v || !mn) {
      Ms(null);
      return;
    }
    const p = new AbortController();
    return r.explainAccess(e.id, { user_id: mn, page_id: v, action: Ds }, p.signal).then((D) => {
      p.signal.aborted || Ms(D);
    }).catch((D) => {
      p.signal.aborted || (Ms(null), K(n(D)));
    }), () => p.abort();
  }, [Ds, mn, r, n, e.id, e.role, j, v]), ve(() => {
    if (j !== "permissions" || e.role !== "manager" || !v || !r.getPageAccess) return;
    const p = new AbortController();
    return r.getPageAccess(e.id, v, p.signal).then((D) => {
      p.signal.aborted || (Rs(D), zs(D.mode), Rr(D.grants), Tt(D.grants.map((X) => X.user_id), p.signal));
    }).catch((D) => {
      p.signal.aborted || K(n(D));
    }), () => p.abort();
  }, [r, n, e.id, e.role, j, v]), ve(() => {
    if (j !== "permissions" || e.role !== "manager" || ar !== "restricted") return;
    const p = new AbortController(), D = window.setTimeout(() => {
      r.searchLibraryMembers(e.id, Fs.trim(), "", 50, p.signal).then((X) => {
        p.signal.aborted || (da(X.items), fn((he) => ({ ...he, ...Object.fromEntries(X.items.map((Ae) => [Ae.user_id, Ae])) })));
      }).catch((X) => {
        p.signal.aborted || K(n(X));
      });
    }, 200);
    return () => {
      window.clearTimeout(D), p.abort();
    };
  }, [r, n, e.id, e.role, j, ar, Fs]);
  async function Ls(p) {
    const D = new Set(f);
    D.has(p.id) ? D.delete(p.id) : (D.add(p.id), l[p.id] || await kt(p.id)), g(D);
  }
  function ma(p = "", D = 0) {
    const he = (l[p] || []).filter((Ae) => !U || Ae.title.toLocaleLowerCase().includes(U.toLocaleLowerCase())).flatMap((Ae) => [{ page: Ae, parent: p, depth: D }, ...f.has(Ae.id) ? ma(Ae.id, D + 1) : []]);
    return !U && l[p] && y[p] === !1 && he.push({ parent: p, depth: D, loadMore: !0 }), he;
  }
  async function Hc(p) {
    if (o)
      try {
        const D = ae === "page" ? v : "", X = $r[p], he = await r.createPage(e.id, { client_id: crypto.randomUUID(), parent_page_id: D || void 0, title: X.title, content_type: p }, AbortSignal.timeout(3e4));
        D && g((Ae) => new Set(Ae).add(D)), Y("page"), R(`已在当前节点下创建${X.label}，正在编辑。`), An.current = he.page.id, await kt(he.page.parent_page_id || ""), N(he.page.id);
      } catch (D) {
        K(n(D));
      }
  }
  function Us() {
    if (!Xe.current?.draft || !o) return wn.current;
    const D = { ...xt.current };
    return C("saving"), te(null), K(""), wn.current = wn.current.then(async () => {
      const X = Xe.current;
      if (!X?.draft) return;
      const he = or.current || {
        clientID: crypto.randomUUID(),
        pageID: X.page.id,
        expectedDraftRevision: X.draft.draft_revision,
        expectedPageRevision: X.page.revision,
        title: D.title,
        body: D.body,
        parentPageID: X.draft.parent_page_id,
        rank: X.draft.rank
      };
      or.current = he;
      const Ae = await Lm(he.body), Ie = await r.savePageDraft(e.id, he.pageID, {
        client_id: he.clientID,
        expected_draft_revision: he.expectedDraftRevision,
        expected_page_revision: he.expectedPageRevision,
        title: he.title.trim(),
        parent_page_id: he.parentPageID,
        rank: he.rank,
        content_schema_version: Qm,
        content: he.body,
        content_sha256: Ae
      }, AbortSignal.timeout(3e4));
      or.current = null, Xe.current = Ie, S(Ie);
      const Qe = xt.current.title === he.title && xt.current.body === he.body;
      W(!Qe), C(Qe ? "saved" : "idle");
    }).catch((X) => {
      Po(X) === 409 ? (C("conflict"), te(Fo(X))) : C("error"), K(n(X));
    }), wn.current;
  }
  async function jc() {
    if (!Xe.current?.draft || !o) return;
    if (be.available) {
      P("publishing"), K("");
      try {
        const D = await be.publish(F.trim() || void 0);
        Xe.current = D, S(D), V(""), W(!1), P("idle"), ue("read"), R("协作快照已冻结并发布；所有在线成员看到的是同一版本。"), await kt(D.page.parent_page_id || "");
      } catch (D) {
        P("error"), K(n(D));
      }
      return;
    }
    c && await Us();
    const p = Xe.current;
    if (!(!p?.draft || q === "conflict" || or.current)) {
      P("publishing"), K("");
      try {
        const D = Pr.current || {
          clientID: crypto.randomUUID(),
          pageID: p.page.id,
          expectedPageRevision: p.page.revision,
          expectedDraftRevision: p.draft.draft_revision,
          publishNote: F.trim() || void 0
        };
        Pr.current = D;
        const X = await r.publishPage(e.id, D.pageID, { client_id: D.clientID, expected_page_revision: D.expectedPageRevision, expected_draft_revision: D.expectedDraftRevision, publish_note: D.publishNote }, AbortSignal.timeout(6e4));
        Pr.current = null, Xe.current = X, S(X), V(""), W(!1), P("idle"), ue("read"), R("页面已发布；页面可以立即阅读，检索状态以页面标记为准。"), await kt(X.page.parent_page_id || "");
      } catch (D) {
        P("error"), Po(D) === 409 && (C("conflict"), te(Fo(D))), K(n(D));
      }
    }
  }
  async function Os(p, D, X = "") {
    await r.movePage(e.id, p.id, { client_id: crypto.randomUUID(), expected_revision: p.revision, parent_page_id: D || void 0, rank: p.rank, access_impact_token: X || void 0 }, AbortSignal.timeout(3e4)), bn(null), R("页面与子树权限继承已在同一事务中更新。"), await kt(p.parent_page_id || ""), await kt(D);
  }
  async function ba(p, D) {
    if (!(!o || p.id === D))
      try {
        if (e.role === "manager" && r.previewPageMove) {
          const X = await r.previewPageMove(e.id, p.id, { parent_page_id: D || void 0, rank: p.rank }, AbortSignal.timeout(3e4));
          if (X.requires_confirm) {
            bn({ page: p, parentPageID: D, impact: X }), Tt(X.changed_user_ids, AbortSignal.timeout(3e4));
            return;
          }
          await Os(p, D, X.token);
          return;
        }
        await Os(p, D);
      } catch (X) {
        K(n(X));
      }
  }
  function qc(p) {
    const D = { user_id: p.user_id, role: ua, scope: ha };
    Rr((X) => [...X.filter((he) => he.user_id !== D.user_id || he.scope !== D.scope), D]), fn((X) => ({ ...X, [p.user_id]: p })), ca(""), da([]);
  }
  async function Gc() {
    if (!(!v || !Mr || !r.setPageAccess)) {
      fa(!0), K("");
      try {
        const p = await r.setPageAccess(e.id, v, {
          client_id: crypto.randomUUID(),
          expected_revision: Mr.revision,
          mode: ar,
          grants: ar === "restricted" ? Ps : []
        }, AbortSignal.timeout(3e4));
        if (Rs(p), zs(p.mode), Rr(p.grants), R(p.projection_status === "ready" ? "页面权限已生效。" : "本地撤权已立即生效；远端权限投影确认前，本页不会进入搜索结果。"), Xe.current) {
          const D = { ...Xe.current, page: { ...Xe.current.page, access_mode: p.mode, access_revision: p.revision, access_status: p.projection_status } };
          Xe.current = D, S(D);
        }
      } catch (p) {
        K(n(p));
      } finally {
        fa(!1);
      }
    }
  }
  async function wa(p, D) {
    const X = p.parent_page_id || "", he = l[X] || [];
    if (!o || A || y[X] !== !0) return;
    const Ae = he.findIndex((et) => et.id === p.id), Ie = Ae + D;
    if (Ae < 0 || Ie < 0 || Ie >= he.length) return;
    const Qe = [...he];
    [Qe[Ae], Qe[Ie]] = [Qe[Ie], Qe[Ae]];
    try {
      const et = await r.reorderPages(e.id, { client_id: crypto.randomUUID(), parent_page_id: X || void 0, items: Qe.map((lr) => ({ page_id: lr.id, expected_revision: lr.revision })) }, AbortSignal.timeout(3e4));
      d((lr) => ({ ...lr, [X]: et.items })), R("同级页面顺序已原子更新。");
    } catch (et) {
      K(n(et));
    }
  }
  async function Jc() {
    const p = Xe.current;
    if (!(!p || !o))
      try {
        const D = await r.copyPage(e.id, p.page.id, { client_id: crypto.randomUUID(), parent_page_id: p.page.parent_page_id, title: `${p.page.title} 副本` }, AbortSignal.timeout(3e4));
        await kt(D.page.parent_page_id || ""), N(D.page.id), R("页面已复制为一份新的未发布草稿。");
      } catch (D) {
        K(n(D));
      }
  }
  async function Vc(p) {
    try {
      await r.setPageArchived(e.id, p.id, p.state !== "archived", { client_id: crypto.randomUUID(), expected_revision: p.revision }, AbortSignal.timeout(3e4)), N(""), await kt(p.parent_page_id || ""), R(p.state === "archived" ? "页面已恢复。" : "页面已归档并立即停止检索引用。 ");
    } catch (D) {
      K(n(D));
    }
  }
  async function Wc() {
    if (!(we.length !== 2 || !v))
      try {
        Ee(await r.diffPageVersions(e.id, v, we[1], we[0], AbortSignal.timeout(3e4)));
      } catch (p) {
        K(n(p));
      }
  }
  async function Xc(p) {
    try {
      Pt(await r.getPageVersion(e.id, v, p, AbortSignal.timeout(3e4)));
    } catch (D) {
      K(n(D));
    }
  }
  async function Aa() {
    if (!(!v || bt || gt < 1))
      try {
        const p = await r.listPageVersions(e.id, v, gt, 50, AbortSignal.timeout(3e4));
        re((D) => [...D, ...p.items.filter((X) => !D.some((he) => he.version === X.version))]), Ze(p.next_before || 0), Me(p.complete), Tt(p.items.map((D) => D.published_by_user_id), AbortSignal.timeout(3e4));
      } catch (p) {
        K(n(p));
      }
  }
  async function ya() {
    if (!(!v || Jt || !We))
      try {
        const p = await r.listPageComments(e.id, v, We, 50, j === "comments" && Te, AbortSignal.timeout(3e4));
        Z((D) => [...D, ...p.items.filter((X) => !D.some((he) => he.id === X.id))]), Ye(p.next_after || ""), Bt(p.complete), Tt(p.items.flatMap((D) => [D.author_user_id, D.resolved_by_user_id || "", ...D.mentioned_user_ids]), AbortSignal.timeout(3e4));
      } catch (p) {
        K(n(p));
      }
  }
  async function Zc(p) {
    const D = Xe.current;
    if (D?.draft)
      try {
        const X = await r.restorePageVersion(e.id, D.page.id, p, { client_id: crypto.randomUUID(), expected_page_revision: D.page.revision, expected_draft_revision: D.draft.draft_revision }, AbortSignal.timeout(3e4));
        Xe.current = X, S(X), pe(X.draft.title), ke(X.draft.body.content), xt.current = { title: X.draft.title, body: X.draft.body.content }, ue("edit"), R(`版本 ${p} 已恢复为草稿，历史版本未修改。`);
      } catch (X) {
        K(n(X));
      }
  }
  async function Kc() {
    const p = Xe.current;
    if (!(!p?.published || !me.trim()))
      try {
        await r.createPageComment(e.id, p.page.id, { client_id: crypto.randomUUID(), parent_comment_id: Ns || void 0, published_version: p.published.version, anchor: {}, body: me.trim(), mentioned_user_ids: hn }, AbortSignal.timeout(3e4)), Fe(""), na([]), Bs("");
        const D = await r.listPageComments(e.id, p.page.id, "", 50, Te, AbortSignal.timeout(3e4));
        Z(D.items), Ye(D.next_after || ""), Bt(D.complete);
      } catch (D) {
        K(n(D));
      }
  }
  async function Yc(p) {
    try {
      const D = await r.resolvePageComment(e.id, p.page_id, p.id, { client_id: crypto.randomUUID(), expected_revision: p.revision, resolved: !p.resolved }, AbortSignal.timeout(3e4));
      Z((X) => X.map((he) => he.id === D.id ? D : he));
    } catch (D) {
      K(n(D));
    }
  }
  async function ed(p) {
    const D = Es.trim();
    if (D)
      try {
        const X = await r.updatePageComment(e.id, p.page_id, p.id, { client_id: crypto.randomUUID(), expected_revision: p.revision, body: D, mentioned_user_ids: p.mentioned_user_ids }, AbortSignal.timeout(3e4));
        Z((he) => he.map((Ae) => Ae.id === X.id ? X : Ae)), Cs(""), un("");
      } catch (X) {
        K(n(X));
      }
  }
  async function td(p) {
    try {
      const D = await r.deletePageComment(e.id, p.page_id, p.id, { client_id: crypto.randomUUID(), expected_revision: p.revision }, AbortSignal.timeout(3e4));
      Z((X) => X.map((he) => he.id === D.id ? D : he));
    } catch (D) {
      K(n(D));
    }
  }
  async function rd(p) {
    const D = Xe.current;
    if (!D?.draft || !o || pn) return;
    ia(!0), K("");
    const X = AbortSignal.timeout(7200 * 1e3);
    try {
      const he = await Zo(p, X), Ae = await r.uploadDocument({ libraryID: e.id, file: p, clientID: crypto.randomUUID(), sha256: he, signal: X }), Ie = await r.setPageAttachment(e.id, D.page.id, Ae.id, { client_id: crypto.randomUUID(), title: p.name, rank: `${Date.now()}:${Ae.id}` }, X);
      if (gn((Qe) => [...Qe.filter((et) => et.document_id !== Ie.document_id), Ie]), p.type.startsWith("image/") && D.page.content_type === "document") {
        const Qe = Tm(xt.current.body, Ae.id, p.name);
        xt.current.body = Qe, ke(Qe), W(!0), C("idle"), ue("edit");
      }
      R("附件已通过受权文件接口上传并关联到当前页面。图片引用会在草稿保存后生效。");
    } catch (he) {
      K(n(he));
    } finally {
      ia(!1);
    }
  }
  async function nd(p) {
    try {
      await r.removePageAttachment(e.id, p.page_id, p.document_id, { client_id: crypto.randomUUID() }, AbortSignal.timeout(3e4)), gn((D) => D.filter((X) => X.document_id !== p.document_id));
    } catch (D) {
      K(n(D));
    }
  }
  function ka(p, D, X) {
    pe(p), ke(D), xt.current = { title: p, body: D }, W(!0), C(be.available ? "saving" : "idle"), P("idle"), te(null), be.available && be.edit(p, D, X);
  }
  const kn = dt(() => ma(), [l, f, U]), _a = dt(() => [
    ...se.map((p) => ({ key: `version-${p.version}`, at: p.published_at, title: `发布了版本 ${p.version}`, detail: `${it[p.published_by_user_id]?.display_name || "账号不可用"} · ${p.publish_note || p.body.summary || "无发布说明"}` })),
    ...rt.map((p) => ({ key: `comment-${p.id}-${p.revision}`, at: p.updated_at, title: p.deleted ? "删除了评论" : p.resolved ? "解决了评论" : p.revision > 1 ? "更新了评论" : p.parent_comment_id ? "回复了评论" : "发表了评论", detail: `${it[p.author_user_id]?.display_name || "账号不可用"} · 版本 ${p.published_version}` }))
  ].sort((p, D) => D.at.localeCompare(p.at)), [rt, it, se]), va = dt(() => {
    const p = /* @__PURE__ */ new Map();
    for (const D of be.presence) {
      const X = p.get(D.user_id) || { userID: D.user_id, sessions: 0, editedBlocks: 0, cursorBlockID: "", selectionBlockID: "", lastSeenAt: "" };
      X.sessions++, X.editedBlocks += D.edited_blocks || 0, D.last_seen_at >= X.lastSeenAt && (X.cursorBlockID = D.cursor_block_id || "", X.selectionBlockID = D.selection_block_id || "", X.lastSeenAt = D.last_seen_at), p.set(D.user_id, X);
    }
    return [...p.values()].sort((D, X) => D.userID === be.userID ? -1 : X.userID === be.userID ? 1 : X.lastSeenAt.localeCompare(D.lastSeenAt));
  }, [be.presence, be.userID]), $s = E?.published?.body.content || "", Ia = dt(() => E?.page.content_type === "document" ? Fm($s) : [], [$s, E?.page.content_type]), Ca = dt(() => Pm(ge), [ge]), Ea = { unavailable: "标准草稿模式", connecting: "正在连接协作会话", connected: "所有更改已同步", syncing: "正在合并更改", reconnecting: "正在恢复会话", error: "协作连接中断" }[be.state];
  return /* @__PURE__ */ _("section", { className: `knowledge-pages${s ? " is-embedded" : ""}`, "aria-label": "知识页面", children: [
    !s && /* @__PURE__ */ _("header", { className: "knowledge-section-heading", children: [
      /* @__PURE__ */ _("div", { className: "knowledge-section-identity", children: [
        /* @__PURE__ */ h("span", { className: "knowledge-section-icon", "aria-hidden": "true", children: /* @__PURE__ */ h($t, { size: 18 }) }),
        /* @__PURE__ */ _("span", { children: [
          /* @__PURE__ */ h("small", { children: "Knowledge workspace" }),
          /* @__PURE__ */ h("h3", { children: "知识页面" }),
          /* @__PURE__ */ h("p", { children: "协作编辑、版本发布与访问治理集中在一个工作区。" })
        ] })
      ] }),
      E && /* @__PURE__ */ _("span", { className: `knowledge-index-state is-${E.page.projection_status || "none"}`, children: [
        /* @__PURE__ */ h("span", { "aria-hidden": "true" }),
        Um(E.page)
      ] })
    ] }),
    /* @__PURE__ */ _("div", { className: "knowledge-pages-layout", children: [
      /* @__PURE__ */ _("aside", { className: "knowledge-page-tree", onDragOver: (p) => {
        o && p.preventDefault();
      }, onDrop: () => {
        de && ba(de, ""), H(null);
      }, children: [
        /* @__PURE__ */ _("div", { className: "knowledge-tree-toolbar", children: [
          /* @__PURE__ */ _("label", { children: [
            /* @__PURE__ */ h(Ei, { size: 14, "aria-hidden": "true" }),
            /* @__PURE__ */ h("input", { "aria-label": "筛选当前知识条目", value: U, onChange: (p) => Q(p.target.value), placeholder: "搜索知识条目" })
          ] }),
          o && /* @__PURE__ */ _("div", { ref: yn, className: "knowledge-create-menu-wrap", children: [
            /* @__PURE__ */ h(le, { "aria-label": "新建知识条目", title: "新建知识条目", "aria-haspopup": "menu", "aria-expanded": b, disabled: t, onClick: () => G((p) => !p), children: /* @__PURE__ */ h(Ho, { size: 16 }) }),
            b && typeof document < "u" && tn(/* @__PURE__ */ _("div", { ref: pa, className: "knowledge-create-menu", role: "menu", "aria-label": "新建知识条目类型", style: ne, children: [
              _m.map((p) => /* @__PURE__ */ _("button", { role: "menuitem", onClick: () => {
                G(!1), Hc(p);
              }, children: [
                /* @__PURE__ */ h(Lo, { type: p, size: 18 }),
                /* @__PURE__ */ _("span", { children: [
                  /* @__PURE__ */ h("strong", { children: $r[p].label }),
                  /* @__PURE__ */ h("small", { children: $r[p].description })
                ] })
              ] }, p)),
              i && /* @__PURE__ */ _("button", { role: "menuitem", onClick: () => {
                G(!1), ie(""), xe(!0), Y("documents");
              }, children: [
                /* @__PURE__ */ h($n, { size: 18 }),
                /* @__PURE__ */ _("span", { children: [
                  /* @__PURE__ */ h("strong", { children: "上传及导入" }),
                  /* @__PURE__ */ h("small", { children: "导入 PDF、Office、图片或音视频" })
                ] })
              ] })
            ] }), document.body)
          ] }),
          a && /* @__PURE__ */ h(le, { "aria-label": "管理知识库", title: "管理知识库", disabled: t, onClick: a, children: /* @__PURE__ */ h(cd, { size: 15 }) })
        ] }),
        /* @__PURE__ */ _("div", { className: "knowledge-tree-label", children: [
          /* @__PURE__ */ h("span", { children: "知识条目" }),
          o && /* @__PURE__ */ _("label", { className: "knowledge-checkbox", children: [
            /* @__PURE__ */ h("input", { type: "checkbox", checked: A, onChange: (p) => k(p.target.checked) }),
            "归档"
          ] })
        ] }),
        /* @__PURE__ */ _("div", { role: "tree", "aria-label": "知识条目树", children: [
          $.map((p) => /* @__PURE__ */ _("button", { role: "treeitem", className: "knowledge-document-entry-row", "aria-selected": ae === "documents" && ce === p.id, onClick: () => {
            Y("documents"), ie(p.id), xe(!1);
          }, children: [
            /* @__PURE__ */ h(Lt, { size: 15 }),
            /* @__PURE__ */ _("span", { children: [
              /* @__PURE__ */ h("strong", { children: p.filename }),
              /* @__PURE__ */ h("small", { children: "导入文件" })
            ] })
          ] }, p.id)),
          kn.map(({ page: p, parent: D, depth: X, loadMore: he }, Ae) => he ? /* @__PURE__ */ h("button", { className: "knowledge-tree-more", style: { marginInlineStart: `${X * 16 + 24}px` }, onClick: () => {
            kt(D, AbortSignal.timeout(3e4), !0);
          }, children: "加载更多" }, `more-${D}-${Ae}`) : p && /* @__PURE__ */ _("div", { className: "knowledge-tree-row", style: { paddingInlineStart: `${X * 16 + 4}px` }, draggable: o, onDragStart: () => H(p), onDragOver: (Ie) => {
            o && Ie.preventDefault();
          }, onDrop: (Ie) => {
            Ie.stopPropagation(), de && ba(de, p.id), H(null);
          }, children: [
            /* @__PURE__ */ h("button", { "aria-label": f.has(p.id) ? "折叠子页面" : "展开子页面", onClick: () => {
              Ls(p);
            }, children: f.has(p.id) ? /* @__PURE__ */ h(dd, { size: 14 }) : /* @__PURE__ */ h(Da, { size: 14 }) }),
            /* @__PURE__ */ _("button", { ref: (Ie) => {
              ga.current[p.id] = Ie;
            }, role: "treeitem", "aria-selected": ae === "page" && v === p.id, tabIndex: ae === "page" && v === p.id ? 0 : -1, onKeyDown: (Ie) => {
              if (Ie.key === "ArrowRight" && !f.has(p.id))
                Ie.preventDefault(), Ls(p);
              else if (Ie.key === "ArrowLeft")
                Ie.preventDefault(), f.has(p.id) ? Ls(p) : D && Qs(D);
              else if (Ie.key === "ArrowDown") {
                Ie.preventDefault();
                const Qe = kn.slice(Ae + 1).find((et) => et.page)?.page;
                Qe && Qs(Qe.id);
              } else if (Ie.key === "ArrowUp") {
                Ie.preventDefault();
                const Qe = kn.slice(0, Ae).reverse().find((et) => et.page)?.page;
                Qe && Qs(Qe.id);
              } else Ie.key === "Enter" && (Y("page"), N(p.id));
            }, onClick: () => {
              Y("page"), N(p.id);
            }, children: [
              /* @__PURE__ */ h(Lo, { type: p.content_type, size: 14 }),
              /* @__PURE__ */ h("span", { children: p.title })
            ] }),
            o && !A && y[D] === !0 && /* @__PURE__ */ _(at, { children: [
              /* @__PURE__ */ h("button", { "aria-label": `上移 ${p.title}`, disabled: (l[D] || [])[0]?.id === p.id, onClick: (Ie) => {
                Ie.stopPropagation(), wa(p, -1);
              }, children: /* @__PURE__ */ h(ud, { size: 12 }) }),
              /* @__PURE__ */ h("button", { "aria-label": `下移 ${p.title}`, disabled: (l[D] || []).at(-1)?.id === p.id, onClick: (Ie) => {
                Ie.stopPropagation(), wa(p, 1);
              }, children: /* @__PURE__ */ h(hd, { size: 12 }) })
            ] })
          ] }, p.id)),
          !z && kn.length === 0 && $.length === 0 && /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "没有知识条目。" })
        ] })
      ] }),
      /* @__PURE__ */ h("article", { className: ae === "documents" ? "knowledge-page-main knowledge-document-main" : `knowledge-page-main${j === "outline" || j === "comments" || j === "activity" || j === "access" || j === "permissions" ? " has-side-panel" : ""}${j === "edit" && be.available ? " has-collaboration" : ""}`, children: ae === "documents" ? i?.({ selectedDocumentID: ce, showUploader: Ne, onDocumentsChange: oe, onSelectedDocumentChange(p) {
        ie(p), xe(!1);
      } }) : /* @__PURE__ */ _(at, { children: [
        B && /* @__PURE__ */ h("p", { role: "status", className: "knowledge-notice", children: B }),
        O && /* @__PURE__ */ h("p", { role: "alert", className: "knowledge-error", children: O }),
        Ft && /* @__PURE__ */ _("section", { className: "knowledge-confirm knowledge-move-impact", role: "dialog", "aria-label": "确认页面权限影响", children: [
          /* @__PURE__ */ h("h3", { children: "移动会改变页面权限" }),
          /* @__PURE__ */ _("p", { children: [
            "将影响该子树中的 ",
            Ft.impact.affected_pages,
            " 个页面，并改变 ",
            Ft.impact.changed_user_ids.length,
            " 位成员的有效访问。"
          ] }),
          Ft.impact.changed_user_ids.length > 0 && /* @__PURE__ */ _("p", { className: "knowledge-subtle", children: [
            "涉及成员：",
            Ft.impact.changed_user_ids.map((p) => it[p]?.display_name || p).join("、")
          ] }),
          /* @__PURE__ */ _("div", { className: "knowledge-actions", children: [
            /* @__PURE__ */ h(le, { className: "danger", onClick: () => {
              Os(Ft.page, Ft.parentPageID, Ft.impact.token);
            }, children: "确认移动并更新继承" }),
            /* @__PURE__ */ h(le, { onClick: () => bn(null), children: "取消移动" })
          ] })
        ] }),
        !E && !z ? /* @__PURE__ */ _(Ut, { children: [
          /* @__PURE__ */ h(fd, { size: 28 }),
          /* @__PURE__ */ h("h3", { children: "选择或新建页面" })
        ] }) : null,
        E && /* @__PURE__ */ _(at, { children: [
          /* @__PURE__ */ h("nav", { className: "knowledge-page-breadcrumbs", "aria-label": "页面路径", children: E.breadcrumbs.map((p, D) => /* @__PURE__ */ _("span", { children: [
            D > 0 && /* @__PURE__ */ h(Da, { size: 12, "aria-hidden": "true" }),
            /* @__PURE__ */ h("button", { onClick: () => N(p.page_id), children: p.title })
          ] }, p.page_id)) }),
          /* @__PURE__ */ _("header", { className: `knowledge-page-title${j === "edit" ? " is-editing" : ""}`, children: [
            /* @__PURE__ */ _("div", { className: "knowledge-page-heading", children: [
              j !== "edit" && /* @__PURE__ */ h("h2", { className: o && E.page.state === "active" ? "is-editable" : void 0, title: o && E.page.state === "active" ? "双击编辑标题" : void 0, onDoubleClick: () => {
                o && E.page.state === "active" && (ue("edit"), window.setTimeout(() => Ts.current?.select()));
              }, children: E.published?.title || E.page.title }),
              /* @__PURE__ */ _("p", { children: [
                "版本 ",
                E.page.published_version || "未发布",
                /* @__PURE__ */ h("span", { "aria-hidden": "true", children: " · " }),
                E.published ? `${it[E.published.published_by_user_id]?.display_name || "账号不可用"} 发布于 ${new Date(E.published.published_at).toLocaleString()}` : "仅草稿"
              ] })
            ] }),
            /* @__PURE__ */ h("div", { className: "knowledge-page-presence-summary", "aria-label": `${be.onlineUsers} 人在线编辑`, children: j === "edit" && be.available && /* @__PURE__ */ _(at, { children: [
              /* @__PURE__ */ h("div", { className: "knowledge-avatar-stack", children: va.slice(0, 4).map((p) => /* @__PURE__ */ h("span", { title: it[p.userID]?.display_name || p.userID, style: { "--collaborator-color": Qo(p.userID) }, children: (it[p.userID]?.display_name || p.userID).slice(0, 1).toUpperCase() }, p.userID)) }),
              /* @__PURE__ */ _("strong", { children: [
                be.onlineUsers,
                " 人在线"
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ _("div", { className: "knowledge-page-toolbar", children: [
            /* @__PURE__ */ _("div", { className: "knowledge-view-tabs", role: "tablist", "aria-label": "页面视图", children: [
              /* @__PURE__ */ _("button", { role: "tab", "aria-selected": j === "read", onClick: () => ue("read"), children: [
                /* @__PURE__ */ h($t, { size: 14 }),
                "阅读"
              ] }),
              o && E.page.state === "active" && /* @__PURE__ */ _("button", { role: "tab", "aria-selected": j === "edit", onClick: () => ue("edit"), children: [
                /* @__PURE__ */ h(gd, { size: 14 }),
                "编辑"
              ] }),
              /* @__PURE__ */ _("button", { role: "tab", "aria-selected": j === "history", onClick: () => ue("history"), children: [
                /* @__PURE__ */ h(pd, { size: 14 }),
                "历史"
              ] }),
              /* @__PURE__ */ _("button", { role: "tab", "aria-selected": j === "comments", onClick: () => ue("comments"), children: [
                /* @__PURE__ */ h(md, { size: 14 }),
                "评论"
              ] }),
              /* @__PURE__ */ _("button", { role: "tab", "aria-selected": j === "activity", onClick: () => ue("activity"), children: [
                /* @__PURE__ */ h(Ma, { size: 14 }),
                "活动"
              ] })
            ] }),
            /* @__PURE__ */ _("div", { className: "knowledge-page-tools", children: [
              E.page.content_type === "document" && /* @__PURE__ */ h(le, { "aria-pressed": j === "outline", title: "页面大纲", onClick: () => ue("outline"), children: /* @__PURE__ */ h(jo, { size: 15 }) }),
              e.role === "manager" && /* @__PURE__ */ h(le, { "aria-pressed": j === "access", title: "访问说明", onClick: () => ue("access"), children: /* @__PURE__ */ h(bd, { size: 15 }) }),
              e.role === "manager" && r.getPageAccess && r.setPageAccess && /* @__PURE__ */ h(le, { "aria-pressed": j === "permissions", title: "页面权限", onClick: () => ue("permissions"), children: /* @__PURE__ */ h(Hn, { size: 15 }) }),
              o && /* @__PURE__ */ h(le, { title: "复制页面", onClick: () => {
                Jc();
              }, children: /* @__PURE__ */ h(wd, { size: 15 }) }),
              o && /* @__PURE__ */ h(le, { title: E.page.state === "archived" ? "恢复页面" : "归档页面", onClick: () => {
                Vc(E.page);
              }, children: /* @__PURE__ */ h(Ad, { size: 15 }) })
            ] })
          ] }),
          (j === "read" || j === "outline" || j === "comments" || j === "activity" || j === "access" || j === "permissions") && (E.published ? /* @__PURE__ */ h("div", { className: "knowledge-page-readable typed-readable", children: /* @__PURE__ */ h(li, { type: E.page.content_type, body: $s, readOnly: !0, onChange: () => {
          } }) }) : /* @__PURE__ */ _(Ut, { children: [
            /* @__PURE__ */ h($n, { size: 28 }),
            /* @__PURE__ */ h("h3", { children: "页面尚未发布" }),
            /* @__PURE__ */ h("p", { children: "编辑者可以完善草稿后发布。" })
          ] })),
          j === "edit" && E.draft && /* @__PURE__ */ _("div", { className: "knowledge-editor-shell", children: [
            /* @__PURE__ */ _("section", { className: "knowledge-page-editor", children: [
              /* @__PURE__ */ _("div", { className: "knowledge-editor-canvas", children: [
                /* @__PURE__ */ h("input", { ref: Ts, className: "knowledge-editor-title", "aria-label": "标题", value: ye, maxLength: 256, disabled: be.available && !be.ready, onChange: (p) => ka(p.target.value, ge), placeholder: "页面标题" }),
                /* @__PURE__ */ _("div", { className: "knowledge-editor-toolbar", children: [
                  /* @__PURE__ */ h("span", { children: $r[E.page.content_type].label }),
                  /* @__PURE__ */ h("span", { children: E.page.content_type === "document" ? `${Ca.blocks} 个内容块 · ${Ca.characters} 字符` : "结构化草稿" })
                ] }),
                /* @__PURE__ */ h(li, { type: E.page.content_type, body: ge, collaboration: be.available && be.ready ? be.editorCollaboration : void 0, readOnly: be.available && !be.ready, onChange: (p, D) => ka(ye, p, D), onPresence: be.updatePresence })
              ] }),
              /* @__PURE__ */ _("div", { className: "knowledge-editor-meta", children: [
                /* @__PURE__ */ _("div", { className: `knowledge-sync-state is-${be.state}`, role: "status", children: [
                  be.state === "syncing" || be.state === "connecting" || be.state === "reconnecting" ? /* @__PURE__ */ h(yd, { className: "knowledge-pulse", size: 15 }) : be.state === "error" ? /* @__PURE__ */ h(Ra, { size: 15 }) : /* @__PURE__ */ h(ci, { size: 15 }),
                  /* @__PURE__ */ h("span", { children: I === "publishing" ? "正在冻结协作快照…" : I === "error" ? "发布失败" : be.available ? Ea : { idle: c ? "有未保存更改" : "草稿未更改", saving: "正在保存…", saved: `已保存 revision ${E.draft.draft_revision}`, conflict: "保存冲突：服务器已有更新", error: "保存失败" }[q] }),
                  be.available && be.draftRevision > 0 && /* @__PURE__ */ _("small", { children: [
                    "revision ",
                    be.draftRevision,
                    " · clock ",
                    be.serverClock
                  ] })
                ] }),
                /* @__PURE__ */ _("label", { className: "knowledge-attachment-trigger", children: [
                  /* @__PURE__ */ h(kd, { size: 15 }),
                  "添加附件或粘贴图片",
                  /* @__PURE__ */ h("input", { type: "file", accept: Jo(e), disabled: pn, onChange: (p) => {
                    const D = p.target.files?.[0];
                    D && rd(D), p.currentTarget.value = "";
                  } })
                ] })
              ] }),
              (pn || sa.length > 0) && /* @__PURE__ */ _("div", { className: "knowledge-page-attachments", children: [
                pn && /* @__PURE__ */ h("span", { role: "status", children: "正在校验并上传附件…" }),
                sa.map((p) => /* @__PURE__ */ _("span", { children: [
                  p.title,
                  /* @__PURE__ */ h("button", { type: "button", onClick: () => {
                    nd(p);
                  }, children: "移除" })
                ] }, p.document_id))
              ] }),
              !be.available && q === "conflict" && /* @__PURE__ */ _("div", { className: "knowledge-conflict", children: [
                /* @__PURE__ */ h(za, { size: 18 }),
                /* @__PURE__ */ h("span", { children: ee ? `服务器草稿 revision ${ee.current_draft_revision}，基于发布版本 ${ee.base_published_version}，更新时间 ${new Date(ee.current_updated_at).toLocaleString()}，摘要 ${ee.current_content_sha256.slice(0, 12)}` : "服务器已有新草稿，请重新载入后合并。" }),
                /* @__PURE__ */ h(le, { onClick: () => {
                  navigator.clipboard.writeText(ge), R("你的正文已复制到剪贴板。");
                }, children: "复制我的内容" }),
                /* @__PURE__ */ _(le, { onClick: () => {
                  or.current = null, Pr.current = null, te(null), N((p) => (window.setTimeout(() => N(p)), ""));
                }, children: [
                  /* @__PURE__ */ h(jt, { size: 14 }),
                  "重新载入"
                ] })
              ] }),
              /* @__PURE__ */ _("footer", { className: "knowledge-editor-actions", children: [
                /* @__PURE__ */ _("div", { children: [
                  !be.available && /* @__PURE__ */ _(le, { disabled: !c || q === "saving" || I === "publishing", onClick: () => {
                    Us();
                  }, children: [
                    /* @__PURE__ */ h(Pa, { size: 14 }),
                    "保存草稿"
                  ] }),
                  /* @__PURE__ */ h("span", { className: "knowledge-editor-hint", children: be.available ? "正文使用增量 CRDT 同步，不会整篇覆盖他人的修改。" : "更改会自动保存为草稿。" })
                ] }),
                /* @__PURE__ */ _("div", { children: [
                  /* @__PURE__ */ h("input", { "aria-label": "发布说明", value: F, maxLength: 2048, onChange: (p) => V(p.target.value), placeholder: "添加发布说明…" }),
                  /* @__PURE__ */ _(le, { className: "primary", disabled: q === "conflict" || I === "publishing" || !ye.trim() || be.available && (be.state === "error" || be.state === "connecting" || be.state === "reconnecting"), onClick: () => {
                    jc();
                  }, children: [
                    /* @__PURE__ */ h(_d, { size: 14 }),
                    I === "publishing" ? "发布中…" : "发布版本"
                  ] })
                ] })
              ] })
            ] }),
            be.available && /* @__PURE__ */ _("aside", { className: "knowledge-collaboration-rail", "aria-label": "在线协作", children: [
              /* @__PURE__ */ _("header", { children: [
                /* @__PURE__ */ _("div", { children: [
                  /* @__PURE__ */ h(Hn, { size: 17 }),
                  /* @__PURE__ */ h("strong", { children: "在线协作" })
                ] }),
                /* @__PURE__ */ _("span", { children: [
                  be.onlineUsers,
                  " 人"
                ] })
              ] }),
              /* @__PURE__ */ _("section", { className: "knowledge-merge-strategy", children: [
                /* @__PURE__ */ h(za, { size: 17 }),
                /* @__PURE__ */ _("div", { children: [
                  /* @__PURE__ */ h("strong", { children: "内容冲突自动收敛" }),
                  /* @__PURE__ */ h("p", { children: "正文由 Yjs 按内容块与富文本节点合并；服务端串行确认时钟、校验 Block JSON，并持久化完整检查点。标题按服务端时钟顺序提交。" })
                ] })
              ] }),
              be.mergeCount > 0 && /* @__PURE__ */ _("p", { className: "knowledge-merge-event", children: [
                /* @__PURE__ */ h(ci, { size: 14 }),
                "已自动合并 ",
                be.mergeCount,
                " 个远端更新",
                be.mergedUserIDs.length > 0 ? `，来自 ${be.mergedUserIDs.map((p) => it[p]?.display_name || p).join("、")}` : ""
              ] }),
              /* @__PURE__ */ h("div", { className: "knowledge-collaborator-list", children: va.map((p) => {
                const X = it[p.userID]?.display_name || p.userID;
                return /* @__PURE__ */ _("div", { className: "knowledge-collaborator", children: [
                  /* @__PURE__ */ _("span", { className: "knowledge-collaborator-avatar", style: { "--collaborator-color": Qo(p.userID) }, children: [
                    X.slice(0, 1).toUpperCase(),
                    /* @__PURE__ */ h("i", {})
                  ] }),
                  /* @__PURE__ */ _("span", { children: [
                    /* @__PURE__ */ _("strong", { children: [
                      X,
                      p.userID === be.userID && /* @__PURE__ */ h("em", { children: "你" })
                    ] }),
                    /* @__PURE__ */ _("small", { children: [
                      p.cursorBlockID ? `正在编辑内容块 ${p.cursorBlockID.slice(0, 8)}` : "正在查看",
                      p.sessions > 1 ? ` · ${p.sessions} 个设备` : ""
                    ] })
                  ] }),
                  /* @__PURE__ */ _("b", { children: [
                    p.editedBlocks,
                    /* @__PURE__ */ h("small", { children: "编辑块" })
                  ] })
                ] }, p.userID);
              }) }),
              /* @__PURE__ */ _("footer", { children: [
                /* @__PURE__ */ _("span", { children: [
                  /* @__PURE__ */ h(Ra, { size: 13 }),
                  Ea
                ] }),
                be.state === "error" && /* @__PURE__ */ _(le, { onClick: be.reconnect, children: [
                  /* @__PURE__ */ h(jt, { size: 13 }),
                  "重新连接"
                ] })
              ] })
            ] })
          ] }),
          j === "history" && /* @__PURE__ */ _("section", { className: "knowledge-page-history", children: [
            /* @__PURE__ */ h("div", { className: "knowledge-actions", children: /* @__PURE__ */ h(le, { disabled: we.length !== 2, onClick: () => {
              Wc();
            }, children: "对比所选版本" }) }),
            se.map((p) => /* @__PURE__ */ _("div", { className: "knowledge-version", children: [
              /* @__PURE__ */ _("label", { children: [
                /* @__PURE__ */ h("input", { type: "checkbox", checked: we.includes(p.version), onChange: (D) => Ue((X) => D.target.checked ? [p.version, ...X].slice(0, 2) : X.filter((he) => he !== p.version)) }),
                "版本 ",
                p.version
              ] }),
              /* @__PURE__ */ _("span", { children: [
                it[p.published_by_user_id]?.display_name || "账号不可用",
                " · ",
                new Date(p.published_at).toLocaleString(),
                " · ",
                p.publish_note || "无发布说明",
                " · ",
                p.body.summary || "无摘要"
              ] }),
              /* @__PURE__ */ h(le, { onClick: () => {
                Xc(p.version);
              }, children: "查看版本" }),
              o && /* @__PURE__ */ h(le, { onClick: () => {
                Zc(p.version);
              }, children: "恢复为草稿" })
            ] }, p.version)),
            !bt && /* @__PURE__ */ h(le, { onClick: () => {
              Aa();
            }, children: "加载更早版本" }),
            st && /* @__PURE__ */ _("div", { className: "knowledge-version-preview", children: [
              /* @__PURE__ */ _("h4", { children: [
                "版本 ",
                st.version,
                "：",
                st.title
              ] }),
              /* @__PURE__ */ _("p", { className: "knowledge-subtle", children: [
                "页面位置 ",
                st.parent_page_id || "根目录",
                " · 排序 ",
                st.rank
              ] }),
              /* @__PURE__ */ h("div", { className: "knowledge-page-readable typed-readable", children: /* @__PURE__ */ h(li, { type: st.content_type, body: st.body.content, readOnly: !0, onChange: () => {
              } }) })
            ] }),
            fe && /* @__PURE__ */ _("div", { className: "knowledge-diff", children: [
              /* @__PURE__ */ _("h4", { children: [
                "版本 ",
                fe.from_version,
                " → ",
                fe.to_version
              ] }),
              /* @__PURE__ */ h("pre", { children: fe.content.map((p, D) => /* @__PURE__ */ _("span", { className: `is-${p.kind}`, children: [
                p.kind === "insert" ? "+ " : p.kind === "delete" ? "- " : "  ",
                p.text
              ] }, D)) })
            ] })
          ] }),
          j === "outline" && /* @__PURE__ */ _("aside", { className: "knowledge-page-outline", "aria-label": "页面大纲", children: [
            /* @__PURE__ */ h("h3", { children: "页面大纲" }),
            Ia.length === 0 ? /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "当前发布版本没有标题块。" }) : /* @__PURE__ */ h("ol", { children: Ia.map((p) => /* @__PURE__ */ h("li", { style: { paddingInlineStart: `${(p.level - 1) * 12}px` }, children: p.title }, p.key)) })
          ] }),
          j === "comments" && /* @__PURE__ */ _("section", { className: "knowledge-page-comments", children: [
            /* @__PURE__ */ _("label", { className: "knowledge-checkbox", children: [
              /* @__PURE__ */ h("input", { type: "checkbox", checked: Te, onChange: (p) => Ke(p.target.checked) }),
              "只看未解决"
            ] }),
            E.page.state === "archived" && /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "页面已归档，评论只读。" }),
            E.published && E.page.state === "active" && /* @__PURE__ */ _("div", { className: "knowledge-comment-create", children: [
              Ns && /* @__PURE__ */ _("p", { className: "knowledge-subtle", children: [
                "正在回复评论 ",
                Ns,
                /* @__PURE__ */ h("button", { onClick: () => Bs(""), children: "取消" })
              ] }),
              /* @__PURE__ */ h("textarea", { value: me, maxLength: 16384, onChange: (p) => Fe(p.target.value), placeholder: "针对当前发布版本发表评论" }),
              /* @__PURE__ */ _("label", { children: [
                "@ 提及当前资料库成员",
                /* @__PURE__ */ h("input", { value: Ss, onChange: (p) => Pc(p.target.value), placeholder: "按姓名或邮箱搜索" })
              ] }),
              /* @__PURE__ */ h("div", { className: "knowledge-mention-picker", children: Fc.map((p) => /* @__PURE__ */ _("button", { type: "button", "aria-pressed": hn.includes(p.user_id), onClick: () => na((D) => D.includes(p.user_id) ? D.filter((X) => X !== p.user_id) : [...D, p.user_id]), children: [
                "@",
                p.display_name
              ] }, p.user_id)) }),
              hn.length > 0 && /* @__PURE__ */ _("p", { className: "knowledge-subtle", children: [
                "将提及：",
                hn.map((p) => it[p]?.display_name || p).join("、")
              ] }),
              /* @__PURE__ */ h(le, { disabled: !me.trim(), onClick: () => {
                Kc();
              }, children: "评论" })
            ] }),
            rt.map((p) => /* @__PURE__ */ _("div", { className: `knowledge-comment${p.resolved ? " is-resolved" : ""}${p.parent_comment_id ? " is-reply" : ""}`, children: [
              /* @__PURE__ */ _("header", { children: [
                /* @__PURE__ */ h("strong", { children: it[p.author_user_id]?.display_name || "账号不可用" }),
                /* @__PURE__ */ _("span", { children: [
                  "版本 ",
                  p.published_version,
                  " · ",
                  new Date(p.created_at).toLocaleString()
                ] })
              ] }),
              ra === p.id ? /* @__PURE__ */ _("div", { className: "knowledge-comment-edit", children: [
                /* @__PURE__ */ h("textarea", { value: Es, maxLength: 16384, onChange: (D) => un(D.target.value) }),
                /* @__PURE__ */ _("div", { className: "knowledge-actions", children: [
                  /* @__PURE__ */ h(le, { disabled: !Es.trim(), onClick: () => {
                    ed(p);
                  }, children: "保存评论" }),
                  /* @__PURE__ */ h(le, { onClick: () => {
                    Cs(""), un("");
                  }, children: "取消" })
                ] })
              ] }) : /* @__PURE__ */ h("p", { children: p.deleted ? "评论已删除" : p.body }),
              p.anchor.changed && /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "原评论位置已随页面版本变化。" }),
              p.mentioned_user_ids.length > 0 && /* @__PURE__ */ _("p", { className: "knowledge-subtle", children: [
                "提及 ",
                p.mentioned_user_ids.map((D) => `@${it[D]?.display_name || "账号不可用"}`).join("、")
              ] }),
              E.page.state === "active" && !p.deleted && ra !== p.id && /* @__PURE__ */ _("div", { className: "knowledge-actions", children: [
                /* @__PURE__ */ h(le, { onClick: () => Bs(p.id), children: "回复" }),
                /* @__PURE__ */ h(le, { onClick: () => {
                  Cs(p.id), un(p.body);
                }, children: "编辑" }),
                /* @__PURE__ */ h(le, { onClick: () => {
                  Yc(p);
                }, children: p.resolved ? "重新打开" : "标记解决" }),
                /* @__PURE__ */ h(le, { className: "danger", onClick: () => {
                  td(p);
                }, children: "删除" })
              ] })
            ] }, p.id)),
            !Jt && /* @__PURE__ */ h(le, { onClick: () => {
              ya();
            }, children: "加载更多评论" })
          ] }),
          j === "activity" && /* @__PURE__ */ _("section", { className: "knowledge-page-activity", children: [
            /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "活动由发布版本与评论实时合并，不另存第三份活动记录。" }),
            _a.map((p) => /* @__PURE__ */ _("div", { className: "knowledge-activity-item", children: [
              /* @__PURE__ */ h(Ma, { size: 15 }),
              /* @__PURE__ */ _("span", { children: [
                /* @__PURE__ */ h("strong", { children: p.title }),
                /* @__PURE__ */ _("small", { children: [
                  new Date(p.at).toLocaleString(),
                  " · ",
                  p.detail
                ] })
              ] })
            ] }, p.key)),
            _a.length === 0 && /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "暂无页面活动。" }),
            /* @__PURE__ */ _("div", { className: "knowledge-actions", children: [
              !bt && /* @__PURE__ */ h(le, { onClick: () => {
                Aa();
              }, children: "加载更早发布" }),
              !Jt && /* @__PURE__ */ h(le, { onClick: () => {
                ya();
              }, children: "加载更多评论" })
            ] })
          ] }),
          j === "access" && e.role === "manager" && /* @__PURE__ */ _("section", { className: "knowledge-page-access", children: [
            /* @__PURE__ */ h("h3", { children: "当前页面访问说明" }),
            /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "结果由服务端同时计算 Identity 功能权限、资料库实时成员角色和页面继承关系。" }),
            /* @__PURE__ */ _("label", { children: [
              "查找用户",
              /* @__PURE__ */ h("input", { value: xs, onChange: (p) => {
                aa(p.target.value), la("");
              }, placeholder: "输入姓名或邮箱" })
            ] }),
            /* @__PURE__ */ h("div", { className: "knowledge-principal-results", role: "listbox", children: Qc.map((p) => /* @__PURE__ */ _("button", { role: "option", "aria-selected": mn === p.user_id, onClick: () => {
              la(p.user_id), aa(p.display_name || p.email || p.user_id), oa([]);
            }, children: [
              p.avatar_url ? /* @__PURE__ */ h("img", { src: p.avatar_url, alt: "" }) : /* @__PURE__ */ h("span", { "aria-hidden": "true", children: (p.display_name || "?").slice(0, 1) }),
              /* @__PURE__ */ h("strong", { children: p.display_name }),
              /* @__PURE__ */ h("small", { children: p.email })
            ] }, p.user_id)) }),
            /* @__PURE__ */ _("label", { children: [
              "动作",
              /* @__PURE__ */ _("select", { value: Ds, onChange: (p) => Lc(p.target.value), children: [
                /* @__PURE__ */ h("option", { value: "knowledge.pages.get", children: "阅读页面" }),
                /* @__PURE__ */ h("option", { value: "knowledge.pages.update", children: "编辑草稿" }),
                /* @__PURE__ */ h("option", { value: "knowledge.pages.publish", children: "发布页面" }),
                /* @__PURE__ */ h("option", { value: "knowledge.page_comments.create", children: "发表评论" })
              ] })
            ] }),
            wt && /* @__PURE__ */ _("div", { className: "knowledge-access-preview", children: [
              /* @__PURE__ */ _("p", { children: [
                /* @__PURE__ */ _("strong", { children: [
                  "最终结论：",
                  wt.final.allowed ? "允许" : "拒绝"
                ] }),
                "（",
                wt.final.label,
                "）"
              ] }),
              /* @__PURE__ */ _("p", { children: [
                "Identity 功能权限：",
                wt.identity.allowed ? "允许" : "拒绝",
                " · ",
                wt.identity.label
              ] }),
              /* @__PURE__ */ _("p", { children: [
                "资料库成员角色：",
                wt.library.allowed ? "允许" : "拒绝",
                " · ",
                wt.library_role || "无成员关系",
                " · ",
                wt.library.label
              ] }),
              /* @__PURE__ */ _("p", { children: [
                "页面权限：",
                wt.page.allowed ? "允许" : "拒绝",
                " · ",
                wt.page.label,
                "；继承来源 ",
                wt.inherited_from || "资料库"
              ] })
            ] })
          ] }),
          j === "permissions" && e.role === "manager" && r.getPageAccess && r.setPageAccess && /* @__PURE__ */ _("section", { className: "knowledge-page-access knowledge-page-permissions", children: [
            /* @__PURE__ */ h("h3", { children: "页面与子树权限" }),
            /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "管理者始终保留治理访问。受限模式只允许当前资料库成员通过页面或子树 grant 访问，grant 角色不会超过成员的资料库角色。" }),
            Mr ? /* @__PURE__ */ _(at, { children: [
              /* @__PURE__ */ _("label", { children: [
                "访问模式",
                /* @__PURE__ */ _("select", { value: ar, disabled: zr, onChange: (p) => zs(p.target.value), children: [
                  /* @__PURE__ */ h("option", { value: "inherit", children: "继承资料库角色" }),
                  /* @__PURE__ */ h("option", { value: "restricted", children: "仅管理者和明确授权成员" })
                ] })
              ] }),
              ar === "inherit" ? /* @__PURE__ */ h("p", { className: "knowledge-access-preview", children: "本页完全继承资料库成员角色，不保存额外 grant。" }) : /* @__PURE__ */ _(at, { children: [
                /* @__PURE__ */ _("label", { children: [
                  "查找当前资料库成员",
                  /* @__PURE__ */ h("input", { value: Fs, disabled: zr, onChange: (p) => ca(p.target.value), placeholder: "按姓名或邮箱搜索" })
                ] }),
                /* @__PURE__ */ _("div", { className: "knowledge-permission-grant-options", children: [
                  /* @__PURE__ */ _("label", { children: [
                    "授权角色",
                    /* @__PURE__ */ _("select", { value: ua, onChange: (p) => Oc(p.target.value), children: [
                      /* @__PURE__ */ h("option", { value: "reader", children: "阅读者" }),
                      /* @__PURE__ */ h("option", { value: "editor", children: "编辑者" }),
                      /* @__PURE__ */ h("option", { value: "manager", children: "管理者" })
                    ] })
                  ] }),
                  /* @__PURE__ */ _("label", { children: [
                    "授权范围",
                    /* @__PURE__ */ _("select", { value: ha, onChange: (p) => $c(p.target.value), children: [
                      /* @__PURE__ */ h("option", { value: "page", children: "仅此页面" }),
                      /* @__PURE__ */ h("option", { value: "subtree", children: "此页面与子树" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ h("div", { className: "knowledge-principal-results", role: "listbox", children: Uc.map((p) => /* @__PURE__ */ _("button", { role: "option", onClick: () => qc(p), children: [
                  /* @__PURE__ */ h("span", { "aria-hidden": "true", children: (p.display_name || "?").slice(0, 1) }),
                  /* @__PURE__ */ h("strong", { children: p.display_name || p.user_id }),
                  /* @__PURE__ */ h("small", { children: p.email })
                ] }, p.user_id)) }),
                /* @__PURE__ */ _("div", { className: "knowledge-permission-grants", children: [
                  Ps.map((p) => /* @__PURE__ */ _("div", { children: [
                    /* @__PURE__ */ _("span", { children: [
                      /* @__PURE__ */ h("strong", { children: it[p.user_id]?.display_name || "账号不可用" }),
                      /* @__PURE__ */ _("small", { children: [
                        p.role === "reader" ? "阅读者" : p.role === "editor" ? "编辑者" : "管理者",
                        " · ",
                        p.scope === "page" ? "仅此页面" : "页面与子树"
                      ] })
                    ] }),
                    /* @__PURE__ */ h(le, { disabled: zr, onClick: () => Rr((D) => D.filter((X) => X.user_id !== p.user_id || X.scope !== p.scope)), children: "移除" })
                  ] }, `${p.user_id}:${p.scope}`)),
                  Ps.length === 0 && /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "尚未授权任何成员；除管理者外无人可访问。" })
                ] })
              ] }),
              /* @__PURE__ */ _("p", { className: "knowledge-subtle", children: [
                "当前 ACL revision ",
                Mr.revision,
                " · 远端投影 ",
                Mr.projection_status === "ready" ? "已确认" : "确认中（页面已从搜索结果隐藏）"
              ] }),
              /* @__PURE__ */ _(le, { disabled: zr, onClick: () => {
                Gc();
              }, children: [
                /* @__PURE__ */ h(Pa, { size: 14 }),
                zr ? "正在保存…" : "保存页面权限"
              ] })
            ] }) : /* @__PURE__ */ h("p", { role: "status", children: "正在读取服务端权限…" })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
const $m = { hybrid: "混合检索", dense: "语义检索", sparse: "关键词检索" }, Hm = {
  embedder_unavailable: "语义向量服务不可用，本次已降级为关键词检索。",
  bm25_unavailable: "关键词召回不可用，本次已降级为语义检索。",
  rerank_unavailable: "精排服务不可用，本次结果使用召回顺序。"
};
function jm(r) {
  if (!r || r.operation !== "search") return null;
  const e = [];
  return r.search_mode && e.push($m[r.search_mode]), Number.isSafeInteger(r.search_top_k) && r.search_top_k > 0 && e.push(`Top ${r.search_top_k}`), r.search_reranked !== void 0 && e.push(r.search_reranked ? "已精排" : "未精排"), {
    summary: e.join(" · "),
    degraded: r.search_degraded_reason ? Hm[r.search_degraded_reason] : ""
  };
}
function Rc(r) {
  return (r?.citations || []).filter((e) => e && e.doc_id && ["search", "fetch"].includes(e.operation));
}
function qm(r) {
  const e = [], t = /* @__PURE__ */ new Map();
  for (const n of Rc(r)) {
    const s = `${n.library_id || ""}:${n.doc_id}`, i = t.get(s);
    if (i === void 0) {
      t.set(s, e.length), e.push({ ...n, matchedPassages: 1 });
      continue;
    }
    const a = e[i], o = Number.isFinite(n.score) ? n.score : Number.NEGATIVE_INFINITY, l = Number.isFinite(a.score) ? a.score : Number.NEGATIVE_INFINITY, d = o > l || !a.excerpt && n.excerpt ? n : a;
    e[i] = { ...d, matchedPassages: a.matchedPassages + 1 };
  }
  return e;
}
const Dn = { reader: "阅读", editor: "编辑", manager: "管理" };
function Uo(r) {
  try {
    const e = new URL(r || "");
    return ["https:", "http:"].includes(e.protocol) && !e.username && !e.password && !/[\r\n\t]/.test(r || "") ? e.href : void 0;
  } catch {
    return;
  }
}
function Mn(r) {
  const e = r.location;
  if (!e) return "";
  const t = [];
  return Number.isInteger(e.page) && e.page > 0 && t.push(`第 ${e.page} 页`), Number.isInteger(e.slide) && e.slide > 0 && t.push(`第 ${e.slide} 张幻灯片`), e.section && e.section.length <= 256 && t.push(e.section), e.chunk_id && e.chunk_id.length <= 128 && t.push(`分块 ${e.chunk_id}`), e.sheet && e.sheet.length <= 128 && t.push(`工作表：${e.sheet}`), e.cell && /^[A-Z]{1,3}[1-9][0-9]{0,6}$/.test(e.cell) ? t.push(`单元格 ${e.cell}`) : Number.isInteger(e.row) && e.row > 0 && t.push(Number.isInteger(e.row_end) && e.row_end >= e.row ? `第 ${e.row}–${e.row_end} 行` : `第 ${e.row} 行`), Number.isInteger(e.line) && e.line > 0 && t.push(Number.isInteger(e.line_end) && e.line_end >= e.line ? `第 ${e.line}–${e.line_end} 行` : `第 ${e.line} 行`), Number.isInteger(e.paragraph) && e.paragraph >= 0 && t.push(`第 ${e.paragraph + 1} 段`), e.json_path && e.json_path.length <= 512 && t.push(`JSON ${e.json_path}`), e.html_id && e.html_id.length <= 256 && t.push(`#${e.html_id}`), Number.isInteger(e.start_ms) && e.start_ms >= 0 && t.push(`${e.media_kind === "video" ? "视频" : e.media_kind === "audio" ? "音频" : "媒体"} ${Oo(e.start_ms)}${Number.isInteger(e.end_ms) && e.end_ms > e.start_ms ? `–${Oo(e.end_ms)}` : ""}`), t.join(" · ");
}
function Oo(r) {
  const e = Math.floor(r / 1e3), t = Math.floor(e / 3600), n = Math.floor(e % 3600 / 60), s = e % 60;
  return t ? `${t}:${String(n).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${n}:${String(s).padStart(2, "0")}`;
}
function Rn(r) {
  const e = [];
  return Number.isSafeInteger(r.document_version) && r.document_version > 0 && e.push(`版本 ${r.document_version}`), r.source_revision && r.source_revision.length <= 128 && e.push(`来源修订 ${r.source_revision}`), Number.isFinite(r.score) && e.push(`相关度 ${r.score.toFixed(3)}`), r.content_sha256 && /^[a-f0-9]{64}$/i.test(r.content_sha256) && e.push(`SHA-256 ${r.content_sha256.slice(0, 12)}…`), e.join(" · ");
}
function ab({ client: r, formatError: e = tr }) {
  const [t, n] = L("personal"), [s, i] = L(""), [a, o] = L({ query: "", revision: 0 });
  return /* @__PURE__ */ _("main", { className: "knowledge-workspace", children: [
    /* @__PURE__ */ _("div", { className: "knowledge-workspace-toolbar", children: [
      /* @__PURE__ */ _("div", { className: "knowledge-workspace-tabs", role: "tablist", "aria-label": "知识库范围", children: [
        /* @__PURE__ */ _("button", { role: "tab", "aria-selected": t === "personal", onClick: () => n("personal"), children: [
          /* @__PURE__ */ h($t, { size: 17 }),
          /* @__PURE__ */ _("span", { children: [
            "个人知识库",
            /* @__PURE__ */ h("small", { children: "仅自己可见的知识空间" })
          ] })
        ] }),
        /* @__PURE__ */ _("button", { role: "tab", "aria-selected": t === "shared", onClick: () => n("shared"), children: [
          /* @__PURE__ */ h(Hn, { size: 17 }),
          /* @__PURE__ */ _("span", { children: [
            "团队知识库",
            /* @__PURE__ */ h("small", { children: "按成员角色共同维护" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ _("form", { className: "knowledge-global-search", role: "search", onSubmit: (l) => {
        l.preventDefault();
        const d = s.trim();
        d && o((f) => ({ query: d, revision: f.revision + 1 }));
      }, children: [
        /* @__PURE__ */ h(Ei, { size: 17, "aria-hidden": "true" }),
        /* @__PURE__ */ h("input", { "aria-label": "全文检索当前知识库", value: s, maxLength: 4096, onChange: (l) => i(l.target.value), placeholder: "全文检索当前知识库" }),
        a.query && /* @__PURE__ */ h(le, { type: "button", "aria-label": "清除全文检索", onClick: () => {
          i(""), o((l) => ({ query: "", revision: l.revision + 1 }));
        }, children: /* @__PURE__ */ h(rn, { size: 15 }) }),
        /* @__PURE__ */ h(le, { type: "submit", className: "primary", disabled: !s.trim(), children: "搜索" })
      ] })
    ] }),
    /* @__PURE__ */ h(zc, { client: r, formatError: e, libraryKind: t, searchQuery: a.query, searchRevision: a.revision }, t)
  ] });
}
function Gm({ client: r, formatError: e, library: t, initialQuery: n = "", hideSearchForm: s = !1 }) {
  const [i, a] = L(n), [o, l] = L(n), [d, f] = L(0), [g, m] = L(t?.id || ""), [u, y] = L(t ? [t] : []), [w, A] = L(""), [k, v] = L(null), [N, E] = L(null), [S, z] = L(null), [x, U] = L(!1), [Q, O] = L(!1), [K, B] = L("");
  ve(() => {
    if (t) {
      y([t]), m(t.id), A("");
      return;
    }
    const T = new AbortController();
    return (async () => {
      const ae = [], Y = /* @__PURE__ */ new Set();
      let de = "", H = !1;
      for (let $ = 0; $ < 20 && !H; $ += 1) {
        const oe = await r.listLibraries(de, 100, T.signal);
        if (T.signal.aborted) return;
        for (const ce of oe.items) Y.has(ce.id) || (Y.add(ce.id), ae.push(ce));
        if (H = oe.complete, H || !oe.next_after || oe.next_after === de) break;
        de = oe.next_after;
      }
      T.signal.aborted || (y(ae.filter(($) => $.knowledge_configured)), A(H ? "" : "资料库较多，仅显示前 2000 个可检索资料库。"));
    })().catch(() => {
      T.signal.aborted || A("资料库范围暂时无法读取，仍可检索默认知识源。");
    }), () => T.abort();
  }, [r, t]), ve(() => {
    if (!o) return;
    const T = new AbortController();
    return U(!0), B(""), v(null), E(null), z(null), r.search({ query: o, libraryID: g || void 0, signal: T.signal }).then((ae) => {
      T.signal.aborted || v(ae);
    }).catch((ae) => {
      T.signal.aborted || (v(null), B(e(ae)));
    }).finally(() => {
      T.signal.aborted || U(!1);
    }), () => T.abort();
  }, [r, e, g, o, d]);
  const R = dt(() => qm(k), [k]), b = jm(k);
  async function G(T) {
    if (!Q) {
      O(!0), B(""), z(T), E(null);
      try {
        E(await r.read(T.doc_id, T.library_id || g || void 0, AbortSignal.timeout(3e4)));
      } catch (ae) {
        B(e(ae));
      } finally {
        O(!1);
      }
    }
  }
  const ne = Rc(N);
  return /* @__PURE__ */ _("div", { className: "knowledge-browser-body", children: [
    /* @__PURE__ */ _("section", { className: "knowledge-search-column", children: [
      /* @__PURE__ */ _("div", { className: "knowledge-page-intro", children: [
        /* @__PURE__ */ h("span", { children: /* @__PURE__ */ h(Fa, { size: 22 }) }),
        /* @__PURE__ */ _("div", { children: [
          /* @__PURE__ */ h("h2", { children: t ? `全文检索「${t.name}」` : "全文检索" }),
          /* @__PURE__ */ h("p", { children: t ? "搜索当前知识库内有权读取的页面与文档。" : "选择默认知识源或一座资料库，再输入主题、问题或关键词。" })
        ] })
      ] }),
      !t && /* @__PURE__ */ _("label", { className: "knowledge-search-scope", children: [
        /* @__PURE__ */ h("span", { children: "检索范围" }),
        /* @__PURE__ */ _("select", { value: g, onChange: (T) => m(T.target.value), children: [
          /* @__PURE__ */ h("option", { value: "", children: "默认知识源" }),
          u.map((T) => /* @__PURE__ */ _("option", { value: T.id, children: [
            T.name,
            T.archived ? "（已归档）" : ""
          ] }, T.id))
        ] })
      ] }),
      w && /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: w }),
      !s && /* @__PURE__ */ _("form", { className: "knowledge-search-form", onSubmit: (T) => {
        T.preventDefault();
        const ae = i.trim();
        ae && (l(ae), f((Y) => Y + 1));
      }, children: [
        /* @__PURE__ */ h(Ei, { size: 18 }),
        /* @__PURE__ */ h("input", { "aria-label": "搜索知识库", value: i, maxLength: 4096, onChange: (T) => a(T.target.value), placeholder: "输入主题、问题或关键词" }),
        /* @__PURE__ */ h(le, { type: "submit", disabled: x || !i.trim(), children: x ? "正在检索…" : "搜索" })
      ] }),
      b?.summary && /* @__PURE__ */ _("p", { className: "knowledge-subtle", children: [
        "检索策略：",
        b.summary
      ] }),
      b?.degraded && /* @__PURE__ */ h("p", { role: "status", className: "knowledge-notice", children: b.degraded }),
      K && /* @__PURE__ */ h("p", { role: "alert", className: "knowledge-error knowledge-page-error", children: K }),
      !o && /* @__PURE__ */ _(Ut, { children: [
        /* @__PURE__ */ h(Fa, { size: 30 }),
        /* @__PURE__ */ h("h3", { children: "从一个问题开始" }),
        /* @__PURE__ */ h("p", { children: "知识服务只返回当前账号在所选范围内有权读取的内容。" })
      ] }),
      o && !x && k && R.length === 0 && /* @__PURE__ */ _(Ut, { children: [
        /* @__PURE__ */ h(Lt, { size: 30 }),
        /* @__PURE__ */ h("h3", { children: "没有可展示的文档" }),
        /* @__PURE__ */ h("p", { children: "没有命中相关内容，可以换一个更具体的关键词或检索范围。" })
      ] }),
      R.length > 0 && /* @__PURE__ */ h("div", { className: "knowledge-hit-list", children: R.map((T) => /* @__PURE__ */ _("button", { "aria-current": S?.doc_id === T.doc_id && (S.library_id || g || "") === (T.library_id || g || "") ? "true" : void 0, onClick: () => {
        G(T);
      }, children: [
        /* @__PURE__ */ h("span", { className: "knowledge-hit-icon", children: /* @__PURE__ */ h(Lt, { size: 19 }) }),
        /* @__PURE__ */ _("span", { children: [
          /* @__PURE__ */ h("strong", { children: T.title || T.doc_id }),
          /* @__PURE__ */ h("small", { children: T.excerpt || "打开查看文档内容" }),
          /* @__PURE__ */ _("em", { children: [
            "文档编号：",
            T.doc_id,
            T.matchedPassages > 1 ? ` · 命中 ${T.matchedPassages} 个片段` : "",
            Mn(T) ? ` · ${Mn(T)}` : ""
          ] }),
          Rn(T) && /* @__PURE__ */ h("em", { children: Rn(T) })
        ] })
      ] }, `${T.library_id || g || "default"}:${T.doc_id}`)) })
    ] }),
    /* @__PURE__ */ h("aside", { className: "knowledge-reader", "aria-label": "文档阅读区", children: S ? Q ? /* @__PURE__ */ _(Ut, { children: [
      /* @__PURE__ */ h(jt, { className: "knowledge-spin", size: 28 }),
      /* @__PURE__ */ h("p", { children: "正在读取文档…" })
    ] }) : N ? /* @__PURE__ */ _(at, { children: [
      /* @__PURE__ */ _("header", { children: [
        /* @__PURE__ */ h("span", { className: "knowledge-reader-icon", children: /* @__PURE__ */ h(Lt, { size: 20 }) }),
        /* @__PURE__ */ _("div", { children: [
          /* @__PURE__ */ h("h2", { children: S.title || N.doc_id || S.doc_id }),
          /* @__PURE__ */ _("p", { children: [
            "文档编号：",
            N.doc_id || S.doc_id,
            N.kb_id ? ` · 知识库 ${N.kb_id}` : ""
          ] })
        ] })
      ] }),
      ne.length ? /* @__PURE__ */ h("article", { className: "knowledge-passages", children: ne.map((T, ae) => /* @__PURE__ */ _("section", { children: [
        /* @__PURE__ */ _("small", { children: [
          "片段 ",
          ae + 1,
          Mn(T) ? ` · ${Mn(T)}` : "",
          T.excerpt_truncated ? " · 内容已截断" : ""
        ] }),
        Rn(T) && /* @__PURE__ */ h("small", { children: Rn(T) }),
        /* @__PURE__ */ h("p", { children: T.excerpt || "此片段没有可展示的正文。" })
      ] }, T.id || `${T.doc_id}:${T.chunk_id || ae}`)) }) : /* @__PURE__ */ h("div", { className: "knowledge-raw-document", children: /* @__PURE__ */ h("p", { children: "知识服务返回了文档，但没有生成可展示的正文片段。" }) }),
      Uo(S.url) && /* @__PURE__ */ h("a", { className: "knowledge-source-link", href: Uo(S.url), target: "_blank", rel: "noopener noreferrer", children: "打开来源链接 ↗" })
    ] }) : /* @__PURE__ */ _(Ut, { children: [
      /* @__PURE__ */ h(Lt, { size: 34 }),
      /* @__PURE__ */ h("h3", { children: "文档暂时无法显示" }),
      /* @__PURE__ */ h("p", { children: "请重新选择搜索结果。" })
    ] }) : /* @__PURE__ */ _(Ut, { children: [
      /* @__PURE__ */ h(Lt, { size: 34 }),
      /* @__PURE__ */ h("h3", { children: "选择一份文档查看" }),
      /* @__PURE__ */ h("p", { children: "搜索结果会在这里展开。" })
    ] }) })
  ] });
}
function zc({ client: r, formatError: e = tr, initialLibraryID: t = "", libraryKind: n, searchQuery: s = "", searchRevision: i = 0 }) {
  const [a, o] = L({ items: [], complete: !0 }), [l, d] = L([""]), [f, g] = L(t), [m, u] = L(null), [y, w] = L(0), [A, k] = L(!0), [v, N] = L(!1), [E, S] = L(""), [z, x] = L(""), [U, Q] = L(""), [O, K] = L(""), [B, R] = L(""), [b, G] = L(null), [ne, T] = L([""]), [ae, Y] = L(""), [de, H] = L("reader"), [$, oe] = L(""), [ce, ie] = L(""), [Ne, xe] = L([]), [j, ue] = L({}), [ye, pe] = L(null), [ge, ke] = L(!1), [c, W] = L(!1), [q, C] = L("content"), [I, P] = L(null), ee = Be(null), te = Be(!1), F = v || ge || c, V = l.at(-1) || "", se = ne.at(-1) || "", re = n ? a.items.filter((Z) => Z.kind === n) : a.items, fe = n !== "shared" && !A && !a.items.some((Z) => Z.kind === "personal"), Ee = n !== "personal";
  ve(() => {
    const Z = new AbortController();
    return k(!0), S(""), (async () => {
      let me = await r.listLibraries(V, 20, Z.signal);
      if (n) {
        const Fe = me.items.filter((Ye) => Ye.kind === n), Te = new Set(me.items.map((Ye) => Ye.id));
        let Ke = me.next_after, We = me.complete;
        for (let Ye = 1; Fe.length < 20 && !We && Ke && Ye < 20; Ye += 1) {
          const Jt = await r.listLibraries(Ke, 20, Z.signal);
          if (Z.signal.aborted) return;
          for (const Bt of Jt.items) Te.has(Bt.id) || (Te.add(Bt.id), Bt.kind === n && Fe.push(Bt));
          We = Jt.complete, Ke = Jt.next_after;
        }
        me = { items: Fe, next_after: We ? void 0 : Ke, complete: We };
      }
      Z.signal.aborted || (o(me), g((Fe) => Fe && me.items.some((Te) => Te.id === Fe && (!n || Te.kind === n)) ? Fe : me.items.find((Te) => !n || Te.kind === n)?.id || ""));
    })().catch((me) => {
      Z.signal.aborted || (o({ items: [], complete: !0 }), S(e(me)));
    }).finally(() => {
      Z.signal.aborted || k(!1);
    }), () => Z.abort();
  }, [r, e, V, n, y]), ve(() => {
    if (G(null), oe(""), !f) {
      u(null);
      return;
    }
    const Z = new AbortController();
    return r.getLibrary(f, Z.signal).then(async (me) => {
      Z.signal.aborted || (u(me), K(me.name), R(me.description), me.role === "manager" && me.kind === "shared" && G(await r.listMembers(me.id, se, 20, Z.signal)));
    }).catch((me) => {
      Z.signal.aborted || (u(null), G(null), S(e(me)));
    }), () => Z.abort();
  }, [r, e, se, y, f]), ve(() => {
    if (!b?.items.length) {
      ue({});
      return;
    }
    const Z = new AbortController();
    return r.resolvePrincipals(b.items.map((me) => me.user_id), Z.signal).then((me) => {
      Z.signal.aborted || ue(Object.fromEntries(me.filter((Fe) => Fe.status === "active").map((Fe) => [Fe.user_id, Fe])));
    }).catch(() => {
      Z.signal.aborted || ue({});
    }), () => Z.abort();
  }, [r, b]), ve(() => {
    i < 1 || C(s ? "search" : "content");
  }, [s, i]), ve(() => {
    const Z = ce.trim();
    if (!Z || !m || m.role !== "manager") {
      xe([]);
      return;
    }
    const me = new AbortController(), Fe = window.setTimeout(() => {
      r.searchPrincipals(Z, "", 20, me.signal).then((Te) => {
        me.signal.aborted || xe(Te.items.filter((Ke) => Ke.status === "active"));
      }).catch(() => {
        me.signal.aborted || xe([]);
      });
    }, 250);
    return () => {
      window.clearTimeout(Fe), me.abort();
    };
  }, [r, ce, m]), ve(() => {
    if (!m || !ae) {
      pe(null);
      return;
    }
    const Z = new AbortController();
    return r.explainAccess(m.id, { user_id: ae, action: "knowledge.pages.get", proposed_role: de }, Z.signal).then((me) => {
      Z.signal.aborted || pe(me);
    }).catch(() => {
      Z.signal.aborted || pe(null);
    }), () => Z.abort();
  }, [r, de, m, ae]);
  async function we(Z) {
    if (!(te.current || ge || c)) {
      te.current = !0, N(!0), S(""), x("");
      try {
        await Z(AbortSignal.timeout(6e4));
      } catch (me) {
        S(e(me));
      } finally {
        te.current = !1, N(!1), w((me) => me + 1);
      }
    }
  }
  function Ue(Z, me) {
    g(Z.id), u(Z), T([""]), x(me);
  }
  async function gt(Z, me) {
    const Fe = Z === "personal" ? "个人知识库" : U.trim();
    if (!Fe) return;
    const Te = ee.current;
    if (Te && (Te.kind !== Z || Te.name !== Fe)) throw Error("上次创建结果待确认；重试时需保持资料库名称不变。");
    const Ke = Te || { kind: Z, name: Fe, clientID: crypto.randomUUID() };
    ee.current = Ke;
    const We = await r.createLibrary(Ke, me);
    ee.current = null, Q(""), Ue(We, Z === "personal" ? "个人知识库已创建。" : "团队知识库已创建，当前只有你一位成员。");
  }
  async function Ze(Z) {
    m && Ue(await r.updateLibrary(m.id, { name: O.trim(), description: B, archived: m.archived, expectedRevision: m.revision }, Z), "资料库设置已保存。");
  }
  async function bt(Z) {
    m && Ue(await r.setLibraryArchived(m.id, !m.archived, m.revision, Z), m.archived ? "资料库已恢复。" : "资料库已归档。");
  }
  async function Me(Z) {
    !m || !ae.trim() || (Ue(await r.setMember(m.id, ae.trim(), de, b?.revision ?? m.revision, Z), "成员角色已保存，后续访问使用新权限。"), Y(""), ie(""), xe([]), pe(null));
  }
  async function st(Z) {
    !m || !$ || (Ue(await r.removeMember(m.id, $, b?.revision ?? m.revision, Z), "成员已移出资料库。"), oe(""));
  }
  function Pt(Z) {
    g(Z.id), T([""]), C("content"), P(null);
  }
  function rt(Z) {
    return /* @__PURE__ */ _("button", { "aria-current": f === Z.id ? "true" : void 0, disabled: F, onClick: () => Pt(Z), children: [
      /* @__PURE__ */ h($t, { size: 18 }),
      /* @__PURE__ */ _("span", { children: [
        /* @__PURE__ */ h("strong", { children: Z.name }),
        /* @__PURE__ */ _("small", { children: [
          Z.kind === "personal" ? "仅自己可见" : `${Dn[Z.role] || Z.role}权限`,
          Z.archived ? " · 已归档" : ""
        ] })
      ] })
    ] }, Z.id);
  }
  return /* @__PURE__ */ _("div", { className: `managed-library-browser${n === "personal" ? " is-personal" : ""}`, children: [
    /* @__PURE__ */ _("aside", { className: "managed-library-list", children: [
      /* @__PURE__ */ _("div", { children: [
        /* @__PURE__ */ h("h2", { children: n === "personal" ? "个人知识库" : n === "shared" ? "团队知识库" : "知识库" }),
        /* @__PURE__ */ h(le, { "aria-label": "刷新知识库", disabled: F || A, onClick: () => w((Z) => Z + 1), children: /* @__PURE__ */ h(jt, { size: 14 }) })
      ] }),
      (fe || Ee) && /* @__PURE__ */ _("div", { className: "knowledge-library-create", children: [
        fe && /* @__PURE__ */ _(le, { disabled: F, onClick: () => {
          we((Z) => gt("personal", Z));
        }, children: [
          /* @__PURE__ */ h($t, { size: 15 }),
          "创建个人知识库"
        ] }),
        Ee && /* @__PURE__ */ _("div", { children: [
          /* @__PURE__ */ h("input", { "aria-label": "新团队知识库名称", maxLength: 128, value: U, disabled: F, onChange: (Z) => Q(Z.target.value), placeholder: "新团队知识库名称" }),
          /* @__PURE__ */ h(le, { "aria-label": "创建团队知识库", disabled: F || !U.trim(), onClick: () => {
            we((Z) => gt("shared", Z));
          }, children: /* @__PURE__ */ h(Ho, { size: 15 }) })
        ] })
      ] }),
      m && !a.items.some((Z) => Z.id === m.id) && /* @__PURE__ */ _("button", { "aria-current": "true", disabled: F, children: [
        /* @__PURE__ */ h($t, { size: 18 }),
        /* @__PURE__ */ _("span", { children: [
          /* @__PURE__ */ h("strong", { children: m.name }),
          /* @__PURE__ */ h("small", { children: "当前知识库 · 不在本页" })
        ] })
      ] }),
      A ? /* @__PURE__ */ h("p", { className: "knowledge-subtle", children: "正在读取知识库…" }) : re.length ? re.map(rt) : /* @__PURE__ */ h("p", { className: "knowledge-library-group-empty", children: n === "personal" ? "尚未创建个人知识库" : n === "shared" ? "尚未加入团队知识库" : "暂无可访问的知识库" }),
      (l.length > 1 || !a.complete) && /* @__PURE__ */ _("nav", { className: "knowledge-pagination", children: [
        /* @__PURE__ */ h(le, { disabled: F || A || l.length === 1, onClick: () => {
          g(""), d((Z) => Z.slice(0, -1));
        }, children: "上一页" }),
        /* @__PURE__ */ h(le, { disabled: F || A || !a.next_after, onClick: () => {
          g(""), d((Z) => [...Z, a.next_after]);
        }, children: "下一页" })
      ] }),
      E && /* @__PURE__ */ h("p", { role: "alert", className: "knowledge-error", children: E })
    ] }),
    /* @__PURE__ */ _("section", { className: "managed-library-content", children: [
      z && /* @__PURE__ */ h("p", { role: "status", className: "knowledge-notice", children: z }),
      m ? /* @__PURE__ */ _(at, { children: [
        /* @__PURE__ */ h("div", { className: `knowledge-library-surface${q === "search" ? " is-search" : " is-pages"}`, children: q === "search" ? /* @__PURE__ */ h(Gm, { client: r, formatError: e, library: m, initialQuery: s, hideSearchForm: !0 }, `${m.id}:${i}`) : /* @__PURE__ */ h(Om, { client: r, library: m, disabled: F, formatError: e, embedded: !0, onManage: m.role === "manager" ? () => P("manage") : void 0, documents: ({ selectedDocumentID: Z, showUploader: me, onDocumentsChange: Fe, onSelectedDocumentChange: Te }) => /* @__PURE__ */ h(Kh, { client: r, initialLibrary: m, formatError: e, onBusyChange: ke, onOpenLibrary: (Ke) => {
          g(Ke), T([""]), w((We) => We + 1);
        }, embedded: !0, hideList: !0, showUploader: me, selectedDocumentID: Z, onSelectedDocumentChange: Te, onDocumentsChange: Fe }, m.id) }) }),
        I === "manage" && m.role === "manager" && tn(/* @__PURE__ */ h("div", { className: "knowledge-modal-backdrop", role: "presentation", onMouseDown: (Z) => {
          Z.target === Z.currentTarget && !F && P(null);
        }, children: /* @__PURE__ */ _("section", { className: "knowledge-manager-dialog knowledge-library-management-dialog", role: "dialog", "aria-modal": "true", "aria-label": "知识库管理", children: [
          /* @__PURE__ */ _("header", { children: [
            /* @__PURE__ */ _("div", { children: [
              /* @__PURE__ */ _("h2", { children: [
                "管理“",
                m.name,
                "”"
              ] }),
              /* @__PURE__ */ h("p", { children: "维护知识库信息、成员权限与外部内容连接。" })
            ] }),
            /* @__PURE__ */ h(le, { "aria-label": "关闭知识库管理", disabled: F, onClick: () => P(null), children: /* @__PURE__ */ h(rn, { size: 17 }) })
          ] }),
          /* @__PURE__ */ _("div", { className: "knowledge-dialog-scroll knowledge-management-sections", children: [
            /* @__PURE__ */ _("section", { className: "knowledge-settings", children: [
              /* @__PURE__ */ h("header", { children: /* @__PURE__ */ _("div", { children: [
                /* @__PURE__ */ h("h3", { children: "基本信息" }),
                /* @__PURE__ */ h("p", { children: "名称和说明会展示给所有知识库成员。" })
              ] }) }),
              /* @__PURE__ */ _("div", { className: "knowledge-form-grid", children: [
                /* @__PURE__ */ _("label", { children: [
                  "名称",
                  /* @__PURE__ */ h("input", { value: O, maxLength: 128, disabled: F, onChange: (Z) => K(Z.target.value) })
                ] }),
                /* @__PURE__ */ _("label", { children: [
                  "说明",
                  /* @__PURE__ */ h("textarea", { value: B, maxLength: 1024, disabled: F, onChange: (Z) => R(Z.target.value) })
                ] })
              ] }),
              /* @__PURE__ */ _("div", { className: "knowledge-actions", children: [
                /* @__PURE__ */ h(le, { className: "primary", disabled: F || !O.trim(), onClick: () => {
                  we(Ze);
                }, children: "保存信息" }),
                /* @__PURE__ */ h(le, { className: m.archived ? void 0 : "danger", disabled: F, onClick: () => {
                  we(bt);
                }, children: m.archived ? "恢复知识库" : "归档知识库" })
              ] })
            ] }),
            m.kind === "shared" && /* @__PURE__ */ _("section", { className: "knowledge-members", children: [
              /* @__PURE__ */ h("header", { children: /* @__PURE__ */ _("div", { children: [
                /* @__PURE__ */ h("h3", { children: "成员与角色" }),
                /* @__PURE__ */ h("p", { children: "阅读者可查看与评论，编辑者可维护内容，管理者负责成员及配置。至少保留一位管理者。" })
              ] }) }),
              /* @__PURE__ */ h("div", { className: "knowledge-member-list", children: b?.items.map((Z) => {
                const me = j[Z.user_id];
                return /* @__PURE__ */ _("div", { className: "knowledge-member", children: [
                  /* @__PURE__ */ h("span", { className: "knowledge-member-avatar", "aria-hidden": "true", children: (me?.display_name || "?").slice(0, 1) }),
                  /* @__PURE__ */ _("span", { children: [
                    me?.display_name || "账号不可用",
                    /* @__PURE__ */ _("small", { children: [
                      me?.email || Z.user_id,
                      " · ",
                      Dn[Z.role]
                    ] })
                  ] }),
                  /* @__PURE__ */ h(le, { disabled: F, onClick: () => {
                    Y(Z.user_id), ie(me?.display_name || Z.user_id), H(Z.role), oe("");
                  }, children: "调整" }),
                  /* @__PURE__ */ h(le, { className: "danger", disabled: F, onClick: () => oe(Z.user_id), children: "移除" })
                ] }, Z.user_id);
              }) }),
              b && (ne.length > 1 || !b.complete) && /* @__PURE__ */ _("nav", { className: "knowledge-pagination", children: [
                /* @__PURE__ */ h(le, { disabled: F || ne.length === 1, onClick: () => T((Z) => Z.slice(0, -1)), children: "上一页" }),
                /* @__PURE__ */ h(le, { disabled: F || !b.next_after, onClick: () => T((Z) => [...Z, b.next_after]), children: "下一页" })
              ] }),
              /* @__PURE__ */ _("div", { className: "knowledge-member-editor", children: [
                /* @__PURE__ */ _("label", { children: [
                  "搜索工作区成员",
                  /* @__PURE__ */ h("input", { value: ce, maxLength: 255, disabled: F, onChange: (Z) => {
                    ie(Z.target.value), Y("");
                  }, placeholder: "输入姓名或邮箱" })
                ] }),
                Ne.length > 0 && /* @__PURE__ */ h("div", { className: "knowledge-principal-results", role: "listbox", children: Ne.map((Z) => /* @__PURE__ */ _("button", { role: "option", "aria-selected": ae === Z.user_id, onClick: () => {
                  Y(Z.user_id), ie(Z.display_name || Z.email || Z.user_id), xe([]);
                }, children: [
                  Z.avatar_url ? /* @__PURE__ */ h("img", { src: Z.avatar_url, alt: "" }) : /* @__PURE__ */ h("span", { "aria-hidden": "true", children: (Z.display_name || "?").slice(0, 1) }),
                  /* @__PURE__ */ h("strong", { children: Z.display_name || Z.user_id }),
                  /* @__PURE__ */ h("small", { children: Z.email })
                ] }, Z.user_id)) }),
                /* @__PURE__ */ _("label", { children: [
                  "角色",
                  /* @__PURE__ */ h("select", { value: de, disabled: F, onChange: (Z) => H(Z.target.value), children: Object.entries(Dn).map(([Z, me]) => /* @__PURE__ */ h("option", { value: Z, children: me }, Z)) })
                ] }),
                /* @__PURE__ */ h(le, { className: "primary", disabled: F || !ae, onClick: () => {
                  we(Me);
                }, children: "保存成员角色" })
              ] }),
              ye && /* @__PURE__ */ _("div", { className: "knowledge-access-preview", children: [
                /* @__PURE__ */ h("strong", { children: "邀请前访问预览" }),
                /* @__PURE__ */ _("p", { children: [
                  "Identity 功能权限：",
                  ye.identity.allowed ? "允许" : "拒绝",
                  "；拟授予知识库角色：",
                  Dn[de],
                  "；影响 ",
                  ye.impact_pages,
                  " 个活动页面。"
                ] }),
                /* @__PURE__ */ _("p", { children: [
                  "最终页面阅读：",
                  ye.final.allowed ? "允许" : "拒绝",
                  "。页面权限继承自知识库，不存在前端自算 ACL。"
                ] })
              ] }),
              $ && /* @__PURE__ */ _("div", { className: "knowledge-confirm", children: [
                /* @__PURE__ */ _("p", { children: [
                  "将“",
                  j[$]?.display_name || "账号不可用",
                  "”移出“",
                  m.name,
                  "”？该成员将失去知识库访问权限。"
                ] }),
                /* @__PURE__ */ _("div", { className: "knowledge-actions", children: [
                  /* @__PURE__ */ h(le, { className: "danger", disabled: F, onClick: () => {
                    we(st);
                  }, children: "确认移除" }),
                  /* @__PURE__ */ h(le, { disabled: F, onClick: () => oe(""), children: "保留成员" })
                ] })
              ] })
            ] }),
            m.sources_manageable && /* @__PURE__ */ h(ef, { client: r, library: m, disabled: v || ge, formatError: e, onBusyChange: W, onBound: (Z) => {
              u(Z), w((me) => me + 1);
            } }),
            E && /* @__PURE__ */ h("p", { role: "alert", className: "knowledge-error", children: E })
          ] })
        ] }) }), window.document.body)
      ] }) : A ? null : /* @__PURE__ */ _(Ut, { children: [
        /* @__PURE__ */ h(Dd, { size: 32 }),
        /* @__PURE__ */ h("h3", { children: re.length > 0 ? "请选择知识库" : n === "personal" ? "还没有个人知识库" : "还没有可访问的团队知识库" }),
        /* @__PURE__ */ h("p", { children: n === "personal" ? "打开个人知识库后，可在自己的空间内检索、编辑和整理内容。" : "创建团队知识库，或请团队管理员将你添加为成员。" }),
        fe && /* @__PURE__ */ _(le, { className: "primary", disabled: F, onClick: () => {
          we((Z) => gt("personal", Z));
        }, children: [
          /* @__PURE__ */ h($t, { size: 15 }),
          "创建个人知识库"
        ] })
      ] })
    ] })
  ] });
}
function ob({ client: r, formatError: e = tr, onClose: t }) {
  const [n, s] = L("personal");
  return tn(/* @__PURE__ */ h("div", { className: "knowledge-modal-backdrop", role: "presentation", children: /* @__PURE__ */ _("section", { className: "knowledge-manager-dialog", role: "dialog", "aria-modal": "true", "aria-label": "知识库", children: [
    /* @__PURE__ */ _("header", { children: [
      /* @__PURE__ */ _("div", { children: [
        /* @__PURE__ */ h("h2", { children: "知识库" }),
        /* @__PURE__ */ h("p", { children: "个人知识库仅自己可见；团队知识库按成员角色共同维护。" })
      ] }),
      /* @__PURE__ */ h(le, { "aria-label": "关闭", onClick: t, children: /* @__PURE__ */ h(rn, { size: 17 }) })
    ] }),
    /* @__PURE__ */ _("div", { className: "knowledge-workspace-tabs", role: "tablist", "aria-label": "知识库范围", children: [
      /* @__PURE__ */ _("button", { role: "tab", "aria-selected": n === "personal", onClick: () => s("personal"), children: [
        /* @__PURE__ */ h($t, { size: 17 }),
        /* @__PURE__ */ h("span", { children: "个人知识库" })
      ] }),
      /* @__PURE__ */ _("button", { role: "tab", "aria-selected": n === "shared", onClick: () => s("shared"), children: [
        /* @__PURE__ */ h(Hn, { size: 17 }),
        /* @__PURE__ */ h("span", { children: "团队知识库" })
      ] })
    ] }),
    /* @__PURE__ */ h(zc, { client: r, formatError: e, libraryKind: n }, n)
  ] }) }), window.document.body);
}
export {
  Rm as A,
  le as B,
  St as C,
  sr as D,
  zo as E,
  Zm as F,
  Jh as G,
  ob as H,
  Pe as I,
  Om as J,
  zc as K,
  ab as L,
  Yo as M,
  tl as N,
  lu as O,
  su as P,
  rl as Q,
  oc as R,
  mp as S,
  Lm as T,
  sb as U,
  Kd as V,
  Er as Y,
  Cn as a,
  rc as b,
  En as c,
  bp as d,
  an as e,
  Et as f,
  wu as g,
  ns as h,
  _r as i,
  Cr as j,
  qe as k,
  Kg as l,
  eb as m,
  ac as n,
  tb as o,
  Kn as p,
  _e as q,
  rb as r,
  nb as s,
  ib as t,
  Ym as u,
  Nt as v,
  ip as w,
  lp as x,
  Km as y,
  Is as z
};
