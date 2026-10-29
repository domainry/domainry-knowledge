import { formatKnowledgeDate, kt, ktf } from "../i18n/runtime.ts";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, BarChart3, CheckCircle2, ClipboardCopy, Download, FilePenLine, ListChecks, Plus, Settings2, Trash2, Upload, X } from "lucide-react";
import { DefaultEvaluator, Formio } from "@formio/js";
import bootstrapCSS from "bootstrap/dist/css/bootstrap.min.css?inline";
import formioCSS from "@formio/js/dist/formio.full.min.css?inline";
import { Button, Select } from "../components.tsx";
import { canonicalFormFromBuilder, formioSchema, formSubmissionAnswers, normalizeFormContent, parseFormContent } from "../formContent.ts";
import type { KnowledgeFormAnalytics, KnowledgeFormComponent, KnowledgeFormComponentType, KnowledgeFormFileAnswer, KnowledgeFormOption, KnowledgeFormSettings, KnowledgeFormSubmission } from "../types.ts";
import type { KnowledgeEditorProps } from "./types.ts";
import { PageActionPortal } from "./PageActionPortal.tsx";
import { taskDateTimeInputValue, taskDateTimeISO } from "./task.ts";

type FormView = "design" | "settings" | "responses";

// Form.io's default evaluator compiles lodash templates with `new Function`.
// The Knowledge product deliberately ships a strict CSP without `unsafe-eval`,
// and canonical forms do not support executable expressions. Use Form.io's
// supported no-eval evaluator for both the builder and the response renderer.
Formio.use({ evaluator: new DefaultEvaluator({ noeval: true }) });

const questionTypes: Array<{ type: KnowledgeFormComponentType; label: string }> = [
  { type: "textfield", get label() { return kt("knowledge.auto.0f59b2657fbbf761"); } }, { type: "textarea", get label() { return kt("knowledge.auto.85948100fe2c5393"); } }, { type: "number", get label() { return kt("knowledge.auto.c16ec9274e9d13d1"); } },
  { type: "currency", get label() { return kt("knowledge.auto.ffc624300de8f2e1"); } }, { type: "email", get label() { return kt("knowledge.auto.73075237fd0f05f0"); } }, { type: "url", get label() { return kt("knowledge.auto.a8ecb4b6dabebc09"); } }, { type: "phoneNumber", get label() { return kt("knowledge.auto.bf8b5d378f010ece"); } },
  { type: "radio", get label() { return kt("knowledge.auto.4214b9af7ae0cdcc"); } }, { type: "select", get label() { return kt("knowledge.auto.095b751a68e708b2"); } },
  { type: "selectboxes", get label() { return kt("knowledge.auto.461e085d5ca266fb"); } }, { type: "checkbox", get label() { return kt("knowledge.auto.a0e0c0bae980ef35"); } }, { type: "datetime", get label() { return kt("knowledge.auto.6ac8b7718121c801"); } },
  { type: "rating", get label() { return kt("knowledge.auto.96fff2e26c8d1027"); } }, { type: "scale", get label() { return kt("knowledge.auto.1b49a13a14cd4e8f"); } }, { type: "file", get label() { return kt("knowledge.auto.c7225dbf105eeed5"); } },
];

const choiceTypes = new Set<KnowledgeFormComponentType>(["radio", "select", "selectboxes"]);

function questionTypeLabel(type: KnowledgeFormComponentType) {
  return questionTypes.find(item => item.type === type)?.label || type;
}

function newQuestion(type: KnowledgeFormComponentType, components: KnowledgeFormComponent[]): KnowledgeFormComponent {
  let index = components.length + 1;
  while (components.some(component => component.key === `question${index}`)) index += 1;
  const component: KnowledgeFormComponent = { type, key: `question${index}`, label: ktf("knowledge.auto.7fdb304ea68155bf", { value0: questionTypeLabel(type) }), input: true, validate: { required: false } };
  const options = [{ label: kt("knowledge.auto.254a531756ce6aee"), value: "option1" }, { label: kt("knowledge.auto.3a384308628d66a3"), value: "option2" }];
  if (type === "radio" || type === "selectboxes") component.values = options;
  if (type === "select") component.data = { values: options };
  if (type === "currency") component.currency = "CNY";
  if (type === "phoneNumber") component.inputMask = "";
  if (type === "rating") component.validate = { required: false, min: 1, max: 5 };
  if (type === "scale") component.validate = { required: false, min: 0, max: 10 };
  if (type === "file") component.maxFiles = 5;
  return component;
}

