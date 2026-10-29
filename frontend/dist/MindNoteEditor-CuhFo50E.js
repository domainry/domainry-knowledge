import { jsxs as d, jsx as n, Fragment as se } from "react/jsx-runtime";
import { useMemo as ae, useState as z, useRef as q, useEffect as G } from "react";
import { Download as de, FileJson as ue, Plus as he, FileText as pe, ChevronRight as H, X as me, ChevronDown as fe, Check as be, Circle as ge, Focus as ve, Tags as Ne, ListPlus as we, IndentIncrease as Ce, IndentDecrease as ke, Trash2 as xe, CalendarDays as ye } from "lucide-react";
import { p as De, P as je, B as M, c as Q, a as E, m as ze, S as Me } from "./index-BHTb83zb.js";
import { s as W } from "./documentTransfer-EuLogqx3.js";
function f(s, i, l = "") {
  for (let r = 0; r < s.length; r++) {
    if (s[r].id === i) return { node: s[r], index: r, siblings: s, parentID: l };
    const c = f(s[r].children, i, s[r].id);
    if (c) return c;
  }
  return null;
}
function Z(s, i, l = []) {
  for (const r of s) {
    if (r.id === i) return [...l, r];
    const c = Z(r.children, i, [...l, r]);
    if (c.length) return c;
  }
  return [];
}
function L(s, i, l) {
  return s.map((r) => r.id === i ? l(r) : { ...r, children: L(r.children, i, l) });
}
function S(s, i) {
  let l;
  const r = [];
  for (const c of s) {
    if (c.id === i) {
      l = c;
      continue;
    }
    const h = S(c.children, i);
    !l && h.removed && (l = h.removed), r.push(h.removed ? { ...c, children: h.nodes } : c);
  }
  return { nodes: r, removed: l };
}
function F(s, i, l) {
  const r = [];
  for (const c of s)
    r.push({ ...c, children: F(c.children, i, l) }), c.id === i && r.push(l);
  return r;
}
function Ee(s) {
  let i = 0, l = 0;
  const r = (c) => c.forEach((h) => {
    i += 1, h.completed && (l += 1), r(h.children);
  });
  return r(s), { total: i, completed: l };
}
function A(s, i = 0) {
  return s.map((l) => `${"  ".repeat(i)}- [${l.completed ? "x" : " "}] ${l.text || "未命名条目"}${l.children.length ? `
${A(l.children, i + 1)}` : ""}`).join(`
`);
}
function Y(s, i, l) {
  const r = URL.createObjectURL(new Blob([s], { type: l })), c = document.createElement("a");
  c.href = r, c.download = i, c.click(), URL.revokeObjectURL(r);
}
function Le({ body: s, readOnly: i = !1, documentTitle: l = "未命名思维笔记", initialBlockID: r, convertPage: c, pageActionHost: h, authorizeContentAction: g, onActionFeedback: T, onChange: O }) {
  const v = ae(() => De(s), [s]), [k, P] = z(v), u = q(k), [y, b] = z(""), [R, $] = z(""), [I, J] = z(!1), D = q(/* @__PURE__ */ new Map());
  G(() => {
    u.current = v, P(v), b((e) => e && f(v.nodes, e) ? e : ""), $((e) => e && f(v.nodes, e) ? e : "");
  }, [v]), G(() => {
    !r || !f(u.current.nodes, r) || (b(r), window.setTimeout(() => {
      const e = D.current.get(r);
      e?.scrollIntoView({ block: "center" }), e?.focus({ preventScroll: !0 });
    }));
  }, [r]);
  const N = (e, o = !i) => {
    u.current = e, P(e), o && O(Q(e));
  }, x = (e) => window.setTimeout(() => D.current.get(e)?.focus()), m = (e, o, t = !i) => N({ ...u.current, nodes: L(u.current.nodes, e, o) }, t), ee = () => {
    const e = E();
    N({ ...u.current, nodes: [...u.current.nodes, e] }), x(e.id);
  }, te = (e) => {
    const o = E();
    m(e, (t) => ({ ...t, collapsed: !1, children: [...t.children, o] })), x(o.id);
  }, ne = (e) => {
    const o = E("");
    N({ ...u.current, nodes: F(u.current.nodes, e, o) }), x(o.id);
  }, U = (e) => {
    const o = S(u.current.nodes, e).nodes, t = o.length ? o : [E("")];
    N({ ...u.current, nodes: t }), y === e && b(""), R === e && $("");
  }, K = (e) => {
    const o = f(u.current.nodes, e);
    if (!o || o.index === 0) return;
    const t = o.siblings[o.index - 1], C = S(u.current.nodes, e);
    C.removed && (N({ ...u.current, nodes: L(C.nodes, t.id, (j) => ({ ...j, collapsed: !1, children: [...j.children, C.removed] })) }), x(e));
  }, B = (e) => {
    const o = f(u.current.nodes, e);
    if (!o?.parentID) return;
    const t = S(u.current.nodes, e);
    t.removed && (N({ ...u.current, nodes: F(t.nodes, o.parentID, t.removed) }), x(e));
  }, ie = (e, o) => {
    i || (e.key === "Enter" ? (e.preventDefault(), ne(o)) : e.key === "Tab" ? (e.preventDefault(), e.shiftKey ? B(o) : K(o)) : e.key === "Backspace" && !e.currentTarget.value && !f(u.current.nodes, o)?.node.children.length && (e.preventDefault(), U(o)));
  }, re = async () => {
    if (!(!c || I)) {
      J(!0);
      try {
        if (!g) throw Error("当前页面禁止创建副本。");
        await g("duplicate"), await c("document", `${l}（文档）`, ze(u.current));
      } catch (e) {
        T?.(e instanceof Error ? e.message : "转换文档失败");
      } finally {
        J(!1);
      }
    }
  }, _ = async (e) => {
    try {
      if (!g) throw Error("当前页面禁止导出内容。");
      await g("export"), e === "json" ? Y(Q(u.current), W(l, "json"), "application/json") : Y(A(u.current.nodes), W(l, "md"), "text/markdown;charset=utf-8"), T?.(`已导出 ${e === "json" ? "JSON" : "Markdown"}。`);
    } catch (o) {
      T?.(o instanceof Error ? o.message : "思维笔记导出失败");
    }
  }, w = y ? Z(k.nodes, y) : [], oe = w.length ? [w[w.length - 1]] : k.nodes, V = Ee(k.nodes), X = (e, o = 0) => e.map((t) => {
    const C = f(k.nodes, t.id), j = C.index > 0, le = !!C.parentID;
    return /* @__PURE__ */ d("div", { className: "mind-note-branch", children: [
      /* @__PURE__ */ d("div", { className: `mind-note-row${t.completed ? " is-completed" : ""}${y === t.id ? " is-focus-root" : ""}`, "data-priority": t.priority || "none", style: { "--mind-note-depth": o }, children: [
        t.children.length ? /* @__PURE__ */ n("button", { type: "button", className: "mind-note-collapse", "aria-label": t.collapsed ? "展开子条目" : "折叠子条目", "aria-expanded": !t.collapsed, onClick: () => m(t.id, (a) => ({ ...a, collapsed: !a.collapsed }), !i), children: t.collapsed ? /* @__PURE__ */ n(H, { size: 15 }) : /* @__PURE__ */ n(fe, { size: 15 }) }) : /* @__PURE__ */ n("span", { className: "mind-note-collapse-spacer" }),
        /* @__PURE__ */ n("button", { type: "button", className: "mind-note-complete", "aria-label": t.completed ? "标记为未完成" : "标记为完成", "aria-pressed": t.completed, disabled: i, onClick: () => m(t.id, (a) => ({ ...a, completed: !a.completed })), children: t.completed ? /* @__PURE__ */ n(be, { size: 14 }) : /* @__PURE__ */ n(ge, { size: 14 }) }),
        /* @__PURE__ */ n("input", { ref: (a) => {
          a ? D.current.set(t.id, a) : D.current.delete(t.id);
        }, "aria-label": "思维笔记条目", value: t.text, maxLength: 4096, readOnly: i, onChange: (a) => m(t.id, (p) => ({ ...p, text: a.currentTarget.value })), onKeyDown: (a) => ie(a, t.id) }),
        /* @__PURE__ */ d("div", { className: "mind-note-row-actions", children: [
          /* @__PURE__ */ n("button", { type: "button", title: "聚焦此条目", "aria-label": "聚焦此条目", onClick: () => b(t.id), children: /* @__PURE__ */ n(ve, { size: 14 }) }),
          /* @__PURE__ */ n("button", { type: "button", title: "条目属性", "aria-label": "条目属性", "aria-pressed": R === t.id, onClick: () => $((a) => a === t.id ? "" : t.id), children: /* @__PURE__ */ n(Ne, { size: 14 }) }),
          !i && /* @__PURE__ */ d(se, { children: [
            /* @__PURE__ */ n("button", { type: "button", title: "添加子条目", "aria-label": "添加子条目", onClick: () => te(t.id), children: /* @__PURE__ */ n(we, { size: 14 }) }),
            /* @__PURE__ */ n("button", { type: "button", title: "增加缩进", "aria-label": "增加缩进", disabled: !j, onClick: () => K(t.id), children: /* @__PURE__ */ n(Ce, { size: 14 }) }),
            /* @__PURE__ */ n("button", { type: "button", title: "减少缩进", "aria-label": "减少缩进", disabled: !le, onClick: () => B(t.id), children: /* @__PURE__ */ n(ke, { size: 14 }) }),
            /* @__PURE__ */ n("button", { type: "button", title: "删除条目", "aria-label": "删除条目", onClick: () => U(t.id), children: /* @__PURE__ */ n(xe, { size: 14 }) })
          ] })
        ] })
      ] }),
      R === t.id && /* @__PURE__ */ d("div", { className: "mind-note-metadata", children: [
        /* @__PURE__ */ d("label", { children: [
          "优先级",
          /* @__PURE__ */ d(Me, { value: t.priority || "none", disabled: i, onChange: (a) => m(t.id, (p) => ({ ...p, priority: a.target.value })), children: [
            /* @__PURE__ */ n("option", { value: "none", children: "无" }),
            /* @__PURE__ */ n("option", { value: "low", children: "低" }),
            /* @__PURE__ */ n("option", { value: "medium", children: "中" }),
            /* @__PURE__ */ n("option", { value: "high", children: "高" }),
            /* @__PURE__ */ n("option", { value: "urgent", children: "紧急" })
          ] })
        ] }),
        /* @__PURE__ */ d("label", { children: [
          /* @__PURE__ */ n(ye, { size: 13 }),
          "截止日期",
          /* @__PURE__ */ n("input", { type: "date", value: t.due_date || "", disabled: i, onChange: (a) => m(t.id, (p) => ({ ...p, due_date: a.target.value })) })
        ] }),
        /* @__PURE__ */ d("label", { className: "is-wide", children: [
          "标签",
          /* @__PURE__ */ n("input", { value: (t.tags || []).join(", "), disabled: i, placeholder: "产品, 发布", onChange: (a) => m(t.id, (p) => ({ ...p, tags: [...new Set(a.target.value.split(/[,，]/).map((ce) => Array.from(ce.trim()).slice(0, 20).join("")).filter(Boolean))].slice(0, 12) })) })
        ] }),
        /* @__PURE__ */ d("label", { className: "is-wide", children: [
          "备注",
          /* @__PURE__ */ n("textarea", { rows: 2, maxLength: 4096, value: t.note || "", disabled: i, placeholder: "补充背景、判断或下一步", onChange: (a) => m(t.id, (p) => ({ ...p, note: a.target.value })) })
        ] })
      ] }),
      !t.collapsed && t.children.length > 0 && /* @__PURE__ */ n("div", { className: "mind-note-children", children: X(t.children, o + 1) })
    ] }, t.id);
  });
  return /* @__PURE__ */ d("div", { className: "knowledge-open-editor knowledge-mind-note-editor", children: [
    g && /* @__PURE__ */ d(je, { host: h, children: [
      /* @__PURE__ */ d(M, { title: "导出 Markdown", onClick: () => {
        _("markdown");
      }, children: [
        /* @__PURE__ */ n(de, { size: 15 }),
        "Markdown"
      ] }),
      /* @__PURE__ */ d(M, { title: "导出 canonical JSON", onClick: () => {
        _("json");
      }, children: [
        /* @__PURE__ */ n(ue, { size: 15 }),
        "JSON"
      ] })
    ] }),
    /* @__PURE__ */ d("header", { className: "mind-note-toolbar", children: [
      /* @__PURE__ */ d("div", { children: [
        /* @__PURE__ */ n("strong", { children: "思维笔记" }),
        /* @__PURE__ */ d("span", { children: [
          V.completed,
          "/",
          V.total,
          " 已完成"
        ] })
      ] }),
      /* @__PURE__ */ d("div", { children: [
        !i && /* @__PURE__ */ d(M, { title: "添加顶层条目", onClick: ee, children: [
          /* @__PURE__ */ n(he, { size: 15 }),
          "顶层条目"
        ] }),
        c && g && !i && /* @__PURE__ */ d(M, { title: "转换为新文档", disabled: I, onClick: () => {
          re();
        }, children: [
          /* @__PURE__ */ n(pe, { size: 15 }),
          I ? "转换中…" : "转为文档"
        ] })
      ] })
    ] }),
    w.length > 0 && /* @__PURE__ */ d("nav", { className: "mind-note-focus-path", "aria-label": "聚焦路径", children: [
      /* @__PURE__ */ n("button", { type: "button", onClick: () => b(""), children: "全部条目" }),
      w.map((e, o) => /* @__PURE__ */ d("span", { children: [
        /* @__PURE__ */ n(H, { size: 13 }),
        o === w.length - 1 ? /* @__PURE__ */ n("strong", { children: e.text || "未命名条目" }) : /* @__PURE__ */ n("button", { type: "button", onClick: () => b(e.id), children: e.text || "未命名条目" })
      ] }, e.id)),
      /* @__PURE__ */ n("button", { type: "button", className: "mind-note-exit-focus", "aria-label": "退出聚焦", title: "退出聚焦", onClick: () => b(""), children: /* @__PURE__ */ n(me, { size: 14 }) })
    ] }),
    /* @__PURE__ */ n("section", { className: "mind-note-outline", "aria-label": "思维笔记大纲", children: X(oe) }),
    !i && /* @__PURE__ */ n("footer", { children: /* @__PURE__ */ n("span", { children: "Enter 新增同级 · Tab 缩进 · Shift+Tab 减少缩进" }) })
  ] });
}
export {
  Le as MindNoteEditor,
  Le as default
};
