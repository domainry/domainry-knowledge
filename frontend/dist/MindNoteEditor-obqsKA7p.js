import { jsxs as u, jsx as n, Fragment as ne } from "react/jsx-runtime";
import { useMemo as ie, useState as T, useRef as V, useEffect as X } from "react";
import { Plus as oe, FileText as re, ChevronRight as q, X as le, ChevronDown as se, Check as ce, Circle as ae, Focus as de, Tags as ue, ListPlus as he, IndentIncrease as pe, IndentDecrease as me, Trash2 as fe, CalendarDays as be } from "lucide-react";
import { p as ge, B as A, c as D, m as ve, a as Ne } from "./index-xTnnSBIQ.js";
function f(a, o, c = "") {
  for (let i = 0; i < a.length; i++) {
    if (a[i].id === o) return { node: a[i], index: i, siblings: a, parentID: c };
    const s = f(a[i].children, o, a[i].id);
    if (s) return s;
  }
  return null;
}
function G(a, o, c = []) {
  for (const i of a) {
    if (i.id === o) return [...c, i];
    const s = G(i.children, o, [...c, i]);
    if (s.length) return s;
  }
  return [];
}
function S(a, o, c) {
  return a.map((i) => i.id === o ? c(i) : { ...i, children: S(i.children, o, c) });
}
function I(a, o) {
  let c;
  const i = [];
  for (const s of a) {
    if (s.id === o) {
      c = s;
      continue;
    }
    const h = I(s.children, o);
    !c && h.removed && (c = h.removed), i.push(h.removed ? { ...s, children: h.nodes } : s);
  }
  return { nodes: i, removed: c };
}
function j(a, o, c) {
  const i = [];
  for (const s of a)
    i.push({ ...s, children: j(s.children, o, c) }), s.id === o && i.push(c);
  return i;
}
function Ce(a) {
  let o = 0, c = 0;
  const i = (s) => s.forEach((h) => {
    o += 1, h.completed && (c += 1), i(h.children);
  });
  return i(a), { total: o, completed: c };
}
function ze({ body: a, readOnly: o = !1, documentTitle: c = "未命名思维笔记", initialBlockID: i, convertPage: s, authorizeContentAction: h, onActionFeedback: H, onChange: J }) {
  const g = ie(() => ge(a), [a]), [w, F] = T(g), d = V(w), [x, b] = T(""), [E, M] = T(""), [R, L] = T(!1), y = V(/* @__PURE__ */ new Map());
  X(() => {
    d.current = g, F(g), b((e) => e && f(g.nodes, e) ? e : ""), M((e) => e && f(g.nodes, e) ? e : "");
  }, [g]), X(() => {
    !i || !f(d.current.nodes, i) || (b(i), window.setTimeout(() => {
      const e = y.current.get(i);
      e?.scrollIntoView({ block: "center" }), e?.focus({ preventScroll: !0 });
    }));
  }, [i]);
  const v = (e, r = !o) => {
    d.current = e, F(e), r && J(Ne(e));
  }, k = (e) => window.setTimeout(() => y.current.get(e)?.focus()), m = (e, r, t = !o) => v({ ...d.current, nodes: S(d.current.nodes, e, r) }, t), Q = () => {
    const e = D();
    v({ ...d.current, nodes: [...d.current.nodes, e] }), k(e.id);
  }, U = (e) => {
    const r = D();
    m(e, (t) => ({ ...t, collapsed: !1, children: [...t.children, r] })), k(r.id);
  }, W = (e) => {
    const r = D("");
    v({ ...d.current, nodes: j(d.current.nodes, e, r) }), k(r.id);
  }, K = (e) => {
    const r = I(d.current.nodes, e).nodes, t = r.length ? r : [D("")];
    v({ ...d.current, nodes: t }), x === e && b(""), E === e && M("");
  }, $ = (e) => {
    const r = f(d.current.nodes, e);
    if (!r || r.index === 0) return;
    const t = r.siblings[r.index - 1], C = I(d.current.nodes, e);
    C.removed && (v({ ...d.current, nodes: S(C.nodes, t.id, (z) => ({ ...z, collapsed: !1, children: [...z.children, C.removed] })) }), k(e));
  }, P = (e) => {
    const r = f(d.current.nodes, e);
    if (!r?.parentID) return;
    const t = I(d.current.nodes, e);
    t.removed && (v({ ...d.current, nodes: j(t.nodes, r.parentID, t.removed) }), k(e));
  }, Y = (e, r) => {
    o || (e.key === "Enter" ? (e.preventDefault(), W(r)) : e.key === "Tab" ? (e.preventDefault(), e.shiftKey ? P(r) : $(r)) : e.key === "Backspace" && !e.currentTarget.value && !f(d.current.nodes, r)?.node.children.length && (e.preventDefault(), K(r)));
  }, Z = async () => {
    if (!(!s || R)) {
      L(!0);
      try {
        if (!h) throw Error("当前页面禁止创建副本。");
        await h("duplicate"), await s("document", `${c}（文档）`, ve(d.current));
      } catch (e) {
        H?.(e instanceof Error ? e.message : "转换文档失败");
      } finally {
        L(!1);
      }
    }
  }, N = x ? G(w.nodes, x) : [], O = N.length ? [N[N.length - 1]] : w.nodes, _ = Ce(w.nodes), B = (e, r = 0) => e.map((t) => {
    const C = f(w.nodes, t.id), z = C.index > 0, ee = !!C.parentID;
    return /* @__PURE__ */ u("div", { className: "mind-note-branch", children: [
      /* @__PURE__ */ u("div", { className: `mind-note-row${t.completed ? " is-completed" : ""}${x === t.id ? " is-focus-root" : ""}`, "data-priority": t.priority || "none", style: { "--mind-note-depth": r }, children: [
        t.children.length ? /* @__PURE__ */ n("button", { type: "button", className: "mind-note-collapse", "aria-label": t.collapsed ? "展开子条目" : "折叠子条目", "aria-expanded": !t.collapsed, onClick: () => m(t.id, (l) => ({ ...l, collapsed: !l.collapsed }), !o), children: t.collapsed ? /* @__PURE__ */ n(q, { size: 15 }) : /* @__PURE__ */ n(se, { size: 15 }) }) : /* @__PURE__ */ n("span", { className: "mind-note-collapse-spacer" }),
        /* @__PURE__ */ n("button", { type: "button", className: "mind-note-complete", "aria-label": t.completed ? "标记为未完成" : "标记为完成", "aria-pressed": t.completed, disabled: o, onClick: () => m(t.id, (l) => ({ ...l, completed: !l.completed })), children: t.completed ? /* @__PURE__ */ n(ce, { size: 14 }) : /* @__PURE__ */ n(ae, { size: 14 }) }),
        /* @__PURE__ */ n("input", { ref: (l) => {
          l ? y.current.set(t.id, l) : y.current.delete(t.id);
        }, "aria-label": "思维笔记条目", value: t.text, maxLength: 4096, readOnly: o, onChange: (l) => m(t.id, (p) => ({ ...p, text: l.currentTarget.value })), onKeyDown: (l) => Y(l, t.id) }),
        /* @__PURE__ */ u("div", { className: "mind-note-row-actions", children: [
          /* @__PURE__ */ n("button", { type: "button", title: "聚焦此条目", "aria-label": "聚焦此条目", onClick: () => b(t.id), children: /* @__PURE__ */ n(de, { size: 14 }) }),
          /* @__PURE__ */ n("button", { type: "button", title: "条目属性", "aria-label": "条目属性", "aria-pressed": E === t.id, onClick: () => M((l) => l === t.id ? "" : t.id), children: /* @__PURE__ */ n(ue, { size: 14 }) }),
          !o && /* @__PURE__ */ u(ne, { children: [
            /* @__PURE__ */ n("button", { type: "button", title: "添加子条目", "aria-label": "添加子条目", onClick: () => U(t.id), children: /* @__PURE__ */ n(he, { size: 14 }) }),
            /* @__PURE__ */ n("button", { type: "button", title: "增加缩进", "aria-label": "增加缩进", disabled: !z, onClick: () => $(t.id), children: /* @__PURE__ */ n(pe, { size: 14 }) }),
            /* @__PURE__ */ n("button", { type: "button", title: "减少缩进", "aria-label": "减少缩进", disabled: !ee, onClick: () => P(t.id), children: /* @__PURE__ */ n(me, { size: 14 }) }),
            /* @__PURE__ */ n("button", { type: "button", title: "删除条目", "aria-label": "删除条目", onClick: () => K(t.id), children: /* @__PURE__ */ n(fe, { size: 14 }) })
          ] })
        ] })
      ] }),
      E === t.id && /* @__PURE__ */ u("div", { className: "mind-note-metadata", children: [
        /* @__PURE__ */ u("label", { children: [
          "优先级",
          /* @__PURE__ */ u("select", { value: t.priority || "none", disabled: o, onChange: (l) => m(t.id, (p) => ({ ...p, priority: l.target.value })), children: [
            /* @__PURE__ */ n("option", { value: "none", children: "无" }),
            /* @__PURE__ */ n("option", { value: "low", children: "低" }),
            /* @__PURE__ */ n("option", { value: "medium", children: "中" }),
            /* @__PURE__ */ n("option", { value: "high", children: "高" }),
            /* @__PURE__ */ n("option", { value: "urgent", children: "紧急" })
          ] })
        ] }),
        /* @__PURE__ */ u("label", { children: [
          /* @__PURE__ */ n(be, { size: 13 }),
          "截止日期",
          /* @__PURE__ */ n("input", { type: "date", value: t.due_date || "", disabled: o, onChange: (l) => m(t.id, (p) => ({ ...p, due_date: l.target.value })) })
        ] }),
        /* @__PURE__ */ u("label", { className: "is-wide", children: [
          "标签",
          /* @__PURE__ */ n("input", { value: (t.tags || []).join(", "), disabled: o, placeholder: "产品, 发布", onChange: (l) => m(t.id, (p) => ({ ...p, tags: [...new Set(l.target.value.split(/[,，]/).map((te) => Array.from(te.trim()).slice(0, 20).join("")).filter(Boolean))].slice(0, 12) })) })
        ] }),
        /* @__PURE__ */ u("label", { className: "is-wide", children: [
          "备注",
          /* @__PURE__ */ n("textarea", { rows: 2, maxLength: 4096, value: t.note || "", disabled: o, placeholder: "补充背景、判断或下一步", onChange: (l) => m(t.id, (p) => ({ ...p, note: l.target.value })) })
        ] })
      ] }),
      !t.collapsed && t.children.length > 0 && /* @__PURE__ */ n("div", { className: "mind-note-children", children: B(t.children, r + 1) })
    ] }, t.id);
  });
  return /* @__PURE__ */ u("div", { className: "knowledge-open-editor knowledge-mind-note-editor", children: [
    /* @__PURE__ */ u("header", { className: "mind-note-toolbar", children: [
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ n("strong", { children: "思维笔记" }),
        /* @__PURE__ */ u("span", { children: [
          _.completed,
          "/",
          _.total,
          " 已完成"
        ] })
      ] }),
      /* @__PURE__ */ u("div", { children: [
        !o && /* @__PURE__ */ u(A, { title: "添加顶层条目", onClick: Q, children: [
          /* @__PURE__ */ n(oe, { size: 15 }),
          "顶层条目"
        ] }),
        s && h && !o && /* @__PURE__ */ u(A, { title: "转换为新文档", disabled: R, onClick: () => {
          Z();
        }, children: [
          /* @__PURE__ */ n(re, { size: 15 }),
          R ? "转换中…" : "转为文档"
        ] })
      ] })
    ] }),
    N.length > 0 && /* @__PURE__ */ u("nav", { className: "mind-note-focus-path", "aria-label": "聚焦路径", children: [
      /* @__PURE__ */ n("button", { type: "button", onClick: () => b(""), children: "全部条目" }),
      N.map((e, r) => /* @__PURE__ */ u("span", { children: [
        /* @__PURE__ */ n(q, { size: 13 }),
        r === N.length - 1 ? /* @__PURE__ */ n("strong", { children: e.text || "未命名条目" }) : /* @__PURE__ */ n("button", { type: "button", onClick: () => b(e.id), children: e.text || "未命名条目" })
      ] }, e.id)),
      /* @__PURE__ */ n("button", { type: "button", className: "mind-note-exit-focus", "aria-label": "退出聚焦", title: "退出聚焦", onClick: () => b(""), children: /* @__PURE__ */ n(le, { size: 14 }) })
    ] }),
    /* @__PURE__ */ n("section", { className: "mind-note-outline", "aria-label": "思维笔记大纲", children: B(O) }),
    !o && /* @__PURE__ */ n("footer", { children: /* @__PURE__ */ n("span", { children: "Enter 新增同级 · Tab 缩进 · Shift+Tab 减少缩进" }) })
  ] });
}
export {
  ze as MindNoteEditor,
  ze as default
};