function uploadedFormDocument(value: string | Record<string, unknown>, title: string): KnowledgeFormFileAnswer | null {
  const props = typeof value === "object" && value && typeof value.props === "object" && value.props ? value.props as Record<string, unknown> : {};
  const reference = typeof value === "string" ? value : String(props.url || value.url || "");
  const match = /^knowledge-document:(kdoc_[a-f0-9]{32})$/.exec(reference);
  return match ? { document_id: match[1], title } : null;
}

function questionOptions(component: KnowledgeFormComponent) {
  return component.type === "select" ? component.data?.values || [] : component.values || [];
}

function errorMessage(error: unknown) {
  return error instanceof Error && error.message ? error.message : kt("knowledge.auto.2c1e5ec62145f251");
}

function runtimeError(form: KnowledgeEditorProps["form"], error: unknown) {
  return form?.formatError(error) || errorMessage(error);
}

function formQuestionVisible(component: KnowledgeFormComponent, answers: Record<string, unknown>) {
  if (!component.conditional) return true;
  const actual = answers[component.conditional.when];
  const expected = component.conditional.eq;
  const equal = actual === expected || typeof expected === "number" && typeof actual === "string" && actual.trim() !== "" && Number(actual) === expected;
  return equal === component.conditional.show;
}

function FormFileQuestion({ component, answers, canSubmit, uploadsEnabled, uploading, onRemove, onUpload }: {
  component: KnowledgeFormComponent;
  answers: KnowledgeFormFileAnswer[];
  canSubmit: boolean;
  uploadsEnabled: boolean;
  uploading: boolean;
  onRemove(documentID: string): void;
  onUpload(file: File): Promise<void>;
}) {
  const maximum = component.maxFiles || 5;
  return <article>
    <header><strong>{component.label}{component.validate.required && <em>*</em>}</strong>{component.description && <small>{component.description}</small>}</header>
    <div>{answers.map(answer => <span key={answer.document_id}>{answer.title}<button type="button" aria-label={ktf("knowledge.auto.30c2158acfed8b36", { value0: answer.title })} disabled={!canSubmit} onClick={() => onRemove(answer.document_id)}><X size={13} /></button></span>)}</div>
    {canSubmit && answers.length < maximum && <label className={uploading ? "is-uploading" : ""}><Upload size={15} />{uploading ? kt("knowledge.auto.6148b38691e3018e") : ktf("knowledge.auto.bd803ad04b216469", { value0: maximum })}<input type="file" disabled={!uploadsEnabled || uploading} onChange={async event => { const file = event.target.files?.[0]; if (!file) return; await onUpload(file); event.currentTarget.value = ""; }} /></label>}
    {canSubmit && !uploadsEnabled && <small>{kt("knowledge.auto.f8ff46280ed94836")}</small>}
  </article>;
}

function formShadowStyle() {
  return `${bootstrapCSS}\n${formioCSS}\n
    :host{container-type:inline-size;display:block;color:var(--knowledge-text);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif;--bs-body-color:var(--knowledge-text);--bs-body-bg:var(--knowledge-surface);--bs-secondary-color:var(--knowledge-muted);--bs-tertiary-bg:var(--knowledge-surface-subtle);--bs-border-color:var(--knowledge-border);--bs-primary:var(--knowledge-primary);--bs-primary-rgb:23,107,82}
    .formbuilder{min-height:560px}.formio-component{font-size:14px}.formio-component label{font-weight:650;color:var(--knowledge-text)}
    .btn-primary{--bs-btn-color:var(--knowledge-on-accent);--bs-btn-bg:var(--knowledge-primary);--bs-btn-border-color:var(--knowledge-primary);--bs-btn-hover-color:var(--knowledge-on-accent);--bs-btn-hover-bg:var(--knowledge-primary-hover);--bs-btn-hover-border-color:var(--knowledge-primary-hover)}
    .formcomponents .formcomponent{color:var(--knowledge-text)!important;border:1px solid var(--knowledge-border)!important;border-radius:10px!important;margin:6px 0!important;padding:10px 12px!important;background:var(--knowledge-surface)!important;transition:background .16s,border-color .16s,transform .16s}
    .formcomponents .formcomponent:hover{background:var(--knowledge-surface-hover)!important;border-color:var(--knowledge-primary)!important;transform:translateX(2px)}
    .formarea .component-btn-group{opacity:.18;transition:opacity .16s}.formarea .formio-component:hover>.component-btn-group{opacity:1}
    @container (max-width:720px){.formbuilder{display:block!important;margin:0!important}.formbuilder>.formcomponents,.formbuilder>.formarea{width:100%!important;max-width:none!important;flex:none!important}.builder-sidebar_scroll{max-height:300px!important;margin-bottom:18px;overflow:auto}.builder-sidebar [ref="sidebar-container"]{grid-template-columns:repeat(2,minmax(0,1fr))}}`;
}

