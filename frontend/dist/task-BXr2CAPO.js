function i(t) {
  if (!t) return "";
  const e = new Date(t);
  return Number.isNaN(e.getTime()) ? "" : new Date(e.getTime() - e.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
}
function a(t) {
  if (!t) return;
  const e = new Date(t);
  return Number.isNaN(e.getTime()) ? void 0 : e.toISOString();
}
export {
  i as a,
  a as t
};
