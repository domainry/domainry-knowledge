function o(t, e) {
  return "<style>.ppt-comments{break-before:page;padding:32px;box-sizing:border-box;font:16px/1.5 sans-serif}.ppt-comments li{break-inside:avoid;margin:20px 0}.ppt-comments p{white-space:pre-wrap;overflow-wrap:anywhere}</style>" + t.slides.map((n, a) => {
    var p;
    return (p = n.comments) != null && p.length ? `<section class="ppt-comments" data-slide="${a + 1}"><h2>${a + 1}</h2><ol>` + n.comments.map((i, s) => `<li value="${e(String(i.idx ?? s + 1))}"><b>${e(i.author)}</b>` + (i.date ? `<time> · ${e(i.date)}</time>` : "") + `<p>${e(i.text)}</p></li>`).join("") + "</ol></section>" : "";
  }).join("");
}
function r(t, e, n, a) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>slides</title><style>@page{size:${Math.round(t.width)}px ${Math.round(t.height)}px;margin:0}html,body{margin:0;padding:0}.pg{page-break-after:always;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center}.pg svg{width:100%;height:100%}</style></head><body>` + e.map((p) => `<div class="pg">${p}</div>`).join("") + (n ? o(t, a) : "") + "</body></html>";
}
export {
  o as printCommentAppendix,
  r as printDocument
};