export function FormEditor({ body, readOnly = false, form, pageActionHost, authorizeContentAction, onChange, onActionFeedback, uploadFile, fileUploadsEnabled }: KnowledgeEditorProps) {
  const parsed = useMemo(() => parseFormContent(body), [body]);
  const [view, setView] = useState<FormView>("design");
  const [components, setComponents] = useState<KnowledgeFormComponent[]>(parsed.components);
  const [settings, setSettings] = useState<KnowledgeFormSettings>(parsed.settings);
  const [schemaError, setSchemaError] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "submitted">("idle");
  const [operationError, setOperationError] = useState("");
  const [responses, setResponses] = useState<KnowledgeFormSubmission[]>([]);
  const [responsesBefore, setResponsesBefore] = useState("");
  const [responsesComplete, setResponsesComplete] = useState(true);
  const [analytics, setAnalytics] = useState<KnowledgeFormAnalytics | null>(null);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [fileAnswers, setFileAnswers] = useState<Record<string, KnowledgeFormFileAnswer[]>>({});
  const [uploadingKey, setUploadingKey] = useState("");
  const [formAnswers, setFormAnswers] = useState<Record<string, unknown>>({});
  const host = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => { setComponents(parsed.components); setSettings(parsed.settings); }, [body]);

  useEffect(() => {
    if (!readOnly || view !== "design" || !host.current) return;
    const shadow = host.current.shadowRoot || host.current.attachShadow({ mode: "open" });
    shadow.replaceChildren();
    const style = document.createElement("style");
    style.textContent = formShadowStyle();
    const mount = document.createElement("div");
    shadow.append(style, mount);
    let active = true;
    const fillable = form?.canSubmit;
    const promise = Formio.createForm(mount, formioSchema(parsed), { readOnly: !fillable, noAlerts: true });
    void promise.then((created: any) => {
      if (!active) { created.destroy?.(true); return; }
      instanceRef.current = created;
      created.on?.("change", (event: { data?: Record<string, unknown> }) => { if (active) setFormAnswers({ ...(event?.data || created.data || {}) }); });
    }).catch((failure: unknown) => { if (active) setSchemaError(runtimeError(form, failure)); });
    return () => {
      active = false;
      instanceRef.current = null;
      void Promise.resolve(promise).then((created: any) => created.destroy?.(true)).catch(() => undefined);
      shadow.replaceChildren();
    };
  }, [body, form?.canSubmit, readOnly, view]);

  function persistComponents(next: KnowledgeFormComponent[]) {
    setComponents(next);
    try {
      const canonical = normalizeFormContent({ schema_version: 1, display: "form", components: next, settings });
      onChangeRef.current(JSON.stringify(canonical));
      setSchemaError("");
    } catch (failure) { setSchemaError(errorMessage(failure)); }
  }

  function patchQuestion(index: number, patch: Partial<KnowledgeFormComponent>) {
    persistComponents(components.map((component, position) => position === index ? { ...component, ...patch } : component));
  }

  function setOptions(index: number, options: KnowledgeFormOption[]) {
    const component = components[index];
    if (component.type === "select") patchQuestion(index, { data: { values: options } });
    else patchQuestion(index, { values: options });
  }

  function setCondition(index: number, when: string) {
    if (!when) {
      const component = { ...components[index] };
      delete component.conditional;
      persistComponents(components.map((value, position) => position === index ? component : value));
      return;
    }
    const target = components.find(component => component.key === when);
    const eq = target?.type === "checkbox" ? true : target?.type === "number" || target?.type === "currency" || target?.type === "rating" || target?.type === "scale" ? 0 : "";
    patchQuestion(index, { conditional: { show: true, when, eq } });
  }

  function updateSettings(patch: Partial<KnowledgeFormSettings>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    try {
      onChange(JSON.stringify(canonicalFormFromBuilder({ components }, next)));
      setSchemaError("");
    } catch (failure) { setSchemaError(errorMessage(failure)); }
  }

  async function submit() {
    if (!form?.canSubmit || !instanceRef.current || submitState === "submitting") return;
    setOperationError("");
    const instance = instanceRef.current;
    const valid = instance.checkValidity?.(instance.data, true, instance.data) !== false;
    instance.setPristine?.(false);
    instance.showErrors?.(instance.errors || []);
    const currentAnswers = instance.submission?.data || instance.data || {};
    const visibleFiles = parsed.components.filter(component => component.type === "file" && formQuestionVisible(component, currentAnswers));
    const missingFile = visibleFiles.find(component => component.validate.required && !(fileAnswers[component.key]?.length));
    if (!valid || missingFile) { setOperationError(missingFile ? ktf("knowledge.auto.79aa2769d1904680", { value0: missingFile.label }) : kt("knowledge.auto.872a4a8261a70617")); return; }
    setSubmitState("submitting");
    try {
      const attachments = Object.fromEntries(visibleFiles.filter(component => fileAnswers[component.key]?.length).map(component => [component.key, fileAnswers[component.key]]));
      await form.submit(formSubmissionAnswers({ ...currentAnswers, ...attachments }, parsed.components));
      setSubmitState("submitted");
      onActionFeedback?.(parsed.settings.confirmation_message);
    } catch (failure) { setOperationError(runtimeError(form, failure)); setSubmitState("idle"); }
  }

  async function loadResponses(reset = true) {
    if (!form?.canManage || loadingResponses) return;
    setLoadingResponses(true); setOperationError("");
    try {
      const before = reset ? "" : responsesBefore;
      const [page, summary] = await Promise.all([form.listResponses(before, 50), form.analytics()]);
      setResponses(current => reset ? page.items : [...current, ...page.items]);
      setResponsesBefore(page.next_before || "");
      setResponsesComplete(page.complete);
      setAnalytics(summary);
    } catch (failure) { setOperationError(runtimeError(form, failure)); }
    finally { setLoadingResponses(false); }
  }

  useEffect(() => { if (view === "responses") void loadResponses(true); }, [view, form?.publishedVersion]);

  async function copyLink() {
    if (!form?.shareURL) return;
    try { await navigator.clipboard.writeText(form.shareURL); onActionFeedback?.(kt("knowledge.auto.bbe96028ab684369")); }
    catch { setOperationError(kt("knowledge.auto.89b0dc664b1b0ee3")); }
  }

  async function exportResponses() {
    if (!form?.canManage) return;
    setOperationError("");
    try {
      if (!authorizeContentAction) throw Error(kt("knowledge.auto.5838a06d4990c165"));
      await authorizeContentAction("export");
      const exported = await form.exportResponses();
      const url = URL.createObjectURL(new Blob([exported.body], { type: exported.content_type }));
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = exported.filename; anchor.click();
      URL.revokeObjectURL(url);
    } catch (failure) { setOperationError(runtimeError(form, failure)); }
  }

  async function uploadAnswer(component: KnowledgeFormComponent, file: File) {
    if (!uploadFile || uploadingKey) return;
    setUploadingKey(component.key); setOperationError("");
    try {
      const answer = uploadedFormDocument(await uploadFile(file), file.name);
      if (!answer) throw Error(kt("knowledge.auto.97da5756b93c7bc8"));
      const maximum = component.maxFiles || 5;
      setFileAnswers(current => ({ ...current, [component.key]: [...(current[component.key] || []).filter(item => item.document_id !== answer.document_id), answer].slice(0, maximum) }));
    } catch (failure) { setOperationError(errorMessage(failure)); }
    finally { setUploadingKey(""); }
  }

  const canShowResponses = form?.canManage && form.publishedVersion > 0;
  return <div className={`knowledge-open-editor is-formio${readOnly ? " is-form-response" : " is-form-builder"}`}>
    {authorizeContentAction && form?.canManage && form.publishedVersion > 0 && <PageActionPortal host={pageActionHost}><Button onClick={() => void exportResponses()}><Download size={15} />{kt("knowledge.auto.e40a628ffec72072")}</Button></PageActionPortal>}
    <div className="knowledge-form-toolbar" role="tablist" aria-label={kt("knowledge.auto.5477577c3a461c56")}>
      <button role="tab" aria-selected={view === "design"} onClick={() => setView("design")}><ListChecks size={16} />{readOnly ? kt("knowledge.auto.8fc652bcbaef1ca4") : kt("knowledge.auto.bde4bab9c3719af4")}</button>
      {!readOnly && <button role="tab" aria-selected={view === "settings"} onClick={() => setView("settings")}><Settings2 size={16} />{kt("knowledge.auto.e71e814430cd55fa")}</button>}
      {canShowResponses && <button role="tab" aria-selected={view === "responses"} onClick={() => setView("responses")}><BarChart3 size={16} />{kt("knowledge.auto.df091611d7ce759a")}</button>}
      {form?.publishedVersion ? <button className="knowledge-form-copy-link" type="button" onClick={() => void copyLink()}><ClipboardCopy size={15} />{kt("knowledge.auto.ba78fe0bc19a0dc9")}</button> : null}
    </div>

    {view === "design" && <>
      {readOnly ? <><div ref={host} className="native-form-host" />{parsed.components.some(component => component.type === "file" && formQuestionVisible(component, formAnswers)) && <section className="knowledge-form-file-answers" aria-label={kt("knowledge.auto.cc5d4e4fe896ab8e")}>{parsed.components.filter(component => component.type === "file" && formQuestionVisible(component, formAnswers)).map(component => <FormFileQuestion key={component.key} component={component} answers={fileAnswers[component.key] || []} canSubmit={form?.canSubmit === true} uploadsEnabled={fileUploadsEnabled === true && !!uploadFile} uploading={uploadingKey === component.key} onRemove={documentID => setFileAnswers(current => ({ ...current, [component.key]: (current[component.key] || []).filter(item => item.document_id !== documentID) }))} onUpload={file => uploadAnswer(component, file)} />)}</section>}</> : <section className="knowledge-form-designer">
        <div className="knowledge-form-question-palette" aria-label={kt("knowledge.auto.5ab9c39f4e8f8749")}>
          <span><strong>{kt("knowledge.auto.5ab9c39f4e8f8749")}</strong><small>{kt("knowledge.auto.d8fa9e9f475b650c")}</small></span>
          <div>{questionTypes.map(item => <button type="button" key={item.type} onClick={() => persistComponents([...components, newQuestion(item.type, components)])}><Plus size={14} />{item.label}</button>)}</div>
        </div>
        <div className="knowledge-form-question-list">
          {components.map((component, index) => {
            const options = questionOptions(component);
            const conditionTarget = components.find(candidate => candidate.key === component.conditional?.when);
            return <article className="knowledge-form-question-card" key={component.key}>
              <header>
                <span><b>{index + 1}</b><strong>{questionTypeLabel(component.type)}</strong><code>{component.key}</code></span>
                <div>
                  <button type="button" aria-label={kt("knowledge.auto.b1fc192deb499154")} disabled={index === 0} onClick={() => { const next = [...components]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; persistComponents(next); }}><ArrowUp size={15} /></button>
                  <button type="button" aria-label={kt("knowledge.auto.1da4d811d4cbe7b1")} disabled={index === components.length - 1} onClick={() => { const next = [...components]; [next[index], next[index + 1]] = [next[index + 1], next[index]]; persistComponents(next); }}><ArrowDown size={15} /></button>
                  <button type="button" aria-label={kt("knowledge.auto.d81056604acf20ba")} disabled={components.length === 1} onClick={() => persistComponents(components.filter((_, position) => position !== index))}><Trash2 size={15} /></button>
                </div>
              </header>
              <div className="knowledge-form-question-grid">
                <label className="is-wide">{kt("knowledge.auto.4f4f12eddc6698b3")}<input value={component.label} maxLength={512} onChange={event => patchQuestion(index, { label: event.target.value })} /></label>
                <label>{kt("knowledge.auto.c83d42ea6327986f")}<input value={component.key} maxLength={128} onChange={event => patchQuestion(index, { key: event.target.value })} /></label>
                <label className="knowledge-form-inline-check"><input type="checkbox" checked={component.validate.required} onChange={event => patchQuestion(index, { validate: { ...component.validate, required: event.target.checked } })} />{kt("knowledge.auto.b0ac2003f86d2044")}</label>
                <label className="is-wide">{kt("knowledge.auto.4262c45dc797bb0c")}<input value={component.description || ""} maxLength={2048} placeholder={kt("knowledge.auto.2756366dd2443e8d")} onChange={event => patchQuestion(index, { description: event.target.value || undefined })} /></label>
                {!choiceTypes.has(component.type) && component.type !== "checkbox" && <label className="is-wide">{kt("knowledge.auto.6cc1bc1989914d5a")}<input value={component.placeholder || ""} maxLength={512} placeholder={kt("knowledge.auto.537352400c495fb8")} onChange={event => patchQuestion(index, { placeholder: event.target.value || undefined })} /></label>}
                {["textfield", "textarea", "email", "url", "phoneNumber"].includes(component.type) && <>
                  <label>{kt("knowledge.auto.af228277dab75dc7")}<input type="number" min="0" value={component.validate.minLength ?? ""} onChange={event => patchQuestion(index, { validate: { ...component.validate, minLength: event.target.value ? Number(event.target.value) : undefined } })} /></label>
                  <label>{kt("knowledge.auto.328eb5592633dfb6")}<input type="number" min="1" value={component.validate.maxLength ?? ""} onChange={event => patchQuestion(index, { validate: { ...component.validate, maxLength: event.target.value ? Number(event.target.value) : undefined } })} /></label>
                </>}
                {(component.type === "number" || component.type === "currency" || component.type === "rating" || component.type === "scale") && <>
                  <label>{kt("knowledge.auto.b2dcdcfabb6af2a8")}<input type="number" value={component.validate.min ?? ""} onChange={event => patchQuestion(index, { validate: { ...component.validate, min: event.target.value ? Number(event.target.value) : undefined } })} /></label>
                  <label>{kt("knowledge.auto.1e7a2282076889b8")}<input type="number" value={component.validate.max ?? ""} onChange={event => patchQuestion(index, { validate: { ...component.validate, max: event.target.value ? Number(event.target.value) : undefined } })} /></label>
                </>}
                {component.type === "currency" && <label>{kt("knowledge.auto.9677f386bdcdd9c4")}<Select value={component.currency || "CNY"} onChange={event => patchQuestion(index, { currency: event.target.value as NonNullable<KnowledgeFormComponent["currency"]> })}><option value="CNY">{kt("knowledge.auto.3210398ac9608c63")}</option><option value="USD">{kt("knowledge.auto.72acc57fb14faa28")}</option><option value="EUR">{kt("knowledge.auto.3f088549cfc3963b")}</option><option value="JPY">{kt("knowledge.auto.d1c92d1d7a8b0286")}</option></Select></label>}
                {component.type === "file" && <label>{kt("knowledge.auto.b75a611614b27e64")}<input type="number" min="1" max="20" value={component.maxFiles || 5} onChange={event => patchQuestion(index, { maxFiles: Number(event.target.value) })} /></label>}
              </div>
              {choiceTypes.has(component.type) && <div className="knowledge-form-option-editor">
                <strong>{kt("knowledge.auto.bb7486f4410fd370")}</strong>
                {options.map((option, optionIndex) => <div key={`${component.key}-${optionIndex}`}><input aria-label={ktf("knowledge.auto.9506c9a76e1e863f", { value0: optionIndex + 1 })} value={option.label} onChange={event => setOptions(index, options.map((value, position) => position === optionIndex ? { ...value, label: event.target.value } : value))} /><input aria-label={ktf("knowledge.auto.2db5b5fc216ed530", { value0: optionIndex + 1 })} value={option.value} onChange={event => setOptions(index, options.map((value, position) => position === optionIndex ? { ...value, value: event.target.value } : value))} /><button type="button" aria-label={ktf("knowledge.auto.cd4eea099aebb03e", { value0: optionIndex + 1 })} disabled={options.length === 1} onClick={() => setOptions(index, options.filter((_, position) => position !== optionIndex))}><Trash2 size={14} /></button></div>)}
                <button type="button" onClick={() => { let suffix = options.length + 1; while (options.some(option => option.value === `option${suffix}`)) suffix += 1; setOptions(index, [...options, { label: ktf("knowledge.auto.2b387c1d00165616", { value0: suffix }), value: `option${suffix}` }]); }}><Plus size={14} />{kt("knowledge.auto.d063937855cf99a7")}</button>
              </div>}
              <div className="knowledge-form-condition-editor">
                <label>{kt("knowledge.auto.d9aa650f3fcd4dce")}<Select value={component.conditional?.when || ""} onChange={event => setCondition(index, event.target.value)}><option value="">{kt("knowledge.auto.e7eb9d4dfc9f936a")}</option>{components.filter(candidate => candidate.key !== component.key).map(candidate => <option key={candidate.key} value={candidate.key}>{candidate.label || candidate.key}</option>)}</Select></label>
                {component.conditional && <>
                  <label>{kt("knowledge.auto.1123245d1bed08b2")}<Select value={component.conditional.show ? "show" : "hide"} onChange={event => patchQuestion(index, { conditional: { ...component.conditional!, show: event.target.value === "show" } })}><option value="show">{kt("knowledge.auto.56642970962862e6")}</option><option value="hide">{kt("knowledge.auto.232c0eb5891441d3")}</option></Select></label>
                  <label>{kt("knowledge.auto.cdd38a0ffa9dc090")}{conditionTarget?.type === "checkbox" ? <Select value={String(component.conditional.eq)} onChange={event => patchQuestion(index, { conditional: { ...component.conditional!, eq: event.target.value === "true" } })}><option value="true">{kt("knowledge.auto.6f2971e96350b9be")}</option><option value="false">{kt("knowledge.auto.87cd6dfa6f25b3db")}</option></Select> : <input type={conditionTarget?.type === "number" || conditionTarget?.type === "currency" || conditionTarget?.type === "rating" || conditionTarget?.type === "scale" ? "number" : "text"} value={String(component.conditional.eq)} onChange={event => patchQuestion(index, { conditional: { ...component.conditional!, eq: conditionTarget?.type === "number" || conditionTarget?.type === "currency" || conditionTarget?.type === "rating" || conditionTarget?.type === "scale" ? Number(event.target.value) : event.target.value } })} />}</label>
                </>}
              </div>
            </article>;
          })}
        </div>
      </section>}
      {readOnly && form?.canSubmit && submitState !== "submitted" && <div className="knowledge-form-submit"><button type="button" disabled={submitState === "submitting"} onClick={() => void submit()}>{submitState === "submitting" ? kt("knowledge.auto.26ef00b7d061c534") : kt("knowledge.auto.046951cea8ee9863")}</button></div>}
      {readOnly && submitState === "submitted" && <div className="knowledge-form-success" role="status"><CheckCircle2 size={22} /><div><strong>{parsed.settings.confirmation_message}</strong><span>{kt("knowledge.auto.015e6a965cb3c42f")}</span></div></div>}
      {readOnly && !form?.canSubmit && <p className="knowledge-form-readonly-note">{kt("knowledge.auto.f4572af4778f7f65")}</p>}
    </>}

    {view === "settings" && !readOnly && <section className="knowledge-form-settings">
      <header><FilePenLine size={20} /><div><h3>{kt("knowledge.auto.565e08df16ccc9ed")}</h3><p>{kt("knowledge.auto.cede7687f27aeaaf")}</p></div></header>
      <div className="knowledge-form-settings-grid">
        <label>{kt("knowledge.auto.423746211469edd5")}<Select value={settings.submission_role} onChange={event => updateSettings({ submission_role: event.target.value as KnowledgeFormSettings["submission_role"] })}><option value="reader">{kt("knowledge.auto.722244bdc7d9d3a4")}</option><option value="editor">{kt("knowledge.auto.fee2b70b7c241b37")}</option><option value="manager">{kt("knowledge.auto.30f817ce87fe2442")}</option></Select></label>
        <label className="knowledge-form-checkbox"><input type="checkbox" checked={settings.allow_multiple_submissions} onChange={event => updateSettings({ allow_multiple_submissions: event.target.checked })} />{kt("knowledge.auto.61b95bc1ef8884d6")}</label>
        <label>{kt("knowledge.auto.6a9906c79f26c0ba")}<input type="datetime-local" value={taskDateTimeInputValue(settings.opens_at)} onChange={event => updateSettings({ opens_at: taskDateTimeISO(event.target.value) || "" })} /></label>
        <label>{kt("knowledge.auto.15f26621cdce9655")}<input type="datetime-local" value={taskDateTimeInputValue(settings.closes_at)} onChange={event => updateSettings({ closes_at: taskDateTimeISO(event.target.value) || "" })} /></label>
        <label className="is-wide">{kt("knowledge.auto.7fc23821c16ba659")}<textarea rows={3} maxLength={2048} value={settings.confirmation_message} onChange={event => updateSettings({ confirmation_message: event.target.value })} /></label>
      </div>
      <div className="knowledge-form-link-card"><span><strong>{kt("knowledge.auto.8f8f37ebd08af40f")}</strong><small>{form?.publishedVersion ? ktf("knowledge.auto.a6405bda1c2b7b3d", { value0: form.publishedVersion }) : kt("knowledge.auto.a0f2024d99676fe7")}</small></span>{form?.publishedVersion ? <button type="button" onClick={() => void copyLink()}><ClipboardCopy size={15} />{kt("knowledge.auto.8e86f9b1d54f2c51")}</button> : null}</div>
    </section>}

    {view === "responses" && canShowResponses && <section className="knowledge-form-responses">
      <header><div><h3>{kt("knowledge.auto.df091611d7ce759a")}</h3><p>{kt("knowledge.auto.b794c5b726cda592")}</p></div></header>
      {analytics && <div className="knowledge-form-metrics"><article><strong>{analytics.total_submissions}</strong><span>{kt("knowledge.auto.1cbac0926aae2c8a")}</span></article><article><strong>{analytics.questions.length}</strong><span>{kt("knowledge.auto.0f138d2439f86b4e")}</span></article><article><strong>v{analytics.published_version}</strong><span>{kt("knowledge.auto.460a0d868454696d")}</span></article></div>}
      {analytics?.questions.map(question => <article className="knowledge-form-analysis" key={question.key}><header><strong>{question.label}</strong><span>{question.answered} {kt("knowledge.auto.a52d0a30d24b755e")}{question.skipped} {kt("knowledge.auto.aee2193845838c41")}</span></header>{question.choice_counts.length > 0 && <div>{question.choice_counts.map(choice => <p key={choice.value}><span>{choice.label}</span><b>{choice.count}</b><i style={{ width: `${analytics.total_submissions ? Math.round(choice.count / analytics.total_submissions * 100) : 0}%` }} /></p>)}</div>}{question.number_average !== undefined && <p className="knowledge-form-number-summary">{kt("knowledge.auto.a49ffd73bc85333d")}{question.number_average.toFixed(2)} {kt("knowledge.auto.3071b72a973c87f5")}{question.number_min} {kt("knowledge.auto.f484a4481ce4c068")}{question.number_max}</p>}</article>)}
      <div className="knowledge-form-response-list"><h4>{kt("knowledge.auto.099acf1280bd33a8")}</h4>{responses.map(response => <details key={response.id}><summary><span>{response.submitted_by_user_id}</span><time>{formatKnowledgeDate(response.submitted_at)}</time><em>{kt("knowledge.auto.5f76b2bf82dd2c5d")}{response.published_version}</em></summary><dl>{Object.entries(response.answers).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{typeof value === "string" ? value : JSON.stringify(value)}</dd></div>)}</dl></details>)}{!loadingResponses && responses.length === 0 && <p>{kt("knowledge.auto.f1e848dfd87f1c55")}</p>}{!responsesComplete && <button type="button" disabled={loadingResponses} onClick={() => void loadResponses(false)}>{loadingResponses ? kt("knowledge.auto.f13f72cb6086ba53") : kt("knowledge.auto.af90a08fec8ee28d")}</button>}</div>
    </section>}
    {(schemaError || operationError) && <p className="knowledge-form-error" role="alert">{schemaError || operationError}</p>}
  </div>;
}
