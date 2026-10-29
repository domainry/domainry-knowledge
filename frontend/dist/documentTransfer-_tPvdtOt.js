import { k as nt } from "./index-DYsA9s7a.js";
function rn(n, i) {
  (i == null || i > n.length) && (i = n.length);
  for (var s = 0, l = Array(i); s < i; s++) l[s] = n[s];
  return l;
}
function fo(n) {
  if (Array.isArray(n)) return n;
}
function po(n, i) {
  var s = n == null ? null : typeof Symbol < "u" && n[Symbol.iterator] || n["@@iterator"];
  if (s != null) {
    var l, u, d, h, v = [], R = !0, X = !1;
    try {
      if (d = (s = s.call(n)).next, i !== 0) for (; !(R = (l = d.call(s)).done) && (v.push(l.value), v.length !== i); R = !0) ;
    } catch (ot) {
      X = !0, u = ot;
    } finally {
      try {
        if (!R && s.return != null && (h = s.return(), Object(h) !== h)) return;
      } finally {
        if (X) throw u;
      }
    }
    return v;
  }
}
function mo() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ho(n, i) {
  return fo(n) || po(n, i) || To(n, i) || mo();
}
function To(n, i) {
  if (n) {
    if (typeof n == "string") return rn(n, i);
    var s = {}.toString.call(n).slice(8, -1);
    return s === "Object" && n.constructor && (s = n.constructor.name), s === "Map" || s === "Set" ? Array.from(n) : s === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s) ? rn(n, i) : void 0;
  }
}
const Sn = Object.entries, an = Object.setPrototypeOf, go = Object.isFrozen, wn = Object.getPrototypeOf, On = Object.getOwnPropertyDescriptor;
let S = Object.freeze, O = Object.seal, dt = Object.create, Rn = typeof Reflect < "u" && Reflect, ye = Rn.apply, Se = Rn.construct;
S || (S = function(i) {
  return i;
});
O || (O = function(i) {
  return i;
});
ye || (ye = function(i, s) {
  for (var l = arguments.length, u = new Array(l > 2 ? l - 2 : 0), d = 2; d < l; d++) u[d - 2] = arguments[d];
  return i.apply(s, u);
});
Se || (Se = function(i) {
  for (var s = arguments.length, l = new Array(s > 1 ? s - 1 : 0), u = 1; u < s; u++) l[u - 1] = arguments[u];
  return new i(...l);
});
const B = A(Array.prototype.forEach), _o = A(Array.prototype.lastIndexOf), sn = A(Array.prototype.pop), St = A(Array.prototype.push), Ao = A(Array.prototype.slice), bo = A(Array.prototype.splice), ht = Array.isArray, me = Ln(Set), de = A(Set.prototype.add), wt = A(Set.prototype.has), et = A(String.prototype.toLowerCase), he = A(String.prototype.toString), ln = A(String.prototype.match), Ot = A(String.prototype.replace), cn = A(String.prototype.indexOf), Eo = A(String.prototype.trim), yo = A(Number.prototype.toString), So = A(Boolean.prototype.toString), un = typeof BigInt > "u" ? null : A(BigInt.prototype.toString), fn = typeof Symbol > "u" ? null : A(Symbol.prototype.toString), M = A(Object.prototype.hasOwnProperty), Rt = A(Object.prototype.toString), w = A(RegExp.prototype.test), G = Ln(TypeError);
function A(n) {
  return function(i) {
    i instanceof RegExp && (i.lastIndex = 0);
    for (var s = arguments.length, l = new Array(s > 1 ? s - 1 : 0), u = 1; u < s; u++) l[u - 1] = arguments[u];
    return ye(n, i, l);
  };
}
function Ln(n) {
  return function() {
    for (var i = arguments.length, s = new Array(i), l = 0; l < i; l++) s[l] = arguments[l];
    return Se(n, s);
  };
}
function m(n, i) {
  let s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : et;
  if (an && an(n, null), !ht(i)) return n;
  let l = i.length;
  for (; l--; ) {
    let u = i[l];
    if (typeof u == "string") {
      const d = s(u);
      d !== u && (go(i) || (i[l] = d), u = d);
    }
    n[u] = !0;
  }
  return n;
}
function wo(n) {
  for (let i = 0; i < n.length; i++) M(n, i) || (n[i] = null);
  return n;
}
function x(n) {
  const i = dt(null);
  for (const l of Sn(n)) {
    var s = ho(l, 2);
    const u = s[0], d = s[1];
    M(n, u) && (ht(d) ? i[u] = wo(d) : d && typeof d == "object" && d.constructor === Object ? i[u] = x(d) : i[u] = d);
  }
  return i;
}
function Oo(n) {
  switch (typeof n) {
    case "string":
      return n;
    case "number":
      return yo(n);
    case "boolean":
      return So(n);
    case "bigint":
      return un ? un(n) : "0";
    case "symbol":
      return fn ? fn(n) : "Symbol()";
    case "undefined":
      return Rt(n);
    case "function":
    case "object": {
      if (n === null) return Rt(n);
      const i = n, s = C(i, "toString");
      if (typeof s == "function") {
        const l = s(i);
        return typeof l == "string" ? l : Rt(l);
      }
      return Rt(n);
    }
    default:
      return Rt(n);
  }
}
function C(n, i) {
  for (; n !== null; ) {
    const l = On(n, i);
    if (l) {
      if (l.get) return A(l.get);
      if (typeof l.value == "function") return A(l.value);
    }
    n = wn(n);
  }
  function s() {
    return null;
  }
  return s;
}
function Ro(n, i) {
  for (; n !== null; ) {
    const s = On(n, i);
    if (s) return s.get ? A(s.get) : null;
    n = wn(n);
  }
  return null;
}
function Lo(n) {
  try {
    return w(n, ""), !0;
  } catch {
    return !1;
  }
}
const pn = S([
  "a",
  "abbr",
  "acronym",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "bdi",
  "bdo",
  "big",
  "blink",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "content",
  "data",
  "datalist",
  "dd",
  "decorator",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "element",
  "em",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "map",
  "mark",
  "marquee",
  "menu",
  "menuitem",
  "meter",
  "nav",
  "nobr",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "search",
  "section",
  "select",
  "shadow",
  "slot",
  "small",
  "source",
  "spacer",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
]), Te = S([
  "svg",
  "a",
  "altglyph",
  "altglyphdef",
  "altglyphitem",
  "animatecolor",
  "animatemotion",
  "animatetransform",
  "circle",
  "clippath",
  "defs",
  "desc",
  "ellipse",
  "enterkeyhint",
  "exportparts",
  "filter",
  "font",
  "g",
  "glyph",
  "glyphref",
  "hkern",
  "image",
  "inputmode",
  "line",
  "lineargradient",
  "marker",
  "mask",
  "metadata",
  "mpath",
  "part",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialgradient",
  "rect",
  "stop",
  "style",
  "switch",
  "symbol",
  "text",
  "textpath",
  "title",
  "tref",
  "tspan",
  "view",
  "vkern"
]), ge = S([
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence"
]), Do = S([
  "animate",
  "color-profile",
  "cursor",
  "discard",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignobject",
  "hatch",
  "hatchpath",
  "mesh",
  "meshgradient",
  "meshpatch",
  "meshrow",
  "missing-glyph",
  "script",
  "set",
  "solidcolor",
  "unknown",
  "use"
]), _e = S([
  "math",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mglyph",
  "mi",
  "mlabeledtr",
  "mmultiscripts",
  "mn",
  "mo",
  "mover",
  "mpadded",
  "mphantom",
  "mroot",
  "mrow",
  "ms",
  "mspace",
  "msqrt",
  "mstyle",
  "msub",
  "msup",
  "msubsup",
  "mtable",
  "mtd",
  "mtext",
  "mtr",
  "munder",
  "munderover",
  "mprescripts"
]), Io = S([
  "maction",
  "maligngroup",
  "malignmark",
  "mlongdiv",
  "mscarries",
  "mscarry",
  "msgroup",
  "mstack",
  "msline",
  "msrow",
  "semantics",
  "annotation",
  "annotation-xml",
  "mprescripts",
  "none"
]), mn = S(["#text"]), dn = S([
  "accept",
  "action",
  "align",
  "alt",
  "autocapitalize",
  "autocomplete",
  "autopictureinpicture",
  "autoplay",
  "background",
  "bgcolor",
  "border",
  "capture",
  "cellpadding",
  "cellspacing",
  "checked",
  "cite",
  "class",
  "clear",
  "color",
  "cols",
  "colspan",
  "command",
  "commandfor",
  "controls",
  "controlslist",
  "coords",
  "crossorigin",
  "datetime",
  "decoding",
  "default",
  "dir",
  "disabled",
  "disablepictureinpicture",
  "disableremoteplayback",
  "download",
  "draggable",
  "enctype",
  "enterkeyhint",
  "exportparts",
  "face",
  "for",
  "headers",
  "height",
  "hidden",
  "high",
  "href",
  "hreflang",
  "id",
  "inert",
  "inputmode",
  "integrity",
  "ismap",
  "kind",
  "label",
  "lang",
  "list",
  "loading",
  "loop",
  "low",
  "max",
  "maxlength",
  "media",
  "method",
  "min",
  "minlength",
  "multiple",
  "muted",
  "name",
  "nonce",
  "noshade",
  "novalidate",
  "nowrap",
  "open",
  "optimum",
  "part",
  "pattern",
  "placeholder",
  "playsinline",
  "popover",
  "popovertarget",
  "popovertargetaction",
  "poster",
  "preload",
  "pubdate",
  "radiogroup",
  "readonly",
  "rel",
  "required",
  "rev",
  "reversed",
  "role",
  "rows",
  "rowspan",
  "spellcheck",
  "scope",
  "selected",
  "shape",
  "size",
  "sizes",
  "slot",
  "span",
  "srclang",
  "start",
  "src",
  "srcset",
  "step",
  "style",
  "summary",
  "tabindex",
  "title",
  "translate",
  "type",
  "usemap",
  "valign",
  "value",
  "width",
  "wrap",
  "xmlns"
]), Ae = S([
  "accent-height",
  "accumulate",
  "additive",
  "alignment-baseline",
  "amplitude",
  "ascent",
  "attributename",
  "attributetype",
  "azimuth",
  "basefrequency",
  "baseline-shift",
  "begin",
  "bias",
  "by",
  "class",
  "clip",
  "clippathunits",
  "clip-path",
  "clip-rule",
  "color",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "cx",
  "cy",
  "d",
  "dx",
  "dy",
  "diffuseconstant",
  "direction",
  "display",
  "divisor",
  "dominant-baseline",
  "dur",
  "edgemode",
  "elevation",
  "end",
  "exponent",
  "fill",
  "fill-opacity",
  "fill-rule",
  "filter",
  "filterunits",
  "flood-color",
  "flood-opacity",
  "font-family",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-variant",
  "font-weight",
  "fx",
  "fy",
  "g1",
  "g2",
  "glyph-name",
  "glyphref",
  "gradientunits",
  "gradienttransform",
  "height",
  "href",
  "id",
  "image-rendering",
  "in",
  "in2",
  "intercept",
  "k",
  "k1",
  "k2",
  "k3",
  "k4",
  "kerning",
  "keypoints",
  "keysplines",
  "keytimes",
  "lang",
  "lengthadjust",
  "letter-spacing",
  "kernelmatrix",
  "kernelunitlength",
  "lighting-color",
  "local",
  "marker-end",
  "marker-mid",
  "marker-start",
  "markerheight",
  "markerunits",
  "markerwidth",
  "maskcontentunits",
  "maskunits",
  "max",
  "mask",
  "mask-type",
  "media",
  "method",
  "mode",
  "min",
  "name",
  "numoctaves",
  "offset",
  "operator",
  "opacity",
  "order",
  "orient",
  "orientation",
  "origin",
  "overflow",
  "paint-order",
  "path",
  "pathlength",
  "patterncontentunits",
  "patterntransform",
  "patternunits",
  "pointer-events",
  "points",
  "preservealpha",
  "preserveaspectratio",
  "primitiveunits",
  "r",
  "rx",
  "ry",
  "radius",
  "refx",
  "refy",
  "repeatcount",
  "repeatdur",
  "restart",
  "result",
  "rotate",
  "scale",
  "seed",
  "shape-rendering",
  "slope",
  "specularconstant",
  "specularexponent",
  "spreadmethod",
  "startoffset",
  "stddeviation",
  "stitchtiles",
  "stop-color",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke",
  "stroke-width",
  "style",
  "surfacescale",
  "systemlanguage",
  "tabindex",
  "tablevalues",
  "targetx",
  "targety",
  "transform",
  "transform-origin",
  "text-anchor",
  "text-decoration",
  "text-orientation",
  "text-rendering",
  "textlength",
  "type",
  "u1",
  "u2",
  "unicode",
  "values",
  "vector-effect",
  "viewbox",
  "visibility",
  "version",
  "vert-adv-y",
  "vert-origin-x",
  "vert-origin-y",
  "width",
  "word-spacing",
  "wrap",
  "writing-mode",
  "xchannelselector",
  "ychannelselector",
  "x",
  "x1",
  "x2",
  "xmlns",
  "y",
  "y1",
  "y2",
  "z",
  "zoomandpan"
]), hn = S([
  "accent",
  "accentunder",
  "align",
  "bevelled",
  "close",
  "columnalign",
  "columnlines",
  "columnspacing",
  "columnspan",
  "denomalign",
  "depth",
  "dir",
  "display",
  "displaystyle",
  "encoding",
  "fence",
  "frame",
  "height",
  "href",
  "id",
  "largeop",
  "length",
  "linethickness",
  "lquote",
  "lspace",
  "mathbackground",
  "mathcolor",
  "mathsize",
  "mathvariant",
  "maxsize",
  "minsize",
  "movablelimits",
  "notation",
  "numalign",
  "open",
  "rowalign",
  "rowlines",
  "rowspacing",
  "rowspan",
  "rspace",
  "rquote",
  "scriptlevel",
  "scriptminsize",
  "scriptsizemultiplier",
  "selection",
  "separator",
  "separators",
  "stretchy",
  "subscriptshift",
  "supscriptshift",
  "symmetric",
  "voffset",
  "width",
  "xmlns"
]), zt = S([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), No = O(/{{[\w\W]*|^[\w\W]*}}/g), Mo = O(/<%[\w\W]*|^[\w\W]*%>/g), xo = O(/\${[\w\W]*/g), ko = O(/^data-[\-\w.\u00B7-\uFFFF]+$/), Co = O(/^aria-[\-\w]+$/), Tn = O(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), vo = O(/^(?:\w+script|data):/i), Po = O(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), Uo = O(/^html$/i), zo = O(/^[a-z][.\w]*(-[.\w]+)+$/i), be = O(/<[/\w!]/g), gn = O(/<[/\w]/g), Fo = O(/<\/no(script|embed|frames)/i), _n = O(/\/>/i), E = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  entityNode: 6,
  processingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
}, Ho = S(m({}, [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
])), Wo = function() {
  return typeof window > "u" ? null : window;
}, Bo = function(i, s) {
  if (typeof i != "object" || typeof i.createPolicy != "function") return null;
  let l = null;
  const u = "data-tt-policy-suffix";
  s && s.hasAttribute(u) && (l = s.getAttribute(u));
  const d = "dompurify" + (l ? "#" + l : "");
  try {
    return i.createPolicy(d, {
      createHTML(h) {
        return h;
      },
      createScriptURL(h) {
        return h;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + d + " could not be created."), null;
  }
}, An = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
}, V = function(i, s, l, u) {
  return M(i, s) && ht(i[s]) ? m(u.base ? x(u.base) : {}, i[s], u.transform) : l;
}, Ee = function(i, s, l) {
  const u = M(i, s) ? i[s] : void 0;
  return u && typeof u == "object" ? x(u) : l();
};
function Dn() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Wo();
  const i = (a) => Dn(a);
  if (i.version = "3.4.17", i.removed = [], !n || !n.document || n.document.nodeType !== E.document || !n.Element)
    return i.isSupported = !1, i;
  let s = n.document;
  const l = s, u = l.currentScript;
  n.DocumentFragment;
  const d = n.HTMLTemplateElement, h = n.Node, v = n.Element, R = n.NodeFilter;
  n.NamedNodeMap === void 0 && (n.NamedNodeMap || n.MozNamedAttrMap), n.HTMLFormElement;
  const X = n.DOMParser, ot = n.trustedTypes, H = v.prototype, Mn = C(H, "cloneNode"), Ft = C(H, "remove"), we = C(H, "removeAttributeNode"), xn = C(H, "nextSibling"), Tt = C(H, "childNodes"), rt = C(H, "parentNode"), Ht = C(H, "shadowRoot"), Wt = C(H, "attributes"), q = h && h.prototype ? C(h.prototype, "nodeType") : null, it = h && h.prototype ? C(h.prototype, "nodeName") : null, Lt = h && h.prototype ? C(h.prototype, "ownerDocument") : null, k = function(t) {
    return q ? q(t) : t.nodeType;
  }, gt = function(t) {
    return it ? it(t) : t.nodeName;
  }, Oe = Ro(H, "namespaceURI"), Bt = function(t) {
    return Oe ? Oe(t) : t.namespaceURI;
  };
  if (typeof d == "function") {
    const a = s.createElement("template");
    a.content && a.content.ownerDocument && (s = a.content.ownerDocument);
  }
  let D, K = "", Gt, Re = !1, _t = 0;
  const Le = function() {
    if (_t > 0) throw G('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, at = function(t) {
    Le(), _t++;
    try {
      return D.createHTML(t);
    } finally {
      _t--;
    }
  }, kn = function(t) {
    Le(), _t++;
    try {
      return D.createScriptURL(t);
    } finally {
      _t--;
    }
  }, Cn = function() {
    return Re || (Gt = Bo(ot, u), Re = !0), Gt;
  }, Dt = s, Yt = Dt.implementation, De = Dt.createNodeIterator, vn = Dt.createDocumentFragment, Pn = Dt.getElementsByTagName, Un = l.importNode;
  let T = An();
  i.isSupported = typeof Sn == "function" && typeof rt == "function" && Yt && Yt.createHTMLDocument !== void 0;
  const zn = No, Fn = Mo, Hn = xo, Wn = ko, Bn = Co, Gn = vo, Ie = Po, Yn = zo;
  let Ne = Tn, g = null;
  const jt = m({}, [
    ...pn,
    ...Te,
    ...ge,
    ..._e,
    ...mn
  ]);
  let _ = null;
  const $t = m({}, [
    ...dn,
    ...Ae,
    ...hn,
    ...zt
  ]);
  let U = Object.seal(dt(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), At = null, Me = null;
  const Y = Object.seal(dt(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let xe = !0, Vt = !0, ke = !1, Xt = !0, W = !1, Z = !0, J = !1, qt = !1, It = null, Nt = null, Kt = !1, st = !1, Mt = !1, xt = !1, Ce = !0, ve = !1;
  const Pe = "user-content-";
  let Zt = !0, Jt = !1, Q = null, lt = {}, tt = null;
  const Ue = m({}, [
    "annotation-xml",
    "audio",
    "colgroup",
    "desc",
    "foreignobject",
    "head",
    "iframe",
    "math",
    "mi",
    "mn",
    "mo",
    "ms",
    "mtext",
    "noembed",
    "noframes",
    "noscript",
    "plaintext",
    "script",
    "selectedcontent",
    "style",
    "svg",
    "template",
    "thead",
    "title",
    "video",
    "xmp"
  ]);
  let ze = null;
  const Fe = m({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let He = null;
  const We = m({}, [
    "alt",
    "class",
    "for",
    "id",
    "label",
    "name",
    "pattern",
    "placeholder",
    "role",
    "summary",
    "title",
    "value",
    "style",
    "xmlns"
  ]), kt = "http://www.w3.org/1998/Math/MathML", Ct = "http://www.w3.org/2000/svg", z = "http://www.w3.org/1999/xhtml";
  let ct = z, Qt = !1, te = null;
  const jn = m({}, [
    kt,
    Ct,
    z
  ], he), Be = S([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let ee = m({}, Be);
  const Ge = S(["annotation-xml"]);
  let ne = m({}, Ge);
  const $n = m({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let bt = null;
  const Vn = ["application/xhtml+xml", "text/html"], Xn = "text/html";
  let b = null, ut = null;
  const qn = s.createElement("form"), Ye = function(t) {
    return t instanceof RegExp || t instanceof Function;
  }, oe = function() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (ut && ut === t) return;
    (!t || typeof t != "object") && (t = {}), t = x(t), bt = Vn.indexOf(t.PARSER_MEDIA_TYPE) === -1 ? Xn : t.PARSER_MEDIA_TYPE, b = bt === "application/xhtml+xml" ? he : et, g = V(t, "ALLOWED_TAGS", jt, { transform: b }), _ = V(t, "ALLOWED_ATTR", $t, { transform: b }), te = V(t, "ALLOWED_NAMESPACES", jn, { transform: he }), He = V(t, "ADD_URI_SAFE_ATTR", We, {
      transform: b,
      base: We
    }), ze = V(t, "ADD_DATA_URI_TAGS", Fe, {
      transform: b,
      base: Fe
    }), tt = V(t, "FORBID_CONTENTS", Ue, { transform: b }), At = V(t, "FORBID_TAGS", x({}), { transform: b }), Me = V(t, "FORBID_ATTR", x({}), { transform: b }), lt = M(t, "USE_PROFILES") ? t.USE_PROFILES && typeof t.USE_PROFILES == "object" ? x(t.USE_PROFILES) : t.USE_PROFILES : !1, xe = t.ALLOW_ARIA_ATTR !== !1, Vt = t.ALLOW_DATA_ATTR !== !1, ke = t.ALLOW_UNKNOWN_PROTOCOLS || !1, Xt = t.ALLOW_SELF_CLOSE_IN_ATTR !== !1, W = t.SAFE_FOR_TEMPLATES || !1, Z = t.SAFE_FOR_XML !== !1, J = t.WHOLE_DOCUMENT || !1, st = t.RETURN_DOM || !1, Mt = t.RETURN_DOM_FRAGMENT || !1, xt = t.RETURN_TRUSTED_TYPE || !1, Kt = t.FORCE_BODY || !1, Ce = t.SANITIZE_DOM !== !1, ve = t.SANITIZE_NAMED_PROPS || !1, Zt = t.KEEP_CONTENT !== !1, Jt = t.IN_PLACE || !1, Ne = Lo(t.ALLOWED_URI_REGEXP) ? t.ALLOWED_URI_REGEXP : Tn, ct = typeof t.NAMESPACE == "string" ? t.NAMESPACE : z, ee = Ee(t, "MATHML_TEXT_INTEGRATION_POINTS", () => m({}, Be)), ne = Ee(t, "HTML_INTEGRATION_POINTS", () => m({}, Ge));
    const e = Ee(t, "CUSTOM_ELEMENT_HANDLING", () => dt(null));
    if (U = dt(null), M(e, "tagNameCheck") && Ye(e.tagNameCheck) && (U.tagNameCheck = e.tagNameCheck), M(e, "attributeNameCheck") && Ye(e.attributeNameCheck) && (U.attributeNameCheck = e.attributeNameCheck), M(e, "allowCustomizedBuiltInElements") && typeof e.allowCustomizedBuiltInElements == "boolean" && (U.allowCustomizedBuiltInElements = e.allowCustomizedBuiltInElements), O(U), W && (Vt = !1), Mt && (st = !0), lt && (g = m({}, mn), _ = dt(null), lt.html === !0 && (m(g, pn), m(_, dn)), lt.svg === !0 && (m(g, Te), m(_, Ae), m(_, zt)), lt.svgFilters === !0 && (m(g, ge), m(_, Ae), m(_, zt)), lt.mathMl === !0 && (m(g, _e), m(_, hn), m(_, zt))), Y.tagCheck = null, Y.attributeCheck = null, M(t, "ADD_TAGS") && (typeof t.ADD_TAGS == "function" ? Y.tagCheck = t.ADD_TAGS : ht(t.ADD_TAGS) && (g === jt && (g = x(g)), m(g, t.ADD_TAGS, b))), M(t, "ADD_ATTR") && (typeof t.ADD_ATTR == "function" ? Y.attributeCheck = t.ADD_ATTR : ht(t.ADD_ATTR) && (_ === $t && (_ = x(_)), m(_, t.ADD_ATTR, b))), M(t, "ADD_FORBID_CONTENTS") && ht(t.ADD_FORBID_CONTENTS) && (tt === Ue && (tt = x(tt)), m(tt, t.ADD_FORBID_CONTENTS, b)), Zt && (g["#text"] = !0), J && m(g, [
      "html",
      "head",
      "body"
    ]), g.table && (m(g, ["tbody"]), delete At.tbody), t.TRUSTED_TYPES_POLICY) {
      if (typeof t.TRUSTED_TYPES_POLICY.createHTML != "function") throw G('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof t.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw G('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const o = D;
      D = t.TRUSTED_TYPES_POLICY;
      try {
        K = at("");
      } catch (r) {
        throw D = o, r;
      }
    } else t.TRUSTED_TYPES_POLICY === null ? (D = void 0, K = "") : (D === void 0 && (D = Cn()), D && typeof K == "string" && (K = at("")));
    S && S(t), ut = t;
  }, je = m({}, [
    ...Te,
    ...ge,
    ...Do
  ]), $e = m({}, [..._e, ...Io]), Kn = function(t, e, o) {
    return e.namespaceURI === z ? t === "svg" : e.namespaceURI === kt ? t === "svg" && (o === "annotation-xml" || ee[o]) : !!je[t];
  }, Zn = function(t, e, o) {
    return e.namespaceURI === z ? t === "math" : e.namespaceURI === Ct ? t === "math" && ne[o] : !!$e[t];
  }, Jn = function(t, e, o) {
    return e.namespaceURI === Ct && !ne[o] || e.namespaceURI === kt && !ee[o] ? !1 : !$e[t] && ($n[t] || !je[t]);
  }, Qn = function(t) {
    const e = Bt(t), o = et(gt(t)), r = rt(t);
    let c, f;
    return r && k(r) === E.element ? (c = { namespaceURI: Bt(r) }, f = et(gt(r))) : (c = { namespaceURI: ct }, f = "template"), te[e] ? e === Ct ? Kn(o, c, f) : e === kt ? Zn(o, c, f) : e === z ? Jn(o, c, f) : !!(bt === "application/xhtml+xml" && te[e]) : !1;
  }, j = function(t) {
    St(i.removed, { element: t });
    try {
      rt(t).removeChild(t);
    } catch {
      if (Ft(t), !rt(t)) throw G("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, Ve = function(t, e, o) {
    try {
      we(t, e);
    } catch {
      try {
        t.removeAttribute(o);
      } catch {
      }
    }
  }, re = function(t) {
    ae(t);
    const e = Tt(t);
    e && B(Ao(e), (r) => {
      try {
        Ft(r);
      } catch {
      }
    });
    const o = k(t) === E.element ? Wt(t) : null;
    if (o) for (let r = o.length - 1; r >= 0; --r) {
      const c = o[r], f = c && c.name;
      typeof f == "string" && Ve(t, c, f);
    }
  }, ft = function(t, e, o) {
    if (!o) try {
      o = e.getAttributeNode(t);
    } catch {
      o = null;
    }
    St(i.removed, {
      attribute: o || null,
      from: e
    });
    try {
      o ? we(e, o) : e.removeAttribute(t);
    } catch {
      try {
        e.removeAttribute(t);
      } catch {
      }
    }
    if (t === "is")
      if (st || Mt) try {
        j(e);
      } catch {
      }
      else try {
        e.setAttribute(t, "");
      } catch {
      }
  }, Xe = function(t) {
    const e = Wt(t);
    if (e)
      for (let o = e.length - 1; o >= 0; --o) {
        const r = e[o], c = r && r.name;
        typeof c != "string" || _[b(c)] || Ve(t, r, c);
      }
  }, ie = function(t, e) {
    let o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
    const r = [t];
    for (; r.length > 0; ) {
      const c = r.pop();
      if (e(c) === !1) continue;
      if (o && k(c) === E.element) {
        const p = Ht(c);
        $(p) && r.push(p);
      }
      const f = Tt(c);
      if (f) for (let p = f.length - 1; p >= 0; --p) r.push(f[p]);
    }
  }, ae = function(t) {
    ie(t, (e) => {
      k(e) === E.element && Xe(e);
    });
  }, se = function(t) {
    const e = [];
    return ie(t, (o) => {
      e.push(o);
    }, !0), e;
  }, to = function(t, e) {
    const o = me();
    B(se(t), (r) => {
      k(r) === E.element && de(o, r);
    }), B(e, (r) => {
      k(r) === E.element && !wt(o, r) && Xe(r);
    });
  }, qe = function(t, e) {
    let o = !1;
    return B(i.removed, (r) => {
      r.element && (o = o || r.element === t, ae(r.element));
    }), to(t, e), o;
  }, eo = 8, no = function(t, e) {
    const o = Q;
    let r = null;
    const c = () => (r || (r = me(), B(e, (f) => {
      de(r, f);
    })), r);
    for (let f = 0; ; f++) {
      const p = se(t), y = [t];
      let F = !1;
      if (B(p, (L) => {
        k(L) === E.documentFragment ? St(y, L) : !F && !wt(o, L) && (F = wt(c(), L));
      }), !F) return;
      if (f >= eo) throw G("the tree kept changing during in-place sanitization; refusing to return it");
      B(y, (L, I) => {
        oo(L, I > 0, t, c());
      });
    }
  }, oo = function(t, e, o, r) {
    const c = le(t);
    let f;
    for (; f = c.nextNode(); )
      !wt(r, f) || wt(Q, f) || (e && P(T.uponSanitizeShadowNode, f, null), ue(f, o), fe(f, o), $(f.content) && yt(f.content));
  }, ro = function(t) {
    Q && de(Q, t);
  }, Ke = function(t, e) {
    return Z ? t === "patchsrc" ? !0 : t === "for" && e !== "label" && e !== "output" : !1;
  }, io = function(t) {
    Z && ie(t, (e) => {
      const o = k(e);
      if (o === E.processingInstruction || o === E.comment && w(gn, e.data)) {
        try {
          Ft(e);
        } catch {
        }
        return !1;
      }
      if (o === E.element) {
        const r = e, c = b(gt(e));
        try {
          r.hasAttribute && r.hasAttribute("patchsrc") && r.removeAttribute("patchsrc"), r.hasAttribute && r.hasAttribute("for") && Ke("for", c) && r.removeAttribute("for");
        } catch {
        }
      }
      return !0;
    });
  }, Ze = function(t) {
    let e = null, o = null;
    if (Kt) t = "<remove></remove>" + t;
    else {
      const f = ln(t, /^[\r\n\t ]+/);
      o = f && f[0];
    }
    bt === "application/xhtml+xml" && ct === z && (t = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + t + "</body></html>");
    const r = D ? at(t) : t;
    if (ct === z) try {
      e = new X().parseFromString(r, bt);
    } catch {
    }
    if (!e || !e.documentElement) {
      e = Yt.createDocument(ct, "template", null);
      try {
        e.documentElement.innerHTML = Qt ? K : r;
      } catch {
      }
    }
    const c = e.body || e.documentElement;
    return t && o && c.insertBefore(s.createTextNode(o), c.childNodes[0] || null), ct === z ? Pn.call(e, J ? "html" : "body")[0] : J ? e.documentElement : c;
  }, le = function(t) {
    const e = Lt ? Lt(t) : t.ownerDocument;
    return De.call(e || t, t, R.SHOW_ELEMENT | R.SHOW_COMMENT | R.SHOW_TEXT | R.SHOW_PROCESSING_INSTRUCTION | R.SHOW_CDATA_SECTION, null);
  }, vt = function(t) {
    return t = Ot(t, zn, " "), t = Ot(t, Fn, " "), t = Ot(t, Hn, " "), t;
  }, ce = function(t) {
    var e;
    Je(t);
    const o = (e = t.querySelectorAll) === null || e === void 0 ? void 0 : e.call(t, "template");
    o && B(o, (r) => {
      $(r.content) && ce(r.content);
    });
  }, Je = function(t) {
    t.normalize();
    const e = Lt ? Lt(t) : t.ownerDocument, o = De.call(e || t, t, R.SHOW_TEXT | R.SHOW_COMMENT | R.SHOW_CDATA_SECTION | R.SHOW_PROCESSING_INSTRUCTION, null);
    let r = o.nextNode();
    for (; r; )
      r.data = vt(r.data), r = o.nextNode();
  }, Pt = function(t) {
    const e = it ? it(t) : null;
    return typeof e != "string" || b(e) !== "form" ? !1 : typeof t.nodeName != "string" || typeof t.textContent != "string" || typeof t.removeChild != "function" || t.attributes !== Wt(t) || typeof t.removeAttribute != "function" || typeof t.removeAttributeNode != "function" || typeof t.getAttributeNode != "function" || typeof t.setAttribute != "function" || typeof t.namespaceURI != "string" || typeof t.insertBefore != "function" || typeof t.hasChildNodes != "function" || t.nodeType !== q(t) || t.childNodes !== Tt(t);
  }, $ = function(t) {
    if (!q || typeof t != "object" || t === null) return !1;
    try {
      return q(t) === E.documentFragment;
    } catch {
      return !1;
    }
  }, Et = function(t) {
    if (!q || typeof t != "object" || t === null) return !1;
    try {
      return typeof q(t) == "number";
    } catch {
      return !1;
    }
  };
  function P(a, t, e) {
    a.length !== 0 && B(a, (o) => {
      o.call(i, t, e, ut);
    });
  }
  const ao = function(t, e) {
    return !!(Z && t.hasChildNodes() && !Et(t.firstElementChild) && w(be, t.textContent) && w(be, t.innerHTML) || Z && Ho[e] && k(t) === E.element && Bt(t) === z && (Et(t.firstElementChild) || typeof t.textContent == "string" && w(be, t.textContent)) || t.nodeType === E.processingInstruction || Z && t.nodeType === E.comment && w(gn, t.data));
  }, Ut = function(t, e) {
    if (t instanceof RegExp) return w(t, e);
    if (t instanceof Function) {
      for (var o = arguments.length, r = new Array(o > 2 ? o - 2 : 0), c = 2; c < o; c++) r[c - 2] = arguments[c];
      return !!t(e, ...r);
    }
    return !1;
  }, so = function(t, e, o) {
    if (!At[e] && en(e) && Ut(U.tagNameCheck, e)) return !1;
    if (Zt && !tt[e] && !tt[et(e)]) {
      const r = rt(t), c = Tt(t);
      if (c && r) {
        const f = c.length;
        for (let p = f - 1; p >= 0; --p) {
          const y = t === o ? Mn(c[p], !0) : c[p];
          r.insertBefore(y, xn(t));
        }
      }
    }
    return j(t), !0;
  }, Qe = function(t, e, o, r) {
    return t.length === 0 ? e : e === o || e === r ? x(e) : e;
  }, pt = function(t, e) {
    return t === e || rt(t) !== null ? !1 : (Jt && ae(t), !0);
  }, ue = function(t, e) {
    if (ro(t), P(T.beforeSanitizeElements, t, null), pt(t, e)) return !0;
    if (Pt(t))
      return j(t), !0;
    const o = b(gt(t));
    if (g = Qe(T.uponSanitizeElement, g, jt, It), P(T.uponSanitizeElement, t, {
      tagName: o,
      allowedTags: g
    }), pt(t, e)) return !0;
    if (ao(t, o))
      return j(t), !0;
    if (At[o] || !(Y.tagCheck instanceof Function && Y.tagCheck(o)) && !g[o]) {
      const r = so(t, o, e);
      return r === !1 && (P(T.afterSanitizeElements, t, null), pt(t, e)) ? !0 : r;
    }
    if (k(t) === E.element && !Qn(t) || (o === "noscript" || o === "noembed" || o === "noframes") && w(Fo, t.innerHTML))
      return j(t), !0;
    if (W && t.nodeType === E.text) {
      const r = vt(t.textContent);
      t.textContent !== r && (St(i.removed, { element: t.cloneNode() }), t.textContent = r);
    }
    return P(T.afterSanitizeElements, t, null), pt(t, e);
  }, tn = function(t, e, o) {
    if (Me[e] || Ke(e, t) || Ce && (e === "id" || e === "name") && (o in s || o in qn)) return !1;
    const r = _[e] || Y.attributeCheck instanceof Function && Y.attributeCheck(e, t);
    return Vt && w(Wn, e) || xe && w(Bn, e) ? !0 : r ? He[e] || w(Ne, Ot(o, Ie, "")) || (e === "src" || e === "xlink:href" || e === "href") && t !== "script" && cn(o, "data:") === 0 && ze[t] || ke && !w(Gn, Ot(o, Ie, "")) ? !0 : !o : en(t) && Ut(U.tagNameCheck, t) && Ut(U.attributeNameCheck, e, t) || e === "is" && U.allowCustomizedBuiltInElements && Ut(U.tagNameCheck, o);
  }, lo = m({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), en = function(t) {
    return !lo[et(t)] && w(Yn, t);
  }, co = function(t, e, o, r) {
    if (D && typeof ot == "object" && typeof ot.getAttributeType == "function" && !o) switch (ot.getAttributeType(t, e)) {
      case "TrustedHTML":
        return at(r);
      case "TrustedScriptURL":
        return kn(r);
    }
    return r;
  }, uo = function(t, e, o, r) {
    try {
      return o ? t.setAttributeNS(o, e, r) : t.setAttribute(e, r), Pt(t) ? (j(t), !1) : !0;
    } catch {
      return ft(e, t), !1;
    }
  }, nn = function(t, e) {
    return Z && w(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, e) ? !0 : et(t) === "attributename" && ln(e, "href") !== null;
  }, fe = function(t, e) {
    if (P(T.beforeSanitizeAttributes, t, null), pt(t, e)) return;
    const o = t.attributes;
    if (!o || Pt(t)) return;
    _ = Qe(T.uponSanitizeAttribute, _, $t, Nt);
    const r = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: _,
      forceKeepAttr: void 0
    };
    let c = o.length;
    const f = b(t.nodeName);
    for (; c--; ) {
      const p = o[c], y = p.name, F = p.namespaceURI, L = p.value, I = b(y), mt = L;
      let N = y === "value" ? mt : Eo(mt), on = !1;
      if (r.attrName = I, r.attrValue = N, r.keepAttr = !0, r.forceKeepAttr = void 0, P(T.uponSanitizeAttribute, t, r), N = r.attrValue, ve && (I === "id" || I === "name") && cn(N, Pe) !== 0 && (ft(y, t, p), N = Pe + N, on = !0), nn(y, N)) {
        ft(y, t, p);
        continue;
      }
      if (!r.forceKeepAttr) {
        if (!r.keepAttr) {
          ft(y, t, p);
          continue;
        }
        if (!Xt && w(_n, N)) {
          ft(y, t, p);
          continue;
        }
        if (W && (N = vt(N)), !tn(f, I, N)) {
          ft(y, t, p);
          continue;
        }
        N = co(f, I, F, N), N !== mt && uo(t, y, F, N) && on && sn(i.removed);
      }
    }
    P(T.afterSanitizeAttributes, t, null), pt(t, e);
  }, yt = function(t) {
    let e = null;
    const o = le(t);
    for (P(T.beforeSanitizeShadowDOM, t, null); e = o.nextNode(); )
      if (P(T.uponSanitizeShadowNode, e, null), ue(e, t), fe(e, t), $(e.content) && yt(e.content), k(e) === E.element) {
        const r = Ht(e);
        $(r) && (pe(r), yt(r));
      }
    W && Je(t), P(T.afterSanitizeShadowDOM, t, null);
  }, pe = function(t) {
    const e = [{
      node: t,
      shadow: null
    }];
    for (; e.length > 0; ) {
      const o = e.pop();
      if (o.shadow) {
        yt(o.shadow);
        continue;
      }
      const r = o.node, c = k(r) === E.element, f = Tt(r);
      if (f) for (let p = f.length - 1; p >= 0; --p) e.push({
        node: f[p],
        shadow: null
      });
      if (c) {
        const p = it ? it(r) : null;
        if (typeof p == "string" && b(p) === "template") {
          const y = r.content;
          $(y) && e.push({
            node: y,
            shadow: null
          });
        }
      }
      if (c) {
        const p = Ht(r);
        $(p) && e.push({
          node: null,
          shadow: p
        }, {
          node: p,
          shadow: null
        });
      }
    }
  };
  return i.sanitize = function(a) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, e = null, o = null, r = null, c = null;
    if (Qt = !a, Qt && (a = "<!-->"), typeof a != "string" && !Et(a) && (a = Oo(a), typeof a != "string"))
      throw G("dirty is not a string, aborting");
    if (!i.isSupported) return a;
    qt ? (g = It, _ = Nt) : oe(t), (T.uponSanitizeElement.length > 0 || T.uponSanitizeAttribute.length > 0) && (g = x(g)), T.uponSanitizeAttribute.length > 0 && (_ = x(_)), i.removed = [];
    const f = Jt && typeof a != "string" && Et(a);
    let p = [];
    const y = Q;
    if (f) {
      io(a);
      const I = gt(a);
      if (typeof I == "string") {
        const mt = b(I);
        if (!g[mt] || At[mt])
          throw re(a), G("root node is forbidden and cannot be sanitized in-place");
      }
      if (Pt(a))
        throw re(a), G("root node is clobbered and cannot be sanitized in-place");
      p = se(a), Q = me();
    } else if (Et(a))
      e = Ze("<!---->"), o = e.ownerDocument.importNode(a, !0), o.nodeType === E.element && o.nodeName === "BODY" || o.nodeName === "HTML" ? e = o : e.appendChild(o), pe(e);
    else {
      if (!st && !W && !J && a.indexOf("<") === -1) return D && xt ? at(a) : a;
      if (e = Ze(a), !e) return st ? null : xt ? K : "";
    }
    e && Kt && j(e.firstChild);
    const F = f ? a : e;
    try {
      f && pe(a);
      const I = le(F);
      for (; r = I.nextNode(); )
        ue(r, F), fe(r, F), $(r.content) && yt(r.content);
      f && no(a, p);
    } catch (I) {
      throw f && (re(a), qe(a, p)), I;
    } finally {
      Q = y;
    }
    if (f) {
      if (qe(a, p)) throw G("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return W && ce(a), a;
    }
    if (st) {
      if (W && ce(e), Mt)
        for (c = vn.call(e.ownerDocument); e.firstChild; ) c.appendChild(e.firstChild);
      else c = e;
      return (_.shadowroot || _.shadowrootmode) && (c = Un.call(l, c, !0)), c;
    }
    let L = J ? e.outerHTML : e.innerHTML;
    return J && g["!doctype"] && e.ownerDocument && e.ownerDocument.doctype && e.ownerDocument.doctype.name && w(Uo, e.ownerDocument.doctype.name) && (L = "<!DOCTYPE " + e.ownerDocument.doctype.name + `>
` + L), W && (L = vt(L)), D && xt ? at(L) : L;
  }, i.setConfig = function() {
    let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    oe(a), qt = !0, It = g, Nt = _;
  }, i.clearConfig = function() {
    ut = null, qt = !1, It = null, Nt = null, D = Gt, K = "";
  }, i.isValidAttribute = function(a, t, e) {
    ut || oe({});
    const o = b(a), r = b(t);
    return typeof e == "string" && (nn(t, e) || !Xt && w(_n, e)) ? !1 : tn(o, r, e);
  }, i.addHook = function(a, t) {
    typeof t == "function" && M(T, a) && St(T[a], t);
  }, i.removeHook = function(a, t) {
    if (M(T, a)) {
      if (t !== void 0) {
        const e = _o(T[a], t);
        return e === -1 ? void 0 : bo(T[a], e, 1)[0];
      }
      return sn(T[a]);
    }
  }, i.removeHooks = function(a) {
    M(T, a) && (T[a] = []);
  }, i.removeAllHooks = function() {
    T = An();
  }, i;
}
var In = Dn();
const er = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: In
}, Symbol.toStringTag, { value: "Module" })), Go = /(?:\bmso-|\bMso[A-Z]|urn:schemas-microsoft-com:office|<\/?o:|xmlns:o=|Word\.Document)/i, Yo = /(?:^|\n)\s{0,3}(?:#{1,6}\s+|```|~~~|>\s+|[-+*]\s+|\d+[.)]\s+)/, jo = /(?:\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|__[^_]+__|`[^`]+`)/, $o = /(?:^|\n)\s*\|.+\|\s*\n\s*\|?\s*:?-{3,}/, Vo = [
  "p",
  "div",
  "br",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "pre",
  "code",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "sub",
  "sup",
  "ul",
  "ol",
  "li",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "a",
  "hr",
  "span"
], Xo = ["href", "title", "colspan", "rowspan", "start"];
function qo(n) {
  return Go.test(n);
}
function Ko(n) {
  return Yo.test(n) || jo.test(n) || $o.test(n);
}
function Zo(n) {
  return n.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, "").replace(/<!--[\s\S]*?-->/g, "").replace(/<\/?(?:o|w|v|st1):[^>]*>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
}
function Jo(n) {
  try {
    const i = new URL(n, window.location.origin);
    return i.protocol === "http:" || i.protocol === "https:" || i.protocol === "mailto:" || i.origin === window.location.origin;
  } catch {
    return !1;
  }
}
function Nn(n) {
  const i = In.sanitize(Zo(n), {
    ALLOWED_TAGS: Vo,
    ALLOWED_ATTR: Xo,
    ALLOW_DATA_ATTR: !1,
    ALLOW_ARIA_ATTR: !1,
    KEEP_CONTENT: !0,
    RETURN_TRUSTED_TYPE: !1
  }), s = new DOMParser().parseFromString(i, "text/html");
  return s.querySelectorAll("a[href]").forEach((l) => {
    const u = l.getAttribute("href") || "";
    Jo(u) ? l.setAttribute("rel", "noopener noreferrer") : l.removeAttribute("href");
  }), s.querySelectorAll("p").forEach((l) => {
    l.textContent?.replace(/[\u00a0\s]/g, "") === "" && (l.innerHTML = "<br>");
  }), s.body.innerHTML;
}
function nr({ event: n, editor: i, defaultPasteHandler: s, onFeedback: l }) {
  const u = n.clipboardData;
  if (!u) return s();
  const d = [...u.types];
  if (d.includes("blocknote/html") || d.includes("Files") || d.includes("text/markdown") || d.includes("vscode-editor-data")) return s();
  const h = u.getData("text/plain");
  if (h && Ko(h))
    return i.pasteMarkdown(h), !0;
  const v = u.getData("text/html");
  if (v) {
    const R = qo(v), X = Nn(v);
    return X ? i.pasteHTML(X) : h && i.pasteText(h), R && l?.(nt("knowledge.auto.8f7887296165bff9")), !0;
  }
  return h ? (i.pasteText(h), !0) : s({ prioritizeMarkdownOverHTML: !0, plainTextAsMarkdown: !1 });
}
function bn(n, i) {
  return `${n.trim().replace(/[\\/:*?"<>|\u0000-\u001f]/g, "-").replace(/\s+/g, " ").replace(/[. ]+$/g, "").slice(0, 120) || nt("knowledge.auto.fba1208c267ba57c")}.${i}`;
}
function En(n) {
  return n.replace(/[&<>"']/g, (i) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[i]);
}
function Qo(n, i) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>${En(n)}</title><style>
@page{size:A4;margin:16mm 15mm}*{box-sizing:border-box}body{margin:0;color:#17231f;font:14px/1.7 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif}article{max-width:178mm;margin:0 auto}h1.document-title{font-size:28px;line-height:1.25;margin:0 0 24px;padding-bottom:14px;border-bottom:1px solid #dce7e2}h1,h2,h3,h4,h5,h6{break-after:avoid;color:#10211b}p,blockquote,pre,table,figure{break-inside:avoid}blockquote{margin:12px 0;padding:4px 14px;border-left:3px solid #0c8a68;color:#455b53}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f3f6f5;border:1px solid #dce7e2;border-radius:6px;padding:12px}code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}table{width:100%;border-collapse:collapse}th,td{border:1px solid #cfdcd6;padding:6px 8px;vertical-align:top}img,video{max-width:100%;height:auto}a{color:#087d61;text-decoration:none}hr{border:0;border-top:1px solid #dce7e2;margin:20px 0}@media print{a{color:inherit}.no-print{display:none!important}}
</style></head><body><article><h1 class="document-title">${En(n || nt("knowledge.auto.fba1208c267ba57c"))}</h1>${i}</article></body></html>`;
}
function yn(n, i) {
  const s = URL.createObjectURL(i), l = document.createElement("a");
  l.href = s, l.download = n, document.body.append(l), l.click(), l.remove(), window.setTimeout(() => URL.revokeObjectURL(s), 0);
}
function or(n, i, s) {
  if (s === "json")
    return yn(bn(i, "blocks.json"), new Blob([JSON.stringify({ blocks: n.document }, null, 2)], { type: "application/json;charset=utf-8" })), nt("knowledge.auto.7751a700cb5cff82");
  if (s === "markdown") {
    const v = n.blocksToMarkdownLossy(n.document);
    return yn(bn(i, "md"), new Blob([v], { type: "text/markdown;charset=utf-8" })), nt("knowledge.auto.371b5fb1658df16b");
  }
  const l = window.open("", "_blank", "popup,width=980,height=760");
  if (!l) throw new Error(nt("knowledge.auto.926b1eed10a4d5f1"));
  l.opener = null;
  const u = Nn(n.blocksToHTMLLossy(n.document));
  l.document.open(), l.document.write(Qo(i, u)), l.document.close();
  let d = !1;
  const h = () => {
    d || l.closed || (d = !0, l.focus(), l.print());
  };
  return l.addEventListener("load", h, { once: !0 }), window.setTimeout(h, 300), nt("knowledge.auto.08236dde0788f059");
}
export {
  er as a,
  or as e,
  nr as h,
  In as p,
  bn as s
};
