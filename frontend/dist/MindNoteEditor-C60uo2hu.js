import { jsxs as u, jsx as o, Fragment as se } from "react/jsx-runtime";
import { p as ue, P as fe, B as M, k as n, c as G, a as H, b as E, m as be, S as he } from "./index-DYsA9s7a.js";
import { useMemo as ge, useState as R, useRef as Q, useEffect as W } from "react";
import { Download as pe, FileJson as me, Plus as we, FileText as ke, ChevronRight as Y, X as ve, ChevronDown as Ne, Check as Ce, Circle as xe, Focus as ye, Tags as De, ListPlus as je, IndentIncrease as ze, IndentDecrease as Me, Trash2 as Ee, CalendarDays as Re } from "lucide-react";
import { s as Z } from "./documentTransfer-_tPvdtOt.js";
function p(r, a, c = "") {
  for (let d = 0; d < r.length; d++) {
    if (r[d].id === a) return { node: r[d], index: d, siblings: r, parentID: c };
    const i = p(r[d].children, a, r[d].id);
    if (i) return i;
  }
  return null;
}
function O(r, a, c = []) {
  for (const d of r) {
    if (d.id === a) return [...c, d];
    const i = O(d.children, a, [...c, d]);
    if (i.length) return i;
  }
  return [];
}
function F(r, a, c) {
  return r.map((d) => d.id === a ? c(d) : { ...d, children: F(d.children, a, c) });
}
function I(r, a) {
  let c;
  const d = [];
  for (const i of r) {
    if (i.id === a) {
      c = i;
      continue;
    }
    const b = I(i.children, a);
    !c && b.removed && (c = b.removed), d.push(b.removed ? { ...i, children: b.nodes } : i);
  }
  return { nodes: d, removed: c };
}
function P(r, a, c) {
  const d = [];
  for (const i of r)
    d.push({ ...i, children: P(i.children, a, c) }), i.id === a && d.push(c);
  return d;
}
function Ie(r) {
  let a = 0, c = 0;
  const d = (i) => i.forEach((b) => {
    a += 1, b.completed && (c += 1), d(b.children);
  });
  return d(r), { total: a, completed: c };
}
function ee(r, a = 0) {
  return r.map((c) => `${"  ".repeat(a)}- [${c.completed ? "x" : " "}] ${c.text || n("knowledge.auto.d03438b702b564f3")}${c.children.length ? `
${ee(c.children, a + 1)}` : ""}`).join(`
`);
}
function A(r, a, c) {
  const d = URL.createObjectURL(new Blob([r], { type: c })), i = document.createElement("a");
  i.href = d, i.download = a, i.click(), URL.revokeObjectURL(d);
}
function Pe({ body: r, readOnly: a = !1, documentTitle: c = n("knowledge.auto.24f374b540a88ba4"), initialBlockID: d, convertPage: i, pageActionHost: b, authorizeContentAction: w, onActionFeedback: L, onChange: te }) {
  const k = ge(() => ue(r), [r]), [x, U] = R(k), f = Q(x), [D, m] = R(""), [S, T] = R(""), [$, J] = R(!1), j = Q(/* @__PURE__ */ new Map());
  W(() => {
    f.current = k, U(k), m((e) => e && p(k.nodes, e) ? e : ""), T((e) => e && p(k.nodes, e) ? e : "");
  }, [k]), W(() => {
    !d || !p(f.current.nodes, d) || (m(d), window.setTimeout(() => {
      const e = j.current.get(d);
      e?.scrollIntoView({ block: "center" }), e?.focus({ preventScroll: !0 });
    }));
  }, [d]);
  const v = (e, l = !a) => {
    f.current = e, U(e), l && te(G(e));
  }, y = (e) => window.setTimeout(() => j.current.get(e)?.focus()), g = (e, l, t = !a) => v({ ...f.current, nodes: F(f.current.nodes, e, l) }, t), ne = () => {
    const e = E();
    v({ ...f.current, nodes: [...f.current.nodes, e] }), y(e.id);
  }, oe = (e) => {
    const l = E();
    g(e, (t) => ({ ...t, collapsed: !1, children: [...t.children, l] })), y(l.id);
  }, ae = (e) => {
    const l = E("");
    v({ ...f.current, nodes: P(f.current.nodes, e, l) }), y(l.id);
  }, K = (e) => {
    const l = I(f.current.nodes, e).nodes, t = l.length ? l : [E("")];
    v({ ...f.current, nodes: t }), D === e && m(""), S === e && T("");
  }, B = (e) => {
    const l = p(f.current.nodes, e);
    if (!l || l.index === 0) return;
    const t = l.siblings[l.index - 1], C = I(f.current.nodes, e);
    C.removed && (v({ ...f.current, nodes: F(C.nodes, t.id, (z) => ({ ...z, collapsed: !1, children: [...z.children, C.removed] })) }), y(e));
  }, _ = (e) => {
    const l = p(f.current.nodes, e);
    if (!l?.parentID) return;
    const t = I(f.current.nodes, e);
    t.removed && (v({ ...f.current, nodes: P(t.nodes, l.parentID, t.removed) }), y(e));
  }, de = (e, l) => {
    a || (e.key === "Enter" ? (e.preventDefault(), ae(l)) : e.key === "Tab" ? (e.preventDefault(), e.shiftKey ? _(l) : B(l)) : e.key === "Backspace" && !e.currentTarget.value && !p(f.current.nodes, l)?.node.children.length && (e.preventDefault(), K(l)));
  }, le = async () => {
    if (!(!i || $)) {
      J(!0);
      try {
        if (!w) throw Error(n("knowledge.auto.c79fd658db132faf"));
        await w("duplicate"), await i("document", H("knowledge.auto.7fc573f8fefc28a1", { value0: c }), be(f.current));
      } catch (e) {
        L?.(e instanceof Error ? e.message : n("knowledge.auto.83982a5d62de3c93"));
      } finally {
        J(!1);
      }
    }
  }, V = async (e) => {
    try {
      if (!w) throw Error(n("knowledge.auto.5838a06d4990c165"));
      await w("export"), e === "json" ? A(G(f.current), Z(c, "json"), "application/json") : A(ee(f.current.nodes), Z(c, "md"), "text/markdown;charset=utf-8"), L?.(H("knowledge.auto.5f6eb852de0a1889", { value0: e === "json" ? "JSON" : "Markdown" }));
    } catch (l) {
      L?.(l instanceof Error ? l.message : n("knowledge.auto.d0282f346b1d46ee"));
    }
  }, N = D ? O(x.nodes, D) : [], ce = N.length ? [N[N.length - 1]] : x.nodes, X = Ie(x.nodes), q = (e, l = 0) => e.map((t) => {
    const C = p(x.nodes, t.id), z = C.index > 0, ie = !!C.parentID;
    return /* @__PURE__ */ u("div", { className: "mind-note-branch", children: [
      /* @__PURE__ */ u("div", { className: `mind-note-row${t.completed ? " is-completed" : ""}${D === t.id ? " is-focus-root" : ""}`, "data-priority": t.priority || "none", style: { "--mind-note-depth": l }, children: [
        t.children.length ? /* @__PURE__ */ o("button", { type: "button", className: "mind-note-collapse", "aria-label": t.collapsed ? n("knowledge.auto.cbeaf2b1399d8de9") : n("knowledge.auto.bf63ac26085bbacb"), "aria-expanded": !t.collapsed, onClick: () => g(t.id, (s) => ({ ...s, collapsed: !s.collapsed }), !a), children: t.collapsed ? /* @__PURE__ */ o(Y, { size: 15 }) : /* @__PURE__ */ o(Ne, { size: 15 }) }) : /* @__PURE__ */ o("span", { className: "mind-note-collapse-spacer" }),
        /* @__PURE__ */ o("button", { type: "button", className: "mind-note-complete", "aria-label": t.completed ? n("knowledge.auto.554b08fed5b36486") : n("knowledge.auto.d656b891df4d1bee"), "aria-pressed": t.completed, disabled: a, onClick: () => g(t.id, (s) => ({ ...s, completed: !s.completed })), children: t.completed ? /* @__PURE__ */ o(Ce, { size: 14 }) : /* @__PURE__ */ o(xe, { size: 14 }) }),
        /* @__PURE__ */ o("input", { ref: (s) => {
          s ? j.current.set(t.id, s) : j.current.delete(t.id);
        }, "aria-label": n("knowledge.auto.ff98a7eab27cb136"), value: t.text, maxLength: 4096, readOnly: a, onChange: (s) => g(t.id, (h) => ({ ...h, text: s.currentTarget.value })), onKeyDown: (s) => de(s, t.id) }),
        /* @__PURE__ */ u("div", { className: "mind-note-row-actions", children: [
          /* @__PURE__ */ o("button", { type: "button", title: n("knowledge.auto.342d82997b748cd3"), "aria-label": n("knowledge.auto.342d82997b748cd3"), onClick: () => m(t.id), children: /* @__PURE__ */ o(ye, { size: 14 }) }),
          /* @__PURE__ */ o("button", { type: "button", title: n("knowledge.auto.5cdb885d907b5172"), "aria-label": n("knowledge.auto.5cdb885d907b5172"), "aria-pressed": S === t.id, onClick: () => T((s) => s === t.id ? "" : t.id), children: /* @__PURE__ */ o(De, { size: 14 }) }),
          !a && /* @__PURE__ */ u(se, { children: [
            /* @__PURE__ */ o("button", { type: "button", title: n("knowledge.auto.677ef7a715febc8d"), "aria-label": n("knowledge.auto.677ef7a715febc8d"), onClick: () => oe(t.id), children: /* @__PURE__ */ o(je, { size: 14 }) }),
            /* @__PURE__ */ o("button", { type: "button", title: n("knowledge.auto.cfd42c031e620536"), "aria-label": n("knowledge.auto.cfd42c031e620536"), disabled: !z, onClick: () => B(t.id), children: /* @__PURE__ */ o(ze, { size: 14 }) }),
            /* @__PURE__ */ o("button", { type: "button", title: n("knowledge.auto.efd955b1ac6f3036"), "aria-label": n("knowledge.auto.efd955b1ac6f3036"), disabled: !ie, onClick: () => _(t.id), children: /* @__PURE__ */ o(Me, { size: 14 }) }),
            /* @__PURE__ */ o("button", { type: "button", title: n("knowledge.auto.81385c38c94481fd"), "aria-label": n("knowledge.auto.81385c38c94481fd"), onClick: () => K(t.id), children: /* @__PURE__ */ o(Ee, { size: 14 }) })
          ] })
        ] })
      ] }),
      S === t.id && /* @__PURE__ */ u("div", { className: "mind-note-metadata", children: [
        /* @__PURE__ */ u("label", { children: [
          n("knowledge.auto.565d64601d4d174f"),
          /* @__PURE__ */ u(he, { value: t.priority || "none", disabled: a, onChange: (s) => g(t.id, (h) => ({ ...h, priority: s.target.value })), children: [
            /* @__PURE__ */ o("option", { value: "none", children: n("knowledge.auto.484d55613910eb8c") }),
            /* @__PURE__ */ o("option", { value: "low", children: n("knowledge.auto.aa9e366f68d3d097") }),
            /* @__PURE__ */ o("option", { value: "medium", children: n("knowledge.auto.a567bdaa11367f26") }),
            /* @__PURE__ */ o("option", { value: "high", children: n("knowledge.auto.b1c27820fec23edb") }),
            /* @__PURE__ */ o("option", { value: "urgent", children: n("knowledge.auto.0efa477b24b1f3c7") })
          ] })
        ] }),
        /* @__PURE__ */ u("label", { children: [
          /* @__PURE__ */ o(Re, { size: 13 }),
          n("knowledge.auto.31802424217f51b0"),
          /* @__PURE__ */ o("input", { type: "date", value: t.due_date || "", disabled: a, onChange: (s) => g(t.id, (h) => ({ ...h, due_date: s.target.value })) })
        ] }),
        /* @__PURE__ */ u("label", { className: "is-wide", children: [
          n("knowledge.auto.1d0fd5f9336d9103"),
          /* @__PURE__ */ o("input", { value: (t.tags || []).join(", "), disabled: a, placeholder: n("knowledge.auto.02d3a3e342d411f2"), onChange: (s) => g(t.id, (h) => ({ ...h, tags: [...new Set(s.target.value.split(/[,，]/).map((re) => Array.from(re.trim()).slice(0, 20).join("")).filter(Boolean))].slice(0, 12) })) })
        ] }),
        /* @__PURE__ */ u("label", { className: "is-wide", children: [
          n("knowledge.auto.daede9881787abe7"),
          /* @__PURE__ */ o("textarea", { rows: 2, maxLength: 4096, value: t.note || "", disabled: a, placeholder: n("knowledge.auto.903e3e8fa4ece979"), onChange: (s) => g(t.id, (h) => ({ ...h, note: s.target.value })) })
        ] })
      ] }),
      !t.collapsed && t.children.length > 0 && /* @__PURE__ */ o("div", { className: "mind-note-children", children: q(t.children, l + 1) })
    ] }, t.id);
  });
  return /* @__PURE__ */ u("div", { className: "knowledge-open-editor knowledge-mind-note-editor", children: [
    w && /* @__PURE__ */ u(fe, { host: b, children: [
      /* @__PURE__ */ u(M, { title: n("knowledge.auto.ac8b027cc1e3a493"), onClick: () => {
        V("markdown");
      }, children: [
        /* @__PURE__ */ o(pe, { size: 15 }),
        "Markdown"
      ] }),
      /* @__PURE__ */ u(M, { title: n("knowledge.auto.28ff768a104f56a9"), onClick: () => {
        V("json");
      }, children: [
        /* @__PURE__ */ o(me, { size: 15 }),
        "JSON"
      ] })
    ] }),
    /* @__PURE__ */ u("header", { className: "mind-note-toolbar", children: [
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ o("strong", { children: n("knowledge.auto.13517c3204f58770") }),
        /* @__PURE__ */ u("span", { children: [
          X.completed,
          "/",
          X.total,
          " ",
          n("knowledge.auto.f28461bb49c85647")
        ] })
      ] }),
      /* @__PURE__ */ u("div", { children: [
        !a && /* @__PURE__ */ u(M, { title: n("knowledge.auto.3e50f365e3f356e1"), onClick: ne, children: [
          /* @__PURE__ */ o(we, { size: 15 }),
          n("knowledge.auto.e9a2cb73585da4b7")
        ] }),
        i && w && !a && /* @__PURE__ */ u(M, { title: n("knowledge.auto.467d5427bb9d2392"), disabled: $, onClick: () => {
          le();
        }, children: [
          /* @__PURE__ */ o(ke, { size: 15 }),
          $ ? n("knowledge.auto.7b48fcb4f51cd8c3") : n("knowledge.auto.c19a7169123aaead")
        ] })
      ] })
    ] }),
    N.length > 0 && /* @__PURE__ */ u("nav", { className: "mind-note-focus-path", "aria-label": n("knowledge.auto.d0dfdce5ec834437"), children: [
      /* @__PURE__ */ o("button", { type: "button", onClick: () => m(""), children: n("knowledge.auto.80a851b1df45dc50") }),
      N.map((e, l) => /* @__PURE__ */ u("span", { children: [
        /* @__PURE__ */ o(Y, { size: 13 }),
        l === N.length - 1 ? /* @__PURE__ */ o("strong", { children: e.text || n("knowledge.auto.d03438b702b564f3") }) : /* @__PURE__ */ o("button", { type: "button", onClick: () => m(e.id), children: e.text || n("knowledge.auto.d03438b702b564f3") })
      ] }, e.id)),
      /* @__PURE__ */ o("button", { type: "button", className: "mind-note-exit-focus", "aria-label": n("knowledge.auto.9d7acd0084f48f84"), title: n("knowledge.auto.9d7acd0084f48f84"), onClick: () => m(""), children: /* @__PURE__ */ o(ve, { size: 14 }) })
    ] }),
    /* @__PURE__ */ o("section", { className: "mind-note-outline", "aria-label": n("knowledge.auto.797ddc596809293c"), children: q(ce) }),
    !a && /* @__PURE__ */ o("footer", { children: /* @__PURE__ */ o("span", { children: n("knowledge.auto.63df122341ac522f") }) })
  ] });
}
export {
  Pe as MindNoteEditor,
  Pe as default
};
